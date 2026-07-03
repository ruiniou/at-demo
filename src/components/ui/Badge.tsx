import React from "react";

export type BadgeVariant = "default" | "ghost" | "outline";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  icon,
  className = "",
  size = "md",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-[6px] rounded-[4px] transition-colors whitespace-nowrap shrink-0";
  
  const variants = {
    default: "bg-az-secondary text-brand-1",
    ghost: "bg-transparent text-text-secondary",
    outline: "border border-border-default bg-white text-text-primary",
  };
  
  const sizes = {
    sm: "h-[20px] px-[6px] t-small-medium",
    md: "h-[36px] px-[0px] t-body-secondary", // Ghost often has no px if it's just a label
  };

  // If it's default (the original Tag), it usually has no px in ghost, but default has px-[6px].
  // We handle specific px overrides in className if needed, or by variant.
  const padding = variant === "ghost" ? "" : "px-[6px]";
  const height = size === "sm" ? "h-[20px]" : "h-[36px]";
  const typography = size === "sm" ? "t-small-medium" : "t-body-secondary";

  return (
    <div className={`${baseStyles} ${variants[variant]} ${height} ${padding} ${typography} ${className}`}>
      {icon && (
        <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center">
          {icon}
        </div>
      )}
      <span>{children}</span>
    </div>
  );
}
