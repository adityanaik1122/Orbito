# Commission Dashboard

## Overview
The Commission Dashboard provides a comprehensive view of affiliate earnings, tracking clicks, conversions, and commission payments from tour bookings.

## Features

### 1. Summary Statistics
- **Total Commission**: All-time commission earnings
- **Pending Commission**: Awaiting confirmation from providers
- **Paid Commission**: Successfully paid out
- **Total Revenue**: Total booking value generated

### 2. Provider Breakdown
View performance metrics by provider:
- GetYourGuide
- Viator
- Premium Tours

### 3. Recent Conversions
Track all bookings with:
- Booking date
- Provider
- Booking reference
- Booking amount
- Commission earned
- Status (pending, confirmed, paid, cancelled)

### 4. Tour Performance
Analyze which tours perform best:
- Total clicks
- Total conversions
- Conversion rate
- Commission earned per tour

## Access

**URL**: `/admin/commissions`

**Required Role**: Admin

## How It Works

### Affiliate Tracking Flow

1. **Generate Affiliate Link**
   ```javascript
   POST /api/affiliate/generate-link
   {
     "provider": "getyourguide",
     "tourId": "123",
     "tourTitle": "London Eye",
     "destination": "London",
     "baseUrl": "https://getyourguide.com/tour/123"
   }
   ```

2. **Track Click**
   - User clicks affiliate link
   - System records click with tracking code
   - User redirected to provider site

3. **Record Conversion**
   ```javascript
   POST /api/affiliate/conversion
   {
     "trackingCode": "GYG-123-1234567890-abc123",
     "provider": "getyourguide",
     "tourId": "123",
     "bookingAmount": 150.00,
     "bookingReference": "GYG-BOOK-456"
   }
   ```

4. **Update Status**
   - Pending → Confirmed (provider confirms booking)
   - Confirmed → Paid (commission paid out)

## Commission Rates

Default commission rates (configurable in backend):
- **GetYourGuide**: 8%
- **Viator**: 8%
- **Premium Tours**: 15%

## Database Schema

### Tables

1. **affiliate_links**
   - Stores generated affiliate links
   - Unique tracking codes

2. **affiliate_clicks**
   - Records every click on affiliate links
   - Tracks user, session, IP, user agent

3. **affiliate_conversions**
   - Records bookings from affiliate links
   - Calculates commission amounts
   - Tracks payment status

4. **commission_payments**
   - Tracks bulk commission payments
   - Payment periods and references

### Views

1. **commission_dashboard**
   - Aggregated stats by provider and month
   - Total conversions, revenue, commission

2. **affiliate_performance**
   - Click-through rates by tour
   - Conversion rates
   - Total commission per tour

## API Endpoints

### Public Endpoints

```
GET /api/affiliate/track/:trackingCode
```
Tracks click and redirects to affiliate URL

### Protected Endpoints (Require Auth)

```
POST /api/affiliate/generate-link
POST /api/affiliate/conversion
```

### Admin Endpoints (Require Admin Role)

```
GET /api/affiliate/stats
GET /api/affiliate/dashboard
GET /api/affiliate/performance
GET /api/affiliate/conversions
PUT /api/affiliate/conversion/:id/status
```

## Usage Examples

### Generate Affiliate Link

```javascript
const response = await fetch('/api/affiliate/generate-link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    provider: 'getyourguide',
    tourId: '123',
    tourTitle: 'London Eye Fast Track',
    destination: 'London',
    baseUrl: 'https://www.getyourguide.com/london-l57/london-eye-t123/'
  })
});

const { trackingCode, affiliateUrl, shortUrl } = await response.json();
// Use shortUrl in your app: /track/GYG-123-1234567890-abc123
```

### Track Conversion

```javascript
await fetch('/api/affiliate/conversion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    trackingCode: 'GYG-123-1234567890-abc123',
    provider: 'getyourguide',
    tourId: '123',
    bookingAmount: 150.00,
    bookingReference: 'GYG-BOOK-456',
    bookingDate: '2026-02-18',
    travelDate: '2026-03-15'
  })
});
```

### Fetch Dashboard Data

