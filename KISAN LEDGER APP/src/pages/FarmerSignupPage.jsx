import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../components/Router';
import { 
  UserCheck, 
  Scale, 
  Languages, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Wheat, 
  BadgeCheck 
} from 'lucide-react';

export function FarmerSignupPage() {
  const { currentUser, completeProfile } = useAuth();
  const { t, lang, setLanguage, toggleLanguage } = useLanguage();
  const { navigate, ROUTES } = useRouter();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [memberId, setMemberId] = useState(
    currentUser?.farmerId || `MH-NSK-2024-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [phone] = useState(currentUser?.phone || '9876543210');
  const [fpoName, setFpoName] = useState(currentUser?.fpoName || 'Sahyadri Farmers Producer Co.');
  const [village, setVillage] = useState(currentUser?.village || 'Ozar Mig');
  const [district, setDistrict] = useState(currentUser?.district || 'Nashik, Niphad');
  const [primaryCrop, setPrimaryCrop] = useState(currentUser?.primaryCrop || 'Wheat');
  const [selectedLang, setSelectedLang] = useState(lang);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!memberId.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना सदस्य आईडी दर्ज करें।' : 'Please enter your Member ID.');
      return;
    }

    // Update language if changed
    setLanguage(selectedLang);

    completeProfile({
      name: fullName.trim(),
      farmerId: memberId.trim().toUpperCase(),
      phone,
      fpoName,
      village: village.trim(),
      district: district.trim(),
      primaryCrop,
      language: selectedLang,
      isProfileComplete: true
    });

    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'max(16px, env(safe-area-inset-top, 16px)) max(16px, env(safe-area-inset-right, 16px)) max(24px, env(safe-area-inset-bottom, 24px)) max(16px, env(safe-area-inset-left, 16px))'
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto 24px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--nav-bg)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Scale size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {t('appTitle')}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              {t('appSubtitle')}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="btn btn-outline btn-sm"
          style={{ gap: '6px', minHeight: '44px', minWidth: '44px' }}
        >
          <Languages size={15} color="var(--primary)" />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>
      </header>

      {/* Main Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0 40px 0'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-card)',
          padding: '28px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--primary-subtle)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '16px'
          }}>
            <BadgeCheck size={14} />
            <span>FPO Membership Registration</span>
          </div>

          <h1 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>
            {t('completeProfileTitle')}
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {t('completeProfileSubtitle')}
          </p>

          {errorMsg && (
            <div style={{
              backgroundColor: 'var(--red-subtle)',
              border: '1px solid var(--red-border)',
              color: 'var(--red-text)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: '18px'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group">
              <label className="label-caps">{t('fullName')}</label>
              <input
                type="text"
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px' }}>
              <div className="input-group">
                <label className="label-caps">{t('memberId')}</label>
                <input
                  type="text"
                  className="input-field input-field-mono"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder={t('memberIdPlaceholder')}
                  required
                />
              </div>

              <div className="input-group">
                <label className="label-caps">{t('phoneNumber')}</label>
                <input
                  type="text"
                  className="input-field input-field-mono"
                  value={phone}
                  readOnly
                  style={{ color: 'var(--text-secondary)', opacity: 0.8 }}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label-caps">{t('fpoName')}</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="select-field"
                  value={fpoName}
                  onChange={(e) => setFpoName(e.target.value)}
                >
                  <option value="Sahyadri Farmers Producer Co.">Sahyadri Farmers Producer Co.</option>
                  <option value="Godavari Agri Producers FPO">Godavari Agri Producers FPO</option>
                  <option value="MahaKisan Cooperative Hub">MahaKisan Cooperative Hub</option>
                  <option value="Nashik Krishi Vikas FPO">Nashik Krishi Vikas FPO</option>
                </select>
                <Building2 size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px' }}>
              <div className="input-group">
                <label className="label-caps">{t('village')}</label>
                <input
                  type="text"
                  className="input-field"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t('villagePlaceholder')}
                />
              </div>

              <div className="input-group">
                <label className="label-caps">{t('district')}</label>
                <input
                  type="text"
                  className="input-field"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t('districtPlaceholder')}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px' }}>
              <div className="input-group">
                <label className="label-caps">{t('primaryCrop')}</label>
                <select
                  className="select-field"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                >
                  <option value="Wheat">Wheat (गेहूँ)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Rice / Paddy">Rice / Paddy (धान)</option>
                  <option value="Chana (Gram)">Chana (चना)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Other">Other Crop</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label-caps">{t('preferredLang')}</label>
                <select
                  className="select-field"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', minHeight: '48px', marginTop: '10px' }}
            >
              <span>{t('saveProfileBtn')}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
