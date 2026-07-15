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
        "flex items-center gap-[8px] p-[8px] rounded-[4px] h-[40px] transition-colors cursor-pointer",
        "hover:bg-bg-panel",
        selected ? "bg-bg-panel" : "bg-transparent",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "w-[20px] h-[20px] rounded-[4px] shrink-0 flex items-center justify-center border-[0.6px] border-graphite-10",
          selected ? "bg-brand-1" : "bg-graphite-10",
        ].join(" ")}
      >
        <span className={["t-small leading-[20px] text-center", selected ? "text-white" : "text-text-secondary"].join(" ")}>
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
          className="flex-1 t-caption text-text-primary placeholder:text-graphite-40 bg-transparent border-none outline-none min-w-0"
        />
      )}
    </div>
  );
}

export default AIAskOption;
