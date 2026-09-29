import type { MetaFunction } from "react-router";
import { BlockFeatures } from "~/components/blocks/BlockFeatures";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Features" };

export const meta: MetaFunction = () => [
  { title: "Features | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Features"
      blurb="2–4 column feature card grid with icons. CMS collection `block_features`; BlockRenderer maps it to BlockFeatures. Rendered here from demo data."
      composedFrom={["Body", "Card", "CardContent", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockFeatures } from "~/components/blocks/BlockFeatures";

<BlockFeatures block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockFeatures block={sampleBlock("block_features")} />
    </ItemPage>
  );
}
