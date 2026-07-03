/**
 * Vitest config — deliberately separate from vite.config.ts so tests don't
 * load the React Router dev plugin or the schema auto-apply plugin.
 */
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["app/**/*.test.{ts,tsx}"],
  },
});
