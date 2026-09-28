import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { SectionHeading } from "@/components/landing/section-heading";
import { TemplateMiniPreview } from "@/components/landing/template-mini-preview";

const templateLabels: Record<(typeof CV_TEMPLATE_IDS)[number], string> = {
  default: "Default",
  classic: "Classic",
  modern: "Modern",
};

const templateDescriptions: Record<(typeof CV_TEMPLATE_IDS)[number], string> = {
  default: "Balanced layout that works for most roles.",
  classic: "Traditional sections with clear hierarchy.",
  modern: "Clean spacing and a polished header.",
};

export function TemplatesSection() {
  return (
    <section id="templates" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Templates"
          title="Professional layouts, same content"
          description="Preview three print-friendly templates with real sample data—switch anytime without retyping."
        />

        <ul className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {CV_TEMPLATE_IDS.map((templateId) => (
            <li
              key={templateId}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <TemplateMiniPreview
                templateId={templateId}
                className="rounded-none border-0 border-b border-slate-200 bg-slate-100/90"
                heightClass="h-[260px] sm:h-[300px] lg:h-[320px]"
                scale={0.36}
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  {templateLabels[templateId]}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {templateDescriptions[templateId]}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Start with any template in the builder—you can change the layout
            later and keep your content.
          </p>
          <GenerateFreeButton />
        </div>
      </div>
    </section>
  );
}
