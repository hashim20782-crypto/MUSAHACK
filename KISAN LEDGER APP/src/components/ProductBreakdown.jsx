import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { Wheat, Layers, IndianRupee } from 'lucide-react';

export function ProductBreakdown() {
  const { t, lang } = useLanguage();
  const { summaries } = useTransactions();

  const products = summaries.productBreakdown || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('myProduce')}</h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {lang === 'hi' 
              ? 'फसल अनुसार बेची गई मात्रा, ग्रेड विभाजन एवं कुल कमाई' 
              : 'Delivered volume, grade distribution & net earnings per crop'}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: '14px'
      }}>
        {products.map((item) => (
          <div
            key={item.product}
            style={{
              backgroundColor: 'var(--bg-nested)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-subtle)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Wheat size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {lang === 'hi' ? item.productHi || item.product : item.product}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.count} {lang === 'hi' ? 'तौल पर्चियां' : 'slips'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="mono-num" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{item.totalAmount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {t('earnings')}
                </div>
              </div>
            </div>

            {/* Total weight banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('soldKg')}</span>
              <span className="mono-num" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.totalWeight.toLocaleString('en-IN')} kg
              </span>
            </div>

            {/* Grade breakdown split */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              textAlign: 'center',
              fontSize: '0.75rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px'
              }}>
                <div style={{ color: 'var(--primary)', fontWeight: 700 }}>Grade A</div>
                <div className="mono-num" style={{ fontWeight: 600, marginTop: '2px' }}>{item.gradeA} kg</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(212, 167, 44, 0.08)',
                border: '1px solid rgba(212, 167, 44, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px'
              }}>
                <div style={{ color: 'var(--amber-text)', fontWeight: 700 }}>Grade B</div>
                <div className="mono-num" style={{ fontWeight: 600, marginTop: '2px' }}>{item.gradeB} kg</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px'
              }}>
                <div style={{ color: 'var(--red-text)', fontWeight: 700 }}>Grade C</div>
                <div className="mono-num" style={{ fontWeight: 600, marginTop: '2px' }}>{item.gradeC} kg</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
