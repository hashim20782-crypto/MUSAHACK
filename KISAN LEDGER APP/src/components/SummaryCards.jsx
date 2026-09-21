import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { Scale, IndianRupee, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export function SummaryCards() {
  const { t, lang } = useLanguage();
  const { summaries } = useTransactions();

  const totalWeight = summaries.totalWeight || 0;
  const totalAmount = summaries.totalAmount || 0;
  const gradeA = summaries.gradeBreakdown?.A?.weight || 0;
  const gradeB = summaries.gradeBreakdown?.B?.weight || 0;
  const gradeC = summaries.gradeBreakdown?.C?.weight || 0;

  // Percentage calculations for progress bars
  const pctA = totalWeight > 0 ? Math.round((gradeA / totalWeight) * 100) : 0;
  const pctB = totalWeight > 0 ? Math.round((gradeB / totalWeight) * 100) : 0;
  const pctC = totalWeight > 0 ? Math.round((gradeC / totalWeight) * 100) : 0;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top 2 Primary Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Total Produce Sold */}
        <div className="card" style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '22px 24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="label-caps">{t('totalProduceSold')}</span>
              <div style={{
                width: '36px',
                height: '36px',
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
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="mono-num" style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                {totalWeight.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                kg
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <CheckCircle2 size={15} color="var(--primary)" />
            <span>
              {lang === 'hi' 
                ? `${summaries.confirmedCount} सत्यापित तौल पर्चियों का कुल योग` 
                : `Calculated from ${summaries.confirmedCount} confirmed collection slips`}
            </span>
          </div>
        </div>

        {/* Card 2: Total Net Amount */}
        <div className="card" style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '22px 24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="label-caps">{t('totalNetAmount')}</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-subtle)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <IndianRupee size={18} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>₹</span>
              <span className="mono-num" style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
                {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={15} color="var(--primary)" />
            <span>
              {lang === 'hi'
                ? 'कांटे के भाव और प्रमाणित शुद्ध वजन अनुसार देय राशि'
                : 'Direct digital payout recorded by collection hub'}
            </span>
          </div>
        </div>
      </div>

      {/* Grade-wise Breakdown Section */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('gradeWiseWeight')}</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {lang === 'hi' ? 'गुणवत्ता मानक अनुसार वर्गीकृत उपज' : 'Quality assessment breakdown from verified deliveries'}
            </div>
          </div>
        </div>

        {/* 3 Grade Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '14px'
        }}>
          {/* Grade A */}
          <div style={{
            backgroundColor: 'var(--bg-nested)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="grade-pill grade-pill-a">{t('gradeA')}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }} className="mono-num">{pctA}%</span>
            </div>
            <div>
              <div className="mono-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {gradeA.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('gradeADesc')}
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pctA}%`, backgroundColor: 'var(--primary)', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Grade B */}
          <div style={{
            backgroundColor: 'var(--bg-nested)',
            border: '1px solid var(--amber-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="grade-pill grade-pill-b">{t('gradeB')}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber-text)' }} className="mono-num">{pctB}%</span>
            </div>
            <div>
              <div className="mono-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {gradeB.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('gradeBDesc')}
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pctB}%`, backgroundColor: 'var(--amber)', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Grade C */}
          <div style={{
            backgroundColor: 'var(--bg-nested)',
            border: '1px solid var(--red-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="grade-pill grade-pill-c">{t('gradeC')}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--red-text)' }} className="mono-num">{pctC}%</span>
            </div>
            <div>
              <div className="mono-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {gradeC.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('gradeCDesc')}
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ height: '5px', width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pctC}%`, backgroundColor: 'var(--red)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
