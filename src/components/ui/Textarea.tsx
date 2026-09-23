import React, { forwardRef, TextareaHTMLAttributes, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  readOnlyView?: boolean;
  textareaSize?: "default" | "lg";
}

// Text Area derivative of Input Field. Uses the same border, focus ring,
// error, disabled, typography, and spacing tokens as Input.
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError, readOnlyView, disabled, required, textareaSize = "default", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Text color — Figma: filled text-primary, disabled Graphite/40
    const inputColor = disabled ? "var(--color-graphite-40)" : "var(--color-text-primary)";

    return (
      <div className={`flex w-full items-start rounded-[4px] transition-[border-color,box-shadow,background-color] ${textareaSize === "lg" ? "px-[14px] py-[10px] text-[14px]" : "px-[12px] py-[8px] text-[13px]"} ${
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
        <textarea
          ref={ref}
          disabled={disabled}
          required={required}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{ 
            color: inputColor,
            resize: props.style?.resize || "vertical",
            ...props.style
          }}
          className={`min-w-0 flex-1 bg-transparent leading-[20px] outline-none placeholder:text-text-secondary ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
