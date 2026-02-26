const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Backend should use service role key to bypass RLS
// Frontend uses anon key with RLS policies
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !supabaseKey) {
  console.warn('⚠️  WARNING: Supabase environment variables are missing');
  console.warn('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY as fallback)');
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
