import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;

/**
 * Custom weight keypad — the field keyboard is unreliable with gloves and
 * one-handed use, so the app ships its own large-target pad.
 */
export function NumericKeypad({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  function press(key: string) {
    if (key === "back") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (value.includes(".")) return;
      onChange(value === "" ? "0." : `${value}.`);
      return;
    }
    // one decimal point, max two decimals, no leading zero runs
    const [, decimals] = value.split(".");
    if (decimals !== undefined && decimals.length >= 2) return;
    const next = value === "0" ? key : `${value}${key}`;
    if (Number(next) > 5000) return;
    onChange(next);
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2.5", className)}>
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => press(key)}
          aria-label={key === "back" ? "Delete last digit" : `Enter ${key}`}
          className={cn(
            "flex h-16 items-center justify-center rounded-2xl border text-2xl font-semibold tabular transition-[transform,background-color] active:scale-[0.97]",
            key === "back"
              ? "border-border bg-secondary text-primary"
              : "border-border bg-card hover:bg-secondary",
          )}
        >
          {key === "back" ? <Delete className="size-6" aria-hidden="true" /> : key}
        </button>
      ))}
    </div>
  );
}
