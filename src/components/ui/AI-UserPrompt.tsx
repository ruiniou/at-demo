import React from "react";
import { AITagMini } from "./AI-TagMini";
import fileInfoLineUrl from "../../icons/file-info-line.svg";

export interface AIUserPromptProps {
  content: string;
  tag?: string;
  toBeUpdatedCount?: number;
  className?: string;
}

export function AIUserPrompt({
  content,
  tag,
  toBeUpdatedCount,
  className = "",
}: AIUserPromptProps) {
  const paragraphs = content.split("\n");

  return (
    <div
      className={[
        "bg-white border-[0.6px] border-graphite-20 rounded-[8px] px-[10px] py-[8px]",
        "flex flex-col gap-[4px] justify-end",
        className,
      ].join(" ")}
    >
      {toBeUpdatedCount !== undefined && toBeUpdatedCount > 0 && (
        <div className="flex items-center gap-[6px] pb-[4px] border-b border-graphite-10 mb-[2px]">
          <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
            <img src={fileInfoLineUrl} alt="To be Updated" className="w-full h-full" style={{ filter: 'invert(37%) sepia(5%) saturate(543%) hue-rotate(137deg) brightness(98%) contrast(85%)' }} />
          </div>
          <span className="text-[12px] font-medium text-text-primary" style={{ fontFamily: "var(--font-body)" }}>To be Updated</span>
          <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
            <span className="text-[10px] leading-[14px] font-medium text-text-secondary">{toBeUpdatedCount}</span>
          </div>
        </div>
      )}
      {tag && (
        <div className="flex">
          <AITagMini>{tag}</AITagMini>
        </div>
      )}
      <div className="flex flex-col gap-[4px] t-body text-text-secondary break-words whitespace-pre-wrap w-full">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="break-words whitespace-pre-wrap">{para}</p>
        ))}
      </div>
    </div>
  );
}

export default AIUserPrompt;
