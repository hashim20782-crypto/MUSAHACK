/** Offline queue synchronisation. Idempotent: transaction ids are stable. */
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from "./agri";
import { auditPhotoPath } from "./photo";
import {
  STORES,
  allPendingAudit,
  getPendingPhoto,
  idb,
  localTransactions,
  queueItems,
  saveLocalTransaction,
  type QueueItem,
} from "./offline-store";

export type SyncStage = "data" | "photos" | "approvals";

export interface SyncActivity {
  transaction_id: string;
  state: "queued" | "uploading-photo" | "uploading-data" | "synced" | "failed";
  message: string;
}

export interface SyncReport {
  total: number;
  completed: number;
  failed: number;
  activity: SyncActivity[];
  stages: Record<SyncStage, "done" | "active" | "idle">;
}

/** Verify the backend itself is reachable — "navigator.onLine" is not enough. */
export async function backendReachable(): Promise<boolean> {
  try {
    const { error } = await supabase.from("farmers").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

function backoffMs(attempts: number): number {
  return Math.min(60_000, 2_000 * 2 ** attempts);
}

async function pushOne(
  txn: Transaction,
  operatorId: string,
  onActivity: (a: SyncActivity) => void,
): Promise<void> {
  let photoPath = txn.audit_photo_path;

  // 1. audit photo to private object storage (never base64 in the database)
  if (!photoPath || photoPath.startsWith("local:")) {
    const pending = await getPendingPhoto(txn.transaction_id);
    if (pending) {
      onActivity({
        transaction_id: txn.transaction_id,
        state: "uploading-photo",
        message: "Uploading audit photo",
      });
      const path = auditPhotoPath(operatorId, txn.transaction_id);
      const { error } = await supabase.storage
        .from("audit-photos")
        .upload(path, pending.blob, { contentType: "image/jpeg", upsert: true });
      if (error) throw new Error(error.message);
      photoPath = path;
    } else {
      photoPath = null;
    }
  }

  // 2. transaction row — upsert on the stable id keeps sync idempotent
  onActivity({
    transaction_id: txn.transaction_id,
    state: "uploading-data",
    message: "Uploading transaction",
  });
  const row = {
    transaction_id: txn.transaction_id,
    farmer_id: txn.farmer_id,
    farmer_name: txn.farmer_name,
    farmer_fpo_id: txn.farmer_fpo_id,
    operator_id: operatorId,
    operator_name: txn.operator_name,
    weight: txn.weight,
    grade: txn.grade,
    crop_type: txn.crop_type,
    audit_photo_path: photoPath,
    status: txn.status,
    approval_code: txn.approval_code ?? null,
    approval_method: txn.approval_method ?? null,
    dispute_status: txn.dispute_status ?? null,
    dispute_reason: txn.dispute_reason ?? null,
    dispute_note: txn.dispute_note ?? null,
    sync_status: "SYNCED" as const,
    offline_created: txn.offline_created,
    created_at: txn.created_at,
    approved_at: txn.approved_at ?? null,
    verified_at: txn.verified_at ?? null,
  };
  const { error: upsertError } = await supabase
    .from("transactions")
    .upsert(row, { onConflict: "transaction_id" });
  if (upsertError) throw new Error(upsertError.message);

  // 3. audit trail for this transaction
  const audit = await allPendingAudit();
  const mine = audit.filter((a) => a.event.transaction_id === txn.transaction_id);
  if (mine.length) {
    const { error } = await supabase.from("audit_events").insert(
      mine.map((a) => ({
        transaction_id: a.event.transaction_id,
        actor_id: operatorId,
        actor_role: a.event.actor_role,
        actor_name: a.event.actor_name ?? null,
        event_type: a.event.event_type,
        metadata: a.event.metadata ?? {},
        created_at: a.event.created_at,
      })),
    );
    if (!error) await Promise.all(mine.map((a) => idb.del(STORES.pendingAudit, a.key)));
  }

  // 4. clean local state
  await saveLocalTransaction({ ...txn, audit_photo_path: photoPath, sync_status: "SYNCED" });
  await idb.del(STORES.syncQueue, txn.transaction_id);
  await idb.del(STORES.pendingPhotos, txn.transaction_id);

  onActivity({
    transaction_id: txn.transaction_id,
    state: "synced",
    message: "Synced",
  });
}

export async function runSync(
  operatorId: string,
  onProgress: (report: SyncReport) => void,
): Promise<SyncReport> {
  const queue = await queueItems();
  const locals = await localTransactions();
  const byId = new Map(locals.map((t) => [t.transaction_id, t]));
  const activity: SyncActivity[] = [];
  const report: SyncReport = {
    total: queue.length,
    completed: 0,
    failed: 0,
    activity,
    stages: { data: "idle", photos: "idle", approvals: "idle" },
  };

  if (!queue.length) {
    report.stages = { data: "done", photos: "done", approvals: "done" };
    onProgress({ ...report });
    return report;
  }

  report.stages.data = "active";
  onProgress({ ...report });

  const due = queue.filter((q) => q.nextAttemptAt <= Date.now());
  for (const item of due) {
    const txn = byId.get(item.transaction_id);
    if (!txn) {
      await idb.del(STORES.syncQueue, item.transaction_id);
      continue;
    }
    try {
      await pushOne(txn, operatorId, (a) => {
        const i = activity.findIndex((x) => x.transaction_id === a.transaction_id);
        if (i >= 0) activity[i] = a;
        else activity.push(a);
        onProgress({ ...report, activity: [...activity] });
      });
      report.completed += 1;
      report.stages.photos = "done";
    } catch (err) {
      report.failed += 1;
      const attempts = item.attempts + 1;
      const next: QueueItem = {
        ...item,
        attempts,
        lastError: err instanceof Error ? err.message : "Unknown error",
        nextAttemptAt: Date.now() + backoffMs(attempts),
      };
      await idb.put(STORES.syncQueue, next);
      activity.push({
        transaction_id: item.transaction_id,
        state: "failed",
        message: "Upload failed — will retry automatically",
      });
      await saveLocalTransaction({ ...txn, sync_status: "SYNC_FAILED" });
    }
    onProgress({ ...report, activity: [...activity] });
  }

  report.stages = {
    data: "done",
    photos: "done",
    approvals: report.failed === 0 ? "done" : "active",
  };
  onProgress({ ...report });
  return report;
}
