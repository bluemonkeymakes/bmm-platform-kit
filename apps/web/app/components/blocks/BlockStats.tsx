import type { PageBlock, BlockStatsData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2 } from "~/components/common/Typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";

export function BlockStats({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockStatsData;

  return (
    <Section className="bg-primary text-primary-foreground">
      <Container>
        {data.title && (
          <div className="mb-12 text-center">
            <H2>{data.title}</H2>
          </div>
        )}

        <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {(data.stats || []).map((stat, i) => (
            <StaggerItem key={i} className="text-center">
              <p className="font-display text-4xl font-normal md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-normal opacity-80">{stat.label}</p>
              {stat.description && (
                <p className="mt-1 text-xs opacity-60">{stat.description}</p>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
