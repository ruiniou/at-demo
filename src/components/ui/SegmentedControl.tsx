import React from "react";

export type SegmentedControlOption = {
  label: string;
  value: string;
};

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "lg";
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
  size = "lg",
}: SegmentedControlProps) {
  if (size === "sm") {
    // Figma 646:2294 — small variant for upload card
    return (
      <div className={`flex h-[24px] items-center rounded-[4px] bg-bg-light shrink-0 ${className}`}>
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex h-full items-center justify-center rounded-[3px] px-[6px] whitespace-nowrap transition-colors after:content-[''] after:absolute after:-inset-y-[8px] after:inset-x-0 ${
                isActive
                  ? "bg-white border-[0.6px] border-[#D8DADA]"
                  : "hover:bg-black/5"
              }`}
            >
              <span
                style={{
                  fontFamily: "'PingFang SC', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "20px",
                  textAlign: "center",
                  color: isActive ? "#3C4242" : "#888E8E",
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Large variant — for Shell/Code view toggle
  return (
    <div className={`flex items-center rounded-[6px] border border-border-default bg-bg-light p-[2px] shrink-0 ${className}`}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative flex flex-1 items-center justify-center rounded-[4px] px-[12px] py-[4px] transition-all whitespace-nowrap after:content-[''] after:absolute after:-inset-y-[7px] after:inset-x-0
              ${
                isActive
                  ? "bg-white text-text-primary shadow-[0px_1px_3px_rgba(0,0,0,0.1)] t-small-medium"
                  : "text-text-secondary hover:text-text-primary t-small"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

