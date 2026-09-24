/**
 * AssigneeOccupancyButton
 *
 * Renders in the top workspace toolbar to the left of Group code.
 * Displays the current TFL Assignee's occupancy state and allows
 * Team Members to Take over when the Assignee is away.
 *
 * Requirements:
 *   1. Read-only avatars (own-occupied, unassigned) have NO hover effect, no cursor pointer.
 *   2. Online user (other-occupied):
 *      - Hover opens read-only Popover (Avatar + name + relative time, NO danger button).
 *      - Safe zone prevents flickering during mouse transitions.
 *   3. Offline/Away user (other-away):
 *      - Hover ALSO opens Popover (info + "Take over" danger option).
 *      - Safe zone (hitbox bridge + 250ms grace timeout) enables seamless cursor travel to "Take over".
 *      - Default: opacity 40%, border-transparent.
 *      - Hover: opacity 80%, border-graphite-30.
 *      - Selected (Popover open): input-like focus ring (border border-brand-1 shadow-[0px_0px_0px_3px_var(--color-az-secondary)] opacity-100).
 *      - Clicking "Take over" triggers takeover and closes Popover.
 */

import React, { useRef, useState, useEffect } from "react";
import { Avatar } from "../../../components/ui/Avatar";
import { Popover } from "../../../components/ui/Popover";
import { MenuItem } from "../../../components/ui/MenuItem";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OccupancyState =
  | "own-occupied"   // Current user is the Assignee and holds the lock (read-only, no hover)
  | "other-occupied" // Someone else holds the page lock (hover opens popover with info only)
  | "other-away"     // Assignee exists but is offline/away (hover opens popover with info + take over option)
  | "unassigned";    // No Assignee on this TFL (read-only, no hover)

