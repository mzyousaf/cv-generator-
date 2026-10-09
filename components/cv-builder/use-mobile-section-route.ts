"use client";

import { useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderedSectionKeys, type BuilderNavKey } from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";

const PARAM = "section";

function urlWithSection(key: BuilderNavKey | null): string {
  const url = new URL(window.location.href);
  if (key) {
    url.searchParams.set(PARAM, key);
  } else {
    url.searchParams.delete(PARAM);
  }
  return url.toString();
}

/**
 * Mobile list → detail navigation for the editor. The open section lives in
 * `?section=` so the phone's back button returns to the section list.
 */
export function useMobileSectionRoute(state: CvBuilderFormState) {
  const searchParams = useSearchParams();
  const pushedRef = useRef(false);
  const requested = searchParams.get(PARAM);
  const current = (getOrderedSectionKeys(state) as string[]).includes(requested ?? "")
    ? (requested as BuilderNavKey)
    : null;

  const open = useCallback((key: BuilderNavKey) => {
    window.history.pushState(null, "", urlWithSection(key));
    pushedRef.current = true;
    window.scrollTo({ top: 0 });
  }, []);

  /** Previous / next: swap the section without stacking history entries. */
  const go = useCallback((key: BuilderNavKey) => {
    window.history.replaceState(null, "", urlWithSection(key));
    window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", urlWithSection(null));
    }
    window.scrollTo({ top: 0 });
  }, []);

  return { current, open, go, back };
}
