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
        "bg-bg-light rounded-[8px] px-[10px] py-[8px]",
        "flex flex-col gap-[4px] justify-end",
        className,
      ].join(" ")}
    >
      {tag && (
        <div className="flex">
          <AITagMini>{tag}</AITagMini>
        </div>
      )}
      <div className="flex flex-col gap-[4px] t-body text-text-secondary">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export default AIUserPrompt;
