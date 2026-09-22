import React from "react";
import { twMerge } from "tailwind-merge";
import checkIconUrl from "../../icons/check-line.svg";
import { CheckboxIndicator } from "./CheckboxIndicator";

export interface OptionRowProps {
  label: string;
  sub?: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  selectionMode?: "single" | "multi" | "highlight";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

/** Fundamental selectable row. Defaults to a single-line, single-select text option. */
export function OptionRow({
  label,
  sub,
  description,
  selected = false,
  disabled = false,
  selectionMode = "single",
  leading,
  trailing,
  onSelect,
  className = "",
}: OptionRowProps) {
  const highlighted = selectionMode === "highlight" && selected;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      className={twMerge(`dropdown-item flex ${description ? "min-h-12 py-1.5" : "h-8"} w-full items-center ${selectionMode === "single" ? "gap-[6px]" : "gap-2"} rounded-[calc(var(--radius-xs)*2)] px-[6px] text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 ${disabled ? "cursor-not-allowed text-graphite-40" : highlighted ? "bg-az-secondary text-brand-1" : "text-text-primary hover:bg-bg-panel"}`, className)}
    >
      {selectionMode === "single" && (
        <span
          aria-hidden="true"
          className={`size-4 shrink-0 bg-current ${selected ? "" : "invisible"}`}
          style={{ mask: `url("${checkIconUrl}") center / contain no-repeat` }}
        />
      )}
      {selectionMode === "multi" && (
        <CheckboxIndicator checked={selected} disabled={disabled} size={14} />
      )}
      {leading && <span className="inline-flex shrink-0 items-center">{leading}</span>}
      <span className="min-w-0 flex-1 text-[12px] font-normal leading-[18px]">
        <span title={label} className="block truncate">{label}</span>
        {description && (
          <span className={`block whitespace-normal ${disabled ? "text-graphite-40" : "text-text-secondary"}`}>
            {description}
          </span>
        )}
      </span>
      {sub && (
        <span className={`shrink-0 text-[12px] leading-[18px] ${disabled ? "text-graphite-40" : "text-text-secondary"}`}>
          {sub}
        </span>
      )}
      {trailing && <span className="inline-flex shrink-0 items-center">{trailing}</span>}
    </button>
  );
}
