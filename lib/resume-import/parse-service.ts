import {
  AiProviderError,
  type AiCompletionRequest,
  type AiProvider,
} from "@/lib/ai/provider";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";
import { RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH } from "@/lib/resume-import/parse-constants";
import { aiFailureMessage } from "@/lib/ai/errors";
import { extractJsonObjectFromModelText } from "@/lib/resume-import/parse-json";
import {
  buildResumeDescriptionUserPrompt,
  buildResumeImportFileParseUserPrompt,
  RESUME_DESCRIPTION_SYSTEM_PROMPT,
  buildResumeImportParseUserPrompt,
  RESUME_IMPORT_PARSE_SYSTEM_PROMPT,
} from "@/lib/resume-import/parse-prompts";
import { sanitizeParsedResumeImport } from "@/lib/resume-import/parse-sanitize";
import { parsedResumeToBuilderState } from "@/lib/resume-import/map-parsed-to-builder";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { Locale } from "@/lib/i18n/preferences";
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

const PARSE_REQUEST_BASE = {
  systemPrompt: RESUME_IMPORT_PARSE_SYSTEM_PROMPT,
  temperature: 0.1,
  json: true,
} as const;

export function createResumeImportParseService(deps: ResumeImportParseDeps) {
  async function parseExtractedText(
    extractedText: string,
    fallbackLocale?: Locale,
  ): Promise<ResumeImportResult<CvBuilderFormState>> {
    const text = extractedText.trim();
    if (text.length < RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH) {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.TEXT_TOO_SHORT,
        RESUME_IMPORT_ERROR_MESSAGES.TEXT_TOO_SHORT,
      );
    }

    return runParse(
      { ...PARSE_REQUEST_BASE, userPrompt: buildResumeImportParseUserPrompt(text) },
      fallbackLocale,
    );
  }

  /** Builds a CV from the person's own typed or dictated description. */
  async function parseDescription(
    description: string,
    fallbackLocale?: Locale,
  ): Promise<ResumeImportResult<CvBuilderFormState>> {
    const text = description.trim();
    if (text.length < RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH) {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.DESCRIPTION_TOO_SHORT,
        RESUME_IMPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT,
      );
    }

    return runParse(
      {
        ...PARSE_REQUEST_BASE,
        systemPrompt: RESUME_DESCRIPTION_SYSTEM_PROMPT,
        userPrompt: buildResumeDescriptionUserPrompt(text),
        // A little more freedom to phrase things well; facts stay grounded.
        temperature: 0.3,
      },
      fallbackLocale,
    );
  }

  /** For PDFs without a text layer: the model (with OCR) reads the file itself. */
  async function parsePdfFile(input: {
    filename: string;
    buffer: Buffer;
    fallbackLocale?: Locale;
  }): Promise<ResumeImportResult<CvBuilderFormState>> {
    return runParse(
      {
      ...PARSE_REQUEST_BASE,
      userPrompt: buildResumeImportFileParseUserPrompt(),
      files: [
        {
          filename: input.filename,
          mimeType: "application/pdf",
          dataBase64: input.buffer.toString("base64"),
        },
      ],
      },
      input.fallbackLocale,
    );
  }

  async function runParse(
    request: AiCompletionRequest,
    fallbackLocale?: Locale,
  ): Promise<ResumeImportResult<CvBuilderFormState>> {
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
        provider.complete(request),
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
          aiFailureMessage(error, RESUME_IMPORT_ERROR_MESSAGES.AI_UNAVAILABLE),
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

    return {
      success: true,
      data: parsedResumeToBuilderState(sanitized.value, fallbackLocale),
    };
  }

  return { parseExtractedText, parseDescription, parsePdfFile };
}
