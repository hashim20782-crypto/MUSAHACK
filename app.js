/**
 * FPO Ledger — Enterprise AgriTech HQ & Farmer Member Dashboard
 * Interactive State Management, Digital Weighbridge Passes, and Bilingual (EN/HI) Engine
 */

// ============================================================================
// 1. Bilingual Translation Engine & Dictionaries (English & Hindi)
// ============================================================================

const I18N_DICTIONARY = {
  en: {
    brand_name: "FPO Ledger",
    brand_subtitle: "Mandi Collection Point",
    operator_id_label: "OPERATOR ID",
    online_status: "Online",
    nav_my_deliveries: "My Deliveries",
    nav_dashboard: "Dashboard",
    nav_oversight_section: "OFFICER OVERSIGHT",
    nav_master_ledger: "Master Ledger",
    nav_fraud_anomaly: "Fraud & Anomaly",
    nav_disputes: "Dispute Workbench",
    nav_settlements: "Payout Settlement",
    nav_audit_trail: "Audit Trail",
    nav_rate_cards: "Rate Cards (v2.3)",
    field_app_sync: "Field Sync Stream",
    active_operators: "Active Ops",
    mandi_location: "Mandi Cluster",

    // Deliveries Page
    deliveries_title: "My Deliveries",
    deliveries_subtitle: "Digital weighbridge passes for your lots at Ratlam Mandi.",
    metric_my_lots: "My lots",
    metric_estimated_val: "Estimated value",
    metric_pending_verif: "Pending verification",
    weighbridge_pass_prefix: "WEIGHBRIDGE PASS",
    btn_weighbridge_pass: "Weighbridge pass",
    btn_raise_dispute: "Raise Dispute",
    status_locked_hashed: "Locked & Hashed",
    status_pending_verif: "Pending Verification",
    th_net_wt: "Net wt.",
    th_grade: "Grade",
    th_hash: "Hash",

    // Dashboard Page
    dash_title: "Mandi Operations & Ledger Overview",
    dash_subtitle: "Real-time procurement metrics, cryptographic ledger verification, and active cluster health.",
    total_locked_vol: "Total Locked Volume (Today)",
    active_centers_sub: "Across 32 active collection centers",
    estimated_gross_payout: "Estimated Gross Payout",
    rate_card_sub: "At current Rate Card v2.3",
    grade_dist_today: "Grade Distribution (Today)",
    grade_dist_sub: "Regional benchmark: A:48% B:36% C:16%",
    anomalies_holds: "Anomalies & Holds",
    dispute_locked_sub: "₹12,460 produce locked on dispute hold",
    ql_master_ledger: "Master Ledger Khata",
    ql_master_ledger_sub: "View 1,842 immutable entries",
    ql_fraud_engine: "Statistical Fraud Engine",
    ql_fraud_engine_sub: "3 operators flagged above 2.5σ",
    ql_dispute_wb: "Dispute Adjudication",
    ql_dispute_wb_sub: "4 open farmer photo claims",
    ql_payout_run: "Payout Settlement",
    ql_payout_run_sub: "24 beneficiary accounts ready",

    // Master Ledger
    ledger_breadcrumbs: "Ledger Repository / Immutable Master Khata",
    ledger_title: "Locked Grading Ledger",
    ledger_desc: "Single source of truth. Every grading entry is cryptographically locked upon field submission. Editing or deleting is permanently restricted.",
    btn_export_csv: "Export CSV / Ledger",
    btn_verify_merkle: "Verify Merkle Tree (100%)",
    search_placeholder: "Search by Farmer Name, ID (FMR-xxx), Entry ID, or Operator...",
    filter_grade: "Grade",
    filter_operator: "Operator",
    filter_center: "Collection Center",
    filter_status: "Status",
    btn_reset: "Reset",
    merkle_locked_tag: "Cryptographically Locked SHA-256",
    page_label: "Page",
    of_label: "of",
    th_entry_id: "Entry ID",
    th_datetime: "Date & Time",
    th_farmer: "Farmer Name & ID",
    th_operator: "Field Operator",
    th_center: "Collection Center",
    th_produce: "Crop Produce",
    th_weight: "Weight (kg)",
    th_rate: "Rate (₹/kg)",
    th_payout: "Payout (₹)",
    th_photo: "Photo Evidence",
    th_status: "Status",
    th_action: "Action",

    // Fraud & Anomaly
    fraud_breadcrumbs: "Risk Oversight / Statistical Anomaly Engine",
    fraud_title: "Operator Fraud & Anomaly Detection",
    fraud_desc: "Automated peer-benchmarking statistical engine compares operator grade allocations, grading velocity, and farmer bias to detect tampering.",
    btn_recalc_risk: "Recalculate Risk Scores",
    benchmark_title: "Regional Peer Benchmark Standard (Ratlam & Malwa Agri Zone)",
    benchmark_desc: "Derived from 42,800 historical entries across 90 field operators this season. Normal Gaussian standard: Grade A = 48.0%, Grade B = 36.0%, Grade C = 16.0%.",
    risk_leaderboard: "Ranked Risk Leaderboard",
    risk_leaderboard_sub: "Operators with statistical variance > 2.5σ or rapid velocity",

    // Disputes
    dispute_breadcrumbs: "Dispute Intake / Evidence-Based Adjudication",
    dispute_title: "Farmer Dispute Resolution Workbench",
    dispute_desc: "Investigate farmer complaints against assigned grades using original field photographs, captured weights, and grading standards. Decisions generate append-only corrections.",
    btn_log_dispute: "Log New Farmer Complaint",
    dispute_queue: "Dispute Queue",
    dispute_queue_sub: "Active cases under adjudication",
    status_open: "Open",
    status_reviewing: "Reviewing",
    status_resolved: "Resolved",

    // Settlements
    payout_breadcrumbs: "Financial Settlement / Automated Payout Runs",
    payout_title: "Farmer Payout Settlement Engine",
    payout_desc: "Automated computation of farmer dues aggregated by produce grade and locked weight. Entries under open dispute are quarantined from payout runs.",
    btn_export_payout: "Export Bank List (CSV)",
    btn_finalize_payout: "Finalize & Lock Payout Run",
    quarantine_title: "Automatic Dispute Quarantine Active",
    quarantine_desc_1: "3 entries totaling",
    hold_val: "Hold value:",
    quarantine_desc_2: "have unresolved farmer disputes and are excluded from this batch.",
    payout_beneficiaries: "Eligible Beneficiaries",
    kyc_verified_sub: "All verified Bank/Aadhaar accounts",
    payout_verified_weight: "Total Verified Weight",
    excl_dispute_sub: "Excludes 524.0 kg in dispute",
    payout_gross_amt: "Gross Amount",
    calc_ledger_sub: "Calculated via locked ledger",
    payout_net_payable: "Net Payable Settlement",
    ready_disburse_sub: "Ready for dual sign-off",
    itemized_payout_title: "Itemized Farmer Settlement Breakdown (24 Beneficiaries)",
    search_farmer_placeholder: "Filter farmer name/ID...",
    th_village: "Village & Center",
    th_grade_a: "Grade A (kg)",
    th_grade_b: "Grade B (kg)",
    th_grade_c: "Grade C (kg)",
    th_total_wt: "Total Weight (kg)",
    th_gross_amt: "Gross Amount",
    th_dispute_hold: "Dispute Hold",
    th_net_payable: "Net Payable (₹)",
    th_ledger_entries: "Entries",

    // Audit & Rates
    audit_breadcrumbs: "Governance & Compliance / Immutable Ledger Proof",
    audit_title: "System Audit Log & Traceability",
    audit_desc: "Every view, fraud flag transition, dispute resolution, rate card modification, and payout authorization is recorded in this append-only audit trail.",
    btn_export_audit: "Export Audit Trail",
    search_audit_placeholder: "Search audit events, actors, entry IDs...",
    rates_breadcrumbs: "Financial Configuration / Grade-Wise Pricing",
    rates_title: "Produce Rate Card Manager",
    rates_desc: "Configure procurement rates per kg for Grade A, B, and C produce. Historical versions are preserved to guarantee past payout integrity.",
    btn_publish_rate: "Publish New Rate Card",
    active_rate_badge: "ACTIVE RATE CARD (v2.3)",
    rate_published_info: "Effective from: 01 September 2026 • Mandi Board Ratlam",
    grade_a_title: "GRADE A (PREMIUM)",
    grade_a_desc: "High firmness, uniform color >90%, zero blemishes, grain size >70mm.",
    grade_b_title: "GRADE B (STANDARD)",
    grade_b_desc: "Moderate firmness, minor color variation, <5% superficial blemish.",
    grade_c_title: "GRADE C (SUB-STANDARD)",
    grade_c_desc: "Small size, irregular shape, >10% surface marks, processing quality.",
    version_history_title: "Version History & Archival",

    // Modals
    digital_pass_badge: "OFFICIAL WEIGHBRIDGE PASS",
    btn_print_receipt: "Print Pass Receipt",
    btn_cancel: "Cancel",
    btn_submit_dispute: "Create Dispute Case & Hold Payout",
    new_dispute_title: "Log Farmer Produce Complaint",
    new_dispute_sub: "Link intake complaint to a locked master ledger entry",
    select_entry_label: "Select Locked Ledger Entry",
    claimed_grade_label: "Farmer Claimed Grade",
    intake_channel_label: "Intake Channel",
    grievance_stmt_label: "Farmer Grievance Statement",
    append_corr_badge: "APPEND-ONLY CORRECTION (FR1.5)",
    corr_modal_title: "Issue Linked Correction Record",
    corr_modal_sub: "Original locked entry remains 100% untouched. This creates a linked adjustment record with audit trail.",
    orig_entry_label: "ORIGINAL LOCKED ENTRY",
    corr_delta_label: "LINKED CORRECTION DELTA",
    corrected_grade_label: "Corrected Grade",
    verified_weight_label: "Verified Weight (kg)",
    net_adj_label: "Net Adjustment Owed:",
    justification_label: "Formal Justification / Findings",
    approver_label: "Approving Officer Identity",
    btn_commit_corr: "Commit Append-Only Correction",
    photo_modal_title: "Point-of-Collection Photo Evidence",
    photo_modal_sub: "Captured by Field Operator during weigh-in • Tamper-proof metadata",
    meta_audit_title: "METADATA AUDIT",
    visual_grading_ref: "Visual Grading Reference",
    dual_sign_badge: "DUAL SIGN-OFF PROTOCOL",
    finalize_payout_title: "Finalize Payout Batch",
    finalize_payout_sub: "Lock settlement batch for financial disbursement. No further adjustments permitted.",
    btn_auth_payout: "Authorize & Seal Payout Batch",
    rationale_label: "Oversight Rationale / Action Taken",
    btn_save_status: "Save Audit Status",
    publish_rate_title: "Publish New Rate Card Version",
    btn_publish_apply: "Publish & Apply Rate Card"
  },

  hi: {
    brand_name: "एफपीओ लेजर",
    brand_subtitle: "मंडी संग्रहण केंद्र",
    operator_id_label: "ऑपरेटर आईडी",
    online_status: "ऑनलाइन",
    nav_my_deliveries: "मेरी आवक / डिलीवरी",
    nav_dashboard: "डैशबोर्ड",
    nav_oversight_section: "अधिकारी निगरानी",
    nav_master_ledger: "मास्टर खाता / लेजर",
    nav_fraud_anomaly: "धोखाधड़ी और विसंगति",
    nav_disputes: "विवाद निवारण कार्यपीठ",
    nav_settlements: "भुगतान निपटान",
    nav_audit_trail: "ऑडिट ट्रेल",
    nav_rate_cards: "दर तालिका (v2.3)",
    field_app_sync: "फील्ड सिंक स्ट्रीम",
    active_operators: "सक्रिय ऑपरेटर",
    mandi_location: "मंडी क्लस्टर",

    // Deliveries Page
    deliveries_title: "मेरी आवक / डिलीवरी",
    deliveries_subtitle: "रतलाम मंडी में आपके लॉट के लिए डिजिटल वेब्रिज पर्चियां।",
    metric_my_lots: "मेरे लॉट",
    metric_estimated_val: "अनुमानित मूल्य",
    metric_pending_verif: "सत्यापन लंबित",
    weighbridge_pass_prefix: "वेब्रिज पर्ची",
    btn_weighbridge_pass: "वेब्रिज पर्ची",
    btn_raise_dispute: "विवाद दर्ज करें",
    status_locked_hashed: "लॉक्ड और हैशेड",
    status_pending_verif: "सत्यापन लंबित",
    th_net_wt: "शुद्ध वजन",
    th_grade: "ग्रेड",
    th_hash: "हैश",

    // Dashboard Page
    dash_title: "मंडी संचालन और लेजर अवलोकन",
    dash_subtitle: "वास्तविक समय खरीद मेट्रिक्स, क्रिप्टोग्राफिक लेजर सत्यापन और मंडी क्लस्टर स्थिति।",
    total_locked_vol: "कुल लॉक्ड मात्रा (आज)",
    active_centers_sub: "32 सक्रिय संग्रहण केंद्रों में",
    estimated_gross_payout: "अनुमानित कुल भुगतान",
    rate_card_sub: "वर्तमान दर तालिका v2.3 के अनुसार",
    grade_dist_today: "ग्रेड वितरण (आज)",
    grade_dist_sub: "क्षेत्रीय बेंचमार्क: A:48% B:36% C:16%",
    anomalies_holds: "विसंगतियाँ और रोक",
    dispute_locked_sub: "₹12,460 उपज विवाद रोक के तहत सुरक्षित",
    ql_master_ledger: "मास्टर लेजर खाता",
    ql_master_ledger_sub: "1,842 अपरिवर्तनीय प्रविष्टियाँ देखें",
    ql_fraud_engine: "सांख्यिकीय धोखाधड़ी इंजन",
    ql_fraud_engine_sub: "3 ऑपरेटर 2.5σ से अधिक विचलित",
    ql_dispute_wb: "विवाद निपटान कार्यपीठ",
    ql_dispute_wb_sub: "4 खुले किसान फोटो दावे",
    ql_payout_run: "भुगतान निपटान",
    ql_payout_run_sub: "24 लाभार्थी खाते स्वीकृत हेतु तैयार",

    // Master Ledger
    ledger_breadcrumbs: "लेजर रिपॉजिटरी / अपरिवर्तनीय मास्टर खाता",
    ledger_title: "लॉक्ड ग्रेडिंग लेजर",
    ledger_desc: "सत्य का एकल स्रोत। फील्ड सबमिशन पर प्रत्येक प्रविष्टि क्रिप्टोग्राफिक रूप से लॉक हो जाती है। संशोधन या विलोपन स्थायी रूप से प्रतिबंधित है।",
    btn_export_csv: "सीएसवी / लेजर निर्यात करें",
    btn_verify_merkle: "मर्कल ट्री सत्यापित करें (100%)",
    search_placeholder: "किसान का नाम, किसान आईडी (FMR-xxx), प्रविष्टि आईडी या ऑपरेटर खोजें...",
    filter_grade: "ग्रेड",
    filter_operator: "ऑपरेटर",
    filter_center: "संग्रहण केंद्र",
    filter_status: "स्थिति",
    btn_reset: "रीसेट करें",
    merkle_locked_tag: "क्रिप्टोग्राफिक रूप से लॉक्ड SHA-256",
    page_label: "पृष्ठ",
    of_label: "का",
    th_entry_id: "प्रविष्टि आईडी",
    th_datetime: "दिनांक व समय",
    th_farmer: "किसान का नाम व आईडी",
    th_operator: "फील्ड ऑपरेटर",
    th_center: "संग्रहण केंद्र",
    th_produce: "फसल उपज",
    th_weight: "वजन (किग्रा)",
    th_rate: "दर (₹/किग्रा)",
    th_payout: "भुगतान (₹)",
    th_photo: "फोटो साक्ष्य",
    th_status: "स्थिति",
    th_action: "कार्रवाई",

    // Fraud & Anomaly
    fraud_breadcrumbs: "जोखिम निगरानी / सांख्यिकीय विसंगति इंजन",
    fraud_title: "ऑपरेटर धोखाधड़ी और विसंगति का पता लगाना",
    fraud_desc: "स्वचालित पीयर-बेंचमार्किंग सांख्यिकीय इंजन ऑपरेटर के ग्रेड आवंटन, गति और किसान पूर्वाग्रह का विश्लेषण कर विसंगतियों को चिन्हित करता है।",
    btn_recalc_risk: "जोखिम स्कोर पुनः गणना करें",
    benchmark_title: "क्षेत्रीय पीयर बेंचमार्क मानक (रतलाम और मालवा कृषि क्षेत्र)",
    benchmark_desc: "इस फसल सीजन में 90 फील्ड ऑपरेटरों की 42,800 ऐतिहासिक प्रविष्टियों पर आधारित। सामान्य वितरण: ग्रेड A = 48.0%, ग्रेड B = 36.0%, ग्रेड C = 16.0%।",
    risk_leaderboard: "रैंक की गई जोखिम लीडरबोर्ड",
    risk_leaderboard_sub: "2.5σ से अधिक भिन्नता या अत्यधिक तीव्र गति वाले ऑपरेटर",

    // Disputes
    dispute_breadcrumbs: "विवाद प्राप्ति / साक्ष्य-आधारित निर्णय",
    dispute_title: "किसान विवाद निवारण कार्यपीठ",
    dispute_desc: "मूल फील्ड फोटो, डिजिटल वजन और ग्रेडिंग मानकों का उपयोग करके ग्रेड के खिलाफ किसान शिकायतों की जांच करें। निर्णयों से परिशिष्ट-मात्र सुधार बनते हैं।",
    btn_log_dispute: "नई किसान शिकायत दर्ज करें",
    dispute_queue: "विवाद कतार",
    dispute_queue_sub: "समीक्षाधीन सक्रिय मामले",
    status_open: "खुले मामले",
    status_reviewing: "समीक्षाधीन",
    status_resolved: "हल किए गए",

    // Settlements
    payout_breadcrumbs: "वित्तीय निपटान / स्वचालित भुगतान बैच",
    payout_title: "किसान भुगतान निपटान इंजन",
    payout_desc: "फसल ग्रेड और लॉक्ड वजन के आधार पर किसान देय राशि की स्वचालित गणना। खुले विवाद वाली प्रविष्टियां भुगतान से रोक दी जाती हैं।",
    btn_export_payout: "बैंक सूची निर्यात करें (CSV)",
    btn_finalize_payout: "भुगतान बैच लॉक व अधिकृत करें",
    quarantine_title: "स्वचालित विवाद रोकथाम सक्रिय",
    quarantine_desc_1: "कुल",
    hold_val: "रोक राशि:",
    quarantine_desc_2: "की 3 प्रविष्टियों में अनसुलझे विवाद हैं और इन्हें इस बैच से अलग रखा गया है।",
    payout_beneficiaries: "पात्र लाभार्थी किसान",
    kyc_verified_sub: "सभी सत्यापित बैंक/आधार खाते",
    payout_verified_weight: "कुल सत्यापित वजन",
    excl_dispute_sub: "विवाद में 524.0 किग्रा को छोड़कर",
    payout_gross_amt: "सकल राशि",
    calc_ledger_sub: "लॉक्ड लेजर द्वारा परिकलित",
    payout_net_payable: "शुद्ध देय निपटान राशि",
    ready_disburse_sub: "स्वीकृति व वितरण हेतु तैयार",
    itemized_payout_title: "मदवार किसान निपटान विवरण (24 लाभार्थी)",
    search_farmer_placeholder: "किसान का नाम/आईडी खोजें...",
    th_village: "गांव व केंद्र",
    th_grade_a: "ग्रेड A (किग्रा)",
    th_grade_b: "ग्रेड B (किग्रा)",
    th_grade_c: "ग्रेड C (किग्रा)",
    th_total_wt: "कुल वजन (किग्रा)",
    th_gross_amt: "सकल राशि",
    th_dispute_hold: "विवाद रोक",
    th_net_payable: "शुद्ध देय (₹)",
    th_ledger_entries: "प्रविष्टियाँ",

    // Audit & Rates
    audit_breadcrumbs: "प्रशासन और अनुपालन / अपरिवर्तनीय लेजर प्रमाण",
    audit_title: "सिस्टम ऑडिट लॉग और ट्रेसेबिलिटी",
    audit_desc: "प्रत्येक दृश्य, जोखिम ध्वज परिवर्तन, विवाद समाधान, दर तालिका संशोधन और भुगतान प्राधिकरण इस अपरिवर्तनीय ऑडिट ट्रेल में दर्ज है।",
    btn_export_audit: "ऑडिट ट्रेल निर्यात करें",
    search_audit_placeholder: "ऑडिट घटनाएं, ऑपरेटर, प्रविष्टि आईडी खोजें...",
    rates_breadcrumbs: "वित्तीय विन्यास / ग्रेड-वार मूल्य निर्धारण",
    rates_title: "उपज दर तालिका प्रबंधक",
    rates_desc: "ग्रेड A, B और C उपज के लिए प्रति किग्रा खरीद दरें निर्धारित करें। पिछले भुगतानों की अखंडता हेतु ऐतिहासिक संस्करण सुरक्षित रहते हैं।",
    btn_publish_rate: "नई दर तालिका प्रकाशित करें",
    active_rate_badge: "सक्रिय दर तालिका (v2.3)",
    rate_published_info: "प्रभावी दिनांक: 01 सितंबर 2026 • मंडी बोर्ड रतलाम",
    grade_a_title: "ग्रेड A (प्रीमियम)",
    grade_a_desc: "उच्च गुणवत्ता, एक समान रंग >90%, कोई दाग नहीं, दाना आकार >70 मिमी।",
    grade_b_title: "ग्रेड B (मानक)",
    grade_b_desc: "मध्यम गुणवत्ता, मामूली रंग भिन्नता, <5% सतही दाग।",
    grade_c_title: "ग्रेड C (उप-मानक)",
    grade_c_desc: "छोटा आकार, अनियमित बनावट, >10% सतह के निशान, प्रसंस्करण गुणवत्ता।",
    version_history_title: "संस्करण इतिहास और पुरालेख",

    // Modals
    digital_pass_badge: "आधिकारिक वेब्रिज पर्ची",
    btn_print_receipt: "पर्ची रसीद प्रिंट करें",
    btn_cancel: "रद्द करें",
    btn_submit_dispute: "विवाद दर्ज करें और भुगतान रोकें",
    new_dispute_title: "किसान उपज शिकायत दर्ज करें",
    new_dispute_sub: "शिकायत को लॉक्ड मास्टर लेजर प्रविष्टि से जोड़ें",
    select_entry_label: "लॉक्ड लेजर प्रविष्टि चुनें",
    claimed_grade_label: "किसान द्वारा दावा किया गया ग्रेड",
    intake_channel_label: "प्राप्ति माध्यम",
    grievance_stmt_label: "किसान शिकायत विवरण",
    append_corr_badge: "परिशिष्ट-मात्र संशोधन (FR1.5)",
    corr_modal_title: "लिंक्ड संशोधन रिकॉर्ड जारी करें",
    corr_modal_sub: "मूल लॉक्ड प्रविष्टि 100% अपरिवर्तित रहती है। यह ऑडिट ट्रेल के साथ एक लिंक्ड समायोजन रिकॉर्ड बनाता है।",
    orig_entry_label: "मूल लॉक्ड प्रविष्टि",
    corr_delta_label: "लिंक्ड संशोधन समायोजन",
    corrected_grade_label: "संशोधित ग्रेड",
    verified_weight_label: "सत्यापित वजन (किग्रा)",
    net_adj_label: "शुद्ध समायोजन देय:",
    justification_label: "औपचारिक कारण / जांच निष्कर्ष",
    approver_label: "अनुमोदन अधिकारी पहचान",
    btn_commit_corr: "परिशिष्ट संशोधन लागू करें",
    photo_modal_title: "संग्रहण बिंदु फोटो साक्ष्य",
    photo_modal_sub: "तौल के दौरान फील्ड ऑपरेटर द्वारा ली गई • छेड़छाड़-रोधी मेटाडेटा",
    meta_audit_title: "मेटाडेटा ऑडिट",
    visual_grading_ref: "दृश्य ग्रेडिंग संदर्भ",
    dual_sign_badge: "दोहरा हस्ताक्षर प्रोटोकॉल",
    finalize_payout_title: "भुगतान बैच को अंतिम रूप दें",
    finalize_payout_sub: "वित्तीय संवितरण के लिए निपटान बैच को लॉक करें। इसके बाद किसी भी समायोजन की अनुमति नहीं होगी।",
    btn_auth_payout: "भुगतान बैच अधिकृत और सील करें",
    rationale_label: "निगरानी कारण / की गई कार्रवाई",
    btn_save_status: "ऑडिट स्थिति सहेजें",
    publish_rate_title: "नया दर तालिका संस्करण प्रकाशित करें",
    btn_publish_apply: "दर तालिका प्रकाशित व लागू करें"
  }
};

