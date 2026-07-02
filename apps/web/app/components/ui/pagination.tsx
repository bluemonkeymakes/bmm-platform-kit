import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/** Controlled pager with a compact window + ellipses. First, last, and the
 *  current ± 1 pages are always shown. */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const pages: (number | "ellipsis")[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || (p >= page - 1 && p <= page + 1)) pages.push(p);
    else if (pages[pages.length - 1] !== "ellipsis") pages.push("ellipsis");
  }

  const go = (p: number) => onPageChange?.(Math.min(pageCount, Math.max(1, p)));
  const base =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm outline-none transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        className={cn(base, "text-neutral-600 hover:bg-neutral-100")}
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex h-8 w-8 items-center justify-center text-neutral-400"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              base,
              p === page
                ? "bg-primary text-primary-foreground"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className={cn(base, "text-neutral-600 hover:bg-neutral-100")}
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
