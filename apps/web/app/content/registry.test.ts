/**
 * Registry parity — every block in the content schema has a React component
 * registered in BlockRenderer, and vice versa. A block that exists only on
 * one side either renders nothing (schema-only) or can never receive valid
 * data (component-only); both are drift.
 */
import { describe, expect, it } from "vitest";
import { blockComponents } from "~/components/blocks/BlockRenderer";
import { blocks } from "./schema";

describe("block registry", () => {
  const schemaKeys = Object.keys(blocks).sort();
  const componentKeys = Object.keys(blockComponents).sort();

  it("every schema block has a registered component", () => {
    const missing = schemaKeys.filter((key) => !componentKeys.includes(key));
    expect(missing).toEqual([]);
  });

  it("every registered component key exists in the schema", () => {
    const orphaned = componentKeys.filter((key) => !schemaKeys.includes(key));
    expect(orphaned).toEqual([]);
  });

  it("the two registries are set-equal", () => {
    expect(componentKeys).toEqual(schemaKeys);
  });
});
