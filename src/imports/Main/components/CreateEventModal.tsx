import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import aiProcessingIconUrl from "../../../icons/Status label/Status=AI Processing.svg";
import wipStatusIconUrl from "../../../icons/Status label/Status=WIP.svg";
import completedStatusIconUrl from "../../../icons/Status label/Status=Completed.svg";
import untouchedStatusIconUrl from "../../../icons/Status label/Status=Untouched.svg";
import errorStatusIconUrl from "../../../icons/Status label/Status=Error.svg";
import uploadIconUrl from "../../../icons/upload-2-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import fileIconUrl from "../../../icons/file-icon.svg";
import linkIconUrl from "../../../icons/link.svg";
import searchIconUrl from "../../../icons/search-line.svg";
import checkIconUrl from "../../../icons/check-line.svg";
import arrowDownIconUrl from "../../../icons/arrow-down-s-line.svg";
import { PrimaryButton, SecondaryButton } from "./Button";

// ==================== Icons ====================

function CloseIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" fill={color} />
    </svg>
  );
}

function ArrowDownIcon({ size = 20, color = "#888E8E", rotated = false }: { size?: number; color?: string; rotated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={rotated ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04995 8.22168L11.9997 13.1714Z" fill={color} />
    </svg>
  );
}

function CheckIcon({ size = 16, color = "#3C4242" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill={color} />
    </svg>
  );
}

function UploadIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 14H18L12 8L6 14H11V21H13V14ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z" fill={color} />
    </svg>
  );
}

function ArrowRightIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1714 12L8.22168 7.05025L9.63589 5.63604L15.9999 12L9.63589 18.364L8.22168 16.9497L13.1714 12Z" fill={color} />
    </svg>
  );
}

function ChevronRightIcon({ size = 18, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1714 12L8.22168 7.05025L9.63589 5.63604L15.9999 12L9.63589 18.364L8.22168 16.9497L13.1714 12Z" fill={color} />
    </svg>
  );
}

function SearchIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 4C6.91 4 4 6.91 4 10.5C4 14.09 6.91 17 10.5 17C12.11 17 13.58 16.41 14.72 15.44L18.29 19L19 18.29L15.44 14.72C16.41 13.58 17 12.11 17 10.5C17 6.91 14.09 4 10.5 4ZM10.5 5C13.54 5 16 7.46 16 10.5C16 13.54 13.54 16 10.5 16C7.46 16 5 13.54 5 10.5C5 7.46 7.46 5 10.5 5Z" fill={color} />
    </svg>
  );
}

function FilterIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4H21V6L14 13V20L10 16V13L3 6V4Z" fill={color} />
    </svg>
  );
}

function FileIcon({ size = 20, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3H4V21H20V10L13 3ZM13 5.5L17.5 10H13V5.5Z" fill={color} fillRule="evenodd" />
    </svg>
  );
}

function LoaderIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
      <path d="M12 3C7.03 3 3 7.03 3 12H5C5 8.13 8.13 5 12 5V3Z" fill={color} />
    </svg>
  );
}

function ErrorWarningIcon({ size = 20, color = "#CC2C3C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill={color} />
    </svg>
  );
}

function LinkIcon({ size = 20, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.657 8.343L13.414 12.586L14.828 14L19.071 9.757C20.633 8.196 20.633 5.663 19.071 4.101C17.51 2.54 14.977 2.54 13.415 4.101L9.172 8.343C7.61 9.905 7.61 12.438 9.172 14L10.586 12.586C9.805 11.805 9.805 10.538 10.586 9.757L14.828 5.515C15.61 4.734 16.876 4.734 17.657 5.515C18.439 6.296 18.439 7.563 17.657 8.343ZM6.343 15.657L10.586 11.414L9.172 10L4.929 14.243C3.367 15.804 3.367 18.337 4.929 19.899C6.49 21.46 9.023 21.46 10.585 19.899L14.828 15.657C16.39 14.095 16.39 11.562 14.828 10L13.414 11.414C14.195 12.195 14.195 13.462 13.414 14.243L9.172 18.485C8.39 19.266 7.124 19.266 6.343 18.485C5.561 17.704 5.561 16.437 6.343 15.657Z" fill={color} />
    </svg>
  );
}

