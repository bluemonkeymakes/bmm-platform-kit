import type { PageBlock, BlockTestimonialsData } from "~/types/content";
import type { BlockContext } from "./BlockRenderer";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { Quote } from "lucide-react";

export function BlockTestimonials({ block, context }: { block: PageBlock; context?: BlockContext }) {
  const data = block.item as unknown as BlockTestimonialsData;
  const testimonials = context?.testimonials || [];

  if (testimonials.length === 0) return null;

  const limited = data.limit ? testimonials.slice(0, data.limit) : testimonials;

  return (
    <Section tone="muted">
      <Container size="wide">
        {(data.title || data.subtitle) && (
          <div className="mb-12 text-center">
            {data.title && <Heading as="h2" size="xl" variant="display">{data.title}</Heading>}
            {data.subtitle && <Body size="lg" variant="lead" className="mt-4">{data.subtitle}</Body>}
          </div>
        )}

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {limited.map((t) => (
            <StaggerItem key={t.id}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <Body as="blockquote" size="base">
                    "{t.quote}"
                  </Body>
                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    <Avatar
                      size="md"
                      src={t.author_photo || undefined}
                      alt={t.author_name}
                      name={t.author_name}
                      fallback={t.author_name.split(" ").map((n) => n[0]).join("")}
                    />
                    <div>
                      <Body size="sm">{t.author_name}</Body>
                      <Body size="xs" variant="muted">
                        {t.author_role}{t.company && `, ${t.company}`}
                      </Body>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
