import React from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  indeterminate?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = 16,
  className = "",
  indeterminate = false,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      disabled={disabled}
      className={`relative flex items-center justify-center shrink-0 rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed after:content-[''] after:absolute after:-inset-[12px] ${className}`}
      style={{ width: size, height: size }}
    >
      {checked || indeterminate ? (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" rx="2" fill="var(--color-brand-1)" />
          {indeterminate ? (
            <rect x="3" y="7" width="10" height="2" fill="white" />
          ) : (
            <path d="M11.3337 5.5L6.75033 10.0833L4.66699 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" fill="white" stroke="var(--color-border-default)" />
        </svg>
      )}
    </button>
  );
}
