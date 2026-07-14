# Starter Kit

Full-stack starter for content-driven sites: React Router 7 (SSR) + NestJS BFF +
Directus 11 CMS + Twenty CRM, wired with Docker Compose. Forked per project.

## Commands (all real — don't invent others)

```bash
npm run setup          # create .env from .env.example + generate required secrets (idempotent)
npm run dev            # docker compose up: Postgres ×2, Redis, Directus :8055, Twenty :3003
npm run seed           # idempotent Directus schema apply (node directus/apply-schema.ts)
npm run seed:content   # seed demo content from app defaults (node directus/seed-content.ts; re-runnable)
npm run schema:check   # read-only drift gate: live Directus vs app/content/schema.ts
npm run dev:web        # RR7 dev server :5173 (auto-applies schema on boot + on schema.ts save)
npm run dev:api        # NestJS BFF :4001
# in apps/web:
npm run typecheck      # react-router typegen && tsc
npm run lint:tokens    # design-system token purity (no hex/px/arbitrary values)
npm test               # vitest — content pipeline + sanitization suite
npm run build          # production build
```

Env: root `.env` (run `npm run setup`, or copy `.env.example` by hand). Host-run
dev servers need the `localhost` URL variants (docker-internal hostnames are for
the production compose overlay only). NestJS reads `.env` from its own cwd — the
dev scripts here source the root `.env` first.

## Architecture (what matters)

- **BFF pattern** — browser → RR7 SSR → NestJS → Directus/Twenty/Resend.
  Server-side loaders in `apps/web/app/lib/directus.server.ts` fetch Directus
  directly (SSR-only).
- **Content pipeline (single source of truth)** — every content type is
  declared ONCE in `apps/web/app/content/schema.ts` using the DSL in
  `fields.ts` (Zod validator + Directus field metadata + asset/richText flags
  per field). Derived from it: TS types (`z.infer`, re-exported via
  `~/types/content`), the Directus schema (`directus/apply-schema.ts`,
  additive/warn-only, includes the pages↔blocks M2A), runtime validation
  (`app/content/validate.ts` — invalid blocks DROP with a `[content]` warn;
  nulls stripped recursively; asset UUIDs → absolute URLs; richText fields
  sanitized), typed fallbacks (`app/data/defaults.ts` must `satisfies` the
  schema), and the style-guide block registry.
  **Never hand-edit a derived artifact — edit schema.ts.**
- **Design system** — `app/brand/` is the swap surface (color ramps, fonts,
  effects); `app/system/theme.css` is the contract and travels unchanged.
  Re-brand by editing `app/brand/` only. Full 35-component ui set; divergences
  and porting notes in `apps/web/DESIGN-SYSTEM-NOTES.md`.
- **Fallback content** — every route renders defaults when Directus is
  empty/down. This MASKS CMS failures: a "working" page proves nothing about
  the CMS path. Check the dev-server log for `[content]`/fetch warnings.

## Security invariants (do not regress these)

The kit is public and gets forked, so an insecure default becomes someone
else's vulnerability. These are deliberate; don't "simplify" them away:

- **No default secrets.** Every secret in `docker-compose.yml` uses
  `${VAR:?msg}` so compose fails loudly instead of substituting a value.
  Never reintroduce a `:-default` for a password, signing key, or API key.
- **Fail closed.** `CSRF_SECRET` missing → the web server throws on boot.
  Turnstile unconfigured → passes in dev, REJECTS in production.
  `INTERNAL_API_KEY` missing → the guard 401s everything.
- **Constant-time compares** for the API key (`apps/api/src/guards/api-key.guard.ts`)
  and the CSRF token (`apps/web/app/lib/csrf.server.ts`). Never `!==`.
- **richText is sanitized** at the loader boundary, not in the component. Any
  new HTML-bearing field must use `f.richText()` — that flag is what triggers
  sanitization in `validate.ts`. The sanitizer is *injected* so it never lands
  in the client bundle.
- **CSP** is nonce-based in production (`app/entry.server.tsx`). Any new inline
  `<script>` must carry `useNonce()`. Dev is deliberately looser because Vite
  injects its own inline scripts.
- **Production publishes only the web app.** `ports: !reset []` in the overlay
  is load-bearing — compose APPENDS port lists, so without it the base file's
  bindings survive and Directus/Twenty land on the public internet.

## Conventions

- Blocks workflow: schema.ts → `npm run seed` (or just save; dev watcher
  applies) → component in `components/blocks/` + register in BlockRenderer +
  the name map on /style-guide/patterns/blocks → typed default in defaults.ts.
- Design system hard rules (enforced by `lint:tokens`): no arbitrary values,
  select-don't-restyle, variants by intent, named z ladder, three elevation
  roles. New/changed ui components get a style-guide entry in the same change.
- Branch per change → PR; merge stacked PRs with merge commits, not squash.
- Commit style: short imperative lowercase subject (matches history).
- Public-facing prose (README, SECURITY.md, site copy): no em-dashes as clause
  separators, semicolons sparingly. Code comments are exempt.

## Gotchas

- **Directus response cache** (Redis): `CACHE_AUTO_PURGE` is enabled in the
  compose, so content edits (admin UI or API) propagate to the app
  immediately. The schema cache is separate — raw-API field mutations can
  still serve stale `/fields`; `POST /utils/cache/clear` (admin) if needed.
- `schema:check` fails on UI-added fields by design — define them in schema.ts
  or remove them; the Directus admin UI is not the source of truth here.
- apply-schema never alters/drops existing columns (warn-only) — renames and
  type changes are a manual migration.
- Local port remaps for parallel stacks (e.g. Twenty 3003→3004) live in
  `docker-compose.override.yml` (gitignored).
- Fallback content masks CMS failures — set `CONTENT_MODE=cms` to unmask;
  `auto` (default) logs `[content] fallback served for …` lines.
