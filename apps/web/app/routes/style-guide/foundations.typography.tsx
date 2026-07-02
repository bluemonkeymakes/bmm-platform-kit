import type { MetaFunction } from "react-router";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { RuleList } from "~/components/ds/RuleRow";
import {
  H1, H2, H3, H4, H5, H6,
  SectionLabel, Lead, Text, Small, InlineCode, Prose,
} from "~/components/common/Typography";

export const handle = { title: "Typography" };

export const meta: MetaFunction = () => [
  { title: "Typography | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const families = [
  {
    name: "Geist",
    role: "Display / headings",
    cls: "font-display",
    sample: "The system scales with the brand.",
    note: "Variable. Set via --brand-font-display in app/brand/fonts.css.",
  },
  {
    name: "Source Sans 3",
    role: "Body / UI",
    cls: "font-sans",
    sample: "Body copy, buttons, labels, and everything interactive.",
    note: "Variable. The default face — --brand-font-sans.",
  },
  {
    name: "JetBrains Mono",
    role: "Code / meta",
    cls: "font-mono",
    sample: "npm run typecheck && npm run build",
    note: "Variable. --brand-font-mono; font-inconsolata aliases it for ported DS code.",
  },
];

const rawSteps = [
  { cls: "text-2xs", size: "0.625rem", use: "Style-guide meta only — below the production floor" },
  { cls: "text-xs", size: "0.75rem", use: "Captions, badges, table meta" },
  { cls: "text-sm", size: "0.875rem", use: "UI text, buttons, secondary copy" },
  { cls: "text-base", size: "1rem", use: "Body copy" },
  { cls: "text-lg", size: "1.125rem", use: "Lead paragraphs, reading scale" },
  { cls: "text-xl", size: "1.25rem", use: "Small headings, lead on wide screens" },
  { cls: "text-2xl", size: "1.5rem", use: "H3" },
  { cls: "text-3xl", size: "1.875rem", use: "H2" },
  { cls: "text-4xl", size: "2.25rem", use: "H1" },
];

export default function FoundationsTypography() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-14">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Typography</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Three families, one job each. Routes and blocks consume type through the components in{" "}
          <code className="font-inconsolata text-primary">~/components/common/Typography</code> — H1–H6,
          SectionLabel, Lead, Text, Small, InlineCode, and Prose — never raw heading tags. Faces are the
          swap surface: change <code className="font-inconsolata text-primary">app/brand/fonts.css</code>{" "}
          and the whole ladder re-typefaces.
        </p>
      </div>

      {/* Families */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Families</h3>
        <div className="grid grid-cols-1 gap-4">
          {families.map(({ name, role, cls, sample, note }) => (
            <div key={name} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider font-inconsolata">
                  {role} — <span className="text-primary">{cls}</span>
                </p>
                <p className="text-xs text-neutral-500 font-inconsolata hidden sm:block">{name}</p>
              </div>
              <p className={`${cls} text-2xl text-neutral-800`}>{sample}</p>
              <p className="text-xs text-neutral-500 mt-3">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heading ladder */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Heading Ladder</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          H1–H6 own their size, weight, and tracking. H1 and H2 step up responsively; balance-wrapped
          for marketing headlines.
        </p>
        <div className="rounded-xl border border-neutral-200 px-5 divide-y divide-neutral-200">
          <div className="py-4"><H1>Heading one</H1><Small className="mt-1">H1 — 4xl/5xl/6xl · tracking-tight · text-balance</Small></div>
          <div className="py-4"><H2>Heading two</H2><Small className="mt-1">H2 — 3xl/4xl · tracking-tight · text-balance</Small></div>
          <div className="py-4"><H3>Heading three</H3><Small className="mt-1">H3 — 2xl · tracking-tight</Small></div>
          <div className="py-4"><H4>Heading four</H4><Small className="mt-1">H4 — xl · tracking-tight</Small></div>
          <div className="py-4"><H5>Heading five</H5><Small className="mt-1">H5 — lg</Small></div>
          <div className="py-4"><H6>Heading six</H6><Small className="mt-1">H6 — base</Small></div>
        </div>
        <CodeBlock
          code={`import { H1, H2, Lead } from "~/components/common/Typography";

<H1>Page headline</H1>
<Lead className="mt-4">One supporting sentence.</Lead>
<H2>Section title</H2>`}
        />
      </section>

      {/* Body ladder */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Body & Meta</h3>
        <div className="rounded-xl border border-neutral-200 px-5 divide-y divide-neutral-200">
          <div className="py-4">
            <SectionLabel>Section Label</SectionLabel>
            <Small className="mt-1">SectionLabel — sm · uppercase · tracking-widest · muted</Small>
          </div>
          <div className="py-4">
            <Lead>Lead text for introductions and hero subtitles.</Lead>
            <Small className="mt-1">Lead — lg/xl · muted · leading-relaxed</Small>
          </div>
          <div className="py-4">
            <Text>Body text for general content, descriptions, and card copy. The workhorse.</Text>
            <Small className="mt-1">Text — base · muted · leading-relaxed</Small>
          </div>
          <div className="py-4">
            <Small>Small text for captions, timestamps, and metadata.</Small>
            <Small className="mt-1">Small — sm · muted</Small>
          </div>
          <div className="py-4">
            <p className="text-neutral-800">
              Inline code: <InlineCode>npm run dev</InlineCode>
            </p>
            <Small className="mt-1">InlineCode — mono · sm · bg-neutral-100 · rounded</Small>
          </div>
        </div>
      </section>

      {/* Raw scale */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Raw Scale Reference</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          The named steps behind the components — the only sizes that exist. If a step is missing, it gets
          added to <code className="font-inconsolata text-primary">app/system/theme.css</code> (that's how{" "}
          <code className="font-inconsolata text-primary">text-2xs</code> got in), never bracketed inline.
        </p>
        <div className="rounded-xl border border-neutral-200 px-5 divide-y divide-neutral-200">
          {rawSteps.map(({ cls, size, use }) => (
            <div key={cls} className="flex items-center gap-6 py-3">
              <span className="w-20 shrink-0 text-xs font-inconsolata text-primary">{cls}</span>
              <span className="w-16 shrink-0 text-xs font-inconsolata text-neutral-500 hidden sm:block">{size}</span>
              <span className={`${cls} text-neutral-800 min-w-0 truncate`}>The quick brown fox</span>
              <span className="ml-auto text-xs text-neutral-500 hidden md:block text-right">{use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Prose */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Prose</h3>
        <p className="text-xs text-neutral-500 max-w-2xl">
          Wraps rich/CMS/markdown content you can't compose element-by-element — article bodies, block
          content fields. Styled by <code className="font-inconsolata text-primary">@tailwindcss/typography</code>{" "}
          with the display face on headings; inverts in dark mode.
        </p>
        <div className="rounded-xl border border-neutral-200 p-6">
          <Prose>
            <h3>Reading is a different job</h3>
            <p>
              Long-form content optimizes for sustained reading, not impact. Prose handles headings,
              paragraphs, lists, links, and inline <code>code</code> from the CMS.
            </p>
            <ul>
              <li>Unordered list item</li>
              <li>Another item with <a href="#prose">a link</a></li>
            </ul>
            <blockquote>Blockquotes render with a left border and italic style.</blockquote>
          </Prose>
        </div>
        <CodeBlock code={`<Prose html={article.content} />   // CMS / rich text
<Prose>{children}</Prose>           // composed`} />
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Rules</h3>
        <RuleList
          rules={[
            { pass: true, text: "Compose pages from the Typography components — H1–H6, Lead, Text, Small" },
            { pass: true, text: "One H1 per page; keep the semantic order even when sizes differ" },
            { pass: true, text: "Prose for CMS/markdown blobs you can't compose element-by-element" },
            { pass: false, text: "No raw <h1>–<h6> or ad-hoc text-*/font-* stacks in routes and blocks" },
            { pass: false, text: "No arbitrary sizes — the named steps are the whole menu" },
            { pass: false, text: "Don't use text-2xs in production UI — it exists for style-guide meta only" },
          ]}
        />
      </section>
    </div>
  );
}
