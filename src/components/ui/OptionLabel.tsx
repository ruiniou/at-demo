import React from "react";
import checkIconUrl from "../../icons/check-line.svg";

export interface OptionLabelProps {
  /** The main label text */
  label: string;
  /** Optional sub-label (for multi-select type) */
  sub?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** "single" = check icon, "multi" = checkbox */
  type?: "single" | "multi";
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

/**
 * Figma 1124:5566 — Option label component
 * Used inside Dropdown panels and option lists
 * States: Default, Hovered, Selected
 * Types: Single select (check icon), Multi-Select (checkbox square)
 */
export function OptionLabel({
  label,
  sub,
  selected = false,
  type = "single",
  onClick,
  className = "",
}: OptionLabelProps) {
  const isSingle = type === "single";
  const gap = isSingle ? "gap-[6px]" : "gap-[8px]";
  const padding = isSingle ? "p-[2px_4px_2px_2px]" : "p-[2px_4px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center ${gap} ${padding} rounded-[2px] text-left transition-colors hover:bg-[#F8F7F7] ${className}`}
    >
      {isSingle ? (
        /* Single select: check-line icon, visible only when selected */
        <img
          src={checkIconUrl}
          alt=""
          className="h-[16px] w-[16px] shrink-0"
          style={{ opacity: selected ? 1 : 0 }}
        />
      ) : (
        /* Multi-select: checkbox square 14x14 */
        <span
          className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border ${
            selected
              ? "border-brand-1 bg-brand-1"
              : "border-[#D8DADA] bg-white"
          }`}
        >
          {selected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="white"/>
            </svg>
          )}
        </span>
      )}

      <span
        style={{
          fontFamily: "'PingFang SC', sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "20px",
          color: "#3C4242",
        }}
      >
        {label}
      </span>

      {sub && (
        <span
          style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: "#888E8E",
          }}
        >
          {sub}
        </span>
      )}
    </button>
  );
}
