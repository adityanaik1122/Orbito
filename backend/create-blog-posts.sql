-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  summary      TEXT,
  image_url    TEXT,
  source_name  TEXT,
  source_url   TEXT NOT NULL,
  category     TEXT DEFAULT 'Travel',
  published_at TIMESTAMPTZ,
  fetched_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT blog_posts_source_url_unique UNIQUE (source_url)
);

-- Index for listing by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC);

-- Public read access (no auth needed to read blog posts)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog posts"
  ON blog_posts FOR SELECT
  USING (true);
