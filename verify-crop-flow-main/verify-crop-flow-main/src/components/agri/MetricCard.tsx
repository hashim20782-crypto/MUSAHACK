import type { LucideIcon } from "lucide-react";
import { BadgeCheck, FileWarning, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function DecorativeBars() {
  return (
    <div className="flex h-11 items-end gap-1" aria-hidden="true">
      {[12, 20, 29, 40].map((h, i) => (
        <span
          key={i}
          className="w-2 rounded-full bg-leaf/25"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

const DECORATIONS = {
  bars: <DecorativeBars />,
  users: <Users className="size-8 text-leaf/35" strokeWidth={1.7} />,
  badge: (
    <BadgeCheck className="size-11 text-leaf/25" strokeWidth={1.7} />
  ),
  "file-warning": (
    <FileWarning className="size-10 text-leaf/25" strokeWidth={1.7} />
  ),
} as const;

export type MetricDecoration = keyof typeof DECORATIONS;

export function MetricCard({
  label,
  value,
  unit,
  subtitle,
  icon: Icon,
  decoration,
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  decoration: MetricDecoration;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-40 overflow-hidden rounded-3xl border border-border bg-kpi p-4 shadow-card sm:min-h-44 sm:p-5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary sm:size-11">
          <Icon className="size-5 sm:size-[22px]" aria-hidden="true" />
        </span>
        <p className="min-w-0 text-xs font-bold uppercase leading-tight text-primary sm:text-sm">
          {label}
        </p>
      </div>

      <p className="mt-4 text-[2.25rem] font-bold leading-none tabular-nums text-primary sm:text-[2.75rem]">
        {value}
        {unit ? (
          <span className="ml-1 text-sm font-semibold text-primary sm:text-base">
            {unit}
          </span>
        ) : null}
      </p>
      {subtitle ? (
        <p className="mt-2 max-w-[calc(100%-3.25rem)] text-xs font-medium leading-tight text-muted-foreground sm:text-sm">
          {subtitle}
        </p>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute bottom-3 right-3 grid size-11 select-none place-items-center sm:bottom-4 sm:right-4",
          decoration === "users" && "rounded-full bg-secondary/80",
        )}
        aria-hidden="true"
      >
        {DECORATIONS[decoration]}
      </div>
    </div>
  );
}
