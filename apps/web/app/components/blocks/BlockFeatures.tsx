import type { PageBlock, BlockFeaturesData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, H4, Lead, Text } from "~/components/common/Typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockFeatures({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockFeaturesData;
  const cols = data.columns || 3;

  return (
    <Section>
      <Container>
        {(data.title || data.subtitle) && (
          <div className="mb-12 text-center">
            {data.title && <H2>{data.title}</H2>}
            {data.subtitle && <Lead className="mt-4">{data.subtitle}</Lead>}
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
              <H4>{feature.title}</H4>
              <Text className="mt-2">{feature.description}</Text>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
