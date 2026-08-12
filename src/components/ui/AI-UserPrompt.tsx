import React, { useState, useMemo } from "react";
import { AITagMini } from "./AI-TagMini";
import fileInfoLineUrl from "../../icons/file-info-line.svg";

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

export interface AIUserPromptProps {
  content: string;
  tag?: string;
  toBeUpdatedCount?: number;
  metaDiffItems?: MetaDiffItem[];
  onJumpToMetadata?: (fieldId: string) => void;
  className?: string;
}

function ChevronRightIcon({ className = "size-[14px]", color = "var(--color-text-secondary)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1717 12L8.22192 7.05025L9.63614 5.63604L16.0001 12L9.63614 18.364L8.22192 16.95L13.1717 12Z" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ className = "size-[14px]", color = "var(--color-text-secondary)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.1717L16.95 8.22192L18.364 9.63614L12 16.0001L5.63604 9.63614L7.05025 8.22192L12 13.1717Z" fill={color} />
    </svg>
  );
}

export function AIUserPrompt({
  content,
  tag,
  toBeUpdatedCount,
  metaDiffItems,
  onJumpToMetadata,
  className = "",
}: AIUserPromptProps) {
  const paragraphs = content.split("\n");
  const isSingleTotal = (toBeUpdatedCount === 1) || (metaDiffItems?.length === 1);
  const [metaTagExpanded, setMetaTagExpanded] = useState<boolean>(() => isSingleTotal);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (blockId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const groupedChanges = useMemo<MetaGroupChange[]>(() => {
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

  return (
    <div
      className={[
        "bg-white border-[0.6px] border-graphite-20 rounded-[8px] px-[10px] py-[8px]",
        "flex flex-col gap-[4px] justify-end",
        className,
      ].join(" ")}
    >
      {toBeUpdatedCount !== undefined && toBeUpdatedCount > 0 && (
        <div className="flex flex-col w-full pb-[4px] border-b border-graphite-10 mb-[2px]">
          {/* Header Row - Clickable to toggle expand/collapse */}
          <div 
            onClick={() => setMetaTagExpanded(!metaTagExpanded)}
            className="flex items-center gap-[6px] py-[2px] cursor-pointer select-none"
          >
            <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
              {metaTagExpanded ? (
                <ChevronDownIcon className="size-[12px]" color="var(--color-text-secondary)" />
              ) : (
                <ChevronRightIcon className="size-[12px]" color="var(--color-text-secondary)" />
              )}
            </div>
            <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <img src={fileInfoLineUrl} alt="Metadata changes" className="w-full h-full" style={{ filter: 'invert(37%) sepia(5%) saturate(543%) hue-rotate(137deg) brightness(98%) contrast(85%)' }} />
            </div>
            <span className="text-[12px] font-medium text-text-primary" style={{ fontFamily: "var(--font-body)" }}>Metadata changes</span>
            <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
              <span className="text-[10px] leading-[14px] font-medium text-text-secondary">{toBeUpdatedCount}</span>
            </div>
          </div>

          {/* Expanded Metadata Changes Tree */}
          {metaTagExpanded && groupedChanges.length > 0 && (
            <div className="flex flex-col gap-[4px] pt-[4px] pb-[2px] w-full overflow-y-auto max-h-[300px] scrollbar-colored">
              {groupedChanges.map((group) => {
                if (group.changeType === 'added') {
                  return (
                    <div 
                      key={group.blockId} 
                      className="flex items-center gap-[8px] w-full py-[3px] pl-0 pr-[6px] rounded-[4px] bg-graphite-10/50 text-[12px] select-none"
                    >
                      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                        <span className="font-semibold text-[#2E7D32]">＋</span>
                      </div>
                      <span className="font-medium text-text-primary truncate">{group.blockName}</span>
                    </div>
                  );
                }

                if (group.changeType === 'removed') {
                  return (
                    <div 
                      key={group.blockId} 
                      className="flex items-center gap-[8px] w-full py-[3px] pl-0 pr-[6px] rounded-[4px] bg-graphite-10/50 text-[12px] select-none"
                    >
                      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                        <span className="font-semibold text-[#E53935]">－</span>
                      </div>
                      <span className="font-medium text-text-primary truncate">{group.blockName}</span>
                    </div>
                  );
                }

                const isSingleChange = (metaDiffItems?.length === 1) || (toBeUpdatedCount === 1);
                const isExpanded = isSingleChange ? true : !!expandedGroups[group.blockId];

                return (
                  <div key={group.blockId} className="flex flex-col w-full rounded-[4px] bg-graphite-10/50 overflow-hidden">
                    <div 
                      onClick={isSingleChange ? undefined : () => toggleGroup(group.blockId)}
                      className={`flex items-center gap-[8px] w-full py-[3px] pr-[6px] ${isSingleChange ? 'pl-[6px] cursor-default' : 'pl-0 hover:bg-graphite-10 cursor-pointer'} text-[12px] select-none`}
                    >
                      {!isSingleChange && (
                        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                          {isExpanded ? (
                            <ChevronDownIcon className="size-[12px]" color="var(--color-text-secondary)" />
                          ) : (
                            <ChevronRightIcon className="size-[12px]" color="var(--color-text-secondary)" />
                          )}
                        </div>
                      )}
                      <span className="font-medium text-text-primary truncate min-w-0 flex-1">{group.blockName}</span>
                    </div>

                    {isExpanded && (
                      <div className={`flex flex-col gap-[4px] ${isSingleChange ? 'pl-[12px]' : 'pl-[24px]'} pr-[8px] pb-[4px] pt-[2px]`}>
                        {group.diffs.map((diff, dIdx) => {
                          const oldVal = diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty';
                          const newVal = diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty';
                          return (
                            <div 
                              key={dIdx}
                              className="flex flex-col gap-[1px] py-[2px] px-[4px] rounded-[4px] cursor-default select-none"
                            >
                              <span className="text-[11px] font-medium text-text-secondary leading-[14px]">
                                {diff.label}
                              </span>
                              <div className="text-[12px] leading-[16px] break-words whitespace-pre-wrap text-text-primary">
                                <span className="text-text-secondary line-through mr-[4px]">{oldVal}</span>
                                <span className="text-text-secondary mr-[4px]">→</span>
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
