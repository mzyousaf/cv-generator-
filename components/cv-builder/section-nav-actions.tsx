"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import type { AddSectionMode } from "@/components/cv-builder/add-section-modal";
import { PlusIcon, SparkleIcon } from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";

/** "Add section" + "Create with AI" buttons shown under the section list. */
export function SectionNavActions({
  onAddSection,
}: {
  onAddSection: (mode: AddSectionMode) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="grid gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        leftIcon={<PlusIcon className="size-4" />}
        onClick={() => onAddSection("blank")}
      >
        {t.builder.addSection}
      </Button>
      <Button
        type="button"
        variant="ai"
        size="sm"
        className="w-full justify-start"
        leftIcon={<SparkleIcon className="size-3.5" />}
        onClick={() => onAddSection("ai")}
      >
        {t.builder.createWithAi}
      </Button>
    </div>
  );
}
