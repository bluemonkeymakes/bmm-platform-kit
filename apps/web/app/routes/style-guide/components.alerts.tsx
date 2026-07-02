import type { MetaFunction } from "react-router";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { DualPreview } from "~/components/ds/Preview";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const handle = { title: "Alerts" };

export const meta: MetaFunction = () => [
  { title: "Alerts | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const variants: {
  variant: "info" | "success" | "warning" | "error";
  icon: LucideIcon;
  title: string;
  body: string;
  when: string;
}[] = [
  {
    variant: "info",
    icon: Info,
    title: "Heads up",
    body: "Your demo environment refreshes every 24 hours. Unsaved changes are cleared.",
    when: "Neutral context, tips, non-blocking information — the default variant",
  },
  {
    variant: "success",
    icon: CheckCircle2,
    title: "Changes saved",
    body: "Your project settings were updated and are now live.",
    when: "Confirmation of a completed action",
  },
  {
    variant: "warning",
    icon: AlertTriangle,
    title: "Trial ending soon",
    body: "Your trial expires in 3 days. Add a payment method to keep access.",
    when: "Attention needed, but not an error — degraded or expiring state",
  },
  {
    variant: "error",
    icon: XCircle,
    title: "Payment failed",
    body: "We couldn't process your card. Update your billing details to retry.",
    when: "A failure the user must act on",
  },
];

export default function ComponentsAlerts() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Alerts</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Inline callouts with four semantic variants. A two-column grid pins the icon to the top-left;
          AlertTitle and AlertDescription flow in the second column. Tinted background + matching border.
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-8">
        <h3 className="text-base font-medium font-display text-neutral-800">Variants</h3>
        {variants.map(({ variant, icon: Icon, title, body, when }) => (
          <div key={variant} className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-neutral-800 capitalize">{variant}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">{when}</p>
            </div>
            <DualPreview>
              <Alert variant={variant} className="w-full">
                <Icon />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{body}</AlertDescription>
              </Alert>
            </DualPreview>
          </div>
        ))}
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Usage</h3>
        <CodeBlock
          code={`import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";

<Alert variant="warning">
  <AlertTriangle />
  <AlertTitle>Trial ending soon</AlertTitle>
  <AlertDescription>Add a payment method to keep access.</AlertDescription>
</Alert>`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Always lead with an icon that matches the variant's intent" },
            { pass: true, text: "Keep the title to one line; put detail in the description" },
            { pass: false, text: "Don't stack more than one error alert — consolidate into a list" },
            { pass: false, text: "Don't use error styling for warnings — reserve red for action-required" },
          ]}
        />
      </section>

      {/* Title-only */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Title-only</h3>
        <p className="text-xs text-neutral-500">
          Description is optional. A single-line alert reads as a compact status banner.
        </p>
        <DualPreview>
          <Alert variant="success" className="w-full">
            <CheckCircle2 />
            <AlertTitle>All systems operational</AlertTitle>
          </Alert>
        </DualPreview>
      </section>
    </div>
  );
}
