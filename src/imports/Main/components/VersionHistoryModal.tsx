import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FilterChip } from "../../../components/ui/FilterChip";
import { Avatar } from "../../../components/ui/Avatar";
import { Tag } from "../../../components/ui/Tag";
import { Tooltip } from "../../../components/ui/Tooltip";
import { ScrollArea } from "../../../components/ui/ScrollArea";
import arrowLeftUrl from "../../../icons/arrow-left-s-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import restoreIconUrl from "../../../icons/reset-left-line.svg";
import {
  CodeVersion,
  SplitRow,
  countChanges,
  totalCodeChange,
  diffLines,
  sourceText,
  toSplitRows,
  versionLabel,
} from "./versionHistoryData";

/* Diff row tints mirror the Copilot "Edited code" card (AI-CodeDiff) so both diffs read the same way. */
const DEL_ROW = "border-l-[3px] border-brand-1 bg-[#FDECEA]";
const ADD_ROW = "border-l-[3px] border-code-success bg-[#E6F4EA]";
const CONTEXT_LINES = 3;
/* Every column is left-aligned; Version carries its time as a second line. Action keeps two fixed slots so links and buttons line up across rows. */
const LIST_COLUMNS = "grid-cols-[152px_152px_minmax(0,1fr)_104px_176px_156px]";

function MaskIcon({ src, size = 16, className = "bg-text-secondary" }: { src: string; size?: number; className?: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size, mask, WebkitMask: mask }} />;
}

function ChangeCounts({ added, removed, className = "t-body-compact" }: { added: number; removed: number; className?: string }) {
  return (
    <span className={`flex gap-[8px] tabular-nums ${className}`}>
      <span className="text-code-success">+{added}</span>
      <span className="text-status-error">−{removed}</span>
    </span>
  );
}

export interface VersionHistoryModalProps {
  isOpen: boolean;
  /** e.g. "Table 14.1.4" */
  outputName: string;
  /** Oldest first. The last item is the Current version. */
  versions: CodeVersion[];
  /** Why Restore is unavailable right now (Locked, Copilot running, no edit permission). null = available. */
  restoreBlockedReason: string | null;
  /** Another dialog (the Restore confirmation) is on top, so Escape must not close this one. */
  keysSuspended?: boolean;
  /** Copilot entry-point icon (same mark as the Copilot button), shown for versions written by Copilot. */
  copilotIcon: React.ReactNode;
  onClose: () => void;
  onRestore: (version: CodeVersion) => void;
}

