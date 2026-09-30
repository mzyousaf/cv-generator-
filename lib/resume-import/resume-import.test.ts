import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RESUME_IMPORT_MAX_FILE_BYTES } from "@/lib/resume-import/constants";
import {
  RESUME_IMPORT_ERROR_CODES,
} from "@/lib/resume-import/errors";
import { normalizeExtractedResumeText } from "@/lib/resume-import/normalize-text";
import { createResumeImportService } from "@/lib/resume-import/service";
import {
  detectResumeFileKind,
  validateResumeFileClient,
  validateResumeUploadInput,
} from "@/lib/resume-import/validation";
import { resumeImportAuthError } from "@/lib/resume-import/auth-guard";

const minimalPdf = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n",
);

function fakeDocxBuffer(): Buffer {
  const header = Buffer.from("PK\x03\x04");
  const body = Buffer.from("word/document.xml sample docx content");
  return Buffer.concat([header, body]);
}

describe("resume import validation", () => {
  it("accepts valid PDF magic bytes", () => {
    const result = validateResumeUploadInput(minimalPdf, "resume.pdf");
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.kind, "pdf");
    }
  });

  it("accepts valid DOCX structure", () => {
    const buffer = fakeDocxBuffer();
    const result = validateResumeUploadInput(buffer, "resume.docx");
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.kind, "docx");
    }
  });

  it("rejects unsupported extension", () => {
    const result = validateResumeUploadInput(minimalPdf, "resume.txt");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT);
    }
  });

  it("rejects legacy .doc", () => {
    const ole = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0, 0, 0, 0]);
    const result = validateResumeUploadInput(ole, "resume.doc");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT);
    }
  });

  it("rejects file over 5 MB", () => {
    const large = Buffer.alloc(RESUME_IMPORT_MAX_FILE_BYTES + 1, 0x20);
    large.write("%PDF", 0);
    const result = validateResumeUploadInput(large, "big.pdf");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.FILE_TOO_LARGE);
    }
  });

  it("rejects empty file", () => {
    const result = validateResumeUploadInput(Buffer.alloc(0), "empty.pdf");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.EMPTY_FILE);
    }
  });

  it("rejects mismatched extension and content", () => {
    const result = validateResumeUploadInput(minimalPdf, "resume.docx");
    assert.equal(result.success, false);
  });

  it("rejects unsupported client file extension", () => {
    const file = new File([minimalPdf], "resume.exe", { type: "application/octet-stream" });
    assert.equal(validateResumeFileClient(file), "Upload a PDF or DOCX file (.doc is not supported).");
  });

  it("detects format from magic bytes", () => {
    assert.equal(detectResumeFileKind(minimalPdf), "pdf");
    assert.equal(detectResumeFileKind(fakeDocxBuffer()), "docx");
    assert.equal(detectResumeFileKind(Buffer.from("hello")), null);
  });
});

describe("resume import text normalization", () => {
  it("normalizes line endings and blank lines", () => {
    const input = "Line one\r\n\r\n\r\n\r\nLine two\u0000";
    const out = normalizeExtractedResumeText(input);
    assert.equal(out, "Line one\n\nLine two");
  });

  it("truncates very long extracted text", () => {
    const out = normalizeExtractedResumeText("a".repeat(200_000));
    assert.equal(out.length, 150_000);
  });
});

describe("resume import service", () => {
  it("returns empty extraction error for PDF with no text", async () => {
    const service = createResumeImportService({
      extractPdf: async () => "   \n  ",
      extractDocx: async () => "docx",
    });

    const result = await service.processUpload({
      buffer: minimalPdf,
      filename: "resume.pdf",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.NO_READABLE_TEXT);
    }
  });

  it("returns safe message on parser failure", async () => {
    const service = createResumeImportService({
      extractPdf: async () => {
        throw new Error("parser exploded");
      },
      extractDocx: async () => "ok",
    });

    const result = await service.processUpload({
      buffer: minimalPdf,
      filename: "resume.pdf",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.EXTRACTION_FAILED);
      assert.doesNotMatch(result.error.message, /parser/i);
    }
  });

  it("returns extracted text on success", async () => {
    const service = createResumeImportService({
      extractPdf: async () => "Experience\nSoftware Engineer",
      extractDocx: async () => "",
    });

    const result = await service.processUpload({
      buffer: minimalPdf,
      filename: "resume.pdf",
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.characterCount, result.data.extractedText.length);
      assert.match(result.data.extractedText, /Software Engineer/);
    }
  });

  it("rejects malformed file before extraction", async () => {
    const service = createResumeImportService({
      extractPdf: async () => {
        throw new Error("should not run");
      },
      extractDocx: async () => "",
    });

    const result = await service.processUpload({
      buffer: Buffer.from("not-a-document"),
      filename: "bad.pdf",
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT);
    }
  });
});

describe("resume import auth guard", () => {
  it("requires authentication", () => {
    const result = resumeImportAuthError(null);
    assert.ok(result);
    assert.equal(result?.success, false);
    if (result && !result.success) {
      assert.equal(result.error.code, RESUME_IMPORT_ERROR_CODES.UNAUTHENTICATED);
    }
  });
});
