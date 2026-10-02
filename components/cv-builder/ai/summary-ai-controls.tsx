"use client";

import { useI18n } from "@/components/i18n/i18n-provider";



import { useState } from "react";

import { generateSummaryAction } from "@/lib/ai/actions";

import type { CvBuilderFormState } from "@/lib/cv/builder-types";

import { AiAssistShell } from "@/components/cv-builder/ai/ai-assist-shell";

import { AiSuggestionPanel } from "@/components/cv-builder/ai/ai-suggestion-panel";

import { FormField, TextArea } from "@/components/cv-builder/form-primitives";

import { Button } from "@/components/ui/button";

import { FormMessage } from "@/components/ui/form-message";



type SummaryAiControlsProps = {

  state: CvBuilderFormState;

  onApplySummary: (summary: string) => void;

};



export function SummaryAiControls({

  state,

  onApplySummary,

}: SummaryAiControlsProps) {
  const { t } = useI18n();

  const [careerGoals, setCareerGoals] = useState("");

  const [experienceNotes, setExperienceNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [suggestion, setSuggestion] = useState<string | null>(null);

  const [showOptions, setShowOptions] = useState(false);



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

              .join(", "),

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

    <AiAssistShell>

      <div className="flex flex-wrap items-center gap-2">

        <Button

          type="button"

          variant="ai"

          size="sm"

          disabled={isLoading}

          isLoading={isLoading}

          loadingText={t.ai.generating}

          onClick={() => void handleGenerate("generate")}

        >

          {t.ai.generateSummary}

        </Button>

        {state.summary.trim() ? (

          <Button

            type="button"

            variant="ai"

            size="sm"

            disabled={isLoading}

            onClick={() => void handleGenerate("improve")}

          >

            {t.ai.improveSummary}

          </Button>

        ) : null}

        <Button

          type="button"

          variant="ghost"

          size="sm"

          className="text-slate-600"

          onClick={() => setShowOptions((current) => !current)}

          aria-expanded={showOptions}

        >

          {showOptions ? t.ai.hideOptions : t.ai.options}

        </Button>

      </div>



      {showOptions ? (

        <div className="grid gap-3 sm:grid-cols-2">

          <FormField label={t.ai.careerGoals} htmlFor="ai-career-goals">

            <TextArea

              id="ai-career-goals"

              value={careerGoals}

              onChange={(event) => setCareerGoals(event.target.value)}

              placeholder={t.ai.careerGoalsPlaceholder}

            />

          </FormField>

          <FormField label={t.ai.experienceNotes} htmlFor="ai-exp-notes">

            <TextArea

              id="ai-exp-notes"

              value={experienceNotes}

              onChange={(event) => setExperienceNotes(event.target.value)}

              placeholder={t.ai.experienceNotesPlaceholder}

            />

          </FormField>

        </div>

      ) : null}



      {error ? <FormMessage>{error}</FormMessage> : null}



      {suggestion ? (

        <AiSuggestionPanel

          title={t.ai.summarySuggestion}

          content={suggestion}

          useLabel={t.ai.insertSummary}

          onUse={() => {

            onApplySummary(suggestion);

            setSuggestion(null);

          }}

          onDismiss={() => setSuggestion(null)}

        />

      ) : null}

    </AiAssistShell>

  );

}

