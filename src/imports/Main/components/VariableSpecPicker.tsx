import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Checkbox } from "../../../components/ui/Checkbox";
import { FilterChip } from "../../../components/ui/FilterChip";
import { Variable, VlmRow, AdamCodeListRow, SdtmCodeListRow } from "./BrowseVariablesModal";

export interface VariableSpecPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  initialSelected: string[];
  variables: Variable[];
  vlmData?: VlmRow[];
  adamCodeListData?: AdamCodeListRow[];
  sdtmCodeListData?: SdtmCodeListRow[];
  sourceDatasets?: string[];
  onDatasetsExpand?: (newDatasets: string[]) => void;
}

export function VariableSpecPicker({
  isOpen,
  onClose,
  onConfirm,
  initialSelected,
  variables,
  vlmData = [],
  adamCodeListData = [],
  sdtmCodeListData = [],
  sourceDatasets = [],
  onDatasetsExpand,
}: VariableSpecPickerProps) {
  // --- Selection State ---
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState<"All" | "ADaM" | "SDTM">("All");
  const [selectedNavDataset, setSelectedNavDataset] = useState<string | null>(null);
  const [hasVlmFilter, setHasVlmFilter] = useState(false);
  const [hasCodelistFilter, setHasCodelistFilter] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // --- Right Panel (Collapsible Inspector) State ---
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [activeVariable, setActiveVariable] = useState<Variable | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"vlm" | "codelist">("vlm");
  const [showSdtmDetail, setShowSdtmDetail] = useState(false);
  const [isDerivationExpanded, setIsDerivationExpanded] = useState(false);
  const [codelistSearch, setCodelistSearch] = useState("");

  // Sync state when modal opens
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSelected([...initialSelected]);
      setSearch("");
      setShowSelectedOnly(false);
      setHasVlmFilter(false);
      setHasCodelistFilter(false);
      setIsRightPanelOpen(false);
      setActiveVariable(null);
      setShowSdtmDetail(false);

      // Intelligent Standard Filter Initialization:
      if (sourceDatasets && sourceDatasets.length > 0) {
        const hasAdam = sourceDatasets.some((d) => d.startsWith("AD"));
        const hasSdtm = sourceDatasets.some((d) => !d.startsWith("AD"));
        if (hasAdam && !hasSdtm) {
          setStandardFilter("ADaM");
        } else if (hasSdtm && !hasAdam) {
          setStandardFilter("SDTM");
        } else {
          setStandardFilter("All");
        }
        // If single dataset in sourceDatasets, focus on it in nav tree
        if (sourceDatasets.length === 1) {
          setSelectedNavDataset(sourceDatasets[0]);
        } else {
          setSelectedNavDataset(null);
        }
      } else {
        setStandardFilter("All");
        setSelectedNavDataset(null);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialSelected, sourceDatasets]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSdtmDetail) {
          setShowSdtmDetail(false);
        } else if (isRightPanelOpen) {
          setIsRightPanelOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showSdtmDetail, isRightPanelOpen, onClose]);

  // Compute standard for any variable
  const getVarStandard = useCallback((v: Variable): "ADaM" | "SDTM" => {
    if (v.standard) return v.standard;
    return v.datasetName.startsWith("AD") ? "ADaM" : "SDTM";
  }, []);

  // Filter variables
  const filteredVariables = useMemo(() => {
    const q = search.toLowerCase().trim();

    return variables.filter((v) => {
      const vStd = getVarStandard(v);

      // 1. Standard Filter
      if (standardFilter === "ADaM" && vStd !== "ADaM") return false;
      if (standardFilter === "SDTM" && vStd !== "SDTM") return false;

      // 2. Left Dataset Nav Filter
      if (selectedNavDataset && v.datasetName !== selectedNavDataset) return false;

      // 3. Has VLM Filter
      if (hasVlmFilter && !v.hasVlm) return false;

      // 4. Has Codelist Filter
      if (hasCodelistFilter && !v.hasCodelist) return false;

      // 5. Selected Only Filter
      const itemKey = `${v.datasetName}.${v.variable}`;
      const isSelected = selected.includes(itemKey) || selected.includes(v.variable);
      if (showSelectedOnly && !isSelected) return false;

      // 6. Keyword Search (Variable, Label, Dataset, Derivation)
      if (q) {
        const matchVar = v.variable.toLowerCase().includes(q);
        const matchLabel = v.label.toLowerCase().includes(q);
        const matchDs = v.datasetName.toLowerCase().includes(q);
        const matchDeriv = (v.derivation || "").toLowerCase().includes(q);
        if (!matchVar && !matchLabel && !matchDs && !matchDeriv) return false;
      }

      return true;
    });
  }, [
    variables,
    search,
    standardFilter,
    selectedNavDataset,
    hasVlmFilter,
    hasCodelistFilter,
    showSelectedOnly,
    selected,
    getVarStandard,
  ]);

  // Compute Dataset Nav list grouped by Standard with counts
  const navDatasets = useMemo(() => {
    const q = search.toLowerCase().trim();
    const candidatePool = variables.filter((v) => {
      const vStd = getVarStandard(v);
      if (standardFilter === "ADaM" && vStd !== "ADaM") return false;
      if (standardFilter === "SDTM" && vStd !== "SDTM") return false;
      if (hasVlmFilter && !v.hasVlm) return false;
      if (hasCodelistFilter && !v.hasCodelist) return false;
      if (showSelectedOnly) {
        const itemKey = `${v.datasetName}.${v.variable}`;
        if (!selected.includes(itemKey) && !selected.includes(v.variable)) return false;
      }
      if (q) {
        const matchVar = v.variable.toLowerCase().includes(q);
        const matchLabel = v.label.toLowerCase().includes(q);
        const matchDs = v.datasetName.toLowerCase().includes(q);
        const matchDeriv = (v.derivation || "").toLowerCase().includes(q);
        if (!matchVar && !matchLabel && !matchDs && !matchDeriv) return false;
      }
      return true;
    });

    const adamMap = new Map<string, number>();
    const sdtmMap = new Map<string, number>();

    candidatePool.forEach((v) => {
      const std = getVarStandard(v);
      if (std === "ADaM") {
        adamMap.set(v.datasetName, (adamMap.get(v.datasetName) || 0) + 1);
      } else {
        sdtmMap.set(v.datasetName, (sdtmMap.get(v.datasetName) || 0) + 1);
      }
    });

    const adamList = Array.from(adamMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count, standard: "ADaM" as const }));

    const sdtmList = Array.from(sdtmMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count, standard: "SDTM" as const }));

    return {
      totalCount: candidatePool.length,
      adam: adamList,
      sdtm: sdtmList,
    };
  }, [
    variables,
    search,
    standardFilter,
    hasVlmFilter,
    hasCodelistFilter,
    showSelectedOnly,
    selected,
    getVarStandard,
  ]);

  // Toggle variable selection
  const toggleVariable = useCallback((itemKey: string) => {
    setSelected((prev) => {
      const isCurrentlySelected = prev.includes(itemKey) || prev.includes(itemKey.split(".").pop() || "");
      if (isCurrentlySelected) {
        return prev.filter((v) => v !== itemKey && v !== itemKey.split(".").pop());
      } else {
        return [...prev, itemKey];
      }
    });
  }, []);

  // Inspect row click (open right panel)
  const handleRowClick = useCallback((v: Variable) => {
    setActiveVariable(v);
    setIsRightPanelOpen(true);
    setShowSdtmDetail(false);
    setIsDerivationExpanded(false);
    setCodelistSearch("");
    if (v.hasVlm) {
      setRightPanelTab("vlm");
    } else if (v.hasCodelist) {
      setRightPanelTab("codelist");
    }
  }, []);

  // Compute selected datasets for footer and summary
  const selectedDatasets = useMemo(() => {
    const dsSet = new Set<string>();
    selected.forEach((key) => {
      if (key.includes(".")) {
        dsSet.add(key.split(".")[0]);
      } else {
        const found = variables.find((v) => v.variable === key);
        if (found) dsSet.add(found.datasetName);
      }
    });
    return Array.from(dsSet).sort();
  }, [selected, variables]);

  // Datasets newly added that weren't in sourceDatasets
  const newlyAddedDatasets = useMemo(() => {
    if (!sourceDatasets || sourceDatasets.length === 0) return [];
    return selectedDatasets.filter((ds) => !sourceDatasets.includes(ds));
  }, [selectedDatasets, sourceDatasets]);

  // Confirm and close
  const handleConfirm = () => {
    if (newlyAddedDatasets.length > 0 && onDatasetsExpand) {
      onDatasetsExpand(newlyAddedDatasets);
    }
    onConfirm(selected);
    onClose();
  };

  // Reset/Clear all filters
  const hasActiveFilters =
    standardFilter !== "All" ||
    selectedNavDataset !== null ||
    hasVlmFilter ||
    hasCodelistFilter ||
    showSelectedOnly ||
    search.trim().length > 0;

  const handleClearFilters = () => {
    setStandardFilter("All");
    setSelectedNavDataset(null);
    setHasVlmFilter(false);
    setHasCodelistFilter(false);
    setShowSelectedOnly(false);
    setSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[1px] p-[16px]">
      <div
        className="flex flex-col w-[1180px] max-w-[96vw] h-[680px] max-h-[92vh] rounded-[8px] bg-white border border-[#D8DADA] shadow-[0px_16px_40px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= 1. Top Header ================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D8DADA] px-[20px] py-[12px] bg-white">
          <div className="flex flex-col">
            <h2 className="t-body font-semibold text-text-primary leading-tight">
              Find &amp; select variables
            </h2>
            <p className="t-footnote text-text-secondary mt-[2px]">
              Search and inspect variables across ADaM and SDTM specifications.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[28px] items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-panel hover:text-text-primary transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ================= 2. Filter Bar ================= */}
        <div className="flex shrink-0 items-center justify-between gap-[12px] border-b border-[#D8DADA] px-[20px] py-[8px] bg-bg-panel/40">
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            {/* Omni Search Input */}
            <div className="relative w-[280px] shrink-0">
              <svg
                className="absolute left-[8px] top-1/2 -translate-y-1/2 size-[14px] text-text-secondary pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search variables, labels, datasets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[28px] rounded-[4px] border border-[#D8DADA] bg-white pl-[28px] pr-[24px] t-small text-text-primary placeholder:text-[#888E8E] focus:border-[#830051] focus:outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-[6px] top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary size-[16px] flex items-center justify-center cursor-pointer"
                  title="Clear search"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <div className="h-[16px] w-[1px] bg-[#D8DADA] shrink-0" />

            {/* Standard Dropdown FilterChip (showIcon = false, clean pure text) */}
            <FilterChip
              type="Dropdown"
              variant="filter"
              showIcon={false}
              label={standardFilter === "All" ? "All Standards" : `${standardFilter} only`}
              value={standardFilter}
              options={[
                { label: "All Standards", value: "All" },
                { label: "ADaM only", value: "ADaM" },
                { label: "SDTM only", value: "SDTM" },
              ]}
              onChange={(val) => {
                setStandardFilter(val as any);
                if (val === "ADaM" && selectedNavDataset && !selectedNavDataset.startsWith("AD")) {
                  setSelectedNavDataset(null);
                } else if (val === "SDTM" && selectedNavDataset && selectedNavDataset.startsWith("AD")) {
                  setSelectedNavDataset(null);
                }
              }}
            />

            {/* Quick Property Filters */}
            <FilterChip
              type="Toggle"
              variant="filter"
              showIcon={false}
              label="Has VLM"
              active={hasVlmFilter}
              onClick={() => setHasVlmFilter(!hasVlmFilter)}
            />

            <FilterChip
              type="Toggle"
              variant="filter"
              showIcon={false}
              label="Has Codelist"
              active={hasCodelistFilter}
              onClick={() => setHasCodelistFilter(!hasCodelistFilter)}
            />

            {/* Clear Filters Link */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="t-footnote text-brand-1 hover:underline cursor-pointer font-medium ml-[4px]"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Matches Count */}
          <span className="t-footnote text-text-secondary shrink-0">
            {filteredVariables.length} variable{filteredVariables.length === 1 ? "" : "s"} found
          </span>
        </div>

        {/* ================= 3. Main 3-Column Area ================= */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
          {/* ----- Column 1: Left Dataset Navigation Tree ----- */}
          <div className="w-[190px] shrink-0 border-r border-graphite-10 bg-bg-panel/40 flex flex-col overflow-y-auto">
            <div className="px-[12px] py-[8px]">
              <span className="t-footnote font-semibold text-text-secondary uppercase tracking-wider">
                Datasets
              </span>
            </div>

            {/* "All datasets" root node */}
            <button
              type="button"
              onClick={() => setSelectedNavDataset(null)}
              className={`flex items-center justify-between px-[12px] py-[6px] text-left transition-colors cursor-pointer rounded-[2px] mx-[6px] ${
                selectedNavDataset === null
                  ? "bg-white text-brand-1 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-text-primary hover:bg-white/60"
              }`}
            >
              <span className="t-small truncate">All datasets</span>
              <span className="t-footnote text-text-secondary font-mono">{navDatasets.totalCount}</span>
            </button>

            {/* ADaM Group */}
            {standardFilter !== "SDTM" && navDatasets.adam.length > 0 && (
              <div className="mt-[10px]">
                <div className="px-[12px] py-[4px]">
                  <span className="t-footnote font-semibold text-text-secondary">ADaM</span>
                </div>
                {navDatasets.adam.map((ds) => {
                  const isNavActive = selectedNavDataset === ds.name;
                  return (
                    <button
                      key={ds.name}
                      type="button"
                      onClick={() => setSelectedNavDataset(ds.name)}
                      className={`flex w-[calc(100%-12px)] items-center justify-between px-[12px] py-[5px] text-left transition-colors cursor-pointer rounded-[2px] mx-[6px] ${
                        isNavActive
                          ? "bg-white text-brand-1 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                          : "text-text-primary hover:bg-white/60"
                      }`}
                    >
                      <span className="t-small truncate">{ds.name}</span>
                      <span className="t-footnote text-text-secondary font-mono">{ds.count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* SDTM Group */}
            {standardFilter !== "ADaM" && navDatasets.sdtm.length > 0 && (
              <div className="mt-[10px]">
                <div className="px-[12px] py-[4px]">
                  <span className="t-footnote font-semibold text-text-secondary">SDTM</span>
                </div>
                {navDatasets.sdtm.map((ds) => {
                  const isNavActive = selectedNavDataset === ds.name;
                  return (
                    <button
                      key={ds.name}
                      type="button"
                      onClick={() => setSelectedNavDataset(ds.name)}
                      className={`flex w-[calc(100%-12px)] items-center justify-between px-[12px] py-[5px] text-left transition-colors cursor-pointer rounded-[2px] mx-[6px] ${
                        isNavActive
                          ? "bg-white text-brand-1 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                          : "text-text-primary hover:bg-white/60"
                      }`}
                    >
                      <span className="t-small truncate">{ds.name}</span>
                      <span className="t-footnote text-text-secondary font-mono">{ds.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ----- Column 2: Middle Variable Table ----- */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-bg-panel border-b border-[#D8DADA]">
                  <tr>
                    <th className="w-[36px] px-[10px] py-[8px] text-left">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={
                            filteredVariables.length > 0 &&
                            filteredVariables.every((v) => {
                              const key = `${v.datasetName}.${v.variable}`;
                              return selected.includes(key) || selected.includes(v.variable);
                            })
                          }
                          onChange={() => {
                            const isAllChecked = filteredVariables.every((v) => {
                              const key = `${v.datasetName}.${v.variable}`;
                              return selected.includes(key) || selected.includes(v.variable);
                            });
                            if (isAllChecked) {
                              const keysToRemove = new Set(filteredVariables.map((v) => `${v.datasetName}.${v.variable}`));
                              const shortKeys = new Set(filteredVariables.map((v) => v.variable));
                              setSelected((prev) => prev.filter((k) => !keysToRemove.has(k) && !shortKeys.has(k)));
                            } else {
                              const keysToAdd = filteredVariables.map((v) => `${v.datasetName}.${v.variable}`);
                              setSelected((prev) => Array.from(new Set([...prev, ...keysToAdd])));
                            }
                          }}
                        />
                      </div>
                    </th>
                    <th className="w-[76px] px-[8px] py-[8px] text-left">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Dataset</span>
                    </th>
                    <th className="w-[120px] px-[8px] py-[8px] text-left">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Variable</span>
                    </th>
                    <th className="px-[8px] py-[8px] text-left">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Label</span>
                    </th>
                    <th className="w-[130px] px-[8px] py-[8px] text-left">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Context</span>
                    </th>
                    <th className="w-[40px] px-[8px] py-[8px] text-center">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Info</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVariables.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-[20px] py-[48px] text-center">
                        <p className="t-small text-text-secondary">No matching variables found</p>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="t-small text-brand-1 hover:underline mt-[6px] font-medium cursor-pointer"
                          >
                            Reset filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredVariables.map((v) => {
                      const itemKey = `${v.datasetName}.${v.variable}`;
                      const isChecked = selected.includes(itemKey) || selected.includes(v.variable);
                      const isInspecting = isRightPanelOpen && activeVariable?.id === v.id;

                      return (
                        <tr
                          key={v.id}
                          onClick={() => handleRowClick(v)}
                          className={`border-b border-graphite-10 transition-colors cursor-pointer select-none group ${
                            isInspecting
                              ? "bg-[#F4E8EE]/50 border-l-[3px] border-l-[#830051]"
                              : isChecked
                              ? "bg-bg-panel/40 hover:bg-bg-panel"
                              : "hover:bg-bg-panel"
                          }`}
                        >
                          {/* Checkbox Cell */}
                          <td
                            className="w-[36px] px-[10px] py-[7px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVariable(itemKey);
                            }}
                          >
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={isChecked}
                                onChange={() => toggleVariable(itemKey)}
                              />
                            </div>
                          </td>

                          {/* Dataset */}
                          <td className="px-[8px] py-[7px]">
                            <span className="t-small whitespace-nowrap text-text-primary font-mono">{v.datasetName}</span>
                          </td>

                          {/* Variable Name */}
                          <td className="px-[8px] py-[7px]">
                            <span className="t-small font-medium whitespace-nowrap text-text-primary font-mono">
                              {v.variable}
                            </span>
                          </td>

                          {/* Label */}
                          <td className="px-[8px] py-[7px]">
                            <span className="t-small text-text-primary whitespace-normal line-clamp-1" title={v.label}>
                              {v.label}
                            </span>
                          </td>

                          {/* Indicators (VLM, Codelist, Predecessor) */}
                          <td className="px-[8px] py-[7px]">
                            <div className="flex items-center gap-[4px] whitespace-nowrap">
                              {v.hasVlm && (
                                <span className="t-footnote px-[4px] py-[1px] rounded-[2px] bg-graphite-10 text-text-secondary font-mono" title="Value Level Metadata available">
                                  VLM
                                </span>
                              )}
                              {v.hasCodelist && (
                                <span className="t-footnote px-[4px] py-[1px] rounded-[2px] bg-graphite-10 text-text-secondary font-mono" title="Controlled Terminology / Codelist available">
                                  Codelist
                                </span>
                              )}
                              {v.origin === "Predecessor" && (
                                <span className="t-footnote px-[4px] py-[1px] rounded-[2px] bg-graphite-10 text-text-secondary font-mono" title="Derived from SDTM Predecessor">
                                  Predec
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Inspect Info Button */}
                          <td className="px-[8px] py-[7px] text-center">
                            <div
                              className={`size-[20px] rounded-full inline-flex items-center justify-center transition-colors ${
                                isInspecting
                                  ? "bg-[#830051] text-white"
                                  : "text-text-secondary group-hover:text-text-primary group-hover:bg-bg-panel"
                              }`}
                              title="Inspect variable details"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                              </svg>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ----- Column 3: Right Collapsible Detail Panel ----- */}
          {isRightPanelOpen && activeVariable && (
            <div className="w-[360px] shrink-0 border-l border-graphite-10 bg-white flex flex-col overflow-hidden">
              {/* Panel Fixed Header */}
              <div className="px-[16px] py-[12px] border-b border-graphite-10 bg-white shrink-0">
                <div className="flex items-center justify-between">
                  <span className="t-footnote text-text-secondary font-medium">
                    {activeVariable.datasetName} · {getVarStandard(activeVariable)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRightPanelOpen(false)}
                    className="size-[24px] flex items-center justify-center rounded-[4px] text-text-secondary hover:text-text-primary hover:bg-bg-panel transition-colors cursor-pointer"
                    title="Collapse details panel"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="mt-[4px]">
                  <h3 className="t-body font-medium text-text-primary font-mono leading-tight">
                    {activeVariable.variable}
                  </h3>
                  <p className="t-small text-text-primary mt-[2px] leading-snug">
                    {activeVariable.label}
                  </p>
                </div>

                {/* 2-Column Key-Value Grid (Clean, no dot separators, L3 font) */}
                <div className="grid grid-cols-2 gap-x-[16px] gap-y-[4px] mt-[10px] pt-[8px] border-t border-graphite-10">
                  <div className="flex items-center justify-between">
                    <span className="t-footnote text-text-secondary">Type</span>
                    <span className="t-footnote text-text-primary font-mono">{activeVariable.type || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="t-footnote text-text-secondary">Length</span>
                    <span className="t-footnote text-text-primary font-mono">{activeVariable.length || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="t-footnote text-text-secondary">Origin</span>
                    <span className="t-footnote text-text-primary">
                      {activeVariable.origin || (activeVariable.derivation ? "Derived" : "Assigned")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="t-footnote text-text-secondary">Core</span>
                    <span className="t-footnote text-text-primary">{activeVariable.core || "Required"}</span>
                  </div>
                </div>
              </div>

              {/* Panel Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[14px]">
                {/* Mode A: Normal View */}
                {!showSdtmDetail ? (
                  <>
                    {/* Derivation Section */}
                    <div className="flex flex-col gap-[4px]">
                      <span className="t-small font-medium text-text-primary">Derivation</span>
                      <div className="bg-bg-panel/60 rounded-[4px] p-[8px] border border-graphite-10">
                        <p
                          className={`t-small text-text-primary break-words ${
                            isDerivationExpanded ? "" : "line-clamp-4"
                          }`}
                        >
                          {activeVariable.derivation || "No derivation specified."}
                        </p>
                        {activeVariable.derivation && activeVariable.derivation.length > 120 && (
                          <button
                            type="button"
                            onClick={() => setIsDerivationExpanded(!isDerivationExpanded)}
                            className="t-footnote text-brand-1 hover:underline mt-[4px] font-medium cursor-pointer"
                          >
                            {isDerivationExpanded ? "Show less ↑" : "Show more ↓"}
                          </button>
                        )}
                      </div>

                      {/* Direct Predecessor Link (if Origin = Predecessor) */}
                      {(activeVariable.origin === "Predecessor" || activeVariable.predecessor) && (
                        <div className="mt-[6px] p-[8px] rounded-[4px] bg-bg-panel/40 border border-graphite-10 flex flex-col gap-[2px]">
                          <span className="t-footnote text-text-secondary">Direct Predecessor:</span>
                          <div className="flex items-center justify-between">
                            <span className="t-small font-mono text-text-primary">
                              ← {activeVariable.predecessor?.dataset || "DM"}.{activeVariable.predecessor?.variable || activeVariable.variable}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowSdtmDetail(true)}
                              className="t-footnote text-brand-1 hover:underline font-medium cursor-pointer"
                            >
                              View SDTM source →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tabs for VLM and Codelist (only if data exists) */}
                    {(activeVariable.hasVlm || activeVariable.hasCodelist) && (
                      <div className="flex flex-col gap-[8px] mt-[4px] pt-[10px] border-t border-graphite-10">
                        {/* Tab Bar */}
                        <div className="flex items-center gap-[12px] border-b border-graphite-10 pb-[4px]">
                          {activeVariable.hasVlm && (
                            <button
                              type="button"
                              onClick={() => setRightPanelTab("vlm")}
                              className={`t-small pb-[4px] font-medium transition-colors cursor-pointer border-b-2 -mb-[5px] ${
                                rightPanelTab === "vlm"
                                  ? "border-[#830051] text-[#830051]"
                                  : "border-transparent text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              Value Level
                            </button>
                          )}
                          {activeVariable.hasCodelist && (
                            <button
                              type="button"
                              onClick={() => setRightPanelTab("codelist")}
                              className={`t-small pb-[4px] font-medium transition-colors cursor-pointer border-b-2 -mb-[5px] ${
                                rightPanelTab === "codelist"
                                  ? "border-[#830051] text-[#830051]"
                                  : "border-transparent text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              Codelist
                            </button>
                          )}
                        </div>

                        {/* Tab Content 1: VLM */}
                        {rightPanelTab === "vlm" && activeVariable.hasVlm && (
                          <div className="flex flex-col gap-[6px]">
                            <span className="t-footnote text-text-secondary">
                              Parameter conditions for {activeVariable.variable}:
                            </span>
                            {activeVariable.vlmParameters && activeVariable.vlmParameters.length > 0 ? (
                              <div className="flex flex-col gap-[4px]">
                                {activeVariable.vlmParameters.map((vp, idx) => (
                                  <div
                                    key={idx}
                                    className="p-[8px] rounded-[4px] bg-bg-panel/50 border border-graphite-10 flex flex-col gap-[2px]"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="t-small font-medium font-mono text-text-primary">
                                        {vp.param}
                                      </span>
                                      <span className="t-footnote text-text-secondary font-mono">
                                        {vp.condition}
                                      </span>
                                    </div>
                                    <span className="t-footnote text-text-primary mt-[2px]">{vp.derivation}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Fallback from global vlmData if specific params not defined
                              <div className="flex flex-col gap-[4px]">
                                {vlmData
                                  .filter((item) => item.datasetName === activeVariable.datasetName)
                                  .slice(0, 5)
                                  .map((vlm) => (
                                    <div
                                      key={vlm.id}
                                      className="p-[8px] rounded-[4px] bg-bg-panel/50 border border-graphite-10 flex flex-col gap-[2px]"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="t-small font-medium text-text-primary">{vlm.parameterName}</span>
                                        <span className="t-footnote text-text-secondary font-mono">{vlm.whereClause}</span>
                                      </div>
                                      <span className="t-footnote text-text-primary mt-[2px]">{vlm.derivation}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tab Content 2: Codelist */}
                        {rightPanelTab === "codelist" && activeVariable.hasCodelist && (
                          <div className="flex flex-col gap-[6px]">
                            <div className="flex items-center justify-between">
                              <span className="t-footnote text-text-secondary">
                                Terminology:{" "}
                                <strong className="text-text-primary font-mono">
                                  {activeVariable.codelistRef || activeVariable.variable}
                                </strong>
                              </span>
                            </div>

                            {/* Codelist Filter Input */}
                            <input
                              type="text"
                              placeholder="Filter code values…"
                              value={codelistSearch}
                              onChange={(e) => setCodelistSearch(e.target.value)}
                              className="h-[24px] px-[6px] rounded-[2px] border border-graphite-10 text-text-primary t-footnote focus:outline-none focus:border-[#830051]"
                            />

                            {/* Codelist Values Table */}
                            <div className="border border-graphite-10 rounded-[4px] overflow-hidden">
                              <table className="w-full border-collapse">
                                <thead className="bg-bg-panel/60 border-b border-graphite-10">
                                  <tr>
                                    <th className="px-[8px] py-[4px] text-left t-footnote font-medium text-text-secondary">Code</th>
                                    <th className="px-[8px] py-[4px] text-left t-footnote font-medium text-text-secondary">Label</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(activeVariable.codelistValues || [
                                    { value: "Y", label: "Yes" },
                                    { value: "N", label: "No" },
                                  ])
                                    .filter((cv) => {
                                      if (!codelistSearch.trim()) return true;
                                      const cs = codelistSearch.toLowerCase();
                                      return (
                                        cv.value.toLowerCase().includes(cs) ||
                                        cv.label.toLowerCase().includes(cs)
                                      );
                                    })
                                    .map((cv, idx) => (
                                      <tr key={idx} className="border-b border-graphite-10 last:border-0">
                                        <td className="px-[8px] py-[4px] t-footnote font-mono font-medium text-text-primary">
                                          {cv.value}
                                        </td>
                                        <td className="px-[8px] py-[4px] t-footnote text-text-primary">
                                          {cv.label}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Mode B: SDTM Source Comparison View */
                  <div className="flex flex-col gap-[12px]">
                    <button
                      type="button"
                      onClick={() => setShowSdtmDetail(false)}
                      className="t-small text-brand-1 hover:underline font-medium flex items-center gap-[4px] cursor-pointer"
                    >
                      ← Back to ADaM ({activeVariable.variable})
                    </button>

                    <div className="p-[10px] rounded-[4px] bg-bg-panel/60 border border-graphite-10 flex flex-col gap-[6px]">
                      <span className="t-small font-medium text-text-primary">
                        SDTM Source: {activeVariable.predecessor?.dataset || "DM"}.{activeVariable.predecessor?.variable || activeVariable.variable}
                      </span>
                      <p className="t-footnote text-text-secondary">
                        {activeVariable.predecessor?.label || activeVariable.label}
                      </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="border border-graphite-10 rounded-[4px] overflow-hidden">
                      <table className="w-full border-collapse">
                        <thead className="bg-bg-panel/60 border-b border-graphite-10">
                          <tr>
                            <th className="px-[8px] py-[5px] text-left t-footnote font-medium text-text-secondary">Property</th>
                            <th className="px-[8px] py-[5px] text-left t-footnote font-medium text-text-secondary">ADaM</th>
                            <th className="px-[8px] py-[5px] text-left t-footnote font-medium text-text-secondary">SDTM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-graphite-10">
                            <td className="px-[8px] py-[4px] t-footnote text-text-secondary">Variable</td>
                            <td className="px-[8px] py-[4px] t-footnote font-mono text-text-primary">{activeVariable.variable}</td>
                            <td className="px-[8px] py-[4px] t-footnote font-mono text-text-primary">{activeVariable.predecessor?.variable || activeVariable.variable}</td>
                          </tr>
                          <tr className="border-b border-graphite-10">
                            <td className="px-[8px] py-[4px] t-footnote text-text-secondary">Type/Len</td>
                            <td className="px-[8px] py-[4px] t-footnote font-mono text-text-primary">{activeVariable.type}/{activeVariable.length}</td>
                            <td className="px-[8px] py-[4px] t-footnote font-mono text-text-primary">{activeVariable.predecessor?.type || activeVariable.type}/{activeVariable.predecessor?.length || activeVariable.length}</td>
                          </tr>
                          <tr className="border-b border-graphite-10">
                            <td className="px-[8px] py-[4px] t-footnote text-text-secondary">Origin</td>
                            <td className="px-[8px] py-[4px] t-footnote text-text-primary">Predecessor</td>
                            <td className="px-[8px] py-[4px] t-footnote text-text-primary">CRF</td>
                          </tr>
                          <tr>
                            <td className="px-[8px] py-[4px] t-footnote text-text-secondary">Derivation</td>
                            <td className="px-[8px] py-[4px] t-footnote text-text-primary">{activeVariable.derivation}</td>
                            <td className="px-[8px] py-[4px] t-footnote text-text-primary">{activeVariable.predecessor?.derivation || "CRF: Demographics Page"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= 4. Footer ================= */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#D8DADA] px-[20px] py-[10px] bg-white">
          {/* Left summary & quick toggle */}
          <div className="flex items-center gap-[12px]">
            <span className="t-small text-text-primary">
              <strong className="font-semibold">{selected.length}</strong> variable{selected.length === 1 ? "" : "s"} selected across{" "}
              <strong className="font-semibold">{selectedDatasets.length}</strong> dataset{selectedDatasets.length === 1 ? "" : "s"}
            </span>

            {/* Show Selected Only Filter */}
            <FilterChip
              type="Toggle"
              variant="filter"
              showIcon={false}
              label="Selected only"
              active={showSelectedOnly}
              onClick={() => setShowSelectedOnly(!showSelectedOnly)}
            />

            {/* New datasets addition alert */}
            {newlyAddedDatasets.length > 0 && (
              <span className="t-footnote text-text-secondary flex items-center gap-[4px]" title={`${newlyAddedDatasets.join(", ")} will be appended to Source Dataset(s)`}>
                <span className="inline-flex size-[14px] items-center justify-center rounded-full bg-[#F4E8EE] text-[#830051] text-[10px] font-bold shrink-0">
                  i
                </span>
                <span>+{newlyAddedDatasets.length} dataset(s) will be added</span>
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="h-[32px] px-[14px] rounded-[4px] border border-[#D8DADA] bg-white t-small font-medium text-text-primary hover:bg-bg-panel transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="h-[32px] px-[16px] rounded-[4px] bg-[#830051] t-small font-medium text-white hover:bg-[#6e0044] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selected.length === 0}
            >
              Confirm ({selected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariableSpecPicker;
