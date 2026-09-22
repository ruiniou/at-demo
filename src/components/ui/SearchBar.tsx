import React, { useState, useRef, useEffect } from "react";
import searchIconUrl from "../../icons/search-line.svg";
import closeIconUrl from "../../icons/close-line.svg";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** "light" = white inner bg, "dark" = #EBECEC inner bg */
  background?: "light" | "dark";
  className?: string;
  autoFocus?: boolean;
  size?: "default" | "compact";
  variant?: "default" | "embedded";
  icon?: React.ReactNode;
}

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search…",
  background = "light",
  className = "",
  autoFocus = false,
  size = "default",
  variant = "default",
  icon,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const hasValue = value.length > 0;
  const searchIconMask = `url("${searchIconUrl}") center / contain no-repeat`;
  const outerRadius = variant === "embedded" ? "rounded-[calc(var(--radius-xs)*2)]" : "rounded-md";
  const innerRadius = variant === "embedded" ? "rounded-xs" : "rounded-sm";

  // Outer wrapper styles by state
  let outerClasses = `flex ${size === "compact" ? "h-8" : "h-[36px]"} items-stretch ${outerRadius} p-[2px] gap-[6px] border-[0.6px]`;
  if (isFocused) {
    // Focused: bg #E6CCDC, border 0.6px #830051
    outerClasses += " bg-az-secondary-hover border-brand-1";
  } else {
    // Default / Typed:
    outerClasses += background === "dark" ? " border-transparent" : " border-[#D8DADA]";
  }

  // Inner frame
  const innerBg = background === "dark" ? "bg-graphite-10" : "bg-white";
  // Typed state has asymmetric padding: 4px 4px 4px 6px
  const innerPadding = size === "compact"
    ? "py-0 pl-[6px] pr-[4px]"
    : hasValue ? "p-[4px_4px_4px_6px]" : "p-[4px_6px]";
  const innerClasses = `flex flex-1 items-center gap-[6px] ${innerRadius} ${innerBg} ${innerPadding}`;

  const handleClear = () => {
    if (onChange) onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`${outerClasses} ${className}`}>
      <div className={innerClasses}>
        {/* Search icon + input */}
        <div className="flex flex-1 items-center gap-[6px] min-w-0">
          {icon ?? (
            <span
              aria-hidden="true"
              className={`h-[16px] w-[16px] shrink-0 bg-current ${background === "light" ? "text-text-secondary" : "text-text-primary"}`}
              style={{ mask: searchIconMask, WebkitMask: searchIconMask }}
            />
          )}
          <div className="flex flex-1 items-center min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "20px",
                color: "#3F4444",
              }}
            />
          </div>
        </div>
        {/* Close button when typed */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="relative flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px]"
          >
            <img src={closeIconUrl} alt="" className="h-[16px] w-[16px]" />
          </button>
        )}
      </div>
    </div>
  );
}
