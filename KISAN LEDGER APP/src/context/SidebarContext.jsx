import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SidebarContext = createContext({
  isDesktop: true,
  isDesktopOpen: true,
  isDrawerOpen: false,
  isSidebarOpenOnScreen: true,
  toggleSidebar: () => {},
  closeDrawer: () => {},
  headerBtnRef: { current: null },
  sidebarBtnRef: { current: null }
});

export function SidebarProvider({ children }) {
  // Check if viewport is desktop (> 900px)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 900;
    }
    return true;
  });

  // Desktop open/close choice remembered in localStorage (default: true)
  const [isDesktopOpen, setIsDesktopOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-open');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // localStorage disabled or restricted
    }
    return true;
  });

  // Tablet/Mobile off-canvas drawer (default: false, never persisted)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Button refs for seamless focus handover
  const headerBtnRef = useRef(null);
  const sidebarBtnRef = useRef(null);

  // Sync data-sidebar attribute for zero-flash styling
  useEffect(() => {
    try {
      if (isDesktop) {
        document.documentElement.setAttribute('data-sidebar', isDesktopOpen ? 'open' : 'closed');
      } else {
        document.documentElement.setAttribute('data-sidebar', isDrawerOpen ? 'open' : 'closed');
      }
    } catch {
      // ignore DOM errors
    }
  }, [isDesktop, isDesktopOpen, isDrawerOpen]);

  // Lock/unlock body scroll when mobile drawer opens/closes
  useEffect(() => {
    if (!isDesktop && isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, isDrawerOpen]);

  // Handle window resizing across the 900px breakpoint
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 900;
      setIsDesktop(desktop);
      if (desktop && isDrawerOpen) {
        setIsDrawerOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDrawerOpen]);

  // Close drawer on Escape key and return focus
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      headerBtnRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth > 900) {
      setIsDesktopOpen((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('sidebar-open', String(next));
          document.documentElement.setAttribute('data-sidebar', next ? 'open' : 'closed');
        } catch {
          // ignore storage errors
        }
        // Focus handover
        setTimeout(() => {
          if (next) {
            sidebarBtnRef.current?.focus();
          } else {
            headerBtnRef.current?.focus();
          }
        }, 50);
        return next;
      });
    } else {
      setIsDrawerOpen((prev) => {
        const next = !prev;
        setTimeout(() => {
          if (next) {
            sidebarBtnRef.current?.focus();
          } else {
            headerBtnRef.current?.focus();
          }
        }, 50);
        return next;
      });
    }
  }, []);

  const isSidebarOpenOnScreen = isDesktop ? isDesktopOpen : isDrawerOpen;

  return (
    <SidebarContext.Provider
      value={{
        isDesktop,
        isDesktopOpen,
        isDrawerOpen,
        isSidebarOpenOnScreen,
        toggleSidebar,
        closeDrawer,
        headerBtnRef,
        sidebarBtnRef
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
