/**
 * Runtime validation + asset normalization at the loader boundary.
 *
 * `validateBlocks` runs every CMS block through its Zod schema from
 * ~/content/schema before it can reach a component:
 *   • unknown collection → kept as-is (BlockRenderer already warns and skips)
 *   • valid              → item replaced with the parsed data, asset-flagged
 *                          fields rewritten to absolute URLs
 *   • invalid            → warned once (collection, id, issue summary) and
 *                          DROPPED — a half-broken block must not render
 *
 * This module is deliberately server-safe and side-effect free: the asset URL
 * builder is injected by the caller (app/lib/directus.server.ts passes
 * getAssetUrl) rather than imported, so nothing here touches process.env or
 * server-only modules.
 */
import type { FieldDef } from "./fields";
import { blocks, type BlockKey } from "./schema";
import type { PageBlock } from "~/types/content";

/** Builds an absolute URL from a Directus file UUID (e.g. getAssetUrl). */
export type AssetUrlBuilder = (assetId: string) => string | null;

/** Anything with per-field defs — a BlockDef or CollectionDef from the schema. */
export interface HasFieldDefs {
  fields: Record<string, FieldDef>;
}

function isBlockKey(collection: string): collection is BlockKey {
  return collection in blocks;
}

/**
 * Directus returns `null` for every unfilled column, but the schemas model
 * optional fields as `undefined` (keeping component-facing types clean).
 * Strip top-level nulls before parsing — a transport artifact, not content.
 */
function stripNulls(item: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    if (value !== null) out[key] = value;
  }
  return out;
}

/**
 * Rewrite every `asset: true` field whose value is a bare file UUID into an
 * absolute URL via `toAssetUrl`. Values that are already URLs (start with
 * "http" or "/") or empty are left untouched. Returns a shallow copy.
 */
export function normalizeAssets<T extends object>(
  def: HasFieldDefs,
  data: T,
  toAssetUrl: AssetUrlBuilder,
): T {
  const out: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  for (const [name, field] of Object.entries(def.fields)) {
    if (!field.asset) continue;
    const value = out[name];
    if (
      typeof value === "string" &&
      value.length > 0 &&
      !value.startsWith("http") &&
      !value.startsWith("/")
    ) {
      out[name] = toAssetUrl(value) ?? value;
    }
  }
  return out as T;
}

/**
 * Validate a page's blocks against the content schema. Unknown collections
 * pass through; valid blocks come back with parsed, asset-normalized items;
 * invalid blocks are dropped with a single structured warning.
 */
export function validateBlocks(
  pageBlocks: PageBlock[],
  toAssetUrl: AssetUrlBuilder,
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
      item: normalizeAssets(def, parsed.data as Record<string, unknown>, toAssetUrl),
    });
  }

  return result;
}
