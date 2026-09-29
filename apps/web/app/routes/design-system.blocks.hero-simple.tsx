import type { MetaFunction } from "react-router";
import { BlockHeroSimple } from "~/components/blocks/BlockHeroSimple";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Hero (simple)" };

export const meta: MetaFunction = () => [
  { title: "Hero (simple) | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Hero (simple)"
      blurb="Compact page header — label, title, subtitle on a subtle band. CMS collection `block_hero_simple`; BlockRenderer maps it to BlockHeroSimple. Rendered here from demo data."
      composedFrom={["PageHero"]}
      usage={`import { BlockHeroSimple } from "~/components/blocks/BlockHeroSimple";

<BlockHeroSimple block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockHeroSimple block={sampleBlock("block_hero_simple")} />
    </ItemPage>
  );
}
