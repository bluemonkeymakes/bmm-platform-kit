import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getPage } from "~/lib/directus.server";
import { BlockRenderer } from "~/components/blocks/BlockRenderer";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Prose } from "~/components/ui/typography";
import { FadeIn } from "~/components/common/MotionWrapper";

export const meta: MetaFunction = () => [
  { title: "Terms of Service | Starter Kit" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const page = await getPage("terms");
  return { page };
}

export default function Terms() {
  const { page } = useLoaderData<typeof loader>();

  if (page?.blocks && page.blocks.length > 0) {
    return <BlockRenderer blocks={page.blocks} />;
  }

  return (
    <>
      <section className="border-b bg-neutral-100/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <Heading as="h1" size="2xl" variant="display">Terms of Service</Heading>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container size="narrow">
          <FadeIn>
            <Prose>
              <p>Add your terms of service content here, or manage it through Directus CMS.</p>
              <p>Create a page with slug "terms" in Directus to manage this content dynamically.</p>
            </Prose>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
