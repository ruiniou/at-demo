import { DropdownGroupLabel, DropdownEmpty } from "../../../components/ui/DropdownParts";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarGroup } from "../../../components/ui/Avatar";
import checkIconUrl from "../../../icons/check-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import addLineIconUrl from "../../../icons/add-line.svg";
import searchLineIconUrl from "../../../icons/search-line.svg";
import tableIconUrl from "../../../icons/Table.svg";
import listingIconUrl from "../../../icons/Listing.svg";
import figureIconUrl from "../../../icons/Figure.svg";
import aiProcessingIconUrl from "../../../icons/Status label/Status=AI Processing.svg";
import wipStatusIconUrl from "../../../icons/Status label/Status=WIP.svg";
import lockedStatusIconUrl from "../../../icons/Lock.svg";
import { Tooltip } from "../../../components/ui/Tooltip";
import untouchedStatusIconUrl from "../../../icons/Status label/Status=Untouched.svg";
import errorStatusIconUrl from "../../../icons/Status label/Status=Error.svg";
import arrowDownIconUrl from "../../../icons/arrow-down-s-line.svg";
import teamLineIconUrl from "../../../icons/team-line.svg";
import deleteBinIconUrl from "../../../icons/delete-bin-line.svg";
import { Checkbox } from "../../../components/ui/Checkbox";
import { FilterChip, FilterChipOption } from "../../../components/ui/FilterChip";
import { SearchBar } from "../../../components/ui/SearchBar";

// ─── Shared Types ─────────────────────────────────────────────────────────────

// Current logged-in user (mock)
const CURRENT_USER = "Sarah Chen";

export type TFLType = "table" | "listing" | "figure";

export interface TeamMember {
  name: string;
  initials: string;
  color: string;
  email: string;
  isOwner: boolean;
  assignedTFLs: number;
  addedBy?: string;
}

export interface TFLRow {
  id: string;
  type?: TFLType;
  title: string;
  program: string;
  status: "ai-processing" | "in-progress" | "completed" | "locked" | "to-do" | "error";
  programmer: string | null;
}

const isTflLocked = (row: TFLRow) => row.status === "completed" || row.status === "locked";
const LOCKED_ASSIGNMENT_MESSAGE = "TFL cannot be assigned because it is locked.";

export const MOCK_USER_POOL: Omit<TeamMember, "isOwner" | "assignedTFLs" | "addedBy">[] = [
  { name: "Sarah Chen",   initials: "SC", color: "#f0ab00", email: "sarah.chen@astrazeneca.com" },
  { name: "James Park",   initials: "JP", color: "#830051", email: "james.park@astrazeneca.com" },
  { name: "Priya Sharma", initials: "PS", color: "#d0006f", email: "priya.sharma@astrazeneca.com" },
  { name: "Alex Kim",     initials: "AK", color: "#7c8db0", email: "alex.kim@astrazeneca.com" },
  { name: "Tom Chen",     initials: "TC", color: "#0077b6", email: "tom.chen@astrazeneca.com" },
  { name: "Emily Liu",    initials: "EL", color: "#2d6a4f", email: "emily.liu@astrazeneca.com" },
];

// ─── Tiny Helpers ─────────────────────────────────────────────────────────────

function WarningIcon({ size = 18 }: { size?: number }) {
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
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
        fill="var(--color-status-error)"
      />
    </svg>
  );
}

function TflTypeIcon({ type }: { type?: TFLType }) {
  const iconSrc =
    type === "listing" ? listingIconUrl : type === "figure" ? figureIconUrl : tableIconUrl;
  const label = type === "listing" ? "Listing" : type === "figure" ? "Figure" : "Table";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="size-4 shrink-0 bg-text-secondary"
      style={{ mask: `url("${iconSrc}") center / contain no-repeat` }}
    />
  );
}

function CloseIcon({ size = 16 }: { size?: number }) {
  return <img src={closeIconUrl} alt="" style={{ width: size, height: size, opacity: 0.55 }} />;
}

function StatusTag({ status }: { status: TFLRow["status"] }) {
  const map: Record<TFLRow["status"], { icon: string; label: string }> = {
    "ai-processing": { icon: aiProcessingIconUrl, label: "AI Processing" },
    "in-progress":   { icon: wipStatusIconUrl,    label: "In Progress"   },
    "completed":     { icon: lockedStatusIconUrl, label: "Locked" },
    "locked":        { icon: lockedStatusIconUrl, label: "Locked" },
    "to-do":         { icon: untouchedStatusIconUrl, label: "To do"      },
    "error":         { icon: errorStatusIconUrl,  label: "Error"         },
  };
  const c = map[status];
  return (
    <div className="flex items-center gap-[4px]">
      {status === "completed" || status === "locked" ? (
        <span aria-hidden="true" className="size-4 shrink-0 bg-text-secondary" style={{ mask: `url("${c.icon}") center / contain no-repeat` }} />
      ) : (
        <img src={c.icon} alt="" className="w-[16px] h-[16px] shrink-0" />
      )}
      <span className="text-[12px] text-text-primary whitespace-nowrap">{c.label}</span>
    </div>
  );
}

// ─── Programmer Inline Dropdown ───────────────────────────────────────────────

