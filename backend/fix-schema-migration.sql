-- =====================================================
-- ORBITO SCHEMA FIX MIGRATION
-- Run in Supabase SQL Editor — safe to run multiple
-- times (all operations are idempotent).
-- =====================================================

-- =====================================================
-- 1. TOURS — add missing columns
-- =====================================================
DO $$ BEGIN

  -- Slug (URL-safe identifier)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='slug') THEN
    ALTER TABLE tours ADD COLUMN slug TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
  END IF;

  -- Location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='destination') THEN
    ALTER TABLE tours ADD COLUMN destination TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='city') THEN
    ALTER TABLE tours ADD COLUMN city TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='country') THEN
    ALTER TABLE tours ADD COLUMN country TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='meeting_point') THEN
    ALTER TABLE tours ADD COLUMN meeting_point TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='coordinates') THEN
    ALTER TABLE tours ADD COLUMN coordinates JSONB;
  END IF;

  -- Tour details
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='highlights') THEN
    ALTER TABLE tours ADD COLUMN highlights TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='duration') THEN
    ALTER TABLE tours ADD COLUMN duration TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='duration_hours') THEN
    ALTER TABLE tours ADD COLUMN duration_hours DECIMAL(4,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='category') THEN
    ALTER TABLE tours ADD COLUMN category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='subcategory') THEN
    ALTER TABLE tours ADD COLUMN subcategory TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='max_group_size') THEN
    ALTER TABLE tours ADD COLUMN max_group_size INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='min_participants') THEN
    ALTER TABLE tours ADD COLUMN min_participants INTEGER DEFAULT 1;
  END IF;

  -- Pricing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_adult') THEN
    ALTER TABLE tours ADD COLUMN price_adult DECIMAL(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_child') THEN
    ALTER TABLE tours ADD COLUMN price_child DECIMAL(10,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_infant') THEN
    ALTER TABLE tours ADD COLUMN price_infant DECIMAL(10,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='currency') THEN
    ALTER TABLE tours ADD COLUMN currency TEXT DEFAULT 'GBP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_includes') THEN
    ALTER TABLE tours ADD COLUMN price_includes TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_excludes') THEN
    ALTER TABLE tours ADD COLUMN price_excludes TEXT[];
  END IF;

  -- Media
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='main_image') THEN
    ALTER TABLE tours ADD COLUMN main_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='images') THEN
    ALTER TABLE tours ADD COLUMN images JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='video_url') THEN
    ALTER TABLE tours ADD COLUMN video_url TEXT;
  END IF;

  -- Availability
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='is_available') THEN
    ALTER TABLE tours ADD COLUMN is_available BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='available_days') THEN
    ALTER TABLE tours ADD COLUMN available_days TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='start_times') THEN
    ALTER TABLE tours ADD COLUMN start_times TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='blackout_dates') THEN
    ALTER TABLE tours ADD COLUMN blackout_dates DATE[];
  END IF;

  -- Booking requirements
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='instant_confirmation') THEN
    ALTER TABLE tours ADD COLUMN instant_confirmation BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='cancellation_policy') THEN
    ALTER TABLE tours ADD COLUMN cancellation_policy TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='requires_id') THEN
    ALTER TABLE tours ADD COLUMN requires_id BOOLEAN DEFAULT false;
  END IF;

  -- SEO & display
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='rating') THEN
    ALTER TABLE tours ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='review_count') THEN
    ALTER TABLE tours ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='featured') THEN
    ALTER TABLE tours ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='views_count') THEN
    ALTER TABLE tours ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='is_active') THEN
    ALTER TABLE tours ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- External source
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='external_id') THEN
    ALTER TABLE tours ADD COLUMN external_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='last_synced_at') THEN
    ALTER TABLE tours ADD COLUMN last_synced_at TIMESTAMPTZ;
  END IF;

  -- Operator marketplace (may already exist from operator-marketplace-migration.sql)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='operator_id') THEN
    ALTER TABLE tours ADD COLUMN operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='listing_status') THEN
    ALTER TABLE tours ADD COLUMN listing_status TEXT DEFAULT 'live'
      CHECK (listing_status IN ('draft','pending_review','live','rejected'));
  END IF;

