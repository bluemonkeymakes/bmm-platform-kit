import type { MetaFunction } from "react-router";
import { Preview } from "~/components/ds/Preview";
import { RuleList } from "~/components/ds/RuleRow";
import { CodeBlock } from "~/components/ds/CodeBlock";
import { BlockHeroSimple } from "~/components/blocks/BlockHeroSimple";
import { BlockFeatures } from "~/components/blocks/BlockFeatures";
import { BlockCTA } from "~/components/blocks/BlockCTA";
import { defaultHomeBlocks, defaultAboutBlocks } from "~/data/defaults";

export const handle = { title: "Blocks" };

export const meta: MetaFunction = () => [
  { title: "Blocks | Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

const blockTypes = [
  { key: "block_hero", component: "BlockHero", purpose: "Full marketing hero — label, headline, subtitle, primary + secondary CTA" },
  { key: "block_hero_simple", component: "BlockHeroSimple", purpose: "Compact page header — label, title, subtitle on a subtle band" },
  { key: "block_cta", component: "BlockCTA", purpose: "Closing call-to-action band; accent variant inverts onto the primary fill" },
  { key: "block_content", component: "BlockContent", purpose: "Rich-text prose section from the CMS" },
  { key: "block_features", component: "BlockFeatures", purpose: "2–4 column feature card grid with icons" },
  { key: "block_testimonials", component: "BlockTestimonials", purpose: "Quote cards fed from the testimonials collection" },
  { key: "block_faq", component: "BlockFAQ", purpose: "Question/answer accordion list" },
  { key: "block_stats", component: "BlockStats", purpose: "Headline metrics band — value, label, description" },
  { key: "block_image_text", component: "BlockImageText", purpose: "Split image + rich text, image position left/right" },
  { key: "block_team", component: "BlockTeam", purpose: "Team member cards fed from the team collection" },
  { key: "block_about", component: "BlockAbout", purpose: "About summary section" },
  { key: "block_contact", component: "BlockContact", purpose: "Contact info / form embed section" },
  { key: "block_newsletter", component: "BlockNewsletter", purpose: "Email capture band" },
  { key: "block_articles", component: "BlockArticles", purpose: "Latest articles grid fed from the articles collection" },
  { key: "block_gallery", component: "BlockGallery", purpose: "Image gallery grid" },
];

// Representative specimens pulled from the same seed data the real pages use.
const heroSimpleBlock = defaultAboutBlocks.find((b) => b.collection === "block_hero_simple")!;
const featuresBlock = defaultHomeBlocks.find((b) => b.collection === "block_features")!;
const ctaBlock = defaultHomeBlocks.find((b) => b.collection === "block_cta")!;

export default function PatternsBlocks() {
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <div>
        <h2 className="text-2xl font-display font-medium text-neutral-800 mb-1">Content Blocks</h2>
        <p className="text-sm text-neutral-500 max-w-2xl">
          Every CMS page is a stack of blocks. Directus stores a{" "}
          <code className="font-inconsolata text-primary">block_*</code> collection per type;{" "}
          <code className="font-inconsolata text-primary">BlockRenderer</code> maps each collection name to
          its React component and passes shared context (articles, team, testimonials). Editors compose
          pages by stacking blocks — no code deploys.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={`import { BlockRenderer } from "~/components/blocks/BlockRenderer";

<BlockRenderer blocks={page.blocks} articles={articles} team={team} />`}
          />
        </div>
      </div>

      {/* Registry table */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">The 15 Block Types</h3>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100/60 border-b border-neutral-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Block key</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider hidden sm:table-cell">Component</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-neutral-500 font-inconsolata uppercase tracking-wider">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {blockTypes.map(({ key, component, purpose }) => (
                <tr key={key} className="hover:bg-neutral-100/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-primary whitespace-nowrap">{key}</td>
                  <td className="px-4 py-2.5 text-xs font-inconsolata text-neutral-500 hidden sm:table-cell">{component}</td>
                  <td className="px-4 py-2.5 text-xs text-neutral-500">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live specimens */}
      <section className="space-y-6">
        <h3 className="text-base font-medium font-display text-neutral-800">Specimens</h3>
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
      </section>

      {/* Adding a block */}
      <section className="space-y-4">
        <h3 className="text-base font-medium font-display text-neutral-800">Adding a Block Type</h3>
        <CodeBlock
          label="Four steps"
          code={`1. Create the block_* collection in Directus
2. Add the data interface in app/types/content.ts
3. Build BlockPricing.tsx in app/components/blocks/ (compose Section, Container, Typography, ui/*)
4. Register it in BlockRenderer.tsx — and add its row + specimen to this page`}
        />
        <RuleList
          rules={[
            { pass: true, text: "Compose blocks from the shared primitives — Section, Container, Typography, ui components" },
            { pass: true, text: "Give every optional field a sensible fallback so a half-filled CMS entry still renders" },
            { pass: true, text: "Update this style-guide page in the same change that adds a block type" },
            { pass: false, text: "Don't hand-roll headings, spacing, or colors inside a block — the primitives own those" },
            { pass: false, text: "Don't fetch data inside a block — context comes in through BlockRenderer" },
          ]}
        />
      </section>
    </div>
  );
}
