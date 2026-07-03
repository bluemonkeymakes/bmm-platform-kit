import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getArticles } from "~/lib/directus.server";
import { defaultArticles } from "~/data/defaults";
import { Container, Section } from "~/components/ui/layout";
import { ArticleCard } from "~/components/cards/ArticleCard";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { PageHero } from "~/components/common/PageHero";
import { Body } from "~/components/ui/typography";

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
      <PageHero title="Articles" subtitle="Insights, guides, and updates." />

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
              <Body variant="muted">
                No articles yet. Add articles in Directus to see them here.
              </Body>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
