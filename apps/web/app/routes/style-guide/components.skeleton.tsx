import type { MetaFunction } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";

export const handle = { title: "Skeleton" };

export const meta: MetaFunction = () => [
  { title: "Skeleton | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsSkeleton() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Skeleton</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          A pulsing placeholder for content that's loading. Compose it with width/height utilities to
          mirror the real layout, so the page doesn't jump when data arrives.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Skeleton } from "~/components/ui/skeleton";

<Skeleton className="h-4 w-32" />
<Skeleton className="size-9 rounded-full" />`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Card placeholder</h3>
        <DualPreview minHeight="7rem">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Mirror the real content's shape so layout is stable on load" },
            { pass: true, text: "Use for the first load of a known layout; brief flashes can skip it" },
            { pass: false, text: "Don't use as a generic spinner — for indeterminate waits use a loader" },
          ]}
        />
      </section>
    </div>
  );
}
