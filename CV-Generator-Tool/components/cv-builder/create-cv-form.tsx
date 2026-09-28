"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCvAction } from "@/lib/cv/actions";

export function CreateCvForm() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
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
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleCreate()}
        disabled={isCreating}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {isCreating ? "Creating..." : "Create new CV"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
