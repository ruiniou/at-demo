import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { SegmentedControl } from "./SegmentedControl";
import { SearchBar } from "./SearchBar";
import { Tooltip } from "./Tooltip";
import { FormItem } from "./FormItem";
import { Badge } from "./Badge";

// Icon imports
import uploadIconUrl from "../../icons/upload-2-line.svg";
import fileIconUrl from "../../icons/file-icon.svg";
import errorWarningIconUrl from "../../icons/error-warning-line.svg";
import linkIconUrl from "../../icons/link.svg";
import statusCompletedUrl from "../../icons/Status label/Status=Completed.svg";

const LoaderIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
    <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="2" strokeDasharray="20" strokeLinecap="round" />
  </svg>
);

export type UploadStatus = "pending" | "uploading" | "uploaded" | "error" | "use-existing";

export type ExistingEventOption = {
  eventName: string;
  fileName: string;
  isLastUsed?: boolean;
  updatedAt?: string;
};

export interface UploadCardProps {
  label: string;
  required?: boolean;
  requirementText: string;
  showSegmentedControl?: boolean;
  isUseExistingDisabled?: boolean;
  useExistingDisabledReason?: string;
  status?: UploadStatus;
  fileName?: string;
  selectedEventName?: string;
  errorMessage?: string;
  uploadProgress?: number;
  existingEvents?: ExistingEventOption[];
  existingFileOptions?: string[]; // for backwards compatibility
  disabled?: boolean;
  
  // Callbacks for integration
  onStatusChange?: (status: UploadStatus) => void;
  onFileSelect?: (fileName: string, eventName?: string) => void;
}

