"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  builderSectionDomId,
  getOrderedSectionKeys,
  scrollToBuilderSection,
  type BuilderNavKey,
} from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { pickActiveSection, type SectionBox } from "@/lib/cv/scroll-spy";

/** How long a clicked section stays highlighted while smooth scrolling runs. */
const CLICK_PIN_MS = 1000;

/**
 * Scroll spy for the builder: returns the DOM id of the section currently at
 * the top of the editor, plus a navigate function that scrolls to a section
 * and highlights it right away.
 */
export function useBuilderActiveSection(
  state: CvBuilderFormState,
): [string, (key: BuilderNavKey) => void] {
  const [activeDomId, setActiveDomId] = useState(builderSectionDomId("personal"));
  const pinnedUntilRef = useRef(0);
  /** Last clicked section; wins while visible until the user scrolls by hand. */
  const clickedRef = useRef<string | null>(null);
  const idsKey = getOrderedSectionKeys(state).map(builderSectionDomId).join("|");

  useEffect(() => {
    const ids = idsKey.split("|");
    let frame = 0;

    function update() {
      frame = 0;
      if (Date.now() < pinnedUntilRef.current) {
        return;
      }
      const boxes: SectionBox[] = [];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element || element.offsetParent === null) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        // Same offset the browser uses when jumping to the section (scroll-mt).
        const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        boxes.push({ id, top: rect.top, bottom: rect.bottom, offset });
      }
      const scroller = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= scroller.scrollHeight - 2;
      const clicked = boxes.find((box) => box.id === clickedRef.current);
      const clickedVisible =
        clicked && clicked.top < window.innerHeight && clicked.bottom > 0;
      const next = clickedVisible
        ? clicked.id
        : pickActiveSection(boxes, { atBottom, viewportHeight: window.innerHeight });
      if (next) {
        setActiveDomId(next);
      }
    }

    function schedule() {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    }

    function release() {
      pinnedUntilRef.current = 0;
      schedule();
    }

    function manualScroll() {
      clickedRef.current = null;
      pinnedUntilRef.current = 0;
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scrollend", release);
    window.addEventListener("wheel", manualScroll, { passive: true });
    window.addEventListener("touchmove", manualScroll, { passive: true });
    window.addEventListener("keydown", manualScroll);
    return () => {
      window.removeEventListener("wheel", manualScroll);
      window.removeEventListener("touchmove", manualScroll);
      window.removeEventListener("keydown", manualScroll);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scrollend", release);
    };
  }, [idsKey]);

  const navigate = useCallback((key: BuilderNavKey) => {
    const domId = builderSectionDomId(key);
    pinnedUntilRef.current = Date.now() + CLICK_PIN_MS;
    clickedRef.current = domId;
    setActiveDomId(domId);
    scrollToBuilderSection(key);
  }, []);

  return [activeDomId, navigate];
}
