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
    fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 400,
    color: "#F8F7F7",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
    minHeight: "auto",
    maxWidth: "232px",
    wordBreak: "break-word",
    whiteSpace: "normal",
    textAlign: "left",
  };

  return (
    <AntdTooltip
      title={label}
      placement={align === "left" ? "bottomLeft" : "bottom"}
      align={align === "left" ? undefined : { offset: [0, 2] }}
      arrow={false}
      autoAdjustOverflow={true}
      getPopupContainer={() => document.body}
      zIndex={9999}
      color="#3C4242"
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
