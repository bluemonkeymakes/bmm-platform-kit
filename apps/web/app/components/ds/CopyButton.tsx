import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useCopyToast } from "~/components/ds/CopyToast";
import { cn } from "~/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

/**
 * Click-to-copy control. Flashes an inline check and fires the shared
 * confirmation toast (labelled, since `value` may be a long snippet).
 */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { copy: copyToClipboard } = useCopyToast();

  async function copy() {
    const ok = await copyToClipboard(value, label);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${label ?? value}`}
      title={copied ? "Copied" : "Copy"}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-success-500" /> : <Copy className="size-3.5" />}
    </button>
  );
}
