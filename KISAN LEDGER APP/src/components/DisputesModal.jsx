import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { DisputeCenter } from './DisputeCenter';
import { AlertTriangle, X } from 'lucide-react';

export function DisputesModal({ onClose, onSelectTransaction }) {
  const { lang } = useLanguage();
  const { disputes, statusOf } = useTransactions();

  const openCount = disputes.filter((d) => statusOf(d) !== 'resolved').length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '680px', maxHeight: '88dvh' }} onClick={(e) => e.stopPropagation()}>
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
              <h3 style={{ fontSize: '1.15rem' }}>
                {lang === 'hi' ? 'दर्ज आपत्तियां एवं समाधान' : 'Raised Issues & Disputes'}
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {openCount} {lang === 'hi' ? 'मामले समीक्षाधीन' : 'active disputes under review'}
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
        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          <DisputeCenter isModalView={true} onSelectTransaction={onSelectTransaction} />
        </div>
      </div>
    </div>
  );
}

