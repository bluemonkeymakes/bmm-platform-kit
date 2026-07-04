import type { MetaFunction } from "react-router";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Accordion" };

export const meta: MetaFunction = () => [
  { title: "Accordion | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const faqs = [
  {
    q: "What is a stack?",
    a: "A pre-integrated set of open-source services — CMS, commerce, CRM — deployed together and ready to use on day one.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. You own your stack from day one. Stay managed, or take it with you and self-host whenever you like.",
  },
  {
    q: "Can I customize it?",
    a: "Extend safely without breaking the system: customize frontend components and add your own services, governed by the same standards.",
  },
];

export default function ComponentsAccordion() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Accordion"
        blurb={
          <>
            Collapsible sections that show one piece of content at a time. The height animates via the
            system <code className="font-inconsolata text-primary">accordion-down/up</code> keyframes; the
            chevron rotates on open. Use <code className="font-inconsolata text-primary">type="single"</code>{" "}
            for FAQs, <code className="font-inconsolata text-primary">"multiple"</code> when several can be open.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>What is a stack?</AccordionTrigger>
    <AccordionContent>A pre-integrated set of services…</AccordionContent>
  </AccordionItem>
</Accordion>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="FAQ">
        <DualPreview minHeight="12rem">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full max-w-lg">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Long, scannable lists where users want one section at a time (FAQs, settings groups)" },
            { pass: true, text: "Write trigger labels as the question/summary, not 'Section 1'" },
            { pass: false, text: "Don't hide essential or short content behind a click — just show it" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