function MoreIcon({ size = 16, color = "#888E8E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10C3.895 10 3 10.895 3 12C3 13.105 3.895 14 5 14C6.105 14 7 13.105 7 12C7 10.895 6.105 10 5 10ZM12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10ZM19 10C17.895 10 17 10.895 17 12C17 13.105 17.895 14 19 14C20.105 14 21 13.105 21 12C21 10.895 20.105 10 19 10Z" fill={color} />
    </svg>
  );
}

// ==================== Checkbox ====================

function Checkbox({ checked, onChange, size = 16 }: { checked: boolean; onChange: () => void; size?: number }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div className={`flex items-center justify-center rounded-[3px] border ${checked ? "border-brand-1 bg-brand-1" : "border-border-default bg-white"}`} style={{ width: size, height: size }}>
        {checked && <CheckIcon size={12} color="#FFFFFF" />}
      </div>
    </button>
  );
}

// ==================== Form Field Components ====================
// Figma: 455:672 (Input Field), 455:673 (Dropdown Field)
// States: Default, Hovered, Focused, Error, Disabled

type DropdownOption = { label: string; value: string };

type FieldState = "default" | "hovered" | "focused" | "error" | "disabled";

function getBoxStyle(state: FieldState): { bg: string; border: string; borderWidth: number } {
  switch (state) {
    case "hovered":  return { bg: "var(--color-bg-light)", border: "var(--color-border-default)", borderWidth: 1 };
    case "focused":  return { bg: "#FFFFFF", border: "var(--color-brand-1)", borderWidth: 1 };
    case "error":    return { bg: "#FFFFFF", border: "var(--color-status-error)", borderWidth: 1.5 };
    case "disabled": return { bg: "transparent", border: "var(--color-graphite-10)", borderWidth: 1 };
    default:         return { bg: "#FFFFFF", border: "var(--color-graphite-10)", borderWidth: 1 };
  }
}

function FieldLabel({ label, required, disabled }: { label: string; required?: boolean; disabled?: boolean }) {
  const labelColor = disabled ? "var(--color-border-default)" : "var(--color-text-primary)";
  const starColor = disabled ? "var(--color-border-default)" : "var(--color-brand-1)";
  return (
    <div className="flex gap-[2px]" style={{ alignItems: "center" }}>
      <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: labelColor }}>{label}</span>
      {required && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: starColor }}>*</span>}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-status-error)" }}>{message}</span>
  );
}

// ==================== Dropdown Field (455:673) ====================

