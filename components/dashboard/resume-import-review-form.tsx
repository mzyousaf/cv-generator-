"use client";

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
  function update(partial: Partial<CvBuilderFormState>) {
    onChange({ ...state, ...partial });
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      <SectionCard title="Resume title">
        <FormField label="Title" htmlFor="import-resume-title">
          <TextInput
            id="import-resume-title"
            value={state.title}
            placeholder="Imported Resume"
            onChange={(event) => update({ title: event.target.value })}
          />
        </FormField>
        <p className="text-xs text-slate-500">
          Shown on your dashboard. Default uses your name when available.
        </p>
      </SectionCard>

      <SectionCard title="Personal information">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="import-fullName">
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
          <FormField label="Professional title" htmlFor="import-title">
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
          <FormField label="Email" htmlFor="import-email">
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
          <FormField label="Phone" htmlFor="import-phone">
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
          <FormField label="Location" htmlFor="import-location">
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
          <FormField label="Website" htmlFor="import-website">
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
          <FormField label="LinkedIn" htmlFor="import-linkedin">
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

      <SectionCard title="Professional summary">
        <FormField label="Summary" htmlFor="import-summary">
          <TextArea
            id="import-summary"
            value={state.summary}
            onChange={(event) => update({ summary: event.target.value })}
          />
        </FormField>
      </SectionCard>

      <SectionCard
        title="Work experience"
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
          <p className="text-sm text-slate-500">No work experience entries yet.</p>
        ) : null}
        {state.workExperience.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Experience ${index + 1}`}
            onRemove={() =>
              update({
                workExperience: state.workExperience.filter(
                  (item) => item.id !== entry.id,
                ),
              })
            }
          >
            <FormField label="Job title" htmlFor={`import-work-title-${entry.id}`}>
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
            <FormField label="Company" htmlFor={`import-work-company-${entry.id}`}>
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
            <FormField label="Location" htmlFor={`import-work-location-${entry.id}`}>
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
            <FormField label="Start date" htmlFor={`import-work-start-${entry.id}`}>
              <TextInput
                id={`import-work-start-${entry.id}`}
                placeholder="e.g. Jan 2023 or 2022"
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
            <FormField label="End date" htmlFor={`import-work-end-${entry.id}`}>
              <TextInput
                id={`import-work-end-${entry.id}`}
                placeholder="e.g. Present or 2024"
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
              <FormField label="Description" htmlFor={`import-work-desc-${entry.id}`}>
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
          <p className="text-sm text-slate-500">No education entries yet.</p>
        ) : null}
        {state.education.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Education ${index + 1}`}
            onRemove={() =>
              update({
                education: state.education.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label="Degree" htmlFor={`import-edu-degree-${entry.id}`}>
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
            <FormField label="Institution" htmlFor={`import-edu-inst-${entry.id}`}>
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
            <FormField label="Location" htmlFor={`import-edu-location-${entry.id}`}>
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
            <FormField label="Start date" htmlFor={`import-edu-start-${entry.id}`}>
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
            <FormField label="End date" htmlFor={`import-edu-end-${entry.id}`}>
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
              <FormField label="Description" htmlFor={`import-edu-desc-${entry.id}`}>
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
        title="Skills"
        addLabel="Add skill"
        onAdd={() => update({ skills: [...state.skills, ""] })}
      >
        {state.skills.length === 0 ? (
          <p className="text-sm text-slate-500">No skills yet.</p>
        ) : null}
        {state.skills.map((skill, index) => (
          <div key={`import-skill-${index}`} className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <FormField label={`Skill ${index + 1}`} htmlFor={`import-skill-${index}`}>
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
              Remove
            </Button>
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
          <p className="text-sm text-slate-500">No projects yet.</p>
        ) : null}
        {state.projects.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Project ${index + 1}`}
            onRemove={() =>
              update({
                projects: state.projects.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label="Project name" htmlFor={`import-project-name-${entry.id}`}>
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
            <FormField label="URL" htmlFor={`import-project-url-${entry.id}`}>
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
              <FormField label="Description" htmlFor={`import-project-desc-${entry.id}`}>
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
          <p className="text-sm text-slate-500">No certifications yet.</p>
        ) : null}
        {state.certifications.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Certification ${index + 1}`}
            onRemove={() =>
              update({
                certifications: state.certifications.filter(
                  (item) => item.id !== entry.id,
                ),
              })
            }
          >
            <FormField label="Name" htmlFor={`import-cert-name-${entry.id}`}>
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
            <FormField label="Issuer" htmlFor={`import-cert-issuer-${entry.id}`}>
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
            <FormField label="Date" htmlFor={`import-cert-date-${entry.id}`}>
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
            <FormField label="URL" htmlFor={`import-cert-url-${entry.id}`}>
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
          <p className="text-sm text-slate-500">No languages yet.</p>
        ) : null}
        {state.languages.map((entry, index) => (
          <EntryCard
            key={entry.id}
            title={`Language ${index + 1}`}
            onRemove={() =>
              update({
                languages: state.languages.filter((item) => item.id !== entry.id),
              })
            }
          >
            <FormField label="Language" htmlFor={`import-lang-${entry.id}`}>
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
            <FormField label="Proficiency" htmlFor={`import-lang-level-${entry.id}`}>
              <TextInput
                id={`import-lang-level-${entry.id}`}
                placeholder="Native, Professional, Intermediate"
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
