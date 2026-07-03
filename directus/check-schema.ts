#!/usr/bin/env node
/**
 * Directus schema drift check — read-only CI gate.
 *
 * Source of truth: apps/web/app/content/schema.ts (`blocks` + `collections`).
 * Run with:  node directus/check-schema.ts   (Node >= 22.6 — native type stripping)
 *
 * Diffs the LIVE Directus schema against the content schema and fails (exit 1)
 * on any drift, in either direction:
 *   • collection missing in live
 *   • field missing in live, or live type ≠ schema type
 *   • pages → blocks M2A wiring absent (junction, alias, relations), or a
 *     block collection missing from one_allowed_collections
 *   • public read permission missing on a content collection
 *   • REVERSE drift: a non-system field in a live content collection that
 *     schema.ts doesn't define (added in the Directus UI?)
 *
 * Ignored: directus_* system collections, system fields (id/status/sort,
 * date_*, user_*), the pages.blocks alias, and pages_blocks junction internals.
 *
 * Never writes anything. Env (same contract as apply-schema.ts):
 *   DIRECTUS_URL             default http://localhost:8055
 *   DIRECTUS_ADMIN_EMAIL     default admin@example.com
 *   DIRECTUS_ADMIN_PASSWORD  default admin
 */
import { registerHooks } from "node:module";

