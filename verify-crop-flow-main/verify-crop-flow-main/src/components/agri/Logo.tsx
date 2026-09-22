import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  subtitle = "Operator Portal",
  tone = "light",
}: {
  className?: string;
  subtitle?: string | null;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl",
          tone === "light" ? "bg-primary text-primary-foreground" : "glass text-white",
        )}
        aria-hidden="true"
      >
        <Sprout className="size-6" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block text-lg leading-tight font-bold tracking-tight",
            tone === "dark" && "text-white",
          )}
        >
          AgriTrust
        </span>
        {subtitle ? (
          <span
            className={cn(
              "block text-xs font-medium",
              tone === "dark" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  );
}
