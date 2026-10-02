import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";

type ServerErrorKey = keyof Dictionary["serverErrors"];

/** English server message -> dictionary key (English values are the exact server strings). */
const KEY_BY_MESSAGE = new Map<string, ServerErrorKey>(
  (Object.entries(en.serverErrors) as [ServerErrorKey, string][]).map(
    ([key, message]) => [message, key],
  ),
);

/** Messages built with a field name, e.g. "skills must be an array." */
const PATTERNS: [RegExp, ServerErrorKey][] = [
  [/ has too many entries\.$/, "sectionTooMany"],
  [/ (must be an array|contains invalid entries)\.$/, "sectionInvalid"],
];

export function serverErrorKey(message: string): ServerErrorKey | undefined {
  const exact = KEY_BY_MESSAGE.get(message.trim());
  if (exact) {
    return exact;
  }
  return PATTERNS.find(([pattern]) => pattern.test(message))?.[1];
}

/**
 * Translate a message produced by server code (validation, actions, API routes).
 * Unknown messages are returned unchanged.
 */
export function localizeServerMessage(
  t: Dictionary,
  message: string | null | undefined,
): string {
  if (!message) {
    return "";
  }
  const key = serverErrorKey(message);
  return key ? t.serverErrors[key] : message;
}
