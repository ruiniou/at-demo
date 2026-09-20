import React from "react";
import checkIconUrl from "../../icons/check-line.svg";
import { CheckboxIndicator } from "./CheckboxIndicator";

export interface OptionLabelProps {
  label: string;
  sub?: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  type?: "single" | "multi" | "highlight";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Existing 32px option row; description is opt-in and may grow past 48px. */
export function OptionLabel({ label, sub, description, selected = false, disabled = false,
  type = "single", leading, trailing, onClick, className = "" }: OptionLabelProps) {
  const highlighted = type === "highlight" && selected;
  return (
    <button type="button" disabled={disabled} aria-pressed={selected} onClick={onClick}
      className={`dropdown-item flex ${description ? "min-h-12 py-1.5" : "h-8"} w-full items-center ${type === "single" ? "gap-[6px]" : "gap-2"} px-[6px] rounded-[2px] text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 ${disabled ? "text-graphite-40 cursor-not-allowed" : highlighted ? "bg-az-secondary text-brand-1" : "text-text-primary hover:bg-bg-panel"} ${className}`}>
      {type === "single" && <span aria-hidden="true" className={`size-4 shrink-0 bg-current ${selected ? "" : "invisible"}`} style={{ mask: `url("${checkIconUrl}") center / contain no-repeat` }} />}
      {type === "multi" && <CheckboxIndicator checked={selected} disabled={disabled} size={14} />}
      {leading && <span className="shrink-0 inline-flex items-center">{leading}</span>}
      <span className="flex-1 min-w-0 text-[12px] leading-[18px] font-normal">
        <span title={label} className="block truncate">{label}</span>
        {description && <span className={`block whitespace-normal ${disabled ? "text-graphite-40" : "text-text-secondary"}`}>{description}</span>}
      </span>
      {sub && <span className={`shrink-0 text-[12px] leading-[18px] ${disabled ? "text-graphite-40" : "text-text-secondary"}`}>{sub}</span>}
      {trailing && <span className="shrink-0 inline-flex items-center">{trailing}</span>}
    </button>
  );
}
