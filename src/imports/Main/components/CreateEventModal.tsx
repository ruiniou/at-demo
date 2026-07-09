import React, { useState, useRef, useEffect } from "react";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Badge } from "../../../components/ui/Badge";
import { UploadCard, UploadStatus } from "../../../components/ui/UploadCard";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Dropdown, DropdownOption } from "../../../components/ui/Dropdown";
import { MultiSelectDropdown } from "../../../components/ui/MultiSelectDropdown";
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
        className={`flex w-full items-center justify-between px-[10px] py-[10px] hover:bg-bg-light ${isExpanded ? "rounded-t-[6px]" : "rounded-[6px]"}`}>
        <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: "20px", color: "var(--color-text-primary)" }}>Optional</span>
        <ArrowDownIcon size={20} color="var(--color-text-secondary)" rotated={isExpanded} />
      </button>
      <div className="h-0 w-full border-t border-graphite-10" />
      {isExpanded && (
        <div className="flex flex-col gap-[16px] px-[10px] py-[12px]">
          <MultiSelectDropdown label="Tables to parse" placeholder="Select tables to parse" options={tablesToParseOptions} value={tablesToParse} onChange={setTablesToParse} />
          <Dropdown label="Reference Study" placeholder="Select reference study" options={refStudyOptions} value={refStudyValue} onChange={setRefStudyValue} />
          <Dropdown label="Reference Event" placeholder="Select reference event" options={refEventOptions} value={refEventValue} onChange={setRefEventValue} />
          <Input label="Program Path" placeholder="e.g. /studies/ABC-01/programs/primary" value={programPath} onChange={setProgramPath} />
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
    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[20px_24px] [scrollbar-gutter:stable]">
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

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: { name: string; project: string; study: string }) => void;
}) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const [step1Height, setStep1Height] = useState<number | null>(null);
  const [taValue, setTaValue] = useState<string | null>(null);
  const [projectCodes, setProjectCodes] = useState<string[]>([]);
  const [studyCodes, setStudyCodes] = useState<string[]>([]);
  const [eventName, setEventName] = useState("");
  const [ogemValue, setOgemValue] = useState<string | null>("12.8");

  // UploadCard states
  const [adamStatus, setAdamStatus] = useState<UploadStatus>("error");
  const [adamFile, setAdamFile] = useState("");

  const [sdtmStatus, setSdtmStatus] = useState<UploadStatus>("uploaded");
  const [sdtmFile, setSdtmFile] = useState("sdtm_spec_v1.2.xlsx");

  const [shellStatus, setShellStatus] = useState<UploadStatus>("error");
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
  const projectOptions: DropdownOption[] = [
    { label: "PRO001 - Breast Cancer Study", value: "pro001" },
    { label: "PRO002 - NSCLC Trial", value: "pro002" },
    { label: "PRO003 - Diabetes Study", value: "pro003" },
  ];
  const studyOptions: DropdownOption[] = [
    { label: "AZE2001-301", value: "aze2001-301" }, { label: "AZE2001-302", value: "aze2001-302" },
    { label: "AZE2001-303", value: "aze2001-303" },
  ];
  const ogemOptions: DropdownOption[] = [
    { label: "12.8", value: "12.8" },
    { label: "12.7", value: "12.7" },
    { label: "12.6", value: "12.6" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset to step 1 when modal closes
  useEffect(() => {
    if (!isOpen) { 
      setCurrentStep(1); 
      setStep1Height(null); 
    }
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

  const fieldsFilled = !!taValue && projectCodes.length > 0 && studyCodes.length > 0 && !!eventName.trim() && !!ogemValue;

  const requiredFilesUploaded =
    (adamStatus === "uploaded" || adamStatus === "use-existing") &&
    (sdtmStatus === "uploaded" || sdtmStatus === "use-existing") &&
    (shellStatus === "uploaded" || shellStatus === "use-existing");

  const canCreateEvent = fieldsFilled && requiredFilesUploaded;

  const handleCreate = () => {
    if (!canCreateEvent) return;
    const selectedProjects = projectCodes
      .map(val => projectOptions.find(o => o.value === val)?.label.split(" - ")[0] || val)
      .join(", ");
    const selectedStudies = studyCodes
      .map(val => studyOptions.find(o => o.value === val)?.label || val)
      .join(", ");

    onCreateEvent({
      name: eventName,
      project: selectedProjects,
      study: selectedStudies,
    });
    // Reset state
    setEventName("");
    setTaValue(null);
    setProjectCodes([]);
    setStudyCodes([]);
    setOgemValue("12.8");
    setAdamStatus("error");
    setSdtmStatus("uploaded");
    setShellStatus("pending");
    setTifoStatus("pending");
    setCustomShellStatus("pending");
    setCustomShellFile("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div ref={modalRef} className="relative flex h-[740px] max-h-[calc(100vh-40px)] w-[760px] max-w-[90vw] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]" style={currentStep === 2 && step1Height ? { height: `${step1Height}px` } : undefined}>
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
          <div className="flex shrink-0 flex-col items-center gap-[10px] px-[20px] py-[8px]">
            <Stepper currentStep={currentStep} />
          </div>

          {currentStep === 1 ? (
            /* Step 1 - Upload Specs & Configs */
            <div className="flex min-h-0 flex-1 border-t border-graphite-10">
              {/* Left column */}
              <div className="flex min-h-0 w-[320px] shrink-0 flex-col gap-[16px] overflow-y-auto [scrollbar-gutter:stable] border-r border-graphite-10 p-[20px]">
                <Dropdown label="Therapeutic Area" required placeholder="Select TA" options={taOptions} value={taValue} onChange={setTaValue} />
                <MultiSelectDropdown label="Project Code" required placeholder="Select Project Code" options={projectOptions} value={projectCodes} onChange={setProjectCodes} />
                <MultiSelectDropdown label="Study Code" required placeholder="Select Study Code" options={studyOptions} value={studyCodes} onChange={setStudyCodes} />
                <Input label="Event Name" required placeholder="e.g. CSR Interim Analysis" value={eventName} onChange={setEventName} />
                <Dropdown label="O_GEM Version" required placeholder="Select O_GEM Version" options={ogemOptions} value={ogemValue} onChange={setOgemValue} />
                <OptionalSection />
              </div>
              {/* Right column */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] overflow-y-auto [scrollbar-gutter:stable] p-[18px_20px_20px_20px]">
                 <UploadCard 
                  label="ADaM Spec" 
                  required 
                  requirementText="Excel only (.xlsx / .xls), max 20MB per file" 
                  showSegmentedControl 
                  status={adamStatus} 
                  fileName={adamFile}
                  onStatusChange={setAdamStatus}
                  onFileSelect={setAdamFile}
                  errorMessage="Validation failed: missing column USUBJID." 
                />
                <UploadCard 
                  label="SDTM" 
                  required 
                  requirementText="Excel only (.xlsx / .xls), max 20MB" 
                  status={sdtmStatus} 
                  fileName={sdtmFile}
                  onStatusChange={setSdtmStatus}
                  onFileSelect={setSdtmFile}
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
            <PrimaryButton disabled={!canCreateEvent} onClick={handleCreate}>Create Event</PrimaryButton>
          </div>
        ) : (
          <div className="flex shrink-0 items-center justify-between border-t border-graphite-10 px-[20px] py-[14px]">
            <button onClick={() => setCurrentStep(1)} className="flex h-[36px] items-center rounded-[4px] bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]">Back</button>
            <div className="flex items-center gap-[8px]">
              <button className="flex h-[36px] items-center rounded-[4px] bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]">Assign Later</button>
              <PrimaryButton disabled={!canCreateEvent} onClick={handleCreate}>Create Event</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
