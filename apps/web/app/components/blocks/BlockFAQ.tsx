import type { PageBlock, BlockFaqData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { FadeIn } from "~/components/common/MotionWrapper";

export function BlockFAQ({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockFaqData;

  return (
    <Section>
      <Container size="narrow">
        {(data.title || data.subtitle) && (
          <div className="mb-12 text-center">
            {data.title && <Heading as="h2" size="xl" variant="display">{data.title}</Heading>}
            {data.subtitle && <Body size="lg" variant="lead" className="mt-4">{data.subtitle}</Body>}
          </div>
        )}

        <FadeIn>
          <Accordion type="single" collapsible>
            {(data.items || []).map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </Container>
    </Section>
  );
}
