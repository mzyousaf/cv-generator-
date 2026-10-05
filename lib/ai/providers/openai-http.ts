import { AI_REQUEST_TIMEOUT_MS } from "@/lib/ai/constants";
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

/**
 * OpenAI-compatible chat completions client. Works with OpenRouter, OpenAI
 * and any other provider exposing `/chat/completions`.
 */
export function createOpenAiHttpProvider(env: AiEnv): AiProvider {
  return {
    async complete(request: AiCompletionRequest): Promise<string> {
      let response: Response;
      try {
        response = await fetch(`${env.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            ...env.headers,
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
          signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
        });
      } catch (error) {
        throw new AiProviderError(
          error instanceof Error
            ? `AI provider request failed: ${error.message}`
            : "AI provider request failed.",
        );
      }

      let payload: OpenAiChatResponse;
      try {
        payload = (await response.json()) as OpenAiChatResponse;
      } catch {
        throw new AiProviderError(
          `AI provider returned an invalid response (HTTP ${response.status}).`,
        );
      }

      if (!response.ok || payload.error) {
        const message =
          payload.error?.message ||
          `AI provider request failed (HTTP ${response.status}).`;
        console.error(`[ai:${env.provider}] ${message}`);
        throw new AiProviderError(message);
      }

      const content = payload.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new AiProviderError("AI provider returned an empty response.");
      }

      return content;
    },
  };
}