// ============================================================================
// 2. Application State & Rich Datasets
// ============================================================================

const APP_STATE = {
  currentRole: 'FPO_ADMIN',
  currentCluster: 'ratlam_mandi',
  currentLang: 'en',
  theme: 'light',
  activeTab: 'deliveries', // Default view matching reference image!
  selectedOperatorId: 'OP-4092',
  selectedDisputeId: 'DSP-2026-081',
  
  // Delivery Passes Matching Reference Image
  deliveryPasses: [
    {
      id: 'TXN-88401',
      produceEn: 'Wheat (Sharbati)',
      produceHi: 'गेहूं (शरबती)',
      dateEn: '16 Sept, 10:31 am',
      dateHi: '16 सितं, 10:31 पूर्वाह्न',
      netWeight: '624 kg',
      weightKg: 624.0,
      grade: 'A',
      hash: '9a3b...ea44',
      fullHash: '9a3bc481f90e821fa7e44b9102c918a',
      status: 'LOCKED', // 'LOCKED' | 'PENDING'
      grossWeight: '3,840 kg',
      tareWeight: '3,216 kg',
      vehicleNo: 'MP-43-GA-8120',
      moisture: '11.2%',
      ratePerKg: 28.00,
      totalAmount: 17472.00,
      operatorName: 'Sachin Kale (OP-4092)',
      farmerName: 'Ramesh Patil (FMR-1082)',
      center: 'Ratlam Main Mandi Yard 2'
    },
    {
      id: 'TXN-88400',
      produceEn: 'Soybean',
      produceHi: 'सोयाबीन',
      dateEn: '16 Sept, 10:09 am',
      dateHi: '16 सितं, 10:09 पूर्वाह्न',
      netWeight: '403 kg',
      weightKg: 403.0,
      grade: 'B',
      hash: '4f18...7e19',
      fullHash: '4f182b8109d4310e7e199a0b12cf921',
      status: 'LOCKED',
      grossWeight: '2,950 kg',
      tareWeight: '2,547 kg',
      vehicleNo: 'MP-43-B-4190',
      moisture: '10.8%',
      ratePerKg: 21.00,
      totalAmount: 8463.00,
      operatorName: 'Pravin Jadhav (OP-3180)',
      farmerName: 'Ramesh Patil (FMR-1082)',
      center: 'Ratlam Main Mandi Yard 1'
    },
    {
      id: 'TXN-88399',
      produceEn: 'Chana (Bengal Gram)',
      produceHi: 'चना (देसी)',
      dateEn: '16 Sept, 09:42 am',
      dateHi: '16 सितं, 09:42 पूर्वाह्न',
      netWeight: '510 kg',
      weightKg: 510.0,
      grade: 'Under Check',
      gradeHi: 'जांच जारी',
      hash: 'Pending QC',
      hashHi: 'क्यूसी लंबित',
      status: 'PENDING',
      grossWeight: '3,210 kg',
      tareWeight: '2,700 kg',
      vehicleNo: 'MP-43-C-1092',
      moisture: '12.0%',
      ratePerKg: 28.00,
      totalAmount: 14280.00,
      operatorName: 'Sachin Kale (OP-4092)',
      farmerName: 'Ramesh Patil (FMR-1082)',
      center: 'Ratlam Grain Terminal'
    },
    {
      id: 'TXN-88398',
      produceEn: 'Mustard (Sarson)',
      produceHi: 'सरसों',
      dateEn: '15 Sept, 04:15 pm',
      dateHi: '15 सितं, 04:15 अपराह्न',
      netWeight: '780 kg',
      weightKg: 780.0,
      grade: 'A',
      hash: '7c2d...88e1',
      fullHash: '7c2d431f08e921b88e129cf3901ba64',
      status: 'LOCKED',
      grossWeight: '4,100 kg',
      tareWeight: '3,320 kg',
      vehicleNo: 'MP-43-T-7721',
      moisture: '8.4%',
      ratePerKg: 28.00,
      totalAmount: 21840.00,
      operatorName: 'Snehal Shinde (OP-2841)',
      farmerName: 'Ramesh Patil (FMR-1082)',
      center: 'Jaora Mandi Sub-Center'
    },
    {
      id: 'TXN-88395',
      produceEn: 'Onion (Nashik Red)',
      produceHi: 'प्याज (नासिक लाल)',
      dateEn: '15 Sept, 02:20 pm',
      dateHi: '15 सितं, 02:20 अपराह्न',
      netWeight: '1,250 kg',
      weightKg: 1250.0,
      grade: 'B',
      hash: '3e9f...6b10',
      fullHash: '3e9f884102c918a6b1062cd189eb812',
      status: 'LOCKED',
      grossWeight: '4,650 kg',
      tareWeight: '3,400 kg',
      vehicleNo: 'MP-43-K-9043',
      moisture: '14.1%',
      ratePerKg: 21.00,
      totalAmount: 26250.00,
      operatorName: 'Deepak More (OP-1904)',
      farmerName: 'Ramesh Patil (FMR-1082)',
      center: 'Ratlam Vegetable Yard'
    }
  ],

  // Rate Cards
  rateCards: [
    {
      version: 'v2.3',
      effectiveDate: '2026-09-01',
      publishedBy: 'Vikram Shah (HQ Admin)',
      memo: 'Standard post-monsoon minimum support benchmark.',
      rates: { A: 28.00, B: 21.00, C: 14.00 },
      active: true
    },
    {
      version: 'v2.2',
      effectiveDate: '2026-07-15',
      publishedBy: 'Vikram Shah (HQ Admin)',
      memo: 'Mid-monsoon procurement price tier.',
      rates: { A: 26.50, B: 19.50, C: 13.00 },
      active: false
    }
  ],

  // Operators Database
  operators: [
    {
      id: 'OP-4092',
      name: 'Sachin Kale',
      phone: '+91 98221 40921',
      center: 'Ratlam Main Mandi Yard 2',
      totalEntries: 248,
      distribution: { A: 18.2, B: 28.4, C: 53.4 },
      avgGradingTimeSec: 21,
      riskScore: 94,
      riskLevel: 'HIGH',
      status: 'UNDER_REVIEW',
      statusNote: 'Assigned C-Grade 3.3x peer average. Repeated farmer complaints logged.',
      anomalyReason: 'Operator is assigning C-Grade 3.3x more often than peer benchmark (53.4% vs 16.0%). Grading velocity is implausibly rapid (avg 21s/entry).',
      signals: ['C-Grade 3.3x Peer Avg', 'Rapid Velocity (<25s)', 'High Dispute Count (4 cases)'],
      disputesCount: 4,
      lastActive: '12 mins ago'
    },
    {
      id: 'OP-3180',
      name: 'Pravin Jadhav',
      phone: '+91 98232 31804',
      center: 'Ratlam Main Mandi Yard 1',
      totalEntries: 312,
      distribution: { A: 76.5, B: 18.0, C: 5.5 },
      avgGradingTimeSec: 28,
      riskScore: 88,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      statusNote: 'Excessive Grade-A allocation to specific farmer subset.',
      anomalyReason: 'Unusually high Grade A allocation (76.5% vs 48.0% peer benchmark). Apparent favoritism towards specific farmer IDs.',
      signals: ['Grade A +28.5% Over Peer', 'Specific Farmer Favoritism', 'Off-Hours Entries'],
      disputesCount: 1,
      lastActive: '5 mins ago'
    },
    {
      id: 'OP-2841',
      name: 'Snehal Shinde',
      phone: '+91 98811 28412',
      center: 'Jaora Mandi Sub-Center',
      totalEntries: 420,
      distribution: { A: 38.0, B: 46.0, C: 16.0 },
      avgGradingTimeSec: 54,
      riskScore: 48,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      statusNote: 'Slight Grade B elevation, within tolerable bounds.',
      anomalyReason: 'Moderate elevation of Grade B produce (46% vs 36% peer). Likely due to local heavy rainfall affecting skin firmness.',
      signals: ['Grade B Elevation (+10%)'],
      disputesCount: 1,
      lastActive: 'Just now'
    },
    {
      id: 'OP-1904',
      name: 'Deepak More',
      phone: '+91 98500 19045',
      center: 'Ratlam Vegetable Yard',
      totalEntries: 290,
      distribution: { A: 42.0, B: 40.0, C: 18.0 },
      avgGradingTimeSec: 48,
      riskScore: 36,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      statusNote: 'Normal variance.',
      anomalyReason: 'Slight timing velocity outliers during morning peak intake hours.',
      signals: ['Peak Hour Velocity Spike'],
      disputesCount: 0,
      lastActive: '18 mins ago'
    }
  ],

  // 50+ Ledger Entries
  ledgerEntries: [],
  
  // Disputes
  disputes: [
    {
      id: 'DSP-2026-081',
      entryId: 'ENT-9042',
      farmerId: 'FMR-1082',
      farmerName: 'Ramesh Patil',
      operatorId: 'OP-4092',
      operatorName: 'Sachin Kale',
      produce: 'Nashik Red Onion',
      assignedGrade: 'C',
      claimedGrade: 'A',
      weightKg: 142.5,
      holdAmount: 1995.00,
      potentialAmount: 3990.00,
      intakeDate: '15 Sep 2026, 09:15 AM',
      intakeChannel: 'In-Person at Mandi Center',
      grievance: 'Produce was dry, fully cured, single-centered with 0% decay. Operator Sachin marked it Grade C without proper visual inspection.',
      status: 'OPEN',
      reviewedBy: null,
      verdict: null,
      reviewNotes: '',
      photoUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'DSP-2026-079',
      entryId: 'ENT-9038',
      farmerId: 'FMR-1044',
      farmerName: 'Suresh Deshmukh',
      operatorId: 'OP-4092',
      operatorName: 'Sachin Kale',
      produce: 'Hybrid Tomato (Abhinav)',
      assignedGrade: 'C',
      claimedGrade: 'A',
      weightKg: 210.0,
      holdAmount: 2940.00,
      potentialAmount: 5880.00,
      intakeDate: '15 Sep 2026, 08:40 AM',
      intakeChannel: 'Toll-Free Farmer Helpline',
      grievance: 'Harvested fresh at breaker stage, uniform red color >90%, zero insect bore. Operator graded Grade C.',
      status: 'OPEN',
      reviewedBy: null,
      verdict: null,
      reviewNotes: '',
      photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'DSP-2026-075',
      entryId: 'ENT-9019',
      farmerId: 'FMR-1099',
      farmerName: 'Baburao Ghadge',
      operatorId: 'OP-5129',
      operatorName: 'Amit Sonawane',
      produce: 'Nashik Red Onion',
      assignedGrade: 'C',
      claimedGrade: 'B',
      weightKg: 171.5,
      holdAmount: 2401.00,
      potentialAmount: 3601.50,
      intakeDate: '14 Sep 2026, 04:20 PM',
      intakeChannel: 'In-Person at Mandi Center',
      grievance: 'Slight skin tear on 2% bulbs, but firm flesh. Should have been standard Grade B.',
      status: 'UNDER_REVIEW',
      reviewedBy: 'Anjali Patil (FPO)',
      verdict: null,
      reviewNotes: 'Photo inspection scheduled with Mandi quality supervisor.',
      photoUrl: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=80'
    }
  ],

  corrections: [],
  auditLog: [
    {
      id: 'EVT-9921',
      timestamp: '16 Sep 2026, 10:31:04 IST',
      actor: 'Sachin Kale (Operator OP-4092)',
      action: 'LEDGER_ENTRY_LOCK',
      desc: 'Locked digital weighbridge pass TXN-88401 for 624 kg Wheat (Sharbati) Grade A. Merkle root hash sealed.'
    },
    {
      id: 'EVT-9918',
      timestamp: '16 Sep 2026, 10:09:12 IST',
      actor: 'Pravin Jadhav (Operator OP-3180)',
      action: 'LEDGER_ENTRY_LOCK',
      desc: 'Locked digital weighbridge pass TXN-88400 for 403 kg Soybean Grade B.'
    },
    {
      id: 'EVT-9904',
      timestamp: '15 Sep 2026, 16:45:10 IST',
      actor: 'Anjali Patil (FPO Officer)',
      action: 'DISPUTE_RESOLUTION',
      desc: 'Approved append-only correction CORR-2026-012 for Entry ENT-9012. Upgraded Grade C to Grade A (+₹1,680.00).'
    }
  ],

  filters: {
    search: '',
    grade: 'ALL',
    operator: 'ALL',
    center: 'ALL',
    status: 'ALL'
  },

  pagination: {
    page: 1,
    pageSize: 12
  }
};

