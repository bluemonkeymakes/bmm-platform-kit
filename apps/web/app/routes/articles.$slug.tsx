import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getArticle } from "~/lib/directus.server";
import { withFallback } from "~/content/mode.server";
import { defaultArticles } from "~/data/defaults";
import type { Article } from "~/types/content";
import { Container, Section } from "~/components/ui/layout";
import { Prose, Body } from "~/components/ui/typography";
import { Badge } from "~/components/ui/badge";
import { FadeIn } from "~/components/common/MotionWrapper";
import { PageHero } from "~/components/common/PageHero";
import dayjs from "dayjs";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) return [{ title: "Article Not Found" }];
  return [
    { title: `${data.article.title} | Starter Kit` },
    { name: "description", content: data.article.excerpt },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  // auto: CMS article, else the matching default (miss → 404).
  // cms: CMS article or 404 — defaults never mask a missing article.
  // static: the matching default only (miss → 404).
  const article = withFallback<Article | null>(
    `article ${params.slug}`,
    await getArticle(params.slug!),
    defaultArticles.find((a) => a.slug === params.slug) ?? null
  );
  if (!article) throw new Response("Not Found", { status: 404 });

  return { article };
}

export default function ArticleDetail() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHero
        title={article.title}
        subtitle={article.author ? `By ${article.author}` : undefined}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          {article.category && <Badge variant="secondary">{article.category}</Badge>}
          <Body as="span" size="sm" variant="muted">
            {dayjs(article.date_published).format("MMMM D, YYYY")}
          </Body>
        </div>
      </PageHero>

      <Section>
        <Container size="narrow">
          <FadeIn>
            <Prose html={article.content} />
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
