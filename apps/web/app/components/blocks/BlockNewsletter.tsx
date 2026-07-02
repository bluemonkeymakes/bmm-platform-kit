import type { PageBlock, BlockNewsletterData } from "~/types/content";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, Lead } from "~/components/common/Typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function BlockNewsletter({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockNewsletterData;

  return (
    <Section className="bg-neutral-100/30">
      <Container size="narrow" className="text-center">
        <FadeIn>
          <H2>{data.title || "Stay in the loop"}</H2>
          <Lead className="mt-4">
            {data.description || "Get updates delivered to your inbox. No spam."}
          </Lead>
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
