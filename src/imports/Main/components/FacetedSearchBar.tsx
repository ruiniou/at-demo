import { Avatar } from "../../../components/ui/Avatar";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import searchIconUrl from "../../../icons/search-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import checkIconUrl from "../../../icons/check-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import aiProcessingIconUrl from "../../../icons/Status label/Status=AI Processing.svg";
import wipStatusIconUrl from "../../../icons/Status label/Status=WIP.svg";
import completedStatusIconUrl from "../../../icons/Status label/Status=Completed.svg";
import untouchedStatusIconUrl from "../../../icons/Status label/Status=Untouched.svg";
import errorStatusIconUrl from "../../../icons/Status label/Status=Error.svg";
import { Tag } from "../../../components/ui/Tag";


export interface FacetedSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
  onRemoveStatus: (status: string) => void;
  selectedAssignees: Set<string>;
  onToggleAssignee: (assignee: string) => void;
  onRemoveAssignee: (assignee: string) => void;
  onResetAll: () => void;
  allAssignees: string[];
  className?: string;
}

const STATUS_ITEMS = [
  { id: "to-do", label: "To-do", icon: untouchedStatusIconUrl },
  { id: "analyzing", label: "AI Processing", icon: aiProcessingIconUrl },
  { id: "in-progress", label: "In Progress", icon: wipStatusIconUrl },
  { id: "locked", label: "Locked", icon: lockIconUrl },
  { id: "completed", label: "Completed", icon: completedStatusIconUrl },
  { id: "error", label: "Error", icon: errorStatusIconUrl },
];

type MenuLevel = "root" | "status" | "assignee";

