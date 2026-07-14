import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", disabled = false, children, ...props }, ref) => {
    // Base styles — text uses inline style to avoid globals.css cascade issues
    const baseStyles = "inline-flex items-center justify-center gap-[4px] whitespace-nowrap rounded-[4px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 disabled:pointer-events-none active:scale-[0.96]";

    // Variant styles — Figma 221-516 (Primary), 221-554 (Secondary)
    const variants: Record<string, string> = {
      primary: "bg-brand-1 hover:bg-brand-1-hover disabled:bg-brand-1-disabled",
      secondary: "bg-az-secondary hover:bg-az-secondary-hover disabled:bg-graphite-10",
      ghost: "bg-transparent text-text-secondary hover:bg-black/5 hover:text-text-primary",
      danger: "bg-status-error text-white hover:opacity-90",
      icon: "bg-transparent hover:bg-black/5 text-text-secondary hover:text-text-primary",
    };

    // Size styles — Figma: sm=4px 8px/12px, default=8px 12px/14px, lg=8px 16px/14px
    const sizes: Record<string, string> = {
      default: "px-[12px] py-[8px]",
      sm: "px-[8px] py-[4px]",
      lg: "px-[16px] py-[8px] rounded-[8px]",
      icon: "h-[24px] w-[24px]", // Fixed square
    };

    // Text style per variant (inline to avoid globals.css .t-body-secondary color override)
    const textColors: Record<string, string> = {
      primary: "#FFFFFF",
      secondary: disabled ? "#B2B4B4" : "#830051",
      ghost: "",
      danger: "#FFFFFF",
      icon: "",
    };
    const fontSizes: Record<string, number> = { default: 14, sm: 12, lg: 14, icon: 14 };
    const useTextStyle = variant === "primary" || variant === "secondary" || variant === "danger";
    const textStyle = useTextStyle
      ? { fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: fontSizes[size], lineHeight: "20px", color: textColors[variant] }
      : undefined;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {useTextStyle ? <span style={textStyle}>{children}</span> : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
