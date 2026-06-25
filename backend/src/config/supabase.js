const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// IMPORTANT: If you previously had hardcoded credentials in this file,
// rotate your Supabase anon key immediately in the Supabase dashboard
// (Settings → API → Reveal anon key → Regenerate).
// The old key is in git history and must be considered compromised.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  logger.error('SUPABASE_URL is not set — database unavailable. Add it to your environment variables.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  logger.warn('SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon key. RLS will be active and some writes may fail.');
}
if (!SUPABASE_URL && !SUPABASE_ANON_KEY && !SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('No Supabase credentials found. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
}

const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && supabaseKey
    ? createClient(SUPABASE_URL, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

if (supabase && SUPABASE_SERVICE_ROLE_KEY) {
  logger.success('Supabase initialized with service role key (RLS bypassed)');
} else if (supabase) {
  logger.warn('Supabase initialized with anon key (RLS active — may cause permission issues)');
} else {
  logger.error('Supabase NOT initialized — check SUPABASE_URL and key env vars');
}

module.exports = { supabase };
