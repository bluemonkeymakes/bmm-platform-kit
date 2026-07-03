import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface SpecimenSectionProps {
  title: ReactNode;
  /**
   * Optional colored dot before the title — pass a color token class
   * (e.g. "bg-primary", "bg-success-500") or `true` for the brand primary.
   */
  dot?: string | boolean;
  children: ReactNode;
  /** Merged over the default `space-y-4` rhythm (e.g. "space-y-6"). */
  className?: string;
}

/**
 * A titled specimen block on a doc page — the standard h3 heading (with an
 * optional color-dot prefix) wrapping its content in the shared vertical
 * rhythm. Shared across every component / foundation / pattern page.
 */
export function SpecimenSection({ title, dot, children, className }: SpecimenSectionProps) {
  const heading = <h3 className="text-base font-medium font-display text-neutral-800">{title}</h3>;
  return (
    <section className={cn("space-y-4", className)}>
      {dot ? (
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", dot === true ? "bg-primary" : dot)} />
          {heading}
        </div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}
