/** Visitor's answer to the analytics cookie banner; null until they choose. */
export type AnalyticsConsent = "granted" | "denied";

export const CONSENT_COOKIE = "analytics_consent";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const CHANGE_EVENT = "analytics-consent-change";
const OPEN_SETTINGS_EVENT = "analytics-consent-open";

export function parseConsent(cookieHeader: string): AnalyticsConsent | null {
  for (const part of cookieHeader.split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === CONSENT_COOKIE && (value === "granted" || value === "denied")) {
      return value;
    }
  }
  return null;
}

export function readConsent(): AnalyticsConsent | null {
  return typeof document === "undefined" ? null : parseConsent(document.cookie);
}

export function saveConsent(consent: AnalyticsConsent) {
  document.cookie = `${CONSENT_COOKIE}=${consent}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
  if (consent === "denied") {
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** Reopens the banner (footer "Cookie settings" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function subscribeOpenSettings(onOpen: () => void): () => void {
  window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
}

/** Removes Google Analytics cookies (_ga, _ga_<id>) set on this site's domains. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const domain of domains) {
        document.cookie = `${name}=; path=/; max-age=0${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }
}
