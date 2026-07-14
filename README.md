# Starter Kit

Full-stack starter for content-driven web applications. React Router 7 + NestJS BFF + Directus CMS + Twenty CRM, wired together with Docker Compose.

Built from patterns used across production projects: class enrollment platforms, booking systems, service business sites.

```bash
git clone <repo-url> my-project && cd my-project
npm run setup     # creates .env and generates every required secret
npm install
npm run dev       # Postgres x2, Redis, Directus :8055, Twenty :3003
npm run seed      # apply the CMS schema
npm run dev:web   # http://localhost:5173
```

## Contents

- [Stack](#stack)
- [Quick start](#quick-start)
- [Configuration](#configuration) — every variable, what breaks without it
- [Architecture](#architecture)
- [Content pipeline](#content-pipeline)
- [Security](#security) — read before deploying
- [Production deployment](#production-deployment)
- [Quality gates](#quality-gates)
- [Customization](#customization)
- [Known limitations](#known-limitations)

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React Router 7 (SSR), Tailwind CSS 4 (CSS-first `@theme`), shadcn-derived components on Radix + CVA, Motion, Plausible Analytics |
| **API** | NestJS 10 (BFF pattern), Winston logging, Sentry error tracking, API key auth, rate limiting |
| **CMS** | Directus 11, block-based page builder with 15 block types |
| **CRM** | Twenty (open-source CRM) for lead and contact management |
| **Email** | Resend for transactional email |
| **Notifications** | Discord webhooks + admin email alerts |
| **Database** | PostgreSQL 16, Redis 7 |
| **Infrastructure** | Docker Compose (dev + production overlay), multi-stage Dockerfiles |

## Prerequisites

- **Node.js 20+** (a `.nvmrc` is included, so `nvm use` picks the right version)
- **Docker** and **Docker Compose** v2.24 or newer
- **npm** (the repo uses npm workspaces)

## Quick start

### 1. Clone and generate your secrets

```bash
git clone <repo-url> my-project
cd my-project
npm run setup
```

`npm run setup` copies `.env.example` to `.env` and generates the seven secrets the stack requires. It is safe to re-run: an existing `.env` is never overwritten, and only blank secrets get filled in.

There are **no default passwords anywhere in this repo**. Docker Compose refuses to start if a required secret is missing, rather than quietly falling back to something like `admin`. That is deliberate, and it is why this step comes first. If you would rather do it by hand, copy `.env.example` yourself and generate each value marked "generate" with `openssl rand -hex 32`.

### 2. Start the infrastructure

```bash
npm install
npm run dev
```

This runs `docker compose up`, starting PostgreSQL (two databases), Redis, Directus on http://localhost:8055, and Twenty on http://localhost:3003. Wait until the containers report healthy before continuing.

### 3. Seed the CMS

```bash
npm run seed
```

This reads the content schema from `apps/web/app/content/schema.ts` (the single source of truth) and creates the Directus collections, fields, the pages/blocks relation, and public read permissions. It is idempotent, so you can run it any time the schema changes. Existing data is never touched, and type changes are warn-only.

Optionally, load the demo content:

```bash
npm run seed:content
```

This populates the CMS with the built-in demo content from `apps/web/app/data/defaults.ts`, so the site renders identically whether fallback content is on or off. Useful for exercising the real CMS path from day one. Safe to re-run.

### 4. Run the apps

```bash
npm run dev:web    # http://localhost:5173
npm run dev:api    # http://localhost:4001
```

The frontend works without Directus running. Every route has built-in fallback content, so you can develop against the UI immediately.

### 5. Log into the CMS

Open http://localhost:8055 and sign in with the `DIRECTUS_ADMIN_EMAIL` and `DIRECTUS_ADMIN_PASSWORD` from your `.env`. If you ran `npm run setup`, the password is the generated value in that file.

## Configuration

All configuration lives in one root `.env`, created from `.env.example`. That file is the annotated reference, and every variable below is documented inline there too.

Host-run dev servers (the quick start above) need the `localhost` URLs. The docker-internal hostnames (`http://directus:8055`) only apply when the web and API run *inside* compose, which is what the production overlay does.

### Required

The stack will not start without these. `npm run setup` generates all seven.

| Variable | What it does | If it is wrong |
|----------|--------------|----------------|
| `DIRECTUS_SECRET` | Signs Directus session tokens | A known value lets anyone forge an admin session |
| `DIRECTUS_ADMIN_PASSWORD` | Directus admin login | Weak value means an open CMS |
| `DIRECTUS_DB_PASSWORD` | Directus Postgres password | Compose refuses to start |
| `TWENTY_APP_SECRET` | Twenty's encryption secret | Same exposure as `DIRECTUS_SECRET`, for the CRM |
| `TWENTY_DB_PASSWORD` | Twenty Postgres password | Compose refuses to start |
| `INTERNAL_API_KEY` | Shared secret between the web server and the API | The web server gets a 401 and the contact form fails |
| `CSRF_SECRET` | Signs the contact form's CSRF cookie | The web server refuses to boot, because an unsigned CSRF cookie is forgeable |

### Required in production

| Variable | What it does |
|----------|--------------|
| `SITE_URL` | Public origin of the site. Doubles as the CORS allowlist for the API and Directus |
| `DIRECTUS_PUBLIC_URL` | Where the **browser** loads CMS images from, so it must be your public CMS hostname |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | See [Turnstile](#turnstile-fails-closed-in-production) below |

### Optional integrations

Each one turns itself off cleanly when unset. The app works fine without any of them.

| Variable | Feature | Behavior when unset |
|----------|---------|---------------------|
| `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Cloudflare CAPTCHA | Passes in development, **rejects in production** |
| `RESEND_API_KEY` + `ADMIN_NOTIFICATION_EMAIL` | Email notifications | Email alerts skipped |
| `DISCORD_WEBHOOK_URL` | Discord notifications | Discord alerts skipped |
| `TWENTY_API_KEY` | CRM lead creation | Leads not created, notifications still sent |
| `DIRECTUS_TOKEN` | Static token for the API's content routes | The API reads Directus as the public role, which is all the seeded schema grants |
| `SENTRY_DSN` / `VITE_SENTRY_DSN` | Error tracking | Errors logged to the console only |
| `PLAUSIBLE_DOMAIN` + `PLAUSIBLE_API_HOST` | Analytics | No analytics, and no third-party requests |

`VITE_SENTRY_DSN` is compiled into the browser bundle and is public by design. Never put a real secret behind a `VITE_` prefix.

### Content modes

`CONTENT_MODE` controls where page content comes from.

| Mode | Behavior | Use it for |
|------|----------|-----------|
| `auto` (default) | Try the CMS, fall back to built-in demo content, and log every fallback as `[content] fallback served for …` | Development |
| `cms` | CMS only. Empty content renders honestly empty, and a missing article 404s | **Production** |
| `static` | Demo content only. Directus is never contacted, so nothing times out when the stack is down | Offline work, UI demos |

Fallback content is convenient, and it is also a trap: a page that renders correctly proves nothing about whether the CMS is actually working. Set `CONTENT_MODE=cms` in production so a broken or empty CMS fails loudly instead of silently serving placeholder copy.

## Architecture

### BFF pattern

The browser never talks to Directus or Twenty directly. Requests go through the NestJS API, which handles authentication, validation, and error normalization. Credentials stay server-side and business logic has one home.

```
Browser -> React Router 7 (SSR) -> NestJS BFF -> Directus / Twenty / Resend / Discord
```

### Project structure

```
starter-kit/
├── apps/
│   ├── api/                    NestJS BFF
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── content/        Directus proxy (pages, articles)
│   │       ├── crm/            Twenty proxy (leads)
│   │       ├── contact/        Contact form handler -> CRM + notifications
│   │       ├── notifications/  Discord + email alerts
│   │       ├── guards/         API key authentication
│   │       ├── middleware/     Request logging
│   │       └── common/         Sentry, Winston, exception filters
│   └── web/                    React Router 7 frontend
│       ├── Dockerfile
│       └── app/
│           ├── brand/          Design-token swap surface (colors, fonts, effects)
│           ├── system/         Design-system contract (theme.css)
│           ├── routes/         10 site routes + the style-guide section
│           ├── components/
│           │   ├── blocks/     15 CMS block components + BlockRenderer
│           │   ├── layout/     Header, Footer, ThemeProvider
│           │   ├── ui/         35 design-system primitives
│           │   ├── ds/         Style-guide showcase components
│           │   └── common/     ErrorPage, MotionWrapper
│           ├── content/        CONTENT SCHEMA: the single source of truth
│           ├── lib/            Directus SDK, CSRF, Turnstile, rate limiting, CSP nonce
│           ├── data/           Fallback content, typechecked against the schema
│           └── types/          TS types re-exported from the content schema
├── directus/                   Schema apply, drift check, demo-content seeder
├── scripts/setup-env.mjs       First-run secret generation
├── docker-compose.yml          Development services
├── docker-compose.production.yml   Production overlay
└── .env.example                Annotated configuration reference
```

## Content pipeline

Every content type is declared **once**, in `apps/web/app/content/schema.ts`, using the field DSL in `fields.ts`. Each field carries its Zod validator, its Directus field metadata, and flags for assets and rich text.

Everything else is derived from that one file:

- **TypeScript types** via `z.infer`, re-exported through `~/types/content`
- **The Directus schema** via `directus/apply-schema.ts` (additive, warn-only)
- **Runtime validation** in `app/content/validate.ts`, which drops invalid blocks with a `[content]` warning, strips nulls, rewrites asset UUIDs to absolute URLs, and sanitizes rich-text HTML
- **Typed fallback content** in `app/data/defaults.ts`, which the compiler forces to match the schema
- **The style-guide block registry**

Never hand-edit a derived artifact. Edit `schema.ts` and re-run `npm run seed`.

`npm run schema:check` is a read-only drift gate. It diffs a live Directus against `schema.ts` and exits non-zero on any difference in either direction, including fields somebody added through the Directus admin UI. The admin UI is not the source of truth here, and that check is what keeps it honest.

### Block types

`block_hero`, `block_hero_simple`, `block_features`, `block_cta`, `block_content`, `block_image_text`, `block_testimonials`, `block_faq`, `block_stats`, `block_team`, `block_about`, `block_contact`, `block_newsletter`, `block_articles`, `block_gallery`.

## Security

This section describes what the kit does for you, and the three things you still have to do yourself. Please read it before putting this on the internet.

### What is handled

- **No default credentials.** Every secret in `docker-compose.yml` uses the `${VAR:?message}` form, so compose fails loudly when one is missing instead of substituting a working default. A default password is a backdoor the moment somebody deploys without reading the docs.
- **Production publishes one port.** Only the web app is bound to the host. The API, Directus, Twenty, Postgres, and Redis are reachable only inside the compose network. See [exposing the CMS](#exposing-the-cms-admin) if you need the admin UI.
- **Content Security Policy with a per-request nonce.** In production, only scripts carrying that request's nonce execute, so injected markup is inert. Development keeps a looser policy because Vite injects its own inline scripts.
- **CMS rich text is sanitized** at the loader boundary against a strict tag and attribute allowlist. Rich-text fields are rendered with `dangerouslySetInnerHTML`, and a CMS editor is a lower trust level than a developer. Without this, anyone who can save an article could store XSS on every page rendering it.
- **Contact form defenses:** a signed, `httpOnly`, `sameSite=strict` CSRF cookie, a honeypot field, a minimum submit time, per-IP rate limiting (5 per hour), and length caps on every field.
- **Constant-time comparison** for the API key and the CSRF token, so neither leaks a byte at a time through response timing.
- **Notification emails escape submitted text**, so a submitter cannot put a working phishing link into the alert that lands in your inbox.
- **Security headers** on both apps: HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, plus helmet on the API.
- **Rate limiting** per visitor IP on the contact form, with a backstop throttle on the API.

### Turnstile fails closed in production

Cloudflare Turnstile is optional, but "optional" must not mean "silently off in production".

With the keys unset, the captcha check **passes in development** (so you can work without a Cloudflare account) and **rejects in production**. A captcha that fails open is not a captcha. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` before you deploy.

To run production without a captcha on purpose, delete the `verifyTurnstile()` call in `apps/web/app/routes/contact.tsx`. Rate limiting and the honeypot still apply.

### What you still have to do

1. **Put a reverse proxy in front with TLS.** The stack speaks plain HTTP. Terminate TLS at Caddy, Nginx, Traefik, or your PaaS.
2. **Set `CONTENT_MODE=cms`** so a broken CMS cannot silently serve demo content as if it were yours.
3. **Configure Turnstile**, or consciously remove it (see above).

### Rate limiting is per-process

The contact form limiter is in-memory, so counters reset on restart and are not shared between replicas. That is enough to stop a naive flood from one host, which is the realistic threat for a contact form. If you run more than one web replica, back `apps/web/app/lib/rate-limit.server.ts` with Redis. Its `rateLimit()` signature is deliberately the shape you would implement there.

### Reporting a vulnerability

See [SECURITY.md](SECURITY.md).

## Production deployment

```bash
npm run build    # build the web + API images
npm run start    # docker compose up with the production overlay
```

The production compose is an **overlay**. It extends the dev compose rather than replacing it, so both files are required, which is what `npm run start` does.

### What the overlay changes

- Builds and runs the web and API images instead of dev servers
- Publishes **only** the web app to the host. Everything else becomes internal
- Requires `SITE_URL`, `DIRECTUS_PUBLIC_URL`, `CSRF_SECRET`, and `INTERNAL_API_KEY`, and fails to start without them
- Narrows CORS from `*` to `SITE_URL`
- Turns off Twenty's prefilled login form
- Defaults `CONTENT_MODE` to `cms`

### Exposing the CMS admin

Directus is not published to the host in production. To reach the admin UI, route a hostname to it through your reverse proxy:

- **Proxy running as a container on this network** (Coolify works this way): point it at `http://directus:8055`. Nothing else to do.
- **Proxy running on the host** (Caddy or Nginx installed directly): add a `ports: ["127.0.0.1:8055:8055"]` entry back onto the `directus` service in the overlay, and proxy to `127.0.0.1:8055`. Binding to loopback keeps the admin panel off the public internet.

Whichever you choose, set `DIRECTUS_PUBLIC_URL` to the public CMS hostname, because that is the URL the browser uses to load images.

### Schema on deploy

The content schema is applied by script, not by hand.

- **Post-deploy hook:** run `npm run seed` against the production CMS as a release step, with `DIRECTUS_URL`, `DIRECTUS_ADMIN_EMAIL`, and `DIRECTUS_ADMIN_PASSWORD` set for production. It is idempotent, so running it on every deploy is safe.
- **CI drift gate:** run `npm run schema:check` to catch drift before it reaches production.

### Deployment checklist

- [ ] `npm run setup` has generated real secrets, and no value in `.env` is blank or a placeholder
- [ ] `SITE_URL` and `DIRECTUS_PUBLIC_URL` point at real https:// hostnames
- [ ] `CONTENT_MODE=cms`
- [ ] Turnstile keys are set, or `verifyTurnstile()` was removed on purpose
- [ ] A reverse proxy terminates TLS in front of the web app
- [ ] The Directus admin is reachable only through your proxy
- [ ] `npm run seed` has run against the production CMS
- [ ] `npm run schema:check` is clean
- [ ] The Directus admin password was changed from the generated value, if you want one you can remember

## Quality gates

Run from `apps/web`:

```bash
npm run typecheck    # react-router typegen + tsc
npm run lint:tokens  # design-system token purity, no hex/px/arbitrary values
npm test             # vitest: validation boundary, XSS sanitization, defaults/schema parity
```

Plus `npm run schema:check` from the repo root, when a live Directus is available.

## Customization

### Add a block type

1. Define it in `apps/web/app/content/schema.ts` with `defineBlock` and the `f.*` field DSL. This one definition drives the TS type, runtime validation, the Directus schema, and the style-guide registry.
2. Run `npm run seed` to apply it to Directus.
3. Create the component in `apps/web/app/components/blocks/` and register it in `BlockRenderer.tsx`.
4. Add fallback content in `apps/web/app/data/defaults.ts`. The compiler enforces that it matches the schema.

Use `f.richText()` for any HTML field. That flag is what causes the loader to sanitize it.

### Add a route

1. Create the route file in `apps/web/app/routes/`.
2. Register it in `apps/web/app/routes.ts`.
3. Add nav links in `Header.tsx` or `Footer.tsx`.
4. Add the path to `[sitemap.xml].tsx`.

### Add an API module

1. Create it in `apps/api/src/`.
2. Import it in `app.module.ts`.
3. Apply `ApiKeyGuard` if the route should be protected.

### Re-brand

Edit `apps/web/app/brand/` only. That directory (color ramps, fonts, effects) is the swap surface. `app/system/theme.css` is the contract and travels unchanged. Token purity is enforced by `npm run lint:tokens`.

## Known limitations

- **BlockNewsletter** is a UI placeholder with no backend integration.
- **BlockGallery** has no lightbox.
- **Rate limiting is in-memory**, so it does not span replicas. See [above](#rate-limiting-is-per-process).
- **Twenty CRM** needs a one-time setup through its admin UI after first boot.
- **Schema apply never alters existing column types** (it warns instead), so a type change needs a manual migration.
- **No request timeouts** on outbound calls to Directus or Twenty. The contact form's call to the API and the Turnstile verification do have them.

## License

MIT. See [LICENSE](LICENSE).
