import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import chatAiFillIconUrl from "../../../icons/chat-ai-4-fill.svg";
import fileAiFillIconUrl from "../../../icons/file-ai-fill.svg";
import gitBranchIconUrl from "../../../icons/git-branch-line.svg";
import addLineIconUrl from "../../../icons/add-line.svg";
import editIconUrl from "../../../icons/edit-2-line.svg";
import { Tooltip } from "../../../components/ui/Tooltip";
import type { EventSession } from "../Main";

// Helper for icon color filtering
const iconFilters: Record<string, string> = {
  "#830051": "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)",
  "var(--color-brand-1)": "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)",
  "#3C4242": "brightness(0) saturate(100%) invert(22%) sepia(8%) saturate(525%) hue-rotate(131deg) brightness(92%) contrast(88%)",
  "var(--color-text-primary)": "brightness(0) saturate(100%) invert(22%) sepia(8%) saturate(525%) hue-rotate(131deg) brightness(92%) contrast(88%)",
  "#888E8E": "brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(174%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "var(--color-text-secondary)": "brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(174%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "#CC2C3C": "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)",
  "var(--color-status-error)": "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)",
};

function ScopeIcon({
  src,
  className = "h-[14px] w-[14px]",
  color,
}: {
  src: string;
  className?: string;
  color?: string;
}) {
  const filter = color ? iconFilters[color] : undefined;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`${className} block shrink-0`}
      style={filter ? { filter } : undefined}
    />
  );
}

