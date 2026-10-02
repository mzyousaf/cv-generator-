"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCvAction } from "@/lib/cv/actions";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

type CreateCvFormProps = {
  buttonLabel?: string;
  loadingText?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
};

export function CreateCvForm({
  buttonLabel = "Create new CV",
  loadingText = "Creating…",
  size = "md",
  variant = "primary",
  className,
}: CreateCvFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (isCreating) {
      return;
    }
    setIsCreating(true);
    setError(null);

    const result = await createCvAction({});
    setIsCreating(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    router.push(`/dashboard/cv/${result.data.id}`);
  }

  return (
    <div className={`space-y-2 ${className ?? ""}`.trim()}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => void handleCreate()}
        isLoading={isCreating}
        loadingText={loadingText}
      >
        {buttonLabel}
      </Button>
      {error ? <FormMessage>{error}</FormMessage> : null}
    </div>
  );
}
