# Admin Dashboard Setup Guide

## Overview
Your admin dashboard tracks:
- User registrations
- Bookings and revenue
- Affiliate clicks and conversions
- Itinerary creation
- Daily traffic stats

## Step 1: Run Database Migrations

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the file `backend/ANALYTICS_SCHEMA.sql`
4. Copy all the SQL code
5. Paste it into the Supabase SQL Editor
6. Click "Run" to execute

This will create:
- `page_views` table
- `affiliate_clicks` table
- `bookings` table (if not exists)
- Analytics views and functions
- Row-level security policies

## Step 2: Make Yourself an Admin

Run this SQL in Supabase to give yourself admin access:

```sql
-- Replace YOUR_EMAIL with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL@example.com';

-- Or if you know your user ID:
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID';
```

## Step 3: Restart Backend Server

```bash
cd backend
npm start
```

The analytics routes are now available at:
- `GET /api/analytics/dashboard/summary`
- `GET /api/analytics/dashboard/daily-stats`
- `GET /api/analytics/users/registrations`
- `GET /api/analytics/bookings`
- `GET /api/analytics/affiliate/stats`

## Step 4: Access Admin Dashboard

1. Make sure you're logged in
2. Navigate to: `http://localhost:3000/admin`
3. You should see the full analytics dashboard

## Step 5: Test Tracking

### Track Page Views (Optional - Auto-tracking)

Add this to your `App.jsx` or main layout:

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view
    fetch('http://localhost:5000/api/analytics/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pagePath: location.pathname,
        pageTitle: document.title,
        referrer: document.referrer
      })
    });
  }, [location]);
  
  // ... rest of your app
}
```

### Track Affiliate Clicks

Already implemented in `TourDetailPage.jsx`. When user clicks "Book Now":

```javascript
// Track affiliate click
await fetch('http://localhost:5000/api/analytics/track/affiliate-click', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tourId: tour.id,
    tourTitle: tour.title,
    affiliateProvider: 'getyourguide',
    affiliateLink: tour.affiliate_link
  })
});
```

## Dashboard Features

### Overview Tab
- Total users, bookings, revenue
- Affiliate clicks and conversions
- Quick stats and growth metrics
- 30-day activity chart (placeholder)

### Users Tab
- Recent user registrations
- User status (active, pending, inactive)
- Registration timestamps

### Bookings Tab
- Recent bookings
- Booking status
- Revenue per booking
- Customer details

### Affiliate Tab
- Total clicks and conversions
- Conversion rate
- Commission earned
- Breakdown by provider (GetYourGuide, Viator, etc.)

## Partner Dashboard (Coming Soon)

For tour operators, you can create a similar dashboard at `/operator` that shows:
- Their tour performance
- Their bookings only
- Their revenue share
- Customer reviews

Just duplicate the admin dashboard and filter by `operator_id`.

## Troubleshooting

### "Admin access required" error
- Make sure you ran the SQL to set your role to 'admin'
- Check that the `profiles` table has a `role` column
- Run the migration in `backend/DATABASE_MIGRATIONS.sql`

### No data showing
- Make sure you ran `ANALYTICS_SCHEMA.sql`
- Check that tables were created: `page_views`, `affiliate_clicks`, `bookings`
- Verify RLS policies are set up correctly

### Backend errors
- Check that `analyticsRoutes.js` is registered in `backend/src/routes/index.js`
- Verify `requireAdmin` middleware is working
- Check backend console for errors

## Next Steps

1. **Add Charts**: Install `recharts` for beautiful graphs
   ```bash
   cd frontend
   npm install recharts
   ```

2. **Add Real-time Updates**: Use Supabase realtime subscriptions

3. **Add Export**: Implement CSV/PDF export functionality

4. **Add Filters**: Date range filters, search, sorting

5. **Add Notifications**: Email alerts for new bookings

## Security Notes

- Admin dashboard is protected by `requireAdmin` middleware
- Only users with `role = 'admin'` can access
- All analytics data respects Row Level Security (RLS)
- Sensitive data is never exposed to non-admin users

## API Endpoints

All endpoints require authentication and admin role:

```
GET  /api/analytics/dashboard/summary
GET  /api/analytics/dashboard/daily-stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET  /api/analytics/users/registrations?page=1&limit=50
GET  /api/analytics/bookings?page=1&limit=50&status=confirmed
GET  /api/analytics/affiliate/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET  /api/analytics/itineraries/stats

POST /api/analytics/track/page-view
POST /api/analytics/track/affiliate-click
```

## Questions?

If you need help:
1. Check the backend console for errors
2. Check the browser console for errors
3. Verify your admin role in Supabase
4. Make sure all migrations ran successfully
