import React from "react";
import { Tooltip } from "./Tooltip";

export type SegmentedControlOption = {
  label?: string;
  value: string;
  icon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  ariaLabel?: string;
  tooltip?: React.ReactNode;
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
      <div className={`flex h-[26px] items-center rounded-[4px] bg-bg-panel p-[2px] shrink-0 ${className}`}>
        {options.map((opt) => {
          const isActive = value === opt.value;
          const iconNode = typeof opt.icon === "function" ? opt.icon(isActive) : opt.icon;
          const button = (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-label={opt.ariaLabel ?? opt.label}
              className={`relative flex h-[22px] items-center justify-center rounded-[3px] px-[8px] whitespace-nowrap transition-colors after:content-[''] after:absolute after:-inset-y-[8px] after:inset-x-0 ${
                isActive
                  ? "bg-white text-text-primary border-[0.6px] border-border-default shadow-sm t-small-medium"
                  : "text-text-secondary hover:text-text-primary t-small hover:bg-black/5"
              }`}
            >
              {iconNode}
              {opt.label && <span className={iconNode ? "ml-[4px]" : ""}>{opt.label}</span>}
            </button>
          );
          return opt.tooltip ? (
            <Tooltip key={opt.value} label={opt.tooltip}>
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </div>
    );
  }

  // Large variant — for Shell/Code view toggle
  return (
    <div className={`flex items-center rounded-[6px] border border-border-default bg-bg-panel p-[2px] shrink-0 ${className}`}>
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
