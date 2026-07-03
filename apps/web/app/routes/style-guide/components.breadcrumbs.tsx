import type { MetaFunction } from "react-router";
import { Breadcrumbs } from "~/components/ui/breadcrumbs";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Breadcrumbs" };

export const meta: MetaFunction = () => [
  { title: "Breadcrumbs | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsBreadcrumbs() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Breadcrumbs"
        blurb="A trail showing where the current page sits in the hierarchy. Ancestors are links; the last item is the current page — emphasized and not a link. Chevron separators from tokens."
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Breadcrumbs } from "~/components/ui/breadcrumbs";

<Breadcrumbs items={[
  { label: "Projects", href: "/projects" },
  { label: "Keystone Site", href: "/projects/keystone" },
  { label: "Settings" },
]} />`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Trail">
        <DualPreview align="center" minHeight="4rem">
          <Breadcrumbs
            items={[
              { label: "Projects", href: "/projects" },
              { label: "Keystone Site", href: "/projects/keystone" },
              { label: "Settings" },
            ]}
          />
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Deep hierarchies where users need to step back up a level" },
            { pass: true, text: "Keep the current page last and unlinked; truncate very long trails" },
            { pass: false, text: "Don't use for flat sites or linear flows — there's nothing to trace" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
