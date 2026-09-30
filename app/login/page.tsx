import { Suspense } from "react";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      description="Access your CV Generator account."
      footer={
        <>
          Need an account? <AuthLink href="/signup">Create one</AuthLink>
        </>
      }
    >
      <Suspense
        fallback={
          <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
            Loading…
          </p>
        }
      >
        <LoginForm submitLabel="Sign in" />
      </Suspense>
    </AuthShell>
  );
}
