import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  customSectionIdFromKey,
  getEditorSectionOrder,
  isCustomSectionKey,
  type SectionKey,
} from "@/lib/cv/section-settings";

export type BuilderNavKey = SectionKey | "personal";

export function builderSectionDomId(sectionId: BuilderNavKey): string {
  return `builder-section-${sectionId.replace(":", "-")}`;
}

/** Personal info first (fixed), then every section in the user's order. */
export function getOrderedSectionKeys(
  state: Pick<CvBuilderFormState, "sectionSettings" | "customSections">,
): BuilderNavKey[] {
  return ["personal", ...getEditorSectionOrder(state.sectionSettings, state.customSections)];
}

/** Display name of a section: translated built-in label or the custom title. */
export function sectionDisplayName(
  key: BuilderNavKey,
  state: Pick<CvBuilderFormState, "customSections">,
  labels: Record<"personal" | Exclude<SectionKey, `custom:${string}`>, string>,
  untitled: string,
): string {
  if (isCustomSectionKey(key)) {
    const id = customSectionIdFromKey(key);
    return state.customSections.find((entry) => entry.id === id)?.title.trim() || untitled;
  }
  return labels[key];
}

export function scrollToBuilderSection(sectionId: BuilderNavKey): void {
  if (typeof document === "undefined") {
    return;
  }
  document
    .getElementById(builderSectionDomId(sectionId))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
