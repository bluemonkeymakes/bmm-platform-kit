import { Link } from "react-router";
import type { PageBlock, BlockCtaData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockCTA({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockCtaData;
  const isAccent = data.variant === "accent";

  return (
    <Section tone={isAccent ? "brand" : "default"}>
      <Container size="narrow" className="text-center">
        <FadeIn>
          <Heading as="h2" size="xl" variant={isAccent ? "inverse" : "display"}>
            {data.title}
          </Heading>
          {data.description && (
            <Body size="lg" variant={isAccent ? "inverse" : "lead"} className="mt-4">
              {data.description}
            </Body>
          )}
          <div className="mt-8">
            <Button size="lg" variant={isAccent ? "secondary" : "default"} asChild>
              <Link to={data.cta_link}>{data.cta_text}</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
