import { useState } from "react";
import type { PageBlock, BlockFaqData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

export function BlockFAQ({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockFaqData;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          <div className="divide-y rounded-lg border">
            {(data.items || []).map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-base font-medium hover:bg-neutral-100/50 transition-colors"
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-neutral-500 transition-transform",
                      openIndex === i && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4 text-sm text-neutral-500">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
