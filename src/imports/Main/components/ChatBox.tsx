import React, { useState, useRef, useEffect } from "react";
import aiSubmitIconUrl from "../../../icons/AI-submit.svg";
import fileInfoLineUrl from "../../../icons/file-info-line.svg";

// ==================== SVGs from Figma ====================

function ChevronRightIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1717 12L8.22192 7.05025L9.63614 5.63604L16.0001 12L9.63614 18.364L8.22192 16.95L13.1717 12Z" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.1717L16.95 8.22192L18.364 9.63614L12 16.0001L5.63604 9.63614L7.05025 8.22192L12 13.1717Z" fill={color} />
    </svg>
  );
}

function CodeIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12Z" fill={color} />
    </svg>
  );
}

function CloseIcon({ className = "size-[14px]", color = "var(--color-text-secondary)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill={color} />
    </svg>
  );
}

// ==================== Sub-components ====================

interface TagProps {
  className?: string;
  text?: string;
}

function Tag({ className = "", text = "Table.1(290-321)" }: TagProps) {
  return (
    <div className={`bg-az-secondary content-stretch flex gap-[4px] h-[20px] items-center justify-center max-w-[240px] pl-[2px] pr-[6px] relative rounded-[4px] shrink-0 select-none ${className}`}>
      <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
        <CodeIcon className="size-[12px]" color="var(--color-brand-1)" />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] max-w-[152px] min-w-px not-italic overflow-hidden relative text-[13px] text-brand-1 text-ellipsis whitespace-nowrap">
        <p className="leading-[20px] overflow-hidden text-ellipsis font-medium">{text}</p>
      </div>
    </div>
  );
}

// ==================== Main ChatBox Component ====================

export type ChatBoxStatus = "Default" | "Focused" | "Typed" | "Max height";

export type MetaChangeType = 'modified' | 'added' | 'removed';

export interface MetaDiffItem {
  fieldId: string;
  label: string;
  oldValue: string;
  newValue: string;
  blockId?: string;
  blockName?: string;
  changeType?: MetaChangeType;
}

export interface MetaGroupChange {
  blockId: string;
  blockName: string;
  changeType: MetaChangeType;
  diffs: MetaDiffItem[];
}

export interface ChatBoxProps {
  onSubmit: (text: string) => void;
  pending?: boolean;
  metadataChangesCount?: number;
  metaDiffItems?: MetaDiffItem[];
  onCloseMetadataChanges?: () => void;
  onJumpToMetadata?: (fieldId: string) => void;
  onAcceptPending?: () => void;
  onRejectPending?: () => void;
  className?: string;
}

