import Script from "next/script";

/** GA4 measurement ID; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-13JHFTCR7L";

/**
 * Google Analytics (gtag.js). Loads only on the production deployment, so
 * local development and Vercel preview builds don't pollute the reports.
 * GA4 enhanced measurement records client-side route changes as page views.
 */
export function GoogleAnalytics() {
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
  if (!isProduction || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
