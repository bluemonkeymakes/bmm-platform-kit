import * as React from "react";
import { cn } from "~/lib/utils";

/** Data table primitives. Token-pure: surfaces from the neutral scale, header
 *  in the inconsolata label voice. Wrap in `<Table>` for the bordered, scrollable shell. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-neutral-200">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("bg-neutral-100/60 [&_tr]:border-b [&_tr]:border-neutral-200", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-neutral-200", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("border-t border-neutral-200 bg-neutral-100/60 font-medium text-neutral-800", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-neutral-100/40 data-[state=selected]:bg-primary/5",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-4 text-left align-middle font-inconsolata text-xs font-medium uppercase tracking-wider text-neutral-500",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle text-neutral-700", className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("mt-3 text-xs text-neutral-500", className)} {...props} />;
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
