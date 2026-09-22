import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Package, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/agri/AppShell";
import { EmptyState } from "@/components/agri/EmptyState";
import { TransactionCard } from "@/components/agri/TransactionCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgri } from "@/context/AgriProvider";
import { formatWeight, isToday, type Transaction } from "@/lib/agri";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/transactions/")({
  head: () => ({
    meta: [
      { title: "Today's Transactions · AgriTrust" },
      {
        name: "description",
        content:
          "Daily collection ledger: every delivery with farmer, weight, grade, verification and sync status.",
      },
      { property: "og:title", content: "Today's Transactions · AgriTrust" },
      {
        property: "og:description",
        content: "Daily collection ledger with verification and sync status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransactionsPage,
});

const FILTERS = ["All", "Pending", "Verified", "Disputed", "Sync Pending"] as const;
type Filter = (typeof FILTERS)[number];

function matches(t: Transaction, filter: Filter): boolean {
  switch (filter) {
    case "Pending":
      return t.status === "PENDING_APPROVAL";
    case "Verified":
      return t.status === "VERIFIED_LOCKED";
    case "Disputed":
      return t.status === "DISPUTED";
    case "Sync Pending":
      return t.sync_status !== "SYNCED";
    default:
      return true;
  }
}

function TransactionsPage() {
  const { transactions, transactionsLoading } = useAgri();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const today = useMemo(() => transactions.filter((t) => isToday(t.created_at)), [transactions]);
  const totalWeight = today.reduce((s, t) => s + Number(t.weight || 0), 0);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        matches(t, filter) &&
        (!q ||
          t.farmer_name.toLowerCase().includes(q) ||
          t.transaction_id.toLowerCase().includes(q) ||
          (t.farmer_fpo_id ?? "").toLowerCase().includes(q)),
    );
  }, [transactions, filter, query]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Today's Transactions</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            <span className="font-bold text-foreground tabular">{today.length}</span> deliveries ·{" "}
            <span className="font-bold text-foreground tabular">{formatWeight(totalWeight)} kg</span>{" "}
            collected
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute inset-y-0 left-4 my-auto size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farmer, FPO ID or transaction ID"
            aria-label="Search transactions"
            className="h-13 rounded-2xl pl-12"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {transactionsLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-3xl" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={filter === "Sync Pending" ? CheckCircle2 : Package}
            title={
              filter === "Sync Pending"
                ? "Everything is synchronized."
                : query
                  ? "No transactions match that search."
                  : "No transactions today."
            }
            description={
              filter === "Sync Pending"
                ? "Every transaction on this device has reached the backend."
                : "Records will appear here as soon as you complete a delivery."
            }
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {list.map((t) => (
              <TransactionCard key={t.transaction_id} txn={t} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
