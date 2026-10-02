"use client";

import { useI18n } from "@/components/i18n/i18n-provider";



import { useId, useRef, useState } from "react";

import { UploadIcon } from "@/components/dashboard/icons";

import { ResumeImportReviewPanel } from "@/components/dashboard/resume-import-review-panel";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { FormMessage } from "@/components/ui/form-message";

import type { CvBuilderFormState } from "@/lib/cv/builder-types";

import { RESUME_IMPORT_ACCEPT } from "@/lib/resume-import/constants";

import { importResumeForReviewAction } from "@/lib/resume-import/actions";

import type { ResumeImportFileKind } from "@/lib/resume-import/constants";

import { format } from "@/lib/i18n/format";
import { formatFileSize, validateResumeFileClient } from "@/lib/resume-import/validation";

import { cn } from "@/lib/cn";



type SelectedFile = {

  file: File;

  kindLabel: string;

};



type ImportReviewSession = {

  filename: string;

  fileType: ResumeImportFileKind;

  fileSizeBytes: number;

  reviewState: CvBuilderFormState;

};



export function ResumeUploadDropzone() {
  const { t } = useI18n();

  const inputId = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [selected, setSelected] = useState<SelectedFile | null>(null);

  const [clientError, setClientError] = useState<string | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const [isImporting, setIsImporting] = useState(false);

  const [reviewSession, setReviewSession] = useState<ImportReviewSession | null>(

    null,

  );



  function resetErrors() {

    setClientError(null);

    setServerError(null);

  }



  function clearSelection() {

    setSelected(null);

    setReviewSession(null);

    resetErrors();

  }



  function selectFile(file: File) {

    resetErrors();

    setReviewSession(null);



    const validationError = validateResumeFileClient(file);

    if (validationError) {

      setClientError(validationError);

      setSelected(null);

      return;

    }



    const lower = file.name.toLowerCase();

    const kindLabel = lower.endsWith(".pdf") ? "PDF" : "DOCX";

    setSelected({ file, kindLabel });

  }



  function handleFiles(files: FileList | null) {

    if (!files?.length) {

      return;

    }

    selectFile(files[0]);

  }



  async function runImport() {

    if (!selected || isImporting) {

      return;

    }



    resetErrors();

    setIsImporting(true);



    const formData = new FormData();

    formData.append("file", selected.file);



    const result = await importResumeForReviewAction(formData);

    setIsImporting(false);



    if (!result.success) {

      setServerError(result.error.message);

      return;

    }



    setReviewSession({

      filename: result.data.filename,

      fileType: result.data.fileType,

      fileSizeBytes: result.data.fileSizeBytes,

      reviewState: result.data.reviewState,

    });

  }



  if (reviewSession) {

    return (

      <ResumeImportReviewPanel

        filename={reviewSession.filename}

        fileType={reviewSession.fileType}

        fileSizeBytes={reviewSession.fileSizeBytes}

        reviewState={reviewSession.reviewState}

        onReviewStateChange={(next) =>

          setReviewSession((current) =>

            current ? { ...current, reviewState: next } : current,

          )

        }

        onBack={clearSelection}

      />

    );

  }



  return (

    <div className="space-y-3">

      <div

        onDragEnter={(e) => {

          e.preventDefault();

          setIsDragging(true);

        }}

        onDragOver={(e) => {

          e.preventDefault();

          setIsDragging(true);

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

        className={cn(

          "group/drop rounded-3xl border-2 border-dashed bg-surface/70 p-8 text-center transition-all duration-200 sm:p-10",

          isDragging

            ? "border-blue-400 bg-blue-50/70 shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand-600)_8%,transparent)]"

            : "border-slate-200 hover:border-blue-300 hover:bg-surface",

        )}

      >

        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--brand-600)_60%,transparent)] ring-1 ring-blue-100 transition-transform duration-300 group-hover/drop:-translate-y-0.5">

          <UploadIcon className="size-7" />

        </div>

        <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-950">

          {t.importer.uploadTitle}

        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">

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

        <input

          ref={inputRef}

          id={inputId}

          type="file"

          accept={RESUME_IMPORT_ACCEPT}

          className="sr-only"

          onChange={(e) => {

            handleFiles(e.target.files);

            e.target.value = "";

          }}

        />

      </div>



      {selected ? (

        <Card>

          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-900">

                {selected.file.name}

              </p>

              <p className="mt-0.5 text-sm text-slate-600">

                {selected.kindLabel}, {formatFileSize(selected.file.size)}

              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Button

                type="button"

                variant="outline"

                size="sm"

                disabled={isImporting}

                onClick={clearSelection}

              >

                {t.common.remove}

              </Button>

              <Button

                type="button"

                variant="primary"

                size="sm"

                disabled={isImporting}

                isLoading={isImporting}

                loadingText={t.importer.importing}

                onClick={() => void runImport()}

              >

                {t.importer.importResume}

              </Button>

            </div>

          </CardContent>

        </Card>

      ) : null}



      {clientError ? <FormMessage>{clientError}</FormMessage> : null}

      {serverError ? (

        <div className="space-y-2">

          <FormMessage>{serverError}</FormMessage>

          {selected ? (

            <Button

              type="button"

              variant="outline"

              size="sm"

              disabled={isImporting}

              isLoading={isImporting}

              loadingText={t.importer.retrying}

              onClick={() => void runImport()}

            >

              {t.importer.retry}

            </Button>

          ) : null}

        </div>

      ) : null}

    </div>

  );

}

