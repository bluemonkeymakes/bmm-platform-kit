import type { PageBlock, BlockGalleryData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2 } from "~/components/common/Typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { cn } from "~/lib/utils";

export function BlockGallery({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockGalleryData;
  const cols = data.columns || 3;

  return (
    <Section>
      <Container>
        {data.title && (
          <div className="mb-12 text-center">
            <H2>{data.title}</H2>
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
                  <p className="mt-2 text-center text-sm text-neutral-500">{img.caption}</p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
