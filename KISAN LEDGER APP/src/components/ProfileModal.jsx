import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from './Router';
import { 
  User, 
  X, 
  Building2, 
  Phone, 
  MapPin, 
  Wheat, 
  ShieldCheck, 
  LogOut, 
  Languages 
} from 'lucide-react';

export function ProfileModal({ onClose }) {
  const { currentUser, logout } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { navigate, ROUTES } = useRouter();

  const handleLogout = () => {
    logout();
    onClose();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>{t('profile')}</h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                FPO Verified Member Ledger
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-outline"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
            aria-label={t('close')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '16px' }}>
          {/* Member Card */}
          <div style={{
            backgroundColor: 'var(--nav-bg)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="label-caps" style={{ color: 'var(--nav-muted)' }}>FPO Member ID</span>
                <div className="mono-num" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {currentUser?.farmerId || 'MH-NSK-2024-8842'}
                </div>
              </div>
              <span className="badge badge-confirmed" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {currentUser?.name || 'Ramesh Baburao Patil'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--nav-muted)', marginTop: '2px' }}>
                {currentUser?.fpoName || 'Sahyadri Farmers Producer Co.'}
              </div>
            </div>
          </div>

          {/* Details list */}
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.86rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('phoneNumber')}</span>
              <span className="mono-num" style={{ fontWeight: 600 }}>+91 {currentUser?.phone}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('village')}</span>
              <span style={{ fontWeight: 600 }}>{currentUser?.village || 'Ozar Mig'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('district')}</span>
              <span style={{ fontWeight: 600 }}>{currentUser?.district || 'Nashik, Niphad'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('primaryCrop')}</span>
              <span style={{ fontWeight: 600 }}>{currentUser?.primaryCrop || 'Wheat'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('preferredLang')}</span>
              <span style={{ fontWeight: 600 }}>{lang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={toggleLanguage}
              className="btn btn-outline"
              style={{ flex: '1 1 140px', minHeight: '44px', gap: '6px' }}
            >
              <Languages size={16} color="var(--primary)" />
              <span>{lang === 'en' ? 'स्विच करें: हिन्दी' : 'Switch: English'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-danger-outline"
              style={{ flex: '1 1 120px', minHeight: '44px', gap: '6px' }}
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
