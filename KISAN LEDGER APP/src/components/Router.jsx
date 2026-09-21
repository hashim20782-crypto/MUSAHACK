import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouterContext = createContext();

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FARMER_SIGNUP: '/farmer-signup',
  DASHBOARD: '/dashboard'
};

export function RouterProvider({ children }) {
  // Normalize window location to a route path, default always to DASHBOARD
  const getInitialPath = () => {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('/farmer-signup')) return ROUTES.FARMER_SIGNUP;
    if (pathname.includes('/signup')) return ROUTES.SIGNUP;
    if (pathname.includes('/login')) return ROUTES.LOGIN;
    return ROUTES.DASHBOARD;
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialPath);

  // Navigate using pushState
  const navigate = useCallback((target) => {
    let finalPath = target || ROUTES.DASHBOARD;
    const [pathPart, queryPart] = finalPath.split('?');
    let normalizedPath = pathPart || ROUTES.DASHBOARD;

    const fullUrl = queryPart ? `${normalizedPath}?${queryPart}` : normalizedPath;
    window.history.pushState({}, '', fullUrl);
    setCurrentRoute(normalizedPath);
  }, []);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/farmer-signup')) setCurrentRoute(ROUTES.FARMER_SIGNUP);
      else if (p.includes('/signup')) setCurrentRoute(ROUTES.SIGNUP);
      else if (p.includes('/login')) setCurrentRoute(ROUTES.LOGIN);
      else setCurrentRoute(ROUTES.DASHBOARD);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, ROUTES }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
