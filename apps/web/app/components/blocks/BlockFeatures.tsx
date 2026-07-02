import type { PageBlock, BlockFeaturesData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockFeatures({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockFeaturesData;
  const cols = data.columns || 3;

  return (
    <Section>
      <Container size="wide">
        {(data.title || data.subtitle) && (
          <div className="mb-12 text-center">
            {data.title && <Heading as="h2" size="xl" variant="display">{data.title}</Heading>}
            {data.subtitle && <Body size="lg" variant="lead" className="mt-4">{data.subtitle}</Body>}
          </div>
        )}

        <StaggerContainer
          className={cn(
            "grid gap-8",
            cols === 2 && "md:grid-cols-2",
            cols === 3 && "md:grid-cols-3",
            cols === 4 && "md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {(data.features || []).map((feature, i) => (
            <StaggerItem key={i} className="rounded-lg border bg-neutral-50 p-6">
              {feature.icon && <div className="mb-4 text-3xl">{feature.icon}</div>}
              <Heading as="h4" size="sm">{feature.title}</Heading>
              <Body variant="muted" className="mt-2">{feature.description}</Body>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
