import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeParsedResumeImport } from "@/lib/resume-import/parse-sanitize";
import { parsedResumeToBuilderState } from "@/lib/resume-import/map-parsed-to-builder";
import { validateImportReviewState } from "@/lib/resume-import/review-validation";
import { extractJsonObjectFromModelText } from "@/lib/resume-import/parse-json";
import { createResumeImportParseService } from "@/lib/resume-import/parse-service";
import { RESUME_IMPORT_ERROR_CODES } from "@/lib/resume-import/errors";
import { AiProviderError } from "@/lib/ai/provider";
import { RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES } from "@/lib/resume-import/parse-constants";

const validPayload = {
  personal: {
    fullName: "Alex Rivera",
    email: "alex@example.com",
  },
  summary: "Backend engineer with ten years of experience.",
  workExperience: [
    {
      jobTitle: "Engineer",
      company: "Acme",
      startDate: "2022",
      endDate: "Present",
      description: "Built APIs.",
    },
    {
      jobTitle: "Intern",
      company: "Startup",
      startDate: "Jan 2020",
      endDate: "2021",
      description: "Supported releases.",
    },
  ],
  education: [
    {
      degree: "BSc Computer Science",
      institution: "State University",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: ["TypeScript", "typescript", "Go"],
  projects: [],
  certifications: [],
  languages: [{ language: "English", proficiency: "Native" }],
};

describe("resume import parse sanitize", () => {
  it("preserves year-only dates", () => {
    const result = sanitizeParsedResumeImport({
      personal: { fullName: "Pat" },
      workExperience: [
        {
          jobTitle: "Dev",
          company: "Co",
          startDate: "2022",
          endDate: "2024",
        },
      ],
      skills: ["SQL"],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.workExperience[0]?.startDate, "2022");
      assert.equal(result.value.workExperience[0]?.endDate, "2024");
    }
  });

  it("accepts valid structured AI response", () => {
    const result = sanitizeParsedResumeImport(validPayload);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.personal.fullName, "Alex Rivera");
      assert.equal(result.value.workExperience.length, 2);
      assert.equal(result.value.workExperience[0]?.current, true);
      assert.equal(result.value.workExperience[0]?.endDate, "");
      assert.deepEqual(result.value.skills, ["TypeScript", "Go"]);
    }
  });

  it("rejects malformed root", () => {
    const result = sanitizeParsedResumeImport("not json");
    assert.equal(result.ok, false);
  });

  it("strips unexpected top-level keys without failing", () => {
    const result = sanitizeParsedResumeImport({
      ...validPayload,
      extraSection: { hack: true },
    });
    assert.equal(result.ok, true);
  });

  it("rejects prototype pollution keys on root", () => {
    const polluted = {
      personal: { fullName: "A" },
      skills: ["a"],
      prototype: "unexpected",
    };
    const result = sanitizeParsedResumeImport(polluted);
    assert.equal(result.ok, false);
  });

  it("allows missing optional fields", () => {
    const result = sanitizeParsedResumeImport({
      personal: { fullName: "Sam" },
      workExperience: [],
      education: [],
      skills: [],
    });
    assert.equal(result.ok, true);
  });

  it("caps excessively large work arrays", () => {
    const many = Array.from({ length: RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES + 5 }, (_, i) => ({
      jobTitle: `Role ${i}`,
      company: "Co",
    }));
    const result = sanitizeParsedResumeImport({
      personal: { fullName: "Worker" },
      workExperience: many,
      skills: ["a"],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(
        result.value.workExperience.length,
        RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES,
      );
    }
  });

  it("truncates excessively long fields", () => {
    const result = sanitizeParsedResumeImport({
      personal: { fullName: "x".repeat(5_000) },
      skills: ["y"],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.personal.fullName.length, 2_000);
    }
  });

  it("rejects empty parsed result", () => {
    const result = sanitizeParsedResumeImport({
      personal: {},
      summary: "",
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
    });
    assert.equal(result.ok, false);
  });

  it("maps review state to valid CV content", () => {
    const sanitized = sanitizeParsedResumeImport(validPayload);
    assert.equal(sanitized.ok, true);
    if (!sanitized.ok) {
      return;
    }

    const builder = parsedResumeToBuilderState(sanitized.value);
    const validation = validateImportReviewState(builder);
    assert.equal(validation.ok, true);
  });
});

describe("resume import parse json", () => {
  it("parses JSON wrapped in markdown fences", () => {
    const raw = 'Here you go:\n```json\n{"personal":{"fullName":"A"},"skills":["b"]}\n```';
    const value = extractJsonObjectFromModelText(raw) as Record<string, unknown>;
    assert.equal((value.personal as { fullName: string }).fullName, "A");
  });

  it("throws on malformed JSON", () => {
    assert.throws(() => extractJsonObjectFromModelText("not json at all"));
  });
});

describe("resume import parse service", () => {
  it("rejects too-short extracted text", async () => {
    const service = createResumeImportParseService({
      getProvider: () => ({
        complete: async () => JSON.stringify(validPayload),
      }),
    });

    const result = await service.parseExtractedText("short");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.TEXT_TOO_SHORT);
    }
  });

  it("returns AI not configured when provider missing", async () => {
    const service = createResumeImportParseService({
      getProvider: () => null,
    });

    const result = await service.parseExtractedText("a".repeat(80));
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.AI_NOT_CONFIGURED);
    }
  });

  it("handles provider failure safely", async () => {
    const service = createResumeImportParseService({
      getProvider: () => ({
        complete: async () => {
          throw new AiProviderError("secret provider detail");
        },
      }),
    });

    const result = await service.parseExtractedText("a".repeat(80));
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.AI_UNAVAILABLE);
      assert.doesNotMatch(result.error.message, /secret/i);
    }
  });

  it("handles malformed model JSON", async () => {
    const service = createResumeImportParseService({
      getProvider: () => ({
        complete: async () => "Thanks for uploading!",
      }),
    });

    const result = await service.parseExtractedText("a".repeat(80));
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.MALFORMED_PARSE);
    }
  });

  it("returns builder state without persisting a CV", async () => {
    const service = createResumeImportParseService({
      getProvider: () => ({
        complete: async () => JSON.stringify(validPayload),
      }),
    });

    const result = await service.parseExtractedText("a".repeat(80));
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.personal.fullName, "Alex Rivera");
      assert.ok(result.data.workExperience.every((entry) => entry.id.length > 0));
    }
  });
});
