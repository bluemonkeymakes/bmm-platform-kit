import { Link } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

/**
 * Wordmark — the single source for the brand mark in layout chrome.
 * Header uses `md`, Footer uses `sm`. Swap the text (or drop in an SVG)
 * here when the brand firms up; never restyle it at a call site.
 */
const wordmarkVariants = cva(
  "inline-block rounded-sm font-display font-normal tracking-tight transition-opacity duration-200 hover:opacity-70 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-xl",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface WordmarkProps extends VariantProps<typeof wordmarkVariants> {
  className?: string;
}

export function Wordmark({ size, className }: WordmarkProps) {
  return (
    <Link to="/" className={cn(wordmarkVariants({ size }), className)}>
      Starter
    </Link>
  );
}
