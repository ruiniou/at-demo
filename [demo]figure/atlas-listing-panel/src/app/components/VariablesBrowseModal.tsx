import { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';

export interface Variable {
  id: string;
  dataset: string;
  variable: string;
  label: string;
  type: string;
  length: number;
  displayFormat: string;
  derivation: string;
  hasVlm?: boolean;
}

export interface VlmEntry {
  dataset: string;
  paramName: string;
  whereClause: string;
  variable: string;
  type: string;
  length: number;
  format: string;
  derivation: string;
}

export const ALL_VARIABLES: Variable[] = [
  { id: 'STUDYID', dataset: 'ADSL', variable: 'STUDYID', label: 'Study Identifier', type: 'Char', length: 20, displayFormat: '$20.', derivation: 'Copied from SDTM DM.STUDYID' },
  { id: 'USUBJID', dataset: 'ADSL', variable: 'USUBJID', label: 'Unique Subject Identifier', type: 'Char', length: 40, displayFormat: '$40.', derivation: 'Copied from SDTM DM.USUBJID' },
  { id: 'SUBJID', dataset: 'ADSL', variable: 'SUBJID', label: 'Subject Identifier for the Study', type: 'Char', length: 20, displayFormat: '$20.', derivation: 'Copied from SDTM DM.SUBJID' },
  { id: 'SITEID', dataset: 'ADSL', variable: 'SITEID', label: 'Study Site Identifier', type: 'Char', length: 20, displayFormat: '$20.', derivation: 'Copied from SDTM DM.SITEID' },
  { id: 'AGE', dataset: 'ADSL', variable: 'AGE', label: 'Age', type: 'Num', length: 8, displayFormat: '8.', derivation: 'Copied from SDTM DM.AGE' },
  { id: 'AESIFL', dataset: 'ADSL', variable: 'AESIFL', label: 'Age at Enrollment Flag', type: 'Char', length: 1, displayFormat: '$1.', derivation: 'Set to Y if AGE >= 18 at enrollment date, else N' },
  { id: 'AETERM', dataset: 'ADAE', variable: 'AETERM', label: 'Reported Term for Adverse Event', type: 'Char', length: 200, displayFormat: '$200.', derivation: 'Copied from SDTM AE.AETERM' },
  { id: 'ACAT1', dataset: 'ADAE', variable: 'ACAT1', label: 'Analysis Category 1', type: 'Char', length: 100, displayFormat: '$100.', derivation: 'Derived from AECAT using sponsor-specific mapping logic. Values: PRIMARY SOC, SECONDARY' },
  { id: 'TRTEMFL', dataset: 'ADAE', variable: 'TRTEMFL', label: 'Treatment-Emergent Analysis Flag', type: 'Char', length: 1, displayFormat: '$1.', derivation: 'Y if AESTDTC >= TRTSDT and (AESTDTC <= TRTEDT+30 or TRTEDT is missing)' },
  { id: 'AVAL', dataset: 'ADEXSUM', variable: 'AVAL', label: 'Analysis Value', type: 'Num', length: 8, displayFormat: '8.2', derivation: 'Numeric analysis value for the parameter. See VLM for parameter-specific derivation rules.', hasVlm: true },
  { id: 'PARAM', dataset: 'ADEXSUM', variable: 'PARAM', label: 'Parameter', type: 'Char', length: 200, displayFormat: '$200.', derivation: 'Parameter description corresponding to PARAMCD', hasVlm: true },
  { id: 'PARAMCD', dataset: 'ADEXSUM', variable: 'PARAMCD', label: 'Parameter Code', type: 'Char', length: 8, displayFormat: '$8.', derivation: 'Sponsor-defined parameter code. Values: EXDUR, ADUR, NCYC', hasVlm: true },
  { id: 'DTYPE', dataset: 'ADEXSUM', variable: 'DTYPE', label: 'Derivation Type', type: 'Char', length: 40, displayFormat: '$40.', derivation: 'Blank for observed records; LOCF for last-observation-carried-forward records' },
  { id: 'SAFFL', dataset: 'ADSL', variable: 'SAFFL', label: 'Safety Population Flag', type: 'Char', length: 1, displayFormat: '$1.', derivation: 'Y if subject received at least one dose of study drug, else N' },
  { id: 'TRT01AN', dataset: 'ADSL', variable: 'TRT01AN', label: 'Planned Treatment for Period 01 (N)', type: 'Num', length: 8, displayFormat: '8.', derivation: 'Numeric encoding of TRT01A per treatment mapping table' },
];

export const VLM_ENTRIES: VlmEntry[] = [
  {
    dataset: 'ADEXSUM',
    paramName: 'Duration of Exposure (Months)',
    whereClause: 'PARAM = "Duration of Exposure (Months)"',
    variable: 'AVAL',
    type: 'Num',
    length: 8,
    format: '8.2',
    derivation: 'Total exposure (months) of Date-DX analysis. Calculated as (min(last dose date where dose > 0 + 1, death date, data cut-off date) - first dose date) / 30.4375.',
  },
  {
    dataset: 'ADEXSUM',
    paramName: 'Actual Duration of Exposure (Months)',
    whereClause: 'PARAM = "Actual Duration of Exposure (Months)"',
    variable: 'AVAL',
    type: 'Num',
    length: 8,
    format: '8.2',
    derivation: 'Actual exposure = total exposure – cumulative duration of dose interruptions. Total interruption = sum of (interruption end date – interruption start date + 1) for all gaps in dosing.',
  },
  {
    dataset: 'ADEXSUM',
    paramName: 'Number of Cycles',
    whereClause: 'PARAM = "Number of Cycles"',
    variable: 'AVAL',
    type: 'Num',
    length: 8,
    format: '8.',
    derivation: 'Count of complete treatment cycles administered. A cycle is defined per protocol as 28 days. Partial cycles at the end of treatment are counted as 1.',
  },
];

interface VariablesBrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
  initialTab?: 'all' | 'vlm';
  vlmHighlightVar?: string;
}

