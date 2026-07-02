import type { MetaFunction } from "react-router";
import { Breadcrumbs } from "~/components/ui/breadcrumbs";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";

export const handle = { title: "Breadcrumbs" };

export const meta: MetaFunction = () => [
  { title: "Breadcrumbs | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsBreadcrumbs() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Breadcrumbs</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          A trail showing where the current page sits in the hierarchy. Ancestors are links; the last
          item is the current page — emphasized and not a link. Chevron separators from tokens.
        </p>
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
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Trail</h3>
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
      </section>
    </div>
  );
}
