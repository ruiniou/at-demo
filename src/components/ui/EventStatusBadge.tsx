import React from "react";
import alertIconUrl from "../../icons/alert-line.svg";
import closeCircleIconUrl from "../../icons/close-circle-line.svg";

export type EventStatusType = "updated" | "blocked" | "failed" | "skipped" | "running" | "queued";

export interface EventStatusBadgeProps {
  status?: EventStatusType;
  className?: string;
}

/**
 * EventStatusBadge component — Event-level task status indicator.
 *
 * Design System & UX Rules:
 * 1. "Silent on success, noisy on exception":
 *    - 'updated' / success: returns null (no badge rendered to minimize visual noise).
 * 2. 'blocked': Warning/Alert semantic style (Amber text & bg + alert icon).
 * 3. 'failed': Danger/Error semantic style (Dark red text & bg + error circle icon).
 * 4. 'skipped': Subtle graphite gray badge.
 */
export function EventStatusBadge({ status, className = "" }: EventStatusBadgeProps) {
  if (!status || status === "updated" || status === "queued") {
    // Silent on success to keep the interface clean
    return null;
  }

  if (status === "blocked") {
    return (
      <span
        className={`inline-flex items-center gap-[3px] px-[6px] py-[1.5px] rounded-[4px] bg-[#FFF8E6] text-[#B25E00] border border-[#FFE2A4] text-[11px] font-medium leading-[14px] select-none shrink-0 ${className}`}
      >
        <img
          src={alertIconUrl}
          alt=""
          aria-hidden="true"
          className="w-[12px] h-[12px] shrink-0 block"
          style={{
            filter:
              "invert(37%) sepia(85%) saturate(1200%) hue-rotate(15deg) brightness(85%) contrast(105%)",
          }}
        />
        <span>Blocked</span>
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span
        className={`inline-flex items-center gap-[3px] px-[6px] py-[1.5px] rounded-[4px] bg-[#FAD4D8] text-[#CC2C3C] border border-[#F5A9B4] text-[11px] font-medium leading-[14px] select-none shrink-0 ${className}`}
      >
        <img
          src={closeCircleIconUrl}
          alt=""
          aria-hidden="true"
          className="w-[12px] h-[12px] shrink-0 block"
          style={{
            filter:
              "invert(24%) sepia(88%) saturate(2800%) hue-rotate(345deg) brightness(88%) contrast(96%)",
          }}
        />
        <span>Failed</span>
      </span>
    );
  }

  if (status === "skipped") {
    return (
      <span
        className={`inline-flex items-center px-[6px] py-[1.5px] rounded-[4px] bg-graphite-10 text-text-secondary border border-graphite-20 text-[11px] font-medium leading-[14px] select-none shrink-0 ${className}`}
      >
        Skipped
      </span>
    );
  }

  if (status === "running") {
    return (
      <span
        className={`inline-flex items-center gap-[4px] px-[6px] py-[1.5px] rounded-[4px] bg-brand-1/10 text-brand-1 border border-brand-1/20 text-[11px] font-medium leading-[14px] select-none shrink-0 ${className}`}
      >
        <span className="w-[10px] h-[10px] border-[1.5px] border-brand-1 border-t-transparent rounded-full animate-spin shrink-0" />
        <span>Updating…</span>
      </span>
    );
  }

  return null;
}

export default EventStatusBadge;
