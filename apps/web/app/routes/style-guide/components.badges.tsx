import type { MetaFunction } from "react-router";
import { Badge } from "~/components/ui/badge";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Badges" };

export const meta: MetaFunction = () => [
  { title: "Badges | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const variants = [
  {
    variant: "default" as const,
    label: "Default",
    shortDesc: "Primary color. Featured, selected, active.",
    rules: [
      { pass: true, text: "Primary categorization — active states, featured, selected" },
      { pass: true, text: "Works on any surface; the primary fill is strong in both themes" },
      { pass: false, text: "Don't use for errors — use Destructive" },
    ],
  },
  {
    variant: "secondary" as const,
    label: "Secondary",
    shortDesc: "Neutral fill. Tags, metadata, counts.",
    rules: [
      { pass: true, text: "Tags, counts, non-urgent metadata alongside primary content" },
      { pass: true, text: "Safe to repeat — neutral weight won't compete for attention" },
      { pass: false, text: "Not for critical status — use Destructive for failures" },
    ],
  },
  {
    variant: "destructive" as const,
    label: "Destructive",
    shortDesc: "Error, blocked, critical.",
    rules: [
      { pass: true, text: "Error, blocked, failed, invalid — things that need immediate action" },
      { pass: true, text: "Reserve for critical status only; never purely decorative" },
      { pass: false, text: "Not for pending or draft states — use Secondary or Outline" },
    ],
  },
  {
    variant: "outline" as const,
    label: "Outline",
    shortDesc: "Minimal emphasis.",
    rules: [
      { pass: true, text: "When the badge must stay visually quiet — supplementary labels" },
      { pass: true, text: "Works on any background; safe choice when context color is unknown" },
      { pass: false, text: "Avoid when the status needs to stand out — use a filled variant" },
    ],
  },
] as const;

export default function ComponentsBadges() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Badges</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          CVA-based with four named variants. Rounded-full, text-xs, semibold — a compact status or
          category marker, never an interactive control.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Badge } from "~/components/ui/badge";

<Badge variant="secondary">Tutorial</Badge>`}
          />
        </div>
      </div>

      {/* Variants */}
      <section className="space-y-8">
        <h3 className="text-base font-medium font-display text-neutral-800">Variants</h3>
        {variants.map(({ variant, label, shortDesc, rules }) => (
          <div key={variant} className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-neutral-800">{label}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">{shortDesc}</p>
            </div>
            <DualPreview align="center" minHeight="3.5rem">
              <Badge variant={variant}>{label}</Badge>
            </DualPreview>
            <RuleList rules={rules} />
          </div>
        ))}
      </section>

      {/* In context */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">In Context</h3>
        <DualPreview label="Mixed variants in a data row">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="default">Featured</Badge>
            <Badge variant="secondary">Guide</Badge>
            <Badge variant="outline">directus</Badge>
            <Badge variant="outline">docker</Badge>
            <Badge variant="destructive">Deprecated</Badge>
          </div>
        </DualPreview>
      </section>

      {/* Usage reference table */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Usage Reference</h3>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Variant</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden sm:table-cell">Preview</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {variants.map(({ variant, label, rules }) => (
                <tr key={variant} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-3 font-inconsolata text-xs text-primary">{variant}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={variant}>{label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {rules.filter((r) => r.pass).map((r) => r.text).join(". ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RuleList
          rules={[
            { pass: true, text: "Badges label state or category — short, one or two words" },
            { pass: false, text: "Don't make a badge clickable — that's a Button or a Link" },
            { pass: false, text: "Don't restyle a badge at the call site — if a status color is missing, add a variant" },
          ]}
        />
      </section>
    </div>
  );
}
