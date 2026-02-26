# 🔧 Admin Login Issue - SOLUTION

**Date:** February 26, 2026  
**Issue:** "Invalid login credentials" error when trying to log in  
**Email:** adityanaik817@gmail.com

---

## 🔍 DIAGNOSIS

The error "Invalid login credentials" means one of two things:
1. **Password mismatch** - The password you're entering doesn't match what's stored
2. **Email not confirmed** - The account exists but email isn't verified

---

## ✅ SOLUTION OPTIONS

### Option 1: Reset Password via Supabase Dashboard (EASIEST) ⭐

This is the safest and easiest method:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select project: **pjealicwafzkdprbcceb**

2. **Navigate to Authentication:**
   - Click "Authentication" in left sidebar
   - Click "Users" tab

3. **Find Your User:**
   - Look for: `adityanaik817@gmail.com`
   - Click on the user row

4. **Reset Password:**
   - Click the "..." menu (three dots)
   - Select "Reset Password"
   - Choose "Send recovery email" OR "Set new password manually"

5. **If Setting Manually:**
   - Enter new password: `Admin123!` (or your choice)
   - Click "Update user"

6. **Confirm Email (if needed):**
   - In the same user details view
   - Look for "Email Confirmed" status
   - If it says "No", click "Confirm email"

7. **Try Logging In:**
   - Go to: `http://localhost:3001/login`
   - Email: `adityanaik817@gmail.com`
   - Password: (the one you just set)
   - Click "Sign In"

---

### Option 2: SQL Password Reset (ADVANCED)

If you prefer SQL, use this corrected query:

```sql
-- Reset password AND confirm email in one query
UPDATE auth.users
SET 
  encrypted_password = crypt('NewPassword123!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmation_token = NULL,
  recovery_token = NULL
WHERE email = 'adityanaik817@gmail.com';

-- Verify the update
SELECT 
  email, 
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'adityanaik817@gmail.com';
```

**Important Notes:**
- Replace `NewPassword123!` with your desired password
- The password will be hashed automatically by `crypt()`
- This confirms the email immediately
- Clears any pending tokens

---

### Option 3: Create Fresh Account (CLEAN SLATE)

If the above don't work, start fresh:

1. **Delete Existing Account (SQL):**
```sql
-- Delete from profiles first (foreign key)
DELETE FROM profiles WHERE email = 'adityanaik817@gmail.com';

-- Delete from auth.users
DELETE FROM auth.users WHERE email = 'adityanaik817@gmail.com';
```

2. **Sign Up Again:**
   - Go to: `http://localhost:3001/login`
   - Click "Sign Up" tab
   - Email: `adityanaik817@gmail.com`
   - Password: Choose a strong password (remember it!)
   - Click "Sign Up"

3. **Make Admin:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'adityanaik817@gmail.com';
```

4. **Log In:**
   - Use the password you just created
   - Should work immediately

---

## 🎯 RECOMMENDED APPROACH

**I recommend Option 1 (Dashboard Reset)** because:
- ✅ Most reliable
- ✅ No SQL errors
- ✅ Visual confirmation
- ✅ Can see all user details
- ✅ Can confirm email with one click

---

## 📋 VERIFICATION CHECKLIST

After fixing, verify everything works:

### 1. Check User Exists
```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'adityanaik817@gmail.com';
```

**Expected Result:**
- ✅ `email_confirmed_at` should have a timestamp (not NULL)
- ✅ `created_at` should show when account was created

### 2. Check Admin Role
```sql
SELECT 
  u.email,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'adityanaik817@gmail.com';
```

**Expected Result:**
- ✅ `role` should be `'admin'`
- ✅ Profile should exist (not NULL)

### 3. Test Login
- Go to: `http://localhost:3001/login`
- Enter email and password
- Should redirect to home page
- Should see user menu in top right

### 4. Test Admin Access
- Go to: `http://localhost:3001/admin`
- Should see admin dashboard
- Should NOT redirect to login

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "User not found"
**Fix:** Account doesn't exist, use Option 3 (create fresh)

### Issue: "Email not confirmed"
**Fix:** Run this SQL:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'adityanaik817@gmail.com';
```

### Issue: "Invalid password"
**Fix:** Use Option 1 (dashboard reset) or Option 2 (SQL reset)

### Issue: Can login but /admin redirects to /login
**Fix:** Role not set correctly:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'adityanaik817@gmail.com';
```

