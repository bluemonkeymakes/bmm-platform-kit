import type { ReactNode } from "react";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { DualPreview } from "~/components/ds/Preview";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

interface ItemPageProps {
  title: string;
  blurb: string;
  composedFrom: string[];
  usage: string;
  children: ReactNode;
}

/**
 * One /design-system page for a component or block (ADR-021): what it is, what
 * it is built from, a live rendering with demo data, and how to call it.
 */
export function ItemPage({ title, blurb, composedFrom, usage, children }: ItemPageProps) {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro title={title} blurb={blurb} />
      <SpecimenSection title="Preview">
        <DualPreview>{children}</DualPreview>
      </SpecimenSection>
      <SpecimenSection title="Composed from">
        <p className="text-sm text-neutral-500">{composedFrom.join(" · ")}</p>
      </SpecimenSection>
      <SpecimenSection title="Usage">
        <CodeBlock code={usage} />
      </SpecimenSection>
    </div>
  );
}
