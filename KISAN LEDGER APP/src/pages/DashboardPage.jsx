import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions } from '../context/TransactionContext';
import { AppLayout } from '../components/AppLayout';
import { SummaryCards } from '../components/SummaryCards';
import { ProductBreakdown } from '../components/ProductBreakdown';
import { TransactionCard } from '../components/TransactionCard';
import { TransactionDetailModal } from '../components/TransactionDetailModal';
import { RaiseIssueModal } from '../components/RaiseIssueModal';
import { OtpModal } from '../components/OtpModal';
import { ProfileModal } from '../components/ProfileModal';
import { DisputesModal } from '../components/DisputesModal';
import { DisputeCenter } from '../components/DisputeCenter';
import { ProfileView } from '../components/ProfileView';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

export function DashboardPage() {
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const { transactions, openDisputesCount, resetDemoData } = useTransactions();

  // Navigation & Modals state
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueModalTxn, setIssueModalTxn] = useState(null);
  const [otpModalTxn, setOtpModalTxn] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDisputesModal, setShowDisputesModal] = useState(false);

  // Sync with external DOM nav-item clicks if any vanilla script runs
  useEffect(() => {
    const handleNavClick = (e) => {
      const btn = e.target.closest('.nav-item');
      if (btn && btn.dataset.page) {
        setActiveView(btn.dataset.page);
      }
    };
    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Search by Transaction ID
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(q) ||
          t.product.toLowerCase().includes(q) ||
          (t.productHi && t.productHi.includes(q))
      );
    }

    // Filter by Product
    if (filterProduct !== 'All') {
      list = list.filter((t) => t.product.toLowerCase().includes(filterProduct.toLowerCase()));
    }

    // Filter by Quality Grade
    if (filterGrade !== 'All') {
      list = list.filter((t) => t.qualityGrade.toLowerCase().includes(filterGrade.toLowerCase()));
    }

    // Filter by Date
    if (filterDate === 'thisMonth') {
      // 2026-09
      list = list.filter((t) => t.date.startsWith('2026-09'));
    } else if (filterDate === 'lastMonth') {
      // 2026-08
      list = list.filter((t) => t.date.startsWith('2026-08'));
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
      } else if (sortBy === 'oldest') {
        return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
      } else if (sortBy === 'highWeight') {
        return b.netWeight - a.netWeight;
      } else if (sortBy === 'lowWeight') {
        return a.netWeight - b.netWeight;
      } else if (sortBy === 'highAmount') {
        return b.netAmount - a.netAmount;
      }
      return 0;
    });

    return list;
  }, [transactions, searchQuery, filterProduct, filterGrade, filterDate, sortBy]);

  const awaitingCount = transactions.filter((t) => !t.farmerConfirmed).length;
  const issueCount = openDisputesCount;

  return (
    <AppLayout
      activeView={activeView}
      setActiveView={setActiveView}
      onOpenProfile={() => setActiveView('profile')}
      onOpenDisputes={() => setActiveView('disputes')}
      disputeCount={issueCount}
    >
      {/* Scrollable Dashboard Body */}
      <main style={{
          flex: 1,
          padding: '24px 28px 60px 28px',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Page 1: Main Producer Dashboard */}
          <div id="page-dashboard" className={`page ${activeView === 'dashboard' ? 'active' : ''}`}>
            {/* 1. WELCOME / FARMER INFORMATION BANNER */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-card)',
              padding: '20px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="label-caps" style={{ color: 'var(--primary)' }}>
                  {lang === 'hi' ? 'सत्यापित डिजिटल बहीखाता' : 'Official Producer Ledger'}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Member ID: <strong className="mono-num" style={{ color: 'var(--text-primary)' }}>{currentUser?.farmerId || 'MH-NSK-2024-8842'}</strong>
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>
                {lang === 'hi'
                  ? `राम राम, ${currentUser?.name || 'रमेश पाटील'}`
                  : `Welcome, ${currentUser?.name || 'Ramesh Baburao Patil'}`}
              </h1>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {lang === 'hi'
                  ? `संबद्ध एफपीओ: ${currentUser?.fpoName || 'सह्याद्री फार्मर्स प्रोड्यूसर कंपनी'} · स्टेशन 3 खरीद गेट`
                  : `Associated FPO: ${currentUser?.fpoName || 'Sahyadri Farmers Producer Co.'} · Station 3 Procurement Gate`}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {awaitingCount > 0 && (
                <div style={{
                  backgroundColor: 'var(--amber-subtle)',
                  border: '1px solid var(--amber-border)',
                  color: 'var(--amber-text)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={16} />
                  <span>
                    {awaitingCount} {lang === 'hi' ? 'डिलीवरी पुष्टि हेतु लंबित' : 'Awaiting Confirmation'}
                  </span>
                </div>
              )}

              {issueCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveView('disputes')}
                  style={{
                    backgroundColor: 'var(--red-subtle)',
                    border: '1px solid var(--red-border)',
                    color: 'var(--red-text)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>
                    {issueCount} {lang === 'hi' ? 'आपत्तियां समीक्षाधीन' : 'Disputes Under Review'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={resetDemoData}
                className="btn btn-outline btn-sm"
                title="Reset transactions to initial state"
                style={{ gap: '6px', fontSize: '0.78rem' }}
              >
                <RotateCcw size={13} />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* 2. SUMMARY CARDS (Total Weight Sold | Total Net Amount | Grade A/B/C) */}
          <SummaryCards />

          {/* 3. PRODUCT BREAKDOWN ("My Produce") */}
          <ProductBreakdown />

          {/* 4. TRANSACTION HISTORY & SEARCH / FILTER / SORT */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Section Title & Metrics */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {t('transactionsHeading')}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {lang === 'hi'
                    ? 'कांटे पर तौली गई प्रत्येक डिलीवरी की प्रमाणित डिजिटल पर्चियां'
                    : 'Certified weighbridge transaction cards with tamper-evidence photography'}
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} records
              </div>
            </div>

            {/* Mobile-Friendly Responsive Search & Filter Bar */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-card)',
              padding: '16px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Search input */}
              <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}>
                <input
                  type="text"
                  className="input-field input-field-mono"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px', height: '44px' }}
                />
                <Search
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none' }}
                />
              </div>

              {/* Product Filter */}
              <div style={{ flex: '1 1 130px', minWidth: 'min(100%, 130px)' }}>
                <select
                  className="select-field"
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  style={{ height: '44px' }}
                >
                  <option value="All">{t('filterProduct')}: {t('all')}</option>
                  <option value="Wheat">Wheat (गेहूँ)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Rice">Rice / Paddy (धान)</option>
                  <option value="Chana">Chana (चना)</option>
                </select>
              </div>

              {/* Quality Grade Filter */}
              <div style={{ flex: '1 1 130px', minWidth: 'min(100%, 130px)' }}>
                <select
                  className="select-field"
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  style={{ height: '44px' }}
                >
                  <option value="All">{t('filterGrade')}: {t('all')}</option>
                  <option value="Grade A">Grade A (Super)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Fair)</option>
                </select>
              </div>

              {/* Date Filter */}
              <div style={{ flex: '1 1 130px', minWidth: 'min(100%, 130px)' }}>
                <select
                  className="select-field"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{ height: '44px' }}
                >
                  <option value="All">{t('filterDate')}: {t('all')}</option>
                  <option value="thisMonth">{t('thisMonth')} (Sept)</option>
                  <option value="lastMonth">{t('lastMonth')} (Aug)</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ flex: '1 1 140px', minWidth: 'min(100%, 140px)' }}>
                <select
                  className="select-field"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ height: '44px' }}
                >
                  <option value="newest">{t('sortNewest')}</option>
                  <option value="oldest">{t('sortOldest')}</option>
                  <option value="highWeight">{t('sortHighWeight')}</option>
                  <option value="lowWeight">{t('sortLowWeight')}</option>
                  <option value="highAmount">{t('sortHighAmount')}</option>
                </select>
              </div>
            </div>

            {/* 5. TRANSACTION CARDS GRID (Cards, not dense table) */}
            {filteredTransactions.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-card)',
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                <Filter size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t('noTransactionsFound')}</div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterProduct('All');
                    setFilterGrade('All');
                    setFilterDate('All');
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '14px' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: '18px'
              }}>
                {filteredTransactions.map((txn) => (
                  <TransactionCard
                    key={txn.transactionId}
                    transaction={txn}
                    onSelect={(t) => setSelectedTransaction(t)}
                    onOpenRaiseIssue={(t) => setIssueModalTxn(t)}
                    onOpenOtp={(t) => setOtpModalTxn(t)}
                  />
                ))}
              </div>
            )}
            </section>
          </div>

          {/* Page 2: Dispute Resolution Center */}
          <div id="page-disputes" className={`page ${activeView === 'disputes' ? 'active' : ''}`}>
            <DisputeCenter onSelectTransaction={(txn) => setSelectedTransaction(txn)} />
          </div>

          {/* Page 3: Farmer Profile & Certified Bank Details */}
          <div id="page-profile" className={`page ${activeView === 'profile' ? 'active' : ''}`}>
            <ProfileView />
          </div>
        </main>

      {/* MODALS */}
      {/* 1. Transaction Detail View Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onOpenRaiseIssue={(txn) => setIssueModalTxn(txn)}
          onOpenOtp={(txn) => setOtpModalTxn(txn)}
        />
      )}

      {/* 2. Raise Issue Modal */}
      {issueModalTxn && (
        <RaiseIssueModal
          transaction={issueModalTxn}
          onClose={() => setIssueModalTxn(null)}
        />
      )}

      {/* 3. OTP Confirmation Modal */}
      {otpModalTxn && (
        <OtpModal
          transaction={otpModalTxn}
          onClose={() => setOtpModalTxn(null)}
        />
      )}

      {/* 4. Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* 5. Disputes Audit List Modal */}
      {showDisputesModal && (
        <DisputesModal
          onClose={() => setShowDisputesModal(false)}
          onSelectTransaction={(txn) => setSelectedTransaction(txn)}
        />
      )}
    </AppLayout>
  );
}
