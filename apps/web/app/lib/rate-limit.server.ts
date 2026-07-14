/**
 * Minimal in-memory, fixed-window rate limiter for public form endpoints.
 *
 * The contact form is the one place an anonymous visitor can make the server do
 * expensive things: each submission creates a CRM record, sends an email through
 * Resend, and fires a Discord webhook. Unthrottled, a script can drain the mail
 * quota, flood the admin inbox and pollute the CRM from a single machine.
 *
 * Rate limiting lives here rather than on the NestJS API on purpose: the API
 * only ever sees the WEB CONTAINER's IP (browser → SSR → API), so a limiter
 * there would lump every visitor into one bucket. This is the layer that still
 * knows who the caller is.
 *
 * SCOPE: the counters are per-process and in-memory, so they reset on restart
 * and are not shared between replicas. That is enough to stop a naive flood from
 * one host, which is the realistic threat for a contact form. If you run more
 * than one web replica, or need to survive restarts, back this with Redis — the
 * `check` signature is deliberately the same shape you'd implement there.
 */

interface Window {
  count: number;
  /** Epoch ms at which this window expires. */
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Stop the Map from growing without bound under a flood of distinct IPs. */
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry — for a Retry-After header. */
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Requests permitted per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    if (windows.size >= MAX_TRACKED_KEYS) evictExpired(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function evictExpired(now: number): void {
  for (const [key, window] of windows) {
    if (now >= window.resetAt) windows.delete(key);
  }
  // Still full of live windows — we're under a distributed flood and a per-IP
  // limiter can't help. Drop everything rather than leak memory.
  if (windows.size >= MAX_TRACKED_KEYS) windows.clear();
}

/**
 * Best-effort client IP.
 *
 * Behind a reverse proxy (Caddy, Nginx, Traefik, Cloudflare) the left-most entry
 * of X-Forwarded-For is the original client. These headers are trivially spoofed
 * by anyone talking to the app DIRECTLY, so this is only trustworthy when the app
 * is reachable *exclusively* through a proxy that overwrites them — which is how
 * the production compose is meant to be deployed. Treat the result as a
 * rate-limit bucket, never as an identity or an authorization input.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Test-only: drop all counters between cases. */
export function __resetRateLimits(): void {
  windows.clear();
}
