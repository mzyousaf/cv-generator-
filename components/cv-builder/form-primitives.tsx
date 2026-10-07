"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { format } from "@/lib/i18n/format";
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
  return <Input id={id} dir="auto" {...props} />;
}

export function TextArea({
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return <Textarea id={id} dir="auto" {...props} />;
}

export function SectionCard({
  title,
  description,
  statusBadge,
  actions,
  muted = false,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  description?: string;
  statusBadge?: React.ReactNode;
  /** Header controls on the right (visibility toggle, delete…). */
  actions?: React.ReactNode;
  /** Dims the card, e.g. when the section is hidden from the resume. */
  muted?: boolean;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <Card className={cn("rounded-xl transition-opacity", muted && "opacity-75")}>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-base font-bold tracking-tight text-slate-950">
                {title}
              </h2>
              {statusBadge}
            </div>
            {description ? (
              <p className="text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {/* -mt-1 centres the ~32px actions on the 24px title line. */}
          {actions ? <div className="-mt-1 flex shrink-0 items-center gap-0.5">{actions}</div> : null}
        </div>
        <div className="space-y-4">{children}</div>
        {onAdd ? (
          <div className="mt-5 border-t border-slate-100 pt-4">
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
  const { t } = useI18n();
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/40 transition-colors hover:border-slate-300/80">
      <div className="flex flex-wrap items-start gap-x-2 gap-y-1 px-4 py-3">
        <div className="min-w-0 flex-[1_1_12rem]">
          <p className="break-words text-sm font-semibold leading-snug text-slate-900">
            {summaryTitle}
          </p>
          {summarySubtitle ? (
            <p className="mt-0.5 break-words text-xs leading-snug text-slate-600">
              {summarySubtitle}
            </p>
          ) : null}
        </div>
        <div className="ms-auto flex shrink-0 items-center gap-0.5">
          {!hideToggle ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={expanded}
              onClick={onToggle}
              className="text-slate-700"
            >
              {expanded ? t.editor.collapse : t.editor.expand}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-red-700"
            onClick={onRemove}
          >
            {t.common.remove}
          </Button>
        </div>
      </div>
      {expanded ? (
        <div className="grid gap-4 border-t border-slate-100 bg-surface p-4 sm:grid-cols-2 sm:p-5">
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
  const { t } = useI18n();
  const text = typeof value === "string" ? value : String(value ?? "");

  return (
    <div className={cn("space-y-1", className)}>
      <Textarea id={id} dir="auto" value={text} onChange={onChange} rows={8} className="min-h-[160px]" />
      {maxLength ? (
        <p className="text-end text-xs text-slate-500" aria-live="polite">
          {text.length}/{maxLength}
        </p>
      ) : (
        <p className="text-end text-xs text-slate-500" aria-live="polite">
          {format(t.editor.characters, { n: text.length })}
        </p>
      )}
    </div>
  );
}

/** Small square icon button used in section headers. */
export function SectionIconButton({
  label,
  onClick,
  children,
  pressed,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  pressed?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-slate-100 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  );
}
