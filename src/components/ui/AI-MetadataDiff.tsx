import React, { useState } from "react";
import { CountBadge } from "./CountBadge";

export interface MetadataDiffRow {
  fieldId: string;
  label: string;
  oldValue: string;
  newValue: string;
  group: string;
}

export function AIMetadataDiff({ items, onJumpToField }: { items: MetadataDiffRow[]; onJumpToField?: (fieldId: string) => void }) {
  const [expanded, setExpanded] = useState(items.length === 1);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = Array.from(new Set(items.map(item => item.group)));

  return (
    <div className="overflow-hidden rounded-[8px] border border-graphite-20 bg-white">
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)} className="flex min-h-[44px] w-full items-center gap-[8px] px-[12px] text-left hover:bg-bg-panel active:bg-graphite-10">
        <svg className="h-[16px] w-[16px] shrink-0 text-text-secondary" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h9l5 5v13H5V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
        <span className="t-body-compact text-text-primary">Edited metadata</span>
        <CountBadge count={items.length} className="ml-[4px]" />
        <svg className={`ml-auto h-[16px] w-[16px] shrink-0 text-text-secondary transition-transform ${expanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {expanded && <div className="border-t border-graphite-10 py-[4px]">
        {groups.map(group => {
          const isOpen = openGroups[group] ?? group === groups[0];
          const rows = items.filter(item => item.group === group);
          return <div key={group}>
            {items.length === 1
              ? <div className="flex min-h-[36px] w-full items-center px-[12px] t-body-compact text-text-primary">{group}</div>
              : <button type="button" aria-expanded={isOpen} onClick={() => setOpenGroups(previous => ({ ...previous, [group]: !isOpen }))} className="flex min-h-[36px] w-full items-center gap-[8px] px-[12px] text-left t-body-compact text-text-primary hover:bg-bg-panel">
                  <svg className={`h-[16px] w-[16px] text-text-secondary transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {group}
                </button>}
            {isOpen && rows.map(row => <button key={row.fieldId} type="button" onClick={() => onJumpToField?.(row.fieldId)} className="flex w-full flex-col gap-[4px] px-[36px] py-[6px] text-left hover:bg-bg-panel">
              <span className="t-small text-text-secondary">{row.label}</span>
              <span className="t-small text-text-secondary"><span>{row.oldValue || 'Empty'}</span><span className="mx-[6px]">→</span><span className="text-brand-1">{row.newValue || 'Empty'}</span></span>
            </button>)}
          </div>;
        })}
      </div>}
    </div>
  );
}

export default AIMetadataDiff;
