export function buildPdfFilename(title: string): string {
  const trimmed = title.trim() || "cv";
  const sanitized = trimmed
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${sanitized || "cv"}.pdf`;
}

export function contentDispositionFilename(filename: string): string {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, "") || "cv.pdf";
  return `attachment; filename="${asciiFallback}"`;
}
