import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wknhdqgoayncrdsmtwys.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbmhkcWdvYXluY3Jkc210d3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjMwNjUsImV4cCI6MjA4MjczOTA2NX0.XsV0iFef-15naM7hMZO_exORUhmt_5PZrp5eSkt0nrI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
