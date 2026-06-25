CREATE TABLE IF NOT EXISTS travel_vlogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  view_count BIGINT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS travel_vlogs_published_at_idx ON travel_vlogs(published_at DESC);
