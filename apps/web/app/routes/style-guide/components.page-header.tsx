import type { MetaFunction } from "react-router";
import { PageHeader } from "~/components/ui/page-header";
import { Breadcrumbs } from "~/components/ui/breadcrumbs";
import { Button } from "~/components/ui/button";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { Plus, Settings } from "lucide-react";

export const handle = { title: "Page Header" };

export const meta: MetaFunction = () => [
  { title: "Page Header | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsPageHeader() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Page Header</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          The standard masthead for an app page: optional breadcrumbs, a title and description, and a
          right-aligned actions slot that wraps below the title on narrow screens.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { PageHeader } from "~/components/ui/page-header";

<PageHeader
  breadcrumbs={<Breadcrumbs items={[…]} />}
  title="Deployments"
  description="Every stack you've shipped, with status and logs."
  actions={<Button><Plus /> New</Button>}
/>`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Full masthead</h3>
        <DualPreview minHeight="9rem">
          <div className="w-full">
            <PageHeader
              breadcrumbs={
                <Breadcrumbs
                  items={[{ label: "Workspace", href: "#" }, { label: "Deployments" }]}
                />
              }
              title="Deployments"
              description="Every stack you've shipped, with status, logs, and one-click rollback."
              actions={
                <>
                  <Button variant="outline">
                    <Settings /> Settings
                  </Button>
                  <Button>
                    <Plus /> New
                  </Button>
                </>
              }
            />
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "The top of an app/dashboard page — one per page, above the content" },
            { pass: true, text: "Keep to one primary action; secondary actions stay quieter (outline/ghost)" },
            { pass: false, text: "Don't stack multiple headers or use on marketing pages — those use hero patterns" },
          ]}
        />
      </section>
    </div>
  );
}
