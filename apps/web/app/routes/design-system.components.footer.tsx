import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { Footer } from "~/components/layout/Footer";

export const handle = { title: "Footer" };

export const meta: MetaFunction = () => [
  { title: "Footer | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Footer"
      blurb="The site footer: link columns and the legal line."
      composedFrom={["Container", "Wordmark", "Label", "Body", "router Link"]}
      usage={`import { Footer } from "~/components/layout/Footer";

<Footer />`}
    >
      <Footer />
    </ItemPage>
  );
}
