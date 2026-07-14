import type { MetaFunction } from "react-router";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { DualPreview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import { Settings, User, LogOut, ChevronDown } from "lucide-react";

export const handle = { title: "Dropdown Menu" };

export const meta: MetaFunction = () => [
  { title: "Dropdown Menu | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

function AccountMenuDemo() {
  const [compact, setCompact] = useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Account <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Signed in as Ada</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem
          checked={compact}
          onCheckedChange={(v) => setCompact(Boolean(v))}
        >
          Compact density
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ComponentsDropdownMenu() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Dropdown Menu"
        blurb="Radix DropdownMenu for action and option lists triggered by a control. Supports items, labels, separators, and checkbox items. Hover/focus, surface, and icon colour are tokenised."
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Account</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem><User /> Profile</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><LogOut /> Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Account menu">
        <DualPreview align="center" minHeight="6rem">
          <AccountMenuDemo />
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Group related actions/options behind one trigger to keep toolbars clean" },
            { pass: true, text: "Use a label + separators to chunk long menus; checkbox items for toggles" },
            { pass: false, text: "Don't put primary page actions here — keep them visible as buttons" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
