// AI Copilot Chat Window - Design Tokens & Visual Specs
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import atlasLogoUrl from "../../icons/Atlas-Logo.svg";
import atlasLogoFullUrl from "../../icons/Atlas-Logo-Full.svg";
import aiSubmitIconUrl from "../../icons/AI-submit.svg";
import checkIconUrl from "../../icons/check-line.svg";
import closeIconUrl from "../../icons/close-line.svg";
import codeIconUrl from "../../icons/code-line.svg";
import codeSlashIconUrl from "../../icons/code-s-slash-line.svg";
import eyeLineIconUrl from "../../icons/eye-line.svg";
import contractUpDownIconUrl from "../../icons/contract-up-down-line.svg";
import expandUpDownIconUrl from "../../icons/expand-up-down-line.svg";
import collapseIconUrl from "../../icons/Icon-collapse.svg";
import copyIconUrl from "../../icons/file-copy-line.svg";
import editIconUrl from "../../icons/edit-2-line.svg";
import errorWarningIconUrl from "../../icons/error-warning-line.svg";
import closeCircleIconUrl from "../../icons/close-circle-line.svg";
import alertIconUrl from "../../icons/alert-line.svg";
import expandIconUrl from "../../icons/Icon-expand.svg";
import figureIconUrl from "../../icons/Figure.svg";
import historyIconUrl from "../../icons/History Icon.svg";
import listingIconUrl from "../../icons/Listing.svg";
import lockIconUrl from "../../icons/Lock.svg";
import moreIconUrl from "../../icons/More Icon.svg";
import tableIconUrl from "../../icons/Table.svg";
import toolCallIconUrl from "../../icons/pencil-ai-line.svg";
import unlockIconUrl from "../../icons/Unlock.svg";
import saveIconUrl from "../../icons/save-line.svg";
import fileInfoIconUrl from "../../icons/file-info-line.svg";
import arrowRightIconUrl from "../../icons/arrow-right-s-line.svg";
import batchMicroIconUrl from "../../icons/batch-micro.svg";
import aiProcessingIconUrl from "../../icons/Status label/Status=AI Processing.svg";
import wipStatusIconUrl from "../../icons/Status label/Status=WIP.svg";
import completedStatusIconUrl from "../../icons/Status label/Status=Completed.svg";
import untouchedStatusIconUrl from "../../icons/Status label/Status=Untouched.svg";
import errorStatusIconUrl from "../../icons/Status label/Status=Error.svg";
import addMetadiffIconUrl from "../../icons/Add metadiff.svg";
import dashboardIconUrl from "../../icons/dashboard-3-line.svg";
import taskIconUrl from "../../icons/task-line.svg";
import stackIconUrl from "../../icons/stack-line.svg";
import capsuleIconUrl from "../../icons/capsule-line.svg";
import microscopeIconUrl from "../../icons/microscope-line.svg";
import homeIconUrl from "../../icons/home-5-line.svg";
import teamIconUrl from "../../icons/team-line.svg";
import searchLineIconUrl from "../../icons/search-line.svg";
import filterIconUrl from "../../icons/filter-line.svg";
import addLineIconUrl from "../../icons/add-line.svg";
import arrowRightDoubleLineUrl from "../../icons/arrow-right-double-line.svg";
import barChartIconUrl from "../../icons/bar-chart-2-line.svg";
import downloadIconUrl from "../../icons/download-2-line.svg";
import shiningFillIconUrl from "../../icons/shining-fill.svg";
import snowflakeIconUrl from "../../icons/snowflake-line.svg";
import deleteBinIconUrl from "../../icons/delete-bin-line.svg";
import linkUnlinkIconUrl from "../../icons/link-unlink-m.svg";
import focusIconUrl from "../../icons/focus-3-line.svg";
import barChartBoxAiIconUrl from "../../icons/bar-chart-box-ai-line.svg";
import imageAiLineIconUrl from "../../icons/image-ai-line.svg";
import CreateEventModal from "./components/CreateEventModal";
import DownloadSasProgramsModal from "./components/DownloadSasProgramsModal";
import DeleteEventModal from "./components/DeleteEventModal";
import { FigureRenderPreviewModal } from "./components/FigureRenderPreviewModal";
import { KMPlot } from "./components/KMPlot";
import { Button } from "../../components/ui/Button";
import { Tooltip } from "../../components/ui/Tooltip";
import type { TooltipMetadataSection } from "../../components/ui/Tooltip";
import { Dropdown } from "../../components/ui/Dropdown";
import { MultiSelectDropdown } from "../../components/ui/MultiSelectDropdown";
import { FilterChip } from "../../components/ui/FilterChip";
import { BrowseVariablesField } from "./components/BrowseVariablesModal";
import { FormTextArea as Textarea } from "../../components/ui/FormTextArea";
import { AIInputBox } from "../../components/ui/AI-InputBox";
import { AIUserPrompt } from "../../components/ui/AI-UserPrompt";
import { AICodeDiff } from "../../components/ui/AI-CodeDiff";
import { AIThinkingStatus } from "../../components/ui/AI-ThinkingStatus";
import { AIUpdatedBlock } from "../../components/ui/AI-UpdatedBlock";
import ChatBox from "./components/ChatBox";
import type { AttachmentItem } from "./components/ChatBox";
import { SearchBar } from "../../components/ui/SearchBar";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { OptionLabel } from "../../components/ui/OptionLabel";
import { FormInputField as Input } from "../../components/ui/FormInputField";
import { Input as BaseInput } from "../../components/ui/Input";
import { FormItem } from "../../components/ui/FormItem";
import doubleQuotesLUrl from "../../icons/double-quotes-l.svg";
import groupIconUrl from "../../icons/group.svg";
import { GroupCodePanel, type GroupCodeItem } from "../../components/ui/GroupCodePanel";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Lazy-loaded low-frequency components
const MarkdownTable = lazy(() => import("./components/MarkdownTable"));
const CodeDiffBlock = lazy(() => import("./components/CodeDiffBlock"));
const AskUserComponent = lazy(() => import("./components/AskUserComponent"));

export interface MetaDiffItem {
  fieldId: string;
  label: string;
  oldValue: string;
  newValue: string;
}

export const MOCK_GROUP_CODES: Record<string, GroupCodeItem[]> = {
  't2': [
    {
      id: 'grp_saf1l_1',
      name: 'SAF1LT01bL2_5_8_456NP',
      distinguishingParam: 'trtfmtC: gpT01bG3L2_5_8_456f',
      formatFound: false,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.2.1 (t_ec_14_2_1)',
      ],
      lines: [
        "/* Format definition not found in source */",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF1LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01bG3L2_5_8_456f",
        "    ,gmacro=SAF1LT01bL2_5_8_456NP",
        "    ,BigN=Y",
        ");",
      ],
    },
    {
      id: 'grp_saf3l_1',
      name: 'SAF3LT01aL1_3_12_123NP',
      distinguishingParam: 'trtfmtC: gpT01aG5L1_3_12_123f',
      formatFound: true,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.3.7.1.6 (t_lb_14_3_7_1_6)',
        'Listing 16.2.4.3.2 (l_cm_16_2_4_3_2)',
        'Listing 16.2.8.2 (l_lb_16_2_8_2)',
        'Figure 15.1.1 (f_km_01_overall)',
      ],
      lines: [
        "proc format;",
        "  value gpT01aG5L1_3_12_123f",
        "  1 = 'AZD999(*ESC*)n1 mg/kg'",
        "  2 = 'AZD999(*ESC*)n2 mg/kg'",
        "  3 = 'AZD999(*ESC*)nTotal'",
        "  4 = 'Investigator choice of therapy'",
        "  5 = 'Total'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF3LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,trtlev=1|2|1 2|3|1 2 3",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01aG5L1_3_12_123f",
        "    ,gmacro=SAF3LT01aL1_3_12_123NP",
        "    ,BigN=Y",
        "    ,nformat=%str(n (%%))",
        ");",
      ],
    },
    {
      id: 'grp_saf3l_2',
      name: 'SAF3LT01aL1_3_12_123NP',
      distinguishingParam: 'trtfmtC: gpT01aG5L1_3_12_999f',
      formatFound: true,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.1.1 (t_dm_14_1_1)',
      ],
      lines: [
        "proc format;",
        "  value gpT01aG5L1_3_12_999f",
        "  1 = 'Dose Cohort 1'",
        "  2 = 'Dose Cohort 2'",
        "  3 = 'Total Evaluated'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF3LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01aG5L1_3_12_999f",
        "    ,gmacro=SAF3LT01aL1_3_12_123NP",
        "    ,BigN=Y",
        ");",
      ],
    },
  ],
  't4': [
    {
      id: 'grp_saf1l_1',
      name: 'SAF1LT01bL2_5_8_456NP',
      distinguishingParam: 'trtfmtC: gpT01bG3L2_5_8_456f',
      formatFound: false,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.2.1 (t_ec_14_2_1)',
      ],
      lines: [
        "/* Format definition not found in source */",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF1LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01bG3L2_5_8_456f",
        "    ,gmacro=SAF1LT01bL2_5_8_456NP",
        "    ,BigN=Y",
        ");",
      ],
    },
    {
      id: 'grp_saf3l_1',
      name: 'SAF3LT01aL1_3_12_123NP',
      distinguishingParam: 'trtfmtC: gpT01aG5L1_3_12_123f',
      formatFound: true,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.3.7.1.6 (t_lb_14_3_7_1_6)',
        'Listing 16.2.4.3.2 (l_cm_16_2_4_3_2)',
        'Listing 16.2.8.2 (l_lb_16_2_8_2)',
        'Figure 15.1.1 (f_km_01_overall)',
      ],
      lines: [
        "proc format;",
        "  value gpT01aG5L1_3_12_123f",
        "  1 = 'AZD999(*ESC*)n1 mg/kg'",
        "  2 = 'AZD999(*ESC*)n2 mg/kg'",
        "  3 = 'AZD999(*ESC*)nTotal'",
        "  4 = 'Investigator choice of therapy'",
        "  5 = 'Total'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF3LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,trtlev=1|2|1 2|3|1 2 3",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01aG5L1_3_12_123f",
        "    ,gmacro=SAF3LT01aL1_3_12_123NP",
        "    ,BigN=Y",
        "    ,nformat=%str(n (%%))",
        ");",
      ],
    },
    {
      id: 'grp_saf3l_2',
      name: 'SAF3LT01aL1_3_12_123NP',
      distinguishingParam: 'trtfmtC: gpT01aG5L1_3_12_999f',
      formatFound: true,
      usedIn: [
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
        'Table 14.1.1 (t_dm_14_1_1)',
      ],
      lines: [
        "proc format;",
        "  value gpT01aG5L1_3_12_999f",
        "  1 = 'Dose Cohort 1'",
        "  2 = 'Dose Cohort 2'",
        "  3 = 'Total Evaluated'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAF3LFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT01aG5L1_3_12_999f",
        "    ,gmacro=SAF3LT01aL1_3_12_123NP",
        "    ,BigN=Y",
        ");",
      ],
    },
  ],
  'l1': [
    {
      id: 'grp_itt1_err',
      name: 'ITT2T03cL1_9_1_999NP',
      distinguishingParam: 'trtfmtC: gpT03cG1_missing',
      formatFound: false,
      usedIn: [
        'Listing 16.2.1 (l_cm_16_2_4_3_2)',
      ],
      lines: [
        "/* Format definition not found in source */",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=ITT2FL='Y'",
        "    ,trtgrpn=TRT03AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT03cG1_missing",
        "    ,gmacro=ITT2T03cL1_9_1_999NP",
        "    ,BigN=Y",
        ");",
      ],
    },
    {
      id: 'grp_itt1_1',
      name: 'ITT1T02aL1_7_3_789NP',
      distinguishingParam: 'trtfmtC: gpT02aG2L1_7_3_789f',
      formatFound: true,
      usedIn: [
        'Listing 16.2.1 (l_cm_16_2_4_3_2)',
        'Listing 16.2.8.2 (l_lb_16_2_8_2)',
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
      ],
      lines: [
        "proc format;",
        "  value gpT02aG2L1_7_3_789f",
        "  1 = 'Active Treatment 100mg'",
        "  2 = 'Placebo Control'",
        "  3 = 'Total ITT'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=ITT1FL='Y'",
        "    ,trtgrpn=TRT02AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpT02aG2L1_7_3_789f",
        "    ,gmacro=ITT1T02aL1_7_3_789NP",
        "    ,BigN=Y",
        ");",
      ],
    },
  ],
  'f1': [
    {
      id: 'grp_fig_err',
      name: 'KM_POPN_ERR_01',
      distinguishingParam: 'trtfmtC: gpKM01_missing',
      formatFound: false,
      usedIn: [
        'Figure 15.1.1 (f_km_01_overall)',
      ],
      lines: [
        "/* Format definition not found in source */",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAFFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpKM01_missing",
        "    ,gmacro=KM_POPN_ERR_01",
        "    ,BigN=Y",
        ");",
      ],
    },
    {
      id: 'grp_fig_1',
      name: 'KM_POPN_OVERALL_01',
      distinguishingParam: 'trtfmtC: gpKM01f',
      formatFound: true,
      usedIn: [
        'Figure 15.1.1 (f_km_01_overall)',
        'Table 14.1.6.1 (t_ae_14_3_2_8_2)',
      ],
      lines: [
        "proc format;",
        "  value gpKM01f",
        "  1 = 'Arm A (Dose 1)'",
        "  2 = 'Arm B (Dose 2)'",
        "  3 = 'Overall'",
        "  ;",
        "quit;",
        "",
        "%m_u_popn(",
        "    inds=adam.adsl",
        "    ,pop_flag=SAFFL='Y'",
        "    ,trtgrpn=TRT01AN",
        "    ,UniqueIDVars=usubjid",
        "    ,trtfmtC=gpKM01f",
        "    ,gmacro=KM_POPN_OVERALL_01",
        "    ,BigN=Y",
        ");",
      ],
    },
  ],
};

// ==================== Icons ====================

function CloseIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return <LocalIcon src={closeIconUrl} className={className} color={color === "currentColor" ? undefined : color} />;
}

function CheckIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return <LocalIcon src={checkIconUrl} className={className} color={color === "currentColor" ? undefined : color} />;
}

function SubmitIcon({ className = "w-[11px] h-[12px]", color = "white" }) {
  return <LocalIcon src={aiSubmitIconUrl} className={className} color={color} />;
}

function ErrorWarningIcon({ className = "w-[24px] h-[24px]", color = "black" }) {
  return <LocalIcon src={errorWarningIconUrl} className={className} color={color === "black" ? "#3C4242" : color} />;
}

function ToolCallIcon({ className = "w-[24px] h-[24px]", color = "black" }) {
  return <LocalIcon src={toolCallIconUrl} className={className} color={color === "black" ? "#3C4242" : color} />;
}

function BarChartBoxAiIcon({ className = "w-[24px] h-[24px]", color = "black" }) {
  return <LocalIcon src={barChartBoxAiIconUrl} className={className} color={color === "black" ? "#3C4242" : color} />;
}

// ==================== Utils ====================

function truncateText(text: string, maxLen: number = 56): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

// ==================== Base Components ====================

function IconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-graphite-10 transition-colors shrink-0"
    >
      {children}
    </button>
  );
}

function StatusLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[6px] h-[36px]">
      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
        {icon || <div className="w-[12px] h-[12px] border-2 border-[#888E8E] border-t-transparent rounded-full animate-spin" />}
      </div>
      <p className="t-body-secondary text-text-secondary">
        {children}
      </p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-az-secondary inline-flex gap-[4px] h-[20px] items-center max-w-[152px] pl-[2px] pr-[6px] rounded-[4px]">
      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <svg className="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.3332 7.99992L10.6191 12.714L9.6763 11.7712L13.4476 7.99992L9.6763 4.2287L10.6191 3.28589L15.3332 7.99992ZM2.55212 7.99992L6.32336 11.7712L5.38055 12.714L0.666504 7.99992L5.38055 3.28589L6.32336 4.2287L2.55212 7.99992Z" fill="var(--color-brand-1)"/>
        </svg>
      </div>
      <p className="t-small text-brand-1 truncate">
        {children}
      </p>
    </div>
  );
}

function ToolCallCard({ toolName, children }: { toolName: string; children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white border-[0.6px] border-graphite-20 rounded-[8px] px-[12px] py-[8px] w-full transition-colors ${
        hovered ? 'bg-bg-panel' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-[4px] h-[30px]">
        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
          <ToolCallIcon className="w-full h-full" color="var(--color-text-secondary)" />
        </div>
        <p className="t-body-compact text-text-primary">
          {toolName}
        </p>
      </div>
      {children && (
        <div className="mt-[8px] t-body text-text-primary">
          {children}
        </div>
      )}
    </div>
  );
}

const KM_PLOT_THUMBNAIL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="520" viewBox="0 0 600 520" fill="%23ffffff"><rect width="600" height="520" fill="%23ffffff"/><text x="20" y="20" font-family="sans-serif" font-size="8.5" fill="%23888E8E">AstraZeneca  |  Study D9802C00001 Clarity Gastric 01</text><text x="580" y="20" font-family="sans-serif" font-size="8.5" fill="%23888E8E" text-anchor="end">Page 1 of 1</text><text x="300" y="36" font-family="sans-serif" font-size="11" font-weight="600" fill="%233C4242" text-anchor="middle">Figure 15.1.1</text><text x="300" y="49" font-family="sans-serif" font-size="9.5" font-weight="500" fill="%23666C6C" text-anchor="middle">Kaplan-Meier Plot of Progression-Free Survival (PFS) with Subgroup Analysis</text><text x="300" y="60" font-family="sans-serif" font-size="8.5" font-weight="400" fill="%23888E8E" text-anchor="middle">(Safety Analysis Set)</text><line x1="20" y1="66" x2="580" y2="66" stroke="%23EBECEC" stroke-width="1"/><g transform="translate(20, 72)"><text x="45" y="10" font-family="sans-serif" font-size="8.5" font-weight="600" fill="%233C4242">Component 1: Kaplan-Meier PFS Curves</text><text x="550" y="10" font-family="sans-serif" font-size="8" fill="%23888E8E" text-anchor="end">Log-rank P &lt; 0.0001  |  HR=0.54 (95% CI: 0.38-0.76)</text><g stroke="%23F0F1F1" stroke-width="1" stroke-dasharray="2,2"><line x1="45" y1="20" x2="550" y2="20"/><line x1="45" y1="48" x2="550" y2="48"/><line x1="45" y1="76" x2="550" y2="76"/><line x1="45" y1="104" x2="550" y2="104"/><line x1="45" y1="132" x2="550" y2="132"/></g><text x="40" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="end">1.0</text><text x="40" y="51" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="end">0.75</text><text x="40" y="79" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="end">0.50</text><text x="40" y="107" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="end">0.25</text><text x="40" y="135" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="end">0.0</text><line x1="45" y1="20" x2="45" y2="132" stroke="%23888E8E" stroke-width="1"/><line x1="45" y1="132" x2="550" y2="132" stroke="%23888E8E" stroke-width="1"/><line x1="45" y1="76" x2="360" y2="76" stroke="%23830051" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/><line x1="360" y1="76" x2="360" y2="132" stroke="%23830051" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/><line x1="45" y1="76" x2="190" y2="76" stroke="%230284C7" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/><line x1="190" y1="76" x2="190" y2="132" stroke="%230284C7" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/><path d="M45 20 L108 26 L171 34 L234 45 L297 54 L360 65 L423 75 L486 86 L549 92 L549 108 L486 104 L423 94 L360 84 L297 73 L234 60 L171 46 L108 34 L45 20 Z" fill="%23830051" opacity="0.10"/><path d="M45 20 L108 24 L108 34 L171 34 L171 46 L234 46 L234 62 L297 62 L297 74 L360 74 L360 87 L423 87 L423 98 L486 98 L486 108 L549 108" fill="none" stroke="%23830051" stroke-width="2"/><path d="M45 20 L108 36 L108 52 L171 52 L171 72 L234 72 L234 94 L297 94 L297 110 L360 110 L360 120 L423 120 L423 126 L486 126 L549 130" fill="none" stroke="%230284C7" stroke-width="1.8" stroke-dasharray="4,3"/><text x="45" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">0</text><text x="108" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">3</text><text x="171" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">6</text><text x="234" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">9</text><text x="297" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">12</text><text x="360" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">18</text><text x="423" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">24</text><text x="486" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">30</text><text x="549" y="142" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">36</text><text x="297" y="152" font-family="sans-serif" font-size="8" fill="%233C4242" text-anchor="middle">Time from Randomization (Months)</text><rect x="420" y="24" width="125" height="34" rx="3" fill="%23ffffff" stroke="%23EBECEC" stroke-width="1"/><line x1="428" y1="33" x2="444" y2="33" stroke="%23830051" stroke-width="2"/><text x="448" y="36" font-family="sans-serif" font-size="7.5" fill="%233C4242">AZD999 (Med: 26.4 mo)</text><line x1="428" y1="47" x2="444" y2="47" stroke="%230284C7" stroke-width="1.8" stroke-dasharray="3,2"/><text x="448" y="50" font-family="sans-serif" font-size="7.5" fill="%233C4242">Placebo (Med: 11.2 mo)</text></g><g transform="translate(20, 235)"><text x="0" y="9" font-family="sans-serif" font-size="8" font-weight="600" fill="%233C4242">Component 2: Number at Risk Table</text><line x1="0" y1="13" x2="560" y2="13" stroke="%233C4242" stroke-width="0.8"/><text x="10" y="23" font-family="sans-serif" font-size="7.5" font-weight="600" fill="%233C4242">Treatment</text><text x="108" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">0</text><text x="171" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">6</text><text x="297" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">12</text><text x="423" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">24</text><text x="549" y="23" font-family="sans-serif" font-size="7.5" fill="%23888E8E" text-anchor="middle">36</text><line x1="0" y1="27" x2="560" y2="27" stroke="%23EBECEC" stroke-width="1"/><text x="10" y="37" font-family="sans-serif" font-size="7.5" fill="%23830051">AZD999 1 mg/kg (N=120)</text><text x="108" y="37" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">120</text><text x="171" y="37" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">104</text><text x="297" y="37" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">86</text><text x="423" y="37" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">62</text><text x="549" y="37" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">32</text><text x="10" y="48" font-family="sans-serif" font-size="7.5" fill="%230284C7">Placebo (N=118)</text><text x="108" y="48" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">118</text><text x="171" y="48" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">81</text><text x="297" y="48" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">52</text><text x="423" y="48" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">19</text><text x="549" y="48" font-family="sans-serif" font-size="7.5" fill="%233C4242" text-anchor="middle">4</text><line x1="0" y1="52" x2="560" y2="52" stroke="%233C4242" stroke-width="0.8"/></g><g transform="translate(20, 305)"><text x="0" y="9" font-family="sans-serif" font-size="8" font-weight="600" fill="%233C4242">Component 3: Subgroup Analysis (Forest Plot)</text><line x1="0" y1="13" x2="560" y2="13" stroke="%233C4242" stroke-width="0.8"/><text x="10" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242">Subgroup</text><text x="130" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242">AZD999</text><text x="190" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242">Placebo</text><text x="320" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242" text-anchor="middle">Hazard Ratio (95% CI)</text><text x="455" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242">HR (95% CI)</text><text x="540" y="23" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242" text-anchor="end">P-int</text><line x1="0" y1="26" x2="560" y2="26" stroke="%23EBECEC" stroke-width="1"/><g transform="translate(0, 30)"><rect x="0" y="0" width="560" height="14" fill="%23F4E8EE" opacity="0.5"/><text x="10" y="10" font-family="sans-serif" font-size="7" font-weight="600" fill="%23830051">Overall (All Subjects)</text><text x="130" y="10" font-family="sans-serif" font-size="7" fill="%233C4242">46/120</text><text x="190" y="10" font-family="sans-serif" font-size="7" fill="%233C4242">78/118</text><line x1="280" y1="7" x2="350" y2="7" stroke="%23830051" stroke-width="1.5"/><polygon points="310,4 314,7 310,10 306,7" fill="%23830051"/><text x="455" y="10" font-family="sans-serif" font-size="7" font-weight="600" fill="%233C4242">0.54 (0.38, 0.76)</text><text x="540" y="10" font-family="sans-serif" font-size="7" fill="%23888E8E" text-anchor="end">—</text></g><g transform="translate(0, 47)"><text x="10" y="10" font-family="sans-serif" font-size="7" font-weight="600" fill="%23666C6C">Age Category</text><text x="15" y="22" font-family="sans-serif" font-size="7" fill="%233C4242">&lt; 65 years</text><text x="130" y="22" font-family="sans-serif" font-size="7" fill="%23656969">28/76</text><text x="190" y="22" font-family="sans-serif" font-size="7" fill="%23656969">48/72</text><line x1="270" y1="19" x2="355" y2="19" stroke="%233C4242" stroke-width="1"/><rect x="303" y="16" width="6" height="6" fill="%233C4242"/><text x="455" y="22" font-family="sans-serif" font-size="7" fill="%233C4242">0.51 (0.32, 0.81)</text><text x="540" y="22" font-family="sans-serif" font-size="7" fill="%23888E8E" text-anchor="end">0.68</text><text x="15" y="34" font-family="sans-serif" font-size="7" fill="%233C4242">≥ 65 years</text><text x="130" y="34" font-family="sans-serif" font-size="7" fill="%23656969">18/44</text><text x="190" y="34" font-family="sans-serif" font-size="7" fill="%23656969">30/46</text><line x1="275" y1="31" x2="375" y2="31" stroke="%233C4242" stroke-width="1"/><rect x="314" y="28" width="5" height="5" fill="%233C4242"/><text x="455" y="34" font-family="sans-serif" font-size="7" fill="%233C4242">0.59 (0.33, 1.05)</text></g><g transform="translate(0, 86)"><text x="10" y="10" font-family="sans-serif" font-size="7" font-weight="600" fill="%23666C6C">PD-L1 Expression (CPS)</text><text x="15" y="22" font-family="sans-serif" font-size="7" fill="%233C4242">CPS ≥ 1</text><text x="130" y="22" font-family="sans-serif" font-size="7" fill="%23656969">25/74</text><text x="190" y="22" font-family="sans-serif" font-size="7" fill="%23656969">52/70</text><line x1="260" y1="19" x2="340" y2="19" stroke="%233C4242" stroke-width="1"/><rect x="290" y="16" width="6" height="6" fill="%233C4242"/><text x="455" y="22" font-family="sans-serif" font-size="7" fill="%233C4242">0.41 (0.25, 0.67)</text><text x="540" y="22" font-family="sans-serif" font-size="7" fill="%23888E8E" text-anchor="end">0.08</text><text x="15" y="34" font-family="sans-serif" font-size="7" fill="%233C4242">CPS &lt; 1</text><text x="130" y="34" font-family="sans-serif" font-size="7" fill="%23656969">21/46</text><text x="190" y="34" font-family="sans-serif" font-size="7" fill="%23656969">26/48</text><line x1="290" y1="31" x2="410" y2="31" stroke="%233C4242" stroke-width="1"/><rect x="335" y="28" width="5" height="5" fill="%233C4242"/><text x="455" y="34" font-family="sans-serif" font-size="7" fill="%233C4242">0.78 (0.44, 1.39)</text></g><line x1="0" y1="130" x2="560" y2="130" stroke="%233C4242" stroke-width="0.8"/></g><g transform="translate(20, 465)"><text x="0" y="9" font-family="sans-serif" font-size="7" fill="%23888E8E">[a] ITT Population: All randomized subjects. Subgroups analyzed using unstratified Cox proportional hazards model.</text><text x="0" y="19" font-family="sans-serif" font-size="7" fill="%23888E8E">[b] Kaplan-Meier estimates are used for survival curves. Median survival times and 95% CIs calculated via log-log transformation.</text><text x="0" y="29" font-family="sans-serif" font-size="7" fill="%23888E8E">Program: /study/D9802C00001/csr/prod/figures/f_kmplot_subgroup.sas  |  Output: f_15_1_1.rtf</text></g></svg>`;

const INITIAL_FIGURE_RENDER_VERSIONS: RenderVersion[] = [
  {
    versionLabel: 'V1.0',
    imageUrl: KM_PLOT_THUMBNAIL_SVG,
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
  }
];

type RenderVersion = {
  versionLabel: string; // e.g. 'V1.3'
  imageUrl: string;
  createdAt: Date;
};

type ImageRenderState = 'generating' | 'complete' | 'failed';

function ImageRenderToolCallCard({
  state = 'generating',
  versions = [],
  focused = false,
  onThumbnailClick,
  onRetry,
}: {
  state?: ImageRenderState;
  versions?: RenderVersion[];
  focused?: boolean;
  onThumbnailClick?: (version: RenderVersion) => void;
  onRetry?: () => void;
}) {
  const latestVersion = versions[versions.length - 1] ?? null;

  const getBadgeLabel = (version: RenderVersion) => {
    const isLatest = version === latestVersion;
    if (isLatest) return 'Latest';
    const diffMs = Date.now() - version.createdAt.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  };

  const borderClass = focused
    ? 'border-[1.5px] border-[#830051]'
    : 'border border-[#EBECEC]';

  return (
    <div className={`rounded-[8px] overflow-hidden w-full ${borderClass} bg-white`}>
      {/* Header row */}
      <div className="flex items-center px-[12px] py-[8px] gap-[6px]">
        <div className="w-[16px] h-[16px] shrink-0 flex items-center justify-center">
          <LocalIcon src={imageAiLineIconUrl} className="w-[16px] h-[16px]" color="#888E8E" />
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-[6px] overflow-hidden">
          {state === 'generating' && (
            <>
              <span className="text-[14px] font-medium leading-[24px] text-text-primary whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                Generating Preview...
              </span>
            </>
          )}
          {state === 'complete' && latestVersion && (
            <>
              <span className="text-[14px] font-medium leading-[24px] text-text-primary whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                {latestVersion.versionLabel}
              </span>
              <div className="border border-[#EBECEC] rounded-[4px] h-[20px] px-[4px] flex items-center justify-center shrink-0">
                <span className="text-[13px] leading-[20px] text-text-secondary whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {getBadgeLabel(latestVersion)}
                </span>
              </div>
            </>
          )}
          {state === 'failed' && (
            <span className="text-[14px] font-medium leading-[24px] text-[#E53935] whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              Preview generation failed
            </span>
          )}
        </div>

        {/* Right side */}
        {state === 'generating' && (
          <div className="w-[16px] h-[16px] shrink-0 flex items-center justify-center">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 8a6 6 0 1 1-6-6" stroke="#888E8E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        )}
        {state === 'failed' && onRetry && (
          <button
            onClick={onRetry}
            className="text-[13px] leading-[20px] text-brand-1 hover:underline whitespace-nowrap shrink-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Retry
          </button>
        )}
      </div>

      {/* Image area — only for complete */}
      {state === 'complete' && latestVersion && (
        <div
          className="relative w-full aspect-[312/198] border-t border-[#EBECEC] cursor-pointer group overflow-hidden"
          onClick={() => onThumbnailClick?.(latestVersion)}
        >
          <img
            src={latestVersion.imageUrl}
            alt={latestVersion.versionLabel}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          {/* Hover Overlay with Eye Icon at bottom-right (8px offset, rounded-4px, core/overlay bg, white icon) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-[8px] right-[8px] w-[28px] h-[28px] rounded-[4px] bg-black/60 flex items-center justify-center backdrop-blur-xs">
              <LocalIcon src={eyeLineIconUrl} className="w-[16px] h-[16px]" color="white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpatialViewCard({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border-[0.6px] border-graphite-10 rounded-[4px] px-[12px] py-[8px] w-full transition-colors cursor-pointer ${
        hovered ? 'bg-bg-panel' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-[4px] h-[30px]">
        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
          <BarChartBoxAiIcon className="w-full h-full" color="var(--color-text-secondary)" />
        </div>
        <p className="t-body-compact text-text-primary">
          Spatial View
        </p>
      </div>
    </div>
  );
}

export type ReviewItem = { type: 'ai-infer' | 'conflict', fieldName: string, tooltip: string, blockId: string, fieldId: string };

export const DEFAULT_FIGURE_REVIEW_ITEMS: ReviewItem[] = [
  { type: 'ai-infer', fieldName: 'Input Dataset(s)', tooltip: 'Inferred from standard TTE dataset naming convention.', blockId: 'figBasic', fieldId: 'inputDataset' },
  { type: 'conflict', fieldName: 'General Filter', tooltip: 'Conflicting value detected with SAP specification.', blockId: 'figBasic', fieldId: 'generalFilter' },
  { type: 'ai-infer', fieldName: 'Source Dataset(s) (KM Plot Chart)', tooltip: 'Inferred from standard TTE dataset naming convention.', blockId: 'kmCurve', fieldId: 'sourceDataset1' },
  { type: 'ai-infer', fieldName: 'Source Variable(s) (KM Plot Chart)', tooltip: 'Inferred based on typical KM Plot requirements.', blockId: 'kmCurve', fieldId: 'sourceVariable1' },
  { type: 'ai-infer', fieldName: 'Source Dataset(s) (Number at Risk Table)', tooltip: 'Inferred from standard TTE dataset naming convention.', blockId: 'riskTable', fieldId: 'sourceDataset2' },
  { type: 'conflict', fieldName: 'Source Variable(s) (Number at Risk Table)', tooltip: 'Conflicting variable: TRTA used instead of TRT01P.', blockId: 'riskTable', fieldId: 'sourceVariable2' }
];

// ── Reusable Metadata entry bar ──────────────────────────────────────────────
// variant="conflict"  → SAP-inferred fields may conflict (higher priority)
// variant="updated"   → Metadata fields were auto-populated after adding Component
// Priority rule: when both triggers coexist, render variant="conflict" only.
function formatCount(num: number) {
  if (num > 99) return '99+';
  return num.toString();
}

function MetadataEntryBlock({
  variant,
  count = 3,
  conflictsCount = 2,
  inferredCount = 4,
  onOpen,
  isOutdated = false,
}: {
  variant: 'conflict' | 'updated';
  count?: number;
  conflictsCount?: number;
  inferredCount?: number;
  onOpen?: () => void;
  isOutdated?: boolean;
}) {
  const description =
    variant === 'conflict'
      ? 'Some inferred metadata fields may not align with SAP specifications. Verify before proceeding.'
      : 'Metadata has been updated with new fields for the added Component.';

  const formattedConflicts = formatCount(conflictsCount);
  const formattedInferred = formatCount(inferredCount);
  const formattedCount = formatCount(count);

  return (
    <>
      <p className="t-body text-text-primary leading-relaxed mb-[8px]">{description}</p>
      <div
        className={`flex items-center justify-between gap-[8px] px-[12px] py-[8px] mb-[12px] bg-bg-panel border border-graphite-10 rounded-[8px] min-w-0 ${
          isOutdated ? 'cursor-default' : 'hover:bg-[#F5F5F5] transition-colors cursor-pointer'
        }`}
        onClick={isOutdated ? undefined : onOpen}
      >
        <div className="flex items-center gap-[8px] min-w-0 flex-1 overflow-hidden">
          <LocalIcon src={fileInfoIconUrl} className="w-[16px] h-[16px] shrink-0" color="#888E8E" />
          <span className="text-[14px] leading-[24px] font-medium text-text-primary shrink-0" style={{ fontFamily: 'var(--font-body)' }}>
            Metadata
          </span>

          {variant === 'conflict' ? (
            <div className="flex items-center gap-[8px] text-[12px] leading-[18px] whitespace-nowrap min-w-0 overflow-hidden truncate">
              {inferredCount > 0 && (
                <span className="text-text-secondary font-normal shrink-0">
                  {formattedInferred} Inferred
                </span>
              )}
              {conflictsCount > 0 && (
                <span className="text-status-error font-medium shrink-0">
                  {formattedConflicts} {conflictsCount === 1 ? 'Conflict' : 'Conflicts'}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
              <span className="text-[10px] leading-[14px] font-medium text-text-secondary">{formattedCount}</span>
            </div>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={isOutdated}
          className="!h-[26px] !px-[8px] font-medium rounded-[4px] pointer-events-none shrink-0"
        >
          {isOutdated ? 'Outdated' : 'Review'}
        </Button>
      </div>
    </>
  );
}



function ReviewItemRow({ item, onJumpToMetadata }: { item: ReviewItem, onJumpToMetadata?: (blockId: string, fieldId: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onJumpToMetadata?.(item.blockId, item.fieldId)}
      className={`flex items-center gap-[8px] h-[32px] px-[10px] py-[6px] cursor-pointer transition-colors ${hovered ? 'bg-bg-panel rounded-[4px]' : 'bg-transparent'}`}
    >
      <div className="shrink-0 flex items-center">
        <MetadataBadge type={item.type} interactive={false} className="!ml-0" />
      </div>
      <span className="flex-1 min-w-0 max-w-[120px] text-[12px] leading-[18px] font-medium text-text-primary truncate">
        {item.fieldName}
      </span>
      <span className="flex-1 min-w-0 text-[12px] leading-[16px] font-normal text-text-secondary truncate">
        {item.tooltip}
      </span>
    </div>
  );
}

function ToBeReviewedBlock({ items, onJumpToMetadata }: { items: ReviewItem[], onJumpToMetadata?: (blockId: string, fieldId: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <div className="border-[0.6px] border-graphite-20 rounded-[8px] w-full overflow-hidden bg-white">
      <div
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        className={`flex items-center gap-[6px] px-[12px] py-[8px] cursor-pointer transition-colors ${
          headerHovered ? 'bg-bg-panel' : 'bg-transparent'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
          <svg className={`w-full h-full transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0001 13.1714L16.9499 8.22168L18.3641 9.63589L12.0001 15.9999L5.63623 9.63589L7.05044 8.22168L12.0001 13.1714Z" fill="#888E8E"/>
          </svg>
        </div>
        <p className="text-[14px] leading-[24px] font-medium text-text-primary">To be Reviewed</p>
        <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
          <span className="text-[10px] leading-[14px] font-medium text-text-secondary">{items.length}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="flex flex-col border-t border-graphite-10 max-h-[210px] overflow-y-auto">
          {items.map((item, idx) => (
            <ReviewItemRow key={idx} item={item} onJumpToMetadata={onJumpToMetadata} />
          ))}
        </div>
      )}
    </div>
  );
}

function ErrorMessageWithRetry() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-az-secondary border-[0.6px] border-status-error rounded-[4px] px-[10px] py-[8px] w-full flex gap-[8px] items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[6px] h-[30px] mb-[2px]">
          <div className="w-[16px] h-[16px] shrink-0">
            <ErrorWarningIcon className="w-full h-full" color="#CC2C3C" />
          </div>
          <p className="t-body text-status-error font-semibold truncate">
            Error: Error reason summary
          </p>
        </div>

        {/* Collapsible details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-[4px] t-small text-status-error hover:underline active:scale-[0.98] mb-[2px]"
        >
          <span>{expanded ? 'Hide details' : 'View details'}</span>
          <SvgIcon className="h-[12px] w-[12px]">
            <path
              d={expanded
                ? "M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"
                : "M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"
              }
              fill="#CC2C3C"
            />
          </SvgIcon>
        </button>

        {expanded && (
          <p className="t-small text-status-error break-words whitespace-pre-wrap leading-[18px]">
            Error reason details here. This section can contain very long error messages including stack traces, variable states, and other diagnostic information that helps identify the root cause of the failure.
          </p>
        )}
      </div>

      <button className="shrink-0 bg-white border-[0.6px] border-border-default hover:bg-bg-panel px-[8px] py-[4px] rounded-[4px] transition-colors flex items-center gap-[4px]">
        <span className="t-small text-text-primary">Retry</span>
      </button>
    </div>
  );
}

// ==================== Markdown Components ====================

function InlineHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-[4px] py-[2px] rounded-[4px] bg-graphite-20 text-[13px] font-mono text-brand-1 leading-none mx-[2px]">
      {children}
    </span>
  );
}

function Hyperlink({ children, href = "#", onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={(e) => { if(onClick) { e.preventDefault(); onClick(); } }} className="t-link text-brand-1 hover:underline transition-all cursor-pointer">
      {children}
    </a>
  );
}

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <blockquote className="border-l-[3px] border-border-default bg-[#FAFAFA] pl-[12px] py-[8px] mb-[10px] rounded-r-[4px]">
        <div className="t-heading text-text-primary">
          {children}
        </div>
      </blockquote>
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div className="relative w-full">
      <div className={`h-[0.5px] bg-border-default w-full my-[12px] ${className || ''}`} />
    </div>
  );
}

// ==================== Chat Conversation & Main Panel ====================

type Message = {
  type: 'user' | 'ai_thinking' | 'ai_ask_user' | 'ask_user_result' | 'ai_complete' | 'ai_update_complete' | 'ai_update_accepted' | 'meta_update_card';
  content?: string;
  hasTag?: boolean;
  toBeUpdatedCount?: number;
  answers?: { q: string; a: string }[];
  isSkipped?: boolean;
  metaDiffItems?: MetaDiffItem[];
  isProcessing?: boolean;
  /** Images submitted alongside the user message */
  attachments?: AttachmentItem[];
};

function ChatConversation({ 
  messages, 
  isPending,
  onOpenCodePanel,
  onOpenSpatialView,
  onJumpToMetadata,
  docType,
  reviewItems,
  renderPreviewOpen,
  activeRenderVersionLabel,
  onRenderThumbnailClick,
  variant = 'incard',
}: { 
  messages: Message[]; 
  isPending: boolean; 
  onOpenCodePanel?: () => void;
  onOpenSpatialView?: () => void;
  onJumpToMetadata?: (blockId: string, fieldId: string) => void;
  docType?: DocumentType;
  reviewItems?: ReviewItem[];
  renderPreviewOpen?: boolean;
  activeRenderVersionLabel?: string;
  onRenderThumbnailClick?: (version: RenderVersion) => void;
  variant?: 'drawer' | 'incard';
}) {
  const lastMessage = messages[messages.length - 1];
  const showAskUser = lastMessage?.type === 'ai_ask_user';

  const rounds: Message[][] = [];
  let currentRound: Message[] = [];

  messages.forEach(msg => {
    if (msg.type === 'user' || msg.type === 'meta_update_card') {
      if (currentRound.length > 0) {
        rounds.push(currentRound);
      }
      currentRound = [msg];
    } else {
      currentRound.push(msg);
    }
  });
  if (currentRound.length > 0) {
    rounds.push(currentRound);
  }

  // Compute the index of the last ai_complete/ai_update_complete message in the flat list
  const lastAiCompleteIdx = messages.reduce<number>((acc, m, idx) =>
    (m.type === 'ai_complete' || m.type === 'ai_update_complete') ? idx : acc, -1
  );

  // Flatten messages with their original index for outdated detection
  let flatMsgIdx = 0;

  return (
    <div className="flex flex-col w-full px-[8px] pb-[16px] gap-[12px] relative">
      {rounds.map((round, rIndex) => (
        <div key={rIndex} className="flex flex-col w-full py-[10px] gap-[12px] relative">
          {round.map((msg, i) => {
            const currentFlatIdx = flatMsgIdx++;
            const isMetadataOutdated =
              (msg.type === 'ai_complete' || msg.type === 'ai_update_complete') &&
              currentFlatIdx < lastAiCompleteIdx;
            return <React.Fragment key={i}>
              <div className={`flex flex-col w-full gap-[12px] relative ${msg.type === 'user' ? (variant === 'incard' ? 'items-end pl-[36px]' : 'items-end') : 'items-start'}`}>
                {msg.type === 'user' && (
                  <AIUserPrompt
                    content={msg.content || ""}
                    tag={msg.hasTag ? "Table.14.1.1 (Lines 290-321)" : undefined}
                    toBeUpdatedCount={msg.toBeUpdatedCount}
                    metaDiffItems={msg.metaDiffItems}
                    attachments={msg.attachments}
                    onJumpToMetadata={(fieldId) => onJumpToMetadata?.('', fieldId)}
                    variant={variant}
                    className="w-full"
                  />
                )}

                {msg.type === 'meta_update_card' && msg.metaDiffItems && (
                  <div className="w-full relative mt-[8px]">
                    <AIUpdatedBlock
                      title="Metadata changes"
                      count={msg.metaDiffItems.length}
                      expanded={msg.isProcessing ? "scrollable" : "brief"}
                      scrollHeight={210}
                      toggleable={!msg.isProcessing}
                      status={msg.isProcessing ? "processing" : "completed"}
                      items={msg.metaDiffItems.map(d => {
                        const oldVal = d.oldValue && d.oldValue.trim() !== '' ? d.oldValue : 'Empty';
                        const newVal = d.newValue && d.newValue.trim() !== '' ? d.newValue : 'Empty';
                        return {
                          label: d.label,
                          text: `~~${oldVal}~~ → ${newVal}`,
                          onClick: () => onJumpToMetadata?.('', d.fieldId)
                        };
                      })}
                    />
                  </div>
                )}

            {msg.type === 'ai_thinking' && (
              <AIThinkingStatus status={showAskUser ? "waiting" : "loading"} />
            )}

            {msg.type === 'ai_ask_user' && (
              <AIThinkingStatus status="waiting" />
            )}

            {msg.type === 'ask_user_result' && (
              <div className="bg-bg-panel px-[10px] py-[8px] rounded-[8px] w-full">
                {msg.isSkipped ? (
                  <p className="t-body text-text-secondary italic">Skipped question</p>
                ) : (
                  <div className="flex flex-col gap-[4px]">
                    {msg.answers?.map((ans, idx) => (
                      <div key={idx} className="t-body text-text-secondary">
                        <p className="font-normal">Q: {truncateText(ans.q)}</p>
                        <p className="font-normal">A: {ans.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {msg.type === 'ai_complete' && (
              <div className="flex flex-col gap-[12px] w-full relative">
                <AIThinkingStatus status="completed" />
                <div className="flex flex-col w-full relative gap-[12px]">
                  
                  {docType === 'figure' ? (
                    <>
                      <div className="flex flex-col w-full px-[10px]">
                        <div className="flex flex-col gap-[8px] mb-[8px]">
                          <p className="t-body text-text-primary leading-relaxed">
                            I have parsed the uploaded Shell file and successfully inferred the structure for SAS Code generation.
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <h1 className="text-[14px] font-bold text-text-primary mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Component 1: KM Plot Chart</h1>
                          <ul className="list-disc pl-[24px] flex flex-col gap-[8px]">
                            <li className="t-body text-text-primary">
                              <span>Source Dataset: <InlineHighlight>ADTTTE</InlineHighlight></span>
                            </li>
                            <li className="t-body text-text-primary">
                              <span>Source Variables: <InlineHighlight>AVAL</InlineHighlight>, <InlineHighlight>CNSR</InlineHighlight>, <InlineHighlight>PARAMCD</InlineHighlight></span>
                            </li>
                          </ul>
                          <div style={{ borderTop: '1px dashed var(--color-border-subtle)', width: '100%', margin: '8px 0' }}></div>
                          <h1 className="text-[14px] font-bold text-text-primary mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Axis Setup</h1>
                          <ul className="list-disc pl-[24px] flex flex-col gap-[8px]">
                            <li className="t-body text-text-primary">
                              <span>X-Axis: <InlineHighlight>Months</InlineHighlight> | Ticks <InlineHighlight>0, 3, 6, 9, 12</InlineHighlight></span>
                            </li>
                            <li className="t-body text-text-primary">
                              <span>Y-Axis: <InlineHighlight>Probability</InlineHighlight> | Range <InlineHighlight>0.0 - 1.0</InlineHighlight></span>
                            </li>
                            <li className="t-body text-text-primary">
                              <span>Reference: Contains <InlineHighlight>Median</InlineHighlight> line</span>
                            </li>
                          </ul>
                        </div>

                        <Divider className="!my-[8px]" />

                        <div className="flex flex-col">
                          <h1 className="text-[14px] font-bold text-text-primary mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Component 2: Number at Risk Table</h1>
                          <ul className="list-disc pl-[24px] flex flex-col gap-[8px]">
                            <li className="t-body text-text-primary">
                              <span>Source Dataset: <InlineHighlight>ADTTTE</InlineHighlight></span>
                            </li>
                            <li className="t-body text-text-primary">
                              <span>Source Variables: <InlineHighlight>AVAL</InlineHighlight>, <InlineHighlight>TRTA</InlineHighlight></span>
                            </li>
                          </ul>
                        </div>

                        <MetadataEntryBlock
                          variant="conflict"
                          count={DEFAULT_FIGURE_REVIEW_ITEMS.length}
                          onOpen={() => onJumpToMetadata?.('figBasic', 'generalFilter')}
                          isOutdated={isMetadataOutdated}
                        />

                        {/* Image Render Tool Call Card — Complete state by default */}
                        <div className="pt-[4px]">
                          <ImageRenderToolCallCard
                            state="complete"
                            versions={INITIAL_FIGURE_RENDER_VERSIONS}
                            focused={!!renderPreviewOpen && activeRenderVersionLabel === 'V1.0'}
                            onThumbnailClick={onRenderThumbnailClick}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col w-full px-[10px]">
                        <div className="relative w-full">
                          <h1 className="text-[16px] font-bold text-text-primary mb-[10px]" style={{ fontFamily: 'var(--font-body)' }}>Analysis Results Summary</h1>
                        </div>
                        <div className="relative w-full">
                          <p className="t-body text-text-primary p-[4px] mb-[8px] leading-relaxed">
                            Generated Kaplan-Meier survival plot for <InlineHighlight>OS (Overall Survival)</InlineHighlight> using the ITT population. 
                            Reference the <Hyperlink>Analysis Plan v1.2</Hyperlink> for further details.
                          </p>
                        </div>
                        <div className="relative w-full mb-[10px]">
                          <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded mb-2" />}>
                            <MarkdownTable />
                          </Suspense>
                        </div>
                        <div className="relative w-full">
                          <ul className="list-disc pl-[24px] mb-[10px] flex flex-col gap-[4px]">
                            <li className="t-body text-text-primary">
                              <strong className="font-semibold text-text-primary">High survival rate</strong> in early stages.
                            </li>
                            <li className="t-body text-text-primary">
                              <strong className="font-semibold text-text-primary">Significant variance</strong> in treatment line 3.
                            </li>
                          </ul>
                        </div>
                        <Blockquote>
                          "The integration of survival data confirms the hypothesis proposed in the preliminary report."
                        </Blockquote>
                        <Divider />
                      </div>
                      
                      <div className="relative w-full">
                        <ToolCallCard toolName="read_file" />
                      </div>
                      <div className="relative w-full">
                        <AICodeDiff />
                      </div>
                      <div className="relative w-full">
                        <ErrorMessageWithRetry />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {(msg.type === 'ai_update_complete' || msg.type === 'ai_update_accepted') && (
              <div className="flex flex-col gap-[12px] w-full relative">
                <AIThinkingStatus status="completed" />
                <div className="flex flex-col w-full relative gap-[8px]">
                  <div className="flex flex-col gap-[4px] px-[10px]">
                    <p className="t-body text-text-primary leading-relaxed">
                      Component added. SAS code has been generated.
                    </p>
                  </div>
                  <div className="relative w-full">
                    <AICodeDiff />
                  </div>
                  <div className="px-[10px]">
                    <MetadataEntryBlock
                      variant="updated"
                      count={3}
                      onOpen={() => onJumpToMetadata?.('figBasic', 'generalFilter')}
                      isOutdated={isMetadataOutdated}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </React.Fragment>;
          })}
        </div>
      ))}
    </div>
  );
}

function AICopilotPanel({
  variant = 'drawer',
  panelWidth,
  onClose,
  inputValue,
  onChangeInputValue,
  focusTrigger = 0,
  onOpenCodePanel,
  onOpenSpatialView,
  onJumpToMetadata,
  docType,
  metadataChangesCount,
  metaDiffItems,
  reviewItems,
  metaUpdateActive,
  metaUpdateProcessing,
  hasPendingCodeChanges,
  onMetaCancel,
  onMetaProceed,
  onCodeDiffChange,
  onAddComponentPrompt,
  renderPreviewOpen,
  activeRenderVersionLabel,
  onRenderThumbnailClick,
  quoteInsertRef,
}: {
  variant?: 'drawer' | 'incard';
  quoteInsertRef?: React.MutableRefObject<((fieldId: string, label: string) => void) | null>;
  panelWidth: number;
  onClose: () => void;
  inputValue?: string;
  onChangeInputValue?: (v: string) => void;
  focusTrigger?: number;
  onOpenCodePanel?: () => void;
  onOpenSpatialView?: () => void;
  onJumpToMetadata?: (blockId: string, fieldId: string) => void;
  docType?: DocumentType;
  metadataChangesCount?: number;
  metaDiffItems?: MetaDiffItem[];
  reviewItems?: ReviewItem[];
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  hasPendingCodeChanges?: boolean;
  onMetaCancel?: () => void;
  onMetaProceed?: () => void;
  onCodeDiffChange?: (hasDiff: boolean) => void;
  onAddComponentPrompt?: (name: string, type: string, inst: string) => void;
  renderPreviewOpen?: boolean;
  activeRenderVersionLabel?: string;
  onRenderThumbnailClick?: (version: RenderVersion) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (docType === 'figure') return [{ type: 'ai_complete' }];
    return [
      { type: 'user', content: 'Generate Kaplan-Meier survival plot for OS.' },
      { type: 'ai_complete' }
    ];
  });
  const [isPending, setIsPending] = useState(false);

  const [sessionOptions] = useState([
    { label: "Session: Demographics", value: "session-1" },
    { label: "Session: Safety Analysis", value: "session-2" },
    { label: "Session: KM Plot Generator", value: "session-3" },
  ]);
  const [selectedSession, setSelectedSession] = useState("session-1");

  const isSubmitDisabled = isPending || metaUpdateProcessing || (hasPendingCodeChanges && ((metaDiffItems?.length ?? 0) > 0));

  const [localInput, setLocalInput] = useState("");
  const isControlled = inputValue !== undefined && onChangeInputValue !== undefined;
  const currentVal = isControlled ? inputValue : localInput;
  const setCurrentVal = (val: string) => {
    if (isControlled) {
      onChangeInputValue(val);
    } else {
      setLocalInput(val);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const attachFilesRef = useRef<((files: File[]) => void) | null>(null);

  // --- Drag & Drop state for full AI Copilot panel ---
  const [isCopilotDragOver, setIsCopilotDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
      dragCounter.current += 1;
      setIsCopilotDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsCopilotDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsCopilotDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      attachFilesRef.current?.(files);
    }
  };

  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, metaUpdateActive]);

  const lastMessage = messages[messages.length - 1];
  const showAskUser = lastMessage?.type === 'ai_ask_user';
  const hasCodeDiff = messages.some(m => m.type === 'ai_update_complete' || (docType === 'listing' && m.type === 'ai_complete'));

  useEffect(() => {
    onCodeDiffChange?.(hasCodeDiff);
  }, [hasCodeDiff, onCodeDiffChange]);

  const handleAcceptPending = () => {
    setMessages(prev => prev.map(m => m.type === 'ai_update_complete' ? { ...m, type: 'ai_update_accepted' as const } : m));
  };

  const handleRejectPending = () => {
    setMessages(prev => prev.filter(m => m.type !== 'ai_update_complete'));
  };

  const handleAskUserSubmit = (answers: { q: string; a: string }[]) => {
    setMessages(prev => prev.filter(m => m.type !== 'ai_ask_user').concat([{ type: 'ask_user_result', answers }]));
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai_complete' }]);
    }, 1500);
  };

  const handleAskUserSkip = () => {
    setMessages(prev => prev.filter(m => m.type !== 'ai_ask_user').concat([{ type: 'ask_user_result', isSkipped: true }]));
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai_complete' }]);
    }, 1500);
  };

  const handleSubmit = (text: string, attachments?: AttachmentItem[]) => {
    const isUpdate = metaUpdateActive && metaDiffItems && metaDiffItems.length > 0;
    if (!text.trim() && !isUpdate && !attachments?.length) return;
    (document.activeElement as HTMLElement)?.blur();

    const userContent = text.trim() ? text : 'Update code based on the metadata changes above.';

    // Only show metadata review card if the submission includes an 'add component' change
    const hasAddComponent = metaDiffItems?.some(d => d.changeType === 'added' || d.fieldId.startsWith('add_')) || /add|component|新增|添加|create|make|insert|new/i.test(text);
    const showMetadataReviewCard = isUpdate && hasAddComponent;

    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userContent,
      toBeUpdatedCount: showMetadataReviewCard ? metaDiffItems.length : undefined,
      metaDiffItems: showMetadataReviewCard ? [...metaDiffItems] : undefined,
      attachments: attachments && attachments.length > 0 ? [...attachments] : undefined,
    }]);
    setCurrentVal("");
    setIsPending(true);

    if (metaUpdateActive) {
      onMetaProceed?.();
    }

    const isAddReq = /add|component|新增|添加|create|make|insert|new/i.test(text);
    if (isAddReq && onAddComponentPrompt) {
      onAddComponentPrompt(text, 'Chart', text);
    }

    setMessages(prev => [...prev, { type: 'ai_thinking' }]);
    setTimeout(() => {
      if (docType === 'figure') {
        if (isAddReq) {
          // Adding a component updates Metadata directly, not Code.
          // No Pending changes state, directly return to Default state.
          setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_complete' as const } : m));
          setIsPending(false);
        } else {
          setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_update_complete' as const } : m));
          setIsPending(false);
        }
      } else {
        setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_ask_user' as const } : m));
        // for listing, keep original behavior
      }
    }, 2000);
  };

  return (
    <div 
      className="flex flex-col h-full w-full bg-transparent relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay Mask over AI Copilot Area */}
      {isCopilotDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-[8px] pointer-events-none transition-all duration-150 animate-in fade-in">
          <div className="w-full h-full rounded-[10px] bg-white/92 backdrop-blur-[2px] border-2 border-dashed border-brand-1 flex flex-col items-center justify-center gap-[12px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
            <div className="w-[52px] h-[52px] rounded-full bg-az-secondary flex items-center justify-center text-brand-1">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-[4px] px-[20px] text-center">
              <p className="text-[16px] font-semibold text-text-primary leading-[24px]">
                Attach to chat
              </p>
              <p className="text-[12px] text-text-secondary leading-[18px]">
                Drop images to attach (PNG, JPG, JPEG · Max 5)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {variant === 'incard' ? (
        <div className="relative z-10 shrink-0 bg-white">
          <PanelHeader
            noBorder
            title={
              <div className="flex items-center min-w-0 max-w-[260px]">
                <FilterChip
                  type="Dropdown"
                  variant="select"
                  showIcon={false}
                  labelClassName="t-small-medium font-medium"
                  options={sessionOptions}
                  value={selectedSession}
                  onChange={setSelectedSession}
                  className="max-w-full"
                />
              </div>
            }
            actions={
              <div className="flex items-center gap-[4px]">
                <TooltipText label="New Session">
                  <button
                    type="button"
                    aria-label="New Session"
                    className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0"
                  >
                    <LocalIcon src={addLineIconUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
                  </button>
                </TooltipText>
                <TooltipText label="Collapse AI Copilot">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Collapse AI Copilot"
                    className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0"
                  >
                    <LocalIcon src={arrowRightDoubleLineUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
                  </button>
                </TooltipText>
              </div>
            }
          />
        </div>
      ) : (
        <div className="relative z-10 shrink-0 bg-transparent h-[48px] flex items-center justify-between px-[12px] mb-[4px]">
          <div className="flex items-center min-w-0 max-w-[260px]">
            <FilterChip
              type="Dropdown"
              variant="select"
              showIcon={false}
              labelClassName="t-small-medium font-medium"
              options={sessionOptions}
              value={selectedSession}
              onChange={setSelectedSession}
              className="max-w-full"
            />
          </div>
          <div className="flex items-center gap-[4px]">
            <TooltipText label="New Session">
              <button
                type="button"
                aria-label="New Session"
                className="relative w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0 after:content-[''] after:absolute after:-inset-[8px]"
              >
                <LocalIcon src={addLineIconUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
              </button>
            </TooltipText>
            <TooltipText label="Collapse AI Copilot">
              <button
                type="button"
                onClick={onClose}
                aria-label="Collapse AI Copilot"
                className="relative w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0 after:content-[''] after:absolute after:-inset-[8px]"
              >
                <LocalIcon src={arrowRightDoubleLineUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
              </button>
            </TooltipText>
          </div>
        </div>
      )}

      {/* Chat Area with Isolated Top & Bottom Fades (Right-[12px] isolates and protects the scrollbar from fading) */}
      <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top compact fade (8px, avoids 12px scrollbar on right) */}
        <div className="pointer-events-none absolute top-0 left-0 right-[12px] h-[8px] bg-gradient-to-b from-white to-transparent z-10" />

        <div 
          ref={chatAreaRef} 
          className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-code"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-[12px] pb-[40px]">
              <img src={atlasLogoFullUrl} alt="Atlas" className="h-[32px]" />
              <span className="t-body text-text-secondary text-center">Automate TFLs. Accelerate Insights.</span>
            </div>
          ) : (
            <ChatConversation 
              messages={messages} 
              isPending={isPending} 
              onOpenCodePanel={onOpenCodePanel}
              onOpenSpatialView={onOpenSpatialView}
              onJumpToMetadata={onJumpToMetadata}
              docType={docType}
              reviewItems={reviewItems}
              renderPreviewOpen={renderPreviewOpen}
              activeRenderVersionLabel={activeRenderVersionLabel}
              onRenderThumbnailClick={onRenderThumbnailClick}
              variant={variant}
            />
          )}
        </div>

        {/* Bottom fade (16px, avoids 12px scrollbar on right) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-[12px] h-[16px] bg-gradient-to-t from-white to-transparent z-10" />
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-[8px] flex flex-col gap-[4px] bg-transparent relative z-10">
        <div className="w-full flex flex-col gap-[4px] relative">
          {showAskUser && (
            <Suspense fallback={<div className="h-40 animate-pulse bg-gray-50 rounded" />}>
              <AskUserComponent 
                onSubmit={handleAskUserSubmit} 
                onSkip={handleAskUserSkip}
                panelWidth={panelWidth}
              />
            </Suspense>
          )}
          {metaUpdateActive && metaDiffItems && metaDiffItems.length > 0 ? (
            <ChatBox 
              onSubmit={handleSubmit} 
              onSubmitWithAttachments={handleSubmit}
              submitDisabled={isSubmitDisabled}
              metadataChangesCount={metaDiffItems.length}
              metaDiffItems={metaDiffItems}
              onCloseMetadataChanges={() => onMetaCancel?.()}
              onJumpToMetadata={(fieldId) => onJumpToMetadata?.('', fieldId)}
              quoteInsertRef={quoteInsertRef}
              attachFilesRef={attachFilesRef}
            />
          ) : hasCodeDiff ? (
            <ChatBox 
              onSubmit={handleSubmit} 
              onSubmitWithAttachments={handleSubmit}
              submitDisabled={isSubmitDisabled}
              pending={true} 
              onAcceptPending={handleAcceptPending}
              onRejectPending={handleRejectPending}
              quoteInsertRef={quoteInsertRef}
              attachFilesRef={attachFilesRef}
            />
          ) : (
            <ChatBox
              onSubmit={handleSubmit}
              onSubmitWithAttachments={handleSubmit}
              submitDisabled={isSubmitDisabled}
              quoteInsertRef={quoteInsertRef}
              attachFilesRef={attachFilesRef}
            />
          )}
          {messages.length === 0 && <p className="t-small text-[#D8DADA] text-center leading-[20px]">AI-generated content for reference only</p>}
        </div>
      </div>
    </div>
  );
}

// ==================== Workspace Shell: Top Nav & Tree List ====================

type ItemStatus = 'pending' | 'locked' | 'analyzing' | 'error' | 'modified';
type DocumentType = 'table' | 'listing' | 'figure';


type TableItem = {
  id: string;
  name: string;
  status: ItemStatus;
  docType?: DocumentType;
  errorMessage?: string;
  pendingChanges?: number;
};

type ProgramItem = {
  id: string;
  name: string;
  status: ItemStatus;
  isExpanded: boolean;
  tables: TableItem[];
};

function ListingTreeIcon({ color = "#656969" }) {
  return <LocalIcon src={listingIconUrl} className="h-[16px] w-[16px]" color={color} />;
}

function FigureTreeIcon({ color = "#656969" }) {
  return <LocalIcon src={figureIconUrl} className="h-[16px] w-[16px]" color={color} />;
}

function FreezeIcon({ color = "#888E8E" }) {
  return <LocalIcon src={snowflakeIconUrl} className="w-[16px] h-[16px]" color={color} />;
}

function SyncIcon({ color = "white" }) {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M13 3C8.58 3 5 6.58 5 11H2.5L6 14.5L9.5 11H7C7 7.69 9.69 5 13 5C16.31 5 19 7.69 19 11C19 14.31 16.31 17 13 17C11.34 17 9.84 16.33 8.75 15.24L7.34 16.65C8.79 18.1 10.79 19 13 19C17.42 19 21 15.42 21 11C21 6.58 17.42 3 13 3ZM12 7V12L16.2 14.5L17 13.2L13.5 11.1V7H12Z" fill={color} />
    </SvgIcon>
  );
}

function PaginationIcon({ color = "#888E8E" }) {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M3 3H11V5H5V19H11V21H3V3ZM13 3H21V21H13V19H19V5H13V3ZM11 7V17H13V7H11Z" fill={color} />
    </SvgIcon>
  );
}

function SvgIcon({
  children,
  className = "w-[16px] h-[16px]",
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg className={className} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {children}
    </svg>
  );
}

const iconFilters: Record<string, string> = {
  "#FFFFFF": "brightness(0) invert(1)",
  white: "brightness(0) invert(1)",
  "#830051": "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)",
  "var(--color-brand-1)": "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(2902%) hue-rotate(309deg) brightness(77%) contrast(111%)",
  "#3C4242": "brightness(0) saturate(100%) invert(22%) sepia(8%) saturate(525%) hue-rotate(131deg) brightness(92%) contrast(88%)",
  "var(--color-text-primary)": "brightness(0) saturate(100%) invert(22%) sepia(8%) saturate(525%) hue-rotate(131deg) brightness(92%) contrast(88%)",
  "#656969": "brightness(0) saturate(100%) invert(42%) sepia(6%) saturate(255%) hue-rotate(131deg) brightness(92%) contrast(87%)",
  "#888E8E": "brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(174%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "var(--color-text-secondary)": "brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(174%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "#9DB0AC": "brightness(0) saturate(100%) invert(72%) sepia(10%) saturate(322%) hue-rotate(122deg) brightness(89%) contrast(84%)",
  "#B2B4B4": "brightness(0) saturate(100%) invert(75%) sepia(5%) saturate(100%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "#CC2C3C": "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)",
  "var(--color-status-error)": "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)",
  "#C5221F": "brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(3015%) hue-rotate(349deg) brightness(82%) contrast(101%)",
  "#B06000": "brightness(0) saturate(100%) invert(35%) sepia(93%) saturate(1416%) hue-rotate(24deg) brightness(94%) contrast(101%)",
  "#666666": "brightness(0) invert(40%)",
};

function LocalIcon({
  src,
  className = "h-[16px] w-[16px]",
  color,
}: {
  src: string;
  className?: string;
  color?: string;
}) {
  const filter = color ? iconFilters[color] : undefined;
  return <img src={src} alt="" aria-hidden="true" className={`${className} block shrink-0`} style={filter ? { filter } : undefined} />;
}

function LockTreeIcon({ className = "w-[16px] h-[16px]", color = "#3F4444" }) {
  return <LocalIcon src={lockIconUrl} className={className} color={color} />;
}

function UnlockTreeIcon({ className = "w-[16px] h-[16px]", color = "#3F4444" }) {
  return <LocalIcon src={unlockIconUrl} className={className} color={color} />;
}

function ChevronRightTreeIcon({ isExpanded, color }: { isExpanded: boolean; color: string }) {
  return (
    <SvgIcon className={`w-[16px] h-[16px] transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
      <path d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z" fill={color} />
    </SvgIcon>
  );
}

function TableTreeIcon({ color = "#656969" }) {
  return <LocalIcon src={tableIconUrl} className="h-[16px] w-[16px]" color={color} />;
}

function SearchIcon() {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M10.5 4C6.91 4 4 6.91 4 10.5C4 14.09 6.91 17 10.5 17C12.11 17 13.58 16.41 14.72 15.44L18.29 19L19 18.29L15.44 14.72C16.41 13.58 17 12.11 17 10.5C17 6.91 14.09 4 10.5 4ZM10.5 5C13.54 5 16 7.46 16 10.5C16 13.54 13.54 16 10.5 16C7.46 16 5 13.54 5 10.5C5 7.46 7.46 5 10.5 5Z" fill="#888E8E" />
    </SvgIcon>
  );
}


function InfoIcon() {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M11 17H13V11H11V17ZM11 9H13V7H11V9ZM12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z" fill="#888E8E" />
    </SvgIcon>
  );
}

function FolderIcon({ color = "#3F4444" }) {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M10 4L12 6H20C20.55 6 21 6.45 21 7V18C21 18.55 20.55 19 20 19H4C3.45 19 3 18.55 3 18V5C3 4.45 3.45 4 4 4H10ZM5 6V17H19V8H11.17L9.17 6H5Z" fill={color} />
    </SvgIcon>
  );
}

function SparklesIcon({ className = "w-[16px] h-[16px]", color }: { className?: string; color?: string } = {}) {
  return (
    <SvgIcon className={className}>
      {!color && (
        <defs>
          <linearGradient id="gradient-ai-tree" x1="4" x2="20" y1="4" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFA9FF" />
            <stop offset="0.48" stopColor="#7B8CFF" />
            <stop offset="1" stopColor="#078EFB" />
          </linearGradient>
        </defs>
      )}
      <path d="M10.75 3.5L12.1 8.9L17.5 10.25L12.1 11.6L10.75 17L9.4 11.6L4 10.25L9.4 8.9L10.75 3.5ZM17.5 4L18.15 6.35L20.5 7L18.15 7.65L17.5 10L16.85 7.65L14.5 7L16.85 6.35L17.5 4ZM5.5 14L6.1 16.4L8.5 17L6.1 17.6L5.5 20L4.9 17.6L2.5 17L4.9 16.4L5.5 14Z" fill={color || "url(#gradient-ai-tree)"} />
    </SvgIcon>
  );
}

function AtlasLogoIcon({ className = "h-[24px] w-[24px]", color }: { className?: string; color?: string }) {
  if (color) {
    return (
      <svg
        aria-hidden="true"
        className={`${className} block shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.0062 14.7301C12.1092 16.4118 13.4763 17.7575 15.1846 17.859V17.8712C13.4763 17.9726 12.1092 19.3184 12.0062 21H11.9938C11.8908 19.3184 10.5237 17.9726 8.81538 17.8712V17.859C10.5237 17.7575 11.8908 16.4118 11.9938 14.7301H12.0062ZM21 20.9917H16.5692L12 8.87479L7.43077 20.9917H3L9.78462 3H14.2154L21 20.9917Z"
          fill={color}
        />
      </svg>
    );
  }

  return <img src={atlasLogoUrl} alt="" className={`${className} block shrink-0`} />;
}

function CodeStatusSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center">
      {children}
    </div>
  );
}

function CodeStatusDot({ color }: { color: string }) {
  return <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: color }} />;
}

function TooltipText({ label, children, align = "center", disabled = false, className = "" }: { label: React.ReactNode; children: React.ReactNode; align?: "center" | "left"; disabled?: boolean; className?: string }) {
  if (disabled) return <>{children}</>;
  return (
    <Tooltip label={label} align={align} className={className}>
      {children}
    </Tooltip>
  );
}

function WorkspaceModal({
  isOpen,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
  dangerPrimary = false,
  iconColor,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onClose: () => void;
  dangerPrimary?: boolean;
  iconColor?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-[400px] max-w-[90vw] rounded-[8px] bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between border-b border-[#E5E8E8] px-[24px] pb-[17px] pt-[16px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <ErrorWarningIcon className="w-[20px] h-[20px] shrink-0" color={iconColor || (dangerPrimary ? "#CC2C3C" : "#F0AB00")} />
            <h2 className="text-[16px] font-semibold leading-[22px] text-text-primary">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-graphite-10 active:scale-[0.96]"
            aria-label="Close"
          >
            <CloseIcon className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
          </button>
        </div>
        <div className="px-[24px] py-[20px]">
          <p className="text-[14px] leading-[24px] text-text-secondary">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-[12px] border-t border-[#E5E8E8] px-[24px] pb-[20px] pt-[21px]">
          <button
            onClick={onSecondary}
            className="h-[36px] rounded-[4px] border-[0.6px] border-border-default bg-white px-[12px] text-[14px] font-medium leading-[24px] text-text-primary hover:bg-bg-panel active:scale-[0.96]"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary}
            className={`h-[36px] rounded-[4px] px-[12px] text-[14px] font-medium leading-[24px] text-white active:scale-[0.96] ${dangerPrimary ? 'bg-[#CC2C3C] hover:bg-[#b02030]' : 'bg-brand-1 hover:bg-[#6D0043]'}`}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type PanelView = 'shell' | 'both' | 'code';
type PanelLayout = 'vertical' | 'horizontal';

const SPLIT_ICON_PATH = "M4.66699 1.33398H1.33398V10.667H5V12H1.33398C0.597712 12 0.000176632 11.4032 0 10.667V1.33398C0 0.597605 0.597605 0 1.33398 0H4.66699V1.33398ZM7.33398 12H6V0H7.33398V12ZM12 0C12.7361 0.000175088 13.3338 0.596888 13.334 1.33301V10.666C13.334 11.4023 12.7362 11.9998 12 12H8.33398V10.666H12V1.33301H8.33398V0H12Z";

function PanelViewToggle({
  value,
  onChange,
  layout,
  onLayoutChange,
  docType = 'table',
}: {
  value: PanelView;
  onChange: (v: PanelView) => void;
  layout: PanelLayout;
  onLayoutChange: (l: PanelLayout) => void;
  docType?: DocumentType;
}) {
  return (
    <div className="flex h-[28px] items-center rounded-[4px] border border-graphite-10 bg-bg-panel shrink-0 overflow-hidden">
      <TooltipText label="Show Shell" className="h-full flex">
        <button
          onClick={() => onChange('shell')}
          className={`flex h-full w-[40px] items-center justify-center relative rounded-[3px] shrink-0 transition-colors ${
            value === 'shell' ? 'bg-white' : ''
          }`}
        >
          {value === 'shell' && (
            <div aria-hidden className="absolute border-border-default border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
          )}
          <p className={`t-small whitespace-nowrap ${value === 'shell' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Shell
          </p>
        </button>
      </TooltipText>
      <TooltipText label={layout === 'vertical' ? "Stack View" : "Side-by-Side View"} className="h-full flex">
        <button
          onClick={() => {
            if (value === 'both') {
              onLayoutChange(layout === 'vertical' ? 'horizontal' : 'vertical');
            } else {
              onChange('both');
            }
          }}
          className={`flex h-full w-[28px] items-center justify-center relative rounded-[3px] shrink-0 transition-colors ${
            value === 'both' ? 'bg-white' : ''
          }`}
        >
          {value === 'both' && (
            <div aria-hidden className="absolute border-border-default border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
          )}
          <div className={`relative shrink-0 size-[16px] flex items-center justify-center ${layout === 'vertical' ? 'rotate-90' : ''}`}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 12">
              <path d={SPLIT_ICON_PATH} fill={value === 'both' ? '#3C4242' : '#888E8E'} />
            </svg>
          </div>
        </button>
      </TooltipText>
      <TooltipText label="Show Code Only" className="h-full flex">
        <button
          onClick={() => onChange('code')}
          className={`flex h-full w-[40px] items-center justify-center relative rounded-[3px] shrink-0 transition-colors ${
            value === 'code' ? 'bg-white' : ''
          }`}
        >
          {value === 'code' && (
            <div aria-hidden className="absolute border-border-default border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
          )}
          <p className={`t-small whitespace-nowrap ${value === 'code' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Code
          </p>
        </button>
      </TooltipText>
    </div>
  );
}

function ViewToggleBar({
  treeListOpen,
  onToggleTreeList,
  onNavigateHome,
  currentEvent,

  panelView,
  onPanelViewChange,
  panelLayout,
  onPanelLayoutChange,
  docType = 'table',
  rtfOpen,
  onToggleRtf,
  groupViewOpen,
  onToggleGroupView,
  onOpenDownloadModal,
  onOpenAICopilot,
  aiCopilotOpen = false,
}: {
  treeListOpen: boolean;
  onToggleTreeList: () => void;
  onNavigateHome: () => void;
  currentEvent: string;

  panelView: PanelView;
  onPanelViewChange: (v: PanelView) => void;
  panelLayout: PanelLayout;
  onPanelLayoutChange: (l: PanelLayout) => void;
  docType?: DocumentType;
  rtfOpen?: boolean;
  onToggleRtf?: () => void;
  groupViewOpen?: boolean;
  onToggleGroupView?: () => void;
  onOpenDownloadModal?: () => void;
  onOpenAICopilot?: () => void;
  aiCopilotOpen?: boolean;
}) {


  const rightControls = (
    <div className="flex items-center">
      {/* 1. Left Icon Buttons: Group Code & Download (gap: 4px, borderless & transparent in default) */}
      <div className="flex items-center gap-[4px]">
        {onToggleGroupView && (
          <TooltipText label={groupViewOpen ? "Close Group Code" : "Open Group Code"}>
            <button
              type="button"
              onClick={onToggleGroupView}
              className={`relative flex h-[28px] w-[28px] items-center justify-center rounded-[4px] transition-colors active:scale-[0.96] ${
                groupViewOpen ? "bg-az-secondary" : "bg-transparent hover:bg-black/5"
              }`}
              aria-label="Toggle group code"
            >
              <LocalIcon src={groupIconUrl} className="h-[16px] w-[16px]" color={groupViewOpen ? "#830051" : "#888E8E"} />
            </button>
          </TooltipText>
        )}
        {onOpenDownloadModal && (
          <TooltipText label="Download SAS Programs">
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="relative flex h-[28px] w-[28px] items-center justify-center rounded-[4px] bg-transparent hover:bg-black/5 transition-colors active:scale-[0.96]"
              aria-label="Download SAS Programs"
            >
              <LocalIcon src={downloadIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
            </button>
          </TooltipText>
        )}
      </div>

      {/* 2. Vertical Divider: Graphite-20, h-18px, w-1.2px, rounded-full, 12px margin on left & right */}
      {(onToggleGroupView || onOpenDownloadModal) && (
        <div className="w-[1.2px] h-[18px] bg-graphite-20 rounded-full shrink-0 mx-[12px]" aria-hidden="true" />
      )}

      {/* 3. Panel View Toggle & AI Button (gap: 8px) */}
      <div className="flex items-center gap-[8px]">
        <PanelViewToggle value={panelView} onChange={onPanelViewChange} layout={panelLayout} onLayoutChange={onPanelLayoutChange} docType={docType} />
        {onOpenAICopilot && (
          <TooltipText label={aiCopilotOpen ? "Close AI Copilot" : "Open AI Copilot"}>
            <button
              type="button"
              onClick={onOpenAICopilot}
              className={`relative flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[4px] transition-colors active:scale-[0.96] ${
                aiCopilotOpen
                  ? "bg-az-secondary text-brand-1 hover:bg-az-secondary-hover"
                  : "bg-brand-1 text-white hover:bg-az-warning shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              }`}
              aria-label={aiCopilotOpen ? "Close AI Copilot" : "Open AI Copilot"}
            >
              <AtlasLogoIcon className="h-[16px] w-[16px] shrink-0" color={aiCopilotOpen ? "var(--color-brand-1)" : "white"} />
            </button>
          </TooltipText>
        )}
      </div>
    </div>
  );

  if (!treeListOpen) {
    // Collapsed: single row with study info + view tabs + panel toggle
    return (
      <div className="shrink-0 w-full">
        <div className="h-[48px] w-full flex items-center px-[12px] justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0">
              <p className="t-small truncate font-medium text-text-primary">AZE2001-301</p>
              <p className="truncate text-[10px] leading-[15px] text-text-secondary">{currentEvent}</p>
            </div>
            <TooltipText label="Open Tree List">
              <button
                onClick={onToggleTreeList}
                className="h-[28px] w-[28px] flex items-center justify-center hover:bg-black/5 rounded-[4px] active:scale-[0.96]"
                aria-label="Open tree list"
              >
                <LocalIcon src={expandIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
              </button>
            </TooltipText>
          </div>
          <div className="flex items-stretch gap-[4px] h-full"></div>
          {rightControls}
        </div>
      </div>
    );
  }

  // Expanded: view tabs row only
  return (
    <div className="shrink-0 w-full">
      <div className="h-[48px] w-full flex items-center justify-end px-[12px]">
        {rightControls}
      </div>
    </div>
  );
}

// SearchBar is imported from components/ui/SearchBar

function TreeStatusControl({
  item,
  itemId,
  program,
  isHovered,
  isProgram,
  isChildOfLockedParent,
  onToggleLock,
  onShowLockedModal,
  isFigureQueued,
}: {
  item: TableItem | ProgramItem;
  itemId: string;
  program: ProgramItem;
  isHovered: boolean;
  isProgram: boolean;
  isChildOfLockedParent: boolean;
  onToggleLock: (programId: string, tableId?: string) => void;
  onShowLockedModal: (programName: string) => void;
  isFigureQueued?: boolean;
}) {
  if (item.docType === 'figure' && isFigureQueued) {
    return (
      <TooltipText label="Queued — Waiting for Table 14.1.6.1 to complete">
        <span className="cursor-help">
          <CodeStatusSlot>
            <div className="flex items-center justify-center w-[16px] h-[16px]">
              <SvgIcon className="w-[14px] h-[14px]" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 12.5l-3.8-2.3V7h1.5v4.5l3.1 1.9-.8 1.1z" fill="#888E8E" />
              </SvgIcon>
            </div>
          </CodeStatusSlot>
        </span>
      </TooltipText>
    );
  }

  if (item.status === 'analyzing') {
    return (
      <CodeStatusSlot>
        <img src={aiProcessingIconUrl} alt="" aria-hidden="true" className="h-[16px] w-[16px] block shrink-0" />
      </CodeStatusSlot>
    );
  }

  if (item.status === 'error' && 'errorMessage' in item) {
    return (
      <TooltipText label={item.errorMessage || 'Error occurred'}>
        <span className="cursor-help">
          <CodeStatusSlot>
            <CodeStatusDot color="#CC2C3C" />
          </CodeStatusSlot>
        </span>
      </TooltipText>
    );
  }

  if (item.status === 'modified' && 'pendingChanges' in item) {
    return (
      <TooltipText label={`${item.pendingChanges || 0} Pending changes`}>
        <span className="cursor-help">
          <CodeStatusSlot>
            <CodeStatusDot color="#F0AB00" />
          </CodeStatusSlot>
        </span>
      </TooltipText>
    );
  }

  if (item.status === 'locked') {
    if (isProgram) {
      return (
        <CodeStatusSlot>
          <LockTreeIcon color="#B2B4B4" />
        </CodeStatusSlot>
      );
    }
    if (isChildOfLockedParent) {
      return (
        <TooltipText label={`Locked by ${program.name}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowLockedModal(program.name);
            }}
            className="flex h-[20px] w-[20px] cursor-not-allowed items-center justify-center rounded-[4px]"
            aria-label="Locked by parent"
          >
            <LockTreeIcon color="var(--color-text-secondary)" />
          </button>
        </TooltipText>
      );
    }

    return (
      <TooltipText label="Unlock Table Code">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isProgram) {
              onToggleLock(itemId);
            } else {
              onToggleLock(program.id, itemId);
            }
          }}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label="Unlock code"
        >
          <LockTreeIcon color="var(--color-text-secondary)" />
        </button>
      </TooltipText>
    );
  }

  if (isHovered && item.status === 'pending' && !isProgram) {
    return (
      <TooltipText label="Lock Table Code">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(program.id, isProgram ? undefined : itemId);
          }}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label="Lock code"
        >
          <UnlockTreeIcon color="var(--color-text-secondary)" />
        </button>
      </TooltipText>
    );
  }

  return <div className="h-[20px] w-[20px]" />;
}

function TreeItem({
  program,
  selectedId,
  onSelect,
  onToggleLock,
  onToggleExpand,
  onShowLockedModal,
}: {
  program: ProgramItem;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleLock: (programId: string, tableId?: string) => void;
  onToggleExpand: (programId: string) => void;
  onShowLockedModal: (programName: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isProgramHovered = hoveredId === program.id;
  const isProgramLocked = program.status === 'locked';

  return (
    <div className="flex w-full flex-col gap-[2px]">
      <div
        className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors ${
          isProgramHovered ? 'bg-graphite-10' : ''
        }`}
        onClick={() => onToggleExpand(program.id)}
        onMouseEnter={() => setHoveredId(program.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="flex h-full items-center justify-between px-[12px]">
          <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(program.id);
              }}
              className="flex h-[16px] w-[16px] shrink-0 items-center justify-center active:scale-[0.96]"
              aria-label={program.isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRightTreeIcon isExpanded={program.isExpanded} color={isProgramLocked ? "#B2B4B4" : "#888E8E"} />
            </button>
            <p className={`t-small min-w-0 flex-1 truncate ${isProgramLocked ? 'text-[#B2B4B4]' : 'text-text-primary'}`}>
              {program.name}
            </p>
          </div>
          <TreeStatusControl
            item={program}
            itemId={program.id}
            program={program}
            isHovered={isProgramHovered}
            isProgram
            isChildOfLockedParent={false}
            onToggleLock={onToggleLock}
            onShowLockedModal={onShowLockedModal}
          />
        </div>
      </div>

      {program.isExpanded && (
        <div className="flex flex-col">
          {program.tables.map((table) => {
            const isTableHovered = hoveredId === table.id;
            const isTableSelected = selectedId === table.id;
            const effectiveItem: TableItem = isProgramLocked ? { ...table, status: 'locked' } : table;

            const isQueued = table.docType === 'figure' && table.status === 'queued';

            return (
              <div
                key={table.id}
                className={`relative h-[28px] w-full rounded-[4px] transition-colors ${
                  isQueued
                    ? 'opacity-60 cursor-not-allowed'
                    : isTableSelected
                      ? 'bg-az-secondary'
                      : isTableHovered
                        ? 'bg-graphite-10'
                        : 'cursor-pointer'
                }`}
                onClick={isQueued ? undefined : () => onSelect(table.id)}
                onMouseEnter={isQueued ? undefined : () => setHoveredId(table.id)}
                onMouseLeave={isQueued ? undefined : () => setHoveredId(null)}
              >
                <div className="flex h-full items-center justify-between pl-[24px] pr-[12px]">
                  <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
                    {table.docType === 'listing' ? (
                      <ListingTreeIcon color={isProgramLocked ? "#B2B4B4" : isTableSelected ? "#830051" : "#888E8E"} />
                    ) : table.docType === 'figure' ? (
                      <FigureTreeIcon color={isProgramLocked ? "#B2B4B4" : isTableSelected ? "#830051" : "#888E8E"} />
                    ) : (
                      <TableTreeIcon color={isProgramLocked ? "#B2B4B4" : isTableSelected ? "#830051" : "#888E8E"} />
                    )}
                    <p className={`t-small min-w-0 truncate ${isProgramLocked ? 'text-[#B2B4B4]' : isTableSelected ? 'text-brand-1' : 'text-text-primary'}`}>
                      {table.name}
                    </p>
                  </div>
                  <TreeStatusControl
                    item={effectiveItem}
                    itemId={table.id}
                    program={program}
                    isHovered={isTableHovered && !isProgramLocked && !isQueued}
                    isProgram={false}
                    isChildOfLockedParent={isProgramLocked}
                    onToggleLock={onToggleLock}
                    onShowLockedModal={onShowLockedModal}
                    isFigureQueued={isQueued}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkspaceDivider({
  onDrag,
  onDragStart,
  onDragEnd,
  className = "",
}: {
  onDrag: (delta: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startXRef = useRef(0);
  const onDragRef = useRef(onDrag);
  onDragRef.current = onDrag;

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - startXRef.current;
      startXRef.current = event.clientX;
      onDragRef.current(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.();
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, onDragEnd]);

  return (
    <div
      className={`relative z-30 w-[2px] shrink-0 cursor-col-resize bg-bg-panel ${className}`}
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        onDragStart?.();
        startXRef.current = event.clientX;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-y-0 -left-[4px] -right-[4px] z-10 cursor-col-resize" />
      <div className={`absolute inset-0 w-full bg-brand-1 transition-opacity duration-150 ${isHovered || isDragging ? 'opacity-100 delay-200' : 'opacity-0 delay-0'}`} />
    </div>
  );
}

function CategoryFilter({
  value,
  onChange,
}: {
  value: "all" | "table" | "listing" | "figure";
  onChange: (v: "all" | "table" | "listing" | "figure") => void;
}) {
  const categories: Array<{ id: "all" | "table" | "listing" | "figure"; label: string; icon?: React.ReactNode }> = [
    { id: "all", label: "All" },
    { id: "table", label: "Table", icon: <TableTreeIcon /> },
    { id: "listing", label: "Listing", icon: <ListingTreeIcon color="var(--color-text-secondary)" /> },
    { id: "figure", label: "Figure", icon: <FigureTreeIcon color="var(--color-text-secondary)" /> },
  ];

  return (
    <div className="h-[32px] w-full px-[8px] py-[4px]">
      <div className="flex items-center gap-[8px]">
        {categories.map((category) => {
          const isSelected = value === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onChange(category.id)}
              className={`flex h-[24px] items-center gap-[4px] px-[8px] rounded-[4px] t-small transition-colors ${
                isSelected ? "bg-az-secondary text-brand-1 font-medium" : "text-text-secondary hover:bg-graphite-10 hover:text-text-primary"
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PanelHeader({
  title,
  actions,
  noBorder = false,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div className={`flex h-[40px] w-full shrink-0 items-center justify-between bg-white px-[12px] py-0 ${noBorder ? '' : 'border-b border-graphite-10'}`}>
      <div className="truncate flex items-center">{title}</div>
      {actions && <div className="flex items-center gap-[4px]">{actions}</div>}
    </div>
  );
}

// Scales content visually while collapsing its layout box to the scaled size,
// so the scroll container reserves no dead space at zoom levels below 100%.
function ZoomContainer({
  scale,
  className = "",
  children,
}: {
  scale: number;
  className?: string;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const measure = () => {
      setSize({ width: node.scrollWidth, height: node.scrollHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);

  if (scale === 1) {
    return (
      <div className={className}>
        <div ref={innerRef}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={size ? { width: size.width * scale, height: size.height * scale } : undefined}
    >
      <div
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ color = "#888E8E" }) {
  return (
    <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill={color} />
    </svg>
  );
}

function ChevronRightIcon({ color = "#888E8E" }) {
  return (
    <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill={color} />
    </svg>
  );
}

function HorizontalWorkspaceDivider({
  onDrag,
  onDragStart,
  onDragEnd,
  className = "",
}: {
  onDrag: (delta: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startYRef = useRef(0);
  const onDragRef = useRef(onDrag);
  onDragRef.current = onDrag;

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientY - startYRef.current;
      startYRef.current = event.clientY;
      onDragRef.current(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.();
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, onDragEnd]);

  return (
    <div
      className={`relative z-20 w-full h-[2px] shrink-0 cursor-row-resize bg-bg-panel ${className}`}
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        onDragStart?.();
        startYRef.current = event.clientY;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-x-0 -top-[4px] -bottom-[4px] z-10" />
      <div className={`absolute inset-0 h-full bg-brand-1 transition-opacity duration-150 ${isHovered || isDragging ? 'opacity-100 delay-200' : 'opacity-0 delay-0'}`} />
    </div>
  );
}

const listingData = [
  { studyDay: "-21", lesionNum: "1", lesionLoc: "Lung, right upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "42", sum: "150" },
  { studyDay: "", lesionNum: "2", lesionLoc: "Local nymph node", locSpec: "Right paratracheal node", method: "Multi-Slice Spiral CT", diameter: "20", sum: "" },
  { studyDay: "", lesionNum: "3", lesionLoc: "Lung, left upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "25", sum: "" },
  { studyDay: "", lesionNum: "4", lesionLoc: "Liver-left lobe, segment IV", locSpec: "Segment 4 hepatic metastases", method: "Multi-Slice Spiral CT", diameter: "31", sum: "" },
  { studyDay: "", lesionNum: "5", lesionLoc: "Spleen", locSpec: "Splenic metastasis", method: "Multi-Slice Spiral CT", diameter: "32", sum: "" },
  { studyDay: "46", lesionNum: "1", lesionLoc: "Lung, right upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "31", sum: "93" },
  { studyDay: "", lesionNum: "2", lesionLoc: "Local nymph node", locSpec: "Right paratracheal node", method: "Multi-Slice Spiral CT", diameter: "10", sum: "" },
  { studyDay: "", lesionNum: "3", lesionLoc: "Lung, left upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "15", sum: "" },
  { studyDay: "", lesionNum: "4", lesionLoc: "Liver-left lobe, segment IV", locSpec: "Segment 4 hepatic metastases", method: "Multi-Slice Spiral CT", diameter: "17", sum: "" },
  { studyDay: "", lesionNum: "5", lesionLoc: "Spleen", locSpec: "Splenic metastasis", method: "Multi-Slice Spiral CT", diameter: "20", sum: "" },
  { studyDay: "86", lesionNum: "1", lesionLoc: "Lung, right upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "32", sum: "91" },
  { studyDay: "", lesionNum: "2", lesionLoc: "Local nymph node", locSpec: "Right paratracheal node", method: "Multi-Slice Spiral CT", diameter: "12", sum: "" },
  { studyDay: "", lesionNum: "3", lesionLoc: "Lung, left upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "14", sum: "" },
  { studyDay: "", lesionNum: "4", lesionLoc: "Liver-left lobe, segment IV", locSpec: "Segment 4 hepatic metastases", method: "Multi-Slice Spiral CT", diameter: "14", sum: "" },
  { studyDay: "", lesionNum: "5", lesionLoc: "Spleen", locSpec: "Splenic metastasis", method: "Multi-Slice Spiral CT", diameter: "19", sum: "" },
  { studyDay: "128", lesionNum: "1", lesionLoc: "Lung, right upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "30", sum: "65" },
  { studyDay: "", lesionNum: "2", lesionLoc: "Local nymph node", locSpec: "Right paratracheal node", method: "Multi-Slice Spiral CT", diameter: "5", sum: "" },
  { studyDay: "", lesionNum: "3", lesionLoc: "Lung, left upper lobe", locSpec: "", method: "Multi-Slice Spiral CT", diameter: "10", sum: "" },
  { studyDay: "", lesionNum: "4", lesionLoc: "Liver-left lobe, segment IV", locSpec: "Segment 4 hepatic metastases", method: "Multi-Slice Spiral CT", diameter: "5", sum: "" },
  { studyDay: "", lesionNum: "5", lesionLoc: "Spleen", locSpec: "Splenic metastasis", method: "Multi-Slice Spiral CT", diameter: "15", sum: "" },
  { studyDay: "xxx#", lesionNum: "x", lesionLoc: "xxxxxxx", locSpec: "xxxxxxx", method: "", diameter: "", sum: "" },
];

const listingColumns = [
  { key: "studyDay", label: "Study day [b]", width: 240, widthPx: 240 },
  { key: "lesionNum", label: "Lesion number", width: 130, widthPx: 130 },
  { key: "lesionLoc", label: "Lesion location", width: 160, widthPx: 160 },
  { key: "locSpec", label: "Location within site specification", width: 220, widthPx: 220 },
  { key: "method", label: "Method of assessment", width: 160, widthPx: 160 },
  { key: "diameter", label: "Diameter (mm) [c]", width: 170, widthPx: 170 },
  { key: "sum", label: "Sum of diameters (mm) [d]", width: 200, widthPx: 200 },
] as const;

// Metadata for Listing column headers.
const LISTING_COLUMN_METADATA: Record<string, { dataset: string; variable: string; additionalVariables?: string[]; filter?: string; rule?: string }> = {
  studyDay: { dataset: 'ADTR', variable: 'ADY', filter: "SAFFL = 'Y'", rule: 'Study day relative to randomisation date; negative values indicate pre-randomisation assessments' },
  lesionNum: { dataset: 'ADTR', variable: 'TRLNKID', rule: 'Direct copy from ADTR.TRLNKID' },
  lesionLoc: { dataset: 'ADTR', variable: 'TRLOC', rule: 'Mapped from TR.TRLOC' },
  locSpec: { dataset: 'ADTR', variable: 'TRLOCSP', rule: 'Direct copy from ADTR.TRLOCSP' },
  method: { dataset: 'ADTR', variable: 'TRMETHOD', rule: 'RECIST 1.1 assessment method' },
  diameter: { dataset: 'ADTR', variable: 'AVAL', additionalVariables: ['ADTR.BASE', 'ADTR.CHG', 'ADTR.PCHG', 'ADTR.ANL01FL'], filter: "PARAMCD = 'DIAMETER'", rule: 'Non-nodal longest diameter or nodal short axis, in mm' },
  sum: { dataset: 'ADTR', variable: 'AVAL', additionalVariables: ['ADTR.PARAMCD', 'ADTR.AVALC'], filter: "PARAMCD = 'SUMDIAM'", rule: 'Sum of non-nodal longest diameters and nodal short axis diameters where PARAMCD=SUMDIAM' },
};

function buildListingColumnTooltipSections(meta: { dataset: string; variable: string; additionalVariables?: string[]; filter?: string; rule?: string } | undefined): TooltipMetadataSection[] {
  if (!meta) return [];
  const sections: TooltipMetadataSection[] = [];

  // Group all variables by dataset
  const allRawVars = [`${meta.dataset}.${meta.variable}`, ...(meta.additionalVariables || [])];
  const datasetMap: Record<string, string[]> = {};
  
  allRawVars.forEach((raw) => {
    const parts = raw.split('.');
    if (parts.length === 2) {
      const [ds, v] = parts;
      if (!datasetMap[ds]) datasetMap[ds] = [];
      if (!datasetMap[ds].includes(v)) datasetMap[ds].push(v);
    } else {
      if (!datasetMap[meta.dataset]) datasetMap[meta.dataset] = [];
      if (!datasetMap[meta.dataset].includes(raw)) datasetMap[meta.dataset].push(raw);
    }
  });

  const formattedValues = Object.entries(datasetMap).map(
    ([ds, vars]) => `${ds}: ${vars.join(', ')}`
  );

  sections.push({
    label: 'Variable Mapping',
    values: formattedValues,
  });

  if (meta.filter) {
    sections.push({
      label: 'Filter',
      values: [meta.filter],
    });
  }
  if (meta.rule) {
    sections.push({
      label: 'Derivation Rule',
      values: [meta.rule],
    });
  }
  return sections;
}

/**
 * Read-only metadata hover for a table block or listing column header. Anchored to the target cell
 * so position stays fixed. Rendered in a portal with fixed positioning so scroll container cannot
 * clip it, tracks scroll/resize, and flips below when there is not enough room above.
 */
function BlockMetadataHover({
  sections,
  anchorRef,
  scrollContainerRef,
}: {
  sections: TooltipMetadataSection[];
  anchorRef: React.RefObject<HTMLElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const anchor = anchorRef.current;
      const node = ref.current;
      if (!anchor || !node) return;

      const anchorRect = anchor.getBoundingClientRect();
      const tipRect = node.getBoundingClientRect();
      const container = scrollContainerRef.current?.getBoundingClientRect();
      // Sits 2px off the label's own edge; EDGE only keeps it off the container's edges.
      const GAP = 2;
      const EDGE = 4;
      const minTop = (container?.top ?? 0) + EDGE;
      const maxBottom = (container?.bottom ?? window.innerHeight) - EDGE;

      // Prefer above the label. Flip below only when above is short AND below actually fits,
      // otherwise clamp to the container top so the block's own rows stay unobscured.
      let top = anchorRect.top - tipRect.height - GAP;
      if (top < minTop) {
        const below = anchorRect.bottom + GAP;
        top = below + tipRect.height <= maxBottom ? below : minTop;
      }

      // Left-align with the label text; clamp so it never leaves the container horizontally.
      const labelLeft = anchorRect.left;
      const minLeft = (container?.left ?? 0) + EDGE;
      const maxLeft = (container?.right ?? window.innerWidth) - tipRect.width - EDGE;
      const left = Math.min(Math.max(labelLeft, minLeft), Math.max(minLeft, maxLeft));

      setPos({ top, left });
    };

    update();

    // Follow the anchor while anything scrolls (capture catches nested scroll containers).
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, scrollContainerRef]);

  return createPortal(
    <div
      ref={ref}
      className={`fixed z-[9999] pointer-events-none transition-opacity duration-[90ms] ${pos ? 'opacity-100' : 'opacity-0'}`}
      style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
    >
      <div className="w-[240px] rounded-[4px] bg-tooltip-bg px-[8px] py-[6px] text-left shadow-[0px_2px_8px_rgba(0,0,0,0.08)] flex flex-col gap-[8px]">
        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-[2px] items-stretch">
            <span className="t-footnote text-tooltip-label">{section.label}</span>
            {section.values.map((value, j) => (
              <span
                key={j}
                className="t-small text-tooltip-text"
                style={
                  section.clampLines
                    ? {
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: section.clampLines,
                        overflow: 'hidden',
                      }
                    : undefined
                }
              >
                {value}
              </span>
            ))}
            {section.more && <span className="t-small text-tooltip-label">{section.more}</span>}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

const listingFootnotes = [
  '* Reviewer who completed baseline first in the absence of an adjudicator, or the reviewer the adjudicator agreed with.',
  '# Study day of assessment has not been provided, visit day has been used instead.',
  '[a] Duration of actual exposure is calculated as per statistical analysis plan.',
  '[b] Study day is relative to randomisation date. A negative study day indicates the assessment/event occurred before date of randomisation.',
  '[c] Non-nodal lesion longest diameter or nodal short axis diameter.',
  '[d] Sum of non-nodal lesion longest diameters and nodal short axis diameters.',
  'NA Not applicable; NE Not evaluable; RECIST Response evaluation criteria in solid tumors, Version 1.1.',
  '<<output program path>> <<output file name>> <<date/time>>'
];

// Print preview constants
const A4_LANDSCAPE_WIDTH_PX = 1123;
const A4_LANDSCAPE_HEIGHT_PX = 794;
const A4_HORIZONTAL_PADDING_PX = 96;
const PRINT_PADDING_TOP_PX = 64;
const PRINT_PADDING_BOTTOM_PX = 48;
const PRINT_HEADER_BLOCK_HEIGHT_PX = 62;
const PRINT_TABLE_HEAD_HEIGHT_PX = 28;
const PRINT_TABLE_ROW_HEIGHT_PX = 28;
const PRINT_ROWS_PER_PAGE = Math.max(
  1,
  Math.floor(
    (A4_LANDSCAPE_HEIGHT_PX
      - PRINT_PADDING_TOP_PX
      - PRINT_PADDING_BOTTOM_PX
      - PRINT_HEADER_BLOCK_HEIGHT_PX
      - PRINT_TABLE_HEAD_HEIGHT_PX) / PRINT_TABLE_ROW_HEIGHT_PX
  )
);

const METADATA_MIN_W = 280;
const METADATA_MAX_W = 420;

// ─── ColumnDivider ─────────────────────────────────────────────────────────
// Pill sits just above the thead row.
const TABLE_TOP = 0;
const PILL_BOTTOM_Y = -4;

interface ColumnDividerProps {
  gapX: number;
  label: string;
  isDragging?: boolean;
  dragGapX?: number;
  onRemove: () => void;
  onDragStart?: (e: React.MouseEvent) => void;
  type?: 'page-break' | 'freeze';
}

function ColumnDivider({
  gapX,
  label,
  isDragging = false,
  dragGapX = gapX,
  onRemove,
  onDragStart,
  type = 'page-break',
}: ColumnDividerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFreeze = type === 'freeze';

  const variant =
    isDragging ? 'drag'
    : isHovered ? 'hover'
    : 'default';

  const lineWidth = variant === 'hover' || variant === 'drag' ? 3 : 2;
  const lineSolid = true;

  const lineColor = isFreeze ? '#830051' : '#F0AB00';
  const ghostColor = isFreeze ? 'rgba(131,0,81,0.2)' : 'rgba(240,171,0,0.2)';
  const pillBg = isFreeze ? '#F4E8EE' : '#FCEECC';
  const pillTextColor = isFreeze ? "var(--color-brand-1)" : "var(--color-text-primary)";

  const posX = isDragging ? dragGapX : gapX;

  const content = (
    <>
      {/* Ghost — original position while dragging; clipped to table height */}
      {isDragging && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: isFreeze ? `${gapX - posX}px` : `${gapX}px`,
            top: `${TABLE_TOP}px`,
            bottom: '2px',
            width: '0px',
            borderLeft: isFreeze
              ? '2px solid rgba(131, 0, 81, 0.4)'
              : '2px solid rgba(240, 171, 0, 0.5)',
            zIndex: 28,
          }}
        />
      )}

      {/* Hit area — covers table area only (top = TABLE_TOP) */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: isFreeze ? '-6px' : `${posX - 6}px`,
          top: `${TABLE_TOP}px`,
          bottom: '2px',
          width: '12px',
          cursor: onDragStart ? 'col-resize' : 'default',
          zIndex: isFreeze ? 24 : 10,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={onDragStart}
      >
        {/* Visual line — centered in the 12px hit area, full table height */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none transition-[width] duration-[120ms]"
          style={{
            width: `${lineWidth}px`,
            ...(lineSolid
              ? { backgroundColor: lineColor }
              : { borderLeft: `2px dashed ${isFreeze ? 'rgba(131,0,81,0.8)' : 'rgba(240,171,0,0.8)'}` }),
          }}
        />
      </div>

      {/* Pill label */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: isFreeze ? '0px' : `${posX}px`,
          top: `${PILL_BOTTOM_Y}px`,
          transform: 'translateX(-50%) translateY(-100%)',
          zIndex: isFreeze ? 24 : 12,
        }}
      >
        <div
          className="flex items-center gap-[4px] font-['PingFang_SC',sans-serif] font-normal text-[12px] leading-[20px] whitespace-nowrap rounded-[3px]"
          style={{
            background: pillBg,
            color: pillTextColor,
            padding: '2px 2px 2px 6px',
            border: '1px solid transparent',
          }}
        >
          <span>{label}</span>
          <button
            type="button"
            className="flex items-center justify-center rounded-[4px] hover:bg-black/10 transition-colors active:scale-[0.96] shrink-0"
            style={{ width: '20px', height: '20px' }}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label={`Remove ${label}`}
          >
            <LocalIcon src={closeIconUrl} className="w-[12px] h-[12px]" color={pillTextColor} />
          </button>
        </div>
      </div>
    </>
  );

  if (isFreeze) {
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 24 }}>
        <div
          className="sticky"
          style={{
            left: `${posX}px`,
            top: 0,
            bottom: 0,
            width: 0,
            height: '100%',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}

interface ListingShellPreviewProps {
  selectedItemName: string;
  onBlockClick: () => void;
  onMetadataClick: () => void;
  metadataOpen: boolean;
  onCloseMetadata: () => void;
  isLocked?: boolean;
  onPagePreviewChange?: (active: boolean) => void;
  onOpenAICopilot?: (text?: string) => void;
  frozenUntilIndex: number | null;
  setFrozenUntilIndex: (n: number | null) => void;
  pageSepActive: boolean;
  setPageSepActive: (b: boolean) => void;
  pageColumnCounts: Record<string, number>;
  setPageColumnCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  idpageBaseline: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  idlistBaseline: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  onIdpageBaselineChange: (b: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  onIdlistBaselineChange: (b: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  metadataWidth: number;
  onMetadataResize: (delta: number) => void;
  groupViewOpen?: boolean;
  onGroupViewClick?: () => void;
  onGroupViewClose?: () => void;
  groupCodes?: GroupCodeItem[];
  groupViewWidth?: number;
  onGroupViewResize?: (delta: number) => void;
  onMetaDiffChange?: (diffItems: MetaDiffItem[]) => void;
  onRequestUpdateCode?: () => void;
  onMetaCancel?: () => void;
  baselineAdvanceTrigger?: number;
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  submittedDiffItems?: MetaDiffItem[];
  onReviewItemsChange?: (items: ReviewItem[]) => void;
  onQuoteField?: (fieldId: string, fieldName: string, blockName: string) => void;
}

function ListingShellPreview({
  selectedItemName,
  onBlockClick,
  onMetadataClick,
  metadataOpen,
  onCloseMetadata,
  isLocked,
  onPagePreviewChange,
  onOpenAICopilot,
  frozenUntilIndex,
  setFrozenUntilIndex,
  pageSepActive,
  setPageSepActive,
  pageColumnCounts,
  setPageColumnCounts,
  idpageBaseline,
  idlistBaseline,
  onIdpageBaselineChange,
  onIdlistBaselineChange,
  metadataWidth,
  onMetadataResize,
  groupViewOpen = false,
  onGroupViewClick,
  onGroupViewClose,
  groupCodes = [],
  groupViewWidth = 380,
  onGroupViewResize,
  onMetaDiffChange,
  onRequestUpdateCode,
  onMetaCancel,
  baselineAdvanceTrigger,
  metaUpdateActive,
  metaUpdateProcessing,
  submittedDiffItems = [],
  onReviewItemsChange,
  onQuoteField,
}: ListingShellPreviewProps) {
  const [pageScale] = useState(100);
  const [selectedPrintPageIndex, setSelectedPrintPageIndex] = useState(0);
  const [pageSelectionDraft, setPageSelectionDraft] = useState('1');
  const [metadataPending, setMetadataPending] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('100');
  const zoomOptions = [
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
    { label: '150%', value: '150' },
    { label: '200%', value: '200' },
  ];
  const zoomScale = Number(zoomLevel) / 100;

  const [pageBreakColumns, setPageBreakColumns] = useState<number[]>([]);
  const [repeatColumnBaseline, setRepeatColumnBaseline] = useState<{ frozenUntilIndex: number | null }>({ frozenUntilIndex: null });
  const [pageBreakColumnBaseline, setPageBreakColumnBaseline] = useState<{ pageSepActive: boolean; pageColumnCounts: Record<string, number>; pageBreakColumns: number[] }>({
    pageSepActive: false,
    pageColumnCounts: {},
    pageBreakColumns: [],
  });
  const [draggingBreak, setDraggingBreak] = useState<{ colIdx: number; currentGap: number } | null>(null);
  const [draggingFreeze, setDraggingFreeze] = useState<{ currentGap: number } | null>(null);
  const [freezeDragOriginX, setFreezeDragOriginX] = useState<number | null>(null);
  const [pageDragOriginX, setPageDragOriginX] = useState<number | null>(null);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [hoveredFreezeColumn, setHoveredFreezeColumn] = useState<number | null>(null);
  const [hoveredColumnKey, setHoveredColumnKey] = useState<string | null>(null);
  const [gapXPositions, setGapXPositions] = useState<number[]>([]);

  const listingScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const thRefs = useRef<Array<HTMLTableCellElement | null>>([]);
  const aiElementRefs = useRef<Array<HTMLDivElement | null>>([]);
  const gapXPositionsRef = useRef<number[]>([]);

  const previousPageSepActiveRef = useRef(pageSepActive);
  const pageCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pagePreviewScrollRef = useRef<HTMLDivElement>(null);
  const suppressPageSyncRef = useRef(false);
  const suppressPageSyncTimerRef = useRef<number | null>(null);
  const freezeCloseTimerRef = useRef<number | null>(null);

  const handleFreezeTriggerEnter = (columnIndex: number) => {
    if (freezeCloseTimerRef.current) {
      clearTimeout(freezeCloseTimerRef.current);
      freezeCloseTimerRef.current = null;
    }
    if (draggingBreak === null && draggingFreeze === null && columnIndex < firstPageBreakIndex) {
      setHoveredFreezeColumn(columnIndex);
    }
  };

  const handleFreezeTriggerLeave = () => {
    if (freezeCloseTimerRef.current) clearTimeout(freezeCloseTimerRef.current);
    freezeCloseTimerRef.current = window.setTimeout(() => {
      setHoveredFreezeColumn(null);
    }, 250); // 250ms Safety zone grace period
  };

  const totalListingWidth = useMemo(() => listingColumns.reduce((sum, col) => sum + col.widthPx, 0), [listingColumns]);

  // Preserve horizontal scroll position when metadata panel opens/closes
  const prevMetadataOpenRef = useRef(metadataOpen);
  useEffect(() => {
    if (prevMetadataOpenRef.current === metadataOpen) return;
    prevMetadataOpenRef.current = metadataOpen;
    const container = listingScrollContainerRef.current;
    if (!container) return;
    const scrollRatio = container.scrollWidth > container.clientWidth
      ? container.scrollLeft / (container.scrollWidth - container.clientWidth)
      : 0;
    requestAnimationFrame(() => {
      if (container.scrollWidth > container.clientWidth) {
        container.scrollLeft = scrollRatio * (container.scrollWidth - container.clientWidth);
      }
    });
  }, [metadataOpen]);

  const handleMetadataDividerDrag = (delta: number) => {
    onMetadataResize(-delta);
  };

  // Measure actual rendered column right-edges relative to the table container.
  useEffect(() => {
    const measure = () => {
      const container = tableContainerRef.current;
      if (!container) return;
      const containerLeft = container.getBoundingClientRect().left;
      const positions = Array.from({ length: listingColumns.length - 1 }, (_, i) => {
        const th = thRefs.current[i];
        if (!th) return 0;
        return th.getBoundingClientRect().right - containerLeft;
      });
      gapXPositionsRef.current = positions;
      setGapXPositions(positions);
    };
    measure();
    const container = tableContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [listingColumns]);

  // Rule 3 + 4: when freeze expands and would overlap a page break, push it right.
  useEffect(() => {
    if (frozenUntilIndex === null) return;
    setPageBreakColumns(prev => {
      const frozen = prev.filter(c => c <= frozenUntilIndex).sort((a, b) => a - b);
      if (frozen.length === 0) return prev;
      // Occupied gaps that must not be reused
      const occupied = new Set(prev.filter(c => c > frozenUntilIndex));
      const pushed: number[] = [];
      for (const _ of frozen) {
        let slot = frozenUntilIndex + 1;
        while ((occupied.has(slot) || pushed.includes(slot)) && slot < listingColumns.length - 1) slot++;
        if (slot <= listingColumns.length - 2) pushed.push(slot);
      }
      return [...occupied, ...pushed].sort((a, b) => a - b);
    });
  }, [frozenUntilIndex]);

  // Recalculate red-dot pending state
  useEffect(() => {
    const load = <T,>(key: string, fallback: T): T => {
      try {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    };
    
    // For listing:
    const lBlocks = load<{ fields: { id: string; status: string; confirmed: boolean }[] }[]>('metadataBlocks_listing', []);
    const lBlockFields = load<{ status: string; confirmed: boolean }[]>('metadataBlockFields_listing', []);
    
    const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => a[key] === b[key]);
    };
    const arePageBreakColumnsEqual = (a: number[] = [], b: number[] = []) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort((x, y) => x - y);
      const sortedB = [...b].sort((x, y) => x - y);
      return sortedA.every((value, index) => value === sortedB[index]);
    };

    const hasRepeatColumnChange = repeatColumnBaseline.frozenUntilIndex !== (frozenUntilIndex ?? null);
    const hasPageBreakColumnChange =
      pageBreakColumnBaseline.pageSepActive !== pageSepActive ||
      !areColumnCountsEqual(pageBreakColumnBaseline.pageColumnCounts, pageColumnCounts) ||
      !arePageBreakColumnsEqual(pageBreakColumnBaseline.pageBreakColumns, pageBreakColumns);

    const hasEditedFieldListing =
      lBlocks.some(b => b.fields.some(f => {
        if (f.id === 'idlist') return hasRepeatColumnChange;
        if (f.id === 'idpage') return hasPageBreakColumnChange;
        return f.status === 'edited' && !f.confirmed;
      })) ||
      lBlockFields.some(f => f.status === 'edited' && !f.confirmed);

    // Table pending calculation
    const blocks = load<{ fields: { id: string; status: string; confirmed: boolean }[] }[]>('metadataBlocks', []);
    const blockFields = load<{ id: string; status: string; confirmed: boolean }[]>('metadataBlockFields', []);
    const groupStatus = load<string>('metadataGroupStatus', 'default');
    const groupConfirmed = load<boolean>('metadataGroupConfirmed', false);
    const isGroupPending = groupStatus === 'edited' && !groupConfirmed;

    const idpagePending = idpageBaseline !== null && (
      idpageBaseline.frozenUntilIndex !== frozenUntilIndex ||
      idpageBaseline.pageSepActive !== pageSepActive ||
      !areColumnCountsEqual(idpageBaseline.pageColumnCounts, pageColumnCounts)
    );
    const idlistPending = idlistBaseline !== null && (
      idlistBaseline.frozenUntilIndex !== frozenUntilIndex ||
      idlistBaseline.pageSepActive !== pageSepActive ||
      !areColumnCountsEqual(idlistBaseline.pageColumnCounts, pageColumnCounts)
    );

    const hasEditedFieldTable =
      isGroupPending ||
      blocks.some(b => b.fields.some(f => {
        if (f.id === 'idlist') return idlistPending;
        if (f.id === 'idpage') return idpagePending;
        return f.status === 'edited' && !f.confirmed;
      })) ||
      blockFields.some(f => {
        if (f.id === 'idlist') return idlistPending;
        if (f.id === 'idpage') return idpagePending;
        return f.status === 'edited' && !f.confirmed;
      });

    setMetadataPending(
      hasEditedFieldListing ||
      hasRepeatColumnChange ||
      hasPageBreakColumnChange ||
      hasEditedFieldTable
    );
  }, [
    metadataOpen,
    frozenUntilIndex,
    pageSepActive,
    pageColumnCounts,
    pageBreakColumns,
    idpageBaseline,
    idlistBaseline,
    repeatColumnBaseline,
    pageBreakColumnBaseline
  ]);

  useEffect(() => {
    if (previousPageSepActiveRef.current === pageSepActive) return;
    previousPageSepActiveRef.current = pageSepActive;
    onPagePreviewChange?.(pageSepActive);
  }, [pageSepActive, onPagePreviewChange]);

  const handlePagePreviewToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (metadataOpen) {
      onCloseMetadata();
    }
    setPageSepActive(!pageSepActive);
  };

  const getFrozenLeft = (columnIndex: number) =>
    listingColumns.slice(0, columnIndex).reduce((sum, column) => sum + column.widthPx, 0);

  const isColumnFrozen = (columnIndex: number) =>
    frozenUntilIndex !== null && columnIndex <= frozenUntilIndex;

  const getGapX = (afterColumnIndex: number) =>
    listingColumns.slice(0, afterColumnIndex + 1).reduce((sum, col) => sum + col.widthPx, 0);

  const isGapInteractive = (afterColumnIndex: number) =>
    frozenUntilIndex === null || afterColumnIndex > frozenUntilIndex;

  const addPageBreak = (afterColumnIndex: number) => {
    setPageBreakColumns(prev =>
      prev.includes(afterColumnIndex) ? prev : [...prev, afterColumnIndex]
    );
  };

  const handlePageBreakDragStart = (colIdx: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const containerEl = tableContainerRef.current;
    if (!containerEl) return;

    const frozenSnapshot = frozenUntilIndex;
    setHoveredGap(null);
    setHoveredFreezeColumn(null);
    setDraggingBreak({ colIdx, currentGap: colIdx });

    // Calculate neighbors and boundaries
    const sortedBreaks = [...pageBreakColumns].sort((a, b) => a - b);
    const selfIndex = sortedBreaks.indexOf(colIdx);
    const otherBreaks = sortedBreaks.filter(c => c !== colIdx);
    
    // P_min: at least 1 column space from left neighbor (or Freeze line)
    const pMin = selfIndex > 0 ? otherBreaks[selfIndex - 1] + 1 : (frozenSnapshot !== null ? frozenSnapshot + 1 : 0);
    // P_max: at least 1 column space from right neighbor (or last available gap)
    const pMax = selfIndex < otherBreaks.length ? otherBreaks[selfIndex] - 1 : listingColumns.length - 2;

    const snapToNearest = (mouseX: number): number => {
      let nearest = colIdx;
      let minDist = Infinity;
      for (let i = 0; i < listingColumns.length - 1; i++) {
        const gx = gapXPositionsRef.current[i] || getGapX(i);
        const dist = Math.abs(mouseX - gx);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }
      return nearest;
    };

    const onMove = (ev: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const nearestRaw = snapToNearest(mouseX);

      // Cursor: forbidden style when entering the freeze zone
      const inFreezeZone = frozenSnapshot !== null && nearestRaw <= frozenSnapshot;
      if (inFreezeZone) {
        document.body.style.cursor = 'not-allowed';
      } else {
        document.body.style.cursor = 'col-resize';
      }

      // Clamp to boundaries
      const clamped = Math.max(pMin, Math.min(pMax, nearestRaw));
      setDraggingBreak(prev => prev ? { ...prev, currentGap: clamped } : null);
    };

    const onUp = () => {
      setDraggingBreak(prev => {
        if (!prev) return null;
        setPageBreakColumns(old => {
          const without = old.filter(c => c !== prev.colIdx);
          if (without.includes(prev.currentGap)) return without;
          return [...without, prev.currentGap].sort((a, b) => a - b);
        });
        return null;
      });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleFreezeDragStart = (e: React.MouseEvent) => {
    if (isScrolled) return;
    e.preventDefault();
    e.stopPropagation();
    const containerEl = tableContainerRef.current;
    if (!containerEl) return;

    const initialFreeze = frozenUntilIndex;
    if (initialFreeze === null) return;

    setHoveredGap(null);
    setHoveredFreezeColumn(null);
    setDraggingFreeze({ currentGap: initialFreeze });
    const initialLeft = initialFreeze === null ? 0 : (gapXPositionsRef.current[initialFreeze] || getGapX(initialFreeze));
    setFreezeDragOriginX(initialLeft);

    const onMove = (ev: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;

      let nearest = initialFreeze;
      let minDist = Infinity;
      const firstPageBreak = pageBreakColumns.length > 0 ? Math.min(...pageBreakColumns) : Infinity;
      const maxFreeze = Math.min(listingColumns.length - 2, firstPageBreak - 1);

      for (let i = 0; i <= Math.max(0, maxFreeze); i++) {
        const gx = gapXPositionsRef.current[i] || getGapX(i);
        const dist = Math.abs(mouseX - gx);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }

      const clamped = Math.max(0, Math.min(maxFreeze, nearest));
      setDraggingFreeze({ currentGap: clamped });
      setFrozenUntilIndex(clamped);
    };

    const onUp = () => {
      setDraggingFreeze(null);
      setFreezeDragOriginX(null);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
  };

  const pageWidthPx = A4_LANDSCAPE_WIDTH_PX;
  const pageHeightPx = A4_LANDSCAPE_HEIGHT_PX;
  const printableWidthPx = pageWidthPx - A4_HORIZONTAL_PADDING_PX;

  const printRowPages = Array.from(
    { length: Math.ceil(listingData.length / PRINT_ROWS_PER_PAGE) },
    (_, pageIndex) => listingData.slice(pageIndex * PRINT_ROWS_PER_PAGE, (pageIndex + 1) * PRINT_ROWS_PER_PAGE)
  );

  const frozenPrintColumns = listingColumns.filter((_, columnIndex) => isColumnFrozen(columnIndex));
  const scrollPrintColumns = listingColumns.filter((_, columnIndex) => !isColumnFrozen(columnIndex));
  const frozenColumnCount = frozenPrintColumns.length;
  const minColumnsPerPage = Math.min(listingColumns.length, frozenColumnCount + 1);
  const maxColumnsPerPage = listingColumns.length;
  const frozenPrintWidth = frozenPrintColumns.reduce((sum, column) => sum + column.widthPx, 0);
  const availableScrollPrintWidth = Math.max(120, printableWidthPx - frozenPrintWidth);

  const autoColumnPageTotals = useMemo(() => {
    if (scrollPrintColumns.length === 0) {
      return [frozenPrintColumns.length > 0 ? frozenPrintColumns.length : listingColumns.length];
    }
    const autoPages: number[] = [];
    let currentWidth = 0;
    let currentScrollColumns = 0;
    scrollPrintColumns.forEach((column) => {
      const nextWidth = currentWidth + column.widthPx;
      if (currentScrollColumns > 0 && nextWidth > availableScrollPrintWidth) {
        autoPages.push(frozenPrintColumns.length + currentScrollColumns);
        currentScrollColumns = 0;
        currentWidth = 0;
      }
      currentScrollColumns += 1;
      currentWidth += column.widthPx;
    });
    if (currentScrollColumns > 0) {
      autoPages.push(frozenPrintColumns.length + currentScrollColumns);
    }
    return autoPages;
  }, [availableScrollPrintWidth, listingColumns.length, frozenPrintColumns.length, scrollPrintColumns]);

  const printPages = useMemo(() => {
    const pages: Array<{
      id: string;
      pageRows: typeof listingData;
      pageColumns: typeof listingColumns[number][];
      pageScrollColumns: typeof listingColumns[number][];
      rowPageIndex: number;
      columnPageIndex: number;
    }> = [];

    // Filter active page breaks: must be greater than frozenUntilIndex and less than listingColumns.length - 1
    const activeBreaks = pageBreakColumns
      .filter(c => frozenUntilIndex === null || c > frozenUntilIndex)
      .sort((a, b) => a - b);

    printRowPages.forEach((pageRows, rowPageIndex) => {
      if (scrollPrintColumns.length === 0) {
        const pageColumns = frozenPrintColumns.length > 0 ? [...frozenPrintColumns] : [...listingColumns];
        pages.push({
          id: `${rowPageIndex}-0`,
          pageRows,
          pageColumns,
          pageScrollColumns: pageColumns.filter((pageColumn) => !frozenPrintColumns.some((frozenColumn) => frozenColumn.key === pageColumn.key)),
          rowPageIndex,
          columnPageIndex: 0,
        });
        return;
      }

      if (activeBreaks.length > 0) {
        let currentStartIdx = 0;
        let columnPageIndex = 0;
        
        activeBreaks.forEach((breakColIdx) => {
          // Find where this breakColIdx is in scrollPrintColumns
          const breakInScrollIdx = scrollPrintColumns.findIndex(c => {
            const mainIdx = listingColumns.findIndex(mc => mc.key === c.key);
            return mainIdx === breakColIdx;
          });
          
          if (breakInScrollIdx >= currentStartIdx) {
            const pageScrollColumns = scrollPrintColumns.slice(currentStartIdx, breakInScrollIdx + 1);
            if (pageScrollColumns.length > 0) {
              const pageColumns = [...frozenPrintColumns, ...pageScrollColumns];
              pages.push({
                id: `${rowPageIndex}-${columnPageIndex}`,
                pageRows,
                pageColumns,
                pageScrollColumns,
                rowPageIndex,
                columnPageIndex,
              });
              currentStartIdx = breakInScrollIdx + 1;
              columnPageIndex += 1;
            }
          }
        });
        
        // Add the remaining columns after the last page break
        if (currentStartIdx < scrollPrintColumns.length) {
          const pageScrollColumns = scrollPrintColumns.slice(currentStartIdx);
          const pageColumns = [...frozenPrintColumns, ...pageScrollColumns];
          pages.push({
            id: `${rowPageIndex}-${columnPageIndex}`,
            pageRows,
            pageColumns,
            pageScrollColumns,
            rowPageIndex,
            columnPageIndex,
          });
        }
      } else {
        let remainingScrollColumns = [...scrollPrintColumns];
        let columnPageIndex = 0;
        while (remainingScrollColumns.length > 0) {
          const pageKey = `${rowPageIndex}-${columnPageIndex}`;
          const defaultTotalColumns = autoColumnPageTotals[columnPageIndex] ?? (frozenPrintColumns.length + remainingScrollColumns.length);
          const configuredTotalColumns = pageColumnCounts[pageKey] ?? defaultTotalColumns;
          const normalizedTotalColumns = Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, configuredTotalColumns));
          const scrollColumnCount = Math.max(1, Math.min(normalizedTotalColumns - frozenPrintColumns.length, remainingScrollColumns.length));
          const pageScrollColumns = remainingScrollColumns.slice(0, scrollColumnCount);
          const pageColumns = [...frozenPrintColumns, ...pageScrollColumns];
          pages.push({
            id: pageKey,
            pageRows,
            pageColumns,
            pageScrollColumns,
            rowPageIndex,
            columnPageIndex,
          });
          remainingScrollColumns = remainingScrollColumns.slice(scrollColumnCount);
          columnPageIndex += 1;
        }
      }
    });
    return pages;
  }, [autoColumnPageTotals, listingColumns, frozenPrintColumns, maxColumnsPerPage, minColumnsPerPage, pageColumnCounts, printRowPages, scrollPrintColumns, pageBreakColumns, frozenUntilIndex]);

  useEffect(() => {
    setSelectedPrintPageIndex((current) => Math.min(current, Math.max(printPages.length - 1, 0)));
  }, [printPages.length]);

  useEffect(() => {
    setPageSelectionDraft(String(selectedPrintPageIndex + 1));
  }, [selectedPrintPageIndex]);

  const selectedPrintPage = printPages[selectedPrintPageIndex] ?? printPages[0] ?? null;

  useEffect(() => {
    if (!pageSepActive) return;
    if (suppressPageSyncRef.current) return;
    const scrollContainer = pagePreviewScrollRef.current;
    if (!scrollContainer) return;
    let frameId = 0;
    const syncCurrentPageFromScroll = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const viewportCenter = containerRect.top + containerRect.height / 2;
      let nearestPageIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      printPages.forEach((page, pageIndex) => {
        const pageElement = pageCardRefs.current[page.id];
        if (!pageElement) return;
        const pageRect = pageElement.getBoundingClientRect();
        const pageCenter = pageRect.top + pageRect.height / 2;
        const distance = Math.abs(pageCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPageIndex = pageIndex;
        }
      });
      setSelectedPrintPageIndex((current) => (current === nearestPageIndex ? current : nearestPageIndex));
    };
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncCurrentPageFromScroll);
    };
    syncCurrentPageFromScroll();
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [pageSepActive, printPages]);

  const selectedPageColumnTotal = selectedPrintPage
    ? Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, pageColumnCounts[selectedPrintPage.id] ?? selectedPrintPage.pageColumns.length))
    : minColumnsPerPage;

  const updateSelectedPageColumnTotal = (nextTotalColumns: number) => {
    if (!selectedPrintPage) return;
    const normalizedTotalColumns = Math.max(minColumnsPerPage, Math.min(maxColumnsPerPage, nextTotalColumns));
    setPageColumnCounts((prev) => ({ ...prev, [selectedPrintPage.id]: normalizedTotalColumns }));
  };

  const handlePageSelectionChange = (nextPageIndex: number) => {
    const nextPage = printPages[nextPageIndex];
    if (!nextPage) return;
    suppressPageSyncRef.current = true;
    if (suppressPageSyncTimerRef.current !== null) {
      window.clearTimeout(suppressPageSyncTimerRef.current);
    }
    setSelectedPrintPageIndex(nextPageIndex);
    pageCardRefs.current[nextPage.id]?.scrollIntoView({ block: 'start', behavior: 'auto' });
    suppressPageSyncTimerRef.current = window.setTimeout(() => {
      suppressPageSyncRef.current = false;
      suppressPageSyncTimerRef.current = null;
    }, 300);
  };

  const handlePageSelectionByNumber = (nextPageNumber: number) => {
    const normalizedPageNumber = Math.max(1, Math.min(printPages.length, nextPageNumber));
    handlePageSelectionChange(normalizedPageNumber - 1);
  };

  const commitPageSelectionDraft = () => {
    const nextValue = Number(pageSelectionDraft);
    if (Number.isNaN(nextValue)) {
      setPageSelectionDraft(String(selectedPrintPageIndex + 1));
      return;
    }
    handlePageSelectionByNumber(nextValue);
  };

  const firstPageBreakIndex = pageBreakColumns.length > 0 ? Math.min(...pageBreakColumns) : Infinity;

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between px-[12px] border-b border-graphite-10">
        <p className="t-small truncate text-text-primary">{selectedItemName || 'Shell preview'}</p>
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[76px]">
              <Dropdown
                options={zoomOptions}
                value={zoomLevel}
                onChange={setZoomLevel}
                triggerClassName="h-[24px] rounded-[4px] pl-[8px] pr-[4px]"
                customBoxClass="border border-form-border bg-white hover:border-graphite-50 rounded-[4px]"
                customTextStyle={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '20px', color: 'var(--color-text-primary)' }}
              />
            </div>
            {/* Page separator / Preview button */}
            <TooltipText label="Print Preview">
              <button
                type="button"
                onClick={handlePagePreviewToggle}
                className={`h-[24px] flex items-center justify-center gap-[4px] rounded-[4px] px-[4px] transition-colors duration-[180ms] active:scale-[0.96] ${
                  pageSepActive ? 'bg-az-secondary text-brand-1' : 'text-text-secondary hover:bg-black/5'
                }`}
                aria-label={pageSepActive ? 'Exit page preview' : 'Enter page preview'}
                aria-pressed={pageSepActive}
              >
                <span className="t-small whitespace-nowrap">Preview</span>
                <span className="relative shrink-0 size-[16px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <path d="M11.3333 14V11.3333H4.66667V14H3.33333V10.6667C3.33333 10.2985 3.63181 10 4 10H12C12.3682 10 12.6667 10.2985 12.6667 10.6667V14H11.3333ZM4.66667 2V4.66667H11.3333V2H12.6667V5.33333C12.6667 5.70152 12.3682 6 12 6H4C3.63181 6 3.33333 5.70152 3.33333 5.33333V2H4.66667ZM1.33333 6L4 8L1.33333 10V6ZM14.6667 6V10L12 8L14.6667 6Z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            </TooltipText>

            {/* Metadata button */}
            <TooltipText label="Open Metadata">
              <button
                type="button"
                disabled={pageSepActive}
                onClick={(event) => {
                  if (pageSepActive) { event.preventDefault(); return; }
                  onMetadataClick();
                }}
                className={`relative size-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-[180ms] active:scale-[0.96] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 ${
                  pageSepActive ? 'text-[#c4c8c8]' : metadataOpen ? 'bg-az-secondary' : 'hover:bg-black/5'
                }`}
                aria-label="Toggle metadata"
              >
                <LocalIcon src={fileInfoIconUrl} className="h-[16px] w-[16px]" color={pageSepActive ? '#c4c8c8' : metadataOpen ? '#830051' : '#888E8E'} />
                {metadataPending && <span className="absolute top-[2px] right-[2px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />}
              </button>
            </TooltipText>


          </div>
        </div>
      </div>

      {/* Content row: shell table + metadata overlay */}
      <div className="flex flex-1 overflow-hidden relative bg-white">
        <div
          ref={listingScrollContainerRef}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 0)}
          className={`relative flex-1 overflow-auto ${pageSepActive ? 'bg-[#f2f3f3]' : ''} ${metadataOpen ? 'border-r border-graphite-10' : ''}`}
        >
          {pageSepActive && createPortal(
            <div className="fixed inset-0 z-[100] bg-border-default">
              {/* Scroll container */}
              <div ref={pagePreviewScrollRef} className="absolute inset-0 overflow-y-auto pt-[52px] z-10">
                {/* Print page cards */}
                <div className="py-[32px] px-[20px] flex flex-col items-center gap-[24px]">
                  {printPages.map((page, pageIndex) => (
                    <div
                      key={page.id}
                      ref={(node) => { pageCardRefs.current[page.id] = node; }}
                      onClick={() => handlePageSelectionChange(pageIndex)}
                      className={`relative overflow-hidden bg-white shadow-elevation-card border border-graphite-10 transition-shadow duration-[180ms]`}
                      style={{ width: `${pageWidthPx}px`, height: `${pageHeightPx}px` }}
                    >
                      <div style={{ transform: `scale(${pageScale / 100})`, transformOrigin: 'top left' }} className="relative">
                        <div className="absolute right-[32px] top-[28px] rounded-[4px] bg-az-secondary px-[6px] py-0 font-['PingFang_SC',sans-serif] text-[12px] leading-[20px] text-brand-1">{pageIndex + 1}/{printPages.length}</div>
                        <div className="p-[48px] pt-[64px]">
                          <div className="border-b-2 border-text-primary pb-[12px] mb-[12px] text-center">
                            <h1 className="font-['Inter',sans-serif] text-[13px] leading-[16px] font-medium text-text-primary tracking-[-0.01em]">Appendix 16.2.4 Demographic and baseline characteristics (ITT analysis set)</h1>
                            <p className="mt-[4px] font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#6f7676]">
                              Rows {page.rowPageIndex * PRINT_ROWS_PER_PAGE + 1}-{page.rowPageIndex * PRINT_ROWS_PER_PAGE + page.pageRows.length} · Columns {page.pageScrollColumns[0] ? listingColumns.findIndex(c => c.key === page.pageScrollColumns[0].key) + 1 : 1}-{page.pageScrollColumns.length ? listingColumns.findIndex(c => c.key === page.pageScrollColumns[page.pageScrollColumns.length - 1].key) + 1 : frozenPrintColumns.length}{frozenPrintColumns.length > 0 ? ` · frozen 1-${frozenPrintColumns.length} repeated` : ''}
                            </p>
                          </div>
                          <table className="w-full table-fixed border-collapse font-['Inter',sans-serif] text-text-primary">
                            <colgroup>
                              {page.pageColumns.map((column) => (
                                <col key={column.key} style={{ width: `${(column.widthPx / page.pageColumns.reduce((sum, item) => sum + item.widthPx, 0)) * 100}%` }} />
                              ))}
                            </colgroup>
                            <thead>
                              <tr className="border-b-2 border-text-primary">
                                {page.pageColumns.map((column) => {
                                  const meta = LISTING_COLUMN_METADATA[column.key];
                                  return (
                                    <th key={column.key} style={{ fontWeight: 500 }} className="border-r border-border-default px-[8px] py-[3px] text-left align-top t-small-medium font-medium whitespace-normal break-words last:border-r-0">
                                      <div className="flex flex-col items-start w-full">
                                        <span className="flex items-start leading-[18px]">{column.label}</span>
                                        <div className="border-t border-graphite-10 -mx-[8px] my-[3px] w-[calc(100%+16px)]" />
                                        {meta ? (
                                          <div className="flex items-center gap-[4px] t-footnote text-text-secondary whitespace-normal break-words leading-[14px]">
                                            <LocalIcon src={toolCallIconUrl} className="w-[12px] h-[12px] shrink-0" color="var(--color-brand-1)" />
                                            <span className="truncate">{meta.dataset}.{meta.variable}</span>
                                            {meta.additionalVariables && meta.additionalVariables.length > 0 && (
                                              <span className="inline-flex items-center justify-center px-[3px] py-0 h-[14px] rounded-[2px] bg-graphite-15 text-text-secondary text-[10px] font-medium shrink-0">
                                                +{meta.additionalVariables.length}
                                              </span>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="h-[14px]" />
                                        )}
                                      </div>
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {page.pageRows.map((row) => (
                                <tr key={row.subject} className="border-b-0 last:border-b-2 last:border-text-primary last:relative last:z-10">
                                  {page.pageColumns.map((column) => (
                                    <td key={`${row.subject}-${column.key}`} className="border-r border-border-default px-[6px] py-[1px] align-middle text-[10px] leading-[14px] font-normal whitespace-normal break-words last:border-r-0">{(row as Record<string, string>)[column.key]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print preview top bar */}
              <div className="absolute top-0 left-0 right-0 z-20 h-[52px] bg-white/90 backdrop-blur-[8px] border-b border-[#cfd2d2] flex items-center justify-between px-[24px] py-[8px]">
                <span className="t-heading text-text-primary">Appendix 16.2.4</span>
                <button type="button" onClick={() => setPageSepActive(false)} className="flex items-center gap-[4px] rounded-[4px] px-[12px] py-[8px] transition-colors hover:bg-black/5">
                  <CloseIcon className="h-[16px] w-[16px]" color="var(--color-text-primary)" />
                  <span className="font-['PingFang_SC',sans-serif] text-[14px] leading-[20px] font-normal text-text-primary">Exit Preview</span>
                </button>
              </div>
            </div>,
            document.body
          )}

          {/* Normal (non-preview) table view */}
          <ZoomContainer scale={zoomScale} className={`min-w-max p-[16px] ${pageSepActive ? 'hidden' : ''}`}>
            <div className={`w-max bg-white text-text-primary rounded-[4px] p-[20px] ${!metadataOpen ? 'mx-auto' : ''}`}>
              <div className="relative">
                {/* Study Info & Page Info */}
                <div className="flex justify-between items-end w-full mb-[12px]">
                  <div className="t-footnote text-text-secondary whitespace-pre-wrap">AstraZeneca<br/>Study number D9802C00001 Clarity Gastric 01 - Dry Run 1, Dummy Treatment, &lt;&lt;Data cut-off ddmmyyyy&gt;&gt;</div>
                  <div className="t-footnote text-text-secondary text-right">Page 266 of 280</div>
                </div>

                {/* Title header */}
                <div className="min-w-max flex flex-col items-center justify-center pb-[12px] gap-[4px]">
                  <h1 className="t-table text-text-primary text-center tracking-[-0.01em]">
                    Appendix 16.2.12
                  </h1>
                  <h2 className="t-footnote text-text-secondary text-center font-normal">
                    Tumour assessment details by blinded independent central review (ITT analysis set)
                  </h2>
                  <h2 className="t-footnote text-text-secondary text-center font-normal">
                    Subject identifier: &lt;&lt;Exxxxxxxx&gt;&gt;
                  </h2>
                </div>

                {/* Subheader */}
                <div className="w-full text-left t-footnote mb-[8px] text-text-secondary flex flex-col gap-[2px]">
                  <p className="m-0 leading-[16px]">Page by: USUBJID (Subject identifier: &lt;&lt;Exxxxxxxx&gt;&gt;)</p>
                  <p className="m-0 leading-[16px]">G. Target lesion details</p>
                  <p className="m-0 leading-[16px]">Reviewer: [[Radiologist 1|Radiologist 2]]*, Review identification number: &lt;&lt;xxxxxxx&gt;&gt;</p>
                  <p className="m-0 leading-[16px]">Planned treatment group: &lt;&lt;AZD1 (low dose)&gt;&gt;, Duration of actual exposure (months) [a]: &lt;&lt;xx&gt;&gt;, Death study day [b]: &lt;&lt;xx&gt;&gt;</p>
                </div>
                <div ref={tableContainerRef} className="relative inline-block min-w-max">
                  <table className="table-fixed border-separate border-spacing-0 font-['Inter',sans-serif] text-text-primary border-t-2 border-text-primary" style={{ width: `${totalListingWidth}px` }}>
                    <colgroup>
                      {listingColumns.map((col) => (
                        <col key={col.key} style={{ width: `${col.widthPx}px`, minWidth: `${col.widthPx}px` }} />
                      ))}
                    </colgroup>
                    <thead>
                      <tr>
                        {listingColumns.map((column, columnIndex) => {
                          const frozen = isColumnFrozen(columnIndex);
                          const frozenBoundary = frozenUntilIndex === columnIndex;
                          const shadows: string[] = [];
                          if (frozenBoundary) shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                          const cellStyle: React.CSSProperties = {};
                          if (frozen) { cellStyle.left = `${getFrozenLeft(columnIndex)}px`; cellStyle.zIndex = 22; cellStyle.backgroundColor = 'white'; }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');
                          const meta = LISTING_COLUMN_METADATA[column.key];
                          const isHovered = hoveredColumnKey === column.key && hoveredFreezeColumn === null;
                          const sections = isHovered && meta ? buildListingColumnTooltipSections(meta) : [];

                          return (
                            <th
                              key={column.key}
                              ref={(node) => { thRefs.current[columnIndex] = node; }}
                              style={cellStyle}
                              className={`group ${frozen ? 'sticky' : 'relative'} ${column.width > 0 ? '' : ''} border-r border-b-2 border-text-primary border-r-border-default last:border-r-0 px-[8px] py-[3px] text-left align-top t-small-medium font-medium whitespace-normal break-words select-none pointer-events-auto transition-[border-color,box-shadow,background-color,outline-color] duration-[180ms] relative z-10 ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}
                            >
                              {/* Hover tooltip for Add Freeze (with safety zone bridge) */}
                              {hoveredFreezeColumn === columnIndex && frozenUntilIndex === null && columnIndex < firstPageBreakIndex && hoveredGap === null && !pageSepActive && (
                                <div
                                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full z-[60] pb-[8px] pt-[4px] cursor-pointer active:scale-[0.96] transition-transform pointer-events-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (freezeCloseTimerRef.current) clearTimeout(freezeCloseTimerRef.current);
                                    setFrozenUntilIndex(columnIndex);
                                    setHoveredFreezeColumn(null);
                                  }}
                                  onMouseEnter={() => handleFreezeTriggerEnter(columnIndex)}
                                  onMouseLeave={handleFreezeTriggerLeave}
                                >
                                  <div className="flex items-center gap-[4px] bg-[#3F4444] text-[#EBEFEE] rounded-[4px] pl-[4px] pr-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                                    <FreezeIcon color="white" />
                                    <span className="font-['PingFang_SC',sans-serif] font-normal text-[12px] leading-[20px]">Repeat Columns</span>
                                  </div>
                                </div>
                              )}

                              {/* Top Area: Column Header Label (Hover triggers Freeze tooltip with Safety zone) */}
                              <div 
                                className="w-full"
                                onMouseEnter={() => handleFreezeTriggerEnter(columnIndex)}
                                onMouseLeave={handleFreezeTriggerLeave}
                              >
                                <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onBlockClick(); }} style={{ fontWeight: 500, fontSize: '12px', lineHeight: '18px' }} className="w-full text-left font-medium text-[12px] leading-[18px] text-text-primary whitespace-pre-wrap break-words rounded-[3px] transition-colors duration-[180ms] hover:bg-black/[0.03] outline-none focus:outline-none" aria-label={`Open ${column.label} metadata`}>{column.label}</button>
                              </div>

                              {/* Divider between Column Header and AI Generated Row */}
                              <div className="border-t border-graphite-10 -mx-[8px] my-[3px]" />

                              {/* Bottom Area: AI Variable Mapping (Hover triggers Metadata Tooltip) */}
                              <div
                                ref={(node) => { aiElementRefs.current[columnIndex] = node; }}
                                className="w-full cursor-pointer rounded-[2px] transition-colors hover:bg-black/[0.04] py-[1px]"
                                onMouseEnter={() => setHoveredColumnKey(column.key)}
                                onMouseLeave={() => setHoveredColumnKey(null)}
                                onClick={(event) => { event.preventDefault(); event.stopPropagation(); onBlockClick(); }}
                              >
                                {meta ? (
                                  <div className="flex items-center gap-[4px] t-footnote text-text-secondary whitespace-normal break-words leading-[14px]">
                                    <LocalIcon src={toolCallIconUrl} className="w-[12px] h-[12px] shrink-0" color="var(--color-brand-1)" />
                                    <span className="truncate">{meta.dataset}.{meta.variable}</span>
                                    {meta.additionalVariables && meta.additionalVariables.length > 0 && (
                                      <span className="inline-flex items-center justify-center px-[3px] py-0 h-[14px] rounded-[2px] bg-graphite-15 text-text-secondary text-[10px] font-medium shrink-0">
                                        +{meta.additionalVariables.length}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="h-[14px]" />
                                )}
                              </div>

                              {sections.length > 0 && (
                                <BlockMetadataHover sections={sections} anchorRef={{ current: aiElementRefs.current[columnIndex] || thRefs.current[columnIndex] }} scrollContainerRef={listingScrollContainerRef} />
                              )}
                              
                              {frozenBoundary && (
                                <>
                                  {/* Pill label — positioned at the top right of the th */}
                                  <div
                                    className="absolute pointer-events-auto"
                                    style={{
                                      right: '0px',
                                      top: '-4px',
                                      transform: 'translateX(50%) translateY(-100%)',
                                      zIndex: 40,
                                    }}
                                  >
                                    <div
                                      className="flex items-center gap-[4px] font-['PingFang_SC',sans-serif] font-normal text-[12px] leading-[20px] whitespace-nowrap rounded-[3px]"
                                      style={{
                                        background: '#F4E8EE',
                                        color: "var(--color-brand-1)",
                                        padding: '2px 2px 2px 6px',
                                        border: '1px solid transparent',
                                      }}
                                    >
                                      <span>{`Repeat C1-C${columnIndex + 1}`}</span>
                                      <button
                                        type="button"
                                        className="flex items-center justify-center rounded-[4px] hover:bg-black/10 transition-colors active:scale-[0.96] shrink-0"
                                        style={{ width: '20px', height: '20px' }}
                                        onClick={(e) => { e.stopPropagation(); setFrozenUntilIndex(null); }}
                                        aria-label="Unfreeze"
                                      >
                                        <LocalIcon src={closeIconUrl} className="w-[12px] h-[12px]" color="var(--color-brand-1)" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Drag hit area — positioned at the right edge of the th */}
                                  <div
                                    className="absolute top-0 bottom-0 pointer-events-auto"
                                    style={{
                                      right: '-6px',
                                      width: '12px',
                                      cursor: isScrolled ? 'not-allowed' : 'col-resize',
                                      zIndex: 32,
                                    }}
                                    onMouseDown={handleFreezeDragStart}
                                  />
                                </>
                              )}
                            </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {listingData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="group hover:bg-az-secondary cursor-pointer h-[18px]" style={{ height: '18px' }}>
                        {listingColumns.map((column, columnIndex) => {
                          const frozen = isColumnFrozen(columnIndex);
                          const frozenBoundary = frozenUntilIndex === columnIndex;
                          const shadows: string[] = [];
                          if (frozenBoundary) shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                          const cellStyle: React.CSSProperties = {};
                          if (frozen) { cellStyle.left = `${getFrozenLeft(columnIndex)}px`; cellStyle.zIndex = 20; cellStyle.backgroundColor = 'white'; }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');
                          return (
                            <td key={`${rowIndex}-${column.key}`} style={cellStyle} className={`border-r border-b-0 group-last:border-b-2 group-last:border-b-text-primary group-last:relative group-last:z-10 border-border-default last:border-r-0 px-[6px] py-[1px] align-middle t-footnote text-[10px] leading-[14px] font-normal whitespace-pre-wrap break-words transition-[border-color,box-shadow,background-color] duration-[180ms] ${frozen ? 'sticky' : ''} ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}>
                              <div className="w-full overflow-hidden">
                                {(row as Record<string, string>)[column.key]}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                  </table>

                  {/* Freeze Column Shaded Zone */}
                  {frozenUntilIndex !== null && (
                    <div
                       className="absolute bottom-0 pointer-events-none"
                       style={{
                         top: 0,
                         left: 0,
                         width: `${gapXPositions[frozenUntilIndex] || getGapX(frozenUntilIndex)}px`,
                         backgroundColor: 'rgba(216, 207, 221, 0.08)',
                         zIndex: 5,
                       }}
                     />
                   )}



                  {/* Freeze Column Divider Ghost Line */}
                  {freezeDragOriginX !== null && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${freezeDragOriginX}px`,
                        top: 0,
                        bottom: '2px',
                        width: '0px',
                        borderLeft: '2px solid rgba(131, 0, 81, 0.4)',
                        zIndex: 28,
                      }}
                    />
                  )}

                   {/* Page break insertion preview (while hovering a gap) */}
                  {hoveredGap !== null && !pageBreakColumns.includes(hoveredGap) && draggingBreak === null && draggingFreeze === null && (
                    <>
                      <div
                        className="absolute bottom-0 pointer-events-none"
                        style={{ left: `${(gapXPositions[hoveredGap] || getGapX(hoveredGap)) - 1}px`, top: 0, width: '2px', borderLeft: '2px dashed rgba(240,171,0,0.65)', zIndex: 35 }}
                      />
                      <div
                        className="absolute z-[60] cursor-pointer pointer-events-auto pb-[6px] active:scale-[0.96] transition-transform"
                        style={{ left: `${gapXPositions[hoveredGap] || getGapX(hoveredGap)}px`, top: '0', transform: 'translateX(-50%) translateY(-100%)' }}
                        onMouseEnter={() => { if (draggingBreak === null && draggingFreeze === null) setHoveredGap(hoveredGap); }}
                        onMouseLeave={() => setHoveredGap(null)}
                        onClick={() => { addPageBreak(hoveredGap); setHoveredGap(null); }}
                      >
                        <div className="flex items-center gap-[4px] bg-[#3F4444] text-[#EBEFEE] rounded-[4px] pl-[4px] pr-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                          <LocalIcon src={addLineIconUrl} className="w-[14px] h-[14px]" color="white" />
                          <span className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px]">Add page break</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Full-height interactive gap hit zones for adding page breaks */}
                  {listingColumns.map((_, columnIndex) => {
                    if (columnIndex >= listingColumns.length - 1 || !isGapInteractive(columnIndex) || pageBreakColumns.includes(columnIndex)) {
                      return null;
                    }
                    const gapX = gapXPositions[columnIndex] || getGapX(columnIndex);
                    return (
                      <div
                        key={`gap-hit-${columnIndex}`}
                        className="absolute z-30 pointer-events-auto"
                        style={{
                          left: `${gapX - 10}px`,
                          top: 0,
                          bottom: '2px',
                          width: '20px',
                          cursor: 'col-resize',
                        }}
                        onMouseEnter={() => { if (draggingBreak === null && draggingFreeze === null) setHoveredGap(columnIndex); }}
                        onMouseLeave={() => setHoveredGap(null)}
                      />
                    );
                  })}

                  {/* Permanent page break dividers */}
                  {[...pageBreakColumns].sort((a, b) => a - b).map((colIdx, i) => {
                    const measuredX = gapXPositions[colIdx] || getGapX(colIdx);
                    const isDragging = draggingBreak?.colIdx === colIdx;
                    const dragGapX = isDragging
                      ? (gapXPositions[draggingBreak!.currentGap] || getGapX(draggingBreak!.currentGap))
                      : measuredX;
                    return (
                      <ColumnDivider
                        key={colIdx}
                        gapX={measuredX}
                        label={`P${i + 1}`}
                        isDragging={isDragging}
                        dragGapX={dragGapX}
                        onRemove={() => setPageBreakColumns(prev => prev.filter(c => c !== colIdx))}
                        onDragStart={handlePageBreakDragStart(colIdx)}
                      />
                    );
                  })}
                </div>
                {/* Footnotes */}
                <div className="mt-[16px] flex flex-col gap-[4px] w-full text-left">
                  {listingFootnotes.map((fn, idx) => (
                    <p key={idx} className="t-footnote text-text-secondary whitespace-pre-wrap m-0">
                      {fn}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </ZoomContainer>
        </div>

        {metadataOpen && (
          <>
            <WorkspaceDivider onDrag={handleMetadataDividerDrag} />
            <div className="shrink-0 h-full p-[4px] relative z-20" style={{ width: `${metadataWidth}px` }}>
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-elevation-overlay">
                <MetadataPanel
                  onClose={onCloseMetadata}
                  isLocked={isLocked}
                  docType="listing"
                  frozenUntilIndex={frozenUntilIndex}
                  pageSepActive={pageSepActive}
                  pageColumnCounts={pageColumnCounts}
                  pageBreakColumns={pageBreakColumns}
                  columnCount={listingColumns.length}
                  repeatColumnBaseline={repeatColumnBaseline}
                  onRepeatColumnBaselineChange={setRepeatColumnBaseline}
                  pageBreakColumnBaseline={pageBreakColumnBaseline}
                  onPageBreakColumnBaselineChange={setPageBreakColumnBaseline}
                  idpageBaseline={idpageBaseline}
                  idlistBaseline={idlistBaseline}
                  onIdpageBaselineChange={onIdpageBaselineChange}
                  onAddChangesToChat={(text) => {
                    onOpenAICopilot?.(text);
                  }}
                  onMetaDiffChange={onMetaDiffChange}
                  onRequestUpdateCode={onRequestUpdateCode}
                  onMetaCancel={onMetaCancel}
                  baselineAdvanceTrigger={baselineAdvanceTrigger}
                  metaUpdateActive={metaUpdateActive}
                  metaUpdateProcessing={metaUpdateProcessing}
                  submittedDiffItems={submittedDiffItems}
                  onReviewItemsChange={onReviewItemsChange}
                  onQuoteField={onQuoteField}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ==================== Shell Preview Data ====================

interface ShellTableData {
  tableTitle: string;
  tableNumber: string;
  population: string;
  studyInfo?: string;
  pageInfo?: string;
  subHeader?: string[];
  footnotes?: string[];
  columnGroups: { name: string; span: number }[];
  columns: string[];
  rows: { category: string; indent?: number; values: string[]; isHeader?: boolean }[];
}

const shellTableData: Record<string, ShellTableData> = {
  'Figure 15.1.1': {
    tableNumber: 'Figure 15.1.1',
    tableTitle: 'Kaplan-Meier Plot of Progression-Free Survival (PFS) with Subgroup Analysis',
    studyInfo: 'AstraZeneca Page 1 of 1\nStudy number D9802C00001 Clarity Gastric 01 - Double-Blind, Randomized Phase III Study, <<Data cut-off 15OCT2025>>',
    pageInfo: '',
    population: '(Safety Analysis Set / Intent-to-Treat Population)',
    subHeader: [
      'Treatment Comparison: AZD999 1 mg/kg vs. Placebo (Stratification Factors: ECOG PS, Prior Systemic Lines)',
    ],
    footnotes: [
      '[a] ITT Population: All randomized subjects. Safety Analysis Set includes all subjects who received at least one dose of study medication.',
      '[b] Kaplan-Meier product-limit estimates are used for PFS curves. Two-sided 95% confidence intervals are calculated using the log-log transformation method.',
      '[c] Cross marks (+) indicate censored observations (e.g., ongoing progression-free follow-up or administrative data cut-off).',
      '[d] Unstratified Hazard Ratio (HR) and 95% Wald confidence intervals for subgroups are estimated using Cox proportional hazards regression models.',
      '[e] P for interaction (P-int) is obtained from the likelihood ratio test of the treatment-by-subgroup interaction term.',
      'Source: eTMF Data Snapshot <<15OCT2025>>. ADaM datasets: adam.adtte, adam.adsl.',
      'Program: /study/D9802C00001/csr/prod/figures/f_kmplot_subgroup.sas',
      'Output: /study/D9802C00001/csr/prod/output/f_15_1_1.rtf',
      'Generated on: 15OCT2025 14:32  |  AZ Global Standard for Statistical Programming v3.2 (SAS® 9.4).'
    ],
    columnGroups: [],
    columns: [],
    rows: []
  },
  'Table 14.1.6.1': {
    tableNumber: 'Table 14.1.6.1',
    tableTitle: 'Baseline characteristics (ITT analysis set)',
    studyInfo: 'AstraZeneca\nStudy number D1234C00001 <<Study name>> - <<Deliverable if not final>>, <<Dummy Treatment>>, <<Data cut-off ddmmmyyyy>>',
    pageInfo: 'Page x of y',
    population: '',
    subHeader: [
      'Page by: TRTA (Planned Treatment Group: <<AZD999 1 mg/kg>>)',
    ],
    columnGroups: [
      { name: 'AZD999\n1 mg/kg\nN=xxx', span: 1 },
      { name: 'AZD999\n2 mg/kg\nN=xxx', span: 1 },
      { name: 'AZD999\nTotal\nN=xxx', span: 1 },
      { name: 'Investigator choice of therapy\nN=xxx', span: 1 },
      { name: 'Total\nN=xxx', span: 1 },
    ],
    columns: ['', '', '', '', ''],
    rows: [
      { category: 'Height (cm)', values: ['', '', '', '', ''], isHeader: true },
      { category: 'n', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'Mean', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'SD', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Min', indent: 1, values: ['x', 'x', 'x', 'x', 'x'] },
      { category: 'Median', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Max', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'Weight (kg)', values: ['', '', '', '', ''], isHeader: true },
      { category: 'n', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'Mean', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'SD', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Min', indent: 1, values: ['x', 'x', 'x', 'x', 'x'] },
      { category: 'Median', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Max', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'Weight group (kg)', values: ['', '', '', '', ''], isHeader: true },
      { category: '<50', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=50 - <70', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=70 - <90', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=90', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Missing', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'BMI (kg/m2)', values: ['', '', '', '', ''], isHeader: true },
      { category: 'n', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'Mean', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'SD', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Min', indent: 1, values: ['x', 'x', 'x', 'x', 'x'] },
      { category: 'Median', indent: 1, values: ['xx.x', 'xx.x', 'xx.x', 'xx.x', 'xx.x'] },
      { category: 'Max', indent: 1, values: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx'] },
      { category: 'BMI Group (kg/m2)', values: ['', '', '', '', ''], isHeader: true },
      { category: '<18.5', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=18.5 - <25.0', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=25 - <30', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: '>=30', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Missing', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Nicotine use', values: ['', '', '', '', ''], isHeader: true },
      { category: 'Never', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Former', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Current', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Missing', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Alcohol use', values: ['', '', '', '', ''], isHeader: true },
      { category: 'Never', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Former', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Current', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Missing', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'ECOG performance status', values: ['', '', '', '', ''], isHeader: true },
      { category: '(0) Fully active', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '(1) Restricted in physically strenuous activity', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '(2) Ambulatory and capable of all selfcare', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '(3) Capable of only limited selfcare', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '(4) Completely disabled', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '(5) Death', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Missing', indent: 1, values: ['', '', '', '', ''], isHeader: true },
      { category: 'n (%)', indent: 2, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
    ],
    footnotes: [
      'Refer to the statistical analysis plan for full ECOG performance status score descriptions.',
      'BMI Body mass index; ECOG Eastern Cooperative Oncology Group; m2 Square meter; n Number of subjects in analysis for a continuous variable and number of subjects per category for a categorical variable; N Number of subjects per treatment group; SD Standard deviation.',
      '<<output program path>> <<output file name>> <<date/time>>'
    ]
  },

  'Listing 16.2.1': {
    tableNumber: 'Listing 16.2.1',
    tableTitle: 'Individual Subject Data - Vital Signs',
    studyInfo: 'AstraZeneca\nStudy number D9802C00001 Clarity Gastric 01 - Dry Run 1, Dummy Treatment, <<Data cut-off ddmmmyyyy>>',
    pageInfo: 'Page 1 of 10',
    population: 'Safety Analysis Set',
    subHeader: [
      'Page by: USUBJID (Subject ID: <<101-001>>)',
      'Site: <<101>>, Planned treatment group: <<AZD0780 20mg>>',
    ],
    columnGroups: [{ name: 'Subject-Level Data', span: 9 }],
    columns: ['Subject ID', 'Site', 'Treatment', 'Visit', 'Date', 'SBP (mmHg)', 'DBP (mmHg)', 'HR (bpm)', 'Temp (°C)'],
    rows: [
      { category: '101-001', values: ['101', 'AZD0780 20mg', 'Screening', '2026-01-15', '142', '88', '76', '36.5'] },
      { category: '101-001', values: ['101', 'AZD0780 20mg', 'Baseline', '2026-02-01', '138', '86', '74', '36.6'] },
      { category: '101-001', values: ['101', 'AZD0780 20mg', 'Week 4', '2026-03-01', '130', '82', '72', '36.4'] },
      { category: '101-001', values: ['101', 'AZD0780 20mg', 'Week 8', '2026-03-29', '126', '80', '70', '36.5'] },
      { category: '101-001', values: ['101', 'AZD0780 20mg', 'Week 12', '2026-04-26', '124', '78', '68', '36.4'] },
      { category: '101-002', values: ['101', 'Placebo', 'Screening', '2026-01-18', '135', '85', '78', '36.7'] },
      { category: '101-002', values: ['101', 'Placebo', 'Baseline', '2026-02-04', '132', '84', '76', '36.6'] },
      { category: '101-002', values: ['101', 'Placebo', 'Week 4', '2026-03-04', '130', '82', '74', '36.5'] },
      { category: '101-002', values: ['101', 'Placebo', 'Week 8', '2026-04-01', '131', '83', '75', '36.6'] },
      { category: '102-003', values: ['102', 'AZD0780 10mg', 'Screening', '2026-01-20', '148', '92', '80', '36.8'] },
    ],
    footnotes: [
      'Vital signs are evaluated at baseline and scheduled visits.',
      '<<output program path>> <<output file name>> <<date/time>>'
    ]
  },

};

const errorStructuredLog = {
  summary: { error: 3, warning: 1, note: 24 },
  entries: [
    { level: 'ERROR' as const, code: '388-185', description: 'Expecting an arithmetic operator.', logLine: 22, programLine: 84, affectedCode: '! ;' },
    { level: 'ERROR' as const, code: '76-322', description: 'Syntax error, statement will be ignored.', logLine: 26, programLine: 88, affectedCode: 'proc means data=;' },
    { level: 'ERROR' as const, code: '180-322', description: 'Statement is not valid or it is used out of proper order.', logLine: 42, programLine: 132, affectedCode: 'run cancel;' },
    { level: 'WARNING' as const, code: '1001', description: 'Variable PARAM not found in WORK.ATLAS_UPCIO.', logLine: 18, programLine: 34, affectedCode: 'PARAM' },
    { level: 'NOTE' as const, code: '', description: 'SAS (r) Proprietary Software 9.4 TS1M6', logLine: 1, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Copyright (c) 2002-2012 by SAS Institute Inc., Cary, NC, USA.', logLine: 2, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE SQL used (Total process time): real time 0.02 seconds', logLine: 8, programLine: 3, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Table WORK.ATLAS_UPCIO created, with 1024 rows and 8 columns.', logLine: 11, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE SORT used (Total process time): real time 0.04 seconds', logLine: 13, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'DATA statement used (Total process time): real time 0.03 seconds', logLine: 15, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROC MEANS used — 512 observations read.', logLine: 20, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PARMACRO= CHEMISTRY matched 48 observations.', logLine: 30, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE FREQ used (Total process time): real time 0.01 seconds', logLine: 32, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Dataset WORK.KM_DATA has 256 observations and 12 variables.', logLine: 34, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE LIFETEST used (Total process time): real time 0.12 seconds', logLine: 36, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE TEMPLATE used (Total process time): real time 0.01 seconds', logLine: 38, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Output added to ODS LISTING destination.', logLine: 39, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'RTF file written: /output/figure_15_1_1.rtf (245 KB)', logLine: 40, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Macro variable TRTAN resolved to 2.', logLine: 44, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Macro GENERATE_FIGURE completed with return code 0.', logLine: 45, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'DATA step merge: WORK.ADTTE + WORK.ADSL — 512 obs merged.', logLine: 46, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'Variable AVAL formatted with BEST12. width.', logLine: 47, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'ODS GRAPHICS ON — default dimensions 640x480.', logLine: 48, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROC SGRENDER template applied: Kaplan_Meier_Plot.', logLine: 49, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'PROCEDURE SGRENDER used (Total process time): real time 0.08 seconds', logLine: 50, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'At-risk table generated: 6 time points, 2 groups.', logLine: 51, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'SAS Institute Inc., SAS Campus Drive, Cary, NC USA 27513-2414', logLine: 52, programLine: 0, affectedCode: '' },
    { level: 'NOTE' as const, code: '', description: 'QUIT statement used.', logLine: 53, programLine: 0, affectedCode: '' },
  ],
  rawLogLines: [
    { lineNum: 1, text: 'NOTE: SAS (r) Proprietary Software 9.4  TS1M6', level: 'NOTE' as const },
    { lineNum: 2, text: 'NOTE: Copyright (c) 2002-2012 by SAS Institute Inc., Cary, NC, USA.', level: 'NOTE' as const },
    { lineNum: 3, text: '      Licensed to ATLAS BIOANALYTICS, Site 0123456789.' },
    { lineNum: 4, text: 'NOTE: ---------------------------------------------------------', level: 'NOTE' as const },
    { lineNum: 5, text: '1    %include "/programs/fig_km_15_1_1.sas";' },
    { lineNum: 6, text: '2          cluster_1, hba1c1( RLG_A,RLG_B,RLG_N,RLG_C ) = /+ m/' },
    { lineNum: 7, text: '3    proc sql;' },
    { lineNum: 8, text: 'NOTE: PROCEDURE SQL used (Total process time):', level: 'NOTE' as const },
    { lineNum: 9, text: '      real time           0.02 seconds' },
    { lineNum: 10, text: '      cpu time            0.01 seconds' },
    { lineNum: 11, text: 'NOTE: Table WORK.ATLAS_UPCIO created, with 1024 rows and 8 columns.', level: 'NOTE' as const },
    { lineNum: 12, text: '4    proc sort data=atlas_upcio; by paramcd visitnum; run;' },
    { lineNum: 13, text: 'NOTE: PROCEDURE SORT used (Total process time):', level: 'NOTE' as const },
    { lineNum: 14, text: '      real time           0.04 seconds' },
    { lineNum: 15, text: 'NOTE: DATA statement used (Total process time):', level: 'NOTE' as const },
    { lineNum: 16, text: '      real time           0.03 seconds' },
    { lineNum: 17, text: '      cpu time            0.02 seconds' },
    { lineNum: 18, text: 'WARNING: Variable PARAM not found in WORK.ATLAS_UPCIO.', level: 'WARNING' as const },
    { lineNum: 19, text: '5    data km_prep; set adtte; where paramcd="TTDE" and saffl="Y"; run;' },
    { lineNum: 20, text: 'NOTE: PROC MEANS used — 512 observations read.', level: 'NOTE' as const },
    { lineNum: 21, text: '      real time           0.06 seconds' },
    { lineNum: 22, text: 'ERROR 388-185: Expecting an arithmetic operator.', level: 'ERROR' as const },
    { lineNum: 23, text: '                                               !' },
    { lineNum: 24, text: '                                               ;' },
    { lineNum: 25, text: '6    %m_u_figure( inds=adtte, type=KM, group=trtan, time=aval, censor=cnsr );' },
    { lineNum: 26, text: 'ERROR 76-322: Syntax error, statement will be ignored.', level: 'ERROR' as const },
    { lineNum: 27, text: '      proc means data=;' },
    { lineNum: 28, text: '                     ^' },
    { lineNum: 29, text: '7    proc lifetest data=km_prep method=km plots=survival(atrisk);' },
    { lineNum: 30, text: 'NOTE: PARMACRO= CHEMISTRY matched 48 observations.', level: 'NOTE' as const },
    { lineNum: 31, text: '      time aval * cnsr(1);' },
    { lineNum: 32, text: 'NOTE: PROCEDURE FREQ used (Total process time): real time 0.01 seconds', level: 'NOTE' as const },
    { lineNum: 33, text: '      strata trtan;' },
    { lineNum: 34, text: 'NOTE: Dataset WORK.KM_DATA has 256 observations and 12 variables.', level: 'NOTE' as const },
    { lineNum: 35, text: '      run;' },
    { lineNum: 36, text: 'NOTE: PROCEDURE LIFETEST used (Total process time): real time 0.12 seconds', level: 'NOTE' as const },
    { lineNum: 37, text: '8    ods rtf file="/output/figure_15_1_1.rtf";' },
    { lineNum: 38, text: 'NOTE: PROCEDURE TEMPLATE used (Total process time): real time 0.01 seconds', level: 'NOTE' as const },
    { lineNum: 39, text: 'NOTE: Output added to ODS LISTING destination.', level: 'NOTE' as const },
    { lineNum: 40, text: 'NOTE: RTF file written: /output/figure_15_1_1.rtf (245 KB)', level: 'NOTE' as const },
    { lineNum: 41, text: '9    proc sgrender data=km_data template=Kaplan_Meier_Plot;' },
    { lineNum: 42, text: 'ERROR 180-322: Statement is not valid or it is used out of proper order.', level: 'ERROR' as const },
    { lineNum: 43, text: '      run cancel;' },
    { lineNum: 44, text: 'NOTE: Macro variable TRTAN resolved to 2.', level: 'NOTE' as const },
    { lineNum: 45, text: 'NOTE: Macro GENERATE_FIGURE completed with return code 0.', level: 'NOTE' as const },
    { lineNum: 46, text: 'NOTE: DATA step merge: WORK.ADTTE + WORK.ADSL — 512 obs merged.', level: 'NOTE' as const },
    { lineNum: 47, text: 'NOTE: Variable AVAL formatted with BEST12. width.', level: 'NOTE' as const },
    { lineNum: 48, text: 'NOTE: ODS GRAPHICS ON — default dimensions 640x480.', level: 'NOTE' as const },
    { lineNum: 49, text: 'NOTE: PROC SGRENDER template applied: Kaplan_Meier_Plot.', level: 'NOTE' as const },
    { lineNum: 50, text: 'NOTE: PROCEDURE SGRENDER used (Total process time): real time 0.08 seconds', level: 'NOTE' as const },
    { lineNum: 51, text: 'NOTE: At-risk table generated: 6 time points, 2 groups.', level: 'NOTE' as const },
    { lineNum: 52, text: 'NOTE: SAS Institute Inc., SAS Campus Drive, Cary, NC USA 27513-2414', level: 'NOTE' as const },
    { lineNum: 53, text: 'NOTE: QUIT statement used.', level: 'NOTE' as const },
  ],
};

const successStructuredLog = {
  summary: { error: 0, warning: 1, note: 24 },
  entries: errorStructuredLog.entries.filter(e => e.level !== 'ERROR'),
  rawLogLines: errorStructuredLog.rawLogLines.filter(l => l.level !== 'ERROR'),
};

type ShellTableRow = ShellTableData['rows'][number];

interface ShellTableBlock {
  blockId: string;
  startRowIndex: number;
  rowIndexes: number[];
  parentLabel: string;
}

/**
 * Blocks are implicit in ShellTableData.rows: an indent-0 row starts a block and every
 * following indented row belongs to it. Rows appearing before the first indent-0 row are
 * collected into an orphan block so malformed data still renders.
 */
function deriveTableBlocks(rows: ShellTableRow[]): {
  blocks: ShellTableBlock[];
  blockIdByRow: (string | null)[];
} {
  const blocks: ShellTableBlock[] = [];
  const blockIdByRow: (string | null)[] = new Array(rows.length).fill(null);
  const slug = (text: string) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'row';

  let current: ShellTableBlock | null = null;
  rows.forEach((row, rowIndex) => {
    const isBlockStart = !row.indent;
    if (isBlockStart || current === null) {
      current = {
        blockId: isBlockStart ? `block-${rowIndex}-${slug(row.category)}` : 'block-orphan',
        startRowIndex: rowIndex,
        rowIndexes: [],
        parentLabel: isBlockStart ? row.category : '',
      };
      blocks.push(current);
    }
    current.rowIndexes.push(rowIndex);
    blockIdByRow[rowIndex] = current.blockId;
  });

  return { blocks, blockIdByRow };
}

interface TableBlockMetadata {
  primaryVariable?: string;
  variableMappings?: string[];
  population?: string;
  displayRule?: string;
}

/** Mock only — keyed by the block's parent label. Swap this lookup to wire real metadata later. */
const TABLE_BLOCK_METADATA: Record<string, TableBlockMetadata> = {
  'Height (cm)': {
    primaryVariable: 'adsl.HEIGHTBL',
    variableMappings: ['adsl.HEIGHTBL'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n, Mean (SD), Min, Median, Max',
  },
  'Weight (kg)': {
    primaryVariable: 'adsl.WEIGHTBL',
    variableMappings: ['adsl.WEIGHTBL', 'adsl.WGTBLU'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n, Mean (SD), Min, Median, Max',
  },
  'Weight group (kg)': {
    primaryVariable: 'adsl.WGTGR1',
    variableMappings: ['adsl.WGTGR1', 'adsl.WEIGHTBL'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n (%) by weight category, denominator is the number of subjects in the ITT analysis set within each treatment arm',
  },
  'BMI (kg/m2)': {
    primaryVariable: 'adsl.BMIBL',
    variableMappings: ['adsl.BMIBL', 'adsl.HEIGHTBL', 'adsl.WEIGHTBL'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n, Mean (SD), Min, Median, Max',
  },
  // Deliberately >4 mappings to exercise the "+N more" rule.
  'BMI Group (kg/m2)': {
    primaryVariable: 'adsl.BMIGR1',
    variableMappings: ['adsl.BMIGR1', 'adsl.BMIBL', 'adsl.HEIGHTBL', 'adsl.WEIGHTBL', 'adsl.BMIBLU', 'adsl.TRT01AN'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n (%) by WHO BMI category',
  },
  'Nicotine use': {
    primaryVariable: 'adsl.SMOKSTAT',
    variableMappings: ['adsl.SMOKSTAT'],
    population: 'ITT Analysis Set',
    displayRule: 'rule: n (%), subjects with missing status are reported in the Missing row',
  },
  'Alcohol use': {
    primaryVariable: 'adsl.ALCSTAT',
    variableMappings: ['adsl.ALCSTAT'],
    population: 'ITT Analysis Set',
    // No displayRule variants needed here; population intentionally present.
  },
  // Deliberately long rule to exercise the 2-line clamp.
  'ECOG performance status': {
    primaryVariable: 'adsl.ECOGBL',
    variableMappings: ['adsl.ECOGBL', 'adsl.ECOGBLN'],
    population: 'ITT Analysis Set — All Randomized Subjects Who Received At Least One Dose of Study Drug',
    displayRule: 'rule: n (%) by ECOG performance status score at baseline, categories are presented in ascending score order with the Missing category reported last, percentages based on the number of subjects randomised',
  },
};

const TABLE_BLOCK_MAPPING_LIMIT = 4;

function buildBlockTooltipSections(meta: TableBlockMetadata | undefined): TooltipMetadataSection[] {
  if (!meta) return [];
  const sections: TooltipMetadataSection[] = [];

  // P1 — Primary Variable first, then the rest; cap at 4 with the 4th slot becoming "+N more".
  const mappings = meta.variableMappings?.filter(Boolean) ?? [];
  const ordered = meta.primaryVariable
    ? [meta.primaryVariable, ...mappings.filter((v) => v !== meta.primaryVariable)]
    : mappings;
  if (ordered.length > 0) {
    const overflow = ordered.length - TABLE_BLOCK_MAPPING_LIMIT;
    sections.push({
      label: 'Variable Mapping',
      values: overflow > 0 ? ordered.slice(0, TABLE_BLOCK_MAPPING_LIMIT - 1) : ordered,
      more: overflow > 0 ? `+${overflow + 1} more` : undefined,
    });
  }

  // P2 — Population, never compressed.
  if (meta.population) {
    sections.push({ label: 'Population', values: [meta.population] });
  }

  // P3 — Display Rule, clamped to 2 lines.
  if (meta.displayRule) {
    sections.push({ label: 'Display Rule', values: [meta.displayRule], clampLines: 2 });
  }

  return sections;
}

/** One shell table row. Highlights with its whole block and anchors the block's metadata hover. */
function ShellTableRowView({
  row,
  blockId,
  active,
  onHover,
  onClick,
  scrollContainerRef,
}: {
  row: ShellTableRow;
  blockId: string | null;
  active: boolean;
  onHover: (blockId: string | null) => void;
  onClick: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const labelTextRef = useRef<HTMLSpanElement | null>(null);
  const isBlockStart = !row.indent;
  const sections = active && isBlockStart ? buildBlockTooltipSections(TABLE_BLOCK_METADATA[row.category]) : [];
  const cellBg = active ? 'bg-az-secondary' : 'bg-white';
  const isSubgroup = !!row.indent;
  // Parent rows: 10px Medium, 24px tall, 6px padding, visible divider.
  // Subgroup rows: 10px Regular, 18px tall, 1px vertical padding, divider hidden.
  const labelType = isSubgroup ? 't-footnote' : 't-micro';
  const labelColor = isSubgroup ? 'text-text-secondary' : 'text-text-primary';
  const valueType = 't-footnote';
  const cellPadY = isSubgroup ? 'py-[1px]' : 'py-[6px]';
  const rowHeight = isSubgroup ? 18 : 24;
  // Group divider starts at top of Parent row (except first parent row), subgroup rows have no horizontal lines.
  const divider = isSubgroup ? 'border-t-0 border-b-0' : 'border-t border-t-border-default border-b-0 group-first:border-t-0';
  const cellBase = `relative ${cellBg} text-left align-middle ${cellPadY} px-[6px] whitespace-pre-wrap break-words border-r border-r-border-default ${divider} group-last:border-b-2 group-last:border-b-text-primary group-last:z-10 transition-colors duration-[180ms]`;

  return (
    <tr
      data-block-id={blockId ?? undefined}
      className="group cursor-pointer"
      style={{ height: `${rowHeight}px` }}
      onMouseEnter={() => onHover(blockId)}
      onClick={onClick}
    >
      <td
        className={`${labelType} ${labelColor} ${cellBase}`}
        style={{ paddingLeft: row.indent ? `${6 + row.indent * 16}px` : '6px' }}
      >
        {/* Anchor on the text itself, not the padded cell, so the hover sits 2px off the label. */}
        <span ref={labelTextRef} className="inline-block">{row.category}</span>
        {sections.length > 0 && (
          <BlockMetadataHover sections={sections} anchorRef={labelTextRef} scrollContainerRef={scrollContainerRef} />
        )}
      </td>
      {row.values.map((val, vi) => (
        <td
          key={vi}
          className={`${valueType} text-text-primary ${cellBase} last:border-r-0`}
        >
          {val}
        </td>
      ))}
    </tr>
  );
}

function ShellPreview({
  onBlockClick,
  onMetadataClick,
  metadataOpen,
  onMetadataClose,
  metadataWidth,
  onMetadataResize,
  metadataMaxWidth,
  shellPreviewWidth,
  onShellPreviewResize,
  shellPreviewMinWidth,
  shellPreviewMaxWidth,
  isShellFlex,
  selectedItemName = '',
  docType = 'table',
  onJumpToTL,
  showCI = true,
  showCensorMarks = true,
  showMedianLines = true,
  showRiskTable = true,
  onShowCIChange,
  onShowCensorMarksChange,
  onShowMedianLinesChange,
  onShowRiskTableChange,
  associatedTLStatus = 'pending',
  rtfOpen,
  onToggleRtf,
  onMetaDiffChange,
  onRequestUpdateCode,
  baselineAdvanceTrigger,
  addComponentTrigger,
  metaUpdateActive,
  metaUpdateProcessing,
  submittedDiffItems,
  targetFieldId,
  onReviewItemsChange,
  hasUnreadMetadataUpdate,
  figureComponents,
  setFigureComponents,
  isLocked,
  onQuoteField,
  onMetaCancel,
  groupViewOpen = false,
  onGroupViewClick,
  onGroupViewClose,
  groupCodes = [],
  groupViewWidth = 380,
  onGroupViewResize,
}: {
  onMetaCancel?: () => void;
  onQuoteField?: (fieldId: string, label: string, blockName: string) => void;
  onBlockClick: (blockName?: string) => void;
  onMetadataClick: () => void;
  onMetaDiffChange?: (diffItems: MetaDiffItem[]) => void;
  onRequestUpdateCode?: () => void;
  baselineAdvanceTrigger?: number;
  addComponentTrigger?: { name: string; type: string; instructions: string } | null;
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  submittedDiffItems?: MetaDiffItem[];
  targetFieldId?: string;
  onReviewItemsChange?: (items: ReviewItem[]) => void;
  hasUnreadMetadataUpdate?: boolean;
  figureComponents?: MetadataBlock[];
  setFigureComponents?: React.Dispatch<React.SetStateAction<MetadataBlock[]>>;
  isLocked?: boolean;
  metadataOpen: boolean;
  onMetadataClose: () => void;
  metadataWidth: number;
  onMetadataResize: (delta: number) => void;
  metadataMaxWidth: number;
  shellPreviewWidth: number;
  onShellPreviewResize: (newWidth: number) => void;
  shellPreviewMinWidth: number;
  shellPreviewMaxWidth: number;
  isShellFlex: boolean;
  selectedItemName?: string;
  docType?: DocumentType;
  onJumpToTL?: (name: string) => void;
  showCI?: boolean;
  showCensorMarks?: boolean;
  showMedianLines?: boolean;
  showRiskTable?: boolean;
  onShowCIChange?: (v: boolean) => void;
  onShowCensorMarksChange?: (v: boolean) => void;
  onShowMedianLinesChange?: (v: boolean) => void;
  onShowRiskTableChange?: (v: boolean) => void;
  associatedTLStatus?: string;
  rtfOpen?: boolean;
  onToggleRtf?: () => void;
  groupViewOpen?: boolean;
  onGroupViewClick?: () => void;
  onGroupViewClose?: () => void;
  groupCodes?: GroupCodeItem[];
  groupViewWidth?: number;
  onGroupViewResize?: (delta: number) => void;
}) {
  const [logExpanded, setLogExpanded] = useState(false);
  const activeLogData = successStructuredLog;
  const shellData = shellTableData[selectedItemName] || shellTableData['Table 14.1.6.1'];
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [targetBlockName, setTargetBlockName] = useState<string | null>(null);
  const [targetBlockTrigger, setTargetBlockTrigger] = useState(0);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const { blocks: tableBlocks, blockIdByRow } = useMemo(() => deriveTableBlocks(shellData.rows || []), [shellData.rows]);
  const parentLabelByBlockId = useMemo(() => {
    const map: Record<string, string> = {};
    tableBlocks.forEach(b => { map[b.blockId] = b.parentLabel; });
    return map;
  }, [tableBlocks]);

  // A block or row click targets the block/component it belongs to, so the panel can select that block.
  const handleBlockClick = (blockName?: string) => {
    if (blockName) {
      setTargetBlockName(blockName);
      setTargetBlockTrigger(t => t + 1);
    }
    onBlockClick(blockName);
  };
  const handleRowClick = (blockId: string | null) => {
    const name = blockId ? parentLabelByBlockId[blockId] : undefined;
    handleBlockClick(name);
  };
  const metadataMinWidth = 280;
  const [zoomLevel, setZoomLevel] = useState('100');
  const zoomOptions = [
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
    { label: '150%', value: '150' },
    { label: '200%', value: '200' },
  ];
  const zoomScale = Number(zoomLevel) / 100;
  return (
    <div className="flex h-full flex-col min-w-0 overflow-hidden bg-white">
      <PanelHeader
        noBorder
        title={
          <div className="flex items-center gap-[12px]">
            <span className="t-small text-text-primary truncate">{selectedItemName || "Shell preview"}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-[8px]">
            <div className="w-[76px]">
              <Dropdown
                options={zoomOptions}
                value={zoomLevel}
                onChange={setZoomLevel}
                triggerClassName="h-[24px] rounded-[4px] pl-[8px] pr-[4px]"
                customBoxClass="border border-form-border bg-white hover:border-graphite-50 rounded-[4px]"
                customTextStyle={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '20px', color: 'var(--color-text-primary)' }}
              />
            </div>
            <TooltipText label="Open Metadata">
              <button
                onClick={onMetadataClick}
                className={`relative flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
                  metadataOpen ? "bg-az-secondary" : "hover:bg-black/5"
                }`}
                aria-label="Toggle metadata"
              >
                <LocalIcon src={fileInfoIconUrl} className="h-[16px] w-[16px]" color={metadataOpen ? "#830051" : "#888E8E"} />
                {!metadataOpen && hasUnreadMetadataUpdate && (
                  <span className="absolute top-[2px] right-[2px] w-[6px] h-[6px] rounded-full bg-[#E53935] ring-2 ring-white" />
                )}
              </button>
            </TooltipText>
          </div>
        }
      />
      <div className="relative flex min-h-0 flex-1 min-w-0 overflow-hidden bg-white">
        {/* Top compact fade (8px, avoids 12px scrollbar on right) */}
        <div className="pointer-events-none absolute top-0 left-0 right-[12px] h-[8px] bg-gradient-to-b from-white to-transparent z-20" />

        {docType === 'figure' ? (
          <div className="flex-1 min-w-0 h-full flex">
            <div className={`flex-1 min-w-0 h-full overflow-auto ${metadataOpen && !rtfOpen ? 'border-r border-graphite-10' : ''}`}>
              <ZoomContainer scale={zoomScale} className="min-w-max p-[16px]">
              <div className={`w-max bg-white text-text-primary rounded-[4px] p-[20px] ${!rtfOpen && !metadataOpen ? 'mx-auto' : ''}`}>
                <div className="flex flex-col gap-[12px] w-full">
                  {/* Study Info & Page Info */}
                  {(shellData.studyInfo || shellData.pageInfo) && (
                    <div className="flex justify-between items-end w-full">
                      <div className="t-footnote text-text-secondary whitespace-pre-wrap">{shellData.studyInfo}</div>
                      <div className="t-footnote text-text-secondary text-right">{shellData.pageInfo}</div>
                    </div>
                  )}
                  {/* Title header */}
                  <div className="flex flex-col items-center justify-center pb-[12px] bg-white text-text-primary gap-[4px]">
                    <h1 className="t-table text-center tracking-[-0.01em]">
                      {shellData.tableNumber}
                    </h1>
                    {shellData.tableTitle && (
                      <h2 className="t-footnote text-text-secondary text-center font-normal">
                        {shellData.tableTitle}
                      </h2>
                    )}
                    {shellData.population && (
                      <h2 className="t-footnote text-text-secondary text-center font-normal">
                        {shellData.population}
                      </h2>
                    )}
                  </div>
                  {/* Subheader / Left-aligned Header Info (e.g. Page by variable) */}
                  {shellData.subHeader && shellData.subHeader.length > 0 && (
                    <div className="w-full text-left t-footnote mb-[8px] text-text-secondary">
                      {shellData.subHeader.map((line, idx) => (
                        <p key={idx} className="m-0 leading-[16px]">{line}</p>
                      ))}
                    </div>
                  )}
                </div>

                <KMPlot
                  mode="shell"
                  showCI={true}
                  showCensorMarks={true}
                  showMedianLines={true}
                  showRiskTable={true}
                  figureNumber={selectedItemName}
                  onBlockClick={handleBlockClick}
                />

                {/* Footnotes */}
                {shellData.footnotes && shellData.footnotes.length > 0 && (
                  <div className="flex flex-col gap-[4px] w-full text-left mt-[16px]">
                    {shellData.footnotes.map((fn, idx) => (
                      <p key={idx} className="t-footnote text-text-secondary whitespace-pre-wrap m-0">
                        {fn}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </ZoomContainer>
            {rtfOpen && (
              <div className={`flex-1 border-l border-graphite-10 flex flex-col bg-bg-panel overflow-hidden ${metadataOpen ? 'border-r border-graphite-10' : ''}`}>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-[16px] bg-white">
                  <div className="w-full max-w-[90%] mx-auto">
                    <KMPlot
                      mode="runtime"
                      showCI={true}
                      showCensorMarks={true}
                      showMedianLines={true}
                      showRiskTable={true}
                      figureNumber={selectedItemName}
                      onBlockClick={handleBlockClick}
                    />
                  </div>
                </div>
                {/* Log Section - Temporarily hidden per user request. Restore when user says 【显示Log】 or 【恢复Log】 */}
                {false && (
                <div className="flex shrink-0 flex-col border-t border-graphite-10 bg-bg-panel">
                  <div className="flex h-[40px] shrink-0 items-center gap-[4px] pl-[16px] pr-[8px]">
                    <p className="t-small text-text-primary">Log</p>
                    <div className="flex items-center">
                      <TooltipText label={logExpanded ? "Collapse Log" : "Expand Log"}>
                        <button
                          onClick={() => setLogExpanded((v) => !v)}
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                          aria-label={logExpanded ? "Collapse Log" : "Expand Log"}
                        >
                          <LocalIcon src={logExpanded ? contractUpDownIconUrl : expandUpDownIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                        </button>
                      </TooltipText>
                    </div>
                  </div>
                  {logExpanded && (
                    <div className="max-h-[240px] overflow-auto px-[8px] pb-[8px]">
                      {activeLogData.entries.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex w-full items-start gap-[8px] rounded-[4px] px-[8px] py-[4px] text-left text-[12px] leading-[18px] font-mono hover:bg-white/60 cursor-default"
                        >
                          <div className="flex w-[16px] h-[16px] shrink-0 items-center justify-center pt-[1px]">
                            {entry.level === 'ERROR' && (
                              <LocalIcon src={closeCircleIconUrl} className="h-[16px] w-[16px]" color="#C5221F" />
                            )}
                            {entry.level === 'WARNING' && (
                              <LocalIcon src={alertIconUrl} className="h-[16px] w-[16px]" color="#B06000" />
                            )}
                          </div>
                          <span className="shrink-0 min-w-0 flex-1 whitespace-pre-wrap break-words text-text-primary">
                            {entry.code ? `${entry.code}: ` : ''}{entry.description}
                          </span>
                          {entry.level !== 'NOTE' && (
                            <>
                              <span className="shrink-0 text-text-secondary tabular-nums min-w-[60px] truncate text-right" title="Affected Code">{entry.affectedCode}</span>
                              <span className="shrink-0 text-text-secondary tabular-nums min-w-[32px] text-right" title="Log Line">L{entry.logLine}</span>
                              <span className="shrink-0 text-text-secondary tabular-nums min-w-[32px] text-right" title="Program Line">P{entry.programLine}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                )}
              </div>
            )}
            </div>
          </div>
        ) : (
          (() => {
            const totalDataCols = shellData.columnGroups?.reduce((acc, cg) => acc + (cg.span || 1), 0) || 0;
            const actualDataCols = totalDataCols > 0 ? totalDataCols : (shellData.columns ? shellData.columns.length : 0);
            const firstColWidth = 280;
            const dataColWidth = 140;
            const totalTableWidth = firstColWidth + actualDataCols * dataColWidth;

            return (
              <div ref={tableScrollRef} className={`min-h-0 min-w-0 flex-1 overflow-auto ${metadataOpen ? 'border-r border-graphite-10' : ''}`}>
                <ZoomContainer scale={zoomScale} className="min-w-max p-[16px]">
                  <div className={`bg-white text-text-primary rounded-[4px] p-[20px] ${!metadataOpen ? 'mx-auto' : ''}`} style={{ width: `${totalTableWidth + 40}px` }}>
                    {/* Study Info & Page Info */}
                  {(shellData.studyInfo || shellData.pageInfo) && (
                    <div className="flex justify-between items-end w-full mb-[12px]">
                      <div className="t-footnote text-text-secondary whitespace-pre-wrap">{shellData.studyInfo}</div>
                      <div className="t-footnote text-text-secondary text-right">{shellData.pageInfo}</div>
                    </div>
                  )}

                  {/* Title header */}
                  <div className="flex flex-col items-center justify-center pb-[12px] bg-white text-text-primary gap-[4px]">
                    <h1 className="text-[13px] font-medium leading-[16px] text-text-primary text-center tracking-[-0.01em]">
                      {shellData.tableNumber}
                    </h1>
                    {shellData.tableTitle && (
                      <h2 className="t-footnote text-text-secondary text-center font-normal">
                        {shellData.tableTitle}
                      </h2>
                    )}
                    {shellData.population && (
                      <h2 className="t-footnote text-text-secondary text-center font-normal">
                        {shellData.population}
                      </h2>
                    )}
                  </div>

                  {/* Subheader / Left-aligned Header Info (e.g. Page by variable) */}
                  {shellData.subHeader && shellData.subHeader.length > 0 && (
                    <div className="w-full text-left t-footnote mb-[8px] text-text-secondary">
                      {shellData.subHeader.map((line, idx) => (
                        <p key={idx} className="m-0 leading-[16px]">{line}</p>
                      ))}
                    </div>
                  )}

                  {(() => {
                    const hasSubHeader = Boolean(shellData.columns && shellData.columns.length > 0 && shellData.columns.some(c => c.trim() !== ''));

                    return (
                      <div className="relative inline-block min-w-max">
                        <table className="table-fixed border-separate border-spacing-0 font-['Inter',sans-serif] text-text-primary border-t-2 border-text-primary" style={{ width: `${totalTableWidth}px` }}>
                          <colgroup>
                            <col style={{ width: `${firstColWidth}px`, minWidth: `${firstColWidth}px` }} />
                            {Array.from({ length: actualDataCols }).map((_, i) => (
                              <col key={i} style={{ width: `${dataColWidth}px`, minWidth: `${dataColWidth}px` }} />
                            ))}
                          </colgroup>
                      <thead>
                        {/* Column group header — the two header rows total 52px. */}
                        <tr className="group" style={{ height: '26px' }}>
                          <th className={`bg-white text-left align-top t-small-medium py-[3px] px-[8px] whitespace-normal break-words border-r ${hasSubHeader ? 'border-b border-border-default' : 'border-b-2 border-text-primary'} border-r-border-default`}>
                            Table/Listing Field
                          </th>
                          {shellData.columnGroups.map((cg, cgi) => (
                            <th
                              key={cgi}
                              colSpan={cg.span}
                              className={`bg-white text-left align-top t-small-medium text-text-primary py-[3px] px-[8px] whitespace-normal break-words border-r ${hasSubHeader ? 'border-b border-border-default' : 'border-b-2 border-text-primary'} border-r-border-default last:border-r-0`}
                            >
                              {cg.name.split('\n').map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))}
                            </th>
                          ))}
                        </tr>
                        {/* Standard columns header */}
                        {hasSubHeader && (
                          <tr style={{ height: '26px' }}>
                            <th className="bg-white text-left align-top t-small-medium text-text-primary py-[3px] px-[8px] border-r border-b-2 border-text-primary border-r-border-default relative z-10">
                              {/* Empty cell under Table/Listing Field */}
                            </th>
                            {shellData.columns.map((col, ci) => (
                              <th
                                key={ci}
                                className="bg-white text-left align-top t-small-medium text-text-primary py-[3px] px-[8px] border-r border-b-2 border-text-primary border-r-border-default last:border-r-0 relative z-10"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody onMouseLeave={() => setHoveredBlockId(null)}>
                        {shellData.rows.map((row, ri) => {
                          const blockId = blockIdByRow[ri];
                          return (
                            <ShellTableRowView
                              key={ri}
                              row={row}
                              blockId={blockId}
                              active={blockId !== null && blockId === hoveredBlockId}
                              onHover={setHoveredBlockId}
                              onClick={() => handleRowClick(blockId)}
                              scrollContainerRef={tableScrollRef}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            {/* Footnotes */}
            {shellData.footnotes && shellData.footnotes.length > 0 && (
              <div className="mt-[16px] flex flex-col gap-[4px] w-full text-left">
                {shellData.footnotes.map((fn, idx) => (
                  <p key={idx} className="t-footnote text-text-secondary whitespace-pre-wrap">
                    {fn}
                  </p>
                ))}
              </div>
            )}
            </div>
          </ZoomContainer>
        </div>
        );
      })()
      )}
        {/* Metadata left-edge drag handle — uses WorkspaceDivider pattern */}
        {metadataOpen && (
          <WorkspaceDivider onDrag={(delta) => onMetadataResize(-delta)} />
        )}
        <div
          className={`shrink-0 relative z-20 ${metadataOpen ? 'p-[4px]' : 'overflow-hidden'}`}
          style={{
            width: metadataOpen ? `${metadataWidth}px` : "0px",
            opacity: metadataOpen ? 1 : 0,
            transition: metadataOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          {metadataOpen && (
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-elevation-overlay">
              <MetadataPanel onClose={onMetadataClose} docType={docType} isLocked={isLocked} onJumpToTL={onJumpToTL} associatedTLStatus={associatedTLStatus} onMetaDiffChange={onMetaDiffChange} onRequestUpdateCode={onRequestUpdateCode} onMetaCancel={onMetaCancel} baselineAdvanceTrigger={baselineAdvanceTrigger} addComponentTrigger={addComponentTrigger} metaUpdateActive={metaUpdateActive} metaUpdateProcessing={metaUpdateProcessing} submittedDiffItems={submittedDiffItems} targetFieldId={targetFieldId} targetBlockName={targetBlockName} targetBlockTrigger={targetBlockTrigger} onReviewItemsChange={onReviewItemsChange} figureComponents={figureComponents} setFigureComponents={setFigureComponents} onQuoteField={onQuoteField} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FieldStatus = "default" | "edited" | "error";

interface MetadataField {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  confirmed: boolean;
  dependencyState?: 'S0' | 'S1' | 'S2' | 'S3' | 'S4';
  badge?: 'ai-infer' | 'conflict';
  badgeTooltip?: string;
  errorMessage?: string;
}

interface MetadataBadgeProps {
  type: 'ai-infer' | 'conflict';
  tooltip?: string;
  className?: string;
  interactive?: boolean;
}

function MetadataBadge({ type, tooltip, className = '', interactive = true }: MetadataBadgeProps) {
  const isInfer = type === 'ai-infer';
  const labelText = isInfer ? 'AI Infer' : 'Conflict';
  const defaultTooltip = isInfer
    ? 'Inferred from standard TTE dataset naming convention.'
    : 'Conflicting value detected with SAP specification.';

  const baseClasses = `inline-flex w-[56px] h-[20px] items-center justify-center px-[4px] text-[13px] leading-[20px] font-normal rounded-[4px] select-none ml-[6px] whitespace-nowrap`;
  
  const stateClasses = isInfer
    ? `border border-[#D8DADA] text-[#888E8E] bg-white ${interactive ? 'cursor-pointer hover:bg-bg-panel transition-all duration-180' : ''}`
    : `bg-status-success-bg text-az-danger ${interactive ? 'cursor-pointer hover:opacity-90 transition-all duration-180' : ''}`;

  const badgeContent = (
    <span className={`${baseClasses} ${stateClasses} ${className}`}>
      {labelText}
    </span>
  );

  if (!interactive) return badgeContent;

  return (
    <TooltipText label={tooltip || defaultTooltip} align="left">
      {badgeContent}
    </TooltipText>
  );
}

interface DisplayFact {
  section: string;
  label: string;
  value: string;
  details?: string[];
}

interface MetadataBlock {
  id: string;
  name?: string;
  state?: 'ready' | 'loading';
  deprecated?: boolean;
  fields: MetadataField[];
  display_facts?: DisplayFact[];
}

const GROUP_OPTIONS = [
  {
    name: 'SAFT01aL1_3_12_123NP',
    lines: [
      "proc format;", "  value gpT01aG5L1_3_12_123f", "  1 = 'AZD999(*ESC*)n1 mg/kg'",
      "  2 = 'AZD999(*ESC*)n2 mg/kg'", "  3 = 'AZD999(*ESC*)nTotal'",
      "  4 = 'Investigator choice of therapy'", "  5 = 'Total'", "  ;", "quit;", "",
      "%m_u_popn(", "    inds=adam.adsl", "    ,pop_flag=SAF3LFL='Y'", "    ,trtgrpn=TRT01AN",
      "    ,trtlev=1|2|1 2|3|1 2 3", "    ,UniqueIDVars=usubjid",
      "    ,trtfmtC=gpT01aG5L1_3_12_123f", "    ,gmacro=SAF3LT01aL1_3_12_123NP",
      "    ,BigN=Y", "    ,nformat=%str(n (%%))", "    );",
    ],
  },
  {
    name: 'SAFT01bL2_5_8_456NP',
    lines: [
      "proc format;", "  value gpT01bG3L2_5_8_456f", "  1 = 'Treatment A 100mg'",
      "  2 = 'Treatment B 200mg'", "  3 = 'Placebo'", "  4 = 'Total'", "  ;", "quit;", "",
      "%m_u_popn(", "    inds=adam.adsl", "    ,pop_flag=SAF1LFL='Y'", "    ,trtgrpn=TRT01AN",
      "    ,UniqueIDVars=usubjid", "    ,trtfmtC=gpT01bG3L2_5_8_456f",
      "    ,gmacro=SAF1LT01bL2_5_8_456NP", "    ,BigN=Y", "    );",
    ],
  },
  {
    name: 'SAFT02aL1_7_3_789NP',
    lines: [
      "proc format;", "  value gpT02aG2L1_7_3_789f", "  1 = 'Active'",
      "  2 = 'Control'", "  3 = 'Total'", "  ;", "quit;", "",
      "%m_u_popn(", "    inds=adam.adsl", "    ,pop_flag=ITT1FL='Y'", "    ,trtgrpn=TRT02AN",
      "    ,UniqueIDVars=usubjid", "    ,trtfmtC=gpT02aG2L1_7_3_789f",
      "    ,gmacro=ITT1T02aL1_7_3_789NP", "    ,BigN=Y", "    );",
    ],
  },
];

function GroupCodeViewer({ lines }: { lines: string[] }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="relative rounded-[2px] w-full mt-[4px]">
      <div className="overflow-clip rounded-[2px] border-[0.6px] border-border-default">
        <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center gap-[4px] px-[10px] py-[8px] bg-white hover:bg-bg-panel transition-colors active:scale-[0.99]" aria-expanded={expanded}>
          <span className="t-small text-text-primary">Group Code</span>
          <div className="shrink-0 size-[16px] flex items-center justify-center transition-transform duration-150" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <SvgIcon className="h-[8px] w-[9px]" viewBox="0 0 8.49 5.19"><path d="M0.75 0.75L4.24 4.24L7.72 0.75" stroke="#888E8E" strokeWidth="1.5" fill="none" /></SvgIcon>
          </div>
        </button>
        {expanded && (
          <div className="relative border-t-[0.6px] border-border-default">
            <div className="overflow-auto bg-bg-panel" style={{ maxHeight: '220px' }}>
              <div className="py-[4px]" style={{ minWidth: 'max-content' }}>
                {lines.map((line, i) => (
                  <div key={i} className="flex items-start h-[18px] px-[10px]">
                    <div className="shrink-0 w-[24px] h-[18px] relative">
                      <p className="absolute left-0 top-px whitespace-nowrap select-none text-[12px] leading-[18px] text-[#B2B4B4]" style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{i + 1}</p>
                    </div>
                    <div className="flex-1 min-w-px h-full flex items-center">
                      <p className="whitespace-nowrap text-[12px] leading-[18px] text-text-secondary" style={{ fontFamily: "'Menlo','Consolas',monospace" }}>{line}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Removed METADATA_FIGURE_BLOCK_ITEMS_DATA, now using figureComponents state

const COMMON_DATASET_OPTIONS = [
  { label: 'ADSL', value: 'ADSL' },
  { label: 'ADRESP', value: 'ADRESP' },
  { label: 'ADAE', value: 'ADAE' },
  { label: 'ADLB', value: 'ADLB' },
  { label: 'ADVS', value: 'ADVS' },
  { label: 'ADTTE', value: 'ADTTE' },
  { label: 'ADEXSUM', value: 'ADEXSUM' },
  { label: 'ADRS', value: 'ADRS' },
  { label: 'DM', value: 'DM' },
  { label: 'AE', value: 'AE' },
  { label: 'LB', value: 'LB' },
  { label: 'VS', value: 'VS' },
  { label: 'EX', value: 'EX' },
];

// ── Block Items Data for Blocks Tab Two-Column Layout ──
const METADATA_BLOCK_ITEMS_DATA = [
  {
    id: 'height',
    name: 'Height (cm)',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.HEIGHTBL', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'HEIGHTBL', value: 'HEIGHTBL'}, {label: 'WEIGHTBL', value: 'WEIGHTBL'}, {label: 'BMIBL', value: 'BMIBL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_DESC', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_DESC', value: 'BLK_DESC'}, {label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: '8.1', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: '8.1', value: '8.1'}, {label: '8.2', value: '8.2'}] },
    ],
  },
  {
    id: 'weight',
    name: 'Weight (kg)',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.WEIGHTBL', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'WEIGHTBL', value: 'WEIGHTBL'}, {label: 'WGTBLU', value: 'WGTBLU'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_DESC', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_DESC', value: 'BLK_DESC'}, {label: 'BLK_CUM', value: 'BLK_CUM'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: '8.1', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: '8.1', value: '8.1'}, {label: '8.2', value: '8.2'}] },
    ],
  },
  {
    id: 'weight_group',
    name: 'Weight group (kg)',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.WGTGR1', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'WGTGR1', value: 'WGTGR1'}, {label: 'WEIGHTBL', value: 'WEIGHTBL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_FREQ', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_FREQ', value: 'BLK_FREQ'}, {label: 'BLK_CUM', value: 'BLK_CUM'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'wgtgr1_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'wgtgr1_cat', value: 'wgtgr1_cat'}, {label: 'bmigr1_cat', value: 'bmigr1_cat'}] },
    ],
  },
  {
    id: 'bmi',
    name: 'BMI (kg/m2)',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.BMIBL', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'BMIBL', value: 'BMIBL'}, {label: 'HEIGHTBL', value: 'HEIGHTBL'}, {label: 'WEIGHTBL', value: 'WEIGHTBL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_DESC', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_DESC', value: 'BLK_DESC'}, {label: 'BLK_CUM', value: 'BLK_CUM'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: '8.1', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: '8.1', value: '8.1'}, {label: '8.2', value: '8.2'}] },
    ],
  },
  {
    id: 'bmi_group',
    name: 'BMI Group (kg/m2)',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.BMIGR1', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'BMIGR1', value: 'BMIGR1'}, {label: 'BMIBL', value: 'BMIBL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_FREQ', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_FREQ', value: 'BLK_FREQ'}, {label: 'BLK_CUM', value: 'BLK_CUM'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'bmigr1_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'bmigr1_cat', value: 'bmigr1_cat'}, {label: 'wgtgr1_cat', value: 'wgtgr1_cat'}] },
    ],
  },
  {
    id: 'ecog',
    name: 'ECOG performance status',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.ECOGBL', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'ECOGBL', value: 'ECOGBL'}, {label: 'ECOGBLN', value: 'ECOGBLN'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_FREQ', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_FREQ', value: 'BLK_FREQ'}, {label: 'BLK_CUM', value: 'BLK_CUM'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'ecogbl_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'ecogbl_cat', value: 'ecogbl_cat'}, {label: 'nicstt_cat', value: 'nicstt_cat'}] },
    ],
  },
  {
    id: 'nicotine',
    name: 'Nicotine use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.NICSTT', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICSTT', value: 'NICSTT'}, {label: 'ALCSTT', value: 'ALCSTT'}, {label: 'AVAL', value: 'AVAL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'nicstt_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'nicstt_cat', value: 'nicstt_cat'}, {label: 'alcstt_cat', value: 'alcstt_cat'}] },
    ],
  },
  {
    id: 'alcohol',
    name: 'Alcohol use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.ALCSTT', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICSTT', value: 'NICSTT'}, {label: 'ALCSTT', value: 'ALCSTT'}, {label: 'AVAL', value: 'AVAL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'alcstt_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'nicstt_cat', value: 'nicstt_cat'}, {label: 'alcstt_cat', value: 'alcstt_cat'}] },
    ],
  },
  {
    id: 'nicotine_current',
    name: 'Any current use of nicotine products',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.NICSYN', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICSYN', value: 'NICSYN'}, {label: 'NICSTT', value: 'NICSTT'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'ny_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'ny_cat', value: 'ny_cat'}] },
    ],
  },
  {
    id: 'cigarette_pack',
    name: 'Number of cigarette pack years',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.CIGPKYR', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'CIGPKYR', value: 'CIGPKYR'}, {label: 'NICPKYR', value: 'NICPKYR'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'cigpkyr_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'cigpkyr_cat', value: 'cigpkyr_cat'}] },
    ],
  },
  {
    id: 'nicotine_pack',
    name: 'Number of nicotine pack years',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'multiselect' as const, options: COMMON_DATASET_OPTIONS },
      { id: 'variable', label: 'Variable', value: 'ADSL.NICPKYR', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICPKYR', value: 'NICPKYR'}, {label: 'CIGPKYR', value: 'CIGPKYR'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'nicpkyr_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'nicpkyr_cat', value: 'nicpkyr_cat'}] },
    ],
  },
  {
    id: 'nicotine_type',
    name: 'Nicotine type',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'NICTYP', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'nictyp_cat', type: 'text' as const, hasLink: true },
    ],
  },
];

const COMPONENT_TYPE_OPTIONS = ['Chart', 'Table', 'Annotation', 'Legend', 'Text Block'] as const;

const INSTRUCTION_PLACEHOLDERS: Record<string, string> = {
  Chart: "Specify chart features e.g. KM survival curve with 95% CI bands, tick marks for censored data, and hazard ratio annotation.",
  Table: "Specify table specs e.g. Number at Risk row below X-axis at time points 0, 6, 12, 18, 24 months grouped by treatment arm.",
  Annotation: "Specify callouts e.g. Add median survival time annotation and log-rank p-value text box in upper right quadrant.",
  Legend: "Specify legend style e.g. Display treatment arm color keys and line style indicators placed at top-right corner.",
  'Text Block': "Specify footnote or header specs e.g. Provide dataset specifications, cutoff date, and SAS macro parameters."
};

interface AddMenuProps {
  anchorRect: DOMRect;
  onClose: () => void;
  onGenerate: (name: string, type: string, instructions: string) => void;
  lastSubmission?: { name: string; type: string; instructions: string } | null;
  isGenerating?: boolean;
}

function AddComponentMenu({ anchorRect, onClose, onGenerate, lastSubmission, isGenerating = false }: AddMenuProps) {
  const [name, setName] = useState(() => (isGenerating && lastSubmission ? lastSubmission.name : ''));
  const [type, setType] = useState<string>(() => (isGenerating && lastSubmission ? lastSubmission.type : ''));
  const [instructions, setInstructions] = useState(() => (isGenerating && lastSubmission ? lastSubmission.instructions : ''));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const inputBorder = '1px solid #ebecec';
  const menuWidth = 260;
  const left = Math.min(anchorRect.left, Math.max(8, window.innerWidth - menuWidth - 8));
  const isSubmitDisabled = isGenerating || !name.trim() || !type;

  const menu = (
    <div
      style={{
        position: 'fixed',
        top: anchorRect.bottom + 4,
        left,
        width: menuWidth,
        zIndex: 9999,
        transformOrigin: 'top left',
        transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-4px)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(0.2,0,0,1), opacity 140ms cubic-bezier(0.2,0,0,1)',
      }}
      ref={menuRef}
    >
      <div
        className="bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ border: '1px solid #d8dada', boxShadow: '0px 4px 6px rgba(0,0,0,0.15)' }}
      >
        <div className="h-[40px] shrink-0 flex items-center px-[12px] border-b border-border-default">
          <p className="t-body-medium text-text-primary whitespace-nowrap">
            Add Component
          </p>
        </div>
        <div className="flex flex-col gap-[16px] p-[12px]">
          <Input
            label="Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Required"
          />
          <Dropdown
            label="Type"
            required
            placeholder="Required"
            value={type}
            onChange={val => setType(val)}
            options={COMPONENT_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
          />
          <div className="mt-[4px]">
            <Textarea
              label="Custom instructions"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder={type && INSTRUCTION_PLACEHOLDERS[type] ? INSTRUCTION_PLACEHOLDERS[type] : "Describe the component specifications, required variables, or custom styling rules..."}
              style={{ resize: "none" }}
              className="h-[90px]"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={isSubmitDisabled}
            className="w-full gap-[6px] flex-nowrap whitespace-nowrap"
            onClick={() => {
              if (isSubmitDisabled) return;
              onGenerate(name, type, instructions);
              onClose();
            }}
          >
            <img src={shiningFillIconUrl} className="w-[14px] h-[14px] shrink-0" style={{ filter: 'brightness(0) invert(1)', opacity: isSubmitDisabled ? 0.6 : 1 }} alt="AI" />
            <span className="whitespace-nowrap">{isGenerating ? 'Generating' : 'Generate'}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}

interface MoreOptionsMenuProps {
  anchorRect: DOMRect;
  isDeprecated: boolean;
  onClose: () => void;
  onDeprecate: () => void;
  onDelete: () => void;
}

function MoreOptionsMenu({ anchorRect, isDeprecated, onClose, onDeprecate, onDelete }: MoreOptionsMenuProps) {
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const menuWidth = 160;
  const left = Math.min(anchorRect.left, Math.max(8, window.innerWidth - menuWidth - 8));

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: anchorRect.bottom + 4,
        left,
        zIndex: 9999,
        transformOrigin: 'top left',
        transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-4px)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 140ms cubic-bezier(0.2,0,0,1), opacity 120ms',
      }}
    >
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid var(--color-border-default)', boxShadow: '0px 2px 6px rgba(0,0,0,0.10)' }}>
        <div className="flex flex-col p-[4px]">
          <button
            type="button"
            onClick={() => { onDeprecate(); onClose(); }}
            className="flex items-center gap-[6px] px-[4px] py-[6px] rounded-[2px] hover:bg-bg-panel transition-colors whitespace-nowrap w-full text-left active:scale-[0.97] transition-transform"
          >
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute" style={{ inset: '8.33% 8.34% 8.34% 8.33%' }}>
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 13.333 13.333" preserveAspectRatio="none">
                  <path d="M6.66699 0C10.3487 0.000175812 13.333 2.9852 13.333 6.66699C13.3328 10.3486 10.3486 13.3328 6.66699 13.333C2.9852 13.333 0.000175816 10.3487 0 6.66699C0 2.98509 2.98509 0 6.66699 0ZM6.66699 1.33301C3.72147 1.33301 1.33301 3.72147 1.33301 6.66699C1.33318 9.61238 3.72158 12 6.66699 12C9.61227 11.9998 11.9998 9.61227 12 6.66699C12 3.72158 9.61238 1.33318 6.66699 1.33301ZM9.92773 8.98438C9.80013 9.16338 9.65578 9.33452 9.49512 9.49512C9.33452 9.65578 9.16338 9.80013 8.98438 9.92773L3.40625 4.34863C3.5338 4.16969 3.67735 3.99844 3.83789 3.83789C3.99844 3.67735 4.16969 3.5338 4.34863 3.40625L9.92773 8.98438Z" fill="var(--color-text-secondary)" />
                </svg>
              </div>
            </div>
            <span className="t-small text-text-primary">
              {isDeprecated ? 'Remove Deprecation' : 'Mark as Deprecated'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => { onDelete(); onClose(); }}
            className="flex items-center gap-[6px] px-[4px] py-[6px] rounded-[2px] hover:bg-[#fff5f5] transition-colors whitespace-nowrap w-full text-left active:scale-[0.97] transition-transform"
          >
            <div className="overflow-hidden relative shrink-0 size-[16px]">
              <img src={deleteBinIconUrl} className="w-full h-full" style={{ filter: 'invert(27%) sepia(85%) saturate(5833%) hue-rotate(345deg) brightness(97%) contrast(85%)' }} alt="delete" />
            </div>
            <span className="t-small text-status-error">
              Delete Component
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}

function BlocksTabContent({
  blocks,
  targetBlockId,
  confirmedBlocks,
  onToggleBlockConfirm,
  isLocked,
  onGenerateComponent,
  onDeprecateComponent,
  onDeleteComponent,
  onFieldEdit,
  onDisplayFactEdit,
  onDisplayFactLabelEdit,
  onDisplayFactDelete,
  onDetailEdit,
  onDetailAdd,
  onDetailDelete,
  getEffectiveStatus,
  getFieldStyles,
  fieldRefs,
  onQuoteField,
  confirmedCount,
  totalFields,
  selectAllState,
  onSelectAll,
}: {
  blocks: any;
  targetBlockId?: string | null;
  confirmedBlocks: Record<string, boolean>;
  onToggleBlockConfirm: (blockId: string) => void;
  isLocked?: boolean;
  onGenerateComponent?: (name: string, type: string, instructions: string) => void;
  onDeprecateComponent?: (id: string) => void;
  onDeleteComponent?: (id: string) => void;
  onFieldEdit?: (blockId: string, fieldId: string, value: string) => void;
  onDisplayFactEdit?: (blockId: string, factIdx: number, value: string) => void;
  onDisplayFactLabelEdit?: (blockId: string, factIdx: number, label: string) => void;
  onDisplayFactDelete?: (blockId: string, factIdx: number) => void;
  onDetailEdit?: (blockId: string, factIdx: number, detailIdx: number, value: string) => void;
  onDetailAdd?: (blockId: string, factIdx: number) => void;
  onDetailDelete?: (blockId: string, factIdx: number, detailIdx: number) => void;
  getEffectiveStatus?: (fieldId: string | null, status: FieldStatus, currentValue: string | null) => FieldStatus;
  getFieldStyles?: (status: FieldStatus, isReadOnlyField?: boolean) => { containerBg: string; containerBorder: string; inputBorder: string };
  fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onQuoteField?: (fieldId: string, label: string, blockName: string) => void;
  confirmedCount?: number;
  totalFields?: number;
  selectAllState?: "empty" | "indeterminate" | "checked";
  onSelectAll?: () => void;
}) {
  const FieldCheckboxIcon = (confirmed: boolean) => {
    if (!confirmed) return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 0 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
    return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
  };
  const selectAllCheckboxIcon = () => {
    if (selectAllState === 'checked') return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
    if (selectAllState === 'indeterminate') return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><rect x="4" y="9" width="12" height="2" rx="1" fill="white" /></>;
    return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 0 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
  };
  const [selectedBlockId, setSelectedBlockId] = useState<string>(() => blocks[0]?.id || '');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  // Fallback to first block if selected block is deleted or empty
  useEffect(() => {
    if (blocks.length > 0 && (!selectedBlockId || !blocks.find((b: any) => b.id === selectedBlockId))) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [blocks, selectedBlockId]);

  // Scroll to block requested by Shell Preview click
  useEffect(() => {
    if (!targetBlockId) return;
    if (!blocks.find((b: any) => b.id === targetBlockId)) return;
    setSelectedBlockId(targetBlockId);
    const el = sectionRefs.current[targetBlockId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetBlockId, blocks]);

  // Select dropdown navigation handler — suppresses scroll-spy during programmatic scroll
  const handleSelectNavChange = (blockId: string) => {
    isScrollingProgrammatically.current = true;
    setSelectedBlockId(blockId);
    const el = sectionRefs.current[blockId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Re-enable scroll-spy after smooth scroll finishes (~500ms)
    setTimeout(() => { isScrollingProgrammatically.current = false; }, 500);
  };

  // IntersectionObserver scroll-spy: auto-update selectedBlockId based on visible section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || blocks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return;
        // Find the topmost visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const blockId = visible[0].target.getAttribute('data-block-id');
          if (blockId) setSelectedBlockId(blockId);
        }
      },
      { root: container, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    // Observe all section refs
    Object.entries(sectionRefs.current).forEach(([, el]) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [blocks]);

  const LinkIcon = () => (
    <SvgIcon className="h-[12px] w-[12px] inline-block ml-[4px]" viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="var(--color-brand-1)" />
    </SvgIcon>
  );

  const prevBlockIdsRef = useRef<string[]>(blocks.map((b: any) => b.id));
  const prevLoadingIdRef = useRef<string | null>(null);
  const activeGeneratedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentIds = blocks.map((b: any) => b.id);
    const newId = currentIds.find((id: string) => !prevBlockIdsRef.current.includes(id));
    prevBlockIdsRef.current = currentIds;

    const loadingBlock = blocks.find((b: any) => b.state === 'loading');
    if (loadingBlock) {
      if (loadingBlock.id !== prevLoadingIdRef.current) {
        prevLoadingIdRef.current = loadingBlock.id;
        activeGeneratedIdRef.current = loadingBlock.id;
        isScrollingProgrammatically.current = true;
        setSelectedBlockId(loadingBlock.id);
        setTimeout(() => {
          const el = sectionRefs.current[loadingBlock.id];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 600);
        }, 100);
      }
    } else if (activeGeneratedIdRef.current) {
      const completedId = activeGeneratedIdRef.current;
      activeGeneratedIdRef.current = null;
      isScrollingProgrammatically.current = true;
      setSelectedBlockId(completedId);
      setTimeout(() => {
        const el = sectionRefs.current[completedId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 600);
      }, 100);
    } else if (newId) {
      // Newly added block without loading state
      isScrollingProgrammatically.current = true;
      setSelectedBlockId(newId);
      setTimeout(() => {
        const el = sectionRefs.current[newId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 600);
      }, 100);
    }
  }, [blocks]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Row 2: Select navigator (left) + Confirm stats (right) */}
      <div className="shrink-0 flex items-center justify-between px-[12px] py-[8px] border-b border-[#E5E8E8] bg-bg-panel">
        {/* FilterChip dropdown navigator */}
        <div className="flex-1 min-w-0 mr-[12px]">
          {blocks.length > 0 ? (
            <FilterChip
              type="Dropdown"
              variant="select"
              showIcon={false}
              options={blocks.map((b: any) => ({
                label: b.name || b.fields?.find((f: any) => f.id.includes('Label') || f.id.includes('Title') || f.label === 'Component Label' || f.label === 'Block Title')?.value || b.id,
                value: b.id
              }))}
              value={selectedBlockId}
              onChange={handleSelectNavChange}
              className="max-w-full"
            />
          ) : (
            <p className="t-small text-text-secondary">No items</p>
          )}
        </div>
        {/* Confirm stats: X/Y Confirmed + Select-all checkbox */}
        {confirmedCount !== undefined && totalFields !== undefined && (
          <div className="flex items-center gap-[6px] shrink-0">
            <p className="t-small text-text-primary whitespace-nowrap">{confirmedCount}/{totalFields} confirmed</p>
            <button onClick={isLocked ? undefined : onSelectAll} disabled={isLocked}
              className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
              aria-label="Select all">
              <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{selectAllCheckboxIcon()}</SvgIcon>
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content — all blocks stacked vertically */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-scroll overflow-x-hidden">
        {blocks.length === 0 ? (
          <div className="flex w-full h-full items-center justify-center">
            <p className="t-small text-text-secondary">No Components</p>
          </div>
        ) : blocks.map((block: any, blockIndex: number, arr: any[]) => {
          const fieldIsDisabled = isLocked;
          const blockName = block.name || block.fields?.find((f: any) => f.id.includes('Label') || f.id.includes('Title') || f.label === 'Component Label' || f.label === 'Block Title')?.value || block.id;
          
          const standardFields = block.fields || [];
          const displayFacts = block.display_facts || [];

          return (
            <div
              key={block.id}
              ref={(el) => { sectionRefs.current[block.id] = el; }}
              data-block-id={block.id}
              className={`pl-[16px] pr-[4px] py-[14px] ${blockIndex !== arr.length - 1 ? 'border-b border-[#E5E8E8]' : ''}`}
            >
              {block.state === 'loading' ? (
                <div>
                  <div className="h-[20px] w-[120px] rounded-[2px] bg-[#F2F4F4] animate-pulse mb-[12px]" />
                  <div className="flex flex-col gap-[12px]">
                    <div className="h-[32px] w-[80%] rounded-[2px] bg-[#F2F4F4] animate-pulse" />
                    <div className="h-[32px] w-[60%] rounded-[2px] bg-[#F2F4F4] animate-pulse" />
                    <div className="h-[32px] w-[100%] rounded-[2px] bg-[#F2F4F4] animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="group relative flex items-center justify-between gap-[8px] min-h-[24px] mb-[12px]">
                    <div className="flex items-center gap-[4px] min-w-0 flex-1">
                      <p className="text-[14px] leading-[20px] font-bold text-text-primary break-words m-0">
                        {blockName}
                      </p>
                      {onQuoteField && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onQuoteField(block.id, blockName, blockName); }}
                          className="shrink-0 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                          title={`Quote "${blockName}"`}
                          aria-label={`Quote "${blockName}"`}
                        >
                          <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-[4px] shrink-0 h-[24px]">
                      {/* Delete button — Figure Components only, on the left of Checkbox */}
                      {onDeleteComponent && (
                        <TooltipText label="Delete" align="center">
                          <div
                            role="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteComponent(block.id);
                            }}
                            className="hidden group-hover:flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-[4px] bg-transparent hover:bg-status-error-bg/60 active:scale-[0.96] transition-colors"
                          >
                            <LocalIcon src={deleteBinIconUrl} className="w-[14px] h-[14px]" color="var(--color-status-error)" />
                          </div>
                        </TooltipText>
                      )}
                      {/* Block-level confirm checkbox */}
                      <button
                        onClick={fieldIsDisabled ? undefined : () => onToggleBlockConfirm(block.id)}
                        disabled={fieldIsDisabled}
                        className="flex h-[16px] w-[16px] items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0"
                      >
                        <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">
                          {FieldCheckboxIcon(block.fields.length > 0 && block.fields.every((f: any) => confirmedBlocks[`${block.id}_${f.id}`]))}
                        </SvgIcon>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    {standardFields.map((field: any) => {
                      const badgeNode = field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined;
                      
                      const labelWithLink = field.hasLink ? (
                        <div className="flex items-center gap-[2px]">
                          {field.label}
                          <LinkIcon />
                        </div>
                      ) : field.label;

                      const effectiveInputType = field.inputType || (field.type === 'tag' ? 'multiselect' : 'input');

                      return (
                        <div key={field.id} ref={el => { if (el && fieldRefs) fieldRefs.current[field.id] = el; }} className="group relative bg-white rounded-[4px] border border-transparent p-[4px]">
                          {onQuoteField && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onQuoteField(field.id, field.label, blockName); }}
                              className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                              title={`Quote "${field.label}"`}
                              aria-label={`Quote "${field.label}"`}
                            >
                              <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                            </button>
                          )}
                          {(() => {
                            const isVariableField = field.id === 'variable' || field.id.toLowerCase().includes('variable') || String(field.label || '').toLowerCase().includes('variable');
                            
                            if (isVariableField) {
                              // Find dataset field in the same block to establish dependency
                              const datasetField = block.fields?.find((f: any) => {
                                const fId = (f.id || '').toLowerCase();
                                const fLabel = (f.label || '').toLowerCase();
                                return fId === 'dataset' || fId === 'datasets' || fId.includes('dataset') || fLabel.includes('dataset');
                              });
                              const sourceDatasets = datasetField?.value
                                ? datasetField.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];

                              const currentSelectedVars = field.value
                                ? field.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];

                              // Orphaned variable warning: variables whose dataset is not in sourceDatasets
                              const orphanedVars = currentSelectedVars.filter((varKey: string) => {
                                if (sourceDatasets.length === 0) return false;
                                if (varKey.includes('.')) {
                                  const dataset = varKey.split('.')[0];
                                  return !sourceDatasets.includes(dataset);
                                }
                                return false;
                              });
                              const variableWarning = orphanedVars.length > 0
                                ? `${orphanedVars.length} variable(s) outside dataset scope (${orphanedVars.map((v: string) => v.split('.')[0]).join(', ')}). Review or update dataset.`
                                : undefined;

                              return (
                                <BrowseVariablesField
                                  label={labelWithLink as any}
                                  required={field.required}
                                  disabled={fieldIsDisabled}
                                  badge={badgeNode}
                                  error={variableWarning}
                                  placeholder={field.required ? "Required" : "Optional"}
                                  value={currentSelectedVars}
                                  sourceDatasets={sourceDatasets}
                                  onDatasetsExpand={(newDatasets) => {
                                    if (datasetField) {
                                      const merged = Array.from(new Set([...sourceDatasets, ...newDatasets]));
                                      onFieldEdit?.(block.id, datasetField.id, merged.join(', '));
                                    }
                                  }}
                                  onChange={(val) => onFieldEdit?.(block.id, field.id, val.join(', '))}
                                />
                              );
                            }

                            if (effectiveInputType === 'multiselect') {
                              return (
                                <MultiSelectDropdown
                                  label={labelWithLink as any}
                                  required={field.required}
                                  disabled={fieldIsDisabled}
                                  badge={badgeNode}
                                  placeholder={field.required ? "Required" : "Optional"}
                                  options={field.options || []}
                                  value={field.value ? field.value.split(', ') : []}
                                  onChange={(val) => onFieldEdit?.(block.id, field.id, val.join(', '))}
                                />
                              );
                            }

                            if (effectiveInputType === 'dropdown') {
                              return (
                                <Dropdown
                                  label={labelWithLink as any}
                                  required={field.required}
                                  disabled={fieldIsDisabled}
                                  badge={badgeNode}
                                  placeholder={field.required ? "Required" : "Optional"}
                                  options={field.options || []}
                                  value={field.value}
                                  onChange={(val) => onFieldEdit?.(block.id, field.id, val)}
                                />
                              );
                            }

                            return (
                              <Input
                                label={labelWithLink as any}
                                required={field.required}
                                disabled={fieldIsDisabled}
                                badge={badgeNode}
                                placeholder={field.required ? "Required" : "Optional"}
                                value={field.value}
                                onChange={(e) => onFieldEdit?.(block.id, field.id, e.target.value)}
                              />
                            );
                          })()}
                        </div>
                      );
                    })}

                    {/* Display Facts Section (Grouped by section into Cards with graphite-10 border, no shadow) */}
                    {(() => {
                      if (displayFacts.length === 0) return null;

                      // Group display_facts by section
                      const sectionGroups: { sectionName: string; facts: { fact: DisplayFact; originalIndex: number }[] }[] = [];
                      displayFacts.forEach((fact: DisplayFact, idx: number) => {
                        const sName = fact.section || 'General';
                        let group = sectionGroups.find(g => g.sectionName === sName);
                        if (!group) {
                          group = { sectionName: sName, facts: [] };
                          sectionGroups.push(group);
                        }
                        group.facts.push({ fact, originalIndex: idx });
                      });

                      return (
                        <div className="flex flex-col gap-[8px] mt-[4px]">
                          {/* Title styled with standard field label typography (t-small-medium / text-text-primary) */}
                          <div className="flex items-center gap-[6px] h-[20px]">
                            <span className="t-small-medium text-text-primary" style={{ fontFamily: "'PingFang SC', sans-serif" }}>
                              Display Facts
                            </span>
                            <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-graphite-10 shrink-0">
                              <span className="text-[10px] leading-[14px] font-medium text-text-secondary">{displayFacts.length}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-[10px]">
                            {sectionGroups.map((group, groupIdx) => (
                              <div
                                key={groupIdx}
                                className="bg-white border border-graphite-10 rounded-[6px] p-[10px] flex flex-col gap-[10px]"
                              >
                                {/* Card Section Header (Read-only) */}
                                <div className="flex items-center gap-[6px]">
                                  <div className="w-[3px] h-[12px] bg-brand-1 rounded-[1px] shrink-0" />
                                  <span className="text-[12px] font-semibold text-text-primary uppercase tracking-wide">
                                    {group.sectionName}
                                  </span>
                                </div>

                                {/* Facts under this section */}
                                <div className="flex flex-col gap-[12px]">
                                  {group.facts.map(({ fact, originalIndex }) => {
                                    const factKey = `${block.id}_fact_${originalIndex}_value`;
                                    const labelKey = `${block.id}_fact_${originalIndex}_label`;
                                    const isLabelEmpty = !fact.label || fact.label.trim() === '';
                                    
                                    return (
                                      <div
                                        key={originalIndex}
                                        className="flex flex-col gap-[6px] relative group/fact"
                                      >
                                        {/* Fact Header: Label (Editable, matching BaseInput style with border-transparent default) + Quote + Delete Fact Button */}
                                        <div className="flex items-center justify-between gap-[6px]">
                                          <div className="flex items-center gap-[6px] flex-1 min-w-0">
                                            <input
                                              disabled={fieldIsDisabled}
                                              value={fact.label}
                                              onChange={(e) => onDisplayFactLabelEdit?.(block.id, originalIndex, e.target.value)}
                                              placeholder={fact.section ? `${fact.section} (Label required)` : "Label required"}
                                              className={`w-full text-[13px] leading-[20px] py-[4px] px-[8px] rounded-[2px] bg-transparent border border-transparent hover:border-graphite-20 focus:border-brand-1 focus:bg-white outline-none transition-colors ${
                                                isLabelEmpty ? 'text-status-error placeholder:text-status-error/70 italic' : 'text-text-primary font-medium'
                                              }`}
                                            />
                                            {isLabelEmpty && (
                                              <span className="shrink-0 px-[4px] py-px text-[10px] font-medium leading-[14px] rounded bg-status-error-bg text-status-error whitespace-nowrap">
                                                Incomplete
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-[2px] shrink-0">
                                            {onQuoteField && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); onQuoteField(factKey, fact.label || group.sectionName, blockName); }}
                                                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover/fact:opacity-100 cursor-pointer select-none"
                                                title={`Quote "${fact.label || group.sectionName}"`}
                                              >
                                                <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                                              </button>
                                            )}

                                            {!fieldIsDisabled && onDisplayFactDelete && (
                                              <TooltipText label="Delete" align="center">
                                                <div
                                                  role="button"
                                                  onMouseDown={(e) => e.stopPropagation()}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDisplayFactDelete(block.id, originalIndex);
                                                  }}
                                                  className="hidden group-hover/fact:flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-[4px] bg-transparent hover:bg-status-error-bg/60 active:scale-[0.96] transition-colors cursor-pointer"
                                                >
                                                  <LocalIcon src={closeIconUrl} className="w-[14px] h-[14px]" color="var(--color-status-error)" />
                                                </div>
                                              </TooltipText>
                                            )}
                                          </div>
                                        </div>

                                        {/* Fact Value (Editable Input — Default borderless, border on hover/focus) */}
                                        <div ref={el => { if (el && fieldRefs) fieldRefs.current[factKey] = el; }} className="w-full">
                                          <BaseInput
                                            disabled={fieldIsDisabled}
                                            value={fact.value}
                                            onChange={(e) => onDisplayFactEdit?.(block.id, originalIndex, e.target.value)}
                                            placeholder="Enter fact value..."
                                            className="w-full text-[13px] leading-[20px] py-[4px] px-[8px] bg-transparent border-transparent hover:border-graphite-20 hover:bg-white focus:border-brand-1 focus:bg-white rounded-[2px]"
                                          />
                                        </div>

                                        {/* Fact Details (Editable items, multi-line auto-wrap, aligned bullets & Add detail) */}
                                        <div className="flex flex-col gap-[3px] pl-[6px]">
                                          {fact.details && fact.details.map((detail: string, detIdx: number) => {
                                            const detKey = `${block.id}_fact_${originalIndex}_det_${detIdx}`;
                                            return (
                                              <div
                                                key={detIdx}
                                                ref={el => { if (el && fieldRefs) fieldRefs.current[detKey] = el; }}
                                                className="group/detail relative flex items-start gap-[3px] w-full"
                                              >
                                                <span className="text-text-secondary text-[12px] leading-[22px] select-none shrink-0 w-[12px] text-center">•</span>
                                                <textarea
                                                  disabled={fieldIsDisabled}
                                                  value={detail}
                                                  rows={1}
                                                  onChange={(e) => {
                                                    onDetailEdit?.(block.id, originalIndex, detIdx, e.target.value);
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                  }}
                                                  ref={(el) => {
                                                    if (el) {
                                                      el.style.height = 'auto';
                                                      el.style.height = `${el.scrollHeight}px`;
                                                    }
                                                  }}
                                                  placeholder="Detail specification..."
                                                  className="flex-1 min-w-0 min-h-[22px] text-[12px] leading-[18px] px-[4px] py-[2px] bg-transparent border border-transparent hover:border-graphite-20 hover:bg-white focus:border-brand-1 focus:bg-white rounded-[2px] outline-none resize-none transition-colors overflow-hidden"
                                                />
                                                {!fieldIsDisabled && onDetailDelete && (
                                                  <TooltipText label="Delete" align="center">
                                                    <div
                                                      role="button"
                                                      onMouseDown={(e) => e.stopPropagation()}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDetailDelete(block.id, originalIndex, detIdx);
                                                      }}
                                                      className="hidden group-hover/detail:flex items-center justify-center shrink-0 w-[18px] h-[18px] rounded-[4px] bg-transparent hover:bg-status-error-bg/60 active:scale-[0.96] transition-colors cursor-pointer mt-[2px]"
                                                    >
                                                      <LocalIcon src={closeIconUrl} className="w-[12px] h-[12px]" color="var(--color-status-error)" />
                                                    </div>
                                                  </TooltipText>
                                                )}
                                              </div>
                                            );
                                          })}

                                          {/* Add Detail Button (Icon aligned with bullet point) */}
                                          {!fieldIsDisabled && onDetailAdd && (
                                            <button
                                              type="button"
                                              onClick={() => onDetailAdd(block.id, originalIndex)}
                                              className="self-start flex items-center gap-[3px] text-[11px] leading-[18px] text-brand-1 hover:text-brand-1/80 hover:underline py-[2px] mt-[1px] active:scale-[0.98] transition-all cursor-pointer select-none"
                                            >
                                              <div className="w-[12px] flex items-center justify-center shrink-0">
                                                <LocalIcon src={addLineIconUrl} className="w-[12px] h-[12px]" color="var(--color-brand-1)" />
                                              </div>
                                              <span>Add Detail</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MetadataPanelProps {
  onClose: () => void;
  isLocked?: boolean;
  docType?: string;
  frozenUntilIndex?: number | null;
  pageSepActive?: boolean;
  pageColumnCounts?: Record<string, number>;
  pageBreakColumns?: number[];
  columnCount?: number;
  repeatColumnBaseline?: { frozenUntilIndex: number | null } | null;
  onRepeatColumnBaselineChange?: (baseline: { frozenUntilIndex: number | null }) => void;
  idpageBaseline?: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  idlistBaseline?: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null;
  onIdpageBaselineChange?: (b: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  onIdlistBaselineChange?: (b: { frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> }) => void;
  pageBreakColumnBaseline?: { pageSepActive: boolean; pageColumnCounts: Record<string, number>; pageBreakColumns: number[] } | null;
  onPageBreakColumnBaselineChange?: (baseline: { pageSepActive: boolean; pageColumnCounts: Record<string, number>; pageBreakColumns: number[] }) => void;
  onAddChangesToChat?: (text: string) => void;
  onMetaDiffChange?: (diffItems: MetaDiffItem[]) => void;
  onRequestUpdateCode?: () => void;
  onMetaCancel?: () => void;
  baselineAdvanceTrigger?: number;
  addComponentTrigger?: { name: string; type: string; instructions: string } | null;
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  submittedDiffItems?: MetaDiffItem[];
  /** 'panel' = Track Changes in Metadata panel (Idea 2); 'header' = Sticky Header in Copilot ChatBox (Idea 1). Default is 'header'. */
  diffDisplayMode?: 'header' | 'panel';
  targetFieldId?: string;
  /** Shell-preview block name to deep-link to: opens the Blocks tab with that block selected. */
  targetBlockName?: string | null;
  targetBlockTrigger?: number;
  onReviewItemsChange?: (items: ReviewItem[]) => void;
  associatedTLStatus?: string;
  figureComponents?: MetadataBlock[];
  setFigureComponents?: React.Dispatch<React.SetStateAction<MetadataBlock[]>>;
  onJumpToTL?: (name: string) => void;
  /** Called when user clicks the Quote icon on a field/component row */
  onQuoteField?: (fieldId: string, label: string, blockName: string) => void;
}

const INITIAL_FIGURE_COMPONENTS: MetadataBlock[] = [
  {
    id: 'kmCurve',
    name: 'Kaplan-Meier Survival Curves',
    state: 'ready' as const,
    deprecated: false,
    fields: [
      { id: 'compLabel1', label: 'Component Label', value: 'Kaplan-Meier Survival Curves', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
      { id: 'compType1', label: 'Component Type', value: 'Chart', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'dropdown' as const, options: [{label: 'Chart', value: 'Chart'}, {label: 'Table', value: 'Table'}] },
      { id: 'sourceDataset1', label: 'Source Dataset(s)', value: 'ADTTTE, ADSL', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE dataset naming convention.', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADRESP', value: 'ADRESP'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
      { id: 'sourceVariable1', label: 'Source Variable(s)', value: 'ADTTTE.AVAL, ADTTTE.CNSR, ADTTTE.PARAMCD, ADTTTE.TRT01P', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred based on KM Plot requirements.', inputType: 'multiselect' as const, options: [{label: 'AVAL', value: 'AVAL'}, {label: 'CNSR', value: 'CNSR'}, {label: 'PARAMCD', value: 'PARAMCD'}, {label: 'TRT01P', value: 'TRT01P'}, {label: 'TRTA', value: 'TRTA'}] },
      { id: 'filter1', label: 'Filter', value: "ADTTTE.PARAMCD = 'PFS' and ADTTTE.SAFFL = 'Y';", type: 'text', required: false, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
    ],
    display_facts: [
      {
        section: "Time and censoring",
        label: "Time scale and units",
        value: "Months from randomization (0 to 36 months, ticks every 3-6 mo)",
        details: [
          "X-axis range: 0-36 months",
          "Vertical cross (+) denotes censored observation",
          "Two-sided 95% CI bands (log-log transformation)"
        ]
      },
      {
        section: "Statistics & Reference",
        label: "Median survival lines",
        value: "Horizontal/vertical dashed reference lines at 50% survival probability",
        details: [
          "AZD999: 26.4 months (95% CI: 21.8, NE)",
          "Placebo: 11.2 months (95% CI: 8.9, 14.6)",
          "Stratified Log-rank test p < 0.0001"
        ]
      }
    ]
  },
  {
    id: 'riskTable',
    name: 'Number at Risk Table',
    state: 'ready' as const,
    deprecated: false,
    fields: [
      { id: 'compLabel2', label: 'Component Label', value: 'Number at Risk Table', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
      { id: 'compType2', label: 'Component Type', value: 'Table', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'dropdown' as const, options: [{label: 'Chart', value: 'Chart'}, {label: 'Table', value: 'Table'}] },
      { id: 'sourceDataset2', label: 'Source Dataset(s)', value: 'ADTTTE', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE dataset naming convention.', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADRESP', value: 'ADRESP'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
      { id: 'sourceVariable2', label: 'Source Variable(s)', value: 'ADTTTE.TRTA, ADTTTE.AVAL', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'conflict' as const, badgeTooltip: 'Conflicting treatment variable: TRTA used instead of TRT01P.', inputType: 'multiselect' as const, options: [{label: 'TRTA', value: 'TRTA'}, {label: 'TRT01P', value: 'TRT01P'}, {label: 'AVAL', value: 'AVAL'}] },
      { id: 'filter2', label: 'Filter', value: "ADTTTE.PARAMCD = 'PFS' and ADTTTE.SAFFL = 'Y';", type: 'text', required: false, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
    ],
    display_facts: [
      {
        section: "Intervals",
        label: "Risk table columns",
        value: "Aligned with X-axis major ticks: 0, 3, 6, 9, 12, 18, 24, 30, 36",
        details: [
          "Counts of subjects remaining at risk at interval start",
          "Separate rows for AZD999 1 mg/kg and Placebo"
        ]
      }
    ]
  },
  {
    id: 'subgroupForest',
    name: 'Subgroup Analysis Forest Plot',
    state: 'ready' as const,
    deprecated: false,
    fields: [
      { id: 'compLabel3', label: 'Component Label', value: 'Subgroup Analysis (Forest Plot)', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
      { id: 'compType3', label: 'Component Type', value: 'Chart', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'dropdown' as const, options: [{label: 'Chart', value: 'Chart'}, {label: 'Table', value: 'Table'}] },
      { id: 'sourceDataset3', label: 'Source Dataset(s)', value: 'ADTTTE, ADSL', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE and Demographics datasets.', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADRESP', value: 'ADRESP'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
      { id: 'sourceVariable3', label: 'Source Variable(s)', value: 'ADSL.AGEGR1, ADSL.SEX, ADSL.ECOGGR1, ADSL.PRIORL, ADSL.PDL1FL, ADTTTE.AVAL, ADTTTE.CNSR', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Subgroup variables derived from ADSL.', inputType: 'multiselect' as const, options: [{label: 'AGEGR1', value: 'AGEGR1'}, {label: 'SEX', value: 'SEX'}, {label: 'ECOGGR1', value: 'ECOGGR1'}, {label: 'PRIORL', value: 'PRIORL'}, {label: 'PDL1FL', value: 'PDL1FL'}] },
      { id: 'filter3', label: 'Filter / Model', value: "Unstratified Cox Proportional Hazards regression by subgroup with treatment-by-subgroup interaction test.", type: 'text', required: false, status: 'default' as FieldStatus, confirmed: false, badge: 'conflict' as const, badgeTooltip: 'Verify whether stratified Cox model is required.', inputType: 'input' as const },
    ],
    display_facts: [
      {
        section: "Subgroups",
        label: "Stratification Factors",
        value: "Overall, Age (<65 vs ≥65), Sex (M vs F), ECOG PS (0 vs 1), Prior Lines (1 vs ≥2), PD-L1 (CPS ≥1 vs <1)",
        details: [
          "Log-scale X-axis (0.2 to 2.0) with reference line at HR = 1.0",
          "Point estimate square size proportional to subgroup sample size",
          "Overall treatment effect represented as diamond marker with 95% CI"
        ]
      }
    ]
  }
];

function MetadataPanel({
  onClose, docType = 'table', isLocked, frozenUntilIndex, pageSepActive, pageColumnCounts = {},
  pageBreakColumns = [], columnCount = 11,
  repeatColumnBaseline = null, onRepeatColumnBaselineChange,
  pageBreakColumnBaseline = null, onPageBreakColumnBaselineChange,
  idpageBaseline = null, idlistBaseline = null, onIdpageBaselineChange, onIdlistBaselineChange,
  onAddChangesToChat, onMetaDiffChange, onRequestUpdateCode, onMetaCancel, baselineAdvanceTrigger, addComponentTrigger, metaUpdateActive, metaUpdateProcessing, submittedDiffItems = [], diffDisplayMode = 'header', targetFieldId, targetBlockName, targetBlockTrigger, onReviewItemsChange, associatedTLStatus = 'pending',
  figureComponents: propsFigureComponents,
  setFigureComponents: propsSetFigureComponents,
  onJumpToTL,
  onQuoteField,
}: MetadataPanelProps) {
  const showPanelDiff = metaUpdateActive && diffDisplayMode === 'panel';
  const [activeTab, setActiveTab] = useState<"basic" | "blocks">("basic");
  const [targetBlockId, setTargetBlockId] = useState<string | null>(null);

  const prevAddComponentTriggerRef = useRef<any>(null);
  useEffect(() => {
    if (addComponentTrigger && addComponentTrigger !== prevAddComponentTriggerRef.current) {
      prevAddComponentTriggerRef.current = addComponentTrigger;
      setActiveTab("blocks");
      handleGenerateComponent(addComponentTrigger.name, addComponentTrigger.type, addComponentTrigger.instructions);
    }
  }, [addComponentTrigger]);

  const [internalFigureComponents, setInternalFigureComponents] = useState<MetadataBlock[]>(INITIAL_FIGURE_COMPONENTS);
  const figureComponents = propsFigureComponents || internalFigureComponents;
  const setFigureComponents = propsSetFigureComponents || setInternalFigureComponents;

  const loadFromSession = <T,>(key: string, fallback: T): T => { try { const raw = sessionStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; } };

  const migrateFields = (stored: any[]): any[] => {
    return stored.map(f => {
      let status: 'default' | 'edited' = 'default';
      let confirmed = false;
      if (f.status === 'edited') {
        status = 'edited';
        confirmed = f.confirmed ?? true;
      } else if (f.status === 'confirmed') {
        status = 'default';
        confirmed = true;
      } else if (f.status === 'unconfirmed') {
        status = 'default';
        confirmed = false;
      } else {
        status = f.status === 'edited' ? 'edited' : 'default';
        confirmed = f.confirmed !== undefined ? !!f.confirmed : false;
      }
      return { id: f.id, label: f.label, value: f.value, status, confirmed, badge: f.badge, badgeTooltip: f.badgeTooltip };
    });
  };

  // ── Container Width Observation for Responsive Top Bar ──
  const panelContainerRef = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (!panelContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsNarrow(entry.contentRect.width < 400);
      }
    });
    observer.observe(panelContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Table States (Original) ──
  const [blockFields, setBlockFields] = useState<{ id: string; label: string; value: string; status: FieldStatus; confirmed: boolean }[]>(() => {
    const fallback = [
      { id: 'blockTitle', label: 'Block Title', value: 'Demographics Summary', status: 'default' as FieldStatus, confirmed: false },
      { id: 'blockType', label: 'Block Type', value: 'table', status: 'default' as FieldStatus, confirmed: false },
      { id: 'idpage', label: 'idpage', value: '1', status: 'default' as FieldStatus, confirmed: false },
      { id: 'idlist', label: 'idlist', value: '1', status: 'default' as FieldStatus, confirmed: false },
      { id: 'filterCondition', label: 'Filter Condition', value: "SAFFL='Y'", status: 'default' as FieldStatus, confirmed: false },
    ];
    const stored = loadFromSession('metadataBlockFields', fallback);
    if (!Array.isArray(stored)) return fallback;
    return migrateFields(stored);
  });
  useEffect(() => { sessionStorage.setItem('metadataBlockFields', JSON.stringify(blockFields)); }, [blockFields]);

  const [blocks, setBlocks] = useState<MetadataBlock[]>(() => {
    const fallback = [
      { id: 'block1', fields: [
        { id: 'f1', label: 'Input Dataset(s)', value: 'ADSL', status: 'default' as FieldStatus, confirmed: false },
        { id: 'f2', label: 'Program Name', value: 't_dm', status: 'default' as FieldStatus, confirmed: false },
        { id: 'f3', label: 'Output Dataset', value: 'ADEFF', status: 'default' as FieldStatus, confirmed: false },
        { id: 'f4', label: 'Population', value: 'Safety', status: 'default' as FieldStatus, confirmed: false },
      ] },
    ];
    const stored = loadFromSession('metadataBlocks', fallback);
    if (!Array.isArray(stored)) return fallback;
    return stored.map(b => ({ ...b, fields: migrateFields(b.fields || []) }));
  });
  useEffect(() => { sessionStorage.setItem('metadataBlocks', JSON.stringify(blocks)); }, [blocks]);

  const [tableBlocks, setTableBlocks] = useState<any[]>(METADATA_BLOCK_ITEMS_DATA);

  const handleTableBlockFieldEdit = (blockId: string, fieldId: string, value: string) => {
    setTableBlocks(prev => prev.map(b => b.id !== blockId ? b : {
      ...b,
      fields: b.fields.map((f: any) => f.id !== fieldId ? f : { ...f, value, status: 'edited' })
    }));
  };

  const [selectedGroupIdx, setSelectedGroupIdx] = useState(() => loadFromSession('metadataSelectedGroupIdx', 0));
  const [groupStatus, setGroupStatus] = useState<FieldStatus>(() => loadFromSession('metadataGroupStatus', 'default'));
  const [groupConfirmed, setGroupConfirmed] = useState(() => loadFromSession('metadataGroupConfirmed', false));
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [blockItemConfirmed, setBlockItemConfirmed] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => { sessionStorage.setItem('metadataSelectedGroupIdx', JSON.stringify(selectedGroupIdx)); }, [selectedGroupIdx]);
  useEffect(() => { sessionStorage.setItem('metadataGroupStatus', JSON.stringify(groupStatus)); }, [groupStatus]);
  useEffect(() => { sessionStorage.setItem('metadataGroupConfirmed', JSON.stringify(groupConfirmed)); }, [groupConfirmed]);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setGroupDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleGroupSelect = (idx: number) => {
    if (idx !== selectedGroupIdx) {
      setSelectedGroupIdx(idx);
      setGroupStatus('edited');
      setGroupConfirmed(true);
    }
    setGroupDropdownOpen(false);
  };

  // ── Listing States (New) ──
  const [listingBlocks, setListingBlocks] = useState<MetadataBlock[]>(() => {
    const fallback = [
      {
        id: 'dataProgramSetup',
        fields: [
          { id: 'inputDatasets', label: 'Input Dataset(s)', value: 'ADSL', status: 'default' as FieldStatus, confirmed: false },
          { id: 'pageBy', label: 'Page by', value: 'USUBJID', status: 'default' as FieldStatus, confirmed: false },
          { id: 'programName', label: 'Program Name', value: 'l_safety', status: 'default' as FieldStatus, confirmed: false },
          { id: 'suffix', label: 'Suffix', value: '', status: 'default' as FieldStatus, confirmed: false },
          { id: 'macrosUsed', label: 'Macro(s) used', value: '%s_listing', status: 'default' as FieldStatus, confirmed: false },
          { id: 'generalFilter', label: 'General Filter', value: '', status: 'default' as FieldStatus, confirmed: false },
        ],
      },
      {
        id: 'layoutRepetitionSorting',
        fields: [
          { id: 'orderlist', label: 'orderlist', value: 'Y#N#N#N#N#N#N#N#N#N#N', status: 'default' as FieldStatus, confirmed: false },
          { id: 'idlist', label: 'idlist', value: '', status: 'default' as FieldStatus, confirmed: false },
          { id: 'idpage', label: 'idpage', value: '', status: 'default' as FieldStatus, confirmed: false },
          { id: 'sort', label: 'Sort', value: 'USUBJID', status: 'default' as FieldStatus, confirmed: false },
        ],
      },
    ];
    const stored = loadFromSession('metadataBlocks_listing', fallback);
    if (!Array.isArray(stored)) return fallback;
    return stored.map(b => ({ ...b, fields: migrateFields(b.fields || []) }));
  });
  useEffect(() => { sessionStorage.setItem('metadataBlocks_listing', JSON.stringify(listingBlocks)); }, [listingBlocks]);

  const [listingColumnFields, setListingColumnFields] = useState<{ id: string; label: string; value: string; status: FieldStatus; confirmed: boolean }[]>(() => {
    const fallback = [
      { id: 'columnXLabel', label: 'Column X Label', value: 'Age', status: 'default' as FieldStatus, confirmed: false },
      { id: 'sourceDatasets', label: 'Source Dataset(s)', value: 'ADSL', status: 'default' as FieldStatus, confirmed: false },
      { id: 'sourceVariables', label: 'Source Variable(s)', value: 'AGE', status: 'default' as FieldStatus, confirmed: false },
      { id: 'outputVariableName', label: 'Output variable name', value: 'AGE', status: 'default' as FieldStatus, confirmed: false },
      { id: 'derivationRule', label: 'Derivation Rule', value: 'Direct copy from ADSL.AGE', status: 'default' as FieldStatus, confirmed: false },
    ];
    const stored = loadFromSession('metadataBlockFields_listing', fallback);
    if (!Array.isArray(stored)) return fallback;
    return migrateFields(stored);
  });
  useEffect(() => { sessionStorage.setItem('metadataBlockFields_listing', JSON.stringify(listingColumnFields)); }, [listingColumnFields]);

  // Dependency Field States
  const [showDepUpdateModal, setShowDepUpdateModal] = useState(false);
  const [showDepDropdown, setShowDepDropdown] = useState(false);

  // ── Figure States ──
  const [figureBlocks, setFigureBlocks] = useState<MetadataBlock[]>(() => [
    {
      id: 'figBasic',
      fields: [
        { id: 'associatedTL', label: 'Associated Table/Listing', value: 'Table 14.1.6.1', status: 'default' as FieldStatus, confirmed: false, dependencyState: 'S1' },
        { id: 'figureType', label: 'Figure Type', value: 'KM', status: 'default' as FieldStatus, confirmed: false },
        { id: 'inputDataset', label: 'Input Dataset(s)', value: 'ADTTTE', status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE dataset naming convention.' },
        { id: 'pageBy', label: 'Page by', value: 'TRTA', status: 'default' as FieldStatus, confirmed: false },
        { id: 'programName', label: 'Program Name', value: 'f_kmplot', status: 'default' as FieldStatus, confirmed: false },
        { id: 'macroName', label: 'Macro(s)', value: 'm_kmplot', status: 'default' as FieldStatus, confirmed: false },
        { id: 'generalFilter', label: 'General Filter', value: "SAFFL='Y'", status: 'default' as FieldStatus, confirmed: false, badge: 'conflict' as const, badgeTooltip: 'Conflicting value detected with SAP specification.' },
        { id: 'groupName', label: 'Group', value: 'Treatment Group', status: 'default' as FieldStatus, confirmed: false },
      ]
    }
  ]);
  useEffect(() => { sessionStorage.removeItem('metadataComponents_figure'); }, []);

  const [hasMetadataComponentEdits, setHasMetadataComponentEdits] = useState(false);

  const [tableFieldBaseline, setTableFieldBaseline] = useState<Record<string, string>>(() => {
    const fallback: Record<string, string> = {};
    blocks.forEach(b => b.fields.forEach(f => { fallback[f.id] = f.value; }));
    fallback['groupName'] = GROUP_OPTIONS[0]?.name || '';
    METADATA_BLOCK_ITEMS_DATA.forEach(b => {
      b.fields.forEach((f: any) => {
        fallback[`${b.id}_${f.id}`] = f.value;
      });
    });
    return loadFromSession('metadataTableFieldBaseline', fallback);
  });
  useEffect(() => { sessionStorage.setItem('metadataTableFieldBaseline', JSON.stringify(tableFieldBaseline)); }, [tableFieldBaseline]);

  const [listingFieldBaseline, setListingFieldBaseline] = useState<Record<string, string>>(() => {
    const fallback: Record<string, string> = {};
    listingBlocks.forEach(b => b.fields.forEach(f => { fallback[f.id] = f.value; }));
    listingColumnFields.forEach(f => { fallback[f.id] = f.value; });
    return loadFromSession('metadataListingFieldBaseline', fallback);
  });
  useEffect(() => { sessionStorage.setItem('metadataListingFieldBaseline', JSON.stringify(listingFieldBaseline)); }, [listingFieldBaseline]);

  const [figureFieldBaseline, setFigureFieldBaseline] = useState<Record<string, string>>(() => {
    const baseline: Record<string, string> = {};
    figureBlocks.forEach(b => b.fields.forEach(f => { baseline[f.id] = f.value; }));
    figureComponents.forEach(b => {
      b.fields.forEach(f => { baseline[f.id] = f.value; });
      b.display_facts?.forEach((fact, factIdx) => {
        baseline[`${b.id}_fact_${factIdx}_label`] = fact.label;
        baseline[`${b.id}_fact_${factIdx}_value`] = fact.value;
        fact.details?.forEach((det, detIdx) => {
          baseline[`${b.id}_fact_${factIdx}_det_${detIdx}`] = det;
        });
      });
    });
    return baseline;
  });

  const [figureComponentDeprecatedBaseline, setFigureComponentDeprecatedBaseline] = useState<Record<string, boolean>>(() => {
    const baseline: Record<string, boolean> = {};
    figureComponents.forEach(c => { baseline[c.id] = !!c.deprecated; });
    return baseline;
  });

  const [figureComponentListBaseline, setFigureComponentListBaseline] = useState<{ id: string; name: string }[]>(() => {
    return figureComponents.map(c => ({ id: c.id, name: c.name || c.id }));
  });

  // Helper functions for listing configuration changes
  const areColumnCountsEqual = (a: Record<string, number>, b: Record<string, number>) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => a[key] === b[key]);
  };

  const arePageBreakColumnsEqual = (a: number[] = [], b: number[] = []) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    return sortedA.every((value, index) => value === sortedB[index]);
  };

  const isRepeatColumnEdited = repeatColumnBaseline != null && repeatColumnBaseline.frozenUntilIndex !== (frozenUntilIndex ?? null);
  const isPageBreakColumnEdited = pageBreakColumnBaseline != null && (
    pageBreakColumnBaseline.pageSepActive !== (pageSepActive ?? false) ||
    !areColumnCountsEqual(pageBreakColumnBaseline.pageColumnCounts ?? {}, pageColumnCounts) ||
    !arePageBreakColumnsEqual(pageBreakColumnBaseline.pageBreakColumns ?? [], pageBreakColumns)
  );

  const metaDiffItems = useMemo<MetaDiffItem[]>(() => {
    const items: MetaDiffItem[] = [];

    if (docType === 'figure') {
      // 1. Basic Block Field Edits (skip tag fields)
      figureBlocks.forEach(b => b.fields.forEach(f => {
        if (f.type === 'tag') return;
        const baseVal = figureFieldBaseline[f.id];
        if (baseVal !== undefined && baseVal !== f.value) {
          items.push({ 
            fieldId: f.id, 
            label: f.label, 
            oldValue: baseVal, 
            newValue: f.value,
            blockId: b.id,
            blockName: b.name || 'Basic Info',
            changeType: 'modified'
          });
        }
      }));

      // 2. Component Field Edits & Display Facts Edits (skip tag fields)
      figureComponents.forEach(b => {
        const isNewComp = !figureComponentListBaseline.some(cb => cb.id === b.id);
        if (isNewComp) return;
        const blockName = b.name || 'Component';

        b.fields.forEach(f => {
          if (f.type === 'tag') return;
          const baseVal = figureFieldBaseline[f.id];
          if (baseVal !== undefined && baseVal !== f.value) {
            items.push({ 
              fieldId: f.id, 
              label: f.label, 
              oldValue: baseVal, 
              newValue: f.value,
              blockId: b.id,
              blockName: blockName,
              changeType: 'modified'
            });
          }
        });

        // Display Facts Diffs
        b.display_facts?.forEach((fact, factIdx) => {
          // Label diff
          const labelKey = `${b.id}_fact_${factIdx}_label`;
          const baseLabelVal = figureFieldBaseline[labelKey];
          if (baseLabelVal !== undefined && baseLabelVal !== fact.label) {
            items.push({
              fieldId: labelKey,
              label: `${fact.section ? fact.section + ' > ' : ''}Label`,
              oldValue: baseLabelVal || '(Empty)',
              newValue: fact.label || '(Empty)',
              blockId: b.id,
              blockName: blockName,
              changeType: 'modified'
            });
          }

          // Value diff
          const factKey = `${b.id}_fact_${factIdx}_value`;
          const baseFactVal = figureFieldBaseline[factKey];
          if (baseFactVal !== undefined && baseFactVal !== fact.value) {
            items.push({
              fieldId: factKey,
              label: `${fact.section ? fact.section + ' > ' : ''}${fact.label || fact.section}`,
              oldValue: baseFactVal,
              newValue: fact.value,
              blockId: b.id,
              blockName: blockName,
              changeType: 'modified'
            });
          }

          // Details diff
          fact.details?.forEach((det, detIdx) => {
            const detKey = `${b.id}_fact_${factIdx}_det_${detIdx}`;
            const baseDetVal = figureFieldBaseline[detKey];
            if (baseDetVal !== undefined && baseDetVal !== det) {
              items.push({
                fieldId: detKey,
                label: `${fact.section ? fact.section + ' > ' : ''}${fact.label || fact.section} (Detail #${detIdx + 1})`,
                oldValue: baseDetVal || '(New detail)',
                newValue: det,
                blockId: b.id,
                blockName: blockName,
                changeType: 'modified'
              });
            } else if (baseDetVal === undefined && det) {
              items.push({
                fieldId: detKey,
                label: `${fact.section ? fact.section + ' > ' : ''}${fact.label || fact.section} (Detail #${detIdx + 1})`,
                oldValue: '(None)',
                newValue: det,
                blockId: b.id,
                blockName: blockName,
                changeType: 'modified'
              });
            }
          });
        });
      });

      // 3. Component Deprecation / Undeprecation
      figureComponents.forEach(c => {
        const baseDep = figureComponentDeprecatedBaseline[c.id];
        const isNewComp = !figureComponentListBaseline.some(cb => cb.id === c.id);
        if (!isNewComp && baseDep !== undefined && baseDep !== !!c.deprecated) {
          const blockName = c.name || 'Component';
          items.push({
            fieldId: `deprecate_${c.id}`,
            label: 'Status',
            oldValue: baseDep ? 'Deprecated' : 'Active',
            newValue: c.deprecated ? 'Deprecated' : 'Active',
            blockId: c.id,
            blockName: blockName,
            changeType: 'modified'
          });
        }
      });

      // 4. Component Deletion (deletion requires update code workflow)
      figureComponentListBaseline.forEach(baseComp => {
        const exists = figureComponents.some(c => c.id === baseComp.id);
        if (!exists) {
          items.push({
            fieldId: `delete_${baseComp.id}`,
            label: baseComp.name,
            oldValue: 'Existing Component',
            newValue: 'Removed',
            blockId: baseComp.id,
            blockName: baseComp.name,
            changeType: 'removed'
          });
        }
      });

      // 5. Component Addition (state === 'ready')
      figureComponents.forEach(c => {
        if (c.state === 'ready') {
          const inBaseline = figureComponentListBaseline.some(cb => cb.id === c.id);
          if (!inBaseline) {
            const blockName = c.name || 'New Component';
            items.push({
              fieldId: `add_${c.id}`,
              label: blockName,
              oldValue: '(None)',
              newValue: blockName,
              blockId: c.id,
              blockName: blockName,
              changeType: 'added'
            });
          }
        }
      });
    } else if (docType === 'listing') {
      listingBlocks.forEach(b => {
        b.fields.forEach(f => {
          const baseVal = listingFieldBaseline[f.id];
          if (baseVal !== undefined && baseVal !== f.value) {
            items.push({
              fieldId: f.id,
              label: f.label,
              oldValue: baseVal,
              newValue: f.value,
              blockId: b.id,
              blockName: 'Basic Info',
              changeType: 'modified'
            });
          }
        });
      });

      listingColumnFields.forEach(f => {
        const baseVal = listingFieldBaseline[f.id];
        if (baseVal !== undefined && baseVal !== f.value) {
          items.push({
            fieldId: f.id,
            label: f.label,
            oldValue: baseVal,
            newValue: f.value,
            blockId: 'columns',
            blockName: 'Column',
            changeType: 'modified'
          });
        }
      });

      if (isRepeatColumnEdited) {
        items.push({
          fieldId: 'freeze_columns',
          label: 'Freeze Columns',
          oldValue: repeatColumnBaseline?.frozenUntilIndex !== null ? `Col 1-${(repeatColumnBaseline?.frozenUntilIndex ?? 0) + 1}` : 'None',
          newValue: frozenUntilIndex !== null ? `Col 1-${frozenUntilIndex + 1}` : 'None',
          blockId: 'layoutRepetitionSorting',
          blockName: 'Basic Info',
          changeType: 'modified'
        });
      }

      if (isPageBreakColumnEdited) {
        items.push({
          fieldId: 'page_breaks',
          label: 'Page Break Columns',
          oldValue: (pageBreakColumnBaseline?.pageBreakColumns?.length || 0) > 0 ? `${pageBreakColumnBaseline?.pageBreakColumns?.length} breaks` : 'None',
          newValue: `${pageBreakColumns.length} breaks`,
          blockId: 'layoutRepetitionSorting',
          blockName: 'Basic Info',
          changeType: 'modified'
        });
      }
    } else {
      // Table diffs:
      // 1. Basic Info fields
      blocks.forEach(b => {
        b.fields.forEach(f => {
          const baseVal = tableFieldBaseline[f.id];
          if (baseVal !== undefined && baseVal !== f.value) {
            items.push({
              fieldId: f.id,
              label: f.label,
              oldValue: baseVal,
              newValue: f.value,
              blockId: b.id,
              blockName: 'Basic Information',
              changeType: 'modified'
            });
          }
        });
      });

      // 2. Group Name
      const currentGroupName = GROUP_OPTIONS[selectedGroupIdx]?.name || '';
      const baseGroupName = tableFieldBaseline['groupName'];
      if (baseGroupName !== undefined && baseGroupName !== currentGroupName) {
        items.push({
          fieldId: 'groupName',
          label: 'Group Name',
          oldValue: baseGroupName,
          newValue: currentGroupName,
          blockId: 'group',
          blockName: 'Basic Information',
          changeType: 'modified'
        });
      }

      // 3. Table Blocks tab
      tableBlocks.forEach(b => {
        b.fields.forEach((f: any) => {
          const fieldKey = `${b.id}_${f.id}`;
          const baseVal = tableFieldBaseline[fieldKey];
          if (baseVal !== undefined && baseVal !== f.value) {
            items.push({
              fieldId: fieldKey,
              label: f.label,
              oldValue: baseVal,
              newValue: f.value,
              blockId: b.id,
              blockName: b.name || 'Block',
              changeType: 'modified'
            });
          }
        });
      });
    }

    return items;
  }, [
    docType,
    figureBlocks, figureComponents, figureFieldBaseline, figureComponentDeprecatedBaseline, figureComponentListBaseline,
    listingBlocks, listingColumnFields, listingFieldBaseline, isRepeatColumnEdited, isPageBreakColumnEdited, repeatColumnBaseline, frozenUntilIndex, pageBreakColumnBaseline, pageBreakColumns,
    blocks, selectedGroupIdx, tableBlocks, tableFieldBaseline
  ]);

  const newDiffItems = useMemo<MetaDiffItem[]>(() => {
    if (!metaUpdateProcessing) return metaDiffItems;
    return metaDiffItems.filter(diff => 
      !submittedDiffItems.some(sub => sub.fieldId === diff.fieldId && sub.newValue === diff.newValue)
    );
  }, [metaDiffItems, metaUpdateProcessing, submittedDiffItems]);

  // ── To be Updated mode computed helpers ──
  /** Map from fieldId → MetaDiffItem for quick lookup in rendering */
  const fieldDiffMap = useMemo<Record<string, MetaDiffItem>>(() => {
    const map: Record<string, MetaDiffItem> = {};
    metaDiffItems.forEach(d => { map[d.fieldId] = d; });
    return map;
  }, [metaDiffItems]);

  const figureBasicBlockIds = useMemo(() => new Set(figureBlocks.map(b => b.id)), [figureBlocks]);
  const figureComponentBlockIds = useMemo(() => new Set(figureComponents.map(c => c.id)), [figureComponents]);

  /** Count of diff items in the Basic Info tab (for tab badge) */
  const basicTabDiffCount = useMemo(() => {
    if (docType === 'figure') {
      return metaDiffItems.filter(d => figureBasicBlockIds.has(d.blockId || '')).length;
    } else if (docType === 'listing') {
      return metaDiffItems.filter(d => d.blockName === 'Basic Info').length;
    } else {
      return metaDiffItems.filter(d => d.blockName === 'Basic Information').length;
    }
  }, [metaDiffItems, figureBasicBlockIds, docType]);

  /** Count of diff items in the Components/Column/Blocks tab (for tab badge) */
  const componentsTabDiffCount = useMemo(() => {
    if (docType === 'figure') {
      return metaDiffItems.filter(d =>
        d.changeType === 'added' || d.changeType === 'removed' || figureComponentBlockIds.has(d.blockId || '')
      ).length;
    } else if (docType === 'listing') {
      return metaDiffItems.filter(d => d.blockId === 'columns').length;
    } else {
      return metaDiffItems.filter(d => d.blockName !== 'Basic Information').length;
    }
  }, [metaDiffItems, figureComponentBlockIds, docType]);

  /** Removed block IDs — used to suppress modified-field rows for deleted components */
  const removedCompBlockIds = useMemo(() =>
    new Set(metaDiffItems.filter(d => d.changeType === 'removed').map(d => d.blockId || '')),
    [metaDiffItems]
  );

  /** Added block IDs — used to show all fields of a new component */
  const addedCompBlockIds = useMemo(() =>
    new Set(metaDiffItems.filter(d => d.changeType === 'added').map(d => d.blockId || '')),
    [metaDiffItems]
  );

  const [lastBaselineTrigger, setLastBaselineTrigger] = useState(0);
  useEffect(() => {
    if (baselineAdvanceTrigger && baselineAdvanceTrigger > lastBaselineTrigger) {
      if (docType === 'table') {
        setTableFieldBaseline(prev => {
          const updated = { ...prev };
          submittedDiffItems.forEach(sub => {
            updated[sub.fieldId] = sub.newValue;
          });
          return updated;
        });
        setBlocks(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map(f => {
            const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === f.id && sub.newValue === f.value);
            return isSubmitted ? { ...f, status: 'default' as const } : f;
          })
        })));
        setTableBlocks(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map((f: any) => {
            const fieldKey = `${b.id}_${f.id}`;
            const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === fieldKey && sub.newValue === f.value);
            return isSubmitted ? { ...f, status: 'default' as const } : f;
          })
        })));
        if (submittedDiffItems.some(sub => sub.fieldId === 'groupName')) {
          setGroupStatus('default');
        }
      } else if (docType === 'listing') {
        setListingFieldBaseline(prev => {
          const updated = { ...prev };
          submittedDiffItems.forEach(sub => {
            updated[sub.fieldId] = sub.newValue;
          });
          return updated;
        });
        setListingBlocks(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map(f => {
            const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === f.id && sub.newValue === f.value);
            return isSubmitted ? { ...f, status: 'default' as const } : f;
          })
        })));
        setListingColumnFields(prev => prev.map(f => {
          const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === f.id && sub.newValue === f.value);
          return isSubmitted ? { ...f, status: 'default' as const } : f;
        }));
      } else {
        setFigureFieldBaseline(prev => {
          const updated = { ...prev };
          submittedDiffItems.forEach(sub => {
            if (!sub.fieldId.startsWith('deprecate_') && !sub.fieldId.startsWith('delete_') && !sub.fieldId.startsWith('add_')) {
              updated[sub.fieldId] = sub.newValue;
            }
          });
          submittedDiffItems.forEach(sub => {
            if (sub.fieldId.startsWith('add_')) {
              const compId = sub.fieldId.replace('add_', '');
              const comp = figureComponents.find(c => c.id === compId);
              if (comp) {
                comp.fields.forEach(f => { updated[f.id] = f.value; });
              }
            }
          });
          return updated;
        });

        setFigureComponentDeprecatedBaseline(prev => {
          const updated = { ...prev };
          submittedDiffItems.forEach(sub => {
            if (sub.fieldId.startsWith('deprecate_')) {
              const compId = sub.fieldId.replace('deprecate_', '');
              updated[compId] = (sub.newValue === 'Deprecated');
            }
          });
          return updated;
        });

        setFigureComponentListBaseline(prev => {
          let updated = [...prev];
          submittedDiffItems.forEach(sub => {
            if (sub.fieldId.startsWith('delete_')) {
              const compId = sub.fieldId.replace('delete_', '');
              updated = updated.filter(c => c.id !== compId);
            } else if (sub.fieldId.startsWith('add_')) {
              const compId = sub.fieldId.replace('add_', '');
              const comp = figureComponents.find(c => c.id === compId);
              if (comp && !updated.some(c => c.id === compId)) {
                updated.push({ id: compId, name: comp.name || compId });
              }
            }
          });
          return updated;
        });
        
        setFigureBlocks(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map(f => {
            const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === f.id && sub.newValue === f.value);
            return isSubmitted ? { ...f, status: 'default' as const } : f;
          })
        })));
        
        setFigureComponents(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map(f => {
            const isSubmitted = submittedDiffItems.some(sub => sub.fieldId === f.id && sub.newValue === f.value);
            return isSubmitted ? { ...f, status: 'default' as const } : f;
          })
        })));
      }

      setLastBaselineTrigger(baselineAdvanceTrigger);
    }
  }, [baselineAdvanceTrigger, submittedDiffItems, docType, figureComponents, lastBaselineTrigger]);

  const reviewItems = useMemo<ReviewItem[]>(() => {
    const items: ReviewItem[] = [];

    // 1. Basic Fields with badge
    figureBlocks.forEach(b => {
      b.fields.forEach(f => {
        if (f.badge && !f.confirmed) {
          items.push({
            type: f.badge,
            fieldName: f.label,
            tooltip: f.badgeTooltip || '',
            blockId: b.id,
            fieldId: f.id
          });
        }
      });
    });

    // 2. Component Fields with badge
    figureComponents.forEach(b => {
      if (b.deprecated || b.state === 'loading') return;
      b.fields.forEach(f => {
        const isConfirmed = blockItemConfirmed[`${b.id}_${f.id}`];
        if (f.badge && !isConfirmed) {
          const compName = b.name || 'Component';
          items.push({
            type: f.badge,
            fieldName: `${f.label} (${compName})`,
            tooltip: f.badgeTooltip || '',
            blockId: b.id,
            fieldId: f.id
          });
        }
      });
    });

    return items;
  }, [figureBlocks, figureComponents, blockItemConfirmed]);

  useEffect(() => {
    onMetaDiffChange?.(metaDiffItems);
    if (docType === 'figure') {
      onReviewItemsChange?.(reviewItems);
    }
  }, [metaDiffItems, reviewItems, docType, onMetaDiffChange, onReviewItemsChange]);

  const handleGenerateComponent = (name: string, type: string, instructions: string) => {
    const newId = `generated-${Date.now()}`;
    const label = name.trim() || instructions.trim().split(/\s+/).slice(0, 4).join(' ') || type;
    
    const loadingBlock: MetadataBlock = {
      id: newId,
      name: label,
      state: 'loading',
      deprecated: false,
      fields: []
    };
    
    setFigureComponents(prev => [...prev, loadingBlock]);
    
    setTimeout(() => {
      setFigureComponents(prev => prev.map(b => b.id === newId ? {
        ...b,
        state: 'ready',
        fields: [
          { id: `${newId}_l`, label: 'Component Label', value: label, type: 'text', required: true, status: 'default', confirmed: false },
          { id: `${newId}_t`, label: 'Component Type', value: type, type: 'text', required: true, status: 'default', confirmed: false },
          { id: `${newId}_d`, label: 'Source Dataset(s)', value: 'ADTTTE', type: 'text', required: true, status: 'default', confirmed: false, badge: 'ai-infer', badgeTooltip: 'Inferred' },
          { id: `${newId}_v`, label: 'Source Variable(s)', value: 'AVAL, PARAM', type: 'tag', required: true, status: 'default', confirmed: false, badge: 'ai-infer', badgeTooltip: 'Inferred' }
        ]
      } : b));
      setHasMetadataComponentEdits(true);
    }, 3600);
  };

  const handleDeprecateComponent = (id: string) => {
    setFigureComponents(prev => prev.map(b => b.id === id ? { ...b, deprecated: !b.deprecated } : b));
    setHasMetadataComponentEdits(true);
  };

  const handleDeleteComponent = (id: string) => {
    setFigureComponents(prev => prev.filter(b => b.id !== id));
    setHasMetadataComponentEdits(true);
  };

  const handleFieldEditComponent = (blockId: string, fieldId: string, value: string) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        fields: b.fields.map(f => f.id === fieldId ? { ...f, value, status: 'edited' as const } : f)
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDisplayFactEdit = (blockId: string, factIdx: number, value: string) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = [...(b.display_facts || [])];
      if (newFacts[factIdx]) {
        newFacts[factIdx] = { ...newFacts[factIdx], value };
      }
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDisplayFactLabelEdit = (blockId: string, factIdx: number, label: string) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = [...(b.display_facts || [])];
      if (newFacts[factIdx]) {
        newFacts[factIdx] = { ...newFacts[factIdx], label };
      }
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDisplayFactDelete = (blockId: string, factIdx: number) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = (b.display_facts || []).filter((_, idx) => idx !== factIdx);
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDetailEdit = (blockId: string, factIdx: number, detailIdx: number, value: string) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = [...(b.display_facts || [])];
      if (newFacts[factIdx]) {
        const newDetails = [...(newFacts[factIdx].details || [])];
        newDetails[detailIdx] = value;
        newFacts[factIdx] = { ...newFacts[factIdx], details: newDetails };
      }
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDetailAdd = (blockId: string, factIdx: number) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = [...(b.display_facts || [])];
      if (newFacts[factIdx]) {
        const newDetails = [...(newFacts[factIdx].details || []), ''];
        newFacts[factIdx] = { ...newFacts[factIdx], details: newDetails };
      }
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  const handleDetailDelete = (blockId: string, factIdx: number, detailIdx: number) => {
    setFigureComponents(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const newFacts = [...(b.display_facts || [])];
      if (newFacts[factIdx]) {
        const newDetails = (newFacts[factIdx].details || []).filter((_, idx) => idx !== detailIdx);
        newFacts[factIdx] = { ...newFacts[factIdx], details: newDetails };
      }
      return {
        ...b,
        display_facts: newFacts
      };
    }));
    setHasMetadataComponentEdits(true);
  };

  // Refs and Auto-scrolling to the first affected field on mount
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (docType === 'listing') {
      setTimeout(() => {
        if (isRepeatColumnEdited && fieldRefs.current['idlist']) {
          fieldRefs.current['idlist'].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (isPageBreakColumnEdited && fieldRefs.current['idpage']) {
          fieldRefs.current['idpage'].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, []);

  useEffect(() => {
    if (targetFieldId) {
      const cleanId = targetFieldId.replace('deprecate_', '').replace('delete_', '').replace('add_', '');
      const isCompField = figureComponents.some(c => c.id === cleanId || c.fields.some(f => f.id === cleanId));
      if (isCompField) {
        setActiveTab("blocks");
      } else {
        setActiveTab("basic");
      }

      setTimeout(() => {
        const el = fieldRefs.current[cleanId] || fieldRefs.current[targetFieldId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const inputEl = el.querySelector('input, select, textarea') as HTMLElement | null;
          if (inputEl) {
            inputEl.focus();
          }
        }
      }, 200);
    }
  }, [targetFieldId, figureComponents]);

  // Deep-link from a Shell Preview block click: open the Blocks tab with that block selected.
  // Keyed off a trigger so clicking the same block twice still re-selects it.
  useEffect(() => {
    if (!targetBlockName) return;
    setActiveTab("blocks");

    let targetId: string | null = null;
    if (docType === 'figure') {
      const match = figureComponents.find((c: any) => 
        c.name === targetBlockName || 
        c.id === targetBlockName ||
        ((targetBlockName.includes('KM Plot') || targetBlockName.includes('Kaplan-Meier')) && (c.id === 'kmCurve' || c.name.includes('Kaplan-Meier'))) ||
        (targetBlockName.includes('Risk Table') && (c.id === 'riskTable' || c.name.includes('Risk Table'))) ||
        ((targetBlockName.includes('Subgroup') || targetBlockName.includes('Forest')) && (c.id === 'subgroupForest' || c.name.includes('Subgroup')))
      );
      if (match) {
        targetId = match.id;
      }
    } else if (docType === 'listing') {
      setActiveTab("blocks");
    } else {
      const match = METADATA_BLOCK_ITEMS_DATA.find(b => b.name === targetBlockName || b.id === targetBlockName);
      if (match) {
        targetId = match.id;
      }
    }

    if (targetId) {
      setTargetBlockId(targetId);
    }
  }, [targetBlockName, targetBlockTrigger, docType, figureComponents]);

  // ── Stats ──
  const isBasicTab = activeTab === 'basic';
  
  // Table stats
  const basicTotalFields = blocks.reduce((s, b) => s + b.fields.length, 0) + 1;
  const basicConfirmedCount = blocks.reduce((s, b) => s + b.fields.filter(f => f.confirmed).length, 0) + (groupConfirmed ? 1 : 0);
  const blocksTotalFields = METADATA_BLOCK_ITEMS_DATA.reduce((sum, b) => sum + b.fields.length, 0);
  const blocksConfirmedCount = METADATA_BLOCK_ITEMS_DATA.reduce((sum, b) => sum + b.fields.filter(f => blockItemConfirmed[`${b.id}_${f.id}`]).length, 0);

  // Listing stats
  const listingTotalFields = listingBlocks.reduce((s, b) => s + b.fields.length, 0);
  const listingConfirmedCount = listingBlocks.reduce((s, b) => s + b.fields.filter(f => {
    if (f.id === 'idlist') return !isRepeatColumnEdited && f.confirmed;
    if (f.id === 'idpage') return !isPageBreakColumnEdited && f.confirmed;
    return f.confirmed;
  }).length, 0);
  const listingColumnTotalFields = listingColumnFields.length;
  const listingColumnConfirmedCount = listingColumnFields.filter(f => f.confirmed).length;

  const figureTotalFieldsBasic = figureBlocks.reduce((s, b) => s + b.fields.length, 0);
  const figureConfirmedCountBasic = figureBlocks.reduce((s, b) => s + b.fields.filter(f => f.confirmed).length, 0);
  const figureTotalFieldsComponents = figureComponents.filter(c => c.state !== 'loading' && !c.deprecated).reduce((sum, b) => sum + b.fields.length, 0);
  const figureConfirmedCountComponents = figureComponents.filter(c => c.state !== 'loading' && !c.deprecated).reduce((sum, b) => sum + b.fields.filter(f => blockItemConfirmed[`${b.id}_${f.id}`]).length, 0);

  const totalFields = docType === 'listing'
    ? (isBasicTab ? listingTotalFields : listingColumnTotalFields)
    : docType === 'figure'
      ? (isBasicTab ? figureTotalFieldsBasic : figureTotalFieldsComponents)
      : (isBasicTab ? basicTotalFields : blocksTotalFields);

  const confirmedCount = docType === 'listing'
    ? (isBasicTab ? listingConfirmedCount : listingColumnConfirmedCount)
    : docType === 'figure'
      ? (isBasicTab ? figureConfirmedCountBasic : figureConfirmedCountComponents)
      : (isBasicTab ? basicConfirmedCount : blocksConfirmedCount);

  const confirmableFields = totalFields;

  // ── Edits ──
  const hasListingBasicEdits = listingBlocks.some(b => b.fields.some(f => {
    if (f.id === 'idlist') return isRepeatColumnEdited;
    if (f.id === 'idpage') return isPageBreakColumnEdited;
    return f.status === 'edited' && !f.confirmed;
  }));
  const hasListingColumnEdits = listingColumnFields.some(f => f.status === 'edited' && !f.confirmed);

  const hasAnyEdits = docType === 'listing'
    ? (hasListingBasicEdits || hasListingColumnEdits)
    : docType === 'figure'
      ? hasMetadataComponentEdits || figureBlocks.some(b => b.fields.some(f => f.status === 'edited')) || figureComponents.some(b => b.fields.some(f => f.status === 'edited'))
      : (groupStatus === 'edited' || blockFields.some(f => f.status === 'edited') || blocks.some(b => b.fields.some(f => f.status === 'edited')));

  const selectAllState: "empty" | "indeterminate" | "checked" = confirmedCount === 0 ? "empty" : confirmedCount === confirmableFields ? "checked" : "indeterminate";

  // ── Confirms & Edits Handlers ──
  const handleConfirm = (blockId: string, fieldId: string) => {
    if (docType === 'listing') {
      if (fieldId === 'idlist') {
        const field = listingBlocks.find(b => b.id === blockId)?.fields.find(f => f.id === fieldId);
        const isCurrentlyConfirmed = isRepeatColumnEdited ? false : !!field?.confirmed;
        const nextConfirmed = !isCurrentlyConfirmed;
        if (nextConfirmed) {
          onRepeatColumnBaselineChange?.({ frozenUntilIndex: frozenUntilIndex ?? null });
        }
        setListingBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, confirmed: nextConfirmed }) }));
      } else if (fieldId === 'idpage') {
        const field = listingBlocks.find(b => b.id === blockId)?.fields.find(f => f.id === fieldId);
        const isCurrentlyConfirmed = isPageBreakColumnEdited ? false : !!field?.confirmed;
        const nextConfirmed = !isCurrentlyConfirmed;
        if (nextConfirmed) {
          onPageBreakColumnBaselineChange?.({ pageSepActive: pageSepActive ?? false, pageColumnCounts, pageBreakColumns: [...pageBreakColumns] });
        }
        setListingBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, confirmed: nextConfirmed }) }));
      } else {
        setListingBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, confirmed: !f.confirmed }) }));
      }
    } else if (docType === 'figure') {
      setFigureBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, confirmed: !f.confirmed }) }));
    } else {
      setBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, confirmed: !f.confirmed }) }));
    }
  };

  const handleBlockFieldConfirm = (fieldId: string) => {
    setBlockFields(prev => prev.map(f => f.id !== fieldId ? f : { ...f, confirmed: !f.confirmed }));
  };

  const handleIdFieldConfirm = (fieldId: string) => {
    const isIdpage = fieldId === 'idpage';
    const baseline = isIdpage ? idpageBaseline : idlistBaseline;
    const areEqual = (a: Record<string, number>, b: Record<string, number>) => { const ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every(k => a[k] === b[k]); };
    const pending = baseline !== null && (baseline.frozenUntilIndex !== frozenUntilIndex || baseline.pageSepActive !== pageSepActive || !areEqual(baseline.pageColumnCounts, pageColumnCounts));
    const field = blockFields.find(f => f.id === fieldId)!;
    const isCurrentlyConfirmed = pending ? false : field.confirmed;
    const nextConfirmed = !isCurrentlyConfirmed;
    if (nextConfirmed) {
      const newBaseline = { frozenUntilIndex: frozenUntilIndex ?? null, pageSepActive: pageSepActive ?? false, pageColumnCounts };
      if (isIdpage) onIdpageBaselineChange?.(newBaseline); else onIdlistBaselineChange?.(newBaseline);
    }
    setBlockFields(prev => prev.map(f => f.id !== fieldId ? f : { ...f, confirmed: nextConfirmed }));
  };

  const handleBlockFieldEdit = (fieldId: string, value: string) => {
    setBlockFields(prev => prev.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }));
  };

  const handleListingColumnFieldEdit = (fieldId: string, value: string) => {
    setListingColumnFields(prev => prev.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }));
  };

  const handleSelectAll = () => {
    const confirm = selectAllState === 'empty' || selectAllState === 'indeterminate';
    if (docType === 'listing') {
      if (isBasicTab) {
        if (confirm) {
          if (isRepeatColumnEdited) {
            onRepeatColumnBaselineChange?.({ frozenUntilIndex: frozenUntilIndex ?? null });
          }
          if (isPageBreakColumnEdited) {
            onPageBreakColumnBaselineChange?.({ pageSepActive: pageSepActive ?? false, pageColumnCounts, pageBreakColumns: [...pageBreakColumns] });
          }
        }
        setListingBlocks(prev => prev.map(b => ({
          ...b,
          fields: b.fields.map(f => ({ ...f, confirmed: confirm }))
        })));
      } else {
        setListingColumnFields(prev => prev.map(f => ({ ...f, confirmed: confirm })));
      }
    } else if (docType === 'figure') {
      if (isBasicTab) {
        setFigureBlocks(prev => prev.map(b => ({ ...b, fields: b.fields.map(f => ({ ...f, confirmed: confirm })) })));
      } else {
        const newConfirmed: Record<string, boolean> = {};
        figureComponents.forEach(b => {
          b.fields.forEach(f => {
            newConfirmed[`${b.id}_${f.id}`] = confirm;
          });
        });
        setBlockItemConfirmed(newConfirmed);
      }
    } else {
      if (isBasicTab) {
        if (groupStatus !== 'edited') setGroupConfirmed(confirm);
        setBlocks(prev => prev.map(b => ({ ...b, fields: b.fields.map(f => ({ ...f, confirmed: confirm })) })));
      } else {
        const newConfirmed: Record<string, boolean> = {};
        METADATA_BLOCK_ITEMS_DATA.forEach(b => {
          b.fields.forEach(f => {
            newConfirmed[`${b.id}_${f.id}`] = confirm;
          });
        });
        setBlockItemConfirmed(newConfirmed);
      }
    }
  };

  const handleFieldEdit = (blockId: string, fieldId: string, value: string) => {
    if (docType === 'listing') {
      setListingBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }) }));
    } else if (docType === 'figure') {
      setFigureBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }) }));
    } else {
      setBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }) }));
    }
  };

  const handleUpdateCode = () => {
    if (docType === 'listing') {
      if (isRepeatColumnEdited) {
        onRepeatColumnBaselineChange?.({ frozenUntilIndex: frozenUntilIndex ?? null });
      }
      if (isPageBreakColumnEdited) {
        onPageBreakColumnBaselineChange?.({ pageSepActive: pageSepActive ?? false, pageColumnCounts, pageBreakColumns: [...pageBreakColumns] });
      }
      setListingBlocks(prev => prev.map(b => ({
        ...b,
        fields: b.fields.map(f => f.status === 'edited' ? { ...f, status: 'default' } : f)
      })));
      setListingColumnFields(prev => prev.map(f => f.status === 'edited' ? { ...f, status: 'default' } : f));
    } else {
      if (groupStatus === 'edited') setGroupStatus('default');
      setBlocks(prev => prev.map(b => ({ ...b, fields: b.fields.map(f => f.status === 'edited' ? { ...f, status: 'default' } : f) })));
      setBlockFields(prev => prev.map(f => f.status === 'edited' ? { ...f, status: 'default' } : f));
    }
  };

  const getEffectiveStatus = (fieldId: string | null, status: FieldStatus, currentValue: string | null) => {
    if (metaUpdateProcessing && fieldId && currentValue !== null) {
      if (submittedDiffItems.some(sub => sub.fieldId === fieldId && sub.newValue === currentValue)) {
        return 'default';
      }
    }
    return status;
  };

  const getFieldStyles = (status: FieldStatus, isReadOnlyField: boolean = false) => {
    if (isReadOnlyField) {
      // Temporarily hide 'edited' status styling
      // if (status === 'edited') {
      //   return { containerBg: "bg-[#FCEECC]", containerBorder: "border-[#F0AB00]", inputBorder: "border-transparent" };
      // }
      return { containerBg: "bg-transparent", containerBorder: "border-transparent", inputBorder: "border-transparent" };
    }
    // Temporarily hide 'edited' status styling
    // if (status === "edited") {
    //   return { containerBg: "bg-[#FCEECC]", containerBorder: "border-[#F0AB00]", inputBorder: "border-transparent" };
    // }
    return { containerBg: "bg-white", containerBorder: "border-transparent", inputBorder: "border-[#D8DADA]" };
  };

  const selectAllCheckboxIcon = () => {
    if (selectAllState === "checked") return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
    if (selectAllState === "indeterminate") return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><rect x="5" y="9" width="10" height="2" fill="white" /></>;
    return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 20 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
  };

  const fieldCheckboxIcon = (confirmed: boolean) => {
    if (!confirmed) return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 20 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
    return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
  };

  const groupStyles = getFieldStyles(groupStatus, false);
  const [deleteConfirmBlockId, setDeleteConfirmBlockId] = useState<string | null>(null);

  return (
    <div ref={panelContainerRef} className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-graphite-10 bg-white flex-nowrap min-w-0 overflow-hidden">
        <div className="flex h-full items-center min-w-0 shrink-0">
          {(["basic", "blocks"] as const).map((tab) => {
            const tabCount = tab === 'basic' ? basicTabDiffCount : componentsTabDiffCount;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`relative flex h-full items-center justify-center border-b-2 ${isNarrow ? 'px-[8px]' : 'px-[16px]'} active:scale-[0.96] shrink-0 ${activeTab === tab ? "border-brand-1" : "border-transparent"}`}>
                <div className="flex items-center gap-[4px]">
                  <p className={`t-small font-medium ${activeTab === tab ? "text-brand-1" : "text-text-primary"} whitespace-nowrap`}>
                    {tab === "basic" ? (docType === 'listing' ? "Basic info" : docType === 'figure' ? "Basic" : (isNarrow ? "Basic" : "Basic Information")) : (docType === 'listing' ? "Column" : docType === 'figure' ? "Components" : "Blocks")}
                  </p>
                  {/* To be Updated: Header-style count badge attached right next to title */}
                  {showPanelDiff && tabCount > 0 && (
                    <div className="bg-graphite-10 flex items-center justify-center px-[4px] py-px rounded-[16px] shrink-0 min-w-[16px] h-[16px]">
                      <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-text-secondary whitespace-nowrap">
                        <p className="leading-[14px]">{tabCount}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Listing: red dot for unconfirmed edits */}
                {docType === 'listing' && (
                  tab === 'basic' ? (
                    hasListingBasicEdits && <span className="absolute right-[6px] top-[8px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />
                  ) : (
                    hasListingColumnEdits && <span className="absolute right-[6px] top-[8px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />
                  )
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center pr-[12px] gap-[6px] shrink-0">
          {/* Secondary Button when in Updated / To be updated mode */}
          {showPanelDiff && (
            <button
              onClick={() => onMetaCancel?.()}
              className="flex h-[24px] items-center justify-center gap-[4px] rounded-[4px] bg-graphite-20 hover:bg-graphite-40 px-[8px] t-small font-medium text-text-primary active:scale-[0.96] transition-all cursor-pointer select-none shrink-0"
              title="Cancel updated view and return to normal editing mode"
            >
              <span>{isNarrow ? 'Cancel' : 'Cancel update'}</span>
            </button>
          )}

          {/* Update Code button moved to Tab bar right side, left of Batch Edit Macro */}
          {((metaUpdateProcessing && newDiffItems.length > 0) || (!metaUpdateProcessing && metaDiffItems.length > 0 && !metaUpdateActive)) && (() => {
            const isUpdateDisabled = metaUpdateProcessing || (isLocked && metaDiffItems.length > 0);
            return (
              <button
                onClick={isUpdateDisabled ? undefined : () => {
                  onRequestUpdateCode?.();
                }}
                disabled={isUpdateDisabled}
                title={isNarrow ? `Update Code (${metaDiffItems.length})` : undefined}
                className={`flex h-[24px] items-center justify-center gap-[4px] rounded-[4px] ${isNarrow ? 'w-[24px] px-0' : 'px-[8px]'} text-[12px] font-medium transition-all shrink-0 ${
                  isUpdateDisabled
                    ? 'bg-border-default text-text-secondary cursor-not-allowed'
                    : 'bg-brand-1 text-white hover:bg-[#6D0043] active:scale-[0.98]'
                }`}
              >
                <LocalIcon src={addMetadiffIconUrl} className="h-[14px] w-[14px]" color={isUpdateDisabled ? '#888E8E' : 'white'} />
                {!isNarrow && <span>Update Code</span>}
                {!isNarrow && !metaUpdateProcessing && (
                  <div className="flex items-center justify-center h-[14px] min-w-[14px] px-[3px] py-px rounded-[10px] bg-white/20 shrink-0">
                    <span className="text-[10px] leading-[12px] font-medium text-white">{metaDiffItems.length}</span>
                  </div>
                )}
              </button>
            );
          })()}

          <TooltipText label="Batch Edit Macro">
            <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] shrink-0" aria-label="Batch edit">
              <LocalIcon src={batchMicroIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
            </button>
          </TooltipText>
        </div>
      </div>

      {/* Status Bar: Only show for basic tab (blocks tab has its own confirm bar inside BlocksTabContent) */}
      {!showPanelDiff && activeTab === 'basic' && (
        <div className="flex items-center justify-end bg-bg-panel px-[12px] py-[8px]">
          <div className="flex items-center gap-[6px]">
            <button onClick={isLocked ? undefined : handleSelectAll} disabled={isLocked}
              className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
              aria-label="Select all">
              <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{selectAllCheckboxIcon()}</SvgIcon>
            </button>
            <p className="t-small text-text-primary">{confirmedCount}/{totalFields} confirmed</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`min-h-0 flex-1 ${activeTab === "blocks" && !showPanelDiff ? 'flex flex-col' : 'overflow-auto p-[4px]'}`}>
        {activeTab === "basic" && (
          <div className="flex flex-col gap-[4px]">
            {docType === 'listing' ? (
              // Listing Basic Tab
              showPanelDiff ? (
                <div className="flex flex-col gap-[12px] p-[8px]">
                  {(() => {
                    const listingBasicDiffs = metaDiffItems.filter(d => d.blockName === 'Basic Info');
                    if (listingBasicDiffs.length === 0) {
                      return <p className="text-center text-text-secondary t-small py-[20px]">No changes in Basic Info</p>;
                    }
                    return listingBasicDiffs.map(diff => (
                      <div key={diff.fieldId} className="group relative">
                        {onQuoteField && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onQuoteField(diff.fieldId, diff.label, 'Basic Info'); }}
                            className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                            title={`Quote "${diff.label}"`}
                            aria-label={`Quote "${diff.label}"`}
                          >
                            <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                          </button>
                        )}
                        <FormItem label={diff.label} disabled={true}>
                          <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                            <span className="text-text-secondary line-through">
                              {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                            </span>
                            <span className="text-text-secondary">→</span>
                            <span className="text-brand-1 font-medium">
                              {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                            </span>
                          </div>
                        </FormItem>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
              listingBlocks.map((block) => (
                <div key={block.id} className="flex flex-col gap-[4px]">
                  {block.fields.map((field) => {
                    const isFieldRepeatEdited = field.id === 'idlist' && isRepeatColumnEdited;
                    const isFieldPageBreakEdited = field.id === 'idpage' && isPageBreakColumnEdited;
                    const isFieldLayoutEdited = isFieldRepeatEdited || isFieldPageBreakEdited;

                    const fieldStatus = isFieldLayoutEdited ? 'edited' : field.status;
                    const isConfirmed = isFieldLayoutEdited ? false : field.confirmed;
                    const isReadOnlyField = field.id === 'idlist' || field.id === 'idpage';

                    const styles = getFieldStyles(getEffectiveStatus(field.id, fieldStatus, field.value), isReadOnlyField);

                    // Compute values for idlist and idpage
                    let displayValue = field.value;

                    if (field.id === 'idlist') {
                      displayValue = Array.from({ length: columnCount }, (_, i) => frozenUntilIndex !== null && i <= frozenUntilIndex ? 'Y' : 'N').join('#');
                    } else if (field.id === 'idpage') {
                      displayValue = Array.from({ length: columnCount }, (_, i) => pageBreakColumns.includes(i - 1) ? 'Y' : 'N').join('#');
                    }

                    return (
                      <div key={field.id} ref={el => { fieldRefs.current[field.id] = el; }} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                        <div className="p-[8px]">
                          <FormItem
                            label={field.label}
                            required={field.required}
                            disabled={isLocked}
                            badge={field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined}
                            actionButton={
                              <button
                                onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)}
                                disabled={isLocked}
                                className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                                aria-label={isConfirmed ? "Unconfirm" : "Confirm"}
                              >
                                <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(isConfirmed)}</SvgIcon>
                              </button>
                            }
                            error={fieldStatus === 'error' ? field.errorMessage : undefined}
                          >
                            <BaseInput
                              value={displayValue}
                              readOnly={isLocked || isReadOnlyField}
                              disabled={isLocked && !isReadOnlyField}
                              readOnlyView={isReadOnlyField}
                              hasError={fieldStatus === 'error'}
                              onChange={isLocked || isReadOnlyField ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                            />
                          </FormItem>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
              )
            ) : docType === 'figure' ? (
              // Figure Basic Tab
              showPanelDiff ? (
                // ── To be Updated mode: cardless flat list derived from Readonly state ──
                <div className="flex flex-col gap-[12px] p-[8px]">
                  {(() => {
                    const basicDiffs = metaDiffItems.filter(d =>
                      d.changeType === 'modified' && figureBasicBlockIds.has(d.blockId || '')
                    );
                    if (basicDiffs.length === 0) {
                      return (
                        <p className="text-center text-text-secondary t-small py-[20px]">No changes in Basic Info</p>
                      );
                    }
                    return basicDiffs.map(diff => {
                      const block = figureBlocks.find(b => b.fields.some(f => f.id === diff.fieldId));
                      const field = block?.fields.find(f => f.id === diff.fieldId);
                      if (!field || !block) return null;
                      return (
                        <div
                          key={field.id}
                          ref={el => { fieldRefs.current[field.id] = el; }}
                          className="group relative"
                        >
                          {onQuoteField && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onQuoteField(field.id, field.label, 'Basic Info'); }}
                              className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                              title={`Quote "${field.label}"`}
                              aria-label={`Quote "${field.label}"`}
                            >
                              <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                            </button>
                          )}
                          <FormItem
                            label={field.label}
                            required={field.required}
                            disabled={true}
                            badge={field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined}
                            actionButton={
                              <button
                                disabled={true}
                                className="flex h-[16px] w-[16px] items-center justify-center cursor-not-allowed opacity-40"
                                aria-label={field.confirmed ? "Confirmed" : "Unconfirmed"}
                              >
                                <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                              </button>
                            }
                            error={field.status === 'error' ? field.errorMessage : undefined}
                          >
                            {/* Readonly-derived diff text: clean text line without input box or outer card */}
                            <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                              <span className="text-text-secondary line-through">
                                {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                              </span>
                              <span className="text-text-secondary">→</span>
                              <span className="text-brand-1 font-medium">
                                {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                              </span>
                            </div>
                          </FormItem>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
              // ── Normal mode ──
              <>
                {figureBlocks.map((block) =>
                  block.fields.map((field) => {
                    const isAssociatedTL = field.id === 'associatedTL';
                    const styles = getFieldStyles(getEffectiveStatus(field.id, field.status, field.value), false);

                    if (isAssociatedTL) {
                      const state = field.dependencyState || 'S1';
                      const isS0 = state === 'S0';
                      const isS1 = state === 'S1';
                      const isS2 = state === 'S2';
                      const isS3 = state === 'S3';
                      const isS4 = state === 'S4';
                      
                      let bgClass = 'bg-graphite-10';
                      let borderClass = 'border-transparent';
                      let textColorHex = '#3C4242';

                      if (isS0) {
                        bgClass = 'bg-transparent';
                        borderClass = 'border-transparent';
                        textColorHex = '#999999';
                      } else if (isS2) {
                        bgClass = 'bg-status-warning-bg';
                        borderClass = 'border-status-warning-border border-solid';
                        textColorHex = 'var(--color-status-warning-text)';
                      } else if (isS3) {
                        bgClass = 'bg-bg-panel';
                        borderClass = 'border-border-default border-solid';
                        textColorHex = 'var(--color-text-secondary)';
                      } else if (isS4) {
                        bgClass = 'bg-status-error-bg';
                        borderClass = 'border-status-error-border border-solid';
                        textColorHex = 'var(--color-status-error-text)';
                      } else { // S1
                        bgClass = 'bg-white';
                        borderClass = styles.inputBorder || 'border-border-default border-solid';
                        textColorHex = '#3C4242';
                      }

                      return (
                        <div key={field.id} className={`group relative ${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                          {onQuoteField && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onQuoteField(field.id, field.label, 'Basic Info'); }}
                              className="absolute right-[8px] top-[8px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                              title={`Quote "${field.label}"`}
                              aria-label={`Quote "${field.label}"`}
                            >
                              <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                            </button>
                          )}
                          <FormItem
                            label={field.label}
                            required={field.required}
                            disabled={isLocked}
                            badge={field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined}
                            actionButton={
                              <button onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)} disabled={isLocked}
                                className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                                aria-label={field.confirmed ? "Unconfirm" : "Confirm"}>
                                <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                              </button>
                            }
                            error={field.status === 'error' ? field.errorMessage : undefined}
                          >
                            <div className="relative w-full flex items-center gap-[16px]">
                              <div className="flex-1 min-w-0">
                                <Dropdown
                                  value={isS0 ? null : field.value}
                                  options={[
                                    { label: 'Table 14.1.6.1', value: 'Table 14.1.6.1' },
                                    { label: 'Table 14.1.6.1', value: 'Table 14.1.6.1' },
                                    { label: 'Listing 16.2.1', value: 'Listing 16.2.1' },
                                  ]}
                                  onChange={(val) => {
                                    if (val !== field.value) {
                                      handleFieldEdit(block.id, field.id, val);
                                      const newBlocks = [...figureBlocks];
                                      const blk = newBlocks.find(b => b.id === block.id);
                                      if (blk) {
                                        const f = blk.fields.find(f => f.id === field.id);
                                        if (f) {
                                          f.dependencyState = 'S1';
                                          f.status = 'edited';
                                        }
                                      }
                                      setFigureBlocks(newBlocks);
                                    }
                                  }}
                                  disabled={isLocked}
                                  placeholder="Optional"
                                  customBoxClass={isS0 ? undefined : `border-[1px] ${borderClass} ${bgClass}`}
                                  customTextColor={isS0 ? undefined : textColorHex}
                                  customTextStyle={{ textDecoration: isS3 ? 'line-through' : 'none' }}
                                  triggerClassName="min-h-[32px] px-[8px] py-[4px] rounded-[2px]"
                                  suffixNode={
                                    isS2 ? (
                                      <TooltipText label="Update Dependency">
                                        <button onClick={() => setShowDepUpdateModal(true)} className="flex items-center justify-center h-[24px] px-[8px] bg-white rounded-[4px] border border-status-warning-border hover:bg-black/5 mr-[4px]">
                                          <span className="text-[12px] font-medium text-status-warning-text">Update</span>
                                        </button>
                                      </TooltipText>
                                    ) : undefined
                                  }
                                />
                              </div>
                              {!isS0 && !!field.value && (
                                <div className="flex items-center gap-[4px] shrink-0">
                                  <TooltipText label="Unlink">
                                    <button 
                                      onClick={isLocked ? undefined : () => {
                                        handleFieldEdit(block.id, field.id, '');
                                        const newBlocks = [...figureBlocks];
                                        const blk = newBlocks.find(b => b.id === block.id);
                                        if (blk) {
                                          const f = blk.fields.find(f => f.id === field.id);
                                          if (f) {
                                            f.dependencyState = 'S0';
                                            f.status = 'edited';
                                          }
                                        }
                                        setFigureBlocks(newBlocks);
                                      }} 
                                      className={`flex items-center justify-center h-[20px] w-[20px] rounded-[2px] transition-colors ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                                      disabled={isLocked}
                                    >
                                      <LocalIcon src={linkUnlinkIconUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
                                    </button>
                                  </TooltipText>
                                  <TooltipText label="Go to Dependency">
                                    <button 
                                      onClick={() => onJumpToTL && onJumpToTL(field.value)} 
                                      className="flex items-center justify-center h-[20px] w-[20px] rounded-[2px] transition-colors hover:bg-black/5 active:scale-[0.96]"
                                    >
                                      <LocalIcon src={focusIconUrl} className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
                                    </button>
                                  </TooltipText>
                                </div>
                              )}
                            </div>
                          </FormItem>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id}
                        className={`group relative ${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}
                      >
                        {onQuoteField && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onQuoteField(field.id, field.label, 'Basic Info'); }}
                            className="absolute right-[8px] top-[8px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                            title={`Quote "${field.label}"`}
                            aria-label={`Quote "${field.label}"`}
                          >
                            <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                          </button>
                        )}
                        <div className="p-[8px]">
                          <FormItem
                            label={field.label}
                            required={field.required}
                            disabled={isLocked}
                            badge={field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined}
                            actionButton={
                              <button onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)} disabled={isLocked}
                                className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                                aria-label={field.confirmed ? "Unconfirm" : "Confirm"}>
                                <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                              </button>
                            }
                            error={field.status === 'error' ? field.errorMessage : undefined}
                          >
                            <BaseInput
                              value={field.value}
                              readOnly={isLocked}
                              disabled={isLocked}
                              hasError={field.status === 'error'}
                              onChange={isLocked ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                            />
                          </FormItem>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
              )
            ) : (
              // Table Basic Tab (Original)
              showPanelDiff ? (
                <div className="flex flex-col gap-[12px] p-[8px]">
                  {(() => {
                    const tableDiffs = metaDiffItems.filter(d => d.blockName === 'Basic Information');
                    if (tableDiffs.length === 0) {
                      return <p className="text-center text-text-secondary t-small py-[20px]">No changes in Basic Information</p>;
                    }
                    return tableDiffs.map(diff => (
                      <div key={diff.fieldId} className="group relative">
                        {onQuoteField && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onQuoteField(diff.fieldId, diff.label, 'Basic Information'); }}
                            className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                            title={`Quote "${diff.label}"`}
                            aria-label={`Quote "${diff.label}"`}
                          >
                            <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                          </button>
                        )}
                        <FormItem label={diff.label} disabled={true}>
                          <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                            <span className="text-text-secondary line-through">
                              {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                            </span>
                            <span className="text-text-secondary">→</span>
                            <span className="text-brand-1 font-medium">
                              {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                            </span>
                          </div>
                        </FormItem>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
              <>
                {blocks.map((block) =>
                  block.fields.map((field) => {
                    const styles = getFieldStyles(getEffectiveStatus(field.id, field.status, field.value), false);
                    return (
                      <div key={field.id} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                        <div className="p-[8px]">
                          <FormItem
                            label={field.label}
                            required={field.required}
                            disabled={isLocked}
                            badge={field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined}
                            actionButton={
                              <button onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)} disabled={isLocked}
                                className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                                aria-label={field.confirmed ? "Unconfirm" : "Confirm"}>
                                <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                              </button>
                            }
                            error={field.status === 'error' ? field.errorMessage : undefined}
                          >
                            <BaseInput
                              value={field.value}
                              readOnly={isLocked}
                              disabled={isLocked}
                              hasError={field.status === 'error'}
                              onChange={isLocked ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                            />
                          </FormItem>
                        </div>
                      </div>
                    );
                  })
                )}
                {/* Group Name */}
                <div className={`${groupStyles.containerBg} rounded-[4px] border ${groupStyles.containerBorder}`}>
                  <div className="flex flex-col gap-[4px] p-[8px]">
                    <div className="flex h-[20px] items-center justify-between">
                      <p className="t-small text-text-primary">Group Name</p>
                      <button onClick={isLocked ? undefined : () => { if (groupStatus !== 'edited') setGroupConfirmed(!groupConfirmed); }} disabled={isLocked}
                        className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                        aria-label={groupConfirmed ? "Unconfirm" : "Confirm"}>
                        <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(groupConfirmed)}</SvgIcon>
                      </button>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <button onClick={isLocked ? undefined : () => setGroupDropdownOpen(!groupDropdownOpen)} disabled={isLocked}
                        className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border t-small text-left flex items-center justify-between ${isLocked ? 'bg-bg-panel border-transparent text-[#B2B4B4] cursor-not-allowed' : `bg-white ${groupStyles.inputBorder || 'border-border-default'} text-text-primary`}`}>
                        <span className="truncate">{GROUP_OPTIONS[selectedGroupIdx]?.name || 'Select...'}</span>
                        {!isLocked && <SvgIcon className="h-[16px] w-[16px]" shrink-0><path d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z" fill="#999" /></SvgIcon>}
                      </button>
                      {groupDropdownOpen && !isLocked && (
                        <div className="absolute top-full left-0 right-0 mt-[2px] bg-white border border-border-default rounded-[4px] shadow-lg z-[60] max-h-[200px] overflow-auto">
                          {GROUP_OPTIONS.map((opt, idx) => (
                            <button key={idx} onClick={() => handleGroupSelect(idx)}
                              className={`w-full text-left px-[8px] py-[6px] t-small hover:bg-bg-panel ${idx === selectedGroupIdx ? 'text-brand-1 font-medium' : 'text-text-primary'}`}>{opt.name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <GroupCodeViewer lines={GROUP_OPTIONS[selectedGroupIdx]?.lines || []} />
                  </div>
                </div>
              </>
              )
            )}
          </div>
        )}
        {activeTab === "blocks" && (
          docType === 'listing' ? (
            // Listing Column Tab
            showPanelDiff ? (
              <div className="flex flex-col gap-[12px] p-[8px]">
                {(() => {
                  const colDiffs = metaDiffItems.filter(d => d.blockName === 'Column');
                  if (colDiffs.length === 0) {
                    return <p className="text-center text-text-secondary t-small py-[20px]">No changes in Column</p>;
                  }
                  return colDiffs.map(diff => (
                    <div key={diff.fieldId} className="group relative">
                      {onQuoteField && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onQuoteField(diff.fieldId, diff.label, 'Column'); }}
                          className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                          title={`Quote "${diff.label}"`}
                          aria-label={`Quote "${diff.label}"`}
                        >
                          <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                        </button>
                      )}
                      <FormItem label={diff.label} disabled={true}>
                        <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                          <span className="text-text-secondary line-through">
                            {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                          </span>
                          <span className="text-text-secondary">→</span>
                          <span className="text-brand-1 font-medium">
                            {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                          </span>
                        </div>
                      </FormItem>
                    </div>
                  ));
                })()}
              </div>
            ) : (
            <div className="flex flex-col gap-[4px]">
              {listingColumnFields.map((field) => {
                const styles = getFieldStyles(getEffectiveStatus(field.id, field.status, field.value), false);
                return (
                  <div key={field.id} ref={el => { fieldRefs.current[field.id] = el; }} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                    <div className="flex flex-col gap-[4px] p-[8px]">
                      <div className="flex h-[20px] items-center justify-between">
                        <div className="flex items-center gap-[2px]">
                          <span style={{ fontFamily: "'PingFang SC', sans-serif", fontWeight: 500, fontSize: 12, lineHeight: "20px", color: isLocked ? '#B2B4B4' : '#3C4242' }}>
                            {field.label}
                          </span>
                          {field.required && (
                            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, color: isLocked ? '#B2B4B4' : '#830051' }}>*</span>
                          )}
                          {field.badge && <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} />}
                        </div>
                        <button
                          onClick={isLocked ? undefined : () => {
                            setListingColumnFields(prev => prev.map(f =>
                              f.id !== field.id ? f : { ...f, confirmed: !f.confirmed }
                            ));
                          }}
                          disabled={isLocked}
                          className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                          aria-label={field.confirmed ? 'Unconfirm' : 'Confirm'}
                        >
                          <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={field.value}
                        onChange={isLocked ? undefined : (e) => handleListingColumnFieldEdit(field.id, e.target.value)}
                        readOnly={isLocked}
                        className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border t-small text-text-primary outline-none focus:outline-none ${
                          isLocked ? 'bg-bg-panel border-transparent text-[#B2B4B4] cursor-not-allowed' : `bg-white ${styles.inputBorder || 'border-border-default'}`
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            )
          ) : docType === 'figure' ? (
            showPanelDiff ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-[12px] gap-[16px]">
                {/* 1. Added Components */}
                {metaDiffItems.filter(d => d.changeType === 'added').map(addDiff => {
                  const comp = figureComponents.find(c => c.id === addDiff.blockId || addDiff.fieldId === `add_${c.id}`);
                  const compName = addDiff.blockName || comp?.name || 'New Component';
                  return (
                    <div key={addDiff.fieldId} className="flex flex-col gap-[8px]">
                      {/* Clean title row with + indicator */}
                      <div className="group relative flex items-center justify-between py-[4px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-semibold text-code-success text-[14px]">＋</span>
                          <span className="font-bold text-text-primary text-[14px]">{compName}</span>
                        </div>
                        {onQuoteField && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onQuoteField(addDiff.fieldId, compName, compName); }}
                            className="absolute right-[8px] top-1/2 -translate-y-1/2 z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                            title={`Quote "${compName}"`}
                            aria-label={`Quote "${compName}"`}
                          >
                            <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                          </button>
                        )}
                      </div>
                      {/* Component fields: clean list without outer card boxes */}
                      <div className="flex flex-col gap-[8px] pl-[12px]">
                        {comp?.fields.map(f => (
                          <div key={f.id} className="group relative">
                            {onQuoteField && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onQuoteField(f.id, f.label, compName); }}
                                className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                                title={`Quote "${f.label}"`}
                                aria-label={`Quote "${f.label}"`}
                              >
                                <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                              </button>
                            )}
                            <FormItem
                              label={f.label}
                              required={f.required}
                              disabled={true}
                              badge={f.badge ? <MetadataBadge type={f.badge} tooltip={f.badgeTooltip} /> : undefined}
                            >
                              <div className="flex items-center text-[13px] leading-[24px] py-[2px] text-text-primary">
                                {f.value || 'Empty'}
                              </div>
                            </FormItem>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* 2. Removed Components */}
                {metaDiffItems.filter(d => d.changeType === 'removed').map(remDiff => {
                  const compName = remDiff.blockName || remDiff.label || 'Removed Component';
                  return (
                    <div key={remDiff.fieldId} className="group relative flex items-center justify-between py-[4px]">
                      <div className="flex items-center gap-[6px]">
                        <span className="font-semibold text-az-danger text-[14px]">－</span>
                        <span className="font-bold text-text-primary text-[14px]">{compName}</span>
                      </div>
                      {onQuoteField && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onQuoteField(remDiff.fieldId, compName, compName); }}
                          className="absolute right-[8px] top-1/2 -translate-y-1/2 z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                          title={`Quote "${compName}"`}
                          aria-label={`Quote "${compName}"`}
                        >
                          <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* 3. Modified Component Sections */}
                {(() => {
                  const modifiedComps = figureComponents.filter(comp =>
                    !removedCompBlockIds.has(comp.id) &&
                    !addedCompBlockIds.has(comp.id) &&
                    (comp.fields.some(f => fieldDiffMap[f.id] && fieldDiffMap[f.id].changeType === 'modified') ||
                     metaDiffItems.some(d => d.blockId === comp.id && d.changeType === 'modified'))
                  );

                  return modifiedComps.map(comp => {
                    const compName = comp.name || comp.id;
                    const compDiffs = metaDiffItems.filter(d => d.blockId === comp.id && d.changeType === 'modified' && !d.fieldId.startsWith('deprecate_'));

                    return (
                      <div key={comp.id} className="flex flex-col gap-[8px]">
                        {/* Title Header */}
                        <div className="group relative flex items-center justify-between py-[4px]">
                          <span className="font-bold text-text-primary text-[14px]">{compName}</span>
                          {onQuoteField && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onQuoteField(comp.id, compName, compName); }}
                              className="absolute right-[8px] top-1/2 -translate-y-1/2 z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                              title={`Quote "${compName}"`}
                              aria-label={`Quote "${compName}"`}
                            >
                              <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                            </button>
                          )}
                        </div>

                        {/* Modified Field List under FormItem */}
                        <div className="flex flex-col gap-[8px] pl-[12px]">
                          {compDiffs.map((diff) => {
                            return (
                              <div key={diff.fieldId} className="group relative">
                                {onQuoteField && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onQuoteField(diff.fieldId, diff.label, compName); }}
                                    className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                                    title={`Quote "${diff.label}"`}
                                    aria-label={`Quote "${diff.label}"`}
                                  >
                                    <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                                  </button>
                                )}
                                <FormItem
                                  label={diff.label}
                                  disabled={true}
                                >
                                  {/* Readonly-derived diff display text line without card box */}
                                  <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                                    <span className="text-text-secondary line-through">
                                      {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                                    </span>
                                    <span className="text-text-secondary">→</span>
                                    <span className="text-brand-1 font-medium">
                                      {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                                    </span>
                                  </div>
                                </FormItem>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Empty state if no diffs in components tab */}
                {componentsTabDiffCount === 0 && (
                  <p className="text-center text-text-secondary t-small py-[20px]">No changes in Components</p>
                )}
              </div>
            ) : (
              <BlocksTabContent
                // @ts-ignore
                blocks={figureComponents}
                targetBlockId={targetBlockId}
                confirmedBlocks={blockItemConfirmed}
                onToggleBlockConfirm={(blockId) => {
                  const block = figureComponents.find((b: any) => b.id === blockId);
                  if (!block) return;
                  const allConfirmed = block.fields.length > 0 && block.fields.every((f: any) => blockItemConfirmed[`${blockId}_${f.id}`]);
                  const nextState = !allConfirmed;
                  setBlockItemConfirmed(prev => {
                    const next = { ...prev };
                    block.fields.forEach((f: any) => {
                      next[`${blockId}_${f.id}`] = nextState;
                    });
                    return next;
                  });
                }}
                isLocked={false}
                onGenerateComponent={handleGenerateComponent}
                onDeprecateComponent={handleDeprecateComponent}
                onDeleteComponent={(id) => setDeleteConfirmBlockId(id)}
                onFieldEdit={handleFieldEditComponent}
                onDisplayFactEdit={handleDisplayFactEdit}
                onDisplayFactLabelEdit={handleDisplayFactLabelEdit}
                onDisplayFactDelete={handleDisplayFactDelete}
                onDetailEdit={handleDetailEdit}
                onDetailAdd={handleDetailAdd}
                onDetailDelete={handleDetailDelete}
                fieldRefs={fieldRefs}
                onQuoteField={onQuoteField}
                confirmedCount={confirmedCount}
                totalFields={totalFields}
                selectAllState={selectAllState}
                onSelectAll={handleSelectAll}
              />
            )
          ) : (
            showPanelDiff ? (
              <div className="flex flex-col gap-[12px] p-[8px]">
                {(() => {
                  const blockDiffs = metaDiffItems.filter(d => d.blockName !== 'Basic Information');
                  if (blockDiffs.length === 0) {
                    return <p className="text-center text-text-secondary t-small py-[20px]">No changes in Blocks</p>;
                  }
                  return blockDiffs.map(diff => (
                    <div key={diff.fieldId} className="group relative">
                      {onQuoteField && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onQuoteField(diff.fieldId, diff.label, diff.blockName || 'Blocks'); }}
                          className="absolute right-[8px] top-[6px] z-30 flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-graphite-15 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:bg-graphite-10 active:scale-[0.96] transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                          title={`Quote "${diff.label}"`}
                          aria-label={`Quote "${diff.label}"`}
                        >
                          <img src={doubleQuotesLUrl} className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} alt="" />
                        </button>
                      )}
                      <FormItem label={`${diff.blockName ? diff.blockName + ' > ' : ''}${diff.label}`} disabled={true}>
                        <div className="flex items-center gap-[6px] text-[13px] leading-[24px] py-[2px]">
                          <span className="text-text-secondary line-through">
                            {diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty'}
                          </span>
                          <span className="text-text-secondary">→</span>
                          <span className="text-brand-1 font-medium">
                            {diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty'}
                          </span>
                        </div>
                      </FormItem>
                    </div>
                  ));
                })()}
              </div>
            ) : (
            <BlocksTabContent
              blocks={tableBlocks}
              targetBlockId={targetBlockId}
              confirmedBlocks={blockItemConfirmed}
              onToggleBlockConfirm={(blockId) => {
                const block = tableBlocks.find((b: any) => b.id === blockId);
                if (!block) return;
                const allConfirmed = block.fields.length > 0 && block.fields.every((f: any) => blockItemConfirmed[`${blockId}_${f.id}`]);
                const nextState = !allConfirmed;
                setBlockItemConfirmed(prev => {
                  const next = { ...prev };
                  block.fields.forEach((f: any) => {
                    next[`${blockId}_${f.id}`] = nextState;
                  });
                  return next;
                });
              }}
              isLocked={false}
              onFieldEdit={handleTableBlockFieldEdit}
              fieldRefs={fieldRefs}
              onQuoteField={onQuoteField}
              confirmedCount={confirmedCount}
              totalFields={totalFields}
              selectAllState={selectAllState}
              onSelectAll={handleSelectAll}
            />
            )
          )
        )}
      </div>



      {/* Figure Dependency Update Modal */}
      <WorkspaceModal
        isOpen={showDepUpdateModal}
        onClose={() => setShowDepUpdateModal(false)}
        title="Update Dependency"
        description="重新执行可能失败 (Re-executing might fail). Are you sure you want to update the dependency?"
        primaryLabel="Update"
        secondaryLabel="Cancel"
        onSecondary={() => setShowDepUpdateModal(false)}
        onPrimary={() => {
          const newBlocks = [...figureBlocks];
          const blk = newBlocks.find(b => b.fields.some(f => f.id === 'associatedTL'));
          if (blk) {
            const f = blk.fields.find(f => f.id === 'associatedTL');
            if (f) {
              f.dependencyState = 'S4';
            }
          }
          setFigureBlocks(newBlocks);
          setShowDepUpdateModal(false);
        }}
      />

      {/* Delete Component Confirmation Modal */}
      <WorkspaceModal
        isOpen={!!deleteConfirmBlockId}
        onClose={() => setDeleteConfirmBlockId(null)}
        title="Delete This Component?"
        description="This action cannot be undone. To temporarily retire it, use [Deprecate Component] instead."
        primaryLabel="Delete"
        secondaryLabel="Cancel"
        dangerPrimary={true}
        iconColor="#CC2C3C"
        onSecondary={() => setDeleteConfirmBlockId(null)}
        onPrimary={() => {
          if (deleteConfirmBlockId) {
            handleDeleteComponent(deleteConfirmBlockId);
          }
          setDeleteConfirmBlockId(null);
        }}
      />
    </div>
  );
}

function highlightSAS(code: string): React.ReactNode {
  const regex = /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b(?:proc sql|proc|sql|quit|data|run|create table|select|from|where|left join|group by|on|and|not|options|title\d|footnote\d|as|in)\b)|(%[a-zA-Z_0-9]+)|(\b(?:inds|inda|cols|col_labels|freeze_cols|page_cols|page_num|orientation|out_rtf)\b)|(\b\d+\b)/gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.substring(lastIndex, match.index));
    }

    const [
      full,
      comment,
      doubleQuoteStr,
      singleQuoteStr,
      keyword,
      macroCall,
      param,
      number
    ] = match;

    const key = `${match.index}-${full}`;

    if (comment) {
      parts.push(<span key={key} className="text-[#008000] italic">{full}</span>);
    } else if (doubleQuoteStr || singleQuoteStr) {
      parts.push(<span key={key} className="text-[#A31515]">{full}</span>);
    } else if (keyword) {
      parts.push(<span key={key} className="text-[#005CC5]">{full}</span>);
    } else if (macroCall) {
      parts.push(<span key={key} className="text-[#830051]">{full}</span>);
    } else if (param) {
      parts.push(<span key={key} className="text-[#7952B3]">{full}</span>);
    } else if (number) {
      parts.push(<span key={key} className="text-[#098658]">{full}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    parts.push(code.substring(lastIndex));
  }

  return <>{parts}</>;
}

function renderCodeLineWithIndentGuides(
  line: string,
  lineIndex: number,
  effectiveIndents?: number[]
): React.ReactNode {
  const isEmpty = !line || line.trim() === '';
  const match = line ? line.match(/^( +)/) : null;
  const leadingSpaces = match ? match[1].length : 0;

  // 如果行内有代码，使用自身缩进；如果是空行，使用 Monaco 算法计算的跨空行连续缩进
  const indentCount = isEmpty
    ? (effectiveIndents ? (effectiveIndents[lineIndex] ?? 0) : 0)
    : Math.floor(leadingSpaces / 2);
  const remainder = isEmpty ? 0 : leadingSpaces % 2;

  if (indentCount === 0) {
    return <code>{isEmpty ? '\u00A0' : highlightSAS(line)}</code>;
  }

  const guides: React.ReactNode[] = [];
  for (let i = 0; i < indentCount; i++) {
    guides.push(
      <span
        key={`guide-${i}`}
        className="inline-block relative select-none pointer-events-none align-top h-[20px]"
        style={{ width: '2ch' }}
      >
        <span className="absolute left-0 top-0 bottom-0 w-[1px] bg-graphite-10" />
      </span>
    );
  }

  return (
    <code>
      {guides}
      {remainder > 0 ? ' '.repeat(remainder) : null}
      {isEmpty ? '\u00A0' : highlightSAS(line.slice(leadingSpaces))}
    </code>
  );
}

function CodePanel({
  selectedItem,
  docType,
  freezeCols,
  pageCols,
  isLocked,
  onToggleLock,
  showCI = true,
  showCensorMarks = true,
  showMedianLines = true,
  showRiskTable = true,
  groupViewOpen = false,
  onToggleGroupView,
}: {
  selectedItem: string;
  docType?: DocumentType;
  freezeCols?: number;
  pageCols?: number;
  isLocked: boolean;
  onToggleLock: () => void;
  showCI?: boolean;
  showCensorMarks?: boolean;
  showMedianLines?: boolean;
  showRiskTable?: boolean;
  groupViewOpen?: boolean;
  onToggleGroupView?: () => void;
}) {
  const listingCodeContent = `/* Setup listing options */
options nodate nonumber orientation=landscape;
title1 "Listing 16.2.1";
title2 "Demographic and Baseline Characteristics (ITT Population)";

/* Call standardized listing macro */
%m_u_listing(
  inds = adam.adsl,
  cols = USUBJID | SUBJID | SITEID | AGE | SEX | RACE | TRT01A | VISIT | ASTDY | AEDECOD,
  col_labels = Subject ID | Subj ID | Site ID | Age | Sex | Race | Treatment Group | Visit | Study Day | Adverse Event,
  freeze_cols = ${freezeCols ?? 2},
  page_cols = ${pageCols ?? 5},
  page_num = 1,
  orientation = L,
  out_rtf = listing_16_2_1.rtf
);

/* Footnotes */
footnote1 "Note: Age is calculated relative to birth date. Day is relative to first dose date.";
footnote2 "Program Name: l_demog.sas";`;

  const programCodeContent = `/* ========================================================================= */
/* Study: D9802C00001 Clarity Gastric 01                                     */
/* Output: Figure 15.1.1 - Kaplan-Meier Plot of PFS with Subgroup Analysis   */
/* Population: Safety Analysis Set / Intent-to-Treat Population              */
/* SAS Version: 9.4 | Standard: AZ Global Statistical Programming v3.2       */
/* ========================================================================= */

options nodate nonumber orientation=landscape linesize=133 pagesize=60;
ods graphics on / reset=all width=9.5in height=6.2in imagename="f_15_1_1" imagefmt=png;

/* Step 1: Extract Primary Time-to-Event and Demographics Data */
data km_prep;
  merge adam.adtte(where=(paramcd="PFS" and saffl="Y") in=a)
    adam.adsl(keep=usubjid age agegr1 sex ecoggr1 priorl pdl1fl in=b);
  by usubjid;
  if a and b;
  /* Format time from days to months */
  time_months = aval / 30.4375;
run;

/* Step 2: Compute Kaplan-Meier Survival Estimates and Risk Counts */
ods output
  ProductLimitEstimates = km_est
  HomTests              = km_logrank
  Quartiles             = km_quartiles;

proc lifetest data=km_prep method=km conftype=loglog plots=survival(atrisk=0 to 36 by 6);
  time time_months * cnsr(1);
  strata trt01p / test=logrank;
run;

/* Step 3: Compute Subgroup Hazard Ratios via Cox Proportional Hazards Model */
%macro calc_subgroup_hr(var=, label=);
  proc phreg data=km_prep;
    class trt01p(ref="Placebo") &var;
    model time_months * cnsr(1) = trt01p;
    by &var;
    hazardratio trt01p / diff=ref;
    ods output HazardRatios = hr_&var;
  run;
%mend calc_subgroup_hr;

%calc_subgroup_hr(var=agegr1,  label=Age Category);
%calc_subgroup_hr(var=sex,     label=Sex);
%calc_subgroup_hr(var=ecoggr1, label=ECOG Performance Status);
%calc_subgroup_hr(var=priorl,  label=Prior Systemic Lines);
%calc_subgroup_hr(var=pdl1fl,  label=PD-L1 Expression CPS);

/* Step 4: GTL Template Definition for Composite Layout */
proc template;
  define statgraph KM_Subgroup_Layout;
    dynamic _TITLE _SUBTITLE _SHOWCI _SHOWRISK _SHOWFOREST;
    begingraph / designwidth=9.5in designheight=6.2in;
      entrytitle "Figure 15.1.1: " _TITLE;
      entrytitle "Progression-Free Survival and Subgroup Forest Plot (ITT Set)" / textattrs=(size=9pt);
      
      layout lattice / rows=3 columns=1 rowweights=(0.52 0.16 0.32) columngutter=8px;
        /* Cell 1: Kaplan-Meier Step Curves */
        layout overlay /
          xaxisopts=(label="Time from Randomization (Months)" linearopts=(viewmin=0 viewmax=36 tickvaluelist=(0 3 6 9 12 18 24 30 36)))
          yaxisopts=(label="Progression-Free Survival Probability" linearopts=(viewmin=0 viewmax=1.0 tickvaluesequence=(start=0 end=1.0 increment=0.2)));
          stepplot x=time_months y=survival / group=trt01p name="km" lineattrs=(thickness=2);
          censorplot x=time_months y=survival / group=trt01p name="cens" markerattrs=(symbol=plus size=7);
          discretelegend "km" / location=inside halign=right valign=top across=1;
        endlayout;

        /* Cell 2: Number at Risk Table */
        layout overlay / pad=(top=2px bottom=2px);
          axistable x=tatrisk value=atrisk / class=trt01p title="Number at Risk" position=bottom;
        endlayout;

        /* Cell 3: Subgroup Analysis Forest Plot */
        layout overlay /
          xaxisopts=(type=log label="Hazard Ratio (95% CI) [Log scale]" linearopts=(viewmin=0.2 viewmax=2.5))
          yaxisopts=(type=discrete reverse=true display=(tickvalues));
          referenceline x=1.0 / lineattrs=(pattern=dash color=graphite);
          highlowplot y=subgroup low=ci_low high=ci_high / type=line lineattrs=(color=cx3C4242 thickness=1.2);
          scatterplot y=subgroup x=hr / markerattrs=(symbol=squarefilled size=8) sizegroup=weight;
        endlayout;
      endlayout;

      entryfootnote halign=left "Program: /study/D9802C00001/csr/prod/figures/f_kmplot_subgroup.sas  |  Output: f_15_1_1.rtf" / textattrs=(size=7pt color=gray);
    endgraph;
  end;
run;

/* Step 5: Render Figure to RTF */
ods rtf file="f_15_1_1.rtf" style=AZ_CSR_Figure;

proc sgrender data=km_est template=KM_Subgroup_Layout;
  dynamic _TITLE="Kaplan-Meier Plot of Progression-Free Survival (PFS) with Subgroup Analysis"
          _SHOWCI="${showCI ? 'Y' : 'N'}"
          _SHOWRISK="${showRiskTable ? 'Y' : 'N'}"
          _SHOWFOREST="Y";
run;

ods rtf close;
ods graphics off;`;

  const codeContent = docType === 'listing' ? listingCodeContent : programCodeContent;

  const [userCode, setUserCode] = useState(codeContent);
  const [lastRunCode, setLastRunCode] = useState(codeContent);
  const [savedCode, setSavedCode] = useState(codeContent);

  useEffect(() => {
    setUserCode(codeContent);
    setLastRunCode(codeContent);
    setSavedCode(codeContent);
  }, [selectedItem, codeContent]);

  const codeLines = userCode.split('\n');

  // Compute Monaco-style continuous indentation levels across empty lines
  const effectiveIndents = useMemo(() => {
    const raw = codeLines.map((line) => {
      if (!line || line.trim() === '') return -1;
      const match = line.match(/^( +)/);
      const leadingSpaces = match ? match[1].length : 0;
      return Math.floor(leadingSpaces / 2);
    });

    return raw.map((indent, i) => {
      if (indent !== -1) return indent;
      let prevIndent = 0;
      for (let p = i - 1; p >= 0; p--) {
        if (raw[p] !== -1) {
          prevIndent = raw[p];
          break;
        }
      }
      let nextIndent = 0;
      for (let n = i + 1; n < raw.length; n++) {
        if (raw[n] !== -1) {
          nextIndent = raw[n];
          break;
        }
      }
      return Math.min(prevIndent, nextIndent);
    });
  }, [codeLines]);
  const codeTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedCodeLine, setSelectedCodeLine] = useState<number | null>(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState<number | null>(null);

  const handleTextareaSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const selStart = textarea.selectionStart;
    const lineNum = textarea.value.substring(0, selStart).split('\n').length;
    setSelectedCodeLine(lineNum);
  };

  const isFoldableLine = (lineText: string): boolean => {
    const trimmed = lineText.trim().toLowerCase();
    return (
      trimmed.startsWith('proc ') ||
      trimmed.startsWith('data ') ||
      trimmed.startsWith('%') ||
      trimmed.startsWith('/*')
    );
  };

  const handleLineClick = (lineNum: number) => {
    setSelectedCodeLine(lineNum);
    if (docType === 'figure' && !isLocked && codeTextAreaRef.current) {
      const lines = userCode.split('\n');
      let charCount = 0;
      for (let i = 0; i < lineNum - 1 && i < lines.length; i++) {
        charCount += lines[i].length + 1;
      }
      codeTextAreaRef.current.focus();
      codeTextAreaRef.current.setSelectionRange(charCount, charCount);
    }
  };



  const hasCodeError = userCode.toLowerCase().includes('error');
  const activeLogData = hasCodeError ? errorStructuredLog : successStructuredLog;

  const handleLogEntryClick = (programLine: number) => {
    setTimeout(() => {
      if (codeTextAreaRef.current) {
        const lines = userCode.split('\n');
        let charCount = 0;
        for (let i = 0; i < programLine - 1 && i < lines.length; i++) {
          charCount += lines[i].length + 1;
        }
        codeTextAreaRef.current.focus();
        codeTextAreaRef.current.setSelectionRange(charCount, charCount + (lines[programLine - 1]?.length || 0));
        const lineHeight = 20;
        const parentContainer = codeTextAreaRef.current.closest('.code-panel-scroll-container');
        if (parentContainer) {
          parentContainer.scrollTop = (programLine - 1) * lineHeight;
        } else {
          codeTextAreaRef.current.scrollTop = (programLine - 1) * lineHeight;
        }
      }
    }, 0);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCodeUnsaved = userCode !== savedCode;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedCode(userCode);
      setIsSaving(false);
    }, 500);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toolbarButtons = (
    <div className="flex items-center gap-[6px]">
      {/* 1. Save (Secondary style, h-26px) */}
      <Button 
        variant="secondary" 
        disabled={!isCodeUnsaved || isSaving} 
        onClick={handleSave}
        className="h-[26px] px-[8px] py-0 gap-[4px] rounded-[4px]"
      >
        <div className="flex items-center gap-[4px] justify-center">
          {isSaving ? (
            <div className="w-[12px] h-[12px] rounded-full border-[2px] border-transparent border-t-[#B2B4B4] border-l-[#B2B4B4] animate-spin" />
          ) : (
            <LocalIcon src={saveIconUrl} className="w-[14px] h-[14px]" color={!isCodeUnsaved ? "#B2B4B4" : "var(--color-text-primary)"} />
          )}
          <span className="text-[12px] leading-[18px] font-normal">{isSaving ? "Saving" : isCodeUnsaved ? "Save" : "Saved"}</span>
        </div>
      </Button>

      {/* 2. Copy */}
      <TooltipText label={copied ? "Copied!" : "Copy Code"}>
        <button
          onClick={handleCopyCode}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label="Copy Code"
        >
          <LocalIcon src={copyIconUrl} className="h-[16px] w-[16px]" color={copied ? "#830051" : "var(--color-text-secondary)"} />
        </button>
      </TooltipText>

      {/* 3. Lock */}
      <TooltipText label={isLocked ? "Unlock Code" : "Lock Code"}>
        <button
          onClick={onToggleLock}
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
            isLocked ? "bg-az-secondary" : "hover:bg-black/5"
          }`}
          aria-label={isLocked ? "Unlock Code" : "Lock Code"}
        >
          <LocalIcon
            src={isLocked ? lockIconUrl : unlockIconUrl}
            className="h-[16px] w-[16px]"
            color={isLocked ? "#830051" : "var(--color-text-secondary)"}
          />
        </button>
      </TooltipText>

      {/* 4. History */}
      <TooltipText label="Version History">
        <button
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label="Version History"
        >
          <LocalIcon src={historyIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
        </button>
      </TooltipText>
    </div>
  );



  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden bg-white code-panel-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .code-panel-container ::selection {
          background-color: rgba(131, 0, 81, 0.15) !important;
          color: inherit !important;
        }
      `}} />
      <PanelHeader
        noBorder
        title={
          <LocalIcon src={codeSlashIconUrl} className="w-[16px] h-[16px]" color="#888E8E" />
        }
        actions={toolbarButtons}
      />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Top compact fade (8px, avoids 12px scrollbar on right) */}
        <div className="pointer-events-none absolute top-0 left-0 right-[12px] h-[8px] bg-gradient-to-b from-white to-transparent z-20" />

        <div className="h-full w-full overflow-auto bg-white code-panel-scroll-container scrollbar-code">
        {docType === 'figure' ? (
          <div className="flex flex-1 min-w-max font-mono text-[13px] leading-[20px]">
            <div className="select-none bg-white py-[16px] text-right text-[#999999] shrink-0 w-[58px] sticky left-0 z-10">
              {codeLines.map((line, index) => {
                const lineNum = index + 1;
                const isHovered = hoveredLineNumber === lineNum;
                const isFocused = selectedCodeLine === lineNum - 1;
                const foldable = isFoldableLine(line);
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredLineNumber(lineNum)}
                    onMouseLeave={() => setHoveredLineNumber(null)}
                    onClick={() => handleLineClick(lineNum)}
                    className="h-[20px] flex items-center justify-end pl-[8px] pr-[4px] gap-[2px] cursor-pointer select-none"
                  >
                    <span className={`text-[13px] font-mono text-right w-[28px] leading-[20px] tabular-nums ${isFocused ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                      {lineNum}
                    </span>
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      {isHovered && foldable ? (
                        <SvgIcon className="h-[16px] w-[16px] text-text-secondary" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </SvgIcon>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {isLocked ? (
              <div className="flex-1 py-[16px] bg-white">
                {codeLines.map((line, index) => {
                  const lineNum = index + 1;
                  const isSelected = selectedCodeLine === lineNum;
                  return (
                    <div
                      key={index}
                      onClick={() => handleLineClick(lineNum)}
                      className={`h-[20px] pl-[4px] pr-[16px] whitespace-pre font-mono text-[13px] leading-[20px] cursor-pointer ${
                        isSelected ? 'bg-[#FBF4F7]' : ''
                      }`}
                    >
                      {renderCodeLineWithIndentGuides(line || '', index, effectiveIndents)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="relative flex-1 bg-white"
                style={{ height: `${codeLines.length * 20 + 32}px` }}
              >
                <pre className="absolute inset-0 pt-[16px] pb-[16px] m-0 pointer-events-none font-mono text-[13px] leading-[20px] overflow-hidden">
                  {codeLines.map((line, index) => {
                    const lineNum = index + 1;
                    const isSelected = selectedCodeLine === lineNum;
                    return (
                      <div
                        key={index}
                        className={`h-[20px] pl-[4px] pr-[16px] whitespace-pre ${
                          isSelected ? 'bg-[#FBF4F7]' : ''
                        }`}
                      >
                        {renderCodeLineWithIndentGuides(line || '', index, effectiveIndents)}
                      </div>
                    );
                  })}
                </pre>
                <textarea
                  ref={codeTextAreaRef}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  onSelect={handleTextareaSelectionChange}
                  onKeyUp={handleTextareaSelectionChange}
                  onMouseUp={handleTextareaSelectionChange}
                  className="absolute inset-0 w-full h-full pt-[16px] pb-[16px] pl-[4px] pr-[16px] font-mono text-[13px] leading-[20px] text-transparent bg-transparent outline-none resize-none border-none caret-text-primary whitespace-pre overflow-hidden"
                  style={{ caretColor: 'var(--color-text-primary)' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-w-max min-h-full font-mono text-[13px] leading-[20px]">
            <div className="select-none bg-white py-[16px] text-right text-[#999999] shrink-0 w-[58px] sticky left-0 z-10">
              {codeLines.map((line, index) => {
                const lineNum = index + 1;
                const isHovered = hoveredLineNumber === lineNum;
                const isFocused = selectedCodeLine === lineNum - 1;
                const foldable = isFoldableLine(line);
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredLineNumber(lineNum)}
                    onMouseLeave={() => setHoveredLineNumber(null)}
                    onClick={() => handleLineClick(lineNum)}
                    className="h-[20px] flex items-center justify-end pl-[8px] pr-[4px] gap-[2px] cursor-pointer select-none"
                  >
                    <span className={`text-[13px] font-mono text-right w-[28px] leading-[20px] tabular-nums ${isFocused ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                      {lineNum}
                    </span>
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      {isHovered && foldable ? (
                        <SvgIcon className="h-[16px] w-[16px] text-text-secondary" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </SvgIcon>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 py-[16px] bg-white">
              {codeLines.map((line, index) => {
                const lineNum = index + 1;
                const isSelected = selectedCodeLine === lineNum;
                return (
                  <div
                    key={index}
                    onClick={() => handleLineClick(lineNum)}
                    className={`h-[20px] pl-[4px] pr-[16px] whitespace-pre font-mono text-[13px] leading-[20px] cursor-pointer ${
                      isSelected ? 'bg-[#FBF4F7]' : ''
                    }`}
                  >
                    {renderCodeLineWithIndentGuides(line || '', index, effectiveIndents)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>

    </div>
  );
}

function WorkspaceContent({
  onNavigateHome,
  treeListOpen,
  setTreeListOpen,
  treeListWidth,
  setTreeListWidth,
  onOpenDownloadModal,
}: {
  onNavigateHome: () => void;
  treeListOpen: boolean;
  setTreeListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeListWidth: number;
  setTreeListWidth: React.Dispatch<React.SetStateAction<number>>;
  onOpenDownloadModal?: () => void;
}) {
  const [aiLayoutVariant, setAiLayoutVariant] = useState<'drawer' | 'incard'>('incard');
  const [metaDiffItems, setMetaDiffItems] = useState<MetaDiffItem[]>([]);
  const [metaUpdateActive, setMetaUpdateActive] = useState(false);
  const [metaUpdateProcessing, setMetaUpdateProcessing] = useState(false);
  const [submittedDiffItems, setSubmittedDiffItems] = useState<MetaDiffItem[]>([]);
  const [baselineAdvanceTrigger, setBaselineAdvanceTrigger] = useState(0);
  const [addComponentTrigger, setAddComponentTrigger] = useState<{ name: string; type: string; instructions: string } | null>(null);
  const [figureComponents, setFigureComponents] = useState<MetadataBlock[]>(INITIAL_FIGURE_COMPONENTS);
  const [hasUnreadMetadataUpdate, setHasUnreadMetadataUpdate] = useState(false);
  const [renderPreviewOpen, setRenderPreviewOpen] = useState(false);
  const [activeRenderVersionLabel, setActiveRenderVersionLabel] = useState('V1.0');
  const [renderVersions, setRenderVersions] = useState<RenderVersion[]>(INITIAL_FIGURE_RENDER_VERSIONS);
  const [targetMetadataFieldId, setTargetMetadataFieldId] = useState<string | null>(null);
  const quoteInsertRef = useRef<((fieldId: string, label: string) => void) | null>(null);

  const handleQuoteField = useCallback((fieldId: string, label: string, blockName: string) => {
    setAiCopilotOpen(true);
    setTimeout(() => {
      quoteInsertRef.current?.(fieldId, label);
    }, 100);
  }, []);

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(DEFAULT_FIGURE_REVIEW_ITEMS);
  const [hasPendingCodeChanges, setHasPendingCodeChanges] = useState(false);
  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      id: 'p1',
      name: 'Section A',
      status: 'pending',
      isExpanded: true,
      tables: [
        { id: 't2', name: 'Table 14.1.6.1', status: 'pending' },
        { id: 'l1', name: 'Listing 16.2.1', status: 'pending', docType: 'listing' },
        { id: 'f1', name: 'Figure 15.1.1', status: 'pending', docType: 'figure' },
      ],
    },

  ]);
  const [selectedId, setSelectedId] = useState<string | null>('t4');
  const [currentEvent] = useState('CSR Interim Analysis');
  const [modalState, setModalState] = useState<{
    type: 'locked-by-parent' | null;
    programName?: string;
  }>({ type: null });
  const [panelView, setPanelView] = useState<PanelView>('both');
  const shellPreviewOpen = panelView !== 'code';
  const codeOpen = panelView !== 'shell';
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [groupViewOpen, setGroupViewOpen] = useState(false);
  const [rtfOpen, setRtfOpen] = useState(true);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [shellPreviewWidth, setShellPreviewWidth] = useState(560);
  const [metadataWidth, setMetadataWidth] = useState(440);
  const [groupViewWidth, setGroupViewWidth] = useState(380);
  const [aiCopilotWidth, setAiCopilotWidth] = useState(360);
  const [treeListAutoCollapsed, setTreeListAutoCollapsed] = useState(false);

  // If TreeList is opened (e.g. manually by the user), clear the auto-collapsed flag
  useEffect(() => {
    if (treeListOpen) {
      setTreeListAutoCollapsed(false);
    }
  }, [treeListOpen]);

  const [showCI, setShowCI] = useState(true);
  const [showCensorMarks, setShowCensorMarks] = useState(true);
  const [showMedianLines, setShowMedianLines] = useState(true);
  const [showRiskTable, setShowRiskTable] = useState(true);

  // Ref to measure content area for adaptive panel sizing
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);
  const [contentAreaHeight, setContentAreaHeight] = useState(0);

  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);

  // Refs for panel widths — used by compression effect to read latest values without re-running on width changes
  const metadataWidthRef = useRef(metadataWidth);
  metadataWidthRef.current = metadataWidth;
  const shellPreviewWidthRef = useRef(shellPreviewWidth);
  shellPreviewWidthRef.current = shellPreviewWidth;
  const aiCopilotWidthRef = useRef(aiCopilotWidth);
  aiCopilotWidthRef.current = aiCopilotWidth;
  const treeListWidthRef = useRef(treeListWidth);
  treeListWidthRef.current = treeListWidth;

  // Panel layout: vertical = top/bottom split, horizontal = left/right split
  const [panelLayout, setPanelLayout] = useState<PanelLayout>('horizontal');
  const [shellHeight, setShellHeight] = useState(488);
  // Listing view specific states
  const [categoryFilter, setCategoryFilter] = useState<"all" | "table" | "listing" | "figure">("all");

  const [frozenUntilIndex, setFrozenUntilIndex] = useState<number | null>(null);
  const [pageSepActive, setPageSepActive] = useState(false);
  const [pageColumnCounts, setPageColumnCounts] = useState<Record<string, number>>({});
  const [idpageBaseline, setIdpageBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(null);
  const [idlistBaseline, setIdlistBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(null);
  const [aiInputValue, setAiInputValue] = useState("");
  const [aiInputFocusTrigger, setAiInputFocusTrigger] = useState(0);

  const metadataOpenRef = useRef(metadataOpen);
  metadataOpenRef.current = metadataOpen;

  const handleGenerateComponentInWorkspace = (name: string, type: string, instructions: string) => {
    const newId = `generated-${Date.now()}`;
    const raw = name.trim();
    const label = raw.length <= 3 ? 'New Component' : raw;

    const loadingBlock: MetadataBlock = {
      id: newId,
      name: label,
      state: 'loading',
      deprecated: false,
      fields: []
    };

    setFigureComponents(prev => [...prev, loadingBlock]);

    if (!metadataOpenRef.current) {
      setHasUnreadMetadataUpdate(true);
    }

    setTimeout(() => {
      setFigureComponents(prev => prev.map(b => b.id === newId ? {
        ...b,
        state: 'ready',
        fields: [
          { id: `${newId}_l`, label: 'Component Label', value: label, type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
          { id: `${newId}_t`, label: 'Component Type', value: type, type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'dropdown' as const, options: [{label: 'Chart', value: 'Chart'}, {label: 'Table', value: 'Table'}] },
          { id: `${newId}_d`, label: 'Source Dataset(s)', value: 'ADTTTE', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
          { id: `${newId}_v`, label: 'Source Variable(s)', value: 'AVAL, PARAM', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred', inputType: 'multiselect' as const, options: [{label: 'AVAL', value: 'AVAL'}, {label: 'CNSR', value: 'CNSR'}, {label: 'PARAMCD', value: 'PARAMCD'}] }
        ]
      } : b));
    }, 6000);
  };

  const constraints = {
    treeList: { min: 180, max: 320 },
    shellPreview: { min: 320, max: 1200 },
    metadata: panelView === 'shell'
      ? { min: 320, max: 640 }
      : { min: 280, max: 520 },
    code: { min: 300 },
    aiCopilot: { min: 300, max: 1000 },
  };

  // Dynamic metadata max: can't exceed Shell width (no fixed deduction)
  const metadataMaxWidth = Math.min(constraints.metadata.max, shellPreviewWidth);

  // ── Dynamic panel max widths: prevent panels from pushing others off-screen ──
  const DIVIDER_W = 1;
  const tableDividerCount =
    (shellPreviewOpen && codeOpen ? 1 : 0) +
    (shellPreviewOpen && !codeOpen && aiCopilotOpen ? 1 : 0) +
    (codeOpen && aiCopilotOpen ? 1 : 0);

  // Total width of the workspace from stable measured workspaceContainerRef
  const totalWidth = workspaceWidth;
  const flexPanelMin = codeOpen ? constraints.code.min : constraints.shellPreview.min;
  const otherPanelsMin = (shellPreviewOpen && codeOpen) ? constraints.shellPreview.min : 0;
  const currentDividers = (treeListOpen ? 1 : 0) + tableDividerCount * DIVIDER_W;

  // Shell can grow until Code (flex-1) hits its minimum, with TreeList compressed and collapsed if needed
  const dynamicShellMax = totalWidth > 0
    ? Math.min(
        constraints.shellPreview.max,
        Math.max(
          constraints.shellPreview.min,
          totalWidth
          - (codeOpen ? constraints.code.min : 0)
          - (aiCopilotOpen ? aiCopilotWidth : 0)
          - currentDividers
        )
      )
    : constraints.shellPreview.max;

  // AI can grow until the flex-1 panel and any other fixed panels hit their minimums, with TreeList compressed and collapsed if needed
  const dynamicAiMax = totalWidth > 0
    ? Math.min(
        constraints.aiCopilot.max,
        Math.max(constraints.aiCopilot.min, totalWidth - flexPanelMin - otherPanelsMin - currentDividers)
      )
    : constraints.aiCopilot.max;

  // Clamp metadata width if shell shrinks below metadata
  useEffect(() => {
    const maxAllowed = Math.min(constraints.metadata.max, shellPreviewWidth);
    if (metadataWidth > maxAllowed) {
      setMetadataWidth(Math.max(constraints.metadata.min, maxAllowed));
    }
  }, [shellPreviewWidth, panelView]);

  // Measure content area dimensions via ResizeObserver
  useEffect(() => {
    if (!contentAreaRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContentAreaWidth(entries[0].contentRect.width);
      setContentAreaHeight(entries[0].contentRect.height);
    });
    observer.observe(contentAreaRef.current);
    return () => observer.disconnect();
  }, []);

  // Measure stable workspace container width
  useEffect(() => {
    if (!workspaceContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWorkspaceWidth(entries[0].contentRect.width);
    });
    observer.observe(workspaceContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const lastPanelLayoutRef = useRef<PanelLayout>('horizontal');
  useEffect(() => {
    if (panelLayout === 'vertical' && contentAreaHeight > 0) {
      if (lastPanelLayoutRef.current !== 'vertical') {
        const halfHeight = Math.floor((contentAreaHeight - 4) / 2);
        setShellHeight(halfHeight);
      }
    }
    lastPanelLayoutRef.current = panelLayout;
  }, [panelLayout, contentAreaHeight]);

  // Adaptive panel compression: when the flex-1 panel shrinks below its minimum,
  // compress other panels in order: metadata -> shell -> tree width -> tree collapse -> AI
  // Runs both on structural changes and during active dragging of panels
  useEffect(() => {
    if (workspaceWidth === 0) return;

    // Synchronously calculate expectedContentAreaWidth to prevent race condition loop during layout toggle
    const expectedContentAreaWidth = workspaceWidth - (treeListOpen ? (treeListWidth + 1) : 0);

    // Determine the min width of the flex-1 panel (Code if open, otherwise Shell Preview)
    const flexPanelMin = codeOpen ? constraints.code.min : constraints.shellPreview.min;

    // Calculate width of all fixed (shrink-0) panels in the layout
    const shellW = (shellPreviewOpen && codeOpen) ? shellPreviewWidth : 0;
    const aiW = aiCopilotOpen ? aiCopilotWidth : 0;
    const totalDividers = tableDividerCount * DIVIDER_W;

    const availableForFlex = expectedContentAreaWidth - shellW - aiW - totalDividers;

    if (availableForFlex < flexPanelMin) {
      const deficit = flexPanelMin - availableForFlex;
      let remaining = deficit;

      // 1. Compress metadata (if open and above min)
      if (metadataOpen && remaining > 0) {
        const excess = metadataWidth - constraints.metadata.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setMetadataWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 2. Compress shell (if open, fixed in both mode, and above min)
      if (shellPreviewOpen && codeOpen && remaining > 0) {
        const excess = shellPreviewWidth - constraints.shellPreview.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setShellPreviewWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 3. Compress tree width (if open and above min)
      if (treeListOpen && remaining > 0) {
        const excess = treeListWidth - constraints.treeList.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setTreeListWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 4. Auto-collapse TreeList if still not enough space (with a 30px buffer to prevent jitter and immediate snapping)
      const COLLAPSE_BUFFER = 30;
      if (treeListOpen) {
        if (remaining > COLLAPSE_BUFFER) {
          setTreeListOpen(false);
          setTreeListAutoCollapsed(true);
          remaining -= treeListWidth;
        } else {
          // Within buffer: allow the flex panel to absorb the remaining deficit without collapsing TreeList or compressing AI
          remaining = 0;
        }
      }

      // 5. Compress AI (if open and above min)
      if (aiCopilotOpen && remaining > 0) {
        const excess = aiCopilotWidth - constraints.aiCopilot.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setAiCopilotWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }
    } else if (!treeListOpen && treeListAutoCollapsed) {
      // Auto-expand TreeList when user shrinks AI panel (with a 30px buffer to prevent rapid toggle loops)
      const EXPAND_BUFFER = 30;
      if (availableForFlex >= flexPanelMin + treeListWidth + 1 + EXPAND_BUFFER) {
        setTreeListOpen(true);
        setTreeListAutoCollapsed(false);
      }
    }
  }, [
    workspaceWidth,
    shellPreviewOpen,
    codeOpen,
    aiCopilotOpen,
    metadataOpen,
    shellPreviewWidth,
    aiCopilotWidth,
    treeListOpen,
    treeListWidth,
    treeListAutoCollapsed,
  ]);

  const isTableSelected = useCallback((id: string | null) => (
    Boolean(id && programs.some((program) => program.tables.some((table) => table.id === id)))
  ), [programs]);

  const getSelectedItemName = () => {
    const selectedItem = programs
      .flatMap((program) => [program, ...program.tables])
      .find((item) => item.id === selectedId);
    return selectedItem?.name || "";
  };

  const getSelectedTable = () => {
    return programs
      .flatMap((program) => program.tables)
      .find((table) => table.id === selectedId);
  };
  const selectedTable = getSelectedTable();
  const docType = selectedTable?.docType || 'table';
  const currentGroupCodes = MOCK_GROUP_CODES[selectedId || ''] || (selectedId === 't2' || selectedId === 't4' ? MOCK_GROUP_CODES['t2'] : selectedId === 'l1' ? MOCK_GROUP_CODES['l1'] : selectedId === 'f1' ? MOCK_GROUP_CODES['f1'] : []);

  const figureOpenedRef = React.useRef(false);

  useEffect(() => {
    if (docType === 'figure') {
      setRtfOpen(false);
      setPanelView('both');
      if (!figureOpenedRef.current) {
        figureOpenedRef.current = true;
        setAiCopilotOpen(true);
      }
    } else {
      setRtfOpen(true);
    }
  }, [selectedId, docType]);
  const associatedTLStatus = (() => {
    const t1 = programs.flatMap(p => p.tables).find(t => t.id === 't1');
    return t1 ? t1.status : 'pending';
  })();
  const selectedTableProgram = programs.find((program) =>
    program.tables.some((table) => table.id === selectedId)
  );
  const selectedTableLocked = selectedTable?.status === 'locked';
  const handleCodePanelToggleLock = () => {
    if (selectedTableProgram && selectedTable) {
      handleToggleLock(selectedTableProgram.id, selectedTable.id);
    }
  };

  const [isLayoutUserOverridden, setIsLayoutUserOverridden] = useState(false);

  const handleManualPanelLayoutChange = (layout: PanelLayout) => {
    setPanelLayout(layout);
    setIsLayoutUserOverridden(true);
  };

  // Set default panel layout based on doc type (listing = vertical, table/figure = horizontal)
  // Only applies if user hasn't explicitly overridden the layout preference
  useEffect(() => {
    if (!isLayoutUserOverridden) {
      setPanelLayout(docType === 'listing' ? 'vertical' : 'horizontal');
    }
  }, [docType, isLayoutUserOverridden]);

  const handleShellPagePreviewChange = (_active: boolean) => {
    // Page preview mode change callback — could trigger AI Copilot or other actions
  };

  const handleOpenAICopilotFromShell = (initialInput?: string) => {
    setAiCopilotOpen(true);
    if (initialInput && typeof initialInput === 'string') {
      setAiInputValue(initialInput);
      setAiInputFocusTrigger((prev) => prev + 1);
    }
  };

  const handleToggleLock = (programId: string, tableId?: string) => {
    if (!tableId) return;
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => {
        if (program.id !== programId) return program;
        return {
          ...program,
          tables: program.tables.map((table) => {
            if (table.id !== tableId || table.status === 'analyzing' || table.status === 'error' || table.status === 'modified') {
              return table;
            }
            return {
              ...table,
              status: table.status === 'locked' ? 'pending' : 'locked',
            };
          }),
        };
      })
    );
  };

  const handleToggleExpand = (programId: string) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => (
        program.id === programId ? { ...program, isExpanded: !program.isExpanded } : program
      ))
    );
  };

  const [treeSearchQuery, setTreeSearchQuery] = useState('');

  const filteredPrograms = programs.map((program) => {
    const filteredTables = program.tables.filter((table) => {
      const matchesCategory = categoryFilter === "all" ||
        (categoryFilter === "table" && (table.docType === "table" || !table.docType)) ||
        (categoryFilter === "listing" && table.docType === "listing") ||
        (categoryFilter === "figure" && table.docType === "figure");
      const matchesSearch = table.name.toLowerCase().includes(treeSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return { ...program, tables: filteredTables };
  });



  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (!isTableSelected(id)) {
      setMetadataOpen(false);
    }
  };

  const handleJumpToTL = (name: string) => {
    const found = programs
      .flatMap((p) => p.tables)
      .find((t) => t.name.toLowerCase().includes(name.trim().toLowerCase()));
    if (found) {
      handleSelect(found.id);
    }
  };

  const handleOpenAICopilot = () => {
    setAiCopilotOpen((prev) => !prev);
  };

  const handleCloseAICopilot = () => {
    setAiCopilotOpen(false);
  };

  const handlePanelViewChange = (v: PanelView) => {
    setPanelView(v);
  };

  const renderAICopilotComponent = (variant: 'drawer' | 'incard') => {
    if (!aiCopilotOpen) return null;
    return (
      <AICopilotPanel
        key={`${docType}-${variant}`}
        variant={variant}
        quoteInsertRef={quoteInsertRef}
        panelWidth={aiCopilotWidth}
        onClose={handleCloseAICopilot}
        inputValue={aiInputValue}
        onChangeInputValue={setAiInputValue}
        focusTrigger={aiInputFocusTrigger}
        onOpenCodePanel={() => handlePanelViewChange('code')}
        onOpenSpatialView={() => setRtfOpen(true)}
        onJumpToMetadata={(blockId, fieldId) => {
          setMetadataOpen(true);
          if (fieldId) {
            setTargetMetadataFieldId(fieldId);
          }
        }}
        docType={docType}
        metaDiffItems={metaDiffItems}
        metaUpdateActive={metaUpdateActive}
        hasPendingCodeChanges={hasPendingCodeChanges}
        onMetaCancel={() => setMetaUpdateActive(false)}
        onCodeDiffChange={setHasPendingCodeChanges}
        onMetaProceed={() => {
          setMetaUpdateActive(false);
          setMetaUpdateProcessing(true);
          setSubmittedDiffItems(metaDiffItems);
          setTimeout(() => {
            setBaselineAdvanceTrigger(prev => prev + 1);
            setTimeout(() => {
              setMetaUpdateProcessing(false);
              setSubmittedDiffItems([]);
            }, 50);
          }, 2500);
        }}
        onAddComponentPrompt={(name, type, inst) => handleGenerateComponentInWorkspace(name, type, inst)}
        renderPreviewOpen={renderPreviewOpen}
        activeRenderVersionLabel={activeRenderVersionLabel}
        onRenderThumbnailClick={(v) => {
          setActiveRenderVersionLabel(v.versionLabel);
          setRenderPreviewOpen(true);
        }}
      />
    );
  };

  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden bg-bg-panel">
      <div ref={workspaceContainerRef} className="flex min-w-0 flex-1 overflow-hidden pl-[4px]">
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: treeListOpen ? `${treeListWidth}px` : "0px",
            opacity: treeListOpen ? 1 : 0,
            transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          <div className="flex h-full w-full flex-col bg-bg-panel">
            <div className="flex h-[52px] shrink-0 items-center gap-[8px] px-[10px]">
              <TooltipText label="Back to Home">
                <button
                  onClick={onNavigateHome}
                  className="group flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Go to Home"
                >
                  <AtlasLogoIcon className="group-hover:hidden" />
                  <LocalIcon src={homeIconUrl} className="hidden h-[16px] w-[16px] group-hover:block" color="var(--color-text-secondary)" />
                </button>
              </TooltipText>
              <div className="min-w-0 flex-1">
                <p className="t-small truncate font-medium text-text-primary">AZE2001-301</p>
                <p className="truncate text-[10px] leading-[15px] text-text-secondary">{currentEvent}</p>
              </div>
              <TooltipText label="Event Information">
                <button
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Event information"
                >
                  <InfoIcon />
                </button>
              </TooltipText>
              <TooltipText label="Collapse Tree List">
                <button
                  onClick={() => setTreeListOpen(false)}
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Collapse tree list"
                >
                  <LocalIcon src={collapseIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                </button>
              </TooltipText>
            </div>
            <SearchBar
              value={treeSearchQuery}
              onChange={setTreeSearchQuery}
              placeholder="Search..."
              background="dark"
              className="mx-[8px] my-[2px] shrink-0"
            />
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex flex-col gap-[4px] py-[4px] pr-[4px]">

                {filteredPrograms.map((program) => (
                  <TreeItem
                    key={program.id}
                    program={program}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onToggleLock={handleToggleLock}
                    onToggleExpand={handleToggleExpand}
                    onShowLockedModal={(programName) => setModalState({ type: 'locked-by-parent', programName })}
                  />
                ))}
              </div>
            </div>

            {/* Tree List Bottom-Left: AI Layout Switcher */}
            <div className="shrink-0 flex items-center justify-between px-[10px] py-[8px] border-t border-graphite-10 bg-bg-panel gap-[8px]">
              <span className="text-[11px] text-text-secondary whitespace-nowrap">AI Layout</span>
              <SegmentedControl
                size="sm"
                value={aiLayoutVariant}
                onChange={(val) => setAiLayoutVariant(val as 'drawer' | 'incard')}
                options={[
                  { label: "Drawer", value: "drawer" },
                  { label: "In-Card", value: "incard" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* TreeList ↔ Main panel divider */}
        {treeListOpen && (
          <WorkspaceDivider
            onDragStart={() => setIsResizing(true)}
            onDragEnd={() => setIsResizing(false)}
            onDrag={(delta) => setTreeListWidth((width) => clamp(width + delta, constraints.treeList.min, constraints.treeList.max))}
          />
        )}

        {/* Middle Column: (视图切换行 + Code&Shell卡 + Group Code浮层) */}
        <div ref={contentAreaRef} className={`relative flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden pl-[4px] pt-[4px] pb-[8px] ${aiLayoutVariant === 'drawer' && aiCopilotOpen ? 'pr-[4px]' : 'pr-[8px]'}`}>
          {/* 视图切换行 (Top bar) */}
          <div className="shrink-0 w-full overflow-hidden mb-[4px]">
            <ViewToggleBar
              treeListOpen={treeListOpen}
              onToggleTreeList={() => setTreeListOpen(true)}
              onNavigateHome={onNavigateHome}
              currentEvent={currentEvent}
              panelView={panelView}
              onPanelViewChange={handlePanelViewChange}
              panelLayout={panelLayout}
              onPanelLayoutChange={handleManualPanelLayoutChange}
              docType={docType}
              rtfOpen={rtfOpen}
              onToggleRtf={() => setRtfOpen(v => !v)}
              groupViewOpen={groupViewOpen}
              onToggleGroupView={() => setGroupViewOpen(v => !v)}
              onOpenDownloadModal={onOpenDownloadModal}
              onOpenAICopilot={handleOpenAICopilot}
              aiCopilotOpen={aiCopilotOpen}
            />
          </div>

          {/* Below ViewToggleBar: Container for Shell, Code, AI Copilot cards and floating GroupCodePanel */}
          <div className="relative min-w-0 min-h-0 flex-1 overflow-visible">
            {/* 3 Separate In-Card panels with 8px radius, white bg, Mulberry-tinted soft shadow, and 2px gap */}
            {docType === 'listing' ? (
              <div className="flex min-w-0 min-h-0 h-full w-full overflow-visible" style={{ flexDirection: 'row' }}>
                <div
                  className="flex-1 flex min-w-0 min-h-0 h-full overflow-visible"
                  style={{ flexDirection: panelLayout === 'vertical' ? 'column' : 'row' }}
                >
                  {panelView !== 'code' && (
                    <div
                      style={panelLayout === 'vertical'
                        ? (panelView === 'shell' ? { height: '100%', minHeight: '240px' } : { height: `${shellHeight}px`, minHeight: '240px' })
                        : (panelView === 'shell' ? { width: '100%', minWidth: '320px' } : { width: `${shellPreviewWidth}px`, minWidth: '320px' })
                      }
                      className={`${panelLayout === 'vertical' ? 'w-full' : 'h-full'} flex flex-col min-w-0 overflow-hidden bg-white rounded-[8px] border border-graphite-10 shadow-card-mulberry ${panelView === 'both' ? 'shrink-0' : 'flex-1'}`}
                    >
                      <ListingShellPreview
                        selectedItemName={getSelectedItemName()}
                        onBlockClick={(blockName) => {
                          setMetadataOpen(true);
                          if (blockName) {
                            setTargetBlockName(blockName);
                            setTargetBlockTrigger(prev => prev + 1);
                          }
                        }}
                        onMetadataClick={() => setMetadataOpen((open) => !open)}
                        metadataOpen={metadataOpen}
                        onCloseMetadata={() => setMetadataOpen(false)}
                        isLocked={selectedTableLocked}
                        onPagePreviewChange={handleShellPagePreviewChange}
                        onOpenAICopilot={handleOpenAICopilotFromShell}
                        frozenUntilIndex={frozenUntilIndex}
                        setFrozenUntilIndex={setFrozenUntilIndex}
                        pageSepActive={pageSepActive}
                        setPageSepActive={setPageSepActive}
                        pageColumnCounts={pageColumnCounts}
                        setPageColumnCounts={setPageColumnCounts}
                        idpageBaseline={idpageBaseline}
                        idlistBaseline={idlistBaseline}
                        onIdpageBaselineChange={setIdpageBaseline}
                        metadataWidth={metadataWidth}
                        onMetadataResize={(delta) => setMetadataWidth((w) => clamp(w + delta, constraints.metadata.min, metadataMaxWidth))}
                        onMetaDiffChange={setMetaDiffItems}
                        onRequestUpdateCode={() => {
                          setMetaUpdateActive(true);
                          setAiCopilotOpen(true);
                        }}
                        onMetaCancel={() => setMetaUpdateActive(false)}
                        baselineAdvanceTrigger={baselineAdvanceTrigger}
                        metaUpdateActive={metaUpdateActive}
                        metaUpdateProcessing={metaUpdateProcessing}
                        submittedDiffItems={submittedDiffItems}
                        onReviewItemsChange={setReviewItems}
                        onQuoteField={handleQuoteField}
                      />
                    </div>
                  )}

                  {panelView === 'both' && (
                    panelLayout === 'vertical' ? (
                      <HorizontalWorkspaceDivider
                        onDragStart={() => setIsResizing(true)}
                        onDragEnd={() => setIsResizing(false)}
                        onDrag={(delta) => setShellHeight((h) => {
                          const containerHeight = contentAreaRef.current?.clientHeight ?? 800;
                          const minH = 240;
                          const maxH = containerHeight - 240 - 4;
                          return clamp(h + delta, minH, Math.max(minH, maxH));
                        })}
                      />
                    ) : (
                      <WorkspaceDivider
                        onDragStart={() => setIsResizing(true)}
                        onDragEnd={() => setIsResizing(false)}
                        onDrag={(delta) => setShellPreviewWidth((w) => clamp(w + delta, constraints.shellPreview.min, dynamicShellMax))}
                      />
                    )
                  )}

                  {panelView !== 'shell' && (
                    <div
                      className={`min-w-0 min-h-0 flex-1 overflow-hidden flex flex-col bg-white rounded-[8px] border border-graphite-10 shadow-card-mulberry ${panelLayout === 'vertical' ? 'w-full' : 'h-full'}`}
                      style={panelLayout === 'vertical' ? { minHeight: '240px' } : undefined}
                    >
                      <CodePanel
                        selectedItem={getSelectedItemName()}
                        docType="listing"
                        isLocked={selectedTableLocked}
                        onToggleLock={handleCodePanelToggleLock}
                      />
                    </div>
                  )}
                </div>

                {/* In-Card AI Column (Variant 2) */}
                {aiLayoutVariant === 'incard' && aiCopilotOpen && (
                  <>
                    <WorkspaceDivider
                      onDragStart={() => setIsResizing(true)}
                      onDragEnd={() => setIsResizing(false)}
                      onDrag={(delta) => setAiCopilotWidth((w) => clamp(w - delta, constraints.aiCopilot.min, constraints.aiCopilot.max))}
                    />
                    <div
                      style={{ width: `${aiCopilotWidth}px` }}
                      className="h-full flex flex-col min-w-[320px] max-w-[560px] overflow-hidden bg-white shrink-0 rounded-[8px] border border-graphite-10 shadow-card-mulberry"
                    >
                      {renderAICopilotComponent('incard')}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className="flex min-w-0 min-h-0 h-full w-full overflow-visible"
                style={{ flexDirection: 'row' }}
              >
                <div
                  className="flex-1 flex min-w-0 min-h-0 h-full overflow-visible"
                  style={{ flexDirection: panelLayout === 'vertical' ? 'column' : 'row' }}
                >
                  {shellPreviewOpen && (
                    <div
                      className={`${panelLayout === 'vertical' ? 'w-full' : 'h-full'} flex flex-col min-w-0 overflow-hidden bg-white rounded-[8px] border border-graphite-10 shadow-card-mulberry ${
                        panelView === 'both' ? 'shrink-0' : 'flex-1'
                      }`}
                      style={panelLayout === 'vertical'
                        ? { height: panelView === 'shell' ? undefined : `${shellHeight}px`, minHeight: '240px' }
                        : { width: panelView === 'shell' ? undefined : `${shellPreviewWidth}px` }
                      }
                    >
                      <ShellPreview
                        docType={docType}
                        isLocked={hasPendingCodeChanges}
                        onBlockClick={(blockName) => {
                          setMetadataOpen(true);
                          if (blockName) {
                            setTargetBlockName(blockName);
                            setTargetBlockTrigger(prev => prev + 1);
                          }
                        }}
                        onMetadataClick={() => setMetadataOpen((open) => {
                          if (!open) {
                            setHasUnreadMetadataUpdate(false);
                          }
                          return !open;
                        })}
                        hasUnreadMetadataUpdate={hasUnreadMetadataUpdate}
                        figureComponents={figureComponents}
                        setFigureComponents={setFigureComponents}
                        metadataOpen={metadataOpen}
                        onMetadataClose={() => setMetadataOpen(false)}
                        metadataWidth={metadataWidth}
                        onMetadataResize={(delta) => setMetadataWidth((w) => clamp(w + delta, constraints.metadata.min, metadataMaxWidth))}
                        metadataMaxWidth={metadataMaxWidth}
                        shellPreviewWidth={shellPreviewWidth}
                        onShellPreviewResize={(newWidth) => setShellPreviewWidth(newWidth)}
                        shellPreviewMinWidth={constraints.shellPreview.min}
                        shellPreviewMaxWidth={constraints.shellPreview.max}
                        isShellFlex={panelView === 'shell'}
                        selectedItemName={getSelectedItemName()}
                        onJumpToTL={handleJumpToTL}
                        showCI={showCI}
                        showCensorMarks={showCensorMarks}
                        showMedianLines={showMedianLines}
                        showRiskTable={showRiskTable}
                        onShowCIChange={setShowCI}
                        onShowCensorMarksChange={setShowCensorMarks}
                        onShowMedianLinesChange={setShowMedianLines}
                        onShowRiskTableChange={setShowRiskTable}
                        associatedTLStatus={associatedTLStatus}
                        rtfOpen={rtfOpen}
                        onToggleRtf={() => setRtfOpen(v => !v)}
                        onMetaDiffChange={setMetaDiffItems}
                        onRequestUpdateCode={() => {
                          setMetaUpdateActive(true);
                          setAiCopilotOpen(true);
                        }}
                        baselineAdvanceTrigger={baselineAdvanceTrigger}
                        addComponentTrigger={addComponentTrigger}
                        metaUpdateActive={metaUpdateActive}
                        metaUpdateProcessing={metaUpdateProcessing}
                        submittedDiffItems={submittedDiffItems}
                        targetFieldId={targetMetadataFieldId || undefined}
                        onReviewItemsChange={setReviewItems}
                        onMetaCancel={() => setMetaUpdateActive(false)}
                        onQuoteField={handleQuoteField}
                      />
                    </div>
                  )}

                  {/* Shell ↔ Code divider (when both are open) */}
                  {shellPreviewOpen && codeOpen && (
                    panelLayout === 'vertical' ? (
                      <HorizontalWorkspaceDivider
                        onDragStart={() => setIsResizing(true)}
                        onDragEnd={() => setIsResizing(false)}
                        onDrag={(delta) => setShellHeight((h) => {
                          const containerHeight = contentAreaRef.current?.clientHeight ?? 800;
                          const minH = 240;
                          const maxH = containerHeight - 240 - 4;
                          return clamp(h + delta, minH, Math.max(minH, maxH));
                        })}
                      />
                    ) : (
                      <WorkspaceDivider
                        onDragStart={() => setIsResizing(true)}
                        onDragEnd={() => setIsResizing(false)}
                        onDrag={(delta) => setShellPreviewWidth((width) => clamp(width + delta, constraints.shellPreview.min, dynamicShellMax))}
                      />
                    )
                  )}

                  {codeOpen && (
                    <div
                      className={`min-w-0 min-h-0 flex-1 overflow-hidden flex flex-col bg-white rounded-[8px] border border-graphite-10 shadow-card-mulberry ${panelLayout === 'vertical' ? 'w-full' : 'h-full'}`}
                      style={panelLayout === 'vertical' ? { minHeight: '240px' } : undefined}
                    >
                      <CodePanel
                        selectedItem={getSelectedItemName()}
                        docType={docType}
                        isLocked={selectedTableLocked}
                        onToggleLock={handleCodePanelToggleLock}
                        showCI={showCI}
                        showCensorMarks={showCensorMarks}
                        showMedianLines={showMedianLines}
                        showRiskTable={showRiskTable}
                      />
                    </div>
                  )}
                </div>

                {/* In-Card AI Column (Variant 2) */}
                {aiLayoutVariant === 'incard' && aiCopilotOpen && (
                  <>
                    <WorkspaceDivider
                      onDragStart={() => setIsResizing(true)}
                      onDragEnd={() => setIsResizing(false)}
                      onDrag={(delta) => setAiCopilotWidth((w) => clamp(w - delta, constraints.aiCopilot.min, constraints.aiCopilot.max))}
                    />
                    <div
                      style={{ width: `${aiCopilotWidth}px` }}
                      className="h-full flex flex-col min-w-[320px] max-w-[560px] overflow-hidden bg-white shrink-0 rounded-[8px] border border-graphite-10 shadow-card-mulberry"
                    >
                      {renderAICopilotComponent('incard')}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Group Code 浮层面板 (top-0 和 Card 顶部完美齐平，不挤压工作区) */}
            {groupViewOpen && (
              <div
                className="absolute top-0 right-0 bottom-0 z-[80] flex flex-col overflow-hidden rounded-[8px] border border-graphite-15 bg-white shadow-[0_8px_28px_0_rgba(0,0,0,0.16),0_2px_6px_0_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-150"
                style={{ width: `${groupViewWidth}px`, maxWidth: 'calc(100% - 16px)' }}
              >
                <GroupCodePanel
                  onClose={() => setGroupViewOpen(false)}
                  selectedItemName={getSelectedItemName()}
                  groupCodes={currentGroupCodes}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Copilot Panel (Variant 1: Outside Drawer) */}
        {aiLayoutVariant === 'drawer' && (
          <>
            {aiCopilotOpen && (
              <WorkspaceDivider
                onDragStart={() => setIsResizing(true)}
                onDragEnd={() => setIsResizing(false)}
                onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, dynamicAiMax))}
              />
            )}
            <div
              className="shrink-0 overflow-hidden bg-transparent pl-[4px] pr-[8px] pt-[4px] pb-[8px]"
              style={{
                width: aiCopilotOpen ? `${aiCopilotWidth}px` : "0px",
                opacity: aiCopilotOpen ? 1 : 0,
                transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
              }}
            >
              {renderAICopilotComponent('drawer')}
            </div>
          </>
        )}
      </div>

      <WorkspaceModal
        isOpen={modalState.type === 'locked-by-parent'}
        onClose={() => setModalState({ type: null })}
        title="Locked by Section"
        description="This table is locked because its parent program code is locked."
        primaryLabel="Unlock Program Code"
        secondaryLabel="Cancel"
        onSecondary={() => setModalState({ type: null })}
        onPrimary={() => {
          const program = programs.find((item) => item.name === modalState.programName);
          if (program) handleToggleLock(program.id);
          setModalState({ type: null });
        }}
      />

      <FigureRenderPreviewModal
        isOpen={renderPreviewOpen}
        onClose={() => setRenderPreviewOpen(false)}
        versions={renderVersions}
        activeVersionLabel={activeRenderVersionLabel}
        onSelectVersion={(v) => setActiveRenderVersionLabel(v.versionLabel)}
        panelLayout={panelLayout}
        panelView={panelView}
        copilotOpen={aiCopilotOpen}
        copilotWidth={aiCopilotWidth}
      />
    </div>
  );
}

// ===================== HomePage =====================

type EventStatus = 'ai-processing' | 'in-progress' | 'completed' | 'to-do' | 'error';

interface EventCardData {
  id: string;
  name: string;
  version: string;
  project: string;
  study: string;
  creator: string;
  createdDate: string;
  status: EventStatus;
  progress?: { completed: number; total: number };
  errorMessage?: string;
}

const homeEvents: EventCardData[] = [
  {
    id: 'e1',
    name: 'Safety Monitoring Report',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-11',
    status: 'ai-processing',
  },
  {
    id: 'e2',
    name: 'CSR Interim Analysis',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-11',
    status: 'in-progress',
    progress: { completed: 14, total: 15 },
  },
  {
    id: 'e3',
    name: 'DSMB Q1 Report',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-11',
    status: 'completed',
    progress: { completed: 8, total: 8 },
  },
  {
    id: 'e4',
    name: 'Final CSR',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-11',
    status: 'to-do',
    progress: { completed: 0, total: 12 },
  },
  {
    id: 'e5',
    name: 'PK Analysis Report',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-11',
    status: 'error',
    errorMessage: 'Shell file parsing failed.',
  },
  {
    id: 'e6',
    name: 'Adverse Event Summary',
    version: '1.0',
    project: 'PRO002',
    study: 'AZE2001-302',
    creator: 'Sarah',
    createdDate: '2025-11-09',
    status: 'in-progress',
    progress: { completed: 6, total: 20 },
  },
  {
    id: 'e7',
    name: 'Demographics Table Generation',
    version: '3.1',
    project: 'PRO002',
    study: 'AZE2001-302',
    creator: 'Sarah',
    createdDate: '2025-11-08',
    status: 'completed',
    progress: { completed: 12, total: 12 },
  },
  {
    id: 'e8',
    name: 'Efficacy Endpoint Analysis',
    version: '2.0',
    project: 'PRO003',
    study: 'AZE2001-303',
    creator: 'James',
    createdDate: '2025-11-07',
    status: 'ai-processing',
  },
  {
    id: 'e9',
    name: 'Concomitant Medications Listing',
    version: '1.5',
    project: 'PRO003',
    study: 'AZE2001-303',
    creator: 'James',
    createdDate: '2025-11-05',
    status: 'to-do',
    progress: { completed: 0, total: 8 },
  },
  {
    id: 'e10',
    name: 'Lab Data Outlier Review',
    version: '2.2',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-03',
    status: 'in-progress',
    progress: { completed: 3, total: 10 },
  },
  {
    id: 'e11',
    name: 'Vital Signs Summary Table',
    version: '1.0',
    project: 'PRO004',
    study: 'AZE2001-401',
    creator: 'Emily',
    createdDate: '2025-11-01',
    status: 'completed',
    progress: { completed: 15, total: 15 },
  },
  {
    id: 'e12',
    name: 'Protocol Deviations Report',
    version: '2.2',
    project: 'PRO004',
    study: 'AZE2001-401',
    creator: 'Emily',
    createdDate: '2025-10-28',
    status: 'error',
    errorMessage: 'SAS macro execution failed.',
  },
  {
    id: 'e13',
    name: 'Demographics Group Analysis',
    version: '1.0',
    project: 'PRO001',
    study: 'AZE2001-301',
    creator: 'Tom',
    createdDate: '2025-11-12',
    status: 'error',
    errorMessage: 'Critical validation failed: The database structure does not conform to CDISC SDTM IG v3.2. Columns USUBJID, AGE, and SEX are missing or formatted incorrectly in the DM domain file. Please check files and try again.',
  },
];

const homeNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: dashboardIconUrl },
  { id: 'events', label: 'Events', icon: taskIconUrl, active: true },
  { id: 'studies', label: 'Studies', icon: stackIconUrl },
  { id: 'projects', label: 'Projects', icon: capsuleIconUrl },
  { id: 'therapeutic', label: 'Therapeutic Area', icon: microscopeIconUrl },
  { id: 'members', label: 'Members', icon: teamIconUrl },
];

const homeMetrics = [
  { label: 'Total Events', value: '10' },
  { label: 'Not Started', value: '2' },
  { label: 'In Progress', value: '4' },
  { label: 'Pending QC Review', value: '0' },
  { label: 'Completed', value: '2' },
  { label: 'Created by Me', value: '2' },
];

const statusConfig: Record<EventStatus | 'uploading', { icon: string; label: string; color: string }> = {
  'ai-processing': { icon: aiProcessingIconUrl, label: 'AI Processing', color: "var(--color-text-primary)" },
  'in-progress': { icon: wipStatusIconUrl, label: 'In Progress', color: "var(--color-text-primary)" },
  'completed': { icon: completedStatusIconUrl, label: 'Completed', color: "var(--color-text-primary)" },
  'to-do': { icon: untouchedStatusIconUrl, label: 'To do', color: "var(--color-text-primary)" },
  'error': { icon: errorStatusIconUrl, label: 'Parse Failed', color: '#CC2C3C' },
  'uploading': { icon: aiProcessingIconUrl, label: 'Uploading...', color: "var(--color-text-secondary)" },
};

function StatusTag({ status }: { status: EventStatus | 'uploading' }) {
  const config = statusConfig[status];
  const isUploading = status === 'uploading';
  return (
    <div className="flex items-center gap-[4px] rounded-[4px]">
      {isUploading ? (
        <svg className="h-[16px] w-[16px] animate-spin block shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6" stroke="var(--color-text-secondary)" strokeWidth="2" strokeDasharray="12" strokeLinecap="round" />
        </svg>
      ) : (
        <img src={config.icon} alt="" className="h-[16px] w-[16px] block shrink-0" />
      )}
      <span className="t-small" style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

function MoreIcon({ color = "#888E8E" }) {
  return (
    <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" fill={color} />
    </svg>
  );
}

interface EventCardProps {
  event: EventCardData;
  onEventClick: () => void;
  onUpdateStatus: (id: string, status: EventStatus) => void;
  onOpenDownload?: () => void;
  onDelete?: () => void;
}

function EventCard({ event, onEventClick, onUpdateStatus, onOpenDownload, onDelete }: EventCardProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const isError = event.status === 'error';
  const isUploading = event.status === ('uploading' as any);
  const isClickable = !isError && !isUploading;

  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClose = () => setShowMoreMenu(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showMoreMenu]);

  const handleReupload = () => {
    onUpdateStatus(event.id, 'uploading' as any);
    setTimeout(() => {
      onUpdateStatus(event.id, 'ai-processing');
    }, 1000);
  };

  const actionButtons = [
    { icon: toolCallIconUrl, label: 'AI edit' },
    { icon: teamIconUrl, label: 'Team' },
    { icon: barChartIconUrl, label: 'View charts' },
    { icon: downloadIconUrl, label: 'Download', onClick: onOpenDownload },
    { icon: deleteBinIconUrl, label: 'Delete', onClick: onDelete },
  ];

  return (
    <div
      onClick={isClickable ? onEventClick : undefined}
      className={`flex flex-col md:flex-row min-h-[92px] h-auto justify-between items-start md:items-center rounded-[4px] border px-[16px] py-[12px] gap-[12px] md:gap-[20px] transition-colors relative ${
        isClickable ? 'cursor-pointer hover:bg-bg-panel' : 'cursor-default'
      } ${
        isError ? 'border-status-error bg-white' : 'border-graphite-10 bg-white'
      }`}
    >
      {/* Left section */}
      <div className="flex min-w-0 flex-1 flex-col gap-[8px] w-full">
        {/* Main contents */}
        <div className="flex flex-col gap-[4px] min-w-0">
          <div className="flex items-center gap-[12px] min-w-0">
            <span className="t-heading text-text-primary truncate" title={event.name}>{event.name}</span>
            <span className="flex h-[16px] items-center justify-center rounded-[2px] border-[0.6px] border-[#888E8E] px-[6px] text-[10px] leading-[12px] text-text-secondary shrink-0">
              {event.version}
            </span>
          </div>
          <div className="flex items-center gap-[4px] min-w-0 text-text-secondary">
            <span className="t-small text-[#666666] truncate">{event.project}</span>
            <span className="t-small font-medium text-text-secondary">/</span>
            <span className="t-small text-[#666666] truncate">{event.study}</span>
          </div>
        </div>
        {/* Meta */}
        <div className="flex items-center gap-[16px] text-text-secondary truncate">
          <span className="t-small text-[#666666] truncate">Created by: {event.creator}</span>
          <span className="t-small text-[#666666] truncate">Created: {event.createdDate}</span>
        </div>
      </div>

      {/* Right section */}
      {isError ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[12px] md:gap-[40px] shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-start md:items-end gap-[4px] min-w-0 flex-1">
            <StatusTag status={event.status} />
            {event.errorMessage && (
              event.errorMessage.length > 90 ? (
                <TooltipText label={event.errorMessage} align="left">
                  <span className="t-small text-[#666666] text-left md:text-right max-w-[280px] sm:max-w-[400px] line-clamp-2 block">
                    {event.errorMessage}
                  </span>
                </TooltipText>
              ) : (
                <span className="t-small text-[#666666] text-left md:text-right max-w-[280px] sm:max-w-[400px] block">
                  {event.errorMessage}
                </span>
              )
            )}
          </div>
          <div className="flex items-center gap-[12px] self-stretch sm:self-auto justify-between sm:justify-end shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleReupload(); }}
              className="flex items-center justify-center gap-[4px] rounded-[4px] bg-az-secondary px-[12px] py-[8px] hover:bg-az-secondary-hover active:scale-[0.96] whitespace-nowrap"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span className="text-[14px] font-medium text-brand-1">Re-upload Files</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
              aria-label="Delete"
            >
              <LocalIcon src={deleteBinIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[12px] md:gap-[40px] shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-start md:items-end gap-[4px] shrink-0">
            <StatusTag status={event.status} />
            {event.progress && (
              <span className="text-[12px] leading-[20px] text-left md:text-right">
                <span className="font-medium text-text-primary">{event.progress.completed}/{event.progress.total}</span>{' '}
                <span className="text-[#666666]">TLF Completed</span>
              </span>
            )}
          </div>
          
          {/* Toolbar Actions */}
          {!isUploading && (
            <div className="flex items-center gap-[6px] self-stretch sm:self-auto justify-between sm:justify-end relative shrink-0">
              {/* Expanded on Large Desktop (>= 1200px / xl) */}
              <div className="hidden xl:flex items-center gap-[6px]">
                {actionButtons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      btn.onClick?.();
                    }}
                    className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                    aria-label={btn.label}
                    title={btn.label}
                  >
                    <LocalIcon src={btn.icon} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                  </button>
                ))}
              </div>

              {/* Collapsed on smaller viewports (< 1200px / xl) */}
              <div className="flex xl:hidden items-center relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreMenu(prev => !prev);
                  }}
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="More actions"
                  title="More actions"
                >
                  <MoreIcon color="var(--color-text-secondary)" />
                </button>
                
                {showMoreMenu && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 bottom-[32px] sm:bottom-auto sm:top-[28px] mt-[4px] bg-white border border-[#D8DADA] rounded-[4px] shadow-lg py-[4px] w-[150px] z-50 animate-fade-in"
                  >
                    {actionButtons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMoreMenu(false);
                          btn.onClick?.();
                        }}
                        className="w-full text-left px-[12px] py-[6px] t-small text-text-primary hover:bg-bg-panel flex items-center gap-[8px]"
                      >
                        <LocalIcon src={btn.icon} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HomePage({
  onEventClick,
  onCreateEvent,
  events,
  onUpdateStatus,
  treeListOpen,
  setTreeListOpen,
  treeListWidth,
  setTreeListWidth,
  onOpenDownloadModal,
  onOpenDeleteModal,
}: {
  onEventClick: () => void;
  onCreateEvent: () => void;
  events: EventCardData[];
  onUpdateStatus: (id: string, status: EventStatus) => void;
  treeListOpen: boolean;
  setTreeListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeListWidth: number;
  setTreeListWidth: React.Dispatch<React.SetStateAction<number>>;
  onOpenDownloadModal?: (event: EventCardData) => void;
  onOpenDeleteModal?: (event: EventCardData) => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isResizing, setIsResizing] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-panel">
      <div className="flex min-w-0 flex-1 overflow-hidden pl-[4px]">
        {/* Tree list sidebar */}
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: treeListOpen ? `${treeListWidth}px` : "0px",
            opacity: treeListOpen ? 1 : 0,
            transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          <div className="flex h-full w-full flex-col bg-bg-panel">
            {/* Sidebar header */}
            <div className="flex h-[48px] shrink-0 items-center justify-between px-[10px]">
              <img src={atlasLogoFullUrl} alt="" className="h-[24px] block shrink-0" />
              <TooltipText label="Collapse Tree List">
                <button
                  onClick={() => setTreeListOpen(false)}
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Collapse tree list"
                >
                  <LocalIcon src={collapseIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                </button>
              </TooltipText>
            </div>
            {/* Nav items */}
            <div className="flex flex-1 flex-col gap-[2px] pt-[8px] pr-[4px]">
              {homeNavItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex h-[32px] items-center gap-[4px] rounded-[4px] px-[12px] ${
                    item.active ? 'bg-az-secondary' : 'hover:bg-black/5'
                  }`}
                >
                  <LocalIcon src={item.icon} className="h-[16px] w-[16px]" color={item.active ? '#830051' : '#888E8E'} />
                  <span
                    className={`font-normal ${item.active ? 'text-brand-1' : 'text-text-primary'}`}
                    style={{ fontSize: '14px', lineHeight: '20px' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            {/* User account */}
            <div className="flex items-center gap-[8px] px-[12px] pb-[16px]">
              <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#9DB0AC]">
                <span className="text-[12px] font-medium text-white">U</span>
              </div>
              <span className="font-normal text-text-primary" style={{ fontSize: '14px', lineHeight: '20px' }}>User account</span>
            </div>
          </div>
        </div>

        {/* TreeList ↔ Main panel divider */}
        {treeListOpen && (
          <WorkspaceDivider
            onDragStart={() => setIsResizing(true)}
            onDragEnd={() => setIsResizing(false)}
            onDrag={(delta) => setTreeListWidth((width) => clamp(width + delta, 180, 320))}
          />
        )}

        {/* Main Container Wrapper (与详情页结构、图层层级和裁剪规则完全保持一致) */}
        <div className="relative flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden pl-[4px] pt-[4px] pb-[8px] pr-[8px]">
          <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-graphite-10 bg-white shadow-card-mulberry">
            {/* Expand tree list button when collapsed */}
            {!treeListOpen && (
              <div className="flex h-[48px] shrink-0 items-center px-[12px] border-b-[0.6px] border-border-default">
                <TooltipText label="Expand tree list">
                  <button
                    onClick={() => setTreeListOpen(true)}
                    className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                    aria-label="Expand tree list"
                  >
                    <LocalIcon src={expandIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
                  </button>
                </TooltipText>
              </div>
            )}
            {/* Top section: Overview + metrics */}
            <div className="flex flex-col justify-center gap-[12px] px-[16px] sm:px-[28px] py-[12px]">
              <h2 className="t-heading text-text-primary">Overview</h2>
              <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-6 md:gap-[16px] lg:gap-[20px]">
                {homeMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col gap-[4px] rounded-[4px] border-[0.6px] border-border-default bg-white px-[16px] py-[8px]"
                  >
                    <span className="text-[14px] font-medium leading-[20px] text-text-secondary truncate" title={m.label}>{m.label}</span>
                    <span className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold leading-[1] text-text-primary">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event list */}
            <div className="flex min-h-0 flex-1 flex-col gap-[12px] px-[16px] sm:px-[28px] pt-[20px] sm:pt-[28px]">
              {/* Event list header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px]">
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search..."
                  background="light"
                  className="w-full sm:w-[320px] shrink-0"
                />
                <div className="flex items-center justify-between sm:justify-end gap-[16px] w-full sm:w-auto">
                  <button className="flex items-center gap-[4px] rounded-[4px] px-[12px] py-[8px] hover:bg-black/5 active:scale-[0.96]">
                    <LocalIcon src={filterIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-primary)" />
                    <span className="text-[14px] leading-[20px] text-text-primary">Filter</span>
                  </button>
                  <button
                    onClick={onCreateEvent}
                    className="flex items-center gap-[4px] rounded-[4px] bg-brand-1 px-[12px] py-[8px] hover:opacity-90 active:scale-[0.96] whitespace-nowrap shrink-0"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <LocalIcon src={addLineIconUrl} className="h-[16px] w-[16px]" color="white" />
                    <span className="text-[14px] leading-[20px] text-white">New Event</span>
                  </button>
                </div>
              </div>

              {/* Event cards */}
              <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-auto pb-[16px]">
                {events
                  .filter((event) => event.name.toLowerCase().includes(searchValue.toLowerCase()) || event.project.toLowerCase().includes(searchValue.toLowerCase()) || event.study.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEventClick={onEventClick}
                      onUpdateStatus={onUpdateStatus}
                      onOpenDownload={() => onOpenDownloadModal?.(event)}
                      onDelete={() => onOpenDeleteModal?.(event)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  const [page, setPage] = useState<'home' | 'event'>('home');
  const [treeListOpen, setTreeListOpen] = useState(true);
  const [treeListWidth, setTreeListWidth] = useState(240);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadEvent, setSelectedDownloadEvent] = useState<string | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState<EventCardData | null>(null);
  const [events, setEvents] = useState<EventCardData[]>(homeEvents);

  const handleOpenDownload = (event?: EventCardData) => {
    setSelectedDownloadEvent(event ? event.name : undefined);
    setDownloadModalOpen(true);
  };

  const handleOpenDelete = (event: EventCardData) => {
    setSelectedDeleteEvent(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleCreateEvent = (eventData: { name: string; project: string; study: string }) => {
    const newEvent: EventCardData = {
      id: `e${events.length + 1}`,
      name: eventData.name,
      version: '1.0',
      project: eventData.project,
      study: eventData.study,
      creator: 'User',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'ai-processing',
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {page === 'home' ? (
        <HomePage
          onEventClick={() => setPage('event')}
          onCreateEvent={() => setCreateEventModalOpen(true)}
          events={events}
          onUpdateStatus={handleUpdateStatus}
          treeListOpen={treeListOpen}
          setTreeListOpen={setTreeListOpen}
          treeListWidth={treeListWidth}
          setTreeListWidth={setTreeListWidth}
          onOpenDownloadModal={handleOpenDownload}
          onOpenDeleteModal={handleOpenDelete}
        />
      ) : (
        <WorkspaceContent
          onNavigateHome={() => setPage('home')}
          treeListOpen={treeListOpen}
          setTreeListOpen={setTreeListOpen}
          treeListWidth={treeListWidth}
          setTreeListWidth={setTreeListWidth}
          onOpenDownloadModal={() => handleOpenDownload()}
        />
      )}
      <CreateEventModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
      <DownloadSasProgramsModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
      <DeleteEventModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        event={selectedDeleteEvent}
      />
    </div>
  );
}
