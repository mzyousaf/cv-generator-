import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPreferences } from "@/lib/i18n/server";
import { homeSchema } from "@/lib/seo-schema";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  const title = `${siteConfig.name} · ${t.meta.title}`;
  return {
    // Absolute: the home page leads with the brand instead of the layout's suffix.
    title: { absolute: title },
    description: t.meta.description,
    keywords: [
      "free CV builder",
      "free resume builder",
      "CV templates",
      "resume templates",
      "ATS-friendly CV",
      "AI CV writer",
      "CV maker",
      "Europass CV",
      "Lebenslauf",
      "CV PDF",
      siteConfig.name,
    ],
    alternates: { canonical: "/" },
    openGraph: { title, description: t.meta.description, url: "/" },
    twitter: { title, description: t.meta.description },
  };
}

export default async function Home() {
  const { locale } = await getPreferences();
  return (
    <>
      <JsonLd data={homeSchema(getDictionary(locale), locale)} />
      <LandingPage />
    </>
  );
}
