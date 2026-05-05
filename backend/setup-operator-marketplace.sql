-- ============================================================
-- OPERATOR MARKETPLACE SETUP
-- Run this entire block in Supabase SQL Editor (as postgres role)
-- ============================================================

-- 1. Create operator_applications table
CREATE TABLE IF NOT EXISTS public.operator_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  website text,
  tour_types text[],
  operating_locations text[],
  years_in_business int,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.operator_applications ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies (to avoid conflicts on re-run)
DROP POLICY IF EXISTS "Users can create applications" ON public.operator_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.operator_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.operator_applications;

-- 4. RLS policies
CREATE POLICY "Users can create applications" ON public.operator_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own applications" ON public.operator_applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update applications" ON public.operator_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. RPC: Approve operator application (promotes user to operator role)
CREATE OR REPLACE FUNCTION public.approve_operator_application(app_id uuid)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  SELECT user_id INTO v_user_id FROM operator_applications WHERE id = app_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;
  UPDATE profiles SET role = 'operator' WHERE id = v_user_id;
  UPDATE operator_applications
    SET status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
    WHERE id = app_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.approve_operator_application(uuid) TO authenticated;

-- 6. RPC: Reject operator application
CREATE OR REPLACE FUNCTION public.reject_operator_application(app_id uuid, reject_reason text DEFAULT NULL)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE operator_applications
    SET status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(), rejection_reason = reject_reason
    WHERE id = app_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.reject_operator_application(uuid, text) TO authenticated;

-- 7. RPC: Approve tour (admin sets listing_status = 'live')
CREATE OR REPLACE FUNCTION public.approve_operator_tour(tour_id uuid)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE tours SET listing_status = 'live', is_active = true WHERE id = tour_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.approve_operator_tour(uuid) TO authenticated;

-- 8. RPC: Reject tour
CREATE OR REPLACE FUNCTION public.reject_operator_tour(tour_id uuid)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE tours SET listing_status = 'rejected' WHERE id = tour_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.reject_operator_tour(uuid) TO authenticated;

-- 9. Tour RLS: allow operators to insert their own tours
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tours' AND policyname = 'Operators can create tours'
  ) THEN
    CREATE POLICY "Operators can create tours" ON public.tours
      FOR INSERT WITH CHECK (
        auth.uid() = operator_id
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'admin'))
      );
  END IF;
END $$;

-- 10. Tour RLS: allow operators to update/delete their own tours
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tours' AND policyname = 'Operators can manage own tours'
  ) THEN
    CREATE POLICY "Operators can manage own tours" ON public.tours
      FOR ALL USING (
        auth.uid() = operator_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;
