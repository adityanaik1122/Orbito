import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wknhdqgoayncrdsmtwys.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbmhkcWdvYXluY3Jkc210d3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjMwNjUsImV4cCI6MjA4MjczOTA2NX0.XsV0iFef-15naM7hMZO_exORUhmt_5PZrp5eSkt0nrI';

// Capture recovery type from URL hash BEFORE Supabase clears it.
// PASSWORD_RECOVERY event fires before React mounts, so this is the only reliable way.
const _hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
export const initialUrlAuthType = _hashParams.get('type'); // 'recovery' | null

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export {
    customSupabaseClient,
    customSupabaseClient as supabase,
};
