import * as React from "react";
import { cn } from "~/lib/utils";

/** Loading placeholder. Compose with width/height utilities (e.g. `h-4 w-32`).
 *  Pulses on the neutral surface so it's dark-aware. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-neutral-200", className)} {...props} />;
}
