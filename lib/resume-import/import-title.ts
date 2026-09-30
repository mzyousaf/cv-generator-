import { CV_TITLE_MAX_LENGTH } from "@/lib/cv/constants";

export function defaultImportResumeTitle(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return "Imported Resume";
  }

  const title = `${trimmed} Resume`;
  if (title.length <= CV_TITLE_MAX_LENGTH) {
    return title;
  }

  const suffix = " Resume";
  const maxNameLength = CV_TITLE_MAX_LENGTH - suffix.length;
  return `${trimmed.slice(0, maxNameLength).trim()} Resume`;
}

export function resolveImportResumeTitle(
  title: unknown,
  fullName: unknown,
): string {
  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return defaultImportResumeTitle(typeof fullName === "string" ? fullName : "");
}
