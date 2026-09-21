import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { ShieldCheck, MessageSquare, CheckCircle2, X, Lock } from 'lucide-react';

export function OtpModal({ transaction, onClose }) {
  const { t, lang } = useLanguage();
  const { confirmOtp } = useTransactions();

  const [otpInput, setOtpInput] = useState(transaction.simulatedOtp || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpInput || otpInput.trim().length < 4) {
      setErrorMsg(lang === 'hi' ? 'कृपया 4-अंकीय ओटीपी दर्ज करें।' : 'Please enter the 4-digit verification OTP.');
      return;
    }

    const verified = confirmOtp(transaction.transactionId, otpInput.trim());
    if (verified) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setErrorMsg(lang === 'hi' ? 'गलत ओटीपी कोड दर्ज किया गया।' : 'Incorrect OTP code entered.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--amber-subtle)',
              border: '1px solid var(--amber-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--amber-text)'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{t('otpModalTitle')}</h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {transaction.transactionId} · {transaction.product} ({transaction.netWeight} kg)
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
        <div className="modal-body">
          {success ? (
            <div style={{
              textAlign: 'center',
              padding: '24px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-subtle)',
                border: '1px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                {t('otpSuccessMsg')}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
                {t('lockedExplanation')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Simulated SMS Alert */}
              <div style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <MessageSquare size={20} color="var(--amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {t('otpSimulatedBanner')} +91 ******{transaction.farmerId?.slice(-4) || '8842'}:
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    "FPO Weighment: {transaction.product} {transaction.netWeight}kg @ ₹{transaction.ratePerKg}/kg. {t('otpCodeLabel')}{' '}
                    <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '1rem', textDecoration: 'underline' }}>
                      {transaction.simulatedOtp || '4829'}
                    </strong>"
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  backgroundColor: 'var(--red-subtle)',
                  border: '1px solid var(--red-border)',
                  color: 'var(--red-text)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem'
                }}>
                  {errorMsg}
                </div>
              )}

              <div className="input-group" style={{ textAlign: 'center' }}>
                <label className="label-caps">{t('otpInstruction')}</label>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  enterKeyHint="done"
                  className="input-field input-numeric-center"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  autoFocus
                  required
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <Lock size={14} />
                <span>{t('lockedExplanation')}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', height: '48px', minHeight: '48px' }}
              >
                <span>{t('verifyAndLockBtn')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
