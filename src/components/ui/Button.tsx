import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon" | "danger" | "secondary-danger";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", disabled = false, loading = false, children, ...props }, ref) => {
    // Base styles — text uses inline style to avoid globals.css cascade issues
    const baseStyles = "inline-flex items-center justify-center gap-[6px] whitespace-nowrap flex-nowrap shrink-0 rounded-[4px] transition-all focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 disabled:pointer-events-none active:scale-[0.98]";

    // Variant styles — Figma 221-516 (Primary), 221-554 (Secondary)
    const variants: Record<string, string> = {
      primary: "bg-brand-1 hover:bg-az-warning disabled:bg-brand-1-disabled shadow-sm",
      secondary: "bg-graphite-20 hover:bg-graphite-40 disabled:bg-white",
      ghost: "bg-transparent text-text-secondary hover:bg-black/5 hover:text-text-primary",
      danger: "bg-status-error text-white hover:bg-[#B3202F] active:bg-[#991523] disabled:bg-graphite-10 disabled:cursor-not-allowed",
      "secondary-danger": "bg-status-error-bg hover:bg-status-error-border active:bg-[#EE808F] disabled:bg-white disabled:cursor-not-allowed",
      icon: "bg-transparent hover:bg-black/5 text-text-secondary hover:text-text-primary",
    };

    // Size styles — Figma: sm=4px 8px/12px, default=8px 12px/14px, lg=8px 16px/14px, xl=44px touch target
    const sizes: Record<string, string> = {
      default: "px-[12px] py-[8px]",
      sm: "px-[8px] py-[4px]",
      lg: "px-[16px] py-[8px] rounded-[8px]",
      xl: "h-[44px] px-[16px] py-[10px] rounded-[8px] w-full",
      icon: "h-[24px] w-[24px]", // Fixed square
    };

    // Text style per variant (inline to avoid globals.css .t-body-secondary color override)
    const textColors: Record<string, string> = {
      primary: "#FFFFFF",
      secondary: disabled ? "#B2B4B4" : "#3F4444",
      ghost: "",
      danger: disabled ? "#B2B4B4" : "#FFFFFF",
      "secondary-danger": disabled ? "#B2B4B4" : "#B3202F",
      icon: "",
    };
    const fontSizes: Record<string, number> = { default: 14, sm: 12, lg: 14, xl: 15, icon: 14 };
    const fontWeights: Record<string, number> = { default: 400, sm: 400, lg: 400, xl: 500, icon: 400 };
    const useTextStyle = variant === "primary" || variant === "secondary" || variant === "danger" || variant === "secondary-danger";
    const textStyle = useTextStyle
      ? { fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: fontWeights[size] || 400, fontSize: fontSizes[size], lineHeight: "20px", color: textColors[variant] }
      : undefined;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {useTextStyle ? (
          <span className="inline-flex items-center justify-center gap-[4px] whitespace-nowrap flex-nowrap shrink-0" style={textStyle}>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
