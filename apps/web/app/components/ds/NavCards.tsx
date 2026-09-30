import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { NavSection } from "~/lib/design-system-nav";

/**
 * The card grid of design-system pages, one card per page, grouped by nav
 * section. Shared by the overview and every layer index, so a page appears
 * everywhere it should the moment it is added to lib/design-system-nav.ts.
 */
export function NavCards({ sections }: { sections: NavSection[] }) {
  return (
    <>
      {sections.map(({ section, items }) => (
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
    </>
  );
}
