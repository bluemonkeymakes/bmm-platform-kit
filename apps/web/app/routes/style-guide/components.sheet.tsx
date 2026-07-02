import type { MetaFunction } from "react-router";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { FormField } from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";

export const handle = { title: "Sheet" };

export const meta: MetaFunction = () => [
  { title: "Sheet | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const sides = ["left", "right", "top", "bottom"] as const;

export default function ComponentsSheet() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Sheet</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          A panel that slides in from an edge, built on the Dialog primitive — so it traps focus and
          dims the page the same way. Good for filters, detail views, and side forms that shouldn't
          take over the whole screen. Four sides; rests at <code className="font-inconsolata text-primary">shadow-modal</code>.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
    …
  </SheetContent>
</Sheet>`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">From any edge</h3>
        <DualPreview align="center" minHeight="6rem">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sides.map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {side}
                  </Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow the deployment list. Changes apply on save.</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4">
                    <FormField label="Project" htmlFor="sheet-project">
                      <Input id="sheet-project" placeholder="Search projects…" />
                    </FormField>
                    <FormField label="Environment" htmlFor="sheet-env">
                      <Input id="sheet-env" placeholder="production" />
                    </FormField>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button>Apply filters</Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Side forms, filters, and detail panels that keep page context visible behind" },
            { pass: true, text: "Right side is the default for desktop; bottom suits mobile" },
            { pass: false, text: "Don't use for a quick confirmation (Dialog) or a small anchored menu (Popover)" },
          ]}
        />
      </section>
    </div>
  );
}
