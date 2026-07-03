import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Spawn `node directus/apply-schema.ts` without blocking the dev server.
 * stdout streams through prefixed with [schema]. On failure, connection
 * errors collapse to one friendly skip line; any OTHER error prints in
 * full — a real apply failure must never be silent.
 */
export function runSchemaApply(repoRoot: string, onDone?: () => void): void {
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
    console.log("[schema] apply skipped — could not spawn node");
    onDone?.();
  });
  child.on("exit", (code) => {
    if (code !== 0) {
      if (/ECONNREFUSED|EAI_AGAIN|fetch failed|ETIMEDOUT/i.test(stderr)) {
        console.log("[schema] apply skipped — Directus not reachable");
      } else {
        console.log(`[schema] APPLY FAILED (exit ${code}):`);
        prefixLines(stderr || "(no stderr)");
      }
    } else if (stderr.trim()) {
      prefixLines(stderr);
    }
    onDone?.();
  });
  child.unref();
}

/**
 * Dev-only: auto-apply the Directus schema on dev-server boot, and re-apply
 * whenever the content schema files change (debounced; runs never overlap —
 * a change during an apply queues exactly one follow-up run).
 */
function schemaAutoApply(): Plugin {
  return {
    name: "starter:schema-auto-apply",
    apply: "serve",
    configureServer(server) {
      const here = path.dirname(fileURLToPath(import.meta.url));
      const repoRoot = path.resolve(here, "../..");
      const schemaFiles = new Set(
        ["schema.ts", "fields.ts"].map((f) => path.join(here, "app", "content", f)),
      );

      let running = false;
      let rerunQueued = false;
      let debounce: ReturnType<typeof setTimeout> | undefined;

      const run = () => {
        if (running) {
          rerunQueued = true;
          return;
        }
        running = true;
        runSchemaApply(repoRoot, () => {
          running = false;
          if (rerunQueued) {
            rerunQueued = false;
            run();
          }
        });
      };

      server.watcher.on("change", (file) => {
        if (!schemaFiles.has(path.resolve(file))) return;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          console.log(`[schema] ${path.basename(file)} changed — re-applying`);
          run();
        }, 400);
      });

      run();
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), schemaAutoApply()],
  server: {
    port: 5173,
  },
});
