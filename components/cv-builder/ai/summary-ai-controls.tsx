"use client";

import { useState } from "react";
import { generateSummaryAction } from "@/lib/ai/actions";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";
import { FormField, TextArea } from "@/components/cv-builder/form-primitives";

type SummaryAiControlsProps = {
  state: CvBuilderFormState;
  onApplySummary: (summary: string) => void;
};

export function SummaryAiControls({
  state,
  onApplySummary,
}: SummaryAiControlsProps) {
  const [careerGoals, setCareerGoals] = useState("");
  const [experienceNotes, setExperienceNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function handleGenerate(mode: "generate" | "improve") {
    setIsLoading(true);
    setError(null);

    const result = await generateSummaryAction({
      roleTitle: state.personal.professionalTitle,
      experienceNotes:
        experienceNotes ||
        state.workExperience
          .slice(0, 3)
          .map((entry) =>
            [entry.jobTitle, entry.company, entry.description]
              .filter(Boolean)
              .join(" — "),
          )
          .join("\n"),
      skillsNotes: state.skills.filter(Boolean).join(", "),
      careerGoals,
      currentSummary: mode === "improve" ? state.summary : "",
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    setSuggestion(result.data);
  }

  return (
    <div className="space-y-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => void handleGenerate("generate")}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate with AI"}
        </button>
        {state.summary.trim() ? (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void handleGenerate("improve")}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
          >
            Improve with AI
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Career goals (optional)" htmlFor="ai-career-goals">
          <TextArea
            id="ai-career-goals"
            value={careerGoals}
            onChange={(event) => setCareerGoals(event.target.value)}
            placeholder="Target roles, industries, or focus areas"
          />
        </FormField>
        <FormField label="Experience notes (optional)" htmlFor="ai-exp-notes">
          <TextArea
            id="ai-exp-notes"
            value={experienceNotes}
            onChange={(event) => setExperienceNotes(event.target.value)}
            placeholder="Extra context for the summary"
          />
        </FormField>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {suggestion ? (
        <AiSuggestionPanel
          title="AI summary suggestion"
          content={suggestion}
          useLabel="Insert summary"
          onUse={() => {
            onApplySummary(suggestion);
            setSuggestion(null);
          }}
          onDismiss={() => setSuggestion(null)}
        />
      ) : null}
    </div>
  );
}
