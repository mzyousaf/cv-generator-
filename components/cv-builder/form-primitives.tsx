import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Field label={label} htmlFor={htmlFor}>
      {children}
    </Field>
  );
}

export function TextInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return <Input id={id} {...props} />;
}

export function TextArea({
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return <Textarea id={id} {...props} />;
}

export function SectionCard({
  title,
  description,
  statusBadge,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  description?: string;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {statusBadge}
          </div>
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        <div className="space-y-3">{children}</div>
        {onAdd ? (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
              {addLabel ?? "+ Add"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
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
    <CollapsibleEntryCard
      summaryTitle={title}
      summarySubtitle=""
      expanded
      onToggle={() => undefined}
      onRemove={onRemove}
      hideToggle
    >
      {children}
    </CollapsibleEntryCard>
  );
}

export function CollapsibleEntryCard({
  summaryTitle,
  summarySubtitle,
  expanded,
  onToggle,
  onRemove,
  children,
  hideToggle = false,
}: {
  summaryTitle: string;
  summarySubtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  children: React.ReactNode;
  hideToggle?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-start gap-2 px-3 py-2.5 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold leading-snug text-slate-900">
            {summaryTitle}
          </p>
          {summarySubtitle ? (
            <p className="mt-0.5 break-words text-xs leading-snug text-slate-600">
              {summarySubtitle}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {!hideToggle ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={expanded}
              onClick={onToggle}
              className="text-slate-700"
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-red-700"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>
      {expanded ? (
        <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function SummaryTextArea({
  id,
  value = "",
  onChange,
  maxLength,
  className,
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  maxLength?: number;
}) {
  const text = typeof value === "string" ? value : String(value ?? "");

  return (
    <div className={cn("space-y-1", className)}>
      <Textarea id={id} value={text} onChange={onChange} rows={8} className="min-h-[160px]" />
      {maxLength ? (
        <p className="text-right text-xs text-slate-500" aria-live="polite">
          {text.length}/{maxLength}
        </p>
      ) : (
        <p className="text-right text-xs text-slate-500" aria-live="polite">
          {text.length} characters
        </p>
      )}
    </div>
  );
}
