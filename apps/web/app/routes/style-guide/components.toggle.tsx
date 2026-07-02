import type { MetaFunction } from "react-router";
import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const handle = { title: "Toggle" };

export const meta: MetaFunction = () => [
  { title: "Toggle | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsToggle() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Toggle</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          A button with an on/off state, and a <code className="font-inconsolata text-primary">ToggleGroup</code>{" "}
          for a segmented set (single- or multi-select). The pressed state uses a primary tint. Pair
          icon-only toggles with an aria-label.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

<Toggle aria-label="Bold"><Bold /></Toggle>

<ToggleGroup type="single" defaultValue="left">
  <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
</ToggleGroup>`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Single toggles</h3>
        <DualPreview align="center" minHeight="5rem">
          <div className="flex items-center gap-2">
            <Toggle aria-label="Bold">
              <Bold />
            </Toggle>
            <Toggle aria-label="Italic">
              <Italic />
            </Toggle>
            <Toggle variant="outline">Outline</Toggle>
            <Toggle defaultPressed>On by default</Toggle>
          </div>
        </DualPreview>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Sizes</h3>
        <p className="text-xs text-neutral-500">
          Three sizes — sm for dense toolbars, default for most contexts, lg where the toggle is the
          main control. ToggleGroup passes its size down to every item.
        </p>
        <DualPreview align="center" minHeight="5rem">
          <div className="flex items-center gap-2">
            <Toggle size="sm" variant="outline" aria-label="Bold, small">
              <Bold />
            </Toggle>
            <Toggle size="default" variant="outline" aria-label="Bold, default">
              <Bold />
            </Toggle>
            <Toggle size="lg" variant="outline" aria-label="Bold, large">
              <Bold />
            </Toggle>
          </div>
        </DualPreview>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Toggle group</h3>
        <DualPreview align="center" minHeight="5rem">
          <div className="flex flex-wrap items-center gap-6">
            <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="multiple" aria-label="Text formatting">
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Single: pick one mode (alignment). Multiple: independent flags (bold/italic)" },
            { pass: true, text: "Use for view/format state, not for submitting actions" },
            { pass: false, text: "Don't use a toggle where a Switch (settings) or Checkbox (forms) is clearer" },
          ]}
        />
      </section>
    </div>
  );
}
