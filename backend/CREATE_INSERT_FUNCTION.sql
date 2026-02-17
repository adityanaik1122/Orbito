-- Create a PostgreSQL function to insert itineraries
-- This bypasses the PostgREST schema cache issue

CREATE OR REPLACE FUNCTION insert_itinerary(
  p_user_id UUID,
  p_title TEXT,
  p_destination TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_days JSONB,
  p_activities JSONB DEFAULT '[]'::jsonb
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  days JSONB,
  activities JSONB,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO itineraries (
    user_id,
    title,
    destination,
    start_date,
    end_date,
    days,
    activities
  ) VALUES (
    p_user_id,
    p_title,
    p_destination,
    p_start_date,
    p_end_date,
    p_days,
    p_activities
  )
  RETURNING 
    itineraries.id,
    itineraries.user_id,
    itineraries.title,
    itineraries.destination,
    itineraries.start_date,
    itineraries.end_date,
    itineraries.days,
    itineraries.activities,
    itineraries.created_at;
END;
$$;