export function FacetedSearchBar({
  searchQuery,
  onSearchQueryChange,
  selectedStatuses,
  onToggleStatus,
  onRemoveStatus,
  selectedAssignees,
  onToggleAssignee,
  onRemoveAssignee,
  onResetAll,
  allAssignees,
  className = "",
}: FacetedSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<MenuLevel>("root");
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownWidth = 300;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - dropdownWidth - 8);
    }
    const top = rect.bottom + 4;
    setMenuPos({ top, left });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setLevel("root");
      return;
    }
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
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
  }, [isOpen, updatePosition]);

  // Backspace key handler on empty input: deletes last token
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchQuery === "") {
      if (selectedAssignees.size > 0) {
        const lastAssignee = Array.from(selectedAssignees).pop();
        if (lastAssignee) onRemoveAssignee(lastAssignee);
      } else if (selectedStatuses.size > 0) {
        const lastStatus = Array.from(selectedStatuses).pop();
        if (lastStatus) onRemoveStatus(lastStatus);
      }
    }
  };

  const hasTokens =
    selectedStatuses.size > 0 ||
    selectedAssignees.size > 0;

  const hasContent = hasTokens || searchQuery.length > 0;

  // Ensure Sarah Chen is strictly the FIRST item in the members list
  const sortedAssignees = useMemo(() => {
    const list = [...allAssignees];
    const sarahIndex = list.indexOf("Sarah Chen");
    if (sarahIndex > -1) {
      list.splice(sarahIndex, 1);
      list.unshift("Sarah Chen");
    } else {
      list.unshift("Sarah Chen");
    }
    return list;
  }, [allAssignees]);

  // Level 2: Single click immediately applies selection and returns to Level 1
  const handleSelectStatusAndReturn = (statusId: string) => {
    onToggleStatus(statusId);
    setLevel("root");
    inputRef.current?.focus();
  };

  const handleSelectAssigneeAndReturn = (assignee: string) => {
    onToggleAssignee(assignee);
    setLevel("root");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      {/* Outer Input Box - Strictly Single-line (h-[36px] overflow-hidden) */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex h-[36px] w-full items-center gap-[6px] rounded-[8px] border-[0.6px] p-[2px_6px] transition-all cursor-text bg-graphite-10 overflow-hidden ${
          isOpen
            ? "bg-white border-brand-1 ring-1 ring-brand-1/20 shadow-sm"
            : "border-transparent hover:bg-black/5"
        }`}
      >
        <img
          src={searchIconUrl}
          alt=""
          className="size-[16px] shrink-0 opacity-70 ml-[2px]"
        />

        {/* Scrollable Single-line Row for Tokens + Input */}
        <div
          className="flex flex-1 flex-nowrap items-center gap-[4px] min-w-0 overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Status Tags using UI component Tag with variant="brand" */}
          {Array.from(selectedStatuses).map((status) => {
            const config = STATUS_ITEMS.find((s) => s.id === status);
            const label = config ? config.label : status;
            return (
              <Tag
                key={status}
                variant="brand"
                onClose={() => onRemoveStatus(status)}
                className="shrink-0 h-[24px] !py-0 flex items-center select-none"
              >
                <span className="flex items-center gap-[3px] max-w-[120px] truncate">
                  <span className="opacity-70 font-normal shrink-0">Status:</span>
                  <span className="truncate font-medium">{label}</span>
                </span>
              </Tag>
            );
          })}

          {/* Assignee Tags using UI component Tag with variant="brand" */}
          {Array.from(selectedAssignees).map((assignee) => (
            <Tag
              key={assignee}
              variant="brand"
              onClose={() => onRemoveAssignee(assignee)}
              className="shrink-0 h-[24px] !py-0 flex items-center select-none"
            >
              <span className="flex items-center gap-[4px] max-w-[130px] truncate">
                <Avatar name={assignee} level="menu" />
                <span className="truncate font-medium">{assignee === "Sarah Chen" ? "Sarah (You)" : assignee}</span>
              </span>
            </Tag>
          ))}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={!hasTokens ? "Search..." : ""}
            className="flex-1 min-w-[70px] shrink-0 bg-transparent outline-none t-small leading-[20px] text-text-primary placeholder:text-text-secondary"
          />
        </div>

        {/* Clear all (✕) button */}
        {hasContent && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResetAll();
              onSearchQueryChange("");
              inputRef.current?.focus();
            }}
            className="size-[20px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-black/5 opacity-60 hover:opacity-100 cursor-pointer mr-[1px]"
            title="Clear all"
          >
            <img src={closeIconUrl} alt="" className="size-[12px]" />
          </button>
        )}
      </div>

      {/* Figma-style Dropdown Menu - Fixed 300px Width & Standard Tokens */}
      {isOpen && menuPos && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: 300,
            zIndex: 10050,
          }}
          className="rounded-[8px] border border-[#D8DADA] bg-white p-[6px] shadow-elevation-overlay flex flex-col gap-[2px] animate-fade-in select-none"
        >
          {/* LEVEL 1: Dimension Selection Menu (No counts, standard t-small text) */}
          {level === "root" && (
            <div className="flex flex-col gap-[2px]">
              {/* Status Dimension */}
              <button
                type="button"
                onClick={() => setLevel("status")}
                className="flex items-center gap-[10px] px-[8px] py-[6px] rounded-[4px] hover:bg-bg-panel text-left cursor-pointer transition-colors w-full group"
              >
                <span className="inline-block px-[8px] py-[2px] rounded-[4px] bg-[#EBECEC] text-text-primary font-medium t-small">
                  Status:
                </span>
                <span className="t-small text-text-secondary truncate flex-1">
                  Filter by task status
                </span>
              </button>

              {/* Assignee Dimension */}
              <button
                type="button"
                onClick={() => setLevel("assignee")}
                className="flex items-center gap-[10px] px-[8px] py-[6px] rounded-[4px] hover:bg-bg-panel text-left cursor-pointer transition-colors w-full group"
              >
                <span className="inline-block px-[8px] py-[2px] rounded-[4px] bg-[#EBECEC] text-text-primary font-medium t-small">
                  By:
                </span>
                <span className="t-small text-text-secondary truncate flex-1">
                  Filter by assigned member
                </span>
              </button>

              {/* Quick Suggestion Row - 'Quick:' in Title Case */}
              <div className="h-[1px] bg-graphite-10 my-[4px]" />
              <div className="flex items-center gap-[6px] px-[8px] py-[2px]">
                <span className="t-small font-medium text-text-secondary">
                  Quick:
                </span>
                <button
                  type="button"
                  onClick={() => onToggleAssignee("Sarah Chen")}
                  className={`px-[8px] py-[3px] rounded-[4px] t-small font-medium transition-colors cursor-pointer ${
                    selectedAssignees.has("Sarah Chen")
                      ? "bg-[#F4E8EE] text-brand-1"
                      : "bg-graphite-10 hover:bg-graphite-20 text-text-primary"
                  }`}
                >
                  Assigned to me
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStatus("locked")}
                  className={`px-[8px] py-[3px] rounded-[4px] t-small font-medium transition-colors cursor-pointer ${
                    selectedStatuses.has("locked")
                      ? "bg-[#F4E8EE] text-brand-1"
                      : "bg-graphite-10 hover:bg-graphite-20 text-text-primary"
                  }`}
                >
                  Locked
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 2: Status Submenu */}
          {level === "status" && (
            <div className="flex flex-col gap-[1px] max-h-[220px] overflow-y-auto">
              {STATUS_ITEMS.map((item) => {
                const isSelected = selectedStatuses.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectStatusAndReturn(item.id)}
                    className={`flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-az-secondary/60 text-brand-1 font-medium"
                        : "hover:bg-bg-panel text-text-primary"
                    }`}
                  >
                    <img src={item.icon} alt="" className="size-[16px] shrink-0" />
                    <span className="t-small flex-1 truncate">{item.label}</span>
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
            </div>
          )}

          {/* LEVEL 2: Assignee Submenu (Direct members list, Sarah Chen FIRST, single click auto-returns) */}
          {level === "assignee" && (
            <div className="flex flex-col gap-[1px] max-h-[220px] overflow-y-auto">
              {sortedAssignees.map((assignee) => {
                const isSelected = selectedAssignees.has(assignee);
                return (
                  <button
                    key={assignee}
                    type="button"
                    onClick={() => handleSelectAssigneeAndReturn(assignee)}
                    className={`flex items-center gap-[8px] px-[8px] py-[6px] rounded-[4px] w-full text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-az-secondary/60 text-brand-1 font-medium"
                        : "hover:bg-bg-panel text-text-primary"
                    }`}
                  >
                    <Avatar name={assignee} level="menu" />
                    <span className="t-small flex-1 truncate">{assignee}</span>
                    {assignee === "Sarah Chen" && (
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
            </div>
          )}

        </div>,
        document.body
      )}
    </div>
  );
}