export interface AssigneeOccupancyProps {
  /** The current TFL's Assignee name (undefined = unassigned). */
  assigneeName?: string;
  /** The logged-in user's name — used to determine own-occupied state. */
  currentUserName: string;
  /** Whether the Assignee currently holds an active page lock. */
  isOccupied: boolean;
  /** ISO timestamp of the last edit made by the Assignee. */
  lastEditedAt?: Date;
  /** Called when the current user confirms "Take over". */
  onTakeOver?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

// ── Lock icon (inline SVG, semantic currentColor) ─────────────────────────────

function LockIcon({ className = "w-[14px] h-[14px]" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C13.5912 1 15.117 1.63267 16.2422 2.75781C17.3673 3.88297 17.9999 5.40879 18 7V10H19C20.6568 10 21.9999 11.3433 22 13V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V13C2.00013 11.3433 3.34323 10 5 10H6V7C6.00006 5.40879 6.63265 3.88297 7.75781 2.75781C8.88302 1.63268 10.4088 1 12 1ZM5 12C4.4478 12 4.00013 12.4478 4 13V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V13C19.9999 12.4478 19.5522 12 19 12H5ZM12 3C10.9392 3 9.92201 3.42181 9.17188 4.17188C8.42179 4.92196 8.00006 5.93922 8 7V10H16V7C15.9999 5.93922 15.5782 4.92196 14.8281 4.17188C14.078 3.4218 13.0608 3 12 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Popover Content ───────────────────────────────────────────────────────────

function AssigneePopoverContent({
  assigneeName,
  lastEditedAt,
  showTakeOver = false,
  onTakeOver,
  onClose,
}: {
  assigneeName: string;
  lastEditedAt?: Date;
  showTakeOver?: boolean;
  onTakeOver?: () => void;
  onClose: () => void;
}) {
  const handleTakeOver = () => {
    onTakeOver?.();
    onClose();
  };

  return (
    <div className="flex flex-col min-w-[180px] max-w-[240px]">
      {/* Info row */}
      <div className="flex items-center gap-[8px] px-[8px] pt-[8px] pb-[6px]">
        <Avatar name={assigneeName} level="menu" />
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] leading-[18px] font-medium text-text-primary truncate">
            {assigneeName}
          </span>
          {lastEditedAt && (
            <span className="text-[11px] leading-[16px] text-text-secondary">
              {relativeTime(lastEditedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Take over action (only for offline/away users) */}
      {showTakeOver && (
        <>
          <div className="my-[2px] mx-[4px] border-t border-form-border" />
          <div className="pb-[4px] px-[4px]">
            <MenuItem
              danger
              icon={<LockIcon />}
              onClick={handleTakeOver}
            >
              Take over
            </MenuItem>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AssigneeOccupancyButton({
  assigneeName,
  currentUserName,
  isOccupied,
  lastEditedAt,
  onTakeOver,
}: AssigneeOccupancyProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedAtRef = useRef<number>(0);

  // Derive the occupancy state
  const occupancyState: OccupancyState = !assigneeName
    ? "unassigned"
    : assigneeName === currentUserName
    ? "own-occupied"
    : isOccupied
    ? "other-occupied"
    : "other-away";

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // When assigneeName or occupancyState changes, close popover
  useEffect(() => {
    setPopoverOpen(false);
  }, [assigneeName, occupancyState]);

  // Fixed slot geometry: 28px × 28px circle identical to toolbar icon buttons (Group Code, Download, etc.)
  const baseSlotClasses =
    "relative size-[28px] inline-flex shrink-0 items-center justify-center rounded-full select-none";

  // Case 1: Unassigned (Read-only, no hover, no cursor pointer)
  if (occupancyState === "unassigned") {
    return (
      <span
        aria-label="No Assignee"
        className={`${baseSlotClasses} border border-transparent cursor-default`}
      >
        <Avatar level="page" />
      </span>
    );
  }

  // Case 2: Own occupied (Current user is Assignee, read-only, no hover, no cursor pointer)
  if (occupancyState === "own-occupied") {
    return (
      <span
        aria-label={`${assigneeName} (you are editing)`}
        className={`${baseSlotClasses} border border-transparent cursor-default`}
      >
        <Avatar name={assigneeName} level="page" />
      </span>
    );
  }

  const isAway = occupancyState === "other-away";
  const isOnlineOther = occupancyState === "other-occupied";
  const isInteractive = isOnlineOther || isAway;

  // Safe Zone Timing: 250ms grace period buffer to smoothly move cursor between trigger and popover
  const CLOSE_DELAY = 250;

  const handleMouseEnter = () => {
    if (isInteractive) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      if (!popoverOpen) {
        openedAtRef.current = Date.now();
        setPopoverOpen(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      hoverTimerRef.current = setTimeout(() => {
        setPopoverOpen(false);
        hoverTimerRef.current = null;
      }, CLOSE_DELAY);
    }
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    handleMouseLeave();
  };

  // Click handler: for offline/away, clicks also toggle/open
  const handleClick = () => {
    if (isAway) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      // If just opened by hover (< 400ms), keep it open to prevent accidental dismissal from rapid hover+click
      if (popoverOpen && Date.now() - openedAtRef.current < 400) {
        return;
      }
      setPopoverOpen((prev) => !prev);
      openedAtRef.current = Date.now();
    }
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={
          isAway
            ? `${assigneeName} (away) — hover to take over`
            : `${assigneeName} is editing`
        }
        aria-expanded={popoverOpen}
        className={`${baseSlotClasses} transition-[border-color,box-shadow,opacity] cursor-pointer focus-visible:outline-none ${
          isAway
            ? popoverOpen
              ? "border border-brand-1 shadow-[0px_0px_0px_3px_var(--color-az-secondary)] opacity-100"
              : "border border-transparent hover:border-graphite-30 opacity-40 hover:opacity-80"
            : popoverOpen
            ? "border border-graphite-30"
            : "border border-transparent hover:border-graphite-30"
        }`}
      >
        <Avatar name={assigneeName} level="page" />

        {/* Safe Zone Hitbox Bridge:
            Eliminates the vertical gap between the avatar trigger and the Popover,
            ensuring the cursor can travel seamlessly to interactive elements like "Take over". */}
        {popoverOpen && (
          <div
            aria-hidden="true"
            className="pointer-events-auto absolute top-full -left-[4px] -right-[4px] h-[8px]"
          />
        )}
      </button>

      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        anchorRef={anchorRef as React.RefObject<HTMLElement>}
        role="dialog"
        placement="bottom"
        align="start"
        width={220}
        offset={2}
        autoFocus={false}
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handlePopoverMouseLeave}
      >
        <AssigneePopoverContent
          assigneeName={assigneeName!}
          lastEditedAt={lastEditedAt}
          showTakeOver={isAway}
          onTakeOver={onTakeOver}
          onClose={() => setPopoverOpen(false)}
        />
      </Popover>
    </>
  );
}
