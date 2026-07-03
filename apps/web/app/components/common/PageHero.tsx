import type * as React from "react";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Label, Body } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";

export interface PageHeroProps {
  /** Optional eyebrow above the title. */
  label?: string;
  title: string;
  /** Lead line under the title. */
  subtitle?: string;
  /** Extra meta content (badges, dates) rendered between the label and the title. */
  children?: React.ReactNode;
}

/**
 * The standard page-opening band: muted tone, centered heading, optional
 * eyebrow / lead. Promoted from the hero markup previously duplicated across
 * routes and BlockHeroSimple.
 */
export function PageHero({ label, title, subtitle, children }: PageHeroProps) {
  return (
    <Section tone="muted" className="border-b">
      <Container size="narrow" className="text-center">
        <FadeIn>
          {label && (
            <Label as="p" size="md" className="mb-4">
              {label}
            </Label>
          )}
          {children}
          <Heading as="h1" size="2xl" variant="display">
            {title}
          </Heading>
          {subtitle && (
            <Body size="lg" variant="lead" className="mt-4">
              {subtitle}
            </Body>
          )}
        </FadeIn>
      </Container>
    </Section>
  );
}