```javascript
const stats = await fetch('/api/affiliate/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

console.log(stats);
// {
//   totalCommission: 1250.50,
//   pendingCommission: 450.00,
//   paidCommission: 800.50,
//   totalRevenue: 15000.00,
//   byProvider: {
//     getyourguide: { conversions: 10, revenue: 8000, commission: 640 },
//     viator: { conversions: 5, revenue: 7000, commission: 560 }
//   }
// }
```

## Filters

### Provider Filter
- All Providers
- GetYourGuide
- Viator
- Premium Tours

### Date Range Filter
- Last 7 days
- Last 30 days
- Last 90 days
- Last year

## Export Functionality

Export commission reports as CSV:
- All conversions
- Filtered by provider
- Filtered by date range
- Includes all relevant fields

## Setup Instructions

### 1. Run Database Migration

```sql
-- Run the SQL in backend/AFFILIATE_TRACKING_SCHEMA.sql
psql -h your-db-host -U your-user -d your-database -f backend/AFFILIATE_TRACKING_SCHEMA.sql
```

Or in Supabase SQL Editor:
1. Go to SQL Editor
2. Paste contents of `AFFILIATE_TRACKING_SCHEMA.sql`
3. Click Run

### 2. Configure Affiliate IDs

Add to `backend/.env`:
```
GYG_AFFILIATE_ID=your_getyourguide_partner_id
VIATOR_AFFILIATE_ID=your_viator_affiliate_id
```

### 3. Update Commission Rates

Edit `backend/src/services/affiliateTrackingService.js`:
```javascript
static COMMISSION_RATES = {
  getyourguide: 8.0,  // Your actual rate
  viator: 8.0,        // Your actual rate
  premiumtours: 15.0  // Your actual rate
};
```

### 4. Access Dashboard

1. Login as admin user
2. Navigate to `/admin/commissions`
3. View your commission data

## Testing

### Test Affiliate Flow

1. **Generate Link**
   ```bash
   curl -X POST http://localhost:5000/api/affiliate/generate-link \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "provider": "getyourguide",
       "tourId": "test-123",
       "tourTitle": "Test Tour",
       "destination": "London",
       "baseUrl": "https://example.com/tour"
     }'
   ```

2. **Track Click**
   - Visit the generated short URL
   - Should redirect to affiliate URL
   - Check `affiliate_clicks` table

3. **Record Conversion**
   ```bash
   curl -X POST http://localhost:5000/api/affiliate/conversion \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "trackingCode": "GYG-test-123-...",
       "provider": "getyourguide",
       "tourId": "test-123",
       "bookingAmount": 100.00
     }'
   ```

4. **Check Dashboard**
   - Visit `/admin/commissions`
   - Should see test conversion

## Troubleshooting

### No Data Showing

1. Check database tables exist:
   ```sql
   SELECT * FROM affiliate_links LIMIT 1;
   SELECT * FROM affiliate_clicks LIMIT 1;
   SELECT * FROM affiliate_conversions LIMIT 1;
   ```

2. Check API endpoints are working:
   ```bash
   curl http://localhost:5000/api/affiliate/stats \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. Check user has admin role:
   ```sql
   SELECT role FROM users WHERE id = 'your-user-id';
   ```

### Conversions Not Recording

1. Verify tracking code exists in `affiliate_links`
2. Check click was recorded in `affiliate_clicks`
3. Verify commission rate is set correctly
4. Check for errors in backend logs

### Commission Amounts Wrong

1. Check commission rates in `affiliateTrackingService.js`
2. Verify booking amounts are correct
3. Check currency conversion if needed

## Future Enhancements

- [ ] Automated commission reconciliation
- [ ] Email notifications for new conversions
- [ ] Monthly commission reports
- [ ] Integration with payment processors
- [ ] Multi-currency support
- [ ] Advanced analytics and charts
- [ ] Conversion attribution models
- [ ] A/B testing for affiliate links

## Security Considerations

- Admin-only access to dashboard
- Tracking codes are unique and random
- IP addresses stored for fraud detection
- Commission status changes logged
- API endpoints require authentication

## Performance

- Database indexes on tracking codes
- Materialized views for dashboard
- Caching for frequently accessed data
- Pagination for large datasets

---

**Status**: ✅ Complete and ready to use  
**Version**: 1.0.0  
**Last Updated**: February 18, 2026
