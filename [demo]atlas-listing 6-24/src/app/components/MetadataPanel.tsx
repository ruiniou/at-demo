import { useState, useRef, useEffect } from 'react';
import { Edit2, CheckSquare, Square, ChevronRight } from 'lucide-react';
import svgPaths from '../../imports/CodeIncline/svg-tazdgl3vpl';
import metaSvg from '../../imports/Metadata/svg-0xxqlowm9g';

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
  frozenUntilIndex?: number | null;
  pageSepActive?: boolean;
  pageColumnCounts?: Record<string, number>;
  idpageBaseline?: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  idlistBaseline?: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  onIdpageBaselineChange?: (baseline: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  onIdlistBaselineChange?: (baseline: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  onAddToChat?: () => void;
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

export default function MetadataPanel({
  onClose,
  isLocked,
  frozenUntilIndex,
  pageSepActive,
  pageColumnCounts = {},
  idpageBaseline = null,
  idlistBaseline = null,
  onIdpageBaselineChange,
  onIdlistBaselineChange,
  onAddToChat,
}: MetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'blocks'>('basic');

  // Persist metadata field states across panel close/reopen within the same session
  const loadFromSession = <T,>(key: string, fallback: T): T => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  // Block fields state (Blocks tab)
  const [blockFields, setBlockFields] = useState<{ id: string; label: string; value: string; status: FieldStatus }[]>(() =>
    loadFromSession('metadataBlockFields', [
      { id: 'blockTitle', label: 'Block Title', value: 'Demographics Summary', status: 'unconfirmed' },
      { id: 'blockType', label: 'Block Type', value: 'table', status: 'unconfirmed' },
      { id: 'idpage', label: 'idpage', value: '1', status: 'unconfirmed' },
      { id: 'idlist', label: 'idlist', value: '1', status: 'unconfirmed' },
      { id: 'filterCondition', label: 'Filter Condition', value: "SAFFL='Y'", status: 'unconfirmed' },
    ])
  );
  useEffect(() => {
    sessionStorage.setItem('metadataBlockFields', JSON.stringify(blockFields));
  }, [blockFields]);

  // Basic info blocks state
  const [blocks, setBlocks] = useState<Block[]>(() =>
    loadFromSession('metadataBlocks', [
      {
        id: 'block1',
        fields: [
          { id: 'f1', label: 'Input Dataset(s)', value: 'ADSL', status: 'unconfirmed' },
          { id: 'f2', label: 'Program Name', value: 't_dm', status: 'unconfirmed' },
          { id: 'f3', label: 'Output Dataset', value: 'ADEFF', status: 'unconfirmed' },
          { id: 'f4', label: 'Population', value: 'Safety', status: 'unconfirmed' },
        ],
      },
    ])
  );
  useEffect(() => {
    sessionStorage.setItem('metadataBlocks', JSON.stringify(blocks));
  }, [blocks]);

  // Group Name state
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(() => loadFromSession('metadataSelectedGroupIdx', 0));
  const [groupStatus, setGroupStatus] = useState<FieldStatus>(() => loadFromSession('metadataGroupStatus', 'unconfirmed'));
  const [groupConfirmed, setGroupConfirmed] = useState(() => loadFromSession('metadataGroupConfirmed', false));
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('metadataSelectedGroupIdx', JSON.stringify(selectedGroupIdx));
  }, [selectedGroupIdx]);
  useEffect(() => {
    sessionStorage.setItem('metadataGroupStatus', JSON.stringify(groupStatus));
  }, [groupStatus]);
  useEffect(() => {
    sessionStorage.setItem('metadataGroupConfirmed', JSON.stringify(groupConfirmed));
  }, [groupConfirmed]);

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

  // Stats — separate by active tab
  const isBasicTab = activeTab === 'basic';
  const basicTotalFields = blocks.reduce((sum, b) => sum + b.fields.length, 0) + 1;
  const basicConfirmedCount =
    blocks.reduce((sum, b) => sum + b.fields.filter(f => f.status === 'confirmed').length, 0) +
    (groupConfirmed ? 1 : 0);
  const basicConfirmableFields =
    blocks.reduce((sum, b) => sum + b.fields.filter(f => f.status !== 'edited').length, 0) +
    (groupStatus !== 'edited' ? 1 : 0);

  const blocksTotalFields = blockFields.length;
  const blocksConfirmedCount = blockFields.filter(f => f.status === 'confirmed').length;
  const blocksConfirmableFields = blockFields.filter(f => f.status !== 'edited').length;

  const totalFields = isBasicTab ? basicTotalFields : blocksTotalFields;
  const confirmedCount = isBasicTab ? basicConfirmedCount : blocksConfirmedCount;
  const confirmableFields = isBasicTab ? basicConfirmableFields : blocksConfirmableFields;

  const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => a[key] === b[key]);
  };

  const idpagePendingForButton = idpageBaseline !== null && (
    idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
    idpageBaseline.pageSepActive !== pageSepActive ||
    !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
  );
  const idlistPendingForButton = idlistBaseline !== null && (
    idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
    idlistBaseline.pageSepActive !== pageSepActive ||
    !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
  );

  const hasAnyEdits =
    groupStatus === 'edited' ||
    blockFields.some(f => f.status === 'edited') ||
    blocks.some(b => b.fields.some(f => f.status === 'edited')) ||
    idpagePendingForButton ||
    idlistPendingForButton;

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

  const handleBlockFieldConfirm = (fieldId: string) => {
    setBlockFields(prev => prev.map(f =>
      f.id !== fieldId ? f : { ...f, status: f.status === 'confirmed' ? 'unconfirmed' : 'confirmed' }
    ));
  };

  const handleIdFieldConfirm = (fieldId: string) => {
    const isIdpage = fieldId === 'idpage';
    const baseline = isIdpage ? idpageBaseline : idlistBaseline;
    const pending = baseline !== null && (
      baseline.frozenUntilIndex !== frozenUntilIndex || baseline.pageSepActive !== pageSepActive ||
      !Object.keys(baseline.pageColumnCounts).every(key => baseline.pageColumnCounts[key] === pageColumnCounts[key]) ||
      Object.keys(baseline.pageColumnCounts).length !== Object.keys(pageColumnCounts).length
    );
    const field = blockFields.find(f => f.id === fieldId)!;
    const isConfirming = field.status !== 'confirmed' || pending;

    if (isConfirming) {
      const newBaseline = { frozenUntilIndex: frozenUntilIndex ?? null, pageSepActive: pageSepActive ?? false, pageColumnCounts };
      if (isIdpage) {
        onIdpageBaselineChange?.(newBaseline);
      } else {
        onIdlistBaselineChange?.(newBaseline);
      }
    }

    setBlockFields(prev => prev.map(f =>
      f.id !== fieldId ? f : { ...f, status: isConfirming ? 'confirmed' : 'unconfirmed' }
    ));
  };

  const handleBlockFieldEdit = (fieldId: string, value: string) => {
    setBlockFields(prev => prev.map(f =>
      f.id !== fieldId ? f : { ...f, value, status: 'edited' }
    ));
  };

  const handleSelectAll = () => {
    const confirm = selectAllState === 'empty' || selectAllState === 'indeterminate';
    if (isBasicTab) {
      if (groupStatus !== 'edited') setGroupConfirmed(confirm);
      setBlocks(prev =>
        prev.map(b => ({
          ...b,
          fields: b.fields.map(f =>
            f.status === 'edited' ? f : { ...f, status: confirm ? 'confirmed' : 'unconfirmed' as FieldStatus }
          ),
        }))
      );
    } else {
      setBlockFields(prev =>
        prev.map(f =>
          f.status === 'edited' ? f : { ...f, status: confirm ? 'confirmed' : 'unconfirmed' as FieldStatus }
        )
      );
    }
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
    <div className="h-full w-full bg-white rounded-[8px] flex flex-col overflow-hidden relative border border-[#ebecec] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.04),0px_3px_8px_-2px_rgba(0,0,0,0.02)]">
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
              className={`relative flex items-center justify-center px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] ${activeTab === 'blocks' ? 'border-[#830051]' : 'border-transparent'}`}
            >
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${activeTab === 'blocks' ? 'text-[#830051]' : 'text-[#3c4242]'}`}>
                Blocks
              </p>
              {(() => {
                const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
                  const keysA = Object.keys(a);
                  const keysB = Object.keys(b);
                  if (keysA.length !== keysB.length) return false;
                  return keysA.every(key => a[key] === b[key]);
                };

                const idpagePending = idpageBaseline !== null && (
                  idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
                  idpageBaseline.pageSepActive !== pageSepActive ||
                  !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
                );

                const idlistPending = idlistBaseline !== null && (
                  idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
                  idlistBaseline.pageSepActive !== pageSepActive ||
                  !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
                );

                return blockFields.some(field => field.status === 'edited') || idpagePending || idlistPending;
              })() && (
                <span className="ml-[4px] size-[4px] rounded-full bg-[#D0006F]" aria-hidden="true" />
              )}
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

            {/* idpage */}
            {(() => {
              const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                if (keysA.length !== keysB.length) return false;
                return keysA.every(key => a[key] === b[key]);
              };
              const field = blockFields.find(f => f.id === 'idpage')!;
              const hasFrozenOrPageChange = idpageBaseline !== null && (
                idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
                idpageBaseline.pageSepActive !== pageSepActive ||
                !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
              );
              const isConfirmed = field.status === 'confirmed';
              const isEdited = field.status === 'edited';
              const showYellow = hasFrozenOrPageChange || isEdited;
              const ButtonIcon = isConfirmed && !hasFrozenOrPageChange ? CheckSquare : Square;
              const buttonColor = isConfirmed && !hasFrozenOrPageChange ? 'text-[#1e7e34]' : showYellow ? 'text-[#f0ab00]' : 'text-[#888E8E]';
              const inputBorder = isConfirmed || showYellow ? 'border-transparent' : 'border-[#999]';
              const containerBg = hasFrozenOrPageChange ? 'bg-[#fceecc]' : isConfirmed ? 'bg-[#f3f7cc]' : isEdited ? 'bg-[#fceecc]' : 'bg-white';
              const containerBorder = hasFrozenOrPageChange ? 'border-[#f0ab00]' : isConfirmed ? 'border-[#c4d600]' : isEdited ? 'border-[#f0ab00]' : 'border-transparent';
              return (
                <div className={`rounded-[4px] border ${containerBg} ${containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex items-center justify-between h-[20px]">
                      <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">{field.label}</p>
                      <button
                        onClick={isLocked ? undefined : () => handleIdFieldConfirm(field.id)}
                        disabled={isLocked}
                        className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                      >
                        <ButtonIcon className={`size-4 ${buttonColor}`} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={isLocked ? undefined : (e) => handleBlockFieldEdit(field.id, e.target.value)}
                      readOnly={isLocked}
                      className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none break-words ${
                        isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : `bg-white ${inputBorder} text-black`
                      }`}
                    />
                  </div>
                </div>
              );
            })()}

            {/* idlist */}
            {(() => {
              const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                if (keysA.length !== keysB.length) return false;
                return keysA.every(key => a[key] === b[key]);
              };
              const field = blockFields.find(f => f.id === 'idlist')!;
              const hasFrozenOrPageChange = idlistBaseline !== null && (
                idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
                idlistBaseline.pageSepActive !== pageSepActive ||
                !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
              );
              const isConfirmed = field.status === 'confirmed';
              const isEdited = field.status === 'edited';
              const showYellow = hasFrozenOrPageChange || isEdited;
              const ButtonIcon = isConfirmed && !hasFrozenOrPageChange ? CheckSquare : Square;
              const buttonColor = isConfirmed && !hasFrozenOrPageChange ? 'text-[#1e7e34]' : showYellow ? 'text-[#f0ab00]' : 'text-[#888E8E]';
              const inputBorder = isConfirmed || showYellow ? 'border-transparent' : 'border-[#999]';
              const containerBg = hasFrozenOrPageChange ? 'bg-[#fceecc]' : isConfirmed ? 'bg-[#f3f7cc]' : isEdited ? 'bg-[#fceecc]' : 'bg-white';
              const containerBorder = hasFrozenOrPageChange ? 'border-[#f0ab00]' : isConfirmed ? 'border-[#c4d600]' : isEdited ? 'border-[#f0ab00]' : 'border-transparent';
              return (
                <div className={`rounded-[4px] border ${containerBg} ${containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex items-center justify-between h-[20px]">
                      <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">{field.label}</p>
                      <button
                        onClick={isLocked ? undefined : () => handleIdFieldConfirm(field.id)}
                        disabled={isLocked}
                        className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                      >
                        <ButtonIcon className={`size-4 ${buttonColor}`} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={isLocked ? undefined : (e) => handleBlockFieldEdit(field.id, e.target.value)}
                      readOnly={isLocked}
                      className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none break-words ${
                        isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : `bg-white ${inputBorder} text-black`
                      }`}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Block Title */}
            {(() => {
              const field = blockFields.find(f => f.id === 'blockTitle')!;
              const styles = getFieldStyles(field.status);
              const CheckboxIcon = styles.checkboxIcon;
              return (
                <div className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex items-center justify-between h-[20px]">
                      <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">{field.label}</p>
                      <button
                        onClick={isLocked ? undefined : () => handleBlockFieldConfirm(field.id)}
                        disabled={isLocked}
                        className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                      >
                        <CheckboxIcon className={`size-4 ${styles.checkboxColor}`} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={isLocked ? undefined : (e) => handleBlockFieldEdit(field.id, e.target.value)}
                      readOnly={isLocked}
                      className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none break-words ${
                        isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : `bg-white ${styles.inputBorder} text-black`
                      }`}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Block Type */}
            {(() => {
              const field = blockFields.find(f => f.id === 'blockType')!;
              const styles = getFieldStyles(field.status);
              const CheckboxIcon = styles.checkboxIcon;
              return (
                <div className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex items-center justify-between h-[20px]">
                      <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">{field.label}</p>
                      <button
                        onClick={isLocked ? undefined : () => handleBlockFieldConfirm(field.id)}
                        disabled={isLocked}
                        className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                      >
                        <CheckboxIcon className={`size-4 ${styles.checkboxColor}`} />
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={field.value}
                        onChange={isLocked ? undefined : (e) => handleBlockFieldEdit(field.id, e.target.value)}
                        disabled={isLocked}
                        className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] appearance-none focus:outline-none ${
                          isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : `bg-white ${styles.inputBorder} text-black ${styles.showDropdown ? 'hover:border-[#666] cursor-pointer' : ''}`
                        }`}
                      >
                        <option value="table">Table</option>
                        <option value="figure">Figure</option>
                        <option value="listing">Listing</option>
                      </select>
                      {!isLocked && styles.showDropdown && (
                        <div className="absolute right-[8px] top-[8px] pointer-events-none">
                          <ChevronRight className="size-4 text-[#999]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Filter Condition */}
            {(() => {
              const field = blockFields.find(f => f.id === 'filterCondition')!;
              const styles = getFieldStyles(field.status);
              const CheckboxIcon = styles.checkboxIcon;
              return (
                <div className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex items-center justify-between h-[20px]">
                      <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">{field.label}</p>
                      <button
                        onClick={isLocked ? undefined : () => handleBlockFieldConfirm(field.id)}
                        disabled={isLocked}
                        className={`size-[24px] flex items-center justify-center rounded-[4px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                      >
                        <CheckboxIcon className={`size-4 ${styles.checkboxColor}`} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={isLocked ? undefined : (e) => handleBlockFieldEdit(field.id, e.target.value)}
                      readOnly={isLocked}
                      className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] focus:outline-none break-words ${
                        isLocked ? 'bg-[#f8f7f7] border-transparent text-[#b2b4b4] cursor-not-allowed' : `bg-white ${styles.inputBorder} text-black`
                      }`}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Add Changes to Chat — pinned to bottom, shown only when there are pending edits */}
      {hasAnyEdits && (
        <div className="h-[57px] relative shrink-0 w-full bg-white">
          <div aria-hidden className="absolute border-[#d8dada] border-solid border-t inset-0 pointer-events-none" />
          <div className="flex flex-col items-start pt-[13px] px-[12px]">
            <button
              onClick={isLocked ? undefined : onAddToChat}
              disabled={isLocked}
              className={`flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[4px] shrink-0 transition-colors active:scale-[0.96] w-full ${
                isLocked ? 'bg-[#d8dada] cursor-not-allowed' : 'bg-[#830051] hover:bg-[#6d0043]'
              }`}
            >
              <div className="overflow-clip relative shrink-0 size-[16px]">
                <div className="absolute inset-[13.54%_8.33%]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 11.6667">
                    <path d={metaSvg.p192f7280} fill="white" />
                    <path d={metaSvg.p14813800} fill="white" />
                    <path d={metaSvg.p3dc5c300} fill="white" />
                  </svg>
                </div>
              </div>
              <p className={`font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] ${isLocked ? 'text-[#888E8E]' : 'text-white'}`}>
                Add Changes to Chat
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
