/**
 * Universal Supabase Client for ES Module / Bundler environments (Vite / React)
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL || 'https://uujklkizvjtvqrzygnsa.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1amtsa2l6dmp0dnFyenlnbnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNTU5MjMsImV4cCI6MjEwNTczMTkyM30.MwDzGnJTxQv3f8az5JIOyendzNkzrbtC4avhjynjFDk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
