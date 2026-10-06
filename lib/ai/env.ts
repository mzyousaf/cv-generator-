import {
  OPENROUTER_APP_TITLE,
  OPENROUTER_BASE_URL,
  OPENROUTER_DEFAULT_MODEL,
} from "@/lib/ai/constants";

export type AiEnv = {
  apiKey: string;
  model: string;
  baseUrl: string;
  headers: Record<string, string>;
};

type EnvInput = Record<string, string | undefined>;

function read(env: EnvInput, key: string): string | undefined {
  return env[key]?.trim() || undefined;
}

/** OpenRouter configuration; AI features are disabled until OPENROUTER_API_KEY is set. */
export function getAiEnv(env: EnvInput = process.env): AiEnv | null {
  const apiKey = read(env, "OPENROUTER_API_KEY");
  if (!apiKey) {
    return null;
  }

  // Optional attribution headers shown on openrouter.ai.
  const headers: Record<string, string> = {
    "X-Title": read(env, "OPENROUTER_APP_NAME") || OPENROUTER_APP_TITLE,
  };
  const siteUrl = read(env, "OPENROUTER_SITE_URL") || read(env, "AUTH_URL");
  if (siteUrl) {
    headers["HTTP-Referer"] = siteUrl;
  }

  return {
    apiKey,
    model: read(env, "AI_MODEL") || OPENROUTER_DEFAULT_MODEL,
    baseUrl: OPENROUTER_BASE_URL,
    headers,
  };
}

export function isAiConfigured(env: EnvInput = process.env): boolean {
  return getAiEnv(env) !== null;
}
