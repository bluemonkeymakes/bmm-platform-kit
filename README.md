# Starter Kit

Full-stack starter for content-driven web applications. React Router 7 + NestJS BFF + Directus CMS + Twenty CRM, wired together with Docker Compose.

Built from patterns used across multiple production projects — class enrollment platforms, booking systems, service business sites. Every pattern here has been battle-tested.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React Router 7 (SSR), Tailwind CSS 4 (CSS-first `@theme`), bmm-design-system (shadcn-derived components on Radix + CVA, direct-palette tokens per ADR-007), Motion (formerly Framer Motion), Plausible Analytics |
| **API** | NestJS 10 (BFF pattern), Winston logging, Sentry error tracking, API key auth |
| **CMS** | Directus 11 — block-based page builder with 15 block types |
| **CRM** | Twenty (open-source CRM) for lead/contact management |
| **Email** | Resend for transactional email |
| **Notifications** | Discord webhooks + admin email alerts |
| **Database** | PostgreSQL 16, Redis 7 |
| **Infrastructure** | Docker Compose (dev + production overlay), multi-stage Dockerfiles |

## Prerequisites

- **Node.js 20+**
- **Docker** and **Docker Compose**
- **npm** (workspaces used for monorepo)

## Quick Start

### 1. Clone and configure

```bash
git clone <repo-url> my-project
cd my-project
cp .env.example .env
```

Edit `.env` — the defaults work for local dev, but change any `change-me` values.

### 2. Start infrastructure

```bash
npm run dev
```

