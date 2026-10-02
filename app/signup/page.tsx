import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start building a standout CV in minutes."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <SignupForm mode="page" submitLabel="Create Your CV Free" />
    </AuthShell>
  );
}
