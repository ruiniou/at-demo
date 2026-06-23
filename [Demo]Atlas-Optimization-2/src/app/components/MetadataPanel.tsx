import { useState, useRef, useEffect } from 'react';
import { Edit2, CheckSquare, Square, ChevronRight, RefreshCw, ExternalLink, Search, X } from 'lucide-react';
import svgPaths from '../../imports/CodeIncline/svg-tazdgl3vpl';
import VariablesBrowseModal, { ALL_VARIABLES } from './VariablesBrowseModal';

type FieldStatus = 'unconfirmed' | 'confirmed' | 'edited';

interface Field {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
}

interface Block {
  id: string;
  fields: Field[];
}

interface MetadataPanelProps {
  onClose: () => void;
  isLocked?: boolean;
}

const GROUP_OPTIONS = [
  {
    name: 'SAFT01aL1_3_12_123NP',
    lines: [
      "proc format;",
      "  value gpT01aG5L1_3_12_123f",
      "  1 = 'AZD999(*ESC*)n1 mg/kg'",
      "  2 = 'AZD999(*ESC*)n2 mg/kg'",
      "  3 = 'AZD999(*ESC*)nTotal'",
      "  4 = 'Investigator choice of therapy'",
      "  5 = 'Total'",
      "  ;",
      "quit;",
      "",
      "%m_u_popn(",
      "    inds=adam.adsl",
      "    ,pop_flag=SAF3LFL='Y'",
      "    ,trtgrpn=TRT01AN",
      "    ,trtlev=1|2|1 2|3|1 2 3",
      "    ,UniqueIDVars=usubjid",
      "    ,trtfmtC=gpT01aG5L1_3_12_123f",
      "    ,gmacro=SAF3LT01aL1_3_12_123NP",
      "    ,BigN=Y",
      "    ,nformat=%str(n (%%))",
      "    );",
    ],
  },
  {
    name: 'SAFT01bL2_5_8_456NP',
    lines: [
      "proc format;",
      "  value gpT01bG3L2_5_8_456f",
      "  1 = 'Treatment A 100mg'",
      "  2 = 'Treatment B 200mg'",
      "  3 = 'Placebo'",
      "  4 = 'Total'",
      "  ;",
      "quit;",
      "",
      "%m_u_popn(",
      "    inds=adam.adsl",
      "    ,pop_flag=SAF1LFL='Y'",
      "    ,trtgrpn=TRT01AN",
      "    ,UniqueIDVars=usubjid",
      "    ,trtfmtC=gpT01bG3L2_5_8_456f",
      "    ,gmacro=SAF1LT01bL2_5_8_456NP",
      "    ,BigN=Y",
      "    );",
    ],
  },
  {
    name: 'SAFT02aL1_7_3_789NP',
    lines: [
      "proc format;",
      "  value gpT02aG2L1_7_3_789f",
      "  1 = 'Active'",
      "  2 = 'Control'",
      "  3 = 'Total'",
      "  ;",
      "quit;",
      "",
      "%m_u_popn(",
      "    inds=adam.adsl",
      "    ,pop_flag=ITT1FL='Y'",
      "    ,trtgrpn=TRT02AN",
      "    ,UniqueIDVars=usubjid",
      "    ,trtfmtC=gpT02aG2L1_7_3_789f",
      "    ,gmacro=ITT1T02aL1_7_3_789NP",
      "    ,BigN=Y",
      "    );",
    ],
  },
];

