import {
  AI_DEFAULT_MODEL,
  OPENAI_BASE_URL,
  OPENROUTER_APP_TITLE,
  OPENROUTER_BASE_URL,
  OPENROUTER_DEFAULT_MODEL,
} from "@/lib/ai/constants";

export type AiProviderName = "openrouter" | "openai";

export type AiEnv = {
  provider: AiProviderName;
  apiKey: string;
  model: string;
  baseUrl: string;
  headers: Record<string, string>;
};

type EnvInput = Record<string, string | undefined>;

function read(env: EnvInput, key: string): string | undefined {
  return env[key]?.trim() || undefined;
}

/**
 * Resolves AI configuration. OpenRouter is preferred when OPENROUTER_API_KEY
 * is set; otherwise falls back to OPENAI_API_KEY (any OpenAI-compatible API).
 */
export function getAiEnv(env: EnvInput = process.env): AiEnv | null {
  const openRouterKey = read(env, "OPENROUTER_API_KEY");
  const openAiKey = read(env, "OPENAI_API_KEY");

  if (openRouterKey) {
    const headers: Record<string, string> = {
      "X-Title": read(env, "OPENROUTER_APP_NAME") || OPENROUTER_APP_TITLE,
    };
    const siteUrl = read(env, "OPENROUTER_SITE_URL") || read(env, "AUTH_URL");
    if (siteUrl) {
      headers["HTTP-Referer"] = siteUrl;
    }

    return {
      provider: "openrouter",
      apiKey: openRouterKey,
      model: read(env, "AI_MODEL") || OPENROUTER_DEFAULT_MODEL,
      baseUrl: (read(env, "AI_BASE_URL") || OPENROUTER_BASE_URL).replace(
        /\/$/,
        "",
      ),
      headers,
    };
  }

  if (openAiKey) {
    return {
      provider: "openai",
      apiKey: openAiKey,
      model: read(env, "AI_MODEL") || AI_DEFAULT_MODEL,
      baseUrl: (read(env, "AI_BASE_URL") || OPENAI_BASE_URL).replace(/\/$/, ""),
      headers: {},
    };
  }

  return null;
}

export function isAiConfigured(env: EnvInput = process.env): boolean {
  return getAiEnv(env) !== null;
}
