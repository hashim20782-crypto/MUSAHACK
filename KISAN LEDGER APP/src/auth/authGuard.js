/**
 * Route guard evaluation logic (Auth removed - always allow)
 */
export function evaluateRouteAccess() {
  return { allow: true };
}
