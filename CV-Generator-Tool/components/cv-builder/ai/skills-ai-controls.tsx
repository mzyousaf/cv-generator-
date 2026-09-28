"use client";

import { useMemo, useState } from "react";
import { suggestSkillsAction } from "@/lib/ai/actions";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";

type SkillsAiControlsProps = {
  state: CvBuilderFormState;
  onAddSkill: (skill: string) => void;
};

export function SkillsAiControls({ state, onAddSkill }: SkillsAiControlsProps) {
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
            .join(" — "),
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
      setError(result.error.message);
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
    <div className="space-y-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => void handleSuggest()}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
      >
        {isLoading ? "Suggesting..." : "Suggest skills"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-zinc-600">
            Select skills to add to your CV.
          </p>
          <ul className="space-y-2">
            {suggestions.map((skill) => (
              <li key={skill}>
                <label className="inline-flex items-center gap-2 text-sm text-zinc-800">
                  <input
                    type="checkbox"
                    checked={selected.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={handleAddSelected}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              Add selected
            </button>
            <button
              type="button"
              onClick={() => {
                setSuggestions([]);
                setSelected([]);
              }}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
