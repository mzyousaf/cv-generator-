import type { AiEnv } from "@/lib/ai/env";
import {
  AiProviderError,
  type AiCompletionRequest,
  type AiProvider,
} from "@/lib/ai/provider";

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

export function createOpenAiHttpProvider(env: AiEnv): AiProvider {
  return {
    async complete(request: AiCompletionRequest): Promise<string> {
      const response = await fetch(`${env.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.model,
          temperature: request.temperature ?? 0.4,
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt },
          ],
        }),
      });

      const payload = (await response.json()) as OpenAiChatResponse;

      if (!response.ok) {
        throw new AiProviderError(
          payload.error?.message || "AI provider request failed.",
        );
      }

      const content = payload.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new AiProviderError("AI provider returned an empty response.");
      }

      return content;
    },
  };
}
