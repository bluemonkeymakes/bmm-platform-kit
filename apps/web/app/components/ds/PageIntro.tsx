import type { ReactNode } from "react";

interface PageIntroProps {
  title: string;
  /** Short muted summary under the title, capped at a comfortable measure. */
  blurb?: ReactNode;
  /** Extra intro content (import snippet, mode chip) rendered below, unstyled. */
  children?: ReactNode;
}

/**
 * The standard route header — page title in the display face plus an optional
 * blurb. Shared across every foundations / components / patterns page so the
 * intro block never drifts per route.
 */
export function PageIntro({ title, blurb, children }: PageIntroProps) {
  return (
    <div>
      <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">{title}</h2>
      {blurb && <p className="text-sm text-neutral-500 max-w-2xl">{blurb}</p>}
      {children}
    </div>
  );
}
