import { isValidPhotoDataUrl } from "@/lib/cv/photo";

/** Hosts we fetch account pictures from (Google sign-in avatars). */
const ALLOWED_HOST_SUFFIXES = [".googleusercontent.com"];
const FETCH_TIMEOUT_MS = 5000;
const MAX_IMAGE_BYTES = 230_000;
const PORTRAIT_SIZE = 400;

type FetchLike = typeof fetch;

export function isAllowedAccountPhotoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ALLOWED_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))
    );
  } catch {
    return false;
  }
}

/** Google avatar URLs end in a size option (e.g. "=s96-c"); ask for a CV-sized one. */
export function largerGoogleAvatarUrl(value: string): string {
  return /=s\d+(-c)?$/.test(value)
    ? value.replace(/=s\d+(-c)?$/, `=s${PORTRAIT_SIZE}-c`)
    : value;
}

/**
 * Downloads the signed-in user's profile picture and returns it as a CV photo
 * data URL (JPEG/PNG, size-limited), or null when there is none or it fails.
 */
export async function fetchAccountPhotoDataUrl(
  imageUrl: string | null | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<string | null> {
  if (!imageUrl || !isAllowedAccountPhotoUrl(imageUrl)) {
    return null;
  }
  try {
    const response = await fetchImpl(largerGoogleAvatarUrl(imageUrl), {
      headers: { Accept: "image/jpeg,image/png" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    const type = (response.headers.get("content-type") ?? "").split(";")[0].trim();
    if (type !== "image/jpeg" && type !== "image/png") {
      return null;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
      return null;
    }
    const dataUrl = `data:${type};base64,${bytes.toString("base64")}`;
    return isValidPhotoDataUrl(dataUrl) ? dataUrl : null;
  } catch {
    return null;
  }
}

/** Puts the account picture on a CV's personal details when one is available. */
export function applyAccountPhoto<T extends { personal?: unknown }>(
  content: T,
  accountPhoto: string | null,
): T {
  if (!accountPhoto) {
    return content;
  }
  const personal =
    content.personal && typeof content.personal === "object" && !Array.isArray(content.personal)
      ? (content.personal as Record<string, unknown>)
      : {};
  return { ...content, personal: { ...personal, photo: accountPhoto } };
}
