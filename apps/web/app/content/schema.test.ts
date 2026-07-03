import { describe, expect, it } from "vitest";
import { blocks, collections } from "./schema";
import { defaultHomeBlocks, defaultAboutBlocks } from "~/data/defaults";
import type { PageBlock } from "~/types/content";

describe("block definitions", () => {
  it.each(Object.entries(blocks))("%s: key matches map key, label + purpose set", (key, def) => {
    expect(def.key).toBe(key);
    expect(def.label.trim().length).toBeGreaterThan(0);
    expect(def.purpose.trim().length).toBeGreaterThan(0);
  });
});

describe("fallback defaults conform to the schema", () => {
  const defaultBlockSets: [string, PageBlock[]][] = [
    ["defaultHomeBlocks", defaultHomeBlocks],
    ["defaultAboutBlocks", defaultAboutBlocks],
  ];

  for (const [setName, set] of defaultBlockSets) {
    describe(setName, () => {
      it.each(set.map((b) => [b.id, b] as const))("%s parses", (_id, block) => {
        const def = blocks[block.collection as keyof typeof blocks];
        expect(def, `unknown block collection "${block.collection}"`).toBeDefined();
        const parsed = def.schema.safeParse(block.item);
        expect(
          parsed.success,
          parsed.success ? "" : JSON.stringify(parsed.error.issues, null, 2),
        ).toBe(true);
      });
    });
  }
});

describe("content collections", () => {
  it("covers pages, articles, team, testimonials", () => {
    expect(Object.keys(collections).sort()).toEqual(
      ["articles", "pages", "team", "testimonials"].sort(),
    );
    for (const [key, def] of Object.entries(collections)) {
      expect(def.key).toBe(key);
      expect(def.note.trim().length).toBeGreaterThan(0);
    }
  });
});
