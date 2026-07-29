import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Lipseste VITE_SUPABASE_URL sau VITE_SUPABASE_ANON_KEY din .env');
}

export const supabase = createClient(url, anonKey);
