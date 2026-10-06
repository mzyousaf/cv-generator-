"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { SparkleIcon } from "@/components/cv-builder/builder-section-icons";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/ui/form-message";
import { createSectionAction } from "@/lib/ai/actions";
import { buildAiCvContext } from "@/lib/ai/cv-context";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { localizeServerMessage } from "@/lib/i18n/server-messages";
import { cn } from "@/lib/cn";

export type AddSectionMode = "blank" | "ai";

/** Mount only while open so every opening starts from a clean form. */
type AddSectionModalProps = {
  open: boolean;
  initialMode: AddSectionMode;
  state: CvBuilderFormState;
  onClose: () => void;
  onAdd: (section: { title: string; content: string }) => void;
};

export function AddSectionModal({
  open,
  initialMode,
  state,
  onClose,
  onAdd,
}: AddSectionModalProps) {
  const { t } = useI18n();
  const copy = t.addSection;
  const [mode, setMode] = useState<AddSectionMode>(initialMode);
  const [title, setTitle] = useState("");
  const [request, setRequest] = useState("");
  const [draft, setDraft] = useState<{ title: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!request.trim() || isGenerating) {
      return;
    }
    setIsGenerating(true);
    setError(null);
    const result = await createSectionAction({
      request,
      context: buildAiCvContext(state),
      language: state.documentLocale,
    });
    setIsGenerating(false);
    if (!result.success) {
      setError(localizeServerMessage(t, result.error.message));
      return;
    }
    setDraft(result.data);
  }

  function addBlank(sectionTitle: string) {
    onAdd({ title: sectionTitle.trim(), content: "" });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={copy.title}
      description={copy.description}
      className="max-w-xl"
    >
      <div
        role="tablist"
        aria-label={copy.title}
        className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
      >
        {(["blank", "ai"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => setMode(item)}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              mode === item
                ? "bg-surface text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            {item === "ai" ? <SparkleIcon className="size-3.5 text-blue-600" /> : null}
            {item === "ai" ? copy.aiTab : copy.blankTab}
          </button>
        ))}
      </div>

      {mode === "blank" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            addBlank(title);
          }}
        >
          <Field label={copy.titleLabel} htmlFor="add-section-title">
            <Input
              id="add-section-title"
              value={title}
              autoFocus
              placeholder={copy.titlePlaceholder}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.suggestions}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {copy.suggestionNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => addBlank(name)}
                  className="cursor-pointer rounded-md border border-slate-200 bg-surface px-2.5 py-1 text-sm text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!title.trim()}>
              {copy.add}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <Field label={copy.aiPrompt} htmlFor="add-section-request">
            <Textarea
              id="add-section-request"
              value={request}
              rows={3}
              autoFocus
              placeholder={copy.aiPlaceholder}
              onChange={(event) => setRequest(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  void generate();
                }
              }}
            />
          </Field>
          <div className="flex flex-wrap gap-1.5">
            {copy.aiIdeas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => setRequest(idea)}
                className="cursor-pointer rounded-md border border-slate-200 bg-surface px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {idea}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="ai"
            size="sm"
            leftIcon={<SparkleIcon className="size-3.5" />}
            disabled={!request.trim() || isGenerating}
            isLoading={isGenerating}
            loadingText={t.ai.generating}
            onClick={() => void generate()}
          >
            {draft ? copy.regenerate : copy.generate}
          </Button>
          {error ? <FormMessage>{error}</FormMessage> : null}

          {draft ? (
            <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {copy.previewTitle}
              </p>
              <Field label={copy.titleLabel} htmlFor="add-section-draft-title">
                <Input
                  id="add-section-draft-title"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </Field>
              <Field label={t.editor.fields.content} htmlFor="add-section-draft-content">
                <Textarea
                  id="add-section-draft-content"
                  value={draft.content}
                  rows={6}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                />
              </Field>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!draft || !draft.content.trim()}
              onClick={() => draft && onAdd({ title: draft.title.trim(), content: draft.content })}
            >
              {copy.add}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
