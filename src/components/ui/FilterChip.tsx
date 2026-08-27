import React, { forwardRef, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Checkbox } from "./Checkbox";

export interface FilterChipOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface FilterChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange"> {
  /** Variant of the chip: "Toggle" (simple chip/toggle) or "Dropdown" (with chevron) */
  type?: "Toggle" | "Dropdown";
  /** Semantic mode: "filter" (highlights with pink selected state when value is set) or "select" (neutral default state even when value is selected, only highlighting when open/hovered) */
  variant?: "filter" | "select";
  /** Controlled active/selected state */
  active?: boolean;
  /** Explicit state override */
  state?: "Default" | "Hover" | "Active" | "Disabled";
  /** Chip text label */
  label?: React.ReactNode;
  /** Optional custom leading icon. If omitted, default sparkle/filter icon is shown if showIcon=true */
  icon?: React.ReactNode;
  /** Whether to show the leading icon. Defaults to true */
  showIcon?: boolean;
  /** Options if used as an interactive dropdown selector */
  options?: FilterChipOption[];
  /** Current selected value when used with single-select options */
  value?: string;
  /** Callback when option is selected in single-select mode */
  onChange?: (value: string) => void;
  /** Whether multi-select is enabled */
  multiSelect?: boolean;
  /** Current selected values in multi-select mode */
  values?: string[];
  /** Callback when values change in multi-select mode */
  onChangeMulti?: (values: string[]) => void;
  className?: string;
}

/**
 * Default Sparkle / Filter Vector Icon (Figma 1227:25041)
 */
