-- =====================================================
-- OPERATOR MARKETPLACE MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add operator_id column to tours (links a tour to the user who submitted it)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add listing_status to tours (controls approval workflow)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS listing_status TEXT DEFAULT 'live'
  CHECK (listing_status IN ('draft', 'pending_review', 'live', 'rejected'));

-- Existing tours from API providers stay 'live'. New operator submissions start as 'pending_review'.
-- Update existing tours without an operator_id to 'live' (they came from external APIs)
UPDATE tours SET listing_status = 'live' WHERE listing_status IS NULL AND operator_id IS NULL;

-- 3. Operator Applications table
CREATE TABLE IF NOT EXISTS operator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Company info
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,

  -- Business details
  tour_types TEXT[], -- ['Cultural', 'Adventure', 'Food & Drink', ...]
  operating_locations TEXT[], -- ['London', 'Paris', ...]
  years_in_business INTEGER,
  description TEXT,

  -- Review
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Operator earnings view (operators see their own; admin sees all)
-- Uses only core columns that exist in all schema versions
CREATE OR REPLACE VIEW operator_earnings AS
SELECT
  t.operator_id,
  b.id                             AS booking_id,
  b.id::text                       AS booking_reference,
  b.total_amount,
  b.currency,
  b.status                         AS booking_status,
  'paid'                           AS payment_status,
  b.created_at,
  -- Platform keeps 15%, operator earns 85%
  ROUND(b.total_amount * 0.85, 2)  AS operator_payout,
  ROUND(b.total_amount * 0.15, 2)  AS platform_fee,
  t.id                             AS tour_id,
  t.title                          AS tour_title
FROM bookings b
JOIN tours t ON b.tour_id = t.id
WHERE t.operator_id IS NOT NULL
  AND b.status IN ('confirmed', 'completed', 'paid');

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_tours_operator_id ON tours(operator_id);
CREATE INDEX IF NOT EXISTS idx_tours_listing_status ON tours(listing_status);
CREATE INDEX IF NOT EXISTS idx_operator_applications_user_id ON operator_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_operator_applications_status ON operator_applications(status);

-- 6. RLS for operator_applications
ALTER TABLE operator_applications ENABLE ROW LEVEL SECURITY;

-- Users can create and view their own application
CREATE POLICY "Users can submit and view their own application"
  ON operator_applications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all applications
CREATE POLICY "Admins can manage all applications"
  ON operator_applications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. Update tour RLS: operators can manage their own tours, admins manage all
-- Operators can insert/update their own tours
CREATE POLICY "Operators can manage their own tours"
  ON tours FOR ALL
  USING (
    auth.uid() = operator_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.uid() = operator_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public tour visibility: only show 'live' tours to the public
-- Your schema uses is_active (not is_available) — drop both just in case
DROP POLICY IF EXISTS "Anyone can view active tours" ON tours;
DROP POLICY IF EXISTS "Anyone can view live tours" ON tours;
CREATE POLICY "Anyone can view live tours"
  ON tours FOR SELECT
  USING (
    (is_active = true OR is_available = true)
    AND (listing_status = 'live' OR listing_status IS NULL)
  );

-- Operators can see their own tours regardless of listing_status
CREATE POLICY "Operators can view their own tours in any status"
  ON tours FOR SELECT
  USING (auth.uid() = operator_id);

-- 8. Trigger for updated_at on operator_applications
CREATE TRIGGER update_operator_applications_updated_at
  BEFORE UPDATE ON operator_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
