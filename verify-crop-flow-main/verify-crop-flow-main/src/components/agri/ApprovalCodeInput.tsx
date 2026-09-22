import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Four separate boxes: digit entry, paste, backspace, auto-focus. */
export function ApprovalCodeInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!disabled) refs.current[Math.min(value.length, 3)]?.focus();
  }, [value.length, disabled]);

  function setDigit(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const chars = value.padEnd(4, " ").split("");
    for (let i = 0; i < digits.length && index + i < 4; i++) {
      chars[index + i] = digits[i]!;
    }
    onChange(chars.join("").replace(/ /g, "").slice(0, 4));
  }

  return (
    <div className="flex gap-3" role="group" aria-label="Farmer approval code">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          disabled={disabled}
          aria-label={`Approval code digit ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              onChange(value.slice(0, Math.max(0, value.length - 1)));
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            setDigit(0, e.clipboardData.getData("text"));
          }}
          className={cn(
            "h-16 w-14 rounded-2xl border-2 bg-card text-center text-3xl font-bold tabular sm:h-20 sm:w-16",
            invalid ? "border-destructive text-destructive" : "border-border",
            "disabled:opacity-50",
          )}
        />
      ))}
    </div>
  );
}
