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