function DefaultSparkleIcon({ color = "currentColor", className = "size-[16px]" }: { color?: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 1.33301C8 4.64672 10.6863 7.33301 14 7.33301C10.6863 7.33301 8 10.0193 8 13.333C8 10.0193 5.31371 7.33301 2 7.33301C5.31371 7.33301 8 4.64672 8 1.33301Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Chevron Down Icon (Figma 1230:9293)
 */
function ChevronDownIcon({ color = "currentColor", className = "size-[16px]" }: { color?: string; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * FilterChip Component — Figma node 1230:9212
 * Variants: Toggle / Dropdown
 * States: Default / Hover / Active / Disabled
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  (
    {
      type = "Toggle",
      variant = "filter",
      active = false,
      state: stateProp,
      label = "Label",
      icon,
      showIcon = true,
      options,
      value,
      onChange,
      multiSelect,
      values,
      onChangeMulti,
      disabled = false,
      onClick,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const openTimerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    // Cleanup timers on unmount
    useEffect(() => {
      return () => clearTimers();
    }, []);

    // Merge forwarded ref and local ref
    const setRefs = (element: HTMLButtonElement | null) => {
      buttonRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
      }
    };

    // Calculate effective state
    const isDropdown = type === "Dropdown" || Boolean(options?.length);
    const isDisabled = disabled || stateProp === "Disabled";
    const isFilterMode = variant === "filter";
    const hasActiveFilterValue = isFilterMode && (
      multiSelect
        ? (values !== undefined && values.length > 0 && (!options || values.length < options.length))
        : (value !== undefined && value !== "All" && value !== "")
    );
    const isActive = active || stateProp === "Active" || hasActiveFilterValue;
    const isHoveredOrOpen = (stateProp === "Hover" || isOpen) && !isActive && !isDisabled;

    // Determine colors
    let colorScheme = {
      bg: isHoveredOrOpen ? "bg-[#F8F7F7]" : "bg-transparent hover:bg-[#F8F7F7] active:bg-[#F0F2F2]",
      text: "text-[#3F4444]",
      iconColor: "#3F4444",
      chevronColor: "#3F4444",
    };

    if (isDisabled) {
      colorScheme = {
        bg: "bg-transparent cursor-not-allowed",
        text: "text-[#B2B4B4]",
        iconColor: "#B2B4B4",
        chevronColor: "#B2B4B4",
      };
    } else if (isActive) {
      colorScheme = {
        bg: "bg-[#F4E8EE] hover:bg-[#EEDFE7]",
        text: "text-[#830051]",
        iconColor: "#830051",
        chevronColor: "#830051",
      };
    }

    const paddingClasses = isDropdown ? "pl-[8px] pr-[6px]" : "px-[8px]";

    // Floating position for options menu
    const updateDropdownPos = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      let left = rect.left;
      const menuWidth = Math.max(140, rect.width);
      if (left + menuWidth > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - menuWidth - 8);
      }
      let top = rect.bottom + 4;
      setDropdownPos({ top, left });
    };

    useEffect(() => {
      if (!isOpen) return;
      updateDropdownPos();

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          buttonRef.current && !buttonRef.current.contains(target) &&
          menuRef.current && !menuRef.current.contains(target)
        ) {
          clearTimers();
          setIsOpen(false);
        }
      };

      const handleScrollOrResize = () => updateDropdownPos();

      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleScrollOrResize);
      window.addEventListener("scroll", handleScrollOrResize, true);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("resize", handleScrollOrResize);
        window.removeEventListener("scroll", handleScrollOrResize, true);
      };
    }, [isOpen]);

    // Hover triggers with Safety Zone timing
    const handleMouseEnter = () => {
      if (isDisabled || !options?.length) return;
      clearTimers();
      if (!isOpen) {
        openTimerRef.current = setTimeout(() => {
          updateDropdownPos();
          setIsOpen(true);
        }, 150); // 150ms open delay to avoid unintentional sweeps
      }
    };

    const handleMouseLeave = () => {
      if (isDisabled || !options?.length) return;
      clearTimers();
      if (isOpen) {
        closeTimerRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 200); // 200ms grace period / safety zone
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      if (options?.length) {
        clearTimers();
        updateDropdownPos();
        setIsOpen(!isOpen);
      }
      onClick?.(e);
    };

    // Determine display label if bound to options
    let displayLabel = label;
    if (multiSelect) {
      if (values && values.length > 0) {
        if (options && values.length === options.length) {
          displayLabel = label || "All Datasets";
        } else {
          displayLabel = values
            .map((v) => options?.find((opt) => opt.value === v)?.label || v)
            .join(", ");
        }
      } else {
        displayLabel = label || "All Datasets";
      }
    } else {
      const currentOption = options?.find((opt) => opt.value === value);
      displayLabel = currentOption ? currentOption.label : label;
    }

    return (
      <>
        <button
          ref={setRefs}
          type="button"
          disabled={isDisabled}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          title={typeof displayLabel === "string" ? displayLabel : undefined}
          className={`inline-flex h-[28px] max-w-full items-center gap-[4px] py-[5px] rounded-[4px] transition-colors cursor-pointer select-none min-w-0 ${paddingClasses} ${colorScheme.bg} ${className}`}
          {...props}
        >
          {/* Leading Icon */}
          {showIcon && (
            <div className={`flex shrink-0 items-center justify-center size-[16px] ${colorScheme.text}`}>
              {icon || <DefaultSparkleIcon color={colorScheme.iconColor} />}
            </div>
          )}

          {/* Label */}
          <span
            className={`t-small font-normal leading-[18px] truncate min-w-0 ${colorScheme.text}`}
          >
            {displayLabel}
          </span>

          {/* Trailing Chevron for Dropdown type */}
          {isDropdown && (
            <div className="flex shrink-0 items-center justify-center size-[16px]">
              <ChevronDownIcon color={colorScheme.chevronColor} />
            </div>
          )}
        </button>

        {/* Dropdown Menu Portal */}
        {isOpen && options && dropdownPos && createPortal(
          <div
            ref={menuRef}
            data-filter-chip-menu="true"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              minWidth: Math.max(140, buttonRef.current?.offsetWidth || 140),
              maxWidth: Math.min(360, window.innerWidth - 16),
              maxHeight: 260,
              overflowY: "auto",
              zIndex: 10050,
            }}
            className="filter-chip-menu relative rounded-[4px] border border-[#D8DADA] bg-white p-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] flex flex-col gap-[2px] before:content-[''] before:absolute before:-top-[8px] before:left-0 before:right-0 before:h-[8px]"
          >
            {multiSelect ? (
              options.map((opt) => {
                const isOptionSelected = Boolean(values?.includes(opt.value));
                return (
                  <div
                    key={opt.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearTimers();
                      const next = isOptionSelected
                        ? (values || []).filter((v) => v !== opt.value)
                        : [...(values || []), opt.value];
                      onChangeMulti?.(next);
                    }}
                    className="flex w-full items-center gap-[8px] px-[8px] py-[5px] rounded-[2px] text-left transition-colors cursor-pointer hover:bg-[#F8F7F7] select-none"
                  >
                    <Checkbox
                      checked={isOptionSelected}
                      onChange={() => {
                        clearTimers();
                        const next = isOptionSelected
                          ? (values || []).filter((v) => v !== opt.value)
                          : [...(values || []), opt.value];
                        onChangeMulti?.(next);
                      }}
                    />
                    <span className="t-small font-normal leading-[18px] truncate flex-1 min-w-0 text-[#3F4444]" title={opt.label}>
                      {opt.label}
                    </span>
                  </div>
                );
              })
            ) : (
              options.map((opt) => {
                const isOptionSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearTimers();
                      onChange?.(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-[8px] py-[5px] rounded-[2px] text-left transition-colors cursor-pointer ${
                      isOptionSelected
                        ? "bg-[#F4E8EE] text-[#830051]"
                        : "text-[#3F4444] hover:bg-[#F8F7F7]"
                    }`}
                  >
                    <span className="t-small font-normal leading-[18px] truncate flex-1 min-w-0 mr-[6px]" title={opt.label}>{opt.label}</span>
                    {isOptionSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#830051" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>,
          document.body
        )}
      </>
    );
  }
);

FilterChip.displayName = "FilterChip";
