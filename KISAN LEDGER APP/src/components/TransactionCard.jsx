import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Camera, 
  Lock, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2,
  ShieldCheck
} from 'lucide-react';

export function TransactionCard({ 
  transaction, 
  onSelect, 
  onOpenRaiseIssue, 
  onOpenOtp 
}) {
  const { t, lang } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(true);

  const isConfirmed = transaction.farmerConfirmed;
  const isAwaiting = !transaction.farmerConfirmed;
  const hasIssue = transaction.issueStatus === 'Raised';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        padding: '0',
        overflow: 'hidden'
      }}
      onClick={() => onSelect(transaction)}
    >
      {/* 1. Consignment Image at top */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        backgroundColor: '#080908',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-card)'
      }}>
        {transaction.consignmentImage && imageLoaded ? (
          <img
            src={transaction.consignmentImage}
            alt={transaction.product}
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
            gap: '6px',
            color: 'var(--text-muted)'
          }}>
            <Camera size={26} />
            <span style={{ fontSize: '0.78rem' }}>{t('photoUnavailable')}</span>
          </div>
        )}

        {/* Top Badges over photo */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          {/* Status Badge */}
          {hasIssue ? (
            <span className="badge badge-issue">
              <span className="badge-dot" />
              <span>{t('statusIssue')}</span>
            </span>
          ) : isConfirmed ? (
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

          {/* Locked Badge */}
          {transaction.locked && (
            <span className="badge badge-locked">
              <Lock size={11} />
              <span>{t('statusLocked')}</span>
            </span>
          )}
        </div>

        {/* Photo Bottom HUD Info */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.72rem',
          color: '#e5e7eb',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>{transaction.transactionId}</span>
          <span>{transaction.date}</span>
        </div>
      </div>

      {/* 2. Card Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Title row: Product & Grade */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, overflowWrap: 'anywhere' }}>
              {lang === 'hi' ? transaction.productHi || transaction.product : transaction.product}
            </h3>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span>{transaction.time}</span>
              <span>•</span>
              <span>{transaction.station}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`grade-pill ${
              transaction.qualityGrade?.includes('A')
                ? 'grade-pill-a'
                : transaction.qualityGrade?.includes('B')
                ? 'grade-pill-b'
                : 'grade-pill-c'
            }`}>
              {transaction.qualityGrade}
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {transaction.qualityGrade?.includes('A') 
                ? (lang === 'hi' ? 'सुपर / प्रीमियम' : 'Premium') 
                : transaction.qualityGrade?.includes('B') 
                ? (lang === 'hi' ? 'मानक खरीद' : 'Standard') 
                : (lang === 'hi' ? 'सामान्य' : 'Fair')}
            </div>
          </div>
        </div>

        {/* Weights Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'var(--bg-nested)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px',
          textAlign: 'center'
        }}>
          <div>
            <div className="label-caps" style={{ fontSize: '0.65rem' }}>{t('grossWeight')}</div>
            <div className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
              {transaction.grossWeight} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div className="label-caps" style={{ fontSize: '0.65rem' }}>{t('tareWeight')}</div>
            <div className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px', color: 'var(--amber-text)' }}>
              {transaction.tareWeight} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>
          <div>
            <div className="label-caps" style={{ fontSize: '0.65rem', color: 'var(--primary)' }}>{t('netWeight')}</div>
            <div className="mono-num" style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>
              {transaction.netWeight} <span style={{ fontSize: '0.7rem' }}>kg</span>
            </div>
          </div>
        </div>

        {/* Rate & Net Amount */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2px'
        }}>
          <div>
            <span className="label-caps">{t('ratePerKg')}</span>
            <div className="mono-num" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              ₹{transaction.ratePerKg.toFixed(2)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="label-caps">{t('amount')}</span>
            <div className="mono-num" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{transaction.netAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Action Buttons (Prominent Raise Issue & OTP confirmation) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}
          onClick={(e) => e.stopPropagation()}
        >
          {isAwaiting && (
            <button
              type="button"
              onClick={() => onOpenOtp(transaction)}
              className="btn btn-amber btn-sm"
              style={{ flex: 1, minHeight: '44px', padding: '7px 10px' }}
            >
              <span>{t('confirmDelivery')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenRaiseIssue(transaction)}
            className="btn btn-outline btn-sm"
            style={{
              flex: isAwaiting ? 'none' : 1,
              borderColor: hasIssue ? 'var(--red-border)' : 'var(--border-card)',
              color: hasIssue ? 'var(--red-text)' : 'var(--text-primary)',
              gap: '6px',
              minHeight: '44px',
              padding: '7px 12px'
            }}
          >
            <AlertTriangle size={14} color={hasIssue ? 'var(--red)' : 'var(--amber)'} />
            <span>{hasIssue ? (lang === 'hi' ? 'समस्या समीक्षाधीन' : 'Issue Under Review') : t('raiseIssue')}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(transaction)}
            className="btn btn-secondary btn-sm"
            style={{ minHeight: '44px', padding: '7px 12px', gap: '4px' }}
            title="View Details"
          >
            <span>{t('viewDetails')}</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
