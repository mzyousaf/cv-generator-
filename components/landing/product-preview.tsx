import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { TEMPLATE_PREVIEW_SAMPLE_STATE } from "@/components/cv-templates/sample-preview-state";
import { CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";

const templateLabels: Record<CvTemplateId, string> = {
  default: "Default",
  classic: "Classic",
  modern: "Modern",
};

const activePreviewTemplate: CvTemplateId = "modern";

export function ProductPreview() {
  const sample = TEMPLATE_PREVIEW_SAMPLE_STATE;

  return (
    <div
      className="mx-auto w-full max-w-xl lg:max-w-none"
      aria-label="CV Generator product preview (demo data)"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500">
              CV Generator
            </p>
            <p className="truncate text-sm font-semibold text-slate-900">
              {sample.title}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
            Saved
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-5">
          <div className="border-b border-slate-200 bg-white p-3 sm:p-4 lg:col-span-2 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Template
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CV_TEMPLATE_IDS.map((id) => {
                const isActive = id === activePreviewTemplate;
                return (
                  <span
                    key={id}
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-blue-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {templateLabels[id]}
                  </span>
                );
              })}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Editor
            </p>
            <div className="mt-2 space-y-3">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Full name</p>
                <p className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800">
                  {sample.personal.fullName}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Title</p>
                <p className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800">
                  {sample.personal.professionalTitle}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Summary</p>
                <p className="mt-0.5 line-clamp-3 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs leading-relaxed text-slate-700">
                  {sample.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {sample.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-900 ring-1 ring-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                AI assist · PDF export available in builder
              </p>
            </div>
          </div>

          <div className="bg-slate-100/80 p-2 sm:p-3 lg:col-span-3">
            <p className="mb-2 px-1 text-xs font-medium text-slate-500">
              Live preview
            </p>
            <div className="relative h-[280px] w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-[320px] lg:h-[360px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1 origin-top -translate-x-1/2 select-none scale-[0.28] sm:scale-[0.32] lg:scale-[0.36]"
                aria-hidden="true"
              >
                <CvTemplateRenderer
                  templateId={activePreviewTemplate}
                  state={{
                    ...sample,
                    template: activePreviewTemplate,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
