import { Link } from "react-router";
import type { Article } from "~/types/content";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Small } from "~/components/common/Typography";
import dayjs from "dayjs";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/articles/${article.slug}`} className="group">
      <Card className="h-full hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:shadow-xs">
        {article.featured_image && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={article.featured_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2">
            {article.category && <Badge variant="secondary">{article.category}</Badge>}
            <Small>{dayjs(article.date_published).format("MMM D, YYYY")}</Small>
          </div>
          <CardTitle className="text-lg transition-colors duration-200 group-hover:text-primary/80">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Small className="line-clamp-2">{article.excerpt}</Small>
        </CardContent>
      </Card>
    </Link>
  );
}
