"use client";

import { useI18n } from "@/components/i18n/i18n-provider";



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

