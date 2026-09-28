"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { updateCvAction } from "@/lib/cv/actions";
import {
  builderStateToContentPatch,
  cvRecordToBuilderState,
  serializeBuilderState,
} from "@/lib/cv/builder-mapper";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { CvRecord } from "@/lib/cv/serialize";
import { getTemplateDefinition } from "@/components/cv-templates/registry";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { BuilderEditor } from "@/components/cv-builder/builder-editor";
import {
  BuilderHeader,
  type SaveStatus,
} from "@/components/cv-builder/builder-header";
import { TemplateSelector } from "@/components/cv-builder/template-selector";

const AUTOSAVE_DELAY_MS = 1800;

type CvBuilderProps = {
  cvId: string;
  initialCv: CvRecord;
};

export function CvBuilder({ cvId, initialCv }: CvBuilderProps) {
  const initialState = useMemo(
    () =>
      cvRecordToBuilderState(
        initialCv.title,
        initialCv.content,
        initialCv.template,
      ),
    [initialCv.title, initialCv.content, initialCv.template],
  );

  const [state, setState] = useState<CvBuilderFormState>(initialState);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    serializeBuilderState(initialState),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = serializeBuilderState(state) !== savedSnapshot;
  const saveStatus: SaveStatus = isSaving
    ? "saving"
    : isDirty
      ? "unsaved"
      : "saved";

  const activeTemplate = getTemplateDefinition(state.template);

  const persist = useCallback(
    async (mode: "manual" | "auto") => {
      if (isSaving) {
        return;
      }

      if (serializeBuilderState(state) === savedSnapshot) {
        setSaveError(null);
        return;
      }

      setIsSaving(true);
      setSaveError(null);

      const result = await updateCvAction(cvId, {
        title: state.title.trim() || "Untitled CV",
        template: state.template,
        content: builderStateToContentPatch(state),
      });

      setIsSaving(false);

      if (!result.success) {
        setSaveError(
          mode === "auto"
            ? "Autosave failed. Use Save to retry."
            : result.error.message,
        );
        return;
      }

      const nextState = cvRecordToBuilderState(
        result.data.title,
        result.data.content,
        result.data.template,
      );
      setState(nextState);
      setSavedSnapshot(serializeBuilderState(nextState));
      setSaveError(null);
    },
    [cvId, isSaving, savedSnapshot, state],
  );

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      void persist("auto");
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [isDirty, persist, state]);

  function handleTemplateChange(templateId: CvTemplateId) {
    setState((current) => ({ ...current, template: templateId }));
  }

  async function handleExportPdf() {
    setIsExporting(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/cv/${cvId}/export`);

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setSaveError(payload.message ?? "Could not export PDF.");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? "cv.pdf";
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setSaveError("Could not export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleTemplateSaved(templateId: CvTemplateId) {
    setSavedSnapshot((current) => {
      const parsed = JSON.parse(current) as CvBuilderFormState;
      parsed.template = templateId;
      return serializeBuilderState(parsed);
    });
    setSaveError(null);
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <BuilderHeader
        title={state.title}
        onTitleChange={(title) => setState((current) => ({ ...current, title }))}
        saveStatus={saveStatus}
        saveError={saveError}
        onSave={() => void persist("manual")}
        isSaving={isSaving}
        onExportPdf={() => void handleExportPdf()}
        isExporting={isExporting}
      />

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <TemplateSelector
            cvId={cvId}
            selectedTemplate={state.template}
            onTemplateChange={handleTemplateChange}
            onTemplateSaved={handleTemplateSaved}
            onTemplateError={setSaveError}
          />
          <BuilderEditor state={state} onChange={setState} />
        </div>
        <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Live Preview
            </h2>
            <p className="text-sm text-zinc-500">{activeTemplate.name} template</p>
          </div>
          <div className="overflow-x-auto pb-6">
            <CvTemplateRenderer templateId={state.template} state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}
