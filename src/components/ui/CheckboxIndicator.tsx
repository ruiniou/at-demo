import React from "react";

/** Visual-only indicator: safe inside a selectable row without nesting buttons. */
export function CheckboxIndicator({ checked = false, indeterminate = false, disabled = false, size = 16 }: {
  checked?: boolean; indeterminate?: boolean; disabled?: boolean; size?: number;
}) {
  const active = checked || indeterminate;
  const color = disabled ? "var(--color-graphite-40)" : "var(--color-brand-1)";
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="0.5" y="0.5" width="15" height="15" rx="1.5"
        fill={active && !disabled ? color : "white"}
        stroke={active || disabled ? color : "var(--color-border-default)"} />
      {indeterminate ? <path d="M3 8H13" stroke={disabled ? color : "white"} strokeWidth="2" />
        : checked ? <path d="M11.3337 5.5L6.75033 10.0833L4.66699 8" stroke={disabled ? color : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
}
