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
