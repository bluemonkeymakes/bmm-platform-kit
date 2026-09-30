import type { MetaFunction } from "react-router";
import { BlockContent } from "~/components/blocks/BlockContent";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Content" };

export const meta: MetaFunction = () => [
  { title: "Content | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Content"
      blurb="Rich-text prose section from the CMS. CMS collection `block_content`; BlockRenderer maps it to BlockContent. Rendered here from demo data."
      composedFrom={["Container", "FadeIn", "Heading", "Prose", "Section"]}
      usage={`import { BlockContent } from "~/components/blocks/BlockContent";

<BlockContent block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockContent block={sampleBlock("block_content")} />
    </ItemPage>
  );
}
