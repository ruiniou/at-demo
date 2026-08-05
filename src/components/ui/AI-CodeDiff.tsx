import React, { useState } from "react";
import arrowRightIconUrl from "../../icons/arrow-right-s-line.svg";
import arrowDownIconUrl from "../../icons/arrow-down-s-line.svg";
import fileCopyIconUrl from "../../icons/file-copy-line.svg";

const TEXT_SECONDARY_FILTER =
  "brightness(0) saturate(100%) invert(64%) sepia(5%) saturate(446%) hue-rotate(136deg) brightness(90%) contrast(91%)";

export interface DiffLine {
  content: string;
}

export interface AICodeDiffProps {
  summary?: string;
  additions?: DiffLine[];
  deletions?: DiffLine[];
  additionCount?: number;
  deletionCount?: number;
  defaultExpanded?: boolean;
  onCopy?: () => void;
  className?: string;
}

export function AICodeDiff({
  summary = "Lines 3-7",
  additions = [
    { content: "= 'AZD999\\n1 mg/kg'" },
    { content: "= 'AZD999\\n2 mg/kg'" },
    { content: "= 'Investigator choice of therapy'" },
    { content: "= 'Total'" },
  ],
  deletions = [
    { content: "= 'AZD999\\n1 mg/kg'" },
    { content: "= 'AZD999\\n2 mg/kg'" },
    { content: "= 'AZD999\\nTotal'" },
    { content: "= 'Investigator choice of therapy'" },
    { content: "= 'Total'" },
  ],
  additionCount,
  deletionCount,
  defaultExpanded = false,
  onCopy,
  className = "",
}: AICodeDiffProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [hovered, setHovered] = useState(false);

  const addCount = additionCount ?? additions.length;
  const delCount = deletionCount ?? deletions.length;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "bg-white border-[0.6px] border-graphite-20 rounded-[8px]",
        "flex flex-col",
        className,
      ].join(" ")}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className={[
          "flex items-center justify-between px-[10px] py-[8px] cursor-pointer select-none transition-colors",
          hovered ? "bg-bg-panel" : "bg-transparent",
        ].join(" ")}
      >
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <img
              src={expanded ? arrowDownIconUrl : arrowRightIconUrl}
              alt=""
              aria-hidden="true"
              className="w-[16px] h-[16px] block shrink-0"
              style={{ filter: TEXT_SECONDARY_FILTER }}
            />
            <span className="t-body-compact text-text-primary">{summary}</span>
          </div>
          <div className="flex items-center gap-[4px]">
            {addCount > 0 && (
              <span className="t-small text-code-success">+{addCount}</span>
            )}
            {delCount > 0 && (
              <span className="t-small text-status-error">-{delCount}</span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy?.();
          }}
          className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-graphite-10 transition-colors shrink-0"
        >
          <img
            src={fileCopyIconUrl}
            alt="Copy"
            className="w-[16px] h-[16px] block"
            style={{ filter: TEXT_SECONDARY_FILTER }}
          />
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col border-t-[0.6px] border-graphite-10">
          <div className="overflow-x-auto overflow-y-auto">
            {deletions.length > 0 && (
              <div className="bg-[#FDECEA] border-l-[3px] border-brand-1 py-[4px] min-w-max">
                {deletions.map((line, idx) => (
                  <div key={idx} className="flex items-stretch px-[10px]">
                    <div className="w-[16px] shrink-0 flex items-center justify-center">
                      <span className="t-code text-text-secondary leading-[20px]">-</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <code className="t-code text-text-secondary leading-[20px]">{line.content}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {additions.length > 0 && (
              <div className="bg-[#E6F4EA] border-l-[3px] border-code-success py-[4px] min-w-max">
                {additions.map((line, idx) => (
                  <div key={idx} className="flex items-stretch px-[10px]">
                    <div className="w-[16px] shrink-0 flex items-center justify-center">
                      <span className="t-code text-text-secondary leading-[20px]">+</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <code className="t-code text-text-secondary leading-[20px]">{line.content}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AICodeDiff;
