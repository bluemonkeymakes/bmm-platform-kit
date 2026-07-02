import type { PageBlock, BlockContentData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Prose } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockContent({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockContentData;
  const hasImage = !!data.image;

  return (
    <Section>
      <Container size="wide">
        <div className={cn(hasImage && "grid gap-12 md:grid-cols-2 items-center")}>
          {hasImage && data.image_position === "left" && (
            <FadeIn direction="right">
              <img src={data.image!} alt="" className="rounded-lg" loading="lazy" />
            </FadeIn>
          )}

          <FadeIn>
            {data.title && <Heading as="h2" size="xl" variant="display" className="mb-6">{data.title}</Heading>}
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
