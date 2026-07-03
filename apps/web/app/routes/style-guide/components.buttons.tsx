import type { MetaFunction } from "react-router";
import { useState } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DualPreview, type DualChildren } from "~/components/ds/Preview";
import { RuleList, type Rule } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Buttons" };

export const meta: MetaFunction = () => [
  { title: "Buttons | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

function VariantSection({
  label,
  desc,
  rules,
  children,
}: {
  label: string;
  desc: string;
  rules: Rule[];
  children: DualChildren;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-neutral-800">{label}</h4>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
      <DualPreview align="center" minHeight="5rem">
        {children}
      </DualPreview>
      <RuleList rules={rules} />
    </div>
  );
}

function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  function handleClick() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 2000);
  }
  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? "Sending…" : "Click to load"}
    </Button>
  );
}

export default function ComponentsButtons() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Buttons"
        blurb={
          <>
            CVA-based with named variants only. Seven variants × four sizes, a built-in{" "}
            <code className="font-inconsolata text-primary">loading</code> prop, and{" "}
            <code className="font-inconsolata text-primary">asChild</code> for link buttons. All states are
            defined in the component — call sites pick a variant and pass layout classes only.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Button } from "~/components/ui/button";

<Button variant="default">Save changes</Button>
<Button variant="outline" asChild><Link to="/about">Learn more</Link></Button>`}
          />
        </div>
      </PageIntro>

      {/* Variants */}
      <SpecimenSection title="Variants" className="space-y-8">

        <VariantSection
          label="Default"
          desc="Primary action — the most important action on the view."
          rules={[
            { pass: true, text: "One per view — confirm, submit, or navigate forward" },
            { pass: true, text: "Pair with Secondary or Outline for cancel/confirm flows" },
            { pass: false, text: "Never two Default buttons in the same row or card" },
            { pass: false, text: "Not for destructive actions — use the Destructive variant" },
          ]}
        >
          <Button variant="default">Save changes</Button>
        </VariantSection>

        <VariantSection
          label="Secondary"
          desc="Lower-emphasis action. Stands alone, or pairs with Default."
          rules={[
            { pass: true, text: "Pairs with Default for confirm/cancel and back/next — but doesn't require one" },
            { pass: true, text: "Fine standalone for a non-primary action, and safe to repeat in rows" },
            { pass: false, text: "Don't use where the action is the primary one — that's Default" },
            { pass: false, text: "Don't stack two emphasis levels for the same job — pick Secondary or Outline" },
          ]}
        >
          <div className="flex gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button variant="default">Confirm</Button>
          </div>
        </VariantSection>

        <VariantSection
          label="Outline"
          desc="Low-emphasis tertiary action. Sits below Default and Secondary."
          rules={[
            { pass: true, text: "Third in a button group, filter chips, toolbar actions" },
            { pass: true, text: "Multiple outline buttons can appear in the same row" },
            { pass: false, text: "Not the primary pair alongside Default — use Secondary for that" },
            { pass: false, text: "Avoid on busy surfaces where the border disappears" },
          ]}
        >
          <Button variant="outline">Export CSV</Button>
        </VariantSection>

        <VariantSection
          label="Ghost"
          desc="Minimal chrome — for icon-only and inline adjacent actions."
          rules={[
            { pass: true, text: "Icon-only triggers, dropdown toggles, dismiss buttons" },
            { pass: true, text: "Inline text-adjacent actions (edit, copy, view)" },
            { pass: false, text: "Never the only interactive element on a screen" },
            { pass: false, text: "Avoid in hero sections — no visual weight" },
          ]}
        >
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" aria-label="Search"><Search /></Button>
            <Button variant="ghost">Edit</Button>
          </div>
        </VariantSection>

        <VariantSection
          label="Destructive"
          desc="Irreversible or high-risk actions. Requires a confirmation step."
          rules={[
            { pass: true, text: "Delete, remove, revoke — actions that cannot be undone" },
            { pass: true, text: "Pair with a Ghost or Outline cancel inside a confirmation flow" },
            { pass: false, text: "Never adjacent to Default — too many high-intensity colors together" },
            { pass: false, text: "Don't use for navigation or neutral cancel actions" },
          ]}
        >
          <Button variant="destructive">Delete account</Button>
        </VariantSection>

        <VariantSection
          label="Link"
          desc="Inline text link — blends into body copy or card footers."
          rules={[
            { pass: true, text: "Inline actions within paragraphs — 'read more', 'view all'" },
            { pass: true, text: "Card footer secondary navigation" },
            { pass: false, text: "Don't use for primary actions — no visual weight for CTAs" },
            { pass: false, text: "Must stay distinguishable from body text (color + underline on hover)" },
          ]}
        >
          <Button variant="link">View all articles</Button>
        </VariantSection>

        <VariantSection
          label="CTA"
          desc="Default treatment plus elevation — rests raised, lifts to overlay on hover."
          rules={[
            { pass: true, text: "Hero and closing CTA bands — one per page section" },
            { pass: true, text: "Use size='lg' in heroes, size='default' elsewhere" },
            { pass: false, text: "Never two CTA buttons visible at the same time" },
            { pass: false, text: "Not for in-card or toolbar actions — the shadow reads as a page-level call" },
          ]}
        >
          <Button variant="cta" size="lg">Get started</Button>
        </VariantSection>
      </SpecimenSection>

      {/* Sizes */}
      <SpecimenSection title="Sizes">
        <p className="text-xs text-neutral-500">
          Three text sizes plus a square icon size. Default covers most contexts; lg for heroes; sm for
          dense rows and toolbars.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { size: "sm", label: "sm", desc: "h-9 — compact rows, toolbars" },
            { size: "default", label: "default", desc: "h-10 — the standard" },
            { size: "lg", label: "lg", desc: "h-11 — hero sections" },
          ] as const).map(({ size, label, desc }) => (
            <DualPreview key={size} label={`size="${label}" — ${desc}`} align="center" minHeight="4rem">
              <Button variant="default" size={size}>{label} button</Button>
            </DualPreview>
          ))}
        </div>
      </SpecimenSection>

      {/* Icon buttons */}
      <SpecimenSection title="Icon Buttons">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DualPreview label='size="icon" — square, no padding' align="center" minHeight="4rem">
            <div className="flex gap-2">
              <Button variant="default" size="icon" aria-label="Add"><Plus className="size-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="Search"><Search className="size-4" /></Button>
            </div>
          </DualPreview>
          <DualPreview label="Icon + label — gap-2 comes from the component" align="center" minHeight="4rem">
            <div className="flex gap-2">
              <Button variant="outline"><ArrowRight className="size-4" />Continue</Button>
              <Button variant="default">Get started <ArrowRight className="size-4" /></Button>
            </div>
          </DualPreview>
        </div>
      </SpecimenSection>

      {/* States */}
      <SpecimenSection title="States">
        <p className="text-xs text-neutral-500">
          Hover, active press (scale 0.98), focus ring, disabled, and loading are all defined in the
          component. The <code className="font-inconsolata text-primary">loading</code> prop disables the
          button and prepends a spinner.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DualPreview label="Loading — pass loading={true}" align="center" minHeight="4rem">
            <LoadingDemo />
          </DualPreview>
          <DualPreview label="Disabled" align="center" minHeight="4rem">
            <Button variant="default" disabled>Disabled</Button>
          </DualPreview>
        </div>
        <CodeBlock code={`<Button loading={isSubmitting}>Send message</Button>`} />
      </SpecimenSection>
    </div>
  );
}
