import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { TEMPLATE_PREVIEW_SAMPLE_STATE } from "@/components/cv-templates/sample-preview-state";
import { CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";

const templateLabels: Record<CvTemplateId, string> = {
  default: "Default",
  classic: "Classic",
  modern: "Modern",
};

const activePreviewTemplate: CvTemplateId = "modern";

function PreviewField({ label, value, clamp }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-[0_1px_2px_rgb(15_23_42/0.04)] ${
          clamp ? "line-clamp-3 leading-relaxed text-slate-600" : "truncate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function ProductPreview() {
  const sample = TEMPLATE_PREVIEW_SAMPLE_STATE;

  return (
    <div
      className="mx-auto w-full max-w-xl lg:max-w-none"
      aria-label="CV Generator product preview (demo data)"
    >
      <div className="rounded-[1.4rem] border border-white/15 bg-white/[0.07] p-1.5 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)] backdrop-blur">
        <div className="overflow-hidden rounded-[1.1rem] bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200/80 bg-slate-50 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-slate-700">
              {sample.title}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Saved
            </span>
          </div>

          <div className="grid gap-0 sm:grid-cols-5">
            <div className="hidden space-y-3 border-r border-slate-200/80 bg-slate-50/60 p-4 sm:col-span-2 sm:block">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
                {CV_TEMPLATE_IDS.map((id) => (
                  <span
                    key={id}
                    className={`flex-1 rounded-md py-1 text-center text-[10px] font-semibold ${
                      id === activePreviewTemplate
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {templateLabels[id]}
                  </span>
                ))}
              </div>
              <PreviewField label="Full name" value={sample.personal.fullName ?? ""} />
              <PreviewField label="Title" value={sample.personal.professionalTitle ?? ""} />
              <PreviewField label="Summary" value={sample.summary ?? ""} clamp />
              <div className="flex flex-wrap gap-1">
                {sample.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-fuchsia-50 px-2 py-1.5 text-[10px] font-semibold text-blue-800 ring-1 ring-blue-100">
                <span aria-hidden="true">✦</span> Improve with AI
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-200/70 p-3 sm:col-span-3">
              <div className="relative h-[280px] w-full max-w-full overflow-hidden rounded-lg bg-white shadow-[0_12px_30px_-12px_rgb(15_23_42/0.35)] ring-1 ring-slate-200 sm:h-[320px] lg:h-[350px]">
                <div
                  className="pointer-events-none absolute left-1/2 top-0 w-[794px] origin-top -translate-x-1/2 select-none scale-[0.4] sm:scale-[0.34] lg:scale-[0.36]"
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
    </div>
  );
}
