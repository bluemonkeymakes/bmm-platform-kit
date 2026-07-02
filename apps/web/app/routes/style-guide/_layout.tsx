import { NavLink, Outlet, useMatches } from "react-router";
import { CopyToastProvider } from "~/components/ds/CopyToast";
import { nav } from "~/lib/style-guide-nav";
import { cn } from "~/lib/utils";

/**
 * Style-guide shell — a two-column reference layout rendered inside the
 * site's existing Header/Footer chrome. Left: sticky grouped nav. Right:
 * sticky page-title bar + the active page. On mobile the sidebar collapses
 * to a horizontal scrollable nav.
 */
export default function StyleGuideLayout() {
  const matches = useMatches();
  const active = [...matches]
    .reverse()
    .find((m) => (m.handle as { title?: string } | undefined)?.title);
  const title = (active?.handle as { title?: string } | undefined)?.title ?? "Style Guide";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block px-2 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap",
      isActive
        ? "bg-neutral-100 text-neutral-800 font-medium"
        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
    );

  return (
    <CopyToastProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal scrollable nav */}
        <nav
          aria-label="Style guide"
          className="lg:hidden -mx-4 sm:-mx-6 border-b border-neutral-200 bg-neutral-50"
        >
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-4 sm:px-6 py-2">
            <NavLink to="/style-guide" end className={linkClass}>
              Overview
            </NavLink>
            {nav.flatMap(({ items }) =>
              items.map(({ label, to }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  {label}
                </NavLink>
              ))
            )}
          </div>
        </nav>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-neutral-200">
          <nav
            aria-label="Style guide"
            className="sticky top-16 max-h-screen overflow-y-auto py-8 pr-4 space-y-6"
          >
            <div>
              <NavLink to="/style-guide" end className={linkClass}>
                Overview
              </NavLink>
            </div>
            {nav.map(({ section, items }) => (
              <div key={section}>
                <p className="px-2 mb-1 text-xs font-medium uppercase tracking-wider text-neutral-500 font-inconsolata">
                  {section}
                </p>
                <ul className="space-y-0.5">
                  {items.map(({ label, to }) => (
                    <li key={to}>
                      <NavLink to={to} className={linkClass}>
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <div className="sticky top-16 z-dropdown hidden lg:flex items-center h-12 px-8 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-sm">
            <h1 className="text-sm font-medium text-neutral-800 font-display">{title}</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </CopyToastProvider>
  );
}
