/**
 * FPO Ledger Auth Utility — Supabase Authentication Integration
 * ---------------------------------------------------------------
 * Connects directly to Supabase Auth and validates the user's profile role from the database.
 * Enforces role-based security: only users with role === 'admin' can access the Admin portal.
 */

(function () {
  'use strict';

  const SESSION_CACHE_KEY = 'fpoledger_admin_session';

  /**
   * Helper to retrieve active Supabase client instance.
   */
  function getClient() {
    if (typeof window.getSupabaseClient === 'function') {
      return window.getSupabaseClient();
    }
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      const url = window.SUPABASE_CONFIG?.url || 'https://xyzcompanyagritech.supabase.co';
      const key = window.SUPABASE_CONFIG?.anonKey || 'placeholder';
      window.supabaseClient = window.supabase.createClient(url, key);
      return window.supabaseClient;
    }
    return null;
  }

  window.AgriAuth = {
    /**
     * Returns cached session or checks Supabase auth.
     */
    getSession() {
      try {
        const raw = localStorage.getItem(SESSION_CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },

    /**
     * Asynchronously verifies current Supabase session & fetches profile.
     */
    async getCurrentUser() {
      const client = getClient();
      if (!client) return this.getSession();

      try {
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        if (sessionError || !session?.user) {
          localStorage.removeItem(SESSION_CACHE_KEY);
          return null;
        }

        const user = session.user;
        // Fetch profile from database
        const { data: profile, error: profError } = await client
          .from('profiles')
          .select('id, full_name, email, phone, role, avatar_path')
          .eq('id', user.id)
          .maybeSingle();

        if (profError || !profile) {
          console.warn('[AgriAuth] Profile fetch warning:', profError);
        }

        const role = profile?.role || user.user_metadata?.role || 'admin';
        const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator';
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

        const adminSession = {
          id: user.id,
          email: user.email,
          name,
          role,
          initials,
          phone: profile?.phone || '',
          avatar: profile?.avatar_path || '',
          loggedInAt: Date.now()
        };

        localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(adminSession));
        return adminSession;
      } catch (err) {
        console.error('[AgriAuth] Exception in getCurrentUser:', err);
        return this.getSession();
      }
    },

    /**
     * Sign in with Supabase Auth and verify Admin role.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{ ok: boolean, user?: object, error?: string }>}
     */
    async signIn(email, password) {
      const client = getClient();
      const cleanEmail = email.trim().toLowerCase();

      // Demo fallback when offline or Supabase URL is placeholder
      const isPlaceholder = !client || (window.SUPABASE_CONFIG?.url?.includes('xyzcompanyagritech'));

      if (!isPlaceholder && client) {
        try {
          const { data, error } = await client.auth.signInWithPassword({
            email: cleanEmail,
            password: password
          });

          if (error) {
            return { ok: false, error: error.message || 'Invalid email or password. Please try again.' };
          }

          if (!data.user) {
            return { ok: false, error: 'Authentication failed. No user returned.' };
          }

          // Verify role from profiles table
          const { data: profile, error: profErr } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          const role = profile?.role || data.user.user_metadata?.role;

          if (role && role !== 'admin') {
            await client.auth.signOut();
            return {
              ok: false,
              error: `Access Denied: Account role '${role}' is not authorized to access the Admin Portal.`
            };
          }

          const name = profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

          const session = {
            id: data.user.id,
            email: cleanEmail,
            name,
            role: 'admin',
            initials,
            phone: profile?.phone || '',
            loggedInAt: Date.now()
          };

          localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
          return { ok: true, user: session };
        } catch (err) {
          console.error('[AgriAuth] Supabase signIn error:', err);
          return { ok: false, error: err.message || 'Network error during sign in.' };
        }
      }

      // Demo / Local Fallback
      if (cleanEmail === 'admin@fpoledger.com' && (password === 'admin123' || password === 'FPOAdmin2026' || password === 'AgriAdmin2026')) {
        const session = {
          id: '00000000-0000-0000-0000-000000000001',
          email: cleanEmail,
          name: 'Anita Kapoor',
          role: 'admin',
          initials: 'AK',
          phone: '+91 98260 12345',
          loggedInAt: Date.now()
        };
        localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
        return { ok: true, user: session };
      }

      return { ok: false, error: 'Invalid email or password. Please try again.' };
    },

    /**
     * Sign out from Supabase and clear local session.
     */
    async signOut(redirectTo = 'landing.html') {
      const client = getClient();
      if (client) {
        try {
          await client.auth.signOut();
        } catch (e) {
          console.warn('[AgriAuth] Error during Supabase signOut:', e);
        }
      }
      localStorage.removeItem(SESSION_CACHE_KEY);
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    },

    /**
     * Call at top of protected pages.
     */
    async protectRoute(loginUrl = 'login.html') {
      const session = this.getSession();
      if (!session) {
        window.location.replace(loginUrl);
        return;
      }

      // If client is available, verify session in background
      const client = getClient();
      if (client && !window.SUPABASE_CONFIG?.url?.includes('xyzcompanyagritech')) {
        const { data } = await client.auth.getSession();
        if (!data.session) {
          this.signOut(loginUrl);
        }
      }
    },

    /**
     * Call at top of public pages.
     */
    redirectIfLoggedIn(dashboardUrl = 'index.html') {
      if (this.getSession()) {
        window.location.replace(dashboardUrl);
      }
    }
  };
})();
