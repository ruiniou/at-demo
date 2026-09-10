import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { SearchBar } from "../../../components/ui/SearchBar";
import { FormItem } from "../../../components/ui/FormItem";
import { Tag, GroupTag } from "../../../components/ui/Tag";
import { Tooltip } from "../../../components/ui/Tooltip";
import { FilterChip } from "../../../components/ui/FilterChip";
import { Checkbox } from "../../../components/ui/Checkbox";
import arrowIconUrl from "../../../icons/arrow-down-s-line.svg";
import { VariableSpecPicker } from "./VariableSpecPicker";

export { VariableSpecPicker };

// ==================== Types ====================

export type Variable = {
  id: string;
  datasetName: string;
  variable: string;
  label: string;
  type: string;
  length: number;
  displayFormat: string;
  derivation: string;
  hasVlm: boolean;
  standard?: "ADaM" | "SDTM";
  // Sprint 7 extensions for Variable Spec Picker
  origin?: string;
  role?: string;
  core?: string;
  predecessor?: {
    dataset: string;
    variable: string;
    label?: string;
    type?: string;
    length?: number;
    derivation?: string;
    codelist?: string;
  };
  hasCodelist?: boolean;
  codelistRef?: string;
  codelistValues?: { value: string; label: string }[];
  vlmParameters?: { param: string; condition: string; derivation: string }[];
};

export type VlmRow = {
  id: string;
  datasetName: string;
  parameterName: string;
  whereClause: string;
  variableName: string;
  type: string;
  length: number;
  displayFormat: string;
  derivation: string;
};

export type AdamCodeListRow = {
  id: string;
  datasetName?: string;
  codelist: string;
  codelistName: string;
  codelistType: string;
  codelistValue: string;
  codelistValueLabel: string;
  cdiscCodelistCode: string;
  cdiscCodelistValueCode: string;
  rank: number | string;
  orderNumber: number | string;
  extensible: string;
  definition: string;
  used: string;
  deliveryPart1Mini: string;
  deliveryPart1: string;
};

export type SdtmCodeListRow = {
  id: string;
  datasetName?: string;
  codelist: string;
  codelistName: string;
  codelistValue: string;
  codelistValueLabel: string;
  codelistCode: string;
  codelistValueCode: string;
  valueOrigin: string;
  extensible: string;
  used: string;
  order: number | string;
};

export type BrowseVariablesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  initialSelected: string[];
  variables: Variable[];
  vlmData: VlmRow[];
  adamCodeListData?: AdamCodeListRow[];
  sdtmCodeListData?: SdtmCodeListRow[];
  sourceDatasets?: string[];
  onDatasetsExpand?: (newDatasets: string[]) => void;
};

export type InlineVariableListProps = {
  label?: React.ReactNode;
  variables: Variable[];
  selected: string[];
  sourceDatasets?: string[];
  onToggle: (variable: string) => void;
  onRemove: (variable: string) => void;
  onBrowseAll: () => void;
  required?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  placeholder?: string;
  error?: string;
  className?: string;
};

// ==================== Mock Data ====================

