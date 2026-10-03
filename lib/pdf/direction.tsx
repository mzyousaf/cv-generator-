import type { ReactNode } from "react";
import { Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

/** Layout helpers for a document direction (react-pdf has no RTL flexbox). */
export function pdfDir(dir: "ltr" | "rtl") {
  const rtl = dir === "rtl";
  return {
    rtl,
    /** Horizontal row that mirrors in right-to-left documents. */
    row: (rtl ? "row-reverse" : "row") as Style["flexDirection"],
    textAlign: (rtl ? "right" : "left") as Style["textAlign"],
  };
}

const STRONG_RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const STRONG_LTR = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ぀-ヿ一-鿿]/;

function plainText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(plainText).join("");
  }
  return "";
}

/** Paragraph direction from the first strong character (Unicode bidi rule P2). */
export function textDirection(children: ReactNode): "ltr" | "rtl" {
  for (const char of plainText(children)) {
    if (STRONG_RTL.test(char)) {
      return "rtl";
    }
    if (STRONG_LTR.test(char)) {
      return "ltr";
    }
  }
  return "ltr";
}

type DirTextProps = {
  style?: Style | Style[];
  children?: ReactNode;
  wrap?: boolean;
};

/** Text whose bidi direction follows its content (Arabic runs right-to-left). */
export function DirText({ style, children, ...props }: DirTextProps) {
  const base: Style = { direction: textDirection(children) };
  const merged: Style[] = Array.isArray(style) ? [base, ...style] : [base, style ?? {}];
  return (
    <Text {...props} style={merged}>
      {children}
    </Text>
  );
}
