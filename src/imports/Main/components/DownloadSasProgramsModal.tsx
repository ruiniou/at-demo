import { Avatar } from "../../../components/ui/Avatar";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Button } from "../../../components/ui/Button";
import { SearchBar } from "../../../components/ui/SearchBar";
import { FilterChip } from "../../../components/ui/FilterChip";
import { Tooltip } from "../../../components/ui/Tooltip";
import closeIconUrl from "../../../icons/close-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import teamIconUrl from "../../../icons/team-line.svg";
import linkIconUrl from "../../../icons/link.svg";
import checkIconUrl from "../../../icons/check-line.svg";

function LockIcon({ size = 14 }: { size?: number }) {
  const mask = `url("${lockIconUrl}") center / contain no-repeat`;
  return <span aria-hidden="true" className="inline-block shrink-0 bg-text-secondary" style={{ width: size, height: size, mask, WebkitMask: mask }} />;
}

function TeamIcon({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M12 11C14.7614 11 17 13.2386 17 16V22H15V16C15 14.4023 13.7511 13.0963 12.1763 13.0051L12 13C10.4023 13 9.09634 14.2489 9.00509 15.8237L9 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5.5 14C5.77885 14 6.05009 14.0326 6.3101 14.0942C6.14202 14.594 6.03873 15.122 6.00896 15.6693L6 16L6.0007 16.0856C5.88757 16.0456 5.76821 16.0187 5.64446 16.0069L5.5 16C4.7203 16 4.07955 16.5949 4.00687 17.3555L4 17.5V22H2V17.5C2 15.567 3.567 14 5.5 14ZM18.5 14C20.433 14 22 15.567 22 17.5V22H20V17.5C20 16.7203 19.4051 16.0796 18.6445 16.0069L18.5 16C18.3248 16 18.1566 16.03 18.0003 16.0852L18 16C18 15.3343 17.8916 14.694 17.6915 14.0956C17.9499 14.0326 18.2211 14 18.5 14ZM5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5C3 9.11929 4.11929 8 5.5 8ZM18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8ZM5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5C6 10.2239 5.77614 10 5.5 10ZM18.5 10C18.2239 10 18 10.2239 18 10.5C18 10.7761 18.2239 11 18.5 11C18.7761 11 19 10.7761 19 10.5C19 10.2239 18.7761 10 18.5 10ZM12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4Z"
        fill={color}
      />
    </svg>
  );
}

export interface ProgramItem {
  id: number;
  title: string;
  program: string;
  macros: string[];
  macroLinked: boolean[];
  owner: string;
  ownerInitials: string;
  ownerColor: string;
  locked: boolean;
}

export const DEFAULT_PROGRAMS: ProgramItem[] = [
  {
    id: 1,
    title: "14.3.1.1 Summary of adverse events",
    program: "t_ae_summary.sas",
    macros: ["m_t_ae", "m_u_report", "m_safety_eval", "m_export_rtf"],
    macroLinked: [true, false, true, false],
    owner: "Sarah Chen",
    ownerInitials: "SC",
    ownerColor: "#f0ab00",
    locked: false,
  },
  {
    id: 2,
    title: "16.2.1.1 Demographic data listing",
    program: "t_dm_listing.sas",
    macros: ["m_t_dm"],
    macroLinked: [true],
    owner: "James Park",
    ownerInitials: "JP",
    ownerColor: "#f0ab00",
    locked: false,
  },
  {
    id: 3,
    title: "14.2.3.1 Kaplan-Meier survival curve",
    program: "f_km_plot.sas",
    macros: ["m_f_km", "m_u_plot"],
    macroLinked: [true, false],
    owner: "Sarah Chen",
    ownerInitials: "SC",
    ownerColor: "#f0ab00",
    locked: false,
  },
  {
    id: 4,
    title: "14.2.1.1 Primary efficacy analysis",
    program: "t_efficacy.sas",
    macros: ["m_t_eff", "m_u_stat", "m_ancova_fit"],
    macroLinked: [true, false, true],
    owner: "Priya Sharma",
    ownerInitials: "PS",
    ownerColor: "#f0ab00",
    locked: false,
  },
  {
    id: 5,
    title: "14.1.4.2 Vital signs shift table",
    program: "t_vs_shift.sas",
    macros: ["m_t_vs"],
    macroLinked: [true],
    owner: "James Park",
    ownerInitials: "JP",
    ownerColor: "#830051",
    locked: true,
  },
  {
    id: 6,
    title: "16.2.4.1 Concomitant medications listing",
    program: "l_conmed.sas",
    macros: ["m_l_cm_report_generator", "m_u_report"],
    macroLinked: [true, false],
    owner: "Alex Kim",
    ownerInitials: "AK",
    ownerColor: "#7c8db0",
    locked: false,
  },
  {
    id: 7,
    title: "14.1.5.3 Laboratory abnormalities summary",
    program: "t_lab_abnormal.sas",
    macros: ["m_t_lab", "m_u_grade", "m_u_ctcae", "m_format"],
    macroLinked: [true, false, true, false],
    owner: "Priya Sharma",
    ownerInitials: "PS",
    ownerColor: "#f0ab00",
    locked: false,
  },
];

