import type { PageBlock, BlockHeroData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { H1, SectionLabel, Lead } from "~/components/common/Typography";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockHeroSimple({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockHeroData;

  return (
    <section className="border-b bg-neutral-100/30 py-16 md:py-24">
      <Container size="narrow" className="text-center">
        <FadeIn>
          {data.label && <SectionLabel className="mb-4">{data.label}</SectionLabel>}
          <H1>{data.title}</H1>
          {data.subtitle && <Lead className="mt-4">{data.subtitle}</Lead>}
        </FadeIn>
      </Container>
    </section>
  );
}
