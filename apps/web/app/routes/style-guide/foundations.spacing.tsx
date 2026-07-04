import type { MetaFunction } from "react-router";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Spacing" };

export const meta: MetaFunction = () => [
  { title: "Spacing | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const spacingScale = [
  { name: "xs", rem: "0.25rem", tailwind: "p-1", px: "4px" },
  { name: "sm", rem: "0.5rem", tailwind: "p-2", px: "8px" },
  { name: "md", rem: "0.75rem", tailwind: "p-3", px: "12px" },
  { name: "base", rem: "1rem", tailwind: "p-4", px: "16px" },
  { name: "lg", rem: "1.25rem", tailwind: "p-5", px: "20px" },
  { name: "xl", rem: "1.5rem", tailwind: "p-6", px: "24px" },
  { name: "2xl", rem: "2rem", tailwind: "p-8", px: "32px" },
  { name: "3xl", rem: "3rem", tailwind: "p-12", px: "48px" },
  { name: "4xl", rem: "4rem", tailwind: "p-16", px: "64px" },
];

const containers = [
  { size: "reading", width: "max-w of 40.625rem (650px)", use: "Prose measure" },
  { size: "narrow", width: "max-w-3xl (768px)", use: "Reading columns, forms, centered heroes" },
  { size: "standard", width: "max-w-5xl (1024px) — default", use: "Standard page content" },
  { size: "wide", width: "max-w-6xl (1152px)", use: "Block grids, galleries, data views" },
  { size: "full", width: "max-w-none", use: "Full-bleed bands" },
];

const sectionPadding = [
  { step: "sm", cls: "py-8 md:py-12", use: "The visual is the section (hero image/video)" },
  { step: "md", cls: "py-12 md:py-16", use: "Sub-sections inside long detail pages" },
  { step: "lg", cls: "py-16 md:py-24", use: "Default — most content blocks" },
  { step: "xl", cls: "py-24 md:py-32", use: "Climactic: hero / closing CTA — one per page" },
];

export default function FoundationsSpacing() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Spacing"
        blurb={
          <>
            All spacing uses Tailwind's 0.25rem numeric grid. One-off layout spacing picks a numeric step
            (<code className="font-inconsolata text-primary">gap-4</code>,{" "}
            <code className="font-inconsolata text-primary">mt-8</code>); page structure comes from the{" "}
            <code className="font-inconsolata text-primary">Container</code> and{" "}
            <code className="font-inconsolata text-primary">Section</code> primitives so vertical rhythm stays
            consistent across every route.
          </>
        }
      />

      {/* Base grid */}
      <SpecimenSection title="Base Grid Scale">
        <div className="space-y-2">
          {spacingScale.map(({ name, rem, tailwind, px }) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-16 shrink-0">
                <span className="text-xs font-medium font-inconsolata text-neutral-500">{name}</span>
              </div>
              <div
                className="bg-primary/20 border border-primary/30 rounded-sm shrink-0"
                style={{ width: rem, height: "1.5rem" }}
              />
              <div className="flex gap-4 text-xs font-inconsolata text-neutral-500">
                <span className="text-primary">{tailwind}</span>
                <span>{rem}</span>
                <span className="text-neutral-500/60">{px}</span>
              </div>
            </div>
          ))}
        </div>
      </SpecimenSection>

      {/* Container */}
      <SpecimenSection title="Container">
        <p className="text-xs text-neutral-500 max-w-2xl">
          Centers content and owns the horizontal padding (
          <code className="font-inconsolata text-primary">px-6</code>). Five sizes; default is{" "}
          <code className="font-inconsolata text-primary">standard</code>. A{" "}
          <code className="font-inconsolata text-primary">HalfContainer</code> variant aligns content to one
          half for split layouts with a full-bleed sibling.
        </p>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">size</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Width</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden md:table-cell">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {containers.map(({ size, width, use }) => (
                <tr key={size} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{size}</td>
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-neutral-500">{width}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 hidden md:table-cell">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Visual demo — nested width bars */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
          <div className="mx-auto w-full rounded-md bg-primary/10 border border-primary/20 px-3 py-1.5">
            <span className="text-2xs font-inconsolata text-neutral-500">wide</span>
          </div>
          <div className="mx-auto w-4/5 rounded-md bg-primary/15 border border-primary/25 px-3 py-1.5">
            <span className="text-2xs font-inconsolata text-neutral-500">standard</span>
          </div>
          <div className="mx-auto w-3/5 rounded-md bg-primary/20 border border-primary/30 px-3 py-1.5">
            <span className="text-2xs font-inconsolata text-neutral-500">narrow</span>
          </div>
          <div className="mx-auto w-2/5 rounded-md bg-primary/25 border border-primary/35 px-3 py-1.5">
            <span className="text-2xs font-inconsolata text-neutral-500">reading</span>
          </div>
        </div>
      </SpecimenSection>

      {/* Section */}
      <SpecimenSection title="Section">
        <p className="text-xs text-neutral-500 max-w-2xl">
          Owns vertical rhythm between page bands via a 4-step{" "}
          <code className="font-inconsolata text-primary">padding</code> scale (default{" "}
          <code className="font-inconsolata text-primary">lg</code>) and a{" "}
          <code className="font-inconsolata text-primary">tone</code> axis (
          <code className="font-inconsolata text-primary">default</code> ·{" "}
          <code className="font-inconsolata text-primary">muted</code> ·{" "}
          <code className="font-inconsolata text-primary">brand</code>). Every content block wraps itself in
          a Section so pages composed from CMS blocks keep an even beat.
        </p>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">padding</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Classes</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden md:table-cell">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {sectionPadding.map(({ step, cls, use }) => (
                <tr key={step} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{step}</td>
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-neutral-500">{cls}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 hidden md:table-cell">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-100/60 px-6 py-2 text-2xs font-inconsolata text-neutral-500 uppercase tracking-wider">
            Section rhythm (scaled down)
          </div>
          <div className="divide-y divide-neutral-200">
            {["Hero band", "Feature band", "CTA band"].map((band) => (
              <div key={band} className="py-8 px-6 bg-neutral-50">
                <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-100/40 px-4 py-3">
                  <span className="text-xs font-inconsolata text-neutral-500">{band}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CodeBlock
          code={`import { Container, Section } from "~/components/ui/layout";

<Section>                          {/* padding="lg" tone="default" */}
  <Container size="narrow">…</Container>
</Section>

<Section tone="brand" padding="xl">…</Section>`}
        />
      </SpecimenSection>

      {/* Rules */}
      <SpecimenSection title="Rules">
        <RuleList
          rules={[
            { pass: true, text: "Pick numeric steps for one-off layout spacing — gap-4, mt-8, space-y-12" },
            { pass: true, text: "Use Section + Container for page structure instead of hand-rolled padding" },
            { pass: true, text: "Let the container constrain width — children stay w-full / max-w-*" },
            { pass: false, text: "No arbitrary pixel values — the 0.25rem grid is the menu" },
            { pass: false, text: "Don't re-implement Section's py-16 md:py-24 inline in a route" },
            { pass: false, text: "Don't set fixed pixel widths on content — breakpoints + max-w handle it" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
