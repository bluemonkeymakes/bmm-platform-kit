import type { MetaFunction } from "react-router";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";

export const handle = { title: "Elevation" };

export const meta: MetaFunction = () => [
  { title: "Elevation | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

// Three roles, not a ramp. A surface is on the page, floating above it, or
// commanding it. There is deliberately no in-between step to "tune".
const levels = [
  {
    name: "raised",
    cls: "shadow-raised",
    use: "Sits on the page",
    eg: "Cards, inputs, the CTA button at rest",
  },
  {
    name: "overlay",
    cls: "shadow-overlay",
    use: "Floats above content",
    eg: "Dropdown, tooltip, toast, hover lift",
  },
  {
    name: "modal",
    cls: "shadow-modal",
    use: "Commands the screen",
    eg: "Dialog, command palette",
  },
];

export default function FoundationsElevation() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Elevation</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Three roles, not a seven-step ramp. Elevation is chosen by intent — is this surface{" "}
          <em>on</em> the page, <em>floating above</em> it, or <em>commanding</em> it — never by picking a
          size that looks about right. The default Tailwind shadow ramp (shadow-sm … shadow-2xl) is cleared
          by <code className="font-inconsolata text-primary">app/system/theme.css</code>; values live in{" "}
          <code className="font-inconsolata text-primary">app/brand/brand.css</code> so a rebrand re-skins
          all three at once.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">The Three Levels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {levels.map(({ name, cls, use, eg }) => (
            <div key={name} className="flex flex-col items-center gap-4">
              <div className={`size-24 rounded-xl bg-neutral-50 border border-neutral-200/40 ${cls}`} />
              <div className="text-center">
                <p className="text-sm font-medium font-inconsolata text-neutral-800">{cls}</p>
                <p className="text-xs text-neutral-700 mt-1">{use}</p>
                <p className="text-2xs text-neutral-500 mt-1 leading-tight">{eg}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Choosing by Intent</h3>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Token</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Intent</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden md:table-cell">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {levels.map(({ cls, use, eg }) => (
                <tr key={cls} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{cls}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-800">{use}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 hidden md:table-cell">{eg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Light vs Dark</h3>
        <p className="text-xs text-neutral-500">
          The same <code className="font-inconsolata text-primary">shadow-overlay</code> card in the active
          theme. Dark surfaces get a deeper cast (defined in the brand layer) plus the border doing the
          separating work — toggle the site theme to compare.
        </p>
        <DualPreview align="center" minHeight="8rem">
          <div className="size-24 rounded-xl bg-neutral-50 border border-neutral-200 shadow-overlay" />
        </DualPreview>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Interactive Lift</h3>
        <p className="text-xs text-neutral-500">
          Interactive surfaces rest at <code className="font-inconsolata text-primary">raised</code> and rise
          to <code className="font-inconsolata text-primary">overlay</code> on hover. Hover the cards below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-neutral-50 border border-neutral-200 shadow-raised p-5 transition-all hover:shadow-overlay hover:-translate-y-0.5 hover:border-primary/30 cursor-pointer"
            >
              <p className="text-sm font-medium text-neutral-800">Hover card {i}</p>
              <p className="text-xs text-neutral-500 mt-1">raised → overlay</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Pick by intent — on the page (raised), above it (overlay), commanding it (modal)" },
            { pass: true, text: "Pair a shadow with border-neutral-200 — in dark mode the border does most of the separating" },
            { pass: true, text: "Hover lift goes raised → overlay, one step, with -translate-y-0.5" },
            { pass: false, text: "No shadow-sm/md/lg/xl — the default ramp is cleared and won't render" },
            { pass: false, text: "No arbitrary shadow values — three roles are the whole menu" },
            { pass: false, text: "Don't stack elevations to fake depth — a surface has exactly one role" },
          ]}
        />
      </section>
    </div>
  );
}
