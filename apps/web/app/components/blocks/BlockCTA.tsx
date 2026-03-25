import { Link } from "react-router";
import type { PageBlock, BlockCtaData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, Lead } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockCTA({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockCtaData;
  const isAccent = data.variant === "accent";

  return (
    <Section className={cn(isAccent && "bg-primary text-primary-foreground")}>
      <Container size="narrow" className="text-center">
        <FadeIn>
          <H2>{data.title}</H2>
          {data.description && (
            <Lead className={cn("mt-4", isAccent && "text-primary-foreground/80")}>{data.description}</Lead>
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
