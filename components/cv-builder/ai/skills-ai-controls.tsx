"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { localizeServerMessage } from "@/lib/i18n/server-messages";

import { useMemo, useState } from "react";
import { suggestSkillsAction } from "@/lib/ai/actions";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { AiAssistShell } from "@/components/cv-builder/ai/ai-assist-shell";
import { SparkleIcon } from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";


type SkillsAiControlsProps = {
  state: CvBuilderFormState;
  onAddSkill: (skill: string) => void;
};


export function SkillsAiControls({ state, onAddSkill }: SkillsAiControlsProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const experienceNotes = useMemo(
    () =>
      state.workExperience
        .slice(0, 4)
        .map((entry) =>
          [entry.jobTitle, entry.company, entry.description]
            .filter(Boolean)
            .join(", "),
        )
        .join("\n"),
    [state.workExperience],
  );

  async function handleSuggest() {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setSelected([]);

    const result = await suggestSkillsAction({
      roleTitle: state.personal.professionalTitle,
      summary: state.summary,
      experienceNotes,
      existingSkills: state.skills.filter(Boolean),
    });

    setIsLoading(false);

    if (!result.success) {
      setError(localizeServerMessage(t, result.error.message));
      return;
    }

    setSuggestions(result.data);
  }

  function toggleSkill(skill: string) {
    setSelected((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
  }

  function handleAddSelected() {
    for (const skill of selected) {
      onAddSkill(skill);
    }
    setSuggestions([]);
    setSelected([]);
  }

  return (
    <AiAssistShell>
      <Button
        type="button"
        variant="ai"
        size="sm"
        leftIcon={<SparkleIcon className="size-3.5" />}
        disabled={isLoading}
        isLoading={isLoading}
        loadingText={t.ai.suggesting}
        onClick={() => void handleSuggest()}
      >
        {t.ai.suggestSkills}
      </Button>

      {error ? <FormMessage>{error}</FormMessage> : null}

      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {t.ai.selectSkills}
          </p>
          <ul className="space-y-2">
            {suggestions.map((skill) => (
              <li key={skill}>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                    checked={selected.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={selected.length === 0}
              onClick={handleAddSelected}
            >
              {t.ai.addSelected}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSuggestions([]);
                setSelected([]);
              }}
            >
              {t.common.dismiss}
            </Button>
          </div>
        </div>
      ) : null}
    </AiAssistShell>
  );
}
