import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SearchBar } from "../../../components/ui/SearchBar";

// ==================== Types ====================

type Variable = {
  id: string;
  datasetName: string;
  variable: string;
  label: string;
  type: string;
  length: number;
  displayFormat: string;
  derivation: string;
  hasVlm: boolean;
};

type VlmRow = {
  id: string;
  datasetName: string;
  parameterName: string;
  whereClause: string;
  variableName: string;
  type: string;
  length: number;
  displayFormat: string;
  derivation: string;
};

type BrowseVariablesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  initialSelected: string[];
  variables: Variable[];
  vlmData: VlmRow[];
};

type InlineVariableListProps = {
  variables: Variable[];
  selected: string[];
  onToggle: (variable: string) => void;
  onRemove: (variable: string) => void;
  onBrowseAll: () => void;
};

// ==================== Mock Data ====================

const mockVariables: Variable[] = [
  { id: "v1", datasetName: "ADSL", variable: "AGE", label: "Age at Enrollment", type: "Num", length: 8, displayFormat: "8.1", derivation: "Derived from informed consent date and date of birth.", hasVlm: false },
  { id: "v2", datasetName: "ADSL", variable: "AGEGR1", label: "Age Group (years)", type: "Char", length: 8, displayFormat: "$8.", derivation: "Categorized: <65, 65-74, ≥75", hasVlm: false },
  { id: "v3", datasetName: "ADSL", variable: "SEX", label: "Sex", type: "Char", length: 1, displayFormat: "$1.", derivation: "M = Male, F = Female", hasVlm: false },
  { id: "v4", datasetName: "ADSL", variable: "RACE", label: "Race", type: "Char", length: 32, displayFormat: "$32.", derivation: "As collected from site records.", hasVlm: false },
  { id: "v5", datasetName: "ADSL", variable: "SAFFL", label: "Safety Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject received at least 1 dose of study drug.", hasVlm: false },
  { id: "v6", datasetName: "ADSL", variable: "ITTFL", label: "Intent-to-Treat Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject is randomized.", hasVlm: false },
  { id: "v7", datasetName: "ADAE", variable: "AESIFL", label: "Serious AE Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if AE is classified as serious.", hasVlm: false },
  { id: "v8", datasetName: "ADAE", variable: "AETOXGR", label: "AE Toxicity Grade", type: "Char", length: 4, displayFormat: "$4.", derivation: "Derived from CTCAE grading criteria.", hasVlm: false },
  { id: "v9", datasetName: "ADAE", variable: "AREL", label: "AE Relationship to Study Drug", type: "Char", length: 8, displayFormat: "$8.", derivation: "Related / Not Related / Possibly Related.", hasVlm: false },
  { id: "v10", datasetName: "ADEXSUM", variable: "AVAL", label: "Analysis Value", type: "Num", length: 8, displayFormat: "8.2", derivation: "Varies by PARAM; see VLM for conditional logic.", hasVlm: true },
  { id: "v11", datasetName: "ADEXSUM", variable: "PARAM", label: "Parameter Name", type: "Char", length: 40, displayFormat: "$40.", derivation: "Defines the exposure metric being summarized.", hasVlm: true },
  { id: "v12", datasetName: "ADEXSUM", variable: "PARAMCD", label: "Parameter Code", type: "Char", length: 8, displayFormat: "$8.", derivation: "Short code for PARAM.", hasVlm: false },
  { id: "v13", datasetName: "ADEXSUM", variable: "ATOXGR", label: "Analysis Toxicity Grade", type: "Char", length: 4, displayFormat: "$4.", derivation: "Toxicity grade applied to AVAL.", hasVlm: false },
  { id: "v14", datasetName: "ADLB", variable: "ANRLO", label: "Analysis Normal Range Lower Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Lower limit of normal range for the lab parameter.", hasVlm: false },
  { id: "v15", datasetName: "ADLB", variable: "ANRHI", label: "Analysis Normal Range Upper Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Upper limit of normal range for the lab parameter.", hasVlm: false },
  { id: "v16", datasetName: "ADLB", variable: "AVAL", label: "Analysis Value", type: "Num", length: 8, displayFormat: "8.3", derivation: "Lab result in standard units. VLM defines per-PARAM logic.", hasVlm: true },
  { id: "v17", datasetName: "ADTTE", variable: "AVAL", label: "Analysis Value (Time)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time to event in days/months. VLM defines per-PARAM logic.", hasVlm: true },
  { id: "v18", datasetName: "ADTTE", variable: "CNSR", label: "Censor Indicator", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = Event, 1 = Censored.", hasVlm: true },
  { id: "v19", datasetName: "ADSL", variable: "TRT01P", label: "Planned Treatment", type: "Char", length: 20, displayFormat: "$20.", derivation: "Treatment arm as planned in randomization.", hasVlm: false },
  { id: "v20", datasetName: "ADSL", variable: "STRATA1", label: "Stratification Factor 1", type: "Char", length: 16, displayFormat: "$16.", derivation: "Region (Asia / Non-Asia).", hasVlm: false },
];

const mockVlmData: VlmRow[] = [
  { id: "vlm1", datasetName: "ADEXSUM", parameterName: "Duration of Exposure (Months)", whereClause: "PARAMCD='DUREXP'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.2", derivation: "Total exposure (months) = (min(last dose date + 20, date of death, date of DCO) – first dose date + 1) / (365.25/12)" },
  { id: "vlm2", datasetName: "ADEXSUM", parameterName: "Actual Duration of Exposure (Months)", whereClause: "PARAMCD='ACTDUREXP'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.2", derivation: "Actual exposure = total exposure – total duration of dose interruptions. Ref SAP 4.7.1.1" },
  { id: "vlm3", datasetName: "ADEXSUM", parameterName: "Total Dose Received (mg)", whereClause: "PARAMCD='TOTDOSE'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Sum of all individual dose amounts recorded in EX domain." },
  { id: "vlm4", datasetName: "ADLB", parameterName: "Hemoglobin (g/dL)", whereClause: "PARAMCD='HGB'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Result value in g/dL. If original unit is g/L, multiply by 0.1." },
  { id: "vlm5", datasetName: "ADLB", parameterName: "ALT (U/L)", whereClause: "PARAMCD='ALT'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Result value in U/L. No unit conversion required." },
  { id: "vlm6", datasetName: "ADTTE", parameterName: "Overall Survival", whereClause: "PARAMCD='OS'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time (months) from randomization to death. Censored at last known alive date." },
  { id: "vlm7", datasetName: "ADTTE", parameterName: "Progression-Free Survival", whereClause: "PARAMCD='PFS'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time (months) from randomization to first documented progression or death, whichever occurs first." },
  { id: "vlm8", datasetName: "ADTTE", parameterName: "Overall Survival", whereClause: "PARAMCD='OS'", variableName: "CNSR", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = death confirmed, 1 = alive at last follow-up (censored)." },
  { id: "vlm9", datasetName: "ADTTE", parameterName: "Progression-Free Survival", whereClause: "PARAMCD='PFS'", variableName: "CNSR", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = progression or death, 1 = no event and censored at last assessment." },
];

// ==================== Icons ====================

function CloseIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" fill={color} />
    </svg>
  );
}

function SearchIcon({ className = "w-[16px] h-[16px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 4C6.91 4 4 6.91 4 10.5C4 14.09 6.91 17 10.5 17C12.11 17 13.58 16.41 14.72 15.44L18.29 19L19 18.29L15.44 14.72C16.41 13.58 17 12.11 17 10.5C17 6.91 14.09 4 10.5 4ZM10.5 5C13.54 5 16 7.46 16 10.5C16 13.54 13.54 16 10.5 16C7.46 16 5 13.54 5 10.5C5 7.46 7.46 5 10.5 5Z" fill="#888E8E" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-[16px] h-[16px]", color = "#888E8E" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.17L18.36 6.81L19.78 8.22L12 16L4.22 8.22L5.64 6.81L12 13.17Z" fill={color} />
    </svg>
  );
}

function CheckboxIcon({ state }: { state: "empty" | "checked" }) {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {state === "checked" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#830051" />
          <path d="M9.5 15.2L18.2 6.5L19.6 7.9L9.5 18L4 12.5L5.4 11.1L9.5 15.2Z" fill="white" />
        </>
      ) : (
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" stroke="#B2B4B4" strokeWidth="1" fill="none" />
      )}
    </svg>
  );
}

