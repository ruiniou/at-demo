import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  label: string;
  children: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function Tooltip({ label, children, align = "center", className = "" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
    top: 0,
    left: 0,
  });
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (show && triggerRef.current && tooltipRef.current) {
      const target = triggerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current.getBoundingClientRect();
      
      const gap = align === "left" ? 0 : 2;
      let top = target.bottom + gap;
      let left = 0;

      // Vertical edge detection (24px gap threshold)
      if (window.innerHeight - target.bottom < 24) {
        top = target.top - tooltip.height - gap;
      }

      if (align === "left") {
        // Left alignment mode (for truncated text)
        left = target.left;
        // No horizontal edge detection for align="left"
      } else {
        // Center alignment mode (for icons)
        left = target.left + target.width / 2 - tooltip.width / 2;
        
        // Horizontal edge detection (8px threshold)
        if (left + tooltip.width > window.innerWidth - 8) {
          left = target.right - tooltip.width; // align right
        } else if (left < 8) {
          left = target.left; // align left
        }
      }

      setStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        visibility: "visible",
        zIndex: 9999,
      });
    } else {
      setStyle({
        position: "fixed",
        visibility: "hidden",
        top: 0,
        left: 0,
      });
    }
  }, [show, align, label]);

  // Determine text wrap class based on alignment
  const textWrapClass = align === "left" ? "max-w-[232px] break-words" : "whitespace-nowrap";

  return (
    <>
      <div 
        ref={triggerRef}
        className={`inline-flex ${className}`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && typeof document !== "undefined" && createPortal(
        <div 
          ref={tooltipRef}
          className={`pointer-events-none rounded-[4px] bg-text-primary px-[6px] py-[2px] t-small text-white shadow-sm q-fade ${textWrapClass}`}
          style={style}
          role="tooltip"
        >
          {label}
        </div>,
        document.body
      )}
    </>
  );
}
