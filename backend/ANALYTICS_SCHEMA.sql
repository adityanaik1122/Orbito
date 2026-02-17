-- Analytics Schema for Admin Dashboard
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Page Views Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);

-- ============================================
-- 2. Affiliate Clicks Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tour_id TEXT NOT NULL,
  tour_title TEXT,
  affiliate_provider TEXT, -- getyourguide, viator, etc
  affiliate_link TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMPTZ,
  commission_amount DECIMAL(10,2)
);

CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_tour_id ON affiliate_clicks(tour_id);
CREATE INDEX idx_affiliate_clicks_converted ON affiliate_clicks(converted);

-- ============================================
-- 3. User Registrations (already exists in auth.users)
-- Create a view for easier querying
-- ============================================
CREATE OR REPLACE VIEW user_registrations AS
SELECT 
  id,
  email,
  created_at as registered_at,
  last_sign_in_at,
  email_confirmed_at,
  CASE 
    WHEN last_sign_in_at IS NOT NULL THEN 'active'
    WHEN email_confirmed_at IS NULL THEN 'pending_verification'
    ELSE 'inactive'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- 4. Itinerary Stats (already exists)
-- Create a view for dashboard
-- ============================================
CREATE OR REPLACE VIEW itinerary_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_created,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_itineraries,
  COUNT(CASE WHEN share_id IS NOT NULL THEN 1 END) as shared_itineraries
FROM itineraries
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- 5. Booking Stats (if you have bookings table)
-- ============================================
-- Check if bookings table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        CREATE TABLE bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          tour_id TEXT NOT NULL,
          tour_title TEXT,
          booking_reference TEXT UNIQUE,
          booking_status TEXT DEFAULT 'pending',
          tour_date DATE NOT NULL,
          num_adults INTEGER DEFAULT 1,
          num_children INTEGER DEFAULT 0,
          total_amount DECIMAL(10,2) NOT NULL,
          currency TEXT DEFAULT 'GBP',
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT,
          special_requirements TEXT,
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT,
          external_booking_id TEXT,
          cancellation_reason TEXT,
          cancelled_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX idx_bookings_user_id ON bookings(user_id);
        CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
        CREATE INDEX idx_bookings_status ON bookings(booking_status);
        CREATE INDEX idx_bookings_tour_date ON bookings(tour_date);
    ELSE
        -- Table exists, add missing columns if needed
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_status') THEN
            ALTER TABLE bookings ADD COLUMN booking_status TEXT DEFAULT 'pending';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'tour_title') THEN
            ALTER TABLE bookings ADD COLUMN tour_title TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
            ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancellation_reason') THEN
            ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancelled_at') THEN
            ALTER TABLE bookings ADD COLUMN cancelled_at TIMESTAMPTZ;
        END IF;
    END IF;
END $$;

-- ============================================
-- 6. Dashboard Summary View
-- ============================================
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE) as users_today,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as users_this_week,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as users_this_month,
  (SELECT COUNT(*) FROM itineraries) as total_itineraries,
  (SELECT COUNT(*) FROM itineraries WHERE DATE(created_at) = CURRENT_DATE) as itineraries_today,
  (SELECT COUNT(*) FROM bookings WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings')) as total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings')) as bookings_today,
  (SELECT COUNT(*) FROM bookings WHERE booking_status = 'confirmed' AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_status')) as confirmed_bookings,
  (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE booking_status = 'confirmed' AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_status')) as total_revenue,
  (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE booking_status = 'confirmed' AND created_at >= CURRENT_DATE - INTERVAL '30 days' AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_status')) as revenue_this_month,
  (SELECT COUNT(*) FROM affiliate_clicks) as total_affiliate_clicks,
  (SELECT COUNT(*) FROM affiliate_clicks WHERE DATE(clicked_at) = CURRENT_DATE) as affiliate_clicks_today,
  (SELECT COUNT(*) FROM affiliate_clicks WHERE converted = true) as total_conversions,
  (SELECT COALESCE(SUM(commission_amount), 0) FROM affiliate_clicks WHERE converted = true) as total_commission;

-- ============================================
-- 7. Enable Row Level Security
-- ============================================
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin can see everything
CREATE POLICY "Admins can view all page_views"
  ON page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all affiliate_clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 8. Functions for Analytics
-- ============================================

-- Get daily stats for date range
CREATE OR REPLACE FUNCTION get_daily_stats(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT,
  new_users BIGINT,
  itineraries_created BIGINT,
  bookings_made BIGINT,
  revenue NUMERIC
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    d.date,
    COALESCE(pv.views, 0) as page_views,
    COALESCE(pv.unique_visitors, 0) as unique_visitors,
    COALESCE(u.new_users, 0) as new_users,
    COALESCE(i.itineraries, 0) as itineraries_created,
    COALESCE(b.bookings, 0) as bookings_made,
    COALESCE(b.revenue, 0) as revenue
  FROM generate_series(start_date, end_date, '1 day'::interval) d(date)
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as views, COUNT(DISTINCT user_id) as unique_visitors
    FROM page_views
    GROUP BY DATE(created_at)
  ) pv ON d.date = pv.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as new_users
    FROM auth.users
    GROUP BY DATE(created_at)
  ) u ON d.date = u.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as itineraries
    FROM itineraries
    GROUP BY DATE(created_at)
  ) i ON d.date = i.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as bookings, SUM(total_amount) as revenue
    FROM bookings
    WHERE booking_status = 'confirmed'
    GROUP BY DATE(created_at)
  ) b ON d.date = b.date
  ORDER BY d.date DESC;
END;
$ LANGUAGE plpgsql;

-- ============================================
-- 9. Verify Setup
-- ============================================
-- Run these to check if everything is created:
-- SELECT * FROM dashboard_summary;
-- SELECT * FROM get_daily_stats(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);
