import React, { useState } from 'react';
import { Lock, Unlock, Table as TableIcon, Search, Filter, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './components/ui/tooltip';
import Modal from './components/Modal';
import FAB from './components/FAB';
import ShellPreview from './components/ShellPreview';
import MetadataPanel from './components/MetadataPanel';
import CodePanel from './components/CodePanel';
import AICopilot from './components/AICopilot';
import Divider from './components/Divider';
import svgPaths from '../imports/Default/svg-jq41wrqlb5';


type ItemStatus = 'pending' | 'locked' | 'analyzing' | 'error' | 'modified';

interface TableItem {
  id: string;
  name: string;
  status: ItemStatus;
  errorMessage?: string;
  pendingChanges?: number;
}

interface ProgramItem {
  id: string;
  name: string;
  status: ItemStatus;
  isExpanded: boolean;
  tables: TableItem[];
}

interface TreeItemProps {
  program: ProgramItem;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleLock: (programId: string, tableId?: string) => void;
  onToggleExpand: (programId: string) => void;
  onShowLockedModal: (programName: string) => void;
}

function TreeItem({
  program,
  selectedId,
  onSelect,
  onToggleLock,
  onToggleExpand,
  onShowLockedModal
}: TreeItemProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isProgramLocked = program.status === 'locked';
  const isProgramHovered = hoveredId === program.id;

  const getStatusIndicator = (
    item: TableItem | ProgramItem,
    itemId: string,
    isHovered: boolean,
    isProgram: boolean = false,
    isChildOfLockedParent: boolean = false
  ) => {
    // AI analyzing - no lock functionality
    if (item.status === 'analyzing') {
      return (
        <div className="relative shrink-0 size-[20px] flex items-center justify-center">
          <Sparkles className="size-4 text-[#830051]" style={{ fill: 'url(#gradient-ai)' }} />
        </div>
      );
    }

    // Error state
    if (item.status === 'error' && 'errorMessage' in item) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="size-[20px] flex items-center justify-center cursor-help">
              <div className="size-1.5 rounded-full bg-[#cc2c3c]" />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px] data-[side]:shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              {item.errorMessage || 'Error occurred'}
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    // Modified state
    if (item.status === 'modified' && 'pendingChanges' in item) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="size-[20px] flex items-center justify-center cursor-help">
              <div className="size-1.5 rounded-full bg-[#f0ab00]" />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              {item.pendingChanges || 0} Pending changes
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    // Locked state - show unlock button
    if (item.status === 'locked') {
      // Child of locked parent - show not-allowed cursor
      if (isChildOfLockedParent) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowLockedModal(program.name);
                }}
                className="size-[20px] flex items-center justify-center rounded-[4px] cursor-not-allowed"
                aria-label="Locked by parent"
              >
                <Lock className="size-3.5 text-[#888E8E]" />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
                Locked by {program.name}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Directly toggle lock without confirmation modal
                if (isProgram) {
                  onToggleLock(itemId);
                } else {
                  onToggleLock(program.id, itemId);
                }
              }}
              className="size-[20px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
              aria-label="Unlock code"
            >
              <Lock className="size-3.5 text-[#888E8E]" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              Unlock Code
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    // Pending state - show lock button on hover (tables only, not programs)
    if (isHovered && item.status === 'pending' && !isProgram) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(program.id, itemId);
              }}
              className="size-[20px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
              aria-label="Lock code"
            >
              <Unlock className="size-3.5 text-[#888E8E]" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              Lock Code
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div className="size-[20px]" />;
  };

  return (
    <div className="flex flex-col gap-[2px] w-full">
      {/* Program Code Header */}
      <div
        className={`h-[28px] relative w-full cursor-pointer transition-colors ${
          selectedId === program.id ? 'bg-[#f4e8ee]' : isProgramHovered ? 'bg-[#f8f7f7]' : ''
        }`}
        onClick={() => onSelect(program.id)}
        onMouseEnter={() => setHoveredId(program.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {selectedId === program.id && (
          <div aria-hidden="true" className="absolute border-[#830051] border-l-2 border-solid inset-0 pointer-events-none" />
        )}
        <div className="flex items-center justify-between h-full px-[12px]">
          <div className="flex items-center gap-[4px] flex-1 min-w-0 h-[20px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(program.id);
              }}
              className="shrink-0 size-4 flex items-center justify-center transition-transform active:scale-[0.96]"
              aria-label={program.isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRight
                className={`size-4 transition-transform ${program.isExpanded ? 'rotate-90' : ''}`}
                style={{ color: isProgramLocked ? '#B2B4B4' : '#888E8E' }}
              />
            </button>
            <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap flex-1 ${
              isProgramLocked ? 'text-[#b2b4b4]' : 'text-[#3c4242]'
            }`}>
              {program.name}
            </p>
          </div>
          {getStatusIndicator(program, program.id, isProgramHovered, true, false)}
        </div>
      </div>

      {/* Child Tables */}
      {program.isExpanded && (
        <div className="flex flex-col">
          {program.tables.map((table) => {
            const isTableHovered = hoveredId === table.id;
            const isTableSelected = selectedId === table.id;
            const isTableDisabled = isProgramLocked;
            const effectiveStatus = isProgramLocked ? 'locked' : table.status;

            return (
              <div
                key={table.id}
                className={`h-[28px] relative w-full cursor-pointer transition-colors ${
                  isTableSelected ? 'bg-[#f4e8ee]' : isTableHovered ? 'bg-[#f8f7f7]' : ''
                }`}
                onClick={() => onSelect(table.id)}
                onMouseEnter={() => setHoveredId(table.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isTableSelected && (
                  <div aria-hidden="true" className="absolute border-[#830051] border-l-2 border-solid inset-0 pointer-events-none" />
                )}
                <div className="flex items-center justify-between h-full pl-[24px] pr-[12px]">
                  <div className="flex items-center gap-[4px] flex-1 min-w-0 h-[20px]">
                    <TableIcon className={`shrink-0 size-4 ${isTableDisabled ? 'text-[#B2B4B4]' : 'text-[#656969]'}`} />
                    <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap ${
                      isTableDisabled ? 'text-[#b2b4b4]' : 'text-[#3c4242]'
                    }`}>
                      {table.name}
                    </p>
                  </div>
                  {getStatusIndicator(
                    { ...table, status: effectiveStatus },
                    table.id,
                    isTableHovered && !isProgramLocked,
                    false,
                    isProgramLocked
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  return (
    <div className="h-[40px] w-full">
      <div className="flex items-center h-full px-[8px] py-[4px] gap-[4px]">
        <div className="bg-[#ebecec] flex-1 rounded-[6px]">
          <div className="flex items-center justify-between px-[8px] py-[4px]">
            <div className="flex items-center gap-[6px]">
              <Search className="size-4 text-[#999]" />
              <p className="font-['PingFang_SC:Regular',sans-serif] text-[#999] text-[12px]">Search</p>
            </div>
            <button className="p-0.5 hover:bg-black/5 rounded-[6px] transition-colors active:scale-[0.96] transition-transform">
              <Filter className="size-3.5 text-[#888E8E]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type CategoryType = 'all' | 'table' | 'listing' | 'figure';

function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('table');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(null);

  const categories = [
    { id: 'all' as CategoryType, label: 'All', icon: null },
    {
      id: 'table' as CategoryType,
      label: 'Table',
      icon: 'M1.333 2h10.667v1.333H1.333V2zm0 2.667h10.667V6H1.333V4.667zm0 2.666h10.667v1.334H1.333V7.333zm0 2.667h10.667V11.333H1.333V10z'
    },
    {
      id: 'listing' as CategoryType,
      label: 'Listing',
      icon: 'M1.333 2.667h1.334v1.333H1.333V2.667zm2.667 0h8v1.333h-8V2.667zM1.333 5.333h1.334v1.334H1.333V5.333zm2.667 0h8v1.334h-8V5.333zM1.333 8h1.334v1.333H1.333V8zm2.667 0h8v1.333h-8V8zM1.333 10.667h1.334V12H1.333v-1.333zm2.667 0h8V12h-8v-1.333z'
    },
    {
      id: 'figure' as CategoryType,
      label: 'Figure',
      icon: 'M1.333 1.333h10.667v9.334H1.333V1.333zm1.334 1.334v6.666h8V2.667H2.667zM1.333 12h10.667v.667H1.333V12zM4 8.667l2-2.667 1.333 1.333L9.333 5 11.333 8.667H4z'
    },
  ];

  return (
    <div className="h-[32px] w-full px-[8px] py-[4px]">
      <div className="flex items-center gap-[8px]">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          const showLabel = isSelected;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center gap-[2px] rounded-[4px] h-[24px] transition-colors active:scale-[0.96] transition-transform ${
                isSelected
                  ? 'bg-[#ebecec] px-[4px]'
                  : isHovered
                  ? 'bg-[#ebecec] px-[4px]'
                  : 'px-[4px]'
              }`}
            >
              {category.icon && (
                <div className="relative shrink-0 size-[16px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12">
                    <path d={category.icon} fill="#888E8E" />
                  </svg>
                </div>
              )}
              <div
                className="overflow-hidden transition-all duration-200"
                style={{
                  width: showLabel || category.id === 'all' ? 'auto' : '0px',
                  opacity: showLabel || category.id === 'all' ? 1 : 0,
                }}
              >
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242] whitespace-nowrap">
                  {category.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TreeListHeader({
  eventCode,
  eventName,
  onToggleTreeList
}: {
  eventCode: string;
  eventName: string;
  onToggleTreeList: () => void;
}) {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <div className="h-[48px] shrink-0 w-full border-b-[0.6px] border-[#d8dada]">
      <div className="flex items-center h-full px-[10px] gap-[8px]">
        {/* Logo / Back to Home Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="relative rounded-[4px] shrink-0 size-[24px] hover:bg-black/5 transition-colors flex items-center justify-center"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              {isLogoHovered ? (
                <ArrowLeft className="size-4 text-[#3c4242]" />
              ) : (
                <div className="relative size-[24px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p2ffd9c00} fill="#F0AB00" />
                  </svg>
                </div>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              Back to home
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[4px] mb-[2px]">
            <p className="font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[20px] text-[#3c4242] overflow-hidden text-ellipsis whitespace-nowrap">
              {eventCode}
            </p>
            <div className="relative shrink-0 size-[14px]">
              <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 10.5 10.5">
                <path d={svgPaths.p24ed2780} fill="#F0AB00" />
                <path clipRule="evenodd" d={svgPaths.p26cea600} fill="#F0AB00" fillRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[10px] leading-[15px] text-[#888e8e] overflow-hidden text-ellipsis whitespace-nowrap">
            {eventName}
          </p>
        </div>

        {/* Info Button */}
        <button className="relative rounded-[4px] shrink-0 size-[24px] hover:bg-black/5 transition-colors flex items-center justify-center">
          <div className="relative size-[16px]">
            <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.3333 13.3333">
              <path d={svgPaths.p15215400} fill="#888E8E" />
            </svg>
          </div>
        </button>

        {/* Collapse Tree List Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleTreeList}
              className="relative rounded-[4px] shrink-0 size-[24px] hover:bg-black/5 transition-colors flex items-center justify-center"
            >
              <div className="relative size-[16px]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.3333 13.3333">
                  <path d={svgPaths.p29a4c000} fill="#888E8E" />
                </svg>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              Collapse tree list
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

type PanelView = 'shell' | 'both' | 'code';

// SVG path for the split-panels icon (from Figma import)
const SPLIT_ICON_PATH = "M4.66699 1.33398H1.33398V10.667H5V12H1.33398C0.597712 12 0.000176632 11.4032 0 10.667V1.33398C0 0.597605 0.597605 0 1.33398 0H4.66699V1.33398ZM7.33398 12H6V0H7.33398V12ZM12 0C12.7361 0.000175088 13.3338 0.596888 13.334 1.33301V10.666C13.334 11.4023 12.7362 11.9998 12 12H8.33398V10.666H12V1.33301H8.33398V0H12Z";

function PanelViewToggle({ value, onChange }: { value: PanelView; onChange: (v: PanelView) => void }) {
  return (
    <div className="bg-[#f8f7f7] flex items-center rounded-[4px]">
      {/* Shell */}
      <button
        onClick={() => onChange('shell')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'shell' ? 'bg-white' : ''
        }`}
      >
        {value === 'shell' && (
          <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] whitespace-nowrap ${
          value === 'shell' ? 'text-[#3c4242]' : 'text-[#888e8e]'
        }`}>Shell</p>
      </button>

      {/* Both (split icon) */}
      <button
        onClick={() => onChange('both')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'both' ? 'bg-white' : ''
        }`}
      >
        {value === 'both' && (
          <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <div className="absolute inset-[12.5%_8.33%]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 12">
              <path d={SPLIT_ICON_PATH} fill={value === 'both' ? '#3C4242' : '#888E8E'} />
            </svg>
          </div>
        </div>
      </button>

      {/* Code */}
      <button
        onClick={() => onChange('code')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'code' ? 'bg-white' : ''
        }`}
      >
        {value === 'code' && (
          <div aria-hidden className="absolute border-[#d8dada] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] whitespace-nowrap ${
          value === 'code' ? 'text-[#3c4242]' : 'text-[#888e8e]'
        }`}>Code</p>
      </button>
    </div>
  );
}

function ViewToggleBar({
  treeListOpen,
  onToggleTreeList,
  panelView,
  onPanelViewChange,
}: {
  treeListOpen: boolean;
  onToggleTreeList: () => void;
  panelView: PanelView;
  onPanelViewChange: (v: PanelView) => void;
}) {
  const [activeView, setActiveView] = useState<'table' | 'group'>('table');

  return (
    <div className="h-[48px] shrink-0 w-full border-b-[0.6px] border-[#d8dada] flex items-center bg-white relative">
      {/* Expand Tree List Button (when tree list is collapsed) */}
      {!treeListOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleTreeList}
              className="absolute left-[12px] h-[24px] w-[24px] flex items-center justify-center hover:bg-black/5 rounded-[4px] transition-colors"
            >
              <div className="relative size-[16px]">
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.3333 13.3333" style={{ transform: 'scaleX(-1)' }}>
                  <path d={svgPaths.p29a4c000} fill="#888E8E" />
                </svg>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={4} className="bg-[#3c4242] text-[#f8f7f7] border-0 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] px-[6px] py-[4px] rounded-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">
              Expand tree list
            </p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* View Toggle Buttons - Centered */}
      <div className="flex items-center justify-center flex-1">
        {/* Table View */}
        <button
          onClick={() => setActiveView('table')}
          className={`h-full flex items-center justify-center gap-[4px] px-[16px] py-[8px] relative ${
            activeView === 'table' ? 'bg-white' : ''
          }`}
        >
          {activeView === 'table' && (
            <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
          )}
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M2.66667 5.33333H13.3333V3.33333H2.66667V5.33333ZM9.33333 12.6667V6.66667H6.66667V12.6667H9.33333ZM10.6667 12.6667H13.3333V6.66667H10.6667V12.6667ZM5.33333 12.6667V6.66667H2.66667V12.6667H5.33333ZM2 2H14C14.3682 2 14.6667 2.29848 14.6667 2.66667V13.3333C14.6667 13.7015 14.3682 14 14 14H2C1.63181 14 1.33333 13.7015 1.33333 13.3333V2.66667C1.33333 2.29848 1.63181 2 2 2Z" fill={activeView === 'table' ? '#830051' : '#3C4242'} />
          </svg>
          <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] ${
            activeView === 'table' ? 'text-[#830051]' : 'text-[#3c4242]'
          }`}>
            Table View
          </p>
        </button>

        {/* Group View */}
        <button
          onClick={() => setActiveView('group')}
          className={`h-full flex items-center justify-center gap-[4px] px-[16px] py-[8px] relative ${
            activeView === 'group' ? 'bg-white' : ''
          }`}
        >
          {activeView === 'group' && (
            <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
          )}
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M4 4.66667V2.66667C4 2.29848 4.29848 2 4.66667 2H8.9428L10.2761 3.33333H14C14.3682 3.33333 14.6667 3.63181 14.6667 4V10.6667C14.6667 11.0349 14.3682 11.3333 14 11.3333H12V13.3333C12 13.7015 11.7015 14 11.3333 14H2C1.63181 14 1.33333 13.7015 1.33333 13.3333V5.33333C1.33333 4.96515 1.63181 4.66667 2 4.66667H4ZM4 6H2.66667V12.6667H10.6667V11.3333H4V6ZM5.33333 3.33333V10H13.3333V4.66667H9.72387L8.39053 3.33333H5.33333Z" fill={activeView === 'group' ? '#830051' : '#3C4242'} />
          </svg>
          <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] ${
            activeView === 'group' ? 'text-[#830051]' : 'text-[#3c4242]'
          }`}>
            Group View
          </p>
        </button>
      </div>

      {/* Panel View Toggle — pinned 12px from right edge */}
      <div className="absolute right-[12px] top-[14px]">
        <PanelViewToggle value={panelView} onChange={onPanelViewChange} />
      </div>
    </div>
  );
}

