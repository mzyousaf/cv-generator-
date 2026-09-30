import {
  getEditorSectionOrder,
  SECTION_NAV_ITEMS,
  type CvSectionSettings,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";

export function builderSectionDomId(
  sectionId: ManageableSectionId | "personal",
): string {
  return `builder-section-${sectionId}`;
}

export function getOrderedSectionNavItems(settings: CvSectionSettings) {
  const order = getEditorSectionOrder(settings);
  return [
    SECTION_NAV_ITEMS[0],
    ...order.map(
      (id) => SECTION_NAV_ITEMS.find((item) => item.id === id)!,
    ),
  ];
}

export function scrollToBuilderSection(
  sectionId: ManageableSectionId | "personal",
): void {
  if (typeof document === "undefined") {
    return;
  }
  document
    .getElementById(builderSectionDomId(sectionId))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
