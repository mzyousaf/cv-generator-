/**
 * Letter spacing for uppercase headings and labels. Wider tracking (about
 * 0.1em and up) makes PDF text extractors, including applicant tracking
 * systems, read headings as separate letters ("W O R K"), so keep it at
 * 0.05em: still visibly tracked, but extracted as whole words.
 */
export function capsTracking(fontSize: number): number {
  return Math.round(fontSize * 5) / 100;
}
