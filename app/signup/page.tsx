import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.auth.signupTitle,
    description: t.cta.note,
    alternates: { canonical: "/signup" },
  };
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
