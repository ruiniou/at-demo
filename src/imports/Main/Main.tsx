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
import barChartIconUrl from "../../icons/bar-chart-2-line.svg";
import downloadIconUrl from "../../icons/download-2-line.svg";
import snowflakeIconUrl from "../../icons/snowflake-line.svg";
import deleteBinIconUrl from "../../icons/delete-bin-line.svg";
import linkUnlinkIconUrl from "../../icons/link-unlink-m.svg";
import focusIconUrl from "../../icons/focus-3-line.svg";
import barChartBoxAiIconUrl from "../../icons/bar-chart-box-ai-line.svg";
import CreateEventModal from "./components/CreateEventModal";
import { KMPlot } from "./components/KMPlot";
import { Button } from "../../components/ui/Button";
import { Tooltip } from "../../components/ui/Tooltip";
import { Dropdown } from "../../components/ui/Dropdown";
import { MultiSelectDropdown } from "../../components/ui/MultiSelectDropdown";
import { FormTextArea as Textarea } from "../../components/ui/FormTextArea";
import { AIInputBox } from "../../components/ui/AI-InputBox";
import { AIUserPrompt } from "../../components/ui/AI-UserPrompt";
import { AICodeDiff } from "../../components/ui/AI-CodeDiff";
import { AIThinkingStatus } from "../../components/ui/AI-ThinkingStatus";
import { AIUpdatedBlock } from "../../components/ui/AI-UpdatedBlock";
import ChatBox from "./components/ChatBox";
import { SearchBar } from "../../components/ui/SearchBar";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { OptionLabel } from "../../components/ui/OptionLabel";
import { FormInputField as Input } from "../../components/ui/FormInputField";
import { Input as BaseInput } from "../../components/ui/Input";
import { FormItem } from "../../components/ui/FormItem";
import shiningFillIconUrl from "../../icons/shining-fill.svg";

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
      className={`border-[0.6px] border-graphite-10 rounded-[4px] px-[12px] py-[8px] w-full transition-colors ${
        hovered ? 'bg-bg-panel' : 'bg-transparent'
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
    <div className="border border-graphite-10 rounded-[6px] w-full overflow-hidden bg-white mb-[8px]">
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
    <span className="inline-block px-[4px] py-[2px] rounded-[4px] bg-graphite-10 text-[13px] font-mono text-brand-1 leading-none mx-[2px]">
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
  type: 'user' | 'ai_thinking' | 'ai_ask_user' | 'ask_user_result' | 'ai_complete' | 'ai_update_complete';
  content?: string;
  hasTag?: boolean;
  answers?: { q: string; a: string }[];
  isSkipped?: boolean;
};

function ChatConversation({ 
  messages, 
  isPending,
  onOpenCodePanel,
  onOpenSpatialView,
  onJumpToMetadata,
  docType,
  reviewItems
}: { 
  messages: Message[]; 
  isPending: boolean; 
  onOpenCodePanel?: () => void;
  onOpenSpatialView?: () => void;
  onJumpToMetadata?: (blockId: string, fieldId: string) => void;
  docType?: DocumentType;
  reviewItems?: ReviewItem[];
}) {
  const lastMessage = messages[messages.length - 1];
  const showAskUser = lastMessage?.type === 'ai_ask_user';

  return (
    <div className="flex flex-col w-full p-[10px] gap-[12px] relative">

      {messages.map((msg, i) => (
        <React.Fragment key={i}>
          <div className={`flex flex-col w-full gap-[12px] relative ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.type === 'user' && (
              <AIUserPrompt
                content={msg.content || ""}
                tag={msg.hasTag ? "Table.14.1.1 (Lines 290-321)" : undefined}
              />
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
                <div className="flex flex-col w-full px-[10px] relative gap-[12px]">
                  
                  {docType === 'figure' ? (
                    <>
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

                      <p className="t-body text-text-primary leading-relaxed mb-[12px]">
                        SAS Code has been generated. <Hyperlink onClick={onOpenCodePanel}>View in Code Panel</Hyperlink>.
                      </p>

                      <ToBeReviewedBlock 
                        items={reviewItems && reviewItems.length > 0 ? reviewItems : DEFAULT_FIGURE_REVIEW_ITEMS}
                        onJumpToMetadata={onJumpToMetadata}
                      />
                    </>
                  ) : (
                    <>
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
                      <div className="relative w-full">
                        <ToolCallCard toolName="read_file" />
                      </div>
                      <div className="relative w-full mt-[12px]">
                        <AICodeDiff />
                      </div>
                      <div className="relative w-full mt-[12px]">
                        <ErrorMessageWithRetry />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {msg.type === 'ai_update_complete' && (
              <div className="flex flex-col gap-[12px] w-full relative">
                <AIThinkingStatus status="completed" />
                <div className="flex flex-col w-full px-[10px] relative gap-[12px]">
                  <div className="flex flex-col gap-[8px] mb-[8px]">
                    <p className="t-body text-text-primary leading-relaxed">
                      I have updated the metadata and code based on your changes. Please review the differences below.
                    </p>
                  </div>
                  <div className="relative w-full mt-[4px]">
                    <AICodeDiff />
                  </div>
                </div>
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function AICopilotPanel({
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
  onMetaCancel,
  onMetaProceed,
}: {
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
  onMetaCancel?: () => void;
  onMetaProceed?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (docType === 'figure') return [{ type: 'ai_complete' }];
    return [
      { type: 'user', content: 'Generate Kaplan-Meier survival plot report for OS.' },
      { type: 'ai_complete' }
    ];
  });
  const [isPending, setIsPending] = useState(false);

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

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    (document.activeElement as HTMLElement)?.blur();
    setMessages(prev => [...prev, { type: 'user', content: text }]);
    setCurrentVal("");
    setIsPending(true);

    if (metaUpdateActive) {
      onMetaProceed?.();
    }

    setMessages(prev => [...prev, { type: 'ai_thinking' }]);
    setTimeout(() => {
      if (docType === 'figure') {
        setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_update_complete' as const } : m));
        setIsPending(false);
      } else {
        setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_ask_user' as const } : m));
        // for listing, keep original behavior
      }
    }, 2000);
  };

  return (
    <div 
      className="flex flex-col h-full bg-white relative"
      style={{ width: panelWidth }}
    >
      {/* Header */}
      <div className="bg-white h-[40px] flex items-center justify-between px-[12px] border-b border-graphite-10">
        <div className="flex items-center gap-[8px]">
          <AtlasLogoIcon className="h-[16px] w-[16px]" color="var(--color-brand-1)" />
        </div>
        <button
          onClick={onClose}
          aria-label="Close AI Copilot"
          title="Close AI Copilot"
          className="relative w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0 after:content-[''] after:absolute after:-inset-[8px]"
        >
          <CloseIcon className="w-[16px] h-[16px]" color="var(--color-text-secondary)" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto scroll-smooth">
        {messages.length === 0 ? (
          <div className="absolute top-[40px] inset-x-0 flex flex-col items-center pt-[180px] gap-[12px]">
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
          />
        )}
        {metaUpdateActive && metaDiffItems && metaDiffItems.length > 0 && (
          <div className="px-[20px] pb-[10px]">
            <AIUpdatedBlock
              title="To be Updated"
              count={metaDiffItems.length}
              expanded="scrollable"
              scrollHeight={210}
              toggleable={true}
              items={metaDiffItems.map(d => {
                const oldVal = d.oldValue && d.oldValue.trim() !== '' ? d.oldValue : 'Empty';
                const newVal = d.newValue && d.newValue.trim() !== '' ? d.newValue : 'Empty';
                return {
                  label: d.label,
                  text: `~~${oldVal}~~ → ${newVal}`,
                  onClick: () => onJumpToMetadata?.('', d.fieldId)
                };
              })}
              onCancel={() => onMetaCancel?.()}
              onProceed={() => {
                onMetaProceed?.();
                setIsPending(true);
                setMessages(prev => [...prev, { type: 'ai_thinking' as const }]);
                setTimeout(() => {
                  setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_update_complete' as const } : m));
                  setIsPending(false);
                }, 2000);
              }}
            />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative p-[8px] flex flex-col gap-[4px]">
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
          <ChatBox onSubmit={handleSubmit} metadataChangesCount={metaDiffItems.length} />
        ) : hasCodeDiff ? (
          <ChatBox onSubmit={handleSubmit} pending={true} />
        ) : (
          <AIInputBox disabled={isPending} onSubmit={handleSubmit} value={currentVal} onValueChange={setCurrentVal} focusTrigger={focusTrigger} />
        )}
        {messages.length === 0 && <p className="t-small text-[#D8DADA] text-center leading-[20px]">AI-generated content for reference only</p>}
      </div>
    </div>
  );
}

// ==================== Workspace Shell: Top Nav & Tree List ====================

type ItemStatus = 'pending' | 'locked' | 'analyzing' | 'error' | 'modified';
type DocumentType = 'table' | 'listing' | 'figure';
type ActiveView = 'table' | 'group' | 'listing';

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

function SparklesIcon({ color }: { color?: string } = {}) {
  return (
    <SvgIcon className="w-[16px] h-[16px]">
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

function TooltipText({ label, children, align = "center", disabled = false }: { label: React.ReactNode; children: React.ReactNode; align?: "center" | "left"; disabled?: boolean }) {
  if (disabled) return <>{children}</>;
  return (
    <Tooltip label={label} align={align}>
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
    <div className="bg-bg-panel flex items-center rounded-[4px]">
      <TooltipText label="Show Shell">
        <button
          onClick={() => onChange('shell')}
          className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
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
      <TooltipText label={layout === 'vertical' ? "Stack View" : "Side-by-Side View"}>
        <button
          onClick={() => {
            if (value === 'both') {
              onLayoutChange(layout === 'vertical' ? 'horizontal' : 'vertical');
            } else {
              onChange('both');
            }
          }}
          className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
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
      <TooltipText label="Show Code Only">
        <button
          onClick={() => onChange('code')}
          className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
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
  activeView,
  onActiveViewChange,
  panelView,
  onPanelViewChange,
  panelLayout,
  onPanelLayoutChange,
  docType = 'table',
  rtfOpen,
  onToggleRtf,
}: {
  treeListOpen: boolean;
  onToggleTreeList: () => void;
  onNavigateHome: () => void;
  currentEvent: string;
  activeView: ActiveView;
  onActiveViewChange: (v: ActiveView) => void;
  panelView: PanelView;
  onPanelViewChange: (v: PanelView) => void;
  panelLayout: PanelLayout;
  onPanelLayoutChange: (l: PanelLayout) => void;
  docType?: DocumentType;
  rtfOpen?: boolean;
  onToggleRtf?: () => void;
}) {

  const viewTabs = (docType === 'listing' || docType === 'figure') ? null : (
    <>
      <button
        onClick={() => onActiveViewChange('table')}
        className={`w-[120px] h-full flex items-center justify-center gap-[4px] px-[16px] relative active:scale-[0.96] ${
          activeView === 'table' ? 'bg-white' : ''
        }`}
      >
        {activeView === 'table' && (
          <div aria-hidden className="absolute border-brand-1 border-b-2 border-solid inset-0 pointer-events-none" />
        )}
        <TableTreeIcon color={activeView === 'table' ? '#830051' : '#3C4242'} />
        <p className={`t-small font-medium ${activeView === 'table' ? 'text-brand-1' : 'text-text-primary'}`}>Table View</p>
      </button>
      <button
        onClick={() => onActiveViewChange('group')}
        className={`w-[120px] h-full flex items-center justify-center gap-[4px] px-[16px] relative active:scale-[0.96] ${
          activeView === 'group' ? 'bg-white' : ''
        }`}
      >
        {activeView === 'group' && (
          <div aria-hidden className="absolute border-brand-1 border-b-2 border-solid inset-0 pointer-events-none" />
        )}
        <FolderIcon color={activeView === 'group' ? '#830051' : '#3C4242'} />
        <p className={`t-small font-medium ${activeView === 'group' ? 'text-brand-1' : 'text-text-primary'}`}>Group View</p>
      </button>
    </>
  );

  const rightControls = (
    <div className="flex items-center gap-[12px]">
      <PanelViewToggle value={panelView} onChange={onPanelViewChange} layout={panelLayout} onLayoutChange={onPanelLayoutChange} docType={docType} />
    </div>
  );

  if (!treeListOpen) {
    // Collapsed: single row with study info + view tabs + panel toggle
    return (
      <div className="shrink-0 w-full bg-white">
        <div className="h-[48px] w-full border-b-[0.6px] border-border-default flex items-center px-[12px] justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0">
              <p className="t-small truncate font-medium text-text-primary">AZE2001-301</p>
              <p className="truncate text-[10px] leading-[15px] text-text-secondary">{currentEvent}</p>
            </div>
            <TooltipText label="Open Tree List">
              <button
                onClick={onToggleTreeList}
                className="h-[24px] w-[24px] flex items-center justify-center hover:bg-black/5 rounded-[4px] active:scale-[0.96]"
                aria-label="Open tree list"
              >
                <LocalIcon src={expandIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
              </button>
            </TooltipText>
          </div>
          <div className="flex items-stretch gap-[4px] h-full">{viewTabs}</div>
          {rightControls}
        </div>
      </div>
    );
  }

  // Expanded: view tabs row only
  return (
    <div className="shrink-0 w-full bg-white">
      <div className="h-[48px] w-full border-b-[0.6px] border-border-default flex items-center bg-white relative">
        <div className="flex items-stretch justify-center flex-1 h-full">
          {viewTabs}
        </div>
        <div className="absolute right-[12px] top-[12px]">
          {rightControls}
        </div>
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
      <TooltipText label="Queued — Waiting for Table 14.1.4 to complete">
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
}: {
  onDrag: (delta: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
      className="relative z-10 w-[1px] shrink-0 cursor-col-resize bg-transparent"
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
      <div className="absolute inset-y-0 -left-[3px] -right-[3px]" />
      <div className={`absolute inset-y-0 left-[-1px] w-[3px] bg-brand-1 transition-opacity duration-150 ${isHovered || isDragging ? 'opacity-100 delay-200' : 'opacity-0 delay-0'}`} />
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
              className={`flex h-[24px] items-center gap-[2px] rounded-[4px] px-[4px] active:scale-[0.96] ${
                isSelected ? "bg-graphite-10" : "hover:bg-graphite-10"
              }`}
            >
              {category.icon}
              <p className="t-small whitespace-nowrap text-text-primary">{category.label}</p>
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
    <div className={`flex h-[40px] w-full shrink-0 items-center justify-between bg-white pl-[12px] pr-[16px] py-0 ${noBorder ? '' : 'border-b border-graphite-10'}`}>
      <div className="truncate flex items-center">{title}</div>
      {actions && <div className="flex items-center gap-[4px]">{actions}</div>}
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
}: {
  onDrag: (delta: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
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
      className="relative h-[3px] shrink-0 cursor-row-resize bg-transparent"
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
      <div className="absolute inset-x-0 -top-[3px] -bottom-[3px]" />
      {(isHovered || isDragging) && <div className="absolute inset-x-0 top-[-1px] h-[3px] bg-brand-1" />}
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
  { key: "studyDay", label: "Study\nday [b]", width: 80, widthPx: 80 },
  { key: "lesionNum", label: "Lesion\nnumber", width: 80, widthPx: 80 },
  { key: "lesionLoc", label: "Lesion location", width: 200, widthPx: 200 },
  { key: "locSpec", label: "Location within site\nspecification", width: 220, widthPx: 220 },
  { key: "method", label: "Method of assessment", width: 160, widthPx: 160 },
  { key: "diameter", label: "Diameter\n(mm) [c]", width: 90, widthPx: 90 },
  { key: "sum", label: "Sum of\ndiameters\n(mm) [d]", width: 100, widthPx: 100 },
] as const;

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
}: ListingShellPreviewProps) {
  const [pageScale] = useState(100);
  const [selectedPrintPageIndex, setSelectedPrintPageIndex] = useState(0);
  const [pageSelectionDraft, setPageSelectionDraft] = useState('1');
  const [metadataPending, setMetadataPending] = useState(false);

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
  const [gapXPositions, setGapXPositions] = useState<number[]>([]);

  const listingScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const thRefs = useRef<Array<HTMLTableCellElement | null>>([]);
  const gapXPositionsRef = useRef<number[]>([]);

  const previousPageSepActiveRef = useRef(pageSepActive);
  const pageCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pagePreviewScrollRef = useRef<HTMLDivElement>(null);
  const suppressPageSyncRef = useRef(false);
  const suppressPageSyncTimerRef = useRef<number | null>(null);

  const totalListingWidth = useMemo(() => listingColumns.reduce((sum, col) => sum + col.widthPx, 0), [listingColumns]);

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
      <div className="bg-white h-[40px] shrink-0 w-full flex items-center justify-between px-[12px]">
        <p className="t-small truncate text-black">{selectedItemName || 'Shell preview'}</p>
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[8px]">
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
      <div className="flex flex-1 overflow-hidden relative">
        <div
          ref={listingScrollContainerRef}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollLeft > 0)}
          className={`relative flex-1 overflow-auto scrollbar-code ${pageSepActive ? 'bg-[#f2f3f3]' : 'bg-white'}`}
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
                      className={`relative overflow-hidden bg-white shadow-[0px_10px_30px_rgba(32,37,37,0.12)] border border-[#cfd2d2] transition-shadow duration-[180ms]`}
                      style={{ width: `${pageWidthPx}px`, height: `${pageHeightPx}px` }}
                    >
                      <div style={{ transform: `scale(${pageScale / 100})`, transformOrigin: 'top left' }} className="relative">
                        <div className="absolute right-[32px] top-[28px] rounded-[4px] bg-az-secondary px-[6px] py-0 font-['PingFang_SC',sans-serif] text-[12px] leading-[20px] text-brand-1">{pageIndex + 1}/{printPages.length}</div>
                        <div className="p-[48px] pt-[64px]">
                          <div className="border-b-2 border-black pb-[14px] mb-[10px] text-center">
                            <h1 className="font-['Inter',sans-serif] text-[13px] leading-[18px] font-bold tracking-[-0.01em]">Appendix 16.2.4 Demographic and baseline characteristics (ITT analysis set)</h1>
                            <p className="mt-[4px] font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#6f7676]">
                              Rows {page.rowPageIndex * PRINT_ROWS_PER_PAGE + 1}-{page.rowPageIndex * PRINT_ROWS_PER_PAGE + page.pageRows.length} · Columns {page.pageScrollColumns[0] ? listingColumns.findIndex(c => c.key === page.pageScrollColumns[0].key) + 1 : 1}-{page.pageScrollColumns.length ? listingColumns.findIndex(c => c.key === page.pageScrollColumns[page.pageScrollColumns.length - 1].key) + 1 : frozenPrintColumns.length}{frozenPrintColumns.length > 0 ? ` · frozen 1-${frozenPrintColumns.length} repeated` : ''}
                            </p>
                          </div>
                          <table className="w-full table-fixed border-collapse font-['Inter',sans-serif] text-black">
                            <colgroup>
                              {page.pageColumns.map((column) => (
                                <col key={column.key} style={{ width: `${(column.widthPx / page.pageColumns.reduce((sum, item) => sum + item.widthPx, 0)) * 100}%` }} />
                              ))}
                            </colgroup>
                            <thead>
                              <tr className="border-b-2 border-black">
                                {page.pageColumns.map((column) => (
                                  <th key={column.key} className="border-r border-border-default px-[4px] py-[6px] text-left align-middle text-[10px] leading-[14px] font-bold whitespace-normal break-words last:border-r-0">{column.label}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {page.pageRows.map((row) => (
                                <tr key={row.subject} className="border-b border-border-default last:border-b-2 last:border-black">
                                  {page.pageColumns.map((column) => (
                                    <td key={`${row.subject}-${column.key}`} className="border-r border-border-default px-[4px] py-[6px] align-middle text-[10px] leading-[15px] font-normal whitespace-normal break-words last:border-r-0">{(row as Record<string, string>)[column.key]}</td>
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
          <div className={`min-w-max p-[24px] ${pageSepActive ? 'hidden' : ''}`}>
            <div className={`w-max bg-white text-black ${!metadataOpen ? 'mx-auto' : ''}`}>
              <div className="relative">
                {/* Study Info & Page Info */}
                <div className="flex justify-between items-end w-full mb-[24px]">
                  <div className="t-body text-[12px] leading-[18px] whitespace-pre-wrap">AstraZeneca<br/>Study number D9802C00001 Clarity Gastric 01 - Dry Run 1, Dummy Treatment, &lt;&lt;Data cut-off ddmmyyyy&gt;&gt;</div>
                  <div className="t-body text-[12px] leading-[18px] text-right">Page 266 of 280</div>
                </div>

                {/* Title header */}
                <div className="min-w-max flex flex-col items-center justify-center pb-[12px]">
                  <h1 className="t-body text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]">
                    Appendix 16.2.12<br />
                    Tumour assessment details by blinded independent central review (ITT analysis set)<br />
                    Subject identifier: &lt;&lt;Exxxxxxxx&gt;&gt;
                  </h1>
                </div>

                {/* Subheader */}
                <div className="w-full text-left t-body text-[12px] leading-[18px] mb-[12px] mt-[12px]">
                  <p>G. Target lesion details</p>
                  <p>Reviewer: [[Radiologist 1|Radiologist 2]]*, Review identification number: &lt;&lt;xxxxxxx&gt;&gt;</p>
                  <p>Planned treatment group: &lt;&lt;AZD1 (low dose)&gt;&gt;, Duration of actual exposure (months) [a]: &lt;&lt;xx&gt;&gt;, Death study day [b]: &lt;&lt;xx&gt;&gt;</p>
                </div>
                <div ref={tableContainerRef} className="relative inline-block min-w-max">
                  <table className="table-fixed border-separate border-spacing-0 font-['Inter',sans-serif] text-black border-t-2 border-black" style={{ width: `${totalListingWidth}px` }}>
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
                          return (
                            <th
                              key={column.key}
                              ref={(node) => { thRefs.current[columnIndex] = node; }}
                              style={cellStyle}
                              className={`group ${frozen ? 'sticky' : 'relative'} ${column.width > 0 ? '' : ''} border-r border-b-2 border-black border-r-graphite-10 px-[8px] py-[6px] text-left align-middle text-[14px] leading-[20px] font-bold whitespace-normal break-words select-none pointer-events-auto transition-[border-color,box-shadow,background-color,outline-color] duration-[180ms] ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}
                              onMouseEnter={() => {
                                if (draggingBreak === null && draggingFreeze === null && columnIndex < firstPageBreakIndex) {
                                  setHoveredFreezeColumn(columnIndex);
                                }
                              }}
                              onMouseLeave={() => setHoveredFreezeColumn(null)}
                            >
                              {/* Hover tooltip for Add Freeze */}
                              {hoveredFreezeColumn === columnIndex && frozenUntilIndex === null && columnIndex < firstPageBreakIndex && hoveredGap === null && !pageSepActive && (
                                <div
                                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full z-[60] pb-[6px] cursor-pointer active:scale-[0.96] transition-transform pointer-events-auto"
                                  onClick={(e) => { e.stopPropagation(); setFrozenUntilIndex(columnIndex); setHoveredFreezeColumn(null); }}
                                >
                                  <div className="flex items-center gap-[4px] bg-[#3F4444] text-[#EBEFEE] rounded-[4px] pl-[4px] pr-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                                    <FreezeIcon color="white" />
                                    <span className="font-['PingFang_SC',sans-serif] font-normal text-[12px] leading-[20px]">Repeat Columns</span>
                                  </div>
                                </div>
                              )}
                              {/* Button area */}
                              <div className="flex w-full items-center justify-between gap-[4px] rounded-[3px]">
                                <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onBlockClick(); }} className="flex-1 min-w-0 whitespace-pre-wrap break-words rounded-[3px] text-left transition-colors duration-[180ms] hover:bg-black/[0.03] outline-none focus:outline-none" aria-label={`Open ${column.label} metadata`}>{column.label}</button>
                              </div>
                              
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
                      <tr key={rowIndex} className="group hover:bg-az-secondary cursor-pointer">
                        {listingColumns.map((column, columnIndex) => {
                          const frozen = isColumnFrozen(columnIndex);
                          const frozenBoundary = frozenUntilIndex === columnIndex;
                          const shadows: string[] = [];
                          if (frozenBoundary) shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                          const cellStyle: React.CSSProperties = {};
                          if (frozen) { cellStyle.left = `${getFrozenLeft(columnIndex)}px`; cellStyle.zIndex = 20; cellStyle.backgroundColor = 'white'; }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');
                          return (
                            <td key={`${rowIndex}-${column.key}`} style={cellStyle} className={`border-r border-b border-b-border-default group-last:border-b-2 group-last:border-b-black border-border-default px-[8px] py-[6px] align-middle text-[12px] leading-[18px] font-normal whitespace-pre-wrap break-words transition-[border-color,box-shadow,background-color] duration-[180ms] ${frozen ? 'sticky' : ''} ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}>
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

                  {/* Frozen zone tint — purple wash over the locked columns area */}
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
                    <p key={idx} className="t-body text-[12px] leading-[18px] text-text-secondary whitespace-pre-wrap">
                      {fn}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {metadataOpen && (
          <>
            <WorkspaceDivider onDrag={handleMetadataDividerDrag} />
            <div className="shrink-0 h-full py-[4px] pr-[4px] relative z-20" style={{ width: `${metadataWidth}px` }}>
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-[0px_10px_30px_rgba(32,37,37,0.12)]">
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
                  onIdlistBaselineChange={onIdlistBaselineChange}
                  onAddChangesToChat={(text) => {
                    onOpenAICopilot?.(text);
                  }}
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
  footnotes?: string[];
  columnGroups: { name: string; span: number }[];
  columns: string[];
  rows: { category: string; indent?: number; values: string[]; isHeader?: boolean }[];
}

const shellTableData: Record<string, ShellTableData> = {
  'Figure 15.1.1': {
    tableNumber: 'Figure 15.1.1',
    tableTitle: 'Kaplan-Meier plot of progression-free survival by treatment group',
    studyInfo: 'AstraZeneca Page [X]\nStudy number D9802C00001 Clarity Gastric 01 - Dry Run 1, Dummy Treatment, <<Data cut-off ddmmmyyyy>>',
    pageInfo: '',
    population: '(Safety analysis set)',
    footnotes: [
      '[a] ITT Population: All randomized subjects. Subjects are summarised in the arm to which they were randomised.',
      '[b] Kaplan-Meier estimates are used for survival curves. Median survival time and 95% CI are calculated.',
      '[c] Cross marks indicate censored observations (e.g., lost to follow-up or administrative censoring).',
      'Source: eTMF Data snapshot <<Data cut-off ddmmmyyyy>>.'
    ],
    columnGroups: [],
    columns: [],
    rows: []
  },
  'Table 14.1.1': {
    tableNumber: 'Table 14.1.1',
    tableTitle: 'Disposition',
    studyInfo: 'AstraZeneca\nStudy number D9802C00001 Clarity Gastric 01 - Dry Run 1, Dummy Treatment, <<Data cut-off ddmmyyyy>>',
    pageInfo: 'Page 9 of 280',
    footnotes: [
      '[a] Screened subjects are those who signed main informed consent.',
      '[b] Percentages are based on the number of subjects started treatment.',
      'Subjects are summarised in the arm to which they were randomised.',
      'Percentages are based on the number of subjects randomised, with the exception of those marked.',
      'n Number of subjects per category.',
      '<<output program path>> <<output file name>> <<date/time>>'
    ],
    population: '',
    columnGroups: [
      { name: 'AZD0901 1.8\nmg/kg', span: 1 },
      { name: 'AZD0901 2.2\nmg/kg', span: 1 },
      { name: 'Investigator\nchoice of\ntherapy', span: 1 },
      { name: 'Total', span: 1 },
    ],
    columns: ['n', 'n', 'n', 'n'],
    rows: [
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued Ramucirumab', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued Paclitaxel', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued Docetaxel', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued Irinotecan', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued TAS-102', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects discontinued Apatinib', values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason1>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '<<Reason2>>', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: '...', indent: 1, values: ['xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)', 'xx (xx.x)'] },
      { category: 'Subjects ongoing in study at data cut-off date', values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Subjects withdrawn from study', values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Death', indent: 1, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Lost to follow-up', indent: 1, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Screen failure', indent: 1, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Study terminated by sponsor', indent: 1, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
      { category: 'Withdrawal by subject', indent: 1, values: ['xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)', 'xxx (xx.x)'] },
    ],
  },
  'Table 14.1.2': {
    tableNumber: 'Table 14.1.2',
    tableTitle: 'Baseline Disease Characteristics',
    population: 'Safety Analysis Set',
    columnGroups: [
      { name: 'Placebo\n(N=120)', span: 3 },
      { name: 'AZD0780 10mg\n(N=118)', span: 3 },
      { name: 'AZD0780 20mg\n(N=122)', span: 3 },
      { name: 'Total\n(N=360)', span: 3 },
    ],
    columns: ['N', 'Mean (SD)', 'Median', 'N', 'Mean (SD)', 'Median', 'N', 'Mean (SD)', 'Median', 'N', 'Mean (SD)', 'Median'],
    rows: [
      { category: 'Age (years)', values: ['120', '58.3 (12.1)', '59.0', '118', '57.8 (11.7)', '58.0', '122', '59.1 (12.4)', '60.0', '360', '58.4 (12.0)', '59.0'] },
      { category: 'BMI (kg/m²)', values: ['120', '26.8 (4.2)', '26.4', '118', '26.5 (3.9)', '26.2', '122', '27.1 (4.5)', '26.8', '360', '26.8 (4.2)', '26.5'] },
      { category: 'HbA1c (%)', values: ['120', '8.2 (1.1)', '8.1', '118', '8.3 (1.0)', '8.2', '122', '8.2 (1.2)', '8.1', '360', '8.2 (1.1)', '8.1'] },
      { category: 'Fasting Plasma Glucose (mg/dL)', values: ['120', '172.5 (38.4)', '168.0', '118', '175.2 (40.1)', '170.0', '122', '170.8 (36.7)', '165.0', '360', '172.8 (38.3)', '168.0'] },
      { category: 'LDL-C (mg/dL)', values: ['120', '112.3 (28.5)', '110.0', '118', '115.8 (30.2)', '112.0', '122', '110.5 (27.9)', '108.0', '360', '112.8 (28.8)', '110.0'] },
      { category: 'eGFR (mL/min/1.73m²)', values: ['120', '78.5 (16.2)', '80.0', '118', '76.8 (15.8)', '78.0', '122', '79.2 (16.5)', '81.0', '360', '78.2 (16.1)', '79.0'] },
      { category: 'Duration of Diabetes (years)', values: ['120', '7.2 (5.1)', '6.0', '118', '7.8 (5.4)', '7.0', '122', '7.0 (4.8)', '6.0', '360', '7.3 (5.1)', '6.0'] },
    ],
  },
  'Table 14.1.3': {
    tableNumber: 'Table 14.1.3',
    tableTitle: 'Prior and Concomitant Medications',
    population: 'Safety Analysis Set',
    columnGroups: [
      { name: 'Placebo\n(N=120)', span: 2 },
      { name: 'AZD0780 10mg\n(N=118)', span: 2 },
      { name: 'AZD0780 20mg\n(N=122)', span: 2 },
      { name: 'Total\n(N=360)', span: 2 },
    ],
    columns: ['n', '(%)', 'n', '(%)', 'n', '(%)', 'n', '(%)'],
    rows: [
      { category: 'Any Prior Medication', values: ['118', '(98.3)', '116', '(98.3)', '120', '(98.4)', '354', '(98.3)'], isHeader: true },
      { category: 'Metformin', indent: 1, values: ['105', '(87.5)', '103', '(87.3)', '108', '(88.5)', '316', '(87.8)'] },
      { category: 'Sulfonylurea', indent: 1, values: ['42', '(35.0)', '45', '(38.1)', '40', '(32.8)', '127', '(35.3)'] },
      { category: 'DPP-4 Inhibitor', indent: 1, values: ['28', '(23.3)', '25', '(21.2)', '30', '(24.6)', '83', '(23.1)'] },
      { category: 'SGLT2 Inhibitor', indent: 1, values: ['35', '(29.2)', '32', '(27.1)', '38', '(31.1)', '105', '(29.2)'] },
      { category: 'GLP-1 Receptor Agonist', indent: 1, values: ['18', '(15.0)', '15', '(12.7)', '20', '(16.4)', '53', '(14.7)'] },
      { category: 'Insulin', indent: 1, values: ['22', '(18.3)', '20', '(16.9)', '25', '(20.5)', '67', '(18.6)'] },
      { category: 'Statins', indent: 1, values: ['78', '(65.0)', '76', '(64.4)', '82', '(67.2)', '236', '(65.6)'] },
      { category: 'Antihypertensives', indent: 1, values: ['65', '(54.2)', '62', '(52.5)', '68', '(55.7)', '195', '(54.2)'] },
      { category: 'Any Concomitant Medication', values: ['115', '(95.8)', '113', '(95.8)', '118', '(96.7)', '346', '(96.1)'], isHeader: true },
      { category: 'Metformin', indent: 1, values: ['102', '(85.0)', '100', '(84.7)', '105', '(86.1)', '307', '(85.3)'] },
      { category: 'SGLT2 Inhibitor', indent: 1, values: ['32', '(26.7)', '30', '(25.4)', '35', '(28.7)', '97', '(26.9)'] },
    ],
  },
  'Table 14.1.4': {
    tableNumber: 'Table 14.1.4',
    tableTitle: 'Adverse Events Summary by System Organ Class',
    population: 'Safety Analysis Set',
    columnGroups: [
      { name: 'Placebo\n(N=120)', span: 3 },
      { name: 'AZD0780 10mg\n(N=118)', span: 3 },
      { name: 'AZD0780 20mg\n(N=122)', span: 3 },
      { name: 'Total\n(N=360)', span: 3 },
    ],
    columns: ['Subjects with AE', 'n', '(%)', 'Subjects with AE', 'n', '(%)', 'Subjects with AE', 'n', '(%)', 'Subjects with AE', 'n', '(%)'],
    rows: [
      { category: 'Any Adverse Event', values: ['78', '78', '(65.0)', '85', '85', '(72.0)', '92', '92', '(75.4)', '255', '255', '(70.8)'], isHeader: true },
      { category: 'Gastrointestinal Disorders', values: ['22', '22', '(18.3)', '35', '38', '(32.2)', '41', '45', '(36.9)', '98', '105', '(29.2)'], isHeader: true },
      { category: 'Nausea', indent: 1, values: ['5', '5', '(4.2)', '15', '18', '(15.3)', '18', '22', '(18.0)', '38', '45', '(12.5)'] },
      { category: 'Diarrhoea', indent: 1, values: ['3', '3', '(2.5)', '8', '9', '(7.6)', '10', '12', '(9.8)', '21', '24', '(6.7)'] },
      { category: 'Vomiting', indent: 1, values: ['2', '2', '(1.7)', '5', '6', '(5.1)', '7', '8', '(6.6)', '14', '16', '(4.4)'] },
      { category: 'Metabolism and Nutrition Disorders', values: ['15', '15', '(12.5)', '20', '22', '(18.6)', '24', '27', '(22.1)', '59', '64', '(17.8)'], isHeader: true },
      { category: 'Hypoglycaemia', indent: 1, values: ['4', '4', '(3.3)', '8', '9', '(7.6)', '10', '12', '(9.8)', '22', '25', '(6.9)'] },
      { category: 'Decreased appetite', indent: 1, values: ['2', '2', '(1.7)', '6', '7', '(5.9)', '8', '9', '(7.4)', '16', '18', '(5.0)'] },
      { category: 'Nervous System Disorders', values: ['18', '18', '(15.0)', '22', '25', '(21.2)', '26', '30', '(24.6)', '66', '73', '(20.3)'], isHeader: true },
      { category: 'Headache', indent: 1, values: ['8', '8', '(6.7)', '10', '12', '(10.2)', '12', '14', '(11.5)', '30', '34', '(9.4)'] },
      { category: 'Dizziness', indent: 1, values: ['4', '4', '(3.3)', '6', '7', '(5.9)', '8', '9', '(7.4)', '18', '20', '(5.6)'] },
      { category: 'Infections and Infestations', values: ['25', '25', '(20.8)', '28', '32', '(27.1)', '32', '38', '(31.1)', '85', '95', '(26.4)'], isHeader: true },
      { category: 'Nasopharyngitis', indent: 1, values: ['8', '8', '(6.7)', '10', '11', '(9.3)', '12', '14', '(11.5)', '30', '33', '(9.2)'] },
      { category: 'Upper respiratory tract infection', indent: 1, values: ['5', '5', '(4.2)', '6', '7', '(5.9)', '7', '8', '(6.6)', '18', '20', '(5.6)'] },
      { category: 'General Disorders', values: ['12', '12', '(10.0)', '15', '16', '(13.6)', '18', '20', '(16.4)', '45', '48', '(13.3)'], isHeader: true },
      { category: 'Fatigue', indent: 1, values: ['5', '5', '(4.2)', '8', '9', '(7.6)', '10', '11', '(9.0)', '23', '25', '(6.9)'] },
    ],
  },
  'Listing 16.2.1': {
    tableNumber: 'Listing 16.2.1',
    tableTitle: 'Individual Subject Data - Vital Signs',
    population: 'Safety Analysis Set',
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
  },
  'Listing 16.2.2': {
    tableNumber: 'Listing 16.2.2',
    tableTitle: 'Individual Subject Data - Laboratory Results',
    population: 'Safety Analysis Set',
    columnGroups: [{ name: 'Subject-Level Data', span: 8 }],
    columns: ['Subject ID', 'Visit', 'Date', 'HbA1c (%)', 'FPG (mg/dL)', 'LDL-C (mg/dL)', 'eGFR (mL/min)', 'ALT (U/L)'],
    rows: [
      { category: '101-001', values: ['Baseline', '2026-02-01', '8.2', '175', '112', '79', '28'] },
      { category: '101-001', values: ['Week 4', '2026-03-01', '7.9', '158', '108', '80', '26'] },
      { category: '101-001', values: ['Week 12', '2026-04-26', '7.1', '142', '98', '81', '24'] },
      { category: '101-002', values: ['Baseline', '2026-02-04', '8.5', '182', '118', '76', '32'] },
      { category: '101-002', values: ['Week 4', '2026-03-04', '8.3', '178', '115', '77', '30'] },
      { category: '101-002', values: ['Week 12', '2026-04-29', '8.2', '175', '112', '78', '31'] },
      { category: '102-003', values: ['Baseline', '2026-02-06', '8.0', '168', '110', '82', '25'] },
      { category: '102-003', values: ['Week 12', '2026-05-01', '7.2', '145', '95', '83', '22'] },
    ],
  },
  'Listing 16.2.3': {
    tableNumber: 'Listing 16.2.3',
    tableTitle: 'Adverse Events Listing',
    population: 'Safety Analysis Set',
    columnGroups: [{ name: 'AE-Level Data', span: 9 }],
    columns: ['Subject ID', 'Treatment', 'AE Term (MEDDRA)', 'SOC', 'Severity', 'Onset Date', 'End Date', 'Outcome', 'Causality'],
    rows: [
      { category: '101-001', values: ['AZD0780 20mg', 'Nausea', 'GI Disorders', 'Mild', '2026-02-15', '2026-02-18', 'Recovered', 'Related'] },
      { category: '101-001', values: ['AZD0780 20mg', 'Headache', 'Nervous Sys', 'Mild', '2026-03-02', '2026-03-03', 'Recovered', 'Related'] },
      { category: '101-002', values: ['Placebo', 'Nasopharyngitis', 'Infections', 'Mild', '2026-03-10', '2026-03-14', 'Recovered', 'Not Related'] },
      { category: '102-003', values: ['AZD0780 10mg', 'Diarrhoea', 'GI Disorders', 'Moderate', '2026-02-20', '2026-02-23', 'Recovered', 'Related'] },
      { category: '102-003', values: ['AZD0780 10mg', 'Hypoglycaemia', 'Metab/Nutr', 'Mild', '2026-03-15', '2026-03-15', 'Recovered', 'Related'] },
    ],
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
  metaUpdateActive,
  metaUpdateProcessing,
  submittedDiffItems,
  targetFieldId,
  onReviewItemsChange,
}: {
  onBlockClick: () => void;
  onMetadataClick: () => void;
  onMetaDiffChange?: (diffItems: MetaDiffItem[]) => void;
  onRequestUpdateCode?: () => void;
  baselineAdvanceTrigger?: number;
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  submittedDiffItems?: MetaDiffItem[];
  targetFieldId?: string;
  onReviewItemsChange?: (items: ReviewItem[]) => void;
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
}) {
  const [logExpanded, setLogExpanded] = useState(false);
  const activeLogData = successStructuredLog;
  const shellData = shellTableData[selectedItemName] || shellTableData['Table 14.1.1'];
  const metadataMinWidth = 280;
  return (
    <div className="flex h-full flex-col min-w-0 overflow-hidden bg-white">
      <PanelHeader
        noBorder={true}
        title={
          <div className="flex items-center gap-[12px]">
            <span className="font-['PingFang_SC'] text-[12px] font-normal leading-[20px] text-[#3F4444]">{selectedItemName || "Shell preview"}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-[8px]">
            <TooltipText label="Open Metadata">
              <button
                onClick={onMetadataClick}
                className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
                  metadataOpen ? "bg-az-secondary" : "hover:bg-black/5"
                }`}
                aria-label="Toggle metadata"
              >
                <LocalIcon src={fileInfoIconUrl} className="h-[16px] w-[16px]" color={metadataOpen ? "#830051" : "#888E8E"} />
              </button>
            </TooltipText>
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 min-w-0 overflow-hidden">
        {docType === 'figure' ? (
          <div className="flex-1 min-w-0 h-full overflow-auto scrollbar-code">
            <div className="flex h-full min-w-max">
              <div className="flex-1 min-w-[540px] overflow-y-auto overflow-x-hidden pl-[16px] pr-[4px] py-0 bg-white scrollbar-code">
              <div className={`w-[540px] bg-white text-black p-0 ${!rtfOpen && !metadataOpen ? 'mx-auto' : ''}`}>
                <div className="flex flex-col py-[12px] px-0 gap-[16px] w-full">
                  {/* Study Info & Page Info */}
                  {(shellData.studyInfo || shellData.pageInfo) && (
                    <div className="flex justify-between items-end w-full">
                      <div className="font-['Inter'] text-[12px] font-normal leading-[16px] text-[#8C8F8F] whitespace-pre-wrap">{shellData.studyInfo}</div>
                      <div className="font-['Inter'] text-[12px] font-normal leading-[16px] text-[#8C8F8F] text-right">{shellData.pageInfo}</div>
                    </div>
                  )}
                  {/* Title header */}
                  <div className="flex flex-col items-center justify-center gap-[2px] w-full">
                    <h1 className="font-['Inter'] text-[14px] font-medium leading-[24px] text-[#3F4444] text-center m-0">
                      {shellData.tableNumber}
                    </h1>
                    {shellData.tableTitle && (
                      <p className="font-['Inter'] text-[12px] font-normal leading-[16px] text-[#8C8F8F] text-center m-0">
                        {shellData.tableTitle}
                      </p>
                    )}
                    {shellData.population && (
                      <p className="font-['Inter'] text-[12px] font-normal leading-[16px] text-[#8C8F8F] text-center m-0">
                        {shellData.population}
                      </p>
                    )}
                  </div>
                </div>

                <KMPlot
                  mode="shell"
                  showCI={true}
                  showCensorMarks={true}
                  showMedianLines={true}
                  showRiskTable={true}
                  figureNumber={selectedItemName}
                  onBlockClick={onBlockClick}
                />

                {/* Footnotes */}
                {shellData.footnotes && shellData.footnotes.length > 0 && (
                  <div className="flex flex-col gap-[4px] w-full text-left mt-[16px]">
                    {shellData.footnotes.map((fn, idx) => (
                      <p key={idx} className="font-['Inter'] text-[10px] font-normal leading-[14px] text-[#8C8F8F] whitespace-pre-wrap m-0">
                        {fn}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {rtfOpen && (
              <div className="flex-1 min-w-[540px] border-l border-graphite-10 flex flex-col bg-bg-panel overflow-hidden">
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-[16px] bg-white scrollbar-code">
                  <div className="w-[540px] mx-auto">
                    <KMPlot
                      mode="runtime"
                      showCI={true}
                      showCensorMarks={true}
                      showMedianLines={true}
                      showRiskTable={true}
                      figureNumber={selectedItemName}
                      onBlockClick={onBlockClick}
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
                    <div className="max-h-[240px] overflow-auto scrollbar-code px-[8px] pb-[8px]">
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
          <div className="min-h-0 min-w-0 flex-1 overflow-auto">
            <div className="min-w-max p-[24px]">
              <div className={`w-max bg-white text-black ${!metadataOpen ? 'mx-auto' : ''}`}>
                {/* Study Info & Page Info */}
              {(shellData.studyInfo || shellData.pageInfo) && (
                <div className="flex justify-between items-end w-full mb-[24px]">
                  <div className="t-body text-[12px] leading-[18px] whitespace-pre-wrap">{shellData.studyInfo}</div>
                  <div className="t-body text-[12px] leading-[18px] text-right">{shellData.pageInfo}</div>
                </div>
              )}

              {/* Title header */}
              <div className="flex flex-col items-center justify-center pb-[12px] bg-white text-black">
                <h1 className="t-body text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]">
                  {shellData.tableNumber}
                  {shellData.tableTitle && (
                    <>
                      <br />
                      {shellData.tableTitle}
                    </>
                  )}
                </h1>
                {shellData.population && (
                  <p className="t-body text-[14px] leading-[20px] text-center mt-[4px]">
                    {shellData.population}
                  </p>
                )}
              </div>

              <div className="relative inline-block w-full">
                <table className="w-full border-separate border-spacing-0 font-['Inter',sans-serif] text-black border-t-2 border-black">
                  <thead>
                    {/* Column group header */}
                    <tr className="group">
                      <th className="bg-white text-left text-[14px] leading-[20px] font-bold py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default min-w-[180px]">
                      Table/Listing Field
                    </th>
                    {shellData.columnGroups.map((cg, cgi) => (
                      <th
                        key={cgi}
                        colSpan={cg.span}
                        className="bg-bg-panel text-center text-[14px] leading-[20px] font-semibold py-[6px] px-[8px] border-r border-b border-border-default last:border-r-0"
                      >
                        {cg.name.split('\n').map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </th>
                    ))}
                  </tr>
                  {/* Standard columns header */}
                  <tr>
                    <th className="bg-white text-left text-[14px] leading-[20px] font-semibold text-text-secondary py-[6px] px-[8px] border-r border-b border-border-default min-w-[180px]">
                      {shellData.columns[0] || ""}
                    </th>
                    {shellData.columns.slice(1).map((col, ci) => (
                      <th
                        key={ci}
                        className="bg-white text-center text-[14px] leading-[20px] font-semibold text-text-secondary py-[6px] px-[8px] border-r border-b border-border-default last:border-r-0"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shellData.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="group hover:bg-az-secondary cursor-pointer"
                      onClick={onBlockClick}
                    >
                      <td
                        className={`${
                          row.isHeader ? 'bg-bg-panel font-semibold text-text-primary' : 'bg-white text-text-primary group-hover:bg-az-secondary'
                        } text-left text-[12px] leading-[18px] py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default group-last:border-b-2 group-last:border-b-black transition-colors duration-[180ms]`}
                        style={{ paddingLeft: row.indent ? `${8 + row.indent * 16}px` : '8px' }}
                      >
                        {row.category}
                      </td>
                      {row.values.map((val, vi) => (
                        <td
                          key={vi}
                          className={`text-center text-[12px] leading-[18px] ${
                            row.isHeader ? 'bg-bg-panel font-semibold text-text-primary' : 'bg-white text-text-primary group-hover:bg-az-secondary'
                          } py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default last:border-r-0 group-last:border-b-2 group-last:border-b-black transition-colors duration-[180ms]`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Footnotes */}
            {shellData.footnotes && shellData.footnotes.length > 0 && (
              <div className="mt-[16px] flex flex-col gap-[4px] w-full text-left">
                {shellData.footnotes.map((fn, idx) => (
                  <p key={idx} className="t-body text-[12px] leading-[18px] text-text-secondary whitespace-pre-wrap">
                    {fn}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
        {/* Metadata left-edge drag handle — uses WorkspaceDivider pattern */}
        {metadataOpen && (
          <WorkspaceDivider onDrag={(delta) => onMetadataResize(-delta)} />
        )}
        <div
          className={`shrink-0 relative z-20 ${metadataOpen ? 'py-[4px] pr-[4px]' : 'overflow-hidden'}`}
          style={{
            width: metadataOpen ? `${metadataWidth}px` : "0px",
            opacity: metadataOpen ? 1 : 0,
            transition: metadataOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          {metadataOpen && (
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-[0px_10px_30px_rgba(32,37,37,0.12)]">
              <MetadataPanel onClose={onMetadataClose} docType={docType} onJumpToTL={onJumpToTL} associatedTLStatus={associatedTLStatus} onMetaDiffChange={onMetaDiffChange} onRequestUpdateCode={onRequestUpdateCode} baselineAdvanceTrigger={baselineAdvanceTrigger} metaUpdateActive={metaUpdateActive} metaUpdateProcessing={metaUpdateProcessing} submittedDiffItems={submittedDiffItems} targetFieldId={targetFieldId} onReviewItemsChange={onReviewItemsChange} />
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

interface MetadataBlock {
  id: string;
  name?: string;
  state?: 'ready' | 'loading';
  deprecated?: boolean;
  fields: MetadataField[];
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
                  <div key={i} className="flex items-start h-[20px] px-[10px]">
                    <div className="shrink-0 w-[24px] h-[20px] relative">
                      <p className="absolute left-0 top-px whitespace-nowrap select-none text-[12px] leading-[20px] text-[#B2B4B4]" style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{i + 1}</p>
                    </div>
                    <div className="flex-1 min-w-px h-full flex items-center">
                      <p className="whitespace-nowrap text-[13px] leading-[1.25] text-text-secondary" style={{ fontFamily: "'Menlo','Consolas',monospace" }}>{line}</p>
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

// ── Block Items Data for Blocks Tab Two-Column Layout ──
const METADATA_BLOCK_ITEMS_DATA = [
  {
    id: 'nicotine',
    name: 'Nicotine use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
      { id: 'variable', label: 'Variable', value: 'NICSTT', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICSTT', value: 'NICSTT'}, {label: 'ALCSTT', value: 'ALCSTT'}, {label: 'AVAL', value: 'AVAL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'nicstt_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'nicstt_cat', value: 'nicstt_cat'}, {label: 'alcstt_cat', value: 'alcstt_cat'}] },
    ],
  },
  {
    id: 'alcohol',
    name: 'Alcohol use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
      { id: 'variable', label: 'Variable', value: 'ALCSTT', type: 'tag' as const, required: true, inputType: 'multiselect' as const, options: [{label: 'NICSTT', value: 'NICSTT'}, {label: 'ALCSTT', value: 'ALCSTT'}, {label: 'AVAL', value: 'AVAL'}] },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true, inputType: 'dropdown' as const, options: [{label: 'BLK_CUM', value: 'BLK_CUM'}, {label: 'BLK_FREQ', value: 'BLK_FREQ'}] },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'm_t_dm', value: 'm_t_dm'}, {label: 'm_t_ae', value: 'm_t_ae'}] },
      { id: 'formatName', label: 'Format Name', value: 'alcstt_cat', type: 'text' as const, hasLink: true, inputType: 'dropdown' as const, options: [{label: 'nicstt_cat', value: 'nicstt_cat'}, {label: 'alcstt_cat', value: 'alcstt_cat'}] },
    ],
  },
  {
    id: 'nicotine_current',
    name: 'Any current use of nicotine products',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'NICSYN', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'ny_cat', type: 'text' as const, hasLink: true },
    ],
  },
  {
    id: 'cigarette_pack',
    name: 'Number of cigarette pack years',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'CIGPKYR', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'cigpkyr_cat', type: 'text' as const, hasLink: true },
    ],
  },
  {
    id: 'nicotine_pack',
    name: 'Number of nicotine pack years',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'NICPKYR', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'nicpkyr_cat', type: 'text' as const, hasLink: true },
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
  confirmedBlocks,
  onToggleBlockConfirm,
  isLocked,
  onGenerateComponent,
  onDeprecateComponent,
  onDeleteComponent,
  onFieldEdit,
  getEffectiveStatus,
  getFieldStyles,
  fieldRefs
}: {
  blocks: any;
  confirmedBlocks: Record<string, boolean>;
  onToggleBlockConfirm: (blockId: string) => void;
  isLocked?: boolean;
  onGenerateComponent?: (name: string, type: string, instructions: string) => void;
  onDeprecateComponent?: (id: string) => void;
  onDeleteComponent?: (id: string) => void;
  onFieldEdit?: (blockId: string, fieldId: string, value: string) => void;
  getEffectiveStatus?: (fieldId: string | null, status: FieldStatus, currentValue: string | null) => FieldStatus;
  getFieldStyles?: (status: FieldStatus, isReadOnlyField?: boolean) => { containerBg: string; containerBorder: string; inputBorder: string };
  fieldRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  const FieldCheckboxIcon = (confirmed: boolean) => {
    if (!confirmed) return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 20 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
    return <><rect width="20" height="20" rx="1" fill="var(--color-brand-1)" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
  };
  const [selectedBlockId, setSelectedBlockId] = useState('all');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [addMenuAnchor, setAddMenuAnchor] = useState<DOMRect | null>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<{ rect: DOMRect; blockId: string; isDeprecated: boolean } | null>(null);

  // Fallback to 'all' if the currently selected block is deleted
  useEffect(() => {
    if (selectedBlockId !== 'all' && !blocks.find((b: any) => b.id === selectedBlockId)) {
      setSelectedBlockId('all');
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [blocks, selectedBlockId]);

  const handleSidebarClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const LinkIcon = () => (
    <SvgIcon className="h-[12px] w-[12px] inline-block ml-[4px]" viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="var(--color-brand-1)" />
    </SvgIcon>
  );

  const [lastFormSubmission, setLastFormSubmission] = useState<{ name: string; type: string; instructions: string } | null>(null);
  const isGenerating = blocks.some((b: any) => b.state === 'loading');
  const prevLoadingIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadingBlock = blocks.find((b: any) => b.state === 'loading');
    if (loadingBlock && loadingBlock.id !== prevLoadingIdRef.current) {
      prevLoadingIdRef.current = loadingBlock.id;
      setSelectedBlockId(loadingBlock.id);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [blocks]);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {addMenuAnchor && onGenerateComponent && (
        <AddComponentMenu
          anchorRect={addMenuAnchor}
          onClose={() => setAddMenuAnchor(null)}
          onGenerate={(n, t, i) => {
            setLastFormSubmission({ name: n, type: t, instructions: i });
            onGenerateComponent(n, t, i);
          }}
          lastSubmission={lastFormSubmission}
          isGenerating={isGenerating}
        />
      )}
      {moreMenuAnchor && onDeprecateComponent && onDeleteComponent && (
        <MoreOptionsMenu
          anchorRect={moreMenuAnchor.rect}
          isDeprecated={moreMenuAnchor.isDeprecated}
          onClose={() => setMoreMenuAnchor(null)}
          onDeprecate={() => onDeprecateComponent(moreMenuAnchor.blockId)}
          onDelete={() => onDeleteComponent(moreMenuAnchor.blockId)}
        />
      )}
      {/* Left sidebar — block navigation */}
      <div className="w-[176px] shrink min-w-[90px] border-r border-[#E5E8E8] overflow-y-auto bg-white flex flex-col gap-[2px] pt-[4px] pl-[4px] pb-[8px] pr-[4px]">
        <div className="relative group" data-menu-open={!!addMenuAnchor}>
          <button
            onClick={() => handleSidebarClick('all')}
            className={`group flex items-center w-full h-[32px] pl-[8px] pr-[4px] py-[6px] rounded-[4px] transition-colors text-left shrink-0 gap-[4px] ${
              selectedBlockId === 'all'
                ? 'bg-az-secondary'
                : 'bg-transparent hover:bg-bg-panel'
            }`}
            title="All"
          >
            <p className={`flex-1 min-w-0 truncate text-[12px] font-medium leading-[18px] ${
              selectedBlockId === 'all' ? 'text-brand-1' : 'text-text-primary'
            }`}>
              All
            </p>
            {onGenerateComponent && (
              <div className="hidden group-hover:flex group-data-[menu-open=true]:flex items-center shrink-0">
                <TooltipText label="Add Component" align="center" disabled={!!addMenuAnchor}>
                  <div
                    role="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setAddMenuAnchor(prev => prev ? null : rect);
                    }}
                    className={`flex items-center justify-center shrink-0 w-[24px] h-[24px] rounded-[4px] ${
                      !!addMenuAnchor
                        ? 'bg-black/5'
                        : 'bg-transparent hover:bg-black/5'
                    }`}
                  >
                     <img src={addLineIconUrl} className="w-[16px] h-[16px]" style={{ filter: 'invert(58%) sepia(10%) saturate(145%) hue-rotate(139deg) brightness(92%) contrast(90%)' }} alt="add" />
                  </div>
                </TooltipText>
              </div>
            )}
          </button>
        </div>
        {blocks.map((block: any) => {
          const isSelected = selectedBlockId === block.id;
          const blockName = block.name || block.fields?.find((f: any) => f.id.includes('Label') || f.id.includes('Title') || f.label === 'Component Label' || f.label === 'Block Title')?.value || block.id;
          return (
            <div key={block.id} className="relative group" data-menu-open={moreMenuAnchor?.blockId === block.id}>
              <button
                onClick={() => handleSidebarClick(block.id)}
                className={`group flex items-center w-full h-[32px] pl-[8px] pr-[4px] py-[6px] rounded-[4px] transition-colors text-left shrink-0 gap-[4px] ${
                  isSelected
                    ? 'bg-az-secondary'
                    : 'bg-transparent hover:bg-bg-panel'
                }`}
                title={blockName}
              >
                <p className={`flex-1 min-w-0 truncate text-[12px] font-medium leading-[18px] ${
                  block.deprecated ? 'line-through text-[#888e8e]' : isSelected ? 'text-brand-1' : 'text-text-primary'
                }`}>
                  {blockName}
                </p>
                {block.state === 'loading' ? (
                  <div className="flex items-center shrink-0">
                    <img src={aiProcessingIconUrl} className="size-[16px]" alt="loading" />
                  </div>
                ) : onDeprecateComponent && onDeleteComponent ? (
                  <div className="hidden group-hover:flex group-data-[menu-open=true]:flex items-center shrink-0">
                    <TooltipText label="More" align="center" disabled={moreMenuAnchor?.blockId === block.id}>
                      <div
                        role="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMoreMenuAnchor(prev => (prev?.blockId === block.id ? null : { rect, blockId: block.id, isDeprecated: !!block.deprecated }));
                        }}
                        className={`flex items-center justify-center shrink-0 w-[24px] h-[24px] rounded-[4px] ${
                          moreMenuAnchor?.blockId === block.id
                            ? 'bg-black/5'
                            : 'bg-transparent hover:bg-black/5'
                        }`}
                      >
                         <img src={moreIconUrl} className="w-[16px] h-[16px]" style={{ filter: 'invert(58%) sepia(10%) saturate(145%) hue-rotate(139deg) brightness(92%) contrast(90%)' }} alt="more" />
                      </div>
                    </TooltipText>
                  </div>
                ) : null}
              </button>
            </div>
          );
        })}
        {blocks.length === 0 && (
          <div className="px-[8px] py-[6px]">
            <p className="t-small text-text-secondary">No Components Yet</p>
          </div>
        )}
      </div>

      {/* Right content — scrollable block sections */}
      <div ref={scrollContainerRef} className="flex-1 min-w-[180px] overflow-y-scroll overflow-x-hidden">
        {blocks.length === 0 ? (
          <div className="flex w-full h-full items-center justify-center">
            <p className="t-small text-text-secondary">No Components</p>
          </div>
        ) : (selectedBlockId === 'all' ? blocks : blocks.filter((b: any) => b.id === selectedBlockId)).map((block: any, blockIndex: number, arr: any[]) => {
          const fieldIsDisabled = isLocked || block.deprecated;
          const blockName = block.name || block.fields?.find((f: any) => f.id.includes('Label') || f.id.includes('Title') || f.label === 'Component Label' || f.label === 'Block Title')?.value || block.id;
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
                  <div className="flex items-center justify-between mb-[12px]">
                    <p className="text-[14px] font-bold text-text-primary break-words m-0">{blockName}</p>
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
                  {block.deprecated && (
                    <div className="mb-[12px] bg-bg-panel border border-border-default rounded-[4px] p-[8px] flex items-center gap-[8px]">
                      <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] bg-black/5 flex items-center justify-center">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 13.333 13.333">
                          <path d="M6.66699 0C10.3487 0.000175812 13.333 2.9852 13.333 6.66699C13.3328 10.3486 10.3486 13.3328 6.66699 13.333C2.9852 13.333 0.000175816 10.3487 0 6.66699C0 2.98509 2.98509 0 6.66699 0ZM6.66699 1.33301C3.72147 1.33301 1.33301 3.72147 1.33301 6.66699C1.33318 9.61238 3.72158 12 6.66699 12C9.61227 11.9998 11.9998 9.61227 12 6.66699C12 3.72158 9.61238 1.33318 6.66699 1.33301ZM9.92773 8.98438C9.80013 9.16338 9.65578 9.33452 9.49512 9.49512C9.33452 9.65578 9.16338 9.80013 8.98438 9.92773L3.40625 4.34863C3.5338 4.16969 3.67735 3.99844 3.83789 3.83789C3.99844 3.67735 4.16969 3.5338 4.34863 3.40625L9.92773 8.98438Z" fill="#888E8E" />
                        </svg>
                      </div>
                      <p className="t-small text-text-secondary">
                        AI will skip deprecated components in code updates.
                      </p>
                    </div>
                  )}
                  <div className={`flex flex-col gap-[12px] ${block.deprecated ? 'opacity-40 pointer-events-none' : ''}`}>
                    {block.fields.map((field: any) => {
                      const badgeNode = field.badge ? <MetadataBadge type={field.badge} tooltip={field.badgeTooltip} /> : undefined;
                      
                      const labelWithLink = field.hasLink ? (
                        <div className="flex items-center gap-[2px]">
                          {field.label}
                          <LinkIcon />
                        </div>
                      ) : field.label;

                      const effectiveInputType = field.inputType || (field.type === 'tag' ? 'multiselect' : 'input');

                      return (
                        <div key={field.id} ref={el => { if (el && fieldRefs) fieldRefs.current[field.id] = el; }} className="bg-white rounded-[4px] border border-transparent p-[4px]">
                          {effectiveInputType === 'multiselect' ? (
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
                          ) : effectiveInputType === 'dropdown' ? (
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
                          ) : (
                            <Input
                              label={labelWithLink as any}
                              required={field.required}
                              disabled={fieldIsDisabled}
                              badge={badgeNode}
                              placeholder={field.required ? "Required" : "Optional"}
                              value={field.value}
                              onChange={(e) => onFieldEdit?.(block.id, field.id, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
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
  baselineAdvanceTrigger?: number;
  metaUpdateActive?: boolean;
  metaUpdateProcessing?: boolean;
  submittedDiffItems?: MetaDiffItem[];
  targetFieldId?: string;
  onReviewItemsChange?: (items: ReviewItem[]) => void;
  associatedTLStatus?: string;
  onJumpToTL?: (name: string) => void;
}

function MetadataPanel({
  onClose, docType = 'table', isLocked, frozenUntilIndex, pageSepActive, pageColumnCounts = {},
  pageBreakColumns = [], columnCount = 11,
  repeatColumnBaseline = null, onRepeatColumnBaselineChange,
  pageBreakColumnBaseline = null, onPageBreakColumnBaselineChange,
  idpageBaseline = null, idlistBaseline = null, onIdpageBaselineChange, onIdlistBaselineChange,
  onAddChangesToChat, onMetaDiffChange, onRequestUpdateCode, baselineAdvanceTrigger, metaUpdateActive, metaUpdateProcessing, submittedDiffItems = [], targetFieldId, onReviewItemsChange, associatedTLStatus = 'pending', onJumpToTL,
}: MetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "blocks">("basic");
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
        { id: 'associatedTL', label: 'Associated Table/Listing', value: 'Table 14.1.4', status: 'default' as FieldStatus, confirmed: false, dependencyState: 'S1' },
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
  useEffect(() => { sessionStorage.removeItem('metadataBlocks_figure'); }, []);

  const INITIAL_FIGURE_COMPONENTS: MetadataBlock[] = [
    {
      id: 'kmCurve',
      name: 'KM Plot Chart',
      state: 'ready' as const,
      deprecated: false,
      fields: [
        { id: 'compLabel1', label: 'Component Label', value: 'KM Plot Chart', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'input' as const },
        { id: 'compType1', label: 'Component Type', value: 'Chart', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, inputType: 'dropdown' as const, options: [{label: 'Chart', value: 'Chart'}, {label: 'Table', value: 'Table'}] },
        { id: 'sourceDataset1', label: 'Source Dataset(s)', value: 'ADTTTE', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE dataset naming convention.', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
        { id: 'sourceVariable1', label: 'Source Variable(s)', value: 'AVAL, CNSR, PARAMCD', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred based on typical KM Plot requirements.', inputType: 'multiselect' as const, options: [{label: 'AVAL', value: 'AVAL'}, {label: 'CNSR', value: 'CNSR'}, {label: 'PARAMCD', value: 'PARAMCD'}, {label: 'TRTA', value: 'TRTA'}, {label: 'TRT01P', value: 'TRT01P'}] },
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
        { id: 'sourceDataset2', label: 'Source Dataset(s)', value: 'ADTTTE', type: 'text', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'ai-infer' as const, badgeTooltip: 'Inferred from standard TTE dataset naming convention.', inputType: 'multiselect' as const, options: [{label: 'ADSL', value: 'ADSL'}, {label: 'ADAE', value: 'ADAE'}, {label: 'ADTTTE', value: 'ADTTTE'}] },
        { id: 'sourceVariable2', label: 'Source Variable(s)', value: 'AVAL, TRTA', type: 'tag', required: true, status: 'default' as FieldStatus, confirmed: false, badge: 'conflict' as const, badgeTooltip: 'Conflicting variable: TRTA used instead of TRT01P.', inputType: 'multiselect' as const, options: [{label: 'AVAL', value: 'AVAL'}, {label: 'CNSR', value: 'CNSR'}, {label: 'PARAMCD', value: 'PARAMCD'}, {label: 'TRTA', value: 'TRTA'}, {label: 'TRT01P', value: 'TRT01P'}] },
      ]
    }
  ];

  const [figureComponents, setFigureComponents] = useState<MetadataBlock[]>(INITIAL_FIGURE_COMPONENTS);
  useEffect(() => { sessionStorage.removeItem('metadataComponents_figure'); }, []);

  const [hasMetadataComponentEdits, setHasMetadataComponentEdits] = useState(false);

  const [figureFieldBaseline, setFigureFieldBaseline] = useState<Record<string, string>>(() => {
    const baseline: Record<string, string> = {};
    figureBlocks.forEach(b => b.fields.forEach(f => { baseline[f.id] = f.value; }));
    figureComponents.forEach(b => b.fields.forEach(f => { baseline[f.id] = f.value; }));
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

  const metaDiffItems = useMemo<MetaDiffItem[]>(() => {
    const items: MetaDiffItem[] = [];

    // 1. Basic Block Field Edits (skip tag fields)
    figureBlocks.forEach(b => b.fields.forEach(f => {
      if (f.type === 'tag') return;
      const baseVal = figureFieldBaseline[f.id];
      if (baseVal !== undefined && baseVal !== f.value) {
        items.push({ fieldId: f.id, label: f.label, oldValue: baseVal, newValue: f.value });
      }
    }));

    // 2. Component Field Edits (skip tag fields)
    figureComponents.forEach(b => {
      const isNewComp = !figureComponentListBaseline.some(cb => cb.id === b.id);
      if (isNewComp) return;

      b.fields.forEach(f => {
        if (f.type === 'tag') return;
        const baseVal = figureFieldBaseline[f.id];
        if (baseVal !== undefined && baseVal !== f.value) {
          const blockName = b.name || 'Component';
          items.push({ fieldId: f.id, label: `${blockName} > ${f.label}`, oldValue: baseVal, newValue: f.value });
        }
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
          label: `${blockName} Status`,
          oldValue: baseDep ? 'Deprecated' : 'Active',
          newValue: c.deprecated ? 'Deprecated' : 'Active'
        });
      }
    });

    // 4. Component Deletion
    figureComponentListBaseline.forEach(baseComp => {
      const exists = figureComponents.some(c => c.id === baseComp.id);
      if (!exists) {
        items.push({
          fieldId: `delete_${baseComp.id}`,
          label: `Component: ${baseComp.name}`,
          oldValue: 'Existing Component',
          newValue: 'Deleted'
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
            label: 'Add Component',
            oldValue: '(None)',
            newValue: blockName
          });
        }
      }
    });

    return items;
  }, [figureBlocks, figureComponents, figureFieldBaseline, figureComponentDeprecatedBaseline, figureComponentListBaseline]);

  const newDiffItems = useMemo<MetaDiffItem[]>(() => {
    if (!metaUpdateProcessing) return metaDiffItems;
    return metaDiffItems.filter(diff => 
      !submittedDiffItems.some(sub => sub.fieldId === diff.fieldId && sub.newValue === diff.newValue)
    );
  }, [metaDiffItems, metaUpdateProcessing, submittedDiffItems]);

  const [lastBaselineTrigger, setLastBaselineTrigger] = useState(0);
  useEffect(() => {
    if (baselineAdvanceTrigger && baselineAdvanceTrigger > lastBaselineTrigger) {
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

      setLastBaselineTrigger(baselineAdvanceTrigger);
    }
  }, [baselineAdvanceTrigger, submittedDiffItems, figureComponents, lastBaselineTrigger]);

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
    if (docType === 'figure') {
      onMetaDiffChange?.(metaDiffItems);
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

  // Helper functions for configuration changes
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
        }
      }, 200);
    }
  }, [targetFieldId, figureComponents]);

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-graphite-10 bg-white">
        <div className="flex h-full items-center">
          {(["basic", "blocks"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative flex h-full items-center justify-center border-b-2 px-[16px] active:scale-[0.96] ${activeTab === tab ? "border-brand-1" : "border-transparent"}`}>
              <p className={`t-small font-medium ${activeTab === tab ? "text-brand-1" : "text-text-primary"}`}>
                {tab === "basic" ? (docType === 'listing' ? "Basic info" : docType === 'figure' ? "Basic" : "Basic Information") : (docType === 'listing' ? "Column" : docType === 'figure' ? "Components" : "Blocks")}
              </p>
              {/* Red dot on the upper right corner of the tab text */}
              {docType === 'listing' && (
                tab === 'basic' ? (
                  hasListingBasicEdits && <span className="absolute right-[6px] top-[8px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />
                ) : (
                  hasListingColumnEdits && <span className="absolute right-[6px] top-[8px] w-[4px] h-[4px] rounded-full bg-[#D0006F] z-10" />
                )
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center pr-[12px] gap-[4px]">
          <TooltipText label="Batch Edit Macro">
            <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label="Batch edit">
              <LocalIcon src={batchMicroIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
            </button>
          </TooltipText>
        </div>
      </div>

      {/* Status Bar */}
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

      {/* Content */}
      <div className={`min-h-0 flex-1 ${activeTab === "blocks" && docType !== 'listing' ? 'flex flex-col' : 'overflow-auto p-[4px]'}`}>
        {activeTab === "basic" && (
          <div className="flex flex-col gap-[4px]">
            {docType === 'listing' ? (
              // Listing Basic Tab
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
            ) : docType === 'figure' ? (
              // Figure Basic Tab
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
                            >
                            
                            <div className="relative w-full flex items-center gap-[16px]">
                              <div className="flex-1 min-w-0">
                                <Dropdown
                                  value={isS0 ? null : field.value}
                                  options={[
                                    { label: 'Table 14.1.1', value: 'Table 14.1.1' },
                                    { label: 'Table 14.1.4', value: 'Table 14.1.4' },
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
                      </div>
                      );
                    }

                    return (
                      <div key={field.id}
                        className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}
                      >
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
            ) : (
              // Table Basic Tab (Original)
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
            )}
          </div>
        )}
        {activeTab === "blocks" && (
          docType === 'listing' ? (
            // Listing Column Tab
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
          ) : docType === 'figure' ? (
            <BlocksTabContent
              // @ts-ignore
              blocks={figureComponents}
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
              isLocked={isLocked}
              onGenerateComponent={handleGenerateComponent}
              onDeprecateComponent={handleDeprecateComponent}
              onDeleteComponent={(id) => setDeleteConfirmBlockId(id)}
              onFieldEdit={handleFieldEditComponent}
              fieldRefs={fieldRefs}
            />
          ) : (
            <BlocksTabContent
              blocks={METADATA_BLOCK_ITEMS_DATA}
              confirmedBlocks={blockItemConfirmed}
              onToggleBlockConfirm={(blockId) => {
                const block = METADATA_BLOCK_ITEMS_DATA.find(b => b.id === blockId);
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
              isLocked={isLocked}
            />
          )
        )}
      </div>

      {/* Add Changes to Chat Button */}
      {docType === 'figure' ? (
        ((metaUpdateProcessing && newDiffItems.length > 0) || (!metaUpdateProcessing && metaDiffItems.length > 0 && !metaUpdateActive)) && (
          <div className="border-t border-border-default p-[12px] flex justify-start">
            <button
              onClick={isLocked || metaUpdateProcessing ? undefined : () => {
                onRequestUpdateCode?.();
              }}
              disabled={isLocked || metaUpdateProcessing}
              className={`flex h-[32px] w-auto items-center justify-center gap-[6px] rounded-[4px] px-[12px] t-small font-medium ${(isLocked || metaUpdateProcessing) ? 'bg-border-default text-text-secondary cursor-not-allowed' : 'bg-brand-1 text-white hover:bg-[#6D0043] active:scale-[0.98]'}`}
            >
              <LocalIcon src={addMetadiffIconUrl} className="h-[16px] w-[16px]" color={(isLocked || metaUpdateProcessing) ? '#888E8E' : 'white'} />
              Update Code
              {!metaUpdateProcessing && (
                <div className="flex items-center justify-center h-[16px] min-w-[16px] px-[4px] py-px rounded-[16px] bg-white/20 shrink-0">
                  <span className="text-[10px] leading-[14px] font-medium text-white">{metaDiffItems.length}</span>
                </div>
              )}
            </button>
          </div>
        )
      ) : (
        hasAnyEdits && (
          <div className="border-t border-border-default p-[12px] flex justify-start">
            <button
              onClick={isLocked ? undefined : () => {
                if (docType === 'listing') {
                  const changes: string[] = [];
                  listingBlocks.forEach(b => {
                    b.fields.forEach(f => {
                      if (f.id === 'idlist' && isRepeatColumnEdited) {
                        const displayValue = Array.from({ length: columnCount }, (_, i) => frozenUntilIndex !== null && i <= frozenUntilIndex ? 'Y' : 'N').join('#');
                        changes.push(`- ${f.label}: ${displayValue}`);
                      } else if (f.id === 'idpage' && isPageBreakColumnEdited) {
                        const displayValue = Array.from({ length: columnCount }, (_, i) => pageBreakColumns.includes(i - 1) ? 'Y' : 'N').join('#');
                        changes.push(`- ${f.label}: ${displayValue}`);
                      } else if (f.status === 'edited' && f.id !== 'idlist' && f.id !== 'idpage') {
                        changes.push(`- ${f.label}: ${f.value}`);
                      }
                    });
                  });
                  const columnChanges: string[] = [];
                  listingColumnFields.forEach(f => {
                    if (f.status === 'edited') {
                      columnChanges.push(`- ${f.label}: ${f.value}`);
                    }
                  });

                  let text = `You are given metadata changes for this listing. Apply these changes to update the code accordingly.`;
                  if (changes.length > 0) {
                    text += `\n\n====================\nLISTING LEVEL CHANGES\n` + changes.join('\n');
                  }
                  if (columnChanges.length > 0) {
                    text += `\n\n====================\nCOLUMN LEVEL CHANGES\n` + columnChanges.join('\n');
                  }
                  onAddChangesToChat?.(text);
                }
                handleUpdateCode();
              }}
              disabled={isLocked}
              className={`flex h-[32px] w-auto items-center justify-center gap-[6px] rounded-[4px] px-[12px] t-small font-medium ${isLocked ? 'bg-border-default text-text-secondary cursor-not-allowed' : 'bg-brand-1 text-white hover:bg-[#6D0043] active:scale-[0.98]'}`}
            >
              <LocalIcon src={addMetadiffIconUrl} className="h-[16px] w-[16px]" color={isLocked ? '#888E8E' : 'white'} />
              Add Changes to Chat
            </button>
          </div>
        )
      )}

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

  const programCodeContent = `/* Setup figure options */
options nodate nonumber orientation=landscape;
title1 "Figure 15.1.1";
title2 "Kaplan-Meier Plot of Time to Dermatologic Event (ITT Population)";

/* Prepare data for Kaplan-Meier analysis */
data km_prep;
    set adam.adtte;
    where paramcd = "TTDE" and saffl = "Y";
run;

/* Compute survival statistics and generate at-risk numbers */
proc lifetest data=km_prep method=km plots=survival(atrisk);
    time aval * cnsr(1);
    strata trtan;
    ods output ProductLimitEstimates=km_est;
run;

/* ODS Graphics settings for premium rendering */
ods graphics on / width=640px height=480px imagename="km_plot";
ods rtf file="figure_15_1_1.rtf" style=HTMLBlue;

/* Render the Kaplan-Meier Plot using standard template */
proc sgrender data=km_est template=Kaplan_Meier_Plot;
    dynamic title="Kaplan-Meier Plot of Time to Dermatologic Event"
            show_ci=${showCI ? "Y" : "N"}
            show_censor=${showCensorMarks ? "Y" : "N"}
            show_median=${showMedianLines ? "Y" : "N"}
            show_risk=${showRiskTable ? "Y" : "N"};
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

  const [logExpanded, setLogExpanded] = useState(true);
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
  const isCodeUnsaved = userCode !== savedCode;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedCode(userCode);
      setIsSaving(false);
    }, 500);
  };

  const toolbarButtons = (
    <>
      <Button 
        variant="secondary" 
        size="sm" 
        disabled={!isCodeUnsaved || isSaving} 
        onClick={handleSave}
        className="w-[74px]"
      >
        <div className="flex items-center gap-[4px] justify-center w-full">
          {isSaving ? (
            <div className="w-[14px] h-[14px] rounded-full border-[2px] border-transparent border-t-[#B2B4B4] border-l-[#B2B4B4] animate-spin" />
          ) : (
            <LocalIcon src={saveIconUrl} className="w-[14px] h-[14px]" color={!isCodeUnsaved ? "#B2B4B4" : "#830051"} />
          )}
          <span>{isSaving ? "Saving" : isCodeUnsaved ? "Save" : "Saved"}</span>
        </div>
      </Button>
      <TooltipText label={isLocked ? "Unlock Table Code" : "Lock Table Code"}>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onToggleLock}
          className="w-[102px]"
        >
          <div className="flex items-center gap-[4px] justify-center w-full">
            <LocalIcon src={isLocked ? lockIconUrl : unlockIconUrl} className="w-[14px] h-[14px]" color="white" />
            <span>{isLocked ? "Unlock Code" : "Lock Code"}</span>
          </div>
        </Button>
      </TooltipText>
      {[
        { label: "Copy Code", icon: copyIconUrl },
        { label: "Version History", icon: historyIconUrl },
      ].map(({ label, icon }) => (
        <TooltipText key={label} label={label}>
          <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label={label}>
            <LocalIcon src={icon} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
          </button>
        </TooltipText>
      ))}
    </>
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
        title={
          <LocalIcon src={codeSlashIconUrl} className="w-[16px] h-[16px]" color="#888E8E" />
        }
        actions={toolbarButtons}
      />
      <div className="min-h-0 flex-1 overflow-auto bg-white code-panel-scroll-container scrollbar-code">
        {docType === 'figure' ? (
          <div className="flex flex-1 min-w-max font-mono text-[13px] leading-[20px]">
            <div className="select-none bg-white py-[16px] text-right text-[#999999] shrink-0 w-[54px] sticky left-0 z-10">
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
                    className="h-[20px] flex items-center justify-end pl-[8px] pr-[4px] gap-[4px] cursor-pointer select-none"
                  >
                    <span className={`text-[12px] font-mono text-right w-[24px] ${isFocused ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                      {lineNum}
                    </span>
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                      {isHovered && foldable ? (
                        <SvgIcon className="h-[10px] w-[10px] text-text-secondary" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                      className={`h-[20px] px-[16px] whitespace-pre font-mono text-[13px] leading-[20px] cursor-pointer ${
                        isSelected ? 'bg-[#FBF4F7]' : ''
                      }`}
                    >
                      <code>{highlightSAS(line || ' ')}</code>
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
                        className={`h-[20px] px-[16px] whitespace-pre ${
                          isSelected ? 'bg-[#FBF4F7]' : ''
                        }`}
                      >
                        <code>{highlightSAS(line || ' ')}</code>
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
                  className="absolute inset-0 w-full h-full pt-[16px] pb-[16px] px-[16px] font-mono text-[13px] leading-[20px] text-transparent bg-transparent outline-none resize-none border-none caret-text-primary whitespace-pre overflow-hidden"
                  style={{ caretColor: 'var(--color-text-primary)' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-w-max min-h-full font-mono text-[13px] leading-[20px]">
            <div className="select-none bg-white py-[16px] text-right text-[#999999] shrink-0 w-[54px] sticky left-0 z-10">
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
                    className="h-[20px] flex items-center justify-end pl-[8px] pr-[4px] gap-[4px] cursor-pointer select-none"
                  >
                    <span className={`text-[12px] font-mono text-right w-[24px] ${isFocused ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                      {lineNum}
                    </span>
                    <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                      {isHovered && foldable ? (
                        <SvgIcon className="h-[10px] w-[10px] text-text-secondary" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    className={`h-[20px] px-[16px] whitespace-pre font-mono text-[13px] leading-[20px] cursor-pointer ${
                      isSelected ? 'bg-[#FBF4F7]' : ''
                    }`}
                  >
                    <code>{highlightSAS(line || ' ')}</code>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function FloatingAICopilotButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group absolute bottom-[24px] right-[24px] z-50 flex h-[40px] items-center justify-center overflow-hidden rounded-full bg-brand-1 shadow-[0px_2px_3px_rgba(0,0,0,0.05),0px_4px_8px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-[0.96] disabled:pointer-events-none disabled:bg-border-default"
      style={{
        width: isHovered ? 86 : 40,
        paddingLeft: isHovered ? 12 : 0,
        paddingRight: isHovered ? 12 : 0,
        gap: isHovered ? 8 : 0,
      }}
      aria-label="Open AI Copilot"
    >
      <AtlasLogoIcon className="h-[16px] w-[16px] shrink-0" color="white" />
      <span
        className="overflow-hidden whitespace-nowrap text-[14px] font-normal leading-[20px] transition-all duration-200"
        style={{
          color: "#FFFFFF",
          maxWidth: isHovered ? 100 : 0,
          opacity: isHovered ? 1 : 0,
        }}
      >
        Ask AI
      </span>
    </button>
  );
}

function WorkspaceContent({
  onNavigateHome,
  treeListOpen,
  setTreeListOpen,
  treeListWidth,
  setTreeListWidth,
}: {
  onNavigateHome: () => void;
  treeListOpen: boolean;
  setTreeListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeListWidth: number;
  setTreeListWidth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [metaDiffItems, setMetaDiffItems] = useState<MetaDiffItem[]>([]);
  const [metaUpdateActive, setMetaUpdateActive] = useState(false);
  const [metaUpdateProcessing, setMetaUpdateProcessing] = useState(false);
  const [submittedDiffItems, setSubmittedDiffItems] = useState<MetaDiffItem[]>([]);
  const [baselineAdvanceTrigger, setBaselineAdvanceTrigger] = useState(0);
  const [targetMetadataFieldId, setTargetMetadataFieldId] = useState<string | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(DEFAULT_FIGURE_REVIEW_ITEMS);
  const [programs, setPrograms] = useState<ProgramItem[]>([
    {
      id: 'p1',
      name: 'Section A',
      status: 'pending',
      isExpanded: true,
      tables: [
        { id: 't1', name: 'Table 14.1.4', status: 'pending' },
        { id: 't2', name: 'Table 14.1.3', status: 'analyzing' },
        { id: 't3', name: 'Table 14.1.2', status: 'modified', pendingChanges: 3 },
        { id: 't4', name: 'Table 14.1.1', status: 'error', errorMessage: 'Failed to parse table structure' },
        { id: 'l1', name: 'Listing 16.2.1', status: 'pending', docType: 'listing' },
        { id: 'l2', name: 'Listing 16.2.2', status: 'pending', docType: 'listing' },
        { id: 'l3', name: 'Listing 16.2.3', status: 'pending', docType: 'listing' },
        { id: 'f1', name: 'Figure 15.1.1', status: 'pending', docType: 'figure' },
      ],
    },

  ]);
  const [selectedId, setSelectedId] = useState<string | null>('t1');
  const [currentEvent] = useState('CSR Interim Analysis');
  const [modalState, setModalState] = useState<{
    type: 'locked-by-parent' | null;
    programName?: string;
  }>({ type: null });
  const [panelView, setPanelView] = useState<PanelView>('both');
  const shellPreviewOpen = panelView !== 'code';
  const codeOpen = panelView !== 'shell';
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [rtfOpen, setRtfOpen] = useState(true);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [shellPreviewWidth, setShellPreviewWidth] = useState(560);
  const [metadataWidth, setMetadataWidth] = useState(440);
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
  const [activeView, setActiveView] = useState<ActiveView>('table');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('g1');
  const groupItems = [
    { id: 'g1', name: 'Treatment Group' },
    { id: 'g2', name: 'Population Set' },
    { id: 'g3', name: 'Analysis Visit' },
    { id: 'g4', name: 'Baseline Category' },
    { id: 'g5', name: 'Subgroup Analysis' },
  ];
  const [frozenUntilIndex, setFrozenUntilIndex] = useState<number | null>(null);
  const [pageSepActive, setPageSepActive] = useState(false);
  const [pageColumnCounts, setPageColumnCounts] = useState<Record<string, number>>({});
  const [idpageBaseline, setIdpageBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(null);
  const [idlistBaseline, setIdlistBaseline] = useState<{ frozenUntilIndex: number | null; pageSepActive: boolean; pageColumnCounts: Record<string, number> } | null>(null);
  const [aiInputValue, setAiInputValue] = useState("");
  const [aiInputFocusTrigger, setAiInputFocusTrigger] = useState(0);

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

  // Total width of the workspace content area + TreeList
  const totalWidth = contentAreaWidth + (treeListOpen ? (treeListWidth + 1) : 0);
  const flexPanelMin = codeOpen ? constraints.code.min : constraints.shellPreview.min;
  const otherPanelsMin = (shellPreviewOpen && codeOpen) ? constraints.shellPreview.min : 0;
  const currentDividers = (treeListOpen ? 1 : 0) + tableDividerCount * DIVIDER_W;

  // Shell can grow until Code (flex-1) hits its minimum, with TreeList compressed and collapsed if needed
  const dynamicShellMax = totalWidth > 0
    ? Math.max(constraints.shellPreview.min,
        totalWidth
        - (codeOpen ? constraints.code.min : 0)
        - (aiCopilotOpen ? aiCopilotWidth : 0)
        - currentDividers)
    : constraints.shellPreview.max;

  // AI can grow until the flex-1 panel and any other fixed panels hit their minimums, with TreeList compressed and collapsed if needed
  const dynamicAiMax = totalWidth > 0
    ? Math.max(constraints.aiCopilot.min, totalWidth - flexPanelMin - otherPanelsMin - currentDividers)
    : constraints.aiCopilot.max;

  // Total minimum width for horizontal scroll fallback
  const tableTotalMinWidth =
    (shellPreviewOpen ? constraints.shellPreview.min : 0) +
    (codeOpen ? constraints.code.min : 0) +
    (aiCopilotOpen ? constraints.aiCopilot.min : 0) +
    tableDividerCount * DIVIDER_W;

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

  useEffect(() => {
    if (docType === 'figure') {
      setRtfOpen(false);
      setPanelView('both');
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

  // Set default panel layout based on doc type (listing/figure = vertical, table = horizontal)
  // Only applies if user hasn't explicitly overridden the layout preference
  useEffect(() => {
    if (!isLayoutUserOverridden) {
      setPanelLayout(docType === 'table' ? 'horizontal' : 'vertical');
    }
    if (docType === 'listing' || docType === 'figure') {
      setActiveView('table');
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

  const filteredGroups = groupItems.filter((group) =>
    group.name.toLowerCase().includes(treeSearchQuery.toLowerCase())
  );

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
    setAiCopilotOpen(true);
  };

  const handleCloseAICopilot = () => {
    setAiCopilotOpen(false);
  };

  const handlePanelViewChange = (v: PanelView) => {
    setPanelView(v);
  };

  return (
    <div className="flex h-full min-w-0 flex-1 bg-bg-panel">
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
            <div className="flex h-[48px] shrink-0 items-center gap-[8px] px-[10px]">
              <TooltipText label="Back to Home">
                <button
                  onClick={onNavigateHome}
                  className="group flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
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
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Event information"
                >
                  <InfoIcon />
                </button>
              </TooltipText>
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
            <SearchBar
              value={treeSearchQuery}
              onChange={setTreeSearchQuery}
              placeholder="Search..."
              background="dark"
              className="mx-[8px] my-[2px] shrink-0"
            />
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex flex-col gap-[4px] py-[4px] pr-[4px]">
                {activeView === 'group' ? (
                  filteredGroups.map((group) => {
                    const isGroupSelected = selectedGroupId === group.id;
                    return (
                      <div
                        key={group.id}
                        className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors ${
                          isGroupSelected ? 'bg-az-secondary' : 'hover:bg-graphite-10'
                        }`}
                        onClick={() => setSelectedGroupId(group.id)}
                      >
                        <div className="flex h-full items-center pl-[24px] pr-[12px]">
                          <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
                            <FolderIcon color={isGroupSelected ? '#830051' : '#888E8E'} />
                            <p className={`t-small min-w-0 truncate ${isGroupSelected ? 'text-brand-1' : 'text-text-primary'}`}>
                              {group.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  filteredPrograms.map((program) => (
                    <TreeItem
                      key={program.id}
                      program={program}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                      onToggleLock={handleToggleLock}
                      onToggleExpand={handleToggleExpand}
                      onShowLockedModal={(programName) => setModalState({ type: 'locked-by-parent', programName })}
                    />
                  ))
                )}
              </div>
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

        <div className={`flex min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-graphite-10 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] my-[4px] mr-[4px] ${!treeListOpen ? "ml-[4px]" : ""}`}>
          <ViewToggleBar
            treeListOpen={treeListOpen}
            onToggleTreeList={() => setTreeListOpen(true)}
            onNavigateHome={onNavigateHome}
            currentEvent={currentEvent}
            activeView={activeView}
            onActiveViewChange={setActiveView}
            panelView={panelView}
            onPanelViewChange={handlePanelViewChange}
            panelLayout={panelLayout}
            onPanelLayoutChange={handleManualPanelLayoutChange}
            docType={docType}
            rtfOpen={rtfOpen}
            onToggleRtf={() => setRtfOpen(v => !v)}
          />
          <div ref={contentAreaRef} className="relative flex min-h-0 flex-1 overflow-hidden">
            {docType === 'listing' ? (
              // Listing layout with configurable panel direction (vertical = top/bottom, horizontal = left/right)
              <div className="flex min-w-0 flex-1 overflow-hidden">
                {/* Shell + Code area — direction depends on panelLayout */}
                <div className="flex min-w-0 flex-1 overflow-hidden" style={{ flexDirection: panelLayout === 'vertical' ? 'column' : 'row' }}>
                  {panelView !== 'code' && (
                    <div
                      style={panelLayout === 'vertical'
                        ? (panelView === 'shell' ? { height: '100%', minHeight: '240px' } : { height: `${shellHeight}px`, minHeight: '240px' })
                        : (panelView === 'shell' ? { width: '100%', minWidth: '320px' } : { width: `${shellPreviewWidth}px`, minWidth: '320px' })
                      }
                      className={`h-full flex flex-col overflow-hidden flex flex-col ${panelView === 'both' ? 'shrink-0' : ''} ${
                        panelLayout === 'vertical'
                          ? (panelView === 'both' ? 'border-b border-graphite-10' : '')
                          : (panelView === 'both' ? 'border-r border-graphite-10' : '')
                      }`}
                    >
                      <ListingShellPreview
                        selectedItemName={getSelectedItemName()}
                        onBlockClick={() => setMetadataOpen(true)}
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
                        onIdlistBaselineChange={setIdlistBaseline}
                        metadataWidth={metadataWidth}
                        onMetadataResize={(delta) => setMetadataWidth((w) => clamp(w + delta, constraints.metadata.min, metadataMaxWidth))}
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
                    <div className="min-w-0 flex-1 overflow-hidden flex flex-col" style={panelLayout === 'vertical' ? { minHeight: '240px' } : undefined}>
                      <CodePanel
                        selectedItem={getSelectedItemName()}
                        docType="listing"
                        isLocked={selectedTableLocked}
                        onToggleLock={handleCodePanelToggleLock}
                      />
                    </div>
                  )}
                </div>

                {/* AI Copilot Panel (always on the right) */}
                {aiCopilotOpen && (
                  <WorkspaceDivider
                    onDragStart={() => setIsResizing(true)}
                    onDragEnd={() => setIsResizing(false)}
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, dynamicAiMax))}
                  />
                )}

                <div
                  className={`shrink-0 overflow-hidden ${aiCopilotOpen ? 'border-l border-graphite-10' : ''}`}
                  style={{
                    width: aiCopilotOpen ? `${aiCopilotWidth}px` : "0px",
                    opacity: aiCopilotOpen ? 1 : 0,
                    transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
                  }}
                >
                  {aiCopilotOpen && (
                    <AICopilotPanel 
                      key={docType}
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
                      onMetaCancel={() => setMetaUpdateActive(false)}
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
                    />
                  )}
                </div>

                {!aiCopilotOpen && <FloatingAICopilotButton onClick={handleOpenAICopilot} />}
              </div>
            ) : (
              // Table Layout — supports both horizontal (default) and vertical panel layout
              <div className="flex h-full flex-1 min-w-0" style={{ minWidth: panelLayout === 'vertical' ? undefined : `${tableTotalMinWidth}px` }}>
                {/* Shell + Code area — direction depends on panelLayout */}
                <div className="flex min-w-0 flex-1 overflow-hidden" style={{ flexDirection: panelLayout === 'vertical' ? 'column' : 'row' }}>
                  {/* Shell Preview with subordinate Metadata card */}
                  {shellPreviewOpen && (
                    <div
                      className={`h-full flex flex-col min-w-0 overflow-hidden ${panelView === 'shell' ? 'flex-1' : 'shrink-0'} ${
                        panelLayout === 'vertical'
                          ? (codeOpen ? 'border-b border-graphite-10' : '')
                          : (codeOpen ? 'border-r border-graphite-10' : '')
                      }`}
                      style={panelLayout === 'vertical'
                        ? { height: panelView === 'shell' ? undefined : `${shellHeight}px`, minHeight: '240px' }
                        : { width: panelView === 'shell' ? undefined : `${shellPreviewWidth}px` }
                      }
                    >
                      <ShellPreview
                        docType={docType}
                        onBlockClick={() => setMetadataOpen(true)}
                        onMetadataClick={() => setMetadataOpen((open) => !open)}
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
                        metaUpdateActive={metaUpdateActive}
                        metaUpdateProcessing={metaUpdateProcessing}
                        submittedDiffItems={submittedDiffItems}
                        targetFieldId={targetMetadataFieldId || undefined}
                        onReviewItemsChange={setReviewItems}
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
                    <div className="min-w-0 flex-1 overflow-hidden" style={panelLayout === 'vertical' ? { minHeight: '240px' } : undefined}>
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

                {/* Shell ↔ AI divider (when Shell is open, Code is closed, AI is open) */}
                {/* Adjusts AI width since Shell is flex-1 in this view */}
                {shellPreviewOpen && !codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider
                    onDragStart={() => setIsResizing(true)}
                    onDragEnd={() => setIsResizing(false)}
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, dynamicAiMax))}
                  />
                )}

                {/* Code ↔ AI divider */}
                {codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider
                    onDragStart={() => setIsResizing(true)}
                    onDragEnd={() => setIsResizing(false)}
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, dynamicAiMax))}
                  />
                )}

                <div
                  className={`shrink-0 overflow-hidden ${aiCopilotOpen ? 'border-l border-graphite-10' : ''}`}
                  style={{
                    width: aiCopilotOpen ? `${aiCopilotWidth}px` : "0px",
                    opacity: aiCopilotOpen ? 1 : 0,
                    transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
                  }}
                >
                  {aiCopilotOpen && (
                    <AICopilotPanel
                      key={docType}
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
                      onMetaCancel={() => setMetaUpdateActive(false)}
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
                    />
                  )}
                </div>

                {!aiCopilotOpen && <FloatingAICopilotButton onClick={handleOpenAICopilot} />}
              </div>
            )}
          </div>
        </div>
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
}

function EventCard({ event, onEventClick, onUpdateStatus }: EventCardProps) {
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
    { icon: downloadIconUrl, label: 'Download' },
    { icon: deleteBinIconUrl, label: 'Delete' },
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
                    onClick={(e) => e.stopPropagation()}
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
}: {
  onEventClick: () => void;
  onCreateEvent: () => void;
  events: EventCardData[];
  onUpdateStatus: (id: string, status: EventStatus) => void;
  treeListOpen: boolean;
  setTreeListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeListWidth: number;
  setTreeListWidth: React.Dispatch<React.SetStateAction<number>>;
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

        {/* Main Container */}
        <div className={`flex min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-graphite-10 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] my-[4px] mr-[4px] ${!treeListOpen ? "ml-[4px]" : ""}`}>
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
                  />
                ))}
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
  const [events, setEvents] = useState<EventCardData[]>(homeEvents);

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
        />
      ) : (
        <WorkspaceContent
          onNavigateHome={() => setPage('home')}
          treeListOpen={treeListOpen}
          setTreeListOpen={setTreeListOpen}
          treeListWidth={treeListWidth}
          setTreeListWidth={setTreeListWidth}
        />
      )}
      <CreateEventModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}
