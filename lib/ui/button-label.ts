import type { ReactNode } from "react";

export type ButtonLabelVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "inverse"
  | "ai"
  | "link"
  | "link-danger";

const textLinkVariants: ButtonLabelVariant[] = ["link", "link-danger"];

export function isButtonPlainText(
  children: ReactNode,
): children is string | number {
  return typeof children === "string" || typeof children === "number";
}

export function shouldUseRollingButtonLabel({
  variant,
  children,
  isLoading,
}: {
  variant: ButtonLabelVariant;
  children: ReactNode;
  isLoading?: boolean;
}): boolean {
  if (isLoading) {
    return false;
  }
  if (textLinkVariants.includes(variant)) {
    return false;
  }
  return isButtonPlainText(children);
}

export function buttonPlainTextValue(children: ReactNode): string | null {
  if (!isButtonPlainText(children)) {
    return null;
  }
  return String(children);
}
