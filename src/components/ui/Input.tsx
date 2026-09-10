import React, { forwardRef, InputHTMLAttributes, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  readOnlyView?: boolean;
  inputSize?: "default" | "sm" | "lg";
}

// Figma 549:1437 — Input Field (Default / Hovered / Focused / Error / Disabled)
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError, readOnlyView, disabled, required, inputSize = "default", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Input text color — Figma: filled text-primary, disabled Graphite/40
    const inputColor = disabled ? "var(--color-graphite-40)" : "var(--color-text-primary)";

    const sizeClasses = {
      sm: "h-[28px] rounded-[4px] px-[8px] text-[12px]",
      default: "h-[32px] rounded-[4px] px-[12px] text-[13px]",
      lg: "h-[44px] rounded-[8px] px-[14px] text-[14px]",
    }[inputSize];

    return (
      <div className={`flex items-center w-full transition-[border-color,box-shadow,background-color] ${sizeClasses} ${
        readOnlyView
          ? "border border-transparent bg-transparent"
          : disabled
            ? "border border-form-border bg-bg-panel"
            : hasError
              ? "border-[1.5px] border-form-error bg-white shadow-[0px_0px_0px_2px_rgba(204,44,60,0.12)]"
              : isFocused
                ? "border border-brand-1 bg-white shadow-[0px_0px_0px_3px_var(--color-az-secondary)]"
                : "border border-graphite-20 bg-white hover:border-graphite-50"
      } ${className}`}>
        <input
          ref={ref}
          disabled={disabled}
          required={required}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          title={typeof props.value === 'string' ? props.value : undefined}
          className="h-full w-full bg-transparent outline-none placeholder:text-text-secondary disabled:placeholder:text-graphite-40 disabled:cursor-not-allowed text-ellipsis overflow-hidden whitespace-nowrap"
          style={{
            color: inputColor,
          }}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
