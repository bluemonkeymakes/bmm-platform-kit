import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Spawn `node directus/apply-schema.ts` without blocking the dev server.
 * stdout streams through prefixed with [schema]; stderr is held back so a
 * down Directus produces one friendly skip line instead of a stack trace.
 */
export function runSchemaApply(repoRoot: string): void {
  const script = path.join(repoRoot, "directus", "apply-schema.ts");
  const child = spawn(process.execPath, [script], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const prefixLines = (chunk: Buffer | string) => {
    for (const line of chunk.toString().split("\n")) {
      if (line.trim()) console.log(`[schema] ${line}`);
    }
  };

  let stderr = "";
  child.stdout.on("data", prefixLines);
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  child.on("error", () => {
    console.log("[schema] apply skipped — Directus not reachable");
  });
  child.on("exit", (code) => {
    if (code !== 0) {
      console.log("[schema] apply skipped — Directus not reachable");
    } else if (stderr.trim()) {
      prefixLines(stderr);
    }
  });
  child.unref();
}

/** Dev-only: auto-apply the Directus schema when the dev server boots. */
function schemaAutoApply(): Plugin {
  return {
    name: "starter:schema-auto-apply",
    apply: "serve",
    configureServer() {
      const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
      runSchemaApply(repoRoot);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), schemaAutoApply()],
  server: {
    port: 5173,
  },
});
