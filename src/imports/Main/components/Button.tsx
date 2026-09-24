import React from "react";

// ==================== Button Component ====================
// Figma: 221-516 (Primary), 221-554 (Secondary)
// States: Default, Hovered, Disabled
// Sizes: sm (4px 8px, 12px text), medium (8px 12px, 14px text)

type ButtonSize = "sm" | "medium";

interface ButtonProps {
  children: React.ReactNode;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
}

// ==================== Primary Button ====================
// Figma: 221-516, Button/Primary
// Default bg: #830051 (brand-1), text: #FFFFFF
// Hovered bg: #F0AB00 (az-warning)
// Disabled bg: #E6CCDC (brand-1-disabled), text: #FFFFFF

export function PrimaryButton({
  children,
  size = "medium",
  disabled = false,
  icon,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const padding = size === "sm" ? "px-[8px] py-[4px]" : "px-[12px] py-[8px]";
  const fontSize = size === "sm" ? 12 : 14;
  const iconSize = size === "sm" ? 14 : 16;
  const bgClass = disabled
    ? "bg-brand-1-disabled"
    : "bg-brand-1 hover:bg-az-warning";
  const hitAreaClass = size === "sm"
    ? "relative after:content-[''] after:absolute after:-inset-y-[6px] after:inset-x-0"
    : "relative after:content-[''] after:absolute after:-inset-y-[2px] after:inset-x-0";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-[4px] rounded-[4px] whitespace-nowrap ${padding} ${bgClass} ${hitAreaClass} active:scale-[0.96] ${className}`}
    >
      {icon && (
        <span
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#FFFFFF",
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontFamily: "'PingFang SC', sans-serif",
          fontWeight: 400,
          fontSize,
          lineHeight: "20px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </button>
  );
}

// ==================== Secondary Button ====================
// Figma: 221-554, Button/Secondary
// Default bg: #F4E8EE (AZ secondary), text & icon: #830051 (brand-1)
// Hovered bg: #E6CCDC (mulberry-20 / AZ secondary hover), text & icon: #830051 (brand-1)
// Disabled bg: #FFFFFF, text & icon: #B2B4B4 (graphite-40)

export function SecondaryButton({
  children,
  size = "medium",
  disabled = false,
  icon,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const padding = size === "sm" ? "px-[8px] py-[4px]" : "px-[12px] py-[8px]";
  const fontSize = size === "sm" ? 12 : 14;
  const iconSize = 16;
  const bgClass = disabled
    ? "bg-white border border-graphite-20"
    : "bg-az-secondary hover:bg-az-secondary-hover";
  const textColor = disabled ? "var(--color-graphite-40)" : "var(--color-brand-1)";
  const hitAreaClass = size === "sm"
    ? "relative after:content-[''] after:absolute after:-inset-y-[6px] after:inset-x-0"
    : "relative after:content-[''] after:absolute after:-inset-y-[2px] after:inset-x-0";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-[4px] rounded-[4px] whitespace-nowrap ${padding} ${bgClass} ${hitAreaClass} active:scale-[0.96] ${className}`}
    >
      {icon && (
        <span
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: textColor,
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontFamily: "'PingFang SC', sans-serif",
          fontWeight: 400,
          fontSize,
          lineHeight: "20px",
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </button>
  );
}
