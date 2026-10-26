import { headers } from "next/headers";
import { checkRateLimit, type RateLimitResult, type RateLimitRule } from "@/lib/rate-limit";
import { mongoRateLimitStore } from "@/lib/rate-limit-store";

/** Rate limit an action for one user, email or IP (shared across server instances). */
export function enforceRateLimit(
  rules: readonly RateLimitRule[],
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit(rules, identifier, mongoRateLimitStore);
}

/** The visitor's IP address as reported by the hosting platform (Vercel sets these headers). */
export async function clientIp(): Promise<string> {
  const list = await headers();
  return (
    list.get("x-real-ip")?.trim() ||
    list.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
