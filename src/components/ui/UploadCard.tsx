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
  onStatusChange,
  onFileSelect,
}: UploadCardProps) {
  const [currentStatus, setCurrentStatus] = useState<UploadStatus>(initialStatus);
  const [localFileName, setLocalFileName] = useState(fileName);
  const [localEventName, setLocalEventName] = useState(initialEventName);
  const [localProgress, setLocalProgress] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(initialStatus === "use-existing" ? 1 : 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentStatus(initialStatus);
    if (initialStatus === "use-existing") {
      setSegmentedIndex(1);
    } else if (initialStatus === "uploaded") {
      setSegmentedIndex(0);
    }
  }, [initialStatus]);

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  useEffect(() => {
    setLocalEventName(initialEventName);
  }, [initialEventName]);

  // If use-existing becomes disabled while in use-existing mode or tab, reset to upload pending
  useEffect(() => {
    if (isUseExistingDisabled) {
      if (segmentedIndex === 1 || currentStatus === "use-existing") {
        handleClear();
      }
    }
  }, [isUseExistingDisabled]);

  const handleUploadClick = () => {
    handleStatusUpdate("uploading");
    setLocalProgress(0);
  };

  useEffect(() => {
    if (currentStatus !== "uploading") return;

    const interval = setInterval(() => {
      setLocalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const finalName = localFileName || `${label.toLowerCase().replace(/\s+/g, "_")}_spec.xlsx`;
          setLocalFileName(finalName);
          setLocalEventName("");
          handleStatusUpdate("uploaded");
          if (onFileSelect) onFileSelect(finalName);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStatus, localFileName]);

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

  const showSegmented = showSegmentedControl && currentStatus !== "uploading";

  const handleStatusUpdate = (status: UploadStatus) => {
    setCurrentStatus(status);
    if (onStatusChange) onStatusChange(status);
  };

  const handleClear = () => {
    handleStatusUpdate("pending");
    setLocalFileName("");
    setLocalEventName("");
    setSegmentedIndex(0);
    setDropdownOpen(false);
    setSearchQuery("");
    if (onFileSelect) onFileSelect("", "");
  };

  const handleClearUseExisting = () => {
    handleStatusUpdate("pending");
    setLocalFileName("");
    setLocalEventName("");
    setSegmentedIndex(1);
    setDropdownOpen(true);
    setSearchQuery("");
    if (onFileSelect) onFileSelect("", "");
  };

  let uploadArea;

  // Dropdown shows when "Use Existing" tab is selected (and not linked yet, or in error/picking)
  if (showSegmented && segmentedIndex === 1 && currentStatus !== "use-existing") {
    uploadArea = (
      <div className="relative flex flex-col gap-[2px]">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex h-[36px] items-center justify-between rounded-[4px] border bg-white pl-[12px] pr-[10px] transition-[border-color,box-shadow,background-color] ${
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
            <div className="absolute left-0 right-0 top-[38px] z-10 flex flex-col gap-[8px] rounded-[4px] border border-form-border bg-white p-[6px] shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by event name..."
                background="light"
                className="w-full"
                autoFocus
              />
              <div className="flex max-h-[220px] flex-col gap-[2px] overflow-y-auto px-[2px]">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => {
                    const isSelected = (localEventName || initialEventName) === evt.eventName;
                    return (
                      <button
                        key={`${evt.eventName}-${evt.fileName}`}
                        type="button"
                        onClick={() => {
                          setLocalFileName(evt.fileName);
                          setLocalEventName(evt.eventName);
                          setDropdownOpen(false);
                          setSearchQuery("");
                          handleStatusUpdate("use-existing");
                          if (onFileSelect) onFileSelect(evt.fileName, evt.eventName);
                        }}
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
  } else if (currentStatus === "pending") {
    // Figma 632:1326 — dashed border, bg white, upload-2-line icon
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-dashed border-graphite-10 bg-white p-[8px_10px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex flex-1 items-center gap-[8px] min-w-0">
            <img src={uploadIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
              <span className="t-small text-text-secondary">{requirementText}</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleUploadClick}>Upload</Button>
        </div>
      </div>
    );
  } else if (currentStatus === "uploading") {
    // Figma 632:1260 — no border, bg #F8F7F7, upload-2-line icon + loader
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
  } else if (currentStatus === "uploaded") {
    // Figma 632:1323 — solid border, file-icon + filename + status completed
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_10px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex flex-1 items-center gap-[8px] min-w-0">
            <img src={fileIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
              <div className="flex items-center gap-[4px] min-w-0">
                <span className="t-small-medium text-text-primary truncate" title={localFileName}>{localFileName}</span>
                <img src={statusCompletedUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              </div>
            </div>
          </div>
          <button type="button" onClick={handleClear} className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px] cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="#888E8E"/></svg>
          </button>
        </div>
      </div>
    );
  } else if (currentStatus === "use-existing") {
    // Figma 632:1322 — solid border, link icon + filename + status completed
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-graphite-10 bg-white p-[8px_10px]">
        <div className="flex items-center gap-[16px] py-[8px]">
          <div className="flex flex-1 items-center gap-[8px] min-w-0">
            <img src={linkIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
              <div className="flex items-center gap-[6px] min-w-0">
                <span className="t-small-medium text-text-primary truncate" title={localFileName || fileName}>
                  {localFileName || fileName}
                </span>
                <img src={statusCompletedUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearUseExisting}
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
  }

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      headerClassName={showSegmented ? "min-h-[24px]" : "min-h-[20px]"}
      required={required}
      actionButton={
        showSegmented ? (
          <SegmentedControl
            size="sm"
            options={[
              { label: "Upload", value: "0" }, 
              { 
                label: "Use Existing", 
                value: "1",
                disabled: isUseExistingDisabled,
                tooltip: isUseExistingDisabled ? useExistingDisabledReason : undefined,
              }
            ]} 
            value={String(segmentedIndex)} 
            onChange={(v) => {
              const newIdx = Number(v);
              setSegmentedIndex(newIdx);
              if (newIdx === 1) {
                if (currentStatus === "use-existing") {
                  handleStatusUpdate("pending");
                }
                setDropdownOpen(true);
              } else {
                setDropdownOpen(false);
                if (currentStatus === "use-existing") {
                  handleStatusUpdate("pending");
                  setLocalFileName("");
                  setLocalEventName("");
                }
              }
            }} 
          />
        ) : undefined
      }
    >
      {uploadArea}
    </FormItem>
  );
}
