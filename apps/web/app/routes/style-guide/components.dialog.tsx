import type { MetaFunction } from "react-router";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";

export const handle = { title: "Dialog" };

export const meta: MetaFunction = () => [
  { title: "Dialog | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsDialog() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Dialog</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Radix Dialog — a modal overlay for focused tasks and confirmations. Traps focus, dims the
          page with a token-tinted scrim, and animates open/close. Surface, border, and shadow all
          come from tokens.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose } from "~/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogDescription>This can't be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
          />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Confirmation</h3>
        <DualPreview align="center" minHeight="6rem">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this project?</DialogTitle>
                <DialogDescription>
                  This permanently removes the project and all of its data. This action can't be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Focused, interruptive tasks: confirmations, short forms, destructive actions" },
            { pass: true, text: "Always pair a clear title with a primary and a cancel action" },
            { pass: false, text: "Don't nest dialogs or use for non-blocking feedback — use Toast for that" },
          ]}
        />
      </section>
    </div>
  );
}
