import React from 'react';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

function AppLayoutInner({
  children,
  activeView = 'dashboard',
  setActiveView = () => {},
  onOpenProfile,
  onOpenDisputes,
  disputeCount = 0
}) {
  const { isDesktop, isDrawerOpen, closeDrawer } = useSidebar();

  return (
    <div className="app-shell">
      {/* Mobile / Tablet Drawer Overlay Backdrop */}
      {!isDesktop && isDrawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Shared Responsive Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenProfile={onOpenProfile}
        onOpenDisputes={onOpenDisputes}
        disputeCount={disputeCount}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header onOpenProfile={onOpenProfile} />
        {children}
      </div>
    </div>
  );
}

export function AppLayout(props) {
  return (
    <SidebarProvider>
      <AppLayoutInner {...props} />
    </SidebarProvider>
  );
}
