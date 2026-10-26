"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  AI_ERROR_CODES,
  AI_ERROR_MESSAGES,
  aiError,
  type AiResult,
} from "@/lib/ai/errors";
import { aiService } from "@/lib/ai/service";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { enforceRateLimit } from "@/lib/rate-limit-server";

async function withAuthenticatedUser<T>(
  callback: () => Promise<AiResult<T>>,
): Promise<AiResult<T>> {
  const user = await getCurrentUser();
  if (!user) {
    return aiError(
      AI_ERROR_CODES.UNAUTHENTICATED,
      AI_ERROR_MESSAGES.UNAUTHENTICATED,
    );
  }

  const limit = await enforceRateLimit(RATE_LIMITS.ai, user.id);
  if (!limit.ok) {
    return aiError(AI_ERROR_CODES.RATE_LIMITED, AI_ERROR_MESSAGES.RATE_LIMITED);
  }

  return callback();
}

export async function generateSummaryAction(
  input: unknown,
): Promise<AiResult<string>> {
  return withAuthenticatedUser(() => aiService.generateSummary(input));
}

export async function improveWorkExperienceAction(
  input: unknown,
): Promise<AiResult<string>> {
  return withAuthenticatedUser(() => aiService.improveWorkExperience(input));
}

export async function suggestSkillsAction(
  input: unknown,
): Promise<AiResult<string[]>> {
  return withAuthenticatedUser(() => aiService.suggestSkills(input));
}

export async function writeSectionAction(
  input: unknown,
): Promise<AiResult<string>> {
  return withAuthenticatedUser(() => aiService.writeSection(input));
}

export async function createSectionAction(
  input: unknown,
): Promise<AiResult<{ title: string; content: string }>> {
  return withAuthenticatedUser(() => aiService.createSection(input));
}
