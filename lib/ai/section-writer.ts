import { AI_MAX_FIELD_LENGTH } from "@/lib/ai/constants";
import { extractJsonObjectFromModelText } from "@/lib/resume-import/parse-json";
import { LOCALES, type Locale } from "@/lib/i18n/preferences";

export const AI_MAX_CONTEXT_LENGTH = 6_000;
export const AI_MAX_SECTION_CONTENT = 10_000;
export const AI_MAX_SECTION_TITLE = 120;

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ar: "Arabic",
  zh: "Simplified Chinese",
};

type ValidationResult<T> = { ok: true; value: T } | { ok: false; message: string };

function trimField(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function readLanguage(value: unknown): Locale {
  return (LOCALES as readonly unknown[]).includes(value) ? (value as Locale) : "en";
}

export type SectionWriteInput = {
  /** What is being written, e.g. "Volunteering" or "Project: Billing app". */
  sectionTitle: string;
  /** Optional user direction ("make it shorter", "focus on leadership"). */
  instructions: string;
  /** Existing text to improve; empty to write from scratch. */
  currentContent: string;
  /** Compact summary of the rest of the CV for grounding. */
  context: string;
  language: Locale;
};

export function validateSectionWriteInput(input: unknown): ValidationResult<SectionWriteInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, message: "Invalid section input." };
  }
  const record = input as Record<string, unknown>;
  const value: SectionWriteInput = {
    sectionTitle: trimField(record.sectionTitle, AI_MAX_SECTION_TITLE),
    instructions: trimField(record.instructions, AI_MAX_FIELD_LENGTH),
    currentContent: trimField(record.currentContent, AI_MAX_SECTION_CONTENT),
    context: trimField(record.context, AI_MAX_CONTEXT_LENGTH),
    language: readLanguage(record.language),
  };
  if (!value.sectionTitle && !value.instructions && !value.currentContent) {
    return { ok: false, message: "Provide at least one input field." };
  }
  return { ok: true, value };
}

export type SectionCreateInput = {
  request: string;
  context: string;
  language: Locale;
};

export function validateSectionCreateInput(input: unknown): ValidationResult<SectionCreateInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, message: "Invalid section input." };
  }
  const record = input as Record<string, unknown>;
  const value: SectionCreateInput = {
    request: trimField(record.request, AI_MAX_FIELD_LENGTH),
    context: trimField(record.context, AI_MAX_CONTEXT_LENGTH),
    language: readLanguage(record.language),
  };
  if (!value.request) {
    return { ok: false, message: "Provide at least one input field." };
  }
  return { ok: true, value };
}

const SHARED_RULES = `Rules:
- Use only facts from the user's notes, the existing text and the CV context. Never invent employers, dates, numbers, credentials or achievements.
- Where the user gives little detail, write concise, generic but plausible-sounding wording without fabricated specifics, so they can fill in details.
- Write concise, professional CV language. Use one item per line starting with "- " for lists; use short paragraphs otherwise.
- No markdown headings, bold text, code fences or commentary.`;

export const SECTION_WRITE_SYSTEM_PROMPT = `You write and improve sections of a CV/resume.
${SHARED_RULES}
Return only the section text.`;

export const SECTION_CREATE_SYSTEM_PROMPT = `You create a new section for a CV/resume from the user's request.
${SHARED_RULES}
Return a single JSON object: {"title": "<short section heading>", "content": "<section text>"}.`;

export function buildSectionWriteUserPrompt(input: SectionWriteInput): string {
  const lines = [
    `Write in ${LANGUAGE_NAMES[input.language]}.`,
    `Section: ${input.sectionTitle || "Not provided"}`,
  ];
  if (input.context) {
    lines.push(`CV context:\n${input.context}`);
  }
  if (input.currentContent) {
    lines.push(`Current section text:\n${input.currentContent}`);
  }
  if (input.instructions) {
    lines.push(`User instructions: ${input.instructions}`);
  }
  lines.push(
    input.currentContent
      ? "Improve the current section text, following the instructions if given, while preserving every fact."
      : "Write the content for this section.",
  );
  return lines.join("\n\n");
}

export function buildSectionCreateUserPrompt(input: SectionCreateInput): string {
  const lines = [`Write in ${LANGUAGE_NAMES[input.language]}.`, `Request: ${input.request}`];
  if (input.context) {
    lines.push(`CV context:\n${input.context}`);
  }
  lines.push("Create the section title and content.");
  return lines.join("\n\n");
}

/** Drops fences/headings models sometimes add despite instructions. */
export function sanitizeSectionText(raw: string): string {
  return raw
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/```\s*$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*#{1,6}\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1").trimEnd())
    .join("\n")
    .replace(/^\s*[•*]\s+/gm, "- ")
    .trim()
    .slice(0, AI_MAX_SECTION_CONTENT);
}

export function parseCreatedSection(raw: string): { title: string; content: string } | null {
  try {
    const parsed = extractJsonObjectFromModelText(raw) as Record<string, unknown>;
    const title = trimField(parsed.title, AI_MAX_SECTION_TITLE);
    const content = typeof parsed.content === "string" ? sanitizeSectionText(parsed.content) : "";
    return content ? { title, content } : null;
  } catch {
    return null;
  }
}
