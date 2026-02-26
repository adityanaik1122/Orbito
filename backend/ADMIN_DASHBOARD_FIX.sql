-- ============================================
-- Admin Dashboard Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create user_registrations view (for recent users)
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

-- 2. Create get_daily_stats function
CREATE OR REPLACE FUNCTION get_daily_stats(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT,
  new_users BIGINT,
  itineraries_created BIGINT,
  bookings_made BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.date::DATE,
    0::BIGINT as page_views,
    0::BIGINT as unique_visitors,
    COALESCE(u.new_users, 0)::BIGINT as new_users,
    COALESCE(i.itineraries, 0)::BIGINT as itineraries_created,
    COALESCE(b.bookings, 0)::BIGINT as bookings_made,
    COALESCE(b.revenue, 0)::NUMERIC as revenue
  FROM generate_series(start_date, end_date, '1 day'::interval) d(date)
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as new_users
    FROM auth.users
    GROUP BY DATE(created_at)
  ) u ON d.date::DATE = u.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as itineraries
    FROM itineraries
    GROUP BY DATE(created_at)
  ) i ON d.date::DATE = i.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as bookings, SUM(total_amount) as revenue
    FROM bookings
    WHERE booking_status = 'confirmed'
    GROUP BY DATE(created_at)
  ) b ON d.date::DATE = b.date
  ORDER BY d.date DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. Create dashboard_summary view
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE) as users_today,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as users_this_week,
  (SELECT COUNT(*) FROM itineraries) as total_itineraries,
  (SELECT COUNT(*) FROM itineraries WHERE DATE(created_at) = CURRENT_DATE) as itineraries_today,
  COALESCE((SELECT COUNT(*) FROM bookings), 0) as total_bookings,
  COALESCE((SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE), 0) as bookings_today,
  COALESCE((SELECT COUNT(*) FROM bookings WHERE booking_status = 'confirmed'), 0) as confirmed_bookings,
  COALESCE((SELECT SUM(total_amount) FROM bookings WHERE booking_status = 'confirmed'), 0) as total_revenue,
  COALESCE((SELECT SUM(total_amount) FROM bookings WHERE booking_status = 'confirmed' AND created_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as revenue_this_month,
  0 as total_affiliate_clicks,
  0 as affiliate_clicks_today,
  0 as total_conversions,
  0 as total_commission;

-- 4. Test the setup
SELECT * FROM dashboard_summary;

-- If you see results, you're good to go!
-- Expected output: One row with all the stats

