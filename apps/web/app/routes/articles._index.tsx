import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getArticles } from "~/lib/directus.server";
import { defaultArticles } from "~/data/defaults";
import { Container, Section } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";
import { ArticleCard } from "~/components/cards/ArticleCard";
import { FadeIn, StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";

export const meta: MetaFunction = () => [
  { title: "Articles | Starter Kit" },
  { name: "description", content: "Read our latest articles and insights." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const cmsArticles = await getArticles();
  return { articles: cmsArticles.length ? cmsArticles : defaultArticles };
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <>
      <section className="border-b bg-neutral-100/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <Heading as="h1" size="2xl" variant="display">Articles</Heading>
            <Body size="lg" variant="lead" className="mt-4">Insights, guides, and updates.</Body>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          {articles.length > 0 ? (
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <StaggerItem key={article.id}>
                  <ArticleCard article={article} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">
                No articles yet. Add articles in Directus to see them here.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
