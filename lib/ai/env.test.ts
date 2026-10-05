import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OPENROUTER_BASE_URL,
  OPENROUTER_DEFAULT_MODEL,
} from "@/lib/ai/constants";
import { getAiEnv } from "@/lib/ai/env";

describe("getAiEnv", () => {
  it("returns null when no API key is configured", () => {
    assert.equal(getAiEnv({}), null);
    assert.equal(getAiEnv({ OPENROUTER_API_KEY: "  " }), null);
  });

  it("uses OpenRouter defaults when OPENROUTER_API_KEY is set", () => {
    const env = getAiEnv({
      OPENROUTER_API_KEY: "sk-or-test",
      AUTH_URL: "https://cv.example.com",
    });

    assert.ok(env);
    assert.equal(env.provider, "openrouter");
    assert.equal(env.apiKey, "sk-or-test");
    assert.equal(env.baseUrl, OPENROUTER_BASE_URL);
    assert.equal(env.model, OPENROUTER_DEFAULT_MODEL);
    assert.equal(env.headers["HTTP-Referer"], "https://cv.example.com");
    assert.ok(env.headers["X-Title"]);
  });

  it("prefers OpenRouter over OpenAI and honours AI_MODEL", () => {
    const env = getAiEnv({
      OPENROUTER_API_KEY: "sk-or-test",
      OPENAI_API_KEY: "sk-openai",
      AI_MODEL: "anthropic/claude-3.5-haiku",
    });

    assert.ok(env);
    assert.equal(env.provider, "openrouter");
    assert.equal(env.model, "anthropic/claude-3.5-haiku");
  });

  it("falls back to OpenAI when only OPENAI_API_KEY is set", () => {
    const env = getAiEnv({
      OPENAI_API_KEY: "sk-openai",
      AI_BASE_URL: "https://api.openai.com/v1/",
    });

    assert.ok(env);
    assert.equal(env.provider, "openai");
    assert.equal(env.baseUrl, "https://api.openai.com/v1");
    assert.deepEqual(env.headers, {});
  });
});
