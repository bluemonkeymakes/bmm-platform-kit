#!/usr/bin/env node
/**
 * Token-purity lint — automated enforcement of the design-system token rules
 * at the code layer. Components and routes must consume BRAND TOKENS, never
 * hard-coded values, so that a change in app/brand/ propagates to every element.
 *
 * Flags:
 *   1. Hard-coded hex colors        → won't follow the brand palette
 *   2. Arbitrary px values          → breaks rem-only scaling; hairline
 *      (non-ring/border/outline)       ring/border widths are allowed
 *   3. Arbitrary font-size text-[…] → type sizes must come from the scale
 *      (em/px exempt)                  (text-2xs … text-9xl); see design-system-principles §2
 *   4. Raw z-index z-[…] / z-50     → use the named stack (z-dropdown … z-cursor)
 *   5. !important                   → bypasses the system
 *   6. Arbitrary rem sizes w-[…rem] → use a spacing step (min-h-20 = 5rem) or a
 *                                      named token (max-w-measure); em/ch stay free
 *   7. Arbitrary colors bg-[hsl(…)] → colors come from brand token utilities
 *
 * A line may opt out of a soft rail with a `token-lint-ignore` comment + reason.
 *
 * Brand CSS (app/brand/*) is intentionally exempt — it IS the swap surface.
 * Run: npm run lint:tokens   ·   See sops/design-system-contribution.md
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOTS = ["app/components", "app/routes"];
const EXTS = new Set([".ts", ".tsx"]);

/** utility bases where a px value is an acceptable hairline (ring/border/outline width) */
const HAIRLINE = /^(ring|ring-offset|border|border-[trblxy]|divide-[xy]|outline)$/;

const violations = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTS.has(extname(full))) lintFile(full);
  }
}

function lintFile(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return; // skip comments
    if (line.includes("token-lint-ignore")) return; // explicit per-line escape hatch (soft rails)

    // 1. hard-coded hex color
    const hex = line.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
    if (hex) push(file, i, line, `hard-coded hex color ${hex[0]} — use a brand token`);

    // 2. arbitrary px (excluding hairline ring/border/outline widths)
    for (const m of line.matchAll(/([a-z-]*)\[[^\]]*?\d*\.?\d+px[^\]]*\]/g)) {
      const base = m[1].replace(/-$/, ""); // utility immediately before the bracket
      if (HAIRLINE.test(base)) continue;
      push(file, i, line, `arbitrary px value ${m[0]} — use rem or a token`);
    }

    // 3. arbitrary font-size — type sizes come from the scale (text-2xs … text-9xl),
    //    never a bracket. Relative em (inline code) and px (flagged above) are exempt.
    for (const m of line.matchAll(/\btext-\[[^\]]*\d[^\]]*\]/g)) {
      if (/\d(?:px|em)\b/.test(m[0])) continue;
      push(file, i, line, `arbitrary font-size ${m[0]} — use a type-scale step (e.g. text-2xs)`);
    }

    // 4. arbitrary z-index — z comes from the named stack (z-dropdown … z-cursor),
    //    never a number: neither a bracket (z-[60]) nor Tailwind's numeric scale (z-50).
    for (const m of line.matchAll(/\bz-\[\d[^\]]*\]|\bz-\d+\b/g)) {
      push(file, i, line, `raw z-index ${m[0]} — use a named z step (z-dropdown … z-cursor)`);
    }

    // 5. !important
    if (line.includes("!important")) push(file, i, line, "!important bypasses the token system");

    // 6. arbitrary rem sizes — v4's dynamic spacing covers any 0.25rem multiple
    //    (min-h-20 = 5rem); anything else earns a named token (max-w-measure).
    //    text-[…rem] is rule 3's territory; relative em/ch/vh stay allowed.
    for (const m of line.matchAll(/([a-z-]*)\[[^\]]*?\d*\.?\d+rem[^\]]*\]/g)) {
      const base = m[1].replace(/-$/, "");
      if (base === "text") continue;
      push(
        file,
        i,
        line,
        `arbitrary rem value ${m[0]} — use a spacing step (min-h-20) or add a named token (max-w-measure)`,
      );
    }

    // 7. arbitrary color functions in utility brackets — colors come from brand
    //    token utilities, never inline hsl()/rgb()/oklch()
    for (const m of line.matchAll(/[a-z-]+-\[(?:hsl|rgb|oklch|hwb|lab|lch)\([^\]]*\]/g)) {
      push(file, i, line, `arbitrary color ${m[0]} — use a brand token utility`);
    }
  });
}

function push(file, i, line, msg) {
  violations.push(`  ${file}:${i + 1}  ${msg}\n      ${line.trim()}`);
}

ROOTS.forEach(walk);

if (violations.length) {
  console.error(`\n✗ token-lint: ${violations.length} violation(s)\n`);
  console.error(violations.join("\n"));
  console.error(
    "\nComponents must consume brand tokens so changes in app/brand/ propagate." +
      "\nSee docs sops/design-system-contribution.md.\n",
  );
  process.exit(1);
}

console.log("✓ token-lint: clean — all components consume brand tokens");
