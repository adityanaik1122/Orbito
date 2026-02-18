# How to Fix: "Could not find the 'activities' column"

## The Problem
Supabase's PostgREST caches the database schema. After you added the `activities` column, the cache wasn't refreshed.

## Solution: Reload Schema in Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project: `wknhdqgoayncrdsmtwys`

### Step 2: Reload Schema
**Option A: Via API Settings**
1. Go to **Settings** → **API**
2. Scroll down to find **"Schema Cache"** section
3. Click **"Reload schema"** or **"Refresh"** button

**Option B: Via Database Settings**
1. Go to **Database** → **API**
2. Look for **"Reload schema"** button
3. Click it

**Option C: Wait**
- Schema cache automatically refreshes every 10-15 minutes
- Just wait and try saving again later

### Step 3: Verify Column Exists
Run this in Supabase SQL Editor to confirm:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'itineraries' 
AND column_name = 'activities';
```

Should return:
```
column_name | data_type
activities  | jsonb
```

### Step 4: Add Service Role Key (Important!)
You're currently using the anon key which has RLS restrictions. Add the service role key:

1. Go to **Settings** → **API**
2. Copy the **service_role** key (NOT the anon key)
3. Add to `backend/.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
4. Restart backend server

## After Reloading Schema

1. **Restart your backend server**:
   ```powershell
   cd backend
   node server.js
   ```

2. **Test saving**:
   - Generate an itinerary
   - Click Save
   - Should work now!

## Alternative: Use REST API to Reload

If you can't access the dashboard, use curl:

```powershell
# Get your service role key first, then:
curl -X POST "https://wknhdqgoayncrdsmtwys.supabase.co/rest/v1/rpc/reload_schema" `
  -H "apikey: YOUR_SERVICE_ROLE_KEY" `
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## Why This Happens

Supabase uses PostgREST which caches the database schema for performance. When you:
1. Add a new column via SQL
2. The cache doesn't know about it yet
3. API requests fail with "column not found"

The solution is always to reload the schema cache.
