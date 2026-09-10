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
 * Status=Hovered: bg graphite-20 (#D8DADA)
 *
 * Layout: row, padding 2px 6px, gap 4px, hug content
 * Text: PingFang SC, Regular 400, 12px / 20px
 * Close icon: 12×12 close-line
 */
const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, onClose, variant = "default", className = "", ...props }, ref) => {
    const isBrand = variant === "brand" || variant === "filter";

    const baseClasses = isBrand
      ? "bg-az-secondary hover:bg-az-secondary-hover text-brand-1"
      : "bg-graphite-10 hover:bg-graphite-20 text-text-primary";

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
 * GroupTag component — Consolidated tag grouping variables under the same dataset namespace
 * E.g. ADSL. AAGE ✕ , SEX ✕
 */
const GroupTag = forwardRef<HTMLSpanElement, GroupTagProps>(
  ({ prefix, items, onRemoveItem, disabled = false, className = "", ...props }, ref) => {
    if (!items || items.length === 0) return null;

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-[4px] bg-graphite-10 px-[6px] py-[2px] max-w-full min-w-0 transition-colors ${className}`}
        {...props}
      >
        {/* Dataset prefix */}
        <span
          className="text-[#888E8E] font-normal shrink-0 text-[12px] leading-[20px] select-none"
          style={{ fontFamily: "'PingFang SC', sans-serif" }}
        >
          {prefix}.
        </span>

        {/* Variables inside the group */}
        <span className="inline-flex items-center flex-wrap gap-x-[2px] gap-y-[1px] ml-[2px]">
          {items.map((item, idx) => (
            <React.Fragment key={item.key}>
              <span className="inline-flex items-center gap-[2px] rounded-[2px] px-[2px] py-[0px] hover:bg-graphite-20 transition-colors group/item">
                <span
                  className="text-text-primary font-medium text-[12px] leading-[20px]"
                  style={{ fontFamily: "'PingFang SC', sans-serif" }}
                >
                  {item.label}
                </span>
                {onRemoveItem && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.key);
                    }}
                    className="flex shrink-0 items-center justify-center p-[1px] rounded-[2px] hover:bg-black/10 active:scale-[0.92] cursor-pointer"
                    style={{ width: 12, height: 12 }}
                    aria-label={`Remove ${item.label}`}
                  >
                    <img src={closeIconUrl} alt="" className="h-[10px] w-[10px] opacity-70 group-hover/item:opacity-100" />
                  </button>
                )}
              </span>
              {idx < items.length - 1 && (
                <span className="text-[#888E8E] text-[12px] leading-[20px] select-none mr-[2px]">,</span>
              )}
            </React.Fragment>
          ))}
        </span>
      </span>
    );
  }
);

GroupTag.displayName = "GroupTag";

export { Tag, GroupTag };
