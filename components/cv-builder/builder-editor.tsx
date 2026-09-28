"use client";

import {
  createEntryId,
} from "@/lib/cv/builder-mapper";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  EntryCard,
  FormField,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/cv-builder/form-primitives";
import { SkillsAiControls } from "@/components/cv-builder/ai/skills-ai-controls";
import { SummaryAiControls } from "@/components/cv-builder/ai/summary-ai-controls";
import { WorkExperienceAiControls } from "@/components/cv-builder/ai/work-experience-ai-controls";

type BuilderEditorProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
};

function confirmRemove(label: string): boolean {
  return window.confirm(`Remove this ${label}? This cannot be undone until you save.`);
}

export function BuilderEditor({ state, onChange }: BuilderEditorProps) {
  function update(partial: Partial<CvBuilderFormState>) {
    onChange({ ...state, ...partial });
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Personal Information">
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

      <SectionCard title="Professional Summary">
        <SummaryAiControls
          state={state}
          onApplySummary={(summary) => update({ summary })}
        />
        <FormField label="Summary" htmlFor="summary">
          <TextArea
            id="summary"
            value={state.summary}
            onChange={(event) => update({ summary: event.target.value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Work Experience"
        addLabel="Add experience"
        onAdd={() =>
          update({
            workExperience: [
              ...state.workExperience,
              {
                id: createEntryId(),
                jobTitle: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              },
            ],
          })
        }
      >
        {state.workExperience.length === 0 ? (
          <p className="text-sm text-zinc-500">No work experience added yet.</p>
        ) : null}
        {state.workExperience.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Experience ${index + 1}`}
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
              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
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
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Education"
        addLabel="Add education"
        onAdd={() =>
          update({
            education: [
              ...state.education,
              {
                id: createEntryId(),
                degree: "",
                institution: "",
                location: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
          })
        }
      >
        {state.education.length === 0 ? (
          <p className="text-sm text-zinc-500">No education entries yet.</p>
        ) : null}
        {state.education.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Education ${index + 1}`}
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
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard title="Skills" addLabel="Add skill" onAdd={() => update({ skills: [...state.skills, ""] })}>
        <SkillsAiControls
          state={state}
          onAddSkill={(skill) => {
            const trimmed = skill.trim();
            if (!trimmed) {
              return;
            }

            const existing = state.skills.filter(Boolean);
            if (existing.includes(trimmed)) {
              return;
            }

            update({ skills: [...existing, trimmed] });
          }}
        />
        {state.skills.length === 0 ? (
          <p className="text-sm text-zinc-500">No skills added yet.</p>
        ) : null}
        {state.skills.map((skill, index) => (
          <div key={`skill-${index}`} className="flex items-end gap-2">
            <div className="flex-1">
              <FormField label={`Skill ${index + 1}`} htmlFor={`skill-${index}`}>
                <TextInput
                  id={`skill-${index}`}
                  value={skill}
                  onChange={(event) =>
                    update({
                      skills: state.skills.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    })
                  }
                />
              </FormField>
            </div>
            <button
              type="button"
              className="mb-0.5 rounded-md px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              onClick={() => {
                if (!confirmRemove("skill")) {
                  return;
                }
                update({
                  skills: state.skills.filter((_, itemIndex) => itemIndex !== index),
                });
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Projects"
        addLabel="Add project"
        onAdd={() =>
          update({
            projects: [
              ...state.projects,
              { id: createEntryId(), name: "", description: "", url: "" },
            ],
          })
        }
      >
        {state.projects.length === 0 ? (
          <p className="text-sm text-zinc-500">No projects added yet.</p>
        ) : null}
        {state.projects.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Project ${index + 1}`}
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
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Certifications"
        addLabel="Add certification"
        onAdd={() =>
          update({
            certifications: [
              ...state.certifications,
              { id: createEntryId(), name: "", issuer: "", date: "", url: "" },
            ],
          })
        }
      >
        {state.certifications.length === 0 ? (
          <p className="text-sm text-zinc-500">No certifications added yet.</p>
        ) : null}
        {state.certifications.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Certification ${index + 1}`}
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
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Languages"
        addLabel="Add language"
        onAdd={() =>
          update({
            languages: [
              ...state.languages,
              { id: createEntryId(), language: "", proficiency: "" },
            ],
          })
        }
      >
        {state.languages.length === 0 ? (
          <p className="text-sm text-zinc-500">No languages added yet.</p>
        ) : null}
        {state.languages.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Language ${index + 1}`}
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
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Custom Sections"
        addLabel="Add section"
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
          <p className="text-sm text-zinc-500">No custom sections added yet.</p>
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
  );
}
