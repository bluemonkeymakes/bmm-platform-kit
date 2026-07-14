/**
 * Runtime validation, asset normalization and HTML sanitization at the loader
 * boundary.
 *
 * `validateBlocks` runs every CMS block through its Zod schema from
 * ~/content/schema before it can reach a component:
 *   • unknown collection → kept as-is (BlockRenderer already warns and skips)
 *   • valid              → item replaced with the parsed data, asset-flagged
 *                          fields rewritten to absolute URLs, richText-flagged
 *                          fields sanitized
 *   • invalid            → warned once (collection, id, issue summary) and
 *                          DROPPED — a half-broken block must not render
 *
 * Zod validates the SHAPE of a block, never the safety of its contents: a
 * rich-text field is `z.string()`, and `<img src=x onerror=…>` is a perfectly
 * valid string. Since those fields are rendered with dangerouslySetInnerHTML,
 * sanitizing here is what stands between a CMS editor and stored XSS on every
 * page that renders the block.
 *
 * This module is deliberately server-safe and side-effect free: the asset URL
 * builder and the HTML sanitizer are injected by the caller
 * (app/lib/directus.server.ts) rather than imported, so nothing here touches
 * process.env or server-only modules — and the sanitizer never reaches the
 * client bundle.
 */
import type { FieldDef } from "./fields";
import { blocks, type BlockKey } from "./schema";
import type { PageBlock } from "~/types/content";

/** Builds an absolute URL from a Directus file UUID (e.g. getAssetUrl). */
export type AssetUrlBuilder = (assetId: string) => string | null;

/** Strips dangerous markup from CMS-authored HTML (e.g. sanitize-html). */
export type HtmlSanitizer = (html: string) => string;

/**
 * The loader-boundary dependencies, injected together so adding a future field
 * kind doesn't grow every call signature.
 */
export interface FieldNormalizers {
  toAssetUrl: AssetUrlBuilder;
  sanitizeHtml: HtmlSanitizer;
}

/** Anything with per-field defs — a BlockDef or CollectionDef from the schema. */
export interface HasFieldDefs {
  fields: Record<string, FieldDef>;
}

function isBlockKey(collection: string): collection is BlockKey {
  return collection in blocks;
}

/**
 * CMSs return `null` for unfilled fields, but the schemas model optional
 * fields as `undefined` (keeping component-facing types clean). Strip nulls
 * recursively before parsing — Directus only nulls top-level columns, but other
 * CMSs null at every depth, and a repeater item with a stray null shouldn't
 * invalidate its whole block.
 */
function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNulls);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      if (entry !== null) out[key] = stripNulls(entry);
    }
    return out;
  }
  return value;
}

/**
 * Normalize a parsed item's fields against its schema definition:
 *
 *   • `asset: true`    — a bare file UUID becomes an absolute URL via
 *     `toAssetUrl`. Values that are already URLs ("http…" or "/…") or empty are
 *     left untouched.
 *   • `richText: true` — CMS-authored HTML is run through `sanitizeHtml` before
 *     any component can render it.
 *
 * Returns a shallow copy.
 */
export function normalizeFields<T extends object>(
  def: HasFieldDefs,
  data: T,
  { toAssetUrl, sanitizeHtml }: FieldNormalizers,
): T {
  const out: Record<string, unknown> = { ...(data as Record<string, unknown>) };

  for (const [name, field] of Object.entries(def.fields)) {
    const value = out[name];
    if (typeof value !== "string" || value.length === 0) continue;

    if (field.asset) {
      if (!value.startsWith("http") && !value.startsWith("/")) {
        out[name] = toAssetUrl(value) ?? value;
      }
      continue;
    }

    if (field.richText) {
      out[name] = sanitizeHtml(value);
    }
  }

  return out as T;
}

/**
 * Validate a page's blocks against the content schema. Unknown collections pass
 * through; valid blocks come back with parsed, asset-normalized, HTML-sanitized
 * items; invalid blocks are dropped with a single structured warning.
 */
export function validateBlocks(
  pageBlocks: PageBlock[],
  normalizers: FieldNormalizers,
): PageBlock[] {
  const result: PageBlock[] = [];

  for (const block of pageBlocks) {
    if (!isBlockKey(block.collection)) {
      // Unknown block type — keep it; BlockRenderer warns and renders nothing.
      result.push(block);
      continue;
    }

    const def = blocks[block.collection];
    const parsed = def.schema.safeParse(stripNulls(block.item));

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      console.warn(
        `[content] dropped invalid block collection=${block.collection} id=${block.id} issues=[${issues}]`,
      );
      continue;
    }

    result.push({
      ...block,
      item: normalizeFields(def, parsed.data as Record<string, unknown>, normalizers),
    });
  }

  return result;
}
