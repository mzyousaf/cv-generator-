import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  AI_ERROR_CODES,
  AI_ERROR_MESSAGES,
  aiError,
  type AiResult,
} from "@/lib/ai/errors";
import { aiService, type AiService } from "@/lib/ai/service";

type AiActionDeps = {
  getUser: typeof getCurrentUser;
  service: AiService;
};

async function requireAuthenticatedUser(
  getUser: AiActionDeps["getUser"],
): Promise<AiResult<{ id: string }>> {
  const user = await getUser();
  if (!user) {
    return aiError(
      AI_ERROR_CODES.UNAUTHENTICATED,
      AI_ERROR_MESSAGES.UNAUTHENTICATED,
    );
  }

  return { success: true, data: { id: user.id } };
}

export function createAiActions(deps: AiActionDeps) {
  return {
    async generateSummaryAction(input: unknown): Promise<AiResult<string>> {
      const auth = await requireAuthenticatedUser(deps.getUser);
      if (!auth.success) {
        return auth;
      }

      return deps.service.generateSummary(input);
    },

    async improveWorkExperienceAction(
      input: unknown,
    ): Promise<AiResult<string>> {
      const auth = await requireAuthenticatedUser(deps.getUser);
      if (!auth.success) {
        return auth;
      }

      return deps.service.improveWorkExperience(input);
    },

    async suggestSkillsAction(input: unknown): Promise<AiResult<string[]>> {
      const auth = await requireAuthenticatedUser(deps.getUser);
      if (!auth.success) {
        return auth;
      }

      return deps.service.suggestSkills(input);
    },
  };
}

export const defaultAiActions = createAiActions({
  getUser: getCurrentUser,
  service: aiService,
});
