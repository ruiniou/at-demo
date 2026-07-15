import React from "react";
import { Tooltip as AntdTooltip } from "antd";

export interface TooltipProps {
  label: React.ReactNode;
  children: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function Tooltip({ label, children, align = "center", className = "" }: TooltipProps) {
  const overlayInnerStyle: React.CSSProperties = {
    borderRadius: "4px",
    padding: "4px 6px",
    fontSize: "12px",
    lineHeight: "16px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 400,
    color: "var(--color-bg-panel)",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
    minHeight: "auto",
    ...(align === "left"
      ? {
          maxWidth: "232px",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }
      : {
          whiteSpace: "nowrap",
        }),
  };

  return (
    <AntdTooltip
      title={label}
      placement={align === "left" ? "bottomLeft" : "bottom"}
      align={{ offset: align === "left" ? [0, 0] : [0, 2] }}
      arrow={false}
      autoAdjustOverflow={true}
      getPopupContainer={() => document.body}
      zIndex={9999}
      color="var(--color-text-primary)"
      overlayInnerStyle={overlayInnerStyle}
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
