-- Run this in your Supabase SQL editor to enable per-user AI usage tracking.
-- Required for Fix #7: user-level daily limits and abuse detection.

create table if not exists ai_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null,           -- e.g. 'generate-itinerary'
  created_at  timestamptz not null default now()
);

-- Index for fast daily-usage lookups per user
create index if not exists ai_usage_user_day
  on ai_usage (user_id, created_at desc);

-- RLS: users can only read their own rows; server uses service role to write
alter table ai_usage enable row level security;

create policy "Users can view own usage"
  on ai_usage for select
  using (auth.uid() = user_id);
