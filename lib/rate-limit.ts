import { createHash } from "node:crypto";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type RateLimitRule = { name: string; limit: number; windowMs: number };

/**
 * Limits per action. AI calls cost money (OpenRouter credits), so they have
 * both a burst and a daily cap; sign-in and sign-up are limited to stop
 * password guessing and spam accounts.
 */
export const RATE_LIMITS = {
  ai: [
    { name: "ai-burst", limit: 30, windowMs: 10 * MINUTE },
    { name: "ai-daily", limit: 200, windowMs: DAY },
  ],
  resumeAi: [
    { name: "resume-ai-hourly", limit: 10, windowMs: HOUR },
    { name: "resume-ai-daily", limit: 30, windowMs: DAY },
  ],
  loginIp: [{ name: "login-ip", limit: 30, windowMs: 15 * MINUTE }],
  loginEmail: [{ name: "login-email", limit: 10, windowMs: 15 * MINUTE }],
  signupIp: [{ name: "signup-ip", limit: 5, windowMs: HOUR }],
  pdfExport: [{ name: "pdf-export", limit: 40, windowMs: 10 * MINUTE }],
  createCv: [{ name: "create-cv", limit: 30, windowMs: HOUR }],
} satisfies Record<string, RateLimitRule[]>;

export const RATE_LIMITED_MESSAGE = "Too many requests. Please wait a few minutes and try again.";

/** Increments the counter for one window and returns the new count. */
export type RateLimitStore = (key: string, expiresAt: Date) => Promise<number>;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/** Identifiers (emails, IPs) are stored hashed, never in plain text. */
function hashIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("base64url").slice(0, 22);
}

/**
 * Fixed-window rate limiting. Counts are shared across server instances via
 * the store. If the store fails, the request is allowed (fail open) so an
 * outage of the counter never locks users out.
 */
export async function checkRateLimit(
  rules: readonly RateLimitRule[],
  identifier: string,
  store: RateLimitStore,
  now = Date.now(),
): Promise<RateLimitResult> {
  const id = hashIdentifier(identifier);
  let retryAfterMs = 0;
  for (const rule of rules) {
    const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs;
    const windowEnd = windowStart + rule.windowMs;
    let count: number;
    try {
      count = await store(`${rule.name}:${id}:${windowStart}`, new Date(windowEnd));
    } catch (error) {
      console.error(`[rate-limit] store unavailable for ${rule.name}:`, error);
      continue;
    }
    if (count > rule.limit) {
      retryAfterMs = Math.max(retryAfterMs, windowEnd - now);
    }
  }
  return retryAfterMs > 0 ? { ok: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) } : { ok: true };
}
