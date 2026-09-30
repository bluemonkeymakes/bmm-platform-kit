import type { MetaFunction } from "react-router";
import { BlockCTA } from "~/components/blocks/BlockCTA";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "CTA" };

export const meta: MetaFunction = () => [
  { title: "CTA | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="CTA"
      blurb="Closing call-to-action band; accent variant inverts onto the primary fill. CMS collection `block_cta`; BlockRenderer maps it to BlockCTA. Rendered here from demo data."
      composedFrom={["Body", "Button", "Container", "FadeIn", "Heading", "Section"]}
      usage={`import { BlockCTA } from "~/components/blocks/BlockCTA";

<BlockCTA block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockCTA block={sampleBlock("block_cta")} />
    </ItemPage>
  );
}
