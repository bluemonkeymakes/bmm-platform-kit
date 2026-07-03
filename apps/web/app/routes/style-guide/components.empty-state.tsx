import type { MetaFunction } from "react-router";
import { EmptyState } from "~/components/ui/empty-state";
import { Button } from "~/components/ui/button";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import { Inbox, Plus } from "lucide-react";

export const handle = { title: "Empty State" };

export const meta: MetaFunction = () => [
  { title: "Empty State | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsEmptyState() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Empty State"
        blurb={
          <>
            The "nothing here yet" surface. It names what's missing, says why, and offers a way forward.
            A dashed border keeps it clearly provisional rather than a real container.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { EmptyState } from "~/components/ui/empty-state";

<EmptyState
  icon={Inbox}
  title="No deployments yet"
  description="Deploy a stack from the gallery to see it here."
  action={<Button>New deployment</Button>}
/>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="With action">
        <DualPreview minHeight="12rem">
          <EmptyState
            className="w-full max-w-md"
            icon={Inbox}
            title="No deployments yet"
            description="Deploy a stack from the gallery and it'll show up here with its status and logs."
            action={
              <Button>
                <Plus /> New deployment
              </Button>
            }
          />
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "First-run, empty lists, cleared filters, zero search results" },
            { pass: true, text: "Always give the next step — the action turns a dead end into a start" },
            { pass: false, text: "Don't use for errors — an empty state is calm, an error needs a different tone" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
