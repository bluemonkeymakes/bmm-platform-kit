import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";

export interface Rule {
  pass: boolean;
  text: string;
}

/**
 * A single do/don't guidance line — green check for recommended usage,
 * red cross for anti-patterns. Shared across every component page.
 */
export function RuleRow({ pass, children }: { pass: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {pass ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-success-500 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-destructive-500 shrink-0 mt-0.5" />
      )}
      <span className={cn("text-xs", pass ? "text-success-700" : "text-destructive-700")}>
        {children}
      </span>
    </div>
  );
}

function RuleColumn({ kind, rules }: { kind: "do" | "dont"; rules: readonly Rule[] }) {
  if (rules.length === 0) return null;
  const isDo = kind === "do";
  return (
    <div className="space-y-1.5">
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-inconsolata font-medium uppercase tracking-wider",
          // no dark: overrides — the inverted dark scale already lightens 600
          isDo ? "text-success-600" : "text-destructive-600",
        )}
      >
        {isDo ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        {isDo ? "Do" : "Don't"}
      </p>
      <div className="space-y-1.5">
        {rules.map((r) => (
          <RuleRow key={r.text} pass={r.pass}>
            {r.text}
          </RuleRow>
        ))}
      </div>
    </div>
  );
}

/**
 * The standard do/don't block — grouped into a green Do column and a red Don't
 * column (not interleaved in source order). Rules can be listed in any order.
 */
export function RuleList({ rules }: { rules: readonly Rule[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-1">
      <RuleColumn kind="do" rules={rules.filter((r) => r.pass)} />
      <RuleColumn kind="dont" rules={rules.filter((r) => !r.pass)} />
    </div>
  );
}
