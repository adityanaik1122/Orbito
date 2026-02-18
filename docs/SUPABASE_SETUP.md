# Supabase Setup Guide

## Issue: Row-Level Security (RLS) Error

If you're seeing this error:
```
Error: new row violates row-level security for table 'itineraries'
```

This means the backend needs the **Service Role Key** to bypass RLS policies.

## Solution: Add Service Role Key

### Step 1: Get Your Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to: **Settings** → **API**
3. Find the **Service Role Key** section (⚠️ Keep this secret!)
4. Copy the `service_role` key (starts with `eyJ...`)

### Step 2: Add to Backend .env

Add this line to `backend/.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Restart Backend Server

```bash
cd backend
node server.js
```

You should see:
```
✅ Supabase initialized with service role key (RLS bypassed)
```

---

## Why Service Role Key?

### Frontend (Browser)
- Uses **Anon Key** 
- RLS policies enforced
- Users can only access their own data

### Backend (Server)
- Uses **Service Role Key**
- RLS policies bypassed
- Trusted server can perform admin operations

---

## Alternative: Fix RLS Policies (Not Recommended)

If you don't want to use the service role key, you need to update your Supabase RLS policies:

### SQL to Run in Supabase SQL Editor:

```sql
-- Allow authenticated users to insert their own itineraries
CREATE POLICY "Users can insert their own itineraries"
ON itineraries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read their own itineraries
CREATE POLICY "Users can read their own itineraries"
ON itineraries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to update their own itineraries
CREATE POLICY "Users can update their own itineraries"
ON itineraries
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own itineraries
CREATE POLICY "Users can delete their own itineraries"
ON itineraries
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

**However**, this approach has issues:
- Backend needs to pass user JWT token to Supabase
- More complex authentication flow
- Service role key is the standard approach for backends

---

## Security Notes

⚠️ **NEVER** commit the service role key to Git!

✅ Add to `.gitignore`:
```
.env
.env.local
.env.production
```

✅ The service role key should only be used on the backend server, never in frontend code.

---

## Troubleshooting

### Error: "Supabase initialized with anon key (RLS active)"
- You forgot to add `SUPABASE_SERVICE_ROLE_KEY` to `.env`
- Restart the server after adding it

### Error: "Invalid API key"
- Check that you copied the full service role key
- Make sure there are no extra spaces or line breaks

### Still getting RLS errors?
- Verify the key is correct in Supabase dashboard
- Check that the backend server restarted
- Look at server logs for initialization message
