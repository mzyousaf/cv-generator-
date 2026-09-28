"use client";

import { useState } from "react";
import { improveWorkExperienceAction } from "@/lib/ai/actions";
import type { WorkExperienceEntry } from "@/lib/cv/builder-types";
import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";

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
    <div className="space-y-2">
      <button
        type="button"
        disabled={isLoading || !entry.description.trim()}
        onClick={() => void handleImprove()}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
      >
        {isLoading ? "Improving..." : "Improve with AI"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
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
    </div>
  );
}
