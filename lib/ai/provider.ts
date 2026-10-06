export type AiFileAttachment = {
  filename: string;
  mimeType: "application/pdf";
  dataBase64: string;
};

export type AiCompletionRequest = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  /** Ask the model for a single JSON object (`response_format: json_object`). */
  json?: boolean;
  /** Documents sent alongside the prompt (e.g. scanned PDFs that need OCR). */
  files?: AiFileAttachment[];
  maxTokens?: number;
};

export type AiProvider = {
  complete(request: AiCompletionRequest): Promise<string>;
};

/** Why an AI request failed, so the UI can say something actionable. */
export type AiFailureKind =
  | "auth" // API key missing/invalid (401/403)
  | "credits" // account out of credits (402)
  | "model" // AI_MODEL unknown or unavailable
  | "rate_limit" // too many requests (429)
  | "unavailable"; // network, timeout, provider outage, bad response

export class AiProviderError extends Error {
  readonly kind: AiFailureKind;
  readonly status?: number;

  constructor(message: string, kind: AiFailureKind = "unavailable", status?: number) {
    super(message);
    this.name = "AiProviderError";
    this.kind = kind;
    this.status = status;
  }
}
