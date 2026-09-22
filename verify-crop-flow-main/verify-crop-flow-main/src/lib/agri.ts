/** Shared AgriTrust domain types, statuses and formatters. */

export type Grade = "A" | "B" | "C";

export type TxnStatus =
  | "DRAFT"
  | "FARMER_SELECTED"
  | "WEIGHT_ENTERED"
  | "AUDIT_CAPTURED"
  | "PENDING_APPROVAL"
  | "VERIFIED_LOCKED"
  | "DISPUTED";

export type SyncStatus = "SYNC_PENDING" | "SYNCING" | "SYNCED" | "SYNC_FAILED";

export type AuditEventType =
  | "TRANSACTION_CREATED"
  | "FARMER_SELECTED"
  | "WEIGHT_ENTERED"
  | "GRADE_SELECTED"
  | "AUDIT_PHOTO_CAPTURED"
  | "AUDIT_PHOTO_UPLOADED"
  | "OTP_GENERATED"
  | "APPROVAL_REQUESTED"
  | "FARMER_APPROVED"
  | "OTP_VERIFIED"
  | "TRANSACTION_LOCKED"
  | "DISPUTE_CREATED"
  | "SYNC_STARTED"
  | "SYNC_COMPLETED";

export interface Farmer {
  id: string;
  fpo_id: string;
  name: string;
  phone: string;
  village: string | null;
  qr_identifier: string;
}

export interface Transaction {
  id?: string;
  transaction_id: string;
  farmer_id: string | null;
  farmer_name: string;
  farmer_fpo_id: string | null;
  operator_id: string | null;
  operator_name: string | null;
  weight: number;
  grade: Grade;
  crop_type: string;
  audit_photo_path: string | null;
  status: TxnStatus;
  approval_code?: string | null;
  approval_method?: string | null;
  dispute_status?: string | null;
  dispute_reason?: string | null;
  dispute_note?: string | null;
  sync_status: SyncStatus;
  offline_created: boolean;
  is_demo?: boolean;
  created_at: string;
  updated_at?: string;
  approved_at?: string | null;
  verified_at?: string | null;
}

export interface AuditEvent {
  id?: string;
  transaction_id: string;
  actor_id?: string | null;
  actor_role: "OPERATOR" | "FARMER" | "SYSTEM" | "ADMIN";
  actor_name?: string | null;
  event_type: AuditEventType | string;
  metadata?: Record<string, string | number | boolean | null>;
  created_at: string;
}

export const CROP_TYPES = [
  "Onion",
  "Tomato",
  "Wheat",
  "Soybean",
  "Grapes",
  "Pomegranate",
  "Cotton",
  "Rice",
] as const;

export const GRADES: Array<{
  grade: Grade;
  title: string;
  label: string;
  description: string;
}> = [
  {
    grade: "A",
    title: "Grade A",
    label: "Premium",
    description: "Uniform size, no blemish, export quality",
  },
  {
    grade: "B",
    title: "Grade B",
    label: "Standard",
    description: "Market quality with minor variation",
  },
  {
    grade: "C",
    title: "Grade C",
    label: "Below Standard",
    description: "Visible damage or undersized produce",
  },
];

export const DISPUTE_REASONS = [
  "Farmer left before approval",
  "OTP not received",
  "Network problem",
  "Farmer disputes grade",
  "Other",
];

export interface StatusMeta {
  label: string;
  tone: "success" | "pending" | "danger" | "neutral";
  short: string;
}

export function statusMeta(status: TxnStatus, sync?: SyncStatus): StatusMeta {
  if (status === "VERIFIED_LOCKED")
    return { label: "Verified & Locked", tone: "success", short: "Verified" };
  if (status === "DISPUTED")
    return { label: "Disputed", tone: "danger", short: "Disputed" };
  if (status === "PENDING_APPROVAL")
    return {
      label: sync === "SYNC_PENDING" ? "Pending • Sync queued" : "Pending approval",
      tone: "pending",
      short: "Pending",
    };
  return { label: "In progress", tone: "neutral", short: "Draft" };
}

export const AUDIT_EVENT_LABEL: Record<string, string> = {
  TRANSACTION_CREATED: "Transaction created",
  FARMER_SELECTED: "Farmer identified",
  WEIGHT_ENTERED: "Weight entered",
  GRADE_SELECTED: "Grade selected",
  AUDIT_PHOTO_CAPTURED: "Audit photo captured",
  AUDIT_PHOTO_UPLOADED: "Audit photo uploaded",
  OTP_GENERATED: "Approval code generated",
  APPROVAL_REQUESTED: "Approval requested",
  FARMER_APPROVED: "Farmer approved",
  OTP_VERIFIED: "Approval code verified",
  TRANSACTION_LOCKED: "Transaction locked",
  DISPUTE_CREATED: "Dispute raised",
  SYNC_STARTED: "Sync started",
  SYNC_COMPLETED: "Sync completed",
};

/* canonical workflow order, used to break ties when several events share a second */
export const AUDIT_EVENT_ORDER: string[] = [
  "TRANSACTION_CREATED",
  "FARMER_SELECTED",
  "WEIGHT_ENTERED",
  "GRADE_SELECTED",
  "AUDIT_PHOTO_CAPTURED",
  "AUDIT_PHOTO_UPLOADED",
  "OTP_GENERATED",
  "APPROVAL_REQUESTED",
  "OTP_VERIFIED",
  "FARMER_APPROVED",
  "TRANSACTION_LOCKED",
  "DISPUTE_CREATED",
  "SYNC_STARTED",
  "SYNC_COMPLETED",
];

/* ---------- formatters ---------- */

export function formatWeight(kg: number): string {
  return kg.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatKg(kg: number): string {
  return `${formatWeight(kg)} kg`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 5)}\u2022\u2022\u2022\u2022${phone.slice(-2)}`;
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function isToday(iso: string): boolean {
  const a = new Date(iso);
  const b = new Date();
  return a.toDateString() === b.toDateString();
}

/* ---------- id + code generation ---------- */

function randomDigits(n: number): string {
  const bytes = new Uint32Array(n);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 1e9);
  }
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

/** Stable, idempotent transaction id. Created once, reused through sync. */
export function newTransactionId(online: boolean): string {
  const year = new Date().getFullYear();
  return online
    ? `TXN-${year}-${randomDigits(5)}`
    : `TXN-LOCAL-${randomDigits(6)}`;
}

export function newApprovalCode(): string {
  return randomDigits(4);
}

/** Weight input validation shared by keypad and sync. */
export function validateWeight(raw: string): { ok: boolean; message?: string } {
  if (!raw || raw === "." || Number(raw) === 0)
    return { ok: false, message: "Enter the weight shown on the scale." };
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0)
    return { ok: false, message: "Weight must be a positive number." };
  if (value > 5000)
    return { ok: false, message: "That weight looks too high. Please re-check the scale." };
  return { ok: true };
}
