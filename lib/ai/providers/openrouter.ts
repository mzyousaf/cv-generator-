import { AI_REQUEST_TIMEOUT_MS } from "@/lib/ai/constants";
import type { AiEnv } from "@/lib/ai/env";
import {
  AiProviderError,
  type AiFailureKind,
  type AiCompletionRequest,
  type AiProvider,
} from "@/lib/ai/provider";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    code?: number | string;
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
  if (request.files?.length) {
    // OCR so scanned (image-only) PDFs can be read by any model.
    body.plugins = [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }];
  }
  return body;
}

export function classifyOpenRouterFailure(status: number, message: string): AiFailureKind {
  if (status === 401 || status === 403) {
    return "auth";
  }
  if (status === 402) {
    return "credits";
  }
  if (status === 429) {
    return "rate_limit";
  }
  if ((status === 400 || status === 404) && /model/i.test(message) && !/parameter/i.test(message)) {
    return "model";
  }
  return "unavailable";
}

/** The chosen model/provider rejected an optional parameter (e.g. JSON mode). */
function isUnsupportedParameterError(status: number, message: string): boolean {
  return (
    (status === 400 || status === 404 || status === 422) &&
    /response_format|json|parameter|support/i.test(message)
  );
}

function isTransient(error: AiProviderError): boolean {
  return (
    error.kind === "rate_limit" ||
    (error.kind === "unavailable" && (error.status === undefined || error.status >= 500))
  );
}

const RETRY_DELAY_MS = 1500;

/** OpenRouter chat completions client. */
export function createOpenRouterProvider(env: AiEnv): AiProvider {
  async function send(request: AiCompletionRequest): Promise<string> {
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
          ? `OpenRouter request failed: ${error.message}`
          : "OpenRouter request failed.",
      );
    }

    let payload: ChatCompletionResponse;
    try {
      payload = (await response.json()) as ChatCompletionResponse;
    } catch {
      throw new AiProviderError(
        `OpenRouter returned an invalid response (HTTP ${response.status}).`,
        response.status === 401 || response.status === 403 ? "auth" : "unavailable",
        response.status,
      );
    }

    if (!response.ok || payload.error) {
      // OpenRouter sometimes reports errors with HTTP 200 and an error code.
      const status =
        typeof payload.error?.code === "number" ? payload.error.code : response.status;
      const message =
        payload.error?.message || `OpenRouter request failed (HTTP ${status}).`;
      throw new AiProviderError(message, classifyOpenRouterFailure(status, message), status);
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new AiProviderError("OpenRouter returned an empty response.");
    }

    return content;
  }

  return {
    async complete(request: AiCompletionRequest): Promise<string> {
      let current = request;
      for (let attempt = 1; ; attempt += 1) {
        try {
          return await send(current);
        } catch (error) {
          if (!(error instanceof AiProviderError) || attempt >= 3) {
            logFailure(env, error);
            throw error;
          }
          if (current.json && isUnsupportedParameterError(error.status ?? 0, error.message)) {
            // Model doesn't do JSON mode: the prompt still asks for JSON.
            current = { ...current, json: false };
            continue;
          }
          if (isTransient(error) && attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            continue;
          }
          logFailure(env, error);
          throw error;
        }
      }
    },
  };
}

function logFailure(env: AiEnv, error: unknown) {
  if (error instanceof AiProviderError) {
    console.error(
      `[ai:openrouter] model=${env.model} kind=${error.kind} status=${error.status ?? "-"}: ${error.message}`,
    );
  } else {
    console.error(`[ai:openrouter] model=${env.model}:`, error);
  }
}
