import { Link } from "react-router";
import type { PageBlock, BlockImageTextData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, Prose } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockImageText({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockImageTextData;
  const imageLeft = data.image_position === "left";

  return (
    <Section>
      <Container>
        <div className={cn("grid gap-12 md:grid-cols-2 items-center", imageLeft && "md:[direction:rtl] md:[&>*]:![direction:ltr]")}>
          <FadeIn direction={imageLeft ? "right" : "left"}>
            <div className="overflow-hidden rounded-lg">
              <img src={data.image} alt="" className="w-full object-cover" loading="lazy" />
            </div>
          </FadeIn>

          <FadeIn direction={imageLeft ? "left" : "right"}>
            {data.title && <H2 className="mb-4">{data.title}</H2>}
            <Prose html={data.content} />
            {data.cta_text && data.cta_link && (
              <div className="mt-6">
                <Button asChild>
                  <Link to={data.cta_link}>{data.cta_text}</Link>
                </Button>
              </div>
            )}
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
