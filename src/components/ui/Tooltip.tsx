import React from "react";
import { Tooltip as AntdTooltip } from "antd";

/** One labelled section of a Metadata-Table tooltip — Figma 275:1628 / 280:1611 */
export interface TooltipMetadataSection {
  label: string;
  values: React.ReactNode[];
  /** Rendered in the muted label color, e.g. "+3 more" — Figma 280:1622 */
  more?: string;
  /** Clamp each value to N lines with an ellipsis — Figma 280:1620 clamps to 2. */
  clampLines?: number;
}

export type TooltipVariant = "default" | "metadata-table" | "metadata-table-extreme";

export interface TooltipProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  /** Figma 271:8834 Tooltip type. Defaults to "default". */
  variant?: TooltipVariant;
  /** Sections for the metadata-table variants. */
  sections?: TooltipMetadataSection[];
}

const TOOLTIP_FONT_FAMILY =
  "'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/** Metadata-Table body — hug width; Extreme is fixed at 240px. Figma 275:1626 / 280:1610 */
function MetadataTableContent({
  sections,
  extreme,
}: {
  sections: TooltipMetadataSection[];
  extreme: boolean;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      {sections.map((section, i) => (
        <div key={i} className={`flex flex-col gap-[2px] ${extreme ? "items-stretch" : "items-start"}`}>
          <span className="t-footnote text-tooltip-label">{section.label}</span>
          {section.values.map((value, j) => (
            <span
              key={j}
              className="t-small text-tooltip-text"
              style={
                section.clampLines
                  ? {
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: section.clampLines,
                      overflow: "hidden",
                    }
                  : undefined
              }
            >
              {value}
            </span>
          ))}
          {section.more && (
            <span className="t-small text-tooltip-label">{section.more}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function Tooltip({
  label,
  children,
  align = "center",
  className = "",
  variant = "default",
  sections,
}: TooltipProps) {
  const isMetadata = variant === "metadata-table" || variant === "metadata-table-extreme";
  const isExtreme = variant === "metadata-table-extreme";

  const overlayInnerStyle: React.CSSProperties = isMetadata
    ? {
        borderRadius: "4px",
        padding: "6px 8px",
        fontFamily: TOOLTIP_FONT_FAMILY,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        minHeight: "auto",
        width: isExtreme ? "240px" : "auto",
        maxWidth: isExtreme ? "240px" : "none",
        wordBreak: "break-word",
        whiteSpace: isExtreme ? "normal" : "nowrap",
        textAlign: "left",
      }
    : {
        borderRadius: "4px",
        padding: "4px 6px",
        fontSize: "12px",
        lineHeight: "16px",
        fontFamily: TOOLTIP_FONT_FAMILY,
        fontWeight: 400,
        color: "var(--color-tooltip-text)",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
        minHeight: "auto",
        maxWidth: "232px",
        wordBreak: "break-word",
        whiteSpace: "normal",
        textAlign: "left",
      };

  const title =
    isMetadata && sections?.length ? (
      <MetadataTableContent sections={sections} extreme={isExtreme} />
    ) : (
      label
    );

  return (
    <AntdTooltip
      title={title}
      placement={align === "left" ? "bottomLeft" : "bottom"}
      align={align === "left" ? undefined : { offset: [0, 2] }}
      arrow={false}
      autoAdjustOverflow={true}
      getPopupContainer={() => document.body}
      zIndex={9999}
      color="var(--color-tooltip-bg)"
      styles={{ container: overlayInnerStyle }}
      transitionName=""
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
    >
      <span className={`inline-flex ${className}`}>
        {children}
      </span>
    </AntdTooltip>
  );
}
