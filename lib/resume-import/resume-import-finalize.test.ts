import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CV_ERROR_CODES } from "@/lib/cv/errors";
import { cvError } from "@/lib/cv/errors";
import { createEmptyCvContent } from "@/lib/cv/validation";
import type { CVContent } from "@/types/cv";
import {
  defaultImportResumeTitle,
  resolveImportResumeTitle,
} from "@/lib/resume-import/import-title";
import {
  prepareImportForCreate,
  sanitizeImportReviewState,
} from "@/lib/resume-import/finalize-import";
import { createResumeImportFinalizeService } from "@/lib/resume-import/finalize-service";
import { RESUME_IMPORT_ERROR_CODES } from "@/lib/resume-import/errors";
import { parsedResumeToBuilderState } from "@/lib/resume-import/map-parsed-to-builder";
import type { SanitizedResumeImportParse } from "@/lib/resume-import/parse-sanitize";

const CV_ID = "507f1f77bcf86cd799439011";

function sampleParsed(): SanitizedResumeImportParse {
  return {
    personal: {
      fullName: "John Smith",
      professionalTitle: "Engineer",
      email: "john@example.com",
      phone: "+1 555 0100",
      location: "Boston",
      website: "https://example.com",
      linkedIn: "https://linkedin.com/in/john",
    },
    summary: "Experienced engineer.",
    workExperience: [
      {
        jobTitle: "Senior Engineer",
        company: "Acme",
        location: "Boston",
        startDate: "2020",
        endDate: "Present",
        current: true,
        description: "Built services.",
      },
      {
        jobTitle: "Engineer",
        company: "Beta",
        location: "Remote",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Maintained APIs.",
      },
    ],
    education: [
      {
        degree: "BSc",
        institution: "State U",
        location: "MA",
        startDate: "2014",
        endDate: "2018",
        description: "",
      },
    ],
    skills: ["TypeScript", "Node.js"],
    projects: [{ name: "Side project", description: "Demo app", url: "https://demo.test" }],
    certifications: [
      { name: "AWS Certified", issuer: "Amazon", date: "2021", url: "" },
    ],
    languages: [{ language: "English", proficiency: "Native" }],
  };
}

function reviewFromParsed(): ReturnType<typeof parsedResumeToBuilderState> {
  return parsedResumeToBuilderState(sampleParsed());
}

describe("import resume title", () => {
  it("defaults to full name plus Resume", () => {
    assert.equal(defaultImportResumeTitle("John Smith"), "John Smith Resume");
  });

  it("falls back to Imported Resume", () => {
    assert.equal(defaultImportResumeTitle(""), "Imported Resume");
    assert.equal(resolveImportResumeTitle("", ""), "Imported Resume");
  });

  it("uses custom edited title", () => {
    assert.equal(resolveImportResumeTitle("My CV", "John Smith"), "My CV");
  });
});

describe("import finalize mapping", () => {
  it("creates valid CV create input from reviewed import", () => {
    const prepared = sanitizeImportReviewState(reviewFromParsed());
    assert.equal(prepared.ok, true);
    if (!prepared.ok) {
      return;
    }

    assert.equal(prepared.value.title, "John Smith Resume");
    assert.equal(prepared.value.template, "default");
    assert.equal(prepared.value.content.summary, "Experienced engineer.");
    assert.equal(
      (prepared.value.content.personal as { email: string }).email,
      "john@example.com",
    );
    assert.equal(prepared.value.content.workExperience?.length, 2);
    assert.equal(prepared.value.content.education?.length, 1);
    assert.equal(prepared.value.content.skills?.length, 2);
    assert.equal(prepared.value.content.projects?.length, 1);
    assert.equal(prepared.value.content.certifications?.length, 1);
    assert.equal(prepared.value.content.languages?.length, 1);
  });

  it("rejects client userId in review payload", () => {
    const review = {
      ...reviewFromParsed(),
      userId: "bbbbbbbbbbbbbbbbbbbbbbbb",
    };
    const prepared = sanitizeImportReviewState(review);
    assert.equal(prepared.ok, false);
  });

  it("rejects prototype pollution keys", () => {
    const review = {
      ...reviewFromParsed(),
      prototype: "bad",
    };
    const prepared = sanitizeImportReviewState(review);
    assert.equal(prepared.ok, false);
  });

  it("rejects oversized title", () => {
    const review = {
      ...reviewFromParsed(),
      title: "x".repeat(500),
    };
    const prepared = sanitizeImportReviewState(review);
    assert.equal(prepared.ok, false);
  });

  it("defaults unknown template to default", () => {
    const review = {
      ...reviewFromParsed(),
      template: "unknown-template",
    };
    const prepared = sanitizeImportReviewState(review);
    assert.equal(prepared.ok, true);
    if (prepared.ok) {
      assert.equal(prepared.value.template, "default");
    }
  });
});

