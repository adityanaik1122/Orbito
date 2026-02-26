# Admin Setup - Production Supabase Project

## Current Status:

✅ Frontend connecting to: `pjealicwafzkdprbcceb.supabase.co`
✅ No DNS errors
❌ Account doesn't exist in this project yet

---

## Step-by-Step Setup:

### 1. Create New Account

Go to `http://localhost:3001/login` and click **"Sign Up"** tab:

- Email: `adityanaik817@gmail.com` (or any email you want)
- Password: Choose a strong password
- Click "Sign Up"

### 2. Make Yourself Admin in Supabase

1. Go to https://supabase.com/dashboard
2. Select project: **pjealicwafzkdprbcceb** (your production project)
3. Click "SQL Editor" in the left sidebar
4. Run this SQL:

```sql
-- First, check if profiles table exists
SELECT * FROM profiles LIMIT 1;
```

If you get an error that the table doesn't exist, run this first:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Then make yourself admin:

```sql
-- Make your account admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'adityanaik817@gmail.com';

-- Verify it worked
SELECT email, role FROM profiles WHERE email = 'adityanaik817@gmail.com';
```

You should see: `email: adityanaik817@gmail.com, role: admin`

### 3. Log In

1. Go to `http://localhost:3001/login`
2. Enter your email and password
3. Click "Sign In"

### 4. Access Admin Panel

Go to: `http://localhost:3001/admin`

You should now see the admin dashboard!

---

## Troubleshooting:

### "Invalid login credentials" after signup

This means the password you're trying doesn't match. Try:
1. Click "Forgot your password?" 
2. Or sign up with a different email

### Profile not created automatically

If the trigger didn't work, manually create your profile:

```sql
-- Get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'adityanaik817@gmail.com';

-- Manually insert profile (replace USER_ID with the actual ID from above)
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID_HERE', 'adityanaik817@gmail.com', 'admin');
```

### Still can't access /admin

Check your role in the database:

```sql
SELECT u.email, p.role 
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'adityanaik817@gmail.com';
```

If role is NULL or 'user', run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'adityanaik817@gmail.com';
```

---

## Summary:

1. ✅ Sign up at `/login` (Sign Up tab)
2. ✅ Run SQL to create profiles table (if needed)
3. ✅ Run SQL to make yourself admin
4. ✅ Log in
5. ✅ Access `/admin`

The key difference from before: You're now using the **production** Supabase project (`pjealicwafzkdprbcceb`), so you need to create your account and set up admin role in THIS project, not the other one.
