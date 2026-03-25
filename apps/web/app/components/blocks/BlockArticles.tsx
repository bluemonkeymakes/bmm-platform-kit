import type { PageBlock, BlockArticlesData } from "~/types/content";
import type { BlockContext } from "./BlockRenderer";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2 } from "~/components/common/Typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { ArticleCard } from "~/components/cards/ArticleCard";

export function BlockArticles({ block, context }: { block: PageBlock; context?: BlockContext }) {
  const data = block.item as unknown as BlockArticlesData;
  const articles = context?.articles || [];
  const limited = data.limit ? articles.slice(0, data.limit) : articles;

  if (limited.length === 0) return null;

  return (
    <Section>
      <Container>
        {data.title && (
          <div className="mb-12 text-center">
            <H2>{data.title}</H2>
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
