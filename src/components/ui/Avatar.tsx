import React from "react";
import emptyAssigneeUrl from "../../icons/empty-assignee.svg";

export type AvatarLevel = "page" | "modal" | "menu";

/** Shared identity palette; colors identify people, not roles or status. */
export const AVATAR_IDENTITIES: Record<string, { color: string; initials: string }> = {
  "Sarah Chen": { color: "#f0ab00", initials: "SC" },
  "James Park": { color: "#830051", initials: "JP" },
  "Priya Sharma": { color: "#d0006f", initials: "PS" },
  "Alex Kim": { color: "#7c8db0", initials: "AK" },
  "Tom Chen": { color: "#0077b6", initials: "TC" },
  "Tom": { color: "#2d72d2", initials: "TM" },
  "Emily Liu": { color: "#2d6a4f", initials: "EL" },
};

const levelClasses = {
  page: "size-6 text-[10px]",
  modal: "size-5 text-[9px]",
  menu: "size-5 text-[9px]",
};

export interface AvatarProps {
  name?: string;
  initials?: string;
  color?: string;
  level?: AvatarLevel;
  disabled?: boolean;
  stacked?: boolean;
}

export function Avatar({ name, initials, color, level = "modal", disabled = false, stacked = false }: AvatarProps) {
  const identity = name ? AVATAR_IDENTITIES[name] : undefined;
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const fallback = words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0]?.slice(0, 2);
  const letters = (identity?.initials ?? initials ?? fallback ?? "").toUpperCase();
  const emptyAssigneeMask = `url("${emptyAssigneeUrl}") center / contain no-repeat`;
  return (
    <span role="img" aria-label={name || "No Assignee"} title={name || "No Assignee"}
      className={`inline-flex shrink-0 items-center justify-center rounded-full select-none font-medium leading-none text-white ${levelClasses[level]} ${stacked ? "ring-2 ring-white" : ""} ${disabled ? "opacity-40" : ""}`}
      style={{
        backgroundColor: name ? identity?.color ?? color ?? "var(--color-text-secondary)" : undefined,
        fontFamily: "var(--font-body)",
      }}>
      {name ? (
        <span className="flex size-full translate-y-[0.5px] items-center justify-center text-center leading-none select-none tracking-normal">
          {letters}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="size-full bg-text-secondary opacity-45"
          style={{ mask: emptyAssigneeMask, WebkitMask: emptyAssigneeMask }}
        />
      )}
    </span>
  );
}

export function AvatarGroup({ members, max = 5, level = "modal" }: {
  members: Array<{ name: string; initials?: string; color?: string }>;
  max?: number;
  level?: AvatarLevel;
}) {
  const visible = members.slice(0, Math.max(1, max));
  const remaining = members.length - visible.length;
  return (
    <span className="inline-flex items-center">
      {visible.map((member, index) => (
        <span key={member.name} className={index ? "-ml-1.5 inline-flex" : "inline-flex"} style={{ zIndex: visible.length - index }}>
          <Avatar {...member} level={level} stacked />
        </span>
      ))}
      {remaining > 0 && <span title={`${remaining} more members`} aria-label={`${remaining} more members`}
        className={`-ml-1.5 inline-flex shrink-0 items-center justify-center rounded-full bg-bg-panel text-center text-text-secondary font-medium leading-none ring-2 ring-white ${levelClasses[level]}`}
        style={{ fontFamily: "var(--font-body)" }}><span className="translate-y-[0.5px]">+{remaining}</span></span>}
    </span>
  );
}
