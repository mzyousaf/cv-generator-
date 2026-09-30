import { CreateCvForm } from "@/components/cv-builder/create-cv-form";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { ResumeEmptyState } from "@/components/dashboard/resume-empty-state";
import { ResumeUploadDropzone } from "@/components/dashboard/resume-upload-dropzone";
import { FormMessage } from "@/components/ui/form-message";
import type { CvRecord } from "@/lib/cv/serialize";

type ResumesWorkspaceProps = {
  resumes: CvRecord[];
  listError: string | null;
};

export function ResumesWorkspace({ resumes, listError }: ResumesWorkspaceProps) {
  const sortedResumes = [...resumes].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const hasResumes = sortedResumes.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Resumes
          </h1>
          <p className="text-base text-slate-600">
            Create a new resume or continue working on an existing one.
          </p>
        </div>
        <div className="shrink-0">
          <CreateCvForm
            buttonLabel="+ Create New Resume"
            size="md"
            className="sm:pt-1"
          />
        </div>
      </header>

      <section className="mt-8 space-y-8">
        <ResumeUploadDropzone />

        {listError ? <FormMessage>{listError}</FormMessage> : null}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Your resumes</h2>

          {!hasResumes ? (
            <ResumeEmptyState />
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
