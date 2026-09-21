import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  User, 
  Building2, 
  Languages, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';

import { HamburgerButton } from './HamburgerButton';

export function Header({ onOpenProfile }) {
  const { currentUser } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { isSidebarOpenOnScreen, toggleSidebar, headerBtnRef } = useSidebar();

  // Mask phone number: e.g. +91 ******4821
  const maskedPhone = currentUser?.phone
    ? `******${currentUser.phone.slice(-4)}`
    : '******4821';

  return (
    <header className="app-header">
      {/* Left: Floating Hamburger Button + Branding & FPO Badge */}
      <div className="header-left">
        {/* Floating Top-Left Hamburger Button (Visible only when sidebar is CLOSED) */}
        <HamburgerButton
          ref={headerBtnRef}
          id="sidebar-toggle-btn-header"
          isOpen={isSidebarOpenOnScreen}
          isVisible={!isSidebarOpenOnScreen}
          onClick={toggleSidebar}
        />

        <div
          className="header-logo-icon"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--nav-bg)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}
        >
          <Scale size={20} />
        </div>

        <div className="header-brand-wrap">
          <div className="header-title-row">
            <span className="header-title">
              {t('appTitle')}
            </span>
            <span className="header-badge-companion">
              <ShieldCheck size={11} />
              <span>Hub Companion</span>
            </span>
          </div>
          <div className="header-fpo-subtitle">
            <Building2 size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{currentUser?.fpoName || 'Sahyadri Farmers Producer Co.'}</span>
          </div>
        </div>
      </div>

      {/* Right: Farmer Identity Details, Theme Toggle, and Language */}
      <div className="header-right">
        {/* Farmer Profile Pill (Collapses to Avatar on mobile) */}
        {currentUser && (
          <div 
            className="header-user-pill"
            onClick={onOpenProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenProfile(); }}
            title="Click to view full profile"
            aria-label="Farmer profile"
          >
            <div
              className="header-user-avatar"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--nav-bg)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0
              }}
            >
              <User size={18} />
            </div>
            <div className="header-user-details" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Ramesh Patil'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                <span className="mono-num">{currentUser?.farmerId || 'MH-NSK-2024-8842'}</span>
                <span>•</span>
                <span className="mono-num">{maskedPhone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle Button - only visible when sidebar is closed (only one instance visible) */}
        {!isSidebarOpenOnScreen && (
          <ThemeToggle showLabel={false} />
        )}

        {/* Language Selector */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="btn btn-outline btn-sm header-lang-btn"
          style={{ gap: '6px', minWidth: '44px', minHeight: '44px' }}
          title="Toggle Language"
          aria-label="Toggle Language"
        >
          <Languages size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>
      </div>
    </header>
  );
}