// schema.ts imports "./fields" without an extension (the Vite app resolves
// that; Node's ESM loader does not). Retry failed relative resolutions with
// a .ts extension so we can import the app's schema module unmodified.
registerHooks({
  resolve(specifier, context, nextResolve) {
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

// ---------------------------------------------------------------------------
// Config + tiny read-only API client
// ---------------------------------------------------------------------------

const BASE = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD ?? "admin";

let token = "";
let failures = 0;

function report(status: "ok" | "FAIL", detail: string) {
  if (status === "FAIL") failures++;
  console.log(`${status.padEnd(5)} ${detail}`);
}

async function api<T = unknown>(path: string, method = "GET", body?: unknown): Promise<T> {
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
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Fetch the live schema (collections, fields, relations, permissions)
// ---------------------------------------------------------------------------

interface ApiField {
  collection: string;
  field: string;
  type: string;
}

interface ApiRelation {
  collection: string;
  field: string;
  related_collection: string | null;
  meta: { one_allowed_collections?: string[] | null; system?: boolean } | null;
}

console.log(`--- Checking schema drift against ${BASE} ---`);

let login: { data: { access_token: string } };
try {
  login = await api("/auth/login", "POST", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
} catch (err) {
  console.error(`FAIL  Directus not reachable at ${BASE} (${(err as Error).message})`);
  process.exit(1);
}
token = login.data.access_token;

const liveCollections = new Set(
  (await api<{ data: { collection: string }[] }>("/collections")).data
    .map((c) => c.collection)
    .filter((c) => !c.startsWith("directus_")),
);

const allFields = (await api<{ data: ApiField[] }>("/fields")).data;
const fieldsByCollection = new Map<string, Map<string, ApiField>>();
for (const field of allFields) {
  if (field.collection.startsWith("directus_")) continue;
  let map = fieldsByCollection.get(field.collection);
  if (!map) fieldsByCollection.set(field.collection, (map = new Map()));
  map.set(field.field, field);
}

const relations = (await api<{ data: ApiRelation[] }>("/relations")).data.filter(
  (r) => !r.meta?.system,
);
const relationByKey = new Map(relations.map((r) => [`${r.collection}.${r.field}`, r]));

// ---------------------------------------------------------------------------
// 1 + 2. Collections and fields, both directions
// ---------------------------------------------------------------------------

const JUNCTION = "pages_blocks";

/** Directus-managed fields that are never declared in schema.ts. */
function isSystemField(name: string): boolean {
  return (
    name === "id" ||
    name === "status" ||
    name === "sort" ||
    name.startsWith("date_") ||
    name.startsWith("user_")
  );
}

interface ContentDef {
  key: string;
  fields: Record<string, { directus: { type: string } }>;
}

const contentDefs: ContentDef[] = [...Object.values(collections), ...Object.values(blocks)];

for (const def of contentDefs) {
  if (!liveCollections.has(def.key)) {
    report("FAIL", `collection ${def.key} missing in live Directus — run \`npm run seed\``);
    continue;
  }
  report("ok", `collection ${def.key}`);

  const liveFields = fieldsByCollection.get(def.key) ?? new Map<string, ApiField>();

  // schema → live: every declared field exists with the declared type
  for (const [name, field] of Object.entries(def.fields)) {
    const live = liveFields.get(name);
    if (!live) {
      report("FAIL", `field ${def.key}.${name} missing in live — run \`npm run seed\``);
    } else if (live.type !== field.directus.type) {
      report(
        "FAIL",
        `field ${def.key}.${name} type drift: live "${live.type}" ≠ schema "${field.directus.type}"`,
      );
    } else {
      report("ok", `field ${def.key}.${name} (${live.type})`);
    }
  }

  // live → schema (reverse drift): no undeclared non-system fields
  for (const name of liveFields.keys()) {
    if (isSystemField(name)) continue;
    if (def.key === "pages" && name === "blocks") continue; // M2A alias, owned by apply
    if (!(name in def.fields)) {
      report(
        "FAIL",
        `field ${def.key}.${name} exists in live but not in schema.ts — added in Directus UI? define it in schema.ts or remove it`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 3. pages → blocks M2A (junction + alias field + relations)
// ---------------------------------------------------------------------------

const blockKeys = Object.keys(blocks);

if (!liveCollections.has(JUNCTION)) {
  report("FAIL", `M2A junction collection ${JUNCTION} missing`);
} else {
  report("ok", `M2A junction collection ${JUNCTION}`);
}

const aliasField = fieldsByCollection.get("pages")?.get("blocks");
if (!aliasField) {
  report("FAIL", `M2A alias field pages.blocks missing`);
} else if (aliasField.type !== "alias") {
  report("FAIL", `M2A alias field pages.blocks type drift: live "${aliasField.type}" ≠ "alias"`);
} else {
  report("ok", `M2A alias field pages.blocks`);
}

if (!relationByKey.has(`${JUNCTION}.pages_id`)) {
  report("FAIL", `M2A relation ${JUNCTION}.pages_id → pages missing`);
} else {
  report("ok", `M2A relation ${JUNCTION}.pages_id → pages`);
}

const itemRelation = relationByKey.get(`${JUNCTION}.item`);
if (!itemRelation) {
  report("FAIL", `M2A relation ${JUNCTION}.item missing`);
} else {
  const allowed = new Set(itemRelation.meta?.one_allowed_collections ?? []);
  const missing = blockKeys.filter((key) => !allowed.has(key));
  if (missing.length > 0) {
    report(
      "FAIL",
      `M2A relation ${JUNCTION}.item one_allowed_collections missing: ${missing.join(", ")}`,
    );
  } else {
    report("ok", `M2A relation ${JUNCTION}.item (${blockKeys.length} block collections allowed)`);
  }
}

// ---------------------------------------------------------------------------
// 4. Public read permissions (Directus 11: attached to the Public POLICY)
// ---------------------------------------------------------------------------

const policies = await api<{ data: { id: string; name: string }[] }>(
  "/policies?fields=id,name&limit=-1",
);
const publicPolicy = policies.data.find((p) => p.name === "$t:public_label");

if (!publicPolicy) {
  report("FAIL", "public policy ($t:public_label) not found");
} else {
  const perms = await api<{ data: { collection: string }[] }>(
    `/permissions?limit=-1&fields=collection&filter[policy][_eq]=${publicPolicy.id}&filter[action][_eq]=read`,
  );
  const readable = new Set(perms.data.map((p) => p.collection));
  for (const col of [...Object.keys(collections), ...blockKeys, JUNCTION]) {
    if (readable.has(col)) {
      report("ok", `public read ${col}`);
    } else {
      report("FAIL", `public read permission missing on ${col}`);
    }
  }
}

// ---------------------------------------------------------------------------

if (failures > 0) {
  console.log(`--- DRIFT: ${failures} problem(s) found ---`);
  process.exit(1);
}
console.log("--- No drift — live Directus matches the content schema ---");
