import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const TransactionContext = createContext();

const INITIAL_TRANSACTIONS = [
  {
    transactionId: 'TXN-8842-03',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Wheat',
    productHi: 'गेहूँ',
    grossWeight: 515,
    tareWeight: 15,
    netWeight: 500,
    qualityGrade: 'Grade B',
    gradeTitle: 'Grade B (Standard)',
    gradeSub: 'Meets procurement norms',
    ratePerKg: 23.00,
    netAmount: 11500,
    consignmentImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-17',
    time: '08:45 AM',
    station: 'Station 3 · Procurement Gate',
    operatorId: 'OP-412 (Mahesh S.)',
    otpVerified: false,
    farmerConfirmed: false,
    locked: true,
    simulatedOtp: '4829',
    issueStatus: null,
    issueType: null,
    issueDescription: null
  },
  {
    transactionId: 'TXN-8842-01',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Wheat',
    productHi: 'गेहूँ',
    grossWeight: 1240,
    tareWeight: 40,
    netWeight: 1200,
    qualityGrade: 'Grade A',
    gradeTitle: 'Grade A (Super)',
    gradeSub: 'Premium — lowest moisture & impurities',
    ratePerKg: 24.50,
    netAmount: 29400,
    consignmentImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-16',
    time: '09:30 AM',
    station: 'Station 3 · Procurement Gate',
    operatorId: 'OP-412 (Mahesh S.)',
    otpVerified: true,
    farmerConfirmed: true,
    locked: true,
    simulatedOtp: '7104',
    issueStatus: null,
    issueType: null,
    issueDescription: null
  },
  {
    transactionId: 'TXN-8842-02',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Soybean',
    productHi: 'सोयाबीन',
    grossWeight: 820,
    tareWeight: 25,
    netWeight: 795,
    qualityGrade: 'Grade B',
    gradeTitle: 'Grade B (Standard)',
    gradeSub: 'Meets procurement norms',
    ratePerKg: 46.00,
    netAmount: 36570,
    consignmentImage: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-15',
    time: '11:15 AM',
    station: 'Station 3 · Procurement Gate',
    operatorId: 'OP-412 (Mahesh S.)',
    otpVerified: true,
    farmerConfirmed: true,
    locked: true,
    simulatedOtp: '9321',
    issueStatus: null,
    issueType: null,
    issueDescription: null
  },
  {
    transactionId: 'TXN-8842-04',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Chana (Gram)',
    productHi: 'चना',
    grossWeight: 640,
    tareWeight: 20,
    netWeight: 620,
    qualityGrade: 'Grade A',
    gradeTitle: 'Grade A (Super)',
    gradeSub: 'Premium — lowest moisture & impurities',
    ratePerKg: 54.00,
    netAmount: 33480,
    consignmentImage: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-12',
    time: '02:10 PM',
    station: 'Station 1 · Weighbridge North',
    operatorId: 'OP-108 (Suresh K.)',
    otpVerified: true,
    farmerConfirmed: true,
    locked: true,
    simulatedOtp: '5618',
    issueStatus: null,
    issueType: null,
    issueDescription: null
  },
  {
    transactionId: 'TXN-8842-05',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Rice / Paddy',
    productHi: 'धान / चावल',
    grossWeight: 465,
    tareWeight: 15,
    netWeight: 450,
    qualityGrade: 'Grade C',
    gradeTitle: 'Grade C (Fair)',
    gradeSub: 'Below standard — discounted rate',
    ratePerKg: 20.50,
    netAmount: 9225,
    consignmentImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    date: '2026-09-10',
    time: '04:20 PM',
    station: 'Station 2 · South Bay',
    operatorId: 'OP-219 (Deepak R.)',
    otpVerified: true,
    farmerConfirmed: true,
    locked: true,
    simulatedOtp: '3349',
    issueStatus: 'Raised',
    issueType: 'Incorrect Quality Grade',
    issueDescription: 'Assessor recorded Grade C due to alleged moisture, but calibrated portable tester read 11.2% moisture, meeting Grade B norms.'
  },
  {
    transactionId: 'TXN-8842-06',
    farmerId: 'MH-NSK-2024-8842',
    farmerName: 'Ramesh Baburao Patil',
    product: 'Soybean',
    productHi: 'सोयाबीन',
    grossWeight: 910,
    tareWeight: 30,
    netWeight: 880,
    qualityGrade: 'Grade A',
    gradeTitle: 'Grade A (Super)',
    gradeSub: 'Premium — lowest moisture & impurities',
    ratePerKg: 48.50,
    netAmount: 42680,
    consignmentImage: 'https://images.unsplash.com/photo-1599818816949-c9676bb2b79e?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-28',
    time: '10:05 AM',
    station: 'Station 3 · Procurement Gate',
    operatorId: 'OP-412 (Mahesh S.)',
    otpVerified: true,
    farmerConfirmed: true,
    locked: true,
    simulatedOtp: '8920',
    issueStatus: null,
    issueType: null,
    issueDescription: null
  }
];

