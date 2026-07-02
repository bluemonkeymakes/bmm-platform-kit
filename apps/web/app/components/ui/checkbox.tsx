import * as React from "react";
import { cn } from "~/lib/utils";

export interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {}

/** Native checkbox on the field contract (extracted from the DS input bundle). */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 rounded border-neutral-200 text-primary shadow-raised transition-shadow outline-none accent-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
