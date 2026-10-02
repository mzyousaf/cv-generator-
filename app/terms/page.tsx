import type { Metadata } from "next";
import { LegalDocumentBody } from "@/components/legal/legal-document";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { siteConfig } from "@/lib/constants";
import { format } from "@/lib/i18n/format";
import { getPreferences } from "@/lib/i18n/server";
import { TERMS_AND_CONDITIONS } from "@/lib/legal/terms";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  const doc = TERMS_AND_CONDITIONS[locale];
  return {
    title: `${doc.title} | ${siteConfig.name}`,
    description: format(doc.description, { name: siteConfig.name }),
  };
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
