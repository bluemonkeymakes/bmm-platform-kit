import './lib/sentry.server';
import { randomBytes } from "node:crypto";
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { NonceProvider } from "./lib/nonce";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Origin of a Sentry/GlitchTip DSN, so the browser SDK is allowed to POST to it. */
function dsnOrigin(dsn: string | undefined): string | null {
  if (!dsn) return null;
  try {
    return new URL(dsn).origin;
  } catch {
    return null;
  }
}

/**
 * Build the Content-Security-Policy.
 *
 * Production is nonce-based: only scripts carrying this request's nonce run, so
 * an injected `<script>` is inert even if something upstream fails to escape it.
 *
 * Development cannot use a nonce. Vite injects inline scripts we don't control
 * (the HMR client, the React Refresh preamble), and a CSP containing a nonce
 * makes browsers IGNORE 'unsafe-inline' altogether — so a nonce in dev would
 * block Vite's own scripts and break the dev server. Dev keeps the looser
 * policy; production gets the real one.
 */
/**
 * Cloudflare Turnstile loads a script from this origin and renders its widget in
 * an iframe from it, so the captcha needs an explicit hole in script-src and
 * frame-src. The hole only opens when Turnstile is actually configured.
 */
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

function buildCsp(nonce: string): string {
  const plausibleApiHost = process.env.PLAUSIBLE_API_HOST || "";
  const sentry = dsnOrigin(process.env.VITE_SENTRY_DSN || process.env.SENTRY_DSN);
  const turnstile = process.env.TURNSTILE_SITE_KEY ? TURNSTILE_ORIGIN : null;

  const scriptSrc = IS_PRODUCTION
    ? ["'self'", `'nonce-${nonce}'`]
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
  if (turnstile) scriptSrc.push(turnstile);

  const connectSrc = ["'self'", plausibleApiHost, sentry, turnstile].filter(
    Boolean,
  ) as string[];
  if (!IS_PRODUCTION) connectSrc.push("ws:", "wss:");

  const frameSrc = turnstile ? [turnstile] : ["'none'"];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    // Inline styles stay allowed: React and Motion set element style attributes,
    // and unlike a script, a style cannot execute JavaScript.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    // CMS images may be served from any HTTPS origin (Directus, a CDN, …).
    "img-src 'self' data: https:",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    // Without base-uri, an injected <base> tag re-points every relative URL on
    // the page at an attacker's host.
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const nonce = randomBytes(16).toString("base64");

  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
      </NonceProvider>,
      {
        nonce,
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.set("X-Content-Type-Options", "nosniff");
          responseHeaders.set("X-Frame-Options", "DENY");
          responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
          responseHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
          responseHeaders.set("X-DNS-Prefetch-Control", "on");
          responseHeaders.set("Content-Security-Policy", buildCsp(nonce));

          if (IS_PRODUCTION) {
            responseHeaders.set(
              "Strict-Transport-Security",
              "max-age=31536000; includeSubDomains",
            );
          }

          if (!responseHeaders.has("Cache-Control")) {
            // A response that sets a cookie must never enter a shared cache:
            // /contact issues a per-visitor CSRF cookie, and a CDN that stored
            // it would hand one visitor's token to every other visitor.
            responseHeaders.set(
              "Cache-Control",
              responseHeaders.has("Set-Cookie")
                ? "private, no-store"
                : "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
            );
          }

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          import('./lib/sentry.server').then(({ Sentry }) => {
            Sentry?.captureException(error);
          }).catch(() => {});
          reject(error);
        },
      }
    );
  });
}
