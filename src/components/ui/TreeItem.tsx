import React, { useState } from "react";

export interface TreeItemRowProps {
  id: string;
  label: string;
  level?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  isLocked?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  /**
   * When false (e.g. Section items), the row has no selected state.
   * Clicking toggles expand instead of selecting.
   */
  selectable?: boolean;
  
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  
  onSelect?: (id: string) => void;
  onHoverChange?: (id: string | null) => void;
  onToggleExpand?: (id: string) => void;
}

export function TreeItemRow({
  id,
  label,
  level = 0,
  isSelected = false,
  isHovered = false,
  isLocked = false,
  isExpanded = false,
  hasChildren = false,
  selectable = true,
  icon,
  rightElement,
  onSelect,
  onHoverChange,
  onToggleExpand,
}: TreeItemRowProps) {
  const [localHovered, setLocalHovered] = useState(false);
  const hovered = isHovered || localHovered;
  const paddingLeft = level === 0 ? "px-[12px]" : `pr-[12px] pl-[${12 + level * 12}px]`;

  const handleClick = () => {
    if (!selectable && hasChildren && onToggleExpand) {
      onToggleExpand(id);
    } else {
      onSelect?.(id);
    }
  };

  const handleMouseEnter = () => {
    setLocalHovered(true);
    onHoverChange?.(id);
  };

  const handleMouseLeave = () => {
    setLocalHovered(false);
    onHoverChange?.(null);
  };

  return (
    <div
      className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors ${
        selectable && isSelected ? "bg-az-secondary" : hovered ? "bg-graphite-10" : ""
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex h-full items-center justify-between ${paddingLeft}`}>
        <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
          {hasChildren && onToggleExpand ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(id);
              }}
              className="flex h-[16px] w-[16px] shrink-0 items-center justify-center active:scale-[0.96]"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {icon}
            </button>
          ) : (
            icon
          )}
          <p
            className={`t-small min-w-0 flex-1 truncate ${
              isLocked ? "text-graphite-40" : selectable && isSelected ? "text-brand-1" : "text-text-primary"
            }`}
          >
            {label}
          </p>
        </div>
        {rightElement}
      </div>
    </div>
  );
}
