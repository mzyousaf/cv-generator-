"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { ModalDivider } from "@/components/ui/modal";

export function AuthDivider() {
  const { t } = useI18n();
  return <ModalDivider>{t.common.orContinueWith}</ModalDivider>;
}
