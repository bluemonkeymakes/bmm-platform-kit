import { Link } from "react-router";
import type { PageBlock, BlockImageTextData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Prose } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockImageText({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockImageTextData;
  const imageLeft = data.image_position === "left";

  return (
    <Section>
      <Container size="wide">
        <div className={cn("grid gap-12 md:grid-cols-2 items-center", imageLeft && "md:[direction:rtl] md:[&>*]:![direction:ltr]")}>
          <FadeIn direction={imageLeft ? "right" : "left"}>
            <div className="overflow-hidden rounded-lg">
              <img src={data.image} alt="" className="w-full object-cover" loading="lazy" />
            </div>
          </FadeIn>

          <FadeIn direction={imageLeft ? "left" : "right"}>
            {data.title && <Heading as="h2" size="xl" variant="display" className="mb-4">{data.title}</Heading>}
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
