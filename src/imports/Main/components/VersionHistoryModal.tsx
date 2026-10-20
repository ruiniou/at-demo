import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { SingleSelect } from "../../../components/ui/SingleSelect";
import { Avatar } from "../../../components/ui/Avatar";
import { Tag } from "../../../components/ui/Tag";
import { Tooltip } from "../../../components/ui/Tooltip";
import arrowDownUrl from "../../../icons/arrow-down-s-line.svg";
import arrowLeftUrl from "../../../icons/arrow-left-s-line.svg";
import arrowRightUrl from "../../../icons/arrow-right-s-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import {
  CodeVersion,
  SEGMENT_LABEL,
  SegmentDiff,
  SplitRow,
  diffPrograms,
  sourceText,
  totalCodeChange,
  versionLabel,
} from "./versionHistoryData";

/* Diff row tints mirror the Copilot "Edited code" card (AI-CodeDiff) so both diffs read the same way. */
const DEL_ROW = "border-l-[3px] border-brand-1 bg-[#FDECEA]";
const ADD_ROW = "border-l-[3px] border-code-success bg-[#E6F4EA]";
const CONTEXT_LINES = 3;
/* One row = one line. Every column is left-aligned; Action keeps two fixed slots so links and buttons line up across rows. */
const LIST_COLUMNS = "grid-cols-[88px_168px_minmax(0,1fr)_104px_176px_136px_140px]";

function MaskIcon({ src, size = 16, className = "bg-text-secondary" }: { src: string; size?: number; className?: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size, mask, WebkitMask: mask }} />;
}

function ChangeCounts({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="flex gap-[8px] t-body-compact tabular-nums">
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
  /** Current version is Locked — shown as a lock icon next to "Current". */
  isCurrentLocked?: boolean;
  /** Another dialog (the Restore confirmation) is on top, so Escape must not close this one. */
  keysSuspended?: boolean;
  /** Copilot entry-point icon (same mark as the Copilot button), shown for versions written by Copilot. */
  copilotIcon: React.ReactNode;
  /** Opens the Diff view for a specific pair (older → newer), e.g. from the Restore confirmation. */
  diffRequest?: { id: number; base: number; target: number } | null;
  onClose: () => void;
  onRestore: (version: CodeVersion) => void;
}

export default function VersionHistoryModal({
  isOpen,
  outputName,
  versions,
  restoreBlockedReason,
  isCurrentLocked = false,
  keysSuspended = false,
  diffRequest = null,
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
    if (!isOpen || !diffRequest) return;
    const base = byNumber.get(diffRequest.base);
    const target = byNumber.get(diffRequest.target);
    if (!base || !target) return;
    setPair({ base: base.number, target: target.number });
    setView("diff");
  }, [diffRequest?.id]);

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
      const previous = versions[index - 1];
      if (!previous) {
        stats.set(version.number, totalCodeChange("", version.code));
        return;
      }
      stats.set(version.number, totalCodeChange(previous.code, version.code));
    });
    return stats;
  }, [versions]);

  if (!isOpen || !current) return null;

  const openDiff = (version: CodeVersion) => {
    const index = versions.findIndex((item) => item.number === version.number);
    const previous = versions[index - 1];
    if (!previous) return;
    setPair({ base: previous.number, target: version.number });
    setView("diff");
  };

  const isDiff = view === "diff" && pair !== null;

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
            <div className="min-w-0">
              <h2 id="version-history-title" className="t-heading text-text-primary">Version History</h2>
              <p className="t-small truncate text-text-secondary">{outputName} · Code</p>
            </div>
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
            pair={pair}
            onPairChange={setPair}
          />
        ) : (
          <ListView
            versions={versions}
            current={current}
            rowStats={rowStats}
            copilotIcon={copilotIcon}
            isCurrentLocked={isCurrentLocked}
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
        <span className="t-body-compact truncate text-text-primary">{version.operator.name}</span>
      </div>
    );
  }
  const label = (
    <div className="flex min-w-0 items-center gap-[8px]">
      {copilotIcon}
      <span className="t-body-compact truncate text-text-primary">Copilot</span>
    </div>
  );
  return version.operator.triggeredBy ? <Tooltip label={`Triggered by ${version.operator.triggeredBy}`}>{label}</Tooltip> : label;
}

