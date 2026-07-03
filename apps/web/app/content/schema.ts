/**
 * Content schema — the single source of truth for every block and collection.
 *
 * Every block_* collection and every content collection is defined here, once,
 * via the DSL in ./fields. Derived from this module:
 *   • TS data types (z.infer) — re-exported through app/types/content.ts
 *   • runtime validation at the loader boundary
 *   • the Directus schema (directus/apply-schema.ts reads `blocks`/`collections`)
 *   • compile-time checks on the fallback defaults (app/data/defaults.ts)
 *
 * Field sets mirror directus/seed.sh unioned with the shapes the components
 * were written against (formerly hand-written in app/types/content.ts).
 * `id`/`status`/`sort` are Directus system fields created with each
 * collection — they are not content fields and are not declared here.
 * Likewise the pages→blocks M2A junction is wiring, not a field; the apply
 * script owns it.
 */
import { z } from "zod";
import { f, defineBlock, defineCollection, type FieldDef } from "./fields";

/**
 * Strip the `.optional()` off a field constructor's schema — for fields the
 * components require (titles on hero/CTA, list payloads, rich-text bodies).
 * Directus metadata (and the `asset` flag) pass through untouched.
 */
function req<S extends z.ZodType>(field: FieldDef<z.ZodOptional<S>>): FieldDef<S> {
  return { ...field, schema: field.schema.unwrap() };
}

// ---------------------------------------------------------------------------
// Repeater item shapes (stored as JSON in Directus `list` interfaces)
// ---------------------------------------------------------------------------

const featureItem = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const statItem = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

