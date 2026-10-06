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

/** Custom sections take part in ordering/visibility as `custom:<entry id>`. */
export type CustomSectionKey = `custom:${string}`;

/** Any reorderable section: a built-in section or a custom one. */
export type SectionKey = ManageableSectionId | CustomSectionKey;

export type CvSectionSettings = {
  order: SectionKey[];
  hidden: SectionKey[];
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
const CUSTOM_KEY_PATTERN = /^custom:[A-Za-z0-9_-]{1,80}$/;
const MAX_SECTION_KEYS = 250;

type HasId = { id: string };

export function createDefaultSectionSettings(): CvSectionSettings {
  return {
    order: [...DEFAULT_MANAGEABLE_SECTION_ORDER],
    hidden: [],
  };
}

export function isManageableSectionId(value: string): value is ManageableSectionId {
  return (MANAGEABLE_SECTION_IDS as readonly string[]).includes(value);
}

export function isCustomSectionKey(value: string): value is CustomSectionKey {
  return CUSTOM_KEY_PATTERN.test(value);
}

export function customSectionKey(id: string): CustomSectionKey {
  return `custom:${id}`;
}

export function customSectionIdFromKey(key: CustomSectionKey): string {
  return key.slice("custom:".length);
}

function isSectionKey(value: unknown): value is SectionKey {
  return (
    typeof value === "string" &&
    (isManageableSectionId(value) || isCustomSectionKey(value))
  );
}

function uniqueSectionKeys(input: unknown): SectionKey[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const result: SectionKey[] = [];
  const seen = new Set<SectionKey>();
  for (const item of input.slice(0, MAX_SECTION_KEYS)) {
    if (!isSectionKey(item) || seen.has(item)) {
      continue;
    }
    seen.add(item);
    result.push(item);
  }
  return result;
}

/** Keeps known keys in their stored order and appends missing built-ins. */
export function normalizeSectionOrder(order: unknown): SectionKey[] {
  const result = uniqueSectionKeys(order);
  const seen = new Set(result);

  for (const id of DEFAULT_MANAGEABLE_SECTION_ORDER) {
    if (!seen.has(id)) {
      result.push(id);
    }
  }

  return result;
}

export function normalizeHiddenSections(hidden: unknown): SectionKey[] {
  return uniqueSectionKeys(hidden);
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

/**
 * Full editor order: stored order reconciled with the custom sections that
 * actually exist (stale custom keys dropped, new ones appended at the end).
 */
export function getEditorSectionOrder(
  settings: CvSectionSettings,
  customSections: readonly HasId[] = [],
): SectionKey[] {
  const customKeys = new Set(customSections.map((entry) => customSectionKey(entry.id)));
  const order = normalizeSectionOrder(settings.order).filter(
    (key) => !isCustomSectionKey(key) || customKeys.has(key),
  );
  const present = new Set(order);
  for (const key of customKeys) {
    if (!present.has(key)) {
      order.push(key);
    }
  }
  return order;
}

export function getVisibleSectionOrder(
  settings: CvSectionSettings,
  customSections: readonly HasId[] = [],
): SectionKey[] {
  const hidden = new Set(settings.hidden);
  return getEditorSectionOrder(settings, customSections).filter((id) => !hidden.has(id));
}

export function isSectionHidden(
  settings: CvSectionSettings,
  sectionId: SectionKey,
): boolean {
  return settings.hidden.includes(sectionId);
}

export function toggleSectionVisibility(
  settings: CvSectionSettings,
  sectionId: SectionKey,
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
  sectionId: SectionKey,
  direction: "up" | "down",
  customSections: readonly HasId[] = [],
): CvSectionSettings {
  const order = getEditorSectionOrder(settings, customSections);
  const index = order.indexOf(sectionId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= order.length) {
    return settings;
  }

  return reorderSection(settings, sectionId, order[targetIndex], customSections);
}

/** Moves `activeKey` to the position currently held by `overKey` (drag and drop). */
export function reorderSection(
  settings: CvSectionSettings,
  activeKey: SectionKey,
  overKey: SectionKey,
  customSections: readonly HasId[] = [],
): CvSectionSettings {
  const order = getEditorSectionOrder(settings, customSections);
  const from = order.indexOf(activeKey);
  const to = order.indexOf(overKey);
  if (from === -1 || to === -1 || from === to) {
    return settings;
  }

  const next = [...order];
  next.splice(from, 1);
  next.splice(to, 0, activeKey);
  return { ...settings, order: next };
}

/** Inserts a new custom section key, optionally right after another section. */
export function addCustomSectionToSettings(
  settings: CvSectionSettings,
  customId: string,
  customSections: readonly HasId[] = [],
): CvSectionSettings {
  const key = customSectionKey(customId);
  const order = getEditorSectionOrder(settings, customSections).filter((item) => item !== key);
  order.push(key);
  return { ...settings, order };
}

export function removeCustomSectionFromSettings(
  settings: CvSectionSettings,
  customId: string,
): CvSectionSettings {
  const key = customSectionKey(customId);
  return {
    order: settings.order.filter((item) => item !== key),
    hidden: settings.hidden.filter((item) => item !== key),
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
