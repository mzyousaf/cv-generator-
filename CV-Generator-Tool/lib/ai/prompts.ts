import type {
  SkillsSuggestionInput,
  SummaryGenerationInput,
  WorkExperienceImproveInput,
} from "@/lib/ai/validation";

export const SUMMARY_SYSTEM_PROMPT = `You write concise professional CV summaries.
Use only facts provided by the user.
Do not invent employers, achievements, metrics, tools, or credentials.
Return plain text only without markdown headings or bullet markers.`;

export const EXPERIENCE_SYSTEM_PROMPT = `You rewrite CV work experience descriptions into concise, professional, achievement-oriented language.
Preserve factual meaning exactly.
Do not invent employers, dates, metrics, technologies, or accomplishments.
Return plain text only.`;

export const SKILLS_SYSTEM_PROMPT = `You suggest relevant professional skills for a CV.
Return only a JSON array of strings, e.g. ["Skill A","Skill B"].
Do not include explanations, markdown, or extra keys.`;

export function buildSummaryUserPrompt(input: SummaryGenerationInput): string {
  const lines = [
    `Role/title: ${input.roleTitle || "Not provided"}`,
    `Experience notes: ${input.experienceNotes || "Not provided"}`,
    `Skills: ${input.skillsNotes || "Not provided"}`,
    `Career goals: ${input.careerGoals || "Not provided"}`,
  ];

  if (input.currentSummary) {
    lines.push(`Current summary:\n${input.currentSummary}`);
    lines.push("Improve this summary while preserving factual meaning.");
  } else {
    lines.push("Write a concise professional summary (3-5 sentences).");
  }

  return lines.join("\n");
}

export function buildExperienceUserPrompt(
  input: WorkExperienceImproveInput,
): string {
  return [
    `Job title: ${input.jobTitle || "Not provided"}`,
    `Company: ${input.company || "Not provided"}`,
    `Current description:\n${input.description}`,
    "Rewrite this into stronger CV language while preserving facts.",
  ].join("\n");
}

export function buildSkillsUserPrompt(input: SkillsSuggestionInput): string {
  return [
    `Role/title: ${input.roleTitle || "Not provided"}`,
    `Summary: ${input.summary || "Not provided"}`,
    `Experience notes: ${input.experienceNotes || "Not provided"}`,
    `Existing skills: ${input.existingSkills.join(", ") || "None"}`,
    "Suggest additional relevant skills not already listed.",
  ].join("\n");
}
