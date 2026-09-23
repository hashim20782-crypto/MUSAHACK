/**
 * Supabase Global Configuration & Client Initializer (Vanilla JS & HTML Frontends)
 * ---------------------------------------------------------------------------------
 * Shared across FARMER, OPERATOR, and ADMIN branches.
 * 
 * You can set window.__ENV__ or update the fallback constants with your Supabase credentials.
 */

(function () {
  'use strict';

  const DEFAULT_SUPABASE_URL = 'https://xyzcompanyagritech.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnlhZ3JpdGVjaCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.placeholder';

  const url = (window.__ENV__ && window.__ENV__.SUPABASE_URL) 
    || localStorage.getItem('SUPABASE_URL') 
    || DEFAULT_SUPABASE_URL;

  const anonKey = (window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY) 
    || localStorage.getItem('SUPABASE_ANON_KEY') 
    || DEFAULT_SUPABASE_ANON_KEY;

  window.SUPABASE_CONFIG = {
    url,
    anonKey
  };

  // Helper to initialize or get the Supabase client
  window.getSupabaseClient = function () {
    if (window.supabaseClient) {
      return window.supabaseClient;
    }
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      window.supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return window.supabaseClient;
    }
    console.warn('[Supabase] Supabase JS library is not loaded on window.');
    return null;
  };
})();
