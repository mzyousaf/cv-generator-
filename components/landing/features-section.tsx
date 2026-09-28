import {
  AiIcon,
  BuilderIcon,
  LayoutsIcon,
  PdfIcon,
  SaveIcon,
  TemplateIcon,
} from "@/components/landing/feature-icons";
import { SectionHeading } from "@/components/landing/section-heading";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Professional templates",
    description:
      "Default, Classic, and Modern layouts designed for readable, print-friendly CVs.",
    icon: <TemplateIcon />,
  },
  {
    title: "Easy CV builder",
    description:
      "Edit experience, education, and skills in one place with autosave to your account.",
    icon: <BuilderIcon />,
  },
  {
    title: "AI writing assistance",
    description:
      "Improve summaries, experience text, and skills when AI is configured for your workspace.",
    icon: <AiIcon />,
  },
  {
    title: "PDF export",
    description:
      "Download a PDF generated from your saved CV and selected template.",
    icon: <PdfIcon />,
  },
  {
    title: "Save and edit",
    description:
      "Return anytime to update CVs as your role and experience change.",
    icon: <SaveIcon />,
  },
  {
    title: "Multiple CV templates",
    description:
      "Switch templates without losing content—compare layouts before you export.",
    icon: <LayoutsIcon />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Built for real CV workflows"
          description="Everything listed here is available in the product today—templates, builder, AI assist, and PDF export."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              {feature.icon}
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
