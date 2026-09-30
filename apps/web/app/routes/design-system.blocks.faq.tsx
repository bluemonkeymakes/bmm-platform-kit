import type { MetaFunction } from "react-router";
import { BlockFAQ } from "~/components/blocks/BlockFAQ";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "FAQ" };

export const meta: MetaFunction = () => [
  { title: "FAQ | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="FAQ"
      blurb="Question/answer accordion list. CMS collection `block_faq`; BlockRenderer maps it to BlockFAQ. Rendered here from demo data."
      composedFrom={["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger", "Body", "Container", "FadeIn", "Heading", "Section"]}
      usage={`import { BlockFAQ } from "~/components/blocks/BlockFAQ";

<BlockFAQ block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockFAQ block={sampleBlock("block_faq")} />
    </ItemPage>
  );
}
