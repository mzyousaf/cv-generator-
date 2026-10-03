"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

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
  const { t } = useI18n();
  const isLogin = view === "login";

  return (
    <p className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
      {isLogin ? (
        <>
          {t.auth.noAccount}{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => onSwitch("signup")}
          >
            {t.auth.createOne}
          </Button>
        </>
      ) : (
        <>
          {t.auth.haveAccount}{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => onSwitch("login")}
          >
            {t.common.signIn}
          </Button>
        </>
      )}
    </p>
  );
}

export function AuthModal() {
  const { t } = useI18n();
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
      title={isLogin ? t.auth.modalLoginTitle : t.auth.modalSignupTitle}
      description={
        isLogin ? t.auth.modalLoginDescription : t.auth.modalSignupDescription
      }
      className="sm:max-w-md"
      closeButtonRef={closeButtonRef}
    >
      {isLogin ? (
        <Suspense
          fallback={
            <p className="flex items-center gap-2 text-sm text-slate-500" role="status">
              <Spinner className="size-4 text-slate-400" />
              {t.common.loading}
            </p>
          }
        >
          <LoginForm
            idPrefix="modal-login-"
            callbackUrl="/dashboard"
            onSuccess={closeAuthModal}
            submitLabel={t.common.signIn}
          />
        </Suspense>
      ) : (
        <SignupForm
          idPrefix="modal-signup-"
          mode="modal"
          callbackUrl="/dashboard"
          onSuccess={closeAuthModal}
          submitLabel={t.common.createCvFree}
        />
      )}

      <AuthModalSwitch view={view} onSwitch={setView} />
    </Modal>
  );
}
