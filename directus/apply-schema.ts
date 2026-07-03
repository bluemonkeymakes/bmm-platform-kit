#!/usr/bin/env node
/**
 * Directus schema apply — idempotent, driven by the content schema.
 *
 * Source of truth: apps/web/app/content/schema.ts (`blocks` + `collections`).
 * Run with:  node directus/apply-schema.ts   (Node >= 22.6 — native type stripping)
 *
 * What it does, in order:
 *   1. Ensures every content collection and block collection exists
 *      (integer autoincrement id, status dropdown default draft, hidden sort).
 *   2. Ensures every field from the schema exists; warns on type drift
 *      (never destructively alters types); patches meta (interface/options)
 *      when they differ.
 *   3. Ensures the pages → blocks M2A: hidden `pages_blocks` junction,
 *      `blocks` alias field on pages, and the two relations.
 *   4. Ensures public read permissions (Directus 11 policy-based) on all
 *      content collections plus the junction.
 *
 * Every step is a no-op when the target already matches — safe to re-run.
 *
 * Env (same contract as the old seed.sh):
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
// Config + tiny API client
// ---------------------------------------------------------------------------

const BASE = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD ?? "admin";

let token = "";
let warnings = 0;
const counts: Record<string, number> = {};

function report(status: "created" | "exists" | "updated" | "WARNING", detail: string) {
  counts[status] = (counts[status] ?? 0) + 1;
  if (status === "WARNING") warnings++;
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

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a as object);
  const bk = Object.keys(b as object);
  if (ak.length !== bk.length) return false;
  return ak.every((k) =>
    deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
  );
}

// ---------------------------------------------------------------------------
// Shapes coming back from the Directus API (the parts we read)
// ---------------------------------------------------------------------------

interface ApiField {
  collection: string;
  field: string;
  type: string;
  meta: { interface?: string | null; options?: Record<string, unknown> | null } | null;
}

interface ApiRelation {
  collection: string;
  field: string;
  related_collection: string | null;
  meta: {
    one_allowed_collections?: string[] | null;
    system?: boolean;
  } | null;
}

interface FieldSpec {
  type: string;
  interface: string;
  options?: Record<string, unknown>;
  special?: string[];
  hidden?: boolean;
  schema?: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Ensure helpers
// ---------------------------------------------------------------------------

const SYSTEM_FIELDS = [
  {
    field: "id",
    type: "integer",
    meta: { hidden: true, interface: "input", readonly: true },
    schema: { is_primary_key: true, has_auto_increment: true },
  },
  {
    field: "status",
    type: "string",
    meta: {
      width: "half",
      interface: "select-dropdown",
      options: {
        choices: [
          { text: "Published", value: "published" },
          { text: "Draft", value: "draft" },
          { text: "Archived", value: "archived" },
        ],
      },
    },
    schema: { default_value: "draft" },
  },
  { field: "sort", type: "integer", meta: { interface: "input", hidden: true }, schema: {} },
];

let existingCollections: Set<string>;
const fieldCache = new Map<string, Map<string, ApiField>>();

async function loadFields(collection: string): Promise<Map<string, ApiField>> {
  let map = fieldCache.get(collection);
  if (!map) {
    const res = await api<{ data: ApiField[] }>("GET", `/fields/${collection}`);
    map = new Map(res.data.map((f) => [f.field, f]));
    fieldCache.set(collection, map);
  }
  return map;
}

async function ensureCollection(
  name: string,
  note: string,
  opts: { hidden?: boolean; icon?: string; extraFields?: unknown[] } = {},
): Promise<void> {
  if (existingCollections.has(name)) {
    report("exists", `collection ${name}`);
    return;
  }
  await api("POST", "/collections", {
    collection: name,
    meta: { note, icon: opts.icon ?? "article", ...(opts.hidden ? { hidden: true } : {}) },
    schema: {},
    fields: [...SYSTEM_FIELDS, ...(opts.extraFields ?? [])],
  });
  existingCollections.add(name);
  fieldCache.delete(name);
  report("created", `collection ${name}`);
}

async function ensureField(collection: string, name: string, spec: FieldSpec): Promise<void> {
  const existing = (await loadFields(collection)).get(name);
  const label = `${collection}.${name}`;

  if (!existing) {
    const meta: Record<string, unknown> = { interface: spec.interface };
    if (spec.options) meta.options = spec.options;
    if (spec.special) meta.special = spec.special;
    if (spec.hidden) meta.hidden = true;
    await api("POST", `/fields/${collection}`, {
      field: name,
      type: spec.type,
      meta,
      // alias fields must not get a schema (there is no DB column)
      ...(spec.schema === null ? {} : { schema: spec.schema ?? {} }),
    });
    fieldCache.get(collection)?.set(name, {
      collection,
      field: name,
      type: spec.type,
      meta: { interface: spec.interface, options: spec.options ?? null },
    });
    report("created", `field ${label} (${spec.type})`);
    return;
  }

  if (existing.type !== spec.type) {
    report(
      "WARNING",
      `field ${label}: type is "${existing.type}" but schema wants "${spec.type}" — not altering (fix manually)`,
    );
    return;
  }

  const wantOptions = spec.options ?? null;
  const haveOptions = existing.meta?.options ?? null;
  if (existing.meta?.interface !== spec.interface || !deepEqual(haveOptions, wantOptions)) {
    await api("PATCH", `/fields/${collection}/${name}`, {
      meta: { interface: spec.interface, options: wantOptions },
    });
    report("updated", `field ${label} (interface/options)`);
    return;
  }

  report("exists", `field ${label}`);
}

// ---------------------------------------------------------------------------
// 1 + 2. Collections and fields from the content schema
// ---------------------------------------------------------------------------

console.log(`--- Applying schema to ${BASE} ---`);
const login = await api<{ data: { access_token: string } }>("POST", "/auth/login", {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
});
token = login.data.access_token;

existingCollections = new Set(
  (await api<{ data: { collection: string }[] }>("GET", "/collections")).data.map(
    (c) => c.collection,
  ),
);

interface ContentDef {
  key: string;
  fields: Record<string, { directus: { type: string; interface: string; options?: Record<string, unknown> } }>;
}

const contentDefs: { def: ContentDef; note: string }[] = [
  ...Object.values(collections).map((def) => ({ def, note: def.note })),
  ...Object.values(blocks).map((def) => ({ def, note: `Content block: ${def.label} — ${def.purpose}` })),
];

for (const { def, note } of contentDefs) {
  await ensureCollection(def.key, note);
  for (const [name, field] of Object.entries(def.fields)) {
    await ensureField(def.key, name, field.directus);
  }
}

// ---------------------------------------------------------------------------
// 3. pages → blocks M2A (junction + alias field + relations)
// ---------------------------------------------------------------------------

const blockKeys = Object.keys(blocks);

const JUNCTION = "pages_blocks";
const junctionFields: [string, FieldSpec][] = [
  ["pages_id", { type: "integer", interface: "input", hidden: true }],
  ["item", { type: "string", interface: "input", hidden: true }],
  ["collection", { type: "string", interface: "input", hidden: true }],
  ["sort", { type: "integer", interface: "input", hidden: true }],
];

if (!existingCollections.has(JUNCTION)) {
  await api("POST", "/collections", {
    collection: JUNCTION,
    meta: { note: "pages → blocks M2A junction", icon: "import_export", hidden: true },
    schema: {},
    fields: [
      {
        field: "id",
        type: "integer",
        meta: { hidden: true, interface: "input", readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true },
      },
      ...junctionFields.map(([field, spec]) => ({
        field,
        type: spec.type,
        meta: { interface: spec.interface, hidden: true },
        schema: {},
      })),
    ],
  });
  existingCollections.add(JUNCTION);
  report("created", `collection ${JUNCTION}`);
} else {
  report("exists", `collection ${JUNCTION}`);
  for (const [name, spec] of junctionFields) {
    await ensureField(JUNCTION, name, spec);
  }
}

// alias field on pages ("blocks") — no DB column, special m2a
await ensureField("pages", "blocks", {
  type: "alias",
  interface: "list-m2a",
  special: ["m2a"],
  schema: null,
});

// relations
const relations = (await api<{ data: ApiRelation[] }>("GET", "/relations")).data.filter(
  (r) => !r.meta?.system,
);
const relationByKey = new Map(relations.map((r) => [`${r.collection}.${r.field}`, r]));

// (1) junction → pages (M2O side that powers pages.blocks O2M-through)
if (!relationByKey.has(`${JUNCTION}.pages_id`)) {
  await api("POST", "/relations", {
    collection: JUNCTION,
    field: "pages_id",
    related_collection: "pages",
    meta: {
      one_field: "blocks",
      junction_field: "item",
      sort_field: "sort",
      one_deselect_action: "nullify",
    },
    schema: { on_delete: "SET NULL" },
  });
  report("created", `relation ${JUNCTION}.pages_id → pages`);
} else {
  report("exists", `relation ${JUNCTION}.pages_id → pages`);
}

// (2) junction "item" → any of the block collections (the A2O side)
const itemRelation = relationByKey.get(`${JUNCTION}.item`);
if (!itemRelation) {
  await api("POST", "/relations", {
    collection: JUNCTION,
    field: "item",
    related_collection: null,
    meta: {
      one_allowed_collections: blockKeys,
      one_collection_field: "collection",
      junction_field: "pages_id",
    },
  });
  report("created", `relation ${JUNCTION}.item → [${blockKeys.length} block collections]`);
} else {
  const allowed = itemRelation.meta?.one_allowed_collections ?? [];
  if (!deepEqual([...allowed].sort(), [...blockKeys].sort())) {
    await api("PATCH", `/relations/${JUNCTION}/item`, {
      meta: { one_allowed_collections: blockKeys },
    });
    report("updated", `relation ${JUNCTION}.item (one_allowed_collections)`);
  } else {
    report("exists", `relation ${JUNCTION}.item`);
  }
}

// ---------------------------------------------------------------------------
// 4. Public read permissions (Directus 11: attached to the Public POLICY)
// ---------------------------------------------------------------------------

const policies = await api<{ data: { id: string; name: string }[] }>(
  "GET",
  "/policies?fields=id,name&limit=-1",
);
const publicPolicy = policies.data.find((p) => p.name === "$t:public_label");

if (!publicPolicy) {
  report("WARNING", "public policy ($t:public_label) not found — skipping permissions");
} else {
  const perms = await api<{ data: { collection: string }[] }>(
    "GET",
    `/permissions?limit=-1&fields=collection&filter[policy][_eq]=${publicPolicy.id}&filter[action][_eq]=read`,
  );
  const readable = new Set(perms.data.map((p) => p.collection));
  const publicCollections = [
    ...Object.keys(collections),
    ...blockKeys,
    JUNCTION,
  ];
  for (const col of publicCollections) {
    if (readable.has(col)) {
      report("exists", `public read ${col}`);
      continue;
    }
    await api("POST", "/permissions", {
      policy: publicPolicy.id,
      collection: col,
      action: "read",
      fields: ["*"],
    });
    report("created", `public read ${col}`);
  }
}

// ---------------------------------------------------------------------------

const summary = Object.entries(counts)
  .map(([k, v]) => `${k}: ${v}`)
  .join(", ");
console.log(`--- Done (${summary}) ---`);
if (warnings > 0) {
  console.log(`NOTE: ${warnings} warning(s) above need manual attention.`);
}