export default function VariablesBrowseModal({
  isOpen,
  onClose,
  selectedIds,
  onConfirm,
  initialTab = 'all',
  vlmHighlightVar,
}: VariablesBrowseModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'vlm'>(initialTab);
  const [search, setSearch] = useState('');
  const [pendingIds, setPendingIds] = useState<string[]>(selectedIds);
  const vlmRowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPendingIds(selectedIds);
      setSearch('');
      setActiveTab(initialTab);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && vlmHighlightVar && activeTab === 'vlm') {
      const el = vlmRowRefs.current[vlmHighlightVar];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTab, isOpen, vlmHighlightVar]);

  const handleJumpToVlm = (variableId: string) => {
    setActiveTab('vlm');
  };

  const filteredVars = ALL_VARIABLES.filter(v => {
    if (!search) return true;
    const q = search.toLowerCase();
    return v.variable.toLowerCase().includes(q) || v.label.toLowerCase().includes(q) || v.dataset.toLowerCase().includes(q);
  });

  const toggleVar = (id: string) => {
    setPendingIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const removeTag = (id: string) => {
    setPendingIds(prev => prev.filter(x => x !== id));
  };

  const pendingVars = ALL_VARIABLES.filter(v => pendingIds.includes(v.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: '720px', height: '600px', boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 0 0 0.6px rgba(0,0,0,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] pt-[16px] pb-[12px] shrink-0">
          <p className="font-['PingFang_SC:Medium',sans-serif] text-[14px] leading-[22px] text-[#3c4242]" style={{ fontWeight: 600 }}>
            Browse Variables
          </p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors">
            <X className="size-4 text-[#888E8E]" />
          </button>
        </div>

        {/* Search + Tabs */}
        <div className="px-[20px] shrink-0">
          <div className="flex items-center gap-[8px] h-[32px] px-[8px] bg-[#f0f0f0] rounded-[6px] mb-[10px]">
            <Search className="size-[14px] text-[#999] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search variables..."
              className="flex-1 bg-transparent font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] placeholder-[#999] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="size-[16px] flex items-center justify-center hover:bg-black/5 rounded-full">
                <X className="size-3 text-[#999]" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-[#d8dada]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-[12px] py-[6px] font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] border-b-2 transition-colors ${activeTab === 'all' ? 'text-[#830051] border-[#830051]' : 'text-[#3c4242] border-transparent hover:text-[#830051]'}`}
            >
              All Variables
            </button>
            <button
              onClick={() => setActiveTab('vlm')}
              className={`px-[12px] py-[6px] font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] border-b-2 transition-colors ${activeTab === 'vlm' ? 'text-[#830051] border-[#830051]' : 'text-[#3c4242] border-transparent hover:text-[#830051]'}`}
            >
              VLM
            </button>
          </div>
        </div>

        {/* Selected tags bar */}
        {pendingVars.length > 0 && (
          <div className="px-[20px] pt-[8px] shrink-0 flex flex-wrap gap-[4px]">
            {pendingVars.map(v => (
              <span key={v.id} className="inline-flex items-center gap-[4px] bg-[#f4e8ee] rounded-[4px] px-[6px] py-[2px]">
                <span className="font-['PingFang_SC:Regular',sans-serif] text-[11px] text-[#830051] leading-[18px]">{v.variable}</span>
                <button onClick={() => removeTag(v.id)} className="flex items-center hover:opacity-70">
                  <X className="size-[10px] text-[#830051]" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'all' && (
            <table className="w-full border-collapse" style={{ minWidth: '680px' }}>
              <thead className="sticky top-0 bg-[#f8f7f7] z-10">
                <tr>
                  <th className="w-[36px] px-[12px] py-[8px] border-b border-[#d8dada]" />
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] whitespace-nowrap">Dataset Name</th>
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] whitespace-nowrap">Variable</th>
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E]">Label</th>
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] whitespace-nowrap">Type / Length</th>
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] whitespace-nowrap">Display Format</th>
                  <th className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E]">Derivation</th>
                </tr>
              </thead>
              <tbody>
                {filteredVars.map((v, i) => {
                  const isSelected = pendingIds.includes(v.id);
                  return (
                    <tr
                      key={v.id}
                      onClick={() => toggleVar(v.id)}
                      className={`cursor-pointer border-b border-[#f0f0f0] transition-colors ${isSelected ? 'bg-[#fdf5f9]' : 'bg-white hover:bg-[#fafafa]'}`}
                    >
                      {/* Checkbox */}
                      <td className="px-[12px] py-[10px] text-center">
                        <div className={`size-[14px] rounded-[2px] border flex items-center justify-center mx-auto ${isSelected ? 'bg-[#830051] border-[#830051]' : 'border-[#999] bg-white'}`}>
                          {isSelected && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </td>
                      {/* Dataset */}
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{v.dataset}</td>
                      {/* Variable + VLM tag */}
                      <td className="px-[8px] py-[10px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-['PingFang_SC:Medium',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{v.variable}</span>
                          {v.hasVlm && (
                            <button
                              onClick={e => { e.stopPropagation(); handleJumpToVlm(v.id); }}
                              className="inline-flex items-center gap-[2px] bg-[#f4e8ee] rounded-[3px] px-[4px] py-[1px] hover:bg-[#ead5e6] transition-colors"
                            >
                              <span className="font-['PingFang_SC:Regular',sans-serif] text-[10px] text-[#830051] leading-[16px]">VLM</span>
                              <ChevronRight className="size-[10px] text-[#830051]" style={{ transform: 'rotate(-45deg)' }} />
                            </button>
                          )}
                        </div>
                      </td>
                      {/* Label */}
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242]" style={{ maxWidth: '160px' }}>{v.label}</td>
                      {/* Type / Length */}
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{v.type} {v.length}</td>
                      {/* Display Format */}
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{v.displayFormat}</td>
                      {/* Derivation */}
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#888E8E]" style={{ maxWidth: '180px' }}>
                        <DerivationCell text={v.derivation} />
                      </td>
                    </tr>
                  );
                })}
                {filteredVars.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#999]">
                      No variables match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'vlm' && (
            <div>
              <div className="mx-[20px] mt-[12px] mb-[8px] px-[10px] py-[8px] bg-[#fdf5f9] rounded-[4px] border border-[#f4e8ee]">
                <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#888E8E] leading-[18px]">
                  This tab shows conditional logic for PARAM, AVAL and other VLM variables — for reference only. To select variables, use the All Variables tab.
                </p>
              </div>
              <table className="w-full border-collapse" style={{ minWidth: '680px' }}>
                <thead className="sticky top-0 bg-[#f8f7f7] z-10">
                  <tr>
                    {/* Spacer matching the checkbox column in All Variables */}
                    <th className="w-[36px] px-[12px] py-[8px] border-b border-[#d8dada]" />
                    {['DATASET', 'PARAMETER NAME', 'WHERE CLAUSE', 'VARIABLE', 'TYPE', 'LENGTH', 'FORMAT', 'DERIVATION'].map(col => (
                      <th key={col} className="text-left px-[8px] py-[8px] border-b border-[#d8dada] font-['PingFang_SC:Medium',sans-serif] text-[11px] text-[#888E8E] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VLM_ENTRIES.map((entry, i) => (
                    <tr
                      key={i}
                      ref={el => { vlmRowRefs.current[entry.variable + i] = el; }}
                      className="border-b border-[#f0f0f0] bg-white"
                    >
                      <td className="w-[36px] px-[12px] py-[10px]" />
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{entry.dataset}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242]" style={{ maxWidth: '140px' }}>{entry.paramName}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#888E8E] italic" style={{ maxWidth: '140px' }}>{entry.whereClause}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Medium',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{entry.variable}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{entry.type}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{entry.length}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] whitespace-nowrap">{entry.format}</td>
                      <td className="px-[8px] py-[10px] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#888E8E]" style={{ maxWidth: '180px' }}>
                        <DerivationCell text={entry.derivation} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[8px] px-[20px] py-[14px] border-t border-[#d8dada] shrink-0">
          <button
            onClick={onClose}
            className="h-[32px] px-[16px] rounded-[4px] border border-[#d8dada] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-[#3c4242] hover:bg-[#f8f7f7] transition-colors active:scale-[0.96]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pendingIds)}
            className="h-[32px] px-[16px] rounded-[4px] bg-[#830051] hover:bg-[#6d0043] font-['PingFang_SC:Regular',sans-serif] text-[12px] text-white transition-colors active:scale-[0.96]"
          >
            Confirm ({pendingIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function DerivationCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 80;
  return (
    <div>
      <p className={`leading-[18px] ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
          className="text-[#830051] text-[11px] leading-[16px] mt-[2px] hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
