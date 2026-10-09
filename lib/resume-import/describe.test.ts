import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AiCompletionRequest } from "@/lib/ai/provider";
import { RESUME_IMPORT_ERROR_CODES } from "@/lib/resume-import/errors";
import { RESUME_DESCRIPTION_SYSTEM_PROMPT } from "@/lib/resume-import/parse-prompts";
import { createResumeImportParseService } from "@/lib/resume-import/parse-service";

const SPOKEN =
  "my name is sara khan i am a front end developer in lahore since 2021 i work at acme building react apps " +
  "before that i was a junior developer at beta i studied computer science at fast i speak english and urdu";

describe("create CV from a description", () => {
  it("sends the description with the CV-writing prompt and maps the result", async () => {
    let request: AiCompletionRequest | null = null;
    const service = createResumeImportParseService({
      getProvider: () => ({
        async complete(req) {
          request = req;
          return JSON.stringify({
            documentLanguage: "en",
            personal: { fullName: "Sara Khan", professionalTitle: "Frontend Developer", location: "Lahore" },
            summary: "Frontend developer building React applications.",
            workExperience: [
              { jobTitle: "Frontend Developer", company: "Acme", startDate: "2021", current: true, description: "- Build React apps" },
              { jobTitle: "Junior Developer", company: "Beta" },
            ],
            education: [{ degree: "Computer Science", institution: "FAST" }],
            skills: ["React"],
            languages: [{ language: "English" }, { language: "Urdu" }],
            customSections: [],
            sectionOrder: ["summary", "workExperience", "education", "skills", "languages"],
          });
        },
      }),
    });

    const result = await service.parseDescription(SPOKEN, "de");
    assert.equal(result.success, true);
    assert.ok(request);
    const sent = request as AiCompletionRequest;
    assert.equal(sent.systemPrompt, RESUME_DESCRIPTION_SYSTEM_PROMPT);
    assert.match(sent.userPrompt, /sara khan/);
    assert.equal(sent.json, true);
    if (result.success) {
      assert.equal(result.data.personal.fullName, "Sara Khan");
      assert.equal(result.data.workExperience.length, 2);
      assert.equal(result.data.workExperience[0].current, true);
      assert.deepEqual(result.data.languages.map((l) => l.language), ["English", "Urdu"]);
      // The detected language wins over the UI-language fallback.
      assert.equal(result.data.documentLocale, "en");
    }
  });

  it("asks for more detail when the description is too short", async () => {
    const service = createResumeImportParseService({
      getProvider: () => ({ complete: async () => "{}" }),
    });
    const result = await service.parseDescription("I am Sara.");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.DESCRIPTION_TOO_SHORT);
    }
  });
});
