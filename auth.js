/**
 * FPO Ledger Auth Utility (Demo / Mock Auth)
 * -----------------------------------------
 * Uses localStorage to persist a session flag.
 * Replace this module with a real backend (e.g. Supabase) when moving to production.
 *
 * Demo credentials:
 *   Email:    admin@fpoledger.com
 *   Password: admin123 (or FPOAdmin2026)
 */

(function () {
  'use strict';

  // ── Private constants ────────────────────────────────────────────────────────
  const SESSION_KEY = 'fpoledger_session';

  // Demo credential store (hashed via btoa for light obfuscation — NOT production-safe)
  const DEMO_USERS = [
    {
      emailHash: btoa('admin@fpoledger.com'),
      passHash:  btoa('admin123'),
      name:      'Anita Kapoor',
      role:      'Principal Admin',
      initials:  'AK'
    },
    {
      emailHash: btoa('admin@fpoledger.com'),
      passHash:  btoa('FPOAdmin2026'),
      name:      'Anita Kapoor',
      role:      'Principal Admin',
      initials:  'AK'
    },
    {
      emailHash: btoa('admin@fpoledger.com'),
      passHash:  btoa('AgriAdmin2026'),
      name:      'Anita Kapoor',
      role:      'Principal Admin',
      initials:  'AK'
    }
  ];

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Returns the current session object, or null if not logged in.
   * @returns {{ name: string, role: string, initials: string, email: string } | null}
   */
  window.AgriAuth = {

    getSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },

    /**
     * Attempt to sign in with email + password.
     * @returns {{ ok: boolean, user?: object, error?: string }}
     */
    signIn(email, password) {
      const eHash = btoa(email.trim().toLowerCase());
      const pHash = btoa(password);

      const match = DEMO_USERS.find(
        u => u.emailHash === eHash && u.passHash === pHash
      );

      if (!match) {
        return { ok: false, error: 'Invalid email or password. Please try again.' };
      }

      const session = {
        name:     match.name,
        role:     match.role,
        initials: match.initials,
        email:    email.trim().toLowerCase(),
        loggedInAt: Date.now()
      };

      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (_) {
        // Storage quota exceeded or private browsing with strict settings
      }

      return { ok: true, user: session };
    },

    /** Remove the session and optionally redirect. */
    signOut(redirectTo = 'landing.html') {
      localStorage.removeItem(SESSION_KEY);
      if (redirectTo) window.location.href = redirectTo;
    },

    /**
     * Call at the top of any protected page.
     * Redirects to /login.html if no valid session exists.
     */
    protectRoute() {
      if (!this.getSession()) {
        window.location.replace('login.html');
      }
    },

    /**
     * Call at the top of public pages (landing, login).
     * If already logged in, redirect straight to dashboard.
     */
    redirectIfLoggedIn(dashboardUrl = 'index.html') {
      if (this.getSession()) {
        window.location.replace(dashboardUrl);
      }
    }
  };
})();
