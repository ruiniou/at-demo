import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { SearchBar } from "../../../components/ui/SearchBar";
import { FormItem } from "../../../components/ui/FormItem";
import { Tag } from "../../../components/ui/Tag";
import { Tooltip } from "../../../components/ui/Tooltip";
import arrowIconUrl from "../../../icons/arrow-down-s-line.svg";

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

export type BrowseVariablesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
  initialSelected: string[];
  variables: Variable[];
  vlmData: VlmRow[];
};

export type InlineVariableListProps = {
  label?: React.ReactNode;
  variables: Variable[];
  selected: string[];
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
  { id: "v1", datasetName: "ADSL", variable: "AAGE", label: "Analysis Age", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to integer part of (Randomization Date - Date of Birth + 1) / 365.25.", hasVlm: false },
  { id: "v2", datasetName: "ADSL", variable: "AAGEU", label: "Analysis Age Unit", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Set to "YEARS" if ADSL.AAGE is not missing.', hasVlm: false },
  { id: "v3", datasetName: "ADSL", variable: "ACTARM", label: "Description of Actual Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "DM.ACTARM", hasVlm: false },
  { id: "v4", datasetName: "ADSL", variable: "ACTARMCD", label: "Actual Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "DM.ACTARMCD", hasVlm: false },
  { id: "v5", datasetName: "ADSL", variable: "ACTARMUD", label: "Description of Unplanned Actual Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "DM.ACTARMUD", hasVlm: false },
  { id: "v6", datasetName: "ADSL", variable: "ADAFL", label: "Anti-Drug Antibody Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if SAFFL='Y' and patient has non-missing post-baseline ADA sample assessment.", hasVlm: false },
  { id: "v7", datasetName: "ADSL", variable: "AGE", label: "Age at Enrollment", type: "Num", length: 8, displayFormat: "8.1", derivation: "Derived from informed consent date and date of birth.", hasVlm: false },
  { id: "v8", datasetName: "ADSL", variable: "AGEGR1", label: "Age Group (years)", type: "Char", length: 8, displayFormat: "$8.", derivation: "Categorized: <65, 65-74, ≥75", hasVlm: false },
  { id: "v9", datasetName: "ADSL", variable: "AGEGR2", label: "Age Group 2 (<65, >=65)", type: "Char", length: 8, displayFormat: "$8.", derivation: "Categorized: <65, >=65", hasVlm: false },
  { id: "v_agesexra", datasetName: "ADSL", variable: "AGESEXRA", label: "Age/Sex/Race concatenated", type: "Char", length: 60, displayFormat: "$60.", derivation: 'Concatenate ADSL.AAGE, ADSL.SEX and ADSL.ARACE using "/" as separators.', hasVlm: false },
  { id: "v_ageu", datasetName: "ADSL", variable: "AGEU", label: "Age Units", type: "Char", length: 10, displayFormat: "$10.", derivation: "DM.AGEU", hasVlm: false },
  { id: "v10", datasetName: "ADSL", variable: "ALCSTAT", label: "Alcohol Consumption Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Direct copy from Medical History (MH) domain.", hasVlm: false },
  { id: "v11", datasetName: "ADSL", variable: "ALCSTT", label: "Alcohol Status", type: "Char", length: 20, displayFormat: "$20.", derivation: 'Subset the data with SU.SUTRT = "ALCOHOL" If SUENRTPT="BEFORE" then ALCSTT="Former" else if SUENRTPT="ONGOING" then ALCSTT="Current" else if SUENRTPT="" and SUOCCUR="N" then ALCSTT="Never".', hasVlm: false },
  { id: "v12", datasetName: "ADLB", variable: "ANRLO", label: "Analysis Normal Range Lower Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Lower limit of normal range for the lab parameter.", hasVlm: false },
  { id: "v13", datasetName: "ADLB", variable: "ANRHI", label: "Analysis Normal Range Upper Limit", type: "Num", length: 8, displayFormat: "8.2", derivation: "Upper limit of normal range for the lab parameter.", hasVlm: false },
  { id: "v_arace", datasetName: "ADSL", variable: "ARACE", label: "Analysis Race", type: "Char", length: 50, displayFormat: "$50.", derivation: 'Set to "American Indian or Alaska Native" if ADSL.RACE="AMERICAN INDIAN OR ALASKA NATIVE". else "Asian" if ADSL.RACE="ASIAN". else "Black or African American" if ADSL.RACE="BLACK OR AFRICAN AMERICAN". else "Native Hawaiian or Other Pacific Islander" if ADSL.RACE="NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER". else "White" if ADSL.RACE="WHITE". else "Multiple" if ADSL.RACE="MULTIPLE". else "Other" if ADSL.RACE="OTHER".', hasVlm: false },
  { id: "v_aracen", datasetName: "ADSL", variable: "ARACEN", label: "Analysis Race (N)", type: "Num", length: 8, displayFormat: "8.", derivation: 'Set to 1 if ADSL.ARACE="American Indian or Alaska Native". else set to 2 if ADSL.ARACE="Asian". else set to 3 if ADSL.ARACE="Black or African American". else set to 4 if ADSL.ARACE="Native Hawaiian or Other Pacific Islander". else set to 5 if ADSL.ARACE="White". else set to 6 if ADSL.ARACE="Multiple". else set to 7 if ADSL.ARACE="Other".', hasVlm: false },
  { id: "v14", datasetName: "ADAE", variable: "AREL", label: "AE Relationship to Study Drug", type: "Char", length: 8, displayFormat: "$8.", derivation: "Related / Not Related / Possibly Related.", hasVlm: false },
  { id: "v_arm", datasetName: "ADSL", variable: "ARM", label: "Description of Planned Arm", type: "Char", length: 40, displayFormat: "$40.", derivation: "DM.ARM", hasVlm: false },
  { id: "v_armcd", datasetName: "ADSL", variable: "ARMCD", label: "Planned Arm Code", type: "Char", length: 20, displayFormat: "$20.", derivation: "DM.ARMCD", hasVlm: false },
  { id: "v_armnrs", datasetName: "ADSL", variable: "ARMNRS", label: "Reason Arm and/or Actual Arm is Null", type: "Char", length: 60, displayFormat: "$60.", derivation: "DM.ARMNRS", hasVlm: false },
  { id: "v15", datasetName: "ADSL", variable: "ASEX", label: "Analysis Sex", type: "Char", length: 10, displayFormat: "$10.", derivation: 'Set to "Male" if ADSL.SEX="M". else "Female" if ADSL.SEX="F".', hasVlm: false },
  { id: "v_asexn", datasetName: "ADSL", variable: "ASEXN", label: "Analysis Sex (N)", type: "Num", length: 8, displayFormat: "8.", derivation: 'Set to 1 if ADSL.ASEX="Male". else set to 2 if ADSL.ASEX="Female".', hasVlm: false },
  { id: "v16", datasetName: "ADEXSUM", variable: "ATOXGR", label: "Analysis Toxicity Grade", type: "Char", length: 4, displayFormat: "$4.", derivation: "Toxicity grade applied to AVAL.", hasVlm: false },
  { id: "v17", datasetName: "ADEXSUM", variable: "AVAL", label: "Analysis Value", type: "Num", length: 8, displayFormat: "8.2", derivation: "Varies by PARAM; see VLM for conditional logic.", hasVlm: true },
  { id: "v18", datasetName: "ADLB", variable: "AVAL", label: "Analysis Value (Lab)", type: "Num", length: 8, displayFormat: "8.3", derivation: "Lab result in standard units. VLM defines per-PARAM logic.", hasVlm: true },
  { id: "v19", datasetName: "ADTTE", variable: "AVAL", label: "Analysis Value (Time)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Time to event in days/months. VLM defines per-PARAM logic.", hasVlm: true },
  { id: "v20", datasetName: "ADSL", variable: "BMIBL", label: "Baseline Body Mass Index (kg/m2)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to ADSL.WEIGHTBL / ((ADSL.HEIGHTBL / 100)**2) rounded to 1 decimal place.", hasVlm: false },
  { id: "v21", datasetName: "ADSL", variable: "BMIGR1", label: "Baseline BMI Group (<25, 25-<30, >=30)", type: "Char", length: 12, displayFormat: "$12.", derivation: 'Set to "<25" if BMIBL<25; "25-<30" if 25<=BMIBL<30; ">=30" if BMIBL>=30.', hasVlm: false },
  { id: "v22", datasetName: "ADSL", variable: "CIGPKYR", label: "Cigarette Pack Years", type: "Num", length: 8, displayFormat: "8.1", derivation: "Calculated from (Cigarettes per day / 20) * Years smoked.", hasVlm: false },
  { id: "v23", datasetName: "ADTTE", variable: "CNSR", label: "Censor Indicator", type: "Num", length: 8, displayFormat: "1.", derivation: "0 = Event, 1 = Censored.", hasVlm: true },
  { id: "v24", datasetName: "ADRESP", variable: "COHORT", label: "Study Cohort", type: "Char", length: 20, displayFormat: "$20.", derivation: "Dose expansion / escalation cohort identifier.", hasVlm: false },
  { id: "v25", datasetName: "ADSL", variable: "ECOBLG1N", label: "Baseline ECOG Performance Score Numeric", type: "Num", length: 8, displayFormat: "8.", derivation: "Numeric value of baseline ECOG Performance Status (0, 1, 2, 3).", hasVlm: false },
  { id: "v26", datasetName: "ADSL", variable: "ECOGBL", label: "Baseline ECOG Performance Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Baseline ECOG score collected at Day 1 / Screening.", hasVlm: false },
  { id: "v27", datasetName: "ADSL", variable: "ECOGBLN", label: "Baseline ECOG Status Code", type: "Num", length: 8, displayFormat: "8.", derivation: "Numeric code for ECOG status (0, 1, 2, 3, 4).", hasVlm: false },
  { id: "v28", datasetName: "ADRESP", variable: "FASFL", label: "Full Analysis Set Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if subject received at least one dose of study drug and has baseline assessment.", hasVlm: false },
  { id: "v29", datasetName: "ADSL", variable: "HEIGHTBL", label: "Baseline Height (cm)", type: "Num", length: 8, displayFormat: "8.1", derivation: "VS.VSSTRESN where VSTESTCD='HEIGHT' and VSTPT='BASELINE'.", hasVlm: false },
  { id: "v30", datasetName: "ADSL", variable: "ITT3LFL", label: "ITT Population Flag 3rd Line", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' for third-line Intent-to-Treat randomized subjects.", hasVlm: false },
  { id: "v31", datasetName: "ADSL", variable: "ITTFL", label: "Intent-to-Treat Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject is randomized.", hasVlm: false },
  { id: "v32", datasetName: "ADSL", variable: "NICPKYR", label: "Nicotine Pack Years", type: "Num", length: 8, displayFormat: "8.1", derivation: "Total nicotine pack years calculated from consumption history.", hasVlm: false },
  { id: "v33", datasetName: "ADSL", variable: "NICSTT", label: "Nicotine Smoking Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Never, Former, Current smoker.", hasVlm: false },
  { id: "v34", datasetName: "ADSL", variable: "NICSYN", label: "Nicotine Usage Flag (Y/N)", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if patient has documented history of nicotine use.", hasVlm: false },
  { id: "v35", datasetName: "ADSL", variable: "NICTYP", label: "Nicotine Product Type", type: "Char", length: 30, displayFormat: "$30.", derivation: "Cigarettes, Cigars, E-cigarettes, Chewing tobacco.", hasVlm: false },
  { id: "v36", datasetName: "ADRESP", variable: "OCCRVRFL", label: "Overall Confirmed Complete Response Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if confirmed complete response criteria met according to RECIST 1.1.", hasVlm: false },
  { id: "v37", datasetName: "ADRESP", variable: "OCPRVRFL", label: "Overall Confirmed Partial Response Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if confirmed partial response criteria met according to RECIST 1.1.", hasVlm: false },
  { id: "v38", datasetName: "ADEXSUM", variable: "PARAM", label: "Parameter Name", type: "Char", length: 40, displayFormat: "$40.", derivation: "Defines the exposure metric being summarized.", hasVlm: true },
  { id: "v39", datasetName: "ADEXSUM", variable: "PARAMCD", label: "Parameter Code", type: "Char", length: 8, displayFormat: "$8.", derivation: "Short code for PARAM.", hasVlm: false },
  { id: "v40", datasetName: "ADRESP", variable: "PARQUAL", label: "Parameter Qualifier", type: "Char", length: 40, displayFormat: "$40.", derivation: "Qualifier indicating 'INDEPENDENT ASSESSOR' or 'INVESTIGATOR'.", hasVlm: false },
  { id: "v41", datasetName: "ADSL", variable: "PRHER2FL", label: "Prior HER2 Therapy Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior anti-HER2 targeted therapy documented.", hasVlm: false },
  { id: "v42", datasetName: "ADSL", variable: "PRIMMFL", label: "Prior Immunotherapy Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior checkpoint inhibitor or immuno-oncology treatment documented.", hasVlm: false },
  { id: "v43", datasetName: "ADSL", variable: "PRSYSG1", label: "Prior Systemic Therapy Regimen Group 1", type: "Char", length: 30, displayFormat: "$30.", derivation: "Categorized: 1 line, 2 lines, >=3 lines of prior systemic anticancer therapy.", hasVlm: false },
  { id: "v44", datasetName: "ADSL", variable: "PRTOPOFL", label: "Prior Topoisomerase Inhibitor Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Set to 'Y' if prior topoisomerase I/II inhibitor therapy received.", hasVlm: false },
  { id: "v45", datasetName: "ADSL", variable: "RACE", label: "Race", type: "Char", length: 32, displayFormat: "$32.", derivation: "As collected from site records.", hasVlm: false },
  { id: "v46", datasetName: "ADSL", variable: "SAFFL", label: "Safety Population Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if subject received at least 1 dose of study drug.", hasVlm: false },
  { id: "v47", datasetName: "ADSL", variable: "SEX", label: "Sex", type: "Char", length: 1, displayFormat: "$1.", derivation: "M = Male, F = Female", hasVlm: false },
  { id: "v48", datasetName: "ADSL", variable: "SMOKSTAT", label: "Smoking Status", type: "Char", length: 20, displayFormat: "$20.", derivation: "Direct copy from Medical History (MH) domain.", hasVlm: false },
  { id: "v49", datasetName: "ADSL", variable: "STRATA1", label: "Stratification Factor 1", type: "Char", length: 16, displayFormat: "$16.", derivation: "Region (Asia / Non-Asia).", hasVlm: false },
  { id: "v50", datasetName: "ADSL", variable: "STUDYID", label: "Study Identifier", type: "Char", length: 20, displayFormat: "$20.", derivation: "Copied from SDTM DM.STUDYID", hasVlm: false },
  { id: "v51", datasetName: "ADSL", variable: "TRT01P", label: "Planned Treatment", type: "Char", length: 20, displayFormat: "$20.", derivation: "Treatment arm as planned in randomization.", hasVlm: false },
  { id: "v52", datasetName: "ADSL", variable: "TRT01PN", label: "Planned Treatment Code", type: "Num", length: 8, displayFormat: "8.", derivation: "1 = Treatment Arm A, 2 = Treatment Arm B.", hasVlm: false },
  { id: "v53", datasetName: "ADAE", variable: "TRTEMFL", label: "Treatment Emergent AE Flag", type: "Char", length: 1, displayFormat: "$1.", derivation: "Y if onset date >= first dose date and <= last dose date + 30 days.", hasVlm: false },
  { id: "v54", datasetName: "ADSL", variable: "TUMGRADE", label: "Tumour Grade", type: "Char", length: 20, displayFormat: "$20.", derivation: "FA.FASTRESC when FA.FASCAT='PATHOLOGY FINDINGS'.", hasVlm: false },
  { id: "v55", datasetName: "ADSL", variable: "USUBJID", label: "Unique Subject Identifier", type: "Char", length: 30, displayFormat: "$30.", derivation: "DM.USUBJID", hasVlm: false },
  { id: "v56", datasetName: "ADSL", variable: "WEIGHTBL", label: "Baseline Weight (kg)", type: "Num", length: 8, displayFormat: "8.1", derivation: "Set to the latest non missing VS.VSSTRESN where VSTESTCD='WEIGHT' and VSBLFL='Y'.", hasVlm: false },
  { id: "v57", datasetName: "ADSL", variable: "WGHBLG1N", label: "Pooled Baseline Weight Group 1 Numeric", type: "Num", length: 8, displayFormat: "8.", derivation: "Set to 1 if ADSL.WTBLG1='<65', else set to 2 if ADSL.WTBLG1='>=65'.", hasVlm: false },
  { id: "v58", datasetName: "ADSL", variable: "WGHTBLG1", label: "Pooled Baseline Weight Group 1", type: "Char", length: 12, displayFormat: "$12.", derivation: "Set to '<65' if ADSL.WEIGHTBL<65, else '>=65'.", hasVlm: false },
  { id: "v59", datasetName: "ADSL", variable: "WGTBLU", label: "Baseline Weight Unit", type: "Char", length: 10, displayFormat: "$10.", derivation: "VS.VSSTRESU where VSTESTCD='WEIGHT'.", hasVlm: false },
  { id: "v60", datasetName: "ADSL", variable: "WGTGR1", label: "Weight Group 1 (<65, >=65 kg)", type: "Char", length: 12, displayFormat: "$12.", derivation: "Categorized weight: <65 kg, >=65 kg.", hasVlm: false },
  { id: "v61", datasetName: "ADSL", variable: "WHSTTYP", label: "WHO Classification", type: "Char", length: 40, displayFormat: "$40.", derivation: "Propercase of FA.FASTRESC when FA.FASCAT='HISTOLOGY'.", hasVlm: false },
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

function CheckboxIcon({ state }: { state: "empty" | "checked" }) {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {state === "checked" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#830051" />
          <path d="M9.5 15.2L18.2 6.5L19.6 7.9L9.5 18L4 12.5L5.4 11.1L9.5 15.2Z" fill="white" />
        </>
      ) : (
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" stroke="#B2B4B4" strokeWidth="1" fill="none" />
      )}
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

// ==================== Inline Variable List ====================

function InlineVariableList({
  label,
  variables,
  selected,
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
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
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
    const q = search.toLowerCase();
    const items = variables.filter(
      (v) =>
        v.variable.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
    // Sort: selected first, then alphabetical
    return items.sort((a, b) => {
      const aS = selected.includes(a.variable) ? 0 : 1;
      const bS = selected.includes(b.variable) ? 0 : 1;
      if (aS !== bS) return aS - bS;
      return a.variable.localeCompare(b.variable);
    });
  }, [variables, search, selected]);

  const hasMoreThanThree = selected.length > 3;
  const visibleSelected = hasMoreThanThree && !isExpandedTags
    ? selected.slice(0, 3)
    : selected;

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
      {/* Search bar */}
      <div className="w-full">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search..."
          background="light"
          autoFocus
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
              <p className="t-small text-[#888E8E]">No matching variables found</p>
            </div>
          ) : (
            filtered.map((v) => {
              const isSelected = selected.includes(v.variable);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(v.variable);
                  }}
                  className={`grid w-full grid-cols-[44px_130px_170px_1fr] items-start px-[2px] py-[10px] min-h-[56px] text-left transition-colors border-b border-[#F0F0F0] last:border-b-0 cursor-pointer ${
                    isSelected ? "bg-[#F8EFF4] hover:bg-[#F3E3ED]" : "bg-white hover:bg-[#F8F9F9]"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex h-[20px] w-[44px] items-center justify-center shrink-0">
                    <span
                      className={`flex h-[16px] w-[16px] items-center justify-center rounded-[2px] border transition-colors ${
                        isSelected ? "border-[#830051] bg-[#830051]" : "border-[#D8DADA] bg-white hover:border-[#888E8E]"
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="white"/>
                        </svg>
                      )}
                    </span>
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
                </button>
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
                {visibleSelected.map((v) => (
                  <Tooltip label={v} key={v}>
                    <Tag
                      onClose={disabled ? undefined : (e) => {
                        e.stopPropagation();
                        onRemove(v);
                      }}
                      className="max-h-[26px] py-[1px] px-[4px]"
                      style={{ maxWidth: "160px" }}
                    >
                      {v}
                    </Tag>
                  </Tooltip>
                ))}
                {hasMoreThanThree && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpandedTags(!isExpandedTags);
                    }}
                    className="inline-flex items-center gap-[4px] py-[2px] text-[11px] text-brand-1 cursor-pointer font-medium max-h-[26px] bg-transparent hover:bg-transparent transition-colors"
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
  const needsTruncate = lines.length > 2 || text.length > 80;

  if (!needsTruncate) {
    return <p className="t-small text-text-primary whitespace-normal">{text}</p>;
  }

  return (
    <div>
      <p className="t-small text-text-primary whitespace-normal">
        {expanded ? text : text.slice(0, 80) + (text.length > 80 ? "…" : "")}
      </p>
      {needsTruncate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="t-small text-[#830051] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
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
}: BrowseVariablesModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "vlm">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // Sync initial selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected([...initialSelected]);
      setSearch("");
      setActiveTab("all");
    }
  }, [isOpen, initialSelected]);

  const toggleVariable = useCallback((variable: string) => {
    setSelected((prev) =>
      prev.includes(variable) ? prev.filter((v) => v !== variable) : [...prev, variable]
    );
  }, []);

  const removeVariable = useCallback((variable: string) => {
    setSelected((prev) => prev.filter((v) => v !== variable));
  }, []);

  // Jump to VLM tab and filter to variable
  const jumpToVlm = useCallback((variable: string) => {
    setActiveTab("vlm");
    setSearch(variable);
  }, []);

  const filteredVariables = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return variables;
    return variables.filter(
      (v) =>
        v.variable.toLowerCase().includes(q) ||
        v.label.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
  }, [variables, search]);

  const filteredVlm = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return vlmData;
    return vlmData.filter(
      (v) =>
        v.variableName.toLowerCase().includes(q) ||
        v.parameterName.toLowerCase().includes(q) ||
        v.datasetName.toLowerCase().includes(q)
    );
  }, [vlmData, search]);

  if (!isOpen) return null;

  const selectedVariables = selected
    .map((vName) => variables.find((v) => v.variable === vName))
    .filter(Boolean) as Variable[];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close modal" />

      {/* Modal */}
      <div className="relative flex h-[600px] w-[800px] max-w-[90vw] max-h-[85vh] flex-col rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.15)]">
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

        {/* Search + Tabs */}
        <div className="flex shrink-0 items-center gap-[12px] border-b border-[#D8DADA] px-[20px]">
          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Variables..."
            background="light"
            className="flex-1 my-[4px]"
          />
          {/* Tabs */}
          <div className="flex h-full items-center">
            {(["all", "vlm"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSearch("");
                  }}
                  className={`flex h-full items-center border-b-2 px-[12px] py-[8px] active:scale-[0.96] ${
                    isActive ? "border-[#830051]" : "border-transparent"
                  }`}
                >
                  <span className={`t-small font-medium ${isActive ? "text-[#830051]" : "text-text-primary"}`}>
                    {tab === "all" ? "All Variables" : "VLM"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bar */}
        {selected.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-[4px] border-b border-graphite-10 bg-bg-panel px-[20px] py-[8px]">
            <span className="t-small text-[#888E8E] shrink-0 mr-[4px]">Selected:</span>
            {selectedVariables.map((v) => (
              <span
                key={v.variable}
                className="inline-flex h-[22px] items-center gap-[2px] rounded-[4px] bg-[#F4E8EE] pl-[6px] pr-[2px]"
              >
                <span className="t-small text-[#830051]">{v.variable}</span>
                <button
                  type="button"
                  onClick={() => removeVariable(v.variable)}
                  className="flex h-[16px] w-[16px] items-center justify-center rounded-[2px] hover:bg-black/5"
                >
                  <CloseIcon className="h-[10px] w-[10px]" color="#830051" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Table Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          {activeTab === "all" && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-bg-panel">
                <tr className="border-b border-[#D8DADA]">
                  <th className="w-[36px] px-[12px] py-[8px]" />
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Dataset</span>
                  </th>
                  <th className="w-[120px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Variable</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Label</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Format</span>
                  </th>
                  <th className="w-[180px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVariables.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <div className="flex flex-col items-center gap-[8px]">
                        <p className="t-small text-[#888E8E]">
                          当前 study 中未找到该变量，请确认 ADaM dataset 是否已包含
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="t-small text-brand-1 hover:underline font-medium"
                          >
                            清除搜索内容
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVariables.map((v) => {
                    const isSelected = selected.includes(v.variable);
                    return (
                      <tr
                        key={v.id}
                        className={`border-b border-graphite-10 hover:bg-bg-panel ${isSelected ? "bg-[#F4E8EE]/40" : ""}`}
                      >
                        <td className="px-[12px] py-[6px]">
                          <button
                            type="button"
                            onClick={() => toggleVariable(v.variable)}
                            className="flex h-[18px] w-[18px] items-center justify-center"
                          >
                            <CheckboxIcon state={isSelected ? "checked" : "empty"} />
                          </button>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <span className="t-small whitespace-nowrap text-text-primary">{v.datasetName}</span>
                        </td>
                        <td className="px-[8px] py-[6px]">
                          <div className="flex items-center gap-[4px]">
                            <span className="t-small font-medium whitespace-nowrap text-text-primary">{v.variable}</span>
                            {v.hasVlm && (
                              <button
                                type="button"
                                onClick={() => jumpToVlm(v.variable)}
                                className="inline-flex h-[18px] items-center gap-[1px] rounded-[4px] bg-[#E1F6F9] px-[4px] hover:bg-[#C3EDF2]"
                              >
                                <span className="text-[10px] font-medium whitespace-nowrap text-text-primary">VLM ↗</span>
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
                    <span className="t-small font-medium text-[#888E8E]">Dataset</span>
                  </th>
                  <th className="w-[160px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Parameter Name</span>
                  </th>
                  <th className="w-[140px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Where Clause</span>
                  </th>
                  <th className="w-[100px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Variable</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Type/Len</span>
                  </th>
                  <th className="w-[80px] px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Format</span>
                  </th>
                  <th className="px-[8px] py-[8px] text-left">
                    <span className="t-small font-medium text-[#888E8E]">Derivation</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVlm.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[20px] py-[32px] text-center">
                      <p className="t-small text-[#888E8E]">
                        当前 study 暂无 VLM 变量定义
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredVlm.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-graphite-10 hover:bg-bg-panel"
                    >
                      <td className="px-[12px] py-[6px]">
                        <span className="t-small whitespace-nowrap text-text-primary">{row.datasetName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-small text-text-primary whitespace-normal">{row.parameterName}</span>
                      </td>
                      <td className="px-[8px] py-[6px]">
                        <span className="t-code text-text-primary">{row.whereClause}</span>
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
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-[12px] border-t border-[#D8DADA] px-[20px] py-[12px]">
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
              onClose();
            }}
            className="h-[32px] rounded-[4px] bg-[#830051] px-[16px] t-small font-medium text-white hover:bg-[#6D0043] active:scale-[0.96]"
          >
            Confirm ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Exported Compound ====================

export interface BrowseVariablesFieldProps {
  label?: React.ReactNode;
  value?: string[];
  onChange?: (selected: string[]) => void;
  initialSelected?: string[];
  required?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  placeholder?: string;
  error?: string;
  className?: string;
  variables?: Variable[];
  vlmData?: VlmRow[];
}

export function BrowseVariablesField({
  label,
  value,
  onChange,
  initialSelected = [],
  required = false,
  disabled = false,
  badge,
  placeholder = "Select variables…",
  error,
  className = "",
  variables = mockVariables,
  vlmData = mockVlmData,
}: BrowseVariablesFieldProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(initialSelected);
  const [modalOpen, setModalOpen] = useState(false);

  const isControlled = value !== undefined;
  const currentSelected = isControlled ? value : internalSelected;

  const handleToggle = (variable: string) => {
    const next = currentSelected.includes(variable)
      ? currentSelected.filter((v) => v !== variable)
      : [...currentSelected, variable];
    if (onChange) onChange(next);
    if (!isControlled) setInternalSelected(next);
  };

  const handleRemove = (variable: string) => {
    const next = currentSelected.filter((v) => v !== variable);
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
        selected={currentSelected}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onBrowseAll={() => setModalOpen(true)}
      />
      <BrowseVariablesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialSelected={currentSelected}
        variables={variables}
        vlmData={vlmData}
      />
    </>
  );
}

export default BrowseVariablesField;

