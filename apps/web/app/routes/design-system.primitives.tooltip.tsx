import type { MetaFunction } from "react-router";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { DualPreview } from "~/components/ds/Preview";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const handle = { title: "Tooltip" };

export const meta: MetaFunction = () => [
  { title: "Tooltip | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function PrimitivesTooltip() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Tooltip"
        blurb="A short label on hover or focus. Use the Tooltip wrapper for the common case; reach for the composable parts only when the trigger or the content needs its own props. Never put a link or anything interactive inside: use Popover for that."
      />

      <SpecimenSection title="Wrapper">
        <DualPreview align="center">
          <div className="flex gap-3">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side} content={`Shown on the ${side}`} side={side}>
                <Button variant="outline">{side}</Button>
              </Tooltip>
            ))}
          </div>
        </DualPreview>
      </SpecimenSection>

      <SpecimenSection title="Composable parts, rendered open">
        <DualPreview align="center" minHeight="10rem">
          <TooltipProvider>
            <TooltipRoot open>
              <TooltipTrigger asChild>
                <Button variant="outline">Always open</Button>
              </TooltipTrigger>
              <TooltipContent side="top">TooltipRoot + TooltipTrigger + TooltipContent</TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
        </DualPreview>
      </SpecimenSection>

      <CodeBlock
        code={`import { Tooltip } from "~/components/ui/tooltip";

<Tooltip content="Copy link" side="top">
  <Button variant="ghost">…</Button>
</Tooltip>

// Composable form. The wrapper brings its own provider; the parts do not,
// and nothing mounts one at the root, so wrap them yourself:
<TooltipProvider>
  <TooltipRoot>
    <TooltipTrigger asChild><Button>…</Button></TooltipTrigger>
    <TooltipContent side="right">…</TooltipContent>
  </TooltipRoot>
</TooltipProvider>`}
      />
    </div>
  );
}
