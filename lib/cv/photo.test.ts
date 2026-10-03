import assert from "node:assert/strict";
import test from "node:test";
import {
  CV_PHOTO_MAX_DATA_URL_LENGTH,
  isValidPhotoDataUrl,
  sanitizePhoto,
} from "@/lib/cv/photo";

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

test("accepts small JPEG and PNG data URLs", () => {
  assert.equal(isValidPhotoDataUrl(TINY_PNG), true);
  assert.equal(isValidPhotoDataUrl(TINY_PNG.replace("image/png", "image/jpeg")), true);
});

test("rejects other types, scripts, remote URLs and oversized payloads", () => {
  assert.equal(isValidPhotoDataUrl("data:image/svg+xml;base64,PHN2Zz4="), false);
  assert.equal(isValidPhotoDataUrl("data:text/html;base64,PHNjcmlwdD4="), false);
  assert.equal(isValidPhotoDataUrl("https://example.com/me.jpg"), false);
  assert.equal(isValidPhotoDataUrl("data:image/png;base64,abc\"onerror=alert(1)"), false);
  assert.equal(
    isValidPhotoDataUrl(`data:image/png;base64,${"A".repeat(CV_PHOTO_MAX_DATA_URL_LENGTH)}`),
    false,
  );
  assert.equal(isValidPhotoDataUrl(42), false);
});

test("sanitizePhoto drops invalid values", () => {
  assert.equal(sanitizePhoto(TINY_PNG), TINY_PNG);
  assert.equal(sanitizePhoto("javascript:alert(1)"), "");
  assert.equal(sanitizePhoto(undefined), "");
});
