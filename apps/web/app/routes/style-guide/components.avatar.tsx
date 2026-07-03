import type { MetaFunction } from "react-router";
import { Avatar } from "~/components/ui/avatar";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { DualPreview } from "~/components/ds/Preview";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";

export const handle = { title: "Avatar" };

export const meta: MetaFunction = () => [
  { title: "Avatar | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const names = ["Lucas Vance", "Maria Chen", "Priya Patel", "Sam Okafor", "Noa Levi"];

export default function ComponentsAvatar() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Avatar"
        blurb={
          <>
            A person or entity mark. By default it renders a deterministic{" "}
            <a href="https://boringavatars.com" className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer">
              boring-avatars
            </a>{" "}
            graphic seeded by the name — the studio default unless otherwise defined. Provide a real{" "}
            <code className="font-inconsolata text-primary">src</code> image to override, or{" "}
            <code className="font-inconsolata text-primary">fallback</code> initials to opt out. Palette and
            variant live in the brand layer.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { Avatar } from "~/components/ui/avatar";

<Avatar name="Lucas Vance" />               {/* default → boring-avatars */}
<Avatar src="/lucas.jpg" alt="Lucas" />     {/* otherwise defined → image */}
<Avatar name="Lucas Vance" fallback="LV" /> {/* opt out → initials */}`}
          />
        </div>
      </PageIntro>

      <SpecimenSection title="Default — generated from the name">
        <DualPreview align="center" minHeight="6rem">
          <div className="flex items-center gap-4">
            {names.map((n) => (
              <Avatar key={n} name={n} size="lg" />
            ))}
          </div>
        </DualPreview>
        <p className="text-xs text-neutral-500">
          Same name always yields the same avatar, so identities stay stable across sessions and views.
        </p>
      </SpecimenSection>

      <SpecimenSection title="Sizes, image &amp; initials">
        <DualPreview align="center" minHeight="6rem">
          <div className="flex items-center gap-4">
            <Avatar name="Sam Okafor" size="sm" />
            <Avatar name="Sam Okafor" size="md" />
            <Avatar name="Sam Okafor" size="lg" />
            <Avatar size="lg" src="https://invalid.example/x.jpg" alt="broken" fallback="BM" />
            <Avatar size="lg" name="Maria Chen" fallback="MC" />
          </div>
        </DualPreview>
        <RuleList
          rules={[
            { pass: true, text: "Represent a user/account in lists, menus, comments, headers" },
            { pass: true, text: "Pass a name and let the default generate — consistent, no missing-image holes" },
            { pass: true, text: "Use a real src when you have one (uploaded photo, brand logo)" },
            { pass: false, text: "Don't hand-pick avatar images for placeholder users — that's what the default is for" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
