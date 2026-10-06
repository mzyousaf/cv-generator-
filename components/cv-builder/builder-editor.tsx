"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { useCallback, useState } from "react";
import { createEntryId } from "@/lib/cv/builder-mapper";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  certificationEntrySummary,
  educationEntrySummary,
  languageEntrySummary,
  normalizeSkillsList,
  projectEntrySummary,
  workExperienceEntrySummary,
} from "@/lib/cv/builder-ui-utils";
import {
  customSectionKey,
  getEditorSectionOrder,
  isSectionHidden,
  toggleSectionVisibility,
  type SectionKey,
} from "@/lib/cv/section-settings";
import { builderSectionDomId } from "@/lib/cv/builder-section-nav";
import { removeCustomSection } from "@/lib/cv/custom-sections";
import {
  CollapsibleEntryCard,
  FormField,
  SectionCard,
  SectionIconButton,
  SummaryTextArea,
  TextArea,
  TextInput,
} from "@/components/cv-builder/form-primitives";
import { BuilderMobileSectionsMenu } from "@/components/cv-builder/builder-mobile-sections-menu";
import { SkillsEditor } from "@/components/cv-builder/skills-editor";
import { PhotoField } from "@/components/cv-builder/photo-field";
import { SummaryAiControls } from "@/components/cv-builder/ai/summary-ai-controls";
import { WorkExperienceAiControls } from "@/components/cv-builder/ai/work-experience-ai-controls";
import { SectionAiControls } from "@/components/cv-builder/ai/section-ai-controls";
import type { AddSectionMode } from "@/components/cv-builder/add-section-modal";
import {
  EyeIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
} from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEntrySummaryLabels } from "@/components/cv-builder/use-entry-summary-labels";
import { format } from "@/lib/i18n/format";

type BuilderEditorProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onAddSection: (mode: AddSectionMode) => void;
};


function useExpandedEntries() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const expand = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds],
  );

  return { expand, toggle, isExpanded };
}