// ============================================================================
// 3. UI Initialization & Setup
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Check persisted language preference
  const savedLang = localStorage.getItem('fpo_lang');
  if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
    APP_STATE.currentLang = savedLang;
  }

  // Generate realistic dataset
  APP_STATE.ledgerEntries = generateRealisticLedger();

  // Populate filter dropdowns
  populateOperatorDropdowns();

  // Initial renders
  renderDeliveryCards();
  renderLedgerTable();
  renderOperatorRiskCards();
  renderOperatorDetails(APP_STATE.selectedOperatorId);
  renderDisputeList();
  renderDisputeWorkbench(APP_STATE.selectedDisputeId);
  renderPayoutTable();
  renderAuditTimeline();
  renderRateCardHistory();
  updateTopMetrics();

  // Apply Language
  setLanguage(APP_STATE.currentLang);

  // Setup Global Event Listeners
  setupNavigation();
  setupLanguageSwitcher();
  setupRoleSwitcher();
  setupSidebarToggle();
  setupLedgerControls();
  setupAnomalyControls();
  setupDisputeControls();
  setupRateCardControls();
  setupModals();
  setupThemeToggle();
  setupIntegrityVerification();

  showToast(APP_STATE.currentLang === 'hi' ? 'एफपीओ लेजर सिस्टम तैयार है।' : 'FPO Ledger System ready. Tamper-proof weighbridge active.', 'success');
});

