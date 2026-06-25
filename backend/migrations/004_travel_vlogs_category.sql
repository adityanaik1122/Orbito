ALTER TABLE travel_vlogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Trending Now';
CREATE INDEX IF NOT EXISTS travel_vlogs_category_idx ON travel_vlogs(category);
