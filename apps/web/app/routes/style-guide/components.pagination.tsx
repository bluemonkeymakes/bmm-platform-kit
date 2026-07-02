import type { MetaFunction } from "react-router";
import { useState } from "react";
import { Pagination } from "~/components/ui/pagination";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";

export const handle = { title: "Pagination" };

export const meta: MetaFunction = () => [
  { title: "Pagination | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsPagination() {
  const [page, setPage] = useState(4);

  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Pagination</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          A controlled pager. First, last, and the current page ±1 are always shown; the rest collapse
          to ellipses, so the control stays a fixed width however many pages there are.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Pagination } from "~/components/ui/pagination";

const [page, setPage] = useState(1);
<Pagination page={page} pageCount={12} onPageChange={setPage} />`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">
          Interactive — page {page} of 12
        </h3>
        <DualPreview align="center" minHeight="5rem">
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Large, ordered result sets where users jump to a known page" },
            { pass: true, text: "Disable prev/next at the ends; mark the current page with aria-current" },
            { pass: false, text: "Don't use for endless feeds — infinite scroll or 'load more' fits better there" },
          ]}
        />
      </section>
    </div>
  );
}
