import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { AuditEvent, Farmer, Transaction } from "@/lib/agri";
import { useConnection, type Connection } from "@/hooks/useConnection";
import {
  cacheFarmers,
  cachedFarmers,
  enqueue,
  localTransactions,
  savePendingAudit,
  savePendingPhoto,
  saveLocalTransaction,
} from "@/lib/offline-store";
import { runSync, type SyncReport } from "@/lib/sync";

export interface OperatorProfile {
  id: string;
  name: string;
  operator_code: string;
  role: string;
  collection_center: string;
  email: string | null;
  phone: string | null;
  language: string;
  voice_enabled: boolean;
}

interface CommitInput {
  transaction: Transaction;
  photo?: { full: Blob; thumb: Blob } | null;
  events: AuditEvent[];
}

interface AgriContextValue {
  session: Session | null;
  operator: OperatorProfile | null;
  operatorLoading: boolean;
  connection: Connection;
  farmers: Farmer[];
  farmersLoading: boolean;
  transactions: Transaction[];
  transactionsLoading: boolean;
  refreshTransactions: () => void;
  commit: (input: CommitInput) => Promise<void>;
  syncNow: () => Promise<void>;
  syncReport: SyncReport | null;
  lastSyncAt: string | null;
  pendingCount: number;
  updateOperator: (patch: Partial<OperatorProfile>) => Promise<void>;
}

const AgriContext = createContext<AgriContextValue | null>(null);

const FALLBACK_OPERATOR: Omit<OperatorProfile, "id"> = {
  name: "Operator",
  operator_code: "OP-2048",
  role: "Collection Operator",
  collection_center: "Nashik",
  email: null,
  phone: null,
  language: "en",
  voice_enabled: true,
};

function mergeTransactions(remote: Transaction[], local: Transaction[]): Transaction[] {
  const map = new Map<string, Transaction>();
  for (const t of remote) map.set(t.transaction_id, t);
  for (const t of local) {
    const existing = map.get(t.transaction_id);
    // local copy wins while it is still unsynced
    if (!existing || t.sync_status !== "SYNCED") map.set(t.transaction_id, { ...existing, ...t });
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function AgriProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const connection = useConnection();
  const [session, setSession] = useState<Session | null>(null);
  const [localTxns, setLocalTxns] = useState<Transaction[]>([]);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const syncing = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  const operatorQuery = useQuery({
    queryKey: ["operator", userId],
    enabled: !!userId,
    queryFn: async (): Promise<OperatorProfile> => {
      const { data, error } = await supabase
        .from("operators")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as OperatorProfile;
      const seeded = {
        id: userId!,
        ...FALLBACK_OPERATOR,
        name:
          (session?.user?.user_metadata?.['name'] as string | undefined) ??
          session?.user?.email?.split("@")[0] ??
          "Operator",
        email: session?.user?.email ?? null,
      };
      await supabase.from("operators").insert(seeded);
      return seeded;
    },
  });

  const farmersQuery = useQuery({
    queryKey: ["farmers"],
    queryFn: async (): Promise<Farmer[]> => {
      const { data, error } = await supabase
        .from("farmers")
        .select("id, fpo_id, name, phone, village, qr_identifier")
        .order("name");
      if (error) {
        const cached = await cachedFarmers();
        if (cached.length) return cached;
        throw error;
      }
      await cacheFarmers(data as Farmer[]);
      return data as Farmer[];
    },
    staleTime: 10 * 60_000,
    retry: 1,
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as unknown as Transaction[];
    },
    retry: 1,
  });

  const reloadLocal = useCallback(async () => {
    setLocalTxns(await localTransactions());
  }, []);

  useEffect(() => {
    void reloadLocal();
  }, [reloadLocal]);

  /* realtime: farmer approvals and admin changes land without a refresh */
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("agritrust-transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const syncNow = useCallback(async () => {
    if (!userId || syncing.current || !connection.browserOnline) return;
    syncing.current = true;
    connection.setSyncing(true);
    try {
      const report = await runSync(userId, (r) => setSyncReport(r));
      setSyncReport(report);
      setLastSyncAt(new Date().toISOString());
      await reloadLocal();
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } finally {
      syncing.current = false;
      connection.setSyncing(false);
    }
  }, [userId, connection, queryClient, reloadLocal]);

  /* automatic sync when the connection comes back and work is waiting.
     Keyed on browserOnline (not connection.state) so the "syncing" state this
     very effect produces can't retrigger it in a loop. */
  const wasOffline = useRef(false);
  useEffect(() => {
    if (!userId) return;
    if (!connection.browserOnline) {
      wasOffline.current = true;
      return;
    }
    const restored = wasOffline.current;
    wasOffline.current = false;
    const waiting = localTxns.some((t) => t.sync_status !== "SYNCED");
    if (restored || waiting) void syncNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection.browserOnline, userId, localTxns]);

  const commit = useCallback(
    async ({ transaction, photo, events }: CommitInput) => {
      await saveLocalTransaction(transaction);
      if (photo) {
        await savePendingPhoto({
          transaction_id: transaction.transaction_id,
          blob: photo.full,
          thumb: photo.thumb,
          filename: `${transaction.transaction_id}.jpg`,
        });
      }
      if (events.length) await savePendingAudit(events);
      await enqueue(transaction.transaction_id);
      await reloadLocal();
      if (connection.browserOnline) await syncNow();
    },
    [connection.browserOnline, reloadLocal, syncNow],
  );

  const updateOperator = useCallback(
    async (patch: Partial<OperatorProfile>) => {
      if (!userId) return;
      await supabase.from("operators").update(patch).eq("id", userId);
      await queryClient.invalidateQueries({ queryKey: ["operator", userId] });
    },
    [userId, queryClient],
  );

  const transactions = useMemo(
    () => mergeTransactions(transactionsQuery.data ?? [], localTxns),
    [transactionsQuery.data, localTxns],
  );

  const pendingCount = useMemo(
    () => localTxns.filter((t) => t.sync_status !== "SYNCED").length,
    [localTxns],
  );

  const value: AgriContextValue = {
    session,
    operator: operatorQuery.data ?? null,
    operatorLoading: operatorQuery.isLoading,
    connection,
    farmers: farmersQuery.data ?? [],
    farmersLoading: farmersQuery.isLoading,
    transactions,
    transactionsLoading: transactionsQuery.isLoading,
    refreshTransactions: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void reloadLocal();
    },
    commit,
    syncNow,
    syncReport,
    lastSyncAt,
    pendingCount,
    updateOperator,
  };

  return <AgriContext.Provider value={value}>{children}</AgriContext.Provider>;
}

export function useAgri(): AgriContextValue {
  const ctx = useContext(AgriContext);
  if (!ctx) throw new Error("useAgri must be used inside AgriProvider");
  return ctx;
}
