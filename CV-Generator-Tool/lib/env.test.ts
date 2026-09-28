import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertProductionEnvReady,
  auditRuntimeEnv,
} from "@/lib/env";

const productionBase: Record<string, string> = {
  NODE_ENV: "production",
  MONGODB_URI: "mongodb://localhost:27017",
  MONGODB_DB_NAME: "cv-generator",
  AUTH_SECRET: "x".repeat(32),
  AUTH_URL: "https://example.vercel.app",
};

describe("auditRuntimeEnv", () => {
  it("flags missing production auth secret as an error", () => {
    const issues = auditRuntimeEnv(
      {
        ...productionBase,
        AUTH_SECRET: "",
      },
      "production",
    );

    assert.ok(
      issues.some(
        (issue) =>
          issue.variable === "AUTH_SECRET" && issue.level === "error",
      ),
    );
  });

  it("requires paired Google OAuth variables", () => {
    const issues = auditRuntimeEnv(
      {
        ...productionBase,
        AUTH_GOOGLE_ID: "google-client-id",
        AUTH_GOOGLE_SECRET: "",
      },
      "production",
    );

    assert.ok(
      issues.some(
        (issue) =>
          issue.variable === "AUTH_GOOGLE_ID" && issue.level === "error",
      ),
    );
  });

  it("treats OpenAI as optional with a warning", () => {
    const issues = auditRuntimeEnv(
      {
        ...productionBase,
        OPENAI_API_KEY: "",
      },
      "production",
    );

    assert.ok(
      issues.some(
        (issue) =>
          issue.variable === "OPENAI_API_KEY" && issue.level === "warning",
      ),
    );
  });

  it("does not require AUTH_SECRET errors in development", () => {
    const issues = auditRuntimeEnv(
      {
        NODE_ENV: "development",
        MONGODB_URI: "mongodb://localhost:27017",
        MONGODB_DB_NAME: "cv-generator",
      },
      "development",
    );

    assert.ok(
      !issues.some(
        (issue) =>
          issue.variable === "AUTH_SECRET" && issue.level === "error",
      ),
    );
  });
});

describe("assertProductionEnvReady", () => {
  it("throws when production env has blocking errors", () => {
    assert.throws(
      () =>
        assertProductionEnvReady(
          {
            NODE_ENV: "production",
            MONGODB_URI: "",
            MONGODB_DB_NAME: "",
          },
          "production",
        ),
      /Production environment misconfigured/,
    );
  });

  it("passes when production env is complete", () => {
    assert.doesNotThrow(() =>
      assertProductionEnvReady(productionBase, "production"),
    );
  });
});
