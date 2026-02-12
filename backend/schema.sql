-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_share_id ON itineraries(share_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own itineraries
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

-- Allow public access to shared itineraries
CREATE POLICY "Public can view shared itineraries"
  ON itineraries FOR SELECT
  USING (is_public = true AND share_id IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