export default function ChatBox({ 
  onSubmit, 
  pending = false, 
  metadataChangesCount = 0, 
  metaDiffItems,
  onCloseMetadataChanges,
  onJumpToMetadata,
  onAcceptPending,
  onRejectPending,
  className = "" 
}: ChatBoxProps) {
  // --- Core Functional States ---
  const [inputText, setInputText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pendingExpanded, setPendingExpanded] = useState<boolean>(false);
  const [metadataExpanded, setMetadataExpanded] = useState<boolean>(() => metadataChangesCount > 0 && metadataChangesCount <= 3);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (blockId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const groupedChanges = React.useMemo<MetaGroupChange[]>(() => {
    if (!metaDiffItems || metaDiffItems.length === 0) return [];

    const groupsMap = new Map<string, MetaGroupChange>();

    metaDiffItems.forEach(item => {
      let blockId = item.blockId;
      let blockName = item.blockName;
      let changeType: MetaChangeType = item.changeType || 'modified';

      if (item.fieldId.startsWith('add_')) {
        changeType = 'added';
        if (!blockId) blockId = item.fieldId;
        if (!blockName) blockName = item.newValue || item.label || 'New Component';
      } else if (item.fieldId.startsWith('delete_')) {
        changeType = 'removed';
        if (!blockId) blockId = item.fieldId;
        if (!blockName) blockName = item.label.replace(/^Component:\s*/, '') || 'Component';
      } else {
        if (!blockId) blockId = 'basic_info';
        if (!blockName) {
          if (item.label.includes(' > ')) {
            blockName = item.label.split(' > ')[0];
          } else {
            blockName = 'Basic Info';
          }
        }
      }

      let cleanLabel = item.label;
      if (cleanLabel.includes(' > ')) {
        cleanLabel = cleanLabel.split(' > ')[1];
      }

      const key = `${blockId}_${changeType}`;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          blockId: blockId || key,
          blockName: blockName || 'Component',
          changeType: changeType,
          diffs: []
        });
      }

      const group = groupsMap.get(key)!;
      if (changeType === 'modified') {
        group.diffs.push({
          ...item,
          label: cleanLabel
        });
      }
    });

    return Array.from(groupsMap.values());
  }, [metaDiffItems]);

  useEffect(() => {
    if (metadataChangesCount > 0) {
      setMetadataExpanded(metadataChangesCount <= 3);
    }
  }, [metadataChangesCount]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Dynamic status resolution ---
  const resolvedStatus: ChatBoxStatus = isFocused
    ? "Focused"
    : inputText.trim().length > 0
    ? inputText.split("\n").length >= 4
      ? "Max height"
      : "Typed"
    : "Default";

  // Auto-grow textarea height dynamically in automatic mode
  useEffect(() => {
    if (resolvedStatus === "Max height" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.height = "";
    }
  }, [inputText, resolvedStatus]);

  const handleSend = () => {
    if (inputText.trim() || metadataChangesCount > 0) {
      onSubmit(inputText);
      setInputText("");
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // State helpers
  const isExpandedAndPending = pending && pendingExpanded;
  const isFocusedAndNotPending = resolvedStatus === "Focused" && !pending;
  const isMaxHeightAndNotPending = resolvedStatus === "Max height" && !pending;
  const isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight = !pending && ["Default", "Focused", "Typed", "Max height"].includes(resolvedStatus);
  const isTypedAndNotPending = resolvedStatus === "Typed" && !pending;
  const placeholderText = metadataChangesCount > 0 ? "Add instructions or submit directly..." : "Ask Me Anything...";

  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      
      
      {/* CSS style block removed — now using global scrollbar-compact + scrollbar-colored classes */}

      {/* ==================== FIGMA COMPONENT ==================== */}
      <div 
        className={`content-stretch flex flex-col items-center justify-end px-[2px] relative rounded-[10px] w-full transition-all duration-200 ${
          pending 
            ? "bg-az-secondary gap-[4px] pb-[2px] pt-[8px]" 
            : metadataChangesCount > 0
            ? "bg-bg-panel border border-graphite-10 gap-[4px] pb-[2px] pt-[8px]"
            : ""
        }`}
        style={{
          border: pending ? "0.6px solid rgba(131, 0, 81, 0.15)" : undefined
        }}
      >
        
        {/* --- Pending Wrap (Shown if pending = true) --- */}
        {pending ? (
          <div 
            className={`content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full transition-all duration-300 ${
              pendingExpanded ? "h-[109px]" : "h-auto"
            }`}
          >
            {/* Header - Aligned precisely with debug CTA buttons on right */}
            <div 
              onClick={() => setPendingExpanded(!pendingExpanded)}
              className="content-stretch flex gap-[8px] items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full cursor-pointer select-none"
            >
              <div className="flex gap-[8px] items-center">
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {pendingExpanded ? (
                    <ChevronDownIcon className="size-[14px]" color="var(--color-brand-1)" />
                  ) : (
                    <ChevronRightIcon className="size-[14px]" color="var(--color-brand-1)" />
                  )}
                </div>
                <div className="flex flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-brand-1 text-center whitespace-nowrap">
                  <p className="leading-[24px] font-medium">3 Pending Changes</p>
                </div>
              </div>

              {/* Debug CTA Buttons */}
              <div className="flex items-center gap-[6px] pr-[4px]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onRejectPending?.()}
                  className="px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium text-text-secondary bg-white hover:bg-black/5 border border-graphite-10 transition-colors cursor-pointer select-none active:scale-95"
                >
                  Reject
                </button>
                <button
                  onClick={() => onAcceptPending?.()}
                  className="px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium text-white bg-brand-1 hover:bg-[#6D0043] transition-colors cursor-pointer select-none active:scale-95"
                >
                  Accept
                </button>
              </div>
            </div>

            {/* Expanded List - Aligned precisely with the header icons and texts. No hover offsets. */}
            {pendingExpanded && (
              <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] pb-[6px] relative shrink-0 w-full overflow-y-auto scrollbar-colored flex-1">
                {[
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11"
                ].map((item, idx) => (
                  <div key={idx} className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full py-[2px] select-none">
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      <CodeIcon className="size-[12px]" color="var(--color-brand-1)" />
                    </div>
                    <div className="flex flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-brand-1 text-center whitespace-nowrap">
                      <p className="leading-[20px] font-normal">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : metadataChangesCount > 0 ? (
          <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full">
            <div className="content-stretch flex gap-[6px] items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full select-none">
              <div 
                onClick={() => setMetadataExpanded(!metadataExpanded)}
                className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative cursor-pointer"
              >
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {metadataExpanded ? (
                    <ChevronDownIcon className="size-[14px]" color="var(--color-text-secondary)" />
                  ) : (
                    <ChevronRightIcon className="size-[14px]" color="var(--color-text-secondary)" />
                  )}
                </div>
                <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
                  <img src={fileInfoLineUrl} alt="Metadata changes" className="size-[16px]" style={{ filter: 'invert(37%) sepia(5%) saturate(543%) hue-rotate(137deg) brightness(98%) contrast(85%)' }} />
                </div>
                <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-text-primary text-center whitespace-nowrap">
                  <p className="leading-[24px]">Metadata Changes</p>
                </div>
                <div className="bg-graphite-10 content-stretch flex items-center justify-center px-[4px] py-px relative rounded-[16px] shrink-0 min-w-[16px] h-[16px]">
                  <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-text-secondary whitespace-nowrap">
                    <p className="leading-[14px]">{metadataChangesCount}</p>
                  </div>
                </div>
              </div>
              
              {onCloseMetadataChanges && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseMetadataChanges();
                  }}
                  className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0"
                  title="Cancel metadata changes"
                  aria-label="Close metadata changes"
                >
                  <CloseIcon className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
                </button>
              )}
            </div>

            {/* Expanded To be Updated Component-based List */}
            {metadataExpanded && groupedChanges.length > 0 && (
              <div className="content-stretch flex flex-col gap-[6px] items-start px-[8px] pb-[6px] relative shrink-0 w-full overflow-y-auto max-h-[160px]">
                {groupedChanges.map((group) => {
                  if (group.changeType === 'added') {
                    return (
                      <div 
                        key={group.blockId} 
                        className="flex items-center gap-[6px] w-full py-[4px] px-[6px] rounded-[4px] bg-black/[0.02] text-[13px] select-none"
                      >
                        <span className="font-semibold text-[#2E7D32] shrink-0">＋</span>
                        <span className="font-medium text-text-primary truncate">{group.blockName}</span>
                      </div>
                    );
                  }

                  if (group.changeType === 'removed') {
                    return (
                      <div 
                        key={group.blockId} 
                        className="flex items-center gap-[6px] w-full py-[4px] px-[6px] rounded-[4px] bg-black/[0.02] text-[13px] select-none"
                      >
                        <span className="font-semibold text-[#E53935] shrink-0">－</span>
                        <span className="font-medium text-text-primary truncate">{group.blockName}</span>
                        <span className="text-[12px] text-text-secondary italic">(Removed)</span>
                      </div>
                    );
                  }

                  // Modified Component Group
                  const isExpanded = !collapsedGroups[group.blockId];
                  const diffCount = group.diffs.length;

                  return (
                    <div key={group.blockId} className="flex flex-col w-full rounded-[4px] bg-black/[0.02] overflow-hidden">
                      {/* Group Header Row */}
                      <div 
                        onClick={() => toggleGroup(group.blockId)}
                        className="flex items-center justify-between gap-[6px] w-full py-[4px] px-[6px] hover:bg-black/5 cursor-pointer text-[13px] select-none"
                      >
                        <div className="flex items-center gap-[6px] min-w-0 flex-1">
                          <span className="font-medium text-text-primary truncate">{group.blockName}</span>
                          {diffCount > 1 && (
                            <div className="bg-graphite-10 flex items-center justify-center px-[6px] py-px rounded-[12px] shrink-0 min-w-[16px] h-[16px]">
                              <span className="text-[11px] font-medium text-text-secondary leading-[14px]">
                                {diffCount} {diffCount === 1 ? 'change' : 'changes'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                          {isExpanded ? (
                            <ChevronDownIcon className="size-[12px]" color="var(--color-text-secondary)" />
                          ) : (
                            <ChevronRightIcon className="size-[12px]" color="var(--color-text-secondary)" />
                          )}
                        </div>
                      </div>

                      {/* Field Level Diffs inside Group (Stacked 2-line structure without truncation) */}
                      {isExpanded && (
                        <div className="flex flex-col gap-[6px] px-[8px] pb-[6px] pt-[2px]">
                          {group.diffs.map((diff, dIdx) => {
                            const oldVal = diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty';
                            const newVal = diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty';
                            return (
                              <div 
                                key={dIdx}
                                onClick={() => onJumpToMetadata?.(diff.fieldId)}
                                className="flex flex-col gap-[2px] py-[3px] px-[6px] rounded-[4px] hover:bg-black/5 cursor-pointer select-none"
                              >
                                {/* Line 1: Field Name */}
                                <span className="text-[12px] font-medium text-text-secondary leading-[16px]">
                                  {diff.label}
                                </span>
                                {/* Line 2: Diff Values (Stacked, line-wrap allowed, no truncation) */}
                                <div className="text-[13px] leading-[18px] break-words whitespace-pre-wrap flex flex-wrap items-center gap-[4px]">
                                  <span className="text-text-secondary line-through">{oldVal}</span>
                                  <span className="text-text-secondary shrink-0">→</span>
                                  <span className="font-medium text-brand-1">{newVal}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {/* --- Inputbox Container --- */}
        {isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight && (
          <div 
            className={`bg-white border-solid content-stretch flex flex-col items-start justify-center px-[10px] relative shrink-0 w-full transition-all duration-200 ${
              isMaxHeightAndNotPending 
                ? "border border-graphite-10 py-[9px] rounded-[6px]" 
                : isFocusedAndNotPending 
                ? "border border-brand-1 drop-shadow-[0px_0px_3px_rgba(131,0,81,0.2)] py-[8px] rounded-[8px]" 
                : "border border-graphite-10 py-[8px] rounded-[8px]"
            }`}
          >
            <div className={`content-stretch flex relative shrink-0 w-full ${isMaxHeightAndNotPending ? "gap-[12px] items-end justify-center" : "gap-[16px] items-center"}`}>
              
              {/* Text Field & Tags */}
              <div className={`content-stretch flex flex-[1_0_0] items-center min-w-px relative ${isMaxHeightAndNotPending ? "w-full" : "gap-[8px]"}`}>
                
                {isMaxHeightAndNotPending ? (
                  <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-start justify-between min-w-px w-full relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholderText}
                      className="w-full t-body text-text-primary placeholder:text-text-secondary bg-transparent border-none outline-none resize-none text-[14px] leading-[24px] max-h-[140px] pr-[12px] overflow-y-auto"
                      rows={4}
                    />
                  </div>
                ) : (
                  <div className="flex flex-1 items-center w-full">
                    
                    {/* Render static text + tag inline if blurred and typed (Figma Typed Mockup) */}
                    {isTypedAndNotPending && !isFocused ? (
                      <div 
                        onClick={() => {
                          setIsFocused(true);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="flex-1 flex items-center gap-[4px] cursor-text select-text h-[24px]"
                      >
                        <span className="t-body text-text-primary text-[14px] leading-[24px] whitespace-nowrap shrink-0">
                          {inputText}
                        </span>
                        <Tag />
                      </div>
                    ) : (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                          setInputText(e.target.value);
                        }}
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                        onBlur={() => {
                          // Allow click handlers to complete before blur clears focus
                          setTimeout(() => setIsFocused(false), 150);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSend();
                          }
                        }}
                        placeholder={placeholderText}
                        className="flex-1 t-body text-text-primary placeholder:text-text-secondary bg-transparent border-none outline-none text-[14px] leading-[24px]"
                      />
                    )}
                    
                  </div>
                )}
                
              </div>

              {/* Send Button */}
              <button 
                onClick={handleSend}
                className="bg-brand-1 hover:bg-az-warning transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95 animate-none"
              >
                <img
                  src={aiSubmitIconUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-[11px] h-[12px] block shrink-0"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>
          </div>
        )}

        {/* --- Inputbox when Pending is active --- */}
        {pending && (
          <div className="bg-white border border-graphite-10 border-solid content-stretch flex flex-col items-start justify-center px-[10px] py-[8px] relative rounded-[8px] shrink-0 w-full">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] items-center justify-start min-w-px relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Ask Me Anything..."
                  className="flex-1 t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px]"
                />
              </div>
              
              <button 
                onClick={handleSend}
                className="bg-brand-1 hover:opacity-90 transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95"
              >
                <img
                  src={aiSubmitIconUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-[11px] h-[12px] block shrink-0"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
