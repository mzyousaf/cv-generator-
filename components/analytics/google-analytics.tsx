import { cookies } from "next/headers";
import { AnalyticsConsent } from "@/components/analytics/analytics-consent";
import { CONSENT_COOKIE, parseConsent } from "@/lib/analytics/consent";

/** GA4 measurement ID; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-13JHFTCR7L";

/**
 * Google Analytics with an opt-out cookie banner. Runs only on the production
 * deployment, so local development and Vercel preview builds neither show
 * the banner nor pollute the reports. GA4 enhanced measurement records
 * client-side route changes as page views.
 */
export async function GoogleAnalytics() {
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
  if (!isProduction || !GA_MEASUREMENT_ID) {
    return null;
  }
  const stored = (await cookies()).get(CONSENT_COOKIE)?.value;
  const initialConsent = stored ? parseConsent(`${CONSENT_COOKIE}=${stored}`) : null;
  return <AnalyticsConsent measurementId={GA_MEASUREMENT_ID} initialConsent={initialConsent} />;
}
