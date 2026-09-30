"use client";

import { useState, type KeyboardEvent } from "react";
import {
  addSkillToList,
  normalizeSkillsList,
  removeSkillFromList,
} from "@/lib/cv/builder-ui-utils";
import { SkillsAiControls } from "@/components/cv-builder/ai/skills-ai-controls";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SkillsEditorProps = {
  state: CvBuilderFormState;
  onChangeSkills: (skills: string[]) => void;
};

export function SkillsEditor({ state, onChangeSkills }: SkillsEditorProps) {
  const [draft, setDraft] = useState("");
  const skills = normalizeSkillsList(state.skills);

  function commitDraft() {
    const next = addSkillToList(skills, draft);
    if (next.length === skills.length) {
      setDraft("");
      return;
    }
    onChangeSkills(next);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    }
  }

  return (
    <div className="space-y-4">
      <SkillsAiControls
        state={state}
        onAddSkill={(skill) => onChangeSkills(addSkillToList(skills, skill))}
      />
      {skills.length > 0 ? (
        <ul className="flex max-w-full flex-wrap gap-2" aria-label="Skills">
          {skills.map((skill, index) => (
            <li key={`${skill}-${index}`} className="max-w-full">
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1 text-sm text-slate-800">
                <span className="break-words">{skill}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-7 min-w-7 px-1 text-slate-500 hover:text-red-700"
                  aria-label={`Remove ${skill}`}
                  onClick={() => onChangeSkills(removeSkillFromList(skills, index))}
                >
                  ×
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No skills added yet. Type a skill and press Enter.</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="skill-add-input">
          Add skill
        </label>
        <Input
          id="skill-add-input"
          value={draft}
          placeholder="Add skill"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              commitDraft();
            }
          }}
          className="sm:max-w-xs"
        />
        <Button type="button" variant="outline" size="sm" onClick={commitDraft}>
          Add skill
        </Button>
      </div>
    </div>
  );
}