function MacroTag({
  macro,
  linked,
  maxWidth = 160,
}: {
  macro: string;
  linked: boolean;
  maxWidth?: number | string;
}) {
  return (
    <div
      className="bg-graphite-10 rounded-[4px] shrink-0 flex items-center px-[6px] py-[2px] gap-[4px]"
      style={{ maxWidth }}
    >
      {linked && (
        <img
          src={linkIconUrl}
          alt=""
          className="shrink-0 size-[14px] opacity-70"
        />
      )}
      <span
        className="t-small text-text-primary overflow-hidden text-ellipsis whitespace-nowrap"
        title={macro}
      >
        {macro}
      </span>
    </div>
  );
}

function MacroCell({
  macros,
  macroLinked,
}: {
  macros: string[];
  macroLinked: boolean[];
}) {
  if (!macros || macros.length === 0) {
    return <span className="t-small text-text-secondary">—</span>;
  }

  // 1 个 Macro: 正常展示单标签
  if (macros.length === 1) {
    return (
      <div className="flex items-center min-w-0 max-w-full">
        <MacroTag macro={macros[0]} linked={macroLinked[0]} maxWidth={150} />
      </div>
    );
  }

  // 2 个 Macro: 正常展示两个标签
  if (macros.length === 2) {
    return (
      <div className="flex gap-[4px] items-center min-w-0 max-w-full overflow-hidden">
        <MacroTag macro={macros[0]} linked={macroLinked[0]} maxWidth={76} />
        <MacroTag macro={macros[1]} linked={macroLinked[1]} maxWidth={76} />
      </div>
    );
  }

  // 3 个及以上: 展示前 2 个标签 + '+N' (N = 总数 - 2)
  const remainingCount = macros.length - 2;

  const allMacrosTooltipContent = (
    <div className="flex flex-col gap-[4px] py-[1px]">
      {macros.map((m, idx) => (
        <div key={m} className="flex items-center gap-[6px]">
          {macroLinked[idx] ? (
            <img
              src={linkIconUrl}
              alt=""
              className="size-[12px] opacity-90 invert shrink-0"
            />
          ) : (
            <span className="size-[12px] shrink-0" />
          )}
          <span className="t-small text-tooltip-text font-mono whitespace-nowrap">
            {m}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex gap-[4px] items-center min-w-0 max-w-full overflow-hidden">
      <MacroTag macro={macros[0]} linked={macroLinked[0]} maxWidth={64} />
      <MacroTag macro={macros[1]} linked={macroLinked[1]} maxWidth={64} />
      <Tooltip placement="top" label={allMacrosTooltipContent}>
        <span
          className="bg-graphite-10 text-text-primary hover:bg-graphite-20 rounded-[4px] px-[5px] py-[2px] text-[11px] font-medium leading-[14px] shrink-0 cursor-default select-none transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          +{remainingCount}
        </span>
      </Tooltip>
    </div>
  );
}

interface OwnerDropdownProps {
  allOwners: string[];
  selectedOwners: Set<string>;
  onChange: (owners: Set<string>) => void;
}

function OwnerDropdown({ allOwners, selectedOwners, onChange }: OwnerDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = useCallback(
    (owner: string) => {
      const next = new Set(selectedOwners);
      if (next.has(owner)) {
        next.delete(owner);
      } else {
        next.add(owner);
      }
      onChange(next);
    },
    [selectedOwners, onChange]
  );

  const clearAll = useCallback(() => onChange(new Set()), [onChange]);

  const filteredOptions = useMemo(() => {
    return allOwners.filter((o) =>
      o.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOwners, search]);

  const isActive = selectedOwners.size > 0;
  const label =
    selectedOwners.size === 0
      ? "Owner"
      : selectedOwners.size === 1
      ? Array.from(selectedOwners)[0]
      : `${selectedOwners.size} Owners`;

  return (
    <div ref={ref} className="relative">
      {/* Trigger chip - standard FilterChip styling with static chevron */}
      <button
        type="button"
        className={`inline-flex h-[28px] max-w-full items-center gap-[4px] py-[5px] pl-[8px] pr-[6px] rounded-[4px] transition-colors cursor-pointer select-none min-w-0 ${
          isActive || open
            ? "bg-[#F4E8EE] hover:bg-[#EEDFE7] text-[#830051]"
            : "bg-transparent hover:bg-[#F8F7F7] active:bg-[#F0F2F2] text-[#3F4444]"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <div
          className={`flex shrink-0 items-center justify-center size-[16px] ${
            isActive || open ? "text-[#830051]" : "text-[#3F4444]"
          }`}
        >
          <TeamIcon color={isActive || open ? "#830051" : "#3F4444"} size={16} />
        </div>
        <span
          className={`t-small font-normal leading-[18px] truncate min-w-0 ${
            isActive || open ? "text-[#830051]" : "text-[#3F4444]"
          }`}
        >
          {label}
        </span>
        <div className="flex shrink-0 items-center justify-center size-[16px]">
          <svg
            className="shrink-0 size-[16px]"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke={isActive || open ? "#830051" : "#3F4444"}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-[32px] left-0 z-[10050] bg-white rounded-[8px] w-[240px] p-[4px] flex flex-col gap-[6px] border border-graphite-10 shadow-elevation-overlay animate-fade-in"
        >
          {/* Search bar inside dropdown */}
          <div className="bg-white rounded-[4px] relative shrink-0 w-full border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all">
            <div className="p-[2px] flex items-center size-full">
              <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[4px] flex-wrap">
                {/* Tag chips */}
                {Array.from(selectedOwners).map((owner) => (
                  <div
                    key={owner}
                    className="bg-graphite-10 rounded-[4px] shrink-0 flex items-center gap-[4px] px-[6px] py-[2px]"
                  >
                    <Avatar name={owner} level="menu" />
                    <span className="t-small text-text-primary whitespace-nowrap">
                      {owner}
                    </span>
                    <button
                      type="button"
                      className="relative shrink-0 size-[12px] flex items-center justify-center opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(owner);
                      }}
                    >
                      <img src={closeIconUrl} alt="" className="size-[10px]" />
                    </button>
                  </div>
                ))}
                <input
                  ref={inputRef}
                  className="min-w-[60px] flex-1 bg-transparent outline-none t-small text-text-primary placeholder:text-text-secondary"
                  placeholder={selectedOwners.size === 0 ? "Search people..." : ""}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {isActive && (
                  <button
                    type="button"
                    className="relative shrink-0 size-[20px] flex items-center justify-center rounded-[4px] hover:bg-black/5"
                    onClick={clearAll}
                    title="Clear all"
                  >
                    <img src={closeIconUrl} alt="" className="size-[12px] opacity-70" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Option list */}
          <div className="flex flex-col gap-[1px] max-h-[200px] overflow-y-auto w-full">
            {filteredOptions.map((owner) => {
              const isSelected = selectedOwners.has(owner);
              return (
                <button
                  key={owner}
                  type="button"
                  className={`flex items-center gap-[8px] px-[6px] py-[6px] rounded-[4px] w-full text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-az-secondary/60 text-brand-1 font-medium"
                      : "hover:bg-bg-panel text-text-primary"
                  }`}
                  onClick={() => toggle(owner)}
                >
                  <Avatar name={owner} level="menu" />
                  <span className="t-small flex-1 truncate">{owner}</span>
                  {owner === "Sarah Chen" && (
                    <span className="t-small text-text-secondary shrink-0">
                      (You)
                    </span>
                  )}
                  {isSelected && (
                    <img
                      src={checkIconUrl}
                      alt=""
                      className="size-[14px] shrink-0 opacity-90"
                    />
                  )}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="t-small text-text-secondary px-[8px] py-[6px]">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export interface DownloadSasProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs?: ProgramItem[];
}

export default function DownloadSasProgramsModal({
  isOpen,
  onClose,
  programs = DEFAULT_PROGRAMS,
}: DownloadSasProgramsModalProps) {
  // 默认情况列表都不选
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
  const [lockedFilter, setLockedFilter] = useState(false);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeTaskList, setIncludeTaskList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  const allOwners = useMemo(() => {
    return Array.from(new Set(programs.map((p) => p.owner))).sort();
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    let result = programs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.program.toLowerCase().includes(q) ||
          p.macros.some((m) => m.toLowerCase().includes(q))
      );
    }
    if (selectedOwners.size > 0) {
      result = result.filter((p) => selectedOwners.has(p.owner));
    }
    if (lockedFilter) {
      result = result.filter((p) => p.locked);
    }
    return result;
  }, [programs, searchQuery, selectedOwners, lockedFilter]);

  const visibleSelectedCount = filteredPrograms.filter((p) =>
    selectedIds.has(p.id)
  ).length;
  const allVisible =
    filteredPrograms.length > 0 &&
    filteredPrograms.every((p) => selectedIds.has(p.id));
  const someVisible =
    filteredPrograms.some((p) => selectedIds.has(p.id)) && !allVisible;
  const isEmpty = filteredPrograms.length === 0;

  const toggleAll = () => {
    if (allVisible) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredPrograms.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredPrograms.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownload = () => {
    if (selectedIds.size === 0 || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("Download package prepared successfully.");
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 1200);
    }, 1000);
  };

  const canDownload = selectedIds.size > 0 && !isLoading;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-[16px] animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-[8px] shadow-elevation-modal w-[800px] max-w-[calc(100vw-32px)] flex flex-col overflow-hidden border border-graphite-10 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-graphite-10 shrink-0">
          <h2 className="t-heading text-text-primary truncate">
            Download SAS Programs
          </h2>
          <button
            type="button"
            className="size-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="size-[16px] opacity-70" />
          </button>
        </div>

        {/* Body */}
        <div
          className={`flex flex-col h-[590px] shrink-0 w-full overflow-hidden ${
            isLoading
              ? "items-center justify-center p-[20px]"
              : "gap-[10px] items-start pb-[16px] pt-[12px] px-[20px]"
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-[12px]">
              <div className="size-[32px] rounded-full border-2 border-brand-1 border-t-transparent animate-spin" />
              <p className="t-body-secondary text-text-secondary">
                Preparing download package…
              </p>
            </div>
          ) : (
            <>
              {/* Search Bar using Local SearchBar component */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search title, name, or macro"
                background="light"
                className="w-full shrink-0"
              />

              {/* Filter Bar */}
              <div className="flex items-center justify-between shrink-0 w-full">
                <div className="flex gap-[8px] items-center">
                  {/* Locked Only chip using standard FilterChip */}
                  <FilterChip
                    type="Toggle"
                    active={lockedFilter}
                    onClick={() => setLockedFilter((v) => !v)}
                    label="Locked Only"
                    icon={<LockIcon size={14} />}
                  />

                  {/* Owner Dropdown */}
                  <OwnerDropdown
                    allOwners={allOwners}
                    selectedOwners={selectedOwners}
                    onChange={setSelectedOwners}
                  />
                </div>
              </div>

              {/* Table Container */}
              <div
                className="border border-graphite-10 flex flex-col items-start rounded-[4px] w-full flex-1 min-h-0 overflow-hidden bg-white"
              >
                {/* Table Header */}
                <div className="bg-bg-panel flex h-[40px] items-center overflow-hidden shrink-0 w-full border-b border-graphite-10 select-none">
                  <div className="flex h-full items-center overflow-hidden pl-[14px] pr-[8px] shrink-0 w-[44px]">
                    <Checkbox
                      checked={allVisible}
                      indeterminate={someVisible}
                      onChange={toggleAll}
                    />
                  </div>
                  <div className="flex h-full items-center px-[12px] shrink-0 w-[210px]">
                    <span className="t-small-medium text-text-secondary whitespace-nowrap">
                      Title
                    </span>
                  </div>
                  <div className="flex h-full items-center pl-[12px] pr-[8px] shrink-0 w-[150px]">
                    <span className="t-small-medium text-text-secondary whitespace-nowrap">
                      Program Name
                    </span>
                  </div>
                  <div className="flex h-full items-center pl-[12px] pr-[8px] shrink-0 w-[184px]">
                    <span className="t-small-medium text-text-secondary whitespace-nowrap">
                      Macro
                    </span>
                  </div>
                  <div className="flex flex-1 h-full items-center pl-[12px] pr-[8px] min-w-0">
                    <span className="t-small-medium text-text-secondary whitespace-nowrap">
                      Owner
                    </span>
                  </div>
                </div>

                {/* Table Body */}
                <div className="bg-white flex flex-col overflow-auto w-full flex-1 min-h-0 divide-y divide-graphite-10">
                  {!isEmpty ? (
                    filteredPrograms.map((p) => {
                      const isChecked = selectedIds.has(p.id);
                      return (
                        <div
                          key={p.id}
                          className="h-[44px] shrink-0 w-full flex items-center hover:bg-bg-panel cursor-pointer transition-colors"
                          onClick={() => toggleRow(p.id)}
                        >
                          {/* Checkbox */}
                          <div
                            className="flex items-center pl-[14px] pr-[8px] h-full shrink-0 w-[44px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(p.id);
                            }}
                          >
                            <Checkbox checked={isChecked} onChange={() => toggleRow(p.id)} />
                          </div>
                          {/* Title */}
                          <div className="flex items-center px-[12px] h-full shrink-0 w-[210px] overflow-hidden">
                            <span
                              className="t-small text-text-primary truncate"
                              title={p.title}
                            >
                              {p.title}
                            </span>
                          </div>
                          {/* Program Name */}
                          <div className="flex items-center pl-[12px] pr-[8px] h-full shrink-0 w-[150px] overflow-hidden">
                            <span
                              className="t-small text-text-secondary truncate font-mono"
                              title={p.program}
                            >
                              {p.program}
                            </span>
                          </div>
                          {/* Macros */}
                          <div className="flex items-center pl-[12px] pr-[8px] h-full shrink-0 w-[184px] overflow-hidden">
                            <MacroCell
                              macros={p.macros}
                              macroLinked={p.macroLinked}
                            />
                          </div>
                          {/* Owner */}
                          <div className="flex flex-1 gap-[6px] items-center pl-[12px] pr-[8px] h-full min-w-0 overflow-hidden">
                            <Avatar name={p.owner} level="modal" />
                            <span
                              className="t-small text-text-secondary truncate"
                              title={p.owner}
                            >
                              {p.owner}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-[24px]">
                      <p className="t-body-secondary text-text-secondary text-center">
                        No programs match your search or filters.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bundle Bar */}
                {!isEmpty && selectedIds.size > 0 && (
                  <div className="bg-bg-panel flex gap-[6px] items-center overflow-hidden px-[12px] py-[8px] shrink-0 w-full border-t border-graphite-10 select-none">
                    <span className="t-small text-text-secondary whitespace-nowrap shrink-0">
                      This download includes:
                    </span>
                    <span className="t-small-medium text-text-primary whitespace-nowrap shrink-0 font-medium">
                      {selectedIds.size} SAS Program
                      {selectedIds.size !== 1 ? "s" : ""},
                    </span>
                    <label className="flex gap-[4px] items-center overflow-hidden shrink-0 cursor-pointer">
                      <Checkbox
                        checked={includeTOC}
                        onChange={(val) => setIncludeTOC(val)}
                        size={14}
                      />
                      <span className="t-small-medium text-text-primary whitespace-nowrap font-medium">
                        TOC
                      </span>
                    </label>
                    <span className="t-small text-text-secondary whitespace-nowrap shrink-0">
                      and
                    </span>
                    <label className="flex gap-[4px] items-center overflow-hidden shrink-0 cursor-pointer">
                      <Checkbox
                        checked={includeTaskList}
                        onChange={(val) => setIncludeTaskList(val)}
                        size={14}
                      />
                      <span className="t-small-medium text-text-primary whitespace-nowrap font-medium">
                        Task List
                      </span>
                    </label>
                    <span className="t-small text-text-secondary whitespace-nowrap shrink-0">
                      for this Event
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-end px-[20px] py-[14px] border-t border-graphite-10 shrink-0 w-full bg-white">
          <div className="flex gap-[12px] items-center">
            {/* Cancel Button - Ghost (no fill) */}
            <Button
              variant="ghost"
              size="default"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {/* Download Button */}
            <Button
              variant="primary"
              size="default"
              onClick={handleDownload}
              disabled={!canDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[10060] bg-text-primary text-white px-[16px] py-[10px] rounded-[6px] shadow-elevation-overlay flex items-center gap-[8px] animate-slide-in-up">
          <img src={checkIconUrl} alt="" className="size-[16px] invert" />
          <span className="t-small font-medium">{toastMessage}</span>
        </div>
      )}
    </div>,
    document.body
  );
}
