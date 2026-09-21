import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../components/Router';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Scale, 
  ShieldCheck, 
  Languages, 
  ArrowRight, 
  User, 
  Mail, 
  Lock,
  Info,
  AlertCircle
} from 'lucide-react';

export function SignupPage() {
  const { signup } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { navigate, ROUTES, getNextParam } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setNoticeMsg('');

    // Basic client-side validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError(lang === 'hi' ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError(lang === 'hi' ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    if (!password) {
      setValidationError(lang === 'hi' ? 'कृपया एक पासवर्ड दर्ज करें।' : 'Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setValidationError(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(lang === 'hi' ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं।' : 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calls stubbed signup service function
      const result = await signup({ name: trimmedName, email: trimmedEmail, password });

      // Submitting must NOT create fake users or attempt real authentication
      // Show clear, non-alarming inline notice per specification
      setNoticeMsg(result?.message || "Authentication isn't connected yet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextDestination = getNextParam();

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: 'max(16px, env(safe-area-inset-top, 16px)) max(16px, env(safe-area-inset-right, 16px)) max(24px, env(safe-area-inset-bottom, 24px)) max(16px, env(safe-area-inset-left, 16px))'
    }}>
      {/* Top Header Bar with Theme Toggle & Language Switcher */}
      <header style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto 24px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px', minHeight: '44px', minWidth: '44px' }}
            aria-label="Change language"
          >
            <Languages size={15} color="var(--primary)" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Center Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0 40px 0'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-card)',
          padding: '28px 20px',
          boxShadow: 'var(--shadow-modal)'
        }}>
          {/* Station Provenance Tag */}
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
            <ShieldCheck size={14} />
            <span>{t('stationTag')}</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
            {lang === 'hi' ? 'नया खाता बनाएं' : 'Create an account'}
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {lang === 'hi' 
              ? 'एफपीओ खरीद लेजर और डिजिटल रसीदों से जुड़ने के लिए पंजीकरण करें' 
              : 'Sign up to connect with official FPO procurement records and digital slips'}
          </p>

          {/* Non-alarming Inline Notice when submitted */}
          {noticeMsg && (
            <div
              role="status"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: 'var(--primary-subtle)',
                border: '1px solid var(--primary-border)',
                color: 'var(--primary)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                lineHeight: 1.45,
                marginBottom: '20px'
              }}
            >
              <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>{noticeMsg}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  {lang === 'hi' 
                    ? 'डेटाबेस अभी जुड़ा नहीं है। डेवलपर बाईपास फ्लैग का उपयोग कर सकते हैं।' 
                    : 'Backend database connection is pending. Developer mode can be enabled via AUTH_ENABLED config.'}
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--red-subtle)',
                border: '1px solid var(--red-border)',
                color: 'var(--red-text)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label htmlFor="signup-name" className="label-caps">
                {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  enterKeyHint="next"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Patil"
                  className="input-field"
                  aria-required="true"
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signup-email" className="label-caps">
                {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-email"
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@fpo-hub.in"
                  className="input-field"
                  aria-required="true"
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signup-password" className="label-caps">
                {lang === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type="password"
                  enterKeyHint="next"
                  name="new-password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field"
                  aria-required="true"
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signup-confirm-password" className="label-caps">
                {lang === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-confirm-password"
                  type="password"
                  enterKeyHint="done"
                  name="confirm-password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field"
                  aria-required="true"
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', minHeight: '48px', marginTop: '6px' }}
            >
              <span>{isSubmitting ? (lang === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating account...') : (lang === 'hi' ? 'साइन अप करें' : 'Sign up')}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Link to Login */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)'
          }}>
            <span>{lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}</span>{' '}
            <button
              type="button"
              onClick={() => navigate(`${ROUTES.LOGIN}${nextDestination !== ROUTES.DASHBOARD ? `?next=${encodeURIComponent(nextDestination)}` : ''}`)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.86rem'
              }}
            >
              {lang === 'hi' ? 'लॉग इन करें' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
