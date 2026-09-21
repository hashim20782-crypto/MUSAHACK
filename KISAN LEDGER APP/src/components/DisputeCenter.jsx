import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function DisputeCenter({ isModalView = false }) {
  const { lang } = useLanguage();
  const { 
    disputes, 
    statusOf, 
    statusLabel, 
    confirmFarmerDispute, 
    toggleAdminDispute, 
    deleteDispute 
  } = useTransactions();

  const [activeTab, setActiveTab] = useState('all');

  const filteredDisputes = disputes.filter((d) => {
    const status = statusOf(d);
    if (activeTab === 'all') return true;
    if (activeTab === 'awaiting-you') return status === 'awaiting-you';
    if (activeTab === 'awaiting-admin') return status === 'awaiting-admin';
    if (activeTab === 'open') return status === 'open';
    if (activeTab === 'resolved') return status === 'resolved';
    return true;
  });

  const handleListClick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const card = e.target.closest('.dispute-card');
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;

    const action = btn.dataset.action;
    if (action === 'confirm') {
      confirmFarmerDispute(id);
    } else if (action === 'toggle-admin') {
      toggleAdminDispute(id);
    } else if (action === 'delete') {
      deleteDispute(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header Info Banner (only in full page view) */}
      {!isModalView && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--amber-subtle)',
              border: '1px solid var(--amber-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--amber-text)'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                {lang === 'hi' ? 'आपत्ति समाधान केंद्र' : 'Dispute Resolution Center'}
              </h1>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {lang === 'hi' 
                  ? 'पारदर्शी द्विपक्षीय आम सहमति: किसान और एफपीओ व्यवस्थापक दोनों की पुष्टि आवश्यक है' 
                  : 'Two-party consensus audit: Requires verification from both Farmer and FPO Administrator to resolve'}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '850px' }}>
            {lang === 'hi'
              ? 'यहाँ आप खरीद, वजन, गुणवत्ता या भुगतान संबंधी दर्ज आपत्तियों की स्थिति देख सकते हैं। दोनों पक्षों द्वारा समाधान की पुष्टि होने के बाद ही मामला "Resolved" माना जाता है तथा रिकॉर्ड हटाया जा सकता है।'
              : 'Status is derived from both confirmation flags (Farmer & Admin). Records can only be permanently deleted once both sides confirm resolution.'}
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { key: 'all', label: lang === 'hi' ? 'सभी आपत्तियां' : 'All Disputes', count: disputes.length },
          { 
            key: 'awaiting-you', 
            label: lang === 'hi' ? 'आपकी पुष्टि लंबित' : 'Awaiting You', 
            count: disputes.filter(d => statusOf(d) === 'awaiting-you').length,
            color: 'var(--amber-text)'
          },
          { 
            key: 'open', 
            label: lang === 'hi' ? 'खुले मामले' : 'Open', 
            count: disputes.filter(d => statusOf(d) === 'open').length,
            color: 'var(--red-text)'
          },
          { 
            key: 'awaiting-admin', 
            label: lang === 'hi' ? 'व्यवस्थापक पुष्टि लंबित' : 'Awaiting Admin', 
            count: disputes.filter(d => statusOf(d) === 'awaiting-admin').length,
            color: '#93c5fd'
          },
          { 
            key: 'resolved', 
            label: lang === 'hi' ? 'सुलझ चुके' : 'Resolved', 
            count: disputes.filter(d => statusOf(d) === 'resolved').length,
            color: 'var(--primary)'
          }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: activeTab === tab.key ? 'var(--nav-active)' : 'var(--bg-surface)',
              color: activeTab === tab.key ? '#ffffff' : 'var(--text-secondary)',
              border: activeTab === tab.key ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              color: tab.color || 'inherit'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Container #disputeList */}
      <div id="disputeList" onClick={handleListClick}>
        {filteredDisputes.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-card)',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <CheckCircle2 size={36} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'इस श्रेणी में कोई आपत्ति नहीं है।' : 'No disputes in this category.'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {lang === 'hi' ? 'सभी वजन व भुगतान रिकॉर्ड सामान्य हैं।' : 'All weighment and receipt records are in good standing.'}
            </div>
          </div>
        ) : (
          filteredDisputes.map((d) => {
            const status = statusOf(d);
            const label = statusLabel(status);

            return (
              <div key={d.id} className="dispute-card" data-id={d.id}>
                {/* Dispute Top */}
                <div className="dispute-top">
                  <div>
                    <div className="dispute-title">{d.title}</div>
                    <div className="dispute-meta">{d.meta} · {d.id}</div>
                  </div>
                  <span className={`status ${status}`}>{label}</span>
                </div>

                {/* Dispute Body */}
                <div className="dispute-body">{d.detail}</div>

                {/* Confirmation Row */}
                <div className="confirm-row">
                  <div>
                    You: <span className={d.farmerConfirmed ? 'yes' : 'no'}>
                      {d.farmerConfirmed ? 'Confirmed solved' : 'Not confirmed'}
                    </span>
                  </div>
                  <div>
                    Admin: <span className={d.adminConfirmed ? 'yes' : 'no'}>
                      {d.adminConfirmed ? 'Confirmed solved' : 'Not confirmed'}
                    </span>
                  </div>
                </div>

                {/* Dispute Actions */}
                <div className="dispute-actions" style={{ flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn primary"
                    data-action="confirm"
                    disabled={d.farmerConfirmed}
                    style={{ minHeight: '44px' }}
                    onClick={() => confirmFarmerDispute(d.id)}
                  >
                    {d.farmerConfirmed ? 'You confirmed' : 'Confirm dispute solved'}
                  </button>

                  <button
                    type="button"
                    className="btn danger"
                    data-action="delete"
                    disabled={status !== 'resolved'}
                    title={status !== 'resolved' ? 'Both sides must confirm before this can be removed' : 'Delete this dispute record permanently'}
                    style={{ minHeight: '44px' }}
                    onClick={() => deleteDispute(d.id)}
                  >
                    Remove from database
                  </button>
                </div>

                {/* Dev Toggle for Admin Portal Simulation */}
                <div className="dev-toggle">
                  <span>Dev preview only — simulates the admin portal, until the two sites are connected:</span>
                  <button
                    type="button"
                    className="btn ghost"
                    data-action="toggle-admin"
                    style={{ marginLeft: '6px', padding: '6px 12px', minHeight: '38px', touchAction: 'manipulation' }}
                    onClick={() => toggleAdminDispute(d.id)}
                  >
                    {d.adminConfirmed ? 'Un-confirm as admin' : 'Simulate admin confirming'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
