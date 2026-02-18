# Premium Tours Integration Guide

## 🎯 Overview

Your Orbito platform is now ready to integrate with Premium Tours (https://www.premiumtours.co.uk/). The system is built to work with mock data now and seamlessly switch to their real API when you get access.

## ✅ What's Been Built

### 1. Database Schema (`backend/tours-schema.sql`)
Complete database structure with:
- **Tours table** - Stores tour listings
- **Tour Providers table** - Manages Premium Tours and future partners
- **Bookings table** - Tracks all tour bookings
- **Commissions table** - Auto-calculates your earnings
- **Row Level Security** - Protects user data
- **Triggers** - Auto-generates booking references and commission records

### 2. Backend API (`backend/src/`)
Fully functional API ready for integration:

#### Files Created:
- `services/premiumToursService.js` - API abstraction layer (mock data → real API)
- `models/tourModel.js` - Database operations
- `controllers/tourController.js` - Request handlers
- `routes/tourRoutes.js` - API endpoints

#### API Endpoints:
```
GET  /api/tours                    - Browse tours (with filters)
GET  /api/tours/:slug              - Tour details
POST /api/bookings                 - Create booking (requires auth)
GET  /api/bookings                 - User's bookings (requires auth)
GET  /api/bookings/:id             - Booking details (requires auth)
POST /api/bookings/:id/cancel      - Cancel booking (requires auth)
```

### 3. Features

✨ **Currently Working:**
- Browse tours with filters (destination, category, price)
- View tour details
- Create bookings
- Track bookings
- Commission calculation (automatic)
- Mock data for 5 London tours

🔜 **Ready for Premium Tours API:**
- Automatic API fallback
- Data transformation layer
- Booking synchronization
- Real-time availability checks

## 📋 Setup Instructions

### Step 1: Database Setup

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to SQL Editor → New Query
4. Copy and paste the contents of `backend/tours-schema.sql`
5. Click "Run"

This creates all tables, indexes, RLS policies, and seeds Premium Tours as a provider.

### Step 2: Environment Variables

Add to your `backend/.env`:
```env
# Premium Tours API (add values when you get API access)
PREMIUM_TOURS_API_URL=
PREMIUM_TOURS_API_KEY=
```

### Step 3: Test the Backend

```bash
cd backend
npm run dev
```

Test the mock API:
```bash
# Get tours
curl http://localhost:5000/api/tours

# Get specific tour
curl http://localhost:5000/api/tours/london-eye-fast-track
```

## 🔌 When Premium Tours Provides API Access

### Step 1: Get API Credentials
Contact Premium Tours and request:
- API endpoint URL
- API key
- API documentation
- Booking callback/webhook URL

### Step 2: Update Environment Variables
```env
PREMIUM_TOURS_API_URL=https://api.premiumtours.co.uk/v1
PREMIUM_TOURS_API_KEY=your_actual_api_key_here
```

### Step 3: Map Their API to Your Schema

Edit `backend/src/services/premiumToursService.js`:

```javascript
// Update the _transformAPIResponse method (line 353)
static _transformAPIResponse(apiData) {
  // Map Premium Tours fields to your schema
  return {
    external_id: apiData.id,                    // Their tour ID
    title: apiData.name,                        // Tour name
    description: apiData.description,
    price_adult: apiData.adult_price,           // Adult price
    price_child: apiData.child_price,           // Child price  
    destination: apiData.location?.city,
    duration: apiData.duration,
    category: apiData.category,
    main_image: apiData.images?.[0],
    rating: apiData.average_rating,
    // ... map other fields based on their API structure
  };
}
```

### Step 4: Test End-to-End

1. Test fetching tours from their API
2. Test creating a booking
3. Verify booking confirmation
4. Check commission calculation
5. Test cancellation flow

### Step 5: Sync Tours to Database (Optional)

Create a sync script to periodically import their tours into your database:

```javascript
// backend/src/scripts/syncTours.js
const PremiumToursService = require('../services/premiumToursService');
const { supabase } = require('../config/supabase');

async function syncTours() {
  const tours = await PremiumToursService.getTours();
  
  // Bulk insert/update tours in database
  for (const tour of tours) {
    await supabase
      .from('tours')
      .upsert({
        ...tour,
        provider_id: 'premium-tours-provider-id',
        last_synced_at: new Date().toISOString()
      }, {
        onConflict: 'external_id'
      });
  }
}

// Run every 6 hours
setInterval(syncTours, 6 * 60 * 60 * 1000);
```

## 💰 Commission Tracking

Commissions are automatically tracked:

1. When a booking status changes to `confirmed` AND payment status is `paid`
2. A commission record is automatically created (via database trigger)
3. Commission amount = `booking_amount * commission_rate / 100`
4. Default commission rate for Premium Tours: **12.5%** (set in seed data)

### View Commission Earnings

Add to your admin dashboard:
```javascript
const response = await fetch('/api/admin/commissions', {
  headers: { Authorization: `Bearer ${token}` }
});
const { commissions } = await response.json();

// Calculate total earnings
const totalEarnings = commissions
  .filter(c => c.status === 'paid')
  .reduce((sum, c) => sum + parseFloat(c.commission_amount), 0);
```

## 🚀 Next Steps for Complete Integration

### Frontend Components Needed:

1. **ToursPage.jsx** - Browse tours page
2. **TourDetailPage.jsx** - Individual tour page with booking
3. **TourCard.jsx** - Reusable tour card component
4. **BookingsPage.jsx** - User's booking history
5. **TourBookingForm.jsx** - Booking form component

### Frontend API Service:

Add to `frontend/src/services/api.js`:
```javascript
export const apiService = {
  // ... existing methods
  
  // Tours
  getTours: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/tours?${params}`);
    return await response.json();
  },
  
  getTourDetail: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/tours/${slug}`);
    return await response.json();
  },
  
  // Bookings
  createBooking: async (bookingData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  },
  
  getUserBookings: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/bookings`, { headers });
    return await response.json();
  }
};
```

## 📊 Mock Data Available

The system includes 5 mock London tours:
1. London Eye Fast Track Tickets (£36.50)
2. Tower of London and Crown Jewels (£34.80)
3. Hop-On Hop-Off Bus Tour (£39.00)
4. Harry Potter Studio Tour (£95.00)
5. Thames River Dinner Cruise (£85.00)

## 🔧 Troubleshooting

### Tours not showing up?
1. Check database tables were created (run tours-schema.sql)
2. Check backend logs for errors
3. Verify Supabase connection in backend

### Bookings failing?
1. Check user is authenticated
2. Verify RLS policies in Supabase
3. Check booking_reference generation function exists

### Commission not calculating?
1. Verify the trigger exists: `booking_commission_trigger`
2. Check booking status is 'confirmed' AND payment_status is 'paid'
3. Check tour has a valid provider_id

## 📞 Premium Tours Contact

When reaching out to Premium Tours for API access, ask for:
- REST API documentation
- Authentication method (API key, OAuth, etc.)
- Webhook support for booking confirmations
- Staging/sandbox environment for testing
- Commission structure and payout process
- SLA and support contact

## 🎉 Benefits of This Setup

✅ **Works Now** - Mock data lets you build/test frontend immediately  
✅ **API Ready** - Seamless switch when Premium Tours provides API  
✅ **Scalable** - Easy to add more tour providers  
✅ **Commission Tracking** - Automatic earnings calculation  
✅ **Secure** - RLS policies protect user data  
✅ **Professional** - Complete booking management system  

---

**Questions?** Check the code comments in:
- `backend/src/services/premiumToursService.js` - API integration guide
- `backend/tours-schema.sql` - Database structure explained
- `backend/src/controllers/tourController.js` - Business logic flow
