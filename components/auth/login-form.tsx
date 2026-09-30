"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { AuthDivider } from "@/components/ui/auth-divider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export type LoginFormProps = {
  callbackUrl?: string;
  idPrefix?: string;
  showRegisteredBanner?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
};

export function LoginForm({
  callbackUrl: callbackUrlProp,
  idPrefix = "",
  showRegisteredBanner,
  onSuccess,
  submitLabel = "Login",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    callbackUrlProp ?? searchParams.get("callbackUrl") ?? "/dashboard";
  const registered =
    showRegisteredBanner ?? searchParams.get("registered") === "1";

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailId = `${idPrefix}email`;
  const passwordId = `${idPrefix}password`;

  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    onSuccess?.();
    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {registered ? (
        <FormMessage variant="info">
          Account created. Sign in to continue.
        </FormMessage>
      ) : null}
      {error ? <FormMessage>{error}</FormMessage> : null}

      <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
        <Field label="Email" htmlFor={emailId}>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password" htmlFor={passwordId}>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          loadingText={submitLabel}
        >
          {submitLabel}
        </Button>
      </form>

      <AuthDivider />

      <GoogleSignInButton
        callbackUrl={callbackUrl}
        disabled={isSubmitting}
        onStart={() => setError(null)}
      />
    </div>
  );
}
