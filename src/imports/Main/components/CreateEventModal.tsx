import React, { useState, useEffect, useMemo } from "react";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Badge } from "../../../components/ui/Badge";
import { UploadCard, UploadStatus } from "../../../components/ui/UploadCard";
import { Button } from "../../../components/ui/Button";
import { FormInputField as Input } from "../../../components/ui/FormInputField";
import { Dropdown, DropdownOption } from "../../../components/ui/Dropdown";
import { MultiSelectDropdown } from "../../../components/ui/MultiSelectDropdown";
import { CreatableDropdown } from "../../../components/ui/CreatableDropdown";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";

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
import { PrimaryButton } from "./Button";

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





// ==================== Optional Section ====================

function OptionalSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tablesToParse, setTablesToParse] = useState<string[]>([]);
  const [refStudyValue, setRefStudyValue] = useState<string | null>(null);
  const [refEventValue, setRefEventValue] = useState<string | null>(null);
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
  const tablesToParseOptions: DropdownOption[] = [
    { label: "14.1.1 Demographics", value: "14.1.1" },
    { label: "14.1.2 Baseline Characteristics", value: "14.1.2" },
    { label: "14.1.3 Medical History", value: "14.1.3" },
    { label: "14.1.4 Concomitant Meds", value: "14.1.4" },
  ];

  return (
    <div className="rounded-[6px] border border-graphite-10">
      <button type="button" onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between px-[10px] py-[10px] hover:bg-bg-panel ${isExpanded ? "rounded-t-[6px]" : "rounded-[6px]"}`}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "20px", color: "var(--color-text-primary)" }}>Optional</span>
        <ArrowDownIcon size={20} color="var(--color-text-secondary)" rotated={isExpanded} />
      </button>
      <div className="h-0 w-full border-t border-graphite-10" />
      {isExpanded && (
        <div className="flex flex-col gap-[16px] px-[10px] py-[12px]">
          <MultiSelectDropdown label="Tables to parse" placeholder="Optional" options={tablesToParseOptions} value={tablesToParse} onChange={setTablesToParse} />
          <Dropdown label="Reference Study" placeholder="Optional" options={refStudyOptions} value={refStudyValue} onChange={setRefStudyValue} />
          <Dropdown label="Reference Event" placeholder="Optional" options={refEventOptions} value={refEventValue} onChange={setRefEventValue} />
          <Input label="Program Path" placeholder="Optional" value={programPath} onChange={(e) => setProgramPath(e.target.value)} />
        </div>
      )}
    </div>
  );
}

// ==================== Historical Events Mock per Study ====================
const STUDY_HISTORICAL_EVENTS: Record<
  string,
  {
    adam: Array<{ eventName: string; fileName: string; isLastUsed?: boolean }>;
    sdtm: Array<{ eventName: string; fileName: string; isLastUsed?: boolean }>;
    sap: Array<{ eventName: string; fileName: string; isLastUsed?: boolean }>;
  }
> = {
  "aze2001-301": {
    adam: [
      { eventName: "CSR Interim Analysis", fileName: "adam_spec_aze2001_301_csr.xlsx", isLastUsed: true },
      { eventName: "DSMB Q3 Review", fileName: "adam_spec_aze2001_301_dsmb_q3.xlsx" },
      { eventName: "Safety Update 2025", fileName: "adam_spec_aze2001_301_safety_2025.xlsx" },
    ],
    sdtm: [
      { eventName: "CSR Interim Analysis", fileName: "sdtm_spec_aze2001_301_v2.0.xlsx", isLastUsed: true },
      { eventName: "DSMB Q3 Review", fileName: "sdtm_spec_aze2001_301_v1.5.xlsx" },
    ],
    sap: [
      { eventName: "CSR Interim Analysis", fileName: "sap_statistical_plan_v3.1.pdf", isLastUsed: true },
      { eventName: "Final CSR", fileName: "sap_statistical_plan_v2.0.pdf" },
    ],
  },
  "aze2001-302": {
    adam: [
      { eventName: "Phase 2 Primary Analysis", fileName: "adam_spec_aze2001_302_primary.xlsx", isLastUsed: true },
      { eventName: "Interim Dose Escalation", fileName: "adam_spec_aze2001_302_dose_esc.xlsx" },
    ],
    sdtm: [
      { eventName: "Phase 2 Primary Analysis", fileName: "sdtm_aze2001_302_phase2.xlsx", isLastUsed: true },
    ],
    sap: [
      { eventName: "Phase 2 Primary Analysis", fileName: "sap_aze2001_302_final.pdf", isLastUsed: true },
    ],
  },
  "aze2001-303": {
    adam: [],
    sdtm: [],
    sap: [],
  },
};

import { ProjectItem, UserRole } from "../types/management";

// ==================== Main Modal ====================

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
  projectsList,
  currentRole,
  currentUserName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: { name: string; project: string; study: string }) => void;
  projectsList?: ProjectItem[];
  currentRole?: UserRole;
  currentUserName?: string;
}) {
  const [taValue, setTaValue] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [isProjectNew, setIsProjectNew] = useState(false);
  const [studyCode, setStudyCode] = useState<string | null>(null);
  const [isStudyNew, setIsStudyNew] = useState(false);
  const [eventName, setEventName] = useState("");
  const [ogemValue, setOgemValue] = useState<string | null>("12.8");

  // UploadCard states
  const [adamStatus, setAdamStatus] = useState<UploadStatus>("pending");
  const [adamFile, setAdamFile] = useState("");
  const [adamEvent, setAdamEvent] = useState("");

  const [sdtmStatus, setSdtmStatus] = useState<UploadStatus>("pending");
  const [sdtmFile, setSdtmFile] = useState("");
  const [sdtmEvent, setSdtmEvent] = useState("");

  const [sapStatus, setSapStatus] = useState<UploadStatus>("pending");
  const [sapFile, setSapFile] = useState("");
  const [sapEvent, setSapEvent] = useState("");

  const [shellStatus, setShellStatus] = useState<UploadStatus>("pending");
  const [shellFile, setShellFile] = useState("");

  const [tifoStatus, setTifoStatus] = useState<UploadStatus>("pending");
  const [tifoFile, setTifoFile] = useState("");

  const [customShellStatus, setCustomShellStatus] = useState<UploadStatus>("pending");
  const [customShellFile, setCustomShellFile] = useState("");

  const taOptions: DropdownOption[] = [
    { label: "Oncology", value: "oncology" }, { label: "Cardiology", value: "cardiology" },
    { label: "Neurology", value: "neurology" }, { label: "Immunology", value: "immunology" },
    { label: "Infectious Disease", value: "infectious" },
  ];
  const projectOptions = useMemo(() => {
    if (!projectsList || projectsList.length === 0) {
      return [
        { label: "PRO001 - Breast Cancer Study", value: "pro001" },
        { label: "PRO002 - NSCLC Trial", value: "pro002" },
        { label: "PRO003 - Diabetes Study", value: "pro003" },
      ];
    }
    return projectsList
      .filter((p) => p.status === "enabled")
      .map((p) => ({ label: p.name, value: p.id }));
  }, [projectsList]);

  const studyOptions = useMemo(() => {
    if (!projectsList || projectsList.length === 0) {
      return [
        { label: "AZE2001-301", value: "aze2001-301" },
        { label: "AZE2001-302", value: "aze2001-302" },
        { label: "AZE2001-303", value: "aze2001-303" },
      ];
    }
    const proj = projectsList.find(
      (p) => p.id.toLowerCase() === (projectCode || "").toLowerCase()
    );
    if (!proj || proj.status === "disabled") return [];

    let studies = proj.studies.filter((s) => s.status === "enabled");
    if (currentRole === "owner" && currentUserName) {
      studies = studies.filter((s) => s.owner === currentUserName);
    }
    return studies.map((s) => ({ label: s.id, value: s.id }));
  }, [projectsList, projectCode, currentRole, currentUserName]);
  const ogemOptions: DropdownOption[] = [
    { label: "12.8", value: "12.8" },
    { label: "12.7", value: "12.7" },
    { label: "12.6", value: "12.6" },
  ];

  // Derive Study state: UNSELECTED | NEW | EXISTING
  const studyState: "UNSELECTED" | "NEW" | "EXISTING" = !studyCode
    ? "UNSELECTED"
    : isStudyNew
    ? "NEW"
    : "EXISTING";

  const isUseExistingEnabled = studyState === "EXISTING";

  // When studyState changes away from EXISTING, reset any linked files to upload pending
  useEffect(() => {
    if (studyState !== "EXISTING") {
      if (adamStatus === "use-existing") {
        setAdamStatus("pending");
        setAdamFile("");
        setAdamEvent("");
      }
      if (sdtmStatus === "use-existing") {
        setSdtmStatus("pending");
        setSdtmFile("");
        setSdtmEvent("");
      }
      if (sapStatus === "use-existing") {
        setSapStatus("pending");
        setSapFile("");
        setSapEvent("");
      }
    }
  }, [studyState]);

  // Historical event lists for the selected study
  const currentStudyEvents = studyCode && STUDY_HISTORICAL_EVENTS[studyCode] ? STUDY_HISTORICAL_EVENTS[studyCode] : { adam: [], sdtm: [], sap: [] };

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const fieldsFilled = !!taValue && !!projectCode && !!studyCode && !!eventName.trim() && !!ogemValue;

  const requiredFilesUploaded =
    (adamStatus === "uploaded" || adamStatus === "use-existing") &&
    (sdtmStatus === "uploaded" || sdtmStatus === "use-existing") &&
    (sapStatus === "uploaded" || sapStatus === "use-existing") &&
    (shellStatus === "uploaded");

  const canCreateEvent = fieldsFilled && requiredFilesUploaded;

  const handleCreate = () => {
    if (!canCreateEvent) return;
    const selectedProjectLabel = projectOptions.find(o => o.value === projectCode)?.label.split(" - ")[0] || projectCode || "";
    const selectedStudyLabel = studyOptions.find(o => o.value === studyCode)?.label || studyCode || "";

    onCreateEvent({
      name: eventName,
      project: selectedProjectLabel,
      study: selectedStudyLabel,
    });
    // Reset state
    setEventName("");
    setTaValue(null);
    setProjectCode(null);
    setIsProjectNew(false);
    setStudyCode(null);
    setIsStudyNew(false);
    setOgemValue("12.8");
    setAdamStatus("pending");
    setAdamFile("");
    setAdamEvent("");
    setSdtmStatus("pending");
    setSdtmFile("");
    setSdtmEvent("");
    setSapStatus("pending");
    setSapFile("");
    setSapEvent("");
    setShellStatus("pending");
    setShellFile("");
    setTifoStatus("pending");
    setTifoFile("");
    setCustomShellStatus("pending");
    setCustomShellFile("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative flex h-[740px] max-h-[calc(100vh-40px)] w-[960px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-[16px] px-[20px] pb-[12px] pt-[16px]">
          <div className="flex min-w-0 flex-1 items-center gap-[10px]">
            <h2 style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 14, lineHeight: "22px", color: "var(--color-text-primary)" }}>Create New Event</h2>
          </div>
          <button onClick={onClose} className="relative flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-graphite-10 active:scale-[0.96] after:content-[''] after:absolute after:-inset-[8px]" aria-label="Close">
            <CloseIcon size={16} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-[8px]">
          <div className="flex min-h-0 flex-1 border-t border-graphite-10">
              {/* Left column */}
              <div className="flex min-h-0 w-[320px] shrink-0 flex-col gap-[16px] overflow-y-auto border-r border-graphite-10 p-[20px]">
                <Dropdown label="Therapeutic Area" required placeholder="Required" options={taOptions} value={taValue} onChange={setTaValue} />
                <CreatableDropdown
                  label="Project Code"
                  required
                  placeholder="Select or enter new code"
                  options={projectOptions}
                  value={projectCode}
                  isNew={isProjectNew}
                  createPrefix="New Project"
                  onChange={(val, isNew) => {
                    setProjectCode(val);
                    setIsProjectNew(isNew);
                  }}
                />
                <CreatableDropdown
                  label="Study Code"
                  required
                  placeholder="Select or enter new code"
                  options={studyOptions}
                  value={studyCode}
                  isNew={isStudyNew}
                  createPrefix="New Study"
                  onChange={(val, isNew) => {
                    setStudyCode(val);
                    setIsStudyNew(isNew);
                  }}
                />
                <Input label="Event Name" required placeholder="Required" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                <Dropdown label="O_GEM Version" required placeholder="Required" options={ogemOptions} value={ogemValue} onChange={setOgemValue} />
                <OptionalSection />
              </div>
              {/* Right column */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[18px_20px_20px_20px]">
                 <UploadCard 
                  label="ADaM Spec" 
                  required 
                  requirementText="Excel only (.xlsx / .xls), max 20MB per file" 
                  showSegmentedControl 
                  isUseExistingDisabled={!isUseExistingEnabled}
                  status={adamStatus} 
                  fileName={adamFile}
                  selectedEventName={adamEvent}
                  existingEvents={currentStudyEvents.adam}
                  onStatusChange={setAdamStatus}
                  onFileSelect={(f, evt) => {
                    setAdamFile(f);
                    setAdamEvent(evt || "");
                  }}
                  errorMessage="Validation failed: missing column USUBJID." 
                />
                <UploadCard 
                  label="SDTM" 
                  required 
                  requirementText="Excel only (.xlsx / .xls), max 20MB" 
                  showSegmentedControl 
                  isUseExistingDisabled={!isUseExistingEnabled}
                  status={sdtmStatus} 
                  fileName={sdtmFile}
                  selectedEventName={sdtmEvent}
                  existingEvents={currentStudyEvents.sdtm}
                  onStatusChange={setSdtmStatus}
                  onFileSelect={(f, evt) => {
                    setSdtmFile(f);
                    setSdtmEvent(evt || "");
                  }}
                />
                <UploadCard 
                  label="SAP" 
                  required 
                  requirementText="PDF or Word (.pdf / .docx), max 20MB" 
                  showSegmentedControl 
                  isUseExistingDisabled={!isUseExistingEnabled}
                  status={sapStatus} 
                  fileName={sapFile}
                  selectedEventName={sapEvent}
                  existingEvents={currentStudyEvents.sap}
                  onStatusChange={setSapStatus}
                  onFileSelect={(f, evt) => {
                    setSapFile(f);
                    setSapEvent(evt || "");
                  }}
                />
                <UploadCard 
                  label="Shell file" 
                  required 
                  requirementText="Excel only (.xlsx / .xls), max 20MB" 
                  status={shellStatus}
                  fileName={shellFile}
                  onStatusChange={setShellStatus}
                  onFileSelect={setShellFile}
                  errorMessage="Validation failed: The shell template contains unrecognized format in Sheet 3, Cell Range B5:D20. Expected headers (Table No, Title, Footnotes), but found invalid character sequence. Please correct the template and try again."
                />
                <UploadCard 
                  label="TiFo" 
                  requirementText="Excel only (.xlsx / .xls), max 20MB" 
                  status={tifoStatus}
                  fileName={tifoFile}
                  onStatusChange={setTifoStatus}
                  onFileSelect={setTifoFile}
                />
                <UploadCard 
                  label="Custom Shell json" 
                  requirementText="JSON only (.json), max 20MB" 
                  status={customShellStatus}
                  fileName={customShellFile}
                  onStatusChange={setCustomShellStatus}
                  onFileSelect={setCustomShellFile}
                />
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end border-t border-graphite-10 px-[20px] py-[14px]">
          <PrimaryButton disabled={!canCreateEvent} onClick={handleCreate}>Create Event</PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
