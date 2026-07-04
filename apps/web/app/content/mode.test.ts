import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contentMode, withFallback } from "./mode.server";

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  delete process.env.CONTENT_MODE;
  vi.restoreAllMocks();
});

describe("contentMode", () => {
  it("defaults to auto when CONTENT_MODE is unset", () => {
    delete process.env.CONTENT_MODE;
    expect(contentMode()).toBe("auto");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns each recognized mode", () => {
    for (const mode of ["auto", "cms", "static"] as const) {
      process.env.CONTENT_MODE = mode;
      expect(contentMode()).toBe(mode);
    }
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("treats an unknown value as auto and warns exactly once", () => {
    process.env.CONTENT_MODE = "bogus-mode";
    expect(contentMode()).toBe("auto");
    expect(contentMode()).toBe("auto");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('unknown CONTENT_MODE "bogus-mode"')
    );
  });
});

describe("withFallback — auto mode", () => {
  beforeEach(() => {
    process.env.CONTENT_MODE = "auto";
  });

  it("serves CMS content when present, without warning", () => {
    expect(withFallback("things", ["cms"], ["default"])).toEqual(["cms"]);
    expect(withFallback("thing", { id: 1 }, { id: 2 })).toEqual({ id: 1 });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("serves defaults and warns once per fallback when CMS is empty", () => {
    expect(withFallback("null things", null, ["default"])).toEqual(["default"]);
    expect(withFallback("undef things", undefined, ["default"])).toEqual(["default"]);
    expect(withFallback("empty things", [], ["default"])).toEqual(["default"]);
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith("[content] fallback served for null things");
    expect(warnSpy).toHaveBeenCalledWith("[content] fallback served for empty things");
  });

  it("does not warn when the defaults are empty too (nothing is masked)", () => {
    expect(withFallback<string | null>("missing", null, null)).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe("withFallback — cms mode", () => {
  beforeEach(() => {
    process.env.CONTENT_MODE = "cms";
  });

  it("serves CMS content when present", () => {
    expect(withFallback("things", ["cms"], ["default"])).toEqual(["cms"]);
  });

  it("never falls back and never warns when CMS is empty", () => {
    expect(withFallback("things", [], ["default"])).toEqual([]);
    expect(withFallback("things", null, ["default"])).toEqual([]);
    expect(withFallback("things", undefined, ["default"])).toEqual([]);
    expect(withFallback<{ id: number } | null>("thing", null, { id: 2 })).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe("withFallback — static mode", () => {
  beforeEach(() => {
    process.env.CONTENT_MODE = "static";
  });

  it("always serves defaults, even when CMS content exists, without warning", () => {
    expect(withFallback("things", ["cms"], ["default"])).toEqual(["default"]);
    expect(withFallback("things", null, ["default"])).toEqual(["default"]);
    expect(withFallback("thing", { id: 1 }, { id: 2 })).toEqual({ id: 2 });
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
