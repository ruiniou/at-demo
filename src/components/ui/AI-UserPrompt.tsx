import React from "react";
import { AITagMini } from "./AI-TagMini";

export interface AIUserPromptProps {
  content: string;
  tag?: string;
  className?: string;
}

export function AIUserPrompt({
  content,
  tag,
  className = "",
}: AIUserPromptProps) {
  const paragraphs = content.split("\n");

  return (
    <div
      className={[
        "bg-bg-panel border border-graphite-10 rounded-[8px] px-[12px] py-[8px]",
        "flex flex-col gap-[4px] justify-end max-w-[85%] self-end",
        className,
      ].join(" ")}
    >
      {tag && (
        <div className="flex">
          <AITagMini>{tag}</AITagMini>
        </div>
      )}
      <div className="flex flex-col gap-[4px] t-body text-text-primary font-normal break-words whitespace-pre-wrap w-full">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="break-words whitespace-pre-wrap">{para}</p>
        ))}
      </div>
    </div>
  );
}

export default AIUserPrompt;
