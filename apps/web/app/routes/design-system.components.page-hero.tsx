import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { PageHero } from "~/components/common/PageHero";

export const handle = { title: "Page hero" };

export const meta: MetaFunction = () => [
  { title: "Page hero | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Page hero"
      blurb="The inner-page masthead: optional label, the page title and a lead subtitle, with an optional actions slot."
      composedFrom={["Section", "Container", "Label", "Heading", "Body", "FadeIn"]}
      usage={`import { PageHero } from "~/components/common/PageHero";

<PageHero label="About" title="Who we are" subtitle="…" />`}
    >
      <PageHero
        label="About"
        title="Built by a small team that ships"
        subtitle="Content-driven sites and the stack behind them, from the CMS to the contact form."
      />
    </ItemPage>
  );
}
