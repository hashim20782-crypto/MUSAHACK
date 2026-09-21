import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Save, 
  CheckCircle2,
  Languages
} from 'lucide-react';

export function ProfileView() {
  const { currentUser, completeProfile } = useAuth();
  const { lang, t, toggleLanguage } = useLanguage();

  const [formData, setFormData] = useState(() => ({
    name: currentUser?.name || 'Ramesh Baburao Patil',
    phone: currentUser?.phone || '9876543210',
    village: currentUser?.village || 'Ozar Mig',
    district: currentUser?.district || 'Nashik, Niphad',
    primaryCrop: currentUser?.primaryCrop || 'Wheat',
    fpoName: currentUser?.fpoName || 'Sahyadri Farmers Producer Co.',
    bankAccount: '•••• •••• 4419',
    ifscCode: 'MAHB0000214'
  }));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    completeProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
    // Exact user alert specification:
    alert("Profile saved (demo only — wire this up to your backend).");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '840px' }}>
      {/* Verified Member ID Card */}
      <div style={{
        backgroundColor: 'var(--nav-bg)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#071f16',
            border: '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: '1.4rem',
            fontWeight: 800
          }}>
            {formData.name.charAt(0) || 'R'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="label-caps" style={{ color: 'var(--nav-muted)' }}>FPO Verified Farmer</span>
              <span className="badge badge-confirmed">
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {formData.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--nav-muted)', marginTop: '2px' }}>
              {formData.fpoName}
            </div>
          </div>
        </div>

        <div>
          <span className="label-caps" style={{ color: 'var(--nav-muted)' }}>Producer ID</span>
          <div className="mono-num" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {currentUser?.farmerId || 'MH-NSK-2024-8842'}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: 'var(--primary-subtle)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--primary)',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {/* Main Profile Form: #profileForm */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {lang === 'hi' ? 'किसान व्यक्तिगत विवरण' : 'Producer Profile & Bank Details'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {lang === 'hi'
                ? 'सरकारी खरीद एवं एफपीओ सीधी बिक्री हेतु अधिकृत विवरण'
                : 'Certified information used for MSP weighing receipts and direct bank transfers'}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px' }}
          >
            <Languages size={14} color="var(--primary)" />
            <span>{lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
          </button>
        </div>

        <form id="profileForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Full Name */}
            <div className="input-group">
              <label className="label-caps">{t('fullName')}</label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="input-group">
              <label className="label-caps">{t('phoneNumber')}</label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                className="input-field mono-num"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Village */}
            <div className="input-group">
              <label className="label-caps">{t('village')}</label>
              <input
                type="text"
                name="village"
                className="input-field"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>

            {/* District */}
            <div className="input-group">
              <label className="label-caps">{t('district')}</label>
              <input
                type="text"
                name="district"
                className="input-field"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Primary Crop */}
            <div className="input-group">
              <label className="label-caps">{t('primaryCrop')}</label>
              <select
                name="primaryCrop"
                className="select-field"
                value={formData.primaryCrop}
                onChange={handleChange}
              >
                <option value="Wheat">Wheat (गेहूँ)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Rice">Rice / Paddy (धान)</option>
                <option value="Chana">Chana (चना)</option>
                <option value="Tomatoes">Tomatoes (टमाटर)</option>
                <option value="Mangoes">Mangoes (आम)</option>
              </select>
            </div>

            {/* Associated FPO */}
            <div className="input-group">
              <label className="label-caps">{t('fpoOrganization')}</label>
              <input
                type="text"
                name="fpoName"
                className="input-field"
                value={formData.fpoName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Banking details section */}
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>Direct DBT Bank Account (Verified)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="input-group">
                <label className="label-caps">Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  className="input-field mono-num"
                  value={formData.bankAccount}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="label-caps">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  className="input-field mono-num"
                  value={formData.ifscCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ gap: '8px', minWidth: '160px', height: '48px', minHeight: '48px', width: '100%' }}
            >
              <Save size={16} />
              <span>{lang === 'hi' ? 'विवरण सुरक्षित करें' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
