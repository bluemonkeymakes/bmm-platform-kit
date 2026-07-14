# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository (Security tab, "Report a vulnerability"). We will acknowledge within a few days and let you know when a fix ships.

## Scope

This is a starter kit. It is meant to be forked, and every fork inherits whatever posture the template shipped with, so defects in the defaults matter more here than in an ordinary application.

In scope:

- Insecure defaults, anything that fails open, or a secret with a working fallback value
- Authentication and CSRF bypasses
- XSS, injection, or SSRF in the app code
- Anything that exposes an internal service or credential to the public internet

Out of scope:

- Vulnerabilities in Directus, Twenty, Postgres, or Redis themselves. Report those upstream.
- Findings that depend on a misconfiguration the docs explicitly warn against.

## Design decisions worth knowing

These are intentional, and they are why some things fail loudly rather than conveniently.

- **No default credentials.** Every secret in `docker-compose.yml` uses `${VAR:?message}`, so compose refuses to start when one is missing rather than substituting a value like `admin`. A working default password is a backdoor that ships to production the first time someone deploys in a hurry.
- **The web server will not boot without `CSRF_SECRET`.** An unsigned CSRF cookie is a forgeable one, and a warning in a boot log is not a control.
- **Turnstile fails closed in production.** With the keys unset the captcha passes in development and rejects in production. A captcha that fails open is not a captcha.
- **The API key comparison is constant-time**, so it cannot be recovered a byte at a time through response timing.
- **CMS rich text is sanitized** at the loader boundary, before it reaches `dangerouslySetInnerHTML`. A CMS editor is a lower trust level than a developer.
- **Production publishes only the web app.** The API, CMS, CRM, and databases are reachable only from inside the compose network.
- **Rate limiting is in-memory and per-process.** It stops a naive flood from a single host. It does not span replicas. See the README if you run more than one.

## Before you deploy a fork

The README has a full [deployment checklist](README.md#deployment-checklist). The three that actually bite people:

1. Terminate TLS at a reverse proxy. The stack speaks plain HTTP.
2. Set `CONTENT_MODE=cms`, so a broken CMS cannot silently serve demo content as if it were yours.
3. Configure Turnstile, or remove the check deliberately.
