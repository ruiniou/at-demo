import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import chatAiFillIconUrl from "../../../icons/chat-ai-4-fill.svg";
import fileAiFillIconUrl from "../../../icons/file-ai-fill.svg";
import gitBranchIconUrl from "../../../icons/git-branch-line.svg";
import addLineIconUrl from "../../../icons/add-line.svg";
import checkIconUrl from "../../../icons/check-line.svg";
import { Tooltip } from "../../../components/ui/Tooltip";
import type { EventSession } from "../Main";

// Helper for icon color filtering
const iconFilters: Record<string, string> = {
  "var(--color-brand-1)": "brightness(0) saturate(100%) invert(18%) sepia(88%) saturate(2371%) hue-rotate(318deg) brightness(85%) contrast(98%)",
  "var(--color-text-secondary)": "brightness(0) saturate(100%) invert(43%) sepia(7%) saturate(361%) hue-rotate(152deg) brightness(93%) contrast(87%)",
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

  // TFL sessions
  tflSessions: { id: string; name: string }[];
  selectedTflSessionId: string;
  onSelectTflSession: (id: string) => void;
  onNewTflSession?: () => void;
}

export const CopilotScopeHeader: React.FC<CopilotScopeHeaderProps> = ({
  scope,
  onSelectScope,
  eventSessions,
  selectedEventSessionId,
  onSelectEventSession,
  onNewEventSession,
  tflSessions,
  selectedTflSessionId,
  onSelectTflSession,
  onNewTflSession,
}) => {
  const [openDropdown, setOpenDropdown] = useState<"event" | "tfl" | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const eventButtonRef = useRef<HTMLButtonElement | null>(null);
  const tflButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Active session titles
  const activeEventSession = eventSessions.find((s) => s.id === selectedEventSessionId) || eventSessions[0];
  const activeTflSession = tflSessions.find((s) => s.id === selectedTflSessionId) || tflSessions[0];

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
        menuRef.current &&
        !menuRef.current.contains(target) &&
        eventButtonRef.current &&
        !eventButtonRef.current.contains(target) &&
        tflButtonRef.current &&
        !tflButtonRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    const handleScrollOrResize = () => {
      setOpenDropdown(null);
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
  }, [openDropdown]);

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
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                Sessions
              </span>
            </div>
            {eventSessions.map((s) => {
              const isSelected = s.id === selectedEventSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectEventSession(s);
                    setOpenDropdown(null);
                  }}
                  className={`flex items-start justify-between gap-[8px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                    isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[13px] truncate leading-[20px]">{s.name}</span>
                      {s.status === "processing" && (
                        <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand-1 animate-ping shrink-0" />
                      )}
                    </div>
                    {s.parentName && (
                      <div className="flex items-center gap-[4px] mt-[1px] text-[11px] text-text-secondary opacity-80 truncate">
                        <ScopeIcon src={gitBranchIconUrl} className="w-[11px] h-[11px]" color="var(--color-text-secondary)" />
                        <span className="truncate">From {s.parentName}</span>
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <ScopeIcon src={checkIconUrl} className="w-[14px] h-[14px] mt-[2px] shrink-0" color="var(--color-brand-1)" />
                  )}
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
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Latest
                  </span>
                </div>
                {(() => {
                  const s = tflSessions[0];
                  const isSelected = s.id === selectedTflSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectTflSession(s.id);
                        setOpenDropdown(null);
                      }}
                      className={`flex items-center justify-between gap-[8px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                        isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                      }`}
                    >
                      <span className="text-[13px] truncate flex-1 leading-[20px]">{s.name}</span>
                      {isSelected && (
                        <ScopeIcon src={checkIconUrl} className="w-[14px] h-[14px] shrink-0" color="var(--color-brand-1)" />
                      )}
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
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Older
                  </span>
                </div>
                {tflSessions.slice(1).map((s) => {
                  const isSelected = s.id === selectedTflSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectTflSession(s.id);
                        setOpenDropdown(null);
                      }}
                      className={`flex items-center justify-between gap-[8px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                        isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                      }`}
                    >
                      <span className="text-[13px] truncate flex-1 leading-[20px]">{s.name}</span>
                      {isSelected && (
                        <ScopeIcon src={checkIconUrl} className="w-[14px] h-[14px] shrink-0" color="var(--color-brand-1)" />
                      )}
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
    </div>
  );
};
