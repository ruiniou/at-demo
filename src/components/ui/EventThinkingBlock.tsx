import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export type EventScanItemType = "table" | "figure" | "listing" | "variable" | "macro" | "query";

export type EventCandidateTfl = {
  tflId?: string;
  name: string;
  reason?: string;
  type?: EventScanItemType;
  matchType?: "direct" | "suspected";
  isSuspicious?: boolean;
};

export type EventThinkingStep = {
  id: string;
  phase: "search" | "analysis" | "dependency";
  title?: string;
  subtitle?: string;
  content?: string;
  details?: EventCandidateTfl[];
};

export type EventThinkingData = {
  status: "thinking" | "completed";
  query?: string;
  scannedCount?: number;
  matchedCount?: number;
  durationSeconds?: number;
  steps?: EventThinkingStep[];
};

export interface EventThinkingBlockProps {
  data: EventThinkingData;
  onJumpToTfl?: (tflId: string) => void;
  className?: string;
}

/**
 * Format elapsed thinking time into concise units:
 * e.g. 4s, 45s, 3m, 3m12s, 1h2m
 */
export function formatDurationShort(seconds: number = 4): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remSec = seconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h${minutes}m` : `${hours}h`;
  }
  return remSec > 0 ? `${minutes}m${remSec}s` : `${minutes}m`;
}

const STAGES = [700, 900, 1400, 1800];

function useSequence(steps: number[], isRunning: boolean) {
  const [stage, setStage] = useState(isRunning ? 0 : steps.length);
  useEffect(() => {
    if (!isRunning) {
      setStage(steps.length);
      return;
    }
    if (stage >= steps.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), steps[stage] || 800);
    return () => clearTimeout(t);
  }, [stage, steps, isRunning]);
  return stage;
}

/**
 * Returns the appropriate icon based on the scanned item's type:
 * - Table TFL: Table Icon (Table.svg)
 * - Figure TFL: Figure Icon (Figure.svg)
 * - Listing TFL: Listing Icon (Listing.svg)
 * - Global attributes (Macro, Variable, Parameter): Search Icon
 */
function getScanItemIcon(item: EventCandidateTfl) {
  const type = item.type?.toLowerCase() || "";
  const name = item.name.toLowerCase();

  // Figure TFL
  if (type === "figure" || name.startsWith("figure ") || name.startsWith("fig ")) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0 text-text-secondary"
      >
        <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM7 13H9V17H7V13ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z" />
      </svg>
    );
  }

  // Listing TFL
  if (type === "listing" || name.startsWith("listing ") || name.startsWith("lst ")) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0 text-text-secondary"
      >
        <path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" />
      </svg>
    );
  }

  // Global attributes: Variable, Macro, Query
  if (
    type === "variable" ||
    type === "macro" ||
    name.startsWith("variable") ||
    name.startsWith("macro") ||
    name.startsWith("var ")
  ) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="shrink-0 text-text-secondary"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    );
  }

  // Default: Table TFL icon
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-text-secondary"
    >
      <path d="M4 8H20V5H4V8ZM14 19V10H10V19H14ZM16 19H20V10H16V19ZM8 19V10H4V19H8ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" />
    </svg>
  );
}

/**
 * EventThinkingBlock component — Parallel Expandable Agent Traces:
 *
 * 1. Searching Bar (Collapsible Bar 1):
 *    - Search Icon in header
 *    - Shimmer text while searching, settled count on completion
 *    - Candidate TFL search rows with TFL/Search icon (Table, Figure, Listing, or Search icon for Variable/Macro)
 *    - Non-interactive informative rows (no hover state, no jump, no special state tags)
 *    - Max-height bounded (~210px) with vertical scrolling; no horizontal scrolling
 *
 * 2. Reasoning Bar (Collapsible Bar 2, PARALLEL to Searching):
 *    - Sparkle Icon in header
 *    - Shimmer text while reasoning, settled on completion
 *    - Context reasoning and Dependency verification as clean text rows
 *    - Max-height bounded (~210px) with vertical scrolling; no horizontal scrolling
 */
export function EventThinkingBlock({
  data,
  className = "",
}: EventThinkingBlockProps) {
  const isRunning = data.status === "thinking";
  const stage = useSequence(STAGES, isRunning);

  const scannedCount = data.scannedCount || 42;
  const matchedCount = data.matchedCount || 14;
  const queryText = data.query || "Candidate TFLs referencing TRTA";

  // Searching Bar state
  const isSearchingWorking = isRunning && stage < 2;
  const [manualSearchExpanded, setManualSearchExpanded] = useState<boolean | null>(null);
  const searchAutoExpanded = isSearchingWorking;
  const searchExpanded = manualSearchExpanded ?? searchAutoExpanded;

  // Reasoning Bar state (parallel to Searching)
  const isReasoningWorking = isRunning && stage >= 2 && stage < STAGES.length;
  const [manualReasoningExpanded, setManualReasoningExpanded] = useState<boolean | null>(null);
  const reasoningAutoExpanded = isReasoningWorking;
  const reasoningExpanded = manualReasoningExpanded ?? reasoningAutoExpanded;

  const searchTraceRef = useRef<HTMLDivElement>(null);
  const reasoningTraceRef = useRef<HTMLDivElement>(null);

  // Ultra-long candidate TFL search rows (14 TFL items) to demonstrate 6.5-row max-height & gradient shadow masks
  const searchDetails = data.steps?.find((s) => s.phase === "search")?.details;
  const searchRows: EventCandidateTfl[] =
    searchDetails && searchDetails.length > 0
      ? searchDetails
      : [
          { tflId: "t1", name: "14.1.1 Disposition", type: "table" },
          { tflId: "t4", name: "14.1.4 Demographics (Full Analysis Set)", type: "table" },
          { tflId: "t5", name: "14.1.5 Baseline Characteristics", type: "table" },
          { tflId: "t8", name: "14.1.8 Medical History by SOC", type: "table" },
          { tflId: "t9", name: "14.2.1 Primary Efficacy Endpoint (ITT)", type: "table" },
          { tflId: "t10", name: "14.2.2 Secondary Efficacy Endpoint by Visit", type: "table" },
          { tflId: "f1", name: "Figure 14.2.4 Kaplan-Meier Overall Survival", type: "figure" },
          { tflId: "t12", name: "14.3.1 Summary of Adverse Events", type: "table" },
          { tflId: "t13", name: "14.3.2 Serious Adverse Events by System Organ Class", type: "table" },
          { tflId: "t14", name: "14.3.5 Treatment-Emergent Adverse Events by PT", type: "table" },
          { tflId: "f2", name: "Figure 14.3.6 Forest Plot of Hazard Ratios", type: "figure" },
          { tflId: "t16", name: "14.4.1 Vital Signs Mean Change from Baseline", type: "table" },
          { tflId: "t17", name: "14.4.3 Clinical Chemistry Panel Summary", type: "table" },
          { tflId: "l1", name: "Listing 16.2.4 Subjects Discontinued Due to AE", type: "listing" },
        ];

  // Ultra-long multi-paragraph clinical reasoning to demonstrate max-height and gradient shadow masks
  const defaultReasoningRows = [
    {
      primary:
        "Evaluating fuzzy matches across 14 candidate TFLs: Table 14.1.8 detected TRTA in historical merge step, but output column is locked to SOC code. Flagged as 'Suspected' and added to candidate Scope for user review rather than direct exclusion. Remaining candidate tables have direct variable dependencies on treatment arm definitions.",
    },
    {
      primary:
        "Dependency check: Verified that variable replacement from ARM to TRTA does not affect unhit safety and efficacy macros (%COMP_SUMMARY, %SURV_PLOT). Dependency closure is confirmed intact across all 14 tables.",
    },
    {
      primary:
        "Cross-domain lineage audit: Scanned ADSL demographic strata against downstream ADAE (adverse events) and ADLB (laboratory) datasets. Re-derivation of treatment emergent flags required for FAS and Safety populations.",
    },
    {
      primary:
        "Macro parameter boundary verification: Confirmed that study macro %TFL_HEADER respects dynamic variable bindings and does not contain hardcoded treatment column definitions.",
    },
  ];

  const reasoningRows = data.steps?.filter((s) => s.phase === "analysis" || s.phase === "dependency").length
    ? data.steps
        .filter((s) => s.phase === "analysis" || s.phase === "dependency")
        .map((s) => ({ primary: s.content || s.title || "" }))
    : defaultReasoningRows;

  // Scroll shadow affordance detection for Searching Trace
  const [searchCanScrollTop, setSearchCanScrollTop] = useState(false);
  const [searchCanScrollBottom, setSearchCanScrollBottom] = useState(false);

  const checkSearchScroll = () => {
    const el = searchTraceRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    setSearchCanScrollTop(el.scrollTop > 2);
    setSearchCanScrollBottom(hasOverflow && el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  };

  useEffect(() => {
    checkSearchScroll();
    const el = searchTraceRef.current;
    let ro: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => checkSearchScroll());
      ro.observe(el);
    }
    const t1 = setTimeout(checkSearchScroll, 100);
    const t2 = setTimeout(checkSearchScroll, 250);
    const t3 = setTimeout(checkSearchScroll, 450);
    return () => {
      ro?.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [searchExpanded, searchRows.length]);

  // Scroll shadow affordance detection for Reasoning Trace
  const [reasoningCanScrollTop, setReasoningCanScrollTop] = useState(false);
  const [reasoningCanScrollBottom, setReasoningCanScrollBottom] = useState(false);

  const checkReasoningScroll = () => {
    const el = reasoningTraceRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    setReasoningCanScrollTop(el.scrollTop > 2);
    setReasoningCanScrollBottom(hasOverflow && el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  };

  useEffect(() => {
    checkReasoningScroll();
    const el = reasoningTraceRef.current;
    let ro: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => checkReasoningScroll());
      ro.observe(el);
    }
    const t1 = setTimeout(checkReasoningScroll, 100);
    const t2 = setTimeout(checkReasoningScroll, 250);
    const t3 = setTimeout(checkReasoningScroll, 450);
    return () => {
      ro?.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reasoningExpanded, reasoningRows.length]);

  return (
    <div className={`flex w-full max-w-full flex-col gap-3 select-none my-1 overflow-x-hidden ${className}`}>
      {/* ============================================================ */}
      {/* 1. SEARCHING BAR (Collapsible Bar 1) */}
      {/* ============================================================ */}
      <div className="flex w-full max-w-full flex-col">
        {/* Header Button 1: mx-0 px-2 py-1 to ensure NO left truncation */}
        <button
          type="button"
          aria-expanded={searchExpanded}
          onClick={() => setManualSearchExpanded((curr) => !(curr ?? searchAutoExpanded))}
          className="group flex w-fit max-w-full items-center gap-2 rounded-[6px] px-2 py-1 text-text-secondary hover:text-text-primary transition-colors duration-150 hover:bg-black/[0.04] active:scale-[0.99] cursor-pointer"
        >
          {/* Search Icon: standardized to 14x14 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-colors duration-150 ${
              isSearchingWorking ? "text-brand-1" : "text-text-secondary group-hover:text-text-primary"
            }`}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>

          {/* Shimmer label while searching, settled text when done */}
          {isSearchingWorking ? (
            <span
              className="bg-clip-text text-[13px] font-medium whitespace-nowrap text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-text-secondary, #8C8F8F) 35%, var(--color-text-primary, #3F4444) 50%, var(--color-text-secondary, #8C8F8F) 65%)",
                backgroundSize: "200% 100%",
                animation: "shimmer-text 1.4s linear infinite",
              }}
            >
              Searching candidate TFLs…
            </span>
          ) : (
            <span
              className="text-[13px] font-medium whitespace-nowrap text-text-secondary group-hover:text-text-primary transition-colors duration-150"
              style={{ animation: "fadeIn 350ms ease-out both" }}
            >
              {`Searched ${scannedCount} TFLs · ${matchedCount} candidates matched`}
            </span>
          )}

          {/* Rotating Chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary group-hover:text-text-primary transition-colors duration-150 shrink-0"
            style={{ transform: searchExpanded ? "rotate(180deg)" : "rotate(0)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Searching Expandable Trace */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-400 w-full max-w-full overflow-hidden"
          style={{
            gridTemplateRows: searchExpanded ? "1fr" : "0fr",
            opacity: searchExpanded ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div className="overflow-hidden w-full max-w-full min-h-0">
            {/* Scroll wrapper with Top & Bottom gradient shadows (scroll affordance mask) */}
            <div className="relative w-full max-w-full overflow-hidden min-h-0">
              {/* Top gradient shadow mask */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 left-0 right-[8px] h-[12px] bg-gradient-to-b from-bg-panel via-bg-panel/80 to-transparent z-10 transition-opacity duration-200 ${
                  searchCanScrollTop ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Scrollable trace items: max-h-[165px] accommodates 6.5 items with the 7th item peeking through */}
              <div
                ref={searchTraceRef}
                onScroll={checkSearchScroll}
                className="flex flex-col gap-0.5 pt-1 pb-1.5 w-full max-w-full max-h-[165px] overflow-y-auto overflow-x-hidden scrollbar-trace min-h-0"
                style={{ maxHeight: 165 }}
              >
                {/* Search Query row: px-2 matches header button left offset, h-[22px] provides compact rhythm */}
                {queryText && (
                  <div
                    className="flex h-[22px] items-center gap-2 px-2 shrink-0 w-full max-w-full"
                    style={{
                      animation: searchExpanded
                        ? "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both"
                        : undefined,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-text-secondary shrink-0"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                    <span className="text-[13px] text-text-secondary truncate">
                      {queryText}
                    </span>
                  </div>
                )}

                {/* Candidate TFL Search rows: single clean container, full width, left-aligned, no 1... glitch */}
                {searchRows.map((row, i) => (
                  <div
                    key={row.tflId || row.name || i}
                    className="flex h-[22px] shrink-0 w-full max-w-full items-center gap-2 px-2 text-left"
                    style={{
                      animation: `fade-up 320ms cubic-bezier(0.23,1,0.32,1) ${i * 40}ms both`,
                    }}
                  >
                    {getScanItemIcon(row)}
                    <span className="min-w-0 truncate text-[13px] font-normal text-text-secondary">
                      {row.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom gradient shadow mask */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 left-0 right-[8px] h-[18px] bg-gradient-to-t from-bg-panel via-bg-panel/80 to-transparent z-10 transition-opacity duration-200 ${
                  searchCanScrollBottom ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. REASONING BAR (Collapsible Bar 2, Parallel to Searching) */}
      {/* ============================================================ */}
      <div className="flex w-full max-w-full flex-col">
        {/* Header Button 2: mx-0 px-2 py-1 to ensure NO left truncation */}
        <button
          type="button"
          aria-expanded={reasoningExpanded}
          onClick={() => setManualReasoningExpanded((curr) => !(curr ?? reasoningAutoExpanded))}
          className="group flex w-fit max-w-full items-center gap-2 rounded-[6px] px-2 py-1 text-text-secondary hover:text-text-primary transition-colors duration-150 hover:bg-black/[0.04] active:scale-[0.99] cursor-pointer"
        >
          {/* Sparkle / Reasoning Icon: standardized to 14x14 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`shrink-0 transition-colors duration-150 ${
              isReasoningWorking ? "text-brand-1" : "text-text-secondary group-hover:text-text-primary"
            }`}
          >
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>

          {/* Shimmer label while reasoning, settled text when done */}
          {isReasoningWorking ? (
            <span
              className="bg-clip-text text-[13px] font-medium whitespace-nowrap text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-text-secondary, #8C8F8F) 35%, var(--color-text-primary, #3F4444) 50%, var(--color-text-secondary, #8C8F8F) 65%)",
                backgroundSize: "200% 100%",
                animation: "shimmer-text 1.4s linear infinite",
              }}
            >
              Thinking…
            </span>
          ) : (
            <span
              className="text-[13px] font-medium whitespace-nowrap text-text-secondary group-hover:text-text-primary transition-colors duration-150"
              style={{ animation: "fadeIn 350ms ease-out both" }}
            >
              {`Thought for ${formatDurationShort(data.durationSeconds ?? 4)}`}
            </span>
          )}

          {/* Rotating Chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary group-hover:text-text-primary transition-colors duration-150 shrink-0"
            style={{ transform: reasoningExpanded ? "rotate(180deg)" : "rotate(0)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Reasoning Expandable Trace */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-400 w-full max-w-full overflow-hidden"
          style={{
            gridTemplateRows: reasoningExpanded ? "1fr" : "0fr",
            opacity: reasoningExpanded ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div className="overflow-hidden w-full max-w-full min-h-0">
            {/* Scroll wrapper with Top & Bottom gradient shadows (scroll affordance mask) */}
            <div className="relative w-full max-w-full overflow-hidden min-h-0">
              {/* Top gradient shadow mask */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 left-0 right-[8px] h-[12px] bg-gradient-to-b from-bg-panel via-bg-panel/80 to-transparent z-10 transition-opacity duration-200 ${
                  reasoningCanScrollTop ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Scrollable trace items: max-h-[170px] accommodates multi-paragraph reasoning */}
              <div
                ref={reasoningTraceRef}
                onScroll={checkReasoningScroll}
                className="flex flex-col gap-2 pt-1 pb-1.5 w-full max-w-full max-h-[170px] overflow-y-auto overflow-x-hidden scrollbar-trace min-h-0"
                style={{ maxHeight: 170 }}
              >
                {reasoningRows.map((row, i) => (
                  <div
                    key={i}
                    className="flex shrink-0 w-full max-w-full px-2 text-left"
                    style={{
                      animation: `fade-up 320ms cubic-bezier(0.23,1,0.32,1) ${i * 60}ms both`,
                    }}
                  >
                    <p className="min-w-0 text-[13px] leading-[19px] whitespace-normal break-words text-text-secondary font-normal m-0">
                      {row.primary}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom gradient shadow mask */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 left-0 right-[8px] h-[18px] bg-gradient-to-t from-bg-panel via-bg-panel/80 to-transparent z-10 transition-opacity duration-200 ${
                  reasoningCanScrollBottom ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventThinkingBlock;



