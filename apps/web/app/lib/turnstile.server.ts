const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true; // Skip if not configured
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
      }
    );
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
