import React, { forwardRef, InputHTMLAttributes, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Figma 455:672 — Form/Input Field
// States: Default, Hovered, Focused, Error, Disabled
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, disabled, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Border + bg per state (Figma spec)
    let boxClasses = "";
    if (disabled) {
      boxClasses = "border-[1px] border-graphite-10 bg-transparent";
    } else if (error) {
      boxClasses = "border-[1.5px] border-[#E03B3B] bg-white";
    } else if (isFocused) {
      boxClasses = "border-[1px] border-brand-1 bg-white";
    } else {
      // Default + Hover
      boxClasses = "border-[1px] border-graphite-10 bg-white hover:bg-bg-panel hover:border-border-default";
    }

    // Label color
    const labelColor = disabled ? "#D8DADA" : "#3C4242";
    const starColor = disabled ? "#D8DADA" : "#830051";

    // Input text color
    const inputColor = disabled ? "#D8DADA" : "#3C4242";
    const placeholderColor = disabled ? "#D8DADA" : "#888E8E";

    return (
      <div className={`flex flex-col gap-[6px] w-full text-left ${className}`}>
        {label && (
          <div className="flex items-center gap-[2px]">
            <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: labelColor }}>
              {label}
            </span>
            {required && (
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: starColor }}>*</span>
            )}
          </div>
        )}
        <div className={`flex h-[36px] items-center rounded-[4px] px-[12px] transition-colors ${boxClasses}`}>
          <input
            ref={ref}
            disabled={disabled}
            required={required}
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            className="h-full w-full bg-transparent outline-none placeholder:text-[#888E8E] disabled:placeholder:text-[#D8DADA] disabled:cursor-not-allowed"
            style={{
              fontFamily: "'PingFang SC', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "20px",
              color: inputColor,
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#E03B3B" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
