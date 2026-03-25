import { Link } from "react-router";
import type { PageBlock, BlockAboutData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, Prose } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockAbout({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockAboutData;

  return (
    <Section>
      <Container>
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <FadeIn>
            {data.title && <H2 className="mb-6">{data.title}</H2>}
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
