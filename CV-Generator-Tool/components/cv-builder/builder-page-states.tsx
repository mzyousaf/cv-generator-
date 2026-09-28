import Link from "next/link";
import type { CvErrorCode } from "@/lib/cv/errors";
import { CV_ERROR_MESSAGES } from "@/lib/cv/errors";

export function BuilderLoadingState() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-6">
      <p className="text-sm text-zinc-600">Loading CV builder...</p>
    </main>
  );
}

export function BuilderErrorState({ code }: { code: CvErrorCode }) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Unable to open CV</h1>
        <p className="text-zinc-600">{CV_ERROR_MESSAGES[code]}</p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
