import type { PageBlock, BlockGalleryData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockGallery({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockGalleryData;
  const cols = data.columns || 3;

  return (
    <Section>
      <Container size="wide">
        {data.title && (
          <div className="mb-12 text-center">
            <Heading as="h2" size="xl" variant="display">{data.title}</Heading>
          </div>
        )}

        <StaggerContainer
          className={cn(
            "grid gap-4",
            cols === 2 && "md:grid-cols-2",
            cols === 3 && "md:grid-cols-3",
            cols === 4 && "md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {(data.images || []).map((img, i) => (
            <StaggerItem key={i}>
              <div className="group overflow-hidden rounded-lg">
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {img.caption && (
                  <Body size="sm" variant="muted" className="mt-2 text-center">{img.caption}</Body>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