const galleryImageItem = z.object({
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const socialLinkItem = z.object({
  platform: z.string(),
  url: z.string(),
});

// ---------------------------------------------------------------------------
// Blocks — one per block_* collection (15 total)
// ---------------------------------------------------------------------------

const block_hero = defineBlock({
  key: "block_hero",
  label: "Hero",
  purpose: "Full marketing hero — label, headline, subtitle, primary + secondary CTA",
  fields: {
    title: f.requiredString(),
    label: f.string(),
    subtitle: f.text(),
    description: f.text(),
    image: f.image(),
    background_video: f.string(),
    cta_text: f.string(),
    cta_link: f.string(),
    secondary_cta_text: f.string(),
    secondary_cta_link: f.string(),
    alignment: f.select(["left", "center", "right"]),
    variant: f.select(["default", "large"]),
  },
});

const block_hero_simple = defineBlock({
  key: "block_hero_simple",
  label: "Hero (simple)",
  purpose: "Compact page header — label, title, subtitle on a subtle band",
  fields: {
    title: f.requiredString(),
    label: f.string(),
    subtitle: f.text(),
  },
});

const block_cta = defineBlock({
  key: "block_cta",
  label: "Call to Action",
  purpose: "Closing call-to-action band; accent variant inverts onto the primary fill",
  fields: {
    title: f.requiredString(),
    description: f.text(),
    cta_text: f.requiredString(),
    cta_link: f.requiredString(),
    variant: f.select(["default", "accent"]),
  },
});

const block_content = defineBlock({
  key: "block_content",
  label: "Content",
  purpose: "Rich-text prose section from the CMS",
  fields: {
    title: f.string(),
    content: req(f.richText()),
    image: f.image(),
    image_position: f.select(["left", "right"]),
  },
});

const block_features = defineBlock({
  key: "block_features",
  label: "Features",
  purpose: "2–4 column feature card grid with icons",
  fields: {
    title: f.string(),
    subtitle: f.text(),
    columns: f.integer(),
    features: req(f.list(featureItem)),
  },
});

const block_testimonials = defineBlock({
  key: "block_testimonials",
  label: "Testimonials",
  purpose: "Quote cards fed from the testimonials collection",
  fields: {
    title: f.string(),
    subtitle: f.text(),
    limit: f.integer(),
  },
});

const block_faq = defineBlock({
  key: "block_faq",
  label: "FAQ",
  purpose: "Question/answer accordion list",
  fields: {
    title: f.string(),
    subtitle: f.text(),
    items: req(f.list(faqItem)),
  },
});

const block_stats = defineBlock({
  key: "block_stats",
  label: "Stats",
  purpose: "Headline metrics band — value, label, description",
  fields: {
    title: f.string(),
    stats: req(f.list(statItem)),
  },
});

const block_image_text = defineBlock({
  key: "block_image_text",
  label: "Image + Text",
  purpose: "Split image + rich text, image position left/right",
  fields: {
    title: f.string(),
    content: req(f.richText()),
    image: req(f.image()),
    image_position: f.select(["left", "right"]),
    cta_text: f.string(),
    cta_link: f.string(),
  },
});

const block_team = defineBlock({
  key: "block_team",
  label: "Team",
  purpose: "Team member cards fed from the team collection",
  fields: {
    title: f.string(),
    subtitle: f.text(),
    show_all: f.boolean(),
  },
});

const block_about = defineBlock({
  key: "block_about",
  label: "About",
  purpose: "About summary section",
  fields: {
    title: f.string(),
    content: req(f.richText()),
    image: f.image(),
    cta_text: f.string(),
    cta_link: f.string(),
  },
});

const block_contact = defineBlock({
  key: "block_contact",
  label: "Contact",
  purpose: "Contact info / form embed section",
  fields: {
    title: f.string(),
    description: f.text(),
    show_map: f.boolean(),
  },
});

const block_newsletter = defineBlock({
  key: "block_newsletter",
  label: "Newsletter",
  purpose: "Email capture band",
  fields: {
    title: f.string(),
    description: f.text(),
    placeholder: f.string(),
    button_text: f.string(),
  },
});

const block_articles = defineBlock({
  key: "block_articles",
  label: "Articles",
  purpose: "Latest articles grid fed from the articles collection",
  fields: {
    title: f.string(),
    limit: f.integer(),
  },
});

const block_gallery = defineBlock({
  key: "block_gallery",
  label: "Gallery",
  purpose: "Image gallery grid",
  fields: {
    title: f.string(),
    images: req(f.list(galleryImageItem)),
    columns: f.integer(),
  },
});

export const blocks = {
  block_hero,
  block_hero_simple,
  block_cta,
  block_content,
  block_features,
  block_testimonials,
  block_faq,
  block_stats,
  block_image_text,
  block_team,
  block_about,
  block_contact,
  block_newsletter,
  block_articles,
  block_gallery,
} as const;

export type BlockKey = keyof typeof blocks;

// ---------------------------------------------------------------------------
// Content collections
// ---------------------------------------------------------------------------

const pages = defineCollection({
  key: "pages",
  note: "CMS-managed pages with content blocks",
  fields: {
    title: f.requiredString(),
    slug: f.requiredString(),
    meta_title: f.string(),
    meta_description: f.text(),
    meta_image: f.image(),
    // NOTE: the `blocks` M2A relation is deliberately not a field here —
    // the apply script creates the pages_blocks junction separately.
  },
});

const articles = defineCollection({
  key: "articles",
  note: "Blog articles",
  fields: {
    title: f.requiredString(),
    slug: f.requiredString(),
    excerpt: req(f.text()),
    content: req(f.richText()),
    featured_image: f.image(),
    author: f.string(),
    category: f.string(),
    tags: f.tags(),
    date_published: req(f.timestamp()),
    read_time: f.integer(),
  },
});

const team = defineCollection({
  key: "team",
  note: "Team members",
  fields: {
    name: f.requiredString(),
    role: f.requiredString(),
    bio: f.text(),
    photo: f.image(),
    social_links: f.list(socialLinkItem),
  },
});

const testimonials = defineCollection({
  key: "testimonials",
  note: "Client testimonials",
  fields: {
    quote: req(f.text()),
    author_name: f.requiredString(),
    author_role: f.string(),
    author_photo: f.image(),
    company: f.string(),
    rating: f.integer(),
  },
});

export const collections = { pages, articles, team, testimonials };

// ---------------------------------------------------------------------------
// Block data types — inferred from the schemas above. These carry the same
// names the hand-written interfaces in app/types/content.ts used to have, and
// are re-exported from there so existing imports keep working.
// ---------------------------------------------------------------------------

export type BlockHeroData = z.infer<typeof blocks.block_hero.schema>;
export type BlockHeroSimpleData = z.infer<typeof blocks.block_hero_simple.schema>;
export type BlockCtaData = z.infer<typeof blocks.block_cta.schema>;
export type BlockContentData = z.infer<typeof blocks.block_content.schema>;
export type BlockFeaturesData = z.infer<typeof blocks.block_features.schema>;
export type BlockTestimonialsData = z.infer<typeof blocks.block_testimonials.schema>;
export type BlockFaqData = z.infer<typeof blocks.block_faq.schema>;
export type BlockStatsData = z.infer<typeof blocks.block_stats.schema>;
export type BlockImageTextData = z.infer<typeof blocks.block_image_text.schema>;
export type BlockTeamData = z.infer<typeof blocks.block_team.schema>;
export type BlockAboutData = z.infer<typeof blocks.block_about.schema>;
export type BlockContactData = z.infer<typeof blocks.block_contact.schema>;
export type BlockNewsletterData = z.infer<typeof blocks.block_newsletter.schema>;
export type BlockArticlesData = z.infer<typeof blocks.block_articles.schema>;
export type BlockGalleryData = z.infer<typeof blocks.block_gallery.schema>;
