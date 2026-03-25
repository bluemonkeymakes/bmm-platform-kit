import crypto from "node:crypto";
import { createCookie } from "react-router";

const CSRF_SECRET = process.env.CSRF_SECRET;
const MIN_SUBMIT_TIME_MS = 3000;

if (!CSRF_SECRET) {
  console.warn("[CSRF] CSRF_SECRET not set — cookie signing will use empty secret");
}

const csrfCookie = createCookie("_csrf", {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/contact",
  maxAge: 60 * 60,
  secrets: CSRF_SECRET ? [CSRF_SECRET] : [],
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

  if (!payload?.token || !payload?.issuedAt || !formToken) return false;
  if (payload.token !== formToken) return false;

  const elapsed = Date.now() - payload.issuedAt;
  if (elapsed < MIN_SUBMIT_TIME_MS) return false;

  return true;
}

export async function createTokenCookie(token: string): Promise<string> {
  const payload: CsrfPayload = { token, issuedAt: Date.now() };
  return csrfCookie.serialize(payload);
}