### Issue: Profile doesn't exist
**Fix:** Create profile manually:
```sql
-- Get user ID
SELECT id FROM auth.users WHERE email = 'adityanaik817@gmail.com';

-- Create profile (replace USER_ID with actual ID)
INSERT INTO profiles (id, email, role)
VALUES ('USER_ID_HERE', 'adityanaik817@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## 🔐 PASSWORD REQUIREMENTS

When setting a new password, make sure it:
- ✅ At least 8 characters long
- ✅ Contains uppercase letter (A-Z)
- ✅ Contains lowercase letter (a-z)
- ✅ Contains number (0-9)
- ✅ Optional: Special character (!@#$%^&*)

**Good Examples:**
- `Admin123!`
- `MyPass2026`
- `Secure@Pass1`

**Bad Examples:**
- `password` (no uppercase, no number)
- `12345678` (no letters)
- `admin` (too short, no uppercase, no number)

---

## 📞 STEP-BY-STEP WALKTHROUGH

### Using Dashboard Method (Recommended):

**Step 1:** Open Supabase
- Go to: https://supabase.com/dashboard
- Login to your Supabase account
- Click on project: **pjealicwafzkdprbcceb**

**Step 2:** Find User
- Left sidebar → Click "Authentication"
- Top tabs → Click "Users"
- Find row with: `adityanaik817@gmail.com`

**Step 3:** Check Email Status
- Look at "Email Confirmed" column
- If it says "No" or is blank, the email isn't confirmed

**Step 4:** Confirm Email
- Click on the user row
- Find "Email Confirmed" field
- If not confirmed, click "Confirm email" button

**Step 5:** Reset Password
- Still in user details
- Click "..." menu (three dots) in top right
- Select "Reset password"
- Choose "Set new password manually"
- Enter: `Admin123!` (or your choice)
- Click "Update user"

**Step 6:** Test Login
- Open: `http://localhost:3001/login`
- Email: `adityanaik817@gmail.com`
- Password: `Admin123!` (or what you set)
- Click "Sign In"
- Should work! ✅

**Step 7:** Verify Admin Role
- Open SQL Editor in Supabase
- Run:
```sql
SELECT role FROM profiles WHERE email = 'adityanaik817@gmail.com';
```
- Should return: `admin`
- If not, run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'adityanaik817@gmail.com';
```

**Step 8:** Access Admin Panel
- Go to: `http://localhost:3001/admin`
- Should see admin dashboard! 🎉

---

## ✅ SUCCESS INDICATORS

You'll know it's working when:
1. ✅ Login page accepts your credentials (no error)
2. ✅ Redirects to home page after login
3. ✅ User menu appears in top right corner
4. ✅ `/admin` URL shows dashboard (doesn't redirect)
5. ✅ Can see admin features and data

---

## 🚨 IF NOTHING WORKS

If you've tried everything and still can't login:

1. **Check Browser Console:**
   - Press F12
   - Go to "Console" tab
   - Look for errors
   - Share the error message

2. **Check Network Tab:**
   - Press F12
   - Go to "Network" tab
   - Try logging in
   - Look for failed requests (red)
   - Click on the failed request
   - Check "Response" tab
   - Share the error message

3. **Verify Supabase Project:**
   - Make sure frontend is using: `pjealicwafzkdprbcceb`
   - Check `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://pjealicwafzkdprbcceb.supabase.co
   ```

4. **Restart Servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   
   # Backend
   cd backend
   npm start
   
   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

---

## 📊 CURRENT STATUS

Based on the error you're seeing:

```
POST https://pjealicwafzkdprbcceb.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
AuthApiError: Invalid login credentials
```

This means:
- ✅ Frontend is connecting to correct Supabase project
- ✅ Account exists (otherwise error would be "User not found")
- ❌ Password doesn't match OR email not confirmed

**Most likely cause:** Password mismatch

**Solution:** Use Option 1 (Dashboard Reset) to set a new password

---

## 🎯 NEXT STEPS

1. **Choose a method** (I recommend Option 1)
2. **Follow the steps** carefully
3. **Test login** at `http://localhost:3001/login`
4. **Verify admin access** at `http://localhost:3001/admin`
5. **Report back** if you encounter any issues

---

**Created:** February 26, 2026  
**Status:** Ready to implement  
**Estimated Time:** 5-10 minutes

Good luck! You're almost there! 🚀
