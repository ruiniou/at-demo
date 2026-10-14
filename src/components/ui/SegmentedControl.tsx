import React from "react";
import { Tooltip } from "./Tooltip";

export type SegmentedControlOption = {
  label?: string;
  value: string;
  icon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  ariaLabel?: string;
  tooltip?: React.ReactNode;
  disabled?: boolean;
};

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "lg" | "panel";
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
  size = "lg",
}: SegmentedControlProps) {
  if (size === "panel") {
    return <div className={`flex h-[28px] shrink-0 items-center gap-px rounded-[4px] border border-graphite-10 bg-bg-panel p-px ${className}`}>
      {options.map((opt) => {
        const active = value === opt.value;
        const icon = typeof opt.icon === "function" ? opt.icon(active) : opt.icon;
        const button = <button key={opt.value} type="button" disabled={opt.disabled} aria-label={opt.ariaLabel ?? opt.label} aria-pressed={active} onClick={() => onChange(opt.value)}
          className={`relative flex h-[24px] items-center justify-center gap-1 rounded-[3px] px-2 t-small whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 disabled:opacity-40 disabled:cursor-not-allowed ${active ? "bg-white text-text-primary" : "text-text-secondary hover:bg-black/5"}`}>
          <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-[3px] border-[0.6px] border-border-default ${active ? "opacity-100" : "opacity-0"}`} />
          {icon}{opt.label}
        </button>;
        return opt.tooltip ? <Tooltip key={opt.value} label={opt.tooltip}>{button}</Tooltip> : button;
      })}
    </div>;
  }

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
              disabled={opt.disabled}
              onClick={() => !opt.disabled && onChange(opt.value)}
              aria-label={opt.ariaLabel ?? opt.label}
              className={`relative flex h-[22px] items-center justify-center rounded-[3px] px-[8px] whitespace-nowrap transition-colors after:content-[''] after:absolute after:-inset-y-[8px] after:inset-x-0 ${
                opt.disabled
                  ? "opacity-40 text-text-secondary cursor-not-allowed select-none t-small font-normal"
                  : isActive
                  ? "bg-white text-text-primary border-[0.6px] border-[#D8DADA] shadow-sm t-small-medium cursor-pointer"
                  : "text-text-secondary hover:text-text-primary t-small font-normal hover:bg-black/5 cursor-pointer"
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

