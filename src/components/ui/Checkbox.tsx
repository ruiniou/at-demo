import React from "react";
import { CheckboxIndicator } from "./CheckboxIndicator";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  indeterminate?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = 16,
  className = "",
  indeterminate = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      disabled={disabled}
      className={`relative flex items-center justify-center shrink-0 rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 enabled:active:scale-[0.96] disabled:cursor-not-allowed after:content-[''] after:absolute after:-inset-[12px] ${className}`}
      style={{ width: size, height: size }}
    >
      <CheckboxIndicator checked={checked} indeterminate={indeterminate} disabled={disabled} size={size} />
    </button>
  );
}
