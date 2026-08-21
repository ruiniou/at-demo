import React from "react";

export interface AIAskOptionProps {
  letter: string;
  label?: string;
  placeholder?: string;
  value?: string;
  selected?: boolean;
  type?: "selection" | "custom";
  onChange?: (value: string) => void;
  onClick?: () => void;
  className?: string;
}

export function AIAskOption({
  letter,
  label = "Option",
  placeholder = "Or, describe your needs…",
  value = "",
  selected = false,
  type = "selection",
  onChange,
  onClick,
  className = "",
}: AIAskOptionProps) {
  return (
    <div
      onClick={type === "selection" ? onClick : undefined}
      className={[
        "flex items-center gap-[8px] p-[8px] rounded-[4px] h-[40px] transition-all cursor-pointer",
        selected 
          ? "bg-white border border-brand-1/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" 
          : "bg-white/70 hover:bg-white border border-transparent",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "w-[20px] h-[20px] rounded-[4px] shrink-0 flex items-center justify-center transition-colors",
          selected ? "bg-brand-1 text-white" : "bg-graphite-20 text-text-secondary",
        ].join(" ")}
      >
        <span className="t-small leading-[20px] text-center font-medium">
          {letter}
        </span>
      </div>

      {type === "selection" ? (
        <span className="t-caption text-text-primary truncate">{label}</span>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 t-caption text-text-primary placeholder:text-[#B2B4B4] bg-transparent border-none outline-none min-w-0"
        />
      )}
    </div>
  );
}

export default AIAskOption;
