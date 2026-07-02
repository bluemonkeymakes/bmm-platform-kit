import type { MetaFunction } from "react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DualPreview } from "~/components/ds/Preview";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";

export const handle = { title: "Cards" };

export const meta: MetaFunction = () => [
  { title: "Cards | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const slots = [
  { slot: "CardHeader", role: "Top padding block — holds Title + Description" },
  { slot: "CardTitle", role: "Display face, 2xl. The card's heading" },
  { slot: "CardDescription", role: "text-sm muted — one supporting line" },
  { slot: "CardContent", role: "Body region; pt-0 so it tucks under the header" },
  { slot: "CardFooter", role: "Action row — buttons and links, flex items-center" },
];

export default function ComponentsCards() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Cards</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Composed from Card + Header / Title / Description / Content / Footer slots. The surface is{" "}
          <code className="font-inconsolata text-primary">bg-neutral-50</code> +{" "}
          <code className="font-inconsolata text-primary">border-neutral-200</code> +{" "}
          <code className="font-inconsolata text-primary">shadow-raised</code> — the standard raised
          surface. Title uses the display face; body uses sans.
        </p>
      </div>

      {/* Anatomy */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Anatomy</h3>
        <DualPreview>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Discovery Audit</CardTitle>
              <CardDescription>A focused review of your funnel and tech stack.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Body content lives in CardContent. It inherits muted text and comfortable leading.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Book audit</Button>
              <Button size="sm" variant="ghost">Learn more</Button>
            </CardFooter>
          </Card>
        </DualPreview>
        <CodeBlock
          code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Discovery Audit</CardTitle>
    <CardDescription>A focused review of your funnel.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>
    <Button>Book audit</Button>
  </CardFooter>
</Card>`}
        />
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Slot</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {slots.map(({ slot, role }) => (
                <tr key={slot} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{slot}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Partial composition */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Partial Composition</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Slots are optional — a stat card may be Content-only, a link card Header-only. Skip slots, don't
          fake them with padding.
        </p>
        <DualPreview>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-inconsolata uppercase tracking-wider text-neutral-500">
                    Blocks
                  </span>
                  <Badge variant="secondary">CMS</Badge>
                </div>
                <p className="mt-2 text-2xl font-display font-medium text-neutral-800">15</p>
                <p className="mt-1 text-xs text-neutral-500">content block types</p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-overlay hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Building Custom Content Blocks</CardTitle>
                  <ArrowRight className="size-4 text-neutral-500" />
                </div>
                <CardDescription>
                  From Directus collection to rendered React component.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </DualPreview>
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Use the slots — Header/Title/Description/Content/Footer — not hand-rolled divs" },
            { pass: true, text: "Hover lift (translate + shadow-overlay) only when the whole card navigates somewhere" },
            { pass: true, text: "Layout classes at the call site are fine — w-full, max-w-sm, col-span" },
            { pass: false, text: "Don't nest a Card inside another Card — flatten or use a plain bordered div" },
            { pass: false, text: "Don't put multiple primary CTAs in one CardFooter" },
            { pass: false, text: "Don't override the card surface (bg, border color, shadow) at a call site" },
          ]}
        />
      </section>
    </div>
  );
}
