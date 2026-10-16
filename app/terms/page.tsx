import type { Metadata } from "next";
import { LegalDocumentBody } from "@/components/legal/legal-document";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { siteConfig } from "@/lib/constants";
import { format } from "@/lib/i18n/format";
import { getPreferences } from "@/lib/i18n/server";
import { TERMS_AND_CONDITIONS } from "@/lib/legal/terms";
import { pageMetadata } from "@/lib/seo-server";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  const doc = TERMS_AND_CONDITIONS[locale];
  // The root layout's title template appends the brand; the free note makes the
  // description a useful length for search snippets.
  return pageMetadata({
    title: doc.title,
    description: `${format(doc.description, { name: siteConfig.name })} ${getDictionary(locale).cta.note}.`,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const { locale } = await getPreferences();
  const doc = TERMS_AND_CONDITIONS[locale];

  return (
    <LegalPageLayout title={doc.title}>
      <LegalDocumentBody blocks={doc.blocks} />
    </LegalPageLayout>
  );
}
