"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { format } from "@/lib/i18n/format";

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
  const { t } = useI18n();
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
        <ul className="flex max-w-full flex-wrap gap-2" aria-label={t.sections.skills}>
          {skills.map((skill, index) => (
            <li key={`${skill}-${index}`} className="max-w-full">
              <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-blue-100 bg-gradient-to-b from-surface to-blue-50/70 py-1 ps-3 pe-1 text-sm font-medium text-blue-900 shadow-[0_1px_2px_color-mix(in_oklab,var(--brand-600)_8%,transparent)]">
                <span className="break-words">{skill}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-7 min-w-7 px-1 text-slate-500 hover:text-red-700"
                  aria-label={format(t.editor.removeSkill, { skill })}
                  onClick={() => onChangeSkills(removeSkillFromList(skills, index))}
                >
                  ×
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{t.editor.empty.skills} {t.editor.skillsHint}</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="skill-add-input">
          {t.editor.addSkill}
        </label>
        <Input
          id="skill-add-input"
          value={draft}
          placeholder={t.editor.addSkill}
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
          {t.editor.addSkill}
        </Button>
      </div>
    </div>
  );
}
