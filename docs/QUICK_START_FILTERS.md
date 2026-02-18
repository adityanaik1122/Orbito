# Quick Start - Tour Filtering System

## 🚀 Get Started in 3 Steps

### Step 1: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 2: Open Tours Page

Navigate to: **http://localhost:3000/tours**

### Step 3: Try the Filters!

**Desktop:**
- Filters sidebar is visible on the left
- Adjust price slider, check boxes
- Click "Apply Filters"

**Mobile:**
- Click "Show Filters" button
- Sidebar slides in from left
- Apply filters and close

## 🎯 Quick Test Scenarios

### Test 1: Price Filter (30 seconds)
1. Drag price slider to £30 - £100
2. Click "Apply Filters"
3. ✅ Only tours £30-£100 should show

### Test 2: Duration Filter (30 seconds)
1. Check "Full Day (4-8 hours)"
2. Click "Apply Filters"
3. ✅ Only 4-8 hour tours should show

### Test 3: Category Filter (30 seconds)
1. Check "Culture" and "Adventure"
2. Click "Apply Filters"
3. ✅ Only those categories should show

### Test 4: Combined Filters (1 minute)
1. Set price: £50-£150
2. Check "Full Day"
3. Check "Cultural"
4. Click "Apply Filters"
5. ✅ Tours matching ALL criteria show

### Test 5: Clear Filters (15 seconds)
1. Click "Clear All"
2. ✅ All filters reset, all tours show

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12" or any mobile device
4. Test filter sidebar slide-in/out

## ✅ Success Indicators

You'll know it's working when:
- ✅ Sidebar appears (desktop) or slides in (mobile)
- ✅ Price slider moves smoothly
- ✅ Checkboxes toggle on/off
- ✅ "X filters active" counter updates
- ✅ Tours update when you click "Apply"
- ✅ Tour count changes based on filters
- ✅ No errors in browser console

## 🐛 Troubleshooting

**Problem: Filters not showing**
- Solution: Check if frontend is running on port 3000
- Check browser console for errors

**Problem: No tours displaying**
- Solution: Check if backend is running on port 5000
- Verify API call in Network tab

**Problem: Filters not working**
- Solution: Check browser console for errors
- Verify API response in Network tab

**Problem: Sidebar not sliding on mobile**
- Solution: Check if you're in mobile view (< 768px width)
- Try refreshing the page

## 📚 Next Steps

1. ✅ Test all filter combinations
2. 📖 Read `TOUR_FILTERING_SYSTEM.md` for technical details
3. 🧪 Follow `TESTING_TOUR_FILTERS.md` for comprehensive testing
4. 🎨 Check `FILTER_SYSTEM_VISUAL_GUIDE.md` for design details
5. 📝 Read `TOUR_FILTER_IMPLEMENTATION_SUMMARY.md` for overview

## 🎉 That's It!

Your tour filtering system is ready to use. Enjoy exploring tours with powerful filters!

---

**Need Help?**
- Check documentation files in project root
- Review browser console for errors
- Verify both servers are running
- Check Network tab for API calls
