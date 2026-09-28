type AiSuggestionPanelProps = {
  title: string;
  content: string;
  onUse: () => void;
  onDismiss: () => void;
  useLabel?: string;
};

export function AiSuggestionPanel({
  title,
  content,
  onUse,
  onDismiss,
  useLabel = "Use",
}: AiSuggestionPanelProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{content}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUse}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {useLabel}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
