import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  Lock,
  Maximize2,
  Phone,
  Scale,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/agri/AppShell";
import { GradeChip, TransactionStatus } from "@/components/agri/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAgri } from "@/context/AgriProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  AUDIT_EVENT_LABEL,
  AUDIT_EVENT_ORDER,
  DISPUTE_REASONS,
  formatDateTime,
  formatKg,
  formatTime,
  maskPhone,
  type AuditEvent,
} from "@/lib/agri";
import { flagDispute } from "@/lib/demo";
import { getPendingPhoto, pendingAuditFor } from "@/lib/offline-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/transactions/$id")({
  head: () => ({
    meta: [
      { title: "Transaction Evidence · AgriTrust" },
      {
        name: "description",
        content:
          "Full evidence for a collection transaction: farmer, weight, grade, audit photo and the complete audit timeline.",
      },
      { property: "og:title", content: "Transaction Evidence · AgriTrust" },
      {
        property: "og:description",
        content: "Audit photo, approval status and full audit timeline for one delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransactionDetail,
});

function TransactionDetail() {
  const { id } = useParams({ from: "/_authenticated/transactions/$id" });
  const { transactions, transactionsLoading, connection, refreshTransactions, farmers } = useAgri();
  const txn = transactions.find((t) => t.transaction_id === id);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [reason, setReason] = useState(DISPUTE_REASONS[0]!);
  const [note, setNote] = useState("");
  const [flagging, setFlagging] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [flagError, setFlagError] = useState<string | null>(null);

  const farmer = farmers.find((f) => f.id === txn?.farmer_id);

  /* audit trail: remote events plus anything still queued on this device */
  const events = useQuery({
    queryKey: ["audit", id],
    enabled: !!txn,
    queryFn: async (): Promise<AuditEvent[]> => {
      const local = await pendingAuditFor(id);
      const { data } = await supabase
        .from("audit_events")
        .select("*")
        .eq("transaction_id", id)
        .order("created_at");
      const remote = (data ?? []) as unknown as AuditEvent[];
      const seen = new Set(remote.map((e) => `${e.event_type}-${e.created_at}`));
      return [...remote, ...local.filter((e) => !seen.has(`${e.event_type}-${e.created_at}`))].sort(
        (a, b) => {
          const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          // events recorded inside the same second keep the workflow order
          if (diff !== 0) return diff;
          return AUDIT_EVENT_ORDER.indexOf(a.event_type) - AUDIT_EVENT_ORDER.indexOf(b.event_type);
        },
      );
    },
  });

  /* audit photo: signed url from private storage, or the local blob when queued */
  useEffect(() => {
    let revoke: string | null = null;
    async function load() {
      if (!txn) return;
      const pending = await getPendingPhoto(txn.transaction_id);
      if (pending) {
        revoke = URL.createObjectURL(pending.blob);
        setPhotoUrl(revoke);
        return;
      }
      if (txn.audit_photo_path && !txn.audit_photo_path.startsWith("local:")) {
        const { data } = await supabase.storage
          .from("audit-photos")
          .createSignedUrl(txn.audit_photo_path, 600);
        setPhotoUrl(data?.signedUrl ?? null);
      }
    }
    void load();
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [txn]);

  if (transactionsLoading && !txn) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  if (!txn) {
    return (
      <AppShell>
        <div className="surface-card space-y-3 p-8 text-center">
          <AlertTriangle className="mx-auto size-8 text-destructive" aria-hidden="true" />
          <h1 className="text-xl font-bold">We couldn't find that transaction.</h1>
          <p className="text-sm text-muted-foreground">
            It may still be uploading from another device, or the ID is incorrect.
          </p>
          <Button asChild className="rounded-2xl">
            <Link to="/transactions">Back to the ledger</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const locked = txn.status === "VERIFIED_LOCKED";

  async function confirmFlag() {
    setFlagging(true);
    setFlagError(null);
    try {
      await flagDispute(txn!, reason, note, connection.browserOnline);
      setFlagged(true);
      refreshTransactions();
    } catch {
      setFlagError("We couldn't flag this transaction right now. It will retry when you're online.");
    } finally {
      setFlagging(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Today's transactions
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="label-meta">Transaction</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{txn.transaction_id}</h1>
          </div>
          <TransactionStatus status={txn.status} sync={txn.sync_status} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {/* evidence card */}
          <section className="surface-card overflow-hidden">
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Audit photo showing the crop, scale reading and grade card"
                  className="aspect-4/3 w-full object-cover"
                />
              ) : (
                <div className="grid aspect-4/3 max-h-64 w-full place-items-center bg-secondary text-center">
                  <div className="space-y-2 px-6">
                    <Camera className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {txn.audit_photo_path
                        ? "Loading the audit photo…"
                        : "No audit photo was attached to this record."}
                    </p>
                  </div>
                </div>
              )}
              {photoUrl ? (
                <button
                  type="button"
                  onClick={() => setFullOpen(true)}
                  className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-2xl glass-dark px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Maximize2 className="size-4" aria-hidden="true" />
                  View full evidence
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-surface px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Evidence captured at the scale
              </span>
              <span className="label-meta ml-auto">
                {txn.sync_status === "SYNCED" ? "Stored in private storage" : "Queued on this device"}
              </span>
            </div>
          </section>

          {/* facts */}
          <section className="space-y-5">
            <div className="surface-card space-y-4 p-5">
              <dl className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <dt className="label-meta">Farmer</dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-lg font-bold">
                    <User className="size-4 text-muted-foreground" aria-hidden="true" />
                    {txn.farmer_name}
                  </dd>
                </div>
                <div>
                  <dt className="label-meta">Phone</dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-sm font-semibold tabular">
                    <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
                    {farmer ? maskPhone(farmer.phone) : "Not on this device"}
                  </dd>
                </div>
                <div>
                  <dt className="label-meta">FPO ID</dt>
                  <dd className="mt-1 text-sm font-semibold">{txn.farmer_fpo_id ?? "—"}</dd>
                </div>
                <div>
                  <dt className="label-meta">Weight</dt>
                  <dd className="numeric-lg mt-1 inline-flex items-center gap-2">
                    <Scale className="size-5 text-muted-foreground" aria-hidden="true" />
                    {formatKg(txn.weight)}
                  </dd>
                </div>
                <div>
                  <dt className="label-meta">Grade</dt>
                  <dd className="mt-2">
                    <GradeChip grade={txn.grade} />
                  </dd>
                </div>
                <div>
                  <dt className="label-meta">Crop</dt>
                  <dd className="mt-1 text-sm font-semibold">{txn.crop_type}</dd>
                </div>
                <div>
                  <dt className="label-meta">Operator</dt>
                  <dd className="mt-1 text-sm font-semibold">{txn.operator_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="label-meta">Created</dt>
                  <dd className="mt-1 text-sm font-semibold">{formatDateTime(txn.created_at)}</dd>
                </div>
                <div>
                  <dt className="label-meta">Verified</dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {txn.verified_at ? formatDateTime(txn.verified_at) : "Awaiting farmer"}
                  </dd>
                </div>
              </dl>

              {locked ? (
                <p className="inline-flex items-center gap-2 rounded-2xl border border-success/30 bg-success-surface px-3 py-2 text-sm font-semibold text-primary">
                  <Lock className="size-4" aria-hidden="true" />
                  This transaction is permanently locked and can no longer be edited.
                </p>
              ) : txn.status === "DISPUTED" ? (
                <div className="rounded-2xl border border-destructive/30 bg-danger-surface p-3 text-sm">
                  <p className="font-semibold text-destructive">
                    Flagged: {txn.dispute_reason ?? "Reason not recorded"}
                  </p>
                  {txn.dispute_note ? (
                    <p className="mt-1 text-muted-foreground">{txn.dispute_note}</p>
                  ) : null}
                  <p className="mt-1 font-medium text-muted-foreground">Admin has been notified.</p>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-destructive/40 text-destructive hover:bg-danger-surface"
                  onClick={() => setFlagOpen(true)}
                >
                  <Flag className="size-4" aria-hidden="true" />
                  Flag this transaction
                </Button>
              )}
            </div>

            {/* audit timeline */}
            <div className="surface-card p-5">
              <h2 className="text-base font-semibold">Audit trail</h2>
              {events.isLoading ? (
                <div className="mt-4 space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-10 rounded-xl" />
                  ))}
                </div>
              ) : (events.data ?? []).length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {txn.sync_status === "SYNCED"
                    ? "No audit events were recorded for this earlier record."
                    : "The audit trail will appear once this record is uploaded."}
                </p>
              ) : (
                <ol className="mt-4 space-y-4">
                  {(events.data ?? []).map((e, i) => (
                    <li key={`${e.event_type}-${e.created_at}-${i}`} className="flex gap-3">
                      <span className="flex flex-col items-center">
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-full",
                            e.event_type === "TRANSACTION_LOCKED"
                              ? "bg-primary text-primary-foreground"
                              : e.event_type === "DISPUTE_CREATED"
                                ? "bg-danger-surface text-destructive"
                                : "bg-success-surface text-success",
                          )}
                        >
                          {e.event_type === "TRANSACTION_LOCKED" ? (
                            <Lock className="size-3.5" aria-hidden="true" />
                          ) : e.event_type === "DISPUTE_CREATED" ? (
                            <AlertTriangle className="size-3.5" aria-hidden="true" />
                          ) : (
                            <CheckCircle2 className="size-3.5" aria-hidden="true" />
                          )}
                        </span>
                        {i < (events.data ?? []).length - 1 ? (
                          <span className="mt-1 w-0.5 flex-1 bg-border" aria-hidden="true" />
                        ) : null}
                      </span>
                      <span className="min-w-0 pb-1">
                        <span className="block text-sm font-semibold">
                          {AUDIT_EVENT_LABEL[e.event_type] ?? e.event_type}
                        </span>
                        <span className="label-meta block">
                          {formatTime(e.created_at)} ·{" "}
                          {e.actor_name ?? e.actor_role.toLowerCase()}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* full evidence */}
      <Dialog open={fullOpen} onOpenChange={setFullOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit evidence · {txn.transaction_id}</DialogTitle>
            <DialogDescription>
              {txn.farmer_name} · {formatKg(txn.weight)} · Grade {txn.grade}
            </DialogDescription>
          </DialogHeader>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Full-size audit photo of crop, scale and grade card"
              className="w-full rounded-2xl"
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* flag dispute */}
      <Dialog
        open={flagOpen}
        onOpenChange={(o) => {
          setFlagOpen(o);
          if (!o) setFlagged(false);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {flagged ? "Transaction flagged" : "Flag this transaction"}
            </DialogTitle>
            <DialogDescription>
              {flagged
                ? "Admin has been notified. The record is now marked Disputed."
                : "Farmer approval has not been received for this delivery."}
            </DialogDescription>
          </DialogHeader>

          {flagged ? (
            <div className="flex items-center gap-3 rounded-2xl bg-success-surface p-4 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-5" aria-hidden="true" />
              Admin has been notified.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-pending/40 bg-pending-surface p-3 text-sm font-semibold text-pending-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Farmer approval not received
              </div>
              <fieldset className="space-y-2">
                <legend className="label-meta mb-1">Reason</legend>
                {DISPUTE_REASONS.map((r) => (
                  <label
                    key={r}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm font-medium",
                      reason === r ? "border-primary bg-secondary" : "border-border",
                    )}
                  >
                    <input
                      type="radio"
                      name="dispute-reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="size-4"
                    />
                    {r}
                  </label>
                ))}
              </fieldset>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a short note…"
                aria-label="Dispute note"
                className="min-h-24 rounded-2xl"
              />
              {flagError ? (
                <p role="alert" className="text-sm font-semibold text-destructive">
                  {flagError}
                </p>
              ) : null}
              <Button
                type="button"
                onClick={() => void confirmFlag()}
                disabled={flagging}
                className="h-12 w-full rounded-2xl bg-destructive text-base text-white hover:bg-destructive/90"
              >
                {flagging ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
                Flag transaction
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
