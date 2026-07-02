import type { MetaFunction } from "react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";
import { FadeIn, StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";

export const handle = { title: "Motion" };

export const meta: MetaFunction = () => [
  { title: "Motion | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const durations = [
  { name: "fast", cls: "duration-150", ms: "150ms", use: "Hovers, color shifts, focus rings" },
  { name: "base", cls: "duration-200", ms: "200ms", use: "Component transitions — buttons, inputs, cards" },
  { name: "entrance", cls: "0.5s (motion wrappers)", ms: "500ms", use: "FadeIn / stagger scroll entrances" },
];

const wrappers = [
  { name: "FadeIn", props: "delay, direction (up/down/left/right)", use: "Single element entering on scroll" },
  { name: "StaggerContainer", props: "wraps StaggerItem children", use: "Grid or list revealing in sequence (0.1s apart)" },
  { name: "StaggerItem", props: "—", use: "One child of a StaggerContainer" },
];

export default function FoundationsMotion() {
  // Remount key so the whileInView entrances can be replayed on demand.
  const [runId, setRunId] = useState(0);

  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Motion</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Motion confirms an action or eases content in — never decoration for its own sake. Two engines:
          plain <code className="font-inconsolata text-primary">transition-*</code> utilities for
          hover/focus/press feedback, and the{" "}
          <code className="font-inconsolata text-primary">motion/react</code>-powered wrappers in{" "}
          <code className="font-inconsolata text-primary">~/components/common/MotionWrapper</code> for
          scroll entrances.
        </p>
      </div>

      {/* Wrappers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium font-display text-neutral-800">Entrance Wrappers</h3>
          <button
            type="button"
            onClick={() => setRunId((n) => n + 1)}
            className="inline-flex items-center gap-1.5 text-xs font-inconsolata uppercase tracking-wider text-primary hover:underline"
          >
            <RotateCcw className="size-3" /> Replay
          </button>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Fire once when scrolled into view (<code className="font-inconsolata">whileInView</code>,{" "}
          <code className="font-inconsolata">once: true</code>) with a decelerating ease. FadeIn moves a
          single element; the stagger pair reveals grids 0.1s apart.
        </p>
        <div key={runId} className="space-y-4">
          <FadeIn>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-raised">
              <p className="text-sm font-medium text-neutral-800">FadeIn</p>
              <p className="text-xs text-neutral-500 mt-1">opacity 0→1, y 20→0, 0.5s ease-out curve</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Stagger item 1", "Stagger item 2", "Stagger item 3"].map((label) => (
              <StaggerItem key={label}>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-raised">
                  <p className="text-sm font-medium text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-500 mt-1">0.1s behind its sibling</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Wrapper</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden sm:table-cell">Props</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {wrappers.map(({ name, props, use }) => (
                <tr key={name} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary">{name}</td>
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-neutral-500 hidden sm:table-cell">{props}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock
          code={`import { FadeIn, StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";

<FadeIn delay={0.1}>
  <Heading as="h1" size="2xl" variant="display">Headline</Heading>
</FadeIn>

<StaggerContainer className="grid md:grid-cols-3 gap-8">
  {items.map((item) => (
    <StaggerItem key={item.id}>…</StaggerItem>
  ))}
</StaggerContainer>`}
        />
      </section>

      {/* Durations */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Durations</h3>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Class / source</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden md:table-cell">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {durations.map(({ name, cls, ms, use }) => (
                <tr key={name} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 font-inconsolata text-sm font-medium text-primary">{name}</td>
                  <td className="px-4 py-2.5 font-inconsolata text-xs text-neutral-500">{cls}</td>
                  <td className="px-4 py-2.5 font-inconsolata text-xs text-neutral-500">{ms}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500 hidden md:table-cell">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Standard transition */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Interaction Feedback</h3>
        <p className="text-xs text-neutral-500">
          The workhorse for hover/press: <code className="font-inconsolata text-primary">transition-all duration-200</code>{" "}
          with <code className="font-inconsolata text-primary">active:scale-[0.98]</code> press feedback —
          already baked into Button and Card, never re-added at call sites. Hover and press below.
        </p>
        <div className="flex gap-4">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 shadow-raised px-6 py-4 transition-all duration-200 hover:shadow-overlay hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer">
            <p className="text-sm text-neutral-800">Hover + press me</p>
          </div>
        </div>
      </section>

      {/* Reduced motion */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Reduced Motion</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          When the OS asks for less motion (<code className="font-inconsolata text-primary">prefers-reduced-motion: reduce</code>),
          the system honors it: the global guard in{" "}
          <code className="font-inconsolata text-primary">app/system/theme.css</code> collapses CSS
          animations and transitions to an instant frame, and animations added through{" "}
          <code className="font-inconsolata text-primary">tw-animate-css</code> utilities respect the same
          guard. Keep entrances opacity/transform-only so a skipped animation never hides content —
          the wrappers already end at the element's natural position.
        </p>
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Reach for FadeIn / Stagger wrappers for scroll entrances — never hand-rolled keyframes" },
            { pass: true, text: "transition-colors / transition-all at duration-150–200 for hover and focus feedback" },
            { pass: true, text: "Animate opacity and transform only — cheap, and safe when reduced motion skips it" },
            { pass: false, text: "No infinite looping animation behind content — motion confirms, it doesn't decorate" },
            { pass: false, text: "Don't animate layout properties (width, height, top) — they jank" },
            { pass: false, text: "Don't gate content behind an animation — everything must be readable with motion off" },
          ]}
        />
      </section>
    </div>
  );
}
