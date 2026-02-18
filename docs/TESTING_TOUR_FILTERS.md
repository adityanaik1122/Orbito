# Testing Tour Filtering System

## Quick Test Guide

### 1. Start the Servers

**Backend:**
```bash
cd backend
node server.js
```
Server should start on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend should start on http://localhost:3000

### 2. Navigate to Tours Page

Open your browser and go to:
```
http://localhost:3000/tours
```

### 3. Test Filter Scenarios

#### Scenario 1: Price Range Filter
1. Click "Show Filters" button (mobile) or use sidebar (desktop)
2. Adjust price slider to £30 - £100
3. Click "Apply Filters"
4. **Expected**: Only tours between £30-£100 should display

#### Scenario 2: Duration Filter
1. Open filters sidebar
2. Check "Full Day (4-8 hours)"
3. Click "Apply Filters"
4. **Expected**: Only tours with 4-8 hour duration should display
   - Tower of London (3 hours) - should NOT appear
   - Warner Bros Studio Tour (7 hours) - SHOULD appear

#### Scenario 3: Category Filter
1. Open filters sidebar
2. Check "Adventure" and "Culture"
3. Click "Apply Filters"
4. **Expected**: Only Adventure and Culture tours should display

#### Scenario 4: Combined Filters
1. Set price range: £30 - £150
2. Check duration: "Full Day"
3. Check categories: "Cultural", "Sightseeing"
4. Click "Apply Filters"
5. **Expected**: Tours matching ALL criteria should display

#### Scenario 5: Sort Options
1. Apply some filters
2. Change sort dropdown to "Price: Low to High"
3. **Expected**: Tours should reorder by price ascending

#### Scenario 6: Clear Filters
1. Apply multiple filters
2. Click "Clear All" button
3. **Expected**: All filters reset, all tours display

### 4. Test API Endpoints Directly

#### Get All Tours
```bash
curl http://localhost:5000/api/tours
```

#### Filter by Category
```bash
curl "http://localhost:5000/api/tours?categories=Adventure,Culture"
```

#### Filter by Duration
```bash
curl "http://localhost:5000/api/tours?durations=full-day"
```

#### Filter by Price Range
```bash
curl "http://localhost:5000/api/tours?minPrice=50&maxPrice=150"
```

#### Combined Filters
```bash
curl "http://localhost:5000/api/tours?categories=Cultural&durations=full-day&minPrice=30&maxPrice=100&sortBy=price_low"
```

### 5. Mobile Testing

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. Test:
   - Filter sidebar slides in from left
   - "Show Filters" button appears
   - Overlay backdrop works
   - Filters close when clicking outside
   - Tour cards stack vertically

### 6. Expected Mock Data Results

**Available Tours:**
- London Eye (0.5 hours, £36.50, Attractions)
- Tower of London (3 hours, £34.80, Cultural)
- Hop-On Hop-Off Bus (24 hours, £35.00, Sightseeing)
- Warner Bros Studio (7 hours, £109.00, Entertainment)
- Thames Dinner Cruise (2.5 hours, £89.00, Dining)
- Stonehenge Day Trip (11 hours, £95.00, Cultural)
- Bath & Stonehenge (10 hours, £99.00, Cultural)
- Cotswolds Tour (14 hours, £85.00, Sightseeing)
- Westminster Abbey (2 hours, £27.00, Cultural)

**Filter Test Cases:**

| Filter | Expected Results |
|--------|------------------|
| Half-day (< 4 hours) | London Eye, Tower of London, Thames Cruise, Westminster Abbey |
| Full-day (4-8 hours) | Warner Bros Studio |
| Multi-day (> 8 hours) | Hop-On Bus, Stonehenge, Bath, Cotswolds |
| Price £0-£50 | London Eye, Tower of London, Hop-On Bus, Westminster Abbey |
| Price £50-£100 | Thames Cruise, Stonehenge, Bath, Cotswolds |
| Price £100+ | Warner Bros Studio |
| Cultural | Tower of London, Stonehenge, Bath, Westminster Abbey |
| Entertainment | Warner Bros Studio |
| Sightseeing | Hop-On Bus, Cotswolds |

### 7. Browser Console Checks

Open browser console (F12) and check for:
- ✅ No errors
- ✅ API calls to `/api/tours` with correct query params
- ✅ Filter state updates logged
- ✅ Tour count updates correctly

### 8. Common Issues & Solutions

**Issue: Filters not working**
- Check browser console for errors
- Verify backend is running on port 5000
- Check API_BASE_URL in frontend/.env

**Issue: Sidebar not showing on mobile**
- Check if `showFilters` state is toggling
- Verify Tailwind classes are loading
- Check for CSS conflicts

**Issue: No tours displaying**
- Check if backend is returning data
- Verify Premium Tours service is working
- Check browser network tab for API response

**Issue: Duration filter not working**
- Verify `duration_hours` field exists in tour data
- Check backend filtering logic in tourModel.js
- Ensure OR logic is working for multiple durations

### 9. Performance Testing

1. Apply multiple filters rapidly
2. **Expected**: No lag, smooth updates
3. Check network tab - should only make API call on "Apply" click
4. Verify no unnecessary re-renders

### 10. Accessibility Testing

1. Navigate using Tab key
2. **Expected**: All filters are keyboard accessible
3. Test with screen reader
4. Verify ARIA labels are present
5. Check color contrast ratios

## Success Criteria

✅ All filters work independently  
✅ Combined filters work together (AND logic)  
✅ Multiple categories work (OR logic)  
✅ Multiple durations work (OR logic)  
✅ Price slider updates correctly  
✅ Sort options reorder tours  
✅ Clear all resets everything  
✅ Mobile sidebar slides in/out  
✅ Active filter count displays  
✅ No console errors  
✅ API calls have correct parameters  
✅ Tours display correctly after filtering  

## Next Steps After Testing

1. ✅ Verify all tests pass
2. 📝 Document any bugs found
3. 🔧 Fix issues
4. 🚀 Deploy to production
5. 📊 Monitor user behavior with filters
6. 🎨 Gather feedback for UX improvements
