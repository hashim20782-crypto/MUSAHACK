import React from 'react';
import { evaluateRouteAccess } from './authGuard.js';
import { useRouter } from '../components/Router';

export { evaluateRouteAccess };

/**
 * ProtectedRoute component wrapper
 */
export function ProtectedRoute({ children, currentRoute }) {
  const { navigate } = useRouter();
  const access = evaluateRouteAccess(currentRoute);

  React.useEffect(() => {
    if (!access.allow && access.redirectTo) {
      navigate(access.redirectTo);
    }
  }, [access.allow, access.redirectTo, navigate]);

  if (!access.allow) {
    return null;
  }

  return <>{children}</>;
}
