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
import { BuilderEditor } from "@/components/cv-builder/builder-editor";
import {
  BuilderHeader,
  type SaveStatus,
} from "@/components/cv-builder/builder-header";
import { BuilderPreviewPanel } from "@/components/cv-builder/builder-preview-panel";
import { BuilderSidebarNav } from "@/components/cv-builder/builder-sidebar-nav";
import { ManageSectionsModal } from "@/components/cv-builder/manage-sections-modal";
import { TemplatePickerModal } from "@/components/cv-builder/template-picker-modal";
import type { BuilderMobilePane } from "@/lib/cv/builder-ui-utils";
import { cn } from "@/lib/cn";

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
  const [manageOpen, setManageOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<BuilderMobilePane>("edit");
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
    <div className="min-h-screen bg-background bg-[radial-gradient(60%_40%_at_100%_0%,rgb(101_66_236/0.06),transparent),radial-gradient(40%_30%_at_0%_100%,rgb(236_72_153/0.04),transparent)]">
      <BuilderHeader
        title={state.title}
        onTitleChange={(title) => setState((current) => ({ ...current, title }))}
        saveStatus={saveStatus}
        saveError={saveError}
        onSave={() => void persist("manual")}
        isSaving={isSaving}
        onExportPdf={() => void handleExportPdf()}
        isExporting={isExporting}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onManageSections={() => setManageOpen(true)}
        mobilePane={mobilePane}
        onMobilePaneChange={setMobilePane}
        showMobilePaneToggle
      />

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 lg:gap-6 lg:py-6">
        <BuilderSidebarNav
          state={state}
          onManageSections={() => setManageOpen(true)}
          className="sticky top-[5.75rem] hidden max-h-[calc(100vh-6.5rem)] self-start overflow-y-auto xl:flex"
        />

        <div
          className={cn(
            "min-w-0 flex-1 xl:max-w-[680px]",
            mobilePane === "preview" && "hidden xl:block",
          )}
        >
          <BuilderEditor state={state} onChange={setState} />
        </div>

        <BuilderPreviewPanel
          templateId={state.template}
          state={state}
          templateLabel={`${activeTemplate.name} template`}
          onOpenTemplates={() => setTemplatesOpen(true)}
          className={cn(
            "w-full flex-1 xl:min-w-[400px] xl:max-w-[540px]",
            mobilePane === "edit" && "hidden xl:flex",
          )}
        />
      </div>

      <ManageSectionsModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        state={state}
        onChange={setState}
      />

      <TemplatePickerModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        cvId={cvId}
        selectedTemplate={state.template}
        onTemplateChange={handleTemplateChange}
        onTemplateSaved={handleTemplateSaved}
        onTemplateError={setSaveError}
      />
    </div>
  );
}