export function BuilderEditor({ state, onChange, onAddSection }: BuilderEditorProps) {
  const { t } = useI18n();
  const { expand, toggle, isExpanded } = useExpandedEntries();
  const summaryLabels = useEntrySummaryLabels();

  function confirmRemove(item: string): boolean {
    return window.confirm(format(t.editor.confirmRemove, { item }));
  }
  const sectionOrder = getEditorSectionOrder(state.sectionSettings, state.customSections);

  function update(partial: Partial<CvBuilderFormState>) {
    onChange({ ...state, ...partial });
  }

  /** Wrapper props placing a section card at its position in the user's order. */
  function slot(sectionId: SectionKey) {
    return {
      id: builderSectionDomId(sectionId),
      className: "scroll-mt-[calc(var(--builder-header-h,7.5rem)+4.5rem)] xl:scroll-mt-28",
      style: { order: sectionOrder.indexOf(sectionId) + 1 },
    };
  }

  /** Header chrome shared by every section: hidden badge + visibility toggle. */
  function sectionChrome(sectionId: SectionKey, label: string, extraActions?: React.ReactNode) {
    const hidden = isSectionHidden(state.sectionSettings, sectionId);
    return {
      muted: hidden,
      statusBadge: hidden ? <Badge variant="muted">{t.editor.hiddenFromResume}</Badge> : undefined,
      actions: (
        <>
          <SectionIconButton
            label={format(hidden ? t.builder.showSection : t.builder.hideSection, { label })}
            pressed={hidden}
            onClick={() =>
              update({ sectionSettings: toggleSectionVisibility(state.sectionSettings, sectionId) })
            }
          >
            <EyeIcon className="size-4" off={hidden} />
          </SectionIconButton>
          {extraActions}
        </>
      ),
    };
  }

  return (
    <div className="space-y-4">
      {/* Pinned under the header so the section list is reachable while scrolling. */}
      <div className="sticky top-[var(--builder-header-h,7.5rem)] z-20 -mx-4 border-b border-slate-200/60 bg-background/95 px-4 py-2 backdrop-blur xl:hidden">
        <BuilderMobileSectionsMenu state={state} onChange={onChange} onAddSection={onAddSection} />
      </div>

      <div className="flex flex-col gap-4">
      <div id="builder-section-personal" className="scroll-mt-[calc(var(--builder-header-h,7.5rem)+4.5rem)] xl:scroll-mt-28" style={{ order: 0 }}>
      <SectionCard
        title={t.sections.personal}
        description={t.editor.descriptions.personal}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t.editor.fields.fullName} htmlFor="personal-fullName">
            <TextInput
              id="personal-fullName"
              value={state.personal.fullName}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, fullName: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.professionalTitle} htmlFor="personal-title">
            <TextInput
              id="personal-title"
              value={state.personal.professionalTitle}
              onChange={(event) =>
                update({
                  personal: {
                    ...state.personal,
                    professionalTitle: event.target.value,
                  },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.email} htmlFor="personal-email">
            <TextInput
              id="personal-email"
              type="email"
              autoComplete="email"
              value={state.personal.email}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, email: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.phone} htmlFor="personal-phone">
            <TextInput
              id="personal-phone"
              type="tel"
              value={state.personal.phone}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, phone: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.location} htmlFor="personal-location">
            <TextInput
              id="personal-location"
              value={state.personal.location}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, location: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.website} htmlFor="personal-website">
            <TextInput
              id="personal-website"
              type="url"
              value={state.personal.website}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, website: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.linkedin} htmlFor="personal-linkedin">
            <TextInput
              id="personal-linkedin"
              type="url"
              value={state.personal.linkedIn}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, linkedIn: event.target.value },
                })
              }
            />
          </FormField>
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm font-semibold text-slate-800">{t.editor.fields.regionalHeading}</p>
          <p className="mt-0.5 text-xs text-slate-500">{t.editor.fields.regionalHint}</p>
          <div className="mt-4">
            <PhotoField
              value={state.personal.photo}
              templateId={state.template}
              onChange={(photo) => update({ personal: { ...state.personal, photo } })}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label={t.editor.fields.dateOfBirth} htmlFor="personal-dob">
              <TextInput
                id="personal-dob"
                value={state.personal.dateOfBirth}
                onChange={(event) =>
                  update({
                    personal: { ...state.personal, dateOfBirth: event.target.value },
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.nationality} htmlFor="personal-nationality">
              <TextInput
                id="personal-nationality"
                value={state.personal.nationality}
                onChange={(event) =>
                  update({
                    personal: { ...state.personal, nationality: event.target.value },
                  })
                }
              />
            </FormField>
          </div>
        </div>
      </SectionCard>
      </div>

      <div {...slot("summary")}>
      <SectionCard
        title={t.sections.summary}
        description={t.editor.descriptions.summary}
        {...sectionChrome("summary", t.sections.summary)}
      >
        <FormField label={t.editor.fields.summary} htmlFor="summary">
          <SummaryTextArea
            id="summary"
            value={state.summary}
            onChange={(event) => update({ summary: event.target.value })}
          />
        </FormField>
        <SummaryAiControls
          state={state}
          onApplySummary={(summary) => update({ summary })}
        />
      </SectionCard>
      </div>

      <div {...slot("workExperience")}>
      <SectionCard
        title={t.sections.workExperience}
        description={t.editor.descriptions.workExperience}
        {...sectionChrome("workExperience", t.sections.workExperience)}
        addLabel={t.editor.add.workExperience}
        onAdd={() => {
          const id = createEntryId();
          expand(id);
          update({
            workExperience: [
              ...state.workExperience,
              {
                id,
                jobTitle: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              },
            ],
          });
        }}
      >
        {state.workExperience.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.workExperience}</p>
        ) : null}
        {state.workExperience.map((entry) => {
          const summary = workExperienceEntrySummary(entry, summaryLabels);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove(t.editor.removeItems.work)) {
                return;
              }
              update({
                workExperience: state.workExperience.filter(
                  (item) => item.id !== entry.id,
                ),
              });
            }}
          >
            <FormField label={t.editor.fields.jobTitle} htmlFor={`work-title-${entry.id}`}>
              <TextInput
                id={`work-title-${entry.id}`}
                value={entry.jobTitle}
                onChange={(event) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id
                        ? { ...item, jobTitle: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.company} htmlFor={`work-company-${entry.id}`}>
              <TextInput
                id={`work-company-${entry.id}`}
                value={entry.company}
                onChange={(event) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id
                        ? { ...item, company: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.location} htmlFor={`work-location-${entry.id}`}>
              <TextInput
                id={`work-location-${entry.id}`}
                value={entry.location}
                onChange={(event) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id
                        ? { ...item, location: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.startDate} htmlFor={`work-start-${entry.id}`}>
              <TextInput
                id={`work-start-${entry.id}`}
                type="month"
                value={entry.startDate}
                onChange={(event) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id
                        ? { ...item, startDate: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.endDate} htmlFor={`work-end-${entry.id}`}>
              <TextInput
                id={`work-end-${entry.id}`}
                type="month"
                value={entry.endDate}
                disabled={entry.current}
                onChange={(event) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id
                        ? { ...item, endDate: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={entry.current}
                  onChange={(event) =>
                    update({
                      workExperience: state.workExperience.map((item) =>
                        item.id === entry.id
                          ? {
                              ...item,
                              current: event.target.checked,
                              endDate: event.target.checked ? "" : item.endDate,
                            }
                          : item,
                      ),
                    })
                  }
                />
                {t.editor.fields.currentJob}
              </label>
            </div>
            <div className="sm:col-span-2">
              <FormField label={t.editor.fields.description} htmlFor={`work-desc-${entry.id}`}>
                <TextArea
                  id={`work-desc-${entry.id}`}
                  value={entry.description}
                  onChange={(event) =>
                    update({
                      workExperience: state.workExperience.map((item) =>
                        item.id === entry.id
                          ? { ...item, description: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
              </FormField>
              <WorkExperienceAiControls
                entry={entry}
                onApplyDescription={(description) =>
                  update({
                    workExperience: state.workExperience.map((item) =>
                      item.id === entry.id ? { ...item, description } : item,
                    ),
                  })
                }
              />
            </div>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div {...slot("education")}>
      <SectionCard
        title={t.sections.education}
        description={t.editor.descriptions.education}
        {...sectionChrome("education", t.sections.education)}
        addLabel={t.editor.add.education}
        onAdd={() => {
          const id = createEntryId();
          expand(id);
          update({
            education: [
              ...state.education,
              {
                id,
                degree: "",
                institution: "",
                location: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
          });
        }}
      >
        {state.education.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.education}</p>
        ) : null}
        {state.education.map((entry) => {
          const summary = educationEntrySummary(entry, summaryLabels);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove(t.editor.removeItems.education)) {
                return;
              }
              update({
                education: state.education.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label={t.editor.fields.degree} htmlFor={`edu-degree-${entry.id}`}>
              <TextInput
                id={`edu-degree-${entry.id}`}
                value={entry.degree}
                onChange={(event) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id
                        ? { ...item, degree: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.institution} htmlFor={`edu-inst-${entry.id}`}>
              <TextInput
                id={`edu-inst-${entry.id}`}
                value={entry.institution}
                onChange={(event) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id
                        ? { ...item, institution: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.location} htmlFor={`edu-location-${entry.id}`}>
              <TextInput
                id={`edu-location-${entry.id}`}
                value={entry.location}
                onChange={(event) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id
                        ? { ...item, location: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.startDate} htmlFor={`edu-start-${entry.id}`}>
              <TextInput
                id={`edu-start-${entry.id}`}
                type="month"
                value={entry.startDate}
                onChange={(event) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id
                        ? { ...item, startDate: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.endDate} htmlFor={`edu-end-${entry.id}`}>
              <TextInput
                id={`edu-end-${entry.id}`}
                type="month"
                value={entry.endDate}
                onChange={(event) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id
                        ? { ...item, endDate: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label={t.editor.fields.description} htmlFor={`edu-desc-${entry.id}`}>
                <TextArea
                  id={`edu-desc-${entry.id}`}
                  value={entry.description}
                  onChange={(event) =>
                    update({
                      education: state.education.map((item) =>
                        item.id === entry.id
                          ? { ...item, description: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
              </FormField>
              <SectionAiControls
                className="mt-2"
                idPrefix={`edu-${entry.id}`}
                sectionTitle={`${t.sections.education}: ${[entry.degree, entry.institution].filter(Boolean).join(", ")}`}
                value={entry.description}
                state={state}
                onApply={(description) =>
                  update({
                    education: state.education.map((item) =>
                      item.id === entry.id ? { ...item, description } : item,
                    ),
                  })
                }
              />
            </div>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div {...slot("skills")}>
      <SectionCard
        title={t.sections.skills}
        description={t.editor.descriptions.skills}
        {...sectionChrome("skills", t.sections.skills)}
      >
        <SkillsEditor
          state={state}
          onChangeSkills={(skills) => update({ skills: normalizeSkillsList(skills) })}
        />
      </SectionCard>
      </div>

      <div {...slot("projects")}>
      <SectionCard
        title={t.sections.projects}
        description={t.editor.descriptions.projects}
        {...sectionChrome("projects", t.sections.projects)}
        addLabel={t.editor.add.projects}
        onAdd={() => {
          const id = createEntryId();
          expand(id);
          update({
            projects: [
              ...state.projects,
              { id, name: "", description: "", url: "" },
            ],
          });
        }}
      >
        {state.projects.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.projects}</p>
        ) : null}
        {state.projects.map((entry) => {
          const summary = projectEntrySummary(entry, summaryLabels);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove(t.editor.removeItems.project)) {
                return;
              }
              update({
                projects: state.projects.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label={t.editor.fields.projectName} htmlFor={`project-name-${entry.id}`}>
              <TextInput
                id={`project-name-${entry.id}`}
                value={entry.name}
                onChange={(event) =>
                  update({
                    projects: state.projects.map((item) =>
                      item.id === entry.id
                        ? { ...item, name: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.url} htmlFor={`project-url-${entry.id}`}>
              <TextInput
                id={`project-url-${entry.id}`}
                type="url"
                value={entry.url}
                onChange={(event) =>
                  update({
                    projects: state.projects.map((item) =>
                      item.id === entry.id
                        ? { ...item, url: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label={t.editor.fields.description} htmlFor={`project-desc-${entry.id}`}>
                <TextArea
                  id={`project-desc-${entry.id}`}
                  value={entry.description}
                  onChange={(event) =>
                    update({
                      projects: state.projects.map((item) =>
                        item.id === entry.id
                          ? { ...item, description: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
              </FormField>
              <SectionAiControls
                className="mt-2"
                idPrefix={`project-${entry.id}`}
                sectionTitle={`${t.sections.projects}: ${entry.name}`}
                value={entry.description}
                state={state}
                onApply={(description) =>
                  update({
                    projects: state.projects.map((item) =>
                      item.id === entry.id ? { ...item, description } : item,
                    ),
                  })
                }
              />
            </div>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div {...slot("certifications")}>
      <SectionCard
        title={t.sections.certifications}
        description={t.editor.descriptions.certifications}
        {...sectionChrome("certifications", t.sections.certifications)}
        addLabel={t.editor.add.certifications}
        onAdd={() => {
          const id = createEntryId();
          expand(id);
          update({
            certifications: [
              ...state.certifications,
              { id, name: "", issuer: "", date: "", url: "" },
            ],
          });
        }}
      >
        {state.certifications.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.certifications}</p>
        ) : null}
        {state.certifications.map((entry) => {
          const summary = certificationEntrySummary(entry, summaryLabels);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove(t.editor.removeItems.certification)) {
                return;
              }
              update({
                certifications: state.certifications.filter(
                  (item) => item.id !== entry.id,
                ),
              });
            }}
          >
            <FormField label={t.editor.fields.name} htmlFor={`cert-name-${entry.id}`}>
              <TextInput
                id={`cert-name-${entry.id}`}
                value={entry.name}
                onChange={(event) =>
                  update({
                    certifications: state.certifications.map((item) =>
                      item.id === entry.id
                        ? { ...item, name: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.issuer} htmlFor={`cert-issuer-${entry.id}`}>
              <TextInput
                id={`cert-issuer-${entry.id}`}
                value={entry.issuer}
                onChange={(event) =>
                  update({
                    certifications: state.certifications.map((item) =>
                      item.id === entry.id
                        ? { ...item, issuer: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.date} htmlFor={`cert-date-${entry.id}`}>
              <TextInput
                id={`cert-date-${entry.id}`}
                type="month"
                value={entry.date}
                onChange={(event) =>
                  update({
                    certifications: state.certifications.map((item) =>
                      item.id === entry.id
                        ? { ...item, date: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.url} htmlFor={`cert-url-${entry.id}`}>
              <TextInput
                id={`cert-url-${entry.id}`}
                type="url"
                value={entry.url}
                onChange={(event) =>
                  update({
                    certifications: state.certifications.map((item) =>
                      item.id === entry.id
                        ? { ...item, url: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div {...slot("languages")}>
      <SectionCard
        title={t.sections.languages}
        description={t.editor.descriptions.languages}
        {...sectionChrome("languages", t.sections.languages)}
        addLabel={t.editor.add.languages}
        onAdd={() => {
          const id = createEntryId();
          expand(id);
          update({
            languages: [
              ...state.languages,
              { id, language: "", proficiency: "" },
            ],
          });
        }}
      >
        {state.languages.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.languages}</p>
        ) : null}
        {state.languages.map((entry) => {
          const summary = languageEntrySummary(entry, summaryLabels);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove(t.editor.removeItems.language)) {
                return;
              }
              update({
                languages: state.languages.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label={t.editor.fields.language} htmlFor={`lang-name-${entry.id}`}>
              <TextInput
                id={`lang-name-${entry.id}`}
                value={entry.language}
                onChange={(event) =>
                  update({
                    languages: state.languages.map((item) =>
                      item.id === entry.id
                        ? { ...item, language: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <FormField label={t.editor.fields.proficiency} htmlFor={`lang-level-${entry.id}`}>
              <TextInput
                id={`lang-level-${entry.id}`}
                value={entry.proficiency}
                placeholder={t.editor.fields.proficiencyPlaceholder}
                onChange={(event) =>
                  update({
                    languages: state.languages.map((item) =>
                      item.id === entry.id
                        ? { ...item, proficiency: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      {state.customSections.map((entry) => {
        const key = customSectionKey(entry.id);
        const label = entry.title.trim() || t.editor.untitledSection;
        const updateEntry = (patch: Partial<typeof entry>) =>
          update({
            customSections: state.customSections.map((item) =>
              item.id === entry.id ? { ...item, ...patch } : item,
            ),
          });
        return (
          <div key={entry.id} {...slot(key)}>
            <SectionCard
              title={label}
              description={t.editor.customDescription}
              {...sectionChrome(
                key,
                label,
                <SectionIconButton
                  danger
                  label={t.editor.deleteSection}
                  onClick={() => {
                    if (confirmRemove(t.editor.removeItems.custom)) {
                      onChange(removeCustomSection(state, entry.id));
                    }
                  }}
                >
                  <TrashIcon className="size-4" />
                </SectionIconButton>,
              )}
            >
              <FormField label={t.editor.fields.sectionTitle} htmlFor={`custom-title-${entry.id}`}>
                <TextInput
                  id={`custom-title-${entry.id}`}
                  value={entry.title}
                  placeholder={t.addSection.titlePlaceholder}
                  onChange={(event) => updateEntry({ title: event.target.value })}
                />
              </FormField>
              <FormField label={t.editor.fields.content} htmlFor={`custom-content-${entry.id}`}>
                <TextArea
                  id={`custom-content-${entry.id}`}
                  value={entry.content}
                  rows={6}
                  onChange={(event) => updateEntry({ content: event.target.value })}
                />
              </FormField>
              <SectionAiControls
                idPrefix={`custom-${entry.id}`}
                sectionTitle={entry.title}
                value={entry.content}
                state={state}
                onApply={(content) => updateEntry({ content })}
              />
            </SectionCard>
          </div>
        );
      })}

      <div style={{ order: 1000 }}>
        <div className="flex flex-col items-stretch gap-2 rounded-xl border border-dashed border-slate-300 bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{t.builder.addSectionTitle}</p>
            <p className="text-xs text-slate-500">{t.builder.addSectionHint}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<PlusIcon className="size-4" />}
              onClick={() => onAddSection("blank")}
            >
              {t.builder.addSection}
            </Button>
            <Button
              type="button"
              variant="ai"
              size="sm"
              leftIcon={<SparkleIcon className="size-3.5" />}
              onClick={() => onAddSection("ai")}
            >
              {t.builder.createWithAi}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