function DropdownField({
  label, required, placeholder, options, value, onChange,
  error, errorMessage, disabled,
}: {
  label: string; required?: boolean; placeholder: string;
  options: DropdownOption[]; value: string | null; onChange: (value: string) => void;
  error?: boolean; errorMessage?: string; disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel = value ? options.find((o) => o.value === value)?.label ?? placeholder : placeholder;

  // Determine state
  let state: FieldState = "default";
  if (disabled) state = "disabled";
  else if (error) state = "error";
  else if (isOpen) state = "focused";
  else if (isHovered) state = "hovered";

  const box = getBoxStyle(state);
  const textColor = disabled ? "#D8DADA" : (value ? "#3C4242" : "#888E8E");
  const arrowColor = disabled ? "var(--color-border-default)" : "var(--color-text-secondary)";

  return (
    <div className="relative flex flex-col gap-[6px]" ref={containerRef}>
      <FieldLabel label={label} required={required} disabled={disabled} />
      <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        className="flex w-full rounded-[4px] text-left"
        style={{ height: 36, alignItems: "center", justifyContent: "space-between", paddingLeft: 12, paddingRight: 10, backgroundColor: box.bg, border: `${box.borderWidth}px solid ${box.border}`, cursor: disabled ? "default" : "pointer" }}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: textColor }}>{selectedLabel}</span>
        <ArrowDownIcon size={20} color={arrowColor} rotated={isOpen} />
      </button>
      {error && !disabled && errorMessage && <ErrorMessage message={errorMessage} />}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-[200] mt-[2px] rounded-[4px] border border-graphite-10 bg-white p-[4px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col gap-[2px] px-[6px]">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button key={option.value} type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className="flex rounded-[2px] py-[2px] pl-[2px] pr-[4px] text-left hover:bg-bg-light"
                  style={{ alignItems: "center", gap: isSelected ? "4px" : "6px" }}>
                  <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center" style={{ opacity: isSelected ? 1 : 0 }}>
                    <CheckIcon size={16} color="#830051" />
                  </div>
                  <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-text-primary)" }}>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Input Field (455:672) ====================

function InputField({
  label, required, placeholder, value, onChange,
  error, errorMessage, disabled,
}: {
  label: string; required?: boolean; placeholder: string; value: string; onChange: (value: string) => void;
  error?: boolean; errorMessage?: string; disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  let state: FieldState = "default";
  if (disabled) state = "disabled";
  else if (error) state = "error";
  else if (isFocused) state = "focused";
  else if (isHovered) state = "hovered";

  const box = getBoxStyle(state);
  const textColor = disabled ? "#D8DADA" : (value ? "#3C4242" : "#888E8E");
  const placeholderColor = disabled ? "var(--color-border-default)" : "var(--color-text-secondary)";

  return (
    <div className="flex flex-col gap-[6px]">
      <FieldLabel label={label} required={required} disabled={disabled} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        className={`w-full rounded-[4px] outline-none ${disabled ? "placeholder:text-border-default" : "placeholder:text-text-secondary"}`}
        style={{ height: 36, paddingLeft: 12, paddingRight: 12, backgroundColor: box.bg, border: `${box.borderWidth}px solid ${box.border}`, fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: textColor, cursor: disabled ? "default" : "text" }} />
      {error && !disabled && errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}

// ==================== Segmented Control ====================

function SegmentedControl({ options, selectedIndex, onChange }: { options: string[]; selectedIndex: number; onChange: (index: number) => void }) {
  return (
    <div className="flex h-[24px] items-stretch rounded-[4px] bg-bg-light p-[2px]">
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button key={option} type="button" onClick={() => onChange(index)}
            className={`flex items-center justify-center rounded-[3px] px-[6px] transition-colors ${isSelected ? "border-[0.6px] border-border-default bg-white" : "border-[0.6px] border-transparent hover:bg-black/5"}`}>
            <span className="t-small" style={{ color: isSelected ? "#3C4242" : "#888E8E" }}>{option}</span>
          </button>
        );
      })}
    </div>
  );
}

// ==================== File Upload Row ====================

type UploadStatus = "pending" | "uploading" | "uploaded" | "error" | "use-existing";

