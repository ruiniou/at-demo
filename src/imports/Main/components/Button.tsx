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
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

// ==================== Primary Button ====================
// Figma: 221-516, Button/Primary
// Default bg: #830051 (brand-1), text: #FFFFFF
// Hovered bg: #9A3374 (brand-1-hover)
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
    : "bg-brand-1 hover:bg-brand-1-hover";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-[4px] rounded-[4px] ${padding} ${bgClass} active:scale-[0.96] ${className}`}
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
        }}
      >
        {children}
      </span>
    </button>
  );
}

// ==================== Secondary Button ====================
// Figma: 221-554, Button/Secondary
// Default bg: #F4E8EE (az-secondary), text: #830051 (brand-1)
// Hovered bg: #E6CCDC (az-secondary-hover)
// Disabled bg: #FFFFFF, text: #B2B4B4 (graphite-40)

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
    ? "bg-white"
    : "bg-az-secondary hover:bg-az-secondary-hover";
  const textColor = disabled ? "#B2B4B4" : "#830051";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-[4px] rounded-[4px] ${padding} ${bgClass} active:scale-[0.96] ${className}`}
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
        }}
      >
        {children}
      </span>
    </button>
  );
}
