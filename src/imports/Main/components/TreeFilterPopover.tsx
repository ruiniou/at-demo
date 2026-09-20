import { Avatar } from "../../../components/ui/Avatar";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import closeIconUrl from "../../../icons/close-line.svg";
import checkIconUrl from "../../../icons/check-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import aiProcessingIconUrl from "../../../icons/Status label/Status=AI Processing.svg";
import wipStatusIconUrl from "../../../icons/Status label/Status=WIP.svg";
import completedStatusIconUrl from "../../../icons/Status label/Status=Completed.svg";
import untouchedStatusIconUrl from "../../../icons/Status label/Status=Untouched.svg";
import errorStatusIconUrl from "../../../icons/Status label/Status=Error.svg";

export interface TreeFilterPopoverProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
  selectedAssignees: Set<string>;
  onToggleAssignee: (assignee: string) => void;
  onClearAssignees: () => void;
  selectedSection: string;
  onSelectSection: (section: string) => void;
  allAssignees: string[];
  allSections: { id: string; name: string }[];
  onResetAll: () => void;
  matchingCount?: number;
  totalCount?: number;
}

const STATUS_CONFIGS = [
  { id: "to-do", label: "To do", icon: untouchedStatusIconUrl },
  { id: "analyzing", label: "AI Processing", icon: aiProcessingIconUrl },
  { id: "in-progress", label: "In Progress", icon: wipStatusIconUrl },
  { id: "locked", label: "Locked", icon: lockIconUrl },
  { id: "completed", label: "Completed", icon: completedStatusIconUrl },
  { id: "error", label: "Error", icon: errorStatusIconUrl },
];

