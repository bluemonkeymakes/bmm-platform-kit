import { Link } from "react-router";
import type { PageBlock, BlockAboutData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Prose } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockAbout({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockAboutData;

  return (
    <Section>
      <Container size="wide">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <FadeIn>
            {data.title && <Heading as="h2" size="xl" variant="display" className="mb-6">{data.title}</Heading>}
            <Prose html={data.content} />
            {data.cta_text && data.cta_link && (
              <div className="mt-6">
                <Button asChild>
                  <Link to={data.cta_link}>{data.cta_text}</Link>
                </Button>
              </div>
            )}
          </FadeIn>

          {data.image && (
            <FadeIn direction="left">
              <img src={data.image} alt="" className="rounded-lg" loading="lazy" />
            </FadeIn>
          )}
        </div>
      </Container>
    </Section>
  );
}
