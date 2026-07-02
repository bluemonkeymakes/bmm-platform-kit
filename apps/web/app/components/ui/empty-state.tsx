import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/** The "nothing here yet" surface: icon + title + reason + a way forward. */
export function EmptyState({
  icon: Glyph,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {Glyph && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <Glyph className="size-6" />
        </span>
      )}
      <p className="font-display text-base font-medium text-neutral-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
