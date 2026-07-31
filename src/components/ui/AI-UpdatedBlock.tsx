import React, { useMemo, useState } from "react";
import { Button } from "./Button";

/**
 * Each review item in the expanded list.
 * `text` supports an inline strikethrough convention: `~~old~~ → new` will be
 * rendered as a struck-through "old" followed by an arrow and "new".
 */
export interface AIUpdatedBlockItem {
  label: string;
  text: string;
  onClick?: () => void;
}

export type AIUpdatedBlockExpanded = "no" | "brief" | "scrollable";

export interface AIUpdatedBlockProps {
  /** Title shown in the summary row. */
  title?: string;
  /** Numeric badge shown on the right of the summary row. */
  count?: number | string;
  /** Which visual state the block should render. */
  expanded?: AIUpdatedBlockExpanded;
  /** Allow the user to toggle between collapsed and the provided expanded state. */
  toggleable?: boolean;
  /** Default visual state when `expanded` is not provided. */
  defaultExpanded?: AIUpdatedBlockExpanded;
  /** Items rendered inside the expanded list section. */
  items?: AIUpdatedBlockItem[];
  /** Optional custom list body. When provided, `items` is ignored. */
  children?: React.ReactNode;
  /** Height (px) of the scrollable list wrapper in the `scrollable` state. */
  scrollHeight?: number;
  onCancel?: () => void;
  onProceed?: () => void;
  className?: string;
}

/**
 * Renders inline strikethrough segments of the form `~~old~~ → new`.
 * Falls back to plain text when no `~~...~~` segment is found.
 */
function renderInlineStrike(text: string) {
  const pattern = /~~([^~]+)~~/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <span
        key={key++}
        className="line-through"
        style={{ textDecorationColor: "#B2B4B4" }}
      >
        {match[1]}
      </span>
    );
    lastIndex = pattern.lastIndex;
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

/**
 * AIUpdatedBlock — "Block/Updated" component for the AI Copilot conversation
 * flow. Three visual states, strictly bound to Atlas design tokens
 * (Figma node 506:4651, 3.0-Figure file).
 *
 *   - Expanded=No         Collapsed summary row only.
 *   - Expanded=Brief      Expanded with an inline list of review items.
 *   - Expanded=Scrollable Expanded with a fixed-height, vertically scrollable
 *                         list and an overlay 4px scrollbar.
 */
export function AIUpdatedBlock({
  title = "To be Updated",
  count = 3,
  expanded,
  toggleable = true,
  defaultExpanded = "no",
  items = [],
  children,
  scrollHeight = 232,
  onCancel,
  onProceed,
  className = "",
}: AIUpdatedBlockProps) {
  const [internalExpanded, setInternalExpanded] =
    useState<AIUpdatedBlockExpanded>(expanded ?? defaultExpanded);
  const [headerHovered, setHeaderHovered] = useState(false);
  const isExpanded = internalExpanded;

  const showList = isExpanded === "brief" || isExpanded === "scrollable";
  const showFooter = showList;

  const handleToggle = () => {
    if (!toggleable) return;
    setInternalExpanded((prev: AIUpdatedBlockExpanded) => {
      if (prev === "no") return "brief";
      return "no";
    });
  };

  const summaryBorder = useMemo(
    () => (showList ? "border-b border-graphite-10" : ""),
    [showList]
  );

  return (
    <div
      className={[
        "flex flex-col",
        "bg-white border border-graphite-10 rounded-[6px]",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* ---- Summary row ---- */}
      <div
        onClick={handleToggle}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        className={[
          "flex items-center gap-[6px] px-[12px] py-[8px]",
          "w-full",
          "transition-colors",
          toggleable ? "cursor-pointer select-none" : "select-text",
          headerHovered ? "bg-bg-panel" : "bg-transparent",
          summaryBorder,
        ].join(" ")}
      >
        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
          <svg
            className={`w-full h-full transition-transform ${isExpanded === "no" ? "-rotate-90" : "rotate-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0001 13.1714L16.9499 8.22168L18.3641 9.63589L12.0001 15.9999L5.63623 9.63589L7.05044 8.22168L12.0001 13.1714Z"
              fill="#888E8E"
            />
          </svg>
        </div>
        <span
          className="text-[14px] leading-[24px] font-medium text-text-primary"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {title}
        </span>
        <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
          <span className="text-[10px] leading-[14px] font-medium text-text-secondary">
            {count}
          </span>
        </div>
      </div>

      {/* ---- Expanded list ---- */}
      {showList && (
        <div
          className={
            isExpanded === "scrollable"
              ? "flex flex-row self-stretch"
              : "flex flex-col"
          }
        >
          <div
            className={[
              "flex flex-col flex-1 min-w-0",
              "pt-[2px] pb-[6px]",
              isExpanded === "scrollable"
                ? "overflow-y-auto"
                : "",
            ].join(" ")}
            style={
              isExpanded === "scrollable"
                ? { maxHeight: scrollHeight }
                : undefined
            }
          >
            {children
              ? children
              : items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.onClick}
                    className={[
                      "flex items-center gap-[8px] h-[32px] px-[10px] py-[6px]",
                      "self-stretch",
                      item.onClick ? "cursor-pointer hover:bg-bg-panel transition-colors group" : ""
                    ].join(" ")}
                  >
                    <span className="shrink-0 t-small-medium text-text-primary leading-[18px]">
                      {item.label}
                    </span>
                    <span className="flex-1 min-w-0 t-small text-graphite-50 leading-[16px] truncate">
                      {renderInlineStrike(item.text)}
                    </span>
                  </div>
                ))}
          </div>

        </div>
      )}

      {/* ---- Footer action bar ---- */}
      {showFooter && (
        <div
          className={[
            "flex items-center justify-end gap-[6px]",
            "px-[12px] py-[8px]",
            "bg-bg-panel",
            "border-t border-graphite-10",
          ].join(" ")}
          style={{ borderTopWidth: "0.6px" }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-[28px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onProceed}
            className="h-[28px]"
          >
            Proceed
          </Button>
        </div>
      )}
    </div>
  );
}

export default AIUpdatedBlock;
