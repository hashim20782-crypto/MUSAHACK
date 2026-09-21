import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // localStorage may be disabled or throw security errors
    }
    // Dark is always the default per specification (do not derive from prefers-color-scheme)
    return 'dark';
  });

  const transitionTimeoutRef = useRef(null);

  // Sync data-theme attribute and localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch {
      // gracefully ignore storage errors
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [theme]);

  const applyThemeWithTransition = (nextTheme) => {
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transition');
      // Force style recalculation so the browser registers the transition baseline with the current colors
      void document.documentElement.offsetHeight;

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 350);
    }

    try {
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    } catch {
      // ignore storage errors
    }

    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyThemeWithTransition(nextTheme);
  };

  const setTheme = (newTheme) => {
    if ((newTheme === 'dark' || newTheme === 'light') && newTheme !== theme) {
      applyThemeWithTransition(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
