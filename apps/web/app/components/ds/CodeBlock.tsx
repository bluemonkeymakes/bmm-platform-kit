import { CopyButton } from "~/components/ds/CopyButton";
import { cn } from "~/lib/utils";

interface CodeBlockProps {
  code: string;
  /** Optional caption above the block (e.g. a filename or usage note). */
  label?: string;
  className?: string;
}

/**
 * Monospace snippet block with a copy affordance. DS-only — not a production
 * component. Intentionally unstyled syntax (no highlighter dependency); the
 * design system documents intent, not a live editor.
 */
export function CodeBlock({ code, label, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-100/40">
        <span className="text-2xs font-inconsolata uppercase tracking-wider text-neutral-500">
          {label ?? "Usage"}
        </span>
        <CopyButton value={code} label="code snippet" />
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed font-inconsolata text-neutral-800 scrollbar-app">
        <code>{code}</code>
      </pre>
    </div>
  );
}
