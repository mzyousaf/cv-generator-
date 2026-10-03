"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
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

type FeatureKey = "ai" | "editor" | "templates" | "pdf" | "autosave" | "switch";

type Feature = {
  key: FeatureKey;
  icon: ReactNode;
  featured?: boolean;
};

const features: Feature[] = [
  { key: "ai", icon: <AiIcon />, featured: true },
  { key: "editor", icon: <BuilderIcon /> },
  { key: "templates", icon: <TemplateIcon /> },
  { key: "pdf", icon: <PdfIcon /> },
  { key: "autosave", icon: <SaveIcon /> },
  { key: "switch", icon: <LayoutsIcon />, featured: true },
];

export function FeaturesSection() {
  const { t } = useI18n();
  return (
    <section id="features" className="relative scroll-mt-24 overflow-hidden bg-background py-24 sm:py-32">
      <div
        className="absolute inset-x-0 top-0 -z-0 h-96 bg-dots-soft [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          description={t.features.description}
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li
              key={feature.key}
              className={cn(
                feature.featured && index === 0 && "lg:col-span-2",
                feature.featured && index === features.length - 1 && "sm:col-span-2 lg:col-span-3",
              )}
            >
              <div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1",
                  feature.featured
                    ? "border-blue-200/60 bg-gradient-to-br from-surface via-surface to-blue-50/80 shadow-soft hover:shadow-lift"
                    : "border-slate-200/70 bg-surface shadow-soft hover:border-blue-200/70 hover:shadow-lift",
                )}
              >
                {feature.featured ? (
                  <div
                    className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-gradient-to-br from-blue-300/30 to-blue-200/20 blur-3xl"
                    aria-hidden="true"
                  />
                ) : null}
                {feature.icon}
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-950">
                  {t.features.items[feature.key].title}
                </h3>
                <p className="mt-2 max-w-md flex-1 text-[0.95rem] leading-relaxed text-slate-500">
                  {t.features.items[feature.key].description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
