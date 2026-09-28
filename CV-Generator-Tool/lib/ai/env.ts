import { AI_DEFAULT_MODEL } from "@/lib/ai/constants";

export type AiEnv = {
  apiKey: string;
  model: string;
  baseUrl: string;
};

export function getAiEnv(): AiEnv | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const model = process.env.AI_MODEL?.trim() || AI_DEFAULT_MODEL;
  const baseUrl =
    process.env.AI_BASE_URL?.trim().replace(/\/$/, "") ||
    "https://api.openai.com/v1";

  return { apiKey, model, baseUrl };
}
