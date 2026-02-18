# Operator Dashboard

## Overview
The Operator Dashboard is a comprehensive management interface for tour operators to manage their tours, bookings, and view performance analytics.

## Features

### 1. Dashboard Overview
- **Total Tours**: Count of all tours (active and inactive)
- **Total Bookings**: All bookings received
- **Total Revenue**: Revenue from confirmed bookings
- **Average Rating**: Overall rating across all tours

### 2. My Tours Management
- List all tours created by the operator
- View tour details (title, destination, duration, price, rating)
- Toggle tour availability (active/inactive)
- Edit tour information
- Delete tours
- Create new tours

### 3. Bookings Management
- View all bookings for operator's tours
- See booking details:
  - Booking reference
  - Tour name
  - Customer name
  - Tour date
  - Amount paid
  - Booking status
- Update booking status

### 4. Analytics
- **Performance Metrics**:
  - Total views across all tours
  - Conversion rate (bookings/views)
  - Average booking value
- **Top Performing Tours**:
  - Ranked by views
  - Shows price and rating
  - Quick performance overview

## Access

**URL**: `/operator/dashboard`

**Required Role**: Operator or Admin

## User Interface

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Operator Dashboard                    [Refresh] [+ Add]│
│  Welcome John Doe                                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Tours    │ │ Bookings │ │ Revenue  │ │ Rating   │  │
│  │   12     │ │    45    │ │ £12,500  │ │   4.8    │  │
│  │ 10 active│ │ 40 conf. │ │This month│ │ 120 rev. │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  [My Tours] [Bookings] [Analytics]                      │
├─────────────────────────────────────────────────────────┤
│  My Tours                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ London Eye Tour          [Active]               │   │
│  │ 📍 London  ⏰ 2h  💷 £35  ⭐ 4.8                 │   │
│  │                          [👁️] [✏️] [🗑️]         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## API Endpoints

### Get Operator Tours
```
GET /api/operator/tours
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "tours": [
    {
      "id": "uuid",
      "title": "London Eye Tour",
      "destination": "London",
      "duration": "2 hours",
      "price_adult": 35.00,
      "rating": 4.8,
      "is_available": true,
      "views_count": 1250
    }
  ]
}
```

### Get Operator Bookings
```
GET /api/operator/bookings
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "booking_reference": "ORB-12345",
      "tour": {
        "id": "uuid",
        "title": "London Eye Tour"
      },
      "customer_name": "John Smith",
      "tour_date": "2026-03-15",
      "total_amount": 70.00,
      "booking_status": "confirmed"
    }
  ]
}
```

### Get Operator Statistics
```
GET /api/operator/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "totalRevenue": 12500.00,
  "totalViews": 15000,
  "avgRating": 4.8,
  "totalReviews": 120,
  "conversionRate": "3.00",
  "avgBookingValue": 85.50
}
```

### Create Tour
```
POST /api/operator/tours
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Tour",
  "description": "Tour description",
  "destination": "London",
  "duration": "3 hours",
  "price_adult": 45.00,
  "price_child": 25.00,
  "category": "Sightseeing"
}
```

### Update Tour
```
PUT /api/operator/tours/:tourId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Tour Name",
  "price_adult": 50.00
}
```

### Delete Tour
```
DELETE /api/operator/tours/:tourId
Authorization: Bearer {token}
```

### Update Tour Availability
```
PATCH /api/operator/tours/:tourId/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "is_available": false
}
```

### Update Booking Status
```
PATCH /api/operator/bookings/:bookingId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "booking_status": "confirmed"
}
```

## Database Schema

### Tours Table
Tours must have an `operator_id` column to link to the operator:

```sql
ALTER TABLE tours ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_tours_operator_id ON tours(operator_id);
```

### Users Table
Users need a role column to identify operators:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
-- Possible values: 'user', 'operator', 'admin'
```

## Setup Instructions

### 1. Update Database Schema

Run these SQL commands in Supabase SQL Editor:

```sql
-- Add operator_id to tours table
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_tours_operator_id ON tours(operator_id);

