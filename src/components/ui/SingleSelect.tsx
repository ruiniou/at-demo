import React, { useId, useRef, useState } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { FormItem } from "./FormItem";
import { OptionList } from "./OptionList";
import { OptionRow } from "./OptionRow";
import { Popover } from "./Popover";

export type SingleSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  derivation?: string;
  dataset?: string;
};

export interface SingleSelectProps {
  label?: string;
  options: SingleSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  customBoxClass?: string;
  customTextColor?: string;
  customTextStyle?: React.CSSProperties;
  suffixNode?: React.ReactNode;
  triggerClassName?: string;
  badge?: React.ReactNode;
  optionListClassName?: string;
}

/** Fundamental single-select: single-line trigger, text options, and caller-owned list height. */
export function SingleSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  required = false,
  className = "",
  error,
  disabled = false,
  customBoxClass,
  customTextColor,
  customTextStyle,
  suffixNode,
  triggerClassName,
  badge,
  optionListClassName = "max-h-[200px]",
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const selectedOption = options.find((option) => option.value === value);

  const boxClasses = customBoxClass
    ? customBoxClass
    : disabled
      ? "cursor-not-allowed border border-form-border bg-bg-panel"
      : error
        ? "border-[1.5px] border-az-danger bg-white"
        : isOpen
          ? "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]"
          : "border border-form-border bg-white hover:border-graphite-50";

  const textColor = customTextColor
    ? customTextColor
    : disabled
      ? "var(--color-graphite-40)"
      : selectedOption
        ? "var(--color-text-primary)"
        : "var(--color-text-secondary)";

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      required={required}
      disabled={disabled}
      error={error}
      badge={badge}
      className={className}
    >
      <div className="relative">
        <button
          ref={triggerRef}
          aria-haspopup="dialog"
          aria-expanded={isOpen && !disabled}
          aria-controls={isOpen && !disabled ? popoverId : undefined}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`relative flex w-full items-center justify-between gap-[8px] transition-[border-color,box-shadow,background-color] after:absolute after:inset-x-0 after:-inset-y-[2px] after:content-[''] ${triggerClassName || "h-[32px] rounded-[4px] pl-[12px] pr-[10px]"} ${boxClasses}`}
        >
          <span
            title={selectedOption ? selectedOption.label : placeholder}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "18px",
              color: textColor,
              ...customTextStyle,
            }}
            className="min-w-0 flex-1 truncate text-left"
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex shrink-0 items-center gap-[4px]">
            {suffixNode && <div onClick={(event) => event.stopPropagation()}>{suffixNode}</div>}
            <img src={arrowIconUrl} alt="" className="h-[20px] w-[20px]" style={{ opacity: disabled ? 0.4 : 1 }} />
          </div>
        </button>

        <Popover
          open={isOpen && !disabled}
          onOpenChange={setIsOpen}
          anchorRef={triggerRef}
          id={popoverId}
          label={label || placeholder}
          className="shadow-[0px_2px_6px_rgba(0,0,0,0.1)]"
        >
          <OptionList empty={options.length === 0} className={optionListClassName}>
            {options.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                disabled={option.disabled}
                selected={option.value === value}
                onSelect={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              />
            ))}
          </OptionList>
        </Popover>
      </div>
    </FormItem>
  );
}
