import type { MetaFunction } from "react-router";
import { StatCard } from "~/components/ui/stat-card";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import { Users, CreditCard, Activity } from "lucide-react";

export const handle = { title: "Stat Card" };

export const meta: MetaFunction = () => [
  { title: "Stat Card | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsStatCard() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Stat Card"
        blurb={
          <>
            A single KPI: label, big value, and an optional trend delta. The delta's sign drives both the
            arrow and a success/destructive color — both from tokens. Rests at <code className="font-inconsolata text-primary">shadow-raised</code>.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { StatCard } from "~/components/ui/stat-card";

<StatCard label="Active users" value="12,480" icon={Users} delta={8.2} deltaLabel="vs last month" />`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Grid">
        <DualPreview minHeight="8rem">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Active users" value="12,480" icon={Users} delta={8.2} deltaLabel="vs last month" />
            <StatCard label="MRR" value="$48.2k" icon={CreditCard} delta={3.1} deltaLabel="vs last month" />
            <StatCard label="Error rate" value="0.42%" icon={Activity} delta={-1.4} deltaLabel="vs last week" />
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Headline metrics on a dashboard, three to four across" },
            { pass: true, text: "Pair a value with a trend so the number has context" },
            { pass: false, text: "Don't bury a call-to-action here — a stat card is read-only" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
