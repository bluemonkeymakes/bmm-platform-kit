import type { MetaFunction } from "react-router";
import { BlockTestimonials } from "~/components/blocks/BlockTestimonials";
import { sampleBlock, sampleContext } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Testimonials" };

export const meta: MetaFunction = () => [
  { title: "Testimonials | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Testimonials"
      blurb="Quote cards fed from the testimonials collection. CMS collection `block_testimonials`; BlockRenderer maps it to BlockTestimonials. Rendered here from demo data."
      composedFrom={["Avatar", "Body", "Card", "CardContent", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockTestimonials } from "~/components/blocks/BlockTestimonials";

<BlockTestimonials block={block} context={context} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockTestimonials block={sampleBlock("block_testimonials")} context={sampleContext} />
    </ItemPage>
  );
}
