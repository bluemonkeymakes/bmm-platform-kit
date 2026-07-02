import { Link } from "react-router";
import type { PageBlock, BlockHeroData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { H1, SectionLabel, Lead, Text } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { FadeIn } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockHero({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockHeroData;
  const alignment = data.alignment || "left";

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {data.image && (
        <div className="absolute inset-0 z-0">
          <img src={data.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-neutral-50/80 dark:bg-neutral-50/90" />
        </div>
      )}

      <Container className={cn("relative z-10 py-24 md:py-32", alignment === "center" && "text-center")}>
        <FadeIn>
          {data.label && <SectionLabel className="mb-4">{data.label}</SectionLabel>}
          <H1 className="max-w-4xl">{data.title}</H1>
          {data.subtitle && <Lead className="mt-6 max-w-2xl">{data.subtitle}</Lead>}
          {data.description && <Text className="mt-4 max-w-2xl">{data.description}</Text>}
          {(data.cta_text || data.secondary_cta_text) && (
            <div className={cn("mt-8 flex gap-4", alignment === "center" && "justify-center")}>
              {data.cta_text && data.cta_link && (
                <Button size="lg" asChild>
                  <Link to={data.cta_link}>{data.cta_text}</Link>
                </Button>
              )}
              {data.secondary_cta_text && data.secondary_cta_link && (
                <Button size="lg" variant="outline" asChild>
                  <Link to={data.secondary_cta_link}>{data.secondary_cta_text}</Link>
                </Button>
              )}
            </div>
          )}
        </FadeIn>
      </Container>
    </section>
  );
}
