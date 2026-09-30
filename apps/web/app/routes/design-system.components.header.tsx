import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { Header } from "~/components/layout/Header";

export const handle = { title: "Header" };

export const meta: MetaFunction = () => [
  { title: "Header | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Header"
      blurb="The site header: wordmark, main navigation, theme toggle, and a collapsible menu on small screens. It does not link to /design-system: the design system is reachable by URL only."
      composedFrom={["Container", "Wordmark", "Button", "Tooltip", "router Link"]}
      usage={`import { Header } from "~/components/layout/Header";

<Header />`}
    >
      <Header />
    </ItemPage>
  );
}
