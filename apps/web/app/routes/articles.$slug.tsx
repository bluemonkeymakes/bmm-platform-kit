import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getArticle } from "~/lib/directus.server";
import { defaultArticles } from "~/data/defaults";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H1, Prose, Text } from "~/components/common/Typography";
import { Badge } from "~/components/ui/badge";
import { FadeIn } from "~/components/common/MotionWrapper";
import dayjs from "dayjs";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) return [{ title: "Article Not Found" }];
  return [
    { title: `${data.article.title} | Starter Kit` },
    { name: "description", content: data.article.excerpt },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const article = await getArticle(params.slug!);
  if (article) return { article };

  // Fall back to default articles when CMS not connected
  const fallback = defaultArticles.find((a) => a.slug === params.slug);
  if (fallback) return { article: fallback };

  throw new Response("Not Found", { status: 404 });
}

export default function ArticleDetail() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <>
      <section className="border-b bg-neutral-100/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-4">
              {article.category && <Badge variant="secondary">{article.category}</Badge>}
              <span className="text-sm text-neutral-500">
                {dayjs(article.date_published).format("MMMM D, YYYY")}
              </span>
            </div>
            <H1>{article.title}</H1>
            {article.author && (
              <Text className="mt-4">By {article.author}</Text>
            )}
          </FadeIn>
        </Container>
      </section>

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
