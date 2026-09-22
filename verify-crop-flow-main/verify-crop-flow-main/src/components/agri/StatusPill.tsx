import { AlertTriangle, CheckCircle2, CloudOff, Lock, RefreshCw, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionState } from "@/hooks/useConnection";
import { statusMeta, type SyncStatus, type TxnStatus } from "@/lib/agri";

const TONE: Record<string, string> = {
  success: "bg-success-surface text-primary border-success/30",
  pending: "bg-pending-surface text-pending-foreground border-pending/40",
  danger: "bg-danger-surface text-destructive border-destructive/30",
  neutral: "bg-secondary text-secondary-foreground border-border",
};

/** Transaction status chip — never colour alone, always with an icon + words. */
export function TransactionStatus({
  status,
  sync,
  className,
}: {
  status: TxnStatus;
  sync?: SyncStatus;
  className?: string;
}) {
  const meta = statusMeta(status, sync);
  const Icon =
    meta.tone === "success" ? Lock : meta.tone === "danger" ? AlertTriangle : RefreshCw;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        TONE[meta.tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

const CONN: Record<ConnectionState, { cls: string; Icon: typeof Wifi }> = {
  online: { cls: "bg-success-surface text-primary border-success/30", Icon: CheckCircle2 },
  offline: { cls: "bg-danger-surface text-destructive border-destructive/30", Icon: CloudOff },
  syncing: { cls: "bg-pending-surface text-pending-foreground border-pending/40", Icon: RefreshCw },
  error: { cls: "bg-danger-surface text-destructive border-destructive/30", Icon: AlertTriangle },
};

export function ConnectionPill({
  state,
  label,
  className,
  glass,
}: {
  state: ConnectionState;
  label: string;
  className?: string;
  glass?: boolean;
}) {
  const { cls, Icon } = CONN[state];
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
        glass ? "glass text-white" : cls,
        className,
      )}
    >
      <Icon
        className={cn("size-3.5", state === "syncing" && "animate-spin")}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export function GradeChip({ grade, className }: { grade: string; className?: string }) {
  const tone =
    grade === "A"
      ? "bg-success-surface text-primary border-success/30"
      : grade === "B"
        ? "bg-pending-surface text-pending-foreground border-pending/40"
        : "bg-danger-surface text-destructive border-destructive/30";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold tracking-wide",
        tone,
        className,
      )}
    >
      GRADE {grade}
    </span>
  );
}