function FileUploadSection({
  label, required, requirementText, showSegmentedControl = false,
  status: initialStatus = "pending", fileName = "", errorMessage = "", uploadProgress = 45,
}: {
  label: string; required?: boolean; requirementText: string; showSegmentedControl?: boolean;
  status?: UploadStatus; fileName?: string; errorMessage?: string; uploadProgress?: number;
}) {
  const [currentStatus, setCurrentStatus] = useState<UploadStatus>(initialStatus);
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedExistingFile, setSelectedExistingFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const existingFileOptions = [
    "adam_spec_v2.3.xlsx",
    "adam_spec_v1.0.xlsx",
    "adam_spec_beta.xlsx",
    "adam_spec_draft.xlsx",
    "adam_spec_old.xlsx",
  ];
  const filteredOptions = existingFileOptions.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

  // Segmented Control visibility: show only in pending (default) or error state
  const showSegmented = showSegmentedControl && (currentStatus === "pending" || currentStatus === "error");

  const handleSegmentedChange = (idx: number) => {
    setSegmentedIndex(idx);
    if (idx === 0) setDropdownOpen(false);
  };

  const handleClear = () => {
    setCurrentStatus("pending");
    setSelectedExistingFile(null);
    setSegmentedIndex(0);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const labelEl = (
    <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: "var(--color-text-primary)" }}>{label}</span>
  );
  const requiredStar = required ? <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "var(--color-brand-1)" }}>*</span> : null;

  let uploadArea;

  if (showSegmented && segmentedIndex === 1) {
    // "Use Existing" tab selected — show dropdown to select an existing file
      uploadArea = (
        <div className="relative flex flex-col gap-[2px]">
          {/* Dropdown box */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-[36px] items-center justify-between rounded-[4px] border border-graphite-10 bg-white pl-[12px] pr-[10px]"
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>Select an existing file...</span>
            <div className={dropdownOpen ? "rotate-180" : ""}>
              <img src={arrowDownIconUrl} alt="" className="h-[20px] w-[20px] shrink-0" />
            </div>
          </button>
          {/* Dropdown panel */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-[5]" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 right-0 top-[38px] z-10 flex flex-col gap-[8px] rounded-[4px] border border-graphite-10 bg-white p-[4px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
                {/* Search bar */}
                <div className="flex h-[28px] items-stretch rounded-[4px] border border-brand-1 bg-brand-1/20 p-[2px]">
                  <div className="flex flex-1 items-center gap-[6px] rounded-[2px] bg-white px-[6px] py-[4px]">
                    <img src={searchIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="h-full w-full bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-secondary"
                      style={{ fontFamily: "'PingFang SC', sans-serif" }}
                      autoFocus
                    />
                  </div>
                </div>
                {/* Option list */}
                <div className="flex flex-col gap-[2px] px-[6px]">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedExistingFile === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => { setSelectedExistingFile(option); setDropdownOpen(false); setSearchQuery(""); setCurrentStatus("use-existing"); }}
                        className="flex rounded-[2px] py-[2px] pl-[2px] pr-[4px] text-left hover:bg-bg-light"
                        style={{ alignItems: "center", gap: isSelected ? "4px" : "6px" }}
                      >
                        <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center" style={{ opacity: isSelected ? 1 : 0 }}>
                          <img src={checkIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
                        </div>
                        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "var(--color-text-primary)" }}>{option}</span>
                      </button>
                    );
                  })}
                  {filteredOptions.length === 0 && (
                    <div className="px-[4px] py-[4px]">
                      <span className="t-small text-text-secondary">No results found</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
  } else if (currentStatus === "pending") {
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-dashed border-graphite-10 bg-white p-[8px_12px]" style={{ borderStyle: "dashed", borderWidth: "1px", borderColor: "var(--color-graphite-10)" }}>
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex min-w-0 flex-1 items-center gap-[8px]">
            <img src={uploadIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            <span className="t-small text-text-secondary">{requirementText}</span>
          </div>
          <SecondaryButton size="sm">Upload</SecondaryButton>
        </div>
      </div>
    );
  } else if (currentStatus === "uploading") {
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-bg-light p-[8px_12px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex min-w-0 flex-1 items-center gap-[8px]">
            <img src={fileIconUrl} alt="" className="h-[20px] w-[20px] shrink-0" />
            <span className="t-small text-text-secondary">{requirementText}</span>
          </div>
          <div className="flex shrink-0 items-center gap-[6px]">
            <LoaderIcon size={16} color="var(--color-text-secondary)" />
            <span className="t-body-secondary text-text-secondary">Uploading… {uploadProgress}%</span>
          </div>
        </div>
      </div>
    );
  } else if (currentStatus === "uploaded") {
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_12px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex min-w-0 flex-1 items-center gap-[8px]">
            <img src={fileIconUrl} alt="" className="h-[20px] w-[20px] shrink-0" />
            <div className="flex items-center gap-[4px]">
              <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: "var(--color-text-primary)" }}>{fileName}</span>
              <img src={completedStatusIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            </div>
          </div>
          <button type="button" onClick={handleClear} className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-graphite-10" aria-label="Clear file">
            <img src={closeIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
          </button>
        </div>
      </div>
    );
  } else if (currentStatus === "error") {
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-status-error bg-white p-[8px_12px]">
        <div className="flex gap-[16px] py-[8px]" style={{ alignItems: "flex-start" }}>
          <div className="flex min-w-0 flex-1 gap-[8px]" style={{ alignItems: "flex-start" }}>
            <img src={errorStatusIconUrl} alt="" className="h-[20px] w-[20px] shrink-0 mt-[2px]" />
            <div className="flex flex-col gap-[2px]">
              <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: "var(--color-status-error)" }}>Upload Failed</span>
              {errorMessage && <span className="t-small text-text-secondary">{errorMessage}</span>}
            </div>
          </div>
          <SecondaryButton size="sm">Re-Upload</SecondaryButton>
        </div>
      </div>
    );
  } else if (currentStatus === "use-existing") {
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_12px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex min-w-0 flex-1 items-center gap-[8px]">
            <img src={linkIconUrl} alt="" className="h-[20px] w-[20px] shrink-0" />
            <div className="flex items-center gap-[4px]">
              <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 12, lineHeight: "20px", color: "var(--color-text-primary)" }}>{selectedExistingFile || fileName}</span>
              {required && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "var(--color-brand-1)" }}>*</span>}
              <img src={completedStatusIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            </div>
          </div>
          <button type="button" onClick={handleClear} className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-graphite-10" aria-label="Clear selection">
            <img src={closeIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex h-[24px] items-center justify-between">
        <div className="flex items-center gap-[2px]">
          {labelEl}
          {requiredStar}
        </div>
        {showSegmented && <SegmentedControl options={["Upload", "Use Existing"]} selectedIndex={segmentedIndex} onChange={handleSegmentedChange} />}
      </div>
      {uploadArea}
    </div>
  );
}

