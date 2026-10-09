"use client";

import { useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  CreateCvModal,
  type CreateCvMode,
} from "@/components/dashboard/create-cv-modal";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

type CreateCvFormProps = {
  buttonLabel?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  /** Which option the create dialog opens on. */
  initialMode?: CreateCvMode;
  leftIcon?: ReactNode;
};

/** Button that opens the "Create a new CV" dialog (describe with AI, import, blank). */
export function CreateCvForm({
  buttonLabel,
  size = "md",
  variant = "primary",
  className,
  initialMode = "describe",
  leftIcon,
}: CreateCvFormProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        leftIcon={leftIcon}
        onClick={() => setOpen(true)}
      >
        {buttonLabel ?? t.dashboard.createNew}
      </Button>
      {open ? <CreateCvModal initialMode={initialMode} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}
