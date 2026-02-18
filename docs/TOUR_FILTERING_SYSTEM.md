# Tour Filtering System

## Overview
Robust filtering system for the Tours page with sidebar filters, price range slider, duration filters, and category filters.

## Features

### Frontend Components

#### FilterSidebar Component (`frontend/src/components/FilterSidebar.jsx`)
- **Price Range Slider**: Interactive slider for min/max price (£0-£500)
- **Duration Filters**: 
  - Half Day (< 4 hours) ⏰
  - Full Day (4-8 hours) ☀️
  - Multi-Day (> 8 hours) 📅
- **Category Filters**:
  - Adventure 🏔️
  - Food & Dining 🍽️
  - Culture 🎭
  - Sightseeing 🏛️
  - Entertainment 🎪
  - Historical Sites 🏰
  - Attractions 🎢
- **Mobile Responsive**: Slide-out sidebar on mobile, sticky sidebar on desktop
- **Active Filter Count**: Shows number of active filters
- **Apply/Clear Actions**: Batch apply filters or clear all at once

#### UI Components Added
- `frontend/src/components/ui/checkbox.jsx` - Radix UI checkbox component
- `frontend/src/components/ui/slider.jsx` - Radix UI range slider component

### Backend Filtering

#### Updated Files
- `backend/src/models/tourModel.js` - Enhanced query builder with:
  - Multiple category filtering (OR logic)
  - Duration-based filtering with hour ranges
  - Price range filtering
  - Improved sorting (rating, price, popularity)
  
- `backend/src/controllers/tourController.js` - Enhanced controller with:
  - Client-side filtering for Premium Tours API data
  - Support for comma-separated filter values
  - Fallback filtering when database is unavailable

### Filter Parameters

#### API Query Parameters
```
GET /api/tours?destination=London&categories=Adventure,Culture&durations=full-day&minPrice=50&maxPrice=200&sortBy=rating
```

**Parameters:**
- `destination` (string): Search by destination name
- `country` (string): Filter by country code
- `categories` (string): Comma-separated categories (Adventure,Food,Culture)
- `durations` (string): Comma-separated durations (half-day,full-day,multi-day)
- `minPrice` (number): Minimum price in GBP
- `maxPrice` (number): Maximum price in GBP
- `sortBy` (string): Sort option (rating, price_low, price_high, popular)

### Duration Logic

**Backend Duration Mapping:**
- `half-day`: `duration_hours < 4`
- `full-day`: `duration_hours >= 4 AND duration_hours <= 8`
- `multi-day`: `duration_hours > 8`

### Database Schema Requirements

The tours table should have these columns for full filtering support:
```sql
- category (text)
- duration_hours (numeric)
- price_adult (numeric)
- rating (numeric)
- views_count (integer)
- destination (text)
- country (text)
- is_available (boolean)
```

## Usage

### Frontend Integration
```jsx
import FilterSidebar from '@/components/FilterSidebar';

const [filters, setFilters] = useState({
  destination: '',
  categories: [],
  durations: [],
  priceRange: [0, 500],
  sortBy: 'rating'
});

<FilterSidebar
  filters={filters}
  onFilterChange={setFilters}
  onApply={handleApplyFilters}
  onClear={handleClearFilters}
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
/>
```

### Backend Query Building
The backend automatically builds dynamic Supabase queries based on active filters:
- Uses `.in()` for multiple categories
- Uses `.or()` for duration ranges
- Uses `.gte()` and `.lte()` for price ranges
- Applies sorting based on sortBy parameter

## Mobile Responsiveness
- Sidebar slides in from left on mobile
- Fixed overlay backdrop
- Sticky positioning on desktop
- Touch-friendly filter controls
- Responsive grid layout for tour cards

## Performance Optimizations
- Filters applied on button click (not on every change)
- Client-side filtering fallback for API data
- Efficient Supabase query building
- Debounced search input (on Enter key)

## Future Enhancements
- [ ] Save filter preferences to localStorage
- [ ] Add "Recently Used Filters" quick access
- [ ] Implement filter presets (e.g., "Budget Tours", "Luxury Experiences")
- [ ] Add date range filter for tour availability
- [ ] Implement map view with location-based filtering
- [ ] Add "Clear Individual Filter" badges
