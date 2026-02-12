-- Tours Schema for Premium Tours Integration
-- Run this in Supabase SQL Editor after schema.sql

-- =====================================================
-- 1. TOUR PROVIDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tour_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  api_endpoint TEXT,
  api_key_encrypted TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00, -- e.g., 10.50 for 10.5%
  is_active BOOLEAN DEFAULT true,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TOURS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES tour_providers(id) ON DELETE CASCADE,
  
  -- Tour Basic Info
  external_id TEXT, -- ID from Premium Tours API
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  highlights TEXT[], -- Array of key highlights
  
  -- Location
  destination TEXT NOT NULL,
  city TEXT,
  country TEXT,
  meeting_point TEXT,
  coordinates JSONB, -- {lat, lng}
  
  -- Tour Details
  duration TEXT, -- e.g., "4 hours", "Full day"
  duration_hours DECIMAL(4,2), -- For filtering
  category TEXT, -- e.g., "City Tour", "Adventure", "Cultural"
  subcategory TEXT,
  max_group_size INTEGER,
  min_participants INTEGER DEFAULT 1,
  
  -- Pricing
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2),
  price_infant DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  price_includes TEXT[], -- What's included
  price_excludes TEXT[], -- What's excluded
  
  -- Media
  images JSONB, -- Array of image URLs
  main_image TEXT,
  video_url TEXT,
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  available_days TEXT[], -- ['Monday', 'Tuesday', ...]
  start_times TEXT[], -- ['09:00', '14:00', ...]
  blackout_dates DATE[],
  
  -- Booking Requirements
  instant_confirmation BOOLEAN DEFAULT false,
  cancellation_policy TEXT,
  requires_id BOOLEAN DEFAULT false,
  
  -- SEO & Display
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ, -- Last API sync
  
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE RESTRICT,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL,
  
  -- Booking Reference
  booking_reference TEXT UNIQUE NOT NULL, -- Our internal reference
  external_booking_id TEXT, -- Premium Tours booking ID
  
  -- Booking Details
  tour_date DATE NOT NULL,
  tour_time TEXT,
  
  -- Participants
  num_adults INTEGER NOT NULL DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  num_infants INTEGER DEFAULT 0,
  
  -- Contact Details
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Pricing
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  
  -- Payment
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded, failed
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  stripe_payment_id TEXT,
  
  -- Booking Status
  booking_status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  confirmation_code TEXT,
  
  -- Special Requests
  special_requirements TEXT,
  accessibility_needs TEXT,
  dietary_requirements TEXT,
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  refund_amount DECIMAL(10,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_participants CHECK (num_adults + num_children > 0),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  CONSTRAINT valid_booking_status CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- =====================================================
-- 4. COMMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES tour_providers(id),
  
  -- Commission Details
  booking_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  
  -- Payment Status
  status TEXT DEFAULT 'pending', -- pending, paid, disputed
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_commission_status CHECK (status IN ('pending', 'paid', 'disputed'))
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_price ON tours(price_adult);
CREATE INDEX IF NOT EXISTS idx_tours_rating ON tours(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

CREATE INDEX IF NOT EXISTS idx_commissions_booking_id ON commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Tours are public (everyone can view)
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tours"
  ON tours FOR SELECT
  USING (is_available = true);

-- Tour Providers (admin only)
ALTER TABLE tour_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage providers"
  ON tour_providers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Bookings (users can only see their own)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Commissions (admin only)
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view commissions"
  ON commissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_providers_updated_at
  BEFORE UPDATE ON tour_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create commission entry when booking is confirmed
CREATE OR REPLACE FUNCTION create_commission_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  provider_commission_rate DECIMAL(5,2);
  provider_id_var UUID;
BEGIN
  -- Only create commission when booking is confirmed and payment is successful
  IF NEW.booking_status = 'confirmed' AND NEW.payment_status = 'paid' 
     AND OLD.booking_status != 'confirmed' THEN
    
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

CREATE TRIGGER booking_commission_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_commission_on_booking();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    ref := 'ORB-' || UPPER(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_reference = ref) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (Premium Tours as first provider)
-- =====================================================
INSERT INTO tour_providers (name, website, commission_rate, contact_email, is_active)
VALUES (
  'Premium Tours UK',
  'https://www.premiumtours.co.uk',
  12.50, -- 12.5% commission
  'partnerships@premiumtours.co.uk',
  true
)
ON CONFLICT DO NOTHING;
