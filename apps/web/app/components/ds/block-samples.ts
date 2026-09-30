/**
 * Demo data for the /design-system/blocks pages: one PageBlock per CMS block
 * type. Taken from the typed fallback content in ~/data/defaults where a block
 * appears there; the four block types no default page uses get a sample here.
 * Items are plain objects shaped by app/content/schema.ts.
 */
import type { BlockContext } from "~/components/blocks/BlockRenderer";
import { defaultAboutBlocks, defaultArticles, defaultHomeBlocks, defaultTeamMembers, defaultTestimonials } from "~/data/defaults";
import type { PageBlock } from "~/types/content";

const EXTRA: PageBlock[] = [
  {
    id: "sample-about",
    sort: 1,
    collection: "block_about",
    item: {
      title: "A small team, on purpose",
      content: "<p>We build content-driven sites end to end: the CMS model, the pages, and the forms that turn visitors into conversations.</p>",
      cta_text: "Meet the team",
      cta_link: "/about",
    },
  },
  {
    id: "sample-content",
    sort: 1,
    collection: "block_content",
    item: {
      title: "How we work",
      content: "<p>Every page starts as content in the CMS. The design system decides how it looks, so editors change words, never styles.</p><p>That split is what keeps a site consistent after launch.</p>",
    },
  },
  {
    id: "sample-contact",
    sort: 1,
    collection: "block_contact",
    item: {
      title: "Get in touch",
      description: "Tell us about the project and we will reply within two working days.",
      show_map: false,
    },
  },
  {
    id: "sample-gallery",
    sort: 1,
    collection: "block_gallery",
    item: {
      title: "Recent work",
      columns: 3,
      images: [
        { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", alt: "Team working around a table" },
        { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", alt: "Bright open-plan office" },
        { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop", alt: "Laptops on a shared desk" },
      ],
    },
  },
];

const ALL = [...defaultHomeBlocks, ...defaultAboutBlocks, ...EXTRA];

/** The first demo block of a collection. Throws if a block type has no sample, so a new block cannot ship a blank page. */
export function sampleBlock(collection: string): PageBlock {
  const found = ALL.find((b) => b.collection === collection);
  if (!found) throw new Error(`No demo data for ${collection}: add one to block-samples.ts`);
  return found;
}

export const sampleContext: BlockContext = {
  articles: defaultArticles,
  team: defaultTeamMembers,
  testimonials: defaultTestimonials,
};
