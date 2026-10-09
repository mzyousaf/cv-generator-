"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { localizeServerMessage } from "@/lib/i18n/server-messages";
import { useState } from "react";
import { improveWorkExperienceAction } from "@/lib/ai/actions";
import type { CvBuilderFormState, WorkExperienceEntry } from "@/lib/cv/builder-types";
import { AiAssistShell } from "@/components/cv-builder/ai/ai-assist-shell";
import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";
import { SectionAiControls } from "@/components/cv-builder/ai/section-ai-controls";
import { SparkleIcon } from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

type WorkExperienceAiControlsProps = {
  entry: WorkExperienceEntry;
  state: CvBuilderFormState;
  onApplyDescription: (description: string) => void;
};

export function WorkExperienceAiControls({
  entry,
  state,
  onApplyDescription,
}: WorkExperienceAiControlsProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function handleImprove() {
    setIsLoading(true);
    setError(null);
    const result = await improveWorkExperienceAction({
      jobTitle: entry.jobTitle,
      company: entry.company,
      description: entry.description,
    });
    setIsLoading(false);
    if (!result.success) {
      setError(localizeServerMessage(t, result.error.message));
      return;
    }
    setSuggestion(result.data);
  }

  // Nothing to improve yet: offer to write the description, like other sections.
  if (!entry.description.trim()) {
    return (
      <SectionAiControls
        className="sm:col-span-2"
        idPrefix={`work-${entry.id}`}
        sectionTitle={`${t.sections.workExperience}: ${[entry.jobTitle, entry.company].filter(Boolean).join(", ")}`}
        value={entry.description}
        state={state}
        onApply={onApplyDescription}
      />
    );
  }

  return (
    <AiAssistShell className="sm:col-span-2">
      <Button
        type="button"
        variant="ai"
        size="sm"
        leftIcon={<SparkleIcon className="size-3.5" />}
        disabled={isLoading}
        isLoading={isLoading}
        loadingText={t.ai.improving}
        onClick={() => void handleImprove()}
      >
        {t.ai.improveDescription}
      </Button>
      {error ? <FormMessage>{error}</FormMessage> : null}
      {suggestion ? (
        <AiSuggestionPanel
          title={t.ai.improvedDescription}
          content={suggestion}
          useLabel={t.ai.useDescription}
          onUse={() => {
            onApplyDescription(suggestion);
            setSuggestion(null);
          }}
          onDismiss={() => setSuggestion(null)}
        />
      ) : null}
    </AiAssistShell>
  );
}
