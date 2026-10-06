import { getAiEnv } from "@/lib/ai/env";
import {
  AI_ERROR_CODES,
  AI_ERROR_MESSAGES,
  aiError,
  aiFailureMessage,
  type AiResult,
} from "@/lib/ai/errors";
import {
  buildExperienceUserPrompt,
  buildSkillsUserPrompt,
  buildSummaryUserPrompt,
  EXPERIENCE_SYSTEM_PROMPT,
  SKILLS_SYSTEM_PROMPT,
  SUMMARY_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import type { AiProvider } from "@/lib/ai/provider";
import { createOpenRouterProvider } from "@/lib/ai/providers/openrouter";
import {
  buildSectionCreateUserPrompt,
  buildSectionWriteUserPrompt,
  parseCreatedSection,
  sanitizeSectionText,
  SECTION_CREATE_SYSTEM_PROMPT,
  SECTION_WRITE_SYSTEM_PROMPT,
  validateSectionCreateInput,
  validateSectionWriteInput,
} from "@/lib/ai/section-writer";
import {
  sanitizeExperienceOutput,
  sanitizeSuggestedSkills,
  sanitizeSummaryOutput,
  validateSkillsSuggestionInput,
  validateSummaryGenerationInput,
  validateWorkExperienceImproveInput,
  type SkillsSuggestionInput,
  type SummaryGenerationInput,
  type WorkExperienceImproveInput,
} from "@/lib/ai/validation";

type AiServiceDeps = {
  getProvider: () => AiProvider | null;
};

function mapProviderFailure(error?: unknown): AiResult<never> {
  return aiError(
    AI_ERROR_CODES.PROVIDER,
    aiFailureMessage(error, AI_ERROR_MESSAGES.PROVIDER),
  );
}

export function createAiService(deps: AiServiceDeps) {
  async function runWithProvider(
    callback: (provider: AiProvider) => Promise<string>,
  ): Promise<AiResult<string>> {
    const provider = deps.getProvider();
    if (!provider) {
      return aiError(
        AI_ERROR_CODES.CONFIGURATION,
        AI_ERROR_MESSAGES.CONFIGURATION,
      );
    }

    try {
      const output = await callback(provider);
      if (!output.trim()) {
        return mapProviderFailure();
      }

      return { success: true, data: output };
    } catch (error) {
      return mapProviderFailure(error);
    }
  }

  return {
    async generateSummary(input: unknown): Promise<AiResult<string>> {
      const validated = validateSummaryGenerationInput(input);
      if (!validated.ok) {
        return aiError(AI_ERROR_CODES.INVALID_INPUT, validated.message);
      }

      const result = await runWithProvider((provider) =>
        provider.complete({
          systemPrompt: SUMMARY_SYSTEM_PROMPT,
          userPrompt: buildSummaryUserPrompt(validated.value),
        }),
      );

      if (!result.success) {
        return result;
      }

      const summary = sanitizeSummaryOutput(result.data);
      if (!summary) {
        return mapProviderFailure();
      }

      return { success: true, data: summary };
    },

    async improveWorkExperience(input: unknown): Promise<AiResult<string>> {
      const validated = validateWorkExperienceImproveInput(input);
      if (!validated.ok) {
        return aiError(AI_ERROR_CODES.INVALID_INPUT, validated.message);
      }

      const result = await runWithProvider((provider) =>
        provider.complete({
          systemPrompt: EXPERIENCE_SYSTEM_PROMPT,
          userPrompt: buildExperienceUserPrompt(validated.value),
        }),
      );

      if (!result.success) {
        return result;
      }

      const description = sanitizeExperienceOutput(result.data);
      if (!description) {
        return mapProviderFailure();
      }

      return { success: true, data: description };
    },

    async suggestSkills(input: unknown): Promise<AiResult<string[]>> {
      const validated = validateSkillsSuggestionInput(input);
      if (!validated.ok) {
        return aiError(AI_ERROR_CODES.INVALID_INPUT, validated.message);
      }

      const result = await runWithProvider((provider) =>
        provider.complete({
          systemPrompt: SKILLS_SYSTEM_PROMPT,
          userPrompt: buildSkillsUserPrompt(validated.value),
          temperature: 0.3,
        }),
      );

      if (!result.success) {
        return result;
      }

      const skills = sanitizeSuggestedSkills(result.data).filter(
        (skill) => !validated.value.existingSkills.includes(skill),
      );

      if (skills.length === 0) {
        return mapProviderFailure();
      }

      return { success: true, data: skills };
    },

    /** Writes or improves any free-text CV section (custom, project, education…). */
    async writeSection(input: unknown): Promise<AiResult<string>> {
      const validated = validateSectionWriteInput(input);
      if (!validated.ok) {
        return aiError(AI_ERROR_CODES.INVALID_INPUT, validated.message);
      }

      const result = await runWithProvider((provider) =>
        provider.complete({
          systemPrompt: SECTION_WRITE_SYSTEM_PROMPT,
          userPrompt: buildSectionWriteUserPrompt(validated.value),
        }),
      );
      if (!result.success) {
        return result;
      }

      const text = sanitizeSectionText(result.data);
      return text ? { success: true, data: text } : mapProviderFailure();
    },

    /** Creates a whole new section (title + content) from a short request. */
    async createSection(
      input: unknown,
    ): Promise<AiResult<{ title: string; content: string }>> {
      const validated = validateSectionCreateInput(input);
      if (!validated.ok) {
        return aiError(AI_ERROR_CODES.INVALID_INPUT, validated.message);
      }

      const result = await runWithProvider((provider) =>
        provider.complete({
          systemPrompt: SECTION_CREATE_SYSTEM_PROMPT,
          userPrompt: buildSectionCreateUserPrompt(validated.value),
          json: true,
        }),
      );
      if (!result.success) {
        return result;
      }

      const section = parseCreatedSection(result.data);
      if (!section) {
        return mapProviderFailure();
      }
      return {
        success: true,
        data: { title: section.title || validated.value.request.slice(0, 60), content: section.content },
      };
    },

    validateSummaryGenerationInput,
    validateWorkExperienceImproveInput,
    validateSkillsSuggestionInput,
  };
}

export function getDefaultAiProvider(): AiProvider | null {
  const env = getAiEnv();
  if (!env) {
    return null;
  }

  return createOpenRouterProvider(env);
}

export const aiService = createAiService({
  getProvider: getDefaultAiProvider,
});

export type AiService = ReturnType<typeof createAiService>;

export type {
  SkillsSuggestionInput,
  SummaryGenerationInput,
  WorkExperienceImproveInput,
};