This runs `docker compose up` which starts:
- PostgreSQL (two databases: Directus + Twenty)
- Redis
- Directus CMS (http://localhost:8055)
- Twenty CRM (http://localhost:3003)

Wait until all containers are healthy before continuing.

### 3. Seed the CMS

```bash
npm run seed
```

This runs `directus/apply-schema.ts`, which reads the content schema from `apps/web/app/content/schema.ts` (the single source of truth) and creates/updates all Directus collections, fields, the pages↔blocks M2A relation, and public read permissions. **Idempotent** — run it any time you change the schema; existing data is never touched and type changes are warn-only.

> **Note:** Directus must be fully running first. If the seed fails, wait a few seconds and try again.

> **Auto-apply:** the web dev server also runs this apply on every boot (see the `schema-auto-apply` plugin in `apps/web/vite.config.ts`), so day-to-day schema edits land in Directus just by restarting `npm run dev:web`. The manual `npm run seed` remains for first-time setup, CI, and production releases. If Directus isn't running, the dev server logs `[schema] apply skipped` and carries on.

### 4. Install dependencies and start the apps

```bash
npm install

# Terminal 1 — Frontend
npm run dev:web    # http://localhost:5173

# Terminal 2 — API
npm run dev:api    # http://localhost:4001
```

The frontend works without Directus content — all routes have built-in fallback data so you can develop against the UI immediately.

### 5. Log into the CMS

Open http://localhost:8055 and log in with the admin credentials from your `.env` file. Start creating pages with the block-based content model.

## Project Structure

```
starter-kit/
├── apps/
│   ├── api/                 NestJS BFF
│   │   └── src/
│   │       ├── content/     Directus CMS proxy (pages, articles)
│   │       ├── crm/         Twenty CRM proxy (leads)
│   │       ├── contact/     Contact form handler → CRM + notifications
│   │       ├── notifications/  Discord + email alerts
│   │       ├── guards/      API key authentication
│   │       ├── middleware/   Request logging
│   │       └── common/      Sentry, Winston config, exception filters
│   └── web/                 React Router 7 frontend
│       └── app/
│           ├── brand/       Design-token SWAP SURFACE (brand.css, fonts.css, effects.css)
│           ├── system/      Design-system contract — travels unchanged (theme.css)
│           ├── routes/      10 site routes + style-guide/ multi-route section
│           ├── components/
│           │   ├── blocks/  15 CMS block components + BlockRenderer
│           │   ├── layout/  Header, Footer, ThemeProvider
│           │   ├── ui/      Full DS component set (35 primitives: button, dialog, table, toast, …)
│           │   ├── ds/      Style-guide showcase components (Preview, RuleList, ScaleRow)
│           │   └── common/  ErrorPage, MotionWrapper (layout/typography live in ui/)
│           ├── content/     CONTENT SCHEMA — single source of truth (fields.ts DSL,
│           │                schema.ts definitions, validate.ts runtime boundary)
│           ├── lib/         Directus SDK, CSRF, Turnstile, Plausible, validation
│           ├── data/        Fallback content, typechecked against the schema
│           └── types/       TS interfaces (block types re-exported from content/schema)
├── directus/
│   └── apply-schema.ts      Idempotent Directus schema apply, generated from content/schema
├── docker/                  (Production Dockerfiles)
├── docker-compose.yml       Development services
├── docker-compose.production.yml  Production overlay
└── .env.example             All configuration variables
```

## Architecture

### BFF Pattern

The frontend never talks to Directus or Twenty directly. All requests go through the NestJS API, which handles authentication, validation, error normalization, and cross-cutting concerns. This keeps credentials server-side and gives you a single place to enforce business logic.

```
Browser → React Router 7 (SSR) → NestJS BFF → Directus / Twenty / Resend / Discord
```

### Block-Based Pages

Pages in Directus are composed of ordered blocks. The frontend's `BlockRenderer` maps each block type to a React component:

| Block | Description |
|-------|-------------|
| `block_hero` | Full-width hero with image, CTAs, alignment options |
| `block_hero_simple` | Minimal hero (label, title, subtitle) |
| `block_features` | 2/3/4-column feature grid with icons |
| `block_cta` | Call-to-action section |
| `block_content` | Rich text + optional image |
| `block_image_text` | Image + text side-by-side with CTA |
| `block_testimonials` | Testimonial cards with photos |
| `block_faq` | Question/answer pairs |
| `block_stats` | Large stat numbers with labels |
| `block_team` | Team member cards with bios and social links |
| `block_about` | About section with image and CTA |
| `block_contact` | Contact form display |
| `block_newsletter` | Newsletter signup section |
| `block_articles` | Article grid (pulls from articles collection) |
| `block_gallery` | Image gallery (2/3/4 columns) |

### Fallback Content

Content sourcing is controlled by the `CONTENT_MODE` env var (default `auto`):

- **`auto`** (default) — every route tries Directus first, then falls back to built-in defaults (`app/data/defaults.ts`). You can develop the frontend without Directus running, the site has content out of the box for demos, and CMS content overrides defaults as soon as it exists. Each fallback decision is logged (`[content] fallback served for <label>`) so masked CMS failures stay visible.
- **`cms`** — CMS only, defaults are never served. Empty CMS content renders honestly empty (articles list shows its empty state; a missing article 404s instead of falling back to a default). Recommended for launched sites — set `CONTENT_MODE=cms` in Coolify so a broken or empty CMS can't silently serve placeholder content.
- **`static`** — defaults only; Directus is never contacted (fetches are skipped entirely, so no timeouts when the stack is down). Useful for offline development and demos.

## Frontend Features

- **10 site routes** — Home, About, Articles (list + detail), Contact, Privacy, Terms, Sitemap, 404 — plus the 31-page `/style-guide` section
- **15 block types** — Dynamically rendered from CMS content
- **Dark/light theme** — System preference detection, localStorage persistence, no flash on load
- **Contact form** — Three layers of protection:
  - CSRF tokens (cookie-based, timing-validated, signed with secret)
  - Cloudflare Turnstile CAPTCHA (optional — gracefully skipped if not configured)
  - Honeypot field (silent rejection)
- **Security headers** — CSP, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy
- **SEO** — Dynamic sitemap.xml, robots.txt, meta tags per route
- **Analytics** — Plausible (privacy-first, optional)
- **Animations** — FadeIn, stagger containers via Motion (`motion/react`, formerly Framer Motion), reduced-motion safe
- **Self-hosted fonts** — Geist, Source Sans 3, JetBrains Mono via @fontsource (no Google Fonts)
- **Design system** — follows the bmm-design-system architecture: `app/brand/` (swap surface — colors, fonts, effects) + `app/system/theme.css` (the contract that travels unchanged). Re-brand by editing `app/brand/` only. Token purity enforced by `npm run lint:tokens` (in `apps/web`). Primitive divergences from the reference DS are catalogued in `apps/web/DESIGN-SYSTEM-NOTES.md`.
- **Style guide** — `/style-guide` is a browsable multi-route docs section (6 foundations pages · 23 component pages · patterns) with do/don't guidance, live specimens, and copyable tokens — full page parity with the bmm-design-system site

## API Modules

| Module | Routes | Description |
|--------|--------|-------------|
| **Content** | `GET /api/content/pages`, `GET /api/content/pages/:slug`, `GET /api/content/articles`, `GET /api/content/articles/:slug` | Proxies Directus CMS. Filters by `status: published`. |
| **CRM** | `POST /api/crm/leads`, `GET /api/crm/leads` | Proxies Twenty CRM. Requires API key. Gracefully disabled if Twenty not configured. |
| **Contact** | `POST /api/contact` | Receives form submissions. Creates CRM lead + sends admin notification (parallel, fire-and-forget). Requires API key. |
| **Notifications** | (internal) | Sends alerts to Discord webhook + admin email via Resend. Both optional. |
| **Health** | `GET /health` | Returns `{ status: 'ok', timestamp }` |

Protected routes require `x-api-key` header matching `INTERNAL_API_KEY` env var.

## Environment Variables

Copy `.env.example` to `.env`. All variables with defaults work for local dev.

### Required for production

| Variable | Description |
|----------|-------------|
| `DIRECTUS_SECRET` | Random string for Directus session encryption |
| `DIRECTUS_ADMIN_PASSWORD` | Directus admin password |
| `INTERNAL_API_KEY` | Shared secret between frontend and API |
| `CSRF_SECRET` | Secret for CSRF token signing |
| `TWENTY_APP_SECRET` | Twenty CRM encryption secret |

### Optional integrations

| Variable | Description | Behavior if missing |
|----------|-------------|---------------------|
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare CAPTCHA | Contact form works without CAPTCHA |
| `RESEND_API_KEY` + `ADMIN_NOTIFICATION_EMAIL` | Email notifications | Email alerts silently disabled |
| `DISCORD_WEBHOOK_URL` | Discord notifications | Discord alerts silently disabled |
| `TWENTY_API_KEY` | CRM lead creation | CRM integration silently disabled |
| `SENTRY_DSN` | Error tracking | Errors only logged to console |
| `PLAUSIBLE_DOMAIN` + `PLAUSIBLE_API_HOST` | Analytics | No analytics tracking |

All optional integrations degrade gracefully — the app works fine without them.

## Production Deployment

### Build and run

```bash
npm run build    # Builds Docker images for web + API
npm run start    # docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

The production compose is an **overlay** — it extends the dev compose with production-specific config (built images instead of dev servers, production env vars). Both files are required.

### Dockerfiles

- **Web** (`apps/web/Dockerfile`) — Multi-stage: install → build → production. Final image serves the SSR app on port 3000.
- **API** (`apps/api/Dockerfile`) — Multi-stage: install → build → production. Final image runs compiled NestJS on port 4001. Includes healthcheck.

### Deployment targets

Designed for Docker-based PaaS (Coolify, Railway, etc.) or any environment that runs Docker Compose. For reverse proxy / SSL, put Caddy, Nginx, or Traefik in front.

### Schema on deploy

The content schema is applied by script, not by hand — wire it into your release flow:

- **Post-deploy hook** — run `npm run seed` against the production CMS as a release step (Coolify: add it as a post-deployment command with `DIRECTUS_URL`, `DIRECTUS_ADMIN_EMAIL`, and `DIRECTUS_ADMIN_PASSWORD` set for prod). It's idempotent, so re-running on every deploy is safe.
- **CI drift gate** — `npm run schema:check` (read-only) diffs a live Directus against `apps/web/app/content/schema.ts` and exits nonzero on any drift in either direction, including fields added ad hoc in the Directus UI. Run it in CI or before a release to catch schema drift early.

## Quality gates

Run from `apps/web` (or wire into CI / a pre-commit hook):

```bash
npm run typecheck    # tsc + route typegen
npm run lint:tokens  # design-system token purity — no hex/px/arbitrary values
npm test             # vitest: validation boundary, defaults↔schema, renderer registry parity
```

Plus `npm run schema:check` from the repo root when a live Directus is available.

## Customization

### Adding a new block type

1. Define it once in `apps/web/app/content/schema.ts` (`defineBlock` with the `f.*` field DSL) — this drives the TS type, runtime validation, the Directus schema, and the style-guide registry row
2. Run `npm run seed` to apply it to Directus (idempotent)
3. Create the React component in `apps/web/app/components/blocks/` and register it in `BlockRenderer.tsx` (+ the component-name map on `/style-guide/patterns/blocks`)
4. Add fallback content in `apps/web/app/data/defaults.ts` — the compiler enforces it matches the schema

### Adding a new route

1. Create the route file in `apps/web/app/routes/`
2. Add it to `apps/web/app/routes.ts`
3. Add nav links in `Header.tsx` and/or `Footer.tsx`
4. Add the path to `[sitemap.xml].tsx`

### Adding a new API module

1. Generate with NestJS CLI or create manually in `apps/api/src/`
2. Import in `app.module.ts`
3. Apply `ApiKeyGuard` if the route should be protected

## Known Limitations

- **BlockNewsletter** is a UI placeholder (no backend integration)
- **BlockGallery** has no lightbox/modal
- **No rate limiting** on API endpoints (add `@nestjs/throttler` for production)
- **No request timeouts** on outbound calls to Directus/Twenty/Discord
- **Twenty CRM** requires manual initial setup via its admin UI after first boot
- **Schema apply** never alters existing column types (warn-only) — a type change needs a manual migration

## License

MIT
