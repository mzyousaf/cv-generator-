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
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
