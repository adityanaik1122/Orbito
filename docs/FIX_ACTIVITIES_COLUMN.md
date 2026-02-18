# Fix: Activities Column Missing in Itineraries Table

## Problem
You're getting this error when trying to save an itinerary:
```
Could not find the 'activities' column of 'itineraries' in the schema cache
```

This means the `activities` column doesn't exist in your Supabase `itineraries` table.

## Solution: Run SQL Migration in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run This SQL Command

Copy and paste this SQL into the editor and click "Run":

```sql
-- Add 'activities' column to itineraries table if it doesn't exist
DO $ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'itineraries' 
        AND column_name = 'activities'
    ) THEN
        ALTER TABLE itineraries 
        ADD COLUMN activities JSONB NOT NULL DEFAULT '[]'::jsonb;
        
        COMMENT ON COLUMN itineraries.activities IS 'Flattened array of all activities across all days';
        
        RAISE NOTICE 'Column activities added successfully';
    ELSE
        RAISE NOTICE 'Column activities already exists';
    END IF;
END $;
```

### Step 3: Verify the Column Was Added

Run this query to confirm:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'itineraries' 
AND column_name = 'activities';
```

You should see:
- column_name: `activities`
- data_type: `jsonb`
- column_default: `'[]'::jsonb`

### Step 4: Test Saving an Itinerary

Now try saving an itinerary from your app. It should work!

## Alternative: Recreate the Table

If the above doesn't work, you can recreate the entire table (WARNING: This will delete all existing itineraries):

```sql
-- Drop the old table
DROP TABLE IF EXISTS itineraries CASCADE;

-- Recreate with all columns
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days JSONB NOT NULL DEFAULT '[]'::jsonb,
  activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_id TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_share_id ON itineraries(share_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);

-- Enable RLS
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own itineraries"
  ON itineraries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON itineraries FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view shared itineraries"
  ON itineraries FOR SELECT
  USING (is_public = true AND share_id IS NOT NULL);
```

## Temporary Workaround Applied

I've updated the backend code to make the `activities` column optional, so the app won't crash if the column is missing. However, you should still add the column using the SQL above for full functionality.

## Need Help?

If you're still having issues:
1. Check that you're using the correct Supabase project
2. Verify your `SUPABASE_SERVICE_ROLE_KEY` is set in `backend/.env`
3. Make sure you have the correct permissions in Supabase
4. Check the Supabase logs for any error messages
