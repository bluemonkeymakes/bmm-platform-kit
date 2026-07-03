import type { MetaFunction } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Tabs" };

export const meta: MetaFunction = () => [
  { title: "Tabs | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsTabs() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Tabs"
        blurb="Radix Tabs in a segmented control. Switches between peer views in the same context — never for navigation between pages. Active state, shadow, and surface all read from neutral tokens."
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
</Tabs>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Default">
        <DualPreview align="center" minHeight="9rem">
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-neutral-600">Summary metrics and recent highlights.</p>
            </TabsContent>
            <TabsContent value="activity">
              <p className="text-sm text-neutral-600">A reverse-chronological event feed.</p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-sm text-neutral-600">Preferences scoped to this resource.</p>
            </TabsContent>
          </Tabs>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Switch between peer views of the same object (overview / activity / settings)" },
            { pass: true, text: "Keep the label set small — 2 to 5 triggers; longer sets want a sidebar" },
            { pass: false, text: "Don't use for page navigation or multi-step flows — use links / a stepper" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
