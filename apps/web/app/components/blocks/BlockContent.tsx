import type { PageBlock, BlockContentData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, Prose } from "~/components/common/Typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockContent({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockContentData;
  const hasImage = !!data.image;

  return (
    <Section>
      <Container>
        <div className={cn(hasImage && "grid gap-12 md:grid-cols-2 items-center")}>
          {hasImage && data.image_position === "left" && (
            <FadeIn direction="right">
              <img src={data.image!} alt="" className="rounded-lg" loading="lazy" />
            </FadeIn>
          )}

          <FadeIn>
            {data.title && <H2 className="mb-6">{data.title}</H2>}
            <Prose html={data.content} />
          </FadeIn>

          {hasImage && data.image_position !== "left" && (
            <FadeIn direction="left">
              <img src={data.image!} alt="" className="rounded-lg" loading="lazy" />
            </FadeIn>
          )}
        </div>
      </Container>
    </Section>
  );
}
