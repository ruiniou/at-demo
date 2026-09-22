import React from "react";
import { OptionRow } from "./OptionRow";

export interface OptionLabelProps {
  label: string;
  sub?: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  type?: "single" | "multi" | "highlight";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Existing 32px option row; description is opt-in and may grow past 48px. */
export function OptionLabel({ label, sub, description, selected = false, disabled = false,
  type = "single", leading, trailing, onClick, className = "" }: OptionLabelProps) {
  return (
    <OptionRow
      label={label}
      sub={sub}
      description={description}
      selected={selected}
      disabled={disabled}
      selectionMode={type}
      leading={leading}
      trailing={trailing}
      onSelect={onClick}
      className={className}
    />
  );
}
