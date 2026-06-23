import { useState } from 'react';
import { Lock, Unlock, Table as TableIcon, Search, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './components/ui/tooltip';
import Modal from './components/Modal';
import TopNav from './components/TopNav';

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
  onShowUnlockModal: (programId: string, programName: string) => void;
}

function TreeItem({
  program,
  selectedId,
  onSelect,
  onToggleLock,
  onToggleExpand,
  onShowLockedModal,
  onShowUnlockModal
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
                if (isProgram) {
                  onShowUnlockModal(itemId, program.name);
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

    // Pending state - show lock button on hover
    if (isHovered && item.status === 'pending') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isProgram) {
                  onToggleLock(itemId);
                } else {
                  onToggleLock(program.id, itemId);
                }
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

export default function App() {
  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      id: 'p1',
      name: 'Program code A',
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
      name: 'Program code B',
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
    type: 'locked-by-parent' | 'unlock-program' | null;
    programId?: string;
    programName?: string;
  }>({ type: null });

  const events = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleToggleLock = (programId: string, tableId?: string) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => {
        if (program.id !== programId) return program;

        if (!tableId) {
          // Toggle program lock - cascades to all tables
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

  const handleShowUnlockModal = (programId: string, programName: string) => {
    setModalState({ type: 'unlock-program', programId, programName });
  };

  const handleUnlockProgram = () => {
    if (modalState.programId) {
      handleToggleLock(modalState.programId);
    }
    setModalState({ type: null });
  };

  const handleCloseModal = () => {
    setModalState({ type: null });
  };

  return (
    <div className="bg-white size-full flex flex-col">
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

      {/* Top Navigation */}
      <TopNav
        currentEvent={currentEvent}
        events={events}
        onEventChange={setCurrentEvent}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex flex-col h-full w-[180px] relative">
          <div aria-hidden="true" className="absolute border-[#d8dada] border-r-[0.6px] border-solid inset-0 pointer-events-none" />
          <SearchBar />
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-[12px] py-[8px]">
              {programs.map((program) => (
                <TreeItem
                  key={program.id}
                  program={program}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onToggleLock={handleToggleLock}
                  onToggleExpand={handleToggleExpand}
                  onShowLockedModal={handleShowLockedModal}
                  onShowUnlockModal={handleShowUnlockModal}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-medium text-[#3c4242] mb-2">
              {programs
                .flatMap((p) => [p, ...p.tables])
                .find((item) => item.id === selectedId)?.name || 'Select an item'}
            </h2>
            <p className="text-sm text-[#666]">
              Status:{' '}
              {programs
                .flatMap((p) => [p, ...p.tables])
                .find((item) => item.id === selectedId)?.status || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Locked by Parent Modal */}
      <Modal
        isOpen={modalState.type === 'locked-by-parent'}
        onClose={handleCloseModal}
        title="Locked by Program code"
        description="This table is locked because its parent program code is locked."
        primaryAction={{
          label: 'Unlock Program Code',
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

      {/* Unlock Program Modal */}
      <Modal
        isOpen={modalState.type === 'unlock-program'}
        onClose={handleCloseModal}
        title="Unlock Program Code?"
        description="This will also unlock all associated Table Codes."
        primaryAction={{
          label: 'Unlock',
          onClick: handleUnlockProgram,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: handleCloseModal,
        }}
      />
    </div>
  );
}
