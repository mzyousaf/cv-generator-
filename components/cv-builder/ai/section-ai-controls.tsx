"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { AiAssistShell } from "@/components/cv-builder/ai/ai-assist-shell";
import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";
import { SparkleIcon } from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { writeSectionAction } from "@/lib/ai/actions";
import { buildAiCvContext } from "@/lib/ai/cv-context";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { localizeServerMessage } from "@/lib/i18n/server-messages";

type SectionAiControlsProps = {
  /** What is being written, e.g. "Volunteering" or "Project: Billing app". */
  sectionTitle: string;
  value: string;
  onApply: (text: string) => void;
  state: CvBuilderFormState;
  idPrefix: string;
  className?: string;
};

/** "Write with AI" / "Improve with AI" for any free-text field of the CV. */
export function SectionAiControls({
  sectionTitle,
  value,
  onApply,
  state,
  idPrefix,
  className,
}: SectionAiControlsProps) {
  const { t } = useI18n();
  const [instructions, setInstructions] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const hasText = value.trim().length > 0;
  const canRun = hasText || sectionTitle.trim().length > 0 || instructions.trim().length > 0;

  async function run() {
    setIsLoading(true);
    setError(null);
    const result = await writeSectionAction({
      sectionTitle,
      instructions,
      currentContent: value,
      context: buildAiCvContext(state),
      language: state.documentLocale,
    });
    setIsLoading(false);
    if (!result.success) {
      setError(localizeServerMessage(t, result.error.message));
      return;
    }
    setSuggestion(result.data);
  }

  return (
    <AiAssistShell className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ai"
          size="sm"
          leftIcon={<SparkleIcon className="size-3.5" />}
          disabled={isLoading || !canRun}
          isLoading={isLoading}
          loadingText={t.ai.writing}
          onClick={() => void run()}
        >
          {hasText ? t.ai.improveWithAi : t.ai.writeWithAi}
        </Button>
        <button
          type="button"
          aria-expanded={showInstructions}
          aria-controls={`${idPrefix}-ai-instructions`}
          onClick={() => setShowInstructions((current) => !current)}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-lg px-2 text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {showInstructions ? t.ai.hideOptions : t.ai.addInstructions}
        </button>
      </div>
      {showInstructions ? (
        <Input
          id={`${idPrefix}-ai-instructions`}
          aria-label={t.ai.instructions}
          value={instructions}
          placeholder={t.ai.instructionsPlaceholder}
          onChange={(event) => setInstructions(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (canRun && !isLoading) void run();
            }
          }}
          className="h-9"
        />
      ) : null}
      {error ? <FormMessage>{error}</FormMessage> : null}
      {suggestion ? (
        <AiSuggestionPanel
          title={t.ai.suggestion}
          content={suggestion}
          useLabel={hasText ? t.ai.replaceText : t.ai.use}
          onUse={() => {
            onApply(suggestion);
            setSuggestion(null);
          }}
          onDismiss={() => setSuggestion(null)}
        />
      ) : null}
    </AiAssistShell>
  );
}
