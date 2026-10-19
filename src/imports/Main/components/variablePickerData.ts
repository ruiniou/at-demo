import type { Variable, VlmRow, AdamCodeListRow } from "./BrowseVariablesModal";

export const variableKey = (v: Pick<Variable, "datasetName" | "variable">) => `${v.datasetName}.${v.variable}`;
export const variableStandard = (v: Variable) => v.standard ?? (v.datasetName.startsWith("AD") ? "ADaM" : "SDTM");

export function normalizeSelection(keys: string[], variables: Variable[], sourceDatasets: string[]) {
  return [...new Set(keys.flatMap(key => {
    if (key.includes(".")) return [key];
    const matches = variables.filter(v => v.variable === key);
    const scoped = matches.filter(v => sourceDatasets.includes(v.datasetName));
    const candidates = scoped.length ? scoped : matches;
    return candidates.length === 1 ? [variableKey(candidates[0])] : [];
  }))];
}

export function resolveCodelistVariable(name: string, variables: Variable[]) {
  const dot = name.indexOf(".");
  if (dot >= 0) return variables.find(v => v.datasetName === name.slice(0, dot) && v.variable === name.slice(dot + 1));
  const dataset = [...new Set(variables.map(v => v.datasetName))]
    .sort((a, b) => b.length - a.length)
    .find(ds => name.startsWith(`${ds}_`));
  return dataset ? variables.find(v => v.datasetName === dataset && v.variable === name.slice(dataset.length + 1)) : undefined;
}

export type PickerCodelist = { id: string; name: string; links: { dataset: string; variable: string }[]; terms: { value: string; label: string }[] };
export function buildCodelists(rows: AdamCodeListRow[], variables: Variable[]): PickerCodelist[] {
  const groups = new Map<string, PickerCodelist>();
  const linksFor = (id: string) => {
    const explicit = variables.filter(v => variableStandard(v) === "ADaM" && v.codelistRef === id);
    const inferred = explicit.length ? [] : [resolveCodelistVariable(id, variables)].filter((v): v is Variable => Boolean(v));
    return [...explicit, ...inferred].map(v => ({ dataset: v.datasetName, variable: v.variable }));
  };
  for (const row of rows) {
    const id = row.codelist;
    if (!id) continue;
    if (!groups.has(id)) {
      groups.set(id, { id, name: row.codelistName || id, links: linksFor(id), terms: [] });
    }
    const terms = groups.get(id)!.terms;
    if (!terms.some(t => t.value === row.codelistValue && t.label === row.codelistValueLabel)) {
      terms.push({ value: row.codelistValue, label: row.codelistValueLabel });
    }
  }
  // Retain existing variable-level metadata when a complete codelist export is absent.
  for (const v of variables) {
    if (variableStandard(v) !== "ADaM" || !v.codelistRef || groups.has(v.codelistRef)) continue;
    groups.set(v.codelistRef, { id: v.codelistRef, name: v.codelistRef, links: linksFor(v.codelistRef), terms: v.codelistValues ?? [] });
  }
  return [...groups.values()];
}

export type PickerCondition = { key: string; identifier: string; expression: string; definitions: { variable: string; text: string }[] };
export function buildConditions(dataset: string | null, rows: VlmRow[], variables: Variable[]): PickerCondition[] {
  if (!dataset) return [];
  const source = rows.filter(r => r.datasetName === dataset);
  const covered = new Set(source.map(r => r.variableName));
  const definitions = source.map(r => ({ variable: r.variableName, identifier: r.parameterName, expression: r.whereClause || "", text: r.derivation }));
  for (const v of variables.filter(v => v.datasetName === dataset && !covered.has(v.variable))) {
    for (const p of v.vlmParameters ?? []) definitions.push({ variable: v.variable, identifier: p.param, expression: p.condition || "", text: p.derivation });
  }
  const groups = new Map<string, PickerCondition>();
  for (const d of definitions) {
    const key = JSON.stringify([dataset, d.expression.trim() ? "where" : "parameter", d.expression.trim() || d.identifier]);
    if (!groups.has(key)) groups.set(key, { key, identifier: d.identifier, expression: d.expression, definitions: [] });
    const group = groups.get(key)!;
    if (d.text?.trim() && d.text.trim() !== "—" && !group.definitions.some(v => v.variable === d.variable && v.text === d.text)) group.definitions.push({ variable: d.variable, text: d.text });
  }
  return [...groups.values()];
}
