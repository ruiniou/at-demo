import React from "react";

export function CountBadge({ count, className = "" }: { count: number; className?: string }) {
  return (
    <span className={`inline-flex h-[16px] min-w-[16px] shrink-0 items-center justify-center rounded-[16px] bg-graphite-10 px-[4px] text-[10px] font-medium leading-[14px] text-text-secondary ${className}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
