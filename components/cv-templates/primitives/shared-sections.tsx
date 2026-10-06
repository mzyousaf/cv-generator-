import type { ReactNode } from "react";
import type { CvDocumentView } from "@/components/cv-templates/view-model";

export function EmptyDocumentHint({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <p className={`text-sm italic text-zinc-500 ${className}`}>{text}</p>;
}

export function ContactLine({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p className={`leading-relaxed ${className}`}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 ? " · " : null}
          <bdi>{item}</bdi>
        </span>
      ))}
    </p>
  );
}

export function SectionHeading({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return <h2 className={className}>{title}</h2>;
}

export function SummaryBlock({
  summary,
  className = "",
}: {
  summary: string;
  className?: string;
}) {
  if (!summary.trim()) {
    return null;
  }

  return <p className={`whitespace-pre-wrap ${className}`}>{summary}</p>;
}

export function WorkExperienceList({
  entries,
  titleClassName,
  metaClassName,
  bodyClassName,
  dateClassName,
}: {
  entries: CvDocumentView["workExperience"];
  titleClassName: string;
  metaClassName: string;
  bodyClassName: string;
  dateClassName: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={titleClassName}>{entry.jobTitle || "Job Title"}</h3>
              <p className={metaClassName}>
                {[entry.company, entry.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className={dateClassName}>
              {entry.dates}
            </p>
          </div>
          {entry.description.trim() ? (
            <p className={`mt-1 whitespace-pre-wrap ${bodyClassName}`}>
              {entry.description}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function EducationList({
  entries,
  titleClassName,
  metaClassName,
  bodyClassName,
  dateClassName,
}: {
  entries: CvDocumentView["education"];
  titleClassName: string;
  metaClassName: string;
  bodyClassName: string;
  dateClassName: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={titleClassName}>{entry.degree || "Degree"}</h3>
              <p className={metaClassName}>
                {[entry.institution, entry.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className={dateClassName}>
              {entry.dates}
            </p>
          </div>
          {entry.description.trim() ? (
            <p className={`mt-1 whitespace-pre-wrap ${bodyClassName}`}>
              {entry.description}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function SkillsBlock({
  skills,
  className = "",
}: {
  skills: string[];
  className?: string;
}) {
  if (skills.length === 0) {
    return null;
  }

  return <p className={className}>{skills.join(" · ")}</p>;
}

export function ProjectsList({
  entries,
  titleClassName,
  urlClassName,
  bodyClassName,
}: {
  entries: CvDocumentView["projects"];
  titleClassName: string;
  urlClassName: string;
  bodyClassName: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3 className={titleClassName}>{entry.name || "Project"}</h3>
          {entry.url ? <p className={urlClassName}>{entry.url}</p> : null}
          {entry.description.trim() ? (
            <p className={`mt-1 whitespace-pre-wrap ${bodyClassName}`}>
              {entry.description}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function CertificationsList({
  entries,
  titleClassName,
  metaClassName,
  urlClassName,
}: {
  entries: CvDocumentView["certifications"];
  titleClassName: string;
  metaClassName: string;
  urlClassName: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3 className={titleClassName}>{entry.name || "Certification"}</h3>
          <p className={metaClassName}>
            {[entry.issuer, entry.dates].filter(Boolean).join(" · ")}
          </p>
          {entry.url ? <p className={urlClassName}>{entry.url}</p> : null}
        </div>
      ))}
    </>
  );
}

export function LanguagesList({
  entries,
  rowClassName,
  nameClassName,
  levelClassName,
}: {
  entries: CvDocumentView["languages"];
  rowClassName: string;
  nameClassName: string;
  levelClassName: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1">
      {entries.map((entry) => (
        <li key={entry.id} className={rowClassName}>
          <span className={nameClassName}>{entry.language || "Language"}</span>
          <span className={levelClassName}>{entry.proficiency}</span>
        </li>
      ))}
    </ul>
  );
}

export function CvSection({
  title,
  headingClassName,
  bodyClassName,
  children,
}: {
  title: string;
  headingClassName: string;
  bodyClassName: string;
  children: ReactNode;
}) {
  if (!children) {
    return null;
  }

  return (
    <section className={bodyClassName}>
      <SectionHeading title={title} className={headingClassName} />
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