// ==================== Inline Variable List ====================

function InlineVariableList({ variables, selected, onToggle, onRemove, onBrowseAll }: InlineVariableListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const items = variables.filter(
      (v) => v.variable.toLowerCase().includes(q) || v.label.toLowerCase().includes(q)
    );
    // Sort: selected first
    return items.sort((a, b) => {
      const aS = selected.includes(a.variable) ? 0 : 1;
      const bS = selected.includes(b.variable) ? 0 : 1;
      return aS - bS;
    });
  }, [variables, search, selected]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input area showing selected tags */}
      <div
        className="flex min-h-[32px] cursor-pointer flex-wrap items-center gap-[4px] rounded-[4px] border border-[#D8DADA] bg-white px-[8px] py-[4px] hover:border-[#888E8E]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className="t-small text-[#B2B4B4]">Select variables…</span>
        )}
        {selected.map((v) => (
          <span
            key={v}
            className="inline-flex h-[20px] items-center gap-[2px] rounded-[4px] bg-[#F4E8EE] pl-[4px] pr-[2px]"
          >
            <span className="t-small text-[#830051]">{v}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(v);
              }}
              className="relative flex h-[16px] w-[16px] items-center justify-center rounded-[2px] hover:bg-black/5 after:content-[''] after:absolute after:-inset-[12px]"
            >
              <CloseIcon className="h-[10px] w-[10px]" color="#830051" />
            </button>
          </span>
        ))}
        <ChevronDownIcon
          className="ml-auto h-[16px] w-[16px] shrink-0 transition-transform"
          color="#888E8E"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-[4px] w-full rounded-[8px] border border-[#D8DADA] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
          {/* Search */}
          <div className="p-[6px] border-b border-graphite-10">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search variables…"
              background="light"
              autoFocus
            />
          </div>
          {/* Option list */}
          <div className="max-h-[200px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-[12px] py-[16px] text-center">
                <p className="t-small text-[#888E8E]">No matching variables found</p>
              </div>
            ) : (
              filtered.map((v) => {
                const isSelected = selected.includes(v.variable);
                return (
                  <button
                    key={v.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(v.variable);
                    }}
                    className={`flex w-full items-center gap-[8px] px-[12px] py-[6px] text-left hover:bg-bg-panel ${isSelected ? "bg-[#F4E8EE]" : ""}`}
                  >
                    <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <CheckboxIcon state={isSelected ? "checked" : "empty"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="t-small text-text-primary">{v.variable}</p>
                      <p className="truncate t-small text-[#888E8E]">{v.label}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {/* Browse All link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onBrowseAll();
            }}
            className="flex w-full items-center justify-center border-t border-graphite-10 px-[12px] py-[8px] hover:bg-bg-panel"
          >
            <span className="t-small font-medium text-[#830051]">Browse All Variables</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== Derivation Cell ====================

function DerivationCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split("\n");
  const needsTruncate = lines.length > 2 || text.length > 80;

  if (!needsTruncate) {
    return <p className="t-small text-text-primary whitespace-normal">{text}</p>;
  }

  return (
    <div>
      <p className="t-small text-text-primary whitespace-normal">
        {expanded ? text : text.slice(0, 80) + (text.length > 80 ? "…" : "")}
      </p>
      {needsTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="t-small text-[#830051] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

// ==================== Browse Variables Modal ====================

function BrowseVariablesModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected,
  variables,
  vlmData,
}: BrowseVariablesModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "vlm">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [expandedDerivations, setExpandedDerivations] = useState<Set<string>>(new Set());

  // Sync initial selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected([...initialSelected]);
      setSearch("");
      setActiveTab("all");
      setExpandedDerivations(new Set());
    }
  }, [isOpen, initialSelected]);

  const toggleVariable = useCallback((variable: string) => {
    setSelected((prev) =>
      prev.includes(variable) ? prev.filter((v) => v !== variable) : [...prev, variable]
    );
  }, []);

  const removeVariable = useCallback((variable: string) => {
    setSelected((prev) => prev.filter((v) => v !== variable));
  }, []);

  const toggleDerivation = useCallback((id: string) => {
    setExpandedDerivations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Jump to VLM tab and filter to variable
  const jumpToVlm = useCallback((variable: string) => {
    setActiveTab("vlm");
    setSearch(variable);
  }, []);

  const filteredVariables = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return variables;
    return variables.filter(
      (v) =>
        v.variable.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
  }, [variables, search]);

  const filteredVlm = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return vlmData;
    return vlmData.filter(
      (v) =>
        v.variableName.toLowerCase().includes(q) ||
        v.parameterName.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
  }, [vlmData, search]);

  if (!isOpen) return null;

  const selectedVariables = selected
    .map((vName) => variables.find((v) => v.variable === vName))
    .filter(Boolean) as Variable[];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close modal" />

      {/* Modal */}
      <div className="relative flex h-[600px] w-[800px] max-w-[90vw] max-h-[85vh] flex-col rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="flex h-[48px] shrink-0 items-center justify-between border-b border-[#D8DADA] px-[20px]">
          <h2 className="t-heading text-text-primary">Browse Variables</h2>
          <button
            onClick={onClose}
            className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-graphite-10 active:scale-[0.96] after:content-[''] after:absolute after:-inset-[8px]"
            aria-label="Close"
          >
            <CloseIcon className="h-[16px] w-[16px]" color="#888E8E" />
          </button>
        </div>

        {/* Search + Tabs */}
        <div className="flex shrink-0 items-center gap-[12px] border-b border-[#D8DADA] px-[20px]">
          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search variables…"
            background="light"
            className="flex-1 my-[4px]"
          />
          {/* Tabs */}
          <div className="flex h-full items-center">
            {(["all", "vlm"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearch("");
                  }}
                  className={`flex h-full items-center border-b-2 px-[12px] py-[8px] active:scale-[0.96] ${
                    isActive ? "border-[#830051]" : "border-transparent"
                  }`}
                >
                  <span className={`t-small font-medium ${isActive ? "text-[#830051]" : "text-text-primary"}`}>
                    {tab === "all" ? "All Variables" : "VLM"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bar */}
        {selected.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-[4px] border-b border-graphite-10 bg-bg-panel px-[20px] py-[8px]">
            <span className="t-small text-[#888E8E] shrink-0 mr-[4px]">Selected:</span>
            {selectedVariables.map((v) => (
              <span
                key={v.variable}
                className="inline-flex h-[22px] items-center gap-[2px] rounded-[4px] bg-[#F4E8EE] pl-[6px] pr-[2px]"
              >
                <span className="t-small text-[#830051]">{v.variable}</span>
                <button
                  onClick={() => removeVariable(v.variable)}
                  className="flex h-[16px] w-[16px] items-center justify-center rounded-[2px] hover:bg-black/5"
                >
                  <CloseIcon className="h-[10px] w-[10px]" color="#830051" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Table Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          {activeTab === "all" && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[36px] px-[12px] py-[8px]" />
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Dataset</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Variable</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Label</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Format</span>
                  </th>
                  <th className="w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVariables.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <div className="flex flex-col items-center gap-[8px]">
                        <p className="t-small text-[#888E8E]">
                          当前 study 中未找到该变量，请确认 ADaM dataset 是否已包含
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="t-small text-brand-1 hover:underline font-medium"
                          >
                            清除搜索内容
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVariables.map((v) => {
                    const isSelected = selected.includes(v.variable);
                    return (
                      <tr
                        key={v.id}
                        className={`border-b border-graphite-10 hover:bg-bg-panel ${isSelected ? "bg-[#F4E8EE]/40" : ""}`}
                      >
                        <td className="px-[12px] py-[6px]">
                          <button
                            onClick={() => toggleVariable(v.variable)}
                            className="flex h-[18px] w-[18px] items-center justify-center"
                          >
                            <CheckboxIcon state={isSelected ? "checked" : "empty"} />
                          </button>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.datasetName}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <div className="flex items-center gap-[4px]">
                            <span className="t-small font-medium whitespace-nowrap text-text-primary">{v.variable}</span>
                            {v.hasVlm && (
                              <button
                                onClick={() => jumpToVlm(v.variable)}
                                className="inline-flex h-[18px] items-center gap-[1px] rounded-[4px] bg-[#E1F6F9] px-[4px] hover:bg-[#C3EDF2]"
                              >
                                <span className="text-[10px] font-medium whitespace-nowrap text-text-primary">VLM ↗</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small text-text-primary whitespace-normal">{v.label}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.type}/{v.length}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.displayFormat}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <DerivationCell text={v.derivation} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === "vlm" && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[100px] px-[12px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Dataset</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Parameter Name</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Where Clause</span>
                  </th>
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Variable</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Format</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVlm.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <p className="t-small text-[#888E8E]">
                        当前 study 暂无 VLM 变量定义
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredVlm.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-graphite-10 hover:bg-bg-panel"
                    >
                      <td className="px-[12px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.datasetName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.parameterName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-code text-text-primary">{row.whereClause}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.variableName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.type}/{row.length}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.displayFormat}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <DerivationCell text={row.derivation} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-[12px] border-t border-[#D8DADA] px-[20px] py-[12px]">
          <button
            onClick={onClose}
            className="h-[32px] rounded-[4px] border-[0.6px] border-[#D8DADA] bg-white px-[16px] t-small font-medium text-text-primary hover:bg-bg-panel active:scale-[0.96]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(selected);
              onClose();
            }}
            className="h-[32px] rounded-[4px] bg-brand-1 px-[16px] t-small font-medium text-white hover:bg-brand-1-hover active:scale-[0.96]"
          >
            Confirm ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Exported Compound ====================

export default function BrowseVariablesField({
  label,
  initialSelected = [],
  variables = mockVariables,
  vlmData = mockVlmData,
}: {
  label: string;
  initialSelected?: string[];
  variables?: Variable[];
  vlmData?: VlmRow[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = (variable: string) => {
    setSelected((prev) =>
      prev.includes(variable) ? prev.filter((v) => v !== variable) : [...prev, variable]
    );
  };

  const handleRemove = (variable: string) => {
    setSelected((prev) => prev.filter((v) => v !== variable));
  };

  const handleConfirm = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <>
      <div className="flex flex-col gap-[4px]">
        <label className="t-small text-[#656969]">{label}</label>
        <InlineVariableList
          variables={variables}
          selected={selected}
          onToggle={handleToggle}
          onRemove={handleRemove}
          onBrowseAll={() => setModalOpen(true)}
        />
      </div>
      <BrowseVariablesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialSelected={selected}
        variables={variables}
        vlmData={vlmData}
      />
    </>
  );
}
