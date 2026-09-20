import React from "react";

export function DropdownGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2 pt-1.5 pb-0.5 text-[11px] font-medium text-text-secondary">{children}</div>;
}
export function DropdownSeparator() {
  return <div role="separator" className="my-1 border-t border-border-default" />;
}
export function DropdownEmpty({ children = "No results" }: { children?: React.ReactNode }) {
  return <div role="status" className="px-2 py-1.5 text-[12px] text-text-secondary">{children}</div>;
}
