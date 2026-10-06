export function buildPdfFilename(title: string): string {
  const trimmed = title.trim() || "cv";
  const sanitized = trimmed
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${truncateAtWord(sanitized, 80) || "cv"}.pdf`;
}

export function contentDispositionFilename(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, "") || "cv.pdf";
  return `attachment; filename="${asciiFallback}"`;
}

/** Cut to `max` characters, preferring the last word boundary so names stay whole. */
function truncateAtWord(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  const cut = value.slice(0, max);
  const boundary = cut.lastIndexOf("-");
  return boundary >= max / 2 ? cut.slice(0, boundary) : cut;
}
