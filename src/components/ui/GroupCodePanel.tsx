import React, { useState } from "react";
import groupIconUrl from "../../icons/group.svg";
import closeIconUrl from "../../icons/close-line.svg";
import copyIconUrl from "../../icons/file-copy-line.svg";
import arrowDownIconUrl from "../../icons/arrow-down-s-line.svg";

export interface GroupCodeItem {
  id: string;
  name: string;
  distinguishingParam: string;
  formatFound: boolean;
  usedIn: string[];
  lines: string[];
}

export interface GroupCodePanelProps {
  onClose: () => void;
  selectedItemName?: string;
  groupCodes?: GroupCodeItem[];
  defaultSelectedId?: string;
}

export function GroupCodePanel({
  onClose,
  selectedItemName,
  groupCodes = [],
  defaultSelectedId,
}: GroupCodePanelProps) {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (defaultSelectedId && groupCodes.some(g => g.id === defaultSelectedId)) {
      return defaultSelectedId;
    }
    return groupCodes[0]?.id || "";
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUsedInExpanded, setIsUsedInExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync selection if defaultSelectedId changes or groupCodes update
  React.useEffect(() => {
    if (groupCodes.length > 0) {
      setSelectedId(defaultSelectedId && groupCodes.some(g => g.id === defaultSelectedId) ? defaultSelectedId : groupCodes[0].id);
    }
  }, [groupCodes, defaultSelectedId, selectedItemName]);

  const currentGroup = groupCodes.find(g => g.id === selectedId) || groupCodes[0];

  const handleCopyCode = () => {
    if (!currentGroup) return;
    const text = currentGroup.lines.join("\n");
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Panel Header (no icon before title) */}
      <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-graphite-10 px-[12px] bg-white">
        <div className="flex items-center min-w-0">
          <span className="t-small font-medium text-text-primary truncate">Group Code</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close Group Code"
        >
          <img src={closeIconUrl} alt="" className="h-[16px] w-[16px]" style={{ filter: "brightness(0) invert(58%)" }} />
        </button>
      </div>

      {/* Panel Body */}
      {!currentGroup || groupCodes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-[24px] text-center">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-bg-panel mb-[12px]">
            <img src={groupIconUrl} alt="" className="h-[24px] w-[24px] opacity-40" />
          </div>
          <p className="t-body font-medium text-text-primary mb-[4px]">No Group Code</p>
          <p className="t-small text-text-secondary max-w-[240px]">
            No Group Code is currently associated with {selectedItemName ? `"${selectedItemName}"` : "this item"}.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-[12px] gap-[12px]">
          {/* Dropdown Selector (no label above it) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(v => !v)}
              className="flex w-full min-h-[32px] items-center justify-between rounded-[4px] border border-border-default bg-white px-[8px] py-[4px] text-left hover:border-graphite-50 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-1"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <div className="min-w-0 flex-1 pr-[8px]">
                <div className="t-small font-medium text-text-primary truncate">
                  {currentGroup.name}
                </div>
                {currentGroup.distinguishingParam && (
                  <div className="text-[10px] text-text-secondary truncate">
                    {currentGroup.distinguishingParam}
                  </div>
                )}
              </div>
              <img
                src={arrowDownIconUrl}
                alt=""
                className={`h-[16px] w-[16px] shrink-0 text-text-secondary transition-transform duration-150 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                style={{ filter: "brightness(0) invert(58%)" }}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[50]"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 z-[60] mt-[4px] max-h-[220px] overflow-y-auto rounded-[4px] border border-border-default bg-white p-[4px] shadow-elevation-overlay">
                  {groupCodes.map((item) => {
                    const isSelected = item.id === currentGroup.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full flex-col rounded-[3px] px-[8px] py-[6px] text-left transition-colors ${
                          isSelected
                            ? "bg-az-secondary text-brand-1"
                            : "hover:bg-bg-panel text-text-primary"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-[4px]">
                          <span className={`t-small font-medium truncate ${isSelected ? "text-brand-1" : "text-text-primary"}`}>
                            {item.name}
                          </span>
                          {!item.formatFound && (
                            <span className="shrink-0 text-[10px] font-medium bg-[#FEF3C7] text-[#92400E] px-[5px] py-[1px] rounded border border-[#FDE68A]">
                              Format Not Found
                            </span>
                          )}
                        </div>
                        {item.distinguishingParam && (
                          <span className="text-[10px] text-text-secondary truncate">
                            {item.distinguishingParam}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Section: Used in */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="t-small text-text-primary">
                Used in ({currentGroup.usedIn.length})
              </span>
            </div>
            {currentGroup.usedIn.length === 0 ? (
              <p className="t-small text-text-secondary italic">No references found</p>
            ) : (
              <div className="flex flex-col gap-[4px]">
                {(isUsedInExpanded ? currentGroup.usedIn : currentGroup.usedIn.slice(0, 3)).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center rounded-[4px] bg-bg-panel px-[8px] py-[5px] border border-graphite-10"
                  >
                    <span className="font-mono text-[11px] text-text-primary truncate">{item}</span>
                  </div>
                ))}

                {currentGroup.usedIn.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setIsUsedInExpanded(v => !v)}
                    className="mt-[2px] self-start text-[11px] font-medium text-brand-1 hover:underline transition-all flex items-center gap-[4px]"
                  >
                    {isUsedInExpanded ? "Show Less" : `${currentGroup.usedIn.length - 3} More...`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Warning Banner: Format Not Found (Placed directly above Code Preview) */}
          {!currentGroup.formatFound && (
            <div className="rounded-[6px] border border-[#F8C165] bg-[#FFF9EC] p-[12px] flex items-start gap-[10px]">
              <svg className="w-[18px] h-[18px] shrink-0 text-[#965200] mt-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[#664100] leading-[18px]">Format Not Found</p>
                <p className="text-[12px] text-[#664100] leading-[18px] mt-[4px]">
                  No matching proc format definition was found for this Group Code. The macro call is shown as extracted.
                </p>
              </div>
            </div>
          )}

          {/* Section: Code Preview */}
          <div className="flex flex-1 min-h-[220px] flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="t-small text-text-primary">
                Code preview
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-[4px] rounded-[4px] px-[6px] py-[2px] text-[11px] text-text-secondary hover:bg-black/5 hover:text-text-primary active:scale-[0.96] transition-all"
                title="Copy SAS Code"
              >
                <img src={copyIconUrl} alt="" className="h-[12px] w-[12px]" style={{ filter: "brightness(0) invert(58%)" }} />
                <span>{isCopied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden rounded-[4px] border border-border-default bg-[#FAFBFB]">
              <div className="h-full overflow-auto p-[8px] font-mono text-[13px] leading-[20px] text-text-primary scrollbar-code">
                {currentGroup.lines.map((line, lineIdx) => {
                  const isComment = line.trim().startsWith("/*") || line.trim().startsWith("*");
                  const isKeyword = /^(proc format|value|quit|run|data|merge|by|set|keep|length|if|then|else|%m_u_popn|%let)\b/i.test(line.trim());
                  return (
                    <div key={lineIdx} className="flex min-w-max hover:bg-black/[0.02]">
                      <span className="w-[28px] select-none text-right pr-[8px] text-[#A0A5A5] text-[13px] leading-[20px]">
                        {lineIdx + 1}
                      </span>
                      <span
                        className={`whitespace-pre ${
                          isComment
                            ? "text-[#008000]"
                            : isKeyword
                            ? "text-brand-1 font-medium"
                            : "text-text-primary"
                        }`}
                      >
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
