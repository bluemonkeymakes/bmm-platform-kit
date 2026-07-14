const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Verify a Cloudflare Turnstile token.
 *
 * Turnstile is optional, but "optional" must not mean "silently off in
 * production". In dev, an unconfigured Turnstile passes so you can work on the
 * contact form without a Cloudflare account. In production it REJECTS: shipping
 * with the keys unset is a misconfiguration, and a captcha that fails open is
 * not a captcha.
 *
 * To run without a captcha in production on purpose, delete the verifyTurnstile
 * call in `routes/contact.tsx` — rate limiting and the honeypot still apply —
 * rather than leaving a captcha that only pretends to work.
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    if (IS_PRODUCTION) {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY is not set — rejecting submission. " +
          "Set the key, or remove the verifyTurnstile() call to run without a captcha.",
      );
      return false;
    }
    return true; // dev convenience only
  }

  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(5000),
      }
    );
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
