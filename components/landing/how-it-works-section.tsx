import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    step: "01",
    title: "Build",
    description:
      "Add your experience, education, skills and projects.",
  },
  {
    step: "02",
    title: "Improve",
    description:
      "Use AI assistance to improve summaries and experience descriptions.",
  },
  {
    step: "03",
    title: "Download",
    description:
      "Choose a template and export your CV as a PDF.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From first draft to PDF in three steps"
          description="Sign up, build in the editor, and export when your CV is ready."
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((item, index) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {index < steps.length - 1 ? (
                <div
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-slate-200 md:block"
                  aria-hidden="true"
                />
              ) : null}
              <p className="text-sm font-semibold tracking-wide text-blue-700">
                {item.step} — {item.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
