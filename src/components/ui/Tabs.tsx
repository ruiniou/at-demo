import React from "react";

export type TabOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export interface TabsProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ options, value, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex items-center gap-[8px] h-[32px] w-full px-[8px] py-[4px] ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`relative flex h-[24px] items-center gap-[2px] rounded-[4px] px-[4px] transition-colors active:scale-[0.96] after:content-[''] after:absolute after:-inset-y-[8px] after:inset-x-0 ${
              isSelected ? "bg-graphite-10" : "hover:bg-graphite-10 bg-transparent"
            }`}
          >
            {option.icon && (
              <div className="flex h-[16px] w-[16px] items-center justify-center">
                {option.icon}
              </div>
            )}
            <span
              className={isSelected ? "t-small-medium text-text-primary" : "t-small text-text-secondary"}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