// Group code inline viewer — matches CodeIncline Figma design
function GroupCodeViewer({ lines }: { lines: string[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative rounded-[2px] w-full mt-[4px]">
      <div className="overflow-clip rounded-[2px] border-[0.6px] border-[#d8dada]">

        {/* Header row — "Group Code" + chevron, click to toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center gap-[4px] px-[10px] py-[8px] bg-white hover:bg-[#f8f7f7] transition-colors active:scale-[0.99]"
          aria-expanded={expanded}
        >
          <span
            className="text-[12px] text-[#3c4242] leading-[20px]"
            style={{ fontFamily: "'PingFang SC', sans-serif" }}
          >
            Group Code
          </span>
          {/* Chevron: down when expanded, right-pointing (rotated) when collapsed */}
          <div
            className="shrink-0 size-[16px] flex items-center justify-center transition-transform duration-150"
            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            <svg width="9" height="6" viewBox="0 0 8.48527 5.18548" fill="none">
              <path d={svgPaths.p3cfa0180} fill="#888E8E" />
            </svg>
          </div>
        </button>

        {/* Code content area */}
        {expanded && (
          <div className="relative border-t-[0.6px] border-[#d8dada]">
            {/* Scrollable code — both axes */}
            <div className="overflow-auto bg-[#f8f7f7]" style={{ maxHeight: '220px' }}>
              <div className="py-[4px]" style={{ minWidth: 'max-content' }}>
                {lines.map((line, i) => (
                  <div key={i} className="flex items-start h-[20px] px-[10px]">
                    <div className="shrink-0 w-[24px] h-[20px] relative">
                      <p
                        className="absolute left-0 top-px whitespace-nowrap select-none"
                        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: '12px', lineHeight: '20px', color: '#b2b4b4' }}
                      >
                        {i + 1}
                      </p>
                    </div>
                    <div className="flex-1 min-w-px h-full flex items-center">
                      <p
                        className="whitespace-nowrap"
                        style={{ fontFamily: "'Menlo','Consolas',monospace", fontSize: '13px', lineHeight: '1.25', color: '#888e8e' }}
                      >
                        {line}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Variables field with inline search + Browse All modal ──────────────────
interface VariablesFieldProps {
  isLocked?: boolean;
  selectedIds: string[];
  onChangeIds: (ids: string[]) => void;
}

function VariablesField({ isLocked, selectedIds, onChangeIds }: VariablesFieldProps) {
  const [inlineOpen, setInlineOpen] = useState(false);
  const [inlineSearch, setInlineSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inlineSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setInlineOpen(false);
        setInlineSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inlineOpen) setTimeout(() => inlineSearchRef.current?.focus(), 50);
  }, [inlineOpen]);

  const selectedVars = ALL_VARIABLES.filter(v => selectedIds.includes(v.id));

  const filteredInline = ALL_VARIABLES.filter(v => {
    const q = inlineSearch.toLowerCase();
    return v.variable.toLowerCase().includes(q) || v.label.toLowerCase().includes(q);
  }).slice(0, 8);

  const removeTag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeIds(selectedIds.filter(x => x !== id));
  };

  const toggleInline = (id: string) => {
    onChangeIds(
      selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]
    );
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInlineOpen(false);
    setInlineSearch('');
    setModalOpen(true);
  };

  const handleModalConfirm = (ids: string[]) => {
    onChangeIds(ids);
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-[4px]">
        {/* Label */}
        <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
          Variables
        </p>

        {/* Input area */}
        <div className="relative" ref={containerRef}>
          <div
            onClick={isLocked ? undefined : () => setInlineOpen(v => !v)}
            className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border flex flex-wrap gap-[4px] items-start transition-colors cursor-text ${
              isLocked
                ? 'bg-[#f8f7f7] border-transparent cursor-not-allowed'
                : inlineOpen
                ? 'border-[#830051] bg-white'
                : 'border-[#999] bg-white hover:border-[#666]'
            }`}
          >
            {selectedVars.map(v => (
              <span key={v.id} className="inline-flex items-center gap-[3px] bg-[#f4e8ee] rounded-[3px] px-[5px] py-[1px] my-[1px]">
                <span className="font-['PingFang_SC:Regular',sans-serif] text-[11px] text-[#830051] leading-[18px]">{v.variable}</span>
                {!isLocked && (
                  <button onClick={e => removeTag(v.id, e)} className="flex items-center hover:opacity-70">
                    <X className="size-[9px] text-[#830051]" />
                  </button>
                )}
              </span>
            ))}
            {selectedVars.length === 0 && !inlineOpen && (
              <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#999] leading-[24px]">Select variables…</span>
            )}
          </div>

          {/* Inline dropdown */}
          {inlineOpen && (
            <div
              className="absolute left-0 right-0 top-[calc(100%+2px)] z-20 bg-white rounded-[6px] overflow-hidden flex flex-col"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 0 0 0.6px rgba(0,0,0,0.08)', maxHeight: '280px' }}
            >
              {/* Search inside dropdown */}
              <div className="flex items-center gap-[6px] px-[10px] py-[6px] border-b border-[#f0f0f0]">
                <Search className="size-[13px] text-[#999] shrink-0" />
                <input
                  ref={inlineSearchRef}
                  type="text"
                  value={inlineSearch}
                  onChange={e => setInlineSearch(e.target.value)}
                  placeholder="Search variables..."
                  className="flex-1 font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] placeholder-[#999] focus:outline-none bg-transparent"
                />
              </div>

              {/* Variable list */}
              <div className="overflow-auto flex-1">
                {filteredInline.map(v => {
                  const isSelected = selectedIds.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => toggleInline(v.id)}
                      className={`w-full text-left px-[10px] py-[7px] flex items-center gap-[8px] transition-colors ${
                        isSelected ? 'bg-[#f4e8ee]' : 'hover:bg-[#f8f7f7]'
                      }`}
                    >
                      <div className={`size-[13px] rounded-[2px] border shrink-0 flex items-center justify-center ${isSelected ? 'bg-[#830051] border-[#830051]' : 'border-[#999] bg-white'}`}>
                        {isSelected && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] shrink-0 ${isSelected ? 'text-[#830051]' : 'text-[#3c4242]'}`}>{v.variable}</span>
                      <span className="font-['PingFang_SC:Regular',sans-serif] text-[11px] text-[#888E8E] truncate">{v.label}</span>
                    </button>
                  );
                })}
                {filteredInline.length === 0 && (
                  <p className="px-[10px] py-[12px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#999] text-center">
                    No variables found
                  </p>
                )}
              </div>

              {/* Browse All link */}
              <button
                onClick={openModal}
                className="flex items-center justify-between px-[10px] py-[8px] border-t border-[#f0f0f0] hover:bg-[#f8f7f7] transition-colors"
              >
                <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#830051]">Browse All Variables</span>
                <ChevronRight className="size-[14px] text-[#830051]" />
              </button>
            </div>
          )}
        </div>
      </div>

      <VariablesBrowseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedIds={selectedIds}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}

