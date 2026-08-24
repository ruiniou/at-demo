import React, { useState, useRef, useEffect } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { OptionLabel } from "./OptionLabel";
import { FormItem } from "./FormItem";

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
  badge?: React.ReactNode;
}

// Figma 549:1458 — Select (Default / Hovered / Focused / Error / Disabled)
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
  badge,
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

  // Border + bg per state (Figma 549:1458)
  let boxClasses = "";
  if (customBoxClass) {
    boxClasses = customBoxClass;
  } else if (disabled) {
    boxClasses = "border border-form-border bg-bg-panel cursor-not-allowed";
  } else if (error) {
    boxClasses = "border-[1.5px] border-az-danger bg-white";
  } else if (isOpen) {
    boxClasses = "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]";
  } else {
    boxClasses = "border border-form-border bg-white hover:border-graphite-50";
  }

  // Label + star colors
  const textColor = customTextColor ? customTextColor : disabled ? "var(--color-graphite-40)" : selectedOption ? "var(--color-text-primary)" : "var(--color-text-secondary)";

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      required={required}
      disabled={disabled}
      error={error}
      badge={badge}
      className={className}
    >
      <div className="relative" ref={dropdownRef}>
        <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex w-full items-center justify-between gap-[8px] transition-[border-color,box-shadow,background-color] after:content-[''] after:absolute after:-inset-y-[2px] after:inset-x-0 ${triggerClassName || 'h-[32px] rounded-[4px] pl-[12px] pr-[10px]'} ${boxClasses}`}
      >
        <span
          title={selectedOption ? selectedOption.label : placeholder}
          style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: textColor,
            ...customTextStyle,
          }}
          className="flex-1 min-w-0 truncate text-left"
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
            className="h-[20px] w-[20px]"
            style={{ opacity: disabled ? 0.4 : 1 }}
          />
        </div>
      </button>

      {error && (
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-form-error)" }}>
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[100%] z-[100] mt-[4px] flex flex-col gap-[2px] rounded-[4px] border border-form-border bg-white p-[4px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
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
    </FormItem>
  );
}
