import React from "react";
import codeLineIconUrl from "../../icons/code-line.svg";

export interface AITagMiniProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AITagMini({
  text = "Table.1(290-321)",
  children,
  className = "",
}: AITagMiniProps) {
  return (
    <div
      className={[
        "bg-az-secondary rounded-[4px] h-[20px]",
        "flex items-center gap-[4px] pl-[2px] pr-[6px]",
        "shrink-0",
        className,
      ].join(" ")}
    >
      <img
        src={codeLineIconUrl}
        alt=""
        aria-hidden="true"
        className="w-[16px] h-[16px] block shrink-0"
      />
      <span className="t-caption text-brand-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {children ?? text}
      </span>
    </div>
  );
}

export default AITagMini;
