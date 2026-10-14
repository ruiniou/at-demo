import React from "react";
import { Avatar } from "./Avatar";

/** Read-only owner identity, shared by Events and dashboard tables. */
export function ReadOnlyOwner({ name }: { name?: string }) {
  return <div className="flex min-h-[40px] min-w-0 items-center gap-[6px] px-[6px]">
    <Avatar name={name} level="modal" />
    <span className={`truncate text-[12px] font-normal ${name ? 'text-text-primary' : 'text-text-secondary'}`}>
      {name || 'No Assignee'}
    </span>
  </div>;
}
