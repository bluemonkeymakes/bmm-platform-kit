# Starter Kit (bmm-platform-kit)

Full-stack starter for content-driven sites: React Router 7 (SSR) + NestJS BFF +
Directus 11 CMS + Twenty CRM, wired with Docker Compose. Forked per project.
Workspace-level conventions in `~/Dev-local/bluemonkeymakes/.claude/` apply here
(design-system rules + the `design-system-reviewer` agent).

## Commands (all real — don't invent others)

```bash
npm run dev            # docker compose up: Postgres ×2, Redis, Directus :8055, Twenty :3003
npm run seed           # idempotent Directus schema apply (node directus/apply-schema.ts)
npm run schema:check   # read-only drift gate: live Directus vs app/content/schema.ts
npm run dev:web        # RR7 dev server :5173 (auto-applies schema on boot + on schema.ts save)
npm run dev:api        # NestJS BFF :4001
# in apps/web:
npm run typecheck      # react-router typegen && tsc
npm run lint:tokens    # design-system token purity (no hex/px/arbitrary values)
npm test               # vitest — content pipeline suite
npm run build          # production build
```

Env: root `.env` (copy from `.env.example`). Host-run dev servers need the
`localhost` URL variants (docker-internal hostnames are for the production
compose overlay only). NestJS reads `.env` from its own cwd — the dev scripts
here source the root `.env` first.

## Architecture (what matters)

- **BFF pattern** — browser → RR7 SSR → NestJS → Directus/Twenty/Resend.
  Server-side loaders in `apps/web/app/lib/directus.server.ts` fetch Directus
  directly (SSR-only).
- **Content pipeline (single source of truth)** — every content type is
  declared ONCE in `apps/web/app/content/schema.ts` using the DSL in
  `fields.ts` (Zod validator + Directus field metadata + asset flag per
  field). Derived from it: TS types (`z.infer`, re-exported via
  `~/types/content`), the Directus schema (`directus/apply-schema.ts`,
  additive/warn-only, includes the pages↔blocks M2A), runtime validation
  (`app/content/validate.ts` — invalid blocks DROP with a `[content]` warn;
  nulls stripped recursively; asset UUIDs → absolute URLs), typed fallbacks
  (`app/data/defaults.ts` must `satisfies` the schema), and the style-guide
  block registry. **Never hand-edit a derived artifact — edit schema.ts.**
  Decision record: docs ADR-009 (Directus over Payload, with spike evidence).
- **Design system** — bmm-design-system architecture: `app/brand/` is the
  swap surface (color ramps, fonts, effects); `app/system/theme.css` is the
  contract, kept byte-identical with the reference repo
  (`~/Dev-local/bluemonkeymakes/design-system`) — re-copy from there, never
  edit locally. Full 35-component ui set; divergences catalogued in
  `apps/web/DESIGN-SYSTEM-NOTES.md` (5 brand-adapted components, mapping
  tables, porting checklist).
- **Fallback content** — every route renders defaults when Directus is
  empty/down. This MASKS CMS failures: a "working" page proves nothing about
  the CMS path. Check the dev-server log for `[content]`/fetch warnings.

## Conventions

- Blocks workflow: schema.ts → `npm run seed` (or just save; dev watcher
  applies) → component in `components/blocks/` + register in BlockRenderer +
  the name map on /style-guide/patterns/blocks → typed default in defaults.ts.
- Design system hard rules (enforced by `lint:tokens` + workspace rule): no
  arbitrary values, select-don't-restyle, variants by intent, named z ladder,
  three elevation roles. New/changed ui components get a style-guide entry in
  the same change.
- Branch per change → PR; merge stacked PRs with merge commits, not squash.
- Commit style: short imperative lowercase subject (matches history).

## Gotchas

- **Directus response cache** (Redis, ~5 min TTL) delays content visibility in
  dev — `POST /utils/cache/clear` (admin) after scripted content/schema writes.
  Its schema cache also serves stale `/fields` after raw-API field mutations.
- `schema:check` fails on UI-added fields by design — define them in schema.ts
  or remove them; the Directus admin UI is not the source of truth here.
- apply-schema never alters/drops existing columns (warn-only) — renames and
  type changes are a manual migration.
- Local port remaps for parallel stacks (e.g. Twenty 3003→3004) live in
  `docker-compose.override.yml` (gitignored).
