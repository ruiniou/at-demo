import React from "react";
import checkIconUrl from "../../icons/check-line.svg";
import { Avatar } from "./Avatar";
import { OptionRow } from "./OptionRow";

export interface MemberOptionRowProps {
  name: string;
  initials?: string;
  color?: string;
  supportingText?: string;
  annotation?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  selectionMode?: "highlight" | "multi";
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

/** Member-picker derivative of the Fundamental option row. */
export function MemberOptionRow({
  name,
  initials,
  color,
  supportingText,
  annotation,
  trailing,
  selected = false,
  selectionMode = "highlight",
  disabled = false,
  onSelect,
  className = "",
}: MemberOptionRowProps) {
  const checkMask = `url("${checkIconUrl}") center / contain no-repeat`;

  return (
    <OptionRow
      label={name}
      sub={supportingText}
      selected={selected}
      disabled={disabled}
      selectionMode={selectionMode}
      leading={<Avatar name={name} initials={initials} color={color} level="menu" disabled={disabled} />}
      trailing={(annotation || (selectionMode === "highlight" && selected) || trailing) ? (
        <span className="inline-flex items-center gap-[6px]">
          {annotation}
          {selectionMode === "highlight" && selected && (
            <span
              aria-hidden="true"
              className="size-[14px] bg-current"
              style={{ mask: checkMask, WebkitMask: checkMask }}
            />
          )}
          {trailing}
        </span>
      ) : undefined}
      onSelect={onSelect}
      className={`gap-[8px] rounded-[4px] px-[8px] ${selectionMode === "highlight" && selected ? "bg-az-secondary/60" : ""} ${className}`}
    />
  );
}
