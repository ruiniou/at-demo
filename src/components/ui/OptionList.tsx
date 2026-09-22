import React from "react";
import { DropdownEmpty } from "./DropdownParts";

export interface OptionListProps {
  children: React.ReactNode;
  empty?: boolean;
  emptyContent?: React.ReactNode;
  multiselectable?: boolean;
  className?: string;
}

/** Structural list primitive. Height and scrolling remain caller-configurable. */
export function OptionList({
  children,
  empty = false,
  emptyContent,
  multiselectable = false,
  className = "",
}: OptionListProps) {
  return (
    <div
      role="listbox"
      aria-multiselectable={multiselectable || undefined}
      className={`flex flex-col gap-[2px] overflow-y-auto ${className}`}
    >
      {empty ? <DropdownEmpty>{emptyContent}</DropdownEmpty> : children}
    </div>
  );
}
