"use client";

import { Suspense, useRef, useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import {
  useAuthModal,
  type AuthModalView,
} from "@/components/landing/auth-modal-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";

function AuthModalSwitch({
  view,
  onSwitch,
}: {
  view: AuthModalView;
  onSwitch: (view: AuthModalView) => void;
}) {
  const isLogin = view === "login";

  return (
    <p className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
      {isLogin ? (
        <>
          Don&apos;t have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => onSwitch("signup")}
          >
            Create one
          </Button>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => onSwitch("login")}
          >
            Sign in
          </Button>
        </>
      )}
    </p>
  );
}

export function AuthModal() {
  const { isOpen, view, closeAuthModal, setView } = useAuthModal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isLogin = view === "login";

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeButtonRef.current?.focus();
  }, [isOpen, view]);

  return (
    <Modal
      open={isOpen}
      onClose={closeAuthModal}
      title={isLogin ? "Sign in to continue" : "Create your account"}
      description={
        isLogin
          ? "Access your saved CVs and continue building."
          : "Start building your professional CV."
      }
      className="sm:max-w-md"
      closeButtonRef={closeButtonRef}
    >
      {isLogin ? (
        <Suspense
          fallback={
            <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
              <Spinner className="size-4 text-slate-400" />
              Loading…
            </p>
          }
        >
          <LoginForm
            idPrefix="modal-login-"
            callbackUrl="/dashboard"
            onSuccess={closeAuthModal}
            submitLabel="Sign in"
          />
        </Suspense>
      ) : (
        <SignupForm
          idPrefix="modal-signup-"
          mode="modal"
          callbackUrl="/dashboard"
          onSuccess={closeAuthModal}
          submitLabel="Create Your CV Free"
        />
      )}

      <AuthModalSwitch view={view} onSwitch={setView} />
    </Modal>
  );
}
