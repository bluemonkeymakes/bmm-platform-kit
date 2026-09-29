import type { MetaFunction } from "react-router";
import { BlockContact } from "~/components/blocks/BlockContact";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Contact" };

export const meta: MetaFunction = () => [
  { title: "Contact | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Contact"
      blurb="Contact info / form embed section. CMS collection `block_contact`; BlockRenderer maps it to BlockContact. Rendered here from demo data."
      composedFrom={["Body", "Button", "Container", "FadeIn", "Heading", "Input", "Label", "Section", "Textarea"]}
      usage={`import { BlockContact } from "~/components/blocks/BlockContact";

<BlockContact block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockContact block={sampleBlock("block_contact")} />
    </ItemPage>
  );
}
