import { AiProviderError, type AiProvider } from "@/lib/ai/provider";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";
import { RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH } from "@/lib/resume-import/parse-constants";
import { extractJsonObjectFromModelText } from "@/lib/resume-import/parse-json";
import {
  buildResumeImportParseUserPrompt,
  RESUME_IMPORT_PARSE_SYSTEM_PROMPT,
} from "@/lib/resume-import/parse-prompts";
import { sanitizeParsedResumeImport } from "@/lib/resume-import/parse-sanitize";
import { parsedResumeToBuilderState } from "@/lib/resume-import/map-parsed-to-builder";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { RESUME_IMPORT_PARSE_TIMEOUT_MS } from "@/lib/resume-import/parse-constants";

export type ResumeImportParseDeps = {
  getProvider: () => AiProvider | null;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function createResumeImportParseService(deps: ResumeImportParseDeps) {
  async function parseExtractedText(
    extractedText: string,
  ): Promise<ResumeImportResult<CvBuilderFormState>> {
    const text = extractedText.trim();
    if (text.length < RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH) {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.TEXT_TOO_SHORT,
        RESUME_IMPORT_ERROR_MESSAGES.TEXT_TOO_SHORT,
      );
    }

    const provider = deps.getProvider();
    if (!provider) {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.AI_NOT_CONFIGURED,
        RESUME_IMPORT_ERROR_MESSAGES.AI_NOT_CONFIGURED,
      );
    }

    let rawResponse: string;
    try {
      rawResponse = await withTimeout(
        provider.complete({
          systemPrompt: RESUME_IMPORT_PARSE_SYSTEM_PROMPT,
          userPrompt: buildResumeImportParseUserPrompt(text),
          temperature: 0.1,
        }),
        RESUME_IMPORT_PARSE_TIMEOUT_MS,
      );
    } catch (error) {
      if (error instanceof Error && error.message === "timeout") {
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.PARSING_TIMEOUT,
          RESUME_IMPORT_ERROR_MESSAGES.PARSING_TIMEOUT,
        );
      }

      if (error instanceof AiProviderError) {
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.AI_UNAVAILABLE,
          RESUME_IMPORT_ERROR_MESSAGES.AI_UNAVAILABLE,
        );
      }

      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.PARSING_FAILED,
        RESUME_IMPORT_ERROR_MESSAGES.PARSING_FAILED,
      );
    }

    let json: unknown;
    try {
      json = extractJsonObjectFromModelText(rawResponse);
    } catch {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.MALFORMED_PARSE,
        RESUME_IMPORT_ERROR_MESSAGES.MALFORMED_PARSE,
      );
    }

    const sanitized = sanitizeParsedResumeImport(json);
    if (!sanitized.ok) {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.EMPTY_PARSE_RESULT,
        sanitized.message,
      );
    }

    return { success: true, data: parsedResumeToBuilderState(sanitized.value) };
  }

  return { parseExtractedText };
}
