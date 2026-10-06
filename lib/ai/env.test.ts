import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OPENROUTER_BASE_URL,
  OPENROUTER_DEFAULT_MODEL,
} from "@/lib/ai/constants";
import { getAiEnv } from "@/lib/ai/env";
import { buildRequestBody } from "@/lib/ai/providers/openrouter";

describe("getAiEnv", () => {
  it("returns null when OPENROUTER_API_KEY is not configured", () => {
    assert.equal(getAiEnv({}), null);
    assert.equal(getAiEnv({ OPENROUTER_API_KEY: "  " }), null);
  });

  it("ignores other providers' keys", () => {
    assert.equal(getAiEnv({ OPENAI_API_KEY: "sk-openai" }), null);
  });

  it("uses OpenRouter defaults and attribution headers", () => {
    const env = getAiEnv({
      OPENROUTER_API_KEY: "sk-or-test",
      AUTH_URL: "https://cv.example.com",
    });

    assert.ok(env);
    assert.equal(env.apiKey, "sk-or-test");
    assert.equal(env.baseUrl, OPENROUTER_BASE_URL);
    assert.equal(env.model, OPENROUTER_DEFAULT_MODEL);
    assert.equal(env.headers["HTTP-Referer"], "https://cv.example.com");
    assert.ok(env.headers["X-Title"]);
  });

  it("honours AI_MODEL", () => {
    const env = getAiEnv({
      OPENROUTER_API_KEY: "sk-or-test",
      AI_MODEL: "anthropic/claude-3.5-haiku",
    });
    assert.equal(env?.model, "anthropic/claude-3.5-haiku");
  });
});

describe("buildRequestBody", () => {
  it("adds JSON mode, PDF attachments and the OCR plugin", () => {
    const env = getAiEnv({ OPENROUTER_API_KEY: "k" })!;
    const body = buildRequestBody(env, {
      systemPrompt: "s",
      userPrompt: "u",
      json: true,
      files: [{ filename: "cv.pdf", mimeType: "application/pdf", dataBase64: "QUJD" }],
    }) as Record<string, unknown>;

    assert.deepEqual(body.response_format, { type: "json_object" });
    assert.deepEqual(body.plugins, [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }]);
    const messages = body.messages as Array<{ content: unknown }>;
    assert.deepEqual(messages[1].content, [
      { type: "text", text: "u" },
      { type: "file", file: { filename: "cv.pdf", file_data: "data:application/pdf;base64,QUJD" } },
    ]);
  });

  it("sends plain text prompts without plugins", () => {
    const env = getAiEnv({ OPENROUTER_API_KEY: "k" })!;
    const body = buildRequestBody(env, { systemPrompt: "s", userPrompt: "u" }) as Record<string, unknown>;
    assert.equal(body.plugins, undefined);
    assert.equal(body.response_format, undefined);
    assert.equal((body.messages as Array<{ content: unknown }>)[1].content, "u");
  });
});
