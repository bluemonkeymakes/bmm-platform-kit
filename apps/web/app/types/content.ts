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
// Block Item Types — one per block_* collection in Directus
// ============================================================================

export interface BlockHeroData {
  id: string;
  label?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  background_video?: string;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  alignment?: "left" | "center" | "right";
  variant?: "default" | "large";
}

export interface BlockFeaturesData {
  id: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  features: { icon?: string; title: string; description: string }[];
}

export interface BlockCtaData {
  id: string;
  title: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  variant?: "default" | "accent";
}

export interface BlockContentData {
  id: string;
  title?: string;
  content: string;
  image?: string;
  image_position?: "left" | "right";
}

export interface BlockTestimonialsData {
  id: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export interface BlockFaqData {
  id: string;
  title?: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
}

export interface BlockStatsData {
  id: string;
  title?: string;
  stats: { label: string; value: string; description?: string }[];
}

export interface BlockImageTextData {
  id: string;
  title?: string;
  content: string;
  image: string;
  image_position?: "left" | "right";
  cta_text?: string;
  cta_link?: string;
}

export interface BlockTeamData {
  id: string;
  title?: string;
  subtitle?: string;
  show_all?: boolean;
}

export interface BlockAboutData {
  id: string;
  title?: string;
  content: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
}

export interface BlockNewsletterData {
  id: string;
  title?: string;
  description?: string;
  placeholder?: string;
  button_text?: string;
}

export interface BlockArticlesData {
  id: string;
  title?: string;
  limit?: number;
}

export interface BlockGalleryData {
  id: string;
  title?: string;
  images: { src: string; alt?: string; caption?: string }[];
  columns?: 2 | 3 | 4;
}

export interface BlockContactData {
  id: string;
  title?: string;
  description?: string;
  show_map?: boolean;
}
