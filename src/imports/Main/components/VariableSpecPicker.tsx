import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Button } from "../../../components/ui/Button";
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
  mode?: "table" | "listing";
}

function DerivationCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <span className="t-small text-text-secondary">-</span>;

  const lines = text.split("\n").filter(Boolean);
  const isMultiLine = lines.length > 1;
  const isLongText = text.length > 50;
  const shouldTruncate = isMultiLine || isLongText;

  const firstLine = lines[0] || "";
  const previewText = firstLine.length > 50 ? `${firstLine.slice(0, 50)}...` : firstLine;

  return (
    <div className="flex flex-col items-start gap-[2px]">
      <span className="t-small text-text-primary whitespace-normal">
        {expanded || !shouldTruncate ? text : `${previewText}${isMultiLine && firstLine.length <= 50 ? "..." : ""}`}
      </span>
      {shouldTruncate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="t-footnote text-brand-1 hover:underline cursor-pointer font-medium"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function ChevronRightTreeIcon({ isExpanded, color = "#888E8E" }: { isExpanded: boolean; color?: string }) {
  return (
    <svg
      className={`size-[16px] transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z"
        fill={color}
      />
    </svg>
  );
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
  mode = "table",
}: VariableSpecPickerProps) {
  const isTableMode = mode !== "listing";

  // --- Selection & Filter State ---
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNavStandard, setSelectedNavStandard] = useState<"ADaM" | "SDTM" | null>(
    isTableMode ? "ADaM" : null
  );
  const [selectedNavDataset, setSelectedNavDataset] = useState<string | null>(null);
  const [hasVlmFilter, setHasVlmFilter] = useState(false);
  const [hasCodelistFilter, setHasCodelistFilter] = useState(false);
  const [isShowingSelectedOnly, setIsShowingSelectedOnly] = useState(false);

  // --- Tree List Expand/Collapse State ---
  const [isAdamExpanded, setIsAdamExpanded] = useState(true);
  const [isSdtmExpanded, setIsSdtmExpanded] = useState(!isTableMode);

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
      setHasVlmFilter(false);
      setHasCodelistFilter(false);
      setIsShowingSelectedOnly(false);
      setIsRightPanelOpen(false);
      setActiveVariable(null);
      setShowSdtmDetail(false);

      // Initialize navigation scope based on mode and sourceDatasets
      if (sourceDatasets && sourceDatasets.length === 1) {
        const singleDs = sourceDatasets[0];
        setSelectedNavDataset(singleDs);
        const std = singleDs.startsWith("AD") ? "ADaM" : "SDTM";
        setSelectedNavStandard(std);
        if (std === "ADaM") {
          setIsAdamExpanded(true);
          setIsSdtmExpanded(false);
        } else {
          setIsAdamExpanded(false);
          setIsSdtmExpanded(true);
        }
      } else if (isTableMode) {
        setSelectedNavStandard("ADaM");
        setSelectedNavDataset(null);
        setIsAdamExpanded(true);
        setIsSdtmExpanded(false); // Collapsed by default in Table mode to prevent accidental selection
      } else {
        // Listing mode: cross-domain all datasets
        setSelectedNavStandard(null);
        setSelectedNavDataset(null);
        setIsAdamExpanded(true);
        setIsSdtmExpanded(true);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialSelected, sourceDatasets, isTableMode]);

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

      // 1. Navigation Scope Filter (Selected only, Dataset, or Standard level)
      if (isShowingSelectedOnly) {
        const itemKey = `${v.datasetName}.${v.variable}`;
        const isSelected = selected.includes(itemKey) || selected.includes(v.variable);
        if (!isSelected) return false;
      } else if (selectedNavDataset) {
        if (v.datasetName !== selectedNavDataset) return false;
      } else if (selectedNavStandard) {
        if (vStd !== selectedNavStandard) return false;
      }

      // 2. Has VLM Filter
      if (hasVlmFilter && !v.hasVlm) return false;

      // 3. Has Codelist Filter
      if (hasCodelistFilter && !v.hasCodelist) return false;

      // 4. Global Keyword Search (Variable Name, Label, Dataset, Derivation)
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
    isShowingSelectedOnly,
    selectedNavStandard,
    selectedNavDataset,
    hasVlmFilter,
    hasCodelistFilter,
    selected,
    getVarStandard,
  ]);

  // Compute Dataset Nav list grouped by Standard with matching counts (Faceted Navigation)
  const navDatasets = useMemo(() => {
    const q = search.toLowerCase().trim();
    const candidatePool = variables.filter((v) => {
      if (hasVlmFilter && !v.hasVlm) return false;
      if (hasCodelistFilter && !v.hasCodelist) return false;
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
    hasVlmFilter,
    hasCodelistFilter,
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
  const defaultNavStandard = isTableMode ? "ADaM" : null;
  const hasActiveFilters =
    isShowingSelectedOnly ||
    selectedNavStandard !== defaultNavStandard ||
    selectedNavDataset !== null ||
    hasVlmFilter ||
    hasCodelistFilter ||
    search.trim().length > 0;

  const handleClearFilters = () => {
    setIsShowingSelectedOnly(false);
    setSelectedNavStandard(defaultNavStandard);
    setSelectedNavDataset(null);
    setHasVlmFilter(false);
    setHasCodelistFilter(false);
    setSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-[16px]">
      <div
        className="flex flex-col w-[1180px] max-w-[96vw] h-[680px] max-h-[92vh] rounded-[8px] bg-white border border-graphite-10 shadow-[0px_16px_40px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= 1. Top Header (Clean, Standard Single-line) ================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-graphite-10 px-[20px] py-[14px] bg-white">
          <h2 className="t-body font-semibold text-text-primary">
            Find &amp; select variables
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[24px] items-center justify-center rounded-[4px] text-text-secondary hover:bg-bg-panel hover:text-text-primary transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ================= 2. Filter Bar ================= */}
        <div className="flex shrink-0 items-center justify-between gap-[12px] border-b border-graphite-10 px-[20px] py-[8px] bg-bg-panel/40">
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            {/* Global Omni Search Input */}
            <div className="relative w-[340px] shrink-0">
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
                placeholder="Search variable, label, dataset, derivation…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[28px] rounded-[4px] border border-graphite-10 bg-white pl-[28px] pr-[24px] t-small text-text-primary placeholder:text-text-secondary focus:border-[#830051] focus:outline-none transition-colors"
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

            <div className="h-[16px] w-[1px] bg-graphite-10 shrink-0" />

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
          </div>
        </div>

        {/* ================= 3. Main 3-Column Area ================= */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
          {/* ----- Column 1: Left Dataset Tree List (Aligned with Detail Page Tree List) ----- */}
          <div className="w-[200px] shrink-0 border-r border-graphite-10 bg-bg-panel/40 flex flex-col overflow-y-auto p-[6px]">
            {/* Top Quick Control: Selected only switch */}
            <div
              onClick={() => setIsShowingSelectedOnly(!isShowingSelectedOnly)}
              className={`flex h-[28px] items-center justify-between px-[10px] cursor-pointer rounded-[4px] transition-colors select-none ${
                isShowingSelectedOnly
                  ? "bg-[#F4E8EE]/70"
                  : "hover:bg-graphite-10"
              }`}
            >
              <div className="flex items-center gap-[6px] min-w-0">
                <span className={`t-small truncate ${isShowingSelectedOnly ? "text-brand-1 font-medium" : "text-text-primary"}`}>
                  Selected only
                </span>
                {selected.length > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[16px] px-[5px] rounded-full text-[11px] font-medium leading-none ${
                      isShowingSelectedOnly
                        ? "bg-brand-1 text-white"
                        : "bg-graphite-20 text-text-secondary"
                    }`}
                  >
                    {selected.length > 99 ? "99+" : selected.length}
                  </span>
                )}
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isShowingSelectedOnly}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowingSelectedOnly(!isShowingSelectedOnly);
                }}
                className={`relative inline-flex h-[16px] w-[28px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  isShowingSelectedOnly ? "bg-brand-1" : "bg-[#CBCED4]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-[12px] m-[2px] transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    isShowingSelectedOnly ? "translate-x-[12px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="h-[1px] bg-graphite-10 mx-[4px] my-[6px]" />

            {/* ADaM Tree Branch */}
            {navDatasets.adam.length > 0 && (
              <div>
                {/* Branch Header */}
                <div
                  className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors select-none ${
                    selectedNavStandard === "ADaM" && selectedNavDataset === null && !isShowingSelectedOnly
                      ? "bg-[#F4E8EE] text-brand-1 font-medium"
                      : "text-text-primary hover:bg-graphite-10"
                  }`}
                  onClick={() => {
                    setIsShowingSelectedOnly(false);
                    if (selectedNavStandard === "ADaM" && selectedNavDataset === null) {
                      setSelectedNavStandard(null);
                    } else {
                      setSelectedNavStandard("ADaM");
                      setSelectedNavDataset(null);
                    }
                  }}
                >
                  <div className="flex h-full items-center justify-between px-[10px]">
                    <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[6px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAdamExpanded(!isAdamExpanded);
                        }}
                        className="flex h-[16px] w-[16px] shrink-0 items-center justify-center active:scale-[0.96] cursor-pointer"
                        title={isAdamExpanded ? "Collapse ADaM" : "Expand ADaM"}
                      >
                        <ChevronRightTreeIcon
                          isExpanded={isAdamExpanded}
                          color={
                            selectedNavStandard === "ADaM" && selectedNavDataset === null && !isShowingSelectedOnly
                              ? "#830051"
                              : "#888E8E"
                          }
                        />
                      </button>
                      <span className="t-small font-medium truncate">ADaM</span>
                    </div>
                  </div>
                </div>

                {/* Branch Children (Indent pl-[32px] to align perfectly with ADaM label text) */}
                {isAdamExpanded && (
                  <div className="flex flex-col gap-[1px]">
                    {navDatasets.adam.map((ds) => {
                      const isNavActive = selectedNavDataset === ds.name && !isShowingSelectedOnly;
                      return (
                        <div
                          key={ds.name}
                          onClick={() => {
                            setIsShowingSelectedOnly(false);
                            if (isNavActive) {
                              setSelectedNavDataset(null);
                              setSelectedNavStandard("ADaM");
                            } else {
                              setSelectedNavDataset(ds.name);
                              setSelectedNavStandard("ADaM");
                            }
                          }}
                          className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors select-none ${
                            isNavActive
                              ? "bg-[#F4E8EE] text-brand-1 font-medium"
                              : "text-text-primary hover:bg-graphite-10"
                          }`}
                        >
                          <div className="flex h-full items-center justify-between pl-[32px] pr-[10px]">
                            <span className="t-small truncate">{ds.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SDTM Tree Branch */}
            {navDatasets.sdtm.length > 0 && (
              <div className="mt-[2px]">
                {/* Branch Header */}
                <div
                  className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors select-none ${
                    selectedNavStandard === "SDTM" && selectedNavDataset === null && !isShowingSelectedOnly
                      ? "bg-[#F4E8EE] text-brand-1 font-medium"
                      : "text-text-primary hover:bg-graphite-10"
                  }`}
                  onClick={() => {
                    setIsShowingSelectedOnly(false);
                    if (selectedNavStandard === "SDTM" && selectedNavDataset === null) {
                      setSelectedNavStandard(null);
                    } else {
                      setSelectedNavStandard("SDTM");
                      setSelectedNavDataset(null);
                    }
                  }}
                >
                  <div className="flex h-full items-center justify-between px-[10px]">
                    <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[6px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSdtmExpanded(!isSdtmExpanded);
                        }}
                        className="flex h-[16px] w-[16px] shrink-0 items-center justify-center active:scale-[0.96] cursor-pointer"
                        title={isSdtmExpanded ? "Collapse SDTM" : "Expand SDTM"}
                      >
                        <ChevronRightTreeIcon
                          isExpanded={isSdtmExpanded}
                          color={
                            selectedNavStandard === "SDTM" && selectedNavDataset === null && !isShowingSelectedOnly
                              ? "#830051"
                              : "#888E8E"
                          }
                        />
                      </button>
                      <span className="t-small font-medium truncate">SDTM</span>
                    </div>
                  </div>
                </div>

                {/* Branch Children (Indent pl-[32px] to align perfectly with SDTM label text) */}
                {isSdtmExpanded && (
                  <div className="flex flex-col gap-[1px]">
                    {navDatasets.sdtm.map((ds) => {
                      const isNavActive = selectedNavDataset === ds.name && !isShowingSelectedOnly;
                      return (
                        <div
                          key={ds.name}
                          onClick={() => {
                            setIsShowingSelectedOnly(false);
                            if (isNavActive) {
                              setSelectedNavDataset(null);
                              setSelectedNavStandard("SDTM");
                            } else {
                              setSelectedNavDataset(ds.name);
                              setSelectedNavStandard("SDTM");
                            }
                          }}
                          className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors select-none ${
                            isNavActive
                              ? "bg-[#F4E8EE] text-brand-1 font-medium"
                              : "text-text-primary hover:bg-graphite-10"
                          }`}
                        >
                          <div className="flex h-full items-center justify-between pl-[32px] pr-[10px]">
                            <span className="t-small truncate">{ds.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ----- Column 2: Middle Variable Table (Pilot Single-line Row Style) ----- */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white">
            <div
              className="flex-1 overflow-y-auto overflow-x-auto"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, var(--color-bg-panel, #F8F7F7) 35px, var(--color-graphite-10, #ECECEC) 35px, var(--color-graphite-10, #ECECEC) 36px, #ffffff 36px)",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <table className="w-full min-w-[580px] border-collapse">
                <thead className="sticky top-0 z-10 bg-bg-panel">
                  <tr className="h-[36px]">
                    <th className="w-[36px] h-[36px] px-[12px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
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
                    <th className="w-[80px] h-[36px] px-[8px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Dataset</span>
                    </th>
                    <th className="w-[110px] h-[36px] px-[8px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Variable</span>
                    </th>
                    <th className="h-[36px] px-[8px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Label</span>
                    </th>
                    <th className="w-[64px] h-[36px] px-[8px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Type</span>
                    </th>
                    <th className="w-[220px] h-[36px] px-[8px] py-0 align-middle text-left bg-bg-panel shadow-[inset_0_-1px_0_var(--color-graphite-10,#ECECEC)]">
                      <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Derivation</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVariables.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-[20px] py-[48px] text-center">
                        <p className="t-small text-text-secondary">
                          {isShowingSelectedOnly ? "No variables selected yet" : "No matching variables found"}
                        </p>
                        {isShowingSelectedOnly ? (
                          <p className="t-footnote text-text-secondary mt-[4px]">
                            Select variables from the datasets on the left to review them here.
                          </p>
                        ) : hasActiveFilters ? (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="t-small text-brand-1 hover:underline mt-[6px] font-medium cursor-pointer"
                          >
                            Reset filters
                          </button>
                        ) : null}
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
                              ? "bg-[#F4E8EE]/40 hover:bg-[#F4E8EE]/60"
                              : isChecked
                              ? "bg-bg-panel/40 hover:bg-bg-panel"
                              : "hover:bg-bg-panel"
                          }`}
                        >
                          {/* Checkbox Cell */}
                          <td
                            className="w-[36px] px-[12px] py-[6px]"
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
                          <td className="px-[8px] py-[6px]">
                            <span className="t-small whitespace-nowrap text-text-primary font-mono">{v.datasetName}</span>
                          </td>

                          {/* Variable Name */}
                          <td className="px-[8px] py-[6px]">
                            <span className="t-small font-medium whitespace-nowrap text-text-primary font-mono">
                              {v.variable}
                            </span>
                          </td>

                          {/* Label */}
                          <td className="px-[8px] py-[6px]">
                            <span className="t-small text-text-primary whitespace-normal line-clamp-2" title={v.label}>
                              {v.label}
                            </span>
                          </td>

                          {/* Type */}
                          <td className="px-[8px] py-[6px]">
                            <span className="t-small whitespace-nowrap text-text-primary font-mono">
                              {v.type || "-"}
                            </span>
                          </td>

                          {/* Derivation */}
                          <td className="px-[8px] py-[6px]">
                            <DerivationCell text={v.derivation} />
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
                    <span className="t-footnote text-text-secondary">Format</span>
                    <span className="t-footnote text-text-primary font-mono">{activeVariable.displayFormat || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="t-footnote text-text-secondary">Core</span>
                    <span className="t-footnote text-text-primary">{activeVariable.core || "Required"}</span>
                  </div>
                  <div className="flex items-center justify-between col-span-2">
                    <span className="t-footnote text-text-secondary">Origin</span>
                    <span className="t-footnote text-text-primary">
                      {activeVariable.origin || (activeVariable.derivation ? "Derived" : "Assigned")}
                    </span>
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
        <div className="flex shrink-0 items-center justify-between border-t border-graphite-10 px-[20px] py-[14px] bg-white">
          {/* Left: new datasets addition notice (if any) */}
          <div className="flex items-center">
            {newlyAddedDatasets.length > 0 && (
              <span className="t-footnote text-text-secondary flex items-center gap-[4px]" title={`${newlyAddedDatasets.join(", ")} will be appended to Source Dataset(s)`}>
                <span className="inline-flex size-[14px] items-center justify-center rounded-full bg-[#F4E8EE] text-[#830051] text-[10px] font-bold shrink-0">
                  i
                </span>
                <span>+{newlyAddedDatasets.length} dataset(s) will be added to Source Dataset(s)</span>
              </span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-[10px]">
            <Button
              variant="ghost"
              size="default"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={handleConfirm}
              disabled={selected.length === 0}
            >
              Confirm ({selected.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariableSpecPicker;
