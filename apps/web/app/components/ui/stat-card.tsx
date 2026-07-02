import * as React from "react";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export interface StatCardProps extends React.ComponentProps<"div"> {
  label: string;
  value: string;
  icon?: LucideIcon;
  /** Percentage change. Sign drives the arrow + success/destructive color. */
  delta?: number;
  deltaLabel?: string;
}

/** A single KPI: label, big value, optional trend delta. Rests at `raised`. */
export function StatCard({
  label,
  value,
  icon: Glyph,
  delta,
  deltaLabel,
  className,
  ...props
}: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn("rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-raised", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="font-inconsolata text-xs font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        {Glyph && <Glyph className="size-4 text-neutral-400" />}
      </div>
      <p className="mt-2 font-display text-3xl font-medium tabular-nums text-neutral-800">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
            up ? "text-success-600" : "text-destructive"
          )}
        >
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta)}%{deltaLabel && <span className="font-normal text-neutral-500"> {deltaLabel}</span>}
        </p>
      )}
    </div>
  );
}
