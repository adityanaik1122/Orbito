ALTER TABLE public.tours
ADD COLUMN IF NOT EXISTS badge_overrides jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.tours.badge_overrides IS 'Manual badge toggles from admin dashboard';
