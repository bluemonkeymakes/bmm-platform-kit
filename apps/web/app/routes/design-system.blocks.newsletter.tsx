import type { MetaFunction } from "react-router";
import { BlockNewsletter } from "~/components/blocks/BlockNewsletter";
import { sampleBlock } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Newsletter" };

export const meta: MetaFunction = () => [
  { title: "Newsletter | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Newsletter"
      blurb="Email capture band. CMS collection `block_newsletter`; BlockRenderer maps it to BlockNewsletter. Rendered here from demo data."
      composedFrom={["Body", "Button", "Container", "FadeIn", "Heading", "Input", "Section"]}
      usage={`import { BlockNewsletter } from "~/components/blocks/BlockNewsletter";

<BlockNewsletter block={block} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockNewsletter block={sampleBlock("block_newsletter")} />
    </ItemPage>
  );
}
