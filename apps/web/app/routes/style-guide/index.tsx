import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { nav } from "~/lib/style-guide-nav";

export const handle = { title: "Overview" };

export const meta: MetaFunction = () => [
  { title: "Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

// Constraint is the throughline — keep this list short on purpose.
const tenets = [
  {
    title: "Constraint is the product",
    body: "Fewer, decided options beat infinite flexibility. Three elevations, not seven. Named scales, not arbitrary values. The smaller the menu, the more consistent the result.",
  },
  {
    title: "Decide once, propagate",
    body: "Tokens hold the decision; components consume it. Change a value in app/brand/brand.css and the whole system follows — light and dark both.",
  },
  {
    title: "Name by intent, not by size",
    body: "shadow-overlay, not shadow-lg. A name carries meaning and forecloses the in-between value; a ramp just invites the question of which size looks right this time.",
  },
  {
    title: "Select, don't restyle",
    body: "At a call site you pick a variant and pass layout classes only. A visual override on an imported component means a variant is missing — add it to the component.",
  },
  {
    title: "Surfaces come from the neutral scale",
    body: "bg-neutral-50 pages and cards, border-neutral-200 dividers, text-neutral-500 muted copy. No alias-token layer; the inverted scale gives dark mode for free.",
  },
  {
    title: "Every state, every time",
    body: "Default, hover, active, focus-visible, disabled, loading. A component that skips a state is unfinished, not minimal.",
  },
];

export default function StyleGuideOverview() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <span className="text-xs font-medium tracking-widest uppercase text-neutral-500 font-inconsolata">
          Starter Kit
        </span>
        <h2 className="text-4xl font-display font-medium text-neutral-800 text-balance">
          The living reference for tokens, components, and patterns.
        </h2>
        <p className="text-lg text-neutral-500 max-w-2xl leading-relaxed">
          Everything the site ships is built from the pieces documented here. Use the site header's
          theme toggle to check any specimen in dark mode — the token scales invert, the components
          don't change.
        </p>
      </div>

      {/* Principles */}
      <section className="space-y-6">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-medium tracking-widest uppercase text-primary font-inconsolata">
            Principles
          </span>
          <h3 className="text-2xl font-display font-medium text-neutral-800 leading-tight text-balance">
            A design system is a set of constraints. Its power is everything it makes easy, and
            everything it makes impossible.
          </h3>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tenets.map(({ title, body }, i) => (
            <li key={title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-raised">
              <div className="flex items-baseline gap-3">
                <span className="font-inconsolata text-sm font-medium text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-sm font-medium text-neutral-800">{title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-1.5">{body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Index of everything */}
      {nav.map(({ section, items }) => (
        <section key={section} className="space-y-4">
          <h3 className="text-base font-medium font-display text-neutral-800">{section}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(({ label, to, blurb }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:shadow-overlay hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800 group-hover:text-primary transition-colors">
                    {label}
                  </span>
                  <ArrowUpRight className="size-4 text-neutral-500 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