export default function VersionHistoryModal({
  isOpen,
  outputName,
  versions,
  restoreBlockedReason,
  keysSuspended = false,
  copilotIcon,
  onClose,
  onRestore,
}: VersionHistoryModalProps) {
  const [view, setView] = useState<"list" | "diff">("list");
  const [pair, setPair] = useState<{ base: number; target: number } | null>(null);

  const current = versions[versions.length - 1];
  const byNumber = useMemo(() => new Map(versions.map((version) => [version.number, version])), [versions]);

  useEffect(() => {
    if (!isOpen) return;
    setView("list");
    setPair(null);
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !keysSuspended) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, keysSuspended, onClose]);


  /* Row stats are always "this version vs its previous version". */
  const rowStats = useMemo(() => {
    const stats = new Map<number, { added: number; removed: number }>();
    versions.forEach((version, index) => {
      stats.set(version.number, totalCodeChange(versions[index - 1]?.code ?? "", version.code));
    });
    return stats;
  }, [versions]);

  /* Computed here so the header counts and the code columns come from the same diff. */
  const diff = useMemo(() => {
    if (!pair) return null;
    const base = byNumber.get(pair.base);
    const target = byNumber.get(pair.target);
    if (!base || !target) return null;
    const entries = diffLines(base.code, target.code);
    return { rows: toSplitRows(entries), ...countChanges(entries) };
  }, [pair, byNumber]);

  if (!isOpen || !current) return null;

  const openDiff = (version: CodeVersion) => {
    const index = versions.findIndex((item) => item.number === version.number);
    const previous = versions[index - 1];
    if (!previous) return;
    setPair({ base: previous.number, target: version.number });
    setView("diff");
  };

  const isDiff = view === "diff" && pair !== null && diff !== null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      <button type="button" className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-label="Close version history" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="version-history-title"
        className={`relative flex max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-elevation-modal ${
          isDiff ? "h-[min(820px,calc(100vh-32px))] w-[1200px]" : "max-h-[calc(100vh-32px)] w-[1200px]"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-[12px] border-b border-graphite-10 px-[24px] py-[14px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            {isDiff && (
              <Tooltip label="Back to Version History">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="Back to Version History"
                  className="flex size-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                >
                  <MaskIcon src={arrowLeftUrl} />
                </button>
              </Tooltip>
            )}
            {isDiff ? (
              <div className="flex min-w-0 items-center gap-[12px]">
                <h2 id="version-history-title" className="t-heading truncate text-text-primary">{outputName}</h2>
                <ChangeCounts added={diff.added} removed={diff.removed} />
              </div>
            ) : (
              <div className="min-w-0">
                <h2 id="version-history-title" className="t-heading text-text-primary">Version History</h2>
                <p className="t-small truncate text-text-secondary">{outputName}</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="size-[16px] opacity-70" />
          </button>
        </div>

        {isDiff ? (
          <DiffView
            versions={versions}
            byNumber={byNumber}
            current={current}
            pair={pair}
            rows={diff.rows}
            restoreBlockedReason={restoreBlockedReason}
            onPairChange={setPair}
            onRestore={onRestore}
          />
        ) : (
          <ListView
            versions={versions}
            current={current}
            rowStats={rowStats}
            copilotIcon={copilotIcon}
            restoreBlockedReason={restoreBlockedReason}
            onOpenDiff={openDiff}
            onRestore={onRestore}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* List                                                                */
/* ------------------------------------------------------------------ */

function OperatorCell({ version, copilotIcon }: { version: CodeVersion; copilotIcon: React.ReactNode }) {
  if (!version.operator.viaCopilot) {
    return (
      <div className="flex min-w-0 items-center gap-[8px]">
        <Avatar name={version.operator.name} level="modal" />
        <span className="t-caption truncate text-text-primary">{version.operator.name}</span>
      </div>
    );
  }
  const label = (
    <div className="flex min-w-0 items-center gap-[8px]">
      {copilotIcon}
      <span className="t-caption truncate text-text-primary">Copilot</span>
    </div>
  );
  return version.operator.triggeredBy ? <Tooltip label={`Triggered by ${version.operator.triggeredBy}`}>{label}</Tooltip> : label;
}

function ListView({
  versions,
  current,
  rowStats,
  copilotIcon,
  restoreBlockedReason,
  onOpenDiff,
  onRestore,
}: {
  versions: CodeVersion[];
  current: CodeVersion;
  rowStats: Map<number, { added: number; removed: number }>;
  copilotIcon: React.ReactNode;
  restoreBlockedReason: string | null;
  onOpenDiff: (version: CodeVersion) => void;
  onRestore: (version: CodeVersion) => void;
}) {
  const rows = [...versions].reverse();
  const headerCell = "t-small text-text-secondary";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {restoreBlockedReason && (
        <div className="flex shrink-0 items-center gap-[8px] border-b border-status-warning-bg bg-status-warning-bg/40 px-[24px] py-[6px]" role="status">
          <span className="flex size-[20px] shrink-0 items-center justify-center rounded-[4px] bg-status-warning-bg">
            <MaskIcon src={lockIconUrl} size={13} className="bg-status-warning-icon" />
          </span>
          <p className="t-small text-text-primary">{restoreBlockedReason}</p>
        </div>
      )}
      <div className="shrink-0 border-b border-graphite-10 bg-bg-panel">
        <div className={`grid ${LIST_COLUMNS} items-center gap-x-[16px] px-[24px] py-[8px]`}>
          <span className={headerCell}>Version</span>
          <span className={headerCell}>Source</span>
          <span className={headerCell}>Summary</span>
          <span className={headerCell}>Changes</span>
          <span className={headerCell}>Operator</span>
          <span className={headerCell}>Action</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {rows.map((version, index) => {
          const isCurrent = version.number === current.number;
          const hasPrevious = version.number > versions[0].number;
          const stat = rowStats.get(version.number)!;
          const restoreButton = (
            <Button
              variant="secondary"
              size="sm"
              disabled={restoreBlockedReason !== null}
              onClick={(event) => {
                event.stopPropagation();
                onRestore(version);
              }}
              aria-label={`Restore ${versionLabel(version)}`}
            >
              <MaskIcon src={restoreIconUrl} size={14} className="bg-current" />
              Restore
            </Button>
          );
          return (
            <div
              key={version.number}
              role={hasPrevious ? "button" : undefined}
              tabIndex={hasPrevious ? 0 : undefined}
              aria-label={hasPrevious ? `View diff of ${versionLabel(version)} against the previous version` : undefined}
              onClick={hasPrevious ? () => onOpenDiff(version) : undefined}
              onKeyDown={
                hasPrevious
                  ? (event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenDiff(version);
                      }
                    }
                  : undefined
              }
              className={`grid ${LIST_COLUMNS} min-h-[56px] items-center py-[8px] gap-x-[16px] px-[24px] ${
                index < rows.length - 1 ? "border-b border-graphite-10" : ""
              } ${hasPrevious ? "cursor-pointer hover:bg-bg-panel focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-brand-1" : ""}`}
            >
              <div className="flex min-w-0 flex-col gap-[2px]">
                <div className="flex items-center gap-[6px]">
                  <span className="t-body-medium text-text-primary">{versionLabel(version)}</span>
                  {isCurrent && <Tag variant="brand">Current</Tag>}
                </div>
                <span className="t-small tabular-nums text-text-secondary">{version.createdAt}</span>
              </div>

              <div className="flex min-w-0 items-center">
                <Tag>{sourceText(version)}</Tag>
              </div>

              <span className="t-caption truncate text-text-primary" title={version.summary}>{version.summary}</span>

              <ChangeCounts added={stat.added} removed={stat.removed} className="t-caption" />

              <OperatorCell version={version} copilotIcon={copilotIcon} />

              <div className="flex items-center gap-[12px]">
                <span className="w-[56px]">
                  {hasPrevious && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenDiff(version);
                      }}
                      className="t-small whitespace-nowrap text-brand-1 hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1"
                    >
                      View Diff
                    </button>
                  )}
                </span>
                <span className="inline-flex w-[80px]">
                  {!isCurrent &&
                    (restoreBlockedReason ? (
                      <Tooltip label={restoreBlockedReason}>
                        <span className="inline-flex">{restoreButton}</span>
                      </Tooltip>
                    ) : (
                      restoreButton
                    ))}
                </span>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diff                                                                */
/* ------------------------------------------------------------------ */

/* Two code columns, nothing else: each column header owns its version picker and, for a non-Current version, its Restore. */
function DiffView({
  versions,
  byNumber,
  current,
  pair,
  rows,
  restoreBlockedReason,
  onPairChange,
  onRestore,
}: {
  versions: CodeVersion[];
  byNumber: Map<number, CodeVersion>;
  current: CodeVersion;
  pair: { base: number; target: number };
  rows: SplitRow[];
  restoreBlockedReason: string | null;
  onPairChange: (pair: { base: number; target: number }) => void;
  onRestore: (version: CodeVersion) => void;
}) {
  const base = byNumber.get(pair.base)!;
  const target = byNumber.get(pair.target)!;

  /* Left is always the older version: picking a side that crosses the other one swaps them. */
  const changeBase = (value: string) => {
    const next = Number(value);
    if (next === pair.target) return;
    onPairChange(next < pair.target ? { base: next, target: pair.target } : { base: pair.target, target: next });
  };
  const changeTarget = (value: string) => {
    const next = Number(value);
    if (next === pair.base) return;
    onPairChange(next > pair.base ? { base: pair.base, target: next } : { base: next, target: pair.base });
  };

  const columnHeader = (version: CodeVersion, other: CodeVersion, onChange: (value: string) => void, side: "left" | "right") => {
    const isCurrent = version.number === current.number;
    const restoreButton = (
      <Button
        variant="secondary"
        size="sm"
        disabled={restoreBlockedReason !== null}
        onClick={() => onRestore(version)}
        aria-label={`Restore ${versionLabel(version)}`}
      >
        <MaskIcon src={restoreIconUrl} size={14} className="bg-current" />
        Restore
      </Button>
    );
    return (
      <div className={`flex min-w-0 items-center gap-[8px] px-[16px] py-[8px] ${side === "right" ? "border-l border-graphite-10" : ""}`}>
        {/* The other column's version is left out: a version is never compared with itself. */}
        <FilterChip
          type="Dropdown"
          variant="select"
          showIcon={false}
          className="shrink-0"
          aria-label={side === "left" ? "Base version" : "Compared version"}
          options={[...versions]
            .reverse()
            .filter((item) => item.number !== other.number)
            .map((item) => ({
              value: String(item.number),
              label: versionLabel(item),
              suffix: item.number === current.number ? "(Current)" : undefined,
            }))}
          value={String(version.number)}
          onChange={onChange}
        />
        <span className="t-small truncate tabular-nums text-text-secondary">{version.createdAt}</span>
        {!isCurrent && (
          <span className="ml-auto inline-flex shrink-0">
            {restoreBlockedReason ? (
              <Tooltip label={restoreBlockedReason}>
                <span className="inline-flex">{restoreButton}</span>
              </Tooltip>
            ) : (
              restoreButton
            )}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-graphite-10 bg-bg-panel">
        <div className="grid grid-cols-2">
          {columnHeader(base, target, changeBase, "left")}
          {columnHeader(target, base, changeTarget, "right")}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <CodeColumns key={`${pair.base}-${pair.target}`} base={base} target={target} rows={rows} />
      </ScrollArea>
    </div>
  );
}

type FoldItem = { type: "rows"; start: number; rows: SplitRow[] } | { type: "fold"; id: string; rows: SplitRow[] };

/** Keeps CONTEXT_LINES around every change and folds longer unchanged runs. */
function foldRows(rows: SplitRow[], expanded: Set<string>): FoldItem[] {
  const keep = rows.map(() => false);
  rows.forEach((row, index) => {
    if (!row.changed) return;
    for (let k = Math.max(0, index - CONTEXT_LINES); k <= Math.min(rows.length - 1, index + CONTEXT_LINES); k++) keep[k] = true;
  });
  const items: FoldItem[] = [];
  let index = 0;
  while (index < rows.length) {
    const start = index;
    const kept = keep[index];
    while (index < rows.length && keep[index] === kept) index++;
    const slice = rows.slice(start, index);
    const id = String(start);
    if (kept || slice.length < 4 || expanded.has(id)) items.push({ type: "rows", start, rows: slice });
    else items.push({ type: "fold", id, rows: slice });
  }
  return items;
}

function Cell({ line, side }: { line: SplitRow["left"] | SplitRow["right"]; side: "left" | "right" }) {
  const divider = side === "right" ? "border-l border-graphite-10" : "";
  if (!line) return <div className={`bg-bg-panel ${divider}`} aria-hidden="true" />;
  const tint = line.op === "del" ? DEL_ROW : line.op === "add" ? ADD_ROW : "border-l-[3px] border-transparent";
  return (
    <div className={divider}>
      <div className={`flex h-full min-w-0 gap-[12px] pl-[13px] pr-[16px] leading-[20px] ${tint}`}>
        <span className="w-[32px] shrink-0 select-none text-right tabular-nums text-text-secondary">{line.no}</span>
        <code className="min-w-0 flex-1 whitespace-pre-wrap break-all text-text-primary">{line.text === "" ? " " : line.text}</code>
      </div>
    </div>
  );
}

function CodeColumns({ base, target, rows }: { base: CodeVersion; target: CodeVersion; rows: SplitRow[] }) {
  const [expandedFolds, setExpandedFolds] = useState<Set<string>>(new Set());

  if (!rows.some((row) => row.changed)) {
    return (
      <p className="px-[24px] py-[24px] t-body-compact text-text-secondary">
        {versionLabel(base)} and {versionLabel(target)} have the same code.
      </p>
    );
  }

  return (
    <div className="font-mono t-code">
      {foldRows(rows, expandedFolds).map((item) =>
        item.type === "fold" ? (
          <button
            key={`fold-${item.id}`}
            type="button"
            onClick={() => setExpandedFolds((previous) => new Set(previous).add(item.id))}
            className="flex h-[28px] w-full items-center justify-center border-y border-graphite-10 bg-bg-panel font-sans t-small text-text-secondary hover:bg-graphite-10 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-brand-1"
          >
            Show {item.rows.length} unchanged lines
          </button>
        ) : (
          item.rows.map((row, offset) => (
            <div key={item.start + offset} className="grid grid-cols-2">
              <Cell line={row.left} side="left" />
              <Cell line={row.right} side="right" />
            </div>
          ))
        ),
      )}
    </div>
  );
}
