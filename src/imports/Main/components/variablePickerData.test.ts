import { strict as assert } from "node:assert";
import { test } from "node:test";
import { resolveCodelistVariable, buildConditions, buildCodelists, normalizeSelection } from "./variablePickerData";
import type { Variable, VlmRow, AdamCodeListRow } from "./BrowseVariablesModal";

const variable = (datasetName: string, name: string): Variable => ({ id: `${datasetName}.${name}`, datasetName, variable: name, label: name, type: "Char", length: 8, displayFormat: "", derivation: "", hasVlm: false });
const vars = [variable("AD", "LB_TEST"), variable("AD_LB", "TEST"), variable("ADLB", "AVAL"), variable("ADTTE", "AVAL")];

test("codelist names resolve dot notation and the longest real dataset prefix without a shorter-prefix fallback", () => {
  assert.equal(resolveCodelistVariable("AD_LB.TEST", vars)?.datasetName, "AD_LB");
  assert.equal(resolveCodelistVariable("AD_LB_TEST", vars)?.datasetName, "AD_LB");
  assert.equal(resolveCodelistVariable("AD_LB_MISSING", vars), undefined);
  assert.equal(resolveCodelistVariable("UNKNOWN_TEST", vars), undefined);
  assert.equal(resolveCodelistVariable("AD_LB.TEST_EXTRA", vars), undefined);
});

test("same-name selections remain dataset-qualified, with legacy names resolved only when unambiguous", () => {
  assert.deepEqual(normalizeSelection(["AVAL"], vars, ["ADLB"]), ["ADLB.AVAL"]);
  assert.deepEqual(normalizeSelection(["ADLB.AVAL", "ADTTE.AVAL", "ADLB.AVAL"], vars, ["ADLB"]), ["ADLB.AVAL", "ADTTE.AVAL"]);
  assert.deepEqual(normalizeSelection(["AVAL"], vars, []), []);
});

test("VLM aggregates by dataset and Where Clause, retains separate clauses and default definitions", () => {
  const row = (variableName: string, parameterName: string, whereClause: string, derivation: string, datasetName = "ADLB") => ({ id: "fixture", datasetName, variableName, parameterName, whereClause, derivation } as VlmRow);
  const groups = buildConditions("ADLB", [row("AVAL", "P1", "PARAMCD='A'", "Numeric value"), row("AVALC", "P1", "PARAMCD='A'", "Character value"), row("AVAL", "P1", "PARAMCD='B'", "Other value"), row("DTYPE", "*DEFAULT*", "", "Default logic"), row("AVAL", "P1", "PARAMCD='A'", "Wrong dataset", "ADTTE"), row("AVALU", "P1", "PARAMCD='A'", "—")], []);
  assert.equal(groups.length, 3);
  assert.deepEqual(groups[0].definitions.map(d => d.variable), ["AVAL", "AVALC"]);
  assert.equal(groups[2].identifier, "*DEFAULT*");
  assert.ok(!groups.flatMap(g => g.definitions).some(d => d.text === "Wrong dataset"));
});

test("codelists retain all terms for pagination and route unresolved names to Unlinked", () => {
  const rows = Array.from({ length: 501 }, (_, i) => ({ codelist: "ADLB_AVAL", codelistName: "Analysis value", codelistValue: String(i), codelistValueLabel: `Term ${i}` } as AdamCodeListRow));
  rows.push({ codelist: "UNKNOWN", codelistValue: "X", codelistValueLabel: "Unlinked term" } as AdamCodeListRow);
  const groups = buildCodelists(rows, vars);
  assert.equal(groups[0].links[0].dataset, "ADLB");
  assert.equal(groups[0].terms.length, 501);
  assert.deepEqual(groups[1].links, []);
});

test("explicit codelist references take priority and support reuse across datasets", () => {
  const linked = vars.map(v => ({ ...v, codelistRef: v.variable === "AVAL" ? "SHARED" : undefined }));
  const groups = buildCodelists([{ codelist: "SHARED", codelistValue: "1", codelistValueLabel: "One" } as AdamCodeListRow], linked);
  assert.deepEqual(groups[0].links.map(link => link.dataset), ["ADLB", "ADTTE"]);
  assert.equal(groups[0].terms.length, 1);
});
