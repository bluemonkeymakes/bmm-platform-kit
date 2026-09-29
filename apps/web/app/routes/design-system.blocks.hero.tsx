import type { MetaFunction } from "react-router";
import { BlockHero } from "~/components/blocks/BlockHero";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Hero" };

export const meta: MetaFunction = () => [
  { title: "Hero | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Hero"
      blurb="Full marketing hero — label, headline, subtitle, primary + secondary CTA. CMS collection `block_hero`; BlockRenderer maps it to BlockHero. Rendered here from demo data."
      composedFrom={["Body", "Button", "Container", "FadeIn", "Heading", "Label"]}
      usage={`import { BlockHero } from "~/components/blocks/BlockHero";

<BlockHero block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockHero block={sampleBlock("block_hero")} />
    </ItemPage>
  );
}
