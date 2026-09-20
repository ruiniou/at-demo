import React, { forwardRef } from "react";

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
}

/** Action semantics are separate from selectable OptionLabel rows. */
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { danger = false, disabled = false, icon, shortcut, children, className = "", ...props }, ref,
) {
  return <button {...props} ref={ref} type="button" role="menuitem" disabled={disabled}
    className={`dropdown-item flex min-h-8 w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-[12px] leading-5 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 ${disabled ? "text-graphite-40 cursor-not-allowed" : danger ? "text-status-error hover:bg-status-error-bg/30 active:bg-status-error-bg/50" : "text-text-primary hover:bg-bg-panel active:bg-graphite-10"} ${className}`}>
    {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {shortcut && <span className={`shrink-0 ${disabled ? "text-graphite-40" : "text-text-secondary"}`}>{shortcut}</span>}
  </button>;
});
