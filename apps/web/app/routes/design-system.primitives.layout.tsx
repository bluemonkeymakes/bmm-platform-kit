import type { MetaFunction } from "react-router";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { DualPreview } from "~/components/ds/Preview";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import { Container, HalfContainer, Section } from "~/components/ui/layout";
import { Body, Label } from "~/components/ui/typography";

export const handle = { title: "Layout" };

export const meta: MetaFunction = () => [
  { title: "Layout | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const sizes = ["narrow", "standard", "wide"] as const;
const paddings = ["sm", "md", "lg", "xl"] as const;
const tones = ["default", "muted", "brand"] as const;

export default function PrimitivesLayout() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Layout"
        blurb="Container sets the width, Section sets the vertical rhythm and surface, HalfContainer splits a row between content and a full-bleed sibling. Pages never hand-roll max-w-* or py-* on a wrapper."
      />

      <SpecimenSection title="Container sizes">
        <DualPreview>
          <div className="space-y-3">
            {sizes.map((size) => (
              <Container key={size} size={size} className="rounded-md border border-dashed border-neutral-300 py-3">
                <Label>{size}</Label>
              </Container>
            ))}
          </div>
        </DualPreview>
      </SpecimenSection>

      <SpecimenSection title="HalfContainer">
        <DualPreview>
          <div className="space-y-3">
            <HalfContainer align="start" className="rounded-md border border-dashed border-neutral-300 py-3">
              <Body size="sm">align="start": content aligns to the container edge and fills to the centre.</Body>
            </HalfContainer>
            <HalfContainer align="end" className="rounded-md border border-dashed border-neutral-300 py-3">
              <Body size="sm">align="end": the mirror, for a visual on the left.</Body>
            </HalfContainer>
          </div>
        </DualPreview>
      </SpecimenSection>

      <SpecimenSection title="Section: tone × padding">
        <div className="space-y-3">
          {tones.map((tone) =>
            paddings.map((padding) => (
              <Section key={`${tone}-${padding}`} tone={tone} padding={padding} className="rounded-md">
                <Container>
                  <Label>
                    tone="{tone}" padding="{padding}"
                  </Label>
                </Container>
              </Section>
            )),
          )}
        </div>
      </SpecimenSection>

      <CodeBlock
        code={`import { Container, HalfContainer, Section } from "~/components/ui/layout";

<Section tone="muted" padding="lg">
  <Container size="wide">…</Container>
</Section>

<HalfContainer align="start">…copy…</HalfContainer>`}
      />
    </div>
  );
}
