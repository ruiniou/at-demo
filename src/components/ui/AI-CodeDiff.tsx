import React, { useState } from "react";

export interface DiffLine {
  content: string;
  lineNumber?: number;
}

export interface AICodeDiffProps {
  additions?: DiffLine[];
  deletions?: DiffLine[];
  additionCount?: number;
  deletionCount?: number;
  defaultExpanded?: boolean;
  className?: string;
}

export function AICodeDiff({
  additions = [
    { content: "'AZD999 Cohort A (10 mg/kg)'", lineNumber: 1 },
    { content: "'AZD999 Cohort B (20 mg/kg)'", lineNumber: 2 },
    { content: "'Investigator Choice of Therapy'", lineNumber: 3 },
    { content: "'Total (All Cohorts)'", lineNumber: 4 },
  ],
  deletions = [
    { content: "'AZD999 10 mg/kg'", lineNumber: 1 },
    { content: "'AZD999 20 mg/kg'", lineNumber: 2 },
    { content: "'Investigator Choice'", lineNumber: 3 },
    { content: "'Total'", lineNumber: 4 },
  ],
  additionCount,
  deletionCount,
  defaultExpanded = false,
  className = "",
}: AICodeDiffProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const addCount = additionCount ?? additions.length;
  const delCount = deletionCount ?? deletions.length;

  return (
    <div className={`overflow-hidden rounded-[8px] border border-graphite-20 bg-white ${className}`}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(value => !value)}
        className="flex min-h-[44px] w-full items-center gap-[8px] px-[12px] text-left hover:bg-bg-panel active:bg-graphite-10"
      >
        <svg className="h-[16px] w-[16px] shrink-0 text-text-secondary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23 12 17.8145 17.1855 16.5182 15.889 20.4073 12 16.5182 8.11091 17.8145 6.81455 23 12ZM3.59273 12 7.48181 15.889 6.18545 17.1855 1 12 6.18545 6.81455 7.48181 8.11091 3.59273 12ZM9.97275 20.25H8.02175L14.0273 3.75H15.9782L9.97275 20.25Z" />
        </svg>
        <span className="t-body-compact text-text-primary">Edited code</span>
        <span className="ml-[4px] flex gap-[6px] t-small tabular-nums">
          <span className="text-code-success">+{addCount}</span>
          <span className="text-status-error">-{delCount}</span>
        </span>
        <svg className={`ml-auto h-[16px] w-[16px] shrink-0 text-text-secondary transition-transform ${expanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded && (
        <div className="max-h-[260px] overflow-auto border-t border-graphite-10 font-mono t-code">
          {deletions.map((line, index) => (
            <div key={`remove-${index}`} className="flex min-w-max gap-[8px] border-l-[3px] border-brand-1 bg-[#FDECEA] px-[8px] leading-[20px] text-text-secondary">
              <span aria-hidden="true">−</span><span className="w-[24px] text-right tabular-nums">{line.lineNumber ?? index + 1}</span><code className="whitespace-pre">{line.content}</code>
            </div>
          ))}
          {additions.map((line, index) => (
            <div key={`add-${index}`} className="flex min-w-max gap-[8px] border-l-[3px] border-code-success bg-[#E6F4EA] px-[8px] leading-[20px] text-text-secondary">
              <span aria-hidden="true">+</span><span className="w-[24px] text-right tabular-nums">{line.lineNumber ?? index + 1}</span><code className="whitespace-pre">{line.content}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AICodeDiff;
