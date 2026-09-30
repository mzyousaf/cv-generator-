"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderHeaderMoreMenuProps = {
  onOpenTemplates: () => void;
  onManageSections: () => void;
  onExportPdf: () => void;
  onSave: () => void;
  isSaving: boolean;
  isExporting: boolean;
  saveDisabled: boolean;
  className?: string;
};

export function BuilderHeaderMoreMenu({
  onOpenTemplates,
  onManageSections,
  onExportPdf,
  onSave,
  isSaving,
  isExporting,
  saveDisabled,
  className,
}: BuilderHeaderMoreMenuProps) {
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
        More
      </Button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Builder actions"
          className="absolute right-0 z-40 mt-1 min-w-[11rem] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <MenuItem
            label="Templates"
            onClick={() => runAction(onOpenTemplates)}
          />
          <MenuItem
            label="Manage Sections"
            onClick={() => runAction(onManageSections)}
          />
          <MenuItem
            label={isExporting ? "Exporting PDF…" : "Export PDF"}
            disabled={isExporting || isSaving}
            onClick={() => runAction(onExportPdf)}
          />
          <MenuItem
            label={isSaving ? "Saving…" : "Save"}
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
      className="flex w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
