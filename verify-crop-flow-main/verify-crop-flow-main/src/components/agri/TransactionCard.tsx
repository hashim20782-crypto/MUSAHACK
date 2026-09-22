import { Link } from "@tanstack/react-router";
import { ChevronRight, CloudOff, Scale } from "lucide-react";

import { formatKg, formatTime, type Transaction } from "@/lib/agri";
import { GradeChip, TransactionStatus } from "./StatusPill";

export function TransactionCard({ txn }: { txn: Transaction }) {
  return (
    <Link
      to="/transactions/$id"
      params={{ id: txn.transaction_id }}
      className="surface-card block p-4 transition-shadow hover:shadow-lift focus-visible:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{txn.farmer_name}</p>
          <p className="label-meta mt-0.5 truncate">{txn.transaction_id}</p>
        </div>
        <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-lg font-bold tabular">
          <Scale className="size-4 text-muted-foreground" aria-hidden="true" />
          {formatKg(txn.weight)}
        </span>
        <GradeChip grade={txn.grade} />
        <span className="text-sm text-muted-foreground">{txn.crop_type}</span>
        <span className="ml-auto text-sm font-medium text-muted-foreground tabular">
          {formatTime(txn.created_at)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TransactionStatus status={txn.status} sync={txn.sync_status} />
        {txn.sync_status !== "SYNCED" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <CloudOff className="size-3.5" aria-hidden="true" />
            Saved on this device
          </span>
        ) : null}
      </div>
    </Link>
  );
}
