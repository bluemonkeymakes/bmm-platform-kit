import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "~/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start [&>svg]:size-4 [&>svg]:mt-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        info: "bg-info-500/10 border-info-500/25 text-info-700 [&>svg]:text-info-500",
        success:
          "bg-success-500/10 border-success-500/20 text-success-700 [&>svg]:text-success-500",
        warning:
          "bg-warning-500/10 border-warning-500/30 text-warning-700 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400",
        error:
          "bg-destructive/10 border-destructive/25 text-destructive-700 [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "col-start-2 font-medium leading-snug tracking-tight text-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // no opacity softening — the 700-stop text is already muted, and 90%
        // pushed the warning variant under WCAG AA
        "col-start-2 text-sm leading-relaxed [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
