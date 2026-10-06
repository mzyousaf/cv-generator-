import { AiProviderError } from "@/lib/ai/provider";

export const AI_ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  INVALID_INPUT: "INVALID_INPUT",
  CONFIGURATION: "CONFIGURATION",
  PROVIDER: "PROVIDER",
} as const;

export type AiErrorCode = (typeof AI_ERROR_CODES)[keyof typeof AI_ERROR_CODES];

export type AiError = {
  code: AiErrorCode;
  message: string;
};

export type AiResult<T> =
  | { success: true; data: T }
  | { success: false; error: AiError };

export function aiError(code: AiErrorCode, message: string): AiResult<never> {
  return { success: false, error: { code, message } };
}

export const AI_ERROR_MESSAGES = {
  UNAUTHENTICATED: "You must be signed in to use AI features.",
  INVALID_INPUT: "Please check your AI input and try again.",
  CONFIGURATION: "AI assistance is not configured yet.",
  PROVIDER: "AI assistance is temporarily unavailable. Please try again.",
} as const;

/** Specific, actionable messages for OpenRouter failures (see AiFailureKind). */
export const AI_FAILURE_MESSAGES = {
  auth: "The AI service rejected the API key. The site owner needs to update the OpenRouter API key.",
  credits:
    "The AI service has run out of credits. The site owner needs to add credits to the OpenRouter account.",
  model:
    "The configured AI model isn't available. The site owner needs to choose another OpenRouter model.",
  rate_limit: "The AI service is busy right now. Wait a minute and try again.",
} as const;

/** Message for a provider failure; generic `fallback` for outages/unknown errors. */
export function aiFailureMessage(error: unknown, fallback: string): string {
  if (error instanceof AiProviderError && error.kind !== "unavailable") {
    return AI_FAILURE_MESSAGES[error.kind];
  }
  return fallback;
}
