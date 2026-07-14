import { createDirectus, rest, readItems, readSingleton } from "@directus/sdk";
import sanitizeHtmlLib from "sanitize-html";
import type {
  Page,
  Article,
  TeamMember,
  SiteSettings,
  Testimonial,
} from "~/types/content";
import { collections } from "~/content/schema";
import { normalizeFields, validateBlocks, type FieldNormalizers } from "~/content/validate";
import { contentMode } from "~/content/mode.server";

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

/**
 * Allowlist for CMS rich text. Anything not named here is stripped, so a new
 * Directus WYSIWYG button that emits an unexpected tag degrades to plain text
 * rather than punching a hole in the policy.
 *
 * Deliberately absent: <script>, <style>, <iframe>, <object>, every on* handler
 * attribute, and `javascript:` URLs (sanitize-html drops all of these by
 * default, and the schemes below pin which protocols may appear in href/src).
 */
const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr", "blockquote", "pre", "code",
    "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "ul", "ol", "li",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Any link that opens a new tab gets noopener — otherwise the opened page can
  // navigate this one via window.opener.
  transformTags: {
    a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, SANITIZE_OPTIONS);
}

const normalizers: FieldNormalizers = { toAssetUrl: getAssetUrl, sanitizeHtml };

// --- Loader-boundary hygiene -------------------------------------------------
// Everything below the fetch layer sees validated blocks, absolute image URLs
// and sanitized HTML. Blocks are checked against ~/content/schema (invalid ones
// are dropped with a warning); asset-flagged fields (photo, author_photo,
// featured_image, meta_image, block images) are rewritten from bare file UUIDs
// to /assets URLs; richText-flagged fields are sanitized before any component
// can hand them to dangerouslySetInnerHTML.

function normalizePage(page: Page): Page {
  const normalized = normalizeFields(collections.pages, page, normalizers);
  if (normalized.blocks) {
    normalized.blocks = validateBlocks(normalized.blocks, normalizers);
  }
  return normalized;
}

function normalizeArticle(article: Article): Article {
  return normalizeFields(collections.articles, article, normalizers);
}

// --- Pages ---
export async function getPage(slug: string): Promise<Page | null> {
  if (contentMode() === "static") return null;
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
  if (contentMode() === "static") return [];
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
  if (contentMode() === "static") return null;
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
  if (contentMode() === "static") return [];
  try {
    const team = await directus.request(
      readItems("team", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: ["*"],
      })
    );
    return team.map((member) => normalizeFields(collections.team, member, normalizers));
  } catch (error) {
    console.error("Error fetching team:", error);
    return [];
  }
}

// --- Testimonials ---
export async function getTestimonials(): Promise<Testimonial[]> {
  if (contentMode() === "static") return [];
  try {
    const testimonials = await directus.request(
      readItems("testimonials", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: ["*"],
      })
    );
    return testimonials.map((t) => normalizeFields(collections.testimonials, t, normalizers));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// --- Settings ---
export async function getSettings(): Promise<SiteSettings | null> {
  if (contentMode() === "static") return null;
  try {
    return await directus.request(readSingleton("settings"));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
