import React, { useState, useRef, useEffect } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { FormItem } from "./FormItem";
import { SearchBar } from "./SearchBar";
import { Badge } from "./Badge";

export type CreatableOption = {
  label: string;
  value: string;
};

export interface CreatableDropdownProps {
  label?: string;
  options: CreatableOption[];
  value: string | null;
  isNew?: boolean;
  onChange: (value: string | null, isNew: boolean) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  allowClear?: boolean;
  createPrefix?: string;
}

export function CreatableDropdown({
  label,
  options,
  value,
  isNew = false,
  onChange,
  placeholder = "Select or enter new…",
  required = false,
  className = "",
  error,
  disabled = false,
  allowClear = true,
  createPrefix = "Create",
}: CreatableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  // Filter existing options
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if searchQuery is unique / new
  const exactMatch = options.some(
    (opt) =>
      opt.label.toLowerCase() === searchQuery.trim().toLowerCase() ||
      opt.value.toLowerCase() === searchQuery.trim().toLowerCase()
  );
  const canCreateNew = searchQuery.trim().length > 0 && !exactMatch;

  const handleSelectOption = (opt: CreatableOption) => {
    onChange(opt.value, false);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateNew = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    onChange(trimmed, true);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, false);
    setSearchQuery("");
  };

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

  const textColor = disabled
    ? "var(--color-graphite-40)"
    : displayLabel
    ? "var(--color-text-primary)"
    : "var(--color-text-secondary)";

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    >
      <div className="relative" ref={containerRef}>
        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`relative flex h-[32px] w-full items-center justify-between rounded-[4px] pl-[12px] pr-[10px] transition-[border-color,box-shadow,background-color] ${boxClasses}`}
        >
          <div className="flex items-center gap-[6px] min-w-0 max-w-[calc(100%-48px)]">
            <span
              style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "20px",
                color: textColor,
              }}
              className="truncate block text-left"
            >
              {displayLabel || placeholder}
            </span>
            {isNew && value && (
              <Badge variant="default" className="h-[18px] px-[4px] text-[10px] leading-[14px] font-medium shrink-0">
                New
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-[4px] shrink-0">
            {allowClear && value && !disabled && (
              <span
                onClick={handleClear}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full hover:bg-black/5 text-text-secondary cursor-pointer"
                title="Clear"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="currentColor"/>
                </svg>
              </span>
            )}
            <img
              src={arrowIconUrl}
              alt=""
              className="h-[20px] w-[20px] transition-transform duration-200"
              style={{
                opacity: disabled ? 0.4 : 1,
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 top-[100%] z-[100] mt-[4px] flex flex-col gap-[6px] rounded-md border border-form-border bg-white p-1 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
            {/* Search / Custom entry input */}
            <div className="w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search or type to create new..."
                background="light"
                variant="embedded"
                className="w-full"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="flex max-h-[180px] flex-col gap-[2px] overflow-y-auto pr-[2px]">
              {/* Creatable option if query is new */}
              {canCreateNew && (
                <button
                  type="button"
                  onClick={() => handleCreateNew(searchQuery)}
                  className="flex items-center justify-between rounded-[4px] bg-az-secondary/60 hover:bg-az-secondary px-[8px] py-[6px] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-[6px] min-w-0">
                    <span className="text-[12px] font-medium text-brand-1 truncate">
                      + {createPrefix} <span className="font-semibold text-brand-1">"{searchQuery.trim()}"</span>
                    </span>
                  </div>
                  <Badge variant="default" className="h-[18px] px-[4px] text-[10px] font-medium shrink-0">
                    New Code
                  </Badge>
                </button>
              )}

              {/* Existing Options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value && !isNew;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`flex h-[32px] w-full items-center justify-between px-[8px] rounded-[4px] text-left transition-colors cursor-pointer ${
                        isSelected ? "bg-az-secondary text-brand-1 font-medium" : "hover:bg-bg-panel text-text-primary"
                      }`}
                    >
                      <span className="t-small truncate">{opt.label}</span>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="var(--color-brand-1)"/>
                        </svg>
                      )}
                    </button>
                  );
                })
              ) : !canCreateNew ? (
                <div className="px-[8px] py-[10px] text-center t-small text-text-secondary">
                  No results found.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </FormItem>
  );
}
