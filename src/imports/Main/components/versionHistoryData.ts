/**
 * Version History — data model, mock seed and diff helpers.
 *
 * Model (see Version History Proposal):
 * - Every successful code change creates a version node; versions are immutable and append-only.
 * - `code-metadata` = AI write_code: a complete snapshot (Code + Delivery Metadata).
 * - `code-only`     = AI edit_code / Manual Save: Code only. Metadata of Code Only versions is
 *                     intentionally not handled in this round.
 * - Restore never rewrites history: it appends a new version whose content equals the restored one.
 */

export type VersionSource = "initial" | "ai-write" | "ai-edit" | "manual-save" | "restored";
export type VersionKind = "code-metadata" | "code-only";

/** Group name -> field label -> value. Mirrors the Metadata panel (Basic Information / Blocks). */
export type MetadataSnapshot = Record<string, Record<string, string>>;

export interface CodeVersion {
  /** Sequential version number, 1-based. */
  number: number;
  /** "YYYY-MM-DD HH:mm" in the user's time zone. */
  createdAt: string;
  source: VersionSource;
  /** Set when source === "restored". */
  restoredFrom?: number;
  /** AI versions are authored by Copilot on behalf of a person; `triggeredBy` keeps them attributable (ALCOA+). */
  operator: { name: string; viaCopilot: boolean; triggeredBy?: string };
  kind: VersionKind;
  code: string;
  /** Present only when kind === "code-metadata". */
  metadata?: MetadataSnapshot;
  /** One-line semantic summary. */
  summary: string;
  /** Blueprint was updated by this version (P0 shows a status label only). */
  blueprintUpdated?: boolean;
}

export const versionLabel = (version: Pick<CodeVersion, "number">) => `v${version.number}`;

export const SOURCE_LABEL: Record<VersionSource, string> = {
  initial: "Initial",
  "ai-write": "AI Write",
  "ai-edit": "AI Edit",
  "manual-save": "Manual Save",
  restored: "Restored",
};

export const KIND_LABEL: Record<VersionKind, string> = {
  "code-metadata": "Code + Metadata",
  "code-only": "Code Only",
};

export const sourceText = (version: CodeVersion) =>
  version.source === "restored" && version.restoredFrom ? `Restored from v${version.restoredFrom}` : SOURCE_LABEL[version.source];

export function formatNow(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/* ------------------------------------------------------------------ */
/* Line diff                                                           */
/* ------------------------------------------------------------------ */

export type DiffOp = "equal" | "add" | "del";

export interface DiffEntry {
  op: DiffOp;
  text: string;
  /** 1-based line number on the old side (equal / del). */
  oldNo?: number;
  /** 1-based line number on the new side (equal / add). */
  newNo?: number;
}

/** Classic LCS line diff. Programs are a few hundred lines, so O(n*m) is fine here. */
export function diffLines(oldText: string, newText: string, oldOffset = 0, newOffset = 0): DiffEntry[] {
  const a = oldText === "" ? [] : oldText.split("\n");
  const b = newText === "" ? [] : newText.split("\n");
  const n = a.length;
  const m = b.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const out: DiffEntry[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: "equal", text: a[i], oldNo: oldOffset + i + 1, newNo: newOffset + j + 1 });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      out.push({ op: "del", text: a[i], oldNo: oldOffset + i + 1 });
      i++;
    } else {
      out.push({ op: "add", text: b[j], newNo: newOffset + j + 1 });
      j++;
    }
  }
  while (i < n) {
    out.push({ op: "del", text: a[i], oldNo: oldOffset + i + 1 });
    i++;
  }
  while (j < m) {
    out.push({ op: "add", text: b[j], newNo: newOffset + j + 1 });
    j++;
  }
  return out;
}

export const countChanges = (entries: DiffEntry[]) => ({
  added: entries.filter((entry) => entry.op === "add").length,
  removed: entries.filter((entry) => entry.op === "del").length,
});

/** One row of the side-by-side view. */
export interface SplitRow {
  left?: { no: number; text: string; op: "equal" | "del" };
  right?: { no: number; text: string; op: "equal" | "add" };
  changed: boolean;
}

