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
  default: "Balanced layout for most roles and industries.",
  classic: "Traditional structure with clear section hierarchy.",
  modern: "Contemporary spacing with a polished header.",
};

export function TemplatesSection() {
  return (
    <section id="templates" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Templates"
          title="Three professional CV layouts"
          description="Same sample content, different presentation—pick the template that fits your application."
        />

        <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CV_TEMPLATE_IDS.map((templateId) => (
            <li
              key={templateId}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {templateLabels[templateId]}
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Preview
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {templateDescriptions[templateId]}
              </p>
              <TemplateMiniPreview
                templateId={templateId}
                className="mt-4"
                heightClass="h-[300px] sm:h-[340px]"
                scale={0.34}
              />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="max-w-lg text-sm text-slate-600">
            Start with any template—you can switch layouts anytime without
            re-entering your content.
          </p>
          <GenerateFreeButton>Create your CV</GenerateFreeButton>
        </div>
      </div>
    </section>
  );
}
