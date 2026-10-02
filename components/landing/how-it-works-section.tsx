import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    step: "01",
    title: "Build",
    description:
      "Create your CV with an easy structured editor, or import an existing PDF or DOCX.",
  },
  {
    step: "02",
    title: "Improve",
    description:
      "Use AI to refine your summary, experience, and skills until every line lands.",
  },
  {
    step: "03",
    title: "Download",
    description:
      "Choose your template and download a polished PDF, ready to send.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-slate-200/70 bg-gradient-to-b from-white to-slate-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From blank page to offer-ready in three steps"
          description="Create an account, work in the builder, and export when your CV is ready to send."
        />

        <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div
            className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block"
            aria-hidden="true"
          />
          {steps.map((item) => (
            <li key={item.step} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 inline-flex size-16 items-center justify-center rounded-2xl bg-white text-lg font-bold text-blue-600 shadow-lift ring-1 ring-blue-100">
                <span className="absolute inset-1 rounded-xl bg-gradient-to-br from-blue-50 to-fuchsia-50" aria-hidden="true" />
                <span className="relative">{item.step}</span>
              </span>
              <p className="mt-6 text-xl font-bold tracking-tight text-slate-950">
                {item.title}
              </p>
              <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-slate-500">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
