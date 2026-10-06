export type SectionBox = {
  id: string;
  /** Viewport-relative edges (getBoundingClientRect). */
  top: number;
  bottom: number;
  /** The section's scroll-margin-top: where a jump to it lands. */
  offset: number;
};

/** Tolerance so a section that was just jumped to counts as reached. */
const REACHED_SLACK_PX = 8;

/**
 * The active section is the last one (in visual order) whose top has scrolled
 * up to its landing line. At the bottom of the page short trailing sections
 * can never reach that line, so the lowest section that is visible wins.
 */
export function pickActiveSection(
  boxes: SectionBox[],
  { atBottom, viewportHeight }: { atBottom: boolean; viewportHeight: number },
): string | null {
  if (boxes.length === 0) {
    return null;
  }
  const ordered = [...boxes].sort((a, b) => a.top - b.top);

  if (atBottom) {
    const visible = ordered.filter((box) => box.top < viewportHeight && box.bottom > 0);
    const last = visible[visible.length - 1];
    if (last) {
      return last.id;
    }
  }

  let active = ordered[0].id;
  for (const box of ordered) {
    if (box.top <= box.offset + REACHED_SLACK_PX) {
      active = box.id;
    } else {
      break;
    }
  }
  return active;
}