export const INITIAL_DISPUTES = [
  {
    id: "D-1042",
    title: "Payment short by ₹1,200",
    meta: "Order #7788 · Buyer: Krishna Traders",
    detail: "Buyer paid less than the agreed rate for 40kg of tomatoes.",
    farmerConfirmed: false,
    adminConfirmed: true   // admin already proposed this is solved
  },
  {
    id: "D-1039",
    title: "Delivery marked incomplete",
    meta: "Order #7710 · Buyer: Om Fresh Mart",
    detail: "Buyer claims only 3 of 5 crates arrived.",
    farmerConfirmed: false,
    adminConfirmed: false
  },
  {
    id: "D-1021",
    title: "Quality complaint",
    meta: "Order #7601 · Buyer: Sahyadri Agro",
    detail: "Buyer reported overripe mangoes on arrival.",
    farmerConfirmed: true,
    adminConfirmed: true   // both sides already agreed -> resolved
  }
];

export function statusOf(d) {
  if (d.farmerConfirmed && d.adminConfirmed) return "resolved";
  if (d.adminConfirmed) return "awaiting-you";
  if (d.farmerConfirmed) return "awaiting-admin";
  return "open";
}

export function statusLabel(status) {
  return {
    "open": "Open",
    "awaiting-you": "Awaiting your confirmation",
    "awaiting-admin": "Awaiting admin confirmation",
    "resolved": "Resolved"
  }[status] || status;
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('kisan_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('kisan_disputes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse disputes', e);
      }
    }
    return INITIAL_DISPUTES;
  });

  const [disputeLogs, setDisputeLogs] = useState(() => {
    const saved = localStorage.getItem('kisan_disputes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse disputes', e);
      }
    }
    return [
      {
        disputeId: 'DISP-2026-01',
        transactionId: 'TXN-8842-05',
        issueType: 'Incorrect Quality Grade',
        description: 'Assessor recorded Grade C due to alleged moisture, but calibrated portable tester read 11.2% moisture, meeting Grade B norms.',
        timestamp: '2026-09-10T16:45:00Z',
        status: 'Under Review by FPO Committee'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kisan_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kisan_disputes_v2', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('kisan_disputes', JSON.stringify(disputeLogs));
  }, [disputeLogs]);

  // Farmer OTP Confirmation Action
  const confirmOtp = (transactionId, enteredOtp) => {
    let verified = false;
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.transactionId === transactionId) {
          // Verify matches simulated or any 4 digit if demo
          if (t.simulatedOtp === enteredOtp || enteredOtp === '4829' || enteredOtp.length === 4) {
            verified = true;
            return {
              ...t,
              otpVerified: true,
              farmerConfirmed: true,
              locked: true
            };
          }
        }
        return t;
      })
    );
    return verified;
  };

  // Dispute resolution actions
  const confirmFarmerDispute = (id) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, farmerConfirmed: true } : d))
    );
  };

  const toggleAdminDispute = (id) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, adminConfirmed: !d.adminConfirmed } : d))
    );
  };

  const deleteDispute = (id) => {
    const target = disputes.find((d) => d.id === id);
    if (!target) return false;
    if (statusOf(target) !== 'resolved') return false;
    if (!window.confirm(`Permanently remove dispute ${target.id} from the database? This cannot be undone.`)) {
      return false;
    }
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    return true;
  };

  // Raise Issue Action
  const raiseIssue = (transactionId, issueType, issueDescription) => {
    const targetTxn = transactions.find((t) => t.transactionId === transactionId);
    if (!targetTxn) return false;

    const newId = 'D-' + Math.floor(1000 + Math.random() * 9000);

    // Add to multi-party consensus disputes
    const newDispute = {
      id: newId,
      title: `${issueType} (${targetTxn.product})`,
      meta: `Order #${transactionId} · Station: ${targetTxn.station}`,
      detail: issueDescription,
      farmerConfirmed: true,
      adminConfirmed: false
    };
    setDisputes((prev) => [newDispute, ...prev]);

    // Create separate immutable dispute log for backwards compatibility
    const newDisputeLog = {
      disputeId: newId,
      transactionId,
      farmerId: targetTxn.farmerId,
      issueType,
      description: issueDescription,
      timestamp: new Date().toISOString(),
      status: 'Awaiting admin confirmation'
    };
    setDisputeLogs((prev) => [newDisputeLog, ...prev]);

    // Mark transaction status as 'Raised' WITHOUT altering weights or pricing
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.transactionId === transactionId) {
          return {
            ...t,
            issueStatus: 'Raised',
            issueType,
            issueDescription
          };
        }
        return t;
      })
    );

    return true;
  };

  // Dynamic Summaries (calculated from confirmed records)
  const summaries = useMemo(() => {
    // Only count confirmed transactions towards totals
    const confirmedTxns = transactions.filter((t) => t.farmerConfirmed);

    const totalWeight = confirmedTxns.reduce((sum, t) => sum + (Number(t.netWeight) || 0), 0);
    const totalAmount = confirmedTxns.reduce((sum, t) => sum + (Number(t.netAmount) || 0), 0);

    const gradeBreakdown = {
      A: { weight: 0, count: 0 },
      B: { weight: 0, count: 0 },
      C: { weight: 0, count: 0 }
    };

    confirmedTxns.forEach((t) => {
      const grade = t.qualityGrade?.includes('A')
        ? 'A'
        : t.qualityGrade?.includes('B')
        ? 'B'
        : 'C';
      gradeBreakdown[grade].weight += Number(t.netWeight) || 0;
      gradeBreakdown[grade].count += 1;
    });

    // Product breakdown
    const productBreakdown = {};
    confirmedTxns.forEach((t) => {
      const p = t.product || 'Other';
      if (!productBreakdown[p]) {
        productBreakdown[p] = {
          product: p,
          productHi: t.productHi || p,
          totalWeight: 0,
          totalAmount: 0,
          gradeA: 0,
          gradeB: 0,
          gradeC: 0,
          count: 0
        };
      }
      const wt = Number(t.netWeight) || 0;
      productBreakdown[p].totalWeight += wt;
      productBreakdown[p].totalAmount += Number(t.netAmount) || 0;
      productBreakdown[p].count += 1;

      if (t.qualityGrade?.includes('A')) productBreakdown[p].gradeA += wt;
      else if (t.qualityGrade?.includes('B')) productBreakdown[p].gradeB += wt;
      else productBreakdown[p].gradeC += wt;
    });

    return {
      totalWeight,
      totalAmount,
      gradeBreakdown,
      productBreakdown: Object.values(productBreakdown),
      confirmedCount: confirmedTxns.length,
      pendingCount: transactions.filter((t) => !t.farmerConfirmed).length,
      issueCount: transactions.filter((t) => t.issueStatus === 'Raised').length
    };
  }, [transactions]);

  // Reset to demo data helper
  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setDisputes(INITIAL_DISPUTES);
    localStorage.setItem('kisan_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('kisan_disputes_v2', JSON.stringify(INITIAL_DISPUTES));
  };

  const openDisputesCount = useMemo(() => {
    return disputes.filter((d) => statusOf(d) !== 'resolved').length;
  }, [disputes]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        disputes,
        disputeLogs,
        statusOf,
        statusLabel,
        confirmFarmerDispute,
        toggleAdminDispute,
        deleteDispute,
        openDisputesCount,
        summaries,
        confirmOtp,
        raiseIssue,
        resetDemoData
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
