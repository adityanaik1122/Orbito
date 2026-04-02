-- Add missing profile fields used by signup/login flows
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS locale TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS currency TEXT;
