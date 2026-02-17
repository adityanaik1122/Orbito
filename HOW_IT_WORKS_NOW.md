# How AI Assistant Works Now - Complete Guide

## The Fix: Dates Only Fill When You Mention Duration

### ❌ OLD BEHAVIOR (WRONG)
```
You type: "Oxford"
Result: Destination="Oxford", Dates=Feb 24-26 (auto-filled 3 days)
Problem: Dates filled even though you didn't mention duration!
```

### ✅ NEW BEHAVIOR (CORRECT)
```
You type: "Oxford"
Result: Destination="Oxford", Dates=EMPTY
You must: Either mention duration OR manually select dates
```

## Scenarios Explained

### Scenario 1: Just Destination (No Duration)
```
Input: "Oxford"
OR: "plan a trip to Oxford"
OR: "visit Paris"

Result:
✓ Destination field: "Oxford" or "Paris"
✗ Start Date: EMPTY (undefined)
✗ End Date: EMPTY (undefined)

What happens:
- Shows error: "Please provide destination and dates"
- You must either:
  a) Type again with duration: "Oxford for 3 days"
  b) Manually select dates using date pickers
```

### Scenario 2: Destination + Duration
```
Input: "plan a trip to oxford for three days"
OR: "visit Paris for 5 days"
OR: "going to Tokyo for a weekend"

Result:
✓ Destination field: "Oxford", "Paris", or "Tokyo"
✓ Start Date: 7 days from today
✓ End Date: Based on duration (3 days, 5 days, 2 days)

What happens:
- All fields filled automatically
- AI generates itinerary immediately
- Map shows correct location
```

### Scenario 3: Already Have Dates, Just Want to Change Destination
```
Current state: Destination="London", Dates=Feb 24-26
Input: "Paris"

Result:
✓ Destination field: "Paris"
✓ Start Date: Feb 24 (KEEPS existing date)
✓ End Date: Feb 26 (KEEPS existing date)

What happens:
- Only destination updates
- Existing dates are preserved
- AI generates Paris itinerary for Feb 24-26
```

## Why You Might See Dates Already Filled

If you see dates like "Feb 24-26, 2026" when you load the page:

### Reason 1: Previous Session
- You selected dates earlier in the same browser session
- React state persists until page refresh
- **Solution**: Refresh the page to clear

### Reason 2: Coming from Homepage
- You typed a query on homepage with duration
- Homepage passed those dates to Plan page
- **This is correct behavior!**

### Reason 3: You Manually Selected Them
- You clicked the date pickers and chose dates
- **This is correct behavior!**

## What the Code Does

### Step 1: Parse the Prompt
```javascript
parseNaturalLanguageQuerySync("plan a trip to oxford for three days")

Returns:
{
  destination: "Oxford",      // Extracted from "to oxford"
  startDate: Date(Feb 24),    // Calculated from "three days"
  endDate: Date(Feb 26)       // Calculated from "three days"
}
```

### Step 2: Update Only What Was Extracted
```javascript
// If parsed.destination exists, update it
// If parsed.startDate exists, update it
// If parsed.endDate exists, update it
// Otherwise, keep existing values

setTripDetails(prev => ({
  ...prev,
  destination: parsed.destination || prev.destination,  // Only update if extracted
  startDate: parsed.startDate || prev.startDate,        // Only update if extracted
  endDate: parsed.endDate || prev.endDate               // Only update if extracted
}));
```

### Step 3: Check Requirements
```javascript
if (!destination || !startDate || !endDate) {
  // Show error: "Please provide destination and dates"
  return;
}

// All good, generate itinerary
```

## Duration Patterns Recognized

### Days
- "3 days" → 3 days
- "5 days" → 5 days
- "10 days" → 10 days
- "one day" → 1 day (if you add this pattern)

### Weeks
- "1 week" → 7 days
- "2 weeks" → 14 days
- "3 weeks" → 21 days

### Special
- "weekend" → 2 days
- "long weekend" → Could add 3 days (not implemented yet)

### NOT Recognized (Dates Won't Fill)
- "a few days" → Too vague
- "some time" → Too vague
- "next month" → No specific duration
- Just destination name → No duration mentioned

## Testing Checklist

### Test 1: Fresh Page Load
1. Refresh the page (Ctrl+R or F5)
2. Check Trip Details section
3. **Expected**: Destination="London", Dates=EMPTY
4. Type in AI Assistant: "Oxford"
5. **Expected**: Destination="Oxford", Dates=STILL EMPTY
6. **Expected**: Error message shown

### Test 2: With Duration
1. Refresh the page
2. Type in AI Assistant: "plan a trip to oxford for three days"
3. **Expected**: Destination="Oxford", Dates=FILLED (3 days)
4. **Expected**: Itinerary generates automatically

### Test 3: Change Destination, Keep Dates
1. Manually select dates: Feb 24-26
2. Type in AI Assistant: "Paris"
3. **Expected**: Destination="Paris", Dates=Feb 24-26 (unchanged)
4. Click "Ask AI"
5. **Expected**: Generates Paris itinerary for Feb 24-26

### Test 4: Override Dates
1. Manually select dates: Feb 24-26
2. Type in AI Assistant: "Paris for 5 days"
3. **Expected**: Destination="Paris", Dates=NEW (5 days from next week)
4. **Expected**: Old dates (Feb 24-26) are replaced

## Common Questions

### Q: Why do I see dates when I type just "Oxford"?
**A**: You probably had dates selected from before. The code only updates fields that are extracted from your prompt. If you had dates before and only type "Oxford", the destination updates but dates stay as they were.

**Solution**: Either:
- Type "Oxford for 3 days" to override dates
- Manually clear dates first
- Refresh page to start fresh

### Q: How do I clear the dates?
**A**: Currently you need to refresh the page. We could add a "Clear" button if needed.

### Q: Can I use "tomorrow" or "next week"?
**A**: Not yet. Currently only supports:
- "X days"
- "X weeks"
- "weekend"

We can add more patterns if needed!

### Q: What if I want to specify exact dates in the prompt?
**A**: Not supported yet. You can:
- Use duration: "5 days"
- Or manually select dates after typing destination

### Q: Does it work with multi-word cities?
**A**: Yes! Examples:
- "New York" ✓
- "San Francisco" ✓
- "Los Angeles" ✓
- "Costa Rica" ✓

## Summary

**The key change**: Dates are ONLY filled when you explicitly mention duration in your prompt. If you see dates already filled, they're from:
1. Previous session (you selected them before)
2. Coming from homepage with duration
3. You manually selected them

This is the correct behavior! The code is NOT auto-filling dates anymore.
