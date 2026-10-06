import {
  pickPhotoCandidate,
  readImageDimensions,
  type ImageCandidate,
} from "@/lib/resume-import/photo-candidate";

export async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return typeof result.value === "string" ? result.value : "";
}

/** Best-effort: returns the most portrait-like PNG/JPEG under word/media/. */
export async function extractDocxPhoto(buffer: Buffer): Promise<string | null> {
  try {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(buffer);
    const candidates: ImageCandidate[] = [];

    for (const file of Object.values(zip.files)) {
      if (file.dir || !/^word\/media\/[^/]+\.(png|jpe?g)$/i.test(file.name)) {
        continue;
      }
      const bytes = await file.async("uint8array");
      const info = readImageDimensions(bytes);
      if (!info) {
        continue;
      }
      candidates.push({
        width: info.width,
        height: info.height,
        dataUrl: `data:${info.mime};base64,${Buffer.from(bytes).toString("base64")}`,
      });
    }

    return pickPhotoCandidate(candidates);
  } catch {
    return null;
  }
}
