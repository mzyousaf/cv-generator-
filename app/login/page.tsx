import { Suspense } from "react";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function LoginPage() {
  const t = await getServerDictionary();

  return (
    <AuthShell
      title={t.auth.loginTitle}
      description={t.auth.loginDescription}
      footer={
        <>
          {t.auth.needAccount} <AuthLink href="/signup">{t.auth.createOne}</AuthLink>
        </>
      }
    >
      <Suspense
        fallback={
          <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
            {t.common.loading}
          </p>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