describe("import finalize service", () => {
  it("requires auth through CV service", async () => {
    const service = createResumeImportFinalizeService({
      createCv: async () =>
        cvError(CV_ERROR_CODES.UNAUTHENTICATED, "You must be signed in to manage CVs."),
    });

    const result = await service.createFromReview(reviewFromParsed());
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.CREATE_FAILED);
    }
  });

  it("rejects client userId before create", async () => {
    let createCalled = false;
    const service = createResumeImportFinalizeService({
      createCv: async () => {
        createCalled = true;
        return {
          success: true,
          data: {
            id: CV_ID,
            title: "T",
            template: "default",
            content: createEmptyCvContent(),
            createdAt: "",
            updatedAt: "",
          },
        };
      },
    });

    const result = await service.createFromReview({
      ...reviewFromParsed(),
      userId: "evil",
    });
    assert.equal(result.success, false);
    assert.equal(createCalled, false);
  });

  it("does not persist raw extracted text in create payload", async () => {
    const service = createResumeImportFinalizeService({
      createCv: async (input) => {
        const content = (input.content ?? {}) as Record<string, unknown>;
        assert.equal("extractedText" in content, false);
        assert.equal("rawFile" in content, false);
        return {
          success: true,
          data: {
            id: CV_ID,
            title: "T",
            template: "default",
            content: createEmptyCvContent(),
            createdAt: "",
            updatedAt: "",
          },
        };
      },
    });

    const result = await service.createFromReview({
      ...reviewFromParsed(),
      extractedText: "secret resume body",
    });
    assert.equal(result.success, false);
  });

  it("returns safe error when CV creation fails", async () => {
    const service = createResumeImportFinalizeService({
      createCv: async () =>
        cvError(CV_ERROR_CODES.DATABASE_ERROR, "mongo exploded"),
    });

    const result = await service.createFromReview(reviewFromParsed());
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.CREATE_FAILED);
      assert.doesNotMatch(result.error.message, /mongo/i);
    }
  });

  it("returns new CV ID on success", async () => {
    const service = createResumeImportFinalizeService({
      createCv: async () => ({
        success: true,
        data: {
          id: CV_ID,
          title: "John Smith Resume",
          template: "default",
          content: createEmptyCvContent(),
          createdAt: "",
          updatedAt: "",
        },
      }),
    });

    const result = await service.createFromReview(reviewFromParsed());
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.cvId, CV_ID);
    }
  });

  it("persists mapped personal and summary fields", async () => {
    let savedContent: CVContent | undefined;
    const service = createResumeImportFinalizeService({
      createCv: async (input) => {
        savedContent = input.content as CVContent;
        return {
          success: true,
          data: {
            id: CV_ID,
            title: "John Smith Resume",
            template: "default",
            content: (input.content as CVContent) ?? createEmptyCvContent(),
            createdAt: "",
            updatedAt: "",
          },
        };
      },
    });

    const result = await service.createFromReview(reviewFromParsed());
    assert.equal(result.success, true);
    assert.ok(savedContent);
    const personal = savedContent.personal as { fullName: string };
    assert.equal(personal.fullName, "John Smith");
    assert.equal(savedContent.summary, "Experienced engineer.");
    assert.equal(savedContent.workExperience?.length, 2);
  });
});

describe("prepareImportForCreate", () => {
  it("uses default template when omitted", () => {
    const state = reviewFromParsed();
    delete (state as { template?: string }).template;
    const prepared = prepareImportForCreate(state);
    assert.equal(prepared.ok, true);
    if (prepared.ok) {
      assert.equal(prepared.value.template, "default");
    }
  });
});
