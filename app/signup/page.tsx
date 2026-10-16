import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getServerDictionary } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo-server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return pageMetadata({ title: t.auth.signupTitle, description: `${t.auth.signupDescription} ${t.cta.note}`, path: "/signup" });
}

export default async function SignupPage() {
  const t = await getServerDictionary();

  return (
    <AuthShell
      title={t.auth.signupTitle}
      description={t.auth.signupDescription}
      footer={
        <>
          {t.auth.haveAccount} <AuthLink href="/login">{t.common.signIn}</AuthLink>
        </>
      }
    >
      <SignupForm mode="page" />
    </AuthShell>
  );
}
