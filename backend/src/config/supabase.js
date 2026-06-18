const { createClient } = require('@supabase/supabase-js');

// Hardcoded fallbacks mirror the frontend — URL and anon key are already public in the browser bundle
const FALLBACK_URL = 'https://wknhdqgoayncrdsmtwys.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbmhkcWdvYXluY3Jkc210d3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjMwNjUsImV4cCI6MjA4MjczOTA2NX0.XsV0iFef-15naM7hMZO_exORUhmt_5PZrp5eSkt0nrI';

const SUPABASE_URL = process.env.SUPABASE_URL || FALLBACK_URL;
// Accept both naming conventions for the service role key
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// Backend should use service role key to bypass RLS
// Frontend uses anon key with RLS policies
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_URL) {
  console.warn('⚠️  SUPABASE_URL not set — using hardcoded fallback. Set it on Render for reliability.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set — auth verification uses anon key. Set it on Render.');
}

const supabase = SUPABASE_URL && supabaseKey
  ? createClient(SUPABASE_URL, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const logger = require('../utils/logger');

if (supabase && SUPABASE_SERVICE_ROLE_KEY) {
  logger.success('Supabase initialized with service role key (RLS bypassed)');
} else if (supabase) {
  logger.warn('Supabase initialized with anon key (RLS active - may cause issues)');
}

module.exports = {
  supabase,
};
