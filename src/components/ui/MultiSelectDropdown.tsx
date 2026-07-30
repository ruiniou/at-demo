import React, { useState, useRef, useEffect } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { FormItem } from "./FormItem";
import { OptionLabel } from "./OptionLabel";
import { DropdownOption } from "./Dropdown";
import { Tag } from "./Tag";
import { Tooltip } from "./Tooltip";

export interface MultiSelectDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  required = false,
  className = "",
  error,
  disabled = false,
  badge,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedTags, setIsExpandedTags] = useState(false);
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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Border + bg per state (Figma 549:1458 — Select, MultiSelect=true)
  let boxClasses = "";
  if (disabled) {
    boxClasses = "border border-form-border bg-bg-panel cursor-not-allowed";
  } else if (error) {
    boxClasses = "border-[1.5px] border-az-danger bg-white";
  } else if (isOpen) {
    boxClasses = "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]";
  } else {
    boxClasses = "border border-form-border bg-white hover:border-graphite-50";
  }

  // Label + star colors
  const labelColor = disabled ? "var(--color-graphite-20)" : "var(--color-text-primary)";

  const handleToggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const handleRemoveTag = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const hasMoreThanThree = selectedOptions.length > 3;
  const visibleOptions = hasMoreThanThree && !isExpandedTags
    ? selectedOptions.slice(0, 3)
    : selectedOptions;

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
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex min-h-[32px] w-full items-center justify-between rounded-[4px] pl-[4px] pr-[30px] py-[4px] transition-[border-color,box-shadow,background-color] cursor-pointer ${boxClasses}`}
      >
        <div className="flex flex-wrap gap-[4px] items-center w-full">
          {selectedOptions.length > 0 ? (
            <>
              {visibleOptions.map((opt) => (
                <Tooltip label={opt.label} key={opt.value}>
                  <Tag
                    onClose={disabled ? undefined : (e) => handleRemoveTag(opt.value, e as any)}
                    className="max-h-[26px] py-[1px] px-[4px]"
                    style={{ maxWidth: "160px" }}
                  >
                    {opt.label}
                  </Tag>
                </Tooltip>
              ))}
              {hasMoreThanThree && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpandedTags(!isExpandedTags);
                  }}
                  className="inline-flex items-center gap-[4px] py-[2px] text-[11px] text-brand-1 cursor-pointer font-medium max-h-[26px] bg-transparent hover:bg-transparent transition-colors"
                  style={{ fontFamily: "'PingFang SC', sans-serif" }}
                >
                  {!isExpandedTags ? `+${selectedOptions.length - 3} more...` : "Show less"}
                </span>
              )}
            </>
          ) : (
            <span
              style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "20px",
                color: disabled ? "var(--color-graphite-40)" : "var(--color-text-secondary)",
                paddingLeft: "8px"
              }}
            >
              {placeholder}
            </span>
          )}
        </div>
        <img
          src={arrowIconUrl}
          alt=""
          className={`absolute right-[10px] top-[50%] translate-y-[-50%] h-[20px] w-[20px] transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ opacity: disabled ? 0.4 : 1 }}
        />
      </div>

      {error && (
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-form-error)" }}>
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[100%] z-[100] mt-[4px] flex flex-col gap-[2px] rounded-[4px] border border-form-border bg-white p-[4px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
          <div className="flex max-h-[200px] flex-col gap-[2px] overflow-y-auto scrollbar-compact">
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <OptionLabel
                  key={opt.value}
                  label={opt.label}
                  selected={isSelected}
                  type="multi"
                  onClick={() => handleToggleOption(opt.value)}
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
