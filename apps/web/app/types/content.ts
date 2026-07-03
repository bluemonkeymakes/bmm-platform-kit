// ============================================================================
// Directus Collection Types
// ============================================================================

export interface Page {
  id: string;
  status: "published" | "draft" | "archived";
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  blocks?: PageBlock[];
}

export interface PageBlock {
  id: string;
  sort: number;
  collection: string;
  item: Record<string, unknown>;
}

export interface Article {
  id: string;
  status: "published" | "draft" | "archived";
  date_published: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  read_time?: number;
}

export interface TeamMember {
  id: string;
  status: "published" | "draft" | "archived";
  sort: number;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  social_links?: { platform: string; url: string }[];
}

export interface Testimonial {
  id: string;
  status: "published" | "draft" | "archived";
  sort: number;
  quote: string;
  author_name: string;
  author_role?: string;
  author_photo?: string;
  company?: string;
  rating?: number;
}

export interface SiteSettings {
  site_name: string;
  tagline?: string;
  logo?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  social_links?: { platform: string; url: string }[];
  footer_text?: string;
}

// ============================================================================
// Block Item Types — one per block_* collection in Directus.
// Inferred (z.infer) from the single-source-of-truth schemas in
// app/content/schema.ts and re-exported here so existing imports keep working.
// ============================================================================

export type {
  BlockHeroData,
  BlockHeroSimpleData,
  BlockCtaData,
  BlockContentData,
  BlockFeaturesData,
  BlockTestimonialsData,
  BlockFaqData,
  BlockStatsData,
  BlockImageTextData,
  BlockTeamData,
  BlockAboutData,
  BlockContactData,
  BlockNewsletterData,
  BlockArticlesData,
  BlockGalleryData,
} from "~/content/schema";