// ============================================================================
// 4. Language Translation System (English ↔ Hindi)
// ============================================================================

function setupLanguageSwitcher() {
  const btnEn = document.getElementById('langBtnEn');
  const btnHi = document.getElementById('langBtnHi');

  if (btnEn) {
    btnEn.addEventListener('click', () => setLanguage('en'));
  }
  if (btnHi) {
    btnHi.addEventListener('click', () => setLanguage('hi'));
  }
}

function setLanguage(lang) {
  APP_STATE.currentLang = lang;
  localStorage.setItem('fpo_lang', lang);

  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;

  // Toggle active class on switcher buttons
  const btnEn = document.getElementById('langBtnEn');
  const btnHi = document.getElementById('langBtnHi');
  if (btnEn && btnHi) {
    btnEn.classList.toggle('active', lang === 'en');
    btnHi.classList.toggle('active', lang === 'hi');
  }

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Re-render components that include dynamic text
  renderDeliveryCards();
  renderLedgerTable();
  renderDisputeList();
  renderDisputeWorkbench(APP_STATE.selectedDisputeId);
}

// ============================================================================
// 5. My Deliveries View (Exact Match With Reference Screenshot)
// ============================================================================

function renderDeliveryCards() {
  const container = document.getElementById('deliveryPassesContainer');
  if (!container) return;

  const isHindi = APP_STATE.currentLang === 'hi';
  const dict = I18N_DICTIONARY[APP_STATE.currentLang];

  container.innerHTML = '';

  APP_STATE.deliveryPasses.forEach(pass => {
    const card = document.createElement('div');
    card.className = 'pass-card';

    const produceTitle = isHindi ? pass.produceHi : pass.produceEn;
    const dateText = isHindi ? pass.dateHi : pass.dateEn;
    const gradeText = isHindi && pass.gradeHi ? pass.gradeHi : pass.grade;
    const hashText = isHindi && pass.hashHi ? pass.hashHi : pass.hash;

    const isLocked = pass.status === 'LOCKED';
    const statusPill = isLocked 
      ? `<span class="status-pill-locked">
           <svg style="width:13px; height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
             <polyline points="9 12 11 14 15 10"></polyline>
           </svg>
           ${dict.status_locked_hashed}
         </span>`
      : `<span class="status-pill-pending">
           <svg style="width:13px; height:13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="12" y1="8" x2="12" y2="12"></line>
           </svg>
           ${dict.status_pending_verif}
         </span>`;

    card.innerHTML = `
      <div>
        <div class="pass-card-header">
          <div>
            <span class="pass-meta-top">${dict.weighbridge_pass_prefix} • ${pass.id}</span>
            <h3 class="pass-crop-title">${produceTitle}</h3>
            <span class="pass-timestamp">${dateText}</span>
          </div>
          <div>${statusPill}</div>
        </div>

        <div class="pass-stats-strip">
          <div class="pass-stat-col">
            <span class="stat-col-label">${dict.th_net_wt}</span>
            <span class="stat-col-val">${pass.netWeight}</span>
          </div>
          <div class="pass-stat-col">
            <span class="stat-col-label">${dict.th_grade}</span>
            <span class="stat-col-val">${gradeText}</span>
          </div>
          <div class="pass-stat-col">
            <span class="stat-col-label">${dict.th_hash}</span>
            <span class="stat-col-hash">${hashText}</span>
          </div>
        </div>
      </div>

      <div class="pass-actions-row">
        <button class="btn-card-action" onclick="openWeighbridgePassModal('${pass.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>${dict.btn_weighbridge_pass}</span>
        </button>

        <button class="btn-card-action" onclick="triggerDisputeForPass('${pass.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>${dict.btn_raise_dispute}</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// ============================================================================
// 6. Digital Weighbridge Pass Receipt Modal
// ============================================================================

function openWeighbridgePassModal(passId) {
  const pass = APP_STATE.deliveryPasses.find(p => p.id === passId);
  if (!pass) return;

  const modal = document.getElementById('weighbridgePassModal');
  const content = document.getElementById('weighbridgeReceiptContent');
  if (!modal || !content) return;

  const isHindi = APP_STATE.currentLang === 'hi';
  const produceName = isHindi ? pass.produceHi : pass.produceEn;

  content.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-mandi-name">RATLAM KRISHI UPAJ MANDI SAMITI</div>
      <div class="receipt-title">AUTOMATED DIGITAL WEIGHBRIDGE SLIP</div>
      <div style="font-size:11px; color:#64748b; margin-top:2px;">Under APMC Act & FPO Produce Digital Khata Protocol</div>
    </div>

    <div class="receipt-grid">
      <div class="receipt-item"><span class="r-lbl">Transaction Slip ID:</span> <span class="r-val">${pass.id}</span></div>
      <div class="receipt-item"><span class="r-lbl">Date & Time:</span> <span class="r-val">${pass.dateEn}</span></div>
      <div class="receipt-item"><span class="r-lbl">Farmer / Member:</span> <span class="r-val">${pass.farmerName}</span></div>
      <div class="receipt-item"><span class="r-lbl">Vehicle Number:</span> <span class="r-val">${pass.vehicleNo}</span></div>
      <div class="receipt-item"><span class="r-lbl">Commodity Produce:</span> <span class="r-val">${produceName}</span></div>
      <div class="receipt-item"><span class="r-lbl">Assigned Grade:</span> <span class="r-val">Grade ${pass.grade}</span></div>
      <div class="receipt-item"><span class="r-lbl">Moisture Content:</span> <span class="r-val">${pass.moisture}</span></div>
      <div class="receipt-item"><span class="r-lbl">Field Weigh Operator:</span> <span class="r-val">${pass.operatorName}</span></div>
    </div>

    <table class="receipt-table">
      <thead>
        <tr>
          <th>Weight Measurement</th>
          <th style="text-align:right;">Recorded Value (kg)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gross Vehicle Weight:</td>
          <td style="text-align:right; font-weight:600;">${pass.grossWeight}</td>
        </tr>
        <tr>
          <td>Tare Vehicle Weight:</td>
          <td style="text-align:right; font-weight:600;">${pass.tareWeight}</td>
        </tr>
        <tr style="background:#f1f5f9; font-weight:800;">
          <td>NET PRODUCE WEIGHT:</td>
          <td style="text-align:right; color:#16a34a; font-size:15px;">${pass.netWeight}</td>
        </tr>
        <tr>
          <td>Procurement Benchmark Rate:</td>
          <td style="text-align:right;">${pass.ratePerKg}</td>
        </tr>
        <tr style="font-weight:800; font-size:14px;">
          <td>ESTIMATED LOT PAYOUT:</td>
          <td style="text-align:right; color:#0f172a;">₹${pass.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:11px; font-weight:700; color:#475569; margin-top:12px;">CRYPTOGRAPHIC MERKLE SEAL (SHA-256)</div>
    <div class="receipt-hash-block">
      ${pass.fullHash}
    </div>
    <div style="font-size:10.5px; color:#94a3b8; text-align:center; margin-top:10px;">
      Digitally certified by Mandi Load Cell Sensor • Tampering invalidates receipt.
    </div>
  `;

  // Connect modal buttons
  const btnPrint = document.getElementById('btnPrintPassSlip');
  const btnDispute = document.getElementById('btnPassRaiseDispute');

  if (btnPrint) {
    btnPrint.onclick = () => window.print();
  }
  if (btnDispute) {
    btnDispute.onclick = () => {
      modal.classList.remove('open');
      triggerDisputeForPass(pass.id);
    };
  }

  modal.classList.add('open');
}

function triggerDisputeForPass(passId) {
  const pass = APP_STATE.deliveryPasses.find(p => p.id === passId);
  const disputeModal = document.getElementById('newDisputeModal');
  if (!disputeModal) return;

  // Populate select with this pass
  const select = document.getElementById('newDisputeEntrySelect');
  if (select && pass) {
    select.innerHTML = `<option value="${pass.id}" selected>${pass.id} — ${pass.produceEn} (${pass.netWeight}) — Grade ${pass.grade}</option>`;
  }

  disputeModal.classList.add('open');
}

// ============================================================================
// 7. Navigation & Role Switching
// ============================================================================

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  APP_STATE.activeTab = tabId;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  // Automatically close mobile sidebar drawer on tab switch
  if (window.innerWidth <= 992) {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  if (tabId === 'deliveries') renderDeliveryCards();
  if (tabId === 'ledger') renderLedgerTable();
  if (tabId === 'fraud') renderOperatorRiskCards();
  if (tabId === 'disputes') renderDisputeList();
  if (tabId === 'settlement') renderPayoutTable();
  if (tabId === 'audit') renderAuditTimeline();
}

function setupSidebarToggle() {
  const btn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('active', sidebar.classList.contains('mobile-open'));
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  if (backdrop && sidebar) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }
}

function setupRoleSwitcher() {
  const headerOpDisplay = document.getElementById('headerOpDisplay');
  const headerAvatarCircle = document.getElementById('headerAvatarCircle');
  const headerUserName = document.getElementById('headerUserName');
  const headerUserRoleTitle = document.getElementById('headerUserRoleTitle');
  const dashGreetingTitle = document.getElementById('dashGreetingTitle');

  if (headerOpDisplay) headerOpDisplay.textContent = 'ADM-4092 • FPO Admin';
  if (headerAvatarCircle) headerAvatarCircle.textContent = 'AK';
  if (headerUserName) headerUserName.textContent = 'Anita Kapoor';
  if (headerUserRoleTitle) headerUserRoleTitle.textContent = 'FPO Admin';
  if (dashGreetingTitle) dashGreetingTitle.textContent = 'Good morning, Anita 👋';
}

// ============================================================================
// 8. Master Ledger Generator & Controls
// ============================================================================

function generateRealisticLedger() {
  const crops = [
    { name: 'Wheat (Sharbati)', gradeRates: { A: 28.0, B: 21.0, C: 14.0 } },
    { name: 'Soybean', gradeRates: { A: 28.0, B: 21.0, C: 14.0 } },
    { name: 'Chana (Bengal Gram)', gradeRates: { A: 28.0, B: 21.0, C: 14.0 } },
    { name: 'Mustard (Sarson)', gradeRates: { A: 28.0, B: 21.0, C: 14.0 } },
    { name: 'Onion (Nashik Red)', gradeRates: { A: 28.0, B: 21.0, C: 14.0 } }
  ];

  const farmers = [
    { id: 'FMR-1082', name: 'Ramesh Patil', village: 'Dindori Rural' },
    { id: 'FMR-1044', name: 'Suresh Deshmukh', village: 'Pimpalgaon East' },
    { id: 'FMR-1099', name: 'Baburao Ghadge', village: 'Kalwan North' },
    { id: 'FMR-1021', name: 'Ganesh Shirole', village: 'Niphad Mandi' },
    { id: 'FMR-1055', name: 'Santosh Jadhav', village: 'Yeola Central' },
    { id: 'FMR-1067', name: 'Sunil Wagh', village: 'Sinnar Agro' }
  ];

  const operators = APP_STATE.operators;
  const entries = [];

  for (let i = 1; i <= 40; i++) {
    const crop = crops[i % crops.length];
    const farmer = farmers[i % farmers.length];
    const op = operators[i % operators.length];
    const grade = (i % 5 === 0) ? 'C' : (i % 3 === 0) ? 'B' : 'A';
    const weight = Math.floor(180 + (i * 37) % 650) + 0.5;
    const rate = crop.gradeRates[grade];
    const amount = weight * rate;
    const isDisputed = i === 1 || i === 2;

    entries.push({
      id: `ENT-${9000 + i}`,
      timestamp: `16 Sep 2026, 0${(8 + (i % 4))}:${(10 + (i * 7) % 50)} AM`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      village: farmer.village,
      operatorId: op.id,
      operatorName: op.name,
      center: op.center,
      produce: crop.name,
      grade: grade,
      weightKg: weight,
      ratePerKg: rate,
      computedAmount: amount,
      status: isDisputed ? 'DISPUTED' : 'LOCKED',
      merkleHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
      photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
    });
  }

  return entries;
}

function renderLedgerTable() {
  const tbody = document.getElementById('ledgerTableBody');
  if (!tbody) return;

  const entries = getFilteredLedgerEntries();
  const start = (APP_STATE.pagination.page - 1) * APP_STATE.pagination.pageSize;
  const paged = entries.slice(start, start + APP_STATE.pagination.pageSize);

  tbody.innerHTML = '';

  paged.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="mono-cell" style="font-weight:700; color:var(--primary);">${e.id}</span></td>
      <td>${e.timestamp}</td>
      <td>
        <div style="display:flex; flex-direction:column;">
          <strong style="font-size:13.5px;">${e.farmerName}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${e.farmerId} • ${e.village}</span>
        </div>
      </td>
      <td>${e.operatorName}</td>
      <td>${e.center}</td>
      <td><strong>${e.produce}</strong></td>
      <td class="text-center"><span class="grade-pill ${e.grade === 'A' ? 'pill-a' : e.grade === 'B' ? 'pill-b' : 'pill-c'}">Grade ${e.grade}</span></td>
      <td class="text-right font-bold">${e.weightKg.toFixed(1)}</td>
      <td class="text-right">₹${e.ratePerKg.toFixed(2)}</td>
      <td class="text-right font-bold">₹${e.computedAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
      <td class="text-center">
        <button class="btn btn-ghost" style="padding:4px 8px; font-size:11px;" onclick="openPhotoModal('${e.id}')">📷 View</button>
      </td>
      <td class="text-center">
        ${e.status === 'LOCKED' ? '<span class="status-pill-locked" style="font-size:11px; padding:3px 8px;">LOCKED</span>' : '<span class="status-pill-pending" style="font-size:11px; padding:3px 8px;">HOLD</span>'}
      </td>
      <td class="text-right">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11.5px;" onclick="openCorrectionModal('${e.id}')">Correction</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const countEl = document.getElementById('ledgerShowingCount');
  if (countEl) countEl.textContent = `Showing ${start + 1}-${Math.min(start + paged.length, entries.length)} of ${entries.length} entries`;
}

function getFilteredLedgerEntries() {
  return APP_STATE.ledgerEntries.filter(e => {
    if (APP_STATE.filters.search) {
      const s = APP_STATE.filters.search;
      if (!e.farmerName.toLowerCase().includes(s) && !e.farmerId.toLowerCase().includes(s) && !e.id.toLowerCase().includes(s) && !e.operatorName.toLowerCase().includes(s)) return false;
    }
    if (APP_STATE.filters.grade !== 'ALL' && e.grade !== APP_STATE.filters.grade) return false;
    if (APP_STATE.filters.operator !== 'ALL' && e.operatorId !== APP_STATE.filters.operator) return false;
    if (APP_STATE.filters.center !== 'ALL' && e.center !== APP_STATE.filters.center) return false;
    if (APP_STATE.filters.status !== 'ALL' && e.status !== APP_STATE.filters.status) return false;
    return true;
  });
}

function populateOperatorDropdowns() {
  const filterOperator = document.getElementById('filterOperator');
  if (!filterOperator) return;

  filterOperator.innerHTML = '<option value="ALL">All Field Operators</option>';
  APP_STATE.operators.forEach(op => {
    const opt = document.createElement('option');
    opt.value = op.id;
    opt.textContent = `${op.name} (${op.id}) — ${op.center}`;
    filterOperator.appendChild(opt);
  });
}

function setupLedgerControls() {
  const searchInput = document.getElementById('ledgerSearchInput');
  const filterGrade = document.getElementById('filterGrade');
  const filterOperator = document.getElementById('filterOperator');
  const filterCenter = document.getElementById('filterCenter');
  const filterStatus = document.getElementById('filterStatus');
  const btnReset = document.getElementById('btnResetFilters');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  const btnExport = document.getElementById('btnExportLedger');

  if (searchInput) {
    searchInput.oninput = (e) => {
      APP_STATE.filters.search = e.target.value.toLowerCase();
      APP_STATE.pagination.page = 1;
      renderLedgerTable();
    };
  }

  if (filterGrade) {
    filterGrade.onchange = (e) => {
      APP_STATE.filters.grade = e.target.value;
      APP_STATE.pagination.page = 1;
      renderLedgerTable();
    };
  }

  if (filterOperator) {
    filterOperator.onchange = (e) => {
      APP_STATE.filters.operator = e.target.value;
      APP_STATE.pagination.page = 1;
      renderLedgerTable();
    };
  }

  if (filterCenter) {
    filterCenter.onchange = (e) => {
      APP_STATE.filters.center = e.target.value;
      APP_STATE.pagination.page = 1;
      renderLedgerTable();
    };
  }

  if (filterStatus) {
    filterStatus.onchange = (e) => {
      APP_STATE.filters.status = e.target.value;
      APP_STATE.pagination.page = 1;
      renderLedgerTable();
    };
  }

  if (btnReset) {
    btnReset.onclick = () => {
      APP_STATE.filters = { search: '', grade: 'ALL', operator: 'ALL', center: 'ALL', status: 'ALL' };
      APP_STATE.pagination.page = 1;
      if (searchInput) searchInput.value = '';
      if (filterGrade) filterGrade.value = 'ALL';
      if (filterOperator) filterOperator.value = 'ALL';
      if (filterCenter) filterCenter.value = 'ALL';
      if (filterStatus) filterStatus.value = 'ALL';
      renderLedgerTable();
      showToast('Ledger filters reset to defaults.', 'info');
    };
  }

  if (btnPrev) {
    btnPrev.onclick = () => {
      if (APP_STATE.pagination.page > 1) {
        APP_STATE.pagination.page--;
        renderLedgerTable();
      }
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      const filtered = getFilteredLedgerEntries();
      const maxPage = Math.ceil(filtered.length / APP_STATE.pagination.pageSize);
      if (APP_STATE.pagination.page < maxPage) {
        APP_STATE.pagination.page++;
        renderLedgerTable();
      }
    };
  }

  if (btnExport) {
    btnExport.onclick = () => exportLedgerCSV();
  }

  // Payout CSV button
  const btnExportPayout = document.getElementById('btnExportPayoutCSV');
  if (btnExportPayout) {
    btnExportPayout.onclick = () => exportPayoutCSV();
  }

  // Audit Log Export button
  const btnExportAudit = document.getElementById('btnExportAuditLog');
  if (btnExportAudit) {
    btnExportAudit.onclick = () => exportAuditLog();
  }

  // Global Header Search
  const globalSearch = document.getElementById('globalHeaderSearch');
  if (globalSearch) {
    globalSearch.oninput = (e) => {
      const val = e.target.value.toLowerCase();
      if (val) {
        APP_STATE.filters.search = val;
        if (APP_STATE.activeTab !== 'ledger') {
          switchTab('ledger');
        }
        if (searchInput) searchInput.value = val;
        renderLedgerTable();
      }
    };
  }

  // Keyboard shortcut ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (globalSearch) globalSearch.focus();
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });
}

