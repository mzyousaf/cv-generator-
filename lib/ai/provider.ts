export type AiCompletionRequest = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
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
