import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getArticles } from "~/lib/directus.server";
import { defaultArticles } from "~/data/defaults";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H1, Lead } from "~/components/common/Typography";
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
      <section className="border-b bg-muted/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <H1>Articles</H1>
            <Lead className="mt-4">Insights, guides, and updates.</Lead>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container>
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
              <p className="text-muted-foreground">
                No articles yet. Add articles in Directus to see them here.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
