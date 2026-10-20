import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { SingleSelect } from "../../../components/ui/SingleSelect";
import { Tabs } from "../../../components/ui/Tabs";
import { Tag } from "../../../components/ui/Tag";
import { Tooltip } from "../../../components/ui/Tooltip";
import arrowDownUrl from "../../../icons/arrow-down-s-line.svg";
import arrowLeftUrl from "../../../icons/arrow-left-s-line.svg";
import arrowRightUrl from "../../../icons/arrow-right-s-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import lockIconUrl from "../../../icons/Lock.svg";
import {
  CodeVersion,
  KIND_LABEL,
  SEGMENT_LABEL,
  SegmentDiff,
  SplitRow,
  compareMetadata,
  diffPrograms,
  sourceText,
  totalCodeChange,
  versionLabel,
  diffMetadata,
} from "./versionHistoryData";

/* Diff row tints mirror the Copilot "Edited code" card (AI-CodeDiff) so both diffs read the same way. */
const DEL_ROW = "border-l-[3px] border-brand-1 bg-[#FDECEA]";
const ADD_ROW = "border-l-[3px] border-code-success bg-[#E6F4EA]";
const CONTEXT_LINES = 3;
const LIST_COLUMNS = "grid-cols-[180px_120px_minmax(0,1fr)_170px_150px]";

function MaskIcon({ src, size = 16, className = "bg-text-secondary" }: { src: string; size?: number; className?: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size, mask, WebkitMask: mask }} />;
}

