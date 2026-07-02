import type { MetaFunction } from "react-router";
import { Info } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { Tooltip } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { DualPreview } from "~/components/ds/Preview";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";

export const handle = { title: "Inputs" };

export const meta: MetaFunction = () => [
  { title: "Inputs | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsInputs() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Inputs & Form Primitives</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Form controls share one field treatment — <code className="font-inconsolata text-primary">border-neutral-200</code>{" "}
          on <code className="font-inconsolata text-primary">bg-neutral-50</code>, ring on focus, destructive
          border + ring when <code className="font-inconsolata text-primary">aria-invalid</code>. This is
          exactly how the contact form signals validation errors.
        </p>
      </div>

      {/* Text input */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Text Input</h3>
        <DualPreview minHeight="5rem">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="sg-email">Work email</Label>
            <Input id="sg-email" type="email" placeholder="you@company.com" />
          </div>
        </DualPreview>
        <CodeBlock
          code={`<Label htmlFor="email">Work email</Label>
<Input id="email" type="email" placeholder="you@company.com" />`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Always pair an Input with a Label tied via htmlFor / id" },
            { pass: true, text: "Use type to get the right keyboard + validation (email, tel, url)" },
            { pass: false, text: "Never use placeholder as the only label — it disappears on input" },
            { pass: false, text: "Don't set a fixed px width — let the container constrain it" },
          ]}
        />
      </section>

      {/* States */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">States</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DualPreview label="Default → focus (click in)" align="center" minHeight="4rem">
            <Input placeholder="Focus me" className="max-w-56" />
          </DualPreview>
          <DualPreview label="Disabled" align="center" minHeight="4rem">
            <Input placeholder="Disabled" disabled className="max-w-56" />
          </DualPreview>
          <DualPreview label='Invalid — aria-invalid="true"' align="center" minHeight="4rem">
            <Input defaultValue="not-an-email" aria-invalid="true" className="max-w-56" />
          </DualPreview>
          <DualPreview label="Read-only" align="center" minHeight="4rem">
            <Input defaultValue="ACME-2026-001" readOnly className="max-w-56" />
          </DualPreview>
        </div>
        <CodeBlock
          label="Error pattern — as used by the contact form"
          code={`<Input
  id="email"
  type="email"
  aria-invalid={errors.email ? "true" : undefined}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
)}`}
        />
      </section>

      {/* Textarea */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Textarea</h3>
        <DualPreview label="Same field treatment, vertical resize">
          <div className="w-full max-w-md space-y-1.5">
            <Label htmlFor="sg-msg">Message</Label>
            <Textarea id="sg-msg" placeholder="Tell us what you're building…" rows={3} />
          </div>
        </DualPreview>
      </section>

      {/* Tooltip */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Tooltip</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Hover/focus hint on an inverted surface (<code className="font-inconsolata text-primary">bg-neutral-800</code>,{" "}
          <code className="font-inconsolata text-primary">shadow-overlay</code>). Icon-only buttons always
          get one; labeled buttons never do.
        </p>
        <DualPreview align="center" minHeight="5rem">
          <div className="flex items-center gap-4">
            <Tooltip content="More information">
              <Button variant="ghost" size="icon" aria-label="More information">
                <Info className="size-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Opens below the trigger" side="bottom">
              <Button variant="outline" size="icon" aria-label="Help">
                <span className="text-sm">?</span>
              </Button>
            </Tooltip>
            <span className="text-xs text-neutral-500">Hover or focus the icons</span>
          </div>
        </DualPreview>
        <CodeBlock code={`<Tooltip content="More information" side="top">
  <Button variant="ghost" size="icon" aria-label="More information"><Info /></Button>
</Tooltip>`} />
      </section>

      {/* Spinner + Separator */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Spinner & Separator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DualPreview label="Spinner — sm / default / lg, currentColor" align="center" minHeight="5rem">
            <div className="flex items-center gap-6 text-neutral-800">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
            </div>
          </DualPreview>
          <DualPreview label="Separator — horizontal and vertical, bg-neutral-200" minHeight="5rem">
            <div className="w-full space-y-3">
              <p className="text-sm text-neutral-800">Above the line</p>
              <Separator />
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <span>Docs</span>
                <Separator orientation="vertical" className="h-4" />
                <span>API</span>
                <Separator orientation="vertical" className="h-4" />
                <span>CMS</span>
              </div>
            </div>
          </DualPreview>
        </div>
      </section>

      {/* Full form in context */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">In Context — Contact Form</h3>
        <DualPreview minHeight="auto">
          <form className="w-full max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sg-fn">First name</Label>
                <Input id="sg-fn" placeholder="Jane" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sg-ln">Last name</Label>
                <Input id="sg-ln" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sg-brief">Message</Label>
              <Textarea id="sg-brief" placeholder="How can we help?" rows={3} />
            </div>
            <Button type="submit">Send message</Button>
          </form>
        </DualPreview>
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Signal errors with aria-invalid + a described-by message — styling follows automatically" },
            { pass: true, text: "Tooltips on every icon-only button, tied to an aria-label" },
            { pass: true, text: "Use the Button loading prop (which renders Spinner) for async submits" },
            { pass: false, text: "Don't color a field red manually — aria-invalid drives the destructive treatment" },
            { pass: false, text: "Don't put essential information only in a tooltip" },
            { pass: false, text: "Don't use Separator decoratively between every element — it marks real group boundaries" },
          ]}
        />
      </section>
    </div>
  );
}
