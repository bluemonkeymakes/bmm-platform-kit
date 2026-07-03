import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/layout";
import { Wordmark } from "~/components/common/Wordmark";

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
      <Container size="wide" className="flex h-16 items-center justify-between">
        <Wordmark size="md" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "rounded-sm text-sm font-medium transition-colors duration-200 hover:text-neutral-800/80 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                location.pathname.startsWith(item.href)
                  ? "text-neutral-800"
                  : "text-neutral-500"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Tooltip content={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </Tooltip>
        </nav>

        {/* Mobile toggle */}
        <Tooltip content={mobileOpen ? "Close menu" : "Open menu"}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </Tooltip>
      </Container>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t md:hidden">
          <nav>
            <Container size="wide" className="space-y-1 py-4">
              {[...navItems, { label: "Design System", href: "/style-guide" }].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
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
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </Container>
          </nav>
        </div>
      )}
    </header>
  );
}
