import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  id?: string;
  label?: string;
  role?: "menu" | "dialog";
  placement?: "bottom" | "top";
  align?: "start" | "end";
  width?: number | "anchor";
  offset?: number;
  className?: string;
}

/** Shared floating surface. Listbox/combobox selection remains the caller's job. */
export function Popover({ open, onOpenChange, anchorRef, children, id, label,
  role = "dialog", placement = "bottom", align = "start", width = "anchor", offset = 4, className = "" }: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<React.CSSProperties>({ visibility: "hidden" });
  const changeRef = useRef(onOpenChange);
  changeRef.current = onOpenChange;

  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const margin = 8;
      const panelWidth = Math.min(width === "anchor" ? rect.width : width, window.innerWidth - margin * 2);
      const below = Math.max(0, window.innerHeight - rect.bottom - offset - margin);
      const above = Math.max(0, rect.top - offset - margin);
      const desiredHeight = Math.min(panel.scrollHeight + 2, window.innerHeight - margin * 2);
      const preferredSpace = placement === "bottom" ? below : above;
      const alternateSpace = placement === "bottom" ? above : below;
      const side = desiredHeight > preferredSpace && alternateSpace > preferredSpace
        ? placement === "bottom" ? "top" : "bottom" : placement;
      const maxHeight = side === "bottom" ? below : above;
      const height = Math.min(desiredHeight, maxHeight);
      const left = Math.min(Math.max(margin, align === "end" ? rect.right - panelWidth : rect.left), window.innerWidth - panelWidth - margin);
      setPosition({ left, top: side === "bottom" ? rect.bottom + offset : rect.top - offset - height, width: panelWidth, maxHeight, visibility: "visible" });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor);
    observer.observe(panel);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"], a[href]'));
    const focusFrame = requestAnimationFrame(() => (panel.querySelector<HTMLElement>("input:not(:disabled)") ?? focusable()[0] ?? panel).focus());
    const outside = (event: PointerEvent) => {
      if (!panel.contains(event.target as Node) && !anchor.contains(event.target as Node)) changeRef.current(false);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        changeRef.current(false);
        anchor.focus();
      }
      if (role !== "menu" || !panel.contains(document.activeElement)) return;
      const items = focusable();
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "ArrowDown" ? (current + 1) % items.length
        : event.key === "ArrowUp" ? (current - 1 + items.length) % items.length
        : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
      if (next >= 0 && items[next]) { event.preventDefault(); items[next].focus(); }
    };
    const focusout = (event: FocusEvent) => {
      if (!panel.contains(event.target as Node) && !anchor.contains(event.target as Node)) changeRef.current(false);
    };
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown, true);
    document.addEventListener("focusin", focusout);
    return () => {
      cancelAnimationFrame(focusFrame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown, true);
      document.removeEventListener("focusin", focusout);
      if (panel.contains(document.activeElement) || document.activeElement === document.body) anchor.focus();
    };
  }, [open, anchorRef, placement, align, width, offset, role]);

  if (!open) return null;
  return createPortal(<div ref={panelRef} id={id} role={role} aria-label={label} tabIndex={-1}
    style={{ position: "fixed", zIndex: 10050, ...position }}
    className={twMerge("overflow-y-auto rounded-md border border-form-border bg-white p-1 shadow-elevation-overlay", className)}>
    {children}
  </div>, document.body);
}
