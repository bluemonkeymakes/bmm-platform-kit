import crypto from "node:crypto";
import { createCookie } from "react-router";

const CSRF_SECRET = process.env.CSRF_SECRET;
const MIN_SUBMIT_TIME_MS = 3000;

// Fail closed. With an empty `secrets` array React Router neither signs nor
// verifies the cookie — it becomes base64 JSON that anyone able to set a cookie
// on this domain can forge, which defeats the double-submit check below. A
// warning here would just scroll past in the boot log, so refuse to start.
if (!CSRF_SECRET) {
  throw new Error(
    "CSRF_SECRET is required. Generate one with `openssl rand -hex 32` and set it in .env.",
  );
}

const csrfCookie = createCookie("_csrf", {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/contact",
  maxAge: 60 * 60,
  secrets: [CSRF_SECRET],
});

interface CsrfPayload {
  token: string;
  issuedAt: number;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function validateCsrf(
  request: Request,
  formToken: FormDataEntryValue | null
): Promise<boolean> {
  const cookieHeader = request.headers.get("Cookie");
  const payload: CsrfPayload | null = await csrfCookie.parse(cookieHeader);

  if (!payload?.token || !payload?.issuedAt || typeof formToken !== "string") {
    return false;
  }
  if (!timingSafeCompare(payload.token, formToken)) return false;

  const elapsed = Date.now() - payload.issuedAt;
  if (elapsed < MIN_SUBMIT_TIME_MS) return false;

  return true;
}

/** Constant-time string compare — `!==` short-circuits and leaks the token. */
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function createTokenCookie(token: string): Promise<string> {
  const payload: CsrfPayload = { token, issuedAt: Date.now() };
  return csrfCookie.serialize(payload);
}