function ChangeCounts({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="flex gap-[6px] t-small tabular-nums">
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
  onClose,
  onRestore,
}: VersionHistoryModalProps) {
  const [view, setView] = useState<"list" | "diff">("list");
  const [pair, setPair] = useState<{ base: number; target: number } | null>(null);
  const [tab, setTab] = useState<"metadata" | "code">("code");

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
    const meta = compareMetadata(base, target);
    setPair({ base: base.number, target: target.number });
    setTab(meta.status === "ok" && meta.changes.length > 0 ? "metadata" : "code");
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
    const stats = new Map<number, { added: number; removed: number; metadataCount: number | null }>();
    versions.forEach((version, index) => {
      const previous = versions[index - 1];
      if (!previous) {
        stats.set(version.number, { ...totalCodeChange("", version.code), metadataCount: null });
        return;
      }
      const code = totalCodeChange(previous.code, version.code);
      const metadataCount =
        version.metadata && previous.metadata ? diffMetadata(previous.metadata, version.metadata).length : null;
      stats.set(version.number, { ...code, metadataCount });
    });
    return stats;
  }, [versions]);

  if (!isOpen || !current) return null;

  const openDiff = (version: CodeVersion) => {
    const index = versions.findIndex((item) => item.number === version.number);
    const previous = versions[index - 1];
    if (!previous) return;
    const meta = compareMetadata(previous, version);
    setPair({ base: previous.number, target: version.number });
    setTab(meta.status === "ok" && meta.changes.length > 0 ? "metadata" : "code");
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
          isDiff ? "h-[min(820px,calc(100vh-32px))] w-[1200px]" : "max-h-[calc(100vh-32px)] w-[1040px]"
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
              <p className="t-small truncate text-text-secondary">{outputName}</p>
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
            tab={tab}
            onTabChange={setTab}
            onPairChange={setPair}
          />
        ) : (
          <ListView
            versions={versions}
            current={current}
            rowStats={rowStats}
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

function OperatorCell({ version }: { version: CodeVersion }) {
  if (!version.operator.viaCopilot) return <span className="t-body-compact truncate text-text-primary">{version.operator.name}</span>;
  return (
    <div className="flex min-w-0 flex-col">
      <span className="t-body-compact truncate text-text-primary">Copilot</span>
      {version.operator.triggeredBy && (
        <span className="t-small truncate text-text-secondary">triggered by {version.operator.triggeredBy}</span>
      )}
    </div>
  );
}

function ListView({
  versions,
  current,
  rowStats,
  isCurrentLocked,
  restoreBlockedReason,
  onOpenDiff,
  onRestore,
}: {
  versions: CodeVersion[];
  current: CodeVersion;
  rowStats: Map<number, { added: number; removed: number; metadataCount: number | null }>;
  isCurrentLocked: boolean;
  restoreBlockedReason: string | null;
  onOpenDiff: (version: CodeVersion) => void;
  onRestore: (version: CodeVersion) => void;
}) {
  const rows = [...versions].reverse();
  const headerCell = "t-small-medium text-text-secondary";

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
          <span className={headerCell}>Operator</span>
          <span className={`${headerCell} text-right`}>Action</span>
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
              className={`grid ${LIST_COLUMNS} items-center gap-x-[16px] px-[24px] py-[12px] ${
                index < rows.length - 1 ? "border-b border-graphite-10" : ""
              } ${hasPrevious ? "cursor-pointer hover:bg-bg-panel focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-brand-1" : ""}`}
            >
              <div className="flex min-w-0 flex-col gap-[4px]">
                <div className="flex items-center gap-[6px]">
                  <span className="t-body-medium text-text-primary">{versionLabel(version)}</span>
                  {isCurrent && <Tag variant="brand">Current</Tag>}
                  {isCurrent && isCurrentLocked && (
                    <Tooltip label="Locked">
                      <span className="flex size-[16px] items-center justify-center" aria-label="Locked">
                        <MaskIcon src={lockIconUrl} size={14} />
                      </span>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-[6px]">
                  <Tag>{KIND_LABEL[version.kind]}</Tag>
                </div>
                <span className="t-small tabular-nums text-text-secondary">{version.createdAt}</span>
              </div>

              <span className="t-body-compact truncate text-text-primary">{sourceText(version)}</span>

              <div className="flex min-w-0 flex-col gap-[2px]">
                <span className="t-body-compact text-text-primary">{version.summary}</span>
                <div className="flex items-center gap-[8px]">
                  <ChangeCounts added={stat.added} removed={stat.removed} />
                  {stat.metadataCount !== null && stat.metadataCount > 0 && (
                    <span className="t-small text-text-secondary">Metadata ×{stat.metadataCount}</span>
                  )}
                </div>
              </div>

              <OperatorCell version={version} />

              <div className="flex items-center justify-end gap-[12px]">
                {hasPrevious && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDiff(version);
                    }}
                    className="t-link text-brand-1 hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1"
                  >
                    View Diff
                  </button>
                )}
                {!isCurrent &&
                  (restoreBlockedReason ? (
                    <Tooltip label={restoreBlockedReason}>
                      <span className="inline-flex">{restoreButton}</span>
                    </Tooltip>
                  ) : (
                    restoreButton
                  ))}
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
  tab,
  onTabChange,
  onPairChange,
}: {
  versions: CodeVersion[];
  byNumber: Map<number, CodeVersion>;
  pair: { base: number; target: number };
  tab: "metadata" | "code";
  onTabChange: (tab: "metadata" | "code") => void;
  onPairChange: (pair: { base: number; target: number }) => void;
}) {
  const base = byNumber.get(pair.base)!;
  const target = byNumber.get(pair.target)!;

  const segments = useMemo(() => diffPrograms(base.code, target.code), [base, target]);
  const codeTotals = useMemo(
    () => segments.reduce((sum, segment) => ({ added: sum.added + segment.added, removed: sum.removed + segment.removed }), { added: 0, removed: 0 }),
    [segments],
  );
  const metadata = useMemo(() => compareMetadata(base, target), [base, target]);
  const blueprintUpdated = versions.some((version) => version.number > base.number && version.number <= target.number && version.blueprintUpdated);

  const options = useMemo(
    () =>
      [...versions].reverse().map((version) => ({
        value: String(version.number),
        label: `${versionLabel(version)} · ${KIND_LABEL[version.kind]} · ${version.createdAt}`,
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

  const previousFull = [...versions].reverse().find((version) => version.number < target.number && version.kind === "code-metadata");
  const metadataLabel = metadata.status === "ok" ? `Metadata (${metadata.changes.length})` : "Metadata";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-[8px] border-b border-graphite-10 px-[24px] py-[12px]">
        <div className="w-[300px]">
          <SingleSelect
            triggerClassName="h-[28px] rounded-[4px] px-[8px]"
            options={options.map((option) => ({ ...option, disabled: option.value === String(pair.target) }))}
            value={String(pair.base)}
            onChange={changeBase}
          />
        </div>
        <span className="t-small text-text-secondary" aria-hidden="true">→</span>
        <div className="w-[300px]">
          <SingleSelect
            triggerClassName="h-[28px] rounded-[4px] px-[8px]"
            options={options.map((option) => ({ ...option, disabled: option.value === String(pair.base) }))}
            value={String(pair.target)}
            onChange={changeTarget}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={!previousFull || previousFull.number === pair.base}
          onClick={() => previousFull && onPairChange({ base: previousFull.number, target: target.number })}
        >
          vs Previous Code + Metadata
        </Button>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-[8px] border-b border-graphite-10 bg-bg-panel px-[24px] py-[8px]">
        <Tag>{KIND_LABEL[target.kind]}</Tag>
        <span className="t-small text-text-primary">
          {target.kind === "code-metadata"
            ? `${versionLabel(target)} changed code and Metadata.`
            : `${versionLabel(target)} changed code only.`}
        </span>
        <span className="ml-auto">
          <Tag>{blueprintUpdated ? "Blueprint Updated" : "Blueprint Unchanged"}</Tag>
        </span>
      </div>

      <div className="shrink-0 border-b border-graphite-10 px-[16px]">
        <Tabs
          value={tab}
          onChange={(value) => onTabChange(value as "metadata" | "code")}
          options={[
            { id: "metadata", label: metadataLabel },
            { id: "code", label: `Code (+${codeTotals.added} −${codeTotals.removed})` },
          ]}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]">
        {tab === "metadata" ? (
          <MetadataPane base={base} target={target} result={metadata} />
        ) : (
          <CodePane key={`${pair.base}-${pair.target}`} base={base} target={target} segments={segments} />
        )}
      </div>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="px-[24px] py-[24px] t-body-secondary text-text-secondary">{children}</p>;
}

function MetadataPane({
  base,
  target,
  result,
}: {
  base: CodeVersion;
  target: CodeVersion;
  result: ReturnType<typeof compareMetadata>;
}) {
  if (result.status === "code-only-target") return <EmptyNote>This version only changed code.</EmptyNote>;
  if (result.status === "no-base-snapshot") return <EmptyNote>No Metadata to compare with {versionLabel(base)} (Code Only).</EmptyNote>;
  if (result.changes.length === 0) return <EmptyNote>No Metadata changes between {versionLabel(base)} and {versionLabel(target)}.</EmptyNote>;

  const groups = Array.from(new Set(result.changes.map((change) => change.group)));
  return (
    <div className="flex flex-col gap-[16px] px-[24px] py-[16px]">
      {groups.map((group) => (
        <section key={group} className="overflow-hidden rounded-[8px] border border-graphite-20">
          <div className="flex items-center justify-between bg-bg-panel px-[12px] py-[8px]">
            <h3 className="t-body-compact text-text-primary">{group}</h3>
            <span className="t-small tabular-nums text-text-secondary">{result.changes.filter((change) => change.group === group).length}</span>
          </div>
          {result.changes
            .filter((change) => change.group === group)
            .map((change) => (
              <div key={change.field} className="grid grid-cols-[200px_minmax(0,1fr)] gap-x-[16px] border-t border-graphite-10 px-[12px] py-[8px]">
                <span className="t-small text-text-secondary">{change.field}</span>
                <div className="flex min-w-0 flex-wrap items-center gap-[6px] t-small">
                  {change.from === null ? (
                    <>
                      <Tag>Added</Tag>
                      <span className="text-brand-1">{change.to}</span>
                    </>
                  ) : change.to === null ? (
                    <>
                      <Tag>Removed</Tag>
                      <span className="text-text-secondary line-through">{change.from}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-text-secondary line-through">{change.from || "Empty"}</span>
                      <span className="text-text-secondary" aria-hidden="true">→</span>
                      <span className="text-brand-1">{change.to || "Empty"}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
        </section>
      ))}
    </div>
  );
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
      <div className="grid grid-cols-2 border-b border-graphite-10 bg-bg-panel px-[24px] py-[6px] t-small-medium text-text-secondary">
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
