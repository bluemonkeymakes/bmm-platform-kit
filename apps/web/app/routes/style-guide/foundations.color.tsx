import type { MetaFunction } from "react-router";
import { ScaleRow, TokenSwatch } from "~/components/ds/TokenSwatch";
import { RuleList } from "~/components/ds/RuleRow";

export const handle = { title: "Color" };

export const meta: MetaFunction = () => [
  { title: "Color | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const neutralStops = [
  { stop: "50",  variable: "--neutral-50",  use: "Page + card background, subtlest fill" },
  { stop: "100", variable: "--neutral-100", use: "Subtle fill, hover, sidebar" },
  { stop: "200", variable: "--neutral-200", use: "Borders, dividers, inputs" },
  { stop: "300", variable: "--neutral-300", use: "Disabled fill, strong border" },
  { stop: "400", variable: "--neutral-400", use: "Placeholder text, disabled icon" },
  { stop: "500", variable: "--neutral-500", use: "Muted / caption text — AA on white" },
  { stop: "600", variable: "--neutral-600", use: "Secondary body text" },
  { stop: "700", variable: "--neutral-700", use: "Emphasized body text" },
  { stop: "800", variable: "--neutral-800", use: "Body text, headings" },
  { stop: "900", variable: "--neutral-900", use: "Max contrast, darkest surface" },
];

const primaryStops = [
  { stop: "50",  variable: "--primary-50",  use: "Tinted background, selected row" },
  { stop: "100", variable: "--primary-100", use: "Hover state on light surfaces" },
  { stop: "200", variable: "--primary-200", use: "Disabled state, faint border" },
  { stop: "300", variable: "--primary-300", use: "Icon on light bg" },
  { stop: "400", variable: "--primary-400", use: "Secondary interactive" },
  { stop: "500", variable: "--primary-500", use: "Mid-tone brand fill" },
  { stop: "600", variable: "--primary-600", use: "Hover for 700" },
  { stop: "700", variable: "--primary-700", use: "Strong brand fill" },
  { stop: "800", variable: "--primary-800", use: "Base value in light mode" },
  { stop: "900", variable: "--primary-900", use: "Dark section background" },
];

const accentStops = [
  { stop: "50",  variable: "--accent-50",  use: "Tinted accent background" },
  { stop: "100", variable: "--accent-100", use: "Hover on accent surface" },
  { stop: "200", variable: "--accent-200", use: "Accent border, divider" },
  { stop: "300", variable: "--accent-300", use: "Lighter interactive accent" },
  { stop: "400", variable: "--accent-400", use: "Bright interactive accent" },
  { stop: "500", variable: "--accent-500", use: "Near-base accent" },
  { stop: "600", variable: "--accent-600", use: "Accent text on light bg" },
  { stop: "700", variable: "--accent-700", use: "Dark accent text" },
  { stop: "800", variable: "--accent-800", use: "Near-black accent" },
  { stop: "900", variable: "--accent-900", use: "Deepest accent" },
];

function feedbackStops(token: string, hue: string) {
  return [
    { stop: "50",  variable: `--${token}-50`,  use: `${hue} background tint` },
    { stop: "100", variable: `--${token}-100`, use: `${hue} hover` },
    { stop: "200", variable: `--${token}-200`, use: `${hue} border` },
    { stop: "300", variable: `--${token}-300`, use: `${hue} icon on light` },
    { stop: "400", variable: `--${token}-400`, use: `${hue} interactive` },
    { stop: "500", variable: `--${token}-500`, use: `Base --${token}` },
    { stop: "600", variable: `--${token}-600`, use: "Hover / pressed" },
    { stop: "700", variable: `--${token}-700`, use: `${hue} text on light tint` },
    { stop: "800", variable: `--${token}-800`, use: `Near-black ${hue.toLowerCase()}` },
    { stop: "900", variable: `--${token}-900`, use: `Deepest ${hue.toLowerCase()}` },
  ];
}

const feedback = [
  { name: "Info / Blue", token: "info", desc: "Neutral, non-blocking information and tips. A distinct blue — never the brand primary." },
  { name: "Success / Teal", token: "success", desc: "Positive states, confirmations, completion." },
  { name: "Warning / Amber", token: "warning", desc: "Attention needed, degraded or expiring — not a failure." },
  { name: "Destructive / Red", token: "destructive", desc: "Failures, destructive actions, validation errors." },
];

const rolePairs = [
  { base: "--primary", fg: "--primary-foreground", cls: "bg-primary text-primary-foreground", note: "Default buttons, nav active. Slate navy that inverts to near-white in dark." },
  { base: "--accent", fg: "--accent-foreground", cls: "bg-accent text-accent-foreground", note: "Blue accent — links-adjacent highlights, focus ring source in dark." },
  { base: "--info", fg: "--info-foreground", cls: "bg-info text-info-foreground", note: "Informational callouts and toasts." },
  { base: "--success", fg: "--success-foreground", cls: "bg-success text-success-foreground", note: "Confirmations, published/live status." },
  { base: "--warning", fg: "--warning-foreground", cls: "bg-warning text-warning-foreground", note: "Pending / degraded. Dark text on amber — never white." },
  { base: "--destructive", fg: "--destructive-foreground", cls: "bg-destructive text-destructive-foreground", note: "Destructive buttons, form errors." },
];

const surfaceRoles = [
  { role: "Page background", cls: "bg-neutral-50" },
  { role: "Card / raised surface", cls: "bg-neutral-50 + border-neutral-200 + shadow-raised" },
  { role: "Subtle fill / hover / sidebar", cls: "bg-neutral-100" },
  { role: "Border / divider / input", cls: "border-neutral-200" },
  { role: "Muted / caption / placeholder", cls: "text-neutral-500" },
  { role: "Body text / headings", cls: "text-neutral-800" },
];

export default function FoundationsColor() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-14">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Color System</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Three layers. <strong className="text-neutral-800 font-medium">Neutral</strong> is the grayscale
          backbone every surface is built from. <strong className="text-neutral-800 font-medium">Brand</strong>{" "}
          (primary + accent) is this kit's swap surface. <strong className="text-neutral-800 font-medium">Feedback</strong>{" "}
          carries fixed semantic meaning. All values are HSL custom properties in{" "}
          <code className="font-inconsolata text-primary">app/brand/brand.css</code>, consumed as Tailwind
          utilities — click any swatch to copy its <code className="font-inconsolata text-primary">var()</code>.
          Dark mode redefines every scale under <code className="font-inconsolata text-primary">.dark</code>,
          with neutral inverted (50 darkest → 900 lightest).
        </p>
      </div>

      {/* ─────────── NEUTRAL ─────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-neutral-500" />
          <h3 className="text-base font-medium font-display text-neutral-800">Neutral — the backbone</h3>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl">
          A cool slate gray. Backgrounds, text, borders, and disabled states all draw from this one scale.
          It inverts automatically in dark mode, so{" "}
          <code className="font-inconsolata text-primary">bg-neutral-100</code> always reads as "subtle fill".
        </p>
        <ScaleRow name="Neutral scale" stops={neutralStops} />

        <div className="pt-2">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider font-inconsolata mb-2">
            Surface roles → neutral stop
          </p>
          <p className="text-xs text-neutral-500 max-w-2xl mb-3">
            There are no <code className="font-inconsolata">bg-background</code> /{" "}
            <code className="font-inconsolata">bg-card</code> / <code className="font-inconsolata">bg-muted</code>{" "}
            alias utilities. Components apply the neutral stop directly — the inverted scale gives dark mode
            for free.
          </p>
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-neutral-200">
                {surfaceRoles.map(({ role, cls }) => (
                  <tr key={role} className="hover:bg-neutral-100/40 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-neutral-800">{role}</td>
                    <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────── BRAND ─────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <h3 className="text-base font-medium font-display text-neutral-800">Brand — swap per project</h3>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl -mt-2">
          The only layer that changes between sites. A rebrand overrides primary and accent in{" "}
          <code className="font-inconsolata text-primary">app/brand/brand.css</code>; neutral and feedback
          stay put. This kit ships a slate-navy primary (near-white in dark mode) and a blue accent.
        </p>
        <div>
          <h4 className="text-sm font-medium text-neutral-800 mb-1">Primary / Slate navy</h4>
          <p className="text-xs text-neutral-500 mb-3">
            Dominant brand color — default buttons, links, nav active. The base{" "}
            <code className="font-inconsolata">--primary</code> inverts to near-white in dark mode.
          </p>
          <ScaleRow name="Primary scale" stops={primaryStops} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-800 mb-1">Accent / Blue</h4>
          <p className="text-xs text-neutral-500 mb-3">
            Supporting hue for highlights and emphasis. In dark mode it also seeds the focus ring.
          </p>
          <ScaleRow name="Accent scale" stops={accentStops} />
        </div>
      </section>

      {/* ─────────── FEEDBACK ─────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success-500" />
          <h3 className="text-base font-medium font-display text-neutral-800">Feedback — fixed meaning</h3>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl -mt-2">
          Semantic states for alerts, toasts, badges, and form validation. Kept deliberately separate from
          brand — an info message uses <code className="font-inconsolata text-primary">--info</code>, never
          the brand primary, so "red means error" is never relearned.
        </p>
        {feedback.map(({ name, token, desc }) => (
          <div key={token}>
            <h4 className="text-sm font-medium text-neutral-800 mb-1">{name}</h4>
            <p className="text-xs text-neutral-500 mb-3">{desc}</p>
            <ScaleRow name={`--${token} scale`} stops={feedbackStops(token, name.split(" / ")[0])} />
          </div>
        ))}
      </section>

      {/* ─────────── ROLE PAIRS ─────────── */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Base + Foreground Pairs</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Each semantic role ships a base and a matching <code className="font-inconsolata">-foreground</code>{" "}
          for text on that fill. Use them together — never guess a text color for a colored surface.
        </p>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Pair</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Preview</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden md:table-cell">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {rolePairs.map(({ base, fg, cls, note }) => (
                <tr key={base} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-neutral-800">
                    {base} <span className="text-neutral-500">/ {fg}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${cls}`}>
                      Aa
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 hidden md:table-cell">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────── RING ─────────── */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Focus Ring</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          One brand-level token drives every focus indicator via{" "}
          <code className="font-inconsolata text-primary">focus-visible:ring-ring</code>. Navy in light mode,
          bright accent blue in dark so it stays visible on dark surfaces.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md">
          <TokenSwatch variable="--ring" label="ring" />
        </div>
      </section>

      {/* ─────────── RULES ─────────── */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Pick a stop from a named scale — bg-neutral-100, text-success-700, border-destructive" },
            { pass: true, text: "Trust the inverted scales for dark mode — the same class works in both themes" },
            { pass: true, text: "Pair a colored fill with its -foreground token for text" },
            { pass: false, text: "No hex or hsl() literals in components or routes — values live only in brand.css" },
            { pass: false, text: "No alias tokens (bg-background, bg-card, bg-muted) — they no longer exist" },
            { pass: false, text: "No arbitrary color values — add a stop to the scale instead" },
          ]}
        />
      </section>
    </div>
  );
}
