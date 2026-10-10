/** Replace `{name}` placeholders in a translated string. */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Space between words of a split heading: Chinese runs words together. */
export function wordGap(locale: string): string {
  return locale === "zh" ? "" : " ";
}
