import type { LucideIcon } from "lucide-react";
import produceImage from "@/assets/produce.jpg";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  withImage = true,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  withImage?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      {withImage ? (
        <div className="relative h-36 sm:h-44">
          <img
            src={produceImage}
            alt="Harvested produce at a collection centre"
            loading="lazy"
            width={1408}
            height={912}
            className="size-full object-cover"
          />
          <div className="hero-scrim absolute inset-0" />
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        {action}
      </div>
    </div>
  );
}
