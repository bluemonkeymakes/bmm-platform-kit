import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The /design-system coverage ratchet (ADR-021): one page per primitive,
 * component and block, or the commit fails.
 *
 * Policy: "if it isn't documented in /design-system, it doesn't ship." Three
 * layers are checked, each against its own pages:
 *
 *   • primitives  app/components/ui/*        every exported component must be
 *                                            imported by a design-system.* page
 *   • blocks      app/components/blocks/*    each module imported by a
 *                                            design-system.blocks.* page
 *   • components  app/components/<any other dir>/*  each module imported by a
 *                                            design-system.components.* page
 *
 * Only design-system.* route modules count. A site page that happens to import
 * a component does not document it: that loophole is why the pages are named
 * by layer rather than recognised by content.
 *
 * `components/ds/` is exempt from REGISTRATION ONLY: it is the design-system
 * site's own chrome (CodeBlock, Preview, SpecimenSection), which builds the
 * pages rather than being described by them. It is fully in scope for every
 * styling convention: tokens, select-don't-restyle, variant naming, states.
 * Decided explicitly 2026-07-27, because "out of scope" had been drifting from
 * "needs no page" to "needs no rules".
 *
 * Imported-by-a-page is the proxy for documented. Biome fails the build on an
 * unused import, so an imported symbol is a rendered symbol.
 */

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, "app/components");
const UI_DIR = join(COMPONENTS_DIR, "ui");
const ROUTES_DIR = join(ROOT, "app/routes");
/** Not a layer: the design-system site's own chrome (see the header). */
const EXEMPT_DIRS = new Set(["ui", "ds"]);

/**
 * Exported components that are legitimately invisible, so no specimen can show
 * them. Every entry states why — an allowlist without reasons becomes a place to
 * hide gaps. Anything users can actually see belongs on a page, not in here.
 */
const NON_VISUAL: Record<string, string> = {
  "toast:ToastProvider":
    "Context provider — mounted in the root layout, renders no surface of its own",
  "tooltip:TooltipProvider": "Radix provider — carries delay config, renders nothing",
  "dropdown-menu:DropdownMenuGroup": "Semantic grouping wrapper (role=group), no visual treatment",
  "popover:PopoverAnchor": "Positioning reference for the popover, renders no visible element",
};

/**
 * Component and block modules that render nothing of their own, so no page can
 * show them. Same rule as NON_VISUAL: every entry states why, and anything a
 * user can see belongs on a page instead.
 */
const COMPOSED_NON_VISUAL: Record<string, string> = {
  "layout/ThemeProvider": "Context provider for the colour scheme, renders only its children",
  "common/MotionWrapper":
    "Motion utilities (FadeIn, Stagger*) that animate their children; documented with the motion scale on /design-system/foundations/motion",
  "blocks/BlockRenderer":
    "Dispatcher that maps each CMS block to its component; every block it renders has its own /design-system/blocks page",
};

/** Named exports of a module, narrowed to things that render. */
function exportedComponents(source: string): string[] {
  const names = new Set<string>();

  for (const m of source.matchAll(/^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/gm)) {
    names.add(m[1]);
  }
  for (const m of source.matchAll(/^export\s+const\s+([A-Za-z0-9_]+)/gm)) {
    names.add(m[1]);
  }
  for (const m of source.matchAll(/^export\s*\{([^}]*)\}/gms)) {
    for (const clause of m[1].split(",")) {
      // `Foo as Bar` is exported under Bar; `type Foo` is not a component.
      const trimmed = clause.trim();
      if (!trimmed || trimmed.startsWith("type ")) continue;
      const name = trimmed
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) names.add(name);
    }
  }

  return [...names].filter(
    // PascalCase = a component. Excludes hooks (useToast), pure helpers
    // (computePages, isExternalHref) and the CVA class builders, none of which
    // are elements a user sees.
    (name) => /^[A-Z]/.test(name) && !name.endsWith("Variants"),
  );
}

/** Component names each route imports, keyed by the ui module they came from. */
function importsByModule(sources: string[]): Map<string, Set<string>> {
  const byModule = new Map<string, Set<string>>();
  const importRe =
    /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']~\/components\/ui\/([a-z0-9-]+)["']/gs;

  for (const source of sources) {
    for (const m of source.matchAll(importRe)) {
      const [, clauses, moduleName] = m;
      const names = byModule.get(moduleName) ?? new Set<string>();
      for (const clause of clauses.split(",")) {
        const trimmed = clause.trim();
        if (!trimmed || trimmed.startsWith("type ")) continue;
        const name = trimmed.split(/\s+as\s+/)[0]?.trim();
        if (name) names.add(name);
      }
      byModule.set(moduleName, names);
    }
  }

  return byModule;
}

const uiModules = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
  .map((f) => ({
    name: f.replace(/\.tsx$/, ""),
    components: exportedComponents(readFileSync(join(UI_DIR, f), "utf8")),
  }));

