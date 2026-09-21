import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { AlertTriangle, CheckCircle2, X, FileText, Info } from 'lucide-react';

export function RaiseIssueModal({ transaction, onClose }) {
  const { t, lang } = useLanguage();
  const { raiseIssue } = useTransactions();

  const [issueType, setIssueType] = useState('Incorrect Weight');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया समस्या का विवरण लिखें।' : 'Please describe the issue in detail.');
      return;
    }

    const success = raiseIssue(transaction.transactionId, issueType, description.trim());
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
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
              backgroundColor: 'var(--red-subtle)',
              border: '1px solid var(--red-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--red-text)'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{t('raiseIssueModalTitle')}</h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {t('raiseIssueModalSubtitle')}
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
          {submitted ? (
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
                {t('issueSubmittedSuccess')}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '380px' }}>
                {lang === 'hi'
                  ? 'लेन-देन संख्या ' + transaction.transactionId + ' पर आपत्ति दर्ज कर दी गई है। ऑपरेटर का मूल डेटा सुरक्षित रखा गया है।'
                  : 'A separate audit dispute ticket has been logged for ' + transaction.transactionId + '. Original weigh station records remain immutable.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Read-only Transaction Info Box */}
              <div style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-caps">{t('readOnlyInfo') || 'Transaction Reference'}</span>
                  <span className="mono-num" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {transaction.transactionId}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
                  gap: '10px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Product</div>
                    <div style={{ fontWeight: 600 }}>{transaction.product}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Net Weight</div>
                    <div style={{ fontWeight: 600 }} className="mono-num">{transaction.netWeight} kg</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Grade</div>
                    <div style={{ fontWeight: 600 }}>{transaction.qualityGrade}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Net Amount</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }} className="mono-num">
                      ₹{transaction.netAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Discrepancy selector */}
              <div className="input-group">
                <label className="label-caps">{t('issueType')}</label>
                <select
                  className="select-field"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="Incorrect Weight">{t('issueTypeWeight')}</option>
                  <option value="Incorrect Quality Grade">{t('issueTypeGrade')}</option>
                  <option value="Incorrect Amount">{t('issueTypeAmount')}</option>
                  <option value="Wrong Product">{t('issueTypeProduct')}</option>
                  <option value="Consignment Photo Issue">{t('issueTypePhoto')}</option>
                  <option value="Other">{t('issueTypeOther')}</option>
                </select>
              </div>

              {/* Description box */}
              <div className="input-group">
                <label className="label-caps">{t('issueDesc')}</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('issueDescPlaceholder')}
                  style={{ resize: 'vertical' }}
                  required
                />
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

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                <Info size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {lang === 'hi'
                    ? 'मूल तौल रिकॉर्ड में कोई बदलाव नहीं किया जाएगा। एफपीओ समिति ऑपरेटर लॉग और कैमरा फुटेज की जांच करेगी।'
                    : 'The original weigh station record will not be modified. FPO committee will audit camera stamps and physical weight slips.'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ flex: '1 1 120px', minHeight: '44px' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-danger-outline"
                  style={{ flex: '2 1 180px', gap: '6px', minHeight: '44px' }}
                >
                  <AlertTriangle size={16} />
                  <span>{t('submitIssueBtn')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
