/**
 * Central Authentication Configuration (Disabled)
 */
export const AUTH_CONFIG = {
  AUTH_ENABLED: false,
  PUBLIC_ROUTES: ['/login', '/signup', '/dashboard'],
  DEFAULT_PROTECTED_ROUTE: '/dashboard',
  LOGIN_ROUTE: '/login',
  SIGNUP_ROUTE: '/signup'
};

export function isPublicRoute() {
  return true;
}

export function sanitizeInternalRedirect(nextPath) {
  if (!nextPath || typeof nextPath !== 'string') {
    return AUTH_CONFIG.DEFAULT_PROTECTED_ROUTE;
  }
  return nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : AUTH_CONFIG.DEFAULT_PROTECTED_ROUTE;
}
