import {
  AI_MAX_EXPERIENCE_OUTPUT,
  AI_MAX_FIELD_LENGTH,
  AI_MAX_SKILL_LENGTH,
  AI_MAX_SKILLS_INPUT,
  AI_MAX_SUGGESTED_SKILLS,
  AI_MAX_SUMMARY_OUTPUT,
} from "@/lib/ai/constants";

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function trimField(value: unknown, maxLength = AI_MAX_FIELD_LENGTH): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function requireAtLeastOneField(fields: Record<string, string>): ValidationResult<Record<string, string>> {
  const hasValue = Object.values(fields).some((field) => field.length > 0);
  if (!hasValue) {
    return { ok: false, message: "Provide at least one input field." };
  }

  return { ok: true, value: fields };
}

export type SummaryGenerationInput = {
  roleTitle: string;
  experienceNotes: string;
  skillsNotes: string;
  careerGoals: string;
  currentSummary: string;
};

export function validateSummaryGenerationInput(
  input: unknown,
): ValidationResult<SummaryGenerationInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, message: "Invalid summary input." };
  }

  const record = input as Record<string, unknown>;
  const fields = {
    roleTitle: trimField(record.roleTitle),
    experienceNotes: trimField(record.experienceNotes),
    skillsNotes: trimField(record.skillsNotes),
    careerGoals: trimField(record.careerGoals),
    currentSummary: trimField(record.currentSummary),
  };

  if (fields.currentSummary) {
    return { ok: true, value: fields };
  }

  const required = requireAtLeastOneField(fields);
  if (!required.ok) {
    return required;
  }

  return { ok: true, value: fields };
}

export type WorkExperienceImproveInput = {
  jobTitle: string;
  company: string;
  description: string;
};

export function validateWorkExperienceImproveInput(
  input: unknown,
): ValidationResult<WorkExperienceImproveInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, message: "Invalid work experience input." };
  }

  const record = input as Record<string, unknown>;
  const value = {
    jobTitle: trimField(record.jobTitle),
    company: trimField(record.company),
    description: trimField(record.description),
  };

  if (!value.description) {
    return { ok: false, message: "Description is required to improve with AI." };
  }

  return { ok: true, value };
}

export type SkillsSuggestionInput = {
  roleTitle: string;
  summary: string;
  experienceNotes: string;
  existingSkills: string[];
};

export function validateSkillsSuggestionInput(
  input: unknown,
): ValidationResult<SkillsSuggestionInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, message: "Invalid skills suggestion input." };
  }

  const record = input as Record<string, unknown>;
  const existingSkills = Array.isArray(record.existingSkills)
    ? record.existingSkills
        .filter((skill): skill is string => typeof skill === "string")
        .map((skill) => skill.trim().slice(0, AI_MAX_SKILL_LENGTH))
        .filter(Boolean)
        .slice(0, AI_MAX_SKILLS_INPUT)
    : [];

  const fields = {
    roleTitle: trimField(record.roleTitle),
    summary: trimField(record.summary),
    experienceNotes: trimField(record.experienceNotes),
  };

  const contextCheck = requireAtLeastOneField({
    ...fields,
    existingSkills: existingSkills.join(", "),
  });

  if (!contextCheck.ok) {
    return contextCheck;
  }

  return {
    ok: true,
    value: {
      ...fields,
      existingSkills,
    },
  };
}

export function sanitizeSummaryOutput(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, AI_MAX_SUMMARY_OUTPUT);
}

export function sanitizeExperienceOutput(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, AI_MAX_EXPERIENCE_OUTPUT);
}

export function sanitizeSuggestedSkills(raw: string): string[] {
  const cleaned = raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  let candidates: string[] = [];

  if (cleaned.startsWith("[")) {
    try {
      const parsed = JSON.parse(cleaned) as unknown;
      if (Array.isArray(parsed)) {
        candidates = parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      candidates = [];
    }
  }

  if (candidates.length === 0) {
    candidates = cleaned
      .split(/\r?\n|,/)
      .map((item) => item.replace(/^[-*•\d.\s]+/, "").trim())
      .filter(Boolean);
  }

  const unique = new Set<string>();
  for (const skill of candidates) {
    const normalized = skill.trim().slice(0, AI_MAX_SKILL_LENGTH);
    if (!normalized) {
      continue;
    }
    unique.add(normalized);
    if (unique.size >= AI_MAX_SUGGESTED_SKILLS) {
      break;
    }
  }

  return [...unique];
}
