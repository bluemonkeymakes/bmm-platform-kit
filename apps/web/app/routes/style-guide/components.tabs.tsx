import type { MetaFunction } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Tabs" };

export const meta: MetaFunction = () => [
  { title: "Tabs | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsTabs() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Tabs</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Radix Tabs in a segmented control. Switches between peer views in the same context — never
          for navigation between pages. Active state, shadow, and surface all read from neutral tokens.
        </p>
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
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Default</h3>
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
      </section>
    </div>
  );
}
