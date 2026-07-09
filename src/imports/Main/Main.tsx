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
import collapseIconUrl from "../../icons/Icon-collapse.svg";
import copyIconUrl from "../../icons/file-copy-line.svg";
import editIconUrl from "../../icons/edit-2-line.svg";
import errorWarningIconUrl from "../../icons/error-warning-line.svg";
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
import CreateEventModal from "./components/CreateEventModal";
import { Button } from "../../components/ui/Button";
import { Tooltip } from "../../components/ui/Tooltip";
import { AIInputBox } from "../../components/ui/AI-InputBox";
import { AIUserPrompt } from "../../components/ui/AI-UserPrompt";
import { AICodeDiff } from "../../components/ui/AI-CodeDiff";
import { AIThinkingStatus } from "../../components/ui/AI-ThinkingStatus";
import ChatBox from "./components/ChatBox";
import { SearchBar } from "../../components/ui/SearchBar";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Lazy-loaded low-frequency components
const MarkdownTable = lazy(() => import("./components/MarkdownTable"));
const CodeDiffBlock = lazy(() => import("./components/CodeDiffBlock"));
const AskUserComponent = lazy(() => import("./components/AskUserComponent"));

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
      <p className="t-body-secondary">
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
        hovered ? 'bg-bg-light' : 'bg-transparent'
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

      <button className="shrink-0 bg-white border-[0.6px] border-border-default hover:bg-bg-light px-[8px] py-[4px] rounded-[4px] transition-colors flex items-center gap-[4px]">
        <span className="t-small text-text-primary">Retry</span>
      </button>
    </div>
  );
}

// ==================== Markdown Components ====================

const VerticalDimension = ({ height, label, color = "#F97316" }: { height: number; label: string; color?: string }) => {
  const showArrows = height >= 10;
  return (
    <div 
      className="relative w-full flex items-center justify-center pointer-events-none z-20"
      style={{ 
        height, 
        marginTop: -height, 
        marginBottom: height,
        borderTop: `1px solid ${color}`,
        borderBottom: `1px solid ${color}`
      }}
    >
      {/* 垂直实线 */}
      <div className="absolute top-0 bottom-0 w-[1px]" style={{ backgroundColor: color }} />
      
      {/* 垂直箭头 */}
      {showArrows && (
        <div className="absolute inset-y-0 flex flex-col items-center justify-between pointer-events-none">
          <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: `4px solid ${color}` }} />
          <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: `4px solid ${color}` }} />
        </div>
      )}
      
      {/* 尺寸文字标签 */}
      <span 
        className="px-[4px] py-[0px] rounded text-[8px] font-mono font-bold scale-[0.8] z-30 select-none bg-white shadow-sm"
        style={{ color, border: `1px solid ${color}`, lineHeight: '12px' }}
      >
        {label}
      </span>
    </div>
  );
};

function InlineHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-graphite-10 px-[4px] rounded-[4px] h-[20px] inline-flex items-center t-caption text-text-primary">
      {children}
    </span>
  );
}

function Hyperlink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <a href={href} className="t-link hover:underline transition-all">
      {children}
    </a>
  );
}

function Blockquote({ children, devSpacingMode }: { children: React.ReactNode; devSpacingMode?: boolean }) {
  return (
    <div className="relative w-full">
      <blockquote className="border-l-[3px] border-border-default bg-[#FAFAFA] pl-[12px] py-[8px] mb-[10px] rounded-r-[4px]">
        <div className="t-body text-text-primary">
          {children}
        </div>
      </blockquote>
      {devSpacingMode && (
        <>
          {/* Padding Top 8px */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none">
            <VerticalDimension height={8} label="py: 8px" color="#10B981" />
          </div>
          {/* Padding Bottom 8px */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ transform: 'translateY(-10px)' }}>
            <VerticalDimension height={8} label="py: 8px" color="#10B981" />
          </div>
          {/* Margin Bottom 10px */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <VerticalDimension height={10} label="mb: 10px" color="#F97316" />
          </div>
        </>
      )}
    </div>
  );
}

function Divider({ devSpacingMode }: { devSpacingMode?: boolean }) {
  return (
    <div className="relative w-full">
      <div className="h-[0.5px] bg-border-default w-full my-[12px]" />
      {devSpacingMode && (
        <>
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ marginTop: -12 }}>
            <VerticalDimension height={12} label="mt: 12px" color="#F97316" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ marginBottom: -12 }}>
            <VerticalDimension height={12} label="mb: 12px" color="#F97316" />
          </div>
        </>
      )}
    </div>
  );
}

// ==================== Chat Conversation & Main Panel ====================

type Message = {
  type: 'user' | 'ai_thinking' | 'ai_ask_user' | 'ask_user_result' | 'ai_complete';
  content?: string;
  hasTag?: boolean;
  answers?: { q: string; a: string }[];
  isSkipped?: boolean;
};