function ProgrammerCell({
  disabled = false,
  disabledMessage = LOCKED_ASSIGNMENT_MESSAGE,
  value,
  teamMembers,
  allUsers,
  onSelect,
}: {
  disabled?: boolean;
  disabledMessage?: string;
  value: string | null;
  teamMembers: TeamMember[];
  allUsers: typeof MOCK_USER_POOL;
  onSelect: (name: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 240;
    let left = rect.right - popoverWidth;
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = window.innerWidth - popoverWidth - 8;
    }

    const popoverHeight = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < popoverHeight && rect.top > popoverHeight;
    const top = openUpwards ? Math.max(8, rect.top - popoverHeight - 4) : rect.bottom + 4;

    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    updatePosition();

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, updatePosition]);

  const teamNames = new Set(teamMembers.map((m) => m.name));
  const trimmedSearch = search.trim().toLowerCase();
  const matchesNoAssignee = !trimmedSearch || "no assignee".includes(trimmedSearch);
  const filteredTeam = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(trimmedSearch)
  );
  const filteredNew = allUsers.filter(
    (u) => !teamNames.has(u.name) && u.name.toLowerCase().includes(trimmedSearch)
  );

  const currentMeta =
    teamMembers.find((m) => m.name === value) ??
    MOCK_USER_POOL.find((u) => u.name === value);

  if (disabled) {
    return (
      <Tooltip label={disabledMessage}>
        <div tabIndex={0} role="button" aria-disabled="true" aria-label={`${value ?? "No Assignee"}. ${disabledMessage}`} className="flex items-center gap-[6px] rounded-[4px] px-[6px] py-[4px] w-full min-w-0 cursor-not-allowed text-graphite-40">
          <Avatar name={value ?? undefined} initials={currentMeta?.initials} color={currentMeta?.color} level="modal" disabled />
          <span className="text-[12px] truncate text-graphite-40">{value ?? "No Assignee"}</span>
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[6px] rounded-[4px] px-[6px] py-[4px] hover:bg-black/5 transition-colors w-full text-left min-w-0 cursor-pointer"
      >
        {value && currentMeta ? (
          <>
            <Avatar name={currentMeta.name} initials={(currentMeta as any).initials} color={(currentMeta as any).color} level="modal" />
            <span className="text-[12px] text-text-primary truncate">{currentMeta.name}</span>
          </>
        ) : (
          <>
            <Avatar level="modal" />
            <span className="text-[12px] text-text-secondary">No Assignee</span>
          </>
        )}
      </button>

      {open && pos && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: 240,
            zIndex: 9999,
          }}
          className="bg-white rounded-[8px] border border-graphite-10 shadow-elevation-overlay p-[4px] flex flex-col gap-[6px] animate-fade-in select-none text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search — matching OwnerDropdown style */}
          <div className="bg-white rounded-[4px] relative shrink-0 w-full border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all">
            <div className="p-[2px] flex items-center size-full">
              <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[4px]">
                <img src={searchLineIconUrl} alt="" className="w-[13px] h-[13px] opacity-40 shrink-0" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search people..."
                  className="min-w-[60px] flex-1 bg-transparent outline-none text-[12px] text-text-primary placeholder:text-text-secondary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[1px] max-h-[210px] overflow-y-auto w-full">
            {/* No Assignee — only shown when search matches 'no assignee' or is empty */}
            {matchesNoAssignee && (
              <button
                type="button"
                onClick={() => { onSelect(null); setOpen(false); }}
                className={`flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left transition-colors cursor-pointer ${
                  value === null ? "bg-az-secondary/60 text-brand-1 font-medium" : "hover:bg-bg-panel text-text-primary"
                }`}
              >
                <Avatar level="menu" />
                <span className="text-[12px] flex-1 text-text-secondary">No Assignee</span>
                {value === null && (
                  <img src={checkIconUrl} alt="" className="w-[14px] h-[14px] shrink-0 opacity-90" />
                )}
              </button>
            )}

            {/* Team Members */}
            {filteredTeam.length > 0 && (
              <>
                <DropdownGroupLabel>In Team</DropdownGroupLabel>
                {filteredTeam.map((m) => {
                  const isSelected = value === m.name;
                  const isCurrentUser = m.name === CURRENT_USER;
                  // Owner annotation priority is higher than You
                  const sideLabel = m.isOwner ? "Owner" : isCurrentUser ? "You" : null;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => { onSelect(m.name); setOpen(false); }}
                      className={`flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left transition-colors cursor-pointer ${
                        isSelected ? "bg-az-secondary/60 text-brand-1 font-medium" : "hover:bg-bg-panel text-text-primary"
                      }`}
                    >
                      <Avatar name={m.name} initials={m.initials} color={m.color} level="menu" />
                      <div className="flex items-center gap-[6px] min-w-0 flex-1">
                        <span className="text-[12px] truncate">{m.name}</span>
                        {sideLabel && (
                          <span className={`text-[10px] font-medium px-[5px] py-[0.5px] rounded-[3px] shrink-0 ${
                            m.isOwner ? "text-brand-1 bg-az-secondary" : "text-text-secondary bg-graphite-10"
                          }`}>
                            {sideLabel}
                          </span>
                        )}
                      </div>
                      {/* Checkmark to the left of the count */}
                      {isSelected && (
                        <img src={checkIconUrl} alt="" className="w-[14px] h-[14px] shrink-0 opacity-90" />
                      )}
                      {/* Only show number without 'TFL' text */}
                      <span className="text-[11px] text-text-secondary tabular-nums shrink-0 min-w-[14px] text-right">
                        {m.assignedTFLs}
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* Out of Team section - people not in team */}
            {filteredNew.length > 0 && (
              <>
                <DropdownGroupLabel>Out of Team (Invite and Add)</DropdownGroupLabel>
                {filteredNew.map((u) => {
                  const isCurrentUser = u.name === CURRENT_USER;
                  return (
                    <button
                      key={u.name}
                      type="button"
                      onClick={() => { onSelect(u.name); setOpen(false); }}
                      className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left hover:bg-bg-panel transition-colors cursor-pointer"
                    >
                      <Avatar name={u.name} initials={u.initials} color={u.color} level="menu" />
                      <div className="flex items-center gap-[6px] min-w-0 flex-1">
                        <span className="text-[12px] truncate text-text-primary">{u.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-text-secondary bg-graphite-10 px-[5px] py-[0.5px] rounded-[3px] shrink-0">
                            You
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {!matchesNoAssignee && filteredTeam.length === 0 && filteredNew.length === 0 && (
              <DropdownEmpty />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Batch Assign Inline Dropdown ─────────────────────────────────────────────

function BatchAssignDropdown({
  teamMembers,
  allUsers,
  onSelect,
  disabled,
}: {
  teamMembers: TeamMember[];
  allUsers: typeof MOCK_USER_POOL;
  onSelect: (name: string | null) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 240;
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = window.innerWidth - popoverWidth - 8;
    }
    if (left < 8) left = 8;

    const popoverHeight = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < popoverHeight && rect.top > popoverHeight;
    const top = openUpwards ? Math.max(8, rect.top - popoverHeight - 4) : rect.bottom + 4;

    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    updatePosition();

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, updatePosition]);

  const teamNames = new Set(teamMembers.map((m) => m.name));
  const filteredTeam = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredNew = allUsers.filter(
    (u) => !teamNames.has(u.name) && u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative h-full flex items-center">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[6px] px-[12px] h-full text-[12px] text-text-primary hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-50 select-none whitespace-nowrap"
      >
        <img src={teamLineIconUrl} alt="" className="w-[14px] h-[14px] opacity-70" />
        <span>Assign to</span>
        <img
          src={arrowDownIconUrl}
          alt=""
          className="w-[12px] h-[12px] opacity-45"
        />
      </button>

      {open && pos && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: 240,
            zIndex: 9999,
          }}
          className="bg-white rounded-[8px] border border-graphite-10 shadow-elevation-overlay p-[4px] flex flex-col gap-[6px] animate-fade-in select-none text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <div className="bg-white rounded-[4px] relative shrink-0 w-full border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all">
            <div className="p-[2px] flex items-center size-full">
              <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[4px]">
                <img src={searchLineIconUrl} alt="" className="w-[13px] h-[13px] opacity-40 shrink-0" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search people..."
                  className="min-w-[60px] flex-1 bg-transparent outline-none text-[12px] text-text-primary placeholder:text-text-secondary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[1px] max-h-[210px] overflow-y-auto w-full">
            {/* Team Members */}
            {filteredTeam.length > 0 && (
              <>
                <DropdownGroupLabel>In Team</DropdownGroupLabel>
                {filteredTeam.map((m) => {
                  const isCurrentUser = m.name === CURRENT_USER;
                  const sideLabel = m.isOwner ? "Owner" : isCurrentUser ? "You" : null;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => { onSelect(m.name); setOpen(false); }}
                      className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left transition-colors cursor-pointer hover:bg-bg-panel text-text-primary"
                    >
                      <Avatar name={m.name} initials={m.initials} color={m.color} level="menu" />
                      <div className="flex items-center gap-[6px] min-w-0 flex-1">
                        <span className="text-[12px] truncate">{m.name}</span>
                        {sideLabel && (
                          <span className={`text-[10px] font-medium px-[5px] py-[0.5px] rounded-[3px] shrink-0 ${
                            m.isOwner ? "text-brand-1 bg-az-secondary" : "text-text-secondary bg-graphite-10"
                          }`}>
                            {sideLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-text-secondary tabular-nums shrink-0 min-w-[14px] text-right">
                        {m.assignedTFLs}
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* Out of Team section */}
            {filteredNew.length > 0 && (
              <>
                <DropdownGroupLabel>Out of Team (Invite and Add)</DropdownGroupLabel>
                {filteredNew.map((u) => {
                  const isCurrentUser = u.name === CURRENT_USER;
                  return (
                    <button
                      key={u.name}
                      type="button"
                      onClick={() => { onSelect(u.name); setOpen(false); }}
                      className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left hover:bg-bg-panel transition-colors cursor-pointer"
                    >
                      <Avatar name={u.name} initials={u.initials} color={u.color} level="menu" />
                      <div className="flex items-center gap-[6px] min-w-0 flex-1">
                        <span className="text-[12px] truncate text-text-primary">{u.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-text-secondary bg-graphite-10 px-[5px] py-[0.5px] rounded-[3px] shrink-0">
                            You
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {filteredTeam.length === 0 && filteredNew.length === 0 && (
              <DropdownEmpty />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Tab 1: Assignment ────────────────────────────────────────────────────────

export function AssignmentTab({
  tflRows,
  teamMembers,
  onUpdateProgrammer,
  onBatchUpdateProgrammer,
  canManageAssignments = true,
}: {
  tflRows: TFLRow[];
  teamMembers: TeamMember[];
  onUpdateProgrammer: (id: string, programmer: string | null) => void;
  onBatchUpdateProgrammer?: (ids: string[], programmer: string | null) => void;
  canManageAssignments?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unassigned">("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dynamically extract unique section prefixes from TFL titles (e.g., '14.1', '14.2', '14.3', '16.2')
  const sectionOptions: FilterChipOption[] = useMemo(() => {
    const sectionSet = new Set<string>();
    tflRows.forEach((r) => {
      const match = r.title.match(/^(\d+\.\d+)/);
      if (match) sectionSet.add(match[1]);
    });
    const sorted = Array.from(sectionSet).sort();
    return [
      { label: "All Sections", value: "all" },
      ...sorted.map((sec) => ({
        label: `Section ${sec}`,
        value: sec,
      })),
    ];
  }, [tflRows]);

  const totalCount = tflRows.length;
  const unassignedCount = useMemo(() => tflRows.filter((r) => r.programmer === null).length, [tflRows]);

  const filteredRows = useMemo(() => {
    let rows = tflRows;
    if (filterTab === "unassigned") {
      rows = rows.filter((r) => r.programmer === null);
    }
    if (selectedSection !== "all") {
      rows = rows.filter((r) => r.title.startsWith(selectedSection));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.title.toLowerCase().includes(q) || (r.program && r.program.toLowerCase().includes(q)));
    }
    return rows;
  }, [tflRows, filterTab, selectedSection, search]);

  const selectableRows = canManageAssignments ? filteredRows.filter((row) => !isTflLocked(row)) : [];
  const allFilteredSelected = selectableRows.length > 0 && selectableRows.every((r) => selectedIds.has(r.id));
  const someFilteredSelected = selectableRows.some((r) => selectedIds.has(r.id));

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        selectableRows.forEach((r) => next.add(r.id));
      } else {
        filteredRows.forEach((r) => next.delete(r.id));
      }
      return next;
    });
  };

  const handleToggleRow = (id: string, checked: boolean) => {
    if (tflRows.some((row) => row.id === id && isTflLocked(row))) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBatchAssign = (programmer: string | null) => {
    const ids = tflRows.filter((row) => selectedIds.has(row.id) && !isTflLocked(row)).map((row) => row.id);
    if (ids.length === 0) return;
    if (onBatchUpdateProgrammer) {
      onBatchUpdateProgrammer(ids, programmer);
    } else {
      ids.forEach((id) => onUpdateProgrammer(id, programmer));
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 p-[16px] gap-[10px] relative">
      {/* Top Toolbar: Search on left, Filter tabs on right */}
      <div className="flex items-center justify-between w-full h-8 shrink-0">
        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search TFLs..."
          size="compact"
          icon={<span aria-hidden="true" className="size-4 shrink-0 bg-text-secondary" style={{ mask: `url("${searchLineIconUrl}") center / contain no-repeat` }} />}
          background="light"
          className="w-[240px]"
        />

        {/* Right controls: Section FilterChip + All / Unassigned Tabs */}
        <div className="flex items-center gap-[8px]">
          {/* Section FilterChip */}
          <FilterChip
            type="Dropdown"
            variant="filter"
            active={selectedSection !== "all"}
            label={selectedSection === "all" ? "Section" : `Section ${selectedSection}`}
            options={sectionOptions}
            value={selectedSection}
            onChange={(val) => setSelectedSection(val)}
            showIcon={false}
            style={{ height: "calc(var(--spacing) * 8)" }}
          />

          {/* Filter Tabs */}
          <div className="flex h-8 items-stretch gap-[2px] bg-bg-panel p-[2px] rounded-[6px] border border-graphite-10">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-[10px] py-0 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer ${
                filterTab === "all"
                  ? "bg-white text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All <span className="text-[11px] opacity-75 font-normal">({totalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("unassigned")}
              className={`px-[10px] py-0 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer ${
                filterTab === "unassigned"
                  ? "bg-white text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Unassigned <span className="text-[11px] opacity-75 font-normal">({unassignedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-graphite-10 flex flex-col items-start rounded-[4px] w-full flex-1 min-h-0 overflow-hidden bg-white">
        <div className="flex-1 overflow-auto w-full">
          <table className="w-full border-collapse text-left table-fixed">
            <thead>
              <tr className="border-b border-graphite-10 bg-bg-panel h-[40px] select-none sticky top-0 z-10">
                <th className="pl-[16px] pr-[16px] py-[10px]">
                  <div className="flex items-center gap-[6px]">
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      <Checkbox
                        disabled={selectableRows.length === 0}
                        checked={allFilteredSelected}
                        indeterminate={someFilteredSelected && !allFilteredSelected}
                        onChange={handleToggleSelectAll}
                        size={16}
                      />
                    </div>
                    <span className="t-small-medium text-text-secondary whitespace-nowrap">TFL Title</span>
                  </div>
                </th>
                <th className="px-[16px] py-[10px] w-[150px]">
                  <span className="t-small-medium text-text-secondary whitespace-nowrap">Program</span>
                </th>
                <th className="px-[16px] py-[10px] w-[130px]">
                  <span className="t-small-medium text-text-secondary whitespace-nowrap">Status</span>
                </th>
                <th className="px-[16px] py-[10px] w-[180px]">
                  <span className="t-small-medium text-text-secondary whitespace-nowrap">Programmer</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-10">
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-[16px] py-[48px] text-center">
                    <p className="t-small text-text-secondary">
                      {search
                        ? `No TFLs matching "${search}"`
                        : selectedSection !== "all"
                        ? `No TFLs found in Section ${selectedSection}.`
                        : "No unassigned TFLs."}
                    </p>
                    {(search || filterTab !== "all" || selectedSection !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setFilterTab("all");
                          setSelectedSection("all");
                        }}
                        className="mt-[8px] text-[12px] text-brand-1 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`group/row transition-colors ${
                      isSelected ? "bg-az-secondary/30 hover:bg-az-secondary/40" : "hover:bg-bg-panel/60"
                    }`}
                  >
                    <td className="pl-[16px] pr-[16px] py-[10px] min-w-0">
                      <div className="flex items-center gap-[6px] min-w-0">
                        {/* Hover on Icon transforms into Checkbox; when selected, stays Checkbox */}
                        <div
                          className={`w-[16px] h-[16px] flex items-center justify-center shrink-0 ${isTflLocked(row) || !canManageAssignments ? "cursor-default" : "cursor-pointer"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!canManageAssignments) return;
                            handleToggleRow(row.id, !isSelected);
                          }}
                        >
                          {isTflLocked(row) || !canManageAssignments ? <TflTypeIcon type={row.type} /> : isSelected ? (
                            <Checkbox
                              checked={true}
                              onChange={(val) => handleToggleRow(row.id, val)}
                              size={16}
                            />
                          ) : (
                            <>
                              <div className="group-hover/row:hidden flex items-center justify-center">
                                <TflTypeIcon type={row.type} />
                              </div>
                              <div className="hidden group-hover/row:flex items-center justify-center">
                                <Checkbox
                                  checked={false}
                                  onChange={(val) => handleToggleRow(row.id, val)}
                                  size={16}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <span
                          className="t-small text-text-primary truncate flex-1 min-w-0 select-none"
                          title={row.title}
                        >
                          {row.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-[16px] py-[10px] min-w-0">
                      <span
                        className="t-code text-text-secondary truncate block select-none"
                        title={row.program}
                      >
                        {row.program || "—"}
                      </span>
                    </td>
                    <td className="px-[16px] py-[10px] whitespace-nowrap">
                      <StatusTag status={row.status} />
                    </td>
                    <td className="px-[10px] py-[6px]">
                      <ProgrammerCell
                        disabled={isTflLocked(row) || !canManageAssignments}
                        disabledMessage={isTflLocked(row) ? LOCKED_ASSIGNMENT_MESSAGE : "Only the Event Owner can assign TFLs."}
                        value={row.programmer}
                        teamMembers={teamMembers}
                        allUsers={MOCK_USER_POOL}
                        onSelect={(name) => onUpdateProgrammer(row.id, name)}
                      />
                    </td>
                  </tr>
                );
              })}
              {/* Spacer row to prevent floating bar from obscuring last item when scrolled to bottom */}
              {selectedIds.size > 0 && (
                <tr className="h-[48px] border-none">
                  <td colSpan={4} className="p-0 border-none pointer-events-none" />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Batch Action Bar with Elevation 1 matching reference design */}
      {selectedIds.size > 0 && (
        <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 z-30 flex items-center h-[36px] bg-white rounded-[6px] border border-graphite-10 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.06)] divide-x divide-graphite-10 overflow-hidden animate-fade-in select-none">
          {/* 1. Selected Count (brand-color1) */}
          <div className="px-[12px] h-full flex items-center text-[12px] font-medium text-brand-1 whitespace-nowrap">
            {selectedIds.size} selected
          </div>

          {/* 2. Assign to Dropdown (no fill button) */}
          <BatchAssignDropdown
            teamMembers={teamMembers}
            allUsers={MOCK_USER_POOL}
            onSelect={(name) => handleBatchAssign(name)}
          />

          {/* 3. Clear Assignee (no fill button) */}
          <button
            type="button"
            onClick={() => handleBatchAssign(null)}
            className="flex items-center gap-[6px] px-[12px] h-full text-[12px] text-text-primary hover:bg-black/5 transition-colors cursor-pointer whitespace-nowrap"
            title="Clear Assignee for selected TFLs"
          >
            <img src={deleteBinIconUrl} alt="" className="w-[14px] h-[14px] opacity-60" />
            <span>Clear Assignee</span>
          </button>

          {/* 4. Deselect (no fill close button) */}
          <button
            type="button"
            onClick={handleDeselectAll}
            className="flex items-center justify-center w-[36px] h-full text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors cursor-pointer"
            title="Deselect all"
            aria-label="Deselect all"
          >
            <CloseIcon size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Remove Confirm Dialog ────────────────────────────────────────────────────

function RemoveConfirmDialog({
  member,
  onCancel,
  onConfirm,
}: {
  member: TeamMember;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-[16px] animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-member-dialog-title"
        className="relative flex w-[440px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-graphite-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-[20px] pt-[18px] pb-[14px]">
          <div className="flex items-center gap-[10px] min-w-0 pr-[8px]">
            <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] bg-status-error-bg">
              <WarningIcon size={18} />
            </div>
            <h2
              id="remove-member-dialog-title"
              className="text-[16px] font-semibold text-text-primary leading-[22px] truncate"
              title={`Are you sure to remove ${member.name}?`}
            >
              Are you sure to remove {member.name}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] transition-colors"
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="h-[14px] w-[14px] opacity-70" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-[12px] px-[20px] py-[14px]">
          {/* Member Context Pill */}
          <div className="flex items-center justify-between rounded-[4px] bg-bg-panel border border-graphite-10 px-[12px] py-[10px]">
            <div className="flex items-center gap-[8px] min-w-0">
              <Avatar
                name={member.name}
                initials={member.initials}
                color={member.color}
                level="modal"
              />
              <span className="text-[13px] font-medium text-text-primary truncate">
                {member.name}
              </span>
            </div>
            <span className="text-[12px] text-text-secondary">
              {member.assignedTFLs > 0 ? (
                <span className="text-[#CC2C3C] font-medium">
                  {member.assignedTFLs} TFL{member.assignedTFLs > 1 ? "s" : ""} assigned
                </span>
              ) : (
                "0 TFLs assigned"
              )}
            </span>
          </div>

          {member.assignedTFLs > 0 && (
            <p className="text-[12px] leading-[18px] text-text-secondary">
              All assigned TFLs will be reset to unassigned and will need reassignment.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[10px] px-[20px] py-[14px] border-t border-graphite-10 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-[14px] py-[7px] rounded-[4px] text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-[14px] py-[7px] rounded-[4px] text-[13px] font-medium text-white bg-status-error hover:bg-[#B3202F] active:bg-[#991523] transition-colors shadow-sm"
          >
            Remove Member
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Team Members ──────────────────────────────────────────────────────

function TeamMembersTab({
  teamMembers,
  onRemove,
  onChangeOwner,
  onAddMember,
  currentUserName,
  canAddMember,
  canRemoveMember,
  canChangeOwner,
}: {
  teamMembers: TeamMember[];
  onRemove: (name: string) => void;
  onChangeOwner: (newOwner: string) => void;
  onAddMember: (user: typeof MOCK_USER_POOL[0]) => void;
  currentUserName: string;
  canAddMember: boolean;
  canRemoveMember: boolean;
  canChangeOwner: boolean;
}) {
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);
  const showActions = canChangeOwner || canRemoveMember;

  // Add Member Popover state
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const addPopoverRef = useRef<HTMLDivElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Change Owner Popover state (keyed by member name or boolean)
  const [ownerPopoverOpen, setOwnerPopoverOpen] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");
  const ownerPopoverRef = useRef<HTMLDivElement>(null);
  const ownerButtonRef = useRef<HTMLButtonElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);
  const [ownerPos, setOwnerPos] = useState<{ top: number; left: number } | null>(null);

  const updateOwnerPosition = useCallback(() => {
    if (!ownerButtonRef.current) return;
    const rect = ownerButtonRef.current.getBoundingClientRect();
    const popoverWidth = 240;
    let left = rect.right - popoverWidth;
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = window.innerWidth - popoverWidth - 8;
    }

    const popoverHeight = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < popoverHeight && rect.top > popoverHeight;
    const top = openUpwards ? Math.max(8, rect.top - popoverHeight - 4) : rect.bottom + 4;

    setOwnerPos({ top, left });
  }, []);

  // Close Add Member Popover on click outside
  useEffect(() => {
    if (!addPopoverOpen) {
      setAddSearch("");
      return;
    }
    const handler = (e: MouseEvent) => {
      if (addPopoverRef.current && !addPopoverRef.current.contains(e.target as Node)) {
        setAddPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    setTimeout(() => addInputRef.current?.focus(), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [addPopoverOpen]);

  // Close Change Owner Popover on click outside
  useEffect(() => {
    if (!ownerPopoverOpen) {
      setOwnerSearch("");
      return;
    }
    updateOwnerPosition();

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ownerButtonRef.current && !ownerButtonRef.current.contains(target) &&
        ownerPopoverRef.current && !ownerPopoverRef.current.contains(target)
      ) {
        setOwnerPopoverOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOwnerPopoverOpen(false);
    };

    const handleScrollOrResize = () => updateOwnerPosition();

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    setTimeout(() => ownerInputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [ownerPopoverOpen, updateOwnerPosition]);

  const teamNames = new Set(teamMembers.map((m) => m.name));

  // Add Member candidates (users not in team)
  const addCandidates = MOCK_USER_POOL.filter(
    (u) => !teamNames.has(u.name) && u.name.toLowerCase().includes(addSearch.toLowerCase())
  );
  const addAlreadyIn = MOCK_USER_POOL.filter(
    (u) => teamNames.has(u.name) && u.name.toLowerCase().includes(addSearch.toLowerCase())
  );

  // Change Owner candidates (exclude current owner)
  const nonOwners = teamMembers.filter(
    (m) => !m.isOwner && m.name.toLowerCase().includes(ownerSearch.toLowerCase())
  );
  const outsideUsers = MOCK_USER_POOL.filter(
    (u) => !teamNames.has(u.name) && u.name.toLowerCase().includes(ownerSearch.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 p-[16px] gap-[10px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between w-full h-8 shrink-0 bg-white">
          <div className="flex items-center gap-[12px]">
            <AvatarGroup members={teamMembers} />
            <span className="text-[12px] text-text-secondary">
              <span className="font-medium text-text-primary">{teamMembers.length}</span> member{teamMembers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Add Member Button with Standard Popover */}
          <div ref={addPopoverRef} className="relative">
            <Tooltip label={canAddMember ? undefined : "Only Event Team Members can add members."}>
            <button
              type="button"
              disabled={!canAddMember}
              onClick={() => canAddMember && setAddPopoverOpen((v) => !v)}
              className={`flex h-8 items-center gap-[5px] px-[10px] rounded-[4px] text-[12px] font-medium transition-colors ${
                !canAddMember
                  ? "bg-graphite-10 text-graphite-40 cursor-not-allowed"
                  : addPopoverOpen
                  ? "bg-az-secondary text-brand-1"
                  : "bg-brand-1 text-white hover:bg-brand-1/90"
              }`}
            >
              <img
                src={addLineIconUrl}
                alt=""
                className="w-[13px] h-[13px] shrink-0"
                style={{
                  filter: !canAddMember
                    ? "grayscale(1) opacity(0.45)"
                    : addPopoverOpen
                    ? "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)"
                    : "brightness(0) invert(1)",
                }}
              />
              Add Member
            </button>
            </Tooltip>

            {/* Standard Popover Panel matching OwnerDropdown */}
            {addPopoverOpen && (
              <div className="absolute right-0 top-full mt-1 z-[200] bg-white rounded-[8px] border border-graphite-10 shadow-elevation-overlay w-[240px] p-[4px] flex flex-col gap-[6px] animate-fade-in">
                {/* Search box matching standard styling */}
                <div className="bg-white rounded-[4px] relative shrink-0 w-full border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all">
                  <div className="p-[2px] flex items-center size-full">
                    <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[4px]">
                      <img src={searchLineIconUrl} alt="" className="w-[13px] h-[13px] opacity-40 shrink-0" />
                      <input
                        ref={addInputRef}
                        value={addSearch}
                        onChange={(e) => setAddSearch(e.target.value)}
                        placeholder="Search people..."
                        className="min-w-[60px] flex-1 bg-transparent outline-none text-[12px] text-text-primary placeholder:text-text-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Candidate list */}
                <div className="flex flex-col gap-[1px] max-h-[220px] overflow-y-auto w-full">
                  {addCandidates.length > 0 && (
                    <>
                      <DropdownGroupLabel>Out of Team (Invite and Add)</DropdownGroupLabel>
                      {addCandidates.map((u) => {
                        const isCurrentUser = u.name === currentUserName;
                        return (
                          <button
                            key={u.name}
                            type="button"
                            onClick={() => {
                              onAddMember(u);
                              setAddPopoverOpen(false);
                            }}
                            className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left hover:bg-bg-panel transition-colors cursor-pointer"
                          >
                            <Avatar name={u.name} initials={u.initials} color={u.color} level="menu" />
                            <div className="flex items-center gap-[6px] min-w-0 flex-1">
                              <span className="text-[12px] truncate text-text-primary">{u.name}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] text-text-secondary bg-graphite-10 px-[5px] py-[0.5px] rounded-[3px] shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {addAlreadyIn.length > 0 && (
                    <>
                      <div className="px-[8px] pt-[8px] pb-[2px]">
                        <span className="text-[11px] font-medium text-text-secondary">
                          In Team
                        </span>
                      </div>
                      {addAlreadyIn.map((u) => {
                        const member = teamMembers.find((m) => m.name === u.name);
                        const isOwner = member?.isOwner;
                        const isCurrentUser = u.name === currentUserName;
                        const sideLabel = isOwner ? "Owner" : isCurrentUser ? "You" : null;
                        return (
                          <div
                            key={u.name}
                            aria-disabled="true"
                            className="dropdown-item flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] cursor-not-allowed"
                          >
                            <Avatar name={u.name} initials={u.initials} color={u.color} level="menu" />
                            <div className="flex items-center gap-[6px] min-w-0 flex-1">
                              <span className="text-[12px] truncate text-text-primary">{u.name}</span>
                              {sideLabel && (
                                <span
                                  className={`text-[10px] px-[5px] py-[0.5px] rounded-[3px] shrink-0 ${
                                    isOwner
                                      ? "text-brand-1 bg-az-secondary"
                                      : "text-text-secondary bg-graphite-10"
                                  }`}
                                >
                                  {sideLabel}
                                </span>
                              )}
                            </div>
                            <span aria-hidden="true" className="size-[13px] shrink-0 bg-graphite-40" style={{ mask: `url("${checkIconUrl}") center / contain no-repeat` }} />
                          </div>
                        );
                      })}
                    </>
                  )}

                  {addCandidates.length === 0 && addAlreadyIn.length === 0 && (
                    <DropdownEmpty />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="border border-graphite-10 flex flex-col items-start rounded-[4px] w-full flex-1 min-h-0 overflow-hidden bg-white">
            <div className="flex-1 overflow-auto w-full">
              <table className={`w-full ${showActions ? "min-w-[720px]" : "min-w-[580px]"} table-fixed border-collapse text-left`}>
                <colgroup>
                  <col className="w-[26%]" />
                  <col />
                  <col className="w-[140px]" />
                  {showActions && <col className="w-[144px]" />}
                </colgroup>
                <thead>
                  <tr className="border-b border-graphite-10 bg-bg-panel h-[40px] select-none sticky top-0 z-10">
                    <th className="px-[16px] py-[10px]">
                      <span className="t-small-medium text-text-secondary whitespace-nowrap">Member</span>
                    </th>
                    <th className="px-[16px] py-[10px]">
                      <span className="t-small-medium text-text-secondary whitespace-nowrap">Email</span>
                    </th>
                    <th className="px-[16px] py-[10px]">
                      <span className="t-small-medium text-text-secondary whitespace-nowrap">Added by</span>
                    </th>
                    {showActions && (
                      <th className="px-[16px] py-[10px] text-right">
                        <span className="t-small-medium text-text-secondary whitespace-nowrap">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-10">
                  {teamMembers.length === 0 && (
                    <tr>
                      <td colSpan={showActions ? 4 : 3} className="px-[16px] py-[40px] text-center t-small text-text-secondary">
                        No team members yet. Click "Add Member" to get started.
                      </td>
                    </tr>
                  )}
                  {teamMembers.map((m) => {
                    const poolUser = MOCK_USER_POOL.find((u) => u.name === m.name);
                    const initials = poolUser?.initials ?? m.name.slice(0, 2).toUpperCase();
                    const color = poolUser?.color ?? "#8c8f8f";
                    const isCurrentUser = m.name === currentUserName;
                    const sideLabel = m.isOwner ? "Owner" : isCurrentUser ? "You" : null;

                    return (
                      <tr key={m.name} className="hover:bg-bg-panel/50 transition-colors">
                        <td className="px-[16px] py-[10px]">
                          <div className="flex min-w-0 items-center gap-[8px]">
                            <Avatar name={m.name} initials={initials} color={color} level="modal" />
                            <span className="t-small text-text-primary min-w-0 truncate" title={m.name}>{m.name}</span>
                            {sideLabel && (
                              <span
                                className={`text-[10px] font-medium px-[6px] py-[1px] rounded-[3px] shrink-0 ${
                                  m.isOwner ? "text-brand-1 bg-az-secondary" : "text-text-secondary bg-graphite-10"
                                }`}
                              >
                                {sideLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-[16px] py-[10px]">
                          <span className="t-small text-text-primary block truncate" title={m.email}>{m.email}</span>
                        </td>
                        <td className="px-[16px] py-[10px]">
                          <span className="t-small text-text-secondary block truncate" title={m.addedBy}>{m.addedBy ?? "—"}</span>
                        </td>
                        {showActions && <td className="px-[16px] py-[10px] text-right">
                          <div className="flex items-center justify-end gap-[6px]">
                            {m.isOwner ? (
                              <div className="relative">
                                <button
                                  ref={ownerButtonRef}
                                  type="button"
                                  disabled={!canChangeOwner}
                                  onClick={() => canChangeOwner && setOwnerPopoverOpen((v) => !v)}
                                  title={canChangeOwner ? "Change Event Owner" : "Only the Study Owner or Event Owner can change the owner."}
                                  className="t-small text-text-secondary hover:text-text-primary transition-colors px-[8px] py-[4px] rounded-[4px] hover:bg-black/5 cursor-pointer disabled:text-graphite-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                >
                                  Change Owner
                                </button>

                                {/* In-place Change Owner Popover */}
                                {ownerPopoverOpen && ownerPos && createPortal(
                                  <div
                                    ref={ownerPopoverRef}
                                    style={{
                                      position: "fixed",
                                      top: ownerPos.top,
                                      left: ownerPos.left,
                                      width: 240,
                                      zIndex: 9999,
                                    }}
                                    className="bg-white rounded-[8px] border border-graphite-10 shadow-elevation-overlay p-[4px] flex flex-col gap-[6px] text-left animate-fade-in select-none"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="bg-white rounded-[4px] relative shrink-0 w-full border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all">
                                      <div className="p-[2px] flex items-center size-full">
                                        <div className="bg-white flex-1 min-w-0 flex items-center px-[6px] py-[4px] gap-[4px]">
                                          <img
                                            src={searchLineIconUrl}
                                            alt=""
                                            className="w-[13px] h-[13px] opacity-40 shrink-0"
                                          />
                                          <input
                                            ref={ownerInputRef}
                                            value={ownerSearch}
                                            onChange={(e) => setOwnerSearch(e.target.value)}
                                            placeholder="Search new owner..."
                                            className="min-w-[60px] flex-1 bg-transparent outline-none text-[12px] text-text-primary placeholder:text-text-secondary"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-[1px] max-h-[220px] overflow-y-auto w-full">
                                      {nonOwners.length > 0 && (
                                        <>
                                          <DropdownGroupLabel>In Team</DropdownGroupLabel>
                                          {nonOwners.map((cand) => {
                                            const candIsUser = cand.name === currentUserName;
                                            return (
                                              <button
                                                key={cand.name}
                                                type="button"
                                                onClick={() => {
                                                  onChangeOwner(cand.name);
                                                  setOwnerPopoverOpen(false);
                                                }}
                                                className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left hover:bg-bg-panel transition-colors cursor-pointer"
                                              >
                                                <Avatar
                                                  name={cand.name}
                                                  initials={cand.initials}
                                                  color={cand.color}
                                                  level="menu"
                                                />
                                                <span className="text-[12px] text-text-primary flex-1 truncate">
                                                  {cand.name}
                                                </span>
                                                {candIsUser && (
                                                  <span className="text-[10px] text-text-secondary bg-graphite-10 px-[5px] py-[0.5px] rounded-[3px] shrink-0">
                                                    You
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </>
                                      )}

                                      {outsideUsers.length > 0 && (
                                        <>
                                          <div className="px-[8px] pt-[8px] pb-[2px]">
                                            <span className="text-[11px] font-medium text-text-secondary">
                                              Out of Team (Invite and Add)
                                            </span>
                                          </div>
                                          {outsideUsers.map((u) => {
                                            const isUser = u.name === currentUserName;
                                            return (
                                              <button
                                                key={u.name}
                                                type="button"
                                                onClick={() => {
                                                  onChangeOwner(u.name);
                                                  setOwnerPopoverOpen(false);
                                                }}
                                                className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left hover:bg-bg-panel transition-colors cursor-pointer"
                                              >
                                                <Avatar
                                                  name={u.name}
                                                  initials={u.initials}
                                                  color={u.color}
                                                  level="menu"
                                                />
                                                <span className="text-[12px] text-text-primary flex-1 truncate">
                                                  {u.name}
                                                </span>
                                                {isUser && (
                                                  <span className="text-[10px] text-text-secondary bg-graphite-10 px-[5px] py-[0.5px] rounded-[3px] shrink-0">
                                                    You
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </>
                                      )}

                                      {nonOwners.length === 0 && outsideUsers.length === 0 && (
                                        <p className="text-[12px] text-text-secondary px-[8px] py-[6px]">
                                          No results
                                        </p>
                                      )}
                                    </div>
                                  </div>,
                                  document.body
                                )}
                              </div>
                            ) : canRemoveMember ? (
                              <button
                                type="button"
                                onClick={() => setRemovingMember(m)}
                                title="Remove member"
                                className="t-small text-status-error hover:opacity-80 transition-colors px-[8px] py-[4px] rounded-[4px] hover:bg-status-error/5 cursor-pointer"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {removingMember && (
        <RemoveConfirmDialog
          member={removingMember}
          onCancel={() => setRemovingMember(null)}
          onConfirm={() => {
            onRemove(removingMember.name);
            setRemovingMember(null);
          }}
        />
      )}
    </>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_TFL_ROWS: TFLRow[] = [
  {
    id: "t1",
    type: "table",
    title: "14.1.1 Demographic and Baseline Disease Characteristics (Safety analysis set)",
    program: "t_dm_14_1_1",
    status: "completed",
    programmer: "Sarah Chen",
  },
  {
    id: "t2",
    type: "table",
    title: "14.2.2.1.2 Best objective response based on confirmed response by investigator assessment (Full analysis set)",
    program: "t_eff_14_2_212",
    status: "in-progress",
    programmer: "James Park",
  },
  {
    id: "t3",
    type: "figure",
    title: "14.2.3.2.1 Kaplan - Meier plot for duration of objective response by ICR assessment (Full analysis set)",
    program: "f_km_14_2_321",
    status: "to-do",
    programmer: null,
  },
  {
    id: "t4",
    type: "table",
    title: "14.3.2.4 Adverse events by maximum CTCAE grade on preferred term level (Safety analysis set)",
    program: "t_ae_14_3_24",
    status: "ai-processing",
    programmer: "Tom Chen",
  },
  {
    id: "t5",
    type: "figure",
    title: "14.2.3 KM Survival Curve for Overall Survival (Full analysis set)",
    program: "f_km_14_2_3",
    status: "in-progress",
    programmer: "Sarah Chen",
  },
  {
    id: "t6",
    type: "table",
    title: "14.3.1 Summary of Treatment-Emergent Adverse Events by System Organ Class (Safety analysis set)",
    program: "t_ae_14_3_1",
    status: "to-do",
    programmer: null,
  },
  {
    id: "t7",
    type: "listing",
    title: "16.2.4 Concomitant Medications Prior and Concomitant to Study Treatment",
    program: "l_cm_16_2_4",
    status: "to-do",
    programmer: null,
  },
  {
    id: "t8",
    type: "table",
    title: "14.3.5.1 Laboratory Abnormalities by CTC Grade Shift from Baseline",
    program: "t_lb_14_3_51",
    status: "error",
    programmer: "James Park",
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { name: "Tom Chen",   initials: "TC", color: "#0077b6", email: "tom.chen@astrazeneca.com",   isOwner: true,  assignedTFLs: 1, addedBy: "System"   },
  { name: "Sarah Chen", initials: "SC", color: "#f0ab00", email: "sarah.chen@astrazeneca.com", isOwner: false, assignedTFLs: 2, addedBy: "Tom Chen" },
  { name: "James Park", initials: "JP", color: "#830051", email: "james.park@astrazeneca.com", isOwner: false, assignedTFLs: 2, addedBy: "Tom Chen" },
];

// ─── Main Modal ───────────────────────────────────────────────────────────────

export interface EventTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  initialTeamMembers?: TeamMember[];
  initialTFLRows?: TFLRow[];
  onOwnerChange?: (newOwner: string) => void;
  onTeamMembersChange?: (members: TeamMember[]) => void;
  currentUserName: string;
  canAddMember: boolean;
  canRemoveMember: boolean;
  canChangeOwner: boolean;
  canManageAssignments: boolean;
}

export default function EventTeamMemberModal({
  isOpen,
  onClose,
  eventName,
  initialTeamMembers = MOCK_TEAM_MEMBERS,
  initialTFLRows = MOCK_TFL_ROWS,
  onOwnerChange,
  onTeamMembersChange,
  currentUserName,
  canAddMember,
  canRemoveMember,
  canChangeOwner,
  canManageAssignments,
}: EventTeamMemberModalProps) {
  const [activeTab, setActiveTab] = useState<"assignment" | "team">("assignment");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [tflRows, setTflRows] = useState<TFLRow[]>(initialTFLRows);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(canManageAssignments ? "assignment" : "team");
      setTeamMembers(initialTeamMembers);
      setTflRows(initialTFLRows);
    }
  }, [isOpen, canManageAssignments, initialTeamMembers, initialTFLRows]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const membersWithCounts = useMemo(() =>
    teamMembers.map((m) => ({
      ...m,
      assignedTFLs: tflRows.filter((r) => r.programmer === m.name).length,
    })),
    [teamMembers, tflRows]
  );

  const handleUpdateProgrammer = (id: string, programmer: string | null) => {
    if (!canManageAssignments) return;
    if (!tflRows.some((row) => row.id === id && !isTflLocked(row))) return;
    // If assigning someone not in team, add them
    if (programmer && !teamMembers.find((m) => m.name === programmer)) {
      const poolUser = MOCK_USER_POOL.find((u) => u.name === programmer);
      if (poolUser) {
        setTeamMembers((prev) => [...prev, {
          name: poolUser.name, initials: poolUser.initials, color: poolUser.color, email: poolUser.email,
          isOwner: false, assignedTFLs: 0, addedBy: "Sarah Chen",
        }]);
      }
    }
    setTflRows((prev) => prev.map((r) => r.id === id && !isTflLocked(r) ? { ...r, programmer } : r));
  };

  const handleBatchUpdateProgrammer = (ids: string[], programmer: string | null) => {
    if (!canManageAssignments) return;
    const idSet = new Set(tflRows.filter((row) => ids.includes(row.id) && !isTflLocked(row)).map((row) => row.id));
    if (idSet.size === 0) return;
    if (programmer && !teamMembers.find((m) => m.name === programmer)) {
      const poolUser = MOCK_USER_POOL.find((u) => u.name === programmer);
      if (poolUser) {
        setTeamMembers((prev) => [...prev, {
          name: poolUser.name, initials: poolUser.initials, color: poolUser.color, email: poolUser.email,
          isOwner: false, assignedTFLs: 0, addedBy: "Sarah Chen",
        }]);
      }
    }
    setTflRows((prev) => prev.map((r) => idSet.has(r.id) && !isTflLocked(r) ? { ...r, programmer } : r));
  };

  const handleRemoveMember = (name: string) => {
    if (!canRemoveMember) return;
    const nextMembers = teamMembers.filter((member) => member.name !== name);
    setTeamMembers(nextMembers);
    onTeamMembersChange?.(nextMembers);
    setTflRows((prev) => prev.map((r) => r.programmer === name && !isTflLocked(r) ? { ...r, programmer: null } : r));
  };

  const handleChangeOwner = (newOwnerName: string) => {
    if (!canChangeOwner) return;
    const isNewToTeam = !teamMembers.find((m) => m.name === newOwnerName);
    const poolUser = MOCK_USER_POOL.find((u) => u.name === newOwnerName);
    setTeamMembers((prev) => {
      const withNewOwner = prev.map((m) => ({ ...m, isOwner: m.name === newOwnerName }));
      if (isNewToTeam && poolUser) {
        return [...withNewOwner.map((m) => ({ ...m, isOwner: false })), {
          name: poolUser.name, initials: poolUser.initials, color: poolUser.color, email: poolUser.email,
          isOwner: true, assignedTFLs: 0, addedBy: "Auto-added",
        }];
      }
      return withNewOwner;
    });
    onOwnerChange?.(newOwnerName);
  };

  const handleAddMember = (user: typeof MOCK_USER_POOL[0]) => {
    if (!canAddMember) return;
    if (teamMembers.find((m) => m.name === user.name)) return;
    const nextMembers = [...teamMembers, {
      name: user.name, initials: user.initials, color: user.color, email: user.email,
      isOwner: false, assignedTFLs: 0, addedBy: "Sarah Chen",
    }];
    setTeamMembers(nextMembers);
    onTeamMembersChange?.(nextMembers);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-[8px] shadow-elevation-modal flex flex-col overflow-hidden border border-graphite-10"
        style={{ width: 960, height: 600, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 40px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[14px] border-b border-graphite-10 shrink-0">
          <h2 className="text-[14px] font-semibold text-text-primary shrink-0">Event Team Configuration</h2>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors shrink-0">
            <CloseIcon size={15} />
          </button>
        </div>

        {/* Assignment is an Event Owner workspace. Other users open Team Members directly. */}
        {canManageAssignments && (
          <div className="flex items-end px-[20px] border-b border-graphite-10 shrink-0 bg-white">
            {(["assignment", "team"] as const).map((tab) => {
              const labels = { assignment: "Assignment", team: "Team Members" };
              const active = activeTab === tab;
              return (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`px-[2px] py-[10px] mr-[20px] text-[13px] font-medium border-b-[2px] transition-colors ${
                    active ? "border-brand-1 text-brand-1" : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}>
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Body */}
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {canManageAssignments && activeTab === "assignment" ? (
            <AssignmentTab
              tflRows={tflRows}
              teamMembers={membersWithCounts}
              onUpdateProgrammer={handleUpdateProgrammer}
              onBatchUpdateProgrammer={handleBatchUpdateProgrammer}
              canManageAssignments={canManageAssignments}
            />
          ) : (
            <TeamMembersTab
              teamMembers={membersWithCounts}
              onRemove={handleRemoveMember}
              onChangeOwner={handleChangeOwner}
              onAddMember={handleAddMember}
              currentUserName={currentUserName}
              canAddMember={canAddMember}
              canRemoveMember={canRemoveMember}
              canChangeOwner={canChangeOwner}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
