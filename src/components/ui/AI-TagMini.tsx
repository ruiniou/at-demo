import React from "react";
import codeLineIconUrl from "../../icons/code-line.svg";
import tableIconUrl from "../../icons/Table.svg";
import figureIconUrl from "../../icons/Figure.svg";
import listingIconUrl from "../../icons/Listing.svg";

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
  const contentText = String(children ?? text);
  const isTable = contentText.toLowerCase().includes("table");
  const isFigure = contentText.toLowerCase().includes("figure");
  const isListing = contentText.toLowerCase().includes("listing");

  let iconSrc = codeLineIconUrl;
  if (isTable) {
    iconSrc = tableIconUrl;
  } else if (isFigure) {
    iconSrc = figureIconUrl;
  } else if (isListing) {
    iconSrc = listingIconUrl;
  }

  // Define color filters matching var(--color-brand-1) #830051
  const brandFilter = "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)";

  return (
    <div
      className={[
        "bg-az-secondary rounded-[4px] h-[20px] border border-brand-1/10",
        "flex items-center gap-[4px] pl-[4px] pr-[6px]",
        "shrink-0 select-none",
        className,
      ].join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="w-[12px] h-[12px] block shrink-0"
        style={{ filter: brandFilter }}
      />
      <span className="t-caption text-brand-1 font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-[20px]">
        {contentText}
      </span>
    </div>
  );
}

export default AITagMini;
