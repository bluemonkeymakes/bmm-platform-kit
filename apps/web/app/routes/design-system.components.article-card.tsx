import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { ArticleCard } from "~/components/cards/ArticleCard";
import { defaultArticles } from "~/data/defaults";

export const handle = { title: "Article card" };

export const meta: MetaFunction = () => [
  { title: "Article card | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Article card"
      blurb="An article teaser for listings and the Articles block: image, category, title, excerpt and reading time."
      composedFrom={["Card", "CardHeader", "CardTitle", "CardContent", "Badge", "Body", "router Link"]}
      usage={`import { ArticleCard } from "~/components/cards/ArticleCard";

<ArticleCard article={article} />`}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {defaultArticles.slice(0, 3).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </ItemPage>
  );
}
