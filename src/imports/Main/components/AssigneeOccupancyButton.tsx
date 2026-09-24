/**
 * AssigneeOccupancyButton
 *
 * Renders in the Code Panel's toolbar left slot.
 * Displays the current TFL Assignee's occupancy state and allows
 * Team Members to Take over when the Assignee is away.
 *
 * States:
 *   own-occupied  — current user IS the Assignee and holds the page lock (no interaction)
 *   other-occupied — another user holds the page lock (popover: read-only info only)
 *   other-away    — Assignee exists but has left the page (popover: info + Take over)
 *   unassigned    — no Assignee; nobody can edit (empty avatar, no interaction)
 */

import React, { useRef, useState } from "react";
import { Avatar, AVATAR_IDENTITIES } from "../../../components/ui/Avatar";
import { Popover } from "../../../components/ui/Popover";
import { MenuItem } from "../../../components/ui/MenuItem";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OccupancyState =
  | "own-occupied"   // I am the Assignee and I hold the page lock
  | "other-occupied" // Someone else holds the page lock right now
  | "other-away"     // There is an Assignee but they've left the page
  | "unassigned";    // No Assignee on this TFL

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

// ── Popover content ───────────────────────────────────────────────────────────

function AssigneePopoverContent({
  assigneeName,
  lastEditedAt,
  showTakeOver,
  onTakeOver,
  onClose,
}: {
  assigneeName: string;
  lastEditedAt?: Date;
  showTakeOver: boolean;
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

      {/* Take over action */}
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

  // Derive the occupancy state
  const occupancyState: OccupancyState = !assigneeName
    ? "unassigned"
    : assigneeName === currentUserName
    ? "own-occupied"
    : isOccupied
    ? "other-occupied"
    : "other-away";

  const isInteractive =
    occupancyState === "other-occupied" || occupancyState === "other-away";

  const isAway = occupancyState === "other-away";

  const handleClick = () => {
    if (!isInteractive) return;
    setPopoverOpen((prev) => !prev);
  };

  const avatarEl = (
    <Avatar
      name={assigneeName}
      level="page"
      disabled={isAway}
    />
  );

  return (
    <>
      {isInteractive ? (
        <button
          ref={anchorRef}
          type="button"
          onClick={handleClick}
          aria-label={
            assigneeName
              ? isAway
                ? `${assigneeName} (away) — click to take over`
                : `${assigneeName} is editing`
              : "No Assignee"
          }
          aria-expanded={popoverOpen}
          className="inline-flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-1"
        >
          {avatarEl}
        </button>
      ) : (
        // own-occupied or unassigned: no interaction, use a plain span
        <span
          aria-label={
            occupancyState === "own-occupied"
              ? `${assigneeName} (you are editing)`
              : "No Assignee"
          }
          className="inline-flex items-center"
        >
          {avatarEl}
        </span>
      )}

      {isInteractive && assigneeName && (
        <Popover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          anchorRef={anchorRef as React.RefObject<HTMLElement>}
          role="dialog"
          placement="bottom"
          align="start"
          width={220}
          offset={6}
        >
          <AssigneePopoverContent
            assigneeName={assigneeName}
            lastEditedAt={lastEditedAt}
            showTakeOver={isAway}
            onTakeOver={onTakeOver}
            onClose={() => setPopoverOpen(false)}
          />
        </Popover>
      )}
    </>
  );
}
