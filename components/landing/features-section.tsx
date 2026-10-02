import {
  AiIcon,
  BuilderIcon,
  LayoutsIcon,
  PdfIcon,
  SaveIcon,
  TemplateIcon,
} from "@/components/landing/feature-icons";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
  featured?: boolean;
};

const features: Feature[] = [
  {
    title: "AI content assist",
    description:
      "Turn rough notes into confident, results-driven bullet points. Refine your summary, experience, and skills in one click.",
    icon: <AiIcon />,
    featured: true,
  },
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
    title: "Pixel-perfect PDF",
    description:
      "Export a crisp PDF using the template you selected in the builder.",
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
    featured: true,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative scroll-mt-24 overflow-hidden bg-background py-24 sm:py-32">
      <div
        className="absolute inset-x-0 top-0 -z-0 h-96 bg-dots-soft [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to land the interview"
          description="Editor, templates, AI assist, and PDF export. Thoughtfully designed tools, without the clutter."
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              className={cn(
                feature.featured && index === 0 && "lg:col-span-2",
                feature.featured && index === features.length - 1 && "sm:col-span-2 lg:col-span-3",
              )}
            >
              <div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1",
                  feature.featured
                    ? "border-blue-200/60 bg-gradient-to-br from-white via-white to-blue-50/80 shadow-soft hover:shadow-lift"
                    : "border-slate-200/70 bg-white shadow-soft hover:border-blue-200/70 hover:shadow-lift",
                )}
              >
                {feature.featured ? (
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br from-blue-300/30 to-fuchsia-300/20 blur-3xl"
                    aria-hidden="true"
                  />
                ) : null}
                {feature.icon}
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-md flex-1 text-[0.95rem] leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
