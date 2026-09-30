import type { MetaFunction } from "react-router";
import { BlockTeam } from "~/components/blocks/BlockTeam";
import { sampleBlock, sampleContext } from "~/components/ds/block-samples";
import { ItemPage } from "~/components/ds/ItemPage";

export const handle = { title: "Team" };

export const meta: MetaFunction = () => [
  { title: "Team | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Team"
      blurb="Team member cards fed from the team collection. CMS collection `block_team`; BlockRenderer maps it to BlockTeam. Rendered here from demo data."
      composedFrom={["Avatar", "Body", "Card", "CardContent", "Container", "Heading", "Section", "StaggerContainer", "StaggerItem"]}
      usage={`import { BlockTeam } from "~/components/blocks/BlockTeam";

<BlockTeam block={block} context={context} />  // usually via <BlockRenderer blocks={page.blocks} />`}
    >
      <BlockTeam block={sampleBlock("block_team")} context={sampleContext} />
    </ItemPage>
  );
}
