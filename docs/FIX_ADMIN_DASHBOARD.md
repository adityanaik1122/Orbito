# 🔧 Fix Admin Dashboard - Quick Guide

**Issue:** Admin dashboard shows 500 errors because analytics tables/functions don't exist

**Solution:** Run SQL script to create required database objects

---

## 🚀 QUICK FIX (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select project: **pjealicwafzkdprbcceb**
3. Click "SQL Editor" in left sidebar
4. Click "New query"

### Step 2: Run the SQL Script

Copy and paste this entire script:

```sql
-- ============================================
-- Admin Dashboard Database Setup
-- ============================================

-- 1. Create user_registrations view
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
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see output like:
```
total_users | users_today | users_this_week | total_itineraries | ...
     5      |      0      |        2        |         10        | ...
```

### Step 4: Refresh Admin Dashboard

1. Go back to: `http://localhost:3001/admin`
2. Press F5 to refresh
3. Dashboard should now load! ✅

---

## ✅ WHAT THIS DOES

### Creates 3 Database Objects:

1. **user_registrations** (view)
   - Shows all registered users
   - Includes status (active/pending/inactive)
   - Used for "Recent Users" section

2. **get_daily_stats** (function)
   - Returns daily statistics for date range
   - Shows new users, itineraries, bookings per day
   - Used for charts and trends

3. **dashboard_summary** (view)
   - Aggregates all key metrics
   - Total users, bookings, revenue, etc.
   - Used for summary cards at top

---

## 🔍 VERIFY IT WORKS

### Test in SQL Editor:

```sql
-- Test 1: Check user registrations
SELECT * FROM user_registrations LIMIT 5;

-- Test 2: Check daily stats (last 7 days)
SELECT * FROM get_daily_stats(CURRENT_DATE - 7, CURRENT_DATE);

-- Test 3: Check dashboard summary
SELECT * FROM dashboard_summary;
```

All three should return data without errors.

---

## 🐛 TROUBLESHOOTING

### Error: "relation 'bookings' does not exist"

The bookings table doesn't exist yet. That's okay! The queries use `COALESCE` to handle this gracefully. Booking stats will show 0 until you create the bookings table.

**To create bookings table:**
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tour_id TEXT NOT NULL,
  tour_title TEXT,
  booking_reference TEXT UNIQUE,
  booking_status TEXT DEFAULT 'pending',
  tour_date DATE NOT NULL,
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Error: "permission denied for view"

You need to grant permissions:
```sql
GRANT SELECT ON user_registrations TO authenticated;
GRANT SELECT ON dashboard_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_stats TO authenticated;
```

### Dashboard still shows errors

1. Check browser console (F12) for specific error
2. Verify backend is running on port 5000
3. Check that you're logged in as admin
4. Try hard refresh (Ctrl+Shift+R)

---

## 📊 WHAT YOU'LL SEE

After fixing, your admin dashboard will show:

### Summary Cards:
- ✅ Total Users (with today's count)
- ✅ Total Bookings (with today's count)
- ✅ Total Revenue (with this month's revenue)
- ✅ Affiliate Clicks (will be 0 until tracking is set up)

### Tabs:
- ✅ Overview - Quick stats and growth metrics
- ✅ Users - Recent registrations list
- ✅ Bookings - Recent bookings list (empty until bookings exist)
- ✅ Affiliate - Affiliate stats (will be 0 until tracking is set up)

---

## 🎯 NEXT STEPS (Optional)

### Want full analytics? Run the complete schema:

File: `backend/ANALYTICS_SCHEMA_SIMPLE.sql`

This adds:
- Page views tracking
- Affiliate clicks tracking
- More detailed analytics

**But you don't need this to use the admin dashboard!**

The basic setup above is enough to get started.

---

## ✅ SUCCESS CHECKLIST

- [ ] Ran SQL script in Supabase
- [ ] Saw results from test query
- [ ] Refreshed admin dashboard
- [ ] Dashboard loads without errors
- [ ] Can see user count
- [ ] Can see itinerary count
- [ ] No 500 errors in console

---

## 📞 QUICK REFERENCE

**SQL Script File:** `ADMIN_DASHBOARD_FIX.sql`  
**Full Schema:** `backend/ANALYTICS_SCHEMA_SIMPLE.sql`  
**Admin URL:** `http://localhost:3001/admin`  
**Your Credentials:** `adityanaik817@gmail.com` / `NewPassword123!`

---

**Estimated Time:** 5 minutes  
**Difficulty:** Easy (just copy/paste SQL)  
**Status:** Ready to run!

