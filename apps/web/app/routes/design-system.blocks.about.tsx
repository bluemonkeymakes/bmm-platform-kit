import type { MetaFunction } from "react-router";
import { BlockAbout } from "~/components/blocks/BlockAbout";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "About" };

export const meta: MetaFunction = () => [
  { title: "About | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="About"
      blurb="About summary section. CMS collection `block_about`; BlockRenderer maps it to BlockAbout. Rendered here from demo data."
      composedFrom={["Button", "Container", "FadeIn", "Heading", "Prose", "Section"]}
      usage={`import { BlockAbout } from "~/components/blocks/BlockAbout";

<BlockAbout block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockAbout block={sampleBlock("block_about")} />
    </ItemPage>
  );
}
