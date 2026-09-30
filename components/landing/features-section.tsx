import {
  AiIcon,
  BuilderIcon,
  LayoutsIcon,
  PdfIcon,
  SaveIcon,
  TemplateIcon,
} from "@/components/landing/feature-icons";
import { SectionHeading } from "@/components/landing/section-heading";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Structured editor",
    description:
      "Add experience, education, and skills in a clear layout that stays easy to scan.",
    icon: <BuilderIcon />,
  },
  {
    title: "Professional templates",
    description:
      "Default, Classic, and Modern layouts built for readable, print-ready CVs.",
    icon: <TemplateIcon />,
  },
  {
    title: "AI content assist",
    description:
      "Refine your summary, experience, and skills with AI when it is enabled for your workspace.",
    icon: <AiIcon />,
  },
  {
    title: "PDF download",
    description:
      "Export a PDF from your saved CV using the template you selected in the builder.",
    icon: <PdfIcon />,
  },
  {
    title: "Autosave & return anytime",
    description:
      "Your CV stays in your account so you can update it as your experience grows.",
    icon: <SaveIcon />,
  },
  {
    title: "Switch templates freely",
    description:
      "Compare layouts with the same content. Change template without starting over.",
    icon: <LayoutsIcon />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to finish a strong CV"
          description="Editor, templates, AI assist, and PDF export. Focused tools without extra complexity."
        />

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <Card className="group flex h-full flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200/80 hover:shadow-md hover:shadow-slate-200/60">
                {feature.icon}
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
