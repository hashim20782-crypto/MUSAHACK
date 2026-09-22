import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  FileClock,
  CloudOff,
  Package,
  Scale,
  ShieldCheck,
} from "lucide-react";

import heroImage from "@/assets/hero-collection.jpg";
import { AppShell } from "@/components/agri/AppShell";
import { EmptyState } from "@/components/agri/EmptyState";
import { MetricCard } from "@/components/agri/MetricCard";
import { ConnectionPill } from "@/components/agri/StatusPill";
import { TransactionCard } from "@/components/agri/TransactionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgri } from "@/context/AgriProvider";
import { formatWeight, greeting, isToday } from "@/lib/agri";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Operator Dashboard · AgriTrust" },
      {
        name: "description",
        content:
          "Today's collection totals, pending farmer approvals and disputes for your collection centre.",
      },
      { property: "og:title", content: "Operator Dashboard · AgriTrust" },
      {
        property: "og:description",
        content: "Collection totals, pending approvals and disputes at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { operator, connection, transactions, transactionsLoading, pendingCount } = useAgri();

  const today = transactions.filter((t) => isToday(t.created_at));
  const totalWeight = today.reduce((sum, t) => sum + Number(t.weight || 0), 0);
  const pending = today.filter((t) => t.status === "PENDING_APPROVAL").length;
  const verified = today.filter((t) => t.status === "VERIFIED_LOCKED").length;
  const disputes = today.filter((t) => t.status === "DISPUTED").length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* greeting */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting()}, {operator?.name ?? "Operator"}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Collection Center • {operator?.collection_center ?? "Nashik"}
            </p>
          </div>
          <ConnectionPill
            state={connection.state}
            label={connection.label}
            className="hidden lg:inline-flex"
          />
        </div>

        {connection.state === "offline" ? (
          <div className="flex items-start gap-3 rounded-3xl border border-pending/40 bg-pending-surface p-4">
            <CloudOff className="mt-0.5 size-5 shrink-0 text-pending-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold text-pending-foreground">
              You're offline, but you can continue collecting. Everything you record is saved on
              this device and uploaded automatically.
            </p>
          </div>
        ) : null}

        {/* hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border">
          <img
            src={heroImage}
            alt="Collection centre with weighing scale and produce sacks at golden hour"
            className="h-52 w-full object-cover sm:h-64 lg:h-80"
          />
          <div className="hero-scrim absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:p-7">
            <div className="max-w-md">
              <p className="text-xs font-bold tracking-[0.18em] text-white/80 uppercase">
                Today's collection
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {formatWeight(totalWeight)}
                <span className="ml-2 text-lg font-semibold text-white/80">kg</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-2xl glass px-3 py-2 text-xs font-semibold text-white">
                {today.length} deliveries recorded
              </span>
              <span className="rounded-2xl glass px-3 py-2 text-xs font-semibold text-white">
                {pendingCount} waiting to upload
              </span>
            </div>
          </div>
        </section>

        {/* primary action */}
        <Link
          to="/delivery"
          className="flex touch-target items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift transition-transform active:scale-[0.99] sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15">
            <Package className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-bold tracking-tight sm:text-xl">
              Start new delivery
            </span>
            <span className="block text-sm text-primary-foreground/80">
              Create a verified collection transaction
            </span>
          </span>
          <ArrowRight className="ml-auto size-6 shrink-0" aria-hidden="true" />
        </Link>

        {/* metrics */}
        <section aria-label="Today's metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Total weight"
            value={formatWeight(totalWeight)}
            unit="kg"
            subtitle="Collected Today"
            icon={Scale}
            decoration="bars"
          />
          <MetricCard
            label="Pending approvals"
            value={String(pending).padStart(2, "0")}
            subtitle="Awaiting Farmers"
            icon={FileClock}
            decoration="users"
          />
          <MetricCard
            label="Verified today"
            value={String(verified).padStart(2, "0")}
            subtitle="Completed Deliveries"
            icon={ShieldCheck}
            decoration="badge"
          />
          <MetricCard
            label="Disputes"
            value={String(disputes).padStart(2, "0")}
            subtitle="Needs Attention"
            icon={AlertTriangle}
            decoration="file-warning"
          />
        </section>

        {/* recent */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent deliveries</h2>
            <Link to="/transactions" className="text-sm font-semibold text-primary">
              View ledger
            </Link>
          </div>

          {transactionsLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-28 rounded-3xl" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No transactions today."
              description="Start a new delivery to create the first verified record of the day."
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {transactions.slice(0, 6).map((t) => (
                <TransactionCard key={t.transaction_id} txn={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
