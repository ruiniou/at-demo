import React, { useState } from "react";
import wrenchIconUrl from "../../icons/wrench-line.svg";
import arrowRightIconUrl from "../../icons/arrow-right-s-line.svg";
import arrowDownIconUrl from "../../icons/arrow-down-s-line.svg";

const TEXT_SECONDARY_FILTER =
  "brightness(0) saturate(100%) invert(64%) sepia(5%) saturate(446%) hue-rotate(136deg) brightness(90%) contrast(91%)";

export interface AIToolCallProps {
  toolName?: string;
  arguments?: string[];
  result?: string[];
  defaultExpanded?: boolean;
  className?: string;
}

export function AIToolCall({
  toolName = "Tool name",
  arguments: args = ["code area", "proc format;"],
  result: results = ["Result detail"],
  defaultExpanded = false,
  className = "",
}: AIToolCallProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "border-[0.6px] border-graphite-10 rounded-[4px]",
        "flex flex-col",
        className,
      ].join(" ")}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className={[
          "flex items-center gap-[6px] px-[10px] py-[8px] cursor-pointer select-none rounded-[3px] transition-colors",
          hovered ? "bg-bg-light" : "bg-transparent",
        ].join(" ")}
      >
        <img
          src={expanded ? arrowDownIconUrl : arrowRightIconUrl}
          alt=""
          aria-hidden="true"
          className="w-[16px] h-[16px] block shrink-0"
          style={{ filter: TEXT_SECONDARY_FILTER }}
        />
        <img
          src={wrenchIconUrl}
          alt=""
          aria-hidden="true"
          className="w-[16px] h-[16px] block shrink-0"
          style={{ filter: TEXT_SECONDARY_FILTER }}
        />
        <span className="t-body-compact text-text-primary">
          {toolName}
        </span>
      </div>

      {expanded && (
        <div className="flex flex-col gap-[8px] pt-[8px] pb-[10px] border-t-[0.6px] border-graphite-10">
          <div className="flex flex-col gap-[4px] px-[12px]">
            <span className="t-caption text-text-secondary">Arguments</span>
            <div className="bg-bg-light rounded-[2px] py-[4px]">
              {args.map((line, idx) => (
                <div key={idx} className="px-[10px] h-[20px] flex items-center">
                  <code className="t-code text-text-secondary">{line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[4px] px-[12px]">
            <span className="t-caption text-text-secondary">Result</span>
            <div className="bg-bg-light rounded-[2px] py-[4px]">
              {results.map((line, idx) => (
                <div key={idx} className="px-[10px] h-[20px] flex items-center">
                  <code className="t-code text-text-secondary">{line}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIToolCall;
