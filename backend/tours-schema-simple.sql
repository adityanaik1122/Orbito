-- Simplified Tours Schema (No RLS for now)
-- This avoids the "destination does not exist" error

-- 1. TOUR PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS tour_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TOURS TABLE
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES tour_providers(id),
  external_id TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  highlights TEXT[],
  destination TEXT NOT NULL,
  city TEXT,
  country TEXT,
  duration TEXT,
  duration_hours DECIMAL(4,2),
  category TEXT,
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  price_includes TEXT[],
  price_excludes TEXT[],
  main_image TEXT,
  images JSONB,
  is_available BOOLEAN DEFAULT true,
  instant_confirmation BOOLEAN DEFAULT false,
  cancellation_policy TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tour_id UUID NOT NULL REFERENCES tours(id),
  booking_reference TEXT UNIQUE NOT NULL,
  tour_date DATE NOT NULL,
  num_adults INTEGER NOT NULL DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  payment_status TEXT DEFAULT 'pending',
  booking_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  provider_id UUID NOT NULL REFERENCES tour_providers(id),
  booking_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_country ON tours(country);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);

-- Seed Premium Tours as first provider
INSERT INTO tour_providers (name, website, commission_rate, is_active)
VALUES ('Premium Tours UK', 'https://www.premiumtours.co.uk', 12.50, true)
ON CONFLICT DO NOTHING;
