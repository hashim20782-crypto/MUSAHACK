import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  LayoutDashboard, 
  User, 
  Languages, 
  Scale, 
  AlertTriangle 
} from 'lucide-react';

import { HamburgerButton } from './HamburgerButton';

export function Sidebar({ 
  activeView, 
  setActiveView, 
  disputeCount = 0,
  onClose = () => {}
}) {
  const { currentUser } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { isDesktop, isDesktopOpen, isDrawerOpen, isSidebarOpenOnScreen, toggleSidebar, closeDrawer, sidebarBtnRef } = useSidebar();

  const handleNavClick = (view) => {
    setActiveView(view);
    closeDrawer();
    if (onClose) onClose();
  };

  const isCollapsed = isDesktop && !isDesktopOpen;

  return (
    <aside 
      id="app-sidebar"
      className={`app-sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${!isDesktop && isDrawerOpen ? 'drawer-open' : ''}`}
      aria-label="Main Application Navigation"
      aria-hidden={isCollapsed || (!isDesktop && !isDrawerOpen)}
    >
      {/* Top Brand Section with In-Sidebar Hamburger */}
      <div>
        <div className="sidebar-header">
          {/* Stationary In-Sidebar Hamburger Button (Visible only when sidebar is OPEN) */}
          <HamburgerButton
            ref={sidebarBtnRef}
            id="sidebar-toggle-btn-sidebar"
            isOpen={isSidebarOpenOnScreen}
            isVisible={isSidebarOpenOnScreen}
            onClick={toggleSidebar}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--nav-bg-darker)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              <Scale size={20} />
            </div>
            <div className="brand-text">
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--nav-text)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                {t('appTitle')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--nav-muted)', whiteSpace: 'nowrap' }}>
                {t('appSubtitle')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items with Accessible <nav> and aria-current */}
        <nav aria-label="Primary Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 16px' }}>
          <button
            type="button"
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            data-page="dashboard"
            onClick={() => handleNavClick('dashboard')}
            aria-current={activeView === 'dashboard' ? 'page' : undefined}
            title={t('dashboard')}
          >
            <LayoutDashboard size={18} color={activeView === 'dashboard' ? 'var(--primary)' : 'currentColor'} style={{ flexShrink: 0 }} />
            <span className="nav-label">{t('dashboard')}</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeView === 'disputes' ? 'active' : ''}`}
            data-page="disputes"
            onClick={() => handleNavClick('disputes')}
            aria-current={activeView === 'disputes' ? 'page' : undefined}
            title={lang === 'hi' ? 'आपत्तियां' : 'Disputes'}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={18} color={activeView === 'disputes' ? 'var(--amber)' : 'currentColor'} style={{ flexShrink: 0 }} />
              <span className="nav-label">{lang === 'hi' ? 'आपत्तियां' : 'Disputes'}</span>
            </div>
            <span
              id="disputeBadge"
              className="nav-label"
              style={{
                display: disputeCount > 0 ? 'inline-block' : 'none',
                backgroundColor: 'var(--red-subtle)',
                color: 'var(--red-text)',
                border: '1px solid var(--red-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '1px 8px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              {disputeCount || ''}
            </span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
            data-page="profile"
            onClick={() => handleNavClick('profile')}
            aria-current={activeView === 'profile' ? 'page' : undefined}
            title={t('profile')}
          >
            <User size={18} color={activeView === 'profile' ? 'var(--primary)' : 'currentColor'} style={{ flexShrink: 0 }} />
            <span className="nav-label">{t('profile')}</span>
          </button>
        </nav>
      </div>

      {/* Bottom Actions: Theme Toggle, Language & Farmer Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px 16px 24px 16px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Dark / Light Theme Toggle in Sidebar */}
        <ThemeToggle variant="sidebar" />

        {/* Language switch button */}
        <button
          type="button"
          onClick={toggleLanguage}
          title="Toggle Language"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            minHeight: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(0,0,0,0.12)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--nav-text)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Languages size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span className="lang-toggle-text">Language</span>
          </div>
          <span 
            className="lang-toggle-text"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.82rem'
            }}
          >
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </span>
        </button>

        {/* Farmer Info compact card */}
        {currentUser && (
          <div 
            className="user-info-card"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--nav-bg-darker)',
              border: '1px solid var(--primary-border)',
              fontSize: '0.76rem'
            }}
          >
            <div className="user-info-text" style={{ fontWeight: 700, color: 'var(--nav-text)', marginBottom: '2px' }}>
              {currentUser?.name || 'Ramesh Patil'}
            </div>
            <div className="user-info-text" style={{ color: 'var(--nav-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentUser?.farmerId || 'MH-NSK-2024-8842'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
