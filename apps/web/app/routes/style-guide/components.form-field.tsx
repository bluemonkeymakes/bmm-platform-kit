import type { MetaFunction } from "react-router";
import { FormField } from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select } from "~/components/ui/select";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Form Field" };

export const meta: MetaFunction = () => [
  { title: "Form Field | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsFormField() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Form Field"
        blurb={
          <>
            A wrapper that lays out a label, a control, and a single hint or error line. It's deliberately
            library-agnostic — it owns no form state, so it pairs with any input and any form library.
            When <code className="font-inconsolata text-primary">error</code> is set it replaces the description.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { FormField } from "~/components/ui/form-field";

<FormField label="Project name" htmlFor="name" description="Lowercase, no spaces.">
  <Input id="name" placeholder="keystone-site" />
</FormField>

<FormField label="Email" htmlFor="email" error="Enter a valid email." required>
  <Input id="email" aria-invalid defaultValue="not-an-email" />
</FormField>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="A small form">
        <DualPreview minHeight="16rem">
          <div className="w-full max-w-sm space-y-5">
            <FormField label="Project name" htmlFor="ff-name" description="Lowercase, no spaces.">
              <Input id="ff-name" placeholder="keystone-site" />
            </FormField>
            <FormField label="Region" htmlFor="ff-region">
              <Select id="ff-region" defaultValue="eu">
                <option value="eu">Europe (Hetzner)</option>
                <option value="us">US East</option>
              </Select>
            </FormField>
            <FormField label="Notes" htmlFor="ff-notes" description="Optional, shown to your team.">
              <Textarea id="ff-notes" placeholder="Anything worth noting…" />
            </FormField>
            <FormField label="Email" htmlFor="ff-email" error="Enter a valid email address." required>
              <Input id="ff-email" aria-invalid defaultValue="not-an-email" />
            </FormField>
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Every labelled control in a form — keeps label, hint, and error consistent" },
            { pass: true, text: "Wire htmlFor to the control id; set the control's aria-invalid alongside error" },
            { pass: false, text: "Don't reach past it to style labels/errors per-field — that's the drift it prevents" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
