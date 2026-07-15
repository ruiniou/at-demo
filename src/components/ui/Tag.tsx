import React, { forwardRef } from "react";
import closeIconUrl from "../../icons/close-line.svg";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Callback when close icon is clicked. If omitted, close icon is hidden. */
  onClose?: () => void;
}

/**
 * Tag component — Figma node 1156:6715
 * Status=Default: bg graphite-10 (#EBECEC), text text-primary (#3C4242)
 * Status=Hovered: bg graphite-20 (#D8DADA)
 *
 * Layout: row, padding 2px 6px, gap 4px, hug content
 * Text: Inter, Regular 400, 12px / 20px
 * Close icon: 12×12 close-line
 */
const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, onClose, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-[4px] rounded-[4px] bg-graphite-10 px-[6px] py-[2px] hover:bg-graphite-20 transition-colors min-w-0 ${className}`}
        {...props}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: "var(--color-text-primary)",
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
            className="flex shrink-0 items-center justify-center"
            style={{ width: 12, height: 12 }}
            aria-label="Remove tag"
          >
            <img src={closeIconUrl} alt="" className="h-[12px] w-[12px]" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = "Tag";

export { Tag };
