/**
 * Demo/simulation helpers for the hackathon walkthrough.
 *
 * The farmer normally confirms from the farmer portal; these helpers write the
 * exact same rows and audit events so the operator screen reacts through
 * realtime, not through fake local state.
 */
import { supabase } from "@/integrations/supabase/client";
import type { AuditEvent, AuditEventType, Transaction } from "@/lib/agri";
import { saveLocalTransaction, savePendingAudit } from "@/lib/offline-store";

export function auditEvent(
  transactionId: string,
  eventType: AuditEventType,
  actorRole: AuditEvent["actor_role"],
  metadata?: AuditEvent["metadata"],
  actorName?: string | null,
): AuditEvent {
  return {
    transaction_id: transactionId,
    actor_role: actorRole,
    actor_name: actorName ?? null,
    event_type: eventType,
    metadata: metadata ?? {},
    created_at: new Date().toISOString(),
  };
}

/** Farmer confirms the delivery → transaction is locked forever. */
export async function simulateFarmerApproval(
  txn: Transaction,
  method: "FARMER_PORTAL" | "OTP",
  online: boolean,
): Promise<Transaction> {
  const now = new Date().toISOString();
  const locked: Transaction = {
    ...txn,
    status: "VERIFIED_LOCKED",
    approval_method: method,
    approved_at: now,
    verified_at: now,
    updated_at: now,
  };

  const events = [
    auditEvent(txn.transaction_id, "FARMER_APPROVED", "FARMER", { method }, txn.farmer_name),
    ...(method === "OTP"
      ? [auditEvent(txn.transaction_id, "OTP_VERIFIED", "OPERATOR", {}, txn.operator_name)]
      : []),
    auditEvent(txn.transaction_id, "TRANSACTION_LOCKED", "SYSTEM", {}, null),
  ];

  if (online) {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "VERIFIED_LOCKED",
          approval_method: method,
          approved_at: now,
          verified_at: now,
        })
        .eq("transaction_id", txn.transaction_id);
      if (!error) {
        const { data: auth } = await supabase.auth.getUser();
        await supabase.from("audit_events").insert(
          events.map((e) => ({
            transaction_id: e.transaction_id,
            actor_id: auth?.user?.id ?? null,
            actor_role: e.actor_role,
            actor_name: e.actor_name ?? null,
            event_type: e.event_type,
            metadata: e.metadata ?? {},
          })),
        ).catch(() => {});
        return { ...locked, sync_status: "SYNCED" };
      }
    } catch (err) {
      console.warn("Online approval error, saving locally:", err);
    }
  }

  const offlineLocked: Transaction = { ...locked, sync_status: "SYNC_PENDING" };
  await saveLocalTransaction(offlineLocked);
  await savePendingAudit(events);
  return offlineLocked;
}

/** Operator flags a pending transaction; the admin is notified by the event. */
export async function flagDispute(
  txn: Transaction,
  reason: string,
  note: string,
  online: boolean,
): Promise<Transaction> {
  const now = new Date().toISOString();
  const disputed: Transaction = {
    ...txn,
    status: "DISPUTED",
    dispute_status: "PENDING_REVIEW",
    dispute_reason: reason,
    dispute_note: note || null,
    updated_at: now,
  };
  const events = [
    auditEvent(txn.transaction_id, "DISPUTE_CREATED", "OPERATOR", { reason, note }, txn.operator_name),
  ];

  if (online) {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        status: "DISPUTED",
        dispute_status: "PENDING_REVIEW",
        dispute_reason: reason,
        dispute_note: note || null,
      })
      .eq("transaction_id", txn.transaction_id)
      .select("transaction_id");
    if (error) throw error;
    // an empty result means the record was not writable for this operator
    if (!data || data.length === 0) throw new Error("This record could not be flagged.");
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("audit_events").insert([
      {
        transaction_id: txn.transaction_id,
        actor_id: auth.user?.id ?? null,
        actor_role: "OPERATOR",
        event_type: "DISPUTE_CREATED",
        metadata: { reason, note },
      },
    ]);
    return { ...disputed, sync_status: "SYNCED" };
  }

  const offline: Transaction = { ...disputed, sync_status: "SYNC_PENDING" };
  await saveLocalTransaction(offline);
  await savePendingAudit(events);
  return offline;
}
