export const MANAGEABLE_SECTION_IDS = [
  "summary",
  "workExperience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
] as const;

export type ManageableSectionId = (typeof MANAGEABLE_SECTION_IDS)[number];

export type CvSectionSettings = {
  order: ManageableSectionId[];
  hidden: ManageableSectionId[];
};

export const DEFAULT_MANAGEABLE_SECTION_ORDER: ManageableSectionId[] = [
  "summary",
  "workExperience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export const SECTION_NAV_ITEMS: Array<{
  id: ManageableSectionId | "personal";
  label: string;
}> = [
  { id: "personal", label: "Personal Information" },
  { id: "summary", label: "Professional Summary" },
  { id: "workExperience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "languages", label: "Languages" },
];

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function createDefaultSectionSettings(): CvSectionSettings {
  return {
    order: [...DEFAULT_MANAGEABLE_SECTION_ORDER],
    hidden: [],
  };
}

function isManageableSectionId(value: string): value is ManageableSectionId {
  return (MANAGEABLE_SECTION_IDS as readonly string[]).includes(value);
}

export function normalizeSectionOrder(order: unknown): ManageableSectionId[] {
  const result: ManageableSectionId[] = [];
  const seen = new Set<ManageableSectionId>();

  if (Array.isArray(order)) {
    for (const item of order) {
      if (typeof item !== "string" || !isManageableSectionId(item)) {
        continue;
      }
      if (seen.has(item)) {
        continue;
      }
      seen.add(item);
      result.push(item);
    }
  }

  for (const id of DEFAULT_MANAGEABLE_SECTION_ORDER) {
    if (!seen.has(id)) {
      result.push(id);
    }
  }

  return result;
}

export function normalizeHiddenSections(hidden: unknown): ManageableSectionId[] {
  if (!Array.isArray(hidden)) {
    return [];
  }

  const result: ManageableSectionId[] = [];
  const seen = new Set<ManageableSectionId>();

  for (const item of hidden) {
    if (typeof item !== "string" || !isManageableSectionId(item)) {
      continue;
    }
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
    result.push(item);
  }

  return result;
}

export function sanitizeSectionSettings(input: unknown): CvSectionSettings {
  if (input === undefined || input === null) {
    return createDefaultSectionSettings();
  }

  if (typeof input !== "object" || Array.isArray(input)) {
    return createDefaultSectionSettings();
  }

  const record = input as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_KEYS.has(key)) {
      return createDefaultSectionSettings();
    }
  }

  return {
    order: normalizeSectionOrder(record.order),
    hidden: normalizeHiddenSections(record.hidden),
  };
}

export function getEditorSectionOrder(settings: CvSectionSettings): ManageableSectionId[] {
  return normalizeSectionOrder(settings.order);
}

export function getVisibleSectionOrder(settings: CvSectionSettings): ManageableSectionId[] {
  const hidden = new Set(settings.hidden);
  return getEditorSectionOrder(settings).filter((id) => !hidden.has(id));
}

export function isSectionHidden(
  settings: CvSectionSettings,
  sectionId: ManageableSectionId,
): boolean {
  return settings.hidden.includes(sectionId);
}

export function toggleSectionVisibility(
  settings: CvSectionSettings,
  sectionId: ManageableSectionId,
): CvSectionSettings {
  const hidden = new Set(settings.hidden);
  if (hidden.has(sectionId)) {
    hidden.delete(sectionId);
  } else {
    hidden.add(sectionId);
  }

  return {
    ...settings,
    hidden: normalizeHiddenSections([...hidden]),
  };
}

export function moveSection(
  settings: CvSectionSettings,
  sectionId: ManageableSectionId,
  direction: "up" | "down",
): CvSectionSettings {
  const order = [...getEditorSectionOrder(settings)];
  const index = order.indexOf(sectionId);
  if (index === -1) {
    return settings;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= order.length) {
    return settings;
  }

  const next = [...order];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

  return {
    ...settings,
    order: next,
  };
}

export function sectionSettingsToStored(
  settings: CvSectionSettings,
): Record<string, unknown> {
  return {
    order: [...settings.order],
    hidden: [...settings.hidden],
  };
}

export function getSectionLabel(sectionId: ManageableSectionId | "personal"): string {
  return SECTION_NAV_ITEMS.find((item) => item.id === sectionId)?.label ?? sectionId;
}