/** design-system.* route modules, grouped by layer (the segment after the prefix). */
const pageFiles = readdirSync(ROUTES_DIR).filter(
  (f) => f.startsWith("design-system.") && f.endsWith(".tsx"),
);
const pagesIn = (layer?: string) =>
  pageFiles
    .filter((f) => !layer || f.startsWith(`design-system.${layer}.`))
    .map((f) => readFileSync(join(ROUTES_DIR, f), "utf8"));
const routeSources = pagesIn();

/** Every .tsx module under a directory, recursively, minus tests. */
function modulesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return modulesUnder(full);
    return entry.endsWith(".tsx") && !entry.includes(".test.") ? [full] : [];
  });
}

/** "~/components/<dir>/<name>" import specifiers used by a set of pages. */
function importedPaths(sources: string[]): Set<string> {
  const out = new Set<string>();
  for (const src of sources) {
    for (const m of src.matchAll(/from\s*["']~\/components\/([^"']+)["']/g)) out.add(m[1]);
  }
  return out;
}

const layerDirs = readdirSync(COMPONENTS_DIR).filter(
  (d) => !EXEMPT_DIRS.has(d) && statSync(join(COMPONENTS_DIR, d)).isDirectory(),
);
/** Components and blocks, as "~/components/…" specifiers with the extension dropped. */
const composed = layerDirs.flatMap((dir) =>
  modulesUnder(join(COMPONENTS_DIR, dir)).map((file) => ({
    spec: relative(COMPONENTS_DIR, file).replace(/\.tsx$/, ""),
    layer: dir === "blocks" ? "blocks" : "components",
  })),
);
const blockPageImports = importedPaths(pagesIn("blocks"));
const composedVisible = composed.filter((c) => !(c.spec in COMPOSED_NON_VISUAL));
const componentPageImports = importedPaths(pagesIn("components"));

const documented = importsByModule(routeSources);

describe("/design-system coverage", () => {
  it("finds components to check (guards against a parser that silently matches nothing)", () => {
    expect(uiModules.length).toBeGreaterThan(20);
    expect(uiModules.flatMap((m) => m.components).length).toBeGreaterThan(50);
    expect(routeSources.length).toBeGreaterThan(20);
  });

  if (composedVisible.length === 0) {
    // The starter ships no components or blocks; a fork's first one lands here.
    it.skip("components and blocks each have a /design-system page (none yet)", () => {});
  } else {
    it.each(composedVisible)("$spec — has a /design-system/$layer page", ({ spec, layer }) => {
      const shown = layer === "blocks" ? blockPageImports : componentPageImports;
      expect(
        shown.has(spec),
        `No /design-system page for ~/components/${spec}.\n` +
          `Add app/routes/design-system.${layer}.<name>.tsx that imports it, register it in ` +
          `app/routes.ts as "design-system/${layer}/<name>", and add it to app/lib/nav.ts.`,
      ).toBe(true);
    });
  }

  it.each(uiModules)("$name — every exported primitive is shown on a /design-system page", ({
    name,
    components,
  }) => {
    const shown = documented.get(name) ?? new Set<string>();
    const undocumented = components.filter((c) => !shown.has(c) && !(`${name}:${c}` in NON_VISUAL));

    expect(
      undocumented,
      `Not shown on any /design-system page: ${undocumented.join(", ")}.\n` +
        `Add a specimen to an app/routes/design-system.* page that imports it from ` +
        `"~/components/ui/${name}", or — only if it renders nothing a user can see — ` +
        `add "${name}:<Component>" to NON_VISUAL with the reason.`,
    ).toEqual([]);
  });

  it("keeps the composed allowlist honest — every entry names a real module and gives a reason", () => {
    const specs = new Set(composed.map((c) => c.spec));
    for (const [spec, reason] of Object.entries(COMPOSED_NON_VISUAL)) {
      expect(specs.has(spec), `COMPOSED_NON_VISUAL entry "${spec}" names no module — stale`).toBe(true);
      expect(reason.length, `COMPOSED_NON_VISUAL entry "${spec}" needs a reason`).toBeGreaterThan(20);
    }
  });

  it("keeps the allowlist honest — every entry names a real export and gives a reason", () => {
    for (const [key, reason] of Object.entries(NON_VISUAL)) {
      const [moduleName, component] = key.split(":");
      const target = uiModules.find((m) => m.name === moduleName);
      expect(target, `NON_VISUAL entry "${key}" names a module that doesn't exist`).toBeDefined();
      expect(
        target?.components,
        `NON_VISUAL entry "${key}" names an export that doesn't exist — stale allowlist`,
      ).toContain(component);
      expect(reason.length, `NON_VISUAL entry "${key}" needs a reason`).toBeGreaterThan(20);
    }
  });
});