export default function App() {
  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      id: 'p1',
      name: 'Section A',
      status: 'pending',
      isExpanded: true,
      tables: [
        { id: 't1', name: 'Table 14.1.4', status: 'pending' },
        { id: 't2', name: 'Table 14.1.3', status: 'pending' },
        { id: 't3', name: 'Table 14.1.2', status: 'modified', pendingChanges: 3 },
        { id: 't4', name: 'Table 14.1.1', status: 'error', errorMessage: 'Failed to parse table structure' },
      ],
    },
    {
      id: 'p2',
      name: 'Section B',
      status: 'locked',
      isExpanded: true,
      tables: [
        { id: 't5', name: 'Table 14.2.1', status: 'pending' },
        { id: 't6', name: 'Table 14.2.2', status: 'pending' },
        { id: 't7', name: 'Table 14.2.3', status: 'pending' },
        { id: 't8', name: 'Table 14.2.4', status: 'pending' },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>('t1');
  const [currentEvent, setCurrentEvent] = useState('CSR Interim Analysis');
  const [modalState, setModalState] = useState<{
    type: 'locked-by-parent' | null;
    programName?: string;
  }>({ type: null });

  // Panel view toggle
  const [panelView, setPanelView] = useState<PanelView>('both');

  const handlePanelViewChange = (v: PanelView) => {
    setPanelView(v);
    if (v === 'shell') {
      setShellPreviewOpen(true);
      setCodeOpen(false);
      setMetadataOpen(false);
      setAiCopilotOpen(false);
    } else if (v === 'code') {
      setShellPreviewOpen(false);
      setMetadataOpen(false);
      setCodeOpen(true);
    } else {
      // both
      setShellPreviewOpen(true);
      setCodeOpen(true);
    }
  };

  // Panel states
  const [treeListOpen, setTreeListOpen] = useState(true);
  const [shellPreviewOpen, setShellPreviewOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);

  // Panel widths (user-customizable)
  const [treeListWidth, setTreeListWidth] = useState(240);
  const [shellPreviewWidth, setShellPreviewWidth] = useState(400);
  const [metadataWidth, setMetadataWidth] = useState(200);
  const [aiCopilotWidth, setAiCopilotWidth] = useState(360);

  // Width constraints
  const constraints = {
    treeList: { min: 160, max: 340 },
    shellPreview: { min: 320, max: 600 },
    metadata: { min: 180, max: 300 },
    code: { min: 400 },
    aiCopilot: { min: 320, max: 480 },
  };

  const events = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  // Helper to check if selected item is a table
  const isTableSelected = (id: string | null): boolean => {
    if (!id) return false;
    return programs.some(p => p.tables.some(t => t.id === id));
  };

  // Returns true if the selected item (or its parent program) is locked
  const isSelectedItemLocked = (): boolean => {
    if (!selectedId) return false;
    for (const p of programs) {
      if (p.id === selectedId) return p.status === 'locked';
      const table = p.tables.find(t => t.id === selectedId);
      if (table) return p.status === 'locked' || table.status === 'locked';
    }
    return false;
  };

  // Helper to get selected item name
  const getSelectedItemName = (): string => {
    if (!selectedId) return '';
    const allItems = programs.flatMap(p => [p, ...p.tables]);
    return allItems.find(item => item.id === selectedId)?.name || '';
  };

  // RULE 1 & RULE 2: Handle selection changes
  const handleSelect = (id: string) => {
    setSelectedId(id);

    // Don't change panels if AI Copilot is open
    if (aiCopilotOpen) return;

    if (isTableSelected(id)) {
      // RULE 1: Select a Table
      setShellPreviewOpen(true);
      setCodeOpen(true);
      // metadata and aiCopilot remain as-is
    } else {
      // RULE 2: Select a Program Code
      setShellPreviewOpen(false);
      setMetadataOpen(false);
      setCodeOpen(true);
      // aiCopilot remains as-is
    }
  };

  const handleToggleLock = (programId: string, tableId?: string) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => {
        if (program.id !== programId) return program;

        if (!tableId) {
          // Toggle program lock - does NOT cascade to tables
          const newStatus = program.status === 'locked' ? 'pending' : 'locked';
          return {
            ...program,
            status: newStatus as ItemStatus,
          };
        } else {
          // Toggle individual table lock (only if program is not locked)
          if (program.status === 'locked') return program;

          return {
            ...program,
            tables: program.tables.map((table) => {
              if (table.id !== tableId) return table;
              if (table.status === 'analyzing' || table.status === 'error' || table.status === 'modified') {
                return table;
              }
              return {
                ...table,
                status: table.status === 'locked' ? 'pending' : 'locked',
              } as TableItem;
            }),
          };
        }
      })
    );
  };

  const handleToggleExpand = (programId: string) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === programId
          ? { ...program, isExpanded: !program.isExpanded }
          : program
      )
    );
  };

  const handleShowLockedModal = (programName: string) => {
    setModalState({ type: 'locked-by-parent', programName });
  };

  const handleCloseModal = () => {
    setModalState({ type: null });
  };

  // RULE 3: Click a Block inside Shell Preview (or metadata button)
  const handleBlockClick = () => {
    setMetadataOpen(true);
    // Code stays open but will be collapsed (handled in layout)
  };

  const handleMetadataToggle = () => {
    setMetadataOpen(!metadataOpen);
  };

  // RULE 4: Close Metadata
  const handleCloseMetadata = () => {
    setMetadataOpen(false);
    // Code restores full width (handled in layout)
  };

  // RULE 5: Open AI Copilot — does NOT close Shell or Metadata
  const handleOpenAICopilot = () => {
    setAiCopilotOpen(true);
  };

  // RULE 6: Close AI Copilot
  const handleCloseAICopilot = () => {
    setAiCopilotOpen(false);
  };

  // RULE 7: Toggle Tree List
  const handleToggleTreeList = () => {
    setTreeListOpen(!treeListOpen);
    // No other panel changes
  };

  // Divider drag handlers
  const handleTreeListDividerDrag = (delta: number) => {
    setTreeListWidth(prev => {
      const newWidth = prev + delta;
      return Math.max(constraints.treeList.min, Math.min(constraints.treeList.max, newWidth));
    });
  };

  const handleShellPreviewDividerDrag = (delta: number) => {
    setShellPreviewWidth(prev => {
      const newWidth = prev + delta;
      return Math.max(constraints.shellPreview.min, Math.min(constraints.shellPreview.max, newWidth));
    });
  };

  const handleMetadataLeftDividerDrag = (delta: number) => {
    // Resize shell preview (left) and metadata (right)
    setShellPreviewWidth(prev => {
      const newWidth = prev + delta;
      return Math.max(constraints.shellPreview.min, Math.min(constraints.shellPreview.max, newWidth));
    });
    setMetadataWidth(prev => {
      const newWidth = prev - delta;
      return Math.max(constraints.metadata.min, Math.min(constraints.metadata.max, newWidth));
    });
  };

  const handleMetadataRightDividerDrag = (delta: number) => {
    setMetadataWidth(prev => {
      const newWidth = prev + delta;
      return Math.max(constraints.metadata.min, Math.min(constraints.metadata.max, newWidth));
    });
  };

  const handleAICopilotDividerDrag = (delta: number) => {
    setAiCopilotWidth(prev => {
      const newWidth = prev - delta; // AI Copilot on right, so reverse delta
      return Math.max(constraints.aiCopilot.min, Math.min(constraints.aiCopilot.max, newWidth));
    });
  };

  return (
    <div className="bg-white size-full flex">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient-ai" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFA9FF" />
            <stop offset="34%" stopColor="#939AFF" />
            <stop offset="70%" stopColor="#078EFB" />
            <stop offset="100%" stopColor="#406AFB" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Tree List Sidebar */}
        <div
          className="overflow-hidden shrink-0"
          style={{
            width: treeListOpen ? `${treeListWidth}px` : '0px',
            transition: treeListOpen ? 'opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)' : 'width 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
            opacity: treeListOpen ? 1 : 0,
          }}
        >
          {treeListOpen && (
            <div className="flex flex-col h-full w-full relative bg-[#f8f7f7]">
              <div aria-hidden="true" className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-0 pointer-events-none" />
              <TreeListHeader
                eventCode="AZE2001-301"
                eventName="CSR Interim Analysis"
                onToggleTreeList={handleToggleTreeList}
              />
              <SearchBar />
              <div className="flex-1 overflow-auto">
                <div className="flex flex-col gap-[12px] py-[8px]">
                  {programs.map((program) => (
                    <TreeItem
                      key={program.id}
                      program={program}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                      onToggleLock={handleToggleLock}
                      onToggleExpand={handleToggleExpand}
                      onShowLockedModal={handleShowLockedModal}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider: Tree List ↔ next panel */}
        {treeListOpen && (shellPreviewOpen || metadataOpen || codeOpen) && (
          <Divider onDrag={handleTreeListDividerDrag} />
        )}

        {/* Right Side Container with View Toggle */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View Toggle Bar */}
          <ViewToggleBar
            treeListOpen={treeListOpen}
            onToggleTreeList={handleToggleTreeList}
            panelView={panelView}
            onPanelViewChange={handlePanelViewChange}
          />

          {/* Content Area with Panels */}
          <div className="flex flex-1 overflow-hidden">
            {/* Shell Preview Panel — flex-1 when shell-only, fixed width otherwise */}
            <div
              className={`overflow-hidden ${panelView === 'shell' ? 'flex-1' : 'shrink-0'}`}
              style={{
                width: panelView === 'shell' ? undefined : (shellPreviewOpen ? `${shellPreviewWidth}px` : '0px'),
                transition: shellPreviewOpen ? 'opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)' : 'width 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                opacity: shellPreviewOpen ? 1 : 0,
              }}
            >
              {shellPreviewOpen && (
                <ShellPreview
                  selectedItem={getSelectedItemName()}
                  onBlockClick={handleBlockClick}
                  onMetadataClick={handleMetadataToggle}
                  metadataOpen={metadataOpen}
                />
              )}
            </div>

            {/* Divider: Shell Preview ↔ Metadata (left divider of Metadata) */}
            {shellPreviewOpen && metadataOpen && (
              <Divider onDrag={handleMetadataLeftDividerDrag} />
            )}

            {/* Divider: Shell Preview ↔ Code (when Metadata closed) */}
            {shellPreviewOpen && !metadataOpen && codeOpen && (
              <Divider onDrag={handleShellPreviewDividerDrag} />
            )}

            {/* Metadata Panel */}
            <div
              className="overflow-hidden shrink-0"
              style={{
                width: metadataOpen ? `${metadataWidth}px` : '0px',
                transition: metadataOpen ? 'opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)' : 'width 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                opacity: metadataOpen ? 1 : 0,
              }}
            >
              {metadataOpen && <MetadataPanel onClose={handleCloseMetadata} isLocked={isSelectedItemLocked()} />}
            </div>

            {/* Divider: Metadata ↔ Code */}
            {metadataOpen && codeOpen && (
              <Divider onDrag={handleMetadataRightDividerDrag} />
            )}

            {/* Code Panel */}
            {codeOpen && (
              <div
                className="flex-1"
                style={{
                  minWidth: '400px',
                  transition: 'all 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                }}
              >
                <CodePanel selectedItem={getSelectedItemName()} isCollapsed={metadataOpen} isLocked={isSelectedItemLocked()} />
              </div>
            )}

            {/* Divider: Code ↔ AI Copilot */}
            {codeOpen && aiCopilotOpen && (
              <Divider onDrag={handleAICopilotDividerDrag} />
            )}

            {/* AI Copilot Panel */}
            <div
              className="overflow-hidden shrink-0"
              style={{
                width: aiCopilotOpen ? `${aiCopilotWidth}px` : '0px',
                transition: aiCopilotOpen ? 'opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)' : 'width 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                opacity: aiCopilotOpen ? 1 : 0,
              }}
            >
              {aiCopilotOpen && <AICopilot onClose={handleCloseAICopilot} isLocked={isSelectedItemLocked()} />}
            </div>

            {/* FAB for AI Copilot */}
            {!aiCopilotOpen && <FAB onClick={handleOpenAICopilot} isLocked={isSelectedItemLocked()} />}
          </div>
        </div>
      </div>

      {/* Locked by Parent Modal */}
      <Modal
        isOpen={modalState.type === 'locked-by-parent'}
        onClose={handleCloseModal}
        title="Locked by Section"
        description="This table is locked because its parent section is locked."
        primaryAction={{
          label: 'Unlock Section',
          onClick: () => {
            if (modalState.programName) {
              const program = programs.find(p => p.name === modalState.programName);
              if (program) {
                handleToggleLock(program.id);
              }
            }
            setModalState({ type: null });
          },
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: handleCloseModal,
        }}
      />
    </div>
  );
}
