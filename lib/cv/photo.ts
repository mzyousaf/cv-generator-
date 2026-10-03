/**
 * CV photos are stored inline as small JPEG/PNG data URLs inside the CV
 * content (no separate file storage). The browser crops and compresses the
 * upload before saving; the server re-validates everything it stores.
 */

/** Output size of the browser-side crop (portrait 4:5). */
export const CV_PHOTO_WIDTH = 400;
export const CV_PHOTO_HEIGHT = 500;

/** Largest data URL accepted by the server (~240 KB of image data). */
export const CV_PHOTO_MAX_DATA_URL_LENGTH = 320_000;

/** Largest file accepted by the picker before compression. */
export const CV_PHOTO_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const PHOTO_DATA_URL = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/;

export function isValidPhotoDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= CV_PHOTO_MAX_DATA_URL_LENGTH &&
    PHOTO_DATA_URL.test(value)
  );
}

/** Keep a stored photo only if it is a valid data URL; otherwise drop it. */
export function sanitizePhoto(value: unknown): string {
  return isValidPhotoDataUrl(value) ? value : "";
}