// ============================================================================
// 9. Modals Handlers & Sub-Components
// ============================================================================

function setupModals() {
  // Pass modal
  const closePass = document.getElementById('btnClosePassModal');
  if (closePass) closePass.onclick = () => document.getElementById('weighbridgePassModal').classList.remove('open');

  // Photo modal & Zoom
  const closePhoto = document.getElementById('btnClosePhotoModal');
  if (closePhoto) closePhoto.onclick = () => document.getElementById('photoModal').classList.remove('open');
  setupPhotoZoom();

  // Correction modal
  const closeCorr = document.getElementById('btnCloseCorrectionModal');
  const cancelCorr = document.getElementById('btnCancelCorrection');
  const submitCorr = document.getElementById('btnSubmitCorrection');
  const corrGrade = document.getElementById('corrNewGrade');
  const corrWeight = document.getElementById('corrNewWeight');

  if (closeCorr) closeCorr.onclick = () => document.getElementById('correctionModal').classList.remove('open');
  if (cancelCorr) cancelCorr.onclick = () => document.getElementById('correctionModal').classList.remove('open');

  if (corrGrade) corrGrade.onchange = updateCorrectionDelta;
  if (corrWeight) corrWeight.oninput = updateCorrectionDelta;

  if (submitCorr) {
    submitCorr.onclick = () => {
      const entryId = document.getElementById('corrOrigId').textContent;
      const grade = document.getElementById('corrNewGrade').value;
      const weight = parseFloat(document.getElementById('corrNewWeight').value) || 142.5;
      const reason = document.getElementById('corrReason').value || 'Physical inspection correction by FPO Admin';

      const entry = APP_STATE.ledgerEntries.find(e => e.id === entryId);
      if (entry) {
        entry.grade = grade;
        entry.weightKg = weight;
        entry.status = 'LOCKED (CORRECTED)';
        entry.computedAmount = weight * (grade === 'A' ? 28 : grade === 'B' ? 21 : 14);
      }

      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Committed linked correction for ${entryId}: Set Grade ${grade}, ${weight}kg. Reason: "${reason}"`
      });

      document.getElementById('correctionModal').classList.remove('open');
      renderLedgerTable();
      renderAuditTimeline();
      showToast(`✓ Linked correction committed to ledger for ${entryId}.`, 'success');
    };
  }

  // Dispute modal
  const closeDsp = document.getElementById('btnCloseNewDisputeModal');
  const cancelDsp = document.getElementById('btnCancelNewDispute');
  const submitDsp = document.getElementById('btnSubmitNewDispute');

  if (closeDsp) closeDsp.onclick = () => document.getElementById('newDisputeModal').classList.remove('open');
  if (cancelDsp) cancelDsp.onclick = () => document.getElementById('newDisputeModal').classList.remove('open');
  if (submitDsp) {
    submitDsp.onclick = () => {
      const entrySelect = document.getElementById('newDisputeEntrySelect');
      const entryId = entrySelect ? entrySelect.value : 'ENT-9042';
      const claimedGrade = document.getElementById('newDisputeClaimedGrade').value || 'A';
      const channel = document.getElementById('newDisputeChannel').value || 'In-Person at FPO Center';
      const details = document.getElementById('newDisputeDetails').value || 'Farmer produce dispute filed by member';

      const newDsp = {
        id: `DSP-${Date.now().toString().slice(-4)}`,
        entryId: entryId,
        farmerId: 'FMR-1082',
        farmerName: 'Ramesh Patil',
        produce: 'Wheat (Sharbati)',
        assignedGrade: 'C',
        claimedGrade: claimedGrade,
        holdAmount: 1995.0,
        potentialAmount: 3990.0,
        status: 'OPEN',
        channel: channel,
        grievance: details
      };

      APP_STATE.disputes.unshift(newDsp);
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Created new dispute case ${newDsp.id} against ${entryId}. Payout ₹1,995.00 placed on hold.`
      });

      document.getElementById('newDisputeModal').classList.remove('open');
      renderDisputeList();
      renderDisputeWorkbench(newDsp.id);
      renderAuditTimeline();
      showToast(`✓ Dispute ${newDsp.id} registered and payout placed on hold.`, 'warning');
    };
  }

  // Finalize Payout Modal
  const btnOpenFinalize = document.getElementById('btnFinalizePayoutRun');
  const closeFin = document.getElementById('btnCloseFinalizeModal');
  const cancelFin = document.getElementById('btnCancelFinalize');
  const confirmFin = document.getElementById('btnConfirmFinalize');

  if (btnOpenFinalize) {
    btnOpenFinalize.onclick = () => {
      const modal = document.getElementById('finalizePayoutModal');
      if (modal) modal.classList.add('open');
    };
  }

  if (closeFin) closeFin.onclick = () => document.getElementById('finalizePayoutModal').classList.remove('open');
  if (cancelFin) cancelFin.onclick = () => document.getElementById('finalizePayoutModal').classList.remove('open');
  if (confirmFin) {
    confirmFin.onclick = () => {
      document.getElementById('finalizePayoutModal').classList.remove('open');
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: 'Authorized & sealed September Payout Batch BATCH-2026-09-SEP for ₹4,29,490.00 via dual sign-off.'
      });
      renderAuditTimeline();
      renderPayoutTable();
      showToast('✓ Settlement batch authorized and transferred to Bank disbursement queue.', 'success');
    };
  }

  // Rate Card Modal
  const btnOpenRateModal = document.getElementById('btnCreateNewRateVersion');
  const closeRate = document.getElementById('btnCloseNewRateModal');
  const cancelRate = document.getElementById('btnCancelNewRate');
  const submitRate = document.getElementById('btnSubmitNewRate');

  if (btnOpenRateModal) {
    btnOpenRateModal.onclick = () => {
      const modal = document.getElementById('newRateModal');
      if (modal) modal.classList.add('open');
    };
  }

  if (closeRate) closeRate.onclick = () => document.getElementById('newRateModal').classList.remove('open');
  if (cancelRate) cancelRate.onclick = () => document.getElementById('newRateModal').classList.remove('open');
  if (submitRate) {
    submitRate.onclick = () => {
      const version = document.getElementById('newRateVersion').value || 'v2.4';
      const rateA = parseFloat(document.getElementById('newRateA').value) || 30;
      const rateB = parseFloat(document.getElementById('newRateB').value) || 22.5;
      const rateC = parseFloat(document.getElementById('newRateC').value) || 15;
      const memo = document.getElementById('newRateMemo').value || 'Approved price card revision';

      APP_STATE.rateCards.forEach(rc => rc.active = false);
      APP_STATE.rateCards.unshift({
        version: version,
        effectiveDate: new Date().toLocaleDateString('en-GB'),
        active: true,
        rates: { A: rateA, B: rateB, C: rateC },
        memo: memo
      });

      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Published & applied Rate Card ${version}: Grade A ₹${rateA}, Grade B ₹${rateB}, Grade C ₹${rateC}.`
      });

      document.getElementById('newRateModal').classList.remove('open');
      renderRateCardHistory();
      renderAuditTimeline();
      showToast(`✓ Rate Card ${version} applied across all Mandi collection scales.`, 'success');
    };
  }

  // Notifications Modal
  const notifBtn = document.querySelector('.notif-bell-btn');
  const notifModal = document.getElementById('notificationsModal');
  const closeNotifs = document.getElementById('btnCloseNotifsModal');
  const dismissNotifs = document.getElementById('btnDismissNotifs');
  const markReadBtn = document.getElementById('btnMarkAllNotifsRead');

  if (notifBtn && notifModal) {
    notifBtn.onclick = () => notifModal.classList.add('open');
  }
  if (closeNotifs && notifModal) {
    closeNotifs.onclick = () => notifModal.classList.remove('open');
  }
  if (dismissNotifs && notifModal) {
    dismissNotifs.onclick = () => notifModal.classList.remove('open');
  }
  if (markReadBtn && notifModal) {
    markReadBtn.onclick = () => {
      const bubble = document.querySelector('.notif-badge-bubble');
      if (bubble) bubble.style.display = 'none';
      notifModal.classList.remove('open');
      showToast('All notifications marked as read.', 'info');
    };
  }

  // Admin Profile Modal
  const profileChip = document.getElementById('headerProfileChip');
  const profileModal = document.getElementById('profileModal');
  const closeProfile = document.getElementById('btnCloseProfileModal');
  const closeProfileBtn = document.getElementById('btnCloseProfileModalBtn');
  const exportAdminKeyBtn = document.getElementById('btnExportAdminKey');

  if (profileChip && profileModal) {
    profileChip.onclick = () => profileModal.classList.add('open');
  }
  if (closeProfile && profileModal) {
    closeProfile.onclick = () => profileModal.classList.remove('open');
  }
  if (closeProfileBtn && profileModal) {
    closeProfileBtn.onclick = () => profileModal.classList.remove('open');
  }
  if (exportAdminKeyBtn) {
    exportAdminKeyBtn.onclick = () => exportAdminKey();
  }

  // Merkle Verification Certificate Modal
  const merkleModal = document.getElementById('merkleVerifyModal');
  const closeMerkle = document.getElementById('btnCloseMerkleModal');
  const closeMerkleBtn = document.getElementById('btnCloseMerkleModalBtn');
  const downloadMerkleCertBtn = document.getElementById('btnDownloadMerkleCert');

  if (closeMerkle && merkleModal) {
    closeMerkle.onclick = () => merkleModal.classList.remove('open');
  }
  if (closeMerkleBtn && merkleModal) {
    closeMerkleBtn.onclick = () => merkleModal.classList.remove('open');
  }
  if (downloadMerkleCertBtn) {
    downloadMerkleCertBtn.onclick = () => downloadMerkleCert();
  }

  // Operator Review Modal
  const closeOpRev = document.getElementById('btnCloseOpReviewModal');
  const cancelOpRev = document.getElementById('btnCancelOpReview');
  const saveOpRev = document.getElementById('btnSaveOpReview');

  if (closeOpRev) closeOpRev.onclick = () => document.getElementById('opReviewModal').classList.remove('open');
  if (cancelOpRev) cancelOpRev.onclick = () => document.getElementById('opReviewModal').classList.remove('open');
  if (saveOpRev) {
    saveOpRev.onclick = () => {
      const status = document.getElementById('opReviewNewStatus').value;
      const note = document.getElementById('opReviewNote').value || 'Reviewed by admin';
      const op = APP_STATE.operators.find(o => o.id === APP_STATE.selectedOperatorId);
      if (op) {
        op.statusNote = `${status}: ${note}`;
      }
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Updated oversight note for operator ${APP_STATE.selectedOperatorId}: "${note}"`
      });
      document.getElementById('opReviewModal').classList.remove('open');
      renderOperatorRiskCards();
      renderOperatorDetails(APP_STATE.selectedOperatorId);
      renderAuditTimeline();
      showToast('✓ Operator oversight status note saved to audit trail.', 'success');
    };
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('open');
    };
  });
}

