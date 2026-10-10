import React from "react";
import { OptionRow } from "./OptionRow";

export interface OptionLabelProps {
  label: string;
  sub?: string;
  description?: string;
  truncateDescription?: boolean;
  showLabelTitle?: boolean;
  selected?: boolean;
  disabled?: boolean;
  type?: "single" | "multi" | "highlight";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  renderText?: (content: React.ReactNode) => React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Existing 32px option row; description is opt-in and may grow past 48px. */
export function OptionLabel({ label, sub, description, truncateDescription = false, showLabelTitle = true, selected = false, disabled = false,
  type = "single", leading, trailing, renderText, onClick, className = "" }: OptionLabelProps) {
  return (
    <OptionRow
      label={label}
      sub={sub}
      description={description}
      truncateDescription={truncateDescription}
      showLabelTitle={showLabelTitle}
      selected={selected}
      disabled={disabled}
      selectionMode={type}
      leading={leading}
      trailing={trailing}
      renderText={renderText}
      onSelect={onClick}
      className={className}
    />
  );
}
