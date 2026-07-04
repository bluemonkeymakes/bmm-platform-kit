import type { MetaFunction } from "react-router";
import { Preview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { PageIntro } from "~/components/ds/PageIntro";
import { SpecimenSection } from "~/components/ds/SpecimenSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { BlockHeroSimple } from "~/components/blocks/BlockHeroSimple";
import { BlockFeatures } from "~/components/blocks/BlockFeatures";
import { BlockCTA } from "~/components/blocks/BlockCTA";
import { defaultHomeBlocks, defaultAboutBlocks } from "~/data/defaults";
import { blocks, type BlockKey } from "~/content/schema";

export const handle = { title: "Blocks" };

export const meta: MetaFunction = () => [
  { title: "Blocks | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

// The registry rows derive from the content schema (app/content/schema.ts) —
// key, label, and purpose come straight from each block definition. Only the
// React component name lives here, since the schema doesn't know about JSX.
const componentNames: Record<BlockKey, string> = {
  block_hero: "BlockHero",
  block_hero_simple: "BlockHeroSimple",
  block_cta: "BlockCTA",
  block_content: "BlockContent",
  block_features: "BlockFeatures",
  block_testimonials: "BlockTestimonials",
  block_faq: "BlockFAQ",
  block_stats: "BlockStats",
  block_image_text: "BlockImageText",
  block_team: "BlockTeam",
  block_about: "BlockAbout",
  block_contact: "BlockContact",
  block_newsletter: "BlockNewsletter",
  block_articles: "BlockArticles",
  block_gallery: "BlockGallery",
};

const blockTypes = (Object.keys(blocks) as BlockKey[]).map((key) => ({
  key,
  label: blocks[key].label,
  component: componentNames[key],
  purpose: blocks[key].purpose,
}));

// Representative specimens pulled from the same seed data the real pages use.
const heroSimpleBlock = defaultAboutBlocks.find((b) => b.collection === "block_hero_simple")!;
const featuresBlock = defaultHomeBlocks.find((b) => b.collection === "block_features")!;
const ctaBlock = defaultHomeBlocks.find((b) => b.collection === "block_cta")!;

export default function PatternsBlocks() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro
        title="Content Blocks"
        blurb={
          <>
            Every CMS page is a stack of blocks. Directus stores a{" "}
            <code className="font-inconsolata text-primary">block_*</code> collection per type;{" "}
            <code className="font-inconsolata text-primary">BlockRenderer</code> maps each collection name to
            its React component and passes shared context (articles, team, testimonials). Editors compose
            pages by stacking blocks — no code deploys.
          </>
        }
      >
        <div className="mt-4">
          <CodeBlock
            code={`import { BlockRenderer } from "~/components/blocks/BlockRenderer";

<BlockRenderer blocks={page.blocks} articles={articles} team={team} />`}
          />
        </div>
      </PageIntro>

      {/* Registry table */}
      <SpecimenSection title="The 15 Block Types">
        <p className="text-xs text-neutral-500 max-w-2xl">
          This table is derived from the block definitions in{" "}
          <code className="font-inconsolata text-primary">app/content/schema.ts</code> — the same
          source of truth that drives runtime validation and the Directus schema. Add a block
          there and it appears here automatically.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block key</TableHead>
              <TableHead className="hidden md:table-cell">Label</TableHead>
              <TableHead className="hidden sm:table-cell">Component</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockTypes.map(({ key, label, component, purpose }) => (
              <TableRow key={key}>
                <TableCell className="text-xs font-inconsolata text-primary whitespace-nowrap">{key}</TableCell>
                <TableCell className="text-xs text-neutral-500 whitespace-nowrap hidden md:table-cell">{label}</TableCell>
                <TableCell className="text-xs font-inconsolata text-neutral-500 hidden sm:table-cell">{component}</TableCell>
                <TableCell className="text-xs text-neutral-500">{purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SpecimenSection>

      {/* Live specimens */}
      <SpecimenSection title="Specimens" className="space-y-6">
        <p className="text-xs text-neutral-500 max-w-2xl">
          Three representative blocks rendered with the same seed data the real pages fall back to when
          Directus isn't connected (<code className="font-inconsolata text-primary">app/data/defaults.ts</code>).
        </p>

        <Preview
          label="block_hero_simple"
          description="Compact page header — used on About, Articles, Contact."
          className="block p-0"
        >
          <BlockHeroSimple block={heroSimpleBlock} />
        </Preview>

        <Preview
          label="block_features"
          description="Feature card grid; columns configurable 2–4 in the CMS."
          className="block p-0"
        >
          <BlockFeatures block={featuresBlock} />
        </Preview>

        <Preview
          label='block_cta — variant="accent"'
          description="Closing band on the primary fill with an inverted secondary button."
          className="block p-0"
        >
          <BlockCTA block={ctaBlock} />
        </Preview>
      </SpecimenSection>

      {/* Adding a block */}
      <SpecimenSection title="Adding a Block Type">
        <CodeBlock
          label="Four steps"
          code={`1. Define the block in app/content/schema.ts (key, label, purpose, fields) — types, validation, Directus schema, and this table all derive from it
2. Re-export its inferred data type from app/types/content.ts
3. Build BlockPricing.tsx in app/components/blocks/ (compose ui/layout Section + Container, ui/typography, ui/*)
4. Register it in BlockRenderer.tsx — and add its component name + specimen to this page`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Compose blocks from the shared primitives — Section, Container, Heading/Body, ui components" },
            { pass: true, text: "Give every optional field a sensible fallback so a half-filled CMS entry still renders" },
            { pass: true, text: "Update this style-guide page in the same change that adds a block type" },
            { pass: false, text: "Don't hand-roll headings, spacing, or colors inside a block — the primitives own those" },
            { pass: false, text: "Don't fetch data inside a block — context comes in through BlockRenderer" },
          ]}
        />
      </SpecimenSection>
    </div>
  );
}
