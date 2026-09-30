import type { MetaFunction } from "react-router";
import { BlockArticles } from "~/components/blocks/BlockArticles";
import { sampleBlock, sampleContext } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Articles" };

export const meta: MetaFunction = () => [
  { title: "Articles | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Articles"
      blurb="Latest articles grid fed from the articles collection. CMS collection `block_articles`; BlockRenderer maps it to BlockArticles. Rendered here from demo data."
      composedFrom={["ArticleCard", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockArticles } from "~/components/blocks/BlockArticles";

<BlockArticles block={block} context={context} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockArticles block={sampleBlock("block_articles")} context={sampleContext} />
    </ItemPage>
  );
}
