import { createDirectus, rest, readItems, readSingleton } from "@directus/sdk";
import type {
  Page,
  Article,
  TeamMember,
  SiteSettings,
  Testimonial,
} from "~/types/content";
import { collections } from "~/content/schema";
import { normalizeAssets, validateBlocks } from "~/content/validate";

// Directus schema for typed SDK
interface Schema {
  pages: Page[];
  articles: Article[];
  team: TeamMember[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_PUBLIC_URL = process.env.DIRECTUS_PUBLIC_URL || DIRECTUS_URL;

const directus = createDirectus<Schema>(DIRECTUS_URL).with(rest());

export function getAssetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `${DIRECTUS_PUBLIC_URL}/assets/${assetId}`;
}

// --- Loader-boundary hygiene -------------------------------------------------
// Everything below the fetch layer sees validated blocks and absolute image
// URLs. Blocks are checked against ~/content/schema (invalid ones are dropped
// with a warning); asset-flagged fields (photo, author_photo, featured_image,
// meta_image, block images) are rewritten from bare file UUIDs to /assets URLs.

function normalizePage(page: Page): Page {
  const normalized = normalizeAssets(collections.pages, page, getAssetUrl);
  if (normalized.blocks) {
    normalized.blocks = validateBlocks(normalized.blocks, getAssetUrl);
  }
  return normalized;
}

function normalizeArticle(article: Article): Article {
  return normalizeAssets(collections.articles, article, getAssetUrl);
}

// --- Pages ---
export async function getPage(slug: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItems("pages", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        fields: ["*", "blocks.*", "blocks.item.*"],
        limit: 1,
      })
    );
    return pages[0] ? normalizePage(pages[0]) : null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

// --- Articles ---
export async function getArticles(limit?: number): Promise<Article[]> {
  try {
    const articles = await directus.request(
      readItems("articles", {
        filter: { status: { _eq: "published" } },
        sort: ["-date_published"],
        fields: ["*"],
        limit: limit || -1,
      })
    );
    return articles.map(normalizeArticle);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const articles = await directus.request(
      readItems("articles", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        limit: 1,
      })
    );
    return articles[0] ? normalizeArticle(articles[0]) : null;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
}

// --- Team ---
export async function getTeam(): Promise<TeamMember[]> {
  try {
    const team = await directus.request(
      readItems("team", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: ["*"],
      })
    );
    return team.map((member) => normalizeAssets(collections.team, member, getAssetUrl));
  } catch (error) {
    console.error("Error fetching team:", error);
    return [];
  }
}

// --- Testimonials ---
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await directus.request(
      readItems("testimonials", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: ["*"],
      })
    );
    return testimonials.map((t) => normalizeAssets(collections.testimonials, t, getAssetUrl));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// --- Settings ---
export async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await directus.request(readSingleton("settings"));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
