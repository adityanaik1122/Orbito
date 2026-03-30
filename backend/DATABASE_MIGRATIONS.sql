-- Database Migrations for Orbito
-- Run these in Supabase SQL Editor if needed

-- ============================================
-- 1. Add 'role' column to profiles table
-- ============================================
-- This allows role-based access control (customer, operator, admin)

-- Check if column exists first, then add if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'operator', 'admin'));
        
        COMMENT ON COLUMN profiles.role IS 'User role: customer (default), operator (tour provider), admin (platform admin)';
    END IF;
END $$;

-- ============================================
-- 2. Update existing users to have default role
-- ============================================
UPDATE profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- ============================================
-- 3. Create index for faster role queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- 4. RLS Policies for profiles table
-- ============================================
-- Allow users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow users to insert their own profile (on signup)
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- 5. Add 'activities' column to itineraries table
-- ============================================
-- This stores flattened activities for easier querying

DO $ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'itineraries' 
        AND column_name = 'activities'
    ) THEN
        ALTER TABLE itineraries 
        ADD COLUMN activities JSONB NOT NULL DEFAULT '[]'::jsonb;
        
        COMMENT ON COLUMN itineraries.activities IS 'Flattened array of all activities across all days';
    END IF;
END $;

-- ============================================
-- 6. Verify the changes
-- ============================================
-- Run this to check if role column exists:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name = 'role';

-- Run this to check if activities column exists:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'itineraries' AND column_name = 'activities';

-- Run this to see all profiles with roles:
-- SELECT id, email, role, created_at FROM profiles LIMIT 10;

-- ============================================
-- 7. Update admin RLS policies to use profiles.role
-- ============================================
-- If you previously used raw_user_meta_data->>'role', replace with profiles.role
DO $$ 
BEGIN
  -- tour_providers policy
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'tour_providers'
    AND policyname = 'Admins can manage providers'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage providers" ON tour_providers';
  END IF;

  EXECUTE '
    CREATE POLICY "Admins can manage providers"
    ON tour_providers FOR ALL
    USING (
      EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';

  -- commissions policies
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'commissions'
    AND policyname = 'Admins can view commissions'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view commissions" ON commissions';
  END IF;

  EXECUTE '
    CREATE POLICY "Admins can view commissions"
    ON commissions FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'commissions'
    AND policyname = 'Admins can manage commissions'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage commissions" ON commissions';
  END IF;

  EXECUTE '
    CREATE POLICY "Admins can manage commissions"
    ON commissions FOR ALL
    USING (
      EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';
END $$;

-- ============================================
-- 8. Ensure booking_reference is auto-generated
-- ============================================
-- Requires generate_booking_reference() from tours-schema.sql
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_reference_trigger ON bookings;
CREATE TRIGGER bookings_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- ============================================
-- 9. Prevent duplicate commissions on booking updates
-- ============================================
CREATE OR REPLACE FUNCTION create_commission_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  provider_commission_rate DECIMAL(5,2);
  provider_id_var UUID;
  commission_exists BOOLEAN;
BEGIN
  -- Only create commission when booking is confirmed and payment is successful
  IF NEW.booking_status = 'confirmed' AND NEW.payment_status = 'paid' 
     AND OLD.booking_status != 'confirmed' THEN
    -- Avoid duplicates
    SELECT EXISTS(
      SELECT 1 FROM commissions WHERE booking_id = NEW.id
    ) INTO commission_exists;

    IF commission_exists THEN
      RETURN NEW;
    END IF;
    
    -- Get provider info from tour
    SELECT t.provider_id, tp.commission_rate
    INTO provider_id_var, provider_commission_rate
    FROM tours t
    JOIN tour_providers tp ON t.provider_id = tp.id
    WHERE t.id = NEW.tour_id;
    
    -- Create commission record
    INSERT INTO commissions (
      booking_id,
      provider_id,
      booking_amount,
      commission_rate,
      commission_amount,
      currency
    ) VALUES (
      NEW.id,
      provider_id_var,
      NEW.total_amount,
      COALESCE(NEW.commission_rate, provider_commission_rate),
      COALESCE(NEW.commission_amount, (NEW.total_amount * provider_commission_rate / 100)),
      NEW.currency
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_commission_trigger ON bookings;
CREATE TRIGGER booking_commission_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_commission_on_booking();

-- ============================================
-- 10. Locale & currency preferences on profiles
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'locale'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN locale TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN currency TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'country'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN country TEXT;
    END IF;
END $$;
