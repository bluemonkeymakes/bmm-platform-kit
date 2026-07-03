import { ChevronRight } from "lucide-react";
import type * as React from "react";
import { cn } from "~/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.ComponentProps<"nav"> {
  items: Crumb[];
}

/** Location trail. The last item is the current page (no link, emphasized). */
export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a trail is positional by definition — items never reorder, and labels may legitimately repeat
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <a
                  href={item.href}
                  className="text-neutral-500 transition-colors hover:text-neutral-800"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(last ? "font-medium text-neutral-800" : "text-neutral-500")}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 text-neutral-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
