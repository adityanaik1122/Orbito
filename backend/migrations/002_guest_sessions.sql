-- Run this in your Supabase SQL editor.
-- Required for Fix #6: guest session persistence across server restarts.

create table if not exists guest_sessions (
  token       uuid primary key,
  count       smallint    not null default 0,
  expires_at  timestamptz not null
);

create index if not exists guest_sessions_expires_at
  on guest_sessions (expires_at);

-- Optional: auto-delete expired rows daily via pg_cron (if enabled on your Supabase plan)
-- select cron.schedule('delete-expired-guest-sessions', '0 3 * * *',
--   $$delete from guest_sessions where expires_at < now()$$);
