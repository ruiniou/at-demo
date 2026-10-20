import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Overlay scrollbars for lists and tables.
 *
 * The viewport scrolls natively (wheel, trackpad, keyboard, touch) but hides the native scrollbar, so the
 * scrollbar never takes layout width: rows, dividers and hover fills reach the right edge, and a scrollbar
 * appearing or disappearing never moves the columns. Thumbs float over the content's right/bottom 12px and
 * reuse the global scrollbar look (8px capsule in a 12px track).
 */

const TRACK_INSET = 2;
const MIN_THUMB = 24;

type Thumb = { size: number; offset: number } | null;

function measure(scroll: number, content: number, view: number): Thumb {
  if (content <= view + 1) return null;
  const track = view - TRACK_INSET * 2;
  const size = Math.max(MIN_THUMB, (track * view) / content);
  return { size, offset: TRACK_INSET + ((track - size) * scroll) / (content - view) };
}

export interface ScrollAreaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  /** Layout classes for the outer box (e.g. `min-h-0 flex-1`). */
  className?: string;
  /** Classes for the scrolling viewport (e.g. a max height). */
  viewportClassName?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = "", viewportClassName = "", children, onScroll, ...props }, forwardedRef) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [vertical, setVertical] = useState<Thumb>(null);
    const [horizontal, setHorizontal] = useState<Thumb>(null);
    const frame = useRef(0);

    const setRefs = (element: HTMLDivElement | null) => {
      viewportRef.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    };

    const update = useCallback(() => {
      const element = viewportRef.current;
      if (!element) return;
      setVertical(measure(element.scrollTop, element.scrollHeight, element.clientHeight));
      setHorizontal(measure(element.scrollLeft, element.scrollWidth, element.clientWidth));
    }, []);

    useLayoutEffect(update, [update]);

    /* Content can change size without the viewport changing (rows filtered, folds expanded), so watch both. */
    useEffect(() => {
      const element = viewportRef.current;
      if (!element) return;
      const resize = new ResizeObserver(update);
      const observeChildren = () => {
        resize.disconnect();
        resize.observe(element);
        Array.from(element.children).forEach((child) => resize.observe(child));
        update();
      };
      observeChildren();
      const mutation = new MutationObserver(observeChildren);
      mutation.observe(element, { childList: true });
      return () => {
        resize.disconnect();
        mutation.disconnect();
        cancelAnimationFrame(frame.current);
      };
    }, [update]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(update);
      onScroll?.(event);
    };

    const startDrag = (axis: "y" | "x") => (event: React.PointerEvent<HTMLDivElement>) => {
      const element = viewportRef.current;
      const thumb = axis === "y" ? vertical : horizontal;
      if (!element || !thumb) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const start = axis === "y" ? event.clientY : event.clientX;
      const startScroll = axis === "y" ? element.scrollTop : element.scrollLeft;
      const view = axis === "y" ? element.clientHeight : element.clientWidth;
      const content = axis === "y" ? element.scrollHeight : element.scrollWidth;
      const ratio = (content - view) / (view - TRACK_INSET * 2 - thumb.size);
      const target = event.currentTarget;
      const move = (moveEvent: PointerEvent) => {
        const delta = ((axis === "y" ? moveEvent.clientY : moveEvent.clientX) - start) * ratio;
        if (axis === "y") element.scrollTop = startScroll + delta;
        else element.scrollLeft = startScroll + delta;
      };
      const stop = () => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", stop);
        target.removeEventListener("pointercancel", stop);
      };
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", stop);
      target.addEventListener("pointercancel", stop);
    };

    const thumbClass =
      "absolute z-10 rounded-[8px] bg-[color-mix(in_srgb,var(--color-graphite-20)_75%,transparent)] hover:bg-graphite-40 active:bg-graphite-40";

    return (
      <div className={`relative flex min-h-0 min-w-0 flex-col ${className}`}>
        <div
          ref={setRefs}
          onScroll={handleScroll}
          className={`scrollbar-none min-h-0 min-w-0 flex-auto overflow-auto ${viewportClassName}`}
          {...props}
        >
          {children}
        </div>
        {vertical && (
          <div
            aria-hidden="true"
            onPointerDown={startDrag("y")}
            className={`${thumbClass} w-[8px]`}
            style={{ top: vertical.offset, height: vertical.size, right: TRACK_INSET }}
          />
        )}
        {horizontal && (
          <div
            aria-hidden="true"
            onPointerDown={startDrag("x")}
            className={`${thumbClass} h-[8px]`}
            style={{ left: horizontal.offset, width: horizontal.size, bottom: TRACK_INSET }}
          />
        )}
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";