export function UploadCard({
  label,
  required,
  requirementText,
  showSegmentedControl = false,
  isUseExistingDisabled = false,
  useExistingDisabledReason = "Select an existing Study Code to enable Use Existing",
  status: initialStatus = "pending",
  fileName = "",
  selectedEventName: initialEventName = "",
  errorMessage = "",
  uploadProgress = 45,
  existingEvents = [],
  existingFileOptions = [],
  disabled = false,
  onStatusChange,
  onFileSelect,
}: UploadCardProps) {
  // Field state model
  const [mode, setMode] = useState<"upload" | "existing">(
    initialStatus === "use-existing" ? "existing" : "upload"
  );
  const [uploadFile, setUploadFile] = useState<string | null>(
    initialStatus === "uploaded" && fileName ? fileName : null
  );
  const [linkedEvent, setLinkedEvent] = useState<ExistingEventOption | null>(
    initialStatus === "use-existing" && fileName
      ? { eventName: initialEventName, fileName }
      : null
  );

  const [isUploading, setIsUploading] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync external status reset (e.g. from parent modal reset)
  useEffect(() => {
    if (initialStatus === "pending" && !fileName) {
      if (mode === "upload") setUploadFile(null);
    }
  }, [initialStatus, fileName, mode]);

  // When isUseExistingDisabled becomes true, clear linkedEvent and revert mode to upload if needed
  useEffect(() => {
    if (isUseExistingDisabled) {
      setLinkedEvent(null);
      if (mode === "existing") {
        setMode("upload");
        setDropdownOpen(false);
        if (uploadFile) {
          onStatusChange?.("uploaded");
          onFileSelect?.(uploadFile);
        } else {
          onStatusChange?.("pending");
          onFileSelect?.("", "");
        }
      }
    }
  }, [isUseExistingDisabled]);

  // Simulated upload progress
  const handleStartUpload = () => {
    if (disabled) return;
    setIsUploading(true);
    setLocalProgress(0);
  };

  useEffect(() => {
    if (!isUploading) return;

    const interval = setInterval(() => {
      setLocalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const finalName = fileName || `${label.toLowerCase().replace(/\s+/g, "_")}_spec.xlsx`;
          // Completing upload clears the other side (linkedEvent = null)
          setUploadFile(finalName);
          setLinkedEvent(null);
          setIsUploading(false);
          onStatusChange?.("uploaded");
          onFileSelect?.(finalName);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isUploading, fileName, label, onStatusChange, onFileSelect]);

  // Mode switching (SegmentedControl toggle)
  const handleModeChange = (newModeStr: string) => {
    if (disabled) return;
    const newMode = newModeStr === "1" ? "existing" : "upload";
    setMode(newMode);

    if (newMode === "existing") {
      // If linkedEvent == null -> expand picker
      // If linkedEvent != null -> show linked state, do not expand
      if (linkedEvent === null) {
        setDropdownOpen(true);
        onStatusChange?.("pending");
        onFileSelect?.("", "");
      } else {
        setDropdownOpen(false);
        onStatusChange?.("use-existing");
        onFileSelect?.(linkedEvent.fileName, linkedEvent.eventName);
      }
    } else {
      // newMode === "upload"
      setDropdownOpen(false);
      if (uploadFile !== null) {
        onStatusChange?.("uploaded");
        onFileSelect?.(uploadFile);
      } else {
        onStatusChange?.("pending");
        onFileSelect?.("", "");
      }
    }
  };

  // Picking a new existing event
  const handleSelectEvent = (evt: ExistingEventOption) => {
    if (disabled) return;
    // Selecting an event clears the other side (uploadFile = null)
    setLinkedEvent(evt);
    setUploadFile(null);
    setDropdownOpen(false);
    setSearchQuery("");
    onStatusChange?.("use-existing");
    onFileSelect?.(evt.fileName, evt.eventName);
  };

  // Clear or remove in Upload mode
  const handleClearUpload = () => {
    if (disabled) return;
    setUploadFile(null);
    onStatusChange?.("pending");
    onFileSelect?.("", "");
  };

  // Clear or replace in Existing mode (clears linkedEvent, stays in Existing, opens dropdown)
  const handleClearOrChangeExisting = () => {
    if (disabled) return;
    setLinkedEvent(null);
    setDropdownOpen(true);
    setSearchQuery("");
    onStatusChange?.("pending");
    onFileSelect?.("", "");
  };

  // Normalize options from existingEvents or existingFileOptions
  const normalizedEvents: ExistingEventOption[] = existingEvents.length > 0
    ? existingEvents
    : existingFileOptions.map((f, idx) => ({
        eventName: f,
        fileName: f,
        isLastUsed: idx === 0,
      }));

  const filteredEvents = normalizedEvents.filter(
    (e) =>
      e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSegmented = showSegmentedControl && !isUploading;

  let uploadArea;

  if (mode === "existing") {
    if (linkedEvent !== null && !dropdownOpen) {
      // EXISTING_LINKED state — solid border, link icon + filename + completed check + clear/change button
      uploadArea = (
        <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_10px]">
          <div className="flex items-center gap-[16px] py-[8px]">
            <div className="flex flex-1 items-center gap-[8px] min-w-0">
              <img src={linkIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
                <div className="flex items-center gap-[6px] min-w-0">
                  <span className="t-small-medium text-text-primary truncate" title={linkedEvent.fileName}>
                    {linkedEvent.fileName}
                  </span>
                  <img src={statusCompletedUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClearOrChangeExisting}
              className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px] cursor-pointer"
              title="Replace or clear selection"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="#888E8E"/>
              </svg>
            </button>
          </div>
        </div>
      );
    } else {
      // EXISTING_PICKING state — trigger button with searchable popup
      uploadArea = (
        <div className="relative flex flex-col gap-[2px]">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex h-[36px] items-center justify-between rounded-[4px] border bg-white pl-[12px] pr-[10px] transition-[border-color,box-shadow,background-color] cursor-pointer ${
              dropdownOpen ? "border-brand-1 shadow-[0px_0px_0px_2px_var(--color-az-secondary)]" : "border-graphite-10 hover:border-graphite-50"
            }`}
          >
            <span className="t-small text-text-secondary">Select an existing file…</span>
            <div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12.5L5 7.5L6.0625 6.4375L10 10.375L13.9375 6.4375L15 7.5L10 12.5Z" fill="#888E8E" />
              </svg>
            </div>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-[5]" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 right-0 top-[38px] z-10 flex flex-col gap-[8px] rounded-md border border-form-border bg-white p-1 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by event name..."
                  background="light"
                  variant="embedded"
                  className="w-full"
                  autoFocus
                />
                <div className="flex max-h-[220px] flex-col gap-[2px] overflow-y-auto px-[2px]">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((evt) => {
                      const isSelected = linkedEvent?.eventName === evt.eventName;
                      return (
                        <button
                          key={`${evt.eventName}-${evt.fileName}`}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSelectEvent(evt)}
                          className={`flex items-center justify-between gap-[8px] rounded-[4px] px-[8px] py-[6px] text-left transition-colors cursor-pointer ${
                            isSelected ? "bg-az-secondary text-brand-1" : "hover:bg-bg-panel text-text-primary"
                          }`}
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-[6px]">
                              <span className="t-small font-medium truncate">{evt.eventName}</span>
                              {evt.isLastUsed && (
                                <span
                                  className="inline-flex items-center rounded-[3px] bg-az-secondary px-[6px] py-px text-[12px] leading-[18px] text-brand-1 shrink-0 font-normal select-none"
                                  style={{ fontFamily: "'PingFang SC', sans-serif" }}
                                >
                                  Last Used
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-text-secondary truncate">{evt.fileName}</span>
                          </div>
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="var(--color-brand-1)"/>
                            </svg>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-[8px] py-[14px] text-center t-small text-text-secondary">
                      No results found.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
  } else {
    // mode === "upload"
    if (isUploading) {
      // UPLOAD_PROGRESS state
      uploadArea = (
        <div className="flex flex-col rounded-[4px] bg-bg-panel p-[8px_10px]">
          <div className="flex items-center gap-[16px] py-[8px]">
            <div className="flex flex-1 items-center gap-[8px] min-w-0">
              <img src={uploadIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
                <span className="t-small text-text-secondary">{requirementText}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[6px]">
              <LoaderIcon size={16} color="var(--color-text-secondary)" />
              <span className="t-body-secondary text-text-secondary">{localProgress}%</span>
            </div>
          </div>
        </div>
      );
    } else if (uploadFile !== null) {
      // UPLOAD_FILLED state
      uploadArea = (
        <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_10px]">
          <div className="flex items-center gap-[16px] py-[8px]">
            <div className="flex flex-1 items-center gap-[8px] min-w-0">
              <img src={fileIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
                <div className="flex items-center gap-[4px] min-w-0">
                  <span className="t-small-medium text-text-primary truncate" title={uploadFile}>{uploadFile}</span>
                  <img src={statusCompletedUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClearUpload}
              className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px] cursor-pointer"
              title="Remove file"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="#888E8E"/>
              </svg>
            </button>
          </div>
        </div>
      );
    } else {
      // UPLOAD_EMPTY state
      uploadArea = (
        <div className="flex flex-col rounded-[4px] border border-dashed border-graphite-10 bg-white p-[8px_10px]">
          <div className="flex items-center gap-[16px] py-[8px]">
            <div className="flex flex-1 items-center gap-[8px] min-w-0">
              <img src={uploadIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
                <span className="t-small text-text-secondary">{requirementText}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled={disabled} onClick={handleStartUpload}>Upload</Button>
          </div>
        </div>
      );
    }
  }

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      headerClassName={showSegmented ? "min-h-[24px]" : "min-h-[20px]"}
      required={required}
      className={disabled ? "pointer-events-none opacity-60" : ""}
      actionButton={
        showSegmented ? (
          <SegmentedControl
            size="sm"
            options={[
              { label: "Upload", value: "0", disabled },
              { 
                label: "Use Existing", 
                value: "1",
                disabled: disabled || isUseExistingDisabled,
                tooltip: isUseExistingDisabled ? useExistingDisabledReason : undefined,
              }
            ]} 
            value={mode === "existing" ? "1" : "0"} 
            onChange={handleModeChange}
          />
        ) : undefined
      }
    >
      {uploadArea}
    </FormItem>
  );
}