const INITIAL_VARIABLE_IDS = ['TRTEMFL', 'AETERM', 'ACAT1'];

export default function MetadataPanel({ onClose, isLocked }: MetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'blocks'>('basic');
  const [variableIds, setVariableIds] = useState<string[]>(INITIAL_VARIABLE_IDS);
  const variablesEdited =
    JSON.stringify([...variableIds].sort()) !== JSON.stringify([...INITIAL_VARIABLE_IDS].sort());

  // Group Name state
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [groupStatus, setGroupStatus] = useState<FieldStatus>('unconfirmed');
  const [groupConfirmed, setGroupConfirmed] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGroupDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGroupSelect = (idx: number) => {
    if (idx !== selectedGroupIdx) {
      setSelectedGroupIdx(idx);
      setGroupStatus('edited');
      setGroupConfirmed(false);
    }
    setGroupDropdownOpen(false);
  };

  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'block1',
      fields: [
        { id: 'f1', label: 'Input Dataset(s)', value: 'ADSL', status: 'unconfirmed' },
        { id: 'f2', label: 'Program Name', value: 't_dm', status: 'unconfirmed' },
        { id: 'f3', label: 'Output Dataset', value: 'ADEFF', status: 'unconfirmed' },
        { id: 'f4', label: 'Population', value: 'Safety', status: 'unconfirmed' },
      ],
    },
  ]);

  // Stats — include group field
  const totalFields = blocks.reduce((sum, b) => sum + b.fields.length, 0) + 1;
  const confirmedCount =
    blocks.reduce((sum, b) => sum + b.fields.filter(f => f.status === 'confirmed').length, 0) +
    (groupConfirmed ? 1 : 0);
  const hasAnyEdits =
    groupStatus === 'edited' ||
    variablesEdited ||
    blocks.some(b => b.fields.some(f => f.status === 'edited'));
  const confirmableFields =
    blocks.reduce((sum, b) => sum + b.fields.filter(f => f.status !== 'edited').length, 0) +
    (groupStatus !== 'edited' ? 1 : 0);

  const selectAllState: 'empty' | 'indeterminate' | 'checked' =
    confirmedCount === 0 ? 'empty' :
    confirmedCount === confirmableFields ? 'checked' : 'indeterminate';

  const handleConfirm = (blockId: string, fieldId: string) => {
    setBlocks(prev =>
      prev.map(b =>
        b.id !== blockId ? b : {
          ...b,
          fields: b.fields.map(f =>
            f.id !== fieldId ? f : {
              ...f,
              status: (f.status === 'confirmed' ? 'unconfirmed' : 'confirmed') as FieldStatus,
            }
          ),
        }
      )
    );
  };

  const handleSelectAll = () => {
    const confirm = selectAllState === 'empty' || selectAllState === 'indeterminate';
    if (groupStatus !== 'edited') setGroupConfirmed(confirm);
    setBlocks(prev =>
      prev.map(b => ({
        ...b,
        fields: b.fields.map(f =>
          f.status === 'edited' ? f : { ...f, status: confirm ? 'confirmed' : 'unconfirmed' as FieldStatus }
        ),
      }))
    );
  };

  const handleFieldEdit = (blockId: string, fieldId: string, value: string) => {
    setBlocks(prev =>
      prev.map(b =>
        b.id !== blockId ? b : {
          ...b,
          fields: b.fields.map(f =>
            f.id !== fieldId ? f : { ...f, value, status: 'edited' as FieldStatus }
          ),
        }
      )
    );
  };

  const handleUpdateCode = () => {
    if (groupStatus === 'edited') setGroupStatus('unconfirmed');
    setBlocks(prev =>
      prev.map(b => ({
        ...b,
        fields: b.fields.map(f =>
          f.status === 'edited' ? { ...f, status: 'unconfirmed' as FieldStatus } : f
        ),
      }))
    );
  };

  const getFieldStyles = (status: FieldStatus) => {
    switch (status) {
      case 'unconfirmed': return {
        containerBg: 'bg-white', containerBorder: 'border-transparent',
        inputBorder: 'border-[#999]', checkboxIcon: Square,
        checkboxColor: 'text-[#888E8E]', showDropdown: true,
      };
      case 'edited': return {
        containerBg: 'bg-[#fceecc]', containerBorder: 'border-[#f0ab00]',
        inputBorder: 'border-transparent', checkboxIcon: CheckSquare,
        checkboxColor: 'text-[#f0ab00]', showDropdown: false,
      };
      case 'confirmed': return {
        containerBg: 'bg-[#f3f7cc]', containerBorder: 'border-[#c4d600]',
        inputBorder: 'border-transparent', checkboxIcon: CheckSquare,
        checkboxColor: 'text-[#1e7e34]', showDropdown: false,
      };
    }
  };

  const groupStyles = getFieldStyles(groupStatus === 'edited' ? 'edited' : groupConfirmed ? 'confirmed' : 'unconfirmed');

  return (
    <div className="h-full w-full bg-white border-r border-[#e5e8e8] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white h-[40px] relative shrink-0 w-full border-b border-[#d8dada]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center h-full">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center justify-center px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] ${activeTab === 'basic' ? 'border-[#830051]' : 'border-transparent'}`}
            >
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${activeTab === 'basic' ? 'text-[#830051]' : 'text-[#3c4242]'}`}>
                Basic info
              </p>
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex items-center justify-center px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] ${activeTab === 'blocks' ? 'border-[#830051]' : 'border-transparent'}`}
            >
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${activeTab === 'blocks' ? 'text-[#830051]' : 'text-[#3c4242]'}`}>
                Blocks
              </p>
            </button>
          </div>
          <div className="flex items-center pr-[12px]">
            <button className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96]" aria-label="Batch edit">
              <Edit2 className="size-4 text-[#888E8E]" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#f8f7f7] px-[12px] py-[8px] flex items-center justify-end">
        <div className="flex items-center gap-[6px]">
          <button
            onClick={isLocked ? undefined : handleSelectAll}
            disabled={isLocked}
            className={`size-[20px] flex items-center justify-center rounded-[2px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
            aria-label="Select all"
          >
            {selectAllState === 'empty' && <Square className="size-[18px] text-[#888E8E]" strokeWidth={1.5} />}
            {selectAllState === 'indeterminate' && (
              <div className="size-[18px] border-[1.5px] border-[#888E8E] rounded-[2px] flex items-center justify-center">
                <div className="w-[10px] h-[1.5px] bg-[#888E8E]" />
              </div>
            )}
            {selectAllState === 'checked' && <CheckSquare className="size-[18px] text-[#1e7e34]" strokeWidth={1.5} />}
          </button>
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[16px] text-[#3c4242] whitespace-nowrap tabular-nums">
            {confirmedCount}/{totalFields} confirmed
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-[4px]">
        {activeTab === 'basic' && (
          <div className="flex flex-col gap-[4px]">

            {/* ── Group Name card ── */}
            <div className={`${groupStyles.containerBg} rounded-[4px] border ${groupStyles.containerBorder}`}>
              <div className="flex flex-col gap-[4px] p-[8px]">

                {/* Label row */}
                <div className="flex items-center justify-between h-[20px]">
                  <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                    Group Name
                  </p>
                  <div className="flex items-center gap-[2px]">
                    <button
                      disabled={isLocked}
                      className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                      aria-label="Open group definition"
                    >
                      <ExternalLink className="size-[14px] text-[#888E8E]" />
                    </button>
                    <button
                      onClick={isLocked ? undefined : () => {
                        if (groupStatus !== 'edited') setGroupConfirmed(v => !v);
                      }}
                      disabled={isLocked || groupStatus === 'edited'}
                      className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked || groupStatus === 'edited' ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                      aria-label={groupConfirmed ? 'Unconfirm group' : 'Confirm group'}
                    >
                      {groupConfirmed && groupStatus !== 'edited'
                        ? <CheckSquare className={`size-4 ${groupStyles.checkboxColor}`} />
                        : <groupStyles.checkboxIcon className={`size-4 ${groupStyles.checkboxColor}`} />
                      }
                    </button>
                  </div>
                </div>

                {/* Dropdown input */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={isLocked ? undefined : () => setGroupDropdownOpen(v => !v)}
                    disabled={isLocked}
                    className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border text-left flex items-center justify-between gap-[4px] transition-colors ${
                      isLocked
                        ? 'bg-[#f8f7f7] border-transparent cursor-not-allowed'
                        : groupStatus === 'edited'
                        ? 'bg-white border-transparent'
                        : groupStatus === 'confirmed'
                        ? 'bg-white border-transparent'
                        : 'bg-white border-[#999] hover:border-[#666]'
                    }`}
                  >
                    <span className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] flex-1 text-left ${isLocked ? 'text-[#b2b4b4]' : 'text-black'}`}>
                      {GROUP_OPTIONS[selectedGroupIdx].name}
                    </span>
                    {!isLocked && groupStatus !== 'edited' && groupStatus !== 'confirmed' && (
                      <ChevronRight className="size-4 text-[#999] shrink-0" />
                    )}
                  </button>

                  {/* Dropdown list */}
                  {groupDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+2px)] z-20 bg-white rounded-[6px] overflow-hidden"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 0 0 0.6px rgba(0,0,0,0.08)' }}
                    >
                      {GROUP_OPTIONS.map((opt, idx) => (
                        <button
                          key={opt.name}
                          onClick={() => handleGroupSelect(idx)}
                          className={`w-full text-left px-[10px] py-[7px] font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] transition-colors ${
                            idx === selectedGroupIdx
                              ? 'bg-[#f4e8ee] text-[#830051]'
                              : 'text-[#3c4242] hover:bg-[#f8f7f7]'
                          }`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Group code — self-contained collapsible viewer */}
                <GroupCodeViewer lines={GROUP_OPTIONS[selectedGroupIdx].lines} />

              </div>
            </div>

            {/* ── Regular fields ── */}
            {blocks.map((block) =>
              block.fields.map((field) => {
                const styles = getFieldStyles(field.status);
                const CheckboxIcon = styles.checkboxIcon;
                return (
                  <div key={field.id} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                    <div className="flex flex-col gap-[4px] p-[8px]">
                      <div className="flex items-center justify-between h-[20px]">
                        <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                          {field.label}
                        </p>
                        <button
                          onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)}
                          disabled={isLocked}
                          className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                          aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                        >
                          <CheckboxIcon className={`size-4 ${styles.checkboxColor}`} />
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={field.value}
                          onChange={isLocked ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                          readOnly={isLocked}
                          className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none break-words ${
                            isLocked
                              ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed'
                              : `bg-white ${styles.inputBorder} text-black`
                          }`}
                        />
                        {!isLocked && styles.showDropdown && (
                          <div className="absolute right-[8px] top-[8px] pointer-events-none">
                            <ChevronRight className="size-4 text-[#999]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {activeTab === 'blocks' && (
          <div className="flex flex-col gap-[4px]">
            {/* Block header */}
            <div className="px-[8px] py-[6px] bg-[#f8f7f7] rounded-[4px] border border-[#e5e8e8]">
              <p className="font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] leading-[18px] uppercase tracking-wide">Block 1</p>
            </div>

            {/* Block Title */}
            <div className="bg-white rounded-[4px] border border-transparent">
              <div className="flex flex-col gap-[4px] p-[8px]">
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">Block Title</p>
                <input
                  type="text"
                  defaultValue="Demographics Summary"
                  readOnly={isLocked}
                  className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none ${
                    isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : 'bg-white border-[#999] text-black hover:border-[#666]'
                  }`}
                />
              </div>
            </div>

            {/* Block Type */}
            <div className="bg-white rounded-[4px] border border-transparent">
              <div className="flex flex-col gap-[4px] p-[8px]">
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">Block Type</p>
                <div className="relative">
                  <select
                    disabled={isLocked}
                    defaultValue="table"
                    className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] appearance-none focus:outline-none ${
                      isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : 'bg-white border-[#999] text-black hover:border-[#666] cursor-pointer'
                    }`}
                  >
                    <option value="table">Table</option>
                    <option value="figure">Figure</option>
                    <option value="listing">Listing</option>
                  </select>
                  {!isLocked && (
                    <div className="absolute right-[8px] top-[8px] pointer-events-none">
                      <ChevronRight className="size-4 text-[#999]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Variables — special multi-select field */}
            <div className={`rounded-[4px] border ${variablesEdited ? 'bg-[#fceecc] border-[#f0ab00]' : 'bg-white border-transparent'}`}>
              <div className="p-[8px]">
                <VariablesField
                  isLocked={isLocked}
                  selectedIds={variableIds}
                  onChangeIds={setVariableIds}
                />
              </div>
            </div>

            {/* Filter Condition */}
            <div className="bg-white rounded-[4px] border border-transparent">
              <div className="flex flex-col gap-[4px] p-[8px]">
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">Filter Condition</p>
                <input
                  type="text"
                  defaultValue="SAFFL='Y'"
                  readOnly={isLocked}
                  className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none ${
                    isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : 'bg-white border-[#999] text-black hover:border-[#666]'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Code Button */}
      {hasAnyEdits && (
        <div className="p-[12px] border-t border-[#d8dada]">
          <button
            onClick={isLocked ? undefined : handleUpdateCode}
            disabled={isLocked}
            className={`w-full flex items-center justify-center gap-[4px] h-[32px] px-[12px] py-[8px] rounded-[4px] transition-colors ${
              isLocked
                ? 'bg-[#d8dada] cursor-not-allowed'
                : 'bg-[#830051] hover:bg-[#6d0043] active:scale-[0.96]'
            }`}
          >
            <RefreshCw className={`size-4 ${isLocked ? 'text-[#888E8E]' : 'text-white'}`} />
            <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] ${isLocked ? 'text-[#888E8E]' : 'text-white'}`}>
              Add Changes to Chat
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
