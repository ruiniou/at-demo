import React from "react";
import pauseCircleIconUrl from "../../icons/pause-circle-line.svg";

const WARNING_FILTER =
  "brightness(0) saturate(100%) invert(67%) sepia(90%) saturate(730%) hue-rotate(5deg) brightness(103%) contrast(103%)";

export type AIThinkingStatusType = "loading" | "waiting" | "completed";

export interface AIThinkingStatusProps {
  status?: AIThinkingStatusType;
  className?: string;
}

export function AIThinkingStatus({
  status = "loading",
  className = "",
}: AIThinkingStatusProps) {
  if (status === "completed") {
    return null;
  }

  const renderIcon = () => {
    if (status === "loading") {
      return (
        <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center">
          <div className="w-[12px] h-[12px] border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (status === "waiting") {
      return (
        <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[4px] bg-status-warning-bg">
          <img
            src={pauseCircleIconUrl}
            alt=""
            aria-hidden="true"
            className="w-[16px] h-[16px] block shrink-0"
            style={{ filter: WARNING_FILTER }}
          />
        </div>
      );
    }
    return null;
  };

  const textClass =
    status === "waiting" ? "t-body-secondary text-text-primary" : "t-body-secondary text-text-secondary";

  const labels: Record<AIThinkingStatusType, string> = {
    loading: "Thinking…",
    waiting: "Waiting for your input…",
    completed: "Complete thinking",
  };

  return (
    <div className={["px-[10px] py-[8px] rounded-[4px]", className].join(" ")}>
      <div className="flex items-center gap-[6px] w-full">
        {renderIcon()}
        <span className={textClass}>{labels[status]}</span>
      </div>
    </div>
  );
}

export default AIThinkingStatus;
