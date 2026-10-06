"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { localizeServerMessage } from "@/lib/i18n/server-messages";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon } from "@/components/dashboard/icons";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Spinner } from "@/components/ui/spinner";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { resizePhotoDataUrl } from "@/lib/cv/photo-client";
import { RESUME_IMPORT_ACCEPT } from "@/lib/resume-import/constants";
import {
  createResumeFromImportAction,
  importResumeForReviewAction,
} from "@/lib/resume-import/actions";
import { format } from "@/lib/i18n/format";
import { formatFileSize, validateResumeFileClient } from "@/lib/resume-import/validation";
import { cn } from "@/lib/cn";

type ImportStep = "reading" | "analyzing" | "creating";

const STEPS: ImportStep[] = ["reading", "analyzing", "creating"];

/** The read + AI parse run as one request; move the indicator on after a moment. */
const ANALYZING_AFTER_MS = 2500;

async function withImportedPhoto(
  state: CvBuilderFormState,
  photoCandidate: string | null,
): Promise<CvBuilderFormState> {
  if (!photoCandidate || state.personal.photo) {
    return state;
  }
  try {
    const photo = await resizePhotoDataUrl(photoCandidate);
    return { ...state, personal: { ...state.personal, photo } };
  } catch {
    return state;
  }
}

export function ResumeUploadDropzone() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<ImportStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "reading") {
      return;
    }
    const timer = setTimeout(
      () => setStep((current) => (current === "reading" ? "analyzing" : current)),
      ANALYZING_AFTER_MS,
    );
    return () => clearTimeout(timer);
  }, [step]);

  async function runImport(selected: File) {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setError(null);
    setStep("reading");

    try {
      const formData = new FormData();
      formData.append("file", selected);
      formData.append("locale", locale);
      const analyzed = await importResumeForReviewAction(formData);
      if (!analyzed.success) {
        setError(localizeServerMessage(t, analyzed.error.message));
        setStep(null);
        return;
      }

      setStep("creating");
      const state = await withImportedPhoto(
        analyzed.data.reviewState,
        analyzed.data.photoCandidate,
      );

      const created = await createResumeFromImportAction(state);
      if (!created.success) {
        setError(localizeServerMessage(t, created.error.message));
        setStep(null);
        return;
      }

      router.push(`/dashboard/cv/${created.data.cvId}`);
    } catch {
      setError(t.serverErrors.importExtraction);
      setStep(null);
    } finally {
      busyRef.current = false;
    }
  }

  function handleFiles(files: FileList | null) {
    const selected = files?.[0];
    if (!selected || busyRef.current) {
      return;
    }

    const validationError = validateResumeFileClient(selected);
    if (validationError) {
      setFile(null);
      setError(localizeServerMessage(t, validationError));
      return;
    }

    setFile(selected);
    void runImport(selected);
  }

  const isBusy = step !== null;

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          if (!isBusy) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isBusy) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        aria-busy={isBusy || undefined}
        className={cn(
          "group/drop rounded-2xl border-2 border-dashed bg-surface/70 p-6 transition-all duration-200 sm:p-8",
          isDragging
            ? "border-blue-400 bg-blue-50/70 shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand-600)_8%,transparent)]"
            : "border-slate-200",
          !isBusy && "hover:border-blue-300 hover:bg-surface",
        )}
      >
        {isBusy && file ? (
          <div className="mx-auto max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Spinner className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <ol className="mt-5 space-y-2.5" aria-live="polite">
              {STEPS.map((item, index) => {
                const activeIndex = STEPS.indexOf(step);
                const state =
                  index < activeIndex ? "done" : index === activeIndex ? "active" : "todo";
                return (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        state === "done" && "bg-emerald-500 text-white",
                        state === "active" && "bg-blue-600 text-white",
                        state === "todo" && "bg-slate-100 text-slate-400",
                      )}
                    >
                      {state === "done" ? "✓" : index + 1}
                    </span>
                    <span
                      className={cn(
                        state === "active" ? "font-semibold text-slate-900" : "text-slate-500",
                      )}
                    >
                      {t.importer.steps[item]}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 ring-1 ring-blue-100 transition-transform duration-300 group-hover/drop:-translate-y-0.5">
              <UploadIcon className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-950">
              {t.importer.uploadTitle}
            </h2>
            <p className="mx-auto mt-1.5 max-w-lg text-sm text-slate-600">
              {t.importer.autoHint}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
              {t.importer.dropPrompt}{" "}
              <button
                type="button"
                className="cursor-pointer font-semibold text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                onClick={() => inputRef.current?.click()}
              >
                {t.importer.browse}
              </button>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {format(t.importer.fileHint, { size: formatFileSize(5 * 1024 * 1024) })}
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={RESUME_IMPORT_ACCEPT}
          className="sr-only"
          disabled={isBusy}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error ? (
        <div className="space-y-2">
          <FormMessage>{error}</FormMessage>
          {file ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => void runImport(file)}
            >
              {t.importer.retry}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