END $$;

-- =====================================================
-- 2. BOOKINGS — rename status → booking_status if needed,
--    then add any missing columns
-- =====================================================
DO $$ BEGIN

  -- If the column is called 'status' (old schema), rename it
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='status')
  AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='booking_status') THEN
    ALTER TABLE bookings RENAME COLUMN status TO booking_status;
  END IF;

  -- booking_status (create if still missing)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='booking_status') THEN
    ALTER TABLE bookings ADD COLUMN booking_status TEXT DEFAULT 'pending'
      CHECK (booking_status IN ('pending','confirmed','cancelled','completed'));
  END IF;

  -- booking_reference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='booking_reference') THEN
    ALTER TABLE bookings ADD COLUMN booking_reference TEXT;
  END IF;

  -- external_booking_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='external_booking_id') THEN
    ALTER TABLE bookings ADD COLUMN external_booking_id TEXT;
  END IF;

  -- tour_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tour_date') THEN
    ALTER TABLE bookings ADD COLUMN tour_date DATE;
  END IF;

  -- tour_time
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='tour_time') THEN
    ALTER TABLE bookings ADD COLUMN tour_time TEXT;
  END IF;

  -- Participant counts
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='num_adults') THEN
    ALTER TABLE bookings ADD COLUMN num_adults INTEGER NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='num_children') THEN
    ALTER TABLE bookings ADD COLUMN num_children INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='num_infants') THEN
    ALTER TABLE bookings ADD COLUMN num_infants INTEGER DEFAULT 0;
  END IF;

  -- Customer contact
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_name') THEN
    ALTER TABLE bookings ADD COLUMN customer_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_email') THEN
    ALTER TABLE bookings ADD COLUMN customer_email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_phone') THEN
    ALTER TABLE bookings ADD COLUMN customer_phone TEXT;
  END IF;

  -- Pricing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='total_amount') THEN
    ALTER TABLE bookings ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='currency') THEN
    ALTER TABLE bookings ADD COLUMN currency TEXT DEFAULT 'GBP';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='commission_amount') THEN
    ALTER TABLE bookings ADD COLUMN commission_amount DECIMAL(10,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='commission_rate') THEN
    ALTER TABLE bookings ADD COLUMN commission_rate DECIMAL(5,2);
  END IF;

  -- Payment
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN
    ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending'
      CHECK (payment_status IN ('pending','paid','refunded','failed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_method') THEN
    ALTER TABLE bookings ADD COLUMN payment_method TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_date') THEN
    ALTER TABLE bookings ADD COLUMN payment_date TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='stripe_payment_id') THEN
    ALTER TABLE bookings ADD COLUMN stripe_payment_id TEXT;
  END IF;

  -- Confirmation & special requests
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='confirmation_code') THEN
    ALTER TABLE bookings ADD COLUMN confirmation_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='special_requirements') THEN
    ALTER TABLE bookings ADD COLUMN special_requirements TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='accessibility_needs') THEN
    ALTER TABLE bookings ADD COLUMN accessibility_needs TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='dietary_requirements') THEN
    ALTER TABLE bookings ADD COLUMN dietary_requirements TEXT;
  END IF;

  -- Cancellation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='cancelled_at') THEN
    ALTER TABLE bookings ADD COLUMN cancelled_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='cancellation_reason') THEN
    ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='refund_amount') THEN
    ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10,2);
  END IF;

  -- updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='updated_at') THEN
    ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

END $$;

-- =====================================================
-- 3. BLOG POSTS — add read_time and category index
-- =====================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='read_time') THEN
    ALTER TABLE blog_posts ADD COLUMN read_time INTEGER; -- minutes
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='category') THEN
    ALTER TABLE blog_posts ADD COLUMN category TEXT DEFAULT 'Travel';
  END IF;
END $$;

