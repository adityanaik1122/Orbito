# Database Setup Instructions

## Problem
Itineraries are not saving because the database table doesn't exist or has incorrect permissions.

## Solution

### Step 1: Set up the Supabase Table

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (wknhdqgoayncrdsmtwys)
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy and paste the entire contents of `schema.sql` into the editor
6. Click "Run" to execute the SQL

This will:
- Create the `itineraries` table with all required columns
- Set up Row Level Security (RLS) policies so users can only access their own itineraries
- Create indexes for better performance
- Set up automatic timestamps

### Step 2: Test the Backend

Run your backend server:
```bash
npm run dev
```

### Step 3: Test Saving an Itinerary

1. Start your frontend application
2. Log in with your account
3. Create an itinerary on the Plan Tour page
4. Click "Save Plan"
5. Check the browser console and backend logs for any errors

### What Was Fixed

1. **Frontend**: Changed from directly calling Supabase to using the backend API (`apiService.saveItinerary`)
2. **Backend**: Added proper logging to help debug any issues
3. **Database**: Created proper schema with Row Level Security policies

### Debugging Tips

If saves still fail, check:
1. Backend logs for errors (look for "Database save error:")
2. Browser console for errors
3. Verify you're logged in (auth token is being sent)
4. Check Supabase logs in the dashboard under "Logs" > "Postgres Logs"

### Row Level Security (RLS)

The RLS policies ensure:
- Users can only INSERT/UPDATE/DELETE their own itineraries
- Users can SELECT (view) their own itineraries
- Anyone can view public shared itineraries (when `is_public = true`)

This prevents unauthorized access to user data while allowing the sharing feature to work.
