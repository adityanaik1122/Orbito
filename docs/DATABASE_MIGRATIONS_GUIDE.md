# 🗄️ Database Migrations Guide

## Overview

This guide explains how to manage database schema changes using Supabase migrations.

---

## ✅ Current Status

Your database schema is defined in:
- `backend/DATABASE_MIGRATIONS.sql` - Main schema
- `backend/ANALYTICS_SCHEMA.sql` - Analytics tables
- `backend/AFFILIATE_TRACKING_SCHEMA.sql` - Affiliate tracking
- `backend/schema.sql` - Tours schema

**Issue:** These are one-time SQL files, not versioned migrations.

---

## 🎯 Supabase Migrations (Recommended)

Supabase has built-in migration support using their CLI.

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

### Step 2: Initialize Supabase Project

```bash
# In your project root
supabase init

# This creates:
# supabase/
#   ├── config.toml
#   └── migrations/
```

### Step 3: Link to Your Project

```bash
# Get your project ref from Supabase dashboard URL
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF

supabase link --project-ref YOUR_PROJECT_REF
```

### Step 4: Pull Existing Schema

```bash
# This creates a migration from your current database
supabase db pull

# Creates: supabase/migrations/YYYYMMDDHHMMSS_remote_schema.sql
```

### Step 5: Create New Migrations

```bash
# Create a new migration file
supabase migration new add_user_preferences

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_user_preferences.sql
```

Edit the file:
```sql
-- supabase/migrations/20260226120000_add_user_preferences.sql

-- Add preferences column to profiles
ALTER TABLE profiles 
ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;

-- Add index for faster queries
CREATE INDEX idx_profiles_preferences ON profiles USING gin(preferences);

-- Add comment
COMMENT ON COLUMN profiles.preferences IS 'User travel preferences (budget, interests, etc.)';
```

### Step 6: Apply Migrations

**Local Development:**
```bash
# Start local Supabase (optional)
supabase start

# Apply migrations locally
supabase db reset
```

**Production:**
```bash
# Push migrations to production
supabase db push

# Or apply specific migration
supabase migration up
```

---

## 📁 Migration File Structure

```
supabase/
├── config.toml
└── migrations/
    ├── 20260101120000_initial_schema.sql
    ├── 20260115140000_add_analytics.sql
    ├── 20260201160000_add_affiliate_tracking.sql
    └── 20260226180000_add_user_preferences.sql
```

---

## 📝 Migration Best Practices

### 1. One Change Per Migration

**Good:**
```sql
-- 20260226120000_add_email_verified.sql
ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
```

**Bad:**
```sql
-- 20260226120000_multiple_changes.sql
ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE tours ADD COLUMN featured BOOLEAN DEFAULT false;
CREATE TABLE bookings (...);
```

### 2. Always Include Rollback

```sql
-- Migration: Add email_verified column
ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;

-- Rollback (in comments for reference):
-- ALTER TABLE profiles DROP COLUMN email_verified;
```

### 3. Use Transactions

```sql
BEGIN;

-- Your changes
ALTER TABLE profiles ADD COLUMN preferences JSONB;
CREATE INDEX idx_profiles_preferences ON profiles USING gin(preferences);

COMMIT;
```

### 4. Test Migrations Locally First

```bash
# Test locally
supabase db reset

# If successful, push to production
supabase db push
```

### 5. Backup Before Major Changes

```bash
# Backup production database
supabase db dump -f backup_$(date +%Y%m%d).sql

# Or use Supabase dashboard: Database → Backups
```

---

## 🔄 Converting Existing SQL Files

### Step 1: Create Initial Migration

```bash
supabase migration new initial_schema
```

### Step 2: Copy Existing Schema

```bash
# Copy your existing schema files into the migration
cat backend/DATABASE_MIGRATIONS.sql > supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql
```

### Step 3: Create Subsequent Migrations

```bash
# Analytics
supabase migration new add_analytics
cat backend/ANALYTICS_SCHEMA.sql > supabase/migrations/YYYYMMDDHHMMSS_add_analytics.sql

# Affiliate tracking
supabase migration new add_affiliate_tracking
cat backend/AFFILIATE_TRACKING_SCHEMA.sql > supabase/migrations/YYYYMMDDHHMMSS_add_affiliate_tracking.sql
```

---

## 🎯 Common Migration Patterns

### Add Column

```sql
-- Add column with default value
ALTER TABLE profiles 
ADD COLUMN phone VARCHAR(20);

-- Add NOT NULL column (requires default or backfill)
ALTER TABLE profiles 
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
```

### Modify Column

```sql
-- Change column type
ALTER TABLE profiles 
ALTER COLUMN phone TYPE VARCHAR(30);

-- Add constraint
ALTER TABLE profiles 
ADD CONSTRAINT phone_format CHECK (phone ~ '^\+?[0-9]{10,15}$');

-- Make column NOT NULL (backfill first!)
UPDATE profiles SET email = 'unknown@example.com' WHERE email IS NULL;
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
```

### Add Index

```sql
-- Simple index
CREATE INDEX idx_profiles_email ON profiles(email);

-- Partial index
CREATE INDEX idx_active_users ON profiles(id) WHERE status = 'active';

-- GIN index for JSONB
CREATE INDEX idx_profiles_preferences ON profiles USING gin(preferences);
```

### Add Foreign Key

```sql
-- Add foreign key
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_user 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

### Create Table

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_preferences ON user_preferences USING gin(preferences);

-- Add RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🚨 Migration Safety Checklist

Before running migrations in production:

- [ ] Tested locally
- [ ] Backed up database
- [ ] Reviewed SQL for errors
- [ ] Checked for breaking changes
- [ ] Planned rollback strategy
- [ ] Notified team (if applicable)
- [ ] Scheduled during low-traffic time
- [ ] Monitored application after deployment

---

## 🔧 Alternative: Manual Migration Tracking

If you don't want to use Supabase CLI, create a simple tracking system:

### Create Migrations Table

```sql
CREATE TABLE schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Track Migrations

```sql
-- After applying a migration
INSERT INTO schema_migrations (version, name)
VALUES ('20260226120000', 'add_user_preferences');
```

### Check Applied Migrations

```sql
SELECT * FROM schema_migrations ORDER BY applied_at DESC;
```

---

## 📊 Migration Workflow

```
┌─────────────────┐
│ Create Migration│
│  (supabase CLI) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Write SQL      │
│  (add/modify)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Locally   │
│  (db reset)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Commit to Git  │
│  (version ctrl) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply to Prod   │
│  (db push)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verify & Test  │
│  (health check) │
└─────────────────┘
```

---

## 🎯 Quick Start (5 minutes)

```bash
# 1. Install CLI
npm install -g supabase

# 2. Initialize
supabase init

# 3. Link project
supabase link --project-ref YOUR_PROJECT_REF

# 4. Pull current schema
supabase db pull

# 5. Create new migration
supabase migration new my_first_migration

# 6. Edit the migration file
# (add your SQL)

# 7. Apply to production
supabase db push
```

---

## 📋 Summary

**Current State:**
- ❌ No migration system
- ❌ Schema changes not versioned
- ❌ Manual SQL execution required

**Recommended Solution:**
- ✅ Use Supabase CLI migrations
- ✅ Version control all schema changes
- ✅ Automated migration application
- ✅ Rollback capability

**Time to Implement:** ~30 minutes

**Benefits:**
- Version-controlled schema
- Reproducible deployments
- Team collaboration
- Rollback capability
- Audit trail

---

## 📞 Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

---

**Created:** February 26, 2026  
**Status:** Ready to implement  
**Priority:** MEDIUM (good practice, not urgent)
