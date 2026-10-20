import React, { forwardRef } from "react";
import closeIconUrl from "../../icons/close-line.svg";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Callback when close icon is clicked. If omitted, close icon is hidden. */
  onClose?: () => void;
  /**
   * Visual variant:
   * - "default": bg graphite-10 (#EBECEC), text text-primary (#3C4242)
   * - "brand" | "filter": bg #F4E8EE, text #830051, border #830051/25.
   *   Used when the Tag's container/field has the same default background (e.g. graphite-10 search bar).
   */
  variant?: "default" | "brand" | "filter";
}

/**
 * Tag component — Figma node 1156:6715
 * Status=Default: bg graphite-10 (#EBECEC), text text-primary (#3C4242)
 * Removable tags hover to graphite-20 (#D8DADA); display-only tags stay static.
 *
 * Layout: row, padding 2px 6px, gap 4px, hug content
 * Text: PingFang SC, Regular 400, 12px / 20px
 * Close icon: 12×12 close-line
 */
const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, onClose, variant = "default", className = "", ...props }, ref) => {
    const isBrand = variant === "brand" || variant === "filter";

    const baseClasses = isBrand
      ? `bg-az-secondary text-brand-1 ${onClose ? "hover:bg-az-secondary-hover" : ""}`
      : `bg-graphite-10 text-text-primary ${onClose ? "hover:bg-graphite-20" : ""}`;

    const textColor = isBrand ? "var(--color-brand-1, #830051)" : "var(--color-text-primary)";

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-[4px] rounded-[4px] px-[6px] py-[2px] transition-colors min-w-0 ${baseClasses} ${className}`}
        {...props}
      >
        <span
          style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: textColor,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            maxWidth: "100%",
          }}
        >
          {children}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center justify-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            style={{ width: 12, height: 12 }}
            aria-label="Remove tag"
          >
            <img
              src={closeIconUrl}
              alt=""
              className="h-[12px] w-[12px]"
              style={
                isBrand
                  ? {
                      filter:
                        "invert(13%) sepia(85%) saturate(3755%) hue-rotate(310deg) brightness(88%) contrast(106%)",
                    }
                  : undefined
              }
            />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = "Tag";

// ==================== GroupTag Variant ====================

export interface GroupTagItem {
  key: string;
  label: string;
}

export interface GroupTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefix: string;
  items: GroupTagItem[];
  onRemoveItem?: (key: string) => void;
  disabled?: boolean;
}

/**
 * GroupTag component — Consolidated tag grouping variables under the same dataset namespace.
 * The dataset prefix stays on the left; each variable is its own chip, so a long group wraps
 * onto lines that line up under the first chip instead of running on after a comma.
 * E.g. ADSL.  [AAGE ✕] [SEX ✕]
 */
const GroupTag = forwardRef<HTMLSpanElement, GroupTagProps>(
  ({ prefix, items, onRemoveItem, disabled = false, className = "", ...props }, ref) => {
    if (!items || items.length === 0) return null;
    const removable = Boolean(onRemoveItem) && !disabled;

    return (
      <span
        ref={ref}
        className={`inline-flex items-start gap-[6px] rounded-[4px] bg-graphite-10 px-[6px] py-[3px] max-w-full min-w-0 transition-colors ${className}`}
        {...props}
      >
        {/* Dataset prefix */}
        <span
          className="shrink-0 select-none text-[12px] font-normal leading-[20px] text-[#888E8E]"
          style={{ fontFamily: "'PingFang SC', sans-serif" }}
        >
          {prefix}.
        </span>

        {/* One chip per variable */}
        <span className="flex min-w-0 flex-wrap items-center gap-[4px]">
          {items.map((item) => (
            <span
              key={item.key}
              className={`group/item inline-flex h-[20px] max-w-full items-center gap-[2px] rounded-[3px] bg-white pl-[6px] ${removable ? "pr-[2px]" : "pr-[6px]"} transition-colors ${removable ? "hover:bg-bg-panel" : ""}`}
            >
              <span
                className="truncate text-[12px] font-medium leading-[20px] text-text-primary"
                style={{ fontFamily: "'PingFang SC', sans-serif" }}
              >
                {item.label}
              </span>
              {removable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem?.(item.key);
                  }}
                  className="flex shrink-0 cursor-pointer items-center justify-center rounded-[2px] hover:bg-black/10 active:scale-[0.92]"
                  style={{ width: 16, height: 16 }}
                  aria-label={`Remove ${item.label}`}
                >
                  <img src={closeIconUrl} alt="" className="h-[10px] w-[10px] opacity-70 group-hover/item:opacity-100" />
                </button>
              )}
            </span>
          ))}
        </span>
      </span>
    );
  }
);

GroupTag.displayName = "GroupTag";

export { Tag, GroupTag };
