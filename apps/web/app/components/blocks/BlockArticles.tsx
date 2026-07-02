import type { PageBlock, BlockArticlesData } from "~/types/content";
import type { BlockContext } from "./BlockRenderer";
import { Container, Section } from "~/components/ui/layout";
import { Heading } from "~/components/ui/typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { ArticleCard } from "~/components/cards/ArticleCard";

export function BlockArticles({ block, context }: { block: PageBlock; context?: BlockContext }) {
  const data = block.item as unknown as BlockArticlesData;
  const articles = context?.articles || [];
  const limited = data.limit ? articles.slice(0, data.limit) : articles;

  if (limited.length === 0) return null;

  return (
    <Section>
      <Container size="wide">
        {data.title && (
          <div className="mb-12 text-center">
            <Heading as="h2" size="xl" variant="display">{data.title}</Heading>
          </div>
        )}

        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {limited.map((article) => (
            <StaggerItem key={article.id}>
              <ArticleCard article={article} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
