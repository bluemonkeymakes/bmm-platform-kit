import type { MetaFunction } from "react-router";
import { BlockStats } from "~/components/blocks/BlockStats";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Stats" };

export const meta: MetaFunction = () => [
  { title: "Stats | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Stats"
      blurb="Headline metrics band — value, label, description. CMS collection `block_stats`; BlockRenderer maps it to BlockStats. Rendered here from demo data."
      composedFrom={["Body", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockStats } from "~/components/blocks/BlockStats";

<BlockStats block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockStats block={sampleBlock("block_stats")} />
    </ItemPage>
  );
}
