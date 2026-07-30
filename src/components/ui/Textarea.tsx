import React, { forwardRef, TextareaHTMLAttributes, useState } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  readOnlyView?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError, readOnlyView, disabled, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Text color — Figma: filled text-primary, disabled Graphite/40
    const inputColor = disabled ? "var(--color-graphite-40)" : "var(--color-text-primary)";

    return (
      <div className={`flex items-start w-full rounded-[4px] px-[12px] py-[8px] transition-[border-color,box-shadow,background-color] ${
        readOnlyView
          ? "border border-transparent bg-transparent"
          : disabled
            ? "border border-form-border bg-bg-panel"
            : hasError
              ? "border-[1.5px] border-form-error bg-white"
              : isFocused
                ? "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]"
                : "border border-form-border bg-white hover:border-graphite-50"
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
          className={`flex-1 min-w-0 h-full bg-transparent outline-none placeholder:text-text-secondary ${
            disabled ? "cursor-not-allowed" : ""
          } t-small`}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
