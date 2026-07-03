import type { MetaFunction } from "react-router";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Radio Group" };

export const meta: MetaFunction = () => [
  { title: "Radio Group | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const options = [
  { value: "keystone", label: "Keystone Site", hint: "Marketing site + CMS" },
  { value: "medusa", label: "Medusa Store", hint: "Headless commerce" },
  { value: "directus", label: "Directus + Twenty", hint: "CMS + CRM back office" },
];

export default function ComponentsRadioGroup() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Radio Group"
        blurb="A single choice from a small, visible set. Radix handles roving focus and arrow-key navigation; the dot and ring read from tokens. For more than a handful of options, use a Select."
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

<RadioGroup defaultValue="medusa">
  <label><RadioGroupItem value="keystone" /> Keystone Site</label>
  <label><RadioGroupItem value="medusa" /> Medusa Store</label>
</RadioGroup>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Choose a stack">
        <DualPreview minHeight="9rem">
          <RadioGroup defaultValue="medusa" className="w-full max-w-sm">
            {options.map((o) => (
              <label
                key={o.value}
                htmlFor={o.value}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:border-primary/40"
              >
                <RadioGroupItem value={o.value} id={o.value} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium text-neutral-800">{o.label}</span>
                  <span className="block text-xs text-neutral-500">{o.hint}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "2–5 mutually exclusive options the user should see all at once" },
            { pass: true, text: "Always have one selected by default unless 'none' is meaningful" },
            { pass: false, text: "Don't use for many options or multi-select — that's a Select or checkboxes" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
