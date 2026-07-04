#!/usr/bin/env node
/**
 * Directus demo-content seed — populates the CMS with the app's built-in
 * fallback defaults so the cms-mode render matches the static-mode render.
 *
 * Source of truth: apps/web/app/data/defaults.ts (the typed fallbacks) plus
 * apps/web/app/content/schema.ts (for asset-field flags).
 * Run with:  node directus/seed-content.ts   (Node >= 22.6 — native type stripping)
 *
 * What it does:
 *   • articles / team / testimonials — creates each default item (published),
 *     skipping items whose natural key (slug / name / author_name) already exists.
 *   • pages home + about — DECLARATIVE: if a page with the slug exists, its
 *     junction rows, referenced block items, and the page itself are deleted,
 *     then recreated from the default block arrays. Defaults are the source.
 *   • images — schema fields flagged `asset: true` hold file UUIDs in
 *     Directus, but the defaults carry external URLs. Every such URL is
 *     imported once via POST /files/import (cached URL → uuid, reused across
 *     runs by matching the file description). JSON-repeater image URLs
 *     (gallery images[].src etc.) are not asset fields and stay as URLs.
 *
 * Safe to re-run. Schema must exist first (node directus/apply-schema.ts).
 *
 * Env (same contract as apply-schema.ts):
 *   DIRECTUS_URL             default http://localhost:8055
 *   DIRECTUS_ADMIN_EMAIL     default admin@example.com
 *   DIRECTUS_ADMIN_PASSWORD  default admin
 */
import { registerHooks } from "node:module";

// defaults.ts / schema.ts use extensionless + "~/" imports (the Vite app
// resolves those; Node's ESM loader does not). Map "~/" to apps/web/app and
// retry failed relative resolutions with a .ts extension.
const WEB_APP_ROOT = new URL("../apps/web/app/", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("~/")) {
      const mapped = new URL(specifier.slice(2), WEB_APP_ROOT).href;
      try {
        return nextResolve(mapped, context);
      } catch {
        return nextResolve(`${mapped}.ts`, context);
      }
    }
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (/^\.\.?\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});

const { blocks, collections } = await import("../apps/web/app/content/schema.ts");
const {
  defaultHomeBlocks,
  defaultAboutBlocks,
  defaultArticles,
  defaultTeamMembers,
  defaultTestimonials,
} = await import("../apps/web/app/data/defaults.ts");

// ---------------------------------------------------------------------------
// Config + tiny API client (same contract as apply-schema.ts)
// ---------------------------------------------------------------------------

const BASE = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD ?? "admin";

let token = "";
const counts: Record<string, number> = {};

function report(
  status: "created" | "replaced" | "skipped" | "imported",
  detail: string,
): void {
  counts[status] = (counts[status] ?? 0) + 1;
  console.log(`${status.padEnd(8)} ${detail}`);
}

async function api<T = unknown>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${await res.text()}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// ---------------------------------------------------------------------------
// Image import — external URL → Directus file UUID, one import per URL.
// The source URL is stored as the file description so re-runs reuse the file.
// ---------------------------------------------------------------------------

const urlToFileId = new Map<string, string>();

async function importImage(url: string): Promise<string> {
  const cached = urlToFileId.get(url);
  if (cached) return cached;

  // Reuse a previously imported file (description = source URL).
  const existing = await api<{ data: { id: string }[] }>(
    "GET",
    `/files?limit=1&fields=id&filter[description][_eq]=${encodeURIComponent(url)}`,
  );
  if (existing.data[0]) {
    urlToFileId.set(url, existing.data[0].id);
    return existing.data[0].id;
  }

  const imported = await api<{ data: { id: string } }>("POST", "/files/import", {
    url,
    data: { description: url },
  });
  urlToFileId.set(url, imported.data.id);
  report("imported", `file ${imported.data.id} ← ${url}`);
  return imported.data.id;
}

/** Field defs shape shared by BlockDef and CollectionDef. */
interface HasFieldDefs {
  fields: Record<string, { asset?: boolean }>;
}

/**
 * Copy an item's data, replacing every asset-flagged field whose value is an
 * http(s) URL with an imported file UUID. Other values pass through.
 */
