import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { getAiEnv } from "@/lib/ai/env";
import { aiFailureMessage, AI_FAILURE_MESSAGES } from "@/lib/ai/errors";
import { AiProviderError } from "@/lib/ai/provider";
import {
  classifyOpenRouterFailure,
  createOpenRouterProvider,
} from "@/lib/ai/providers/openrouter";
import { createResumeImportParseService } from "@/lib/resume-import/parse-service";

const realFetch = globalThis.fetch;
const env = getAiEnv({ OPENROUTER_API_KEY: "sk-or-test" })!;

type Reply = { status: number; body: unknown };

/** Replays canned OpenRouter replies and records each request body. */
function mockFetch(replies: Reply[]) {
  const bodies: Array<Record<string, unknown>> = [];
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    const reply = replies.shift() ?? { status: 500, body: {} };
    return new Response(JSON.stringify(reply.body), { status: reply.status });
  }) as typeof fetch;
  return bodies;
}

const ok = (content: string): Reply => ({
  status: 200,
  body: { choices: [{ message: { content } }] },
});
const fail = (status: number, message: string): Reply => ({
  status,
  body: { error: { code: status, message } },
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

async function failureOf(promise: Promise<unknown>): Promise<AiProviderError> {
  try {
    await promise;
  } catch (error) {
    assert.ok(error instanceof AiProviderError);
    return error;
  }
  throw new Error("expected failure");
}

describe("OpenRouter provider", () => {
  it("classifies OpenRouter status codes", () => {
    assert.equal(classifyOpenRouterFailure(401, "No auth credentials found"), "auth");
    assert.equal(classifyOpenRouterFailure(402, "Insufficient credits"), "credits");
    assert.equal(classifyOpenRouterFailure(400, "foo/bar is not a valid model ID"), "model");
    assert.equal(classifyOpenRouterFailure(429, "Rate limit exceeded"), "rate_limit");
    assert.equal(classifyOpenRouterFailure(502, "Provider returned error"), "unavailable");
  });

  it("reports an out-of-credits account instead of a generic error", async () => {
    mockFetch([fail(402, "This request requires more credits, or fewer max_tokens.")]);
    const error = await failureOf(
      createOpenRouterProvider(env).complete({ systemPrompt: "s", userPrompt: "u" }),
    );
    assert.equal(error.kind, "credits");
    assert.equal(aiFailureMessage(error, "fallback"), AI_FAILURE_MESSAGES.credits);
  });

  it("detects errors OpenRouter returns with HTTP 200", async () => {
    mockFetch([{ status: 200, body: { error: { code: 401, message: "User not found." } } }]);
    const error = await failureOf(
      createOpenRouterProvider(env).complete({ systemPrompt: "s", userPrompt: "u" }),
    );
    assert.equal(error.kind, "auth");
  });

  it("retries without JSON mode when the model doesn't support it", async () => {
    const bodies = mockFetch([
      fail(404, "No endpoints found that support the requested parameter: response_format"),
      ok('{"ok":true}'),
    ]);
    const text = await createOpenRouterProvider(env).complete({
      systemPrompt: "s",
      userPrompt: "u",
      json: true,
    });
    assert.equal(text, '{"ok":true}');
    assert.deepEqual(bodies[0].response_format, { type: "json_object" });
    assert.equal(bodies[1].response_format, undefined);
  });

  it("retries once after a temporary outage", async () => {
    const bodies = mockFetch([fail(503, "Service unavailable"), ok("hello")]);
    const text = await createOpenRouterProvider(env).complete({ systemPrompt: "s", userPrompt: "u" });
    assert.equal(text, "hello");
    assert.equal(bodies.length, 2);
  });

  it("does not retry a rejected key", async () => {
    const bodies = mockFetch([fail(401, "Invalid key"), ok("never")]);
    await failureOf(createOpenRouterProvider(env).complete({ systemPrompt: "s", userPrompt: "u" }));
    assert.equal(bodies.length, 1);
  });

  it("resume import shows the specific reason and requests no max_tokens", async () => {
    const bodies = mockFetch([fail(402, "Insufficient credits")]);
    const service = createResumeImportParseService({
      getProvider: () => createOpenRouterProvider(env),
    });
    const result = await service.parseExtractedText(
      "Jane Doe\\nSenior Engineer at Acme 2020-2024\\nSkills: TypeScript, React",
    );
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.message, AI_FAILURE_MESSAGES.credits);
    }
    assert.equal(bodies[0].max_tokens, undefined);
  });
});