export const mockVariables: Variable[] = [
  // --- ADaM Variables ---
  { id: "v1", standard: "ADaM", datasetName: "ADSL", variable: "AAGE", label: "Analysis Age", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to integer part of (Randomization Date - Date of Birth + 1) / 365.25.", hasVlm: false, origin: "Derived", role: "Record Qualifier", core: "Required" },
  { id: "v2", standard: "ADaM", datasetName: "ADSL", variable: "AAGEU", label: "Analysis Age Unit", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Set to "YEARS" if ADSL.AAGE is not missing.', hasVlm: false, origin: "Derived", role: "Record Qualifier", core: "Required" },
  { 
    id: "v3", 
    standard: "ADaM", 
    datasetName: "ADSL", 
    variable: "ACTARM", 
    label: "Description of Actual Arm", 
    type: "Char", 
    length: 40, 
    displayFormat: "$40.", 
    derivation: "DM.ACTARM", 
    hasVlm: false,
    origin: "Predecessor",
    role: "Record Qualifier",
    core: "Required",
    predecessor: {
      dataset: "DM",
      variable: "ACTARM",
      label: "Description of Actual Arm",
      type: "Char",
      length: 40,
      derivation: "CRF: Treatment Page",
      codelist: "ARM",
    },
  },
  { id: "v4", standard: "ADaM", datasetName: "ADSL", variable: "ACTARMCD", label: "Actual Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "DM.ACTARMCD", hasVlm: false, origin: "Predecessor", core: "Required", predecessor: { dataset: "DM", variable: "ACTARMCD", label: "Actual Arm Code", type: "Char", length: 20, derivation: "CRF: Treatment Page" } },
  { id: "v5", standard: "ADaM", datasetName: "ADSL", variable: "ACTARMUD", label: "Description of Unplanned Actual Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "DM.ACTARMUD", hasVlm: false, origin: "Predecessor", core: "Permissible" },
  { id: "v6", standard: "ADaM", datasetName: "ADSL", variable: "ADAFL", label: "Anti-Drug Antibody Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if SAFFL='Y' and patient has non-missing post-baseline ADA sample assessment.", hasVlm: false, origin: "Derived", core: "Expected" },
  { id: "v7", standard: "ADaM", datasetName: "ADSL", variable: "AGE", label: "Age at Enrollment", type: "Num", length: 8, displayFormat: "8.1", derivation: "Derived from informed consent date and date of birth.", hasVlm: false, origin: "Predecessor", core: "Required", predecessor: { dataset: "DM", variable: "AGE", label: "Age", type: "Num", length: 8, derivation: "CRF: Demographics Page" } },
  { 
    id: "v8", 
    standard: "ADaM", 
    datasetName: "ADSL", 
    variable: "AGEGR1", 
    label: "Age Group (years)", 
    type: "Char", 
    length: 8, 
    displayFormat: "$8.", 
    derivation: "Categorized: <65, 65-74, ≥75", 
    hasVlm: false,
    origin: "Derived",
    core: "Expected",
    hasCodelist: true,
    codelistRef: "AGEGR1",
    codelistValues: [
      { value: "<65", label: "Under 65 years" },
      { value: "65-74", label: "65 to 74 years" },
      { value: ">=75", label: "75 years and older" },
    ],
  },
  { id: "v9", standard: "ADaM", datasetName: "ADSL", variable: "AGEGR2", label: "Age Group 2 (<65, >=65)", type: "Char", length: 8, displayFormat: "$8.", derivation: "Categorized: <65, >=65", hasVlm: false, origin: "Derived", core: "Expected" },
  { id: "v_agesexra", standard: "ADaM", datasetName: "ADSL", variable: "AGESEXRA", label: "Age/Sex/Race concatenated", type: "Char", length: 60, displayFormat: "$60.", derivation: 'Concatenate ADSL.AAGE, ADSL.SEX and ADSL.ARACE using "/" as separators.', hasVlm: false, origin: "Derived" },
  { id: "v_ageu", standard: "ADaM", datasetName: "ADSL", variable: "AGEU", label: "Age Units", type: "Char", length: 10, displayFormat: "$10.", derivation: "DM.AGEU", hasVlm: false, origin: "Predecessor" },
  { id: "v10", standard: "ADaM", datasetName: "ADSL", variable: "ALCSTAT", label: "Alcohol Consumption Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Direct copy from Medical History (MH) domain.", hasVlm: false, origin: "Assigned" },
  { id: "v11", standard: "ADaM", datasetName: "ADSL", variable: "ALCSTT", label: "Alcohol Status", type: "Char", length: 20, displayFormat: "$20.", derivation: 'Subset the data with SU.SUTRT = "ALCOHOL" If SUENRTPT="BEFORE" then ALCSTT="Former" else if SUENRTPT="ONGOING" then ALCSTT="Current" else if SUENRTPT="" and SUOCCUR="N" then ALCSTT="Never".', hasVlm: false, origin: "Derived" },
  { id: "v12", standard: "ADaM", datasetName: "ADLB", variable: "ANRLO", label: "Analysis Normal Range Lower Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Lower limit of normal range for the lab parameter.", hasVlm: false, origin: "Assigned" },
  { id: "v13", standard: "ADaM", datasetName: "ADLB", variable: "ANRHI", label: "Analysis Normal Range Upper Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Upper limit of normal range for the lab parameter.", hasVlm: false, origin: "Assigned" },
  { id: "v_arace", standard: "ADaM", datasetName: "ADSL", variable: "ARACE", label: "Analysis Race", type: "Char", length: 50, displayFormat: "$50.", derivation: 'Set to "American Indian or Alaska Native" if ADSL.RACE="AMERICAN INDIAN OR ALASKA NATIVE". else "Asian" if ADSL.RACE="ASIAN". else "Black or African American" if ADSL.RACE="BLACK OR AFRICAN AMERICAN". else "Native Hawaiian or Other Pacific Islander" if ADSL.RACE="NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER". else "White" if ADSL.RACE="WHITE". else "Multiple" if ADSL.RACE="MULTIPLE". else "Other" if ADSL.RACE="OTHER".', hasVlm: false, origin: "Derived" },
  { id: "v_aracen", standard: "ADaM", datasetName: "ADSL", variable: "ARACEN", label: "Analysis Race (N)", type: "Num", length: 8, displayFormat: "8.", derivation: 'Set to 1 if ADSL.ARACE="American Indian or Alaska Native". else set to 2 if ADSL.ARACE="Asian". else set to 3 if ADSL.ARACE="Black or African American". else set to 4 if ADSL.ARACE="Native Hawaiian or Other Pacific Islander". else set to 5 if ADSL.ARACE="White". else set to 6 if ADSL.ARACE="Multiple". else set to 7 if ADSL.ARACE="Other".', hasVlm: false, origin: "Derived" },
  { 
    id: "v14", 
    standard: "ADaM", 
    datasetName: "ADAE", 
    variable: "AREL", 
    label: "AE Relationship to Study Drug", 
    type: "Char", 
    length: 8, 
    displayFormat: "$8.", 
    derivation: "Related / Not Related / Possibly Related.", 
    hasVlm: false,
    origin: "Derived",
    core: "Expected",
    hasCodelist: true,
    codelistRef: "AREL",
    codelistValues: [
      { value: "NOT RELATED", label: "Not Related to Study Drug" },
      { value: "POSSIBLY RELATED", label: "Possibly Related to Study Drug" },
      { value: "RELATED", label: "Related to Study Drug" },
    ],
  },
  { id: "v_arm", standard: "ADaM", datasetName: "ADSL", variable: "ARM", label: "Description of Planned Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "DM.ARM", hasVlm: false, origin: "Predecessor" },
  { id: "v_armcd", standard: "ADaM", datasetName: "ADSL", variable: "ARMCD", label: "Planned Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "DM.ARMCD", hasVlm: false, origin: "Predecessor" },
  { id: "v_armnrs", standard: "ADaM", datasetName: "ADSL", variable: "ARMNRS", label: "Reason Arm and/or Actual Arm is Null", type: "Char", length: 60, displayFormat: "$60.", derivation: "DM.ARMNRS", hasVlm: false, origin: "Predecessor" },
  { id: "v15", standard: "ADaM", datasetName: "ADSL", variable: "ASEX", label: "Analysis Sex", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Set to "Male" if ADSL.SEX="M". else "Female" if ADSL.SEX="F".', hasVlm: false, origin: "Derived" },
  { id: "v_asexn", standard: "ADaM", datasetName: "ADSL", variable: "ASEXN", label: "Analysis Sex (N)", type: "Num", length: 8, displayFormat: "8.", derivation: 'Set to 1 if ADSL.ASEX="Male". else set to 2 if ADSL.ASEX="Female".', hasVlm: false, origin: "Derived" },
  { 
    id: "v16", 
    standard: "ADaM", 
    datasetName: "ADEXSUM", 
    variable: "ATOXGR", 
    label: "Analysis Toxicity Grade", 
    type: "Char", 
    length: 4, 
    displayFormat: "$4.", 
    derivation: "Toxicity grade applied to AVAL according to NCI-CTCAE v5.0.", 
    hasVlm: false,
    origin: "Derived",
    core: "Expected",
    hasCodelist: true,
    codelistRef: "ATOXGR",
    codelistValues: [
      { value: "0", label: "Grade 0 (Normal)" },
      { value: "1", label: "Grade 1 (Mild)" },
      { value: "2", label: "Grade 2 (Moderate)" },
      { value: "3", label: "Grade 3 (Severe)" },
      { value: "4", label: "Grade 4 (Life-threatening)" },
    ],
  },
  { 
    id: "v17", 
    standard: "ADaM", 
    datasetName: "ADEXSUM", 
    variable: "AVAL", 
    label: "Analysis Value", 
    type: "Num", 
    length: 8, 
    displayFormat: "8.2", 
    derivation: "Varies by PARAM; see Value Level Metadata for parameter-specific conditional derivation logic.", 
    hasVlm: true,
    origin: "Derived",
    core: "Required",
    vlmParameters: [
      { param: "DOSE", condition: "PARAMCD == 'DOSE'", derivation: "Cumulative dose administered in mg" },
      { param: "DURATION", condition: "PARAMCD == 'DURATION'", derivation: "Duration of treatment exposure in days" },
      { param: "DI", condition: "PARAMCD == 'DI'", derivation: "Dose Intensity (mg/day)" },
      { param: "RDI", condition: "PARAMCD == 'RDI'", derivation: "Relative Dose Intensity (%)" },
    ],
  },
  { 
    id: "v18", 
    standard: "ADaM", 
    datasetName: "ADLB", 
    variable: "AVAL", 
    label: "Analysis Value (Lab)", 
    type: "Num", 
    length: 8, 
    displayFormat: "8.3", 
    derivation: "Lab result in standard units. VLM defines per-PARAM logic.", 
    hasVlm: true,
    origin: "Derived",
    core: "Required",
    vlmParameters: [
      { param: "ALT", condition: "PARAMCD == 'ALT'", derivation: "Alanine Aminotransferase in U/L" },
      { param: "AST", condition: "PARAMCD == 'AST'", derivation: "Aspartate Aminotransferase in U/L" },
      { param: "BILI", condition: "PARAMCD == 'BILI'", derivation: "Total Bilirubin in umol/L" },
      { param: "CREAT", condition: "PARAMCD == 'CREAT'", derivation: "Serum Creatinine in umol/L" },
    ],
  },
  { id: "v19", standard: "ADaM", datasetName: "ADTTE", variable: "AVAL", label: "Analysis Value (Time)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time to event in days/months. VLM defines per-PARAM logic.", hasVlm: true, origin: "Derived", core: "Required" },
  { id: "v20", standard: "ADaM", datasetName: "ADSL", variable: "BMIBL", label: "Baseline Body Mass Index (kg/m2)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to ADSL.WEIGHTBL / ((ADSL.HEIGHTBL / 100)**2) rounded to 1 decimal place.", hasVlm: false, origin: "Derived", core: "Expected" },
  { id: "v21", standard: "ADaM", datasetName: "ADSL", variable: "BMIGR1", label: "Baseline BMI Group (<25, 25-<30, >=30)", type: "Char", length: 12, displayFormat: "$12.", derivation: 'Set to "<25" if BMIBL<25; "25-<30" if 25<=BMIBL<30; ">=30" if BMIBL>=30.', hasVlm: false, origin: "Derived" },
  { id: "v22", standard: "ADaM", datasetName: "ADSL", variable: "CIGPKYR", label: "Cigarette Pack Years", type: "Num", length: 8, displayFormat: "8.1", derivation: "Calculated from (Cigarettes per day / 20) * Years smoked.", hasVlm: false, origin: "Derived" },
  { id: "v23", standard: "ADaM", datasetName: "ADTTE", variable: "CNSR", label: "Censor Indicator", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = Event, 1 = Censored.", hasVlm: true, origin: "Derived", core: "Required" },
  { id: "v24", standard: "ADaM", datasetName: "ADRESP", variable: "COHORT", label: "Study Cohort", type: "Char", length: 20, displayFormat: "$20.", derivation: "Dose expansion / escalation cohort identifier.", hasVlm: false, origin: "Assigned" },
  { id: "v25", standard: "ADaM", datasetName: "ADSL", variable: "ECOBLG1N", label: "Baseline ECOG Performance Score Numeric", type: "Num", length: 8, displayFormat: "8.", derivation: "Numeric value of baseline ECOG Performance Status (0, 1, 2, 3).", hasVlm: false },
  { id: "v26", standard: "ADaM", datasetName: "ADSL", variable: "ECOGBL", label: "Baseline ECOG Performance Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Baseline ECOG score collected at Day 1 / Screening.", hasVlm: false },
  { id: "v27", standard: "ADaM", datasetName: "ADSL", variable: "ECOGBLN", label: "Baseline ECOG Status Code", type: "Num", length: 8, displayFormat: "8.", derivation: "Numeric code for ECOG status (0, 1, 2, 3, 4).", hasVlm: false },
  { id: "v28", standard: "ADaM", datasetName: "ADRESP", variable: "FASFL", label: "Full Analysis Set Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if subject received at least one dose of study drug and has baseline assessment.", hasVlm: false },
  { id: "v29", standard: "ADaM", datasetName: "ADSL", variable: "HEIGHTBL", label: "Baseline Height (cm)", type: "Num", length: 8, displayFormat: "8.1", derivation: "VS.VSSTRESN where VSTESTCD='HEIGHT' and VSTPT='BASELINE'.", hasVlm: false },
  { id: "v30", standard: "ADaM", datasetName: "ADSL", variable: "ITT3LFL", label: "ITT Population Flag 3rd Line", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' for third-line Intent-to-Treat randomized subjects.", hasVlm: false },
  { id: "v31", standard: "ADaM", datasetName: "ADSL", variable: "ITTFL", label: "Intent-to-Treat Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject is randomized.", hasVlm: false },
  { id: "v32", standard: "ADaM", datasetName: "ADSL", variable: "NICPKYR", label: "Nicotine Pack Years", type: "Num", length: 8, displayFormat: "8.1", derivation: "Total nicotine pack years calculated from consumption history.", hasVlm: false },
  { id: "v33", standard: "ADaM", datasetName: "ADSL", variable: "NICSTT", label: "Nicotine Smoking Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Never, Former, Current smoker.", hasVlm: false },
  { id: "v34", standard: "ADaM", datasetName: "ADSL", variable: "NICSYN", label: "Nicotine Usage Flag (Y/N)", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if patient has documented history of nicotine use.", hasVlm: false },
  { id: "v35", standard: "ADaM", datasetName: "ADSL", variable: "NICTYP", label: "Nicotine Product Type", type: "Char", length: 30, displayFormat: "$30.", derivation: "Cigarettes, Cigars, E-cigarettes, Chewing tobacco.", hasVlm: false },
  { id: "v36", standard: "ADaM", datasetName: "ADRESP", variable: "OCCRVRFL", label: "Overall Confirmed Complete Response Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if confirmed complete response criteria met according to RECIST 1.1.", hasVlm: false },
  { id: "v37", standard: "ADaM", datasetName: "ADRESP", variable: "OCPRVRFL", label: "Overall Confirmed Partial Response Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if confirmed partial response criteria met according to RECIST 1.1.", hasVlm: false },
  { id: "v38", standard: "ADaM", datasetName: "ADEXSUM", variable: "PARAM", label: "Parameter Name", type: "Char", length: 40, displayFormat: "$40.", derivation: "Defines the exposure metric being summarized.", hasVlm: true },
  { id: "v39", standard: "ADaM", datasetName: "ADEXSUM", variable: "PARAMCD", label: "Parameter Code", type: "Char", length: 8, displayFormat: "$8.", derivation: "Short code for PARAM.", hasVlm: false },
  { id: "v40", standard: "ADaM", datasetName: "ADRESP", variable: "PARQUAL", label: "Parameter Qualifier", type: "Char", length: 40, displayFormat: "$40.", derivation: "Qualifier indicating 'INDEPENDENT ASSESSOR' or 'INVESTIGATOR'.", hasVlm: false },
  { id: "v41", standard: "ADaM", datasetName: "ADSL", variable: "PRHER2FL", label: "Prior HER2 Therapy Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior anti-HER2 targeted therapy documented.", hasVlm: false },
  { id: "v42", standard: "ADaM", datasetName: "ADSL", variable: "PRIMMFL", label: "Prior Immunotherapy Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior checkpoint inhibitor or immuno-oncology treatment documented.", hasVlm: false },
  { id: "v43", standard: "ADaM", datasetName: "ADSL", variable: "PRSYSG1", label: "Prior Systemic Therapy Regimen Group 1", type: "Char", length: 30, displayFormat: "$30.", derivation: "Categorized: 1 line, 2 lines, >=3 lines of prior systemic anticancer therapy.", hasVlm: false },
  { id: "v44", standard: "ADaM", datasetName: "ADSL", variable: "PRTOPOFL", label: "Prior Topoisomerase Inhibitor Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior topoisomerase I/II inhibitor therapy received.", hasVlm: false },
  { 
    id: "v45", 
    standard: "ADaM", 
    datasetName: "ADSL", 
    variable: "RACE", 
    label: "Race", 
    type: "Char", 
    length: 32, 
    displayFormat: "$32.", 
    derivation: "DM.RACE", 
    hasVlm: false,
    origin: "Predecessor",
    core: "Required",
    hasCodelist: true,
    codelistRef: "RACE",
    codelistValues: [
      { value: "WHITE", label: "White" },
      { value: "BLACK OR AFRICAN AMERICAN", label: "Black or African American" },
      { value: "ASIAN", label: "Asian" },
      { value: "AMERICAN INDIAN OR ALASKA NATIVE", label: "American Indian or Alaska Native" },
      { value: "MULTIPLE", label: "Multiple" },
      { value: "OTHER", label: "Other" },
    ],
    predecessor: { dataset: "DM", variable: "RACE", label: "Race", type: "Char", length: 40, derivation: "CRF: Demographics Page", codelist: "RACE" }
  },
  { id: "v46", standard: "ADaM", datasetName: "ADSL", variable: "SAFFL", label: "Safety Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject received at least 1 dose of study drug.", hasVlm: false, origin: "Derived", core: "Required" },
  { 
    id: "v47", 
    standard: "ADaM", 
    datasetName: "ADSL", 
    variable: "SEX", 
    label: "Sex", 
    type: "Char", 
    length: 1, 
    displayFormat: "$1.", 
    derivation: "DM.SEX", 
    hasVlm: false,
    origin: "Predecessor",
    core: "Required",
    hasCodelist: true,
    codelistRef: "SEX",
    codelistValues: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
      { value: "U", label: "Unknown" },
      { value: "UNDIFFERENTIATED", label: "Undifferentiated" },
    ],
    predecessor: { dataset: "DM", variable: "SEX", label: "Sex", type: "Char", length: 1, derivation: "CRF: Demographics Page", codelist: "SEX" }
  },
  { id: "v48", standard: "ADaM", datasetName: "ADSL", variable: "SMOKSTAT", label: "Smoking Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Direct copy from Medical History (MH) domain.", hasVlm: false },
  { id: "v49", standard: "ADaM", datasetName: "ADSL", variable: "STRATA1", label: "Stratification Factor 1", type: "Char", length: 16, displayFormat: "$16.", derivation: "Region (Asia / Non-Asia).", hasVlm: false },
  { id: "v50", standard: "ADaM", datasetName: "ADSL", variable: "STUDYID", label: "Study Identifier", type: "Char", length: 20, displayFormat: "$20.", derivation: "Copied from SDTM DM.STUDYID", hasVlm: false },
  { id: "v51", standard: "ADaM", datasetName: "ADSL", variable: "TRT01P", label: "Planned Treatment", type: "Char", length: 20, displayFormat: "$20.", derivation: "Treatment arm as planned in randomization.", hasVlm: false },
  { id: "v52", standard: "ADaM", datasetName: "ADSL", variable: "TRT01PN", label: "Planned Treatment Code", type: "Num", length: 8, displayFormat: "8.", derivation: "1 = Treatment Arm A, 2 = Treatment Arm B.", hasVlm: false },
  { id: "v53", standard: "ADaM", datasetName: "ADAE", variable: "TRTEMFL", label: "Treatment Emergent AE Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if onset date >= first dose date and <= last dose date + 30 days.", hasVlm: false },
  { id: "v54", standard: "ADaM", datasetName: "ADSL", variable: "TUMGRADE", label: "Tumour Grade", type: "Char", length: 20, displayFormat: "$20.", derivation: "FA.FASTRESC when FA.FASCAT='PATHOLOGY FINDINGS'.", hasVlm: false },
  { id: "v55", standard: "ADaM", datasetName: "ADSL", variable: "USUBJID", label: "Unique Subject Identifier", type: "Char", length: 30, displayFormat: "$30.", derivation: "DM.USUBJID", hasVlm: false },
  { id: "v56", standard: "ADaM", datasetName: "ADSL", variable: "WEIGHTBL", label: "Baseline Weight (kg)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to the latest non missing VS.VSSTRESN where VSTESTCD='WEIGHT' and VSBLFL='Y'.", hasVlm: false },
  { id: "v57", standard: "ADaM", datasetName: "ADSL", variable: "WGHBLG1N", label: "Pooled Baseline Weight Group 1 Numeric", type: "Num", length: 8, displayFormat: "8.", derivation: "Set to 1 if ADSL.WTBLG1='<65', else set to 2 if ADSL.WTBLG1='>=65'.", hasVlm: false },
  { id: "v58", standard: "ADaM", datasetName: "ADSL", variable: "WGHTBLG1", label: "Pooled Baseline Weight Group 1", type: "Char", length: 12, displayFormat: "$12.", derivation: "Set to '<65' if ADSL.WEIGHTBL<65, else '>=65'.", hasVlm: false },
  { id: "v59", standard: "ADaM", datasetName: "ADSL", variable: "WGTBLU", label: "Baseline Weight Unit", type: "Char", length: 10, displayFormat: "$10.", derivation: "VS.VSSTRESU where VSTESTCD='WEIGHT'.", hasVlm: false },
  { id: "v60", standard: "ADaM", datasetName: "ADSL", variable: "WGTGR1", label: "Weight Group 1 (<65, >=65 kg)", type: "Char", length: 12, displayFormat: "$12.", derivation: "Categorized weight: <65 kg, >=65 kg.", hasVlm: false },
  { id: "v61", standard: "ADaM", datasetName: "ADSL", variable: "WHSTTYP", label: "WHO Classification", type: "Char", length: 40, displayFormat: "$40.", derivation: "Propercase of FA.FASTRESC when FA.FASCAT='HISTOLOGY'.", hasVlm: false },

  // --- SDTM Variables ---
  { id: "s1", standard: "SDTM", datasetName: "DM", variable: "STUDYID", label: "Study Identifier", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF / Protocol", hasVlm: false },
  { id: "s2", standard: "SDTM", datasetName: "DM", variable: "DOMAIN", label: "Domain Abbreviation", type: "Char", length: 2, displayFormat: "$2.", derivation: 'Assigned: "DM"', hasVlm: false },
  { id: "s3", standard: "SDTM", datasetName: "DM", variable: "USUBJID", label: "Unique Subject Identifier", type: "Char", length: 40, displayFormat: "$40.", derivation: 'Concatenate DM.STUDYID, "-", DM.SITEID, "-", DM.SUBJID', hasVlm: false },
  { id: "s4", standard: "SDTM", datasetName: "DM", variable: "SUBJID", label: "Subject Identifier for the Study", type: "Char", length: 10, displayFormat: "$10.", derivation: "CRF: Demographics Page", hasVlm: false },
  { id: "s5", standard: "SDTM", datasetName: "DM", variable: "RFSTDTC", label: "Subject Reference Start Date/Time", type: "Char", length: 20, displayFormat: "$20.", derivation: "First dose date recorded in EX domain", hasVlm: false },
  { id: "s6", standard: "SDTM", datasetName: "DM", variable: "RFENDTC", label: "Subject Reference End Date/Time", type: "Char", length: 20, displayFormat: "$20.", derivation: "Last participation / dose date recorded in study", hasVlm: false },
  { id: "s7", standard: "SDTM", datasetName: "DM", variable: "SITEID", label: "Study Site Identifier", type: "Char", length: 10, displayFormat: "$10.", derivation: "CRF: Investigational Site Number", hasVlm: false },
  { id: "s8", standard: "SDTM", datasetName: "DM", variable: "AGE", label: "Age", type: "Num", length: 8, displayFormat: "8.", derivation: "CRF: Demographics Page (Age at screening)", hasVlm: false },
  { id: "s9", standard: "SDTM", datasetName: "DM", variable: "AGEU", label: "Age Units", type: "Char", length: 10, displayFormat: "$10.", derivation: 'CRF / Codelist: "YEARS"', hasVlm: false },
  { id: "s10", standard: "SDTM", datasetName: "DM", variable: "SEX", label: "Sex", type: "Char", length: 1, displayFormat: "$1.", derivation: 'CRF / Codelist: "M", "F"', hasVlm: false },
  { id: "s11", standard: "SDTM", datasetName: "DM", variable: "RACE", label: "Race", type: "Char", length: 40, displayFormat: "$40.", derivation: "CRF: Demographics Page", hasVlm: false },
  { id: "s12", standard: "SDTM", datasetName: "DM", variable: "ETHNIC", label: "Ethnicity", type: "Char", length: 40, displayFormat: "$40.", derivation: "CRF: Demographics Page", hasVlm: false },
  { id: "s13", standard: "SDTM", datasetName: "DM", variable: "ARMCD", label: "Planned Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "Randomization record", hasVlm: false },
  { id: "s14", standard: "SDTM", datasetName: "DM", variable: "ARM", label: "Description of Planned Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "Randomization record", hasVlm: false },
  { id: "s15", standard: "SDTM", datasetName: "DM", variable: "ACTARMCD", label: "Actual Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "EX domain drug accountability record", hasVlm: false },
  { id: "s16", standard: "SDTM", datasetName: "DM", variable: "ACTARM", label: "Description of Actual Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "EX domain drug accountability record", hasVlm: false },
  { id: "s17", standard: "SDTM", datasetName: "DM", variable: "COUNTRY", label: "Country", type: "Char", length: 3, displayFormat: "$3.", derivation: "CRF / ISO 3166-1 alpha-3 code", hasVlm: false },

  { id: "s18", standard: "SDTM", datasetName: "AE", variable: "AESEQ", label: "Sequence Number", type: "Num", length: 8, displayFormat: "8.", derivation: "Assigned sequential number for each subject AE record", hasVlm: false },
  { id: "s19", standard: "SDTM", datasetName: "AE", variable: "AETERM", label: "Reported Term for the Adverse Event", type: "Char", length: 200, displayFormat: "$200.", derivation: "CRF: AE verbatim term", hasVlm: false },
  { id: "s20", standard: "SDTM", datasetName: "AE", variable: "AEDECOD", label: "Dictionary-Derived Term", type: "Char", length: 100, displayFormat: "$100.", derivation: "MedDRA dictionary coding (Preferred Term)", hasVlm: false },
  { id: "s21", standard: "SDTM", datasetName: "AE", variable: "AEBODSYS", label: "Body System or Organ Class", type: "Char", length: 100, displayFormat: "$100.", derivation: "MedDRA dictionary coding (System Organ Class)", hasVlm: false },
  { id: "s22", standard: "SDTM", datasetName: "AE", variable: "AESEV", label: "Severity/Intensity", type: "Char", length: 20, displayFormat: "$20.", derivation: 'CRF / Codelist: "MILD", "MODERATE", "SEVERE"', hasVlm: false },
  { id: "s23", standard: "SDTM", datasetName: "AE", variable: "AESER", label: "Serious Event", type: "Char", length: 1, displayFormat: "$1.", derivation: 'CRF: "Y", "N"', hasVlm: false },
  { id: "s24", standard: "SDTM", datasetName: "AE", variable: "AEREL", label: "Causality", type: "Char", length: 30, displayFormat: "$30.", derivation: "CRF: Relationship to investigational product", hasVlm: false },
  { id: "s25", standard: "SDTM", datasetName: "AE", variable: "AESTDTC", label: "Start Date/Time of Adverse Event", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: AE Start Date in ISO 8601 format", hasVlm: false },
  { id: "s26", standard: "SDTM", datasetName: "AE", variable: "AEENDTC", label: "End Date/Time of Adverse Event", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: AE End Date in ISO 8601 format", hasVlm: false },
  { id: "s27", standard: "SDTM", datasetName: "AE", variable: "AEOUT", label: "Outcome of Adverse Event", type: "Char", length: 40, displayFormat: "$40.", derivation: "CRF: Recovered/Resolved, Not Recovered, Fatal, etc.", hasVlm: false },

  { id: "s28", standard: "SDTM", datasetName: "LB", variable: "LBSEQ", label: "Sequence Number", type: "Num", length: 8, displayFormat: "8.", derivation: "Assigned sequential number for each lab assessment", hasVlm: false },
  { id: "s29", standard: "SDTM", datasetName: "LB", variable: "LBTESTCD", label: "Lab Test or Examination Short Name", type: "Char", length: 8, displayFormat: "$8.", derivation: "Codelist / CDISC CT (e.g. ALT, AST, HGB)", hasVlm: false },
  { id: "s30", standard: "SDTM", datasetName: "LB", variable: "LBTEST", label: "Lab Test or Examination Name", type: "Char", length: 40, displayFormat: "$40.", derivation: "Codelist / Central Lab", hasVlm: false },
  { id: "s31", standard: "SDTM", datasetName: "LB", variable: "LBCAT", label: "Category for Lab Test", type: "Char", length: 40, displayFormat: "$40.", derivation: 'CRF / Central Lab: "CHEMISTRY", "HEMATOLOGY", "URINALYSIS"', hasVlm: false },
  { id: "s32", standard: "SDTM", datasetName: "LB", variable: "LBORRES", label: "Result or Finding in Original Units", type: "Char", length: 40, displayFormat: "$40.", derivation: "Central / Local Lab result as reported", hasVlm: false },
  { id: "s33", standard: "SDTM", datasetName: "LB", variable: "LBORRESU", label: "Original Units", type: "Char", length: 20, displayFormat: "$20.", derivation: "Central / Local Lab original unit string", hasVlm: false },
  { id: "s34", standard: "SDTM", datasetName: "LB", variable: "LBSTRESC", label: "Character Result/Finding in Std Format", type: "Char", length: 40, displayFormat: "$40.", derivation: "Standardized character result", hasVlm: false },
  { id: "s35", standard: "SDTM", datasetName: "LB", variable: "LBSTRESN", label: "Numeric Result/Finding in Standard Units", type: "Num", length: 8, displayFormat: "8.3", derivation: "Standardized numeric result", hasVlm: false },
  { id: "s36", standard: "SDTM", datasetName: "LB", variable: "LBSTRESU", label: "Standard Units", type: "Char", length: 20, displayFormat: "$20.", derivation: "CDISC CT Standard Units (e.g. g/dL, U/L)", hasVlm: false },
  { id: "s37", standard: "SDTM", datasetName: "LB", variable: "LBNRIND", label: "Reference Range Indicator", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Codelist: "LOW", "NORMAL", "HIGH"', hasVlm: false },

  { id: "s38", standard: "SDTM", datasetName: "VS", variable: "VSTESTCD", label: "Vital Signs Test Short Name", type: "Char", length: 8, displayFormat: "$8.", derivation: 'CRF / CDISC CT: "HEIGHT", "WEIGHT", "SYSBP", "DIABP", "PULSE"', hasVlm: false },
  { id: "s39", standard: "SDTM", datasetName: "VS", variable: "VSTEST", label: "Vital Signs Test Name", type: "Char", length: 40, displayFormat: "$40.", derivation: "CRF: Vital Signs page", hasVlm: false },
  { id: "s40", standard: "SDTM", datasetName: "VS", variable: "VSORRES", label: "Result or Finding in Original Units", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: Vital Signs measured value", hasVlm: false },
  { id: "s41", standard: "SDTM", datasetName: "VS", variable: "VSSTRESN", label: "Numeric Result/Finding in Standard Units", type: "Num", length: 8, displayFormat: "8.1", derivation: "Standardized numeric vital sign value", hasVlm: false },
  { id: "s42", standard: "SDTM", datasetName: "VS", variable: "VSSTRESU", label: "Standard Units", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Standardized unit: "cm", "kg", "mmHg", "beats/min"', hasVlm: false },
  { id: "s43", standard: "SDTM", datasetName: "VS", variable: "VSBLFL", label: "Baseline Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: 'Set to "Y" for last non-missing assessment on/prior to first dose', hasVlm: false },

  { id: "s44", standard: "SDTM", datasetName: "CM", variable: "CMTRT", label: "Reported Name of Drug, Med, or Therapy", type: "Char", length: 200, displayFormat: "$200.", derivation: "CRF: Concomitant Medication verbatim name", hasVlm: false },
  { id: "s45", standard: "SDTM", datasetName: "CM", variable: "CMDECOD", label: "Standardized Medication Name", type: "Char", length: 100, displayFormat: "$100.", derivation: "WHO Drug dictionary Preferred Name", hasVlm: false },
  { id: "s46", standard: "SDTM", datasetName: "CM", variable: "CMINDC", label: "Indication", type: "Char", length: 100, displayFormat: "$100.", derivation: "CRF: Reason for medication use", hasVlm: false },
  { id: "s47", standard: "SDTM", datasetName: "CM", variable: "CMDOSE", label: "Dose per Administration", type: "Num", length: 8, displayFormat: "8.", derivation: "CRF: Medication dose value", hasVlm: false },
  { id: "s48", standard: "SDTM", datasetName: "CM", variable: "CMDOSU", label: "Dose Units", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: mg, mL, etc.", hasVlm: false },
  { id: "s49", standard: "SDTM", datasetName: "CM", variable: "CMDOSFRQ", label: "Dosing Frequency per Cycle", type: "Char", length: 20, displayFormat: "$20.", derivation: 'CRF / Codelist: "QD", "BID", "TID", "PRN"', hasVlm: false },
  { id: "s50", standard: "SDTM", datasetName: "CM", variable: "CMROUTE", label: "Route of Administration", type: "Char", length: 20, displayFormat: "$20.", derivation: 'CRF / Codelist: "ORAL", "INTRAVENOUS", "TOPICAL"', hasVlm: false },
  { id: "s51", standard: "SDTM", datasetName: "CM", variable: "CMSTDTC", label: "Start Date/Time of Medication", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: Medication start date in ISO 8601 format", hasVlm: false },
  { id: "s52", standard: "SDTM", datasetName: "CM", variable: "CMENDTC", label: "End Date/Time of Medication", type: "Char", length: 20, displayFormat: "$20.", derivation: "CRF: Medication end date in ISO 8601 format", hasVlm: false },
];

const mockVlmData: VlmRow[] = [
  { id: "vlm1", datasetName: "ADEXSUM", parameterName: "Duration of Exposure (Months)", whereClause: "PARAMCD='DUREXP'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.2", derivation: "Total exposure (months) = (min(last dose date + 20, date of death, date of DCO) – first dose date + 1) / (365.25/12)" },
  { id: "vlm2", datasetName: "ADEXSUM", parameterName: "Actual Duration of Exposure (Months)", whereClause: "PARAMCD='ACTDUREXP'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.2", derivation: "Actual exposure = total exposure – total duration of dose interruptions. Ref SAP 4.7.1.1" },
  { id: "vlm3", datasetName: "ADEXSUM", parameterName: "Total Dose Received (mg)", whereClause: "PARAMCD='TOTDOSE'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Sum of all individual dose amounts recorded in EX domain." },
  { id: "vlm4", datasetName: "ADLB", parameterName: "Hemoglobin (g/dL)", whereClause: "PARAMCD='HGB'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Result value in g/dL. If original unit is g/L, multiply by 0.1." },
  { id: "vlm5", datasetName: "ADLB", parameterName: "ALT (U/L)", whereClause: "PARAMCD='ALT'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Result value in U/L. No unit conversion required." },
  { id: "vlm6", datasetName: "ADTTE", parameterName: "Overall Survival", whereClause: "PARAMCD='OS'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time (months) from randomization to death. Censored at last known alive date." },
  { id: "vlm7", datasetName: "ADTTE", parameterName: "Progression-Free Survival", whereClause: "PARAMCD='PFS'", variableName: "AVAL", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time (months) from randomization to first documented progression or death, whichever occurs first." },
  { id: "vlm8", datasetName: "ADTTE", parameterName: "Overall Survival", whereClause: "PARAMCD='OS'", variableName: "CNSR", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = death confirmed, 1 = alive at last follow-up (censored)." },
  { id: "vlm9", datasetName: "ADTTE", parameterName: "Progression-Free Survival", whereClause: "PARAMCD='PFS'", variableName: "CNSR", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = progression or death, 1 = no event and censored at last assessment." },
];

export const mockAdamCodeListData: AdamCodeListRow[] = [
  {
    id: "adam_cl_1",
    datasetName: "ADSL",
    codelist: "AGEGR1",
    codelistName: "Pooled Age Group 1",
    codelistType: "User-defined",
    codelistValue: "<65",
    codelistValueLabel: "<65 years",
    cdiscCodelistCode: "C66742",
    cdiscCodelistValueCode: "C12345",
    rank: 1,
    orderNumber: 1,
    extensible: "No",
    definition: "Age grouping for non-elderly subjects under 65 years",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_2",
    datasetName: "ADSL",
    codelist: "AGEGR1",
    codelistName: "Pooled Age Group 1",
    codelistType: "User-defined",
    codelistValue: "65-74",
    codelistValueLabel: "65 to 74 years",
    cdiscCodelistCode: "C66742",
    cdiscCodelistValueCode: "C12346",
    rank: 2,
    orderNumber: 2,
    extensible: "No",
    definition: "Age grouping for elderly subjects between 65 and 74 years",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_3",
    datasetName: "ADSL",
    codelist: "AGEGR1",
    codelistName: "Pooled Age Group 1",
    codelistType: "User-defined",
    codelistValue: ">=75",
    codelistValueLabel: "75 years and older",
    cdiscCodelistCode: "C66742",
    cdiscCodelistValueCode: "C12347",
    rank: 3,
    orderNumber: 3,
    extensible: "No",
    definition: "Age grouping for advanced elderly subjects 75 years and older",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_4",
    datasetName: "ADSL",
    codelist: "BMIGR1",
    codelistName: "Baseline BMI Group 1",
    codelistType: "User-defined",
    codelistValue: "<25",
    codelistValueLabel: "Underweight / Normal (<25 kg/m2)",
    cdiscCodelistCode: "-",
    cdiscCodelistValueCode: "-",
    rank: 1,
    orderNumber: 1,
    extensible: "No",
    definition: "Baseline Body Mass Index less than 25 kg/m2",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_5",
    datasetName: "ADSL",
    codelist: "BMIGR1",
    codelistName: "Baseline BMI Group 1",
    codelistType: "User-defined",
    codelistValue: "25-<30",
    codelistValueLabel: "Overweight (25 to <30 kg/m2)",
    cdiscCodelistCode: "-",
    cdiscCodelistValueCode: "-",
    rank: 2,
    orderNumber: 2,
    extensible: "No",
    definition: "Baseline Body Mass Index between 25 and 30 kg/m2",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_6",
    datasetName: "ADSL",
    codelist: "BMIGR1",
    codelistName: "Baseline BMI Group 1",
    codelistType: "User-defined",
    codelistValue: ">=30",
    codelistValueLabel: "Obese (>=30 kg/m2)",
    cdiscCodelistCode: "-",
    cdiscCodelistValueCode: "-",
    rank: 3,
    orderNumber: 3,
    extensible: "No",
    definition: "Baseline Body Mass Index greater than or equal to 30 kg/m2",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_7",
    datasetName: "ADAE",
    codelist: "AREL",
    codelistName: "Analysis AE Causality Scale",
    codelistType: "CDISC CT",
    codelistValue: "NOT RELATED",
    codelistValueLabel: "Not Related to Study Drug",
    cdiscCodelistCode: "C66768",
    cdiscCodelistValueCode: "C53256",
    rank: 1,
    orderNumber: 1,
    extensible: "No",
    definition: "Investigator assessed relationship as not related to study intervention",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_8",
    datasetName: "ADAE",
    codelist: "AREL",
    codelistName: "Analysis AE Causality Scale",
    codelistType: "CDISC CT",
    codelistValue: "POSSIBLY RELATED",
    codelistValueLabel: "Possibly Related to Study Drug",
    cdiscCodelistCode: "C66768",
    cdiscCodelistValueCode: "C53257",
    rank: 2,
    orderNumber: 2,
    extensible: "No",
    definition: "Investigator assessed relationship as possibly related to study intervention",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_9",
    datasetName: "ADAE",
    codelist: "AREL",
    codelistName: "Analysis AE Causality Scale",
    codelistType: "CDISC CT",
    codelistValue: "PROBABLY RELATED",
    codelistValueLabel: "Probably Related to Study Drug",
    cdiscCodelistCode: "C66768",
    cdiscCodelistValueCode: "C53258",
    rank: 3,
    orderNumber: 3,
    extensible: "No",
    definition: "Investigator assessed relationship as probably related to study intervention",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_10",
    datasetName: "ADEXSUM",
    codelist: "ATOXGR",
    codelistName: "NCI CTCAE v5.0 Toxicity Grade",
    codelistType: "CDISC CT",
    codelistValue: "1",
    codelistValueLabel: "Grade 1 (Mild)",
    cdiscCodelistCode: "C87162",
    cdiscCodelistValueCode: "C49760",
    rank: 1,
    orderNumber: 1,
    extensible: "No",
    definition: "Mild; asymptomatic or mild symptoms; clinical or diagnostic observations only",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_11",
    datasetName: "ADEXSUM",
    codelist: "ATOXGR",
    codelistName: "NCI CTCAE v5.0 Toxicity Grade",
    codelistType: "CDISC CT",
    codelistValue: "2",
    codelistValueLabel: "Grade 2 (Moderate)",
    cdiscCodelistCode: "C87162",
    cdiscCodelistValueCode: "C49761",
    rank: 2,
    orderNumber: 2,
    extensible: "No",
    definition: "Moderate; minimal, local or noninvasive intervention indicated",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_12",
    datasetName: "ADEXSUM",
    codelist: "ATOXGR",
    codelistName: "NCI CTCAE v5.0 Toxicity Grade",
    codelistType: "CDISC CT",
    codelistValue: "3",
    codelistValueLabel: "Grade 3 (Severe)",
    cdiscCodelistCode: "C87162",
    cdiscCodelistValueCode: "C49762",
    rank: 3,
    orderNumber: 3,
    extensible: "No",
    definition: "Severe or medically significant but not immediately life-threatening; hospitalization indicated",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_13",
    datasetName: "ADTTE",
    codelist: "CNSR",
    codelistName: "Time-to-Event Censor Flag",
    codelistType: "CDISC CT",
    codelistValue: "0",
    codelistValueLabel: "Event Occurred",
    cdiscCodelistCode: "C81223",
    cdiscCodelistValueCode: "C81224",
    rank: 0,
    orderNumber: 1,
    extensible: "No",
    definition: "Analysis event of interest occurred during observation window",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
  {
    id: "adam_cl_14",
    datasetName: "ADTTE",
    codelist: "CNSR",
    codelistName: "Time-to-Event Censor Flag",
    codelistType: "CDISC CT",
    codelistValue: "1",
    codelistValueLabel: "Censored",
    cdiscCodelistCode: "C81223",
    cdiscCodelistValueCode: "C81225",
    rank: 1,
    orderNumber: 2,
    extensible: "No",
    definition: "Subject censored at last known event-free contact date",
    used: "Yes",
    deliveryPart1Mini: "Yes",
    deliveryPart1: "Required",
  },
];

export const mockSdtmCodeListData: SdtmCodeListRow[] = [
  {
    id: "sdtm_cl_1",
    datasetName: "DM",
    codelist: "SEX",
    codelistName: "Sex",
    codelistValue: "M",
    codelistValueLabel: "Male",
    codelistCode: "C66731",
    codelistValueCode: "C20197",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_2",
    datasetName: "DM",
    codelist: "SEX",
    codelistName: "Sex",
    codelistValue: "F",
    codelistValueLabel: "Female",
    codelistCode: "C66731",
    codelistValueCode: "C16576",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_3",
    datasetName: "DM",
    codelist: "SEX",
    codelistName: "Sex",
    codelistValue: "U",
    codelistValueLabel: "Unknown",
    codelistCode: "C66731",
    codelistValueCode: "C17998",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 3,
  },
  {
    id: "sdtm_cl_4",
    datasetName: "DM",
    codelist: "NY",
    codelistName: "No Yes Response",
    codelistValue: "Y",
    codelistValueLabel: "Yes",
    codelistCode: "C66741",
    codelistValueCode: "C49488",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_5",
    datasetName: "DM",
    codelist: "NY",
    codelistName: "No Yes Response",
    codelistValue: "N",
    codelistValueLabel: "No",
    codelistCode: "C66741",
    codelistValueCode: "C49487",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_6",
    datasetName: "DM",
    codelist: "RACE",
    codelistName: "Race",
    codelistValue: "ASIAN",
    codelistValueLabel: "Asian",
    codelistCode: "C74457",
    codelistValueCode: "C41260",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_7",
    datasetName: "DM",
    codelist: "RACE",
    codelistName: "Race",
    codelistValue: "WHITE",
    codelistValueLabel: "White",
    codelistCode: "C74457",
    codelistValueCode: "C41261",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_8",
    datasetName: "DM",
    codelist: "RACE",
    codelistName: "Race",
    codelistValue: "BLACK OR AFRICAN AMERICAN",
    codelistValueLabel: "Black or African American",
    codelistCode: "C74457",
    codelistValueCode: "C16352",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 3,
  },
  {
    id: "sdtm_cl_9",
    datasetName: "AE",
    codelist: "AESEV",
    codelistName: "Severity/Intensity Scale",
    codelistValue: "MILD",
    codelistValueLabel: "Mild",
    codelistCode: "C66769",
    codelistValueCode: "C49760",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_10",
    datasetName: "AE",
    codelist: "AESEV",
    codelistName: "Severity/Intensity Scale",
    codelistValue: "MODERATE",
    codelistValueLabel: "Moderate",
    codelistCode: "C66769",
    codelistValueCode: "C49761",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_11",
    datasetName: "AE",
    codelist: "AESEV",
    codelistName: "Severity/Intensity Scale",
    codelistValue: "SEVERE",
    codelistValueLabel: "Severe",
    codelistCode: "C66769",
    codelistValueCode: "C49762",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 3,
  },
  {
    id: "sdtm_cl_12",
    datasetName: "AE",
    codelist: "AEOUT",
    codelistName: "Outcome of Adverse Event",
    codelistValue: "RECOVERED/RESOLVED",
    codelistValueLabel: "Recovered/Resolved",
    codelistCode: "C66768",
    codelistValueCode: "C49498",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_13",
    datasetName: "AE",
    codelist: "AEOUT",
    codelistName: "Outcome of Adverse Event",
    codelistValue: "FATAL",
    codelistValueLabel: "Fatal",
    codelistCode: "C66768",
    codelistValueCode: "C48275",
    valueOrigin: "CRF",
    extensible: "No",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_14",
    datasetName: "VS",
    codelist: "VSSTRESU",
    codelistName: "Vital Signs Standard Units",
    codelistValue: "mmHg",
    codelistValueLabel: "Millimeter of Mercury",
    codelistCode: "C66770",
    codelistValueCode: "C49673",
    valueOrigin: "Assigned",
    extensible: "Yes",
    used: "Yes",
    order: 1,
  },
  {
    id: "sdtm_cl_15",
    datasetName: "VS",
    codelist: "VSSTRESU",
    codelistName: "Vital Signs Standard Units",
    codelistValue: "beats/min",
    codelistValueLabel: "Beats per Minute",
    codelistCode: "C66770",
    codelistValueCode: "C49674",
    valueOrigin: "Assigned",
    extensible: "Yes",
    used: "Yes",
    order: 2,
  },
  {
    id: "sdtm_cl_16",
    datasetName: "VS",
    codelist: "VSSTRESU",
    codelistName: "Vital Signs Standard Units",
    codelistValue: "C",
    codelistValueLabel: "Degrees Celsius",
    codelistCode: "C66770",
    codelistValueCode: "C42538",
    valueOrigin: "Assigned",
    extensible: "Yes",
    used: "Yes",
    order: 3,
  },
];

// ==================== Icons ====================

function CloseIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" fill={color} />
    </svg>
  );
}

function SearchIcon({ className = "w-[16px] h-[16px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 4C6.91 4 4 6.91 4 10.5C4 14.09 6.91 17 10.5 17C12.11 17 13.58 16.41 14.72 15.44L18.29 19L19 18.29L15.44 14.72C16.41 13.58 17 12.11 17 10.5C17 6.91 14.09 4 10.5 4ZM10.5 5C13.54 5 16 7.46 16 10.5C16 13.54 13.54 16 10.5 16C7.46 16 5 13.54 5 10.5C5 7.46 7.46 5 10.5 5Z" fill="#888E8E" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-[16px] h-[16px]", color = "#888E8E" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.17L18.36 6.81L19.78 8.22L12 16L4.22 8.22L5.64 6.81L12 13.17Z" fill={color} />
    </svg>
  );
}

// ==================== Truncated Derivation Cell with Conditional Tooltip ====================

function TruncatedDerivationCell({ text }: { text: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    if (textRef.current) {
      // scrollHeight > clientHeight indicates the 6-line clamp has truncated text
      const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight + 1;
      setIsTruncated(hasOverflow);
    }
  }, []);

  useEffect(() => {
    checkTruncation();
  }, [text, checkTruncation]);

  const paragraph = (
    <p
      ref={textRef}
      onMouseEnter={checkTruncation}
      className="t-small text-text-secondary w-full text-left"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 6,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {text}
    </p>
  );

  if (!isTruncated) {
    return (
      <div className="min-w-0 pr-[6px] w-full">
        {paragraph}
      </div>
    );
  }

  return (
    <div className="min-w-0 pr-[6px] w-full">
      <Tooltip
        label={text}
        maxWidth={420}
        placement="top"
        className="w-full"
      >
        {paragraph}
      </Tooltip>
    </div>
  );
}

// ==================== Grouping Helper ====================

export function groupVariablesByDataset(selected: string[]): Array<{ dataset: string; items: Array<{ key: string; label: string }> }> {
  const datasetMap = new Map<string, Array<{ key: string; label: string }>>();

  for (const key of selected) {
    if (key.includes(".")) {
      const [dName, ...rest] = key.split(".");
      const vName = rest.join(".");
      if (!datasetMap.has(dName)) {
        datasetMap.set(dName, []);
      }
      datasetMap.get(dName)!.push({ key, label: vName });
    } else {
      const fallback = "Variable";
      if (!datasetMap.has(fallback)) {
        datasetMap.set(fallback, []);
      }
      datasetMap.get(fallback)!.push({ key, label: key });
    }
  }

  const groups: Array<{ dataset: string; items: Array<{ key: string; label: string }> }> = [];
  for (const [dataset, items] of datasetMap.entries()) {
    groups.push({ dataset, items });
  }
  return groups;
}

// ==================== Inline Variable List ====================

function InlineVariableList({
  label,
  variables,
  selected,
  sourceDatasets = [],
  onToggle,
  onRemove,
  onBrowseAll,
  required = false,
  disabled = false,
  badge,
  placeholder = "Select variables…",
  error,
  className = "",
}: InlineVariableListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [standardFilter, setStandardFilter] = useState<"All" | "ADaM" | "SDTM">("All");
  const [isExpandedTags, setIsExpandedTags] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dropdownWidth = 640;
    const margin = 8;

    // Align left with container, but constrain within viewport bounds
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - dropdownWidth - margin);
    }

    // Default below the input; flip upwards if overflowing bottom of screen
    let top = rect.bottom + 4;
    const dropdownHeight = 440;
    if (top + dropdownHeight > window.innerHeight - margin && rect.top > dropdownHeight + margin) {
      top = rect.top - dropdownHeight - 4;
    }

    setDropdownPos({ top, left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePos();

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target) ||
        (target as HTMLElement).closest?.(".filter-chip-menu") ||
        (target as HTMLElement).closest?.("[data-filter-chip-menu]")
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleScrollOrResize = () => {
      updatePos();
    };

    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePos]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const items = variables.filter((v) => {
      const vStd = v.standard || (v.datasetName.startsWith("AD") ? "ADaM" : "SDTM");
      // Hard filter by sourceDatasets if defined and not empty
      if (sourceDatasets && sourceDatasets.length > 0 && !sourceDatasets.includes(v.datasetName)) {
        return false;
      }
      if (standardFilter === "ADaM" && vStd !== "ADaM") return false;
      if (standardFilter === "SDTM" && vStd !== "SDTM") return false;
      if (!q) return true;
      return (
        v.variable.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
      );
    });
    // Sort: selected first, then alphabetical
    return items.sort((a, b) => {
      const keyA = `${a.datasetName}.${a.variable}`;
      const keyB = `${b.datasetName}.${b.variable}`;
      const aS = selected.includes(keyA) || selected.includes(a.variable) ? 0 : 1;
      const bS = selected.includes(keyB) || selected.includes(b.variable) ? 0 : 1;
      if (aS !== bS) return aS - bS;
      return a.variable.localeCompare(b.variable);
    });
  }, [variables, search, selected, standardFilter, sourceDatasets]);

  const groupedSelected = useMemo(() => groupVariablesByDataset(selected), [selected]);
  const hasMoreThanThree = selected.length > 3;
  const visibleGroups = useMemo(() => {
    if (!hasMoreThanThree || isExpandedTags) return groupedSelected;
    let count = 0;
    const truncated: typeof groupedSelected = [];
    for (const group of groupedSelected) {
      const remaining = 3 - count;
      if (remaining <= 0) break;
      if (group.items.length <= remaining) {
        truncated.push(group);
        count += group.items.length;
      } else {
        truncated.push({
          dataset: group.dataset,
          items: group.items.slice(0, remaining),
        });
        count += remaining;
        break;
      }
    }
    return truncated;
  }, [groupedSelected, hasMoreThanThree, isExpandedTags]);

  let boxClasses = "";
  if (disabled) {
    boxClasses = "border border-form-border bg-bg-panel cursor-not-allowed";
  } else if (error) {
    boxClasses = "border-[1.5px] border-az-danger bg-white";
  } else if (isOpen) {
    boxClasses = "border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]";
  } else {
    boxClasses = "border border-form-border bg-white hover:border-graphite-50";
  }

  const dropdownContent = isOpen && !disabled && dropdownPos && (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: 640,
        zIndex: 9999,
      }}
      className="rounded-[4px] border border-[#D8DADA] bg-white p-[4px] shadow-[0px_4px_16px_rgba(0,0,0,0.15)] flex flex-col gap-[4px]"
    >
      {/* Search bar + Filter Chip */}
      <div className="flex items-center gap-[8px] w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search..."
            background="light"
            autoFocus
          />
        </div>
        <FilterChip
          type="Dropdown"
          showIcon={false}
          value={standardFilter}
          onChange={(val) => setStandardFilter(val as "All" | "ADaM" | "SDTM")}
          options={[
            { label: "All", value: "All" },
            { label: "ADaM only", value: "ADaM" },
            { label: "SDTM only", value: "SDTM" },
          ]}
        />
      </div>

      {/* Table structure */}
      <div className="w-full rounded-[2px] border border-[#EAEAEA] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[44px_130px_170px_1fr] items-center bg-[#F8F9F9] border-b border-[#EAEAEA] h-[32px] px-[2px]">
          <div />
          <span className="t-small text-[#888E8E] pl-[2px]">Variable</span>
          <span className="t-small text-[#888E8E] pl-[2px]">Label</span>
          <span className="t-small text-[#888E8E] pl-[2px]">Derivation</span>
        </div>

        {/* Scrollable Option list */}
        <div className="max-h-[336px] overflow-y-auto bg-white">
          {filtered.length === 0 ? (
            <div className="px-[12px] py-[24px] text-center">
              <p className="t-small text-[#888E8E]">No Results Found</p>
            </div>
          ) : (
            filtered.map((v) => {
              const itemKey = `${v.datasetName}.${v.variable}`;
              const isSelected = selected.includes(itemKey) || selected.includes(v.variable);
              return (
                <div
                  key={v.id}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(itemKey);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggle(itemKey);
                    }
                  }}
                  className={`grid w-full grid-cols-[44px_130px_170px_1fr] items-start px-[2px] py-[10px] min-h-[56px] text-left transition-colors border-b border-[#F0F0F0] last:border-b-0 cursor-pointer ${
                    isSelected ? "bg-[#F8EFF4] hover:bg-[#F3E3ED]" : "bg-white hover:bg-[#F8F9F9]"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex h-[20px] w-[44px] items-center justify-center shrink-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggle(itemKey)}
                    />
                  </div>

                  {/* Variable name */}
                  <div className="min-w-0 pr-[6px]">
                    <p className="t-small text-text-primary truncate">{v.variable}</p>
                  </div>

                  {/* Label */}
                  <div className="min-w-0 pr-[6px]">
                    <p className="t-small text-text-secondary line-clamp-2">{v.label}</p>
                  </div>

                  {/* Derivation with conditional Tooltip only on genuine text truncation */}
                  <TruncatedDerivationCell text={v.derivation} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Button — Secondary style matching Figma */}
      <div className="w-full pt-[2px]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
            onBrowseAll();
          }}
          className="flex w-full h-[28px] items-center justify-center rounded-[4px] bg-[#F0F2F2] hover:bg-[#E5E7E7] active:bg-[#D8DADA] transition-colors cursor-pointer"
        >
          <span className="t-small text-[#3F4444]">Browse All Variables</span>
        </button>
      </div>
    </div>
  );

  return (
    <FormItem
      label={label}
      labelClassName="t-small-medium"
      required={required}
      disabled={disabled}
      error={error}
      badge={badge}
      className={className}
    >
      <div ref={containerRef} className="relative w-full">
        {/* Input area showing selected tags */}
        <div
          className={`relative flex min-h-[32px] w-full items-center justify-between rounded-[4px] pl-[4px] pr-[30px] py-[4px] transition-[border-color,box-shadow,background-color] cursor-pointer ${boxClasses}`}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex flex-wrap gap-[4px] items-center w-full">
            {selected.length === 0 ? (
              <span
                style={{
                  fontFamily: "'PingFang SC', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "20px",
                  color: disabled ? "var(--color-graphite-40)" : "var(--color-text-secondary)",
                  paddingLeft: "8px",
                }}
              >
                {placeholder}
              </span>
            ) : (
              <>
                {visibleGroups.map((group) => (
                  <GroupTag
                    key={group.dataset}
                    prefix={group.dataset}
                    items={group.items}
                    disabled={disabled}
                    onRemoveItem={onRemove}
                  />
                ))}
                {hasMoreThanThree && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpandedTags(!isExpandedTags);
                    }}
                    className="inline-flex items-center gap-[4px] py-[2px] text-[11px] text-brand-1 cursor-pointer font-medium max-h-[26px] bg-transparent hover:bg-transparent transition-colors select-none"
                    style={{ fontFamily: "'PingFang SC', sans-serif" }}
                  >
                    {!isExpandedTags ? `+${selected.length - 3} more...` : "Show less"}
                  </span>
                )}
              </>
            )}
          </div>
          <img
            src={arrowIconUrl}
            alt=""
            className="absolute right-[10px] top-[50%] translate-y-[-50%] h-[20px] w-[20px]"
            style={{ opacity: disabled ? 0.4 : 1 }}
          />
        </div>

        {/* Floating Dropdown Layer (Rendered to document.body to avoid clipping) */}
        {dropdownContent && createPortal(dropdownContent, document.body)}
      </div>
    </FormItem>
  );
}

// ==================== Derivation Cell ====================

function DerivationCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split("\n");
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
          onClick={() => setExpanded(!expanded)}
          className="t-footnote text-brand-1 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function StackLineIcon({ className = "size-[16px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.0833 15.1998L21.2854 15.9211C21.5221 16.0632 21.5989 16.3703 21.4569 16.6071C21.4146 16.6775 21.3557 16.7364 21.2854 16.7786L12.5144 22.0411C12.1977 22.2312 11.8021 22.2312 11.4854 22.0411L2.71451 16.7786C2.47772 16.6365 2.40093 16.3294 2.54301 16.0926C2.58523 16.0222 2.64413 15.9633 2.71451 15.9211L3.9166 15.1998L11.9999 20.0498L20.0833 15.1998ZM20.0833 10.4998L21.2854 11.2211C21.5221 11.3632 21.5989 11.6703 21.4569 11.9071C21.4146 11.9775 21.3557 12.0364 21.2854 12.0786L11.9999 17.6498L2.71451 12.0786C2.47772 11.9365 2.40093 11.6294 2.54301 11.3926C2.58523 11.3222 2.64413 11.2633 2.71451 11.2211L3.9166 10.4998L11.9999 15.3498L20.0833 10.4998ZM12.5144 1.30852L21.2854 6.57108C21.5221 6.71315 21.5989 7.02028 21.4569 7.25707C21.4146 7.32745 21.3557 7.38635 21.2854 7.42857L11.9999 12.9998L2.71451 7.42857C2.47772 7.2865 2.40093 6.97937 2.54301 6.74258C2.58523 6.6722 2.64413 6.61331 2.71451 6.57108L11.4854 1.30852C11.8021 1.11852 12.1977 1.11852 12.5144 1.30852ZM11.9999 3.33221L5.88723 6.99983L11.9999 10.6675L18.1126 6.99983L11.9999 3.33221Z" />
    </svg>
  );
}
function Database2LineIcon({ className = "size-[16px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 12.5C5 12.8134 5.46101 13.3584 6.53047 13.8931C7.91405 14.5849 9.87677 15 12 15C14.1232 15 16.0859 14.5849 17.4695 13.8931C18.539 13.3584 19 12.8134 19 12.5V10.3287C17.35 11.3482 14.8273 12 12 12C9.17273 12 6.64996 11.3482 5 10.3287V12.5ZM19 15.3287C17.35 16.3482 14.8273 17 12 17C9.17273 17 6.64996 16.3482 5 15.3287V17.5C5 17.8134 5.46101 18.3584 6.53047 18.8931C7.91405 19.5849 9.87677 20 12 20C14.1232 20 16.0859 19.5849 17.4695 18.8931C18.539 18.3584 19 17.8134 19 17.5V15.3287ZM3 17.5V7.5C3 5.01472 7.02944 3 12 3C16.9706 3 21 5.01472 21 7.5V17.5C21 19.9853 16.9706 22 12 22C7.02944 22 3 19.9853 3 17.5ZM12 10C14.1232 10 16.0859 9.58492 17.4695 8.89313C18.539 8.3584 19 7.81342 19 7.5C19 7.18658 18.539 6.6416 17.4695 6.10687C16.0859 5.41508 14.1232 5 12 5C9.87677 5 7.91405 5.41508 6.53047 6.10687C5.46101 6.6416 5 7.18658 5 7.5C5 7.81342 5.46101 8.3584 6.53047 8.89313C7.91405 9.58492 9.87677 10 12 10Z" />
    </svg>
  );
}

// ==================== Browse Variables Modal ====================

export function BrowseVariablesModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected,
  variables,
  vlmData,
  adamCodeListData = mockAdamCodeListData,
  sdtmCodeListData = mockSdtmCodeListData,
  sourceDatasets = [],
  onDatasetsExpand,
}: BrowseVariablesModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "vlm" | "codelist">("all");
  const [standardFilter, setStandardFilter] = useState<"All" | "ADaM" | "SDTM">("All");
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // Compute available dataset names based on standardFilter
  const availableDatasets = useMemo(() => {
    const list = variables.filter((v) => {
      const vStd = v.standard || (v.datasetName.startsWith("AD") ? "ADaM" : "SDTM");
      if (standardFilter === "ADaM" && vStd !== "ADaM") return false;
      if (standardFilter === "SDTM" && vStd !== "SDTM") return false;
      return true;
    });
    return Array.from(new Set(list.map((v) => v.datasetName))).sort();
  }, [variables, standardFilter]);

  // Compute dataset options for FilterChip
  const datasetOptions = useMemo(() => {
    return availableDatasets.map((d) => ({ label: d, value: d }));
  }, [availableDatasets]);

  // Sync initial selected ONLY when modal opens (false -> true)
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSelected([...initialSelected]);
      setSearch("");
      
      // Determine initial standard filter:
      // If sourceDatasets are all ADaM -> ADaM, all SDTM -> SDTM, otherwise All
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
        setSelectedDatasets([...sourceDatasets]);
      } else {
        setStandardFilter("All");
        setSelectedDatasets([]);
      }
      
      setActiveTab("all");
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialSelected, sourceDatasets]);

  const toggleVariable = useCallback((itemKey: string, datasetName: string) => {
    setSelected((prev) => {
      const isSelected = prev.includes(itemKey) || prev.includes(itemKey.split('.').pop() || '');
      if (isSelected) {
        return prev.filter((v) => v !== itemKey && v !== itemKey.split('.').pop());
      } else {
        // Auto-expand dataset filter if selected dataset is not in current dataset filter list
        setSelectedDatasets((prevDatasets) => {
          if (prevDatasets.length > 0 && !prevDatasets.includes(datasetName)) {
            return [...prevDatasets, datasetName];
          }
          return prevDatasets;
        });
        return [...prev, itemKey];
      }
    });
  }, []);

  const removeVariable = useCallback((itemKey: string) => {
    setSelected((prev) => prev.filter((v) => v !== itemKey && v !== itemKey.split('.').pop()));
  }, []);

  // Jump to VLM tab and filter to variable
  const jumpToVlm = useCallback((variable: string) => {
    setStandardFilter("ADaM");
    setActiveTab("vlm");
    setSearch(variable);
  }, []);

  const filteredVariables = useMemo(() => {
    const q = search.toLowerCase().trim();
    return variables.filter((v) => {
      const vStd = v.standard || (v.datasetName.startsWith("AD") ? "ADaM" : "SDTM");
      if (standardFilter === "ADaM" && vStd !== "ADaM") return false;
      if (standardFilter === "SDTM" && vStd !== "SDTM") return false;
      // Secondary filter by selectedDatasets (if any selected)
      if (selectedDatasets.length > 0 && !selectedDatasets.includes(v.datasetName)) {
        return false;
      }
      if (!q) return true;
      return (
        v.variable.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
      );
    });
  }, [variables, search, standardFilter, selectedDatasets]);

  const filteredVlm = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return vlmData;
    return vlmData.filter(
      (v) =>
        v.variableName.toLowerCase().includes(q) ||
        v.parameterName.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
  }, [vlmData, search]);

  const filteredAdamCodeList = useMemo(() => {
    const q = search.toLowerCase().trim();
    return adamCodeListData.filter((row) => {
      if (selectedDatasets.length > 0 && row.datasetName && !selectedDatasets.includes(row.datasetName)) {
        return false;
      }
      if (!q) return true;
      return (
        row.codelist.toLowerCase().includes(q) ||
        row.codelistName.toLowerCase().includes(q) ||
        row.codelistValue.toLowerCase().includes(q) ||
        row.codelistValueLabel.toLowerCase().includes(q) ||
        row.cdiscCodelistCode.toLowerCase().includes(q) ||
        row.cdiscCodelistValueCode.toLowerCase().includes(q) ||
        row.definition.toLowerCase().includes(q) ||
        (row.datasetName && row.datasetName.toLowerCase().includes(q))
      );
    });
  }, [adamCodeListData, search, selectedDatasets]);

  const filteredSdtmCodeList = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sdtmCodeListData.filter((row) => {
      if (selectedDatasets.length > 0 && row.datasetName && !selectedDatasets.includes(row.datasetName)) {
        return false;
      }
      if (!q) return true;
      return (
        row.codelist.toLowerCase().includes(q) ||
        row.codelistName.toLowerCase().includes(q) ||
        row.codelistValue.toLowerCase().includes(q) ||
        row.codelistValueLabel.toLowerCase().includes(q) ||
        row.codelistCode.toLowerCase().includes(q) ||
        row.codelistValueCode.toLowerCase().includes(q) ||
        row.valueOrigin.toLowerCase().includes(q) ||
        (row.datasetName && row.datasetName.toLowerCase().includes(q))
      );
    });
  }, [sdtmCodeListData, search, selectedDatasets]);

  const newlyAddedDatasets = useMemo(() => {
    if (!sourceDatasets || sourceDatasets.length === 0) return [];
    const currentSelectedDatasets = Array.from(
      new Set(
        selected
          .map((itemKey) => {
            if (itemKey.includes(".")) return itemKey.split(".")[0];
            const matched = variables.find((v) => v.variable === itemKey);
            return matched?.datasetName || "";
          })
          .filter(Boolean)
      )
    );
    return currentSelectedDatasets.filter((d) => !sourceDatasets.includes(d));
  }, [selected, sourceDatasets, variables]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 pointer-events-auto cursor-pointer" onClick={onClose} aria-label="Close modal" />

      {/* Modal */}
      <div className="relative z-10 flex h-[620px] w-[940px] max-w-[94vw] max-h-[88vh] flex-col rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.15)] pointer-events-auto">
        {/* Header */}
        <div className="flex h-[48px] shrink-0 items-center justify-between border-b border-[#D8DADA] px-[20px]">
          <h2 className="t-heading text-text-primary">Browse All Variables</h2>
          <button
            type="button"
            onClick={onClose}
            className="relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-graphite-10 active:scale-[0.96] after:content-[''] after:absolute after:-inset-[8px]"
            aria-label="Close"
          >
            <CloseIcon className="h-[16px] w-[16px]" color="#888E8E" />
          </button>
        </div>

        {/* Search Bar Row (Search takes full width) */}
        <div className="flex shrink-0 items-center border-b border-[#D8DADA] px-[20px] py-[8px]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={
              activeTab === "codelist"
                ? "Search Code Lists (Name, Value, Label, NCI Code)..."
                : activeTab === "vlm"
                ? "Search VLM (Variable, Parameter, Dataset)..."
                : "Search Variables..."
            }
            background="light"
            className="flex-1 w-full"
          />
        </div>

        {/* Filters Row (Standard FilterChip + Dataset MultiSelect FilterChip below Search Bar) */}
        <div className="flex shrink-0 items-center gap-[8px] border-b border-[#D8DADA] px-[20px] py-[6px] bg-white min-w-0">
          <FilterChip
            type="Dropdown"
            showIcon={true}
            icon={<StackLineIcon className="size-[16px]" />}
            value={standardFilter}
            onChange={(val) => {
              const nextVal = val as "All" | "ADaM" | "SDTM";
              setStandardFilter(nextVal);
              if (nextVal === "All") {
                setActiveTab("all");
              } else if (nextVal === "SDTM" && activeTab === "vlm") {
                setActiveTab("all");
              }
              // Reset dataset filter when standard filter changes if current selections are outside new standard
              setSelectedDatasets([]);
            }}
            options={[
              { label: "All Standards", value: "All" },
              { label: "ADaM only", value: "ADaM" },
              { label: "SDTM only", value: "SDTM" },
            ]}
          />
          <FilterChip
            type="Dropdown"
            showIcon={true}
            icon={<Database2LineIcon className="size-[16px]" />}
            multiSelect={true}
            label="All Datasets"
            values={selectedDatasets}
            onChangeMulti={(newDatasets) => {
              setSelectedDatasets(newDatasets);
            }}
            options={datasetOptions}
            className="w-fit max-w-full min-w-0"
          />
        </div>

        {/* Selected Bar */}
        {selected.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-[4px] border-b border-graphite-10 bg-bg-panel px-[20px] py-[8px]">
            <span className="t-small text-[#888E8E] shrink-0 mr-[4px]">Selected:</span>
            {groupVariablesByDataset(selected).map((group) => (
              <GroupTag
                key={group.dataset}
                prefix={group.dataset}
                items={group.items}
                onRemoveItem={removeVariable}
              />
            ))}
          </div>
        )}

        {/* Tabs: Shown when standardFilter is ADaM (All Variables / VLM / Code List) or SDTM (All Variables / Code List), hidden when All Standards */}
        {(standardFilter === "ADaM" || standardFilter === "SDTM") && (
          <div className="flex shrink-0 h-[38px] items-center border-b border-[#D8DADA] px-[20px] bg-white gap-[16px]">
            {(
              standardFilter === "ADaM"
                ? (["all", "vlm", "codelist"] as const)
                : (["all", "codelist"] as const)
            ).map((tab, idx) => {
              const isActive = activeTab === tab;
              const tabLabel =
                tab === "all" ? "All Variables" : tab === "vlm" ? "VLM" : "Code List";
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSearch("");
                  }}
                  className={`flex h-full items-center border-b-2 ${
                    idx === 0 ? "pl-0 pr-[4px]" : "px-[4px]"
                  } active:scale-[0.96] transition-colors cursor-pointer ${
                    isActive ? "border-[#830051]" : "border-transparent"
                  }`}
                >
                  <span className={`t-small font-medium ${isActive ? "text-[#830051]" : "text-text-primary"}`}>
                    {tabLabel}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Table Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          {activeTab === "all" && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[36px] px-[12px] py-[8px]">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={
                          filteredVariables.length > 0 &&
                          filteredVariables.every((v) => {
                            const key = `${v.datasetName}.${v.variable}`;
                            return selected.includes(key) || selected.includes(v.variable);
                          })
                        }
                        indeterminate={
                          filteredVariables.some((v) => {
                            const key = `${v.datasetName}.${v.variable}`;
                            return selected.includes(key) || selected.includes(v.variable);
                          }) &&
                          !filteredVariables.every((v) => {
                            const key = `${v.datasetName}.${v.variable}`;
                            return selected.includes(key) || selected.includes(v.variable);
                          })
                        }
                        onChange={(allChecked) => {
                          if (allChecked) {
                            const toAdd = filteredVariables
                              .map((v) => `${v.datasetName}.${v.variable}`)
                              .filter((key) => !selected.includes(key) && !selected.includes(key.split('.').pop() || ''));
                            setSelected((prev) => [...prev, ...toAdd]);
                          } else {
                            const toRemove = new Set(filteredVariables.map((v) => `${v.datasetName}.${v.variable}`));
                            const toRemoveShort = new Set(filteredVariables.map((v) => v.variable));
                            setSelected((prev) => prev.filter((k) => !toRemove.has(k) && !toRemoveShort.has(k)));
                          }
                        }}
                      />
                    </div>
                  </th>
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Dataset</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Variable</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Label</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Format</span>
                  </th>
                  <th className="w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVariables.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <div className="flex flex-col items-center gap-[8px]">
                        <p className="t-small text-[#888E8E]">
                          No Results Found
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="t-small text-brand-1 hover:underline font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVariables.map((v) => {
                    const itemKey = `${v.datasetName}.${v.variable}`;
                    const isSelected = selected.includes(itemKey) || selected.includes(v.variable);

                    return (
                      <tr
                        key={v.id}
                        className={`border-b border-graphite-10 hover:bg-bg-panel transition-colors ${
                          isSelected ? "bg-bg-panel" : ""
                        }`}
                      >
                        <td className="w-[36px] px-[12px] py-[6px]">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleVariable(itemKey, v.datasetName)}
                            />
                          </div>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.datasetName}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <div className="flex items-center gap-[6px]">
                            <span className="t-small font-medium whitespace-nowrap text-text-primary">{v.variable}</span>
                            {v.hasVlm && (
                              <button
                                type="button"
                                onClick={() => jumpToVlm(v.variable)}
                                className="inline-flex h-[18px] items-center gap-[1px] rounded-[4px] bg-[#F4E8EE] px-[4px] hover:bg-[#EEDFE7] transition-colors"
                              >
                                <span className="text-[10px] font-medium whitespace-nowrap text-[#830051]">VLM ↗</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small text-text-primary whitespace-normal">{v.label}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.type}/{v.length}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.displayFormat}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <DerivationCell text={v.derivation} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === "vlm" && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[100px] px-[12px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Dataset</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Parameter Name</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Where Clause</span>
                  </th>
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Variable</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Format</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVlm.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <p className="t-small text-[#888E8E]">
                        No Results Found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredVlm.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-graphite-10 hover:bg-bg-panel transition-colors"
                    >
                      <td className="px-[12px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.datasetName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.parameterName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.whereClause}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.variableName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.type}/{row.length}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.displayFormat}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <DerivationCell text={row.derivation} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "codelist" && standardFilter === "ADaM" && (
            <table className="w-full border-collapse min-w-[1400px]">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[110px] px-[12px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Name</span>
                  </th>
                  <th className="w-[110px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Type</span>
                  </th>
                  <th className="w-[110px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Value</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Value Label</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">CDISC_Codelist Code</span>
                  </th>
                  <th className="w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">CDISC Codelist Value Code</span>
                  </th>
                  <th className="w-[70px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Rank</span>
                  </th>
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">OrderNumber</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Extensible</span>
                  </th>
                  <th className="min-w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Definition</span>
                  </th>
                  <th className="w-[70px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">used?</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Delivery_Part1_mini</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Delivery_Part1</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdamCodeList.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-[20px] py-[32px] text-center">
                      <p className="t-small text-[#888E8E]">
                        No Results Found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAdamCodeList.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-graphite-10 hover:bg-bg-panel transition-colors"
                    >
                      <td className="px-[12px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.codelist}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.codelistName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.codelistType}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.codelistValue}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.codelistValueLabel}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.cdiscCodelistCode}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.cdiscCodelistValueCode}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.rank}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.orderNumber}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.extensible}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <DerivationCell text={row.definition} />
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.used}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.deliveryPart1Mini}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.deliveryPart1}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "codelist" && standardFilter === "SDTM" && (
            <table className="w-full border-collapse min-w-[1100px]">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[110px] px-[12px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Name</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Value</span>
                  </th>
                  <th className="w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Value Label</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Code</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Codelist Value Code</span>
                  </th>
                  <th className="w-[110px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Value Origin</span>
                  </th>
                  <th className="w-[90px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Extensible</span>
                  </th>
                  <th className="w-[70px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Used</span>
                  </th>
                  <th className="w-[70px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E] whitespace-nowrap">Order</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSdtmCodeList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-[20px] py-[32px] text-center">
                      <p className="t-small text-[#888E8E]">
                        No Results Found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSdtmCodeList.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-graphite-10 hover:bg-bg-panel transition-colors"
                    >
                      <td className="px-[12px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.codelist}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.codelistName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small font-medium whitespace-nowrap text-text-primary">{row.codelistValue}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.codelistValueLabel}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.codelistCode}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.codelistValueCode}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.valueOrigin}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.extensible}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.used}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.order}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#D8DADA] px-[20px] py-[12px] bg-white">
          {/* Left info tip if datasets will be expanded */}
          <div className="flex items-center gap-[6px] min-w-0 pr-[12px]">
            {newlyAddedDatasets.length > 0 && (
              <span className="t-small text-[#555A5A] truncate flex items-center gap-[6px]" title={`${newlyAddedDatasets.join(", ")} will be automatically added to Source Dataset(s).`}>
                <span className="inline-flex size-[14px] items-center justify-center rounded-full bg-[#F4E8EE] text-[#830051] text-[10px] font-bold shrink-0">
                  i
                </span>
                <span className="truncate">
                  <span className="font-medium text-text-primary">+{newlyAddedDatasets.join(", ")}</span> will be added to Source Dataset(s)
                </span>
              </span>
            )}
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-[12px] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-[32px] rounded-[4px] border-[0.6px] border-[#D8DADA] bg-white px-[16px] t-small font-medium text-text-primary hover:bg-bg-panel active:scale-[0.96]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(selected);
                if (newlyAddedDatasets.length > 0) {
                  onDatasetsExpand?.(newlyAddedDatasets);
                }
                onClose();
              }}
              className="h-[32px] rounded-[4px] bg-[#830051] px-[16px] t-small font-medium text-white hover:bg-[#6D0043] active:scale-[0.96]"
            >
              Confirm ({selected.length})
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ==================== Exported Compound ====================

export interface BrowseVariablesFieldProps {
  label?: React.ReactNode;
  value?: string[];
  onChange?: (selected: string[]) => void;
  initialSelected?: string[];
  sourceDatasets?: string[];
  onDatasetsExpand?: (newDatasets: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  placeholder?: string;
  error?: string;
  className?: string;
  variables?: Variable[];
  vlmData?: VlmRow[];
  adamCodeListData?: AdamCodeListRow[];
  sdtmCodeListData?: SdtmCodeListRow[];
  mode?: "table" | "listing";
}

export function BrowseVariablesField({
  label,
  value,
  onChange,
  initialSelected = [],
  sourceDatasets = [],
  onDatasetsExpand,
  required = false,
  disabled = false,
  badge,
  placeholder = "Select variables…",
  error,
  className = "",
  variables = mockVariables,
  vlmData = mockVlmData,
  adamCodeListData = mockAdamCodeListData,
  sdtmCodeListData = mockSdtmCodeListData,
  mode = "table",
}: BrowseVariablesFieldProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(initialSelected);
  const [modalOpen, setModalOpen] = useState(false);

  const isControlled = value !== undefined;
  const currentSelected = isControlled ? value : internalSelected;

  // Auto-normalize any legacy short variable names without dataset prefix
  const normalizedSelected = useMemo(() => {
    return currentSelected.map((itemKey) => {
      if (itemKey.includes(".")) return itemKey;
      if (sourceDatasets && sourceDatasets.length > 0) {
        const match = variables.find(
          (v) => v.variable === itemKey && sourceDatasets.includes(v.datasetName)
        );
        if (match) return `${match.datasetName}.${match.variable}`;
      }
      const anyMatch = variables.find((v) => v.variable === itemKey);
      if (anyMatch) return `${anyMatch.datasetName}.${anyMatch.variable}`;
      return itemKey;
    });
  }, [currentSelected, sourceDatasets, variables]);

  const handleToggle = (variableKey: string) => {
    const isSel = normalizedSelected.includes(variableKey) || normalizedSelected.includes(variableKey.split('.').pop() || '');
    const next = isSel
      ? normalizedSelected.filter((v) => v !== variableKey && v !== variableKey.split('.').pop())
      : [...normalizedSelected, variableKey];
    if (onChange) onChange(next);
    if (!isControlled) setInternalSelected(next);

    if (!isSel && variableKey.includes('.')) {
      const dName = variableKey.split('.')[0];
      if (sourceDatasets && sourceDatasets.length > 0 && !sourceDatasets.includes(dName)) {
        onDatasetsExpand?.([dName]);
      }
    }
  };

  const handleRemove = (variableKey: string) => {
    const next = normalizedSelected.filter((v) => v !== variableKey && v !== variableKey.split('.').pop());
    if (onChange) onChange(next);
    if (!isControlled) setInternalSelected(next);
  };

  const handleConfirm = (newSelected: string[]) => {
    if (onChange) onChange(newSelected);
    if (!isControlled) setInternalSelected(newSelected);
  };

  return (
    <>
      <InlineVariableList
        label={label}
        required={required}
        disabled={disabled}
        badge={badge}
        placeholder={placeholder}
        error={error}
        className={className}
        variables={variables}
        selected={normalizedSelected}
        sourceDatasets={sourceDatasets}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onBrowseAll={() => setModalOpen(true)}
      />
      <VariableSpecPicker
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialSelected={normalizedSelected}
        sourceDatasets={sourceDatasets}
        onDatasetsExpand={onDatasetsExpand}
        variables={variables}
        vlmData={vlmData}
        adamCodeListData={adamCodeListData}
        sdtmCodeListData={sdtmCodeListData}
        mode={mode}
      />
    </>
  );
}

export default BrowseVariablesField;
