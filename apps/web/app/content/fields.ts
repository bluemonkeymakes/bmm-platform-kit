/**
 * Content-schema DSL — the single source of truth for every content type.
 *
 * Each field is defined ONCE and carries both halves of the contract:
 *   • `schema`   — the Zod validator (drives TS types + runtime validation)
 *   • `directus` — the Directus field definition (drives schema generation
 *                  via directus/apply-schema.ts)
 *   • `asset`    — marks file fields so the loader can normalize UUIDs to
 *                  absolute asset URLs before data reaches components.
 *
 * Derived from here: TS types (z.infer), runtime validation at the loader
 * boundary, the Directus collections/fields/M2A junction, typed fallback
 * defaults, and the style-guide block registry. Do not hand-edit those —
 * edit this.
 */
import { z } from "zod";

export type DirectusFieldType =
  | "string"
  | "text"
  | "integer"
  | "boolean"
  | "uuid"
  | "json"
  | "timestamp";

export interface DirectusFieldMeta {
  type: DirectusFieldType;
  interface: string;
  options?: Record<string, unknown>;
}

export interface FieldDef<S extends z.ZodType = z.ZodType> {
  schema: S;
  directus: DirectusFieldMeta;
  /** file-uuid field — loader rewrites to an absolute /assets URL */
  asset?: boolean;
  /** raw-HTML field — loader sanitizes it before any component can render it */
  richText?: boolean;
}

/** Field constructors — the closed set of field kinds the kit supports. */
export const f = {
  /** Single-line text. */
  string: () =>
    ({
      schema: z.string().optional(),
      directus: { type: "string", interface: "input" },
    }) satisfies FieldDef,

  /** Required single-line text (titles). */
  requiredString: () =>
    ({
      schema: z.string(),
      directus: { type: "string", interface: "input" },
    }) satisfies FieldDef,

  /** Multi-line plain text. */
  text: () =>
    ({
      schema: z.string().optional(),
      directus: { type: "text", interface: "input-multiline" },
    }) satisfies FieldDef,

  /**
   * Rich text (HTML from the Directus WYSIWYG).
   *
   * The value is raw HTML and ends up in `dangerouslySetInnerHTML` via <Prose>,
   * so it is `richText: true` — the loader boundary sanitizes it (see
   * content/validate.ts). A CMS editor is a lower trust level than a developer:
   * without this, anyone who can save an article could store XSS on every page
   * that renders it.
   */
  richText: () =>
    ({
      schema: z.string().optional(),
      directus: { type: "text", interface: "input-rich-text-html" },
      richText: true,
    }) satisfies FieldDef,

  /** Image file — UUID in Directus, absolute URL by the time components see it. */
  image: () =>
    ({
      schema: z.string().optional(),
      directus: { type: "uuid", interface: "file-image" },
      asset: true,
    }) satisfies FieldDef,

  integer: () =>
    ({
      schema: z.number().int().optional(),
      directus: { type: "integer", interface: "input" },
    }) satisfies FieldDef,

  /** On/off toggle. */
  boolean: () =>
    ({
      schema: z.boolean().optional(),
      directus: { type: "boolean", interface: "boolean" },
    }) satisfies FieldDef,

  /** Dropdown from a closed set of choices. */
  select: <const T extends readonly [string, ...string[]]>(choices: T) =>
    ({
      schema: z.enum(choices).optional(),
      directus: {
        type: "string",
        interface: "select-dropdown",
        options: {
          choices: choices.map((value) => ({
            text: value.charAt(0).toUpperCase() + value.slice(1),
            value,
          })),
        },
      },
    }) satisfies FieldDef,

  /** Repeater list of structured items (features, FAQ entries, stats…). */
  list: <S extends z.ZodType>(itemSchema: S) =>
    ({
      schema: z.array(itemSchema).optional(),
      directus: { type: "json", interface: "list" },
    }) satisfies FieldDef,

  /** Free-form tag list. */
  tags: () =>
    ({
      schema: z.array(z.string()).optional(),
      directus: { type: "json", interface: "tags" },
    }) satisfies FieldDef,

  timestamp: () =>
    ({
      schema: z.string().optional(),
      directus: { type: "timestamp", interface: "datetime" },
    }) satisfies FieldDef,
} as const;

type FieldMap = Record<string, FieldDef>;

type ShapeOf<F extends FieldMap> = {
  [K in keyof F]: F[K]["schema"];
};

export interface BlockDef<F extends FieldMap = FieldMap> {
  /** Directus collection key, e.g. "block_hero". */
  key: string;
  /** Human name shown in the style-guide registry. */
  label: string;
  /** One-line purpose shown in the style-guide registry. */
  purpose: string;
  fields: F;
  /** Zod object over all fields — z.infer gives the block's data type. */
  schema: z.ZodObject<ShapeOf<F>>;
}

export function defineBlock<F extends FieldMap>(def: {
  key: string;
  label: string;
  purpose: string;
  fields: F;
}): BlockDef<F> {
  const shape = Object.fromEntries(
    Object.entries(def.fields).map(([name, field]) => [name, field.schema]),
  ) as ShapeOf<F>;
  return { ...def, schema: z.object(shape) };
}

export interface CollectionDef<F extends FieldMap = FieldMap> {
  key: string;
  note: string;
  fields: F;
  schema: z.ZodObject<ShapeOf<F>>;
}

export function defineCollection<F extends FieldMap>(def: {
  key: string;
  note: string;
  fields: F;
}): CollectionDef<F> {
  const shape = Object.fromEntries(
    Object.entries(def.fields).map(([name, field]) => [name, field.schema]),
  ) as ShapeOf<F>;
  return { ...def, schema: z.object(shape) };
}
