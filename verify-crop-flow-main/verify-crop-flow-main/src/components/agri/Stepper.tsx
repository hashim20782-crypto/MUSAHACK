import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WORKFLOW_STEPS = ["Farmer", "Weigh", "Audit", "Approve"] as const;

/** WHERE AM I? — always visible during the delivery workflow. */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Delivery progress">
      {WORKFLOW_STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-col items-center gap-1.5">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "grid size-8 place-items-center rounded-full border-2 text-xs font-bold tabular transition-colors sm:size-9",
                  done && "border-success bg-success text-primary-foreground",
                  active && "border-primary bg-primary text-primary-foreground",
                  !done && !active && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  `0${i + 1}`
                )}
              </span>
              <span
                className={cn(
                  "truncate text-[11px] font-semibold tracking-wide uppercase sm:text-xs",
                  active || done ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              <span className="sr-only">
                {done ? "completed" : active ? "current step" : "upcoming"}
              </span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "mb-5 h-0.5 flex-1 rounded-full",
                  i < current ? "bg-success" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
