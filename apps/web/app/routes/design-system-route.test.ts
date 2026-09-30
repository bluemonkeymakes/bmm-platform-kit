import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navFlat } from "~/lib/design-system-nav";

/**
 * The /design-system route itself (ADR-021). The coverage test proves every
 * primitive, component and block has a page; this proves the pages are
 * reachable where the standard says they are:
 *
 *   • /design-system exists (the route never moves, in the starter or a fork)
 *   • every design-system.* page module is registered in app/routes.ts, at the
 *     path its file name spells, and nothing registered points at a missing file
 *   • every page is noindex, and in lib/design-system-nav.ts, so the sidebar, the layer indexes and the
 *     command palette can all reach it
 */

const ROUTES_DIR = join(process.cwd(), "app/routes");
const routesTs = readFileSync(join(process.cwd(), "app/routes.ts"), "utf8");

/** [path, file] for every route("design-system…", "routes/…") in routes.ts. */
const registered = [
  ...routesTs.matchAll(/route\(\s*"(design-system[^"]*)"\s*,\s*"routes\/([^"]+)"/g),
].map((m) => ({ path: `/${m[1]}`, file: m[2] }));

const pageFiles = readdirSync(ROUTES_DIR).filter(
  (f) => f.startsWith("design-system.") && f.endsWith(".tsx") && f !== "design-system._layout.tsx",
);

/** design-system.primitives.buttons.tsx → /design-system/primitives/buttons (_index dropped). */
function pathFor(file: string): string {
  const parts = file.replace(/\.tsx$/, "").split(".");
  return `/${parts.filter((p) => p !== "_index").join("/")}`;
}

describe("/design-system route", () => {
  it("finds the routes (guards against a regex that silently matches nothing)", () => {
    expect(registered.length).toBeGreaterThan(20);
    expect(pageFiles.length).toBeGreaterThan(20);
  });

  it("serves the index at /design-system", () => {
    expect(registered.map((r) => r.path)).toContain("/design-system");
  });

  it("registers every design-system page file, at the path its name spells", () => {
    const byFile = new Map(registered.map((r) => [r.file, r.path]));
    for (const file of pageFiles) {
      expect(byFile.get(file), `${file} is not registered in app/routes.ts`).toBe(pathFor(file));
    }
  });

  it("points every registered design-system route at a page file that exists", () => {
    for (const { file } of registered) {
      expect(pageFiles, `app/routes.ts registers routes/${file}, which does not exist`).toContain(
        file,
      );
    }
  });

  it("marks every design-system page noindex (each page sets its own meta here)", () => {
    for (const file of pageFiles) {
      const src = readFileSync(join(ROUTES_DIR, file), "utf8");
      expect(src, `${file} has no robots noindex in its meta`).toMatch(/name:\s*"robots",\s*content:\s*"noindex/);
    }
  });

  it("lists every page in lib/nav.ts", () => {
    const inNav = new Set(navFlat.map((i) => i.to));
    for (const { path } of registered) {
      expect(inNav.has(path), `${path} has no entry in app/lib/nav.ts`).toBe(true);
    }
  });
});