// ==================== Optional Section ====================

function OptionalSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [refStudyValue, setRefStudyValue] = useState<string | null>(null);
  const [refEventValue, setRefEventValue] = useState<string | null>(null);
  const [ogemValue, setOgemValue] = useState<string | null>(null);
  const [programPath, setProgramPath] = useState("");

  const refStudyOptions: DropdownOption[] = [
    { label: "AZE2001-301", value: "aze2001-301" },
    { label: "AZE2001-302", value: "aze2001-302" },
    { label: "AZE2001-303", value: "aze2001-303" },
  ];
  const refEventOptions: DropdownOption[] = [
    { label: "CSR Interim Analysis", value: "csr-interim" },
    { label: "Final CSR", value: "final-csr" },
    { label: "DSMB Q1 Report", value: "dsmb-q1" },
  ];
  const ogemOptions: DropdownOption[] = [
    { label: "12.8", value: "12.8" },
    { label: "12.7", value: "12.7" },
    { label: "12.6", value: "12.6" },
  ];

  return (
    <div className="rounded-[6px] border border-graphite-10">
      <button type="button" onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between px-[10px] py-[10px] hover:bg-bg-light ${isExpanded ? "rounded-t-[6px]" : "rounded-[6px]"}`}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "20px", color: "var(--color-text-primary)" }}>Optional</span>
        <ArrowDownIcon size={20} color="var(--color-text-secondary)" rotated={isExpanded} />
      </button>
      <div className="h-0 w-full border-t border-graphite-10" />
      {isExpanded && (
        <div className="flex flex-col gap-[16px] px-[10px] py-[12px]">
          <DropdownField label="Reference Study" placeholder="Select reference study" options={refStudyOptions} value={refStudyValue} onChange={setRefStudyValue} />
          <DropdownField label="Reference Event" placeholder="Select reference event" options={refEventOptions} value={refEventValue} onChange={setRefEventValue} />
          <DropdownField label="O_GEM Version" placeholder="12.8" options={ogemOptions} value={ogemValue} onChange={setOgemValue} />
          <InputField label="Program Path" placeholder="e.g. /studies/ABC-01/programs/primary" value={programPath} onChange={setProgramPath} />
        </div>
      )}
    </div>
  );
}

// ==================== Stepper ====================

function Stepper({ currentStep }: { currentStep: 1 | 2 }) {
  const step1Active = currentStep === 1;
  const step2Active = !step1Active;

  const renderStep = (num: number, label: string, active: boolean) => (
    <div className="flex gap-[6px]" style={{ alignItems: "center" }}>
      <div
        className="flex rounded-[10px]"
        style={{
          width: 20, height: 20,
          alignItems: "center", justifyContent: "center",
          backgroundColor: active ? "var(--color-brand-1)" : "#FFFFFF",
          border: active ? "none" : "1px solid var(--color-graphite-10)",
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11, color: active ? "#FFFFFF" : "#888E8E" }}>{num}</span>
      </div>
      <span style={{
        fontFamily: "'PingFang SC', sans-serif",
        fontWeight: active ? 600 : 400,
        fontSize: 12,
        lineHeight: "20px",
        color: active ? "#3C4242" : "#888E8E",
      }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-[8px]" style={{ alignItems: "center" }}>
      {renderStep(1, "Upload Specs & Configs", step1Active)}
      <div style={{ width: 32, height: 0, borderTop: "1px solid var(--color-graphite-10)" }} />
      {renderStep(2, "Task Assignment", step2Active)}
    </div>
  );
}

// ==================== Status Tag ====================

type TaskStatus = "ai-processing" | "in-progress" | "completed" | "to-do";

function StatusTag({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { icon: string; label: string }> = {
    "ai-processing": { icon: aiProcessingIconUrl, label: "AI Processing" },
    "in-progress": { icon: wipStatusIconUrl, label: "In Progress" },
    "completed": { icon: completedStatusIconUrl, label: "Completed" },
    "to-do": { icon: untouchedStatusIconUrl, label: "To do" },
  };
  const c = config[status];
  return (
    <div className="flex items-center gap-[4px]">
      <img src={c.icon} alt="" className="h-[16px] w-[16px] shrink-0" />
      <span className="t-small" style={{ color: "var(--color-text-primary)" }}>{c.label}</span>
    </div>
  );
}

// ==================== Step 2 - Task Assignment ====================

type TaskRow = {
  section: string; tableNumber: string; tableTitle: string; program: string; suffix: string;
  status: TaskStatus; programmer: string; qcProgram: string; qcStatus: TaskStatus; qcProgrammer: string;
};

const mockTaskRows: TaskRow[] = [
  { section: "14.1", tableNumber: "14.1.1", tableTitle: "Demographics", program: "t_dm_01", suffix: "sas", status: "ai-processing", programmer: "Charlie", qcProgram: "qc_t_dm_01", qcStatus: "ai-processing", qcProgrammer: "Bob" },
  { section: "14.1", tableNumber: "14.1.2", tableTitle: "Baseline Characteristics", program: "t_dm_02", suffix: "sas", status: "in-progress", programmer: "Sarah", qcProgram: "qc_t_dm_02", qcStatus: "in-progress", qcProgrammer: "James" },
  { section: "14.1", tableNumber: "14.1.3", tableTitle: "Medical History", program: "t_dm_03", suffix: "sas", status: "completed", programmer: "Tom", qcProgram: "qc_t_dm_03", qcStatus: "completed", qcProgrammer: "Emily" },
  { section: "14.1", tableNumber: "14.1.4", tableTitle: "Concomitant Meds", program: "t_dm_04", suffix: "sas", status: "to-do", programmer: "James", qcProgram: "qc_t_dm_04", qcStatus: "to-do", qcProgrammer: "Sarah" },
];

const headerCellStyle = "flex items-center px-[8px] py-[4px] text-[12px] font-medium text-text-primary border-r border-border-default shrink-0";
const dataCellStyle = "flex items-center px-[8px] py-[4px] text-[12px] text-text-primary border-r border-border-default shrink-0";

function Step2Body() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const allSelected = selectedRows.size === mockTaskRows.length;
  const toggleRow = (idx: number) => {
    setSelectedRows(prev => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; });
  };
  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(mockTaskRows.map((_, i) => i)));
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[20px_24px]">
      {/* Section title */}
      <div className="flex shrink-0 items-center justify-between">
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 500, fontSize: 14, color: "#000000" }}>Task Assignment</span>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-[4px] border border-graphite-10">
        {/* Header row */}
        <div className="flex w-max items-center border-b border-graphite-10 bg-graphite-10">
          <div className="flex w-[36px] shrink-0 items-center justify-center py-[4px] border-r border-border-default">
            <Checkbox checked={allSelected} onChange={toggleAll} />
          </div>
          <div className={headerCellStyle} style={{ width: "80px" }}>Section</div>
          <div className={headerCellStyle} style={{ width: "96px" }}>Table Number</div>
          <div className={`${headerCellStyle} min-w-[140px] flex-1 justify-between`}>
            <span>Table Title</span>
            <SearchIcon size={16} color="var(--color-text-secondary)" />
          </div>
          <div className={`${headerCellStyle} min-w-[100px]`}>Program</div>
          <div className={`${headerCellStyle} min-w-[60px]`}>Suffix</div>
          <div className={`${headerCellStyle} min-w-[120px] justify-between`}>
            <span>Status</span>
            <FilterIcon size={16} color="var(--color-text-secondary)" />
          </div>
          <div className={`${headerCellStyle} min-w-[100px] justify-between`}>Programmer</div>
          <div className={`${headerCellStyle} min-w-[120px]`}>QC Program</div>
          <div className={`${headerCellStyle} min-w-[120px] justify-between`}>
            <span>QC Status</span>
            <FilterIcon size={16} color="var(--color-text-secondary)" />
          </div>
          <div className="flex min-w-[110px] flex-1 items-center px-[8px] py-[4px] text-[12px] font-medium text-text-primary">QC Programmer</div>
        </div>
        {/* Data rows */}
        {mockTaskRows.map((row, idx) => (
          <div key={idx} className="flex w-max items-center border-b border-graphite-10 last:border-b-0 hover:bg-bg-light">
            <div className="flex w-[36px] shrink-0 items-center justify-center py-[4px] border-r border-border-default">
              <Checkbox checked={selectedRows.has(idx)} onChange={() => toggleRow(idx)} />
            </div>
            <div className={dataCellStyle} style={{ width: "80px" }}>{row.section}</div>
            <div className={dataCellStyle} style={{ width: "96px" }}>{row.tableNumber}</div>
            <div className={`${dataCellStyle} min-w-[140px] flex-1`}>{row.tableTitle}</div>
            <div className={`${dataCellStyle} min-w-[100px]`}>{row.program}</div>
            <div className={`${dataCellStyle} min-w-[60px]`}>{row.suffix}</div>
            <div className={`${dataCellStyle} min-w-[120px]`}><StatusTag status={row.status} /></div>
            <div className={`${dataCellStyle} min-w-[100px] justify-between`}>
              <span>{row.programmer}</span>
              <ArrowRightIcon size={16} color="var(--color-text-secondary)" />
            </div>
            <div className={`${dataCellStyle} min-w-[120px]`}>{row.qcProgram}</div>
            <div className={`${dataCellStyle} min-w-[120px]`}><StatusTag status={row.qcStatus} /></div>
            <div className="flex min-w-[110px] flex-1 items-center justify-between px-[8px] py-[4px] text-[12px] text-text-primary">
              <span>{row.qcProgrammer}</span>
              <ArrowRightIcon size={16} color="var(--color-text-secondary)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Main Modal ====================

export default function CreateEventModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const [step1Height, setStep1Height] = useState<number | null>(null);
  const [taValue, setTaValue] = useState<string | null>(null);
  const [projectValue, setProjectValue] = useState<string | null>(null);
  const [studyValue, setStudyValue] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");

  const taOptions: DropdownOption[] = [
    { label: "Oncology", value: "oncology" }, { label: "Cardiology", value: "cardiology" },
    { label: "Neurology", value: "neurology" }, { label: "Immunology", value: "immunology" },
    { label: "Infectious Disease", value: "infectious" },
  ];
  const projectOptions: DropdownOption[] = [
    { label: "PRO001 - Breast Cancer Study", value: "pro001" },
    { label: "PRO002 - NSCLC Trial", value: "pro002" },
    { label: "PRO003 - Diabetes Study", value: "pro003" },
  ];
  const studyOptions: DropdownOption[] = [
    { label: "AZE2001-301", value: "aze2001-301" }, { label: "AZE2001-302", value: "aze2001-302" },
    { label: "AZE2001-303", value: "aze2001-303" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset to step 1 when modal closes
  useEffect(() => {
    if (!isOpen) { setCurrentStep(1); setStep1Height(null); }
  }, [isOpen]);

  // Capture Step 1 modal height to maintain consistent height in Step 2
  useEffect(() => {
    if (!isOpen || currentStep !== 1 || !modalRef.current) return;
    const observer = new ResizeObserver(() => {
      if (modalRef.current) setStep1Height(modalRef.current.offsetHeight);
    });
    observer.observe(modalRef.current);
    return () => observer.disconnect();
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div ref={modalRef} className="relative flex h-[650px] max-h-[calc(100vh-40px)] w-[760px] max-w-[90vw] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]" style={currentStep === 2 && step1Height ? { height: `${step1Height}px` } : undefined}>
        {/* Header */}
        <div className="flex shrink-0 items-center gap-[16px] px-[20px] pb-[12px] pt-[16px]">
          <div className="flex min-w-0 flex-1 items-center gap-[10px]">
            <h2 style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "22px", color: "var(--color-text-primary)" }}>Create New Event</h2>
          </div>
          <button onClick={onClose} className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-graphite-10 active:scale-[0.96]" aria-label="Close">
            <CloseIcon size={16} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-[8px]">
          <div className="flex shrink-0 flex-col items-center gap-[10px] px-[20px] py-[8px]">
            <Stepper currentStep={currentStep} />
          </div>

          {currentStep === 1 ? (
            /* Step 1 - Upload Specs & Configs */
            <div className="flex min-h-0 flex-1 border-t border-graphite-10">
              {/* Left column */}
             <div className="flex min-h-0 w-[320px] shrink-0 flex-col gap-[16px] overflow-y-auto border-r border-graphite-10 p-[20px]">
                <DropdownField label="Therapeutic Area" required placeholder="Select TA" options={taOptions} value={taValue} onChange={setTaValue} />
                <DropdownField label="Project" required placeholder="Select Project" options={projectOptions} value={projectValue} onChange={setProjectValue} />
                <DropdownField label="Study" required placeholder="Select Study" options={studyOptions} value={studyValue} onChange={setStudyValue} />
                <InputField label="Event Name" required placeholder="e.g. CSR Interim Analysis" value={eventName} onChange={setEventName} />
                <OptionalSection />
              </div>
              {/* Right column */}
             <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[20px]">
                <span className="t-small text-text-secondary">Specification Files</span>
                <FileUploadSection label="ADaM Spec" required requirementText="Excel only (.xlsx / .xls), max 20MB per file" showSegmentedControl status="error" errorMessage='Validation failed: missing required column "U_SUBJECT_KEY" in sheet 1.' />
                <FileUploadSection label="SDTM" required requirementText="Excel only (.xlsx / .xls), max 20MB" status="uploaded" fileName="sdtm_spec_v1.2.xlsx" />
                <FileUploadSection label="Shell file" required requirementText="Excel only (.xlsx / .xls), max 20MB" />
                <FileUploadSection label="TiFo" requirementText="Excel only (.xlsx / .xls), max 20MB" />
              </div>
            </div>
          ) : (
            /* Step 2 - Task Assignment */
            <div className="flex min-h-0 flex-1 flex-col border-t border-graphite-10">
              <Step2Body />
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep === 1 ? (
          <div className="flex shrink-0 items-center justify-end gap-[8px] border-t border-graphite-10 px-[20px] py-[14px]">
            <button onClick={() => setCurrentStep(2)} className="flex h-[36px] items-center rounded-[4px] bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]">Next</button>
            <PrimaryButton disabled>Create Event</PrimaryButton>
          </div>
        ) : (
          <div className="flex shrink-0 items-center justify-between border-t border-graphite-10 px-[20px] py-[14px]">
            <button onClick={() => setCurrentStep(1)} className="flex h-[36px] items-center rounded-[4px] bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]">Back</button>
            <div className="flex items-center gap-[8px]">
              <button className="flex h-[36px] items-center rounded-[4px] bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]">Assign later</button>
              <PrimaryButton>Create Event</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
