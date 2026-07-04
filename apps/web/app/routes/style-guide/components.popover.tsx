import type { MetaFunction } from "react-router";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormField } from "~/components/ui/form-field";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Popover" };

export const meta: MetaFunction = () => [
  { title: "Popover | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsPopover() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Popover"
        blurb={
          <>
            Radix Popover — a non-modal panel anchored to a trigger. For secondary UI that shouldn't
            take over the screen: quick edits, filters, info. Unlike Dialog it doesn't trap focus or
            dim the page. <code className="font-inconsolata text-primary">PopoverContent</code> takes{" "}
            <code className="font-inconsolata text-primary">align</code> and{" "}
            <code className="font-inconsolata text-primary">sideOffset</code>; a{" "}
            <code className="font-inconsolata text-primary">PopoverAnchor</code> is available when the
            panel should anchor to something other than the trigger.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Edit</Button></PopoverTrigger>
  <PopoverContent align="start" sideOffset={6}>…</PopoverContent>
</Popover>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Quick edit">
        <DualPreview align="center" minHeight="7rem">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Rename</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <div className="space-y-3">
                <FormField label="Display name" htmlFor="pop-name">
                  <Input id="pop-name" defaultValue="Blue Monkey" />
                </FormField>
                <Button size="sm" className="w-full">
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Inline, non-blocking secondary UI: quick edits, filters, detail peeks" },
            { pass: true, text: "Anchor it to the control that opened it; keep contents short" },
            { pass: false, text: "Don't use for blocking decisions or long forms — that's a Dialog" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
