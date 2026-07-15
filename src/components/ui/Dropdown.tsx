import React, { useState, useRef, useEffect } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { OptionLabel } from "./OptionLabel";

export type DropdownOption = {
  label: string;
  value: string;
};

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  customBoxClass?: string;
  customTextColor?: string;
  customTextStyle?: React.CSSProperties;
  suffixNode?: React.ReactNode;
  triggerClassName?: string;
}

// Figma 455:673 — Form/Dropdown Field
// States: Default, Hovered, Focused (open), Error, Disabled
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  required = false,
  className = "",
  error,
  disabled = false,
  customBoxClass,
  customTextColor,
  customTextStyle,
  suffixNode,
  triggerClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  // Border + bg per state (Figma spec)
  let boxClasses = "";
  if (customBoxClass) {
    boxClasses = customBoxClass;
  } else if (disabled) {
    boxClasses = "border-[1px] border-graphite-10 bg-transparent cursor-not-allowed";
  } else if (error) {
    boxClasses = "border-[1.5px] border-status-error bg-white";
  } else if (isOpen) {
    boxClasses = "border-[1px] border-brand-1 bg-white";
  } else {
    boxClasses = "border-[1px] border-graphite-10 bg-white hover:bg-bg-panel hover:border-border-default";
  }

  // Label + star colors
  const labelColor = disabled ? "var(--color-graphite-20)" : "var(--color-text-primary)";
  const starColor = disabled ? "var(--color-graphite-20)" : "var(--color-brand-1)";
  const textColor = customTextColor
    ? customTextColor
    : disabled
      ? "var(--color-graphite-20)"
      : selectedOption
        ? "var(--color-text-primary)"
        : "var(--color-text-secondary)";

  return (
    <div className={`flex flex-col gap-[6px] w-full text-left relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center gap-[2px]">
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: labelColor }}>
            {label}
          </span>
          {required && (
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: starColor }}>*</span>
          )}
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex w-full items-center justify-between transition-colors after:content-[''] after:absolute after:-inset-y-[2px] after:inset-x-0 ${triggerClassName || 'h-[36px] rounded-[4px] pl-[12px] pr-[10px]'} ${boxClasses}`}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: textColor,
            maxWidth: "calc(100% - 24px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            textAlign: "left",
            ...customTextStyle,
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-[4px] shrink-0">
          {suffixNode && (
            <div onClick={(e) => e.stopPropagation()}>{suffixNode}</div>
          )}
          <img
            src={arrowIconUrl}
            alt=""
            className={`h-[20px] w-[20px] transition-transform ${isOpen ? "rotate-180" : ""}`}
            style={{ opacity: disabled ? 0.4 : 1 }}
          />
        </div>
      </button>

      {error && (
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-status-error-text)" }}>
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[100%] z-[100] mt-[2px] flex flex-col gap-[2px] rounded-[4px] border border-graphite-10 bg-white p-[4px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
          <div className="flex max-h-[200px] flex-col gap-[2px] overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <OptionLabel
                  key={opt.value}
                  label={opt.label}
                  selected={isSelected}
                  type="single"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
