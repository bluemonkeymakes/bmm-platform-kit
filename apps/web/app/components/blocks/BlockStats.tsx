import type { PageBlock, BlockStatsData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";

export function BlockStats({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockStatsData;

  return (
    <Section tone="brand">
      <Container size="wide">
        {data.title && (
          <div className="mb-12 text-center">
            <Heading as="h2" size="xl" variant="inverse">
              {data.title}
            </Heading>
          </div>
        )}

        <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {(data.stats || []).map((stat, i) => (
            <StaggerItem key={i} className="text-center">
              <Heading as="p" size="2xl" variant="inverse">{stat.value}</Heading>
              <Body size="sm" variant="inverse" className="mt-2">{stat.label}</Body>
              {stat.description && (
                <Body size="xs" variant="inverse" className="mt-1">{stat.description}</Body>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
