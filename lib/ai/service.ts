import { getAiEnv } from "@/lib/ai/env";
import { AI_ERROR_CODES, AI_ERROR_MESSAGES, aiError, type AiResult } from "@/lib/ai/errors";
import {
  buildExperienceUserPrompt,
  buildSkillsUserPrompt,
  buildSummaryUserPrompt,
  EXPERIENCE_SYSTEM_PROMPT,
  SKILLS_SYSTEM_PROMPT,
  SUMMARY_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { AiProviderError, type AiProvider } from "@/lib/ai/provider";
import { createOpenAiHttpProvider } from "@/lib/ai/providers/openai-http";
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

function mapProviderFailure(): AiResult<never> {
  return aiError(AI_ERROR_CODES.PROVIDER, AI_ERROR_MESSAGES.PROVIDER);
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
      if (error instanceof AiProviderError) {
        return mapProviderFailure();
      }

      return mapProviderFailure();
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

  return createOpenAiHttpProvider(env);
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
