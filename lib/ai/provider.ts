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

export class AiProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderError";
  }
}
