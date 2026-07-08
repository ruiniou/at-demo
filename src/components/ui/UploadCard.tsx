import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { SegmentedControl } from "./SegmentedControl";
import { SearchBar } from "./SearchBar";

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

export interface UploadCardProps {
  label: string;
  required?: boolean;
  requirementText: string;
  showSegmentedControl?: boolean;
  status?: UploadStatus;
  fileName?: string;
  errorMessage?: string;
  uploadProgress?: number;
  existingFileOptions?: string[];
  
  // Callbacks for integration
  onStatusChange?: (status: UploadStatus) => void;
  onFileSelect?: (fileName: string) => void;
}

export function UploadCard({
  label,
  required,
  requirementText,
  showSegmentedControl = false,
  status: initialStatus = "pending",
  fileName = "",
  errorMessage = "",
  uploadProgress = 45,
  existingFileOptions = [],
  onStatusChange,
  onFileSelect,
}: UploadCardProps) {
  const [currentStatus, setCurrentStatus] = useState<UploadStatus>(initialStatus);
  const [localFileName, setLocalFileName] = useState(fileName);
  const [localProgress, setLocalProgress] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedExistingFile, setSelectedExistingFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

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
          handleStatusUpdate("uploaded");
          if (onFileSelect) onFileSelect(finalName);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStatus, localFileName]);

  const filteredOptions = existingFileOptions.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
  const showSegmented = showSegmentedControl && (currentStatus === "pending" || currentStatus === "error");

  const handleStatusUpdate = (status: UploadStatus) => {
    setCurrentStatus(status);
    if (onStatusChange) onStatusChange(status);
  };

  const handleClear = () => {
    handleStatusUpdate("pending");
    setSelectedExistingFile(null);
    setSegmentedIndex(0);
    setDropdownOpen(false);
    setSearchQuery("");
    if (onFileSelect) onFileSelect("");
  };

  let uploadArea;

  // Dropdown shows when "Use Existing" tab is selected (pending or error)
  if (showSegmented && segmentedIndex === 1) {
    uploadArea = (
      <div className="relative flex flex-col gap-[2px]">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex h-[36px] items-center justify-between rounded-[4px] border border-graphite-10 bg-white pl-[12px] pr-[10px]"
        >
          <span className="t-small text-text-secondary">Select an existing file…</span>
          <div className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12.5L5 7.5L6.0625 6.4375L10 10.375L13.9375 6.4375L15 7.5L10 12.5Z" fill="#888E8E" />
            </svg>
          </div>
        </button>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-[5]" onClick={() => setDropdownOpen(false)} />
            <div className="absolute left-0 right-0 top-[38px] z-10 flex flex-col gap-[8px] rounded-[4px] border border-graphite-10 bg-white p-[4px] shadow-lg">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search…"
                background="light"
                className="w-full"
                autoFocus
              />
              <div className="flex flex-col gap-[2px] px-[6px]">
                {filteredOptions.map((option) => {
                  const isSelected = selectedExistingFile === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => { 
                        setSelectedExistingFile(option); 
                        setDropdownOpen(false); 
                        setSearchQuery(""); 
                        handleStatusUpdate("use-existing"); 
                        if (onFileSelect) onFileSelect(option);
                      }}
                      className={`flex items-center gap-[4px] rounded-[2px] py-[2px] pl-[2px] pr-[4px] text-left hover:bg-bg-light ${isSelected ? "bg-bg-light" : ""}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={isSelected ? "opacity-100" : "opacity-0"} style={{ minWidth: 16 }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="var(--color-text-primary)"/>
                      </svg>
                      <span className="t-small text-text-primary">{option}</span>
                    </button>
                  );
                })}
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
    // Left section fills width so text doesn't shift when right text changes
    uploadArea = (
      <div className="flex flex-col rounded-[4px] bg-bg-light p-[8px_10px]">
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
          <button type="button" onClick={handleClear} className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="#888E8E"/></svg>
          </button>
        </div>
      </div>
    );
  } else if (currentStatus === "error") {
    // Figma 632:1325 — border #CC2C3C, error-warning-line icon
    uploadArea = (
      <div className="flex flex-col rounded-[4px] border border-status-error bg-white p-[8px_10px]">
        <div className="flex items-start gap-[16px] py-[8px]">
          <div className="flex flex-1 gap-[8px] min-w-0">
            <img src={errorWarningIconUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
            <div className="flex flex-1 min-w-0 flex-col gap-[2px]">
              <span className="t-small-medium text-status-error">Upload Failed</span>
              {errorMessage && <span className="t-small text-text-secondary">{errorMessage}</span>}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleUploadClick}>Re-Upload</Button>
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
              <div className="flex items-center gap-[4px] min-w-0">
                <span className="t-small-medium text-text-primary truncate" title={selectedExistingFile || localFileName}>{selectedExistingFile || localFileName}</span>
                <img src={statusCompletedUrl} alt="" className="h-[16px] w-[16px] shrink-0" />
              </div>
            </div>
          </div>
          <button type="button" onClick={handleClear} className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[8px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05l1.414-1.414L12 10.586z" fill="#888E8E"/></svg>
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex min-h-[24px] items-center justify-between">
        <div className="flex items-center gap-[2px]">
          <span className="t-small-medium text-text-primary">{label}</span>
          {required && <span className="font-[Inter] text-[12px] font-semibold text-az-danger">*</span>}
        </div>
        {showSegmented && (
          <SegmentedControl
            size="sm"
            options={[
              {label: "Upload", value: "0"}, 
              {label: "Use Existing", value: "1"}
            ]} 
            value={String(segmentedIndex)} 
            onChange={(v) => {
              setSegmentedIndex(Number(v));
              if (v === "0") setDropdownOpen(false);
            }} 
          />
        )}
      </div>
      {uploadArea}
    </div>
  );
}
