import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { Wordmark } from "~/components/common/Wordmark";

export const handle = { title: "Wordmark" };

export const meta: MetaFunction = () => [
  { title: "Wordmark | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Wordmark"
      blurb="The brand wordmark as text, in both size variants (sm, md). Header and footer use it; a fork swaps the brand name, not the component."
      composedFrom={["CVA size variants (no primitives)", "router Link"]}
      usage={`import { Wordmark } from "~/components/common/Wordmark";

<Wordmark size="md" />`}
    >
      <div className="flex flex-col gap-4">
        <Wordmark size="sm" />
        <Wordmark size="md" />
      </div>
    </ItemPage>
  );
}
