# Testing AI Assistant Destination Extraction

## How It Works Now

When you type a prompt in the AI Assistant, it will:
1. **Extract the destination** from your prompt
2. **Extract the dates** (if you mention duration)
3. **Update the form fields** automatically
4. **Generate the itinerary** with correct destination

## Test Cases

### ✅ Test 1: "plan a trip to oxford for three days"
**Expected Result**:
- Destination field: "Oxford"
- Start Date: 7 days from today
- End Date: 9 days from today (3 days total)
- AI generates Oxford itinerary
- Map shows Oxford

### ✅ Test 2: "visit Paris for 5 days"
**Expected Result**:
- Destination field: "Paris"
- Start Date: 7 days from today
- End Date: 11 days from today (5 days total)
- AI generates Paris itinerary
- Map shows Paris

### ✅ Test 3: "going to Tokyo for a weekend"
**Expected Result**:
- Destination field: "Tokyo"
- Start Date: 7 days from today
- End Date: 9 days from today (2 days for weekend)
- AI generates Tokyo itinerary
- Map shows Tokyo

### ✅ Test 4: "plan a trip to New York for 2 weeks"
**Expected Result**:
- Destination field: "New York"
- Start Date: 7 days from today
- End Date: 20 days from today (14 days total)
- AI generates New York itinerary
- Map shows New York

### ✅ Test 5: Just destination without dates
**Prompt**: "plan a trip to Iceland"
**Expected Result**:
- Destination field: "Iceland"
- Start Date: Empty (you need to select manually)
- End Date: Empty (you need to select manually)
- Shows error: "Please provide destination and dates"

## Supported Patterns

The AI Assistant can understand these patterns:

### Destination Patterns:
- "plan a trip to [CITY]"
- "plan for [CITY]"
- "visit [CITY]"
- "going to [CITY]"
- "explore [CITY]"
- "[CITY] trip"
- "[CITY] adventure"

### Duration Patterns:
- "X days" (e.g., "5 days")
- "X weeks" (e.g., "2 weeks")
- "weekend" (automatically 2 days)

## What Happens Behind the Scenes

```javascript
// When you type: "plan a trip to oxford for three days"

1. parseNaturalLanguageQuerySync() extracts:
   {
     destination: "Oxford",
     startDate: Date (7 days from now),
     endDate: Date (9 days from now)
   }

2. Form fields update:
   - Destination: "Oxford"
   - Start Date: Feb 26, 2026
   - End Date: Feb 28, 2026

3. AI generates itinerary:
   - Calls backend with destination="Oxford"
   - Backend returns 3-day Oxford itinerary
   - Frontend displays the itinerary

4. Map updates:
   - Geocodes "Oxford"
   - Centers map on Oxford coordinates
   - Shows activity markers
```

## Troubleshooting

### Issue: Destination not updating
**Check**:
1. Make sure you're typing in the AI Assistant input (blue box at top)
2. Include "to" or "for" in your prompt (e.g., "plan a trip TO oxford")
3. Capitalize the city name (e.g., "Oxford" not "oxford")

### Issue: Dates not auto-filling
**Check**:
1. Include duration in your prompt (e.g., "for 3 days")
2. If you don't mention duration, dates won't auto-fill (this is intentional)
3. You can manually select dates after typing the destination

### Issue: Map showing wrong location
**Check**:
1. Wait for the destination field to update first
2. Map will show loading indicator while geocoding
3. If location not found, it defaults to London

### Issue: Save button shows schema error
**Solution**:
1. Restart the backend server (see FIXES_APPLIED.md)
2. The activities column exists but backend needs to refresh its cache

## Advanced Usage

### Combine with Manual Edits
1. Type: "plan a trip to oxford for three days"
2. AI fills in Oxford and dates
3. You can still manually edit:
   - Change destination to "Oxford, UK" for more specific
   - Adjust dates if needed
   - Modify trip title
4. Click "Ask AI" or "Generate AI Itinerary" to create plan

### Use AI Assistant for Modifications
After generating an itinerary, you can use AI Assistant to:
- "Add a romantic dinner on Day 2"
- "Optimize my route"
- "Add more museums"
- "Make it more budget-friendly"

(Note: These modification features may need additional implementation)
