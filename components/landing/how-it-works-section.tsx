import { SectionHeading } from "@/components/landing/section-heading";
import { Card } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Build",
    description:
      "Create your CV with an easy structured editor.",
  },
  {
    step: "02",
    title: "Improve",
    description:
      "Use AI to refine your summary, experience, and skills.",
  },
  {
    step: "03",
    title: "Download",
    description:
      "Choose your template and download your CV as a PDF.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-slate-200 bg-slate-50/80 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from draft to download"
          description="Create an account, work in the builder, and export when your CV is ready to send."
        />

        <ol className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((item, index) => (
            <li key={item.step} className="relative">
              {index < steps.length - 1 ? (
                <div
                  className="absolute -right-3 top-12 hidden h-px w-6 bg-slate-300 md:block lg:w-8"
                  aria-hidden="true"
                />
              ) : null}
              <Card className="flex h-full flex-col p-7">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
                  {item.step}
                </span>
                <p className="mt-5 text-lg font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
