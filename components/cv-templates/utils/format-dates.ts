export type CvDateFormat = {
  /** BCP 47 locale for month names, e.g. "de-DE". */
  locale?: string;
  /** Word for an ongoing position, e.g. "Present" / "heute". */
  present?: string;
};

export function formatMonth(value: string, format: CvDateFormat = {}): string {
  if (!value) {
    return "";
  }

  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(format.locale ?? "en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  start: string,
  end: string,
  current?: boolean,
  format: CvDateFormat = {},
): string {
  const startLabel = formatMonth(start, format);
  const endLabel = current ? (format.present ?? "Present") : formatMonth(end, format);
  if (!startLabel && !endLabel) {
    return "";
  }
  if (!startLabel) {
    return endLabel;
  }
  if (!endLabel) {
    return startLabel;
  }
  return `${startLabel} – ${endLabel}`;
}