/** Pairs deletions with additions inside each change block, so edits line up on one row. */
export function toSplitRows(entries: DiffEntry[]): SplitRow[] {
  const rows: SplitRow[] = [];
  let index = 0;
  while (index < entries.length) {
    const entry = entries[index];
    if (entry.op === "equal") {
      rows.push({
        left: { no: entry.oldNo!, text: entry.text, op: "equal" },
        right: { no: entry.newNo!, text: entry.text, op: "equal" },
        changed: false,
      });
      index++;
      continue;
    }
    const dels: DiffEntry[] = [];
    const adds: DiffEntry[] = [];
    while (index < entries.length && entries[index].op !== "equal") {
      (entries[index].op === "del" ? dels : adds).push(entries[index]);
      index++;
    }
    const length = Math.max(dels.length, adds.length);
    for (let k = 0; k < length; k++) {
      rows.push({
        left: dels[k] ? { no: dels[k].oldNo!, text: dels[k].text, op: "del" } : undefined,
        right: adds[k] ? { no: adds[k].newNo!, text: adds[k].text, op: "add" } : undefined,
        changed: true,
      });
    }
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/* Program segments                                                    */
/* ------------------------------------------------------------------ */

export type SegmentKey = "preamble" | "main" | "epilogue";
export const SEGMENT_LABEL: Record<SegmentKey, string> = {
  preamble: "Preamble",
  main: "Main Code",
  epilogue: "Epilogue",
};

export interface CodeSegment {
  key: SegmentKey;
  text: string;
  /** Number of lines that precede this segment in the whole program. */
  offset: number;
}

const SETUP_LINE = /^\s*(\/\*|\*\/|\*|options\b|title\d*\b|footnote\d*\b|ods\b|libname\b|filename\b|%let\b)/i;

/**
 * Splits a program into Preamble / Main Code / Epilogue by blank-line separated blocks:
 * leading blocks made only of comments/options/titles are the preamble, trailing blocks made
 * only of footnotes/ODS/comments are the epilogue. Segments are exact line slices, so line
 * numbers stay identical to the Code panel.
 */
export function splitSegments(code: string): CodeSegment[] {
  const lines = code.split("\n");
  const blocks: { start: number; end: number; setup: boolean }[] = [];
  let start = -1;
  const flush = (end: number) => {
    if (start < 0) return;
    const slice = lines.slice(start, end).filter((line) => line.trim() !== "");
    blocks.push({ start, end, setup: slice.every((line) => SETUP_LINE.test(line)) });
    start = -1;
  };
  lines.forEach((line, index) => {
    if (line.trim() === "") flush(index);
    else if (start < 0) start = index;
  });
  flush(lines.length);

  let first = 0;
  while (first < blocks.length - 1 && blocks[first].setup) first++;
  let last = blocks.length;
  while (last > first + 1 && blocks[last - 1].setup) last--;

  const preEnd = first > 0 ? blocks[first].start : 0;
  const epiStart = last < blocks.length ? blocks[last].start : lines.length;
  const slices: [SegmentKey, number, number][] = [
    ["preamble", 0, preEnd],
    ["main", preEnd, epiStart],
    ["epilogue", epiStart, lines.length],
  ];
  return slices.map(([key, from, to]) => ({
    key,
    text: lines.slice(from, to).join("\n").replace(/^\n+|\n+$/g, "") === "" ? "" : lines.slice(from, to).join("\n"),
    offset: from,
  }));
}

export interface SegmentDiff {
  key: SegmentKey;
  entries: DiffEntry[];
  rows: SplitRow[];
  added: number;
  removed: number;
}

export function diffPrograms(oldCode: string, newCode: string): SegmentDiff[] {
  const oldSegments = splitSegments(oldCode);
  const newSegments = splitSegments(newCode);
  return oldSegments
    .map((oldSegment, index) => {
      const newSegment = newSegments[index];
      const entries = diffLines(oldSegment.text, newSegment.text, oldSegment.offset, newSegment.offset);
      const { added, removed } = countChanges(entries);
      return { key: oldSegment.key, entries, rows: toSplitRows(entries), added, removed };
    })
    .filter((segment) => segment.entries.length > 0);
}

export function totalCodeChange(oldCode: string, newCode: string) {
  return diffPrograms(oldCode, newCode).reduce(
    (sum, segment) => ({ added: sum.added + segment.added, removed: sum.removed + segment.removed }),
    { added: 0, removed: 0 },
  );
}

/* ------------------------------------------------------------------ */
/* Metadata diff                                                       */
/* ------------------------------------------------------------------ */

export interface MetadataChange {
  group: string;
  field: string;
  from: string | null;
  to: string | null;
}

export function diffMetadata(oldMeta: MetadataSnapshot, newMeta: MetadataSnapshot): MetadataChange[] {
  const changes: MetadataChange[] = [];
  const groups = Array.from(new Set([...Object.keys(oldMeta), ...Object.keys(newMeta)]));
  for (const group of groups) {
    const before = oldMeta[group] ?? {};
    const after = newMeta[group] ?? {};
    const fields = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
    for (const field of fields) {
      const from = before[field] ?? null;
      const to = after[field] ?? null;
      if (from !== to) changes.push({ group, field, from, to });
    }
  }
  return changes;
}

/** Metadata can only be compared when both versions carry a snapshot (Code Only versions do not, this round). */
export function compareMetadata(base: CodeVersion, target: CodeVersion):
  | { status: "ok"; changes: MetadataChange[] }
  | { status: "code-only-target" }
  | { status: "no-base-snapshot" } {
  if (!target.metadata) return { status: "code-only-target" };
  if (!base.metadata) return { status: "no-base-snapshot" };
  return { status: "ok", changes: diffMetadata(base.metadata, target.metadata) };
}

/* ------------------------------------------------------------------ */
/* Mock seed                                                           */
/* ------------------------------------------------------------------ */

/** Applies the first matching rule; falls back to a trailing comment so every earlier version really differs. */
function mutate(code: string, rules: [RegExp, string][], fallbackComment: string): string {
  for (const [pattern, replacement] of rules) {
    if (pattern.test(code)) return code.replace(pattern, replacement);
  }
  return `${code}\n${fallbackComment}`;
}

function touchFirstComment(code: string, suffix: string): string {
  const lines = code.split("\n");
  const index = lines.findIndex((line) => line.includes("/*") && line.includes("*/"));
  if (index < 0) return `${code}\n/* ${suffix.trim()} */`;
  lines[index] = lines[index].replace("*/", `${suffix}*/`);
  return lines.join("\n");
}

const baseMetadata = (tflName: string): MetadataSnapshot => ({
  "Basic Information": {
    Title: tflName,
    Population: "Intent-to-Treat (ITTFL = Y)",
    "Source Dataset": "ADSL",
    Suffix: "t01",
  },
  "Block 1 · Treatment Groups": {
    Groups: "Placebo | AZD999 10 mg/kg",
    "Group Variable": "TRT01P",
    Format: "Count (%)",
  },
  "Review Notes": {
    "Residual Risk": "Population flag to be confirmed with the SAP",
  },
});

/**
 * Builds a small, realistic history around the program that is actually shown in the Code panel,
 * so Diff and Restore visibly change the editor content. The last version equals `currentCode`.
 */
export function buildSeedVersions(currentCode: string, tflName: string, currentUser: string): CodeVersion[] {
  const v3Code = touchFirstComment(currentCode, " (draft) ");
  const v2Code = mutate(v3Code, [[/conftype=loglog/, "conftype=plain"], [/page_cols = \d+/, "page_cols = 4"]], "/* Macro: m_u_listing v1 */");
  const v1Code = mutate(
    v2Code,
    [[/saffl="Y"/g, 'ittfl="Y"'], [/freeze_cols = \d+/, "freeze_cols = 1"]],
    "/* Population: ITT */",
  );

  const metadataV1 = baseMetadata(tflName);
  const metadataV2: MetadataSnapshot = {
    ...metadataV1,
    "Basic Information": { ...metadataV1["Basic Information"], Population: "Safety Analysis Set (SAFFL = Y)" },
    "Block 1 · Treatment Groups": {
      ...metadataV1["Block 1 · Treatment Groups"],
      Groups: "Placebo | AZD999 10 mg/kg | AZD999 20 mg/kg",
    },
    "Review Notes": { "Residual Risk": "None" },
  };

  const ai = { name: "Copilot", viaCopilot: true, triggeredBy: currentUser };
  return [
    {
      number: 1,
      createdAt: "2026-10-19 10:12",
      source: "initial",
      operator: ai,
      kind: "code-metadata",
      code: v1Code,
      metadata: metadataV1,
      summary: "Initial program and Metadata generated from AI analysis",
      blueprintUpdated: true,
    },
    {
      number: 2,
      createdAt: "2026-10-19 16:40",
      source: "ai-write",
      operator: ai,
      kind: "code-metadata",
      code: v2Code,
      metadata: metadataV2,
      summary: "Population changed to Safety Analysis Set, 1 group added",
      blueprintUpdated: true,
    },
    {
      number: 3,
      createdAt: "2026-10-20 09:25",
      source: "ai-edit",
      operator: ai,
      kind: "code-only",
      code: v3Code,
      summary: "Edited one statement in the main code",
    },
    {
      number: 4,
      createdAt: "2026-10-20 11:03",
      source: "manual-save",
      operator: { name: currentUser, viaCopilot: false },
      kind: "code-only",
      code: currentCode,
      summary: "Manual edit",
    },
  ];
}

/** Metadata snapshot used when the demo Copilot writes a new Code + Metadata version. */
export function nextMetadata(previous: CodeVersion[], tweak: (meta: MetadataSnapshot) => MetadataSnapshot): MetadataSnapshot {
  const latest = [...previous].reverse().find((version) => version.metadata);
  return tweak(latest?.metadata ?? baseMetadata("Output"));
}