export function TreeFilterPopover({
  buttonRef,
  isOpen,
  onClose,
  selectedStatuses,
  onToggleStatus,
  selectedAssignees,
  onToggleAssignee,
  onClearAssignees,
  selectedSection,
  onSelectSection,
  allAssignees,
  allSections,
  onResetAll,
  matchingCount,
  totalCount,
}: TreeFilterPopoverProps) {
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const assigneeInputRef = useRef<HTMLInputElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    let left = rect.right - popoverWidth;
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - popoverWidth - 8);
    }
    const top = rect.bottom + 6;
    setPopoverPos({ top, left });
  }, [buttonRef]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition, buttonRef, onClose]);

  const filteredAssignees = useMemo(() => {
    return allAssignees.filter((a) =>
      a.toLowerCase().includes(assigneeSearch.toLowerCase().trim())
    );
  }, [allAssignees, assigneeSearch]);

  const hasAnyFilter =
    selectedStatuses.size > 0 ||
    selectedAssignees.size > 0 ||
    selectedSection !== "all";

  if (!isOpen || !popoverPos) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: popoverPos.top,
        left: popoverPos.left,
        width: 280,
        zIndex: 10050,
      }}
      className="rounded-[8px] border border-border-default bg-white p-[12px] shadow-elevation-overlay flex flex-col gap-[12px] animate-fade-in select-none"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="t-small font-semibold text-text-primary">Filters</span>
          {matchingCount !== undefined && totalCount !== undefined && (
            <span className="text-[11px] text-text-secondary">
              ({matchingCount}/{totalCount})
            </span>
          )}
        </div>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={onResetAll}
            className="text-[11px] font-medium text-brand-1 hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="h-[1px] w-full bg-graphite-10 -my-[2px]" />

      {/* 1. Status Filter (Multi-select) */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Status
          </span>
          {selectedStatuses.size > 0 && (
            <span className="text-[10px] text-brand-1 font-medium">
              {selectedStatuses.size} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-[4px]">
          {STATUS_CONFIGS.map((item) => {
            const isSelected = selectedStatuses.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleStatus(item.id)}
                className={`flex items-center gap-[6px] px-[8px] py-[5px] rounded-[4px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#F4E8EE] border-[#830051] text-[#830051] font-medium shadow-sm"
                    : "bg-white border-[#E0E2E2] hover:bg-graphite-10 text-text-primary"
                }`}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="size-[14px] shrink-0 block"
                />
                <span className="t-small leading-[16px] truncate flex-1">
                  {item.label}
                </span>
                {isSelected && (
                  <img
                    src={checkIconUrl}
                    alt=""
                    className="size-[12px] shrink-0 opacity-90"
                    style={{
                      filter:
                        "invert(13%) sepia(85%) saturate(3755%) hue-rotate(310deg) brightness(88%) contrast(106%)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Assignee Filter (Inspired by DownloadSasProgramsModal OwnerDropdown) */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Assignee
          </span>
          {selectedAssignees.size > 0 && (
            <button
              type="button"
              onClick={onClearAssignees}
              className="text-[10px] text-text-secondary hover:text-brand-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick selection: Assigned to me */}
        <button
          type="button"
          onClick={() => onToggleAssignee("Sarah Chen")}
          className={`flex items-center gap-[6px] px-[8px] py-[5px] rounded-[4px] border text-left transition-colors cursor-pointer w-full ${
            selectedAssignees.has("Sarah Chen")
              ? "bg-[#F4E8EE] border-[#830051] text-brand-1 font-medium"
              : "bg-white border-border-default hover:bg-graphite-10 text-text-primary"
          }`}
        >
          <Avatar name="Sarah Chen" level="menu" />
          <span className="text-[11px] flex-1">Assigned to me</span>
          <span className="text-[10px] text-text-secondary">(Sarah)</span>
          {selectedAssignees.has("Sarah Chen") && (
            <img
              src={checkIconUrl}
              alt=""
              className="size-[12px] shrink-0 opacity-90"
              style={{
                filter:
                  "invert(13%) sepia(85%) saturate(3755%) hue-rotate(310deg) brightness(88%) contrast(106%)",
              }}
            />
          )}
        </button>

        {/* Search input with tags inside */}
        <div className="bg-white rounded-[4px] border border-border-default focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20 transition-all p-[2px]">
          <div className="flex items-center gap-[4px] px-[6px] py-[3px] flex-wrap min-h-[28px]">
            {Array.from(selectedAssignees).map((assignee) => (
              <div
                key={assignee}
                className="bg-graphite-10 rounded-[3px] shrink-0 flex items-center gap-[4px] px-[4px] py-[1px]"
              >
                <Avatar name={assignee} level="menu" />
                <span className="text-[11px] text-text-primary whitespace-nowrap">
                  {assignee}
                </span>
                <button
                  type="button"
                  className="relative shrink-0 size-[10px] flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAssignee(assignee);
                  }}
                >
                  <img src={closeIconUrl} alt="" className="size-[8px]" />
                </button>
              </div>
            ))}
            <input
              ref={assigneeInputRef}
              className="min-w-[70px] flex-1 bg-transparent outline-none text-[12px] text-text-primary placeholder:text-text-secondary leading-[18px]"
              placeholder={selectedAssignees.size === 0 ? "Search assignee..." : ""}
              value={assigneeSearch}
              onChange={(e) => setAssigneeSearch(e.target.value)}
            />
            {selectedAssignees.size > 0 && (
              <button
                type="button"
                className="relative shrink-0 size-[16px] flex items-center justify-center rounded-[3px] hover:bg-black/5 cursor-pointer"
                onClick={onClearAssignees}
                title="Clear assignees"
              >
                <img src={closeIconUrl} alt="" className="size-[10px] opacity-70" />
              </button>
            )}
          </div>
        </div>

        {/* Assignee list */}
        <div className="flex flex-col gap-[1px] max-h-[110px] overflow-y-auto w-full border border-border-default/50 rounded-[4px] p-[2px] bg-bg-panel/30">
          {filteredAssignees.map((assignee) => {
            const isSelected = selectedAssignees.has(assignee);
            return (
              <button
                key={assignee}
                type="button"
                onClick={() => onToggleAssignee(assignee)}
                className={`flex items-center gap-[6px] px-[6px] py-[6px] rounded-[3px] w-full text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#F4E8EE] text-brand-1 font-medium"
                    : "hover:bg-bg-panel text-text-primary"
                }`}
              >
                <Avatar name={assignee} level="menu" />
                <span className="text-[11px] flex-1 truncate">{assignee}</span>
                {assignee === "Sarah Chen" && (
                  <span className="text-[10px] text-text-secondary shrink-0">
                    (You)
                  </span>
                )}
                {isSelected && (
                  <img
                    src={checkIconUrl}
                    alt=""
                    className="size-[12px] shrink-0 opacity-90"
                    style={{
                      filter:
                        "invert(13%) sepia(85%) saturate(3755%) hue-rotate(310deg) brightness(88%) contrast(106%)",
                    }}
                  />
                )}
              </button>
            );
          })}
          {filteredAssignees.length === 0 && (
            <p className="text-[11px] text-text-secondary px-[8px] py-[4px]">
              No members found
            </p>
          )}
        </div>
      </div>

      {/* 3. Section Filter */}
      <div className="flex flex-col gap-[6px]">
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
          Section
        </span>
        <select
          value={selectedSection}
          onChange={(e) => onSelectSection(e.target.value)}
          className="w-full h-[28px] px-[8px] text-[12px] text-text-primary bg-white border border-border-default rounded-[4px] outline-none focus:border-brand-1 cursor-pointer"
        >
          <option value="all">All Sections</option>
          {allSections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[4px] border-t border-graphite-10">
        <button
          type="button"
          onClick={onResetAll}
          disabled={!hasAnyFilter}
          className={`text-[12px] transition-colors ${
            hasAnyFilter
              ? "text-text-secondary hover:text-text-primary cursor-pointer"
              : "text-text-secondary/40 cursor-not-allowed"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-[12px] py-[4px] rounded-[4px] bg-brand-1 hover:bg-brand-1/90 active:scale-[0.98] text-white text-[12px] font-medium cursor-pointer transition-all"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}