function updateCorrectionDelta() {
  const origAmtEl = document.getElementById('corrOrigAmount');
  const origAmt = origAmtEl ? (parseFloat(origAmtEl.textContent.replace(/[^\d.]/g, '')) || 1995) : 1995;
  const grade = document.getElementById('corrNewGrade').value;
  const weight = parseFloat(document.getElementById('corrNewWeight').value) || 0;
  const rates = { A: 28.0, B: 21.0, C: 14.0 };
  const newAmt = weight * (rates[grade] || 20);
  const delta = newAmt - origAmt;
  const deltaEl = document.getElementById('corrDeltaAmount');
  if (deltaEl) {
    deltaEl.textContent = (delta >= 0 ? '+' : '') + `₹${delta.toFixed(2)}`;
    deltaEl.className = delta >= 0 ? 'text-success' : 'text-danger';
  }
}

let currentPhotoZoom = 1.0;
function setupPhotoZoom() {
  const img = document.getElementById('photoModalImg');
  const zoomDisplay = document.getElementById('zoomLevelDisplay');
  const btnIn = document.getElementById('btnZoomIn');
  const btnOut = document.getElementById('btnZoomOut');
  const btnReset = document.getElementById('btnZoomReset');

  function updateZoom(newZoom) {
    currentPhotoZoom = Math.max(0.5, Math.min(2.5, newZoom));
    if (img) img.style.transform = `scale(${currentPhotoZoom})`;
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(currentPhotoZoom * 100)}%`;
  }

  if (btnIn) btnIn.onclick = () => updateZoom(currentPhotoZoom + 0.25);
  if (btnOut) btnOut.onclick = () => updateZoom(currentPhotoZoom - 0.25);
  if (btnReset) btnReset.onclick = () => updateZoom(1.0);
}

function openPhotoModal(entryId) {
  const entry = APP_STATE.ledgerEntries.find(e => e.id === entryId) || APP_STATE.ledgerEntries[0];
  const modal = document.getElementById('photoModal');
  if (!modal || !entry) return;

  document.getElementById('pmEntryId').textContent = entry.id;
  document.getElementById('pmTimestamp').textContent = entry.timestamp;
  document.getElementById('pmOperator').textContent = `${entry.operatorName} (${entry.operatorId})`;
  document.getElementById('pmFarmer').textContent = `${entry.farmerName} (${entry.farmerId})`;
  document.getElementById('pmGrade').textContent = `Grade ${entry.grade}`;
  document.getElementById('pmWeight').textContent = `${entry.weightKg.toFixed(1)} kg`;
  
  const img = document.getElementById('photoModalImg');
  if (img) {
    img.src = entry.photoUrl;
    img.style.transform = 'scale(1)';
  }
  const zoomDisplay = document.getElementById('zoomLevelDisplay');
  if (zoomDisplay) zoomDisplay.textContent = '100%';
  currentPhotoZoom = 1.0;

  modal.classList.add('open');
}

function openCorrectionModal(entryId) {
  const entry = APP_STATE.ledgerEntries.find(e => e.id === entryId) || APP_STATE.ledgerEntries[0];
  const modal = document.getElementById('correctionModal');
  if (!modal || !entry) return;

  document.getElementById('corrOrigId').textContent = entry.id;
  document.getElementById('corrOrigFarmer').textContent = `${entry.farmerName} (${entry.farmerId})`;
  document.getElementById('corrOrigOp').textContent = `${entry.operatorName} (${entry.operatorId})`;
  document.getElementById('corrOrigGrade').textContent = `Grade ${entry.grade}`;
  document.getElementById('corrOrigWeight').textContent = `${entry.weightKg} kg`;
  document.getElementById('corrOrigAmount').textContent = `₹${entry.computedAmount.toFixed(2)}`;

  updateCorrectionDelta();
  modal.classList.add('open');
}

// ============================================================================
// 10. Fraud, Disputes, Payout, Audit & Rate Renders & Action Handlers
// ============================================================================

function renderOperatorRiskCards() {
  const container = document.getElementById('operatorRiskCardsContainer');
  if (!container) return;

  container.innerHTML = '';
  APP_STATE.operators.forEach(op => {
    const card = document.createElement('div');
    const isSelected = op.id === APP_STATE.selectedOperatorId;
    const isQuarantined = op.quarantined;
    card.style.cssText = `background:${isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-secondary)'}; border:1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; border-radius:12px; padding:16px; margin-bottom:12px; cursor:pointer; transition:all 0.2s ease;`;
    card.onclick = () => {
      APP_STATE.selectedOperatorId = op.id;
      renderOperatorRiskCards();
      renderOperatorDetails(op.id);
    };
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="font-size:15px; color:var(--text-primary);">${op.name}</strong>
          <div style="font-size:11.5px; color:var(--text-muted);">${op.id} • ${op.center}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          ${isQuarantined ? '<span class="status-pill-pending" style="font-size:10px; padding:2px 8px; background:#fee2e2; color:#dc2626; border-color:#fecaca;">QUARANTINED</span>' : ''}
          <span class="mc-badge danger">Score: ${op.riskScore}/100</span>
        </div>
      </div>
      <div style="font-size:12.5px; color:var(--text-secondary); margin-top:8px;">${op.statusNote}</div>
    `;
    container.appendChild(card);
  });

  // Setup risk filter chips
  document.querySelectorAll('.chip-btn[data-risk-filter]').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.chip-btn[data-risk-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-risk-filter');
      showToast(`Filtered operators by risk: ${filter}`, 'info');
    };
  });
}

function renderOperatorDetails(opId) {
  const panel = document.getElementById('operatorDetailPanel');
  const op = APP_STATE.operators.find(o => o.id === opId) || APP_STATE.operators[0];
  if (!panel || !op) return;

  const isQuarantined = op.quarantined;

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
      <div>
        <h3 style="font-size:18px; font-weight:800; color:var(--text-primary); margin-bottom:2px;">${op.name} (${op.id})</h3>
        <p style="font-size:13px; color:var(--text-muted); margin:0;">Assigned to ${op.center} • Telemetry Verified</p>
      </div>
      ${isQuarantined ? '<span class="status-pill-pending" style="background:#fee2e2; color:#dc2626; border-color:#fecaca; font-weight:800;">QUARANTINE ACTIVE</span>' : '<span class="status-pill-locked">ACTIVE SCALE OPERATOR</span>'}
    </div>
    
    <div style="background:var(--bg-surface-secondary); border-radius:10px; padding:14px; margin-bottom:14px; border:1px solid var(--border-color);">
      <strong style="font-size:13px; color:var(--risk-high);">Statistical Flag Rationale:</strong>
      <p style="font-size:12.5px; color:var(--text-primary); margin-top:4px;">${op.anomalyReason}</p>
    </div>

    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:18px;">
      <div style="background:var(--bg-surface-secondary); padding:12px 10px; border-radius:8px; text-align:center; border:1px solid var(--border-color);">
        <span style="font-size:11px; color:var(--text-muted); display:block;">Grade A</span>
        <div style="font-size:18px; font-weight:800; color:var(--grade-a);">${op.distribution.A}%</div>
        <span style="font-size:10px; color:var(--text-muted);">Benchmark: 48%</span>
      </div>
      <div style="background:var(--bg-surface-secondary); padding:12px 10px; border-radius:8px; text-align:center; border:1px solid var(--border-color);">
        <span style="font-size:11px; color:var(--text-muted); display:block;">Grade B</span>
        <div style="font-size:18px; font-weight:800; color:var(--grade-b);">${op.distribution.B}%</div>
        <span style="font-size:10px; color:var(--text-muted);">Benchmark: 36%</span>
      </div>
      <div style="background:var(--bg-surface-secondary); padding:12px 10px; border-radius:8px; text-align:center; border:1px solid var(--border-color);">
        <span style="font-size:11px; color:var(--text-muted); display:block;">Grade C</span>
        <div style="font-size:18px; font-weight:800; color:var(--grade-c);">${op.distribution.C}%</div>
        <span style="font-size:10px; color:var(--text-muted);">Benchmark: 16%</span>
      </div>
    </div>

    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn ${isQuarantined ? 'btn-secondary' : 'btn-primary'}" id="btnQuarantineOp" style="${isQuarantined ? '' : 'background:#dc2626;'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
        <span>${isQuarantined ? 'Reinstate Operator' : 'Quarantine Operator'}</span>
      </button>

      <button class="btn btn-secondary" id="btnTriggerAudit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span>Dispatch Spot Inspection</span>
      </button>

      <button class="btn btn-outline" id="btnUpdateOpOversight">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        <span>Update Status Note</span>
      </button>
    </div>
  `;

  // Wire action buttons
  const btnQuar = document.getElementById('btnQuarantineOp');
  if (btnQuar) {
    btnQuar.onclick = () => {
      op.quarantined = !op.quarantined;
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `${op.quarantined ? 'Quarantined scale access for' : 'Reinstated scale access for'} operator ${op.name} (${op.id}).`
      });
      renderOperatorRiskCards();
      renderOperatorDetails(op.id);
      renderAuditTimeline();
      showToast(`Operator ${op.name} ${op.quarantined ? 'quarantined' : 'reinstated'}.`, op.quarantined ? 'danger' : 'success');
    };
  }

  const btnAudit = document.getElementById('btnTriggerAudit');
  if (btnAudit) {
    btnAudit.onclick = () => {
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Dispatched emergency vigilance spot inspection team to ${op.center} for Operator ${op.name}.`
      });
      renderAuditTimeline();
      showToast(`✓ Emergency spot inspection team dispatched to ${op.center}.`, 'success');
    };
  }

  const btnOversight = document.getElementById('btnUpdateOpOversight');
  if (btnOversight) {
    btnOversight.onclick = () => {
      const modal = document.getElementById('opReviewModal');
      const title = document.getElementById('opReviewModalTitle');
      if (title) title.textContent = `Update Oversight Status: ${op.name} (${op.id})`;
      if (modal) modal.classList.add('open');
    };
  }
}

function renderDisputeList() {
  const container = document.getElementById('disputeCasesList');
  if (!container) return;

  container.innerHTML = '';
  APP_STATE.disputes.forEach(d => {
    const isSelected = d.id === APP_STATE.selectedDisputeId;
    const item = document.createElement('div');
    const isResolved = d.status.startsWith('RESOLVED');
    item.style.cssText = `background:${isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-secondary)'}; border:1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; border-radius:12px; padding:14px; margin-bottom:10px; cursor:pointer; transition:all 0.2s ease;`;
    item.onclick = () => {
      APP_STATE.selectedDisputeId = d.id;
      renderDisputeList();
      renderDisputeWorkbench(d.id);
    };
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
        <span style="color:var(--text-primary);">${d.id}</span>
        <span style="color:${isResolved ? 'var(--primary)' : 'var(--grade-b)'}; font-size:11px; font-weight:800;">${d.status}</span>
      </div>
      <div style="font-size:13.5px; font-weight:600; color:var(--text-primary); margin:4px 0 2px;">${d.farmerName} (${d.produce})</div>
      <div style="font-size:12px; color:var(--text-muted);">Hold Value: ₹${d.holdAmount.toFixed(2)} • Channel: ${d.channel || 'In-Person'}</div>
    `;
    container.appendChild(item);
  });

  // Setup dispute status tabs
  document.querySelectorAll('.status-tab[data-dispute-status]').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.status-tab[data-dispute-status]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.getAttribute('data-dispute-status');
      showToast(`Showing ${status} dispute cases`, 'info');
    };
  });
}

function renderDisputeWorkbench(dspId) {
  const main = document.getElementById('disputeWorkbenchMain');
  const dsp = APP_STATE.disputes.find(d => d.id === dspId) || APP_STATE.disputes[0];
  if (!main || !dsp) return;

  const isResolved = dsp.status.startsWith('RESOLVED');

  main.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
      <div>
        <h3 style="font-size:18px; font-weight:800; color:var(--text-primary); margin-bottom:2px;">Dispute Case: ${dsp.id}</h3>
        <p style="font-size:13px; color:var(--text-muted); margin:0;">Filed by ${dsp.farmerName} (${dsp.farmerId}) against Entry ${dsp.entryId}</p>
      </div>
      <span class="${isResolved ? 'status-pill-locked' : 'status-pill-pending'}">${dsp.status}</span>
    </div>

    <div style="background:var(--bg-surface-secondary); border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid var(--border-color);">
      <strong style="font-size:13px; color:var(--text-primary);">Farmer Grievance Statement:</strong>
      <p style="font-size:13px; color:var(--text-secondary); margin-top:4px; font-style:italic;">"${dsp.grievance}"</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
      <div style="background:var(--bg-surface-secondary); padding:14px; border-radius:10px; border:1px solid var(--border-color);">
        <span style="font-size:12px; color:var(--text-muted); display:block;">Assigned Grade by Operator:</span>
        <div style="font-size:16px; font-weight:800; color:var(--grade-c); margin-top:2px;">Grade ${dsp.assignedGrade} (Hold: ₹${dsp.holdAmount.toFixed(2)})</div>
      </div>
      <div style="background:var(--bg-surface-secondary); padding:14px; border-radius:10px; border:1px solid var(--border-color);">
        <span style="font-size:12px; color:var(--text-muted); display:block;">Farmer Claimed Grade:</span>
        <div style="font-size:16px; font-weight:800; color:var(--grade-a); margin-top:2px;">Grade ${dsp.claimedGrade} (Value: ₹${dsp.potentialAmount.toFixed(2)})</div>
      </div>
    </div>

    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn btn-secondary" id="btnInspectDisputePhoto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Inspect Photo Evidence</span>
      </button>

      <button class="btn btn-outline" id="btnOpenDisputeCorrection">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Issue Linked Correction</span>
      </button>

      ${!isResolved ? `
        <button class="btn btn-primary" id="btnAcceptFarmerClaim">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Accept Farmer Claim (Grade ${dsp.claimedGrade})</span>
        </button>

        <button class="btn btn-ghost" id="btnRejectDispute" style="color:var(--risk-high);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Reject Dispute</span>
        </button>
      ` : `
        <button class="btn btn-secondary" disabled>
          <span>✓ Adjudication Case Resolved</span>
        </button>
      `}
    </div>
  `;

  // Wire action buttons
  const btnPhoto = document.getElementById('btnInspectDisputePhoto');
  if (btnPhoto) btnPhoto.onclick = () => openPhotoModal(dsp.entryId);

  const btnCorr = document.getElementById('btnOpenDisputeCorrection');
  if (btnCorr) btnCorr.onclick = () => openCorrectionModal(dsp.entryId);

  const btnAccept = document.getElementById('btnAcceptFarmerClaim');
  if (btnAccept) {
    btnAccept.onclick = () => {
      dsp.status = 'RESOLVED (ACCEPTED)';
      const entry = APP_STATE.ledgerEntries.find(e => e.id === dsp.entryId);
      if (entry) {
        entry.grade = dsp.claimedGrade;
        entry.status = 'LOCKED (CORRECTED)';
        entry.computedAmount = dsp.potentialAmount;
      }
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Adjudicated dispute ${dsp.id}: Upgraded ${dsp.entryId} to Grade ${dsp.claimedGrade}. ₹${dsp.holdAmount.toFixed(2)} hold released.`
      });
      renderDisputeList();
      renderDisputeWorkbench(dsp.id);
      renderLedgerTable();
      renderAuditTimeline();
      showToast(`✓ Dispute ${dsp.id} accepted and resolved in farmer's favor.`, 'success');
    };
  }

  const btnReject = document.getElementById('btnRejectDispute');
  if (btnReject) {
    btnReject.onclick = () => {
      dsp.status = 'RESOLVED (REJECTED)';
      APP_STATE.auditLog.unshift({
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Anita Kapoor (FPO Admin)',
        desc: `Adjudicated dispute ${dsp.id}: Rejected claim. Original Grade ${dsp.assignedGrade} confirmed.`
      });
      renderDisputeList();
      renderDisputeWorkbench(dsp.id);
      renderAuditTimeline();
      showToast(`Dispute ${dsp.id} rejected. Original grading upheld.`, 'info');
    };
  }
}

function renderPayoutTable() {
  const tbody = document.getElementById('payoutTableBody');
  if (!tbody) return;

  const demoFarmers = [
    { name: 'Ramesh Patil', id: 'FMR-1082', village: 'Dindori', a: 624.0, b: 403.0, c: 0, total: 1027.0, gross: 25935.0, hold: 0, net: 25935.0 },
    { name: 'Suresh Deshmukh', id: 'FMR-1044', village: 'Pimpalgaon', a: 810.0, b: 320.0, c: 210.0, total: 1340.0, gross: 32340.0, hold: 2940.0, net: 29400.0 },
    { name: 'Baburao Ghadge', id: 'FMR-1099', village: 'Kalwan', a: 340.0, b: 610.0, c: 171.5, total: 1121.5, gross: 24731.0, hold: 2401.0, net: 22330.0 },
    { name: 'Ganesh Shirole', id: 'FMR-1021', village: 'Niphad', a: 450.0, b: 290.0, c: 0, total: 740.0, gross: 18690.0, hold: 0, net: 18690.0 },
    { name: 'Santosh Jadhav', id: 'FMR-1055', village: 'Yeola', a: 520.0, b: 380.0, c: 80.0, total: 980.0, gross: 23660.0, hold: 0, net: 23660.0 }
  ];

  tbody.innerHTML = '';
  demoFarmers.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${f.name}</strong><br><span style="font-size:11px; color:var(--text-muted);">${f.id}</span></td>
      <td>${f.village}</td>
      <td class="text-right color-a font-bold">${f.a.toFixed(1)}</td>
      <td class="text-right color-b font-bold">${f.b.toFixed(1)}</td>
      <td class="text-right color-c font-bold">${f.c.toFixed(1)}</td>
      <td class="text-right font-bold">${f.total.toFixed(1)}</td>
      <td class="text-right">₹${f.gross.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
      <td class="text-right text-danger">${f.hold > 0 ? `₹${f.hold.toFixed(2)}` : '—'}</td>
      <td class="text-right font-bold color-a">₹${f.net.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
      <td class="text-center">${f.hold > 0 ? '<span class="status-pill-pending" style="font-size:11px; padding:2px 8px;">HOLD</span>' : '<span class="status-pill-locked" style="font-size:11px; padding:2px 8px;">CLEARED</span>'}</td>
      <td class="text-right"><button class="btn btn-secondary btn-view-farmer-breakdown" style="padding:4px 8px; font-size:11px;" data-fid="${f.id}">View</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-view-farmer-breakdown').forEach(btn => {
    btn.onclick = () => {
      const fid = btn.getAttribute('data-fid');
      APP_STATE.filters.search = fid;
      switchTab('ledger');
      const s = document.getElementById('ledgerSearchInput');
      if (s) s.value = fid;
      renderLedgerTable();
      showToast(`Showing all ledger entries for ${fid}`, 'info');
    };
  });
}

function renderAuditTimeline() {
  const container = document.getElementById('auditTimelineContainer');
  if (!container) return;

  container.innerHTML = '';
  APP_STATE.auditLog.forEach(evt => {
    const item = document.createElement('div');
    item.style.cssText = `border-left:2px solid var(--primary); padding:8px 0 8px 16px; margin-bottom:14px; position:relative;`;
    item.innerHTML = `
      <div style="font-size:11.5px; color:var(--text-muted);">${evt.timestamp} • <strong>${evt.actor}</strong></div>
      <div style="font-size:13.5px; color:var(--text-primary); margin-top:2px;">${evt.desc}</div>
    `;
    container.appendChild(item);
  });
}

function renderRateCardHistory() {
  const list = document.getElementById('rateHistoryList');
  if (!list) return;

  list.innerHTML = '';
  APP_STATE.rateCards.forEach(rc => {
    const div = document.createElement('div');
    div.style.cssText = `background:var(--bg-surface-secondary); border-radius:10px; padding:12px; margin-bottom:10px; border:1px solid var(--border-color);`;
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
        <span style="color:var(--text-primary);">${rc.version} ${rc.active ? '<span style="color:var(--primary); font-weight:800;">(ACTIVE)</span>' : ''}</span>
        <span style="font-size:11.5px; color:var(--text-muted);">${rc.effectiveDate}</span>
      </div>
      <div style="font-size:12px; color:var(--text-secondary); margin:4px 0;">${rc.memo}</div>
      <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">A: ₹${rc.rates.A} | B: ₹${rc.rates.B} | C: ₹${rc.rates.C} per kg</div>
    `;
    list.appendChild(div);
  });
}

function setupAnomalyControls() {
  const btnRecalc = document.getElementById('btnRecalcAnomalies');
  if (btnRecalc) {
    btnRecalc.onclick = () => {
      showToast('Executing Gaussian peer-benchmark recalculation across 30 operators...', 'info');
      setTimeout(() => {
        APP_STATE.operators.forEach(op => {
          op.riskScore = Math.max(10, Math.min(98, op.riskScore + Math.floor((Math.random() - 0.5) * 6)));
        });
        renderOperatorRiskCards();
        renderOperatorDetails(APP_STATE.selectedOperatorId);
        showToast('✓ Risk scores and skew metrics recalculated successfully.', 'success');
      }, 700);
    };
  }
}

function setupDisputeControls() {
  const btn = document.getElementById('btnOpenNewDisputeModal');
  if (btn) {
    btn.onclick = () => {
      const modal = document.getElementById('newDisputeModal');
      const select = document.getElementById('newDisputeEntrySelect');
      if (select) {
        select.innerHTML = '';
        APP_STATE.ledgerEntries.slice(0, 15).forEach(e => {
          select.innerHTML += `<option value="${e.id}">${e.id} — ${e.farmerName} (${e.produce}) — Grade ${e.grade}</option>`;
        });
      }
      if (modal) modal.classList.add('open');
    };
  }
}

function setupRateCardControls() {
  // Handled in setupModals
}

function updateTopMetrics() {
  // Real-time synchronization of counters across views
}

// ============================================================================
// 11. Utilities, File Exporters, Theme Engine & Toasts
// ============================================================================

function triggerFileDownload(filename, content, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportLedgerCSV() {
  const entries = getFilteredLedgerEntries();
  let csv = 'Entry ID,Timestamp,Farmer ID,Farmer Name,Village,Operator ID,Operator Name,Mandi Center,Produce,Grade,Weight (kg),Rate (Rs/kg),Computed Amount (Rs),Status,Merkle Hash\n';
  entries.forEach(e => {
    csv += `"${e.id}","${e.timestamp}","${e.farmerId}","${e.farmerName}","${e.village}","${e.operatorId}","${e.operatorName}","${e.center}","${e.produce}","${e.grade}",${e.weightKg},${e.ratePerKg},${e.computedAmount.toFixed(2)},"${e.status}","${e.merkleHash}"\n`;
  });
  triggerFileDownload(`fpo_master_ledger_${new Date().toISOString().slice(0,10)}.csv`, csv);
  showToast('✓ Master Ledger CSV exported successfully.', 'success');
}

function exportPayoutCSV() {
  const farmers = [
    { name: 'Ramesh Patil', id: 'FMR-1082', village: 'Dindori', a: 624.0, b: 403.0, c: 0, total: 1027.0, gross: 25935.0, hold: 0, net: 25935.0, ifsc: 'SBIN0001842', acc: '••••4491' },
    { name: 'Suresh Deshmukh', id: 'FMR-1044', village: 'Pimpalgaon', a: 810.0, b: 320.0, c: 210.0, total: 1340.0, gross: 32340.0, hold: 2940.0, net: 29400.0, ifsc: 'MAHB0000912', acc: '••••8021' },
    { name: 'Baburao Ghadge', id: 'FMR-1099', village: 'Kalwan', a: 340.0, b: 610.0, c: 171.5, total: 1121.5, gross: 24731.0, hold: 2401.0, net: 22330.0, ifsc: 'BKID0004128', acc: '••••3109' },
    { name: 'Ganesh Shirole', id: 'FMR-1021', village: 'Niphad', a: 450.0, b: 290.0, c: 0, total: 740.0, gross: 18690.0, hold: 0, net: 18690.0, ifsc: 'HDFC0001290', acc: '••••9920' },
    { name: 'Santosh Jadhav', id: 'FMR-1055', village: 'Yeola', a: 520.0, b: 380.0, c: 80.0, total: 980.0, gross: 23660.0, hold: 0, net: 23660.0, ifsc: 'ICIC0000542', acc: '••••1183' }
  ];
  let csv = 'Farmer ID,Farmer Name,Village,Grade A (kg),Grade B (kg),Grade C (kg),Total Net Weight (kg),Gross Amount (Rs),Dispute Hold (Rs),Net Payable (Rs),Bank IFSC,Account No,Settlement Status\n';
  farmers.forEach(f => {
    csv += `"${f.id}","${f.name}","${f.village}",${f.a},${f.b},${f.c},${f.total},${f.gross},${f.hold},${f.net},"${f.ifsc}","${f.acc}","${f.hold > 0 ? 'HOLD' : 'CLEARED'}"\n`;
  });
  triggerFileDownload(`fpo_payout_disbursement_batch_${new Date().toISOString().slice(0,10)}.csv`, csv);
  showToast('✓ Bank Payout Disbursement CSV exported.', 'success');
}

function exportAuditLog() {
  const jsonStr = JSON.stringify({
    cluster: 'Ratlam Mandi APMC Central',
    exportTimestamp: new Date().toISOString(),
    exporter: 'Anita Kapoor (FPO Admin)',
    merkleRoot: '0x9e8a71b42cd093418ba03e2c019ff482ac1983eb0c44',
    auditEvents: APP_STATE.auditLog
  }, null, 2);
  triggerFileDownload(`fpo_immutable_audit_log_${new Date().toISOString().slice(0,10)}.json`, jsonStr, 'application/json');
  showToast('✓ Immutable Audit Log exported as JSON.', 'success');
}

function exportAdminKey() {
  const cert = `===============================================================
FPO CENTRAL APMC — ROOT SIGNING CERTIFICATE
===============================================================
Administrator Name : Anita Kapoor
Admin Identity ID  : ADM-4092
Assigned Mandi     : Ratlam Central APMC Cluster
Authority Level    : Tier-1 Chief Admin & Payout Signatory
Public Key (ED255) : 0x7fa2c091e8b417d98342019ff482ac1983eb0c44
Hardware HSM Token : YubiKey HSM v5.4-SEALED
Issued By          : State Agricultural Produce Board (APMC)
Cert Validity      : 2026-09-01 to 2028-08-31
Security Protocol  : SHA-256 Merkle Verification Enabled
Status             : ACTIVE & VALIDATED
===============================================================`;
  triggerFileDownload('fpo_admin_certificate_ADM4092.txt', cert, 'text/plain');
  showToast('✓ Admin Security Certificate exported.', 'success');
}

function downloadMerkleCert() {
  const cert = `===============================================================
MERKLE TREE CRYPTOGRAPHIC INTEGRITY CERTIFICATE
===============================================================
Cluster            : Ratlam Krishi Upaj Mandi
Total Transactions : 1,842 Weighbridge Passes
Merkle Root Hash   : 0x9e8a71b42cd093418ba03e2c019ff482ac1983eb0c44
Tree Height        : 11 Levels
Algorithm          : SHA-256 + HMAC-256
Tampering Skew     : 0 Discrepancies Detected (100% Immutable)
Verified At        : ${new Date().toUTCString()}
Verification Agent : Automatic Load-Cell Telemetry Merkle Node
===============================================================`;
  triggerFileDownload('merkle_tree_integrity_certificate.txt', cert, 'text/plain');
  showToast('✓ Merkle Certificate downloaded.', 'success');
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  // Initialize theme from storage (default to dark)
  const savedTheme = localStorage.getItem('app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  APP_STATE.theme = savedTheme;

  btn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    APP_STATE.theme = nextTheme;
    localStorage.setItem('app_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}`, 'info');
  });

  // Wire Generate Report button
  const btnReport = document.getElementById('btnGenerateReport');
  if (btnReport) {
    btnReport.onclick = () => {
      showToast('⚡ Generating Daily Revenue & Procurement Executive Report...', 'info');
      setTimeout(() => {
        const reportText = `===============================================================
FPO MANDI EXECUTIVE PROCUREMENT & REVENUE REPORT
===============================================================
Date: ${new Date().toLocaleDateString('en-GB')}
Admin: Anita Kapoor (Principal Admin)
Cluster: Ratlam Mandi Central APMC

TODAY'S HIGHLIGHTS:
- Total Locked Procurement Volume : 18,450.8 kg (+12.4%)
- Gross Estimated Payout          : ₹4,38,920.00
- Active Collection Centers       : 32
- Grade Distribution (A / B / C)  : 52% / 34% / 14%
- Total Revenue Metric            : ₹42.9L (+5.2%)
- Pending Dues Metric             : ₹6.3L (-2.1%)
- Active Defaulters               : 35
- UPI vs Cash Ratio               : 79 / 21 (UPI Dominant)
- Collection Pulse Today          : ₹8,76,387.00
- Cryptographic Merkle Root Status: 100% Immutable
===============================================================`;
        triggerFileDownload(`daily_fpo_procurement_report_${new Date().toISOString().slice(0,10)}.txt`, reportText, 'text/plain');
        showToast('✓ Daily Executive Report generated & downloaded.', 'success');
      }, 700);
    };
  }
}

function setupIntegrityVerification() {
  const btnVerify = document.getElementById('btnVerifyChain');
  if (btnVerify) {
    btnVerify.onclick = () => {
      showToast('Executing SHA-256 Merkle root verification on 1,842 passes...', 'info');
      setTimeout(() => {
        const modal = document.getElementById('merkleVerifyModal');
        if (modal) modal.classList.add('open');
        showToast('✓ Merkle Tree 100% Immutable. Zero unauthorized edits detected.', 'success');
      }, 600);
    };
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
