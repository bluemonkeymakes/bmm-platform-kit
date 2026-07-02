import type { MetaFunction } from "react-router";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Download,
  ExternalLink,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Icon } from "~/components/ui/icon";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Icons" };

export const meta: MetaFunction = () => [
  { title: "Icons | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const iconSizes = [
  { size: "xs", cls: "size-4", px: "16px" },
  { size: "sm", cls: "size-5", px: "20px" },
  { size: "md", cls: "size-6", px: "24px" },
  { size: "lg", cls: "size-8", px: "32px" },
] as const;

const rawSizes = [
  { cls: "size-3", rem: "0.75rem", use: "Inside badges, xs chips, inline meta" },
  { cls: "size-3.5", rem: "0.875rem", use: "Rule rows, dense list affordances" },
  { cls: "size-4", rem: "1rem", use: "Default — buttons, inputs, nav (auto-applied in Button)" },
  { cls: "size-5", rem: "1.25rem", use: "Section headers, standalone actions" },
  { cls: "size-6", rem: "1.5rem", use: "Feature callouts, empty states" },
];

const lucideSet = [
  { Glyph: Search, name: "Search" },
  { Glyph: ArrowRight, name: "ArrowRight" },
  { Glyph: Check, name: "Check" },
  { Glyph: Plus, name: "Plus" },
  { Glyph: Settings, name: "Settings" },
  { Glyph: Trash2, name: "Trash2" },
  { Glyph: Mail, name: "Mail" },
  { Glyph: Calendar, name: "Calendar" },
  { Glyph: Bell, name: "Bell" },
  { Glyph: Download, name: "Download" },
  { Glyph: ExternalLink, name: "ExternalLink" },
  { Glyph: Menu, name: "Menu" },
];

export default function FoundationsIcons() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Icons</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          One library, one job. <code className="font-inconsolata text-primary">lucide-react</code> is
          the UI set — consistent 2px stroke, sized with Tailwind{" "}
          <code className="font-inconsolata text-primary">size-*</code> utilities or, for standalone
          icons, the <code className="font-inconsolata text-primary">Icon</code> wrapper. Color always
          inherits via <code className="font-inconsolata">currentColor</code>.
        </p>
      </div>

      {/* Icon component */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">The Icon Component</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          For a standalone icon, the <code className="font-inconsolata text-primary">Icon</code> wrapper
          caps sizing to four presets (16 / 20 / 24 / 32) so icons stay on a rhythm — constraint over a
          free <code className="font-inconsolata">size-*</code> choice. Icons inside Button and Input are
          auto-sized; reach for <code className="font-inconsolata text-primary">Icon</code> when one
          stands on its own. It renders <code className="font-inconsolata">aria-hidden</code> by default
          — decorative unless you say otherwise.
        </p>
        <DualPreview label='size="xs" | "sm" (default) | "md" | "lg"' align="center" minHeight="6rem">
          <div className="flex items-end gap-8">
            {iconSizes.map(({ size, cls, px }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Icon icon={Bell} size={size} className="text-primary" />
                <span className="text-xs font-inconsolata text-neutral-800">{size}</span>
                <span className="text-2xs font-inconsolata text-neutral-500">
                  {cls} · {px}
                </span>
              </div>
            ))}
          </div>
        </DualPreview>
        <CodeBlock
          code={`import { Icon } from "~/components/ui/icon";
import { Bell } from "lucide-react";

<Icon icon={Bell} size="md" className="text-primary" />`}
        />
      </section>

      {/* Raw sizing */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Raw Sizing</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          When an icon sits inside a component slot, size it with{" "}
          <code className="font-inconsolata text-primary">size-*</code> (rem-based), never width/height
          in px. Icons inherit <code className="font-inconsolata">currentColor</code>, so color comes
          from text utilities.
        </p>
        <DualPreview label="size-3 → size-6" align="center" minHeight="6rem">
          <div className="flex items-end gap-8">
            {rawSizes.map(({ cls, rem, use }) => (
              <div key={cls} className="flex flex-col items-center gap-2" title={use}>
                <Bell aria-hidden className={`${cls} text-primary`} />
                <span className="text-xs font-inconsolata text-neutral-800">{cls}</span>
                <span className="text-2xs text-neutral-500">{rem}</span>
              </div>
            ))}
          </div>
        </DualPreview>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-200">
              {rawSizes.map(({ cls, rem, use }) => (
                <tr key={cls} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2 font-inconsolata text-xs text-primary w-24">{cls}</td>
                  <td className="px-4 py-2 font-inconsolata text-xs text-neutral-500 w-24">{rem}</td>
                  <td className="px-4 py-2 text-xs text-neutral-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lucide set */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">UI Icons — lucide-react</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          A sample of the working set. Import the specific glyph — the library is tree-shakeable, so
          only what you import ships.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {lucideSet.map(({ Glyph, name }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 py-4 hover:border-primary/30 transition-colors"
            >
              <Glyph aria-hidden className="size-5 text-neutral-800" />
              <span className="text-2xs font-inconsolata text-neutral-500">{name}</span>
            </div>
          ))}
        </div>
        <CodeBlock
          code={`import { Search } from "lucide-react";

<Search className="size-4 text-neutral-500" />`}
        />
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Guidance</h3>
        <RuleList
          rules={[
            { pass: true, text: "Use lucide for all interface icons — one consistent stroke weight" },
            { pass: true, text: "Standalone icons go through Icon; slotted icons use size-* utilities" },
            { pass: true, text: "Let color inherit via currentColor — set it with a text-* utility" },
            { pass: true, text: "Meaningful icons need an accessible name (aria-label on the interactive parent)" },
            { pass: false, text: "Don't set px width/height — breaks the rem sizing system" },
            { pass: false, text: "Don't mix icon libraries in the same inline row — stroke weights clash" },
            { pass: false, text: "Don't hard-code an icon color — it won't follow dark mode" },
          ]}
        />
      </section>
    </div>
  );
}
