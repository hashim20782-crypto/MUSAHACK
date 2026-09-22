import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  CloudOff,
  Images,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { AppShell } from "@/components/agri/AppShell";
import { EmptyState } from "@/components/agri/EmptyState";
import { ConnectionPill } from "@/components/agri/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAgri } from "@/context/AgriProvider";
import { formatTime } from "@/lib/agri";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/sync")({
  head: () => ({
    meta: [
      { title: "Sync Center · AgriTrust" },
      {
        name: "description",
        content:
          "Watch queued transactions, audit photos and farmer approvals upload automatically when the connection returns.",
      },
      { property: "og:title", content: "Sync Center · AgriTrust" },
      {
        property: "og:description",
        content: "Offline queue, upload progress and last successful sync.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SyncCenter,
});

const STAGES = [
  { key: "data", label: "Transaction data", icon: ShieldCheck },
  { key: "photos", label: "Audit photos", icon: Images },
  { key: "approvals", label: "Farmer approvals", icon: CheckCircle2 },
] as const;

function SyncCenter() {
  const { connection, syncNow, syncReport, lastSyncAt, pendingCount, transactions } = useAgri();

  const total = syncReport?.total ?? pendingCount;
  const completed = syncReport?.completed ?? 0;
  const percent = total ? Math.round((completed / total) * 100) : pendingCount === 0 ? 100 : 0;
  const queued = transactions.filter((t) => t.sync_status !== "SYNCED");

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sync Center</h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Nothing is lost offline — uploads resume on their own.
            </p>
          </div>
          <ConnectionPill state={connection.state} label={connection.label} />
        </div>

        {/* status card */}
        <section className="surface-card space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="label-meta">Sync status</span>
            <span
              className={cn(
                "text-sm font-bold",
                connection.state === "offline" ? "text-destructive" : "text-success",
              )}
            >
              {connection.state === "offline"
                ? "Waiting for connection"
                : connection.state === "syncing"
                  ? "Uploading…"
                  : "Connection restored"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="numeric-lg">
              {completed} / {total || 0}
              <span className="ml-2 text-sm font-semibold text-muted-foreground">
                transactions uploaded
              </span>
            </p>
            <Progress value={percent} aria-label="Sync progress" />
          </div>

          <ul className="space-y-2">
            {STAGES.map(({ key, label, icon: Icon }) => {
              const state = syncReport?.stages?.[key] ?? (pendingCount === 0 ? "done" : "idle");
              return (
                <li key={key} className="flex items-center gap-3 text-sm font-medium">
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-xl",
                      state === "done"
                        ? "bg-success-surface text-success"
                        : state === "active"
                          ? "bg-pending-surface text-pending-foreground"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {state === "done" ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : state === "active" ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Icon className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  {label}
                  <span className="ml-auto text-xs font-semibold text-muted-foreground uppercase">
                    {state === "done" ? "Complete" : state === "active" ? "In progress" : "Waiting"}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Last successful sync:{" "}
              <span className="font-bold text-foreground">
                {lastSyncAt ? `Today, ${formatTime(lastSyncAt)}` : "Not yet on this device"}
              </span>
            </p>
            <Button
              type="button"
              onClick={() => void syncNow()}
              disabled={connection.state === "offline"}
              className="h-11 rounded-2xl"
            >
              <RefreshCw
                className={cn("size-4", connection.state === "syncing" && "animate-spin")}
                aria-hidden="true"
              />
              Sync now
            </Button>
          </div>
        </section>

        {/* activity */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
          {syncReport && syncReport.activity.length > 0 ? (
            <ul className="surface-card divide-y divide-border">
              {syncReport.activity.map((a) => (
                <li key={`${a.transaction_id}-${a.state}`} className="flex items-center gap-3 p-4">
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-xl",
                      a.state === "synced"
                        ? "bg-success-surface text-success"
                        : a.state === "failed"
                          ? "bg-danger-surface text-destructive"
                          : "bg-pending-surface text-pending-foreground",
                    )}
                  >
                    {a.state === "synced" ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : a.state === "failed" ? (
                      <CloudOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{a.transaction_id}</span>
                    <span className="block text-xs text-muted-foreground">{a.message}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : queued.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Everything is synchronized."
              description="No transactions, photos or approvals are waiting to upload."
            />
          ) : (
            <ul className="surface-card divide-y divide-border">
              {queued.map((t) => (
                <li key={t.transaction_id} className="flex items-center gap-3 p-4">
                  <span className="grid size-8 place-items-center rounded-xl bg-pending-surface text-pending-foreground">
                    <CloudOff className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{t.transaction_id}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.farmer_name} · queued on this device
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
