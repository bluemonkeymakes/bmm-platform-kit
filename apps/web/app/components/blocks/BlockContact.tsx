import type { PageBlock, BlockContactData } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export function BlockContact({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockContactData;

  return (
    <Section>
      <Container size="narrow">
        {(data.title || data.description) && (
          <div className="mb-12 text-center">
            {data.title && <Heading as="h2" size="xl" variant="display">{data.title}</Heading>}
            {data.description && <Body size="lg" variant="lead" className="mt-4">{data.description}</Body>}
          </div>
        )}

        <FadeIn>
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required className="mt-1" />
            </div>
            <Button type="submit" size="lg">
              Send Message
            </Button>
          </form>
        </FadeIn>
      </Container>
    </Section>
  );
}
