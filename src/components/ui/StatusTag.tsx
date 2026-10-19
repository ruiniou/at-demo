import React from "react";

export interface StatusTagProps {
  /** Status icon URL. Colored status icons render as images. */
  icon: string;
  label: string;
  /** Label color. Defaults to the primary text color. */
  color?: string;
  /** Render a single-color icon (such as Lock) as a mask in `color`. */
  monochromeIcon?: boolean;
  /** Replace the icon with a spinner while the status is pending. */
  loading?: boolean;
}

/** Icon + label status indicator used by the Events list and the Dashboards. */
export function StatusTag({ icon, label, color = "var(--color-text-primary)", monochromeIcon = false, loading = false }: StatusTagProps) {
  const mask = `url("${icon}") center / contain no-repeat`;
  return (
    <div className="flex items-center gap-[4px] rounded-[4px]">
      {loading ? (
        <svg className="h-[16px] w-[16px] animate-spin block shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6" stroke="var(--color-text-secondary)" strokeWidth="2" strokeDasharray="12" strokeLinecap="round" />
        </svg>
      ) : monochromeIcon ? (
        <span aria-hidden="true" className="h-[16px] w-[16px] block shrink-0" style={{ backgroundColor: color, mask, WebkitMask: mask }} />
      ) : (
        <img src={icon} alt="" className="h-[16px] w-[16px] block shrink-0" />
      )}
      <span className="t-small whitespace-nowrap" style={{ color }}>{label}</span>
    </div>
  );
}
