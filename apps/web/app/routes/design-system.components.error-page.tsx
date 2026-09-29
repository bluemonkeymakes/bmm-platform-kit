import type { MetaFunction } from "react-router";
import { ItemPage } from "~/components/ds/ItemPage";
import { ErrorPage } from "~/components/common/ErrorPage";

export const handle = { title: "Error page" };

export const meta: MetaFunction = () => [
  { title: "Error page | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function Page() {
  return (
    <ItemPage
      title="Error page"
      blurb="The 404 and 500 surface the error boundaries render, with a way back to the site."
      composedFrom={["Container", "Heading", "Body", "Button"]}
      usage={`import { ErrorPage } from "~/components/common/ErrorPage";

<ErrorPage status={404} title="Page not found" description="…" />`}
    >
      <ErrorPage
        status={404}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
      />
    </ItemPage>
  );
}