-- =====================================================
-- 4. FIX bare ARRAY → typed arrays
--    Untyped ARRAY columns cannot be reliably queried.
--    These exist in tours and operator_applications.
-- =====================================================
DO $$ BEGIN

  -- tours: text arrays
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='highlights' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE tours ALTER COLUMN highlights TYPE text[] USING highlights::text[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_includes' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE tours ALTER COLUMN price_includes TYPE text[] USING price_includes::text[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='price_excludes' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE tours ALTER COLUMN price_excludes TYPE text[] USING price_excludes::text[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='available_days' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE tours ALTER COLUMN available_days TYPE text[] USING available_days::text[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='start_times' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE tours ALTER COLUMN start_times TYPE text[] USING start_times::text[];
  END IF;

  -- tours: date array (blackout dates are dates, not text)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='blackout_dates' AND udt_name != '_date') THEN
    ALTER TABLE tours ALTER COLUMN blackout_dates TYPE date[] USING blackout_dates::date[];
  END IF;

  -- operator_applications: text arrays
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='operator_applications' AND column_name='tour_types' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE operator_applications ALTER COLUMN tour_types TYPE text[] USING tour_types::text[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='operator_applications' AND column_name='operating_locations' AND (udt_name != '_text' OR data_type != 'ARRAY')) THEN
    ALTER TABLE operator_applications ALTER COLUMN operating_locations TYPE text[] USING operating_locations::text[];
  END IF;

END $$;

-- =====================================================
-- 5. FIX character(1) COLUMNS → text
--    PostgreSQL `character` without length = character(1).
--    Any value longer than 1 char is silently truncated.
-- =====================================================

-- tours.country_code
ALTER TABLE tours ALTER COLUMN country_code TYPE text;

-- itineraries.destination_country
ALTER TABLE itineraries ALTER COLUMN destination_country TYPE text;

-- profiles.country_code
ALTER TABLE profiles ALTER COLUMN country_code TYPE text;

-- suppliers.country_code
ALTER TABLE suppliers ALTER COLUMN country_code TYPE text;

-- =====================================================
-- 6. AUTO-GENERATE booking_reference (safe re-run)
-- =====================================================

-- Generate booking reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  ref_exists BOOLEAN;
BEGIN
  LOOP
    ref := 'ORB-' || UPPER(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_reference = ref) INTO ref_exists;
    EXIT WHEN NOT ref_exists;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

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

-- Backfill any existing bookings that are missing a booking_reference
UPDATE bookings
SET booking_reference = generate_booking_reference()
WHERE booking_reference IS NULL;

-- =====================================================
-- 7. OPERATOR EARNINGS VIEW (recreate with correct column)
-- =====================================================
DROP VIEW IF EXISTS operator_earnings;
CREATE VIEW operator_earnings AS
SELECT
  t.operator_id,
  b.id                              AS booking_id,
  b.booking_reference,
  b.total_amount,
  b.currency,
  b.booking_status,
  b.payment_status,
  b.created_at,
  ROUND(b.total_amount * 0.85, 2)  AS operator_payout,
  ROUND(b.total_amount * 0.15, 2)  AS platform_fee,
  t.id                              AS tour_id,
  t.title                           AS tour_title
FROM bookings b
JOIN tours t ON b.tour_id = t.id
WHERE t.operator_id IS NOT NULL
  AND b.booking_status IN ('confirmed','completed')
  AND b.payment_status = 'paid';

-- =====================================================
-- 8. INDEXES (all idempotent)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tours_destination      ON tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_category         ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_price            ON tours(price_adult);
CREATE INDEX IF NOT EXISTS idx_tours_rating           ON tours(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tours_featured         ON tours(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tours_operator_id      ON tours(operator_id);
CREATE INDEX IF NOT EXISTS idx_tours_listing_status   ON tours(listing_status);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id       ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id       ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date          ON bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status        ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference     ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_payment       ON bookings(payment_status);

CREATE INDEX IF NOT EXISTS idx_reviews_tour_id        ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id        ON reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published   ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category    ON blog_posts(category);

CREATE INDEX IF NOT EXISTS idx_operator_apps_user     ON operator_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_operator_apps_status   ON operator_applications(status);

-- =====================================================
-- Done. Verify with:
--   SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'tours' ORDER BY column_name;
-- =====================================================