function ChatConversation({ 
  messages, 
  isPending, 
  devSpacingMode = false 
}: { 
  messages: Message[]; 
  isPending: boolean; 
  devSpacingMode?: boolean; 
}) {
  const lastMessage = messages[messages.length - 1];
  const showAskUser = lastMessage?.type === 'ai_ask_user';

  return (
    <div className="flex flex-col w-full p-[10px] gap-[12px] relative">
      {devSpacingMode && (
        <>
          <div className="absolute top-0 left-0 right-0 pointer-events-none">
            <VerticalDimension height={10} label="py: 10px" color="#10B981" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <VerticalDimension height={10} label="py: 10px" color="#10B981" />
          </div>
        </>
      )}

      {messages.map((msg, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col w-full gap-[12px] relative">
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
              <div className="bg-bg-light px-[10px] py-[8px] rounded-[8px] w-full">
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
                
                {devSpacingMode && (
                  <div className="w-full relative pointer-events-none" style={{ height: 12 }}>
                    <VerticalDimension height={12} label="gap-y: 12px" color="#8B5CF6" />
                  </div>
                )}
                
                {/* Markdown Render Container */}
                <div className={`flex flex-col w-full px-[10px] relative ${devSpacingMode ? 'border border-gray-100 rounded p-[4px]' : ''}`}>
                  
                  {/* h1 block */}
                  <div className="relative w-full">
                    <h1 className="t-heading text-text-primary mb-[10px]">Analysis Results Summary</h1>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>

                  {/* p block */}
                  <div className="relative w-full">
                    <p className="t-body text-text-primary mb-[10px] leading-relaxed">
                      Generated Kaplan-Meier survival plot for <InlineHighlight>OS (Overall Survival)</InlineHighlight> using the ITT population. 
                      Reference the <Hyperlink>Analysis Plan v1.2</Hyperlink> for further details.
                    </p>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>
                  
                  {/* table block */}
                  <div className="relative w-full">
                    <div className="mb-[10px]">
                      <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded mb-2" />}>
                        <MarkdownTable />
                      </Suspense>
                    </div>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>
                  
                  {/* p block */}
                  <div className="relative w-full">
                    <p className="t-body text-text-primary mb-[10px] leading-relaxed">
                      Key observations from the data cohort:
                    </p>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>

                  {/* list block */}
                  <div className="relative w-full">
                    <ul className="list-disc pl-[24px] mb-[10px] flex flex-col gap-[4px]">
                      <li className="t-body text-text-primary">High survival rate in early stages.</li>
                      {devSpacingMode && (
                        <div className="w-full relative pointer-events-none" style={{ height: 4 }}>
                          <VerticalDimension height={4} label="gap-y: 4px" color="#8B5CF6" />
                        </div>
                      )}
                      <li className="t-body text-text-primary">Significant variance in treatment line 3.</li>
                    </ul>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>

                  {/* blockquote block */}
                  <Blockquote devSpacingMode={devSpacingMode}>
                    "The integration of survival data confirms the hypothesis proposed in the preliminary report."
                  </Blockquote>

                  {/* hr block */}
                  <Divider devSpacingMode={devSpacingMode} />

                  {/* h3 block */}
                  <div className="relative w-full">
                    <h3 className="t-heading text-text-primary mb-[10px]">SAS Logic</h3>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>

                  {/* pre block */}
                  <div className="relative w-full">
                    <div className="border-[0.6px] border-border-default rounded-[4px] overflow-hidden mb-[10px]">
                      <pre className="bg-bg-light px-[16px] py-[12px] overflow-x-auto relative">
                        <code className="t-code text-text-primary whitespace-pre">
                          <span className="text-[#005CC5]">proc sql</span>;{'\n'}
                          {'  '}<span className="text-[#005CC5]">select</span> * <span className="text-[#005CC5]">from</span> itt_pop;{'\n'}
                          <span className="text-[#005CC5]">quit</span>;
                        </code>
                        {devSpacingMode && (
                          <>
                            <div className="absolute top-0 left-0 right-0 pointer-events-none">
                              <VerticalDimension height={12} label="py: 12px" color="#10B981" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ transform: 'translateY(-10px)' }}>
                              <VerticalDimension height={12} label="py: 12px" color="#10B981" />
                            </div>
                          </>
                        )}
                      </pre>
                    </div>
                    {devSpacingMode && <VerticalDimension height={10} label="mb: 10px" color="#F97316" />}
                  </div>
                </div>

                {/* Other components (non-Markdown blocks) */}
                <div className="relative w-full">
                  <ToolCallCard toolName="read_file" />
                  {devSpacingMode && (
                    <div className="w-full relative pointer-events-none" style={{ height: 12, marginTop: 12 }}>
                      <VerticalDimension height={12} label="gap-y: 12px" color="#8B5CF6" />
                    </div>
                  )}
                </div>
                
                <div className="relative w-full">
                  <AICodeDiff />
                  {devSpacingMode && (
                    <div className="w-full relative pointer-events-none" style={{ height: 12, marginTop: 12 }}>
                      <VerticalDimension height={12} label="gap-y: 12px" color="#8B5CF6" />
                    </div>
                  )}
                </div>

                <div className="relative w-full">
                  <ErrorMessageWithRetry />
                </div>
              </div>
            )}
          </div>
          {devSpacingMode && i < messages.length - 1 && (
            <div className="w-full relative pointer-events-none" style={{ height: 12, marginTop: 12 }}>
              <VerticalDimension height={12} label="gap-y: 12px" color="#8B5CF6" />
            </div>
          )}
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
}: {
  panelWidth: number;
  onClose: () => void;
  inputValue?: string;
  onChangeInputValue?: (v: string) => void;
  focusTrigger?: number;
}) {
  const [devSpacingMode, setDevSpacingMode] = useState(true); // 默认开启以供演示
  const [messages, setMessages] = useState<Message[]>([
    { type: 'user', content: 'Generate Kaplan-Meier survival plot report for OS.' },
    { type: 'ai_complete' }
  ]);
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

  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

  const lastMessage = messages[messages.length - 1];
  const showAskUser = lastMessage?.type === 'ai_ask_user';
  const hasCodeDiff = messages.some(m => m.type === 'ai_complete');

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
    setMessages(prev => [...prev, { type: 'ai_thinking' }]);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.type === 'ai_thinking' ? { type: 'ai_ask_user' } : m));
    }, 1500);
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
          <button 
            type="button" 
            onClick={() => setDevSpacingMode(!devSpacingMode)}
            className={`px-[6px] py-[2px] rounded text-[10px] font-semibold transition-all border ${devSpacingMode ? 'bg-[#F2F9F2] text-green-700 border-green-300' : 'bg-transparent text-text-secondary border-graphite-10 hover:bg-black/5'}`}
          >
            {devSpacingMode ? '📏 Spacing: ON' : '📏 Spacing: OFF'}
          </button>
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
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="absolute top-[40px] inset-x-0 flex flex-col items-center pt-[180px] gap-[12px]">
            <img src={atlasLogoFullUrl} alt="Atlas" className="h-[32px]" />
            <span className="t-body text-text-secondary text-center">Automate TFLs. Accelerate Insights.</span>
          </div>
        ) : (
          <ChatConversation messages={messages} isPending={isPending} devSpacingMode={devSpacingMode} />
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
        {hasCodeDiff ? (
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
type DocumentType = 'table' | 'listing';
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

function LockTreeIcon({ className = "w-[16px] h-[16px]", color = "#3C4242" }) {
  return <LocalIcon src={lockIconUrl} className={className} color={color} />;
}

function UnlockTreeIcon({ className = "w-[16px] h-[16px]", color = "#3C4242" }) {
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

function FolderIcon({ color = "#3C4242" }) {
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

function TooltipText({ label, children, align = "center" }: { label: React.ReactNode; children: React.ReactNode; align?: "center" | "left" }) {
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
}: {
  isOpen: boolean;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-[400px] max-w-[90vw] rounded-[8px] bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between border-b border-[#E5E8E8] px-[24px] pb-[17px] pt-[16px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <ErrorWarningIcon className="w-[20px] h-[20px] shrink-0" color="#F0AB00" />
            <h2 className="t-heading text-text-primary">{title}</h2>
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
          <p className="t-body-secondary text-[#656969]">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-[12px] border-t border-[#E5E8E8] px-[24px] pb-[20px] pt-[21px]">
          <button
            onClick={onSecondary}
            className="h-[36px] rounded-[4px] border-[0.6px] border-border-default bg-white px-[12px] t-body-secondary text-text-primary hover:bg-bg-light active:scale-[0.96]"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary}
            className="h-[36px] rounded-[4px] bg-brand-1 px-[12px] t-body-secondary text-white hover:bg-[#6D0043] active:scale-[0.96]"
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
    <div className="bg-bg-light flex items-center rounded-[4px]">
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
          <div className={`relative shrink-0 size-[16px] flex items-center justify-center ${layout === 'vertical' && value === 'both' ? 'rotate-90' : ''}`}>
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
}) {

  const viewTabs = docType === 'listing' ? null : (
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
          <PanelViewToggle value={panelView} onChange={onPanelViewChange} layout={panelLayout} onLayoutChange={onPanelLayoutChange} docType={docType} />
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
        <div className="absolute right-[12px] top-[14px]">
          <PanelViewToggle value={panelView} onChange={onPanelViewChange} layout={panelLayout} onLayoutChange={onPanelLayoutChange} docType={docType} />
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
}: {
  item: TableItem | ProgramItem;
  itemId: string;
  program: ProgramItem;
  isHovered: boolean;
  isProgram: boolean;
  isChildOfLockedParent: boolean;
  onToggleLock: (programId: string, tableId?: string) => void;
  onShowLockedModal: (programName: string) => void;
}) {
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

            return (
              <div
                key={table.id}
                className={`relative h-[28px] w-full cursor-pointer rounded-[4px] transition-colors ${
                  isTableSelected ? 'bg-az-secondary' : isTableHovered ? 'bg-graphite-10' : ''
                }`}
                onClick={() => onSelect(table.id)}
                onMouseEnter={() => setHoveredId(table.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex h-full items-center justify-between pl-[24px] pr-[12px]">
                  <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
                    {table.docType === 'listing' ? (
                      <ListingTreeIcon color={isProgramLocked ? "#B2B4B4" : isTableSelected ? "#830051" : "#888E8E"} />
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
                    isHovered={isTableHovered && !isProgramLocked}
                    isProgram={false}
                    isChildOfLockedParent={isProgramLocked}
                    onToggleLock={onToggleLock}
                    onShowLockedModal={onShowLockedModal}
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
    <div className={`flex h-[40px] w-full shrink-0 items-center justify-between bg-white px-[12px] ${noBorder ? '' : 'border-b border-graphite-10'}`}>
      <div className="t-small truncate text-black flex items-center">{title}</div>
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
  { subject: "E0001001", age: "29/F/White", region: "xx/xx/xx", ethnicity: "Xxxxxxx", country: "Xxxxxxx", weight: "xx", height: "xx", bmi: "xx.x", nicotine: "Xxxxx", alcohol: "Xxxxx", ecog: "(0) Fully active" },
  { subject: "E0001002", age: "30/F/White", region: "xx/xx/xx", ethnicity: "Xxxxxxx", country: "Xxxxxxx", weight: "xx", height: "xx", bmi: "xx.x", nicotine: "Xxxxx", alcohol: "Xxxxx", ecog: "(1) Fully active" },
  { subject: "E0001003", age: "31/F/White", region: "xx/xx/xx", ethnicity: "Xxxxxxx", country: "Xxxxxxx", weight: "xx", height: "xx", bmi: "xx.x", nicotine: "Xxxxx", alcohol: "Xxxxx", ecog: "(2) Fully active" },
  { subject: "E0001004", age: "32/F/White", region: "xx/xx/xx", ethnicity: "Xxxxxxx", country: "Xxxxxxx", weight: "xx", height: "xx", bmi: "xx.x", nicotine: "Xxxxx", alcohol: "Xxxxx", ecog: "(3) Fully active" },
];

const listingColumns = [
  { key: "subject", label: "Subject identifier", width: 112, widthPx: 112 },
  { key: "age", label: "Age/Sex/Race [a]", width: 118, widthPx: 118 },
  { key: "region", label: "Geographical region/Prior gastrectomy/Line of therapy", width: 205, widthPx: 205 },
  { key: "ethnicity", label: "Ethnicity", width: 86, widthPx: 86 },
  { key: "country", label: "Country/Area", width: 96, widthPx: 96 },
  { key: "weight", label: "Baseline weight (kg)", width: 108, widthPx: 108 },
  { key: "height", label: "Baseline height (cm)", width: 112, widthPx: 112 },
  { key: "bmi", label: "Baseline body mass index (kg/m2)", width: 124, widthPx: 124 },
  { key: "nicotine", label: "Nicotine use", width: 92, widthPx: 92 },
  { key: "alcohol", label: "Alcohol use", width: 88, widthPx: 88 },
  { key: "ecog", label: "ECOG performance status", width: 132, widthPx: 132 },
] as const;

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
    e.preventDefault();
    e.stopPropagation();
    const containerEl = tableContainerRef.current;
    if (!containerEl) return;

    const initialFreeze = frozenUntilIndex;
    if (initialFreeze === null) return;

    setDraggingFreeze({ currentGap: initialFreeze });
    const initialLeft = initialFreeze === null ? 0 : (gapXPositionsRef.current[initialFreeze] || getGapX(initialFreeze));
    setFreezeDragOriginX(initialLeft);

    const onMove = (ev: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;

      let nearest = initialFreeze;
      let minDist = Infinity;
      // Max freeze gap index is: listingColumns.length - 2 - pageBreakColumns.length
      const maxFreeze = listingColumns.length - 2 - pageBreakColumns.length;

      for (let i = 0; i <= Math.max(0, maxFreeze); i++) {
        const gx = gapXPositionsRef.current[i] || getGapX(i);
        const dist = Math.abs(mouseX - gx);
        if (dist < minDist) { minDist = dist; nearest = i; }
      }

      const clamped = Math.max(0, Math.min(maxFreeze, nearest));
      setDraggingFreeze({ currentGap: clamped });
      setFrozenUntilIndex(clamped);

      // Push page breaks to the right dynamically
      setPageBreakColumns(prev => {
        const sorted = [...prev].sort((a, b) => a - b);
        let changed = false;
        const nextBreaks = sorted.map((p, idx) => {
          const minAllowed = clamped + 1 + idx;
          if (p < minAllowed) {
            changed = true;
            return minAllowed;
          }
          return p;
        });
        return changed ? nextBreaks : prev;
      });
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
        {/* Shell content */}
        <div className={`relative flex-1 overflow-auto ${pageSepActive ? 'bg-[#f2f3f3]' : 'bg-white'}`}>
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
          <div className={`min-w-max p-[12px] ${pageSepActive ? 'hidden' : ''}`}>
            <div className="w-max bg-white text-black">
              <div className="relative">
                {/* Title header */}
                <div className="h-[72px] min-w-max border-b-2 border-black flex items-start justify-center px-[16px] pt-[24px]">
                  <h1 className="font-['Inter',sans-serif] text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]">Appendix 16.2.4 Demographic and baseline characteristics (ITT analysis set)</h1>
                </div>
                <div ref={tableContainerRef} className="relative inline-block min-w-max">
                  <table className="table-fixed border-separate border-spacing-0 font-['Inter',sans-serif] text-black" style={{ width: `${totalListingWidth}px` }}>
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
                              className={`group ${frozen ? 'sticky' : 'relative'} ${column.width > 0 ? '' : ''} border-r border-b-2 border-black border-r-graphite-10 px-[4px] py-[6px] text-left align-middle text-[12px] leading-[18px] font-bold whitespace-normal break-words select-none pointer-events-auto transition-[border-color,box-shadow,background-color,outline-color] duration-[180ms] ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}
                              onMouseEnter={() => setHoveredFreezeColumn(columnIndex)}
                              onMouseLeave={() => setHoveredFreezeColumn(null)}
                            >
                              {/* Hover tooltip for Add Freeze */}
                              {hoveredFreezeColumn === columnIndex && frozenUntilIndex === null && hoveredGap === null && !pageSepActive && (
                                <div
                                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full z-[60] pb-[6px] cursor-pointer active:scale-[0.96] transition-transform pointer-events-auto"
                                  onClick={(e) => { e.stopPropagation(); setFrozenUntilIndex(columnIndex); setHoveredFreezeColumn(null); }}
                                >
                                  <div className="flex items-center gap-[4px] bg-[#3C4242] text-[#F8F7F7] rounded-[4px] pl-[4px] pr-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                                    <FreezeIcon color="white" />
                                    <span className="font-['PingFang_SC',sans-serif] font-normal text-[12px] leading-[20px]">Repeat Columns</span>
                                  </div>
                                </div>
                              )}
                              {/* Button area */}
                              <div className="flex w-full items-center justify-between gap-[4px] rounded-[3px]">
                                <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onBlockClick(); }} className="flex-1 min-w-0 whitespace-normal break-words rounded-[3px] text-left transition-colors duration-[180ms] hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#830051] focus-visible:outline-offset-1" aria-label={`Open ${column.label} metadata`}>{column.label}</button>
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
                                      cursor: 'col-resize',
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
                    {listingData.map((row) => (
                      <tr key={row.subject} className="group">
                        {listingColumns.map((column, columnIndex) => {
                          const frozen = isColumnFrozen(columnIndex);
                          const frozenBoundary = frozenUntilIndex === columnIndex;
                          const shadows: string[] = [];
                          if (frozenBoundary) shadows.push('4px 0 0 rgba(0,0,0,0.08)');
                          const cellStyle: React.CSSProperties = {};
                          if (frozen) { cellStyle.left = `${getFrozenLeft(columnIndex)}px`; cellStyle.zIndex = 20; cellStyle.backgroundColor = 'white'; }
                          if (shadows.length) cellStyle.boxShadow = shadows.join(', ');
                          return (
                            <td key={`${row.subject}-${column.key}`} style={cellStyle} className={`border-r border-b border-b-border-default group-last:border-b-2 group-last:border-b-black border-border-default px-[4px] py-[6px] align-middle text-[12px] leading-[18px] font-normal whitespace-normal break-words transition-[border-color,box-shadow,background-color] duration-[180ms] ${frozen ? 'sticky' : ''} ${frozenBoundary ? "after:content-[''] after:absolute after:top-[-2px] after:bottom-[-2px] after:right-[-2px] after:w-[2px] after:bg-brand-1 after:z-[40] after:pointer-events-none after:shadow-[2px_0_4px_rgba(0,0,0,0.08)]" : ''}`}>
                              <div className="w-full overflow-hidden truncate">
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
                  {hoveredGap !== null && !pageBreakColumns.includes(hoveredGap) && (
                    <>
                      <div
                        className="absolute bottom-0 pointer-events-none"
                        style={{ left: `${(gapXPositions[hoveredGap] || getGapX(hoveredGap)) - 1}px`, top: 0, width: '2px', borderLeft: '2px dashed rgba(240,171,0,0.65)', zIndex: 35 }}
                      />
                      <div
                        className="absolute z-[60] cursor-pointer pointer-events-auto pb-[6px] active:scale-[0.96] transition-transform"
                        style={{ left: `${gapXPositions[hoveredGap] || getGapX(hoveredGap)}px`, top: '0', transform: 'translateX(-50%) translateY(-100%)' }}
                        onMouseEnter={() => setHoveredGap(hoveredGap)}
                        onMouseLeave={() => setHoveredGap(null)}
                        onClick={() => { addPageBreak(hoveredGap); setHoveredGap(null); }}
                      >
                        <div className="flex items-center gap-[4px] bg-[#3C4242] text-[#F8F7F7] rounded-[4px] pl-[4px] pr-[6px] py-[4px] whitespace-nowrap shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
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
                        onMouseEnter={() => setHoveredGap(columnIndex)}
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
  columnGroups: { name: string; span: number }[];
  columns: string[];
  rows: { category: string; indent?: number; values: string[]; isHeader?: boolean }[];
}

const shellTableData: Record<string, ShellTableData> = {
  'Table 14.1.1': {
    tableNumber: 'Table 14.1.1',
    tableTitle: 'Demographics and Baseline Characteristics',
    population: 'Safety Analysis Set',
    columnGroups: [
      { name: 'Placebo\n(N=120)', span: 2 },
      { name: 'AZD0780 10mg\n(N=118)', span: 2 },
      { name: 'AZD0780 20mg\n(N=122)', span: 2 },
      { name: 'Total\n(N=360)', span: 2 },
    ],
    columns: ['n', '(%)', 'n', '(%)', 'n', '(%)', 'n', '(%)'],
    rows: [
      { category: 'Sex', values: ['', '', '', '', '', '', '', ''], isHeader: true },
      { category: 'Male', indent: 1, values: ['72', '(60.0)', '68', '(57.6)', '74', '(60.7)', '214', '(59.4)'] },
      { category: 'Female', indent: 1, values: ['48', '(40.0)', '50', '(42.4)', '48', '(39.3)', '146', '(40.6)'] },
      { category: 'Age Group (years)', values: ['', '', '', '', '', '', '', ''], isHeader: true },
      { category: '< 65', indent: 1, values: ['67', '(55.8)', '64', '(54.2)', '70', '(57.4)', '201', '(55.8)'] },
      { category: '>= 65 and < 75', indent: 1, values: ['38', '(31.7)', '41', '(34.7)', '37', '(30.3)', '116', '(32.2)'] },
      { category: '>= 75', indent: 1, values: ['15', '(12.5)', '13', '(11.0)', '15', '(12.3)', '43', '(11.9)'] },
      { category: 'Race', values: ['', '', '', '', '', '', '', ''], isHeader: true },
      { category: 'White', indent: 1, values: ['89', '(74.2)', '86', '(72.9)', '91', '(74.6)', '266', '(73.9)'] },
      { category: 'Black or African American', indent: 1, values: ['18', '(15.0)', '20', '(16.9)', '17', '(13.9)', '55', '(15.3)'] },
      { category: 'Asian', indent: 1, values: ['8', '(6.7)', '7', '(5.9)', '9', '(7.4)', '24', '(6.7)'] },
      { category: 'Other', indent: 1, values: ['5', '(4.2)', '5', '(4.2)', '5', '(4.1)', '15', '(4.2)'] },
      { category: 'Ethnicity', values: ['', '', '', '', '', '', '', ''], isHeader: true },
      { category: 'Hispanic or Latino', indent: 1, values: ['14', '(11.7)', '12', '(10.2)', '15', '(12.3)', '41', '(11.4)'] },
      { category: 'Not Hispanic or Latino', indent: 1, values: ['106', '(88.3)', '106', '(89.8)', '107', '(87.7)', '319', '(88.6)'] },
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
}: {
  onBlockClick: () => void;
  onMetadataClick: () => void;
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
}) {
  const shellData = shellTableData[selectedItemName] || shellTableData['Table 14.1.1'];
  const metadataMinWidth = 280;
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <PanelHeader
        noBorder={true}
        title={selectedItemName || "Shell preview"}
        actions={
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
        }
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-[12px]">
          {/* Title header - Styled like Listing's Shell preview header */}
          <div className="h-[72px] min-w-max border-b-2 border-black flex flex-col items-center justify-start px-[16px] pt-[16px] bg-white text-black mb-[16px]">
            <h1 className="font-['Inter',sans-serif] text-[14px] leading-[20px] font-bold text-center tracking-[-0.01em]">
              {shellData.tableNumber}. {shellData.tableTitle}
            </h1>
            <p className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#6f7676] mt-[4px]">
              {shellData.population}
            </p>
          </div>

          <div className="relative inline-block min-w-full">
            <table className="w-full border-separate border-spacing-0 font-['Inter',sans-serif] text-black">
              <thead>
                {/* Column group header */}
                <tr className="group">
                  <th className="bg-white text-left text-[12px] leading-[18px] font-bold py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default min-w-[180px]">
                    {selectedItemName.startsWith('Listing') ? 'Subject ID' : 'Parameter'}
                  </th>
                  {shellData.columnGroups.map((group, gi) => (
                    <th
                      key={gi}
                      colSpan={group.span}
                      className="text-center text-[12px] leading-[18px] font-bold py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {group.name}
                    </th>
                  ))}
                </tr>
                {/* Sub-column header */}
                <tr className="group">
                  <th className="bg-white text-left text-[12px] leading-[18px] font-bold py-[4px] px-[8px] whitespace-nowrap border-r border-b-2 border-black border-border-default">
                    
                  </th>
                  {shellData.columns.map((col, ci) => (
                    <th
                      key={ci}
                      className="text-center text-[12px] leading-[18px] font-bold py-[4px] px-[6px] whitespace-nowrap border-r border-b-2 border-black border-border-default last:border-r-0"
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
                        row.isHeader ? 'bg-bg-light font-semibold text-text-primary' : 'bg-white text-text-primary group-hover:bg-az-secondary'
                      } text-left text-[12px] leading-[18px] py-[6px] px-[8px] whitespace-nowrap border-r border-b border-border-default group-last:border-b-2 group-last:border-b-black transition-colors duration-[180ms]`}
                      style={{ paddingLeft: row.indent ? `${8 + row.indent * 16}px` : '8px' }}
                    >
                      {row.category}
                    </td>
                    {row.values.map((val, vi) => (
                      <td
                        key={vi}
                        className={`text-center text-[12px] leading-[18px] ${
                          row.isHeader ? 'bg-bg-light font-semibold text-text-primary' : 'bg-white text-text-primary group-hover:bg-az-secondary'
                        } py-[6px] px-[6px] whitespace-nowrap border-r border-b border-border-default last:border-r-0 group-last:border-b-2 group-last:border-b-black transition-colors duration-[180ms]`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Shell note */}
          <div className="mt-[12px] flex items-center gap-[4px]">
            <div className="h-[6px] w-[6px] rounded-full bg-brand-1" />
            <p className="t-small text-text-secondary">Shell preview — data shown is illustrative structure. Click a row to view metadata.</p>
          </div>
        </div>
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
              <MetadataPanel onClose={onMetadataClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FieldStatus = "default" | "edited";

interface MetadataField {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  confirmed: boolean;
}

interface MetadataBlock {
  id: string;
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
        <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center gap-[4px] px-[10px] py-[8px] bg-white hover:bg-bg-light transition-colors active:scale-[0.99]" aria-expanded={expanded}>
          <span className="t-small text-text-primary">Group Code</span>
          <div className="shrink-0 size-[16px] flex items-center justify-center transition-transform duration-150" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <SvgIcon className="h-[8px] w-[9px]" viewBox="0 0 8.49 5.19"><path d="M0.75 0.75L4.24 4.24L7.72 0.75" stroke="#888E8E" strokeWidth="1.5" fill="none" /></SvgIcon>
          </div>
        </button>
        {expanded && (
          <div className="relative border-t-[0.6px] border-border-default">
            <div className="overflow-auto bg-bg-light" style={{ maxHeight: '220px' }}>
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

// ── Block Items Data for Blocks Tab Two-Column Layout ──
const METADATA_BLOCK_ITEMS_DATA = [
  {
    id: 'nicotine',
    name: 'Nicotine use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'NICSTT', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'nicstt_cat', type: 'text' as const, hasLink: true },
    ],
  },
  {
    id: 'alcohol',
    name: 'Alcohol use',
    fields: [
      { id: 'dataset', label: 'Dataset', value: 'ADSL', type: 'text' as const, required: true },
      { id: 'variable', label: 'Variable', value: 'ALCSTT', type: 'tag' as const, required: true },
      { id: 'blockType', label: 'Block Type', value: 'BLK_CUM', type: 'text' as const, required: true },
      { id: 'macro', label: 'Macro', value: 'm_t_dm', type: 'tag' as const, hasLink: true },
      { id: 'formatName', label: 'Format Name', value: 'alcstt_cat', type: 'text' as const, hasLink: true },
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

function BlocksTabContent({
  blocks,
  confirmedBlocks,
  onToggleConfirm,
  isLocked,
}: {
  blocks: typeof METADATA_BLOCK_ITEMS_DATA;
  confirmedBlocks: Record<string, boolean>;
  onToggleConfirm: (blockId: string) => void;
  isLocked?: boolean;
}) {
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id || '');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollSyncActive = useRef(true);

  const handleSidebarClick = (blockId: string) => {
    setSelectedBlockId(blockId);
    isScrollSyncActive.current = false;
    sectionRefs.current[blockId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isScrollSyncActive.current = true; }, 600);
  };

  // Scroll-sync: update selected sidebar item based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (!isScrollSyncActive.current) return;
      const containerRect = container.getBoundingClientRect();
      let closestId = blocks[0]?.id || '';
      let closestDist = Infinity;
      for (const block of blocks) {
        const el = sectionRefs.current[block.id];
        if (!el) continue;
        const dist = Math.abs(el.getBoundingClientRect().top - containerRect.top);
        if (dist < closestDist) { closestDist = dist; closestId = block.id; }
      }
      setSelectedBlockId(closestId);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [blocks]);

  const LinkIcon = () => (
    <SvgIcon className="h-[12px] w-[12px] inline-block ml-[4px]" viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="var(--color-brand-1)" />
    </SvgIcon>
  );

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left sidebar — block navigation */}
      <div className="w-[160px] shrink min-w-[90px] border-r border-[#E5E8E8] overflow-y-auto bg-white">
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => handleSidebarClick(block.id)}
            className={`w-full text-left px-[12px] py-[10px] t-small leading-[1.3] transition-colors truncate ${
              selectedBlockId === block.id
                ? 'bg-az-secondary text-brand-1 font-medium border-l-[3px] border-l-brand-1 pl-[9px]'
                : 'text-text-primary hover:bg-bg-light border-l-[3px] border-l-transparent pl-[9px]'
            }`}
            title={block.name}
          >
            {block.name}
          </button>
        ))}
      </div>

      {/* Right content — scrollable block sections */}
      <div ref={scrollContainerRef} className="flex-1 min-w-[180px] overflow-y-auto">
        {blocks.map((block, blockIndex) => (
          <div
            key={block.id}
            ref={(el) => { sectionRefs.current[block.id] = el; }}
            data-block-id={block.id}
            className={`px-[16px] py-[14px] ${blockIndex !== blocks.length - 1 ? 'border-b border-[#E5E8E8]' : ''}`}
          >
            <p className="text-[14px] font-bold text-text-primary mb-[12px]">{block.name}</p>
            <div className="flex flex-col gap-[12px]">
              {block.fields.map((field) => (
                <div key={field.id}>
                  <p className="t-small text-text-secondary mb-[4px]">
                    {field.required && <span className="text-[#D32F2F]">* </span>}
                    {field.label}
                    {field.hasLink && <LinkIcon />}
                  </p>
                  {field.type === 'tag' ? (
                    <div className={`flex flex-wrap gap-[4px] min-h-[32px] px-[8px] py-[4px] rounded-[4px] border items-center ${
                      isLocked ? 'border-transparent bg-bg-light' : 'border-border-default bg-white'
                    }`}>
                      <span className={`inline-flex items-center gap-[6px] h-[24px] px-[8px] rounded-[12px] t-small ${
                        isLocked ? 'bg-[#EBEBEB] text-[#B2B4B4]' : 'bg-[#F0F0F0] text-text-primary'
                      }`}>
                        {field.value}
                        {!isLocked && (
                          <button className="flex items-center justify-center h-[14px] w-[14px] rounded-full text-text-secondary hover:text-text-primary text-[13px] leading-none">×</button>
                        )}
                      </span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      readOnly
                      className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[4px] border t-small outline-none focus:outline-none ${
                        isLocked
                          ? 'bg-bg-light border-transparent text-[#B2B4B4] cursor-not-allowed'
                          : 'bg-white border-border-default text-text-primary'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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
}

function MetadataPanel({
  onClose, docType = 'table', isLocked, frozenUntilIndex, pageSepActive, pageColumnCounts = {},
  pageBreakColumns = [], columnCount = 11,
  repeatColumnBaseline = null, onRepeatColumnBaselineChange,
  pageBreakColumnBaseline = null, onPageBreakColumnBaselineChange,
  idpageBaseline = null, idlistBaseline = null, onIdpageBaselineChange, onIdlistBaselineChange,
  onAddChangesToChat,
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
      return { id: f.id, label: f.label, value: f.value, status, confirmed };
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

  // ── Stats ──
  const isBasicTab = activeTab === 'basic';
  
  // Table stats
  const basicTotalFields = blocks.reduce((s, b) => s + b.fields.length, 0) + 1;
  const basicConfirmedCount = blocks.reduce((s, b) => s + b.fields.filter(f => f.confirmed).length, 0) + (groupConfirmed ? 1 : 0);
  const blocksTotalFields = METADATA_BLOCK_ITEMS_DATA.length;
  const blocksConfirmedCount = METADATA_BLOCK_ITEMS_DATA.filter(b => blockItemConfirmed[b.id]).length;

  // Listing stats
  const listingTotalFields = listingBlocks.reduce((s, b) => s + b.fields.length, 0);
  const listingConfirmedCount = listingBlocks.reduce((s, b) => s + b.fields.filter(f => {
    if (f.id === 'idlist') return !isRepeatColumnEdited && f.confirmed;
    if (f.id === 'idpage') return !isPageBreakColumnEdited && f.confirmed;
    return f.confirmed;
  }).length, 0);
  const listingColumnTotalFields = listingColumnFields.length;
  const listingColumnConfirmedCount = listingColumnFields.filter(f => f.confirmed).length;

  const totalFields = docType === 'listing'
    ? (isBasicTab ? listingTotalFields : listingColumnTotalFields)
    : (isBasicTab ? basicTotalFields : blocksTotalFields);

  const confirmedCount = docType === 'listing'
    ? (isBasicTab ? listingConfirmedCount : listingColumnConfirmedCount)
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
    } else {
      if (isBasicTab) {
        if (groupStatus !== 'edited') setGroupConfirmed(confirm);
        setBlocks(prev => prev.map(b => ({ ...b, fields: b.fields.map(f => ({ ...f, confirmed: confirm })) })));
      } else {
        const newConfirmed: Record<string, boolean> = {};
        METADATA_BLOCK_ITEMS_DATA.forEach(b => { newConfirmed[b.id] = confirm; });
        setBlockItemConfirmed(newConfirmed);
      }
    }
  };

  const handleFieldEdit = (blockId: string, fieldId: string, value: string) => {
    if (docType === 'listing') {
      setListingBlocks(prev => prev.map(b => b.id !== blockId ? b : { ...b, fields: b.fields.map(f => f.id !== fieldId ? f : { ...f, value, status: 'edited', confirmed: true }) }));
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

  const getFieldStyles = (status: FieldStatus, isReadOnlyField: boolean = false) => {
    if (isReadOnlyField) {
      if (status === 'edited') {
        return { containerBg: "bg-[#FCEECC]", containerBorder: "border-[#F0AB00]", inputBorder: "border-transparent" };
      }
      return { containerBg: "bg-transparent", containerBorder: "border-transparent", inputBorder: "border-transparent" };
    }
    if (status === "edited") {
      return { containerBg: "bg-[#FCEECC]", containerBorder: "border-[#F0AB00]", inputBorder: "border-transparent" };
    }
    return { containerBg: "bg-white", containerBorder: "border-transparent", inputBorder: "border-[#999]" };
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-graphite-10 bg-white">
        <div className="flex h-full items-center">
          {(["basic", "blocks"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative flex h-full items-center justify-center border-b-2 px-[16px] active:scale-[0.96] ${activeTab === tab ? "border-brand-1" : "border-transparent"}`}>
              <p className={`t-small font-medium ${activeTab === tab ? "text-brand-1" : "text-text-primary"}`}>
                {tab === "basic" ? (docType === 'listing' ? "Basic info" : "Basic Information") : (docType === 'listing' ? "Column" : "Blocks")}
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
      <div className="flex items-center justify-end bg-bg-light px-[12px] py-[8px]">
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
      <div className={`min-h-0 flex-1 overflow-auto p-[4px]`}>
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

                    const styles = getFieldStyles(fieldStatus, isReadOnlyField);

                    // Compute values for idlist and idpage
                    let displayValue = field.value;

                    if (field.id === 'idlist') {
                      displayValue = Array.from({ length: columnCount }, (_, i) => frozenUntilIndex !== null && i <= frozenUntilIndex ? 'Y' : 'N').join('#');
                    } else if (field.id === 'idpage') {
                      displayValue = Array.from({ length: columnCount }, (_, i) => pageBreakColumns.includes(i - 1) ? 'Y' : 'N').join('#');
                    }

                    return (
                      <div key={field.id} ref={el => { fieldRefs.current[field.id] = el; }} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                        <div className="flex flex-col gap-[4px] p-[8px]">
                          <div className="flex h-[20px] items-center justify-between">
                            <p className="t-small text-text-primary">{field.label}</p>
                            <button
                              onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)}
                              disabled={isLocked}
                              className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                              aria-label={isConfirmed ? "Unconfirm" : "Confirm"}
                            >
                              <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(isConfirmed)}</SvgIcon>
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={displayValue}
                              readOnly={isLocked || isReadOnlyField}
                              onChange={isLocked || isReadOnlyField ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                              className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border t-small text-text-primary outline-none focus:outline-none ${
                                isReadOnlyField
                                  ? 'border-transparent bg-transparent pl-0 text-text-primary' // Hide border and style nicely for read-only config fields
                                  : isLocked
                                    ? 'bg-bg-light border-transparent text-[#B2B4B4] cursor-not-allowed'
                                    : `bg-white ${styles.inputBorder || 'border-border-default'}`
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              // Table Basic Tab (Original)
              <>
                {blocks.map((block) =>
                  block.fields.map((field) => {
                    const styles = getFieldStyles(field.status, false);
                    return (
                      <div key={field.id} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                        <div className="flex flex-col gap-[4px] p-[8px]">
                          <div className="flex h-[20px] items-center justify-between">
                            <p className="t-small text-text-primary">{field.label}</p>
                            <button onClick={isLocked ? undefined : () => handleConfirm(block.id, field.id)} disabled={isLocked}
                              className={`flex h-[16px] w-[16px] items-center justify-center ${isLocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-black/5 active:scale-[0.96]'}`}
                              aria-label={field.confirmed ? "Unconfirm" : "Confirm"}>
                              <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.confirmed)}</SvgIcon>
                            </button>
                          </div>
                          <div className="relative">
                            <input type="text" value={field.value} readOnly={isLocked}
                              onChange={isLocked ? undefined : (e) => handleFieldEdit(block.id, field.id, e.target.value)}
                              className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border t-small text-text-primary outline-none focus:outline-none ${isLocked ? 'bg-bg-light border-transparent text-[#B2B4B4] cursor-not-allowed' : `bg-white ${styles.inputBorder || 'border-border-default'}`}`} />
                            {!isLocked && field.status === 'default' && (
                              <div className="absolute right-[8px] top-[8px] pointer-events-none">
                                <SvgIcon className="h-[16px] w-[16px]"><path d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z" fill="#999" /></SvgIcon>
                              </div>
                            )}
                          </div>
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
                        className={`w-full min-h-[32px] px-[8px] py-[4px] rounded-[2px] border t-small text-left flex items-center justify-between ${isLocked ? 'bg-bg-light border-transparent text-[#B2B4B4] cursor-not-allowed' : `bg-white ${groupStyles.inputBorder || 'border-border-default'} text-text-primary`}`}>
                        <span className="truncate">{GROUP_OPTIONS[selectedGroupIdx]?.name || 'Select...'}</span>
                        {!isLocked && <SvgIcon className="h-[16px] w-[16px]" shrink-0><path d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z" fill="#999" /></SvgIcon>}
                      </button>
                      {groupDropdownOpen && !isLocked && (
                        <div className="absolute top-full left-0 right-0 mt-[2px] bg-white border border-border-default rounded-[4px] shadow-lg z-[60] max-h-[200px] overflow-auto">
                          {GROUP_OPTIONS.map((opt, idx) => (
                            <button key={idx} onClick={() => handleGroupSelect(idx)}
                              className={`w-full text-left px-[8px] py-[6px] t-small hover:bg-bg-light ${idx === selectedGroupIdx ? 'text-brand-1 font-medium' : 'text-text-primary'}`}>{opt.name}</button>
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
                const styles = getFieldStyles(field.status, false);
                return (
                  <div key={field.id} ref={el => { fieldRefs.current[field.id] = el; }} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                    <div className="flex flex-col gap-[4px] p-[8px]">
                      <div className="flex h-[20px] items-center justify-between">
                        <p className="t-small text-text-primary">{field.label}</p>
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
                          isLocked ? 'bg-bg-light border-transparent text-[#B2B4B4] cursor-not-allowed' : `bg-white ${styles.inputBorder || 'border-border-default'}`
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Table Blocks Tab (Original)
            <BlocksTabContent
              blocks={METADATA_BLOCK_ITEMS_DATA}
              confirmedBlocks={blockItemConfirmed}
              onToggleConfirm={(blockId) => setBlockItemConfirmed(prev => ({ ...prev, [blockId]: !prev[blockId] }))}
            />
          )
        )}
      </div>

      {/* Add Changes to Chat Button */}
      {hasAnyEdits && (
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
      )}
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
      parts.push(<span key={key} className="text-[#A31515] font-semibold">{full}</span>);
    } else if (keyword) {
      parts.push(<span key={key} className="text-[#005CC5] font-bold">{full}</span>);
    } else if (macroCall) {
      parts.push(<span key={key} className="text-[#830051] font-bold">{full}</span>);
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
}: {
  selectedItem: string;
  docType?: DocumentType;
  freezeCols?: number;
  pageCols?: number;
  isLocked: boolean;
  onToggleLock: () => void;
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

  const programCodeContent = `/*= c_nested_cont(
    cluster_1, hba1c1( RLG_A,RLG_B,RLG_C )= a/ */
proc sql;
  create table atlas_prep_cluster1 as
  select a.*
       , b.rlg_decim
  from adlb(in=a)
  where anl1fl=''
    and max(length(scanprint(anl1, best., 2, ',')), 0) a1
       as param
  left join (
    select param,
           max( missing(anl1) )
    and PARAMCD='CHEMISTRY'
    and ANLFL1=''
    and not missing(ANL1)
    group by param
  ) as b
  on a.paramcd=param
  where SAFFL=''
    and PARAMCD='CHEMISTRY' and ANLFL1='Y';
quit;

%s_c_nested_cont(
  inda = atlas_prep_cluster_1
, pop_flag = SAFFL=''
, paramvar = SAFFL and PARAMCD='CHEMISTRY' and ANLFL1='Y')
, byvarlistin = PARAM()
, paramvar = PARAM
, trgrpn = TRTAN(N)
, popgrp = SAFFL(a.1_2_123
  ustgrp =`;

  const codeContent = docType === 'listing' ? listingCodeContent : programCodeContent;

  const codeLines = codeContent.split('\n');

  const toolbarButtons = (
    <>
      <TooltipText label="Save Code">
        <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label="Save">
          <LocalIcon src={saveIconUrl} className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />
        </button>
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
      <TooltipText label={isLocked ? "Unlock Table Code" : "Lock Table Code"}>
        <button
          onClick={onToggleLock}
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${isLocked ? "bg-az-secondary" : "hover:bg-black/5"}`}
          aria-label={isLocked ? "Unlock code" : "Lock code"}
        >
          {isLocked
            ? <LockTreeIcon className="h-[16px] w-[16px]" color="var(--color-brand-1)" />
            : <UnlockTreeIcon className="h-[16px] w-[16px]" color="var(--color-text-secondary)" />}
        </button>
      </TooltipText>
    </>
  );

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden bg-white">
      <PanelHeader
        title={<LocalIcon src={codeSlashIconUrl} className="w-[20px] h-[20px]" color="#888E8E" />}
        actions={toolbarButtons}
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-w-max min-h-full font-mono text-[13px] leading-[20px]">
          <div className="select-none bg-bg-light px-[8px] py-[16px] text-right text-[#999999] shrink-0">
            {codeLines.map((_, index) => <div key={index}>{index + 1}</div>)}
          </div>
          <pre className="px-[16px] py-[16px] text-text-primary">
            <code>{highlightSAS(codeContent)}</code>
          </pre>
        </div>
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
      ],
    },

  ]);
  const [selectedId, setSelectedId] = useState<string | null>('t1');
  const [currentEvent] = useState('CSR Interim Analysis');
  const [modalState, setModalState] = useState<{
    type: 'locked-by-parent' | null;
    programName?: string;
  }>({ type: null });
  const [shellPreviewOpen, setShellPreviewOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>('both');
  const [shellPreviewWidth, setShellPreviewWidth] = useState(560);
  const [metadataWidth, setMetadataWidth] = useState(380);
  const [aiCopilotWidth, setAiCopilotWidth] = useState(360);

  // Ref to measure content area for adaptive panel sizing
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);
  const [contentAreaHeight, setContentAreaHeight] = useState(0);

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
    shellPreview: { min: 320, max: 800 },
    metadata: panelView === 'shell'
      ? { min: 320, max: 640 }
      : { min: 280, max: 520 },
    code: { min: 360 },
    aiCopilot: { min: 300, max: 460 },
  };

  // Dynamic metadata max: can't exceed Shell width (no fixed deduction)
  const metadataMaxWidth = Math.min(constraints.metadata.max, shellPreviewWidth);

  // ── Dynamic panel max widths: prevent panels from pushing others off-screen ──
  const DIVIDER_W = 1;
  const tableDividerCount =
    (shellPreviewOpen && codeOpen ? 1 : 0) +
    (shellPreviewOpen && !codeOpen && aiCopilotOpen ? 1 : 0) +
    (codeOpen && aiCopilotOpen ? 1 : 0);

  // Shell can grow until Code (flex-1) hits its minimum
  const dynamicShellMax = contentAreaWidth > 0
    ? Math.max(constraints.shellPreview.min,
        contentAreaWidth
        - (codeOpen ? constraints.code.min : 0)
        - (aiCopilotOpen ? aiCopilotWidth : 0)
        - tableDividerCount * DIVIDER_W)
    : constraints.shellPreview.max;

  // AI can grow until Code (or Shell if flex-1) hits its minimum
  const dynamicAiMax = contentAreaWidth > 0
    ? Math.max(constraints.aiCopilot.min,
        contentAreaWidth
        - (codeOpen ? constraints.code.min : 0)
        - (shellPreviewOpen && codeOpen ? shellPreviewWidth : 0)
        - (shellPreviewOpen && !codeOpen ? constraints.shellPreview.min : 0)
        - tableDividerCount * DIVIDER_W)
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

  // Adaptive panel compression: when Code < min, compress panels in order meta → shell → tree → AI
  // Only runs on structural changes (content area resize, panel open/close), NOT on width changes from dragging
  useEffect(() => {
    if (contentAreaWidth === 0) return;
    if (!codeOpen) return; // Don't compress when Code panel isn't visible

    const shellW = shellPreviewOpen ? shellPreviewWidthRef.current : 0;
    const aiW = aiCopilotOpen ? aiCopilotWidthRef.current : 0;
    const codeMin = constraints.code.min;
    const dividerW = 1;
    const dividerCount =
      (shellPreviewOpen && codeOpen ? 1 : 0) +
      (shellPreviewOpen && !codeOpen && aiCopilotOpen ? 1 : 0) +
      (codeOpen && aiCopilotOpen ? 1 : 0);
    const totalDividers = dividerCount * dividerW;

    const availableForCode = contentAreaWidth - shellW - aiW - totalDividers;

    if (availableForCode < codeMin) {
      const deficit = codeMin - availableForCode;
      let remaining = deficit;

      // 1. Compress metadata (if open and above min)
      if (metadataOpen && remaining > 0) {
        const excess = metadataWidthRef.current - constraints.metadata.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setMetadataWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 2. Compress shell (if open and above min)
      if (shellPreviewOpen && remaining > 0) {
        const excess = shellPreviewWidthRef.current - constraints.shellPreview.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setShellPreviewWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 3. Compress tree (if open and above min)
      if (treeListOpen && remaining > 0) {
        const excess = treeListWidthRef.current - constraints.treeList.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setTreeListWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }

      // 4. Compress AI (if open and above min)
      if (aiCopilotOpen && remaining > 0) {
        const excess = aiCopilotWidthRef.current - constraints.aiCopilot.min;
        const reduce = Math.min(excess, remaining);
        if (reduce > 0) {
          setAiCopilotWidth((w) => w - reduce);
          remaining -= reduce;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentAreaWidth, shellPreviewOpen, codeOpen, aiCopilotOpen, metadataOpen]);

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
  const selectedTableProgram = programs.find((program) =>
    program.tables.some((table) => table.id === selectedId)
  );
  const selectedTableLocked = selectedTable?.status === 'locked';
  const handleCodePanelToggleLock = () => {
    if (selectedTableProgram && selectedTable) {
      handleToggleLock(selectedTableProgram.id, selectedTable.id);
    }
  };

  // Set default panel layout based on doc type (listing=vertical, table=horizontal)
  useEffect(() => {
    setPanelLayout(docType === 'listing' ? 'vertical' : 'horizontal');
  }, [docType]);

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
        (categoryFilter === "listing" && table.docType === "listing");
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

    if (isTableSelected(id)) {
      setShellPreviewOpen(true);
    } else {
      setShellPreviewOpen(false);
      setMetadataOpen(false);
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
    if (v === 'shell') {
      setShellPreviewOpen(true);
      setCodeOpen(false);
      setMetadataOpen(false);
    } else if (v === 'code') {
      setShellPreviewOpen(false);
      setMetadataOpen(false);
      setCodeOpen(true);
    } else {
      setShellPreviewOpen(true);
      setCodeOpen(true);
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-1 bg-bg-light">
      <div className="flex min-w-0 flex-1 overflow-hidden pl-[4px]">
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: treeListOpen ? `${treeListWidth}px` : "0px",
            opacity: treeListOpen ? 1 : 0,
            transition: isResizing ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          <div className="flex h-full w-full flex-col bg-bg-light">
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
              placeholder="Search"
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
            onPanelLayoutChange={setPanelLayout}
            docType={docType}
          />
          <div ref={contentAreaRef} className="relative flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
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
                      className={`overflow-hidden flex flex-col ${panelView === 'both' ? 'shrink-0' : ''} ${
                        panelLayout === 'vertical'
                          ? (panelView === 'both' ? 'border-b border-graphite-10' : '')
                          : (panelView === 'both' || aiCopilotOpen ? 'border-r border-graphite-10' : '')
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
                        onDrag={(delta) => setShellPreviewWidth((w) => clamp(w + delta, constraints.shellPreview.min, constraints.shellPreview.max))}
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
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, constraints.aiCopilot.max))}
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
                      panelWidth={aiCopilotWidth}
                      onClose={handleCloseAICopilot}
                      inputValue={aiInputValue}
                      onChangeInputValue={setAiInputValue}
                      focusTrigger={aiInputFocusTrigger}
                    />
                  )}
                </div>

                {!aiCopilotOpen && <FloatingAICopilotButton onClick={handleOpenAICopilot} />}
              </div>
            ) : (
              // Table Layout — supports both horizontal (default) and vertical panel layout
              <div className="flex h-full flex-1" style={{ minWidth: panelLayout === 'vertical' ? undefined : `${tableTotalMinWidth}px` }}>
                {/* Shell + Code area — direction depends on panelLayout */}
                <div className="flex min-w-0 flex-1 overflow-hidden" style={{ flexDirection: panelLayout === 'vertical' ? 'column' : 'row' }}>
                  {/* Shell Preview with subordinate Metadata card */}
                  {shellPreviewOpen && (
                    <div
                      className={`overflow-hidden ${panelView === 'shell' ? 'flex-1' : 'shrink-0'} ${
                        panelLayout === 'vertical'
                          ? (codeOpen ? 'border-b border-graphite-10' : '')
                          : (codeOpen || aiCopilotOpen ? 'border-r border-graphite-10' : '')
                      }`}
                      style={panelLayout === 'vertical'
                        ? { height: panelView === 'shell' ? undefined : `${shellHeight}px`, minHeight: '240px' }
                        : { width: panelView === 'shell' ? undefined : `${shellPreviewWidth}px` }
                      }
                    >
                      <ShellPreview
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
                        onDrag={(delta) => setShellPreviewWidth((width) => clamp(width + delta, constraints.shellPreview.min, Math.min(constraints.shellPreview.max, dynamicShellMax)))}
                      />
                    )
                  )}

                  {codeOpen && (
                    <div className="min-w-0 flex-1 overflow-hidden" style={panelLayout === 'vertical' ? { minHeight: '240px' } : undefined}>
                      <CodePanel selectedItem={getSelectedItemName()} isLocked={selectedTableLocked} onToggleLock={handleCodePanelToggleLock} />
                    </div>
                  )}
                </div>

                {/* Shell ↔ AI divider (when Shell is open, Code is closed, AI is open) */}
                {/* Adjusts AI width since Shell is flex-1 in this view */}
                {shellPreviewOpen && !codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider
                    onDragStart={() => setIsResizing(true)}
                    onDragEnd={() => setIsResizing(false)}
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, Math.min(constraints.aiCopilot.max, dynamicAiMax)))}
                  />
                )}

                {/* Code ↔ AI divider */}
                {codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider
                    onDragStart={() => setIsResizing(true)}
                    onDragEnd={() => setIsResizing(false)}
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, Math.min(constraints.aiCopilot.max, dynamicAiMax)))}
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
                  {aiCopilotOpen && <AICopilotPanel panelWidth={aiCopilotWidth} onClose={handleCloseAICopilot} />}
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
    errorMessage: 'Shell file parsing failed. Outputs cannot be generated until the issue is resolved.',
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
    errorMessage: 'SAS macro execution failed. Please verify the input dataset structure.',
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
        isClickable ? 'cursor-pointer hover:bg-bg-light' : 'cursor-default'
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
              <span className="t-small text-[#666666] text-left md:text-right max-w-[280px] sm:max-w-[400px] truncate block" title={event.errorMessage}>
                {event.errorMessage}
              </span>
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
                        className="w-full text-left px-[12px] py-[6px] t-small text-[#3C4242] hover:bg-[#F8F7F7] flex items-center gap-[8px]"
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
    <div className="flex h-screen w-full overflow-hidden bg-bg-light">
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
          <div className="flex h-full w-full flex-col bg-bg-light">
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
