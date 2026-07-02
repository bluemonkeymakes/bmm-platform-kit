import { cn } from "~/lib/utils";
import type { ReactNode } from "react";
import { useTheme } from "~/components/layout/ThemeProvider";

interface PreviewProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function Preview({ label, description, children, className, dark }: PreviewProps) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <div
        className={cn(
          "flex items-center justify-center min-h-[7.5rem] p-8",
          dark ? "bg-primary-900" : "bg-neutral-50",
          className
        )}
      >
        {children}
      </div>
      <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-100/40">
        <p className="text-xs font-medium text-neutral-800 font-inconsolata">{label}</p>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export type DualTheme = "dark" | "light";
export type DualChildren = ((theme: DualTheme) => ReactNode) | ReactNode;

interface DualPreviewProps {
  label?: string;
  children: DualChildren;
  align?: "start" | "center";
  minHeight?: string;
}

/**
 * Single preview panel that renders in the active theme (driven by the site
 * header dark-mode toggle via ThemeProvider). The `(theme) => …` render prop
 * receives the live resolved theme. Toggle the theme to see the other; we
 * don't show side-by-side.
 */
export function DualPreview({ label, children, align = "start", minHeight = "8rem" }: DualPreviewProps) {
  const { resolvedTheme } = useTheme();
  const content = typeof children === "function" ? children(resolvedTheme) : children;

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
        <div
          className={cn("p-6", align === "center" && "flex items-center justify-center")}
          style={{ minHeight }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
