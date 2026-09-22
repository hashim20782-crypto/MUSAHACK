import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/agri/AppShell";
import { EmptyState } from "@/components/agri/EmptyState";
import { useAgri } from "@/context/AgriProvider";
import { formatKg, formatTime } from "@/lib/agri";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/disputes")({
  head: () => ({
    meta: [
      { title: "Disputes · AgriTrust" },
      {
        name: "description",
        content:
          "Flagged collection transactions awaiting admin review, with reason, priority and time raised.",
      },
      { property: "og:title", content: "Disputes · AgriTrust" },
      { property: "og:description", content: "Flagged transactions awaiting admin review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DisputesPage,
});

function priorityFor(reason: string | null | undefined) {
  if (!reason) return { label: "Normal", cls: "bg-secondary text-secondary-foreground" };
  if (/grade/i.test(reason))
    return { label: "Urgent", cls: "bg-danger-surface text-destructive" };
  if (/left before/i.test(reason))
    return { label: "High", cls: "bg-pending-surface text-pending-foreground" };
  return { label: "Normal", cls: "bg-secondary text-secondary-foreground" };
}

function DisputesPage() {
  const { transactions } = useAgri();
  const disputes = transactions.filter((t) => t.status === "DISPUTED");

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Disputes</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {disputes.length} transaction{disputes.length === 1 ? "" : "s"} flagged for admin review
          </p>
        </div>

        {disputes.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No disputes require attention."
            description="You're all caught up — every transaction today was approved by the farmer."
          />
        ) : (
          <>
            {/* desktop table */}
            <div className="surface-card hidden overflow-hidden lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/60">
                  <tr className="label-meta">
                    <th scope="col" className="px-5 py-3">Transaction ID</th>
                    <th scope="col" className="px-5 py-3">Farmer</th>
                    <th scope="col" className="px-5 py-3">Reason</th>
                    <th scope="col" className="px-5 py-3">Time</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                    <th scope="col" className="px-5 py-3">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {disputes.map((t) => {
                    const p = priorityFor(t.dispute_reason);
                    return (
                      <tr key={t.transaction_id} className="hover:bg-secondary/40">
                        <td className="px-5 py-4 font-semibold">
                          <Link
                            to="/transactions/$id"
                            params={{ id: t.transaction_id }}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            {t.transaction_id}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          {t.farmer_name}
                          <span className="block text-xs text-muted-foreground">
                            {formatKg(t.weight)} • Grade {t.grade}
                          </span>
                        </td>
                        <td className="px-5 py-4">{t.dispute_reason ?? "Not specified"}</td>
                        <td className="px-5 py-4 tabular">{formatTime(t.created_at)}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-pending/40 bg-pending-surface px-3 py-1 text-xs font-semibold text-pending-foreground">
                            <AlertTriangle className="size-3.5" aria-hidden="true" />
                            Pending review
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-bold",
                              p.cls,
                            )}
                          >
                            {p.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="space-y-3 lg:hidden">
              {disputes.map((t) => {
                const p = priorityFor(t.dispute_reason);
                return (
                  <Link
                    key={t.transaction_id}
                    to="/transactions/$id"
                    params={{ id: t.transaction_id }}
                    className="surface-card block space-y-3 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-base font-semibold">
                          {t.farmer_name}
                        </span>
                        <span className="label-meta block">{t.transaction_id}</span>
                      </span>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-bold", p.cls)}>
                        {p.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{t.dispute_reason ?? "Not specified"}</p>
                    {t.dispute_note ? (
                      <p className="text-sm text-muted-foreground">{t.dispute_note}</p>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-pending/40 bg-pending-surface px-3 py-1 text-xs font-semibold text-pending-foreground">
                        <AlertTriangle className="size-3.5" aria-hidden="true" />
                        Pending review
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground tabular">
                        {formatTime(t.created_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
