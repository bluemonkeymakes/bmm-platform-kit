import type { PageBlock, BlockNewsletterData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function BlockNewsletter({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockNewsletterData;

  return (
    <Section tone="muted">
      <Container size="narrow" className="text-center">
        <FadeIn>
          <Heading as="h2" size="xl" variant="display">{data.title || "Stay in the loop"}</Heading>
          <Body size="lg" variant="lead" className="mt-4">
            {data.description || "Get updates delivered to your inbox. No spam."}
          </Body>
          <form className="mx-auto mt-8 flex max-w-md gap-3">
            <Input
              type="email"
              placeholder={data.placeholder || "you@example.com"}
              required
              className="flex-1"
            />
            <Button type="submit">{data.button_text || "Subscribe"}</Button>
          </form>
        </FadeIn>
      </Container>
    </Section>
  );
}
