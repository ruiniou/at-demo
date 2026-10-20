import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { SearchBar } from "../../../components/ui/SearchBar";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Tooltip } from "../../../components/ui/Tooltip";
import { variableKey, variableStandard, normalizeSelection, buildCodelists, buildConditions } from "./variablePickerData";
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
  const [canExpand, setCanExpand] = useState(false);
  const previewRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    setExpanded(false);
  }, [text]);
  useLayoutEffect(() => {
    if (expanded || !text || !previewRef.current) return;
    const preview = previewRef.current;
    const measure = () => setCanExpand(preview.scrollHeight > preview.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(preview);
    return () => observer.disconnect();
  }, [text, expanded]);

  if (!text) return <span className="t-small text-text-secondary">-</span>;
  return (
    <div className="flex flex-col items-start gap-[2px]">
      <span ref={previewRef} className={`t-small text-text-primary whitespace-pre-wrap break-words ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </span>
      {(canExpand || expanded) && (
        <button type="button" onClick={event => { event.stopPropagation(); setExpanded(!expanded); }} className="t-footnote text-brand-1 hover:underline cursor-pointer font-medium">
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

// Derived from Button with the existing neutral Tag treatment.
function PickerJumpButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return <Tooltip label={label}><Button variant="ghost" size="sm" aria-label={label} onClick={onClick} className="!bg-bg-panel !text-text-primary border border-graphite-10 !px-1.5 !py-0.5 t-small hover:!bg-graphite-10">{children}</Button></Tooltip>;
}
type PickerTab = "variables" | "vlm" | "codelist";
const EMPTY_VARIABLES: Variable[] = [];
const EMPTY_VLM: VlmRow[] = [];
const EMPTY_CODELISTS: AdamCodeListRow[] = [];
const EMPTY_DATASETS: string[] = [];

export function VariableSpecPicker({ isOpen, onClose, onConfirm, initialSelected, variables = EMPTY_VARIABLES, vlmData = EMPTY_VLM, adamCodeListData = EMPTY_CODELISTS, sourceDatasets = EMPTY_DATASETS, onDatasetsExpand, mode = "table" }: VariableSpecPickerProps) {
  const isTableMode = mode !== "listing";
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [vlmSearch, setVlmSearch] = useState("");
  const [codelistSearch, setCodelistSearch] = useState("");
  const [selectedNavStandard, setSelectedNavStandard] = useState<"ADaM" | "SDTM" | null>(isTableMode ? "ADaM" : null);
  const [selectedNavDataset, setSelectedNavDataset] = useState<string | null>(null);
  const [isShowingSelectedOnly, setIsShowingSelectedOnly] = useState(false);
  const [isAdamExpanded, setIsAdamExpanded] = useState(true);
  const [isSdtmExpanded, setIsSdtmExpanded] = useState(!isTableMode);
  const [tab, setTab] = useState<PickerTab>("variables");
  const [codelistId, setCodelistId] = useState("");
  const [termPage, setTermPage] = useState(0);
  const [vlmAnchor, setVlmAnchor] = useState("");
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Record<PickerTab, number>>({ variables: 0, vlm: 0, codelist: 0 });
  const codelists = useMemo(() => buildCodelists(adamCodeListData, variables), [adamCodeListData, variables]);
  const unlinked = selectedNavDataset === "__unlinked__" && !isShowingSelectedOnly;
  const crossDataset = isShowingSelectedOnly || !selectedNavDataset;
  const isSdtm = selectedNavStandard === "SDTM";
  const conditions = useMemo(() => buildConditions(selectedNavDataset, vlmData, variables), [selectedNavDataset, vlmData, variables]);
  const datasetCodelists = codelists.filter(c => unlinked ? !c.links.length : c.links.some(link => link.dataset === selectedNavDataset));
  const currentCodelist = datasetCodelists.find(c => c.id === codelistId) ?? datasetCodelists[0];
  const available = { variables: !unlinked, vlm: !unlinked && !crossDataset && !isSdtm && conditions.length > 0, codelist: unlinked || (!crossDataset && !isSdtm && datasetCodelists.length > 0) };
  const activeTab: PickerTab = available[tab] ? tab : unlinked ? "codelist" : "variables";
  const resetScroll = (target: PickerTab) => { scrollPositions.current[target] = 0; if (activeTab === target && scrollRef.current) scrollRef.current.scrollTop = 0; };
  const resetContext = () => {
    setVlmSearch(""); setCodelistSearch(""); setVlmAnchor(""); setCodelistId(""); setTermPage(0);
    setScrollTarget(null);
    scrollPositions.current = { variables: 0, vlm: 0, codelist: 0 };
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  const selectScope = (dataset: string | null, standard: "ADaM" | "SDTM" | null) => {
    resetContext(); setIsShowingSelectedOnly(false); setSelectedNavDataset(dataset); setSelectedNavStandard(standard);
    if (standard === "SDTM") setTab("variables");
  };
  const toggleSelectedOnly = () => {
    setIsShowingSelectedOnly(!isShowingSelectedOnly); setTab("variables"); resetScroll("variables");
  };
  const getVarStandard = variableStandard;
  const navDatasets = useMemo(() => {
    const names = (standard: "ADaM" | "SDTM") => [...new Set(variables.filter(v => variableStandard(v) === standard).map(v => v.datasetName))].sort().map(name => ({ name }));
    return { adam: names("ADaM"), sdtm: names("SDTM") };
  }, [variables]);
  const filteredVariables = useMemo(() => variables.filter(v => {
    if (isShowingSelectedOnly ? !selected.includes(variableKey(v)) : selectedNavDataset ? v.datasetName !== selectedNavDataset : selectedNavStandard && variableStandard(v) !== selectedNavStandard) return false;
    const q = search.trim().toLowerCase();
    return !q || [v.variable, v.label, v.derivation].some(text => text?.toLowerCase().includes(q));
  }), [variables, isShowingSelectedOnly, selected, selectedNavDataset, selectedNavStandard, search]);
  const prevOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      const normalized = normalizeSelection(initialSelected, variables, sourceDatasets);
      setSelected(normalized); setSearch(""); setTab("variables"); resetContext(); setIsShowingSelectedOnly(false);
      // Without a Dataset field the picker opens on the dataset the current selection comes from, if there is just one.
      const selectedDatasetNames = [...new Set(normalized.map(key => key.split(".")[0]))];
      const dataset = sourceDatasets.length === 1 ? sourceDatasets[0] : selectedDatasetNames.length === 1 ? selectedDatasetNames[0] : null;
      const standard = dataset ? variableStandard(variables.find(v => v.datasetName === dataset) ?? { datasetName: dataset } as Variable) : isTableMode ? "ADaM" : null;
      setSelectedNavDataset(dataset); setSelectedNavStandard(standard);
      setIsAdamExpanded(standard !== "SDTM"); setIsSdtmExpanded(standard !== "ADaM");
    }
    prevOpen.current = isOpen;
  }, [isOpen, initialSelected, variables, sourceDatasets, isTableMode]);
  useEffect(() => { if (tab !== activeTab) setTab(activeTab); }, [tab, activeTab]);
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollPositions.current[activeTab];
  }, [isOpen, activeTab, selectedNavDataset, isShowingSelectedOnly]);
  useLayoutEffect(() => {
    if (!isOpen || activeTab !== "variables" || !scrollTarget) return;
    const row = Array.from(scrollRef.current?.querySelectorAll<HTMLElement>("[data-variable-key]") ?? []).find(row => row.dataset.variableKey === scrollTarget);
    if (row) { row.scrollIntoView({ block: "nearest" }); setScrollTarget(null); }
  }, [isOpen, activeTab, scrollTarget, filteredVariables]);
  const toggleVariable = (key: string) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const selectedDatasets = [...new Set(selected.map(key => key.split(".")[0]))].sort();
  const newlyAddedDatasets = sourceDatasets.length ? selectedDatasets.filter(ds => !sourceDatasets.includes(ds)) : [];
  const handleConfirm = () => { if (newlyAddedDatasets.length) onDatasetsExpand?.(newlyAddedDatasets); onConfirm(selected); onClose(); };
  const codelistForVariable = (v: Variable) => codelists.find(c => c.links.some(link => link.dataset === v.datasetName && link.variable === v.variable));
  const variableHasVlm = (v: Variable) => variableStandard(v) === "ADaM" && (vlmData.some(r => r.datasetName === v.datasetName && r.variableName === v.variable) || Boolean(v.vlmParameters?.length));
  const jump = (target: "vlm" | "codelist", v: Variable) => {
    selectScope(v.datasetName, variableStandard(v)); setIsAdamExpanded(true); setTab(target);
    if (target === "vlm") setVlmAnchor(v.variable); else setCodelistId(codelistForVariable(v)?.id ?? "");
  };
  useEffect(() => {
    if (!isOpen) return;
    const keydown = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", keydown); return () => window.removeEventListener("keydown", keydown);
  }, [isOpen, onClose]);
  const workspaceTitle = isShowingSelectedOnly ? "Selected only" : unlinked ? "Unlinked codelists" : selectedNavDataset ?? selectedNavStandard ?? "All datasets";
  const unavailableReason = (target: PickerTab) => unlinked ? "Select a dataset to view variables or VLM" : crossDataset ? "Select a dataset to view VLM or codelists" : isSdtm ? "SDTM VLM / Codelist is not in scope yet" : target === "vlm" ? "No VLM for this dataset" : "No codelist for this dataset";
  const terms = (currentCodelist?.terms ?? []).filter(t => !codelistSearch.trim() || [t.value, t.label].some(text => text.toLowerCase().includes(codelistSearch.trim().toLowerCase())));
  const pageCount = Math.max(1, Math.ceil(terms.length / 100));
  const page = Math.min(termPage, pageCount - 1);
  const matchingConditions = conditions.filter(c => !vlmSearch.trim() || [c.identifier, c.expression].some(text => text.toLowerCase().includes(vlmSearch.trim().toLowerCase())));
  const onScroll = (event: React.UIEvent<HTMLDivElement>) => { scrollPositions.current[activeTab] = event.currentTarget.scrollTop; };
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto p-[16px]">
      {/* Backdrop: Clean solid black/40 without backdrop-blur to eliminate halo/gradient artifacts */}
      <div
        className="fixed inset-0 bg-black/40 pointer-events-auto cursor-pointer"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Container */}
      <div
        className="relative z-10 flex flex-col w-[1180px] max-w-[96vw] h-[680px] max-h-[92vh] rounded-[8px] bg-white border border-graphite-10 shadow-[0px_16px_40px_rgba(0,0,0,0.18)] overflow-hidden pointer-events-auto"
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

        {/* ================= 3. Main 3-Column Area ================= */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
          {/* ----- Column 1: Left Dataset Tree List (Aligned with Detail Page Tree List) ----- */}
          <div className="w-44 shrink-0 border-r border-graphite-10 bg-bg-panel/40 flex flex-col overflow-hidden">
            {/* Top Header: Selected only switch (Exact height 36px, full width, border-b aligned with right table header) */}
            <div
              onClick={() => toggleSelectedOnly()}
              className={`h-[36px] w-full shrink-0 flex items-center justify-between px-[16px] border-b border-graphite-10 cursor-pointer select-none transition-colors ${
                isShowingSelectedOnly
                  ? "bg-[#F4E8EE]/80 text-brand-1"
                  : "bg-bg-panel hover:bg-graphite-10/70 text-text-primary"
              }`}
            >
              <div className="flex items-center gap-[4px] min-w-0">
                <span className={`t-small truncate ${isShowingSelectedOnly ? "text-brand-1 font-medium" : "text-text-primary"}`}>
                  Selected only
                </span>
                {selected.length > 0 && (
                  <span
                    className={`t-small tabular-nums ${
                      isShowingSelectedOnly
                        ? "text-brand-1 font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    ({selected.length > 99 ? "99+" : selected.length})
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
                  toggleSelectedOnly();
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

            {/* Scrollable Tree Items */}
            <div className="flex-1 overflow-y-auto p-[6px]">

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
                  onClick={() => selectScope(null, selectedNavStandard === "ADaM" && selectedNavDataset === null ? null : "ADaM")}
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
                          onClick={() => selectScope(isNavActive ? null : ds.name, "ADaM")}
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
                  onClick={() => selectScope(null, selectedNavStandard === "SDTM" && selectedNavDataset === null ? null : "SDTM")}
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
                          onClick={() => selectScope(isNavActive ? null : ds.name, "SDTM")}
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
            <button type="button" onClick={() => { selectScope("__unlinked__", null); setTab("codelist"); }} className={`mt-2 w-full rounded-sm px-2 py-1 text-left t-small ${unlinked ? "bg-az-secondary text-brand-1" : "text-text-primary hover:bg-graphite-10"}`}>Unlinked codelists</button>
            </div>
          </div>

          <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-graphite-10 px-4 py-2">
              <span className="t-body-medium text-text-primary" style={{ fontWeight: "var(--font-weight-semibold)" }}>{workspaceTitle}</span>
              {!isSdtm && <SegmentedControl size="sm" value={activeTab} onChange={value => { setTab(value as PickerTab); if (value === "vlm") setVlmAnchor(""); }} options={([
                ["variables", "Variables"], ["vlm", "VLM"], ["codelist", "Codelist"],
              ] as const).map(([value, label]) => ({ value, label, disabled: !available[value], tooltip: !available[value] ? unavailableReason(value) : undefined }))} />}
            </div>
            <div className="border-b border-graphite-10 px-4 py-2 shrink-0">
              <SearchBar size="compact" className="max-w-sm" value={activeTab === "variables" ? search : activeTab === "vlm" ? vlmSearch : codelistSearch}
                placeholder={activeTab === "variables" ? "Search variable, label, derivation…" : activeTab === "vlm" ? "Search condition…" : "Search terms…"}
                onChange={value => { resetScroll(activeTab); if (activeTab === "variables") setSearch(value); else if (activeTab === "vlm") setVlmSearch(value); else { setCodelistSearch(value); setTermPage(0); } }} />
            </div>
            <div className="flex flex-1 min-h-0 overflow-hidden">
            {activeTab === "variables" && <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-auto [scrollbar-gutter:stable]">
              <table className={`w-full ${crossDataset ? "min-w-[1070px]" : "min-w-[990px]"} table-fixed border-collapse t-small text-text-primary`}>
                <colgroup><col className="w-10" />{crossDataset && <col className="w-20" />}<col className="w-24" /><col className="w-36" /><col className="w-14" /><col /><col className="w-16" /><col className="w-20" /><col className="w-24" /><col className="w-24" /><col className="w-32" /></colgroup>
                <thead className="sticky top-0 z-10 bg-bg-panel text-text-secondary font-normal text-left"><tr>
                  <th className="px-3 py-2 w-10"><Checkbox aria-label="Select all visible variables" checked={filteredVariables.length > 0 && filteredVariables.every(v => selected.includes(variableKey(v)))} indeterminate={filteredVariables.some(v => selected.includes(variableKey(v))) && !filteredVariables.every(v => selected.includes(variableKey(v)))} onChange={checked => {
                    const keys = filteredVariables.map(variableKey); setSelected(prev => checked ? [...new Set([...prev, ...keys])] : prev.filter(key => !keys.includes(key)));
                  }} /></th>
                  {crossDataset && <th className="px-2 py-2 font-medium">Dataset</th>}
                  {["Variable", "Label", "Type", "Derivation", "Length", "Format", "Core", "Origin", "VLM / Codelist"].map(label => <th key={label} className="px-2 py-2 font-normal whitespace-nowrap">{label}</th>)}
                </tr></thead>
                <tbody>{filteredVariables.map(v => {
                  const key = variableKey(v), checked = selected.includes(key);
                  return <tr key={key} data-variable-key={key} className={`border-b border-graphite-10 ${checked ? "bg-bg-panel" : "hover:bg-bg-panel"}`}>
                    <td className="px-3 py-2 align-top"><Checkbox aria-label={`Select ${key}`} checked={checked} onChange={() => toggleVariable(key)} /></td>
                    {crossDataset && <td className="px-2 py-2 align-top font-mono whitespace-nowrap">{v.datasetName}</td>}
                    <td className="px-2 py-2 align-top font-mono">{v.variable}</td>
                    <td className="px-2 py-2 align-top min-w-24">{v.label}</td>
                    <td className="px-2 py-2 align-top font-mono">{v.type || "—"}</td>
                    <td className="px-2 py-2 align-top min-w-32"><DerivationCell text={v.derivation} /></td>
                    <td className="px-2 py-2 align-top font-mono">{v.length || "—"}</td>
                    <td className="px-2 py-2 align-top font-mono">{v.displayFormat || "—"}</td>
                    <td className="px-2 py-2 align-top">{v.core || "—"}</td>
                    <td className="px-2 py-2 align-top">{v.origin || "—"}</td>
                    <td className="px-2 py-2 align-top"><div className="flex flex-wrap gap-1">
                      {variableHasVlm(v) && <PickerJumpButton onClick={event => { event.stopPropagation(); jump("vlm", v); }} label={`Open ${v.datasetName} VLM for ${v.variable}`}>VLM</PickerJumpButton>}
                      {variableStandard(v) === "ADaM" && codelistForVariable(v) && <PickerJumpButton onClick={event => { event.stopPropagation(); jump("codelist", v); }} label={`Open codelist for ${key}`}>Codelist</PickerJumpButton>}
                    </div></td>
                  </tr>;
                })}</tbody>
              </table>
              {!filteredVariables.length && <p className="t-small text-text-primary text-center p-8">{isShowingSelectedOnly && !selected.length ? "No variables selected yet" : "No matching variables found"}</p>}
            </div>}
            {activeTab === "vlm" && <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-auto">
              <table className="w-full border-collapse t-small text-text-primary text-left">
                <thead className="sticky top-0 bg-bg-panel text-text-secondary font-normal"><tr><th className="px-4 py-2 font-normal w-1/3">Condition</th><th className="px-4 py-2 font-normal">Definitions</th></tr></thead>
                <tbody>{matchingConditions.map(condition => <tr key={condition.key} className="border-b border-graphite-10">
                  <td className="p-4 align-top break-words"><div className="font-medium">{condition.identifier === "*DEFAULT*" ? "Default definition" : condition.identifier}</div><div className="font-mono whitespace-pre-wrap break-words">{condition.expression}</div></td>
                  <td className="p-4 align-top"><div className="flex flex-col gap-2">{[...condition.definitions].sort((a, b) => Number(b.variable === vlmAnchor) - Number(a.variable === vlmAnchor)).map((definition, index) => <div key={`${definition.variable}-${index}`} className={`rounded-sm p-2 ${definition.variable === vlmAnchor ? "bg-az-secondary" : ""}`}><div className="font-mono font-medium">{definition.variable}</div><div className="whitespace-pre-wrap break-words">{definition.text}</div></div>)}{!condition.definitions.length && "—"}</div></td>
                </tr>)}</tbody>
              </table>
              {!matchingConditions.length && <p className="t-small text-center p-8">No match.</p>}
            </div>}
            {activeTab === "codelist" && <div className="flex flex-1 min-w-0 min-h-0">
              <div className="w-48 shrink-0 border-r border-graphite-10 p-2 overflow-auto">
                {datasetCodelists.map(c => <button key={c.id} type="button" onClick={() => { setCodelistId(c.id); setCodelistSearch(""); setTermPage(0); resetScroll("codelist"); }} title={c.name} className={`flex min-h-7 w-full items-center text-left rounded-[4px] px-2 py-1 t-small break-words transition-colors ${currentCodelist?.id === c.id ? "bg-az-secondary text-brand-1" : "text-text-primary hover:bg-graphite-10"}`}>{c.name}</button>)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                {currentCodelist ? <>
                  <div className="px-4 py-2 border-b border-graphite-10 t-body-medium text-text-primary break-words" style={{ fontWeight: "var(--font-weight-semibold)" }}>{currentCodelist.name}</div>
                  <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto">
                    <table className="w-full border-collapse t-small text-text-primary text-left"><thead className="sticky top-0 bg-bg-panel text-text-secondary font-normal"><tr><th className="px-4 py-2 font-normal">Value</th><th className="px-4 py-2 font-normal">Label</th></tr></thead><tbody>
                      {terms.slice(page * 100, (page + 1) * 100).map((term, index) => <tr key={`${term.value}-${index}`} className="border-b border-graphite-10"><td className="px-4 py-2 align-top font-mono break-words">{term.value}</td><td className="px-4 py-2 break-words">{term.label}</td></tr>)}
                    </tbody></table>
                    {!terms.length && <p className="p-8 text-center t-small text-text-primary">{codelistSearch ? "No match." : "No terms available."}</p>}
                  </div>
                  {pageCount > 1 && <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-graphite-10 t-small text-text-primary"><Button variant="ghost" size="sm" disabled={page === 0} onClick={() => { setTermPage(page - 1); resetScroll("codelist"); }}>Previous</Button><span>Page {page + 1} of {pageCount}</span><Button variant="ghost" size="sm" disabled={page === pageCount - 1} onClick={() => { setTermPage(page + 1); resetScroll("codelist"); }}>Next</Button></div>}
                </> : <p className="p-8 text-center t-small text-text-primary">No codelists available.</p>}
              </div>
            </div>}
            </div>
          </div>
        </div>

        {/* ================= 4. Footer ================= */}
        <div className="flex shrink-0 items-center justify-between border-t border-graphite-10 px-[20px] py-[14px] bg-white">
          {/* Left: new datasets addition notice (if any) */}
          <div className="flex items-center">
            {newlyAddedDatasets.length > 0 && (
              <span
                className="t-small text-text-secondary flex items-center gap-[6px]"
                title={`${newlyAddedDatasets.join(", ")} will be appended to Source Dataset(s)`}
              >
                <span className="inline-flex size-[16px] items-center justify-center rounded-full bg-[#F4E8EE] text-[#830051] text-[11px] font-bold shrink-0">
                  i
                </span>
                <span>
                  <span className="text-text-primary font-medium">+{newlyAddedDatasets.length}</span>
                  {" "}dataset(s) will be added to Source Dataset(s)
                </span>
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
    </div>,
    document.body
  );
}

export default VariableSpecPicker;
