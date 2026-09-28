import Link from "next/link";

export type SaveStatus = "saved" | "unsaved" | "saving";

type BuilderHeaderProps = {
  title: string;
  onTitleChange: (value: string) => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  onSave: () => void;
  isSaving: boolean;
  onExportPdf: () => void;
  isExporting: boolean;
};

function SaveStatusLabel({
  saveStatus,
  saveError,
}: {
  saveStatus: SaveStatus;
  saveError: string | null;
}) {
  if (saveError) {
    return <span className="text-sm font-medium text-red-700">{saveError}</span>;
  }

  switch (saveStatus) {
    case "saving":
      return <span className="text-sm text-zinc-600">Saving...</span>;
    case "saved":
      return <span className="text-sm text-emerald-700">Saved</span>;
    case "unsaved":
      return <span className="text-sm text-amber-700">Unsaved changes</span>;
    default:
      return null;
  }
}

export function BuilderHeader({
  title,
  onTitleChange,
  saveStatus,
  saveError,
  onSave,
  isSaving,
  onExportPdf,
  isExporting,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/dashboard"
            className="shrink-0 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Dashboard
          </Link>
          <label className="sr-only" htmlFor="cv-title">
            CV title
          </label>
          <input
            id="cv-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-lg font-semibold text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveStatusLabel saveStatus={saveStatus} saveError={saveError} />
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExporting || isSaving}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isExporting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}
