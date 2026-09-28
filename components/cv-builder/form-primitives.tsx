import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
};

export function FormField({
  label,
  htmlFor,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-800">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200";

export function TextInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return <input id={id} className={inputClassName} {...props} />;
}

export function TextArea({
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return (
    <textarea
      id={id}
      className={`${inputClassName} min-h-24 resize-y`}
      {...props}
    />
  );
}

export function SectionCard({
  title,
  description,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            {addLabel ?? "Add"}
          </button>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function EntryCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-red-700 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
