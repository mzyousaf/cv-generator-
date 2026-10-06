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

function buildUserContent(request: AiCompletionRequest) {
  if (!request.files?.length) {
    return request.userPrompt;
  }
  return [
    { type: "text", text: request.userPrompt },
    ...request.files.map((file) => ({
      type: "file",
      file: {
        filename: file.filename,
        file_data: `data:${file.mimeType};base64,${file.dataBase64}`,
      },
    })),
  ];
}

export function buildRequestBody(env: AiEnv, request: AiCompletionRequest) {
  const body: Record<string, unknown> = {
    model: env.model,
    temperature: request.temperature ?? 0.4,
    messages: [
      { role: "system", content: request.systemPrompt },
      { role: "user", content: buildUserContent(request) },
    ],
  };
  if (request.json) {
    body.response_format = { type: "json_object" };
  }
  if (request.maxTokens) {
    body.max_tokens = request.maxTokens;
  }
  if (request.files?.length && env.provider === "openrouter") {
    // OCR so scanned (image-only) PDFs can be read by any model.
    body.plugins = [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }];
  }
  return body;
}

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
          body: JSON.stringify(buildRequestBody(env, request)),
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