-- Add role to users/profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update existing user to operator role (replace with actual user ID)
UPDATE profiles 
SET role = 'operator' 
WHERE id = 'your-user-id-here';
```

### 2. Assign Operator Role

To make a user an operator:

```sql
UPDATE profiles 
SET role = 'operator' 
WHERE email = 'operator@example.com';
```

### 3. Access Dashboard

1. Login with operator account
2. Navigate to `/operator/dashboard`
3. Start managing tours!

## User Roles

### User (Default)
- Can browse tours
- Can create itineraries
- Can make bookings

### Operator
- All user permissions
- Can create and manage tours
- Can view bookings for their tours
- Can update booking status
- Access to operator dashboard

### Admin
- All operator permissions
- Can manage all tours
- Can view all bookings
- Access to admin dashboard
- Access to commission dashboard

## Features in Detail

### Tour Management

**Create Tour:**
1. Click "+ Add Tour" button
2. Fill in tour details
3. Upload images
4. Set pricing
5. Save tour

**Edit Tour:**
1. Click edit icon on tour card
2. Update any field
3. Save changes

**Toggle Availability:**
- Click eye icon to enable/disable tour
- Disabled tours won't appear in search
- Existing bookings remain valid

**Delete Tour:**
- Click trash icon
- Confirm deletion
- Tour is permanently removed

### Booking Management

**View Bookings:**
- See all bookings in table format
- Filter by status
- Sort by date

**Update Status:**
- Change booking status
- Options: pending, confirmed, cancelled, completed
- Customer receives notification (if email service configured)

### Analytics

**Performance Metrics:**
- Track total views
- Monitor conversion rate
- See average booking value

**Top Tours:**
- Identify best performers
- Optimize pricing
- Focus marketing efforts

## Security

### Authorization
- All endpoints require authentication
- Operators can only access their own tours
- Operators can only see bookings for their tours
- Admin can access all data

### Ownership Verification
Every operation verifies:
1. User is authenticated
2. User has operator role
3. User owns the resource (tour/booking)

## Testing

### Test Operator Flow

1. **Create Operator User**
   ```sql
   UPDATE profiles 
   SET role = 'operator' 
   WHERE email = 'test@example.com';
   ```

2. **Login as Operator**
   - Visit `/login`
   - Enter operator credentials

3. **Access Dashboard**
   - Navigate to `/operator/dashboard`
   - Should see dashboard interface

4. **Create Test Tour**
   ```bash
   curl -X POST http://localhost:5000/api/operator/tours \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "Test Tour",
       "destination": "London",
       "duration": "2 hours",
       "price_adult": 35.00
     }'
   ```

5. **View Tours**
   - Should see test tour in dashboard
   - Try toggling availability
   - Try editing tour

## Troubleshooting

### Can't Access Dashboard

**Issue**: 403 Forbidden error

**Solutions**:
1. Check user has operator role:
   ```sql
   SELECT role FROM profiles WHERE id = 'your-user-id';
   ```

2. Update role if needed:
   ```sql
   UPDATE profiles SET role = 'operator' WHERE id = 'your-user-id';
   ```

### Tours Not Showing

**Issue**: Empty tours list

**Solutions**:
1. Check tours have operator_id:
   ```sql
   SELECT id, title, operator_id FROM tours WHERE operator_id = 'your-user-id';
   ```

2. Assign tours to operator:
   ```sql
   UPDATE tours SET operator_id = 'your-user-id' WHERE id = 'tour-id';
   ```

### Bookings Not Showing

**Issue**: Empty bookings list

**Solutions**:
1. Check bookings exist for operator's tours
2. Verify tour ownership
3. Check database query in backend logs

## Future Enhancements

- [ ] Bulk tour upload (CSV import)
- [ ] Advanced analytics with charts
- [ ] Revenue forecasting
- [ ] Customer reviews management
- [ ] Automated email notifications
- [ ] Calendar view for bookings
- [ ] Capacity management
- [ ] Dynamic pricing tools
- [ ] Multi-language support
- [ ] Mobile app for operators

## Best Practices

### Tour Management
- Keep tour information up-to-date
- Use high-quality images
- Write detailed descriptions
- Set competitive pricing
- Respond to reviews promptly

### Booking Management
- Confirm bookings quickly
- Update status regularly
- Communicate with customers
- Handle cancellations professionally

### Analytics
- Monitor performance weekly
- Adjust pricing based on demand
- Identify seasonal trends
- Optimize underperforming tours

---

**Status**: ✅ Complete and ready to use  
**Version**: 1.0.0  
**Last Updated**: February 18, 2026
