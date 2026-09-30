"use client";

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
  getEditorSectionOrder,
  isSectionHidden,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";
import {
  CollapsibleEntryCard,
  EntryCard,
  FormField,
  SectionCard,
  SummaryTextArea,
  TextArea,
  TextInput,
} from "@/components/cv-builder/form-primitives";
import { BuilderMobileSectionsMenu } from "@/components/cv-builder/builder-mobile-sections-menu";
import { SkillsEditor } from "@/components/cv-builder/skills-editor";
import { SummaryAiControls } from "@/components/cv-builder/ai/summary-ai-controls";
import { WorkExperienceAiControls } from "@/components/cv-builder/ai/work-experience-ai-controls";
import { Badge } from "@/components/ui/badge";

type BuilderEditorProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
};

function confirmRemove(label: string): boolean {
  return window.confirm(`Remove this ${label}? This cannot be undone until you save.`);
}

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

export function BuilderEditor({ state, onChange }: BuilderEditorProps) {
  const { expand, toggle, isExpanded } = useExpandedEntries();
  const sectionOrder = getEditorSectionOrder(state.sectionSettings);

  function update(partial: Partial<CvBuilderFormState>) {
    onChange({ ...state, ...partial });
  }

  function flexOrder(sectionId: ManageableSectionId) {
    return { order: sectionOrder.indexOf(sectionId) + 1 };
  }

  function hiddenBadge(sectionId: ManageableSectionId) {
    return isSectionHidden(state.sectionSettings, sectionId) ? (
      <Badge variant="muted">Hidden from resume</Badge>
    ) : undefined;
  }

  return (
    <div className="space-y-4">
      <div className="xl:hidden">
        <BuilderMobileSectionsMenu state={state} />
      </div>

      <div className="flex flex-col gap-4">
      <div id="builder-section-personal" className="scroll-mt-28" style={{ order: 0 }}>
      <SectionCard
        title="Personal Information"
        description="Contact details shown at the top of your resume."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="personal-fullName">
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
          <FormField label="Professional title" htmlFor="personal-title">
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
          <FormField label="Email" htmlFor="personal-email">
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
          <FormField label="Phone" htmlFor="personal-phone">
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
          <FormField label="Location" htmlFor="personal-location">
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
          <FormField label="Website" htmlFor="personal-website">
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
          <FormField label="LinkedIn" htmlFor="personal-linkedin">
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
      </SectionCard>
      </div>

      <div id="builder-section-summary" className="scroll-mt-28" style={flexOrder("summary")}>
      <SectionCard
        title="Professional Summary"
        description="A concise overview of your experience and strengths."
        statusBadge={hiddenBadge("summary")}
      >
        <FormField label="Summary" htmlFor="summary">
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

      <div id="builder-section-workExperience" className="scroll-mt-28" style={flexOrder("workExperience")}>
      <SectionCard
        title="Work Experience"
        description="Add your employment history."
        statusBadge={hiddenBadge("workExperience")}
        addLabel="+ Add experience"
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
          <p className="text-sm text-slate-500">No work experience added yet.</p>
        ) : null}
        {state.workExperience.map((entry) => {
          const summary = workExperienceEntrySummary(entry);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove("work experience entry")) {
                return;
              }
              update({
                workExperience: state.workExperience.filter(
                  (item) => item.id !== entry.id,
                ),
              });
            }}
          >
            <FormField label="Job title" htmlFor={`work-title-${entry.id}`}>
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
            <FormField label="Company" htmlFor={`work-company-${entry.id}`}>
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
            <FormField label="Location" htmlFor={`work-location-${entry.id}`}>
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
            <FormField label="Start date" htmlFor={`work-start-${entry.id}`}>
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
            <FormField label="End date" htmlFor={`work-end-${entry.id}`}>
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
                Current job
              </label>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Description" htmlFor={`work-desc-${entry.id}`}>
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

      <div id="builder-section-education" className="scroll-mt-28" style={flexOrder("education")}>
      <SectionCard
        title="Education"
        description="List degrees, certifications, and relevant coursework."
        statusBadge={hiddenBadge("education")}
        addLabel="+ Add education"
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
          <p className="text-sm text-slate-500">No education entries yet.</p>
        ) : null}
        {state.education.map((entry) => {
          const summary = educationEntrySummary(entry);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove("education entry")) {
                return;
              }
              update({
                education: state.education.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label="Degree" htmlFor={`edu-degree-${entry.id}`}>
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
            <FormField label="Institution" htmlFor={`edu-inst-${entry.id}`}>
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
            <FormField label="Location" htmlFor={`edu-location-${entry.id}`}>
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
            <FormField label="Start date" htmlFor={`edu-start-${entry.id}`}>
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
            <FormField label="End date" htmlFor={`edu-end-${entry.id}`}>
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
              <FormField label="Description" htmlFor={`edu-desc-${entry.id}`}>
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
            </div>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div id="builder-section-skills" className="scroll-mt-28" style={flexOrder("skills")}>
      <SectionCard
        title="Skills"
        description="Highlight tools and technologies recruiters look for."
        statusBadge={hiddenBadge("skills")}
      >
        <SkillsEditor
          state={state}
          onChangeSkills={(skills) => update({ skills: normalizeSkillsList(skills) })}
        />
      </SectionCard>
      </div>

      <div id="builder-section-projects" className="scroll-mt-28" style={flexOrder("projects")}>
      <SectionCard
        title="Projects"
        description="Showcase personal or professional projects."
        statusBadge={hiddenBadge("projects")}
        addLabel="+ Add project"
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
          <p className="text-sm text-slate-500">No projects added yet.</p>
        ) : null}
        {state.projects.map((entry) => {
          const summary = projectEntrySummary(entry);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove("project")) {
                return;
              }
              update({
                projects: state.projects.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label="Project name" htmlFor={`project-name-${entry.id}`}>
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
            <FormField label="URL" htmlFor={`project-url-${entry.id}`}>
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
              <FormField label="Description" htmlFor={`project-desc-${entry.id}`}>
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
            </div>
          </CollapsibleEntryCard>
          );
        })}
      </SectionCard>
      </div>

      <div id="builder-section-certifications" className="scroll-mt-28" style={flexOrder("certifications")}>
      <SectionCard
        title="Certifications"
        description="Professional credentials and licenses."
        statusBadge={hiddenBadge("certifications")}
        addLabel="+ Add certification"
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
          <p className="text-sm text-slate-500">No certifications added yet.</p>
        ) : null}
        {state.certifications.map((entry) => {
          const summary = certificationEntrySummary(entry);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove("certification")) {
                return;
              }
              update({
                certifications: state.certifications.filter(
                  (item) => item.id !== entry.id,
                ),
              });
            }}
          >
            <FormField label="Name" htmlFor={`cert-name-${entry.id}`}>
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
            <FormField label="Issuer" htmlFor={`cert-issuer-${entry.id}`}>
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
            <FormField label="Date" htmlFor={`cert-date-${entry.id}`}>
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
            <FormField label="URL" htmlFor={`cert-url-${entry.id}`}>
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

      <div id="builder-section-languages" className="scroll-mt-28" style={flexOrder("languages")}>
      <SectionCard
        title="Languages"
        description="Languages you speak and your proficiency level."
        statusBadge={hiddenBadge("languages")}
        addLabel="+ Add language"
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
          <p className="text-sm text-slate-500">No languages added yet.</p>
        ) : null}
        {state.languages.map((entry) => {
          const summary = languageEntrySummary(entry);
          return (
          <CollapsibleEntryCard
            key={entry.id}
            summaryTitle={summary.title}
            summarySubtitle={summary.subtitle}
            expanded={isExpanded(entry.id)}
            onToggle={() => toggle(entry.id)}
            onRemove={() => {
              if (!confirmRemove("language entry")) {
                return;
              }
              update({
                languages: state.languages.filter((item) => item.id !== entry.id),
              });
            }}
          >
            <FormField label="Language" htmlFor={`lang-name-${entry.id}`}>
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
            <FormField label="Proficiency" htmlFor={`lang-level-${entry.id}`}>
              <TextInput
                id={`lang-level-${entry.id}`}
                value={entry.proficiency}
                placeholder="Native, Professional, Intermediate"
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

      <div className="scroll-mt-28" style={{ order: 100 }}>
      <SectionCard
        title="Custom Sections"
        description="Optional sections for awards, volunteering, or other content."
        addLabel="+ Add section"
        onAdd={() =>
          update({
            customSections: [
              ...state.customSections,
              { id: createEntryId(), title: "", content: "" },
            ],
          })
        }
      >
        {state.customSections.length === 0 ? (
          <p className="text-sm text-slate-500">No custom sections added yet.</p>
        ) : null}
        {state.customSections.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Custom section ${index + 1}`}
            onRemove={() => {
              if (!confirmRemove("custom section")) {
                return;
              }
              update({
                customSections: state.customSections.filter(
                  (item) => item.id !== entry.id,
                ),
              });
            }}
          >
            <FormField label="Section title" htmlFor={`custom-title-${entry.id}`}>
              <TextInput
                id={`custom-title-${entry.id}`}
                value={entry.title}
                onChange={(event) =>
                  update({
                    customSections: state.customSections.map((item) =>
                      item.id === entry.id
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  })
                }
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Content" htmlFor={`custom-content-${entry.id}`}>
                <TextArea
                  id={`custom-content-${entry.id}`}
                  value={entry.content}
                  onChange={(event) =>
                    update({
                      customSections: state.customSections.map((item) =>
                        item.id === entry.id
                          ? { ...item, content: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
              </FormField>
            </div>
          </EntryCard>
        ))}
      </SectionCard>
      </div>
      </div>
    </div>
  );
}
