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

function getGtag(): Gtag | undefined {
  return (window as unknown as { gtag?: Gtag }).gtag;
}

function setDisabled(measurementId: string, disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = disabled;
}

/** GA4 event recording the visitor's banner choice. */
function trackChoice(gtag: Gtag, choice: Consent) {
  gtag("event", "cookie_consent", { consent_choice: choice === "granted" ? "accepted" : "rejected" });
}

/**
 * Cookie banner plus Google Analytics (opt-out). Analytics runs until the
 * visitor declines; accepting just confirms it. Page views are tracked by
 * GA4 itself, including client-side route changes (enhanced measurement).
 */
export function AnalyticsConsent({
  measurementId,
  initialConsent,
}: {
  measurementId: string;
  /** The consent cookie as the server saw it, so the tag and banner render in the HTML. */
  initialConsent: Consent | null;
}) {
  const { t } = useI18n();
  const copy = t.cookies;
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => initialConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** Accepting after an earlier decline: gtag.js still has to load before the event can be sent. */
  const pendingChoice = useRef<Consent | null>(null);

  useEffect(() => subscribeOpenSettings(() => setSettingsOpen(true)), []);

  function choose(choice: Consent) {
    const gtag = getGtag();
    if (gtag) {
      // Record the choice first; declining switches the tag off right after.
      trackChoice(gtag, choice);
      if (choice === "denied") {
        gtag("consent", "update", { analytics_storage: "denied" });
        setDisabled(measurementId, true);
      } else {
        setDisabled(measurementId, false);
        gtag("consent", "update", { analytics_storage: "granted" });
      }
    } else {
      pendingChoice.current = choice;
    }
    saveConsent(choice);
    setSettingsOpen(false);
  }

  return (
    <>
      {consent !== "denied" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
            onReady={() => {
              const gtag = getGtag();
              if (gtag && pendingChoice.current) {
                trackChoice(gtag, pendingChoice.current);
                pendingChoice.current = null;
              }
            }}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window['ga-disable-${measurementId}'] = false;
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
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
