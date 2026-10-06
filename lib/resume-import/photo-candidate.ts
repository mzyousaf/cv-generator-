/**
 * Picks the image most likely to be the candidate's portrait from the images
 * embedded in an uploaded resume. Photos are roughly square or portrait and
 * reasonably large; logos, icons and separators are wide or tiny.
 */
export type ImageCandidate = {
  width: number;
  height: number;
  /** data:image/...;base64 URL */
  dataUrl: string;
};

const MIN_PHOTO_SIDE = 60;
const MIN_ASPECT = 0.5;
const MAX_ASPECT = 1.4;
/** Skip absurdly large images so the client never receives multi-MB payloads. */
export const MAX_PHOTO_CANDIDATE_DATA_URL_LENGTH = 6_000_000;

export function isLikelyPortrait(width: number, height: number): boolean {
  if (width < MIN_PHOTO_SIDE || height < MIN_PHOTO_SIDE) {
    return false;
  }
  const aspect = width / height;
  return aspect >= MIN_ASPECT && aspect <= MAX_ASPECT;
}

export function pickPhotoCandidate(images: ImageCandidate[]): string | null {
  let best: ImageCandidate | null = null;
  for (const image of images) {
    if (
      !image.dataUrl.startsWith("data:image/") ||
      image.dataUrl.length > MAX_PHOTO_CANDIDATE_DATA_URL_LENGTH ||
      !isLikelyPortrait(image.width, image.height)
    ) {
      continue;
    }
    if (!best || image.width * image.height > best.width * best.height) {
      best = image;
    }
  }
  return best?.dataUrl ?? null;
}

/** Reads pixel dimensions from PNG/JPEG headers without decoding the image. */
export function readImageDimensions(
  bytes: Uint8Array,
): { width: number; height: number; mime: "image/png" | "image/jpeg" } | null {
  // PNG: signature + IHDR chunk with big-endian width/height.
  if (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20), mime: "image/png" };
  }

  // JPEG: walk segments until a start-of-frame marker.
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      const isStartOfFrame =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isStartOfFrame) {
        return {
          height: (bytes[offset + 5] << 8) | bytes[offset + 6],
          width: (bytes[offset + 7] << 8) | bytes[offset + 8],
          mime: "image/jpeg",
        };
      }
      offset += 2 + length;
    }
  }

  return null;
}
