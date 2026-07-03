import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeAssets, validateBlocks } from "./validate";
import { blocks } from "./schema";
import type { PageBlock } from "~/types/content";

const toAssetUrl = (id: string) => `https://cms.example.com/assets/${id}`;

function block(collection: string, item: Record<string, unknown>, id = "b1"): PageBlock {
  return { id, sort: 1, collection, item };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("validateBlocks", () => {
  it("keeps a valid block and replaces its item with the parsed data", () => {
    const input = block("block_cta", {
      title: "Ready?",
      cta_text: "Go",
      cta_link: "/contact",
      variant: "accent",
      description: null, // null strip → dropped, still parses
    });

    const result = validateBlocks([input], toAssetUrl);

    expect(result).toHaveLength(1);
    expect(result[0].collection).toBe("block_cta");
    expect(result[0].item).toEqual({
      title: "Ready?",
      cta_text: "Go",
      cta_link: "/contact",
      variant: "accent",
    });
  });

  it("drops a block with an invalid enum value and warns exactly once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const input = block("block_cta", {
      title: "Ready?",
      cta_text: "Go",
      cta_link: "/contact",
      variant: "purple", // not in ["default", "accent"]
    });

    const result = validateBlocks([input], toAssetUrl);

    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("block_cta");
    expect(warn.mock.calls[0][0]).toContain("variant");
  });

  it("keeps an unknown collection as-is", () => {
    const input = block("block_pricing", { anything: "goes" });

    const result = validateBlocks([input], toAssetUrl);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(input); // untouched, not re-parsed
  });

  it("strips nulls recursively — repeater items with null fields survive and parse", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const input = block("block_features", {
      title: "Features",
      subtitle: null,
      features: [
        { icon: null, title: "One", description: "First" },
        { icon: "★", title: "Two", description: "Second" },
      ],
    });

    const result = validateBlocks([input], toAssetUrl);

    expect(warn).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    const item = result[0].item as {
      subtitle?: string;
      features: { icon?: string; title: string }[];
    };
    expect(item.subtitle).toBeUndefined();
    expect(item.features).toHaveLength(2);
    expect(item.features[0]).toEqual({ title: "One", description: "First" });
    expect(item.features[1].icon).toBe("★");
  });

  it("rewrites bare-UUID asset fields to absolute URLs via the injected builder", () => {
    const uuid = "0193b7a2-1111-2222-3333-444455556666";
    const input = block("block_hero", { title: "Hero", image: uuid });

    const result = validateBlocks([input], toAssetUrl);

    expect((result[0].item as { image?: string }).image).toBe(
      `https://cms.example.com/assets/${uuid}`,
    );
  });
});

describe("normalizeAssets", () => {
  const def = blocks.block_hero;

  it("leaves http:// and rooted / values untouched", () => {
    const http = normalizeAssets(def, { image: "http://example.com/pic.jpg" }, toAssetUrl);
    expect(http.image).toBe("http://example.com/pic.jpg");

    const rooted = normalizeAssets(def, { image: "/images/pic.jpg" }, toAssetUrl);
    expect(rooted.image).toBe("/images/pic.jpg");
  });

  it("does not touch non-asset fields even when they look like UUIDs", () => {
    const uuid = "0193b7a2-1111-2222-3333-444455556666";
    const out = normalizeAssets(def, { title: uuid, cta_link: uuid, image: uuid }, toAssetUrl);
    expect(out.title).toBe(uuid);
    expect(out.cta_link).toBe(uuid);
    expect(out.image).toBe(toAssetUrl(uuid)); // only the asset-flagged field
  });
});
