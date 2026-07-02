import type { PageBlock, BlockHeroData } from "~/types/content";
import { Container } from "~/components/ui/layout";
import { Heading, Label, Body } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockHeroSimple({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockHeroData;

  return (
    <section className="border-b bg-neutral-100/30 py-16 md:py-24">
      <Container size="narrow" className="text-center">
        <FadeIn>
          {data.label && <Label as="p" size="md" className="mb-4">{data.label}</Label>}
          <Heading as="h1" size="2xl" variant="display">{data.title}</Heading>
          {data.subtitle && <Body size="lg" variant="lead" className="mt-4">{data.subtitle}</Body>}
        </FadeIn>
      </Container>
    </section>
  );
}
