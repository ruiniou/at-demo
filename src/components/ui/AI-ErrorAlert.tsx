import React, { useState } from "react";
import errorWarningIconUrl from "../../icons/error-warning-line.svg";
import arrowRightIconUrl from "../../icons/arrow-right-s-line.svg";
import arrowDownIconUrl from "../../icons/arrow-down-s-line.svg";
import resetRightIconUrl from "../../icons/reset-right-line.svg";

const STATUS_ERROR_FILTER =
  "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)";

function ColoredIcon({
  src,
  alt = "",
  size = "w-[16px] h-[16px]",
  filter,
}: {
  src: string;
  alt?: string;
  size?: string;
  filter?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden="true"
      className={`${size} block shrink-0`}
      style={filter ? { filter } : undefined}
    />
  );
}

export interface AIErrorAlertProps {
  title?: string;
  details?: string;
  retryText?: string;
  onRetry?: () => void;
  className?: string;
}

export function AIErrorAlert({
  title = "Error Reason Summary",
  details = "Error reason details here. This section can contain very long error messages including stack traces, variable states, and other diagnostic information that helps identify the root cause of the failure.",
  retryText = "Retry",
  onRetry,
  className = "",
}: AIErrorAlertProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={[
        "bg-bg-light",
        "border-[0.6px] border-status-error",
        "rounded-[4px] px-[10px] py-[8px] flex gap-[8px] items-start",
        className,
      ].join(" ")}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className={expanded ? "flex flex-col gap-[2px]" : "flex flex-col"}>
          <div className="flex items-center gap-[6px] h-[30px]">
            <ColoredIcon
              src={errorWarningIconUrl}
              size="w-[16px] h-[16px]"
            />
            <p className="t-body-compact text-status-error truncate">
              Error: {title}
            </p>
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-[4px] t-small text-status-error hover:underline active:scale-[0.98] w-fit"
            >
              <span>{expanded ? "Hide Details" : "Show Details"}</span>
              <ColoredIcon
                src={expanded ? arrowDownIconUrl : arrowRightIconUrl}
                size="w-[16px] h-[16px]"
                filter={STATUS_ERROR_FILTER}
              />
            </button>

            {expanded && (
              <p className="t-small text-status-error break-words whitespace-pre-wrap leading-[20px] mt-[2px]">
                {details}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onRetry}
        className={[
          "shrink-0 bg-az-secondary rounded-[4px] px-[8px] py-[4px]",
          "flex items-center gap-[4px] transition-colors",
          "hover:bg-az-secondary-hover active:scale-[0.98]",
        ].join(" ")}
      >
        <ColoredIcon
          src={resetRightIconUrl}
          size="w-[16px] h-[16px]"
          filter={STATUS_ERROR_FILTER}
        />
        <span className="t-small text-status-error">{retryText}</span>
      </button>
    </div>
  );
}

export default AIErrorAlert;
