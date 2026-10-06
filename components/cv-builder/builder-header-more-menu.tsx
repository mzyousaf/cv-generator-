"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderHeaderMoreMenuProps = {
  onOpenTemplates: () => void;
  onExportPdf: () => void;
  onSave: () => void;
  isSaving: boolean;
  isExporting: boolean;
  saveDisabled: boolean;
  className?: string;
};

export function BuilderHeaderMoreMenu({
  onOpenTemplates,
  onExportPdf,
  onSave,
  isSaving,
  isExporting,
  saveDisabled,
  className,
}: BuilderHeaderMoreMenuProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [close, open]);

  function runAction(action: () => void) {
    action();
    close();
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        {t.builder.more}
      </Button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t.builder.actions}
          className="absolute end-0 z-40 mt-1 min-w-[11rem] rounded-xl border border-slate-200 bg-surface py-1 shadow-lg"
        >
          <MenuItem
            label={t.builder.templates}
            onClick={() => runAction(onOpenTemplates)}
          />
          <MenuItem
            label={isExporting ? t.builder.exportingPdf : t.builder.exportPdf}
            disabled={isExporting || isSaving}
            onClick={() => runAction(onExportPdf)}
          />
          <MenuItem
            label={isSaving ? t.common.saving : t.common.save}
            disabled={isSaving || isExporting || saveDisabled}
            onClick={() => runAction(onSave)}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className="flex w-full cursor-pointer px-3 py-2 text-start text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
