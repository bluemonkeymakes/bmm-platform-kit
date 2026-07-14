#!/usr/bin/env node
/**
 * First-run setup: create .env from .env.example and fill in the secrets.
 *
 * The kit has no default passwords on purpose (see docker-compose.yml), which
 * means a fresh clone needs five generated values before anything will start.
 * Doing that by hand is exactly the kind of chore people skip — and skipping it
 * is how "change-me" ends up in production. So we do it for them.
 *
 * Safe to re-run: an existing .env is never overwritten, and any secret that is
 * already filled in is left alone. Only blank required secrets get generated.
 */
import { randomBytes } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const examplePath = join(root, ".env.example");

/** Secrets we can safely generate. Anything else is a human decision. */
const GENERATED = [
  "DIRECTUS_SECRET",
  "DIRECTUS_ADMIN_PASSWORD",
  "DIRECTUS_DB_PASSWORD",
  "TWENTY_APP_SECRET",
  "TWENTY_DB_PASSWORD",
  "INTERNAL_API_KEY",
  "CSRF_SECRET",
];

const secret = () => randomBytes(32).toString("hex");

if (!existsSync(examplePath)) {
  console.error("✗ .env.example is missing — are you in the repo root?");
  process.exit(1);
}

const isNew = !existsSync(envPath);
if (isNew) {
  copyFileSync(examplePath, envPath);
  console.log("✓ created .env from .env.example");
} else {
  console.log("• .env already exists — filling in any blank secrets, keeping the rest");
}

const lines = readFileSync(envPath, "utf8").split("\n");
const filled = [];

const updated = lines.map((line) => {
  const match = /^([A-Z_0-9]+)=(.*)$/.exec(line);
  if (!match) return line;

  const [, key, value] = match;
  if (!GENERATED.includes(key) || value.trim() !== "") return line;

  filled.push(key);
  return `${key}=${secret()}`;
});

writeFileSync(envPath, updated.join("\n"));

if (filled.length > 0) {
  console.log(`✓ generated ${filled.length} secret(s): ${filled.join(", ")}`);
} else {
  console.log("• all required secrets were already set — nothing to generate");
}

console.log("\nNext:");
console.log("  npm install");
console.log("  npm run dev        # start Postgres, Redis, Directus, Twenty");
console.log("  npm run seed       # apply the CMS schema");
console.log("\nYour Directus admin login is DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD in .env");
