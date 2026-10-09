"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { localizeServerMessage } from "@/lib/i18n/server-messages";
import { CreateCvForm } from "@/components/cv-builder/create-cv-form";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { ResumeEmptyState } from "@/components/dashboard/resume-empty-state";
import { ResumeUploadDropzone } from "@/components/dashboard/resume-upload-dropzone";
import { PlusIcon, UploadIcon } from "@/components/dashboard/icons";
import { FormMessage } from "@/components/ui/form-message";
import type { CvRecord } from "@/lib/cv/serialize";

type ResumesWorkspaceProps = {
  resumes: CvRecord[];
  listError: string | null;
};

export function ResumesWorkspace({ resumes, listError }: ResumesWorkspaceProps) {
  const { t, locale } = useI18n();
  const sortedResumes = [...resumes].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const hasResumes = sortedResumes.length > 0;

  const lastEdited = sortedResumes[0]
    ? new Date(sortedResumes[0].updatedAt).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <header className="scheme-light relative isolate overflow-hidden rounded-[1.75rem] bg-ink-mesh px-6 py-8 text-white shadow-[0_30px_70px_-35px_color-mix(in_oklab,var(--brand-900)_70%,transparent)] sm:px-10 sm:py-10">
        <div
          className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              {t.dashboard.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              {t.dashboard.title}
            </h1>
            <p className="mt-2 text-base text-slate-300">
              {t.dashboard.subtitle}
            </p>
          </div>
          {/* Full-width, equal buttons on phones; side by side from sm. */}
          <div className="grid shrink-0 grid-cols-1 gap-2.5 sm:flex sm:flex-wrap [&_button]:w-full sm:[&_button]:w-auto">
            <CreateCvForm
              buttonLabel={t.dashboard.createNew}
              size="lg"
              variant="inverse"
              leftIcon={<PlusIcon className="size-4" />}
            />
            <CreateCvForm
              buttonLabel={t.dashboard.importCv}
              size="lg"
              variant="outline"
              initialMode="import"
              leftIcon={<UploadIcon className="size-4" />}
              className="[&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:bg-white/20"
            />
          </div>
        </div>
        <dl className="mt-8 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t.dashboard.statResumes}
            </dt>
            <dd className="mt-1 text-2xl font-bold">{sortedResumes.length}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t.dashboard.statLastEdited}
            </dt>
            <dd className="mt-1 whitespace-nowrap text-2xl font-bold">{lastEdited}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-8 space-y-8">
        {/* With no resumes yet, the empty state below carries the import action. */}
        {hasResumes ? <ResumeUploadDropzone /> : null}

        {listError ? <FormMessage>{localizeServerMessage(t, listError)}</FormMessage> : null}

        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">{t.dashboard.yourResumes}</h2>
            {hasResumes ? (
              <p className="text-sm text-slate-500">{t.dashboard.sortedBy}</p>
            ) : null}
          </div>

          {!hasResumes ? (
            <ResumeEmptyState />
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedResumes.map((resume) => (
                <li key={resume.id} className="min-w-0">
                  <ResumeCard
                    title={resume.title}
                    template={resume.template}
                    updatedAt={resume.updatedAt}
                    content={resume.content}
                    editHref={`/dashboard/cv/${resume.id}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
