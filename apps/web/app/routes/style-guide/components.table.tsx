import type { MetaFunction } from "react-router";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Table" };

export const meta: MetaFunction = () => [
  { title: "Table | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const rows = [
  { name: "Keystone Site", env: "Production", status: "default" as const, label: "Live", updated: "2h ago" },
  { name: "Medusa Store", env: "Staging", status: "destructive" as const, label: "Degraded", updated: "1d ago" },
  { name: "Directus + Twenty", env: "Production", status: "default" as const, label: "Live", updated: "3d ago" },
  { name: "Saltspring Demo", env: "Preview", status: "secondary" as const, label: "Idle", updated: "1w ago" },
];

const usage = [
  { item: "Page views", qty: "182,400", amount: "$18.24" },
  { item: "Form submissions", qty: "1,032", amount: "$5.16" },
  { item: "Asset bandwidth", qty: "64 GB", amount: "$6.40" },
];

export default function ComponentsTable() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Table</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Composable table primitives. The shell is bordered and scrolls on overflow; the header uses
          the inconsolata label voice; rows get a neutral hover and a selected state. All surfaces read
          from tokens.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table";

<Table>
  <TableHeader><TableRow><TableHead>Name</TableHead>…</TableRow></TableHeader>
  <TableBody>
    <TableRow><TableCell>Keystone Site</TableCell>…</TableRow>
  </TableBody>
</Table>`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Deployments</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-medium text-neutral-800">{r.name}</TableCell>
                <TableCell>{r.env}</TableCell>
                <TableCell>
                  <Badge variant={r.status}>{r.label}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums text-neutral-500">{r.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <RuleList
          rules={[
            { pass: true, text: "Tabular data with comparable rows and a stable column set" },
            { pass: true, text: "Right-align numbers; keep the header in the label voice" },
            { pass: false, text: "Don't use for layout or for a handful of key/value pairs — use a definition list" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Footer &amp; caption</h3>
        <p className="text-xs text-neutral-500">
          <code className="font-inconsolata text-primary">TableFooter</code> carries summary rows on the
          header surface; <code className="font-inconsolata text-primary">TableCaption</code> renders a
          muted caption below the table.
        </p>
        <Table>
          <TableCaption>Usage for the current billing period.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage.map((u) => (
              <TableRow key={u.item}>
                <TableCell>{u.item}</TableCell>
                <TableCell className="text-right tabular-nums">{u.qty}</TableCell>
                <TableCell className="text-right tabular-nums">{u.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right tabular-nums">$29.80</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </div>
  );
}
