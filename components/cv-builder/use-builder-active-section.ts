"use client";

import { useEffect, useState } from "react";
import {
  builderSectionDomId,
  getOrderedSectionNavItems,
} from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";

export function useBuilderActiveSection(state: CvBuilderFormState): string {
  const [activeDomId, setActiveDomId] = useState(builderSectionDomId("personal"));

  useEffect(() => {
    const navItems = getOrderedSectionNavItems(state.sectionSettings);
    const ids = navItems.map((item) => builderSectionDomId(item.id));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveDomId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [state.sectionSettings]);

  return activeDomId;
}