function ListView({
  versions,
  current,
  rowStats,
  copilotIcon,
  isCurrentLocked,
  restoreBlockedReason,
  onOpenDiff,
  onRestore,
}: {
  versions: CodeVersion[];
  current: CodeVersion;
  rowStats: Map<number, { added: number; removed: number }>;
  copilotIcon: React.ReactNode;
  isCurrentLocked: boolean;
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
      <div className="shrink-0 overflow-y-hidden border-b border-graphite-10 bg-bg-panel [scrollbar-gutter:stable]">
        <div className={`grid ${LIST_COLUMNS} items-center gap-x-[16px] px-[24px] py-[8px]`}>
          <span className={headerCell}>Version</span>
          <span className={headerCell}>Source</span>
          <span className={headerCell}>Summary</span>
          <span className={headerCell}>Changes</span>
          <span className={headerCell}>Operator</span>
          <span className={headerCell}>Time</span>
          <span className={headerCell}>Action</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
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
              className={`grid ${LIST_COLUMNS} h-[48px] items-center gap-x-[16px] px-[24px] ${
                index < rows.length - 1 ? "border-b border-graphite-10" : ""
              } ${hasPrevious ? "cursor-pointer hover:bg-bg-panel focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-brand-1" : ""}`}
            >
              <div className="flex items-center gap-[6px]">
                <span className="t-body-compact font-medium text-text-primary">{versionLabel(version)}</span>
                {isCurrent && isCurrentLocked && (
                  <Tooltip label="Locked">
                    <span className="flex size-[16px] items-center justify-center" aria-label="Locked">
                      <MaskIcon src={lockIconUrl} size={14} />
                    </span>
                  </Tooltip>
                )}
              </div>

              <div className="flex min-w-0 items-center gap-[6px]">
                <Tag>{sourceText(version)}</Tag>
                {isCurrent && <Tag variant="brand">Current</Tag>}
              </div>

              <span className="t-body-compact truncate text-text-primary" title={version.summary}>{version.summary}</span>

              <ChangeCounts added={stat.added} removed={stat.removed} />

              <OperatorCell version={version} copilotIcon={copilotIcon} />

              <span className="t-body-compact tabular-nums text-text-secondary">{version.createdAt}</span>

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
                <span className="inline-flex w-[64px]">
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
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diff                                                                */
/* ------------------------------------------------------------------ */

function DiffView({
  versions,
  byNumber,
  pair,
  onPairChange,
}: {
  versions: CodeVersion[];
  byNumber: Map<number, CodeVersion>;
  pair: { base: number; target: number };
  onPairChange: (pair: { base: number; target: number }) => void;
}) {
  const base = byNumber.get(pair.base)!;
  const target = byNumber.get(pair.target)!;

  const segments = useMemo(() => diffPrograms(base.code, target.code), [base, target]);
  const codeTotals = useMemo(
    () => segments.reduce((sum, segment) => ({ added: sum.added + segment.added, removed: sum.removed + segment.removed }), { added: 0, removed: 0 }),
    [segments],
  );

  const options = useMemo(
    () =>
      [...versions].reverse().map((version) => ({
        value: String(version.number),
        label: `${versionLabel(version)} · ${sourceText(version)} · ${version.createdAt}`,
      })),
    [versions],
  );

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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-[8px] border-b border-graphite-10 px-[24px] py-[12px]">
        <div className="w-[320px]">
          <SingleSelect
            triggerClassName="h-[28px] rounded-[4px] px-[8px]"
            options={options.map((option) => ({ ...option, disabled: option.value === String(pair.target) }))}
            value={String(pair.base)}
            onChange={changeBase}
          />
        </div>
        <span className="t-small text-text-secondary" aria-hidden="true">→</span>
        <div className="w-[320px]">
          <SingleSelect
            triggerClassName="h-[28px] rounded-[4px] px-[8px]"
            options={options.map((option) => ({ ...option, disabled: option.value === String(pair.base) }))}
            value={String(pair.target)}
            onChange={changeTarget}
          />
        </div>
        <div className="ml-auto">
          <ChangeCounts added={codeTotals.added} removed={codeTotals.removed} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]">
        <CodePane key={`${pair.base}-${pair.target}`} base={base} target={target} segments={segments} />
      </div>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="px-[24px] py-[24px] t-body-compact text-text-secondary">{children}</p>;
}

type FoldItem =
  | { type: "rows"; rows: SplitRow[]; firstChange: boolean[] }
  | { type: "fold"; id: string; rows: SplitRow[] };

/** Keeps CONTEXT_LINES around every change and folds longer unchanged runs. */
function foldRows(segmentKey: string, rows: SplitRow[], expanded: Set<string>): FoldItem[] {
  const keep = rows.map(() => false);
  rows.forEach((row, index) => {
    if (!row.changed) return;
    for (let k = Math.max(0, index - CONTEXT_LINES); k <= Math.min(rows.length - 1, index + CONTEXT_LINES); k++) keep[k] = true;
  });
  const items: FoldItem[] = [];
  let index = 0;
  let previousChanged = false;
  while (index < rows.length) {
    const start = index;
    if (keep[index] || rows.length === 0) {
      while (index < rows.length && keep[index]) index++;
      const slice = rows.slice(start, index);
      const firstChange = slice.map((row) => {
        const isStart = row.changed && !previousChanged;
        previousChanged = row.changed;
        return isStart;
      });
      items.push({ type: "rows", rows: slice, firstChange });
    } else {
      while (index < rows.length && !keep[index]) index++;
      const slice = rows.slice(start, index);
      const id = `${segmentKey}-${start}`;
      if (slice.length < 4 || expanded.has(id)) items.push({ type: "rows", rows: slice, firstChange: slice.map(() => false) });
      else items.push({ type: "fold", id, rows: slice });
      previousChanged = false;
    }
  }
  return items;
}

function Cell({ line, side }: { line: SplitRow["left"] | SplitRow["right"]; side: "left" | "right" }) {
  if (!line) return <div className="bg-bg-panel" aria-hidden="true" />;
  const tint = line.op === "del" ? DEL_ROW : line.op === "add" ? ADD_ROW : "";
  const marker = line.op === "del" ? "−" : line.op === "add" ? "+" : "";
  return (
    <div className={`flex min-w-0 gap-[8px] px-[8px] leading-[20px] ${tint} ${side === "right" ? "border-l border-graphite-10" : ""}`}>
      <span className="w-[16px] shrink-0 select-none text-text-secondary" aria-hidden="true">{marker}</span>
      <span className="w-[32px] shrink-0 select-none text-right tabular-nums text-text-secondary">{line.no}</span>
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-all text-text-primary">{line.text === "" ? " " : line.text}</code>
    </div>
  );
}

function CodePane({ base, target, segments }: { base: CodeVersion; target: CodeVersion; segments: SegmentDiff[] }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [expandedFolds, setExpandedFolds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const cursor = useRef(-1);

  const totalChanges = segments.reduce((sum, segment) => {
    let blocks = 0;
    let previous = false;
    segment.rows.forEach((row) => {
      if (row.changed && !previous) blocks++;
      previous = row.changed;
    });
    return sum + blocks;
  }, 0);

  const toggle = (set: Set<string>, setter: (next: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const jump = (direction: 1 | -1) => {
    const nodes = containerRef.current?.querySelectorAll<HTMLElement>("[data-change-start]");
    if (!nodes || nodes.length === 0) return;
    cursor.current = (cursor.current + direction + nodes.length) % nodes.length;
    nodes[cursor.current].scrollIntoView({ block: "center", behavior: "smooth" });
  };

  if (totalChanges === 0) {
    return <EmptyNote>No code changes between {versionLabel(base)} and {versionLabel(target)}.</EmptyNote>;
  }

  return (
    <div ref={containerRef} className="flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-[8px] border-b border-graphite-10 bg-white px-[24px] py-[8px]">
        <span className="t-small text-text-secondary">{totalChanges} {totalChanges === 1 ? "change" : "changes"}</span>
        <div className="ml-auto flex items-center gap-[4px]">
          <Button variant="ghost" size="sm" onClick={() => jump(-1)}>Previous Change</Button>
          <Button variant="ghost" size="sm" onClick={() => jump(1)}>Next Change</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 border-b border-graphite-10 bg-bg-panel px-[24px] py-[6px] t-small text-text-secondary">
        <span>{versionLabel(base)}</span>
        <span>{versionLabel(target)}</span>
      </div>

      <div className="flex flex-col gap-[12px] px-[24px] py-[12px]">
        {segments.map((segment) => {
          const isCollapsed = collapsed.has(segment.key);
          const hasChanges = segment.added + segment.removed > 0;
          const items = foldRows(segment.key, segment.rows, expandedFolds);
          return (
            <section key={segment.key} className="overflow-hidden rounded-[8px] border border-graphite-20">
              <button
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => toggle(collapsed, setCollapsed, segment.key)}
                className="flex min-h-[40px] w-full items-center gap-[8px] bg-bg-panel px-[12px] text-left hover:bg-graphite-10"
              >
                <MaskIcon src={isCollapsed ? arrowRightUrl : arrowDownUrl} />
                <span className="t-body-compact text-text-primary">{SEGMENT_LABEL[segment.key]}</span>
                {hasChanges ? <ChangeCounts added={segment.added} removed={segment.removed} /> : <span className="t-small text-text-secondary">No changes</span>}
              </button>
              {!isCollapsed && hasChanges && (
                <div className="border-t border-graphite-10 font-mono t-code">
                  {items.map((item, itemIndex) =>
                    item.type === "fold" ? (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggle(expandedFolds, setExpandedFolds, item.id)}
                        className="flex h-[28px] w-full items-center justify-center bg-bg-panel t-small text-text-secondary hover:bg-graphite-10"
                      >
                        {item.rows.length} unchanged lines
                      </button>
                    ) : (
                      item.rows.map((row, rowIndex) => (
                        <div
                          key={`${itemIndex}-${rowIndex}`}
                          data-change-start={item.firstChange[rowIndex] ? "" : undefined}
                          className="grid grid-cols-2"
                        >
                          <Cell line={row.left} side="left" />
                          <Cell line={row.right} side="right" />
                        </div>
                      ))
                    ),
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
