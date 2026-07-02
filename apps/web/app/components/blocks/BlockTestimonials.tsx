import type { PageBlock, BlockTestimonialsData } from "~/types/content";
import type { BlockContext } from "./BlockRenderer";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { Card, CardContent } from "~/components/ui/card";
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
                  <blockquote className="text-base leading-relaxed">
                    "{t.quote}"
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    {t.author_photo ? (
                      <img
                        src={t.author_photo}
                        alt={t.author_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                        {t.author_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-normal">{t.author_name}</p>
                      <p className="text-xs text-neutral-500">
                        {t.author_role}{t.company && `, ${t.company}`}
                      </p>
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
