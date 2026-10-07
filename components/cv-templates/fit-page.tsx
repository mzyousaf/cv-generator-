"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const A4_WIDTH_PX = 794;

type FitPageProps = {
  children: ReactNode;
  /** Largest scale to use; the page shrinks below it when the frame is narrower. */
  maxScale?: number;
  pageWidth?: number;
  className?: string;
  /** Classes for the box that wraps the scaled page (e.g. its shadow/ring). */
  pageClassName?: string;
};

/**
 * Scales a full-size CV page down to fit its frame's width, so thumbnails
 * never crop the page at narrow breakpoints. A fixed scale used to make the
 * page a few pixels wider than its card between breakpoints.
 */
export function FitPage({
  children,
  maxScale = 1,
  pageWidth = A4_WIDTH_PX,
  className,
  pageClassName,
}: FitPageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxScale);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(maxScale, entry.contentRect.width / pageWidth));
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [maxScale, pageWidth]);

  return (
    <div ref={frameRef} className={className}>
      <div
        aria-hidden="true"
        className={cn("pointer-events-none mx-auto select-none overflow-hidden", pageClassName)}
        style={{ width: Math.floor(pageWidth * scale) }}
      >
        <div
          className="origin-top-left rtl:origin-top-right"
          style={{ width: pageWidth, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
