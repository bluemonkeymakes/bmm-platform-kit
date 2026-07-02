import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Tooltip } from "~/components/ui/tooltip";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-sticky w-full border-b bg-neutral-50/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-normal tracking-tight transition-opacity duration-200 hover:opacity-70 active:scale-[0.98]">
          Starter
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 hover:text-neutral-800/80 active:scale-[0.98]",
                location.pathname.startsWith(item.href)
                  ? "text-neutral-800"
                  : "text-neutral-500"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Tooltip content={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 transition-all duration-200 hover:bg-neutral-100 active:scale-[0.95] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </Tooltip>
        </nav>

        {/* Mobile toggle */}
        <Tooltip content={mobileOpen ? "Close menu" : "Open menu"}>
          <button
            className="md:hidden rounded-md p-2 transition-all duration-200 hover:bg-neutral-100 active:scale-[0.95] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Tooltip>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 active:scale-[0.98]",
                  location.pathname.startsWith(item.href)
                    ? "bg-neutral-100 text-neutral-800"
                    : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 active:scale-[0.98]"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
