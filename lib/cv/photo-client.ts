import {
  CV_PHOTO_HEIGHT,
  CV_PHOTO_MAX_DATA_URL_LENGTH,
  CV_PHOTO_MAX_UPLOAD_BYTES,
  CV_PHOTO_WIDTH,
} from "@/lib/cv/photo";

export class PhotoTooLargeError extends Error {}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    image.src = url;
  });
}

/**
 * Center-crops an uploaded image to a 4:5 portrait, scales it to the stored
 * size and re-encodes it as JPEG so it fits inside the CV document.
 */
export async function resizePhotoFile(file: File): Promise<string> {
  if (file.size > CV_PHOTO_MAX_UPLOAD_BYTES) {
    throw new PhotoTooLargeError("Image too large");
  }

  const image = await loadImage(file);
  const targetRatio = CV_PHOTO_WIDTH / CV_PHOTO_HEIGHT;
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (sourceRatio > targetRatio) {
    sw = sh * targetRatio;
  } else {
    sh = sw / targetRatio;
  }
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = CV_PHOTO_WIDTH;
  canvas.height = CV_PHOTO_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas unavailable");
  }
  // JPEG has no alpha: paint white behind transparent PNG/WebP uploads.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.85, 0.75, 0.6, 0.45]) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= CV_PHOTO_MAX_DATA_URL_LENGTH) {
      return dataUrl;
    }
  }
  throw new PhotoTooLargeError("Image too large after compression");
}
