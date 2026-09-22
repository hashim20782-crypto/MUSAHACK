/**
 * IndexedDB store for offline-first collection.
 * Photo blobs live here too — never localStorage.
 */
import type { AuditEvent, Transaction, Farmer } from "./agri";

const DB_NAME = "agritrust";
const DB_VERSION = 1;

export const STORES = {
  pendingTransactions: "pending_transactions",
  pendingPhotos: "pending_photos",
  syncQueue: "sync_queue",
  cachedFarmers: "cached_farmers",
  pendingAudit: "pending_audit_events",
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORES.pendingTransactions))
          db.createObjectStore(STORES.pendingTransactions, { keyPath: "transaction_id" });
        if (!db.objectStoreNames.contains(STORES.pendingPhotos))
          db.createObjectStore(STORES.pendingPhotos, { keyPath: "transaction_id" });
        if (!db.objectStoreNames.contains(STORES.syncQueue))
          db.createObjectStore(STORES.syncQueue, { keyPath: "transaction_id" });
        if (!db.objectStoreNames.contains(STORES.cachedFarmers))
          db.createObjectStore(STORES.cachedFarmers, { keyPath: "id" });
        if (!db.objectStoreNames.contains(STORES.pendingAudit))
          db.createObjectStore(STORES.pendingAudit, { keyPath: "key" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = run(t.objectStore(store));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const idb = {
  put: <T>(store: StoreName, value: T) => tx<IDBValidKey>(store, "readwrite", (s) => s.put(value as never)),
  get: <T>(store: StoreName, key: IDBValidKey) => tx<T | undefined>(store, "readonly", (s) => s.get(key)),
  all: <T>(store: StoreName) => tx<T[]>(store, "readonly", (s) => s.getAll()),
  del: (store: StoreName, key: IDBValidKey) => tx<undefined>(store, "readwrite", (s) => s.delete(key)),
  clear: (store: StoreName) => tx<undefined>(store, "readwrite", (s) => s.clear()),
};

/* ---------- typed helpers ---------- */

export interface QueueItem {
  transaction_id: string;
  attempts: number;
  lastError?: string;
  nextAttemptAt: number;
  createdAt: number;
}

export interface PendingPhoto {
  transaction_id: string;
  blob: Blob;
  thumb: Blob;
  filename: string;
}

export async function saveLocalTransaction(t: Transaction) {
  await idb.put(STORES.pendingTransactions, t);
}

export async function localTransactions(): Promise<Transaction[]> {
  try {
    return await idb.all<Transaction>(STORES.pendingTransactions);
  } catch {
    return [];
  }
}

export async function savePendingPhoto(p: PendingPhoto) {
  await idb.put(STORES.pendingPhotos, p);
}

export async function getPendingPhoto(id: string) {
  return idb.get<PendingPhoto>(STORES.pendingPhotos, id);
}

export async function enqueue(transaction_id: string) {
  const existing = await idb.get<QueueItem>(STORES.syncQueue, transaction_id);
  if (existing) return;
  await idb.put<QueueItem>(STORES.syncQueue, {
    transaction_id,
    attempts: 0,
    nextAttemptAt: Date.now(),
    createdAt: Date.now(),
  });
}

export async function queueItems(): Promise<QueueItem[]> {
  try {
    return await idb.all<QueueItem>(STORES.syncQueue);
  } catch {
    return [];
  }
}

export async function cacheFarmers(list: Farmer[]) {
  try {
    await Promise.all(list.map((f) => idb.put(STORES.cachedFarmers, f)));
  } catch {
    /* cache is best-effort */
  }
}

export async function cachedFarmers(): Promise<Farmer[]> {
  try {
    return await idb.all<Farmer>(STORES.cachedFarmers);
  } catch {
    return [];
  }
}

export async function savePendingAudit(events: AuditEvent[]) {
  await Promise.all(
    events.map((e) =>
      idb.put(STORES.pendingAudit, {
        key: `${e.transaction_id}:${e.event_type}:${e.created_at}`,
        event: e,
      }),
    ),
  );
}

export async function pendingAuditFor(transaction_id: string): Promise<AuditEvent[]> {
  try {
    const rows = await idb.all<{ key: string; event: AuditEvent }>(STORES.pendingAudit);
    return rows.filter((r) => r.event.transaction_id === transaction_id).map((r) => r.event);
  } catch {
    return [];
  }
}

export async function allPendingAudit(): Promise<Array<{ key: string; event: AuditEvent }>> {
  try {
    return await idb.all<{ key: string; event: AuditEvent }>(STORES.pendingAudit);
  } catch {
    return [];
  }
}

/** Rough local storage footprint, for the profile screen. */
export async function storageUsage(): Promise<{ usedMb: number; quotaMb: number }> {
  if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
    try {
      const est = await navigator.storage.estimate();
      return {
        usedMb: (est.usage ?? 0) / 1_048_576,
        quotaMb: Math.min((est.quota ?? 52_428_800) / 1_048_576, 50),
      };
    } catch {
      /* ignore */
    }
  }
  return { usedMb: 0, quotaMb: 50 };
}
