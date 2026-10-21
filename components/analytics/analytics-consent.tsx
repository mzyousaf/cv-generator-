"use client";

import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { Button } from "@/components/ui/button";
import {
  readConsent,
  saveConsent,
  subscribeConsent,
  subscribeOpenSettings,
  type AnalyticsConsent as Consent,
} from "@/lib/analytics/consent";

type Gtag = (...args: unknown[]) => void;

/** Until hydration the stored choice is unknown, so nothing renders. */
const PENDING = "pending";

/**
 * Cookie banner plus Google Analytics. gtag.js loads only after the visitor
 * accepts; declining (now or later via "Cookie settings") turns it off.
 */
export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const { t } = useI18n();
  const copy = t.cookies;
  const consent = useSyncExternalStore<Consent | null | typeof PENDING>(
    subscribeConsent,
    readConsent,
    () => PENDING,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const previous = useRef(consent);

  useEffect(() => subscribeOpenSettings(() => setSettingsOpen(true)), []);

  // A choice changed after the tag loaded: switch the running tag off or back on.
  useEffect(() => {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (gtag && previous.current !== consent && (consent === "granted" || consent === "denied")) {
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = consent === "denied";
      gtag("consent", "update", { analytics_storage: consent });
    }
    previous.current = consent;
  }, [consent, measurementId]);

  function choose(choice: Consent) {
    saveConsent(choice);
    setSettingsOpen(false);
  }

  if (consent === PENDING) {
    return null;
  }

  return (
    <>
      {consent === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window['ga-disable-${measurementId}'] = false;
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${measurementId}');`}
          </Script>
        </>
      ) : null}

      {consent === null || settingsOpen ? (
        <section
          role="region"
          aria-label={copy.title}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl rounded-xl border border-slate-200 bg-surface p-4 text-slate-700 shadow-[0_12px_40px_-12px_rgb(15_23_42/0.35)] sm:inset-x-auto sm:start-4 sm:bottom-4 sm:p-5"
        >
          <p className="text-sm font-semibold text-slate-950">{copy.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {copy.message}{" "}
            <Link
              href="/privacy"
              className="font-semibold text-blue-700 underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
            >
              {copy.learnMore}
            </Link>
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => choose("denied")}>
              {copy.decline}
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => choose("granted")}>
              {copy.accept}
            </Button>
          </div>
        </section>
      ) : null}
    </>
  );
}
