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

  const effectiveOptions = useMemo(() => {
    const optValues = new Set(options.map((o) => o.value));
    const extras = value
      .filter((v) => !optValues.has(v))
      .map((v) => ({ label: v, value: v }));
    return [...options, ...extras];
  }, [options, value]);

  const selectedOptions = useMemo(() => {
    return value.map((v) => {
      const found = effectiveOptions.find((opt) => opt.value === v);
      return found || { label: v, value: v };
    });
  }, [value, effectiveOptions]);

  // Whether options have derivation/dataset metadata (Variable-style dropdown)
  const hasDerivation = effectiveOptions.some((opt) => opt.derivation !== undefined || opt.dataset !== undefined);

  // Border + bg per state
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

  // Sort: selected options first, then the rest (preserving original order within each group)
  const sortedOptions = [
    ...effectiveOptions.filter((opt) => value.includes(opt.value)),
    ...effectiveOptions.filter((opt) => !value.includes(opt.value)),
  ];

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
          className="absolute right-[10px] top-[50%] translate-y-[-50%] h-[20px] w-[20px]"
          style={{ opacity: disabled ? 0.4 : 1 }}
        />
      </div>

      {error && (
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-form-error)" }}>
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div
          className={`absolute left-0 top-[100%] z-[100] mt-[4px] rounded-[4px] border border-form-border bg-white shadow-[0px_2px_6px_rgba(0,0,0,0.1)] ${
            hasDerivation ? "w-[640px]" : "right-0"
          }`}
        >
          {hasDerivation ? (
            /* Variable-style dropdown: wide, with Dataset / Variable+Label / Derivation columns */
            <>
              {/* Column headers */}
              <div className="grid grid-cols-[14px_72px_140px_1fr] gap-[8px] border-b border-form-border px-[8px] py-[5px]">
                <div />
                <span className="text-[11px] font-medium text-graphite-40">Dataset</span>
                <span className="text-[11px] font-medium text-graphite-40">Variable / Label</span>
                <span className="text-[11px] font-medium text-graphite-40">Derivation</span>
              </div>
              <div className="flex max-h-[320px] flex-col overflow-y-auto p-[4px] gap-[2px]">
                {sortedOptions.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleToggleOption(opt.value)}
                      className={`grid w-full grid-cols-[14px_72px_140px_1fr] items-start gap-[8px] rounded-[2px] px-[6px] py-[6px] text-left transition-colors hover:bg-bg-panel ${
                        isSelected ? "bg-az-secondary" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <span
                        className={`mt-[2px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border ${
                          isSelected ? "border-brand-1 bg-brand-1" : "border-[#D8DADA] bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="white"/>
                          </svg>
                        )}
                      </span>

                      {/* Dataset */}
                      <span className="text-[11px] leading-[18px] text-graphite-40 whitespace-nowrap pt-[1px]">
                        {opt.dataset ?? ""}
                      </span>

                      {/* Variable name + Label */}
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium leading-[18px] text-text-primary">{opt.label}</p>
                        {opt.dataset && (
                          <p className="text-[11px] leading-[16px] text-graphite-40">{opt.dataset}</p>
                        )}
                      </div>

                      {/* Derivation — max 6 lines */}
                      <p
                        className="text-[12px] leading-[18px] text-text-primary"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {opt.derivation ?? "—"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Standard dropdown: compact, single-column */
            <div className="flex max-h-[200px] flex-col gap-[2px] overflow-y-auto p-[4px]">
              {sortedOptions.map((opt) => {
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
          )}
        </div>
      )}
      </div>
    </FormItem>
  );
}