async function withImportedAssets(
  def: HasFieldDefs,
  item: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = { ...item };
  for (const [name, field] of Object.entries(def.fields)) {
    const value = out[name];
    if (field.asset && typeof value === "string" && /^https?:\/\//.test(value)) {
      out[name] = await importImage(value);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Collections: articles / team / testimonials — skip when natural key exists
// ---------------------------------------------------------------------------

interface SeedCollection {
  key: "articles" | "team" | "testimonials";
  naturalKey: string;
  items: Record<string, unknown>[];
}

const collectionSeeds: SeedCollection[] = [
  { key: "articles", naturalKey: "slug", items: defaultArticles },
  { key: "team", naturalKey: "name", items: defaultTeamMembers },
  { key: "testimonials", naturalKey: "author_name", items: defaultTestimonials },
];

async function seedCollections(): Promise<void> {
  for (const { key, naturalKey, items } of collectionSeeds) {
    const def = collections[key];
    for (const item of items) {
      const keyValue = String(item[naturalKey]);
      const label = `${key} "${keyValue}"`;
      const existing = await api<{ data: unknown[] }>(
        "GET",
        `/items/${key}?limit=1&fields=id&filter[${naturalKey}][_eq]=${encodeURIComponent(keyValue)}`,
      );
      if (existing.data.length > 0) {
        report("skipped", `${label} (exists)`);
        continue;
      }
      // id is app-side fallback bookkeeping — Directus assigns its own.
      const { id: _id, ...data } = await withImportedAssets(def, item);
      await api("POST", `/items/${key}`, { ...data, status: "published" });
      report("created", label);
    }
  }
}

// ---------------------------------------------------------------------------
// Pages: declarative replace — delete junction rows + block items + page,
// then recreate from the default block arrays.
// ---------------------------------------------------------------------------

interface PageBlockSeed {
  sort: number;
  collection: string;
  item: Record<string, unknown>;
}

interface PageSeed {
  slug: string;
  title: string;
  blocks: PageBlockSeed[];
}

const pageSeeds: PageSeed[] = [
  { slug: "home", title: "Home", blocks: defaultHomeBlocks },
  { slug: "about", title: "About", blocks: defaultAboutBlocks },
];

async function deletePage(pageId: number, slug: string): Promise<void> {
  const junctions = await api<{
    data: { id: number; collection: string; item: string | null }[];
  }>(
    "GET",
    `/items/pages_blocks?limit=-1&fields=id,collection,item&filter[pages_id][_eq]=${pageId}`,
  );
  for (const row of junctions.data) {
    if (row.item && row.collection in blocks) {
      // Block item may already be gone — tolerate 404s.
      await api("DELETE", `/items/${row.collection}/${row.item}`).catch(() => {});
    }
    await api("DELETE", `/items/pages_blocks/${row.id}`);
  }
  await api("DELETE", `/items/pages/${pageId}`);
  console.log(
    `         (removed page "${slug}" id=${pageId} with ${junctions.data.length} block(s))`,
  );
}

async function seedPages(): Promise<void> {
  for (const { slug, title, blocks: pageBlocks } of pageSeeds) {
    const existing = await api<{ data: { id: number }[] }>(
      "GET",
      `/items/pages?limit=1&fields=id&filter[slug][_eq]=${encodeURIComponent(slug)}`,
    );
    const replacing = existing.data.length > 0;
    if (replacing) await deletePage(existing.data[0].id, slug);

    const page = await api<{ data: { id: number } }>("POST", "/items/pages", {
      title,
      slug,
      status: "published",
    });

    for (const block of pageBlocks) {
      const def = blocks[block.collection as keyof typeof blocks];
      if (!def) throw new Error(`unknown block collection "${block.collection}"`);
      const data = await withImportedAssets(def, block.item);
      const created = await api<{ data: { id: number } }>(
        "POST",
        `/items/${block.collection}`,
        { ...data, status: "published" },
      );
      await api("POST", "/items/pages_blocks", {
        pages_id: page.data.id,
        item: String(created.data.id),
        collection: block.collection,
        sort: block.sort,
      });
    }

    report(
      replacing ? "replaced" : "created",
      `page "${slug}" (${pageBlocks.length} blocks)`,
    );
  }
}

// ---------------------------------------------------------------------------

console.log(`--- Seeding demo content into ${BASE} ---`);
const login = await api<{ data: { access_token: string } }>("POST", "/auth/login", {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
});
token = login.data.access_token;

await seedCollections();
await seedPages();

const summary = Object.entries(counts)
  .map(([k, v]) => `${k}: ${v}`)
  .join(", ");
console.log(`--- Done (${summary || "nothing to do"}) ---`);
