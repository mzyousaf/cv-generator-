import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAiActions } from "@/lib/ai/create-actions";
import { AI_ERROR_CODES } from "@/lib/ai/errors";
import { AiProviderError, type AiProvider } from "@/lib/ai/provider";
import { createAiService } from "@/lib/ai/service";
import {
  sanitizeExperienceOutput,
  sanitizeSuggestedSkills,
  sanitizeSummaryOutput,
  validateSkillsSuggestionInput,
  validateSummaryGenerationInput,
  validateWorkExperienceImproveInput,
} from "@/lib/ai/validation";

function createMockProvider(response: string | Error): AiProvider {
  return {
    async complete() {
      if (response instanceof Error) {
        throw response;
      }

      return response;
    },
  };
}

describe("AI validation", () => {
  it("rejects empty summary generation input", () => {
    const result = validateSummaryGenerationInput({});
    assert.equal(result.ok, false);
  });

  it("accepts summary improvement input via current summary", () => {
    const result = validateSummaryGenerationInput({
      currentSummary: "Existing summary text.",
    });
    assert.equal(result.ok, true);
  });

  it("requires description for work experience improvement", () => {
    const result = validateWorkExperienceImproveInput({
      jobTitle: "Engineer",
      company: "Acme",
      description: "",
    });
    assert.equal(result.ok, false);
  });

  it("validates skills suggestion input", () => {
    const result = validateSkillsSuggestionInput({
      roleTitle: "Product Manager",
      existingSkills: ["Roadmapping"],
    });
    assert.equal(result.ok, true);
  });
});

describe("AI output sanitization", () => {
  it("sanitizes summary and experience output", () => {
    const dirty = "Professional summary\u0007 with control chars";
    assert.equal(
      sanitizeSummaryOutput(dirty),
      "Professional summary with control chars",
    );
    assert.equal(
      sanitizeExperienceOutput(dirty),
      "Professional summary with control chars",
    );
  });

  it("parses and sanitizes suggested skills", () => {
    const skills = sanitizeSuggestedSkills(
      '["TypeScript", "TypeScript", "MongoDB", ""]',
    );
    assert.deepEqual(skills, ["TypeScript", "MongoDB"]);
  });
});

describe("AI service", () => {
  it("generates a summary using the provider", async () => {
    const service = createAiService({
      getProvider: () =>
        createMockProvider("Experienced product manager focused on outcomes."),
    });

    const result = await service.generateSummary({
      roleTitle: "Product Manager",
      skillsNotes: "Roadmapping, stakeholder management",
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.match(result.data, /product manager/i);
    }
  });

  it("improves work experience descriptions", async () => {
    const service = createAiService({
      getProvider: () =>
        createMockProvider(
          "Led delivery of roadmap initiatives with cross-functional teams.",
        ),
    });

    const result = await service.improveWorkExperience({
      jobTitle: "Product Manager",
      company: "Northwind",
      description: "Worked on roadmap and delivery.",
    });

    assert.equal(result.success, true);
  });

  it("suggests skills and excludes existing ones", async () => {
    const service = createAiService({
      getProvider: () =>
        createMockProvider('["Stakeholder Management", "SQL", "SQL"]'),
    });

    const result = await service.suggestSkills({
      roleTitle: "Data Analyst",
      existingSkills: ["SQL"],
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data, ["Stakeholder Management"]);
    }
  });

  it("handles provider failures gracefully", async () => {
    const service = createAiService({
      getProvider: () =>
        createMockProvider(new AiProviderError("Provider unavailable")),
    });

    const result = await service.generateSummary({
      roleTitle: "Engineer",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, AI_ERROR_CODES.PROVIDER);
    }
  });

  it("returns configuration error when provider is unavailable", async () => {
    const service = createAiService({
      getProvider: () => null,
    });

    const result = await service.suggestSkills({
      roleTitle: "Designer",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, AI_ERROR_CODES.CONFIGURATION);
    }
  });
});

describe("AI actions", () => {
  it("requires authentication", async () => {
    const actions = createAiActions({
      getUser: async () => null,
      service: createAiService({
        getProvider: () => createMockProvider("Should not be called"),
      }),
    });

    const summary = await actions.generateSummaryAction({
      roleTitle: "Engineer",
    });
    const experience = await actions.improveWorkExperienceAction({
      description: "Built features.",
    });
    const skills = await actions.suggestSkillsAction({
      roleTitle: "Engineer",
    });

    for (const result of [summary, experience, skills]) {
      assert.equal(result.success, false);
      if (!result.success) {
        assert.equal(result.error.code, AI_ERROR_CODES.UNAUTHENTICATED);
      }
    }
  });

  it("runs summary generation for authenticated users", async () => {
    const actions = createAiActions({
      getUser: async () => ({
        id: "user-1",
        email: "user@example.com",
        name: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      service: createAiService({
        getProvider: () => createMockProvider("Concise professional summary."),
      }),
    });

    const result = await actions.generateSummaryAction({
      roleTitle: "Engineer",
      skillsNotes: "TypeScript",
    });

    assert.equal(result.success, true);
  });
});
