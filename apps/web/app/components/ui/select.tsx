import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

/**
 * Native select styled to the field contract (extracted from the DS input
 * bundle). Self-contained CVA — the kit's Input stays untouched.
 */
const selectFieldVariants = cva(
  "flex w-full rounded-md border border-neutral-200 bg-neutral-50 text-neutral-800 shadow-raised transition-[color,box-shadow] placeholder:text-neutral-500/70 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-2.5 text-xs",
        default: "h-9 px-3 text-sm",
        lg: "h-10 px-3.5 text-base",
      },
    },
    defaultVariants: { inputSize: "default" },
  }
);

export interface SelectProps
  extends Omit<React.ComponentProps<"select">, "size">,
    VariantProps<typeof selectFieldVariants> {}

export function Select({ className, inputSize, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(selectFieldVariants({ inputSize }), "appearance-none pr-8", className)}
        {...props}
      >
        {children}
      </select>
      {/* Chevron follows the neutral token (dark-aware), not a hard-coded color. */}
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}

export { selectFieldVariants };
