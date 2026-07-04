// Content-source mode. Controls whether routes serve CMS content, the static
// defaults in ~/data/defaults, or the current serve-CMS-else-fall-back blend.
//
//   auto   (default) CMS content when present, defaults otherwise — every
//                    fallback decision is logged so masking stays visible
//   cms    CMS only — empty CMS yields the loader's honest empty result
//   static defaults only — Directus is never contacted (fetches are skipped
//          in ~/lib/directus.server)

export type ContentMode = "auto" | "cms" | "static";

const MODES: readonly ContentMode[] = ["auto", "cms", "static"];

const warnedUnknownValues = new Set<string>();

export function contentMode(): ContentMode {
  const raw = process.env.CONTENT_MODE;
  if (!raw) return "auto";
  if ((MODES as readonly string[]).includes(raw)) return raw as ContentMode;
  if (!warnedUnknownValues.has(raw)) {
    warnedUnknownValues.add(raw);
    console.warn(
      `[content] unknown CONTENT_MODE "${raw}" — expected auto|cms|static, using "auto"`
    );
  }
  return "auto";
}

function isEmpty(value: unknown): boolean {
  return value == null || (Array.isArray(value) && value.length === 0);
}

/**
 * Pick between CMS content and static defaults per the active CONTENT_MODE.
 * Emptiness = null/undefined/empty-array.
 *
 * - auto:   cms when non-empty, else defaults (+ one warn per fallback served)
 * - cms:    never defaults — empty cms returns the honest empty shape
 * - static: always defaults
 */
export function withFallback<T>(label: string, cms: T | null | undefined, defaults: T): T {
  const mode = contentMode();

  if (mode === "static") return defaults;

  if (!isEmpty(cms)) return cms as T;

  if (mode === "cms") {
    // Honest empty result: keep the empty-array shape when that's what the
    // caller works with; otherwise pass the empty CMS value through.
    if (Array.isArray(defaults)) return (Array.isArray(cms) ? cms : []) as T;
    return cms as T;
  }

  // auto: fall back — but empty defaults can't mask anything, so don't warn.
  if (!isEmpty(defaults)) {
    console.warn(`[content] fallback served for ${label}`);
  }
  return defaults;
}
