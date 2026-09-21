import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Camera, 
  Clock, 
  Calendar, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Printer, 
  Building2 
} from 'lucide-react';

export function TransactionDetailModal({ transaction, onClose, onOpenRaiseIssue, onOpenOtp }) {
  const { t, lang } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
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
              <Scale size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>
                {lang === 'hi' ? 'डिजिटल तौल पर्ची' : 'Digital Weighment Receipt'}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="mono-num">
                {transaction.transactionId}
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

        {/* Modal Body */}
        <div className="modal-body">
          {/* Consignment Photo with Tamper Evidence Overlay */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            backgroundColor: '#050505',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-card)'
          }}>
            {transaction.consignmentImage && imageLoaded ? (
              <img
                src={transaction.consignmentImage}
                alt={`${transaction.product} consignment`}
                onError={() => setImageLoaded(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--text-muted)'
              }}>
                <Camera size={36} />
                <span style={{ fontSize: '0.85rem' }}>{t('photoUnavailable')}</span>
              </div>
            )}

            {/* Tamper HUD overlay */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#ffffff'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              <span>TAMPER-EVIDENT CAM-03</span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#d1d5db',
              fontFamily: 'var(--font-mono)'
            }}>
              <span>REC: {transaction.date} {transaction.time}</span>
              <span>{transaction.station}</span>
            </div>
          </div>

          {/* Status & Confirmation Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div className="label-caps" style={{ marginBottom: '2px' }}>Current Record State</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {transaction.issueStatus === 'Raised' ? (
                  <span className="badge badge-issue">
                    <span className="badge-dot" />
                    <span>{t('statusIssue')}</span>
                  </span>
                ) : transaction.farmerConfirmed ? (
                  <span className="badge badge-confirmed">
                    <span className="badge-dot" />
                    <span>{t('statusConfirmed')}</span>
                  </span>
                ) : (
                  <span className="badge badge-pending">
                    <span className="badge-dot" />
                    <span>{t('statusPending')}</span>
                  </span>
                )}

                {transaction.locked && (
                  <span className="badge badge-locked" title="Operator record locked">
                    <Lock size={12} />
                    <span>{t('statusLocked')}</span>
                  </span>
                )}
              </div>
            </div>

            {!transaction.farmerConfirmed && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOtp(transaction);
                }}
                className="btn btn-amber btn-sm"
              >
                <span>{t('confirmDelivery')}</span>
              </button>
            )}
          </div>

          {/* Core Weights & Financials Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'center'
            }}>
              <span className="label-caps">{t('grossWeight')}</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px' }} className="mono-num">
                {transaction.grossWeight} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>kg</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'center'
            }}>
              <span className="label-caps">{t('tareWeight')}</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px', color: 'var(--amber-text)' }} className="mono-num">
                {transaction.tareWeight} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>kg</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'center'
            }}>
              <span className="label-caps" style={{ color: 'var(--primary)' }}>{t('netWeight')}</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }} className="mono-num">
                {transaction.netWeight} <span style={{ fontSize: '0.8rem' }}>kg</span>
              </div>
            </div>
          </div>

          {/* Pricing & Grade */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <span className="label-caps">{t('filterGrade')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span className={`grade-pill ${
                  transaction.qualityGrade?.includes('A')
                    ? 'grade-pill-a'
                    : transaction.qualityGrade?.includes('B')
                    ? 'grade-pill-b'
                    : 'grade-pill-c'
                }`}>
                  {transaction.qualityGrade}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  {transaction.gradeTitle || transaction.qualityGrade}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {transaction.gradeSub}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <span className="label-caps">{t('amount')}</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }} className="mono-num">
                ₹{transaction.netAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Rate: ₹{transaction.ratePerKg} / kg
              </div>
            </div>
          </div>

          {/* Operator Audit & Provenance Information */}
          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Farmer</span>
              <span style={{ fontWeight: 600 }}>{transaction.farmerName} ({transaction.farmerId})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('station')}</span>
              <span style={{ fontWeight: 600 }}>{transaction.station}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('operator')}</span>
              <span style={{ fontWeight: 600 }}>{transaction.operatorId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>OTP Confirmation</span>
              <span style={{ fontWeight: 600, color: transaction.otpVerified ? 'var(--primary)' : 'var(--amber-text)' }}>
                {transaction.otpVerified ? 'Verified via SMS' : 'Pending Farmer Verification'}
              </span>
            </div>
          </div>

          {/* Issue note if raised */}
          {transaction.issueStatus === 'Raised' && (
            <div style={{
              backgroundColor: 'var(--red-subtle)',
              border: '1px solid var(--red-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: 'var(--red-text)' }}>
                  Active Dispute Filed: {transaction.issueType}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  "{transaction.issueDescription}"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="modal-footer" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRaiseIssue(transaction);
            }}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px', minHeight: '44px' }}
          >
            <AlertTriangle size={15} color="var(--red)" />
            <span>{t('raiseIssue')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ minHeight: '44px' }}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
