"use client";

import { signIn } from "next-auth/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { registerUser, type RegisterUserState } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { AuthDivider } from "@/components/ui/auth-divider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

const initialState: RegisterUserState = {};

export type SignupFormProps = {
  callbackUrl?: string;
  idPrefix?: string;
  onSuccess?: () => void;
  /** After signup on standalone pages, redirect to login. In modal, sign in and go to dashboard. */
  mode?: "page" | "modal";
  submitLabel?: string;
};

export function SignupForm({
  callbackUrl = "/dashboard",
  idPrefix = "",
  onSuccess,
  mode = "page",
  submitLabel = "Create account",
}: SignupFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );
  const pendingCredentials = useRef<{ email: string; password: string } | null>(
    null,
  );
  const [oauthBusy, setOauthBusy] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const nameId = `${idPrefix}name`;
  const emailId = `${idPrefix}email`;
  const passwordId = `${idPrefix}password`;

  useEffect(() => {
    if (!state.success) {
      return;
    }

    if (mode === "page") {
      router.push("/login?registered=1");
      return;
    }

    const credentials = pendingCredentials.current;
    if (!credentials) {
      return;
    }

    let cancelled = false;

    async function completeSignupSignIn() {
      const result = await signIn("credentials", {
        email: credentials!.email,
        password: credentials!.password,
        redirect: false,
        callbackUrl,
      });

      if (cancelled) {
        return;
      }

      if (result?.error) {
        setSignInError(
          "Account created. Please sign in with your email and password.",
        );
        return;
      }

      onSuccess?.();
      router.push(result?.url ?? callbackUrl);
      router.refresh();
    }

    void completeSignupSignIn();

    return () => {
      cancelled = true;
    };
  }, [state.success, mode, router, callbackUrl, onSuccess]);

  function handleFormAction(formData: FormData) {
    setSignInError(null);
    pendingCredentials.current = {
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") ?? ""),
    };
    formAction(formData);
  }

  const busy = isPending || oauthBusy;

  return (
    <div className="space-y-5">
      {state.error ? <FormMessage>{state.error}</FormMessage> : null}
      {signInError ? <FormMessage>{signInError}</FormMessage> : null}

      <form action={handleFormAction} className="space-y-4">
        <Field label="Name" htmlFor={nameId}>
          <Input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Email" htmlFor={emailId}>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password" htmlFor={passwordId} hint="At least 8 characters">
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={busy && isPending}
          loadingText={submitLabel}
          disabled={busy}
        >
          {submitLabel}
        </Button>
      </form>

      <AuthDivider />

      <GoogleSignInButton
        callbackUrl={callbackUrl}
        disabled={busy}
        onStart={() => {
          setOauthBusy(true);
          setSignInError(null);
        }}
      />
    </div>
  );
}
