import React, { useId, useMemo, useRef, useState } from "react";
import arrowIconUrl from "../../icons/arrow-down-s-line.svg";
import { Avatar } from "./Avatar";
import { FormItem } from "./FormItem";
import { MemberOptionRow } from "./MemberOptionRow";
import { OptionList } from "./OptionList";
import { Popover } from "./Popover";
import { SearchBar } from "./SearchBar";

export interface MemberSingleSelectOption {
  name: string;
  value: string;
  initials?: string;
  color?: string;
  email?: string;
  disabled?: boolean;
}

export interface MemberSingleSelectProps {
  label?: string;
  options: MemberSingleSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  optionListClassName?: string;
}

/** Searchable, single-select member picker built from the shared selector primitives. */
export function MemberSingleSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select a member",
  searchPlaceholder = "Search people...",
  required = false,
  disabled = false,
  error,
  className = "",
  optionListClassName = "max-h-[200px]",
}: MemberSingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const selectedMember = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(query) || option.email?.toLowerCase().includes(query)
    );
  }, [options, search]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setSearch("");
  };

  const boxClasses = disabled
    ? "cursor-not-allowed border border-form-border bg-bg-panel"
    : error
      ? "border-[1.5px] border-az-danger bg-white"
      : isOpen
        ? "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]"
        : "border border-form-border bg-white hover:border-graphite-50";

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen && !disabled}
        aria-controls={isOpen && !disabled ? popoverId : undefined}
        onClick={() => !disabled && handleOpenChange(!isOpen)}
        className={`flex h-[32px] w-full items-center gap-[8px] rounded-[4px] pl-[8px] pr-[10px] text-left transition-[border-color,box-shadow,background-color] ${boxClasses}`}
      >
        <Avatar
          name={selectedMember?.name}
          initials={selectedMember?.initials}
          color={selectedMember?.color}
          level="menu"
          disabled={disabled}
        />
        <span className={`min-w-0 flex-1 truncate t-small ${disabled ? "text-graphite-40" : selectedMember ? "text-text-primary" : "text-text-secondary"}`}>
          {selectedMember?.name ?? placeholder}
        </span>
        <img src={arrowIconUrl} alt="" className="size-[20px] shrink-0" style={{ opacity: disabled ? 0.4 : 1 }} />
      </button>

      <Popover
        open={isOpen && !disabled}
        onOpenChange={handleOpenChange}
        anchorRef={triggerRef}
        id={popoverId}
        label={label || placeholder}
        className="flex flex-col gap-[6px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]"
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
          background="light"
          size="compact"
          variant="embedded"
          autoFocus
        />
        <OptionList
          empty={filteredOptions.length === 0}
          emptyContent="No matching users"
          className={optionListClassName}
        >
          {filteredOptions.map((option) => (
            <MemberOptionRow
              key={option.value}
              name={option.name}
              initials={option.initials}
              color={option.color}
              selected={option.value === value}
              disabled={option.disabled}
              onSelect={() => {
                onChange(option.value);
                handleOpenChange(false);
              }}
            />
          ))}
        </OptionList>
      </Popover>
    </FormItem>
  );
}