function ChevronDownIcon({ className = "size-[12px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface CopilotScopeHeaderProps {
  scope: "event" | "tfl";
  onSelectScope: (scope: "event" | "tfl") => void;

  // Event sessions
  eventSessions: EventSession[];
  selectedEventSessionId: string | null;
  onSelectEventSession: (session: EventSession) => void;
  onNewEventSession?: () => void;
  onRenameEventSession?: (sessionId: string, newName: string) => void;

  // TFL sessions
  tflSessions: { id: string; name: string }[];
  selectedTflSessionId: string;
  onSelectTflSession: (id: string) => void;
  onNewTflSession?: () => void;
  onRenameTflSession?: (sessionId: string, newName: string) => void;
}

export const CopilotScopeHeader: React.FC<CopilotScopeHeaderProps> = ({
  scope,
  onSelectScope,
  eventSessions,
  selectedEventSessionId,
  onSelectEventSession,
  onNewEventSession,
  onRenameEventSession,
  tflSessions,
  selectedTflSessionId,
  onSelectTflSession,
  onNewTflSession,
  onRenameTflSession,
}) => {
  const [openDropdown, setOpenDropdown] = useState<"event" | "tfl" | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const eventButtonRef = useRef<HTMLButtonElement | null>(null);
  const tflButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Rename state
  const [renamingSession, setRenamingSession] = useState<{
    id: string;
    name: string;
    type: "event" | "tfl";
    pos: { top: number; left: number };
    anchorRect?: { top: number; left: number; right: number; bottom: number };
  } | null>(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  const updateMenuPosition = useCallback((targetBtn: HTMLButtonElement | null) => {
    if (!targetBtn) return;
    const rect = targetBtn.getBoundingClientRect();
    const dropdownHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setMenuPos({
      top: showAbove ? Math.max(8, rect.top - dropdownHeight - 4) : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 290)),
    });
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        renameInputRef.current && renameInputRef.current.contains(target)
      ) {
        return;
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        eventButtonRef.current &&
        !eventButtonRef.current.contains(target) &&
        tflButtonRef.current &&
        !tflButtonRef.current.contains(target)
      ) {
        setOpenDropdown(null);
        setRenamingSession(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (renamingSession) {
          setRenamingSession(null);
        } else {
          setOpenDropdown(null);
        }
      }
    };

    const handleScrollOrResize = () => {
      if (!renamingSession) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openDropdown, renamingSession]);

  // Focus rename input on open
  useEffect(() => {
    if (renamingSession) {
      const timer = setTimeout(() => {
        if (renameInputRef.current) {
          renameInputRef.current.focus();
          renameInputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [renamingSession]);

  const handleToggleEvent = () => {
    if (scope !== "event") {
      onSelectScope("event");
      setOpenDropdown(null);
    } else {
      if (openDropdown === "event") {
        setOpenDropdown(null);
      } else {
        updateMenuPosition(eventButtonRef.current);
        setOpenDropdown("event");
      }
    }
  };

  const handleToggleTfl = () => {
    if (scope !== "tfl") {
      onSelectScope("tfl");
      setOpenDropdown(null);
    } else {
      if (openDropdown === "tfl") {
        setOpenDropdown(null);
      } else {
        updateMenuPosition(tflButtonRef.current);
        setOpenDropdown("tfl");
      }
    }
  };

  const handleStartRename = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
    name: string,
    type: "event" | "tfl"
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setRenameInputValue(name);
    setRenamingSession({
      id,
      name,
      type,
      pos: { top: rect.top - 4, left: rect.right + 4 },
      anchorRect: {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      },
    });
  };

  const handleConfirmRename = () => {
    if (renamingSession) {
      const trimmed = renameInputValue.trim();
      if (trimmed && trimmed !== renamingSession.name) {
        if (renamingSession.type === "event") {
          onRenameEventSession?.(renamingSession.id, trimmed);
        } else {
          onRenameTflSession?.(renamingSession.id, trimmed);
        }
      }
    }
    setRenamingSession(null);
  };

  return (
    <div className="flex items-center gap-[4px] min-w-0 max-w-[320px]">
      {/* 1. Event Button (Left) */}
      {scope === "event" ? (
        <Tooltip label={openDropdown === "event" ? undefined : "Event Copilot"}>
          <button
            ref={eventButtonRef}
            type="button"
            onClick={handleToggleEvent}
            className="flex h-[28px] items-center gap-[6px] rounded-[6px] bg-[#F4E8EE] text-brand-1 px-[8px] cursor-pointer max-w-[180px] shrink-0 transition-all select-none border-none outline-none"
            aria-label="Event Copilot"
            aria-expanded={openDropdown === "event"}
          >
            <ScopeIcon
              src={chatAiFillIconUrl}
              className="h-[14px] w-[14px] shrink-0"
              color="var(--color-brand-1)"
            />
            <span className="t-small-medium font-medium text-[13px] truncate text-brand-1 leading-none">
              Event Copilot
            </span>
            <ChevronDownIcon className="size-[12px] shrink-0 text-brand-1 opacity-80" color="var(--color-brand-1)" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip label="Event Copilot">
          <button
            ref={eventButtonRef}
            type="button"
            onClick={handleToggleEvent}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-text-secondary hover:bg-black/5 active:scale-[0.96] transition-all cursor-pointer shrink-0 border-none outline-none"
            aria-label="Event Copilot"
          >
            <ScopeIcon
              src={chatAiFillIconUrl}
              className="h-[14px] w-[14px] shrink-0"
              color="var(--color-text-secondary)"
            />
          </button>
        </Tooltip>
      )}

      {/* 2. TFL Button (Right) */}
      {scope === "tfl" ? (
        <Tooltip label={openDropdown === "tfl" ? undefined : "TFL Copilot"}>
          <button
            ref={tflButtonRef}
            type="button"
            onClick={handleToggleTfl}
            className="flex h-[28px] items-center gap-[6px] rounded-[6px] bg-[#F4E8EE] text-brand-1 px-[8px] cursor-pointer max-w-[180px] shrink-0 transition-all select-none border-none outline-none"
            aria-label="TFL Copilot"
            aria-expanded={openDropdown === "tfl"}
          >
            <ScopeIcon
              src={fileAiFillIconUrl}
              className="h-[14px] w-[14px] shrink-0"
              color="var(--color-brand-1)"
            />
            <span className="t-small-medium font-medium text-[13px] truncate text-brand-1 leading-none">
              TFL Copilot
            </span>
            <ChevronDownIcon className="size-[12px] shrink-0 text-brand-1 opacity-80" color="var(--color-brand-1)" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip label="TFL Copilot">
          <button
            ref={tflButtonRef}
            type="button"
            onClick={handleToggleTfl}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-text-secondary hover:bg-black/5 active:scale-[0.96] transition-all cursor-pointer shrink-0 border-none outline-none"
            aria-label="TFL Copilot"
          >
            <ScopeIcon
              src={fileAiFillIconUrl}
              className="h-[14px] w-[14px] shrink-0"
              color="var(--color-text-secondary)"
            />
          </button>
        </Tooltip>
      )}

      {/* Dropdown Menu Portals */}
      {openDropdown === "event" && menuPos && createPortal(
        <div
          ref={menuRef}
          style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          className="fixed z-[9999] w-[280px] max-h-[280px] bg-white border border-border-default rounded-[8px] shadow-[0_6px_24px_rgba(0,0,0,0.14)] flex flex-col select-none overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[220px] p-[6px] flex flex-col gap-[2px]">
            <div className="px-[8px] pt-[4px] pb-[4px]">
              <span className="text-[11px] font-semibold text-text-secondary block">
                Sessions
              </span>
            </div>
            {eventSessions.map((s) => {
              const isSelected = s.id === selectedEventSessionId;
              const isRenaming = renamingSession?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectEventSession(s);
                    setOpenDropdown(null);
                  }}
                  className={`group relative flex items-start justify-between gap-[6px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                    isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] truncate leading-[20px]">{s.name}</span>
                    </div>
                    {s.parentName && (
                      <div className="flex items-center gap-[4px] mt-[1px] text-[11px] text-text-secondary opacity-80 truncate">
                        <ScopeIcon src={gitBranchIconUrl} className="w-[11px] h-[11px]" color="var(--color-text-secondary)" />
                        <span className="truncate">From {s.parentName}</span>
                      </div>
                    )}
                  </div>

                  <Tooltip label="Rename">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, s.id, s.name, "event")}
                      aria-label={`Rename ${s.name}`}
                      className={`shrink-0 w-[22px] h-[22px] rounded-[4px] flex items-center justify-center transition-opacity ${
                      isRenaming
                        ? "text-text-primary opacity-100"
                        : "opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                    }`}
                    >
                      <ScopeIcon src={editIconUrl} className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
                    </button>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          <div className="p-[4px] border-t border-border-default bg-white shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNewEventSession?.();
              }}
              className="w-full flex items-center gap-[6px] px-[8px] py-[6px] rounded-[6px] text-[12px] font-medium text-brand-1 hover:bg-[#F4E8EE] transition-colors cursor-pointer border-none outline-none"
            >
              <ScopeIcon src={addLineIconUrl} className="w-[13px] h-[13px]" color="var(--color-brand-1)" />
              <span>New Event Session</span>
            </button>
          </div>
        </div>,
        document.body
      )}

      {openDropdown === "tfl" && menuPos && createPortal(
        <div
          ref={menuRef}
          style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          className="fixed z-[9999] w-[260px] max-h-[280px] bg-white border border-border-default rounded-[8px] shadow-[0_6px_24px_rgba(0,0,0,0.14)] flex flex-col select-none overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[220px] p-[6px] flex flex-col gap-[2px]">
            {/* Latest Section */}
            {tflSessions.length > 0 && (
              <>
                <div className="px-[8px] pt-[4px] pb-[4px]">
                  <span className="text-[11px] font-semibold text-text-secondary block">
                    Latest
                  </span>
                </div>
                {(() => {
                  const s = tflSessions[0];
                  const isSelected = s.id === selectedTflSessionId;
                  const isRenaming = renamingSession?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectTflSession(s.id);
                        setOpenDropdown(null);
                      }}
                      className={`group relative flex items-center justify-between gap-[6px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                        isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                      }`}
                    >
                      <span className="text-[13px] truncate flex-1 leading-[20px]">{s.name}</span>

                      <Tooltip label="Rename">
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(e, s.id, s.name, "tfl")}
                          aria-label={`Rename ${s.name}`}
                          className={`shrink-0 w-[22px] h-[22px] rounded-[4px] flex items-center justify-center transition-opacity ${
                          isRenaming
                            ? "text-text-primary opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                        }`}
                        >
                          <ScopeIcon src={editIconUrl} className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
                        </button>
                      </Tooltip>
                    </div>
                  );
                })()}
              </>
            )}

            {/* Older Section */}
            {tflSessions.length > 1 && (
              <>
                <div className="my-[4px] border-t border-border-default/60 mx-[4px]" />
                <div className="px-[8px] pt-[2px] pb-[4px]">
                  <span className="text-[11px] font-semibold text-text-secondary block">
                    Older
                  </span>
                </div>
                {tflSessions.slice(1).map((s) => {
                  const isSelected = s.id === selectedTflSessionId;
                  const isRenaming = renamingSession?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectTflSession(s.id);
                        setOpenDropdown(null);
                      }}
                      className={`group relative flex items-center justify-between gap-[6px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                        isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                      }`}
                    >
                      <span className="text-[13px] truncate flex-1 leading-[20px]">{s.name}</span>

                      <Tooltip label="Rename">
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(e, s.id, s.name, "tfl")}
                          aria-label={`Rename ${s.name}`}
                          className={`shrink-0 w-[22px] h-[22px] rounded-[4px] flex items-center justify-center transition-opacity ${
                          isRenaming
                            ? "text-text-primary opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                        }`}
                        >
                          <ScopeIcon src={editIconUrl} className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
                        </button>
                      </Tooltip>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="p-[4px] border-t border-border-default bg-white shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNewTflSession?.();
              }}
              className="w-full flex items-center gap-[6px] px-[8px] py-[6px] rounded-[6px] text-[12px] font-medium text-brand-1 hover:bg-[#F4E8EE] transition-colors cursor-pointer border-none outline-none"
            >
              <ScopeIcon src={addLineIconUrl} className="w-[13px] h-[13px]" color="var(--color-brand-1)" />
              <span>New TFL Session</span>
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Rename Popover */}
      {renamingSession && (() => {
        const RENAME_WIDTH = 220;
        const PADDING = 8;

        let left = renamingSession.pos.left;
        let top = renamingSession.pos.top;

        if (renamingSession.anchorRect) {
          const anchor = renamingSession.anchorRect;
          // If cannot fit on the right of anchor, flip to the left of the anchor
          if (anchor.right + 4 + RENAME_WIDTH > window.innerWidth - PADDING) {
            left = anchor.left - 4 - RENAME_WIDTH;
          } else {
            left = anchor.right + 4;
          }
          top = anchor.top - 4;
        }

        // Strict boundary collision detection: guarantees never exceeding right, left, or bottom viewport
        const safeLeft = Math.max(PADDING, Math.min(left, window.innerWidth - RENAME_WIDTH - PADDING));
        const safeTop = Math.max(PADDING, Math.min(top, window.innerHeight - 44 - PADDING));

        return createPortal(
          <>
            <div
              className="fixed inset-0 z-[10000] bg-transparent"
              onClick={() => handleConfirmRename()}
            />
            <div
              style={{
                position: "fixed",
                top: safeTop,
                left: safeLeft,
                zIndex: 10001,
                width: RENAME_WIDTH,
                maxWidth: `calc(100vw - ${PADDING * 2}px)`,
              }}
              className="bg-white rounded-[6px] p-[4px] border border-border-default shadow-[0px_4px_16px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-100 select-none"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <input
                ref={renameInputRef}
                type="text"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmRename();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setRenamingSession(null);
                  }
                }}
                className="w-full h-[30px] px-[8px] text-[13px] border border-brand-1 rounded-[4px] outline-none focus:ring-1 focus:ring-brand-1 text-text-primary bg-white transition-all"
                placeholder="Session name"
              />
            </div>
          </>,
          document.body
        );
      })()}

    </div>
  );
};
