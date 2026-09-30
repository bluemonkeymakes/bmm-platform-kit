import type { MetaFunction } from "react-router";
import { BlockImageText } from "~/components/blocks/BlockImageText";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Image and text" };

export const meta: MetaFunction = () => [
  { title: "Image and text | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Image and text"
      blurb="Split image + rich text, image position left/right. CMS collection `block_image_text`; BlockRenderer maps it to BlockImageText. Rendered here from demo data."
      composedFrom={["Button", "Container", "FadeIn", "Heading", "Prose", "Section"]}
      usage={`import { BlockImageText } from "~/components/blocks/BlockImageText";

<BlockImageText block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockImageText block={sampleBlock("block_image_text")} />
    </ItemPage>
  );
}
