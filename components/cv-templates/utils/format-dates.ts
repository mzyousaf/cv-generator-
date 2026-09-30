export function formatMonth(value: string): string {
  if (!value) {
    return "";
  }

  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function formatDateRange(
  start: string,
  end: string,
  current?: boolean,
): string {
  const startLabel = formatMonth(start);
  const endLabel = current ? "Present" : formatMonth(end);
  if (!startLabel && !endLabel) {
    return "";
  }
  if (!startLabel) {
    return endLabel;
  }
  if (!endLabel) {
    return startLabel;
  }
  return `${startLabel} to ${endLabel}`;
}
