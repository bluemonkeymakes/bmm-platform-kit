import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Switch } from "~/components/ui/switch";
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

function SwitchDemo() {
  const [notify, setNotify] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Switch checked={notify} onCheckedChange={setNotify} aria-label="Toggle notifications" />
      <span className="text-sm text-neutral-800">
        {notify ? "Notifications on" : "Notifications off"}
      </span>
    </div>
  );
}

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

      {/* Select */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Select</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          A native <code className="font-inconsolata text-primary">select</code> on the shared field
          treatment, with a custom chevron. Children are plain{" "}
          <code className="font-inconsolata text-primary">&lt;option&gt;</code> elements — no custom
          listbox to maintain, and mobile pickers work for free.
        </p>
        <DualPreview label="Native select, custom chevron" minHeight="5rem">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="sg-budget">Budget range</Label>
            <Select id="sg-budget" defaultValue="">
              <option value="" disabled>
                Choose a range
              </option>
              <option>Under $5k</option>
              <option>$5k – $15k</option>
              <option>$15k+</option>
            </Select>
          </div>
        </DualPreview>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["sm", "default", "lg"] as const).map((s) => (
            <DualPreview key={s} label={`inputSize="${s}"`} align="center" minHeight="4rem">
              <Select inputSize={s} defaultValue={s} className="max-w-48" aria-label={`${s} select`}>
                <option>{s}</option>
              </Select>
            </DualPreview>
          ))}
        </div>
        <CodeBlock
          code={`<Label htmlFor="budget">Budget range</Label>
<Select id="budget" inputSize="default" defaultValue="">
  <option value="" disabled>Choose a range</option>
  <option>Under $5k</option>
</Select>`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Use for 5+ options where only one applies — under 5, prefer RadioGroup" },
            { pass: true, text: "First option is a disabled placeholder when there's no sensible default" },
            { pass: false, text: "Don't rebuild the dropdown — the native picker is the accessible one" },
          ]}
        />
      </section>

      {/* Checkbox + Switch */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Checkbox & Switch</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          <code className="font-inconsolata text-primary">Checkbox</code> is a native input — pass any
          input props (<code className="font-inconsolata">defaultChecked</code>,{" "}
          <code className="font-inconsolata">disabled</code>, form <code className="font-inconsolata">name</code>).{" "}
          <code className="font-inconsolata text-primary">Switch</code> is a controlled toggle:{" "}
          <code className="font-inconsolata">checked</code> +{" "}
          <code className="font-inconsolata">onCheckedChange</code>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DualPreview label="Checkbox — multi-select, explicit consent" minHeight="6rem">
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-sm text-neutral-800">
                <Checkbox defaultChecked /> Email me product updates
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-800">
                <Checkbox /> Subscribe to the newsletter
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-500">
                <Checkbox disabled /> Unavailable option
              </label>
            </div>
          </DualPreview>
          <DualPreview label="Switch — instant on/off setting (click it)" minHeight="6rem">
            <div className="space-y-3">
              <SwitchDemo />
              <div className="flex items-center gap-3">
                <Switch disabled aria-label="Disabled switch" />
                <span className="text-sm text-neutral-500">Disabled</span>
              </div>
            </div>
          </DualPreview>
        </div>
        <CodeBlock
          code={`<label className="flex items-center gap-2 text-sm">
  <Checkbox name="updates" defaultChecked /> Email me product updates
</label>

const [notify, setNotify] = useState(true);
<Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Checkbox for multi-select lists and explicit consent (terms)" },
            { pass: true, text: "Switch for a single setting that applies immediately, no save step" },
            { pass: false, text: "Don't use a Switch inside a form that needs a submit to take effect" },
            { pass: false, text: "Don't use a single checkbox where a Switch reads more clearly" },
          ]}
        />
        <p className="text-xs text-neutral-500 max-w-2xl">
          Composing any of these controls with a label, description, and error message? The{" "}
          <Link
            to="/style-guide/components/form-field"
            className="text-primary hover:underline underline-offset-2"
          >
            Form Field
          </Link>{" "}
          page covers that wiring. Single-choice option sets have their own page — see RadioGroup.
        </p>
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
