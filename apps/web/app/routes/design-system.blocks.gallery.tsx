import type { MetaFunction } from "react-router";
import { BlockGallery } from "~/components/blocks/BlockGallery";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Gallery" };

export const meta: MetaFunction = () => [
  { title: "Gallery | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Gallery"
      blurb="Image gallery grid. CMS collection `block_gallery`; BlockRenderer maps it to BlockGallery. Rendered here from demo data."
      composedFrom={["Body", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockGallery } from "~/components/blocks/BlockGallery";

<BlockGallery block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockGallery block={sampleBlock("block_gallery")} />
    </ItemPage>
  );
}
