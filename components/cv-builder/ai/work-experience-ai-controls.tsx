"use client";

import { useState } from "react";
import { improveWorkExperienceAction } from "@/lib/ai/actions";
import type { WorkExperienceEntry } from "@/lib/cv/builder-types";
import { AiAssistShell } from "@/components/cv-builder/ai/ai-assist-shell";
import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

type WorkExperienceAiControlsProps = {
  entry: WorkExperienceEntry;
  onApplyDescription: (description: string) => void;
};

export function WorkExperienceAiControls({
  entry,
  onApplyDescription,
}: WorkExperienceAiControlsProps) {
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
      setError(result.error.message);
      return;
    }

    setSuggestion(result.data);
  }

  return (
    <AiAssistShell className="sm:col-span-2">
      <Button
        type="button"
        variant="ai"
        size="sm"
        disabled={isLoading || !entry.description.trim()}
        isLoading={isLoading}
        loadingText="Improving…"
        onClick={() => void handleImprove()}
      >
        Improve description
      </Button>
      {error ? <FormMessage>{error}</FormMessage> : null}
      {suggestion ? (
        <AiSuggestionPanel
          title="AI improved description"
          content={suggestion}
          useLabel="Use description"
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
