import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.warn('REACT_APP_SUPABASE_URL is not set. Supabase client will fail if used.');
}

if (!supabaseAnonKey) {
  console.warn('REACT_APP_SUPABASE_ANON_KEY is not set. Supabase client will fail if used.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
