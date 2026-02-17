-- Simple Analytics Schema - Run this instead
-- This version handles existing tables gracefully

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
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);

-- ============================================
-- 2. Affiliate Clicks Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tour_id TEXT NOT NULL,
  tour_title TEXT,
  affiliate_provider TEXT,
  affiliate_link TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMPTZ,
  commission_amount DECIMAL(10,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_tour_id ON affiliate_clicks(tour_id);

-- ============================================
-- 3. Add missing columns to existing bookings table
-- ============================================
DO $$ 
BEGIN
    -- Add booking_status if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'booking_status') THEN
        ALTER TABLE bookings ADD COLUMN booking_status TEXT DEFAULT 'pending';
    END IF;
    
    -- Add tour_title if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'tour_title') THEN
        ALTER TABLE bookings ADD COLUMN tour_title TEXT;
    END IF;
END $$;

-- ============================================
-- 4. Simple Dashboard Summary View
-- ============================================
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE) as users_today,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as users_this_week,
  (SELECT COUNT(*) FROM itineraries) as total_itineraries,
  (SELECT COUNT(*) FROM itineraries WHERE DATE(created_at) = CURRENT_DATE) as itineraries_today,
  COALESCE((SELECT COUNT(*) FROM bookings), 0) as total_bookings,
  COALESCE((SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE), 0) as bookings_today,
  0 as confirmed_bookings,
  0 as total_revenue,
  0 as revenue_this_month,
  (SELECT COUNT(*) FROM affiliate_clicks) as total_affiliate_clicks,
  (SELECT COUNT(*) FROM affiliate_clicks WHERE DATE(clicked_at) = CURRENT_DATE) as affiliate_clicks_today,
  (SELECT COUNT(*) FROM affiliate_clicks WHERE converted = true) as total_conversions,
  COALESCE((SELECT SUM(commission_amount) FROM affiliate_clicks WHERE converted = true), 0) as total_commission;

-- ============================================
-- 5. Enable Row Level Security
-- ============================================
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all page_views" ON page_views;
DROP POLICY IF EXISTS "Admins can view all affiliate_clicks" ON affiliate_clicks;

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

-- ============================================
-- 6. Test the setup
-- ============================================
-- Run this to verify everything works:
-- SELECT * FROM dashboard_summary;

-- If you see results, you're good to go!
