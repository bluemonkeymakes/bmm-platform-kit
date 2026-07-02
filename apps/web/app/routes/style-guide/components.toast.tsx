import type { MetaFunction } from "react-router";
import { useToast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Toast" };

export const meta: MetaFunction = () => [
  { title: "Toast | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsToast() {
  const { toast } = useToast();

  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Toast</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Transient, non-blocking feedback via the <code className="font-inconsolata text-primary">useToast()</code>{" "}
          hook. Five semantic variants, each drawing its accent from the palette so a brand change
          re-skins them. Auto-dismisses; stacks bottom-right. Provider mounted at the root.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { useToast } from "~/components/ui/toast";

const { toast } = useToast();
toast({ title: "Saved", description: "Your changes are live.", variant: "success" });`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Variants</h3>
        <DualPreview align="center" minHeight="6rem">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast({ title: "Heads up", description: "A neutral notification." })}
            >
              Default
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Saved", description: "Your changes are live.", variant: "success" })
              }
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Check this", description: "Draft expires soon.", variant: "warning" })
              }
            >
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Couldn't save",
                  description: "Network error — retry.",
                  variant: "destructive",
                })
              }
            >
              Destructive
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "FYI", description: "New version available.", variant: "info" })
              }
            >
              Info
            </Button>
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Confirm an action succeeded/failed without interrupting the flow" },
            { pass: true, text: "Match the variant to severity; keep title short, description optional" },
            { pass: false, text: "Don't use for decisions that need a response — use a Dialog" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Duration</h3>
        <p className="text-xs text-neutral-500">
          Toasts auto-dismiss after 4 seconds by default. Pass{" "}
          <code className="font-inconsolata text-primary">duration</code> in milliseconds to change it, or{" "}
          <code className="font-inconsolata text-primary">0</code> to keep the toast until the user
          dismisses it.
        </p>
        <DualPreview align="center" minHeight="5rem">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast({ title: "Quick note", duration: 1500 })}
            >
              Short (1.5s)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Sticky",
                  description: "Stays until dismissed.",
                  variant: "info",
                  duration: 0,
                })
              }
            >
              Persistent
            </Button>
          </div>
        </DualPreview>
        <CodeBlock code={`toast({ title: "Sticky", variant: "info", duration: 0 }); // 0 = until dismissed`} />
      </section>
    </div>
  );
}
