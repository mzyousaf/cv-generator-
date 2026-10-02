"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { format } from "@/lib/i18n/format";

import { createEntryId } from "@/lib/cv/builder-mapper";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  EntryCard,
  FormField,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/cv-builder/form-primitives";
import { Button } from "@/components/ui/button";

type ResumeImportReviewFormProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
};

export function ResumeImportReviewForm({
  state,
  onChange,
}: ResumeImportReviewFormProps) {
  const { t } = useI18n();
  function update(partial: Partial<CvBuilderFormState>) {
    onChange({ ...state, ...partial });
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      <SectionCard title={t.importer.resumeTitle}>
        <FormField label={t.importer.titleLabel} htmlFor="import-resume-title">
          <TextInput
            id="import-resume-title"
            value={state.title}
            placeholder={t.importer.titlePlaceholder}
            onChange={(event) => update({ title: event.target.value })}
          />
        </FormField>
        <p className="text-xs text-slate-500">
          {t.importer.titleHint}
        </p>
      </SectionCard>

      <SectionCard title={t.importer.personal}>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={t.editor.fields.fullName} htmlFor="import-fullName">
            <TextInput
              id="import-fullName"
              value={state.personal.fullName}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, fullName: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.professionalTitle} htmlFor="import-title">
            <TextInput
              id="import-title"
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
          <FormField label={t.editor.fields.email} htmlFor="import-email">
            <TextInput
              id="import-email"
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
          <FormField label={t.editor.fields.phone} htmlFor="import-phone">
            <TextInput
              id="import-phone"
              type="tel"
              value={state.personal.phone}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, phone: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.location} htmlFor="import-location">
            <TextInput
              id="import-location"
              value={state.personal.location}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, location: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.website} htmlFor="import-website">
            <TextInput
              id="import-website"
              type="url"
              value={state.personal.website}
              onChange={(event) =>
                update({
                  personal: { ...state.personal, website: event.target.value },
                })
              }
            />
          </FormField>
          <FormField label={t.editor.fields.linkedin} htmlFor="import-linkedin">
            <TextInput
              id="import-linkedin"
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

      <SectionCard title={t.importer.summary}>
        <FormField label={t.editor.fields.summary} htmlFor="import-summary">
          <TextArea
            id="import-summary"
            value={state.summary}
            onChange={(event) => update({ summary: event.target.value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title={t.importer.work}
        addLabel={t.importer.addExperience}
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
          <p className="text-sm text-slate-500">{t.editor.empty.workExperience}</p>
        ) : null}
        {state.workExperience.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={format(t.importer.experienceN, { n: index + 1 })}
            onRemove={() =>
              update({
                workExperience: state.workExperience.filter(
                  (item) => item.id !== entry.id,
                ),
              })
            }
          >
            <FormField label={t.editor.fields.jobTitle} htmlFor={`import-work-title-${entry.id}`}>
              <TextInput
                id={`import-work-title-${entry.id}`}
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
            <FormField label={t.editor.fields.company} htmlFor={`import-work-company-${entry.id}`}>
              <TextInput
                id={`import-work-company-${entry.id}`}
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
            <FormField label={t.editor.fields.location} htmlFor={`import-work-location-${entry.id}`}>
              <TextInput
                id={`import-work-location-${entry.id}`}
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
            <FormField label={t.editor.fields.startDate} htmlFor={`import-work-start-${entry.id}`}>
              <TextInput
                id={`import-work-start-${entry.id}`}
                placeholder={t.importer.startPlaceholder}
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
            <FormField label={t.editor.fields.endDate} htmlFor={`import-work-end-${entry.id}`}>
              <TextInput
                id={`import-work-end-${entry.id}`}
                placeholder={t.importer.endPlaceholder}
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
              <FormField label={t.editor.fields.description} htmlFor={`import-work-desc-${entry.id}`}>
                <TextArea
                  id={`import-work-desc-${entry.id}`}
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
            </div>
          </EntryCard>
        ))}
      </SectionCard>

      <SectionCard
        title={t.sections.education}
        addLabel={t.importer.addEducation}
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
          <p className="text-sm text-slate-500">{t.editor.empty.education}</p>
        ) : null}
        {state.education.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={format(t.importer.educationN, { n: index + 1 })}
            onRemove={() =>
              update({
                education: state.education.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label={t.editor.fields.degree} htmlFor={`import-edu-degree-${entry.id}`}>
              <TextInput
                id={`import-edu-degree-${entry.id}`}
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
            <FormField label={t.editor.fields.institution} htmlFor={`import-edu-inst-${entry.id}`}>
              <TextInput
                id={`import-edu-inst-${entry.id}`}
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
            <FormField label={t.editor.fields.location} htmlFor={`import-edu-location-${entry.id}`}>
              <TextInput
                id={`import-edu-location-${entry.id}`}
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
            <FormField label={t.editor.fields.startDate} htmlFor={`import-edu-start-${entry.id}`}>
              <TextInput
                id={`import-edu-start-${entry.id}`}
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
            <FormField label={t.editor.fields.endDate} htmlFor={`import-edu-end-${entry.id}`}>
              <TextInput
                id={`import-edu-end-${entry.id}`}
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
              <FormField label={t.editor.fields.description} htmlFor={`import-edu-desc-${entry.id}`}>
                <TextArea
                  id={`import-edu-desc-${entry.id}`}
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

      <SectionCard
        title={t.sections.skills}
        addLabel={t.importer.addSkill}
        onAdd={() => update({ skills: [...state.skills, ""] })}
      >
        {state.skills.length === 0 ? (
          <p className="text-sm text-slate-500">{t.editor.empty.skills}</p>
        ) : null}
        {state.skills.map((skill, index) => (
          <div key={`import-skill-${index}`} className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <FormField label={format(t.importer.skillN, { n: index + 1 })} htmlFor={`import-skill-${index}`}>
                <TextInput
                  id={`import-skill-${index}`}
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
            <Button
              type="button"
              variant="link-danger"
              className="mb-0.5 shrink-0"
              onClick={() =>
                update({
                  skills: state.skills.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            >
              {t.common.remove}
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title={t.sections.projects}
        addLabel={t.importer.addProject}
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
          <p className="text-sm text-slate-500">{t.editor.empty.projects}</p>
        ) : null}
        {state.projects.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={format(t.importer.projectN, { n: index + 1 })}
            onRemove={() =>
              update({
                projects: state.projects.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label={t.editor.fields.projectName} htmlFor={`import-project-name-${entry.id}`}>
              <TextInput
                id={`import-project-name-${entry.id}`}
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
            <FormField label={t.editor.fields.url} htmlFor={`import-project-url-${entry.id}`}>
              <TextInput
                id={`import-project-url-${entry.id}`}
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
              <FormField label={t.editor.fields.description} htmlFor={`import-project-desc-${entry.id}`}>
                <TextArea
                  id={`import-project-desc-${entry.id}`}
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
        title={t.sections.certifications}
        addLabel={t.importer.addCertification}
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
          <p className="text-sm text-slate-500">{t.editor.empty.certifications}</p>
        ) : null}
        {state.certifications.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={format(t.importer.certificationN, { n: index + 1 })}
            onRemove={() =>
              update({
                certifications: state.certifications.filter(
                  (item) => item.id !== entry.id,
                ),
              })
            }
          >
            <FormField label={t.editor.fields.name} htmlFor={`import-cert-name-${entry.id}`}>
              <TextInput
                id={`import-cert-name-${entry.id}`}
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
            <FormField label={t.editor.fields.issuer} htmlFor={`import-cert-issuer-${entry.id}`}>
              <TextInput
                id={`import-cert-issuer-${entry.id}`}
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
            <FormField label={t.editor.fields.date} htmlFor={`import-cert-date-${entry.id}`}>
              <TextInput
                id={`import-cert-date-${entry.id}`}
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
            <FormField label={t.editor.fields.url} htmlFor={`import-cert-url-${entry.id}`}>
              <TextInput
                id={`import-cert-url-${entry.id}`}
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
        title={t.sections.languages}
        addLabel={t.importer.addLanguage}
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
          <p className="text-sm text-slate-500">{t.editor.empty.languages}</p>
        ) : null}
        {state.languages.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={format(t.importer.languageN, { n: index + 1 })}
            onRemove={() =>
              update({
                languages: state.languages.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label={t.editor.fields.language} htmlFor={`import-lang-${entry.id}`}>
              <TextInput
                id={`import-lang-${entry.id}`}
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
            <FormField label={t.editor.fields.proficiency} htmlFor={`import-lang-level-${entry.id}`}>
              <TextInput
                id={`import-lang-level-${entry.id}`}
                placeholder={t.editor.fields.proficiencyPlaceholder}
                value={entry.proficiency}
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
    </div>
  );
}
