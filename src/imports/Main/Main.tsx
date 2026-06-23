// AI Copilot Chat Window - Design Tokens & Visual Specs
import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import atlasLogoUrl from "../../icons/Atlas-Logo.svg";
import aiSubmitIconUrl from "../../icons/AI-submit.svg";
import checkIconUrl from "../../icons/check-line.svg";
import closeIconUrl from "../../icons/close-line.svg";
import codeIconUrl from "../../icons/code-line.svg";
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
import dashboardIconUrl from "../../icons/dashboard-3-line.svg";
import taskIconUrl from "../../icons/task-line.svg";
import stackIconUrl from "../../icons/stack-line.svg";
import capsuleIconUrl from "../../icons/capsule-line.svg";
import microscopeIconUrl from "../../icons/microscope-line.svg";
import teamIconUrl from "../../icons/team-line.svg";
import searchLineIconUrl from "../../icons/search-line.svg";
import filterIconUrl from "../../icons/filter-line.svg";
import addLineIconUrl from "../../icons/add-line.svg";
import barChartIconUrl from "../../icons/bar-chart-2-line.svg";
import downloadIconUrl from "../../icons/download-2-line.svg";

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
      className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#EBECEC] transition-colors shrink-0"
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
    <div className="bg-[#F4E8EE] inline-flex gap-[4px] h-[20px] items-center max-w-[152px] pl-[2px] pr-[6px] rounded-[4px]">
      <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <svg className="w-full h-full" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.3332 7.99992L10.6191 12.714L9.6763 11.7712L13.4476 7.99992L9.6763 4.2287L10.6191 3.28589L15.3332 7.99992ZM2.55212 7.99992L6.32336 11.7712L5.38055 12.714L0.666504 7.99992L5.38055 3.28589L6.32336 4.2287L2.55212 7.99992Z" fill="#830051"/>
        </svg>
      </div>
      <p className="t-small text-[#830051] truncate">
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
      className={`border-[0.6px] border-[#EBECEC] rounded-[4px] px-[12px] py-[8px] w-full transition-colors ${
        hovered ? 'bg-[#F8F7F7]' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-[4px] h-[30px]">
        <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
          <ToolCallIcon className="w-full h-full" color="#888E8E" />
        </div>
        <p className="t-body-compact text-[#3C4242]">
          {toolName}
        </p>
      </div>
      {children && (
        <div className="mt-[8px] t-body text-[#3C4242]">
          {children}
        </div>
      )}
    </div>
  );
}

function ErrorMessageWithRetry() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#F4E8EE] border-[0.6px] border-[#CC2C3C] rounded-[4px] px-[10px] py-[8px] w-full flex gap-[8px] items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[6px] h-[30px] mb-[2px]">
          <div className="w-[16px] h-[16px] shrink-0">
            <ErrorWarningIcon className="w-full h-full" color="#CC2C3C" />
          </div>
          <p className="t-body text-[#CC2C3C] font-semibold truncate">
            Error: Error reason summary
          </p>
        </div>

        {/* Collapsible details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-[4px] t-small text-[#CC2C3C] hover:underline active:scale-[0.98] mb-[2px]"
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
          <p className="t-small text-[#CC2C3C] break-words whitespace-pre-wrap leading-[18px]">
            Error reason details here. This section can contain very long error messages including stack traces, variable states, and other diagnostic information that helps identify the root cause of the failure.
          </p>
        )}
      </div>

      <button className="shrink-0 bg-white border-[0.6px] border-[#D8DADA] hover:bg-[#F8F7F7] px-[8px] py-[4px] rounded-[4px] transition-colors flex items-center gap-[4px]">
        <span className="t-small text-[#3C4242]">Retry</span>
      </button>
    </div>
  );
}

// ==================== Markdown Components ====================

function InlineHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#EBECEC] px-[4px] rounded-[4px] h-[20px] inline-flex items-center t-caption text-[#3C4242]">
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

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-[3px] border-[#D8DADA] bg-[#FAFAFA] pl-[12px] py-[8px] mb-[10px] rounded-r-[4px]">
      <div className="t-body text-[#3C4242]">
        {children}
      </div>
    </blockquote>
  );
}

function Divider() {
  return <div className="h-[0.5px] bg-[#D8DADA] w-full my-[12px]" />;
}

// ==================== Chat Conversation & Main Panel ====================

type Message = {
  type: 'user' | 'ai' | 'ask_user_result';
  content?: string;
  hasTag?: boolean;
  answers?: { q: string; a: string }[];
  isSkipped?: boolean;
};

function ChatConversation({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col w-full p-[10px] gap-[12px]">
      {messages.map((msg, i) => (
        <div key={i} className="flex flex-col w-full gap-[12px]">
          {msg.type === 'user' && (
            <div className="bg-[#F8F7F7] px-[10px] py-[8px] rounded-[8px] w-full flex flex-col gap-[4px]">
              {msg.hasTag && (
                <div className="flex">
                  <Tag>Table.14.1.1 (Lines 290-321)</Tag>
                </div>
              )}
              <div className="flex flex-col gap-[4px] t-body text-[#888E8E] font-normal">
                {msg.content?.split('\n').map((para, pIdx) => (
                  <p key={pIdx} className="font-normal">{para}</p>
                ))}
              </div>
            </div>
          )}
          
          {msg.type === 'ask_user_result' && (
            <div className="bg-[#F8F7F7] px-[10px] py-[8px] rounded-[8px] w-full">
              {msg.isSkipped ? (
                <p className="t-body text-[#888E8E] italic">Skipped question</p>
              ) : (
                <div className="flex flex-col gap-[4px]">
                  {msg.answers?.map((ans, idx) => (
                    <div key={idx} className="t-body text-[#888E8E]">
                      <p className="font-normal">Q: {truncateText(ans.q)}</p>
                      <p className="font-normal">A: {ans.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {msg.type === 'ai' && (
            <div className="flex flex-col gap-[12px] w-full">
              <div className="px-[10px]">
                <StatusLabel>Thinking...</StatusLabel>
              </div>
              
              {/* Markdown Render Container */}
              <div className="flex flex-col w-full px-[10px]">
                <h1 className="t-heading text-[#3C4242] mb-[10px]">Analysis Results Summary</h1>
                <p className="t-body text-[#3C4242] mb-[10px]">
                  Generated Kaplan-Meier survival plot for <InlineHighlight>OS (Overall Survival)</InlineHighlight> using the ITT population. 
                  Reference the <Hyperlink>Analysis Plan v1.2</Hyperlink> for further details.
                </p>
                
                <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded mb-2" />}>
                  <MarkdownTable />
                </Suspense>
                
                <p className="t-body text-[#3C4242] mb-[10px]">
                  Key observations from the data cohort:
                </p>
                <ul className="list-disc pl-[24px] mb-[10px] flex flex-col gap-[4px]">
                  <li className="t-body text-[#3C4242]">High survival rate in early stages.</li>
                  <li className="t-body text-[#3C4242]">Significant variance in treatment line 3.</li>
                </ul>

                <Blockquote>
                  "The integration of survival data confirms the hypothesis proposed in the preliminary report."
                </Blockquote>

                <Divider />

                <h3 className="t-heading text-[#3C4242] mb-[10px]">SAS Logic</h3>
                <div className="border-[0.6px] border-[#D8DADA] rounded-[4px] overflow-hidden mb-[10px]">
                  <pre className="bg-[#F8F7F7] px-[16px] py-[12px] overflow-x-auto">
                    <code className="t-code text-[#3C4242] whitespace-pre">
                      <span className="text-[#005CC5]">proc sql</span>;{'\n'}
                      {'  '}<span className="text-[#005CC5]">select</span> * <span className="text-[#005CC5]">from</span> itt_pop;{'\n'}
                      <span className="text-[#005CC5]">quit</span>;
                    </code>
                  </pre>
                </div>
              </div>

              {/* Other components (non-Markdown blocks) */}
              <ToolCallCard toolName="read_file" />
              <Suspense fallback={<div className="h-10 animate-pulse bg-gray-50 rounded" />}>
                <CodeDiffBlock />
              </Suspense>
              <ErrorMessageWithRetry />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AICopilotPanel({
  panelWidth,
  onClose,
  inputValue = "",
  onChangeInputValue = () => {},
  focusTrigger = 0,
}: {
  panelWidth: number;
  onClose: () => void;
  inputValue?: string;
  onChangeInputValue?: (v: string) => void;
  focusTrigger?: number;
}) {
  const [showAskUser, setShowAskUser] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'user', content: 'Generate comprehensive analysis with all components.', hasTag: true },
    { type: 'ai' }
  ]);

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

  const handleAskUserSubmit = (answers: { q: string; a: string }[]) => {
    setMessages(prev => [...prev, { type: 'ask_user_result', answers }]);
    setShowAskUser(false);
  };

  const handleAskUserSkip = () => {
    setMessages(prev => [...prev, { type: 'ask_user_result', isSkipped: true }]);
    setShowAskUser(false);
  };

  const handleSubmit = () => {
    if (!currentVal.trim()) return;
    setMessages(prev => [...prev, { type: 'user', content: currentVal }]);
    setCurrentVal("");
    // Also simulate an AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai' }]);
    }, 1000);
  };

  return (
    <div 
      className="flex flex-col h-full bg-white relative"
      style={{ width: panelWidth }}
    >
      {/* Header */}
      <div className="bg-white h-[40px] flex items-center justify-between px-[12px] border-b border-[#EBECEC]">
        <AtlasLogoIcon className="h-[16px] w-[16px]" color="#830051" />
        <button
          onClick={onClose}
          aria-label="Close AI Copilot"
          title="Close AI Copilot"
          className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0"
        >
          <CloseIcon className="w-[16px] h-[16px]" color="#888E8E" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <ChatConversation messages={messages} />
      </div>

      {/* Input Area */}
      <div className="relative p-[8px]">
        {showAskUser && (
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-50 rounded" />}>
            <AskUserComponent 
              onSubmit={handleAskUserSubmit} 
              onSkip={handleAskUserSkip}
              panelWidth={panelWidth}
            />
          </Suspense>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white border-[0.6px] border-[#D8DADA] flex items-center gap-[16px] px-[10px] py-[8px] rounded-[8px] h-[40px] shadow-sm"
        >
          <input
            ref={inputRef}
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 t-input text-[#3C4242] placeholder:text-[#B2B4B4] bg-transparent border-none outline-none"
          />
          <button
            type="submit"
            className="bg-[#830051] w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-[#6a0042] transition-colors"
          >
            <SubmitIcon className="w-[11px] h-[12px]" color="white" />
          </button>
        </form>
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
  return (
    <SvgIcon className="w-[16px] h-[16px]">
      <path d="M12 2L14.09 4.55L17 3L16 6.18L19 7L16.45 9.09L18 12L15.45 13.09L17 16L14 15.18L12 18L10 15.18L7 16L8.55 13.09L6 12L7.55 9.09L5 7L8 6.18L7 3L9.91 4.55L12 2ZM12 6L11 8.5H8.5L10.5 10.25L9.75 12.75L12 11.25L14.25 12.75L13.5 10.25L15.5 8.5H13L12 6Z" fill={color} />
    </SvgIcon>
  );
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
  "#3C4242": "brightness(0) saturate(100%) invert(22%) sepia(8%) saturate(525%) hue-rotate(131deg) brightness(92%) contrast(88%)",
  "#656969": "brightness(0) saturate(100%) invert(42%) sepia(6%) saturate(255%) hue-rotate(131deg) brightness(92%) contrast(87%)",
  "#888E8E": "brightness(0) saturate(100%) invert(58%) sepia(7%) saturate(174%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "#9DB0AC": "brightness(0) saturate(100%) invert(72%) sepia(10%) saturate(322%) hue-rotate(122deg) brightness(89%) contrast(84%)",
  "#B2B4B4": "brightness(0) saturate(100%) invert(75%) sepia(5%) saturate(100%) hue-rotate(131deg) brightness(94%) contrast(88%)",
  "#CC2C3C": "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(1782%) hue-rotate(336deg) brightness(89%) contrast(88%)",
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

function TooltipText({ label, children }: { label: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <span className="absolute left-1/2 top-full z-50 mt-[4px] -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-[#3C4242] px-[6px] py-[4px] t-small text-[#F8F7F7] shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
          {label}
        </span>
      )}
    </span>
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
            <h2 className="t-heading text-[#3C4242]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-[#EBECEC] active:scale-[0.96]"
            aria-label="Close"
          >
            <CloseIcon className="w-[16px] h-[16px]" color="#888E8E" />
          </button>
        </div>
        <div className="px-[24px] py-[20px]">
          <p className="t-body-secondary text-[#656969]">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-[12px] border-t border-[#E5E8E8] px-[24px] pb-[20px] pt-[21px]">
          <button
            onClick={onSecondary}
            className="h-[36px] rounded-[4px] border-[0.6px] border-[#D8DADA] bg-white px-[12px] t-body-secondary text-[#3C4242] hover:bg-[#F8F7F7] active:scale-[0.96]"
          >
            {secondaryLabel}
          </button>
          <button
            onClick={onPrimary}
            className="h-[36px] rounded-[4px] bg-[#830051] px-[12px] t-body-secondary text-white hover:bg-[#6D0043] active:scale-[0.96]"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type PanelView = 'shell' | 'both' | 'code';

const SPLIT_ICON_PATH = "M4.66699 1.33398H1.33398V10.667H5V12H1.33398C0.597712 12 0.000176632 11.4032 0 10.667V1.33398C0 0.597605 0.597605 0 1.33398 0H4.66699V1.33398ZM7.33398 12H6V0H7.33398V12ZM12 0C12.7361 0.000175088 13.3338 0.596888 13.334 1.33301V10.666C13.334 11.4023 12.7362 11.9998 12 12H8.33398V10.666H12V1.33301H8.33398V0H12Z";

function PanelViewToggle({
  value,
  onChange,
  docType = 'table',
}: {
  value: PanelView;
  onChange: (v: PanelView) => void;
  docType?: DocumentType;
}) {
  return (
    <div className="bg-[#F8F7F7] flex items-center rounded-[4px]">
      <button
        onClick={() => onChange('shell')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'shell' ? 'bg-white' : ''
        }`}
      >
        {value === 'shell' && (
          <div aria-hidden className="absolute border-[#D8DADA] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <p className={`t-small whitespace-nowrap ${value === 'shell' ? 'text-[#3C4242]' : 'text-[#888E8E]'}`}>
          {docType === 'listing' ? 'Preview' : 'Shell'}
        </p>
      </button>
      <button
        onClick={() => onChange('both')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'both' ? 'bg-white' : ''
        }`}
      >
        {value === 'both' && (
          <div aria-hidden className="absolute border-[#D8DADA] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <div className="relative shrink-0 size-[16px] flex items-center justify-center">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.334 12">
            <path d={SPLIT_ICON_PATH} fill={value === 'both' ? '#3C4242' : '#888E8E'} />
          </svg>
        </div>
      </button>
      <button
        onClick={() => onChange('code')}
        className={`flex gap-[2px] h-[20px] items-center justify-center px-[6px] relative rounded-[3px] shrink-0 transition-colors ${
          value === 'code' ? 'bg-white' : ''
        }`}
      >
        {value === 'code' && (
          <div aria-hidden className="absolute border-[#D8DADA] border-[0.6px] border-solid inset-0 pointer-events-none rounded-[3px]" />
        )}
        <p className={`t-small whitespace-nowrap ${value === 'code' ? 'text-[#3C4242]' : 'text-[#888E8E]'}`}>
          {docType === 'listing' ? 'Code' : 'Code'}
        </p>
      </button>
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
  docType = 'table',
}: {
  treeListOpen: boolean;
  onToggleTreeList: () => void;
  onNavigateHome: () => void;
  currentEvent: string;
  panelView: PanelView;
  onPanelViewChange: (v: PanelView) => void;
  docType?: DocumentType;
}) {
  const [activeView, setActiveView] = useState<ActiveView>('table');

  const viewTabs = docType === 'listing' ? (
    <button
      onClick={() => setActiveView('listing')}
      className="w-[120px] h-full flex items-center justify-center gap-[4px] px-[16px] relative active:scale-[0.96] bg-white"
    >
      <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
      <ListingTreeIcon color="#830051" />
      <p className="t-small font-medium text-[#830051]">Listing View</p>
    </button>
  ) : (
    <>
      <button
        onClick={() => setActiveView('table')}
        className={`w-[120px] h-full flex items-center justify-center gap-[4px] px-[16px] relative active:scale-[0.96] ${
          activeView === 'table' ? 'bg-white' : ''
        }`}
      >
        {activeView === 'table' && (
          <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
        )}
        <TableTreeIcon color={activeView === 'table' ? '#830051' : '#3C4242'} />
        <p className={`t-small font-medium ${activeView === 'table' ? 'text-[#830051]' : 'text-[#3C4242]'}`}>Table View</p>
      </button>
      <button
        onClick={() => setActiveView('group')}
        className={`w-[120px] h-full flex items-center justify-center gap-[4px] px-[16px] relative active:scale-[0.96] ${
          activeView === 'group' ? 'bg-white' : ''
        }`}
      >
        {activeView === 'group' && (
          <div aria-hidden className="absolute border-[#830051] border-b-2 border-solid inset-0 pointer-events-none" />
        )}
        <FolderIcon color={activeView === 'group' ? '#830051' : '#3C4242'} />
        <p className={`t-small font-medium ${activeView === 'group' ? 'text-[#830051]' : 'text-[#3C4242]'}`}>Group View</p>
      </button>
    </>
  );

  if (!treeListOpen) {
    // Collapsed: single row with study info + view tabs + panel toggle
    return (
      <div className="shrink-0 w-full bg-white">
        <div className="h-[48px] w-full border-b-[0.6px] border-[#d8dada] flex items-center px-[12px] justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0">
              <p className="t-small truncate font-medium text-[#3C4242]">AZE2001-301</p>
              <p className="truncate text-[10px] leading-[15px] text-[#888E8E]">{currentEvent}</p>
            </div>
            <TooltipText label="Expand tree list">
              <button
                onClick={onToggleTreeList}
                className="h-[24px] w-[24px] flex items-center justify-center hover:bg-black/5 rounded-[4px] active:scale-[0.96]"
                aria-label="Expand tree list"
              >
                <LocalIcon src={expandIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
              </button>
            </TooltipText>
          </div>
          <div className="flex items-stretch gap-[4px] h-full">{viewTabs}</div>
          <PanelViewToggle value={panelView} onChange={onPanelViewChange} docType={docType} />
        </div>
      </div>
    );
  }

  // Expanded: view tabs row only
  return (
    <div className="shrink-0 w-full bg-white">
      <div className="h-[48px] w-full border-b-[0.6px] border-[#d8dada] flex items-center bg-white relative">
        <div className="flex items-stretch justify-center flex-1 h-full">
          {viewTabs}
        </div>
        <div className="absolute right-[12px] top-[14px]">
          <PanelViewToggle value={panelView} onChange={onPanelViewChange} docType={docType} />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="h-[40px] w-full">
      <div className="flex h-full items-center gap-[4px] px-[8px] py-[4px]">
        <div className="flex-1 rounded-[6px] bg-[#EBECEC]">
          <div className="flex items-center justify-between px-[8px] py-[4px]">
            <div className="flex items-center gap-[6px]">
              <SearchIcon />
              <p className="t-small text-[#888E8E]">Search</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <LockTreeIcon color="#888E8E" />
          </button>
        </TooltipText>
      );
    }

    return (
      <TooltipText label="Unlock Code">
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
          <LockTreeIcon color="#888E8E" />
        </button>
      </TooltipText>
    );
  }

  if (isHovered && item.status === 'pending' && !isProgram) {
    return (
      <TooltipText label="Lock Code">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(program.id, isProgram ? undefined : itemId);
          }}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label="Lock code"
        >
          <UnlockTreeIcon color="#888E8E" />
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
        className={`relative h-[28px] w-full cursor-pointer transition-colors ${
          selectedId === program.id ? 'bg-[#F4E8EE]' : isProgramHovered ? 'bg-[#F8F7F7]' : ''
        }`}
        onClick={() => onSelect(program.id)}
        onMouseEnter={() => setHoveredId(program.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {selectedId === program.id && <div className="absolute inset-0 border-l-2 border-[#830051]" aria-hidden="true" />}
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
            <p className={`t-small min-w-0 flex-1 truncate ${isProgramLocked ? 'text-[#B2B4B4]' : 'text-[#3C4242]'}`}>
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
                className={`relative h-[28px] w-full cursor-pointer transition-colors ${
                  isTableSelected ? 'bg-[#F4E8EE]' : isTableHovered ? 'bg-[#F8F7F7]' : ''
                }`}
                onClick={() => onSelect(table.id)}
                onMouseEnter={() => setHoveredId(table.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isTableSelected && <div className="absolute inset-0 border-l-2 border-[#830051]" aria-hidden="true" />}
                <div className="flex h-full items-center justify-between pl-[24px] pr-[12px]">
                  <div className="flex h-[20px] min-w-0 flex-1 items-center gap-[4px]">
                    {table.docType === 'listing' ? (
                      <ListingTreeIcon color={isProgramLocked ? "#B2B4B4" : "#656969"} />
                    ) : (
                      <TableTreeIcon color={isProgramLocked ? "#B2B4B4" : "#656969"} />
                    )}
                    <p className={`t-small min-w-0 truncate ${isProgramLocked ? 'text-[#B2B4B4]' : 'text-[#3C4242]'}`}>
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

function WorkspaceDivider({ onDrag }: { onDrag: (delta: number) => void }) {
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
  }, [isDragging]);

  return (
    <div
      className="relative z-10 w-[1px] shrink-0 cursor-col-resize bg-transparent"
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        startXRef.current = event.clientX;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-y-0 -left-[3px] -right-[3px]" />
      {(isHovered || isDragging) && <div className="absolute inset-y-0 left-[-1px] w-[3px] bg-[#830051]" />}
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
    { id: "listing", label: "Listing", icon: <ListingTreeIcon color="#888E8E" /> },
    { id: "figure", label: "Figure", icon: <FigureTreeIcon color="#888E8E" /> },
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
                isSelected ? "bg-[#EBECEC]" : "hover:bg-[#EBECEC]"
              }`}
            >
              {category.icon}
              <p className="t-small whitespace-nowrap text-[#3C4242]">{category.label}</p>
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
  title: string;
  actions?: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div className={`flex h-[40px] w-full shrink-0 items-center justify-between bg-white px-[12px] ${noBorder ? '' : 'border-b border-[#D8DADA]'}`}>
      <p className="t-small truncate text-black">{title}</p>
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

function HorizontalWorkspaceDivider({ onDrag }: { onDrag: (delta: number) => void }) {
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
  }, [isDragging]);

  return (
    <div
      className="relative h-[3px] shrink-0 cursor-row-resize bg-transparent"
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        startYRef.current = event.clientY;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-x-0 -top-[3px] -bottom-[3px]" />
      {(isHovered || isDragging) && <div className="absolute inset-x-0 top-[-1px] h-[3px] bg-[#830051]" />}
    </div>
  );
}

const listingData = [
  { subject: "101-01", sex: "F", age: 54, race: "White", treatment: "Drug A 10mg", visit: "Baseline", studyDay: 1, lesionNo: "L1", lesionSite: "Liver", diameter: 12, response: "PR", method: "CT", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "101-01", sex: "F", age: 54, race: "White", treatment: "Drug A 10mg", visit: "Week 4", studyDay: 28, lesionNo: "L1", lesionSite: "Liver", diameter: 10, response: "PR", method: "CT", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "101-01", sex: "F", age: 54, race: "White", treatment: "Drug A 10mg", visit: "Week 8", studyDay: 56, lesionNo: "L1", lesionSite: "Liver", diameter: 8, response: "CR", method: "CT", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "101-02", sex: "M", age: 43, race: "Asian", treatment: "Drug A 10mg", visit: "Baseline", studyDay: 1, lesionNo: "L1", lesionSite: "Lung", diameter: 15, response: "SD", method: "CT", assessor: "Dr. Jones", status: "Confirmed" },
  { subject: "101-02", sex: "M", age: 43, race: "Asian", treatment: "Drug A 10mg", visit: "Week 4", studyDay: 29, lesionNo: "L1", lesionSite: "Lung", diameter: 14, response: "SD", method: "CT", assessor: "Dr. Jones", status: "Pending" },
  { subject: "101-02", sex: "M", age: 43, race: "Asian", treatment: "Drug A 10mg", visit: "Week 8", studyDay: 57, lesionNo: "L1", lesionSite: "Lung", diameter: 18, response: "PD", method: "CT", assessor: "Dr. Jones", status: "Confirmed" },
  { subject: "101-03", sex: "F", age: 67, race: "Black", treatment: "Placebo", visit: "Baseline", studyDay: 1, lesionNo: "L1", lesionSite: "Lymph Node", diameter: 22, response: "SD", method: "MRI", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "101-03", sex: "F", age: 67, race: "Black", treatment: "Placebo", visit: "Week 4", studyDay: 28, lesionNo: "L1", lesionSite: "Lymph Node", diameter: 24, response: "PD", method: "MRI", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "102-01", sex: "M", age: 58, race: "White", treatment: "Drug B 20mg", visit: "Baseline", studyDay: 1, lesionNo: "L1", lesionSite: "Liver", diameter: 19, response: "PR", method: "CT", assessor: "Dr. Jones", status: "Confirmed" },
  { subject: "102-01", sex: "M", age: 58, race: "White", treatment: "Drug B 20mg", visit: "Week 4", studyDay: 30, lesionNo: "L1", lesionSite: "Liver", diameter: 15, response: "PR", method: "CT", assessor: "Dr. Jones", status: "Confirmed" },
  { subject: "102-01", sex: "M", age: 58, race: "White", treatment: "Drug B 20mg", visit: "Week 8", studyDay: 60, lesionNo: "L1", lesionSite: "Liver", diameter: 11, response: "PR", method: "CT", assessor: "Dr. Jones", status: "Confirmed" },
  { subject: "102-02", sex: "F", age: 51, race: "White", treatment: "Drug B 20mg", visit: "Baseline", studyDay: 1, lesionNo: "L1", lesionSite: "Lung", diameter: 14, response: "SD", method: "CT", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "102-02", sex: "F", age: 51, race: "White", treatment: "Drug B 20mg", visit: "Week 4", studyDay: 28, lesionNo: "L1", lesionSite: "Lung", diameter: 13, response: "SD", method: "CT", assessor: "Dr. Smith", status: "Confirmed" },
  { subject: "102-02", sex: "F", age: 51, race: "White", treatment: "Drug B 20mg", visit: "Week 8", studyDay: 56, lesionNo: "L1", lesionSite: "Lung", diameter: 12, response: "PR", method: "CT", assessor: "Dr. Smith", status: "Confirmed" }
];

const listingColumns = [
  { key: "subject", label: "Subject", width: 90 },
  { key: "sex", label: "Sex", width: 60 },
  { key: "age", label: "Age", width: 60 },
  { key: "race", label: "Race", width: 100 },
  { key: "treatment", label: "Treatment", width: 110 },
  { key: "visit", label: "Visit", width: 100 },
  { key: "studyDay", label: "Study Day", width: 80 },
  { key: "lesionNo", label: "Lesion No", width: 90 },
  { key: "lesionSite", label: "Lesion Site", width: 110 },
  { key: "diameter", label: "Diameter (mm)", width: 110 },
  { key: "response", label: "Response", width: 90 },
  { key: "method", label: "Method", width: 80 },
  { key: "assessor", label: "Assessor", width: 100 },
  { key: "status", label: "Status", width: 90 },
];

const colGroups = {
  subject: "Demographic Info",
  sex: "Demographic Info",
  age: "Demographic Info",
  race: "Demographic Info",
  treatment: "Study Details",
  visit: "Study Details",
  studyDay: "Study Details",
  lesionNo: "Lesion Measurement",
  lesionSite: "Lesion Measurement",
  diameter: "Lesion Measurement",
  response: "Lesion Measurement",
  method: "Assessment Info",
  assessor: "Assessment Info",
  status: "Assessment Info",
};

interface ListingPreviewProps {
  frozenColumnCount: number;
  setFrozenColumnCount: (c: number) => void;
  pageDividerIndex: number;
  setPageDividerIndex: (c: number) => void;
  isPaginationMode: boolean;
  setIsPaginationMode: (m: boolean) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  onSync: () => void;
  isModified: boolean;
  listingName?: string;
  metadataOpen?: boolean;
  onMetadataClick?: () => void;
}

function ListingPreview({
  frozenColumnCount,
  setFrozenColumnCount,
  pageDividerIndex,
  setPageDividerIndex,
  isPaginationMode,
  setIsPaginationMode,
  currentPage,
  setCurrentPage,
  onSync,
  isModified,
  listingName,
  metadataOpen,
  onMetadataClick,
}: ListingPreviewProps) {
  const [hoveredColKey, setHoveredColKey] = useState<string | null>(null);
  const [showFreezeDropdown, setShowFreezeDropdown] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    colIndex: number;
  } | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Close context menu on window click
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const columnWidths = listingColumns.map((c) => c.width);
  const cumulativeWidths = columnWidths.reduce((acc, w, i) => {
    acc.push((acc[i - 1] || 0) + w);
    return acc;
  }, [] as number[]);

  // Frozen boundary positions
  const dividerLeft = frozenColumnCount === 0 ? 0 : cumulativeWidths[frozenColumnCount - 1];

  // Pagination parameters
  const F = frozenColumnCount;
  const S = Math.max(1, pageDividerIndex - F);
  const totalPages = Math.ceil((listingColumns.length - F) / S);

  // Clamp current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  // Construct actual columns rendered on screen
  const getRenderedColumns = () => {
    if (!isPaginationMode) {
      return listingColumns;
    }
    const start = F + (currentPage - 1) * S;
    const end = Math.min(listingColumns.length, start + S);
    
    const frozenCols = listingColumns.slice(0, F);
    const pageCols = listingColumns.slice(start, end);
    return [...frozenCols, ...pageCols];
  };

  const renderedCols = getRenderedColumns();
  const renderedColWidths = renderedCols.map((c) => c.width);
  const renderedColLefts = renderedColWidths.reduce((acc, w, i) => {
    acc.push((acc[i - 1] || 0) + w);
    return acc;
  }, [] as number[]);

  const getRenderedColLeft = (colIndex: number) => {
    return colIndex === 0 ? 0 : renderedColLefts[colIndex - 1];
  };

  const totalRenderedPageWidth = renderedColWidths.reduce((sum, w) => sum + w, 0);

  // Drag handlers
  const handleDividerDrag = (clientX: number) => {
    if (!tableContainerRef.current) return;
    const rect = tableContainerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left + tableContainerRef.current.scrollLeft;

    let closestColIndex = 0;
    let minDiff = Math.abs(relativeX - 0);

    for (let i = 0; i < columnWidths.length; i++) {
      const colRight = cumulativeWidths[i];
      const diff = Math.abs(relativeX - colRight);
      if (diff < minDiff) {
        minDiff = diff;
        closestColIndex = i + 1;
      }
    }

    const maxFreeze = Math.min(5, listingColumns.length - 2);
    const newCount = Math.min(maxFreeze, closestColIndex);
    setFrozenColumnCount(newCount);
  };

  const handlePageDividerDrag = (clientX: number) => {
    if (!tableContainerRef.current) return;
    const rect = tableContainerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;

    const frozenWidth = F === 0 ? 0 : cumulativeWidths[F - 1];
    const remainingX = relativeX - frozenWidth;

    let closestS = 1;
    let minDiff = Infinity;

    const maxS = listingColumns.length - F;
    for (let s = 1; s <= maxS; s++) {
      let widthOfS = 0;
      for (let j = 0; j < s; j++) {
        widthOfS += listingColumns[F + j].width;
      }
      const diff = Math.abs(remainingX - widthOfS);
      if (diff < minDiff) {
        minDiff = diff;
        closestS = s;
      }
    }

    setPageDividerIndex(F + closestS);
  };

  const handleContextMenu = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      colIndex,
    });
  };

  const spanningGroups = getSpanningGroups(renderedCols);

  function getSpanningGroups(cols: typeof listingColumns) {
    const groups: Array<{ label: string; span: number; startIndex: number }> = [];
    if (cols.length === 0) return groups;

    let currentGroup = colGroups[cols[0].key as keyof typeof colGroups];
    let currentSpan = 1;
    let startIndex = 0;

    for (let i = 1; i < cols.length; i++) {
      const groupName = colGroups[cols[i].key as keyof typeof colGroups];
      if (groupName === currentGroup) {
        currentSpan++;
      } else {
        groups.push({ label: currentGroup, span: currentSpan, startIndex });
        currentGroup = groupName;
        currentSpan = 1;
        startIndex = i;
      }
    }
    groups.push({ label: currentGroup, span: currentSpan, startIndex });
    return groups;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white relative">
      {/* Header - per Figma: "Listing name" + toolbar with icon buttons + metadata toggle */}
      <div className="flex h-[40px] w-full shrink-0 items-center justify-between border-b-[0.6px] border-[#D8DADA] bg-white px-[12px]">
        <p className="t-small truncate text-[#3C4242]">{listingName || "Listing name"}</p>
        <div className="flex items-center gap-[4px]">
          {/* Sync to Code in Header (Unsynced marker) */}
          {isModified && (
            <button
              onClick={onSync}
              className="flex h-[24px] items-center gap-[4px] rounded-[4px] bg-[#830051] text-white px-[8px] hover:bg-[#6D0043] active:scale-[0.96] mr-[4px]"
            >
              <SyncIcon color="white" />
              <span className="t-small font-semibold">Sync</span>
            </button>
          )}
  
          {/* Freeze Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFreezeDropdown((prev) => !prev)}
              className="flex h-[24px] items-center gap-[4px] rounded-[4px] border-[0.6px] border-[#D8DADA] bg-white px-[8px] hover:bg-[#F8F7F7] active:scale-[0.96]"
            >
              <FreezeIcon color="#888E8E" />
              <span className="t-small text-[#3C4242]">
                Freeze: {frozenColumnCount === 0 ? "None" : `${frozenColumnCount} Col${frozenColumnCount > 1 ? "s" : ""}`}
              </span>
            </button>
            {showFreezeDropdown && (
              <div className="absolute right-0 mt-[4px] bg-white border border-[#D8DADA] rounded-[4px] shadow-lg py-[4px] w-[150px] z-[60]">
                {[0, 1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setFrozenColumnCount(count);
                      setShowFreezeDropdown(false);
                    }}
                    className={`w-full text-left px-[12px] py-[6px] t-small text-[#3C4242] hover:bg-[#F8F7F7] ${
                      frozenColumnCount === count ? "font-bold text-[#830051]" : ""
                    }`}
                  >
                    {count === 0 ? "None" : `${count} Column${count > 1 ? "s" : ""}`}
                  </button>
                ))}
              </div>
            )}
          </div>
  
          {/* Pagination Mode Button */}
          <TooltipText label={isPaginationMode ? "Disable Pagination View" : "Enable Pagination View"}>
            <button
              onClick={() => setIsPaginationMode(!isPaginationMode)}
              className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
                isPaginationMode ? "bg-[#F4E8EE]" : "hover:bg-black/5"
              }`}
            >
              <PaginationIcon color={isPaginationMode ? "#830051" : "#888E8E"} />
            </button>
          </TooltipText>
  
          {/* Metadata toggle button - per Figma: selected state shows pink bg */}
          {onMetadataClick && (
            <TooltipText label="Metadata">
              <button
                onClick={onMetadataClick}
                className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
                  metadataOpen ? "bg-[#F4E8EE]" : "hover:bg-black/5"
                }`}
                aria-label="Toggle metadata"
              >
                <SvgIcon className="h-[16px] w-[16px]">
                  <path d="M6 3H15L19 7V21H6V3ZM14 5V8H17L14 5ZM8 5V19H17V10H12V5H8ZM9 12H16V13.5H9V12ZM9 15H16V16.5H9V15Z" fill={metadataOpen ? "#830051" : "#888E8E"} />
                </SvgIcon>
              </button>
            </TooltipText>
          )}
        </div>
      </div>

      {/* Main Table Scroll Area */}
      <div
        ref={tableContainerRef}
        className="min-h-0 flex-1 overflow-auto relative scrollbar-colored animate-fade-in"
      >
        <div style={{ width: `${totalRenderedPageWidth}px`, position: 'relative' }}>
          <table className="border-collapse select-none" style={{ tableLayout: 'fixed', width: `${totalRenderedPageWidth}px` }}>
            <colgroup>
              {renderedCols.map((col) => (
                <col key={col.key} style={{ width: `${col.width}px` }} />
              ))}
            </colgroup>
            
            {/* Table Header */}
            <thead>
              {/* Spanning Group Headers Row */}
              <tr className="bg-[#F8F7F7] border-b border-[#D8DADA]">
                {spanningGroups.map((group, groupIdx) => {
                  const isGroupSticky = group.startIndex < F;
                  const groupLeft = isGroupSticky ? getRenderedColLeft(group.startIndex) : undefined;
                  
                  return (
                    <th
                      key={`${group.label}-${groupIdx}`}
                      colSpan={group.span}
                      className="border-r border-[#EBECEC] text-left px-[8px] py-[6px] h-[30px]"
                      style={{
                        position: isGroupSticky ? 'sticky' : undefined,
                        left: isGroupSticky ? `${groupLeft}px` : undefined,
                        zIndex: isGroupSticky ? 25 : undefined,
                        backgroundColor: '#F8F7F7',
                      }}
                    >
                      <span className="text-[11px] font-bold text-[#888E8E] uppercase tracking-wider truncate block">
                        {group.label}
                      </span>
                    </th>
                  );
                })}
              </tr>

              {/* Individual Column Names Row */}
              <tr className="bg-[#F8F7F7] border-b border-[#D8DADA]">
                {renderedCols.map((col, colIdx) => {
                  const isColSticky = colIdx < F;
                  const colLeft = isColSticky ? getRenderedColLeft(colIdx) : undefined;
                  
                  return (
                    <th
                      key={col.key}
                      onMouseEnter={() => setHoveredColKey(col.key)}
                      onMouseLeave={() => setHoveredColKey(null)}
                      onContextMenu={(e) => handleContextMenu(e, colIdx)}
                      className="border-r border-[#EBECEC] text-left align-middle relative h-[32px] hover:bg-black/[0.02] cursor-pointer"
                      style={{
                        position: isColSticky ? 'sticky' : undefined,
                        left: isColSticky ? `${colLeft}px` : undefined,
                        zIndex: isColSticky ? 20 : undefined,
                        backgroundColor: '#F8F7F7',
                      }}
                    >
                      <div className="flex items-center justify-between w-full px-[8px] py-[4px] gap-[2px]">
                        <span className="t-small font-semibold text-[#3C4242] truncate block select-none">
                          {col.label}
                        </span>
                        
                        {(hoveredColKey === col.key || isColSticky) && (
                          <TooltipText label={isColSticky ? "Unfreeze Columns" : "Freeze up to here"}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isColSticky) {
                                  setFrozenColumnCount(colIdx);
                                } else {
                                  setFrozenColumnCount(colIdx + 1);
                                }
                              }}
                              className="h-[18px] w-[18px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.9] shrink-0"
                            >
                              <FreezeIcon color={isColSticky ? "#830051" : "#888E8E"} />
                            </button>
                          </TooltipText>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {listingData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-[#F8F7F7] transition-colors border-b border-[#EBECEC]">
                  {renderedCols.map((col, colIdx) => {
                    const isColSticky = colIdx < F;
                    const colLeft = isColSticky ? getRenderedColLeft(colIdx) : undefined;
                    const val = row[col.key as keyof typeof row];
                    
                    return (
                      <td
                        key={col.key}
                        className="px-[8px] py-[6px] t-table text-[#3C4242] border-r border-[#EBECEC] truncate whitespace-nowrap h-[28px]"
                        style={{
                          position: isColSticky ? 'sticky' : undefined,
                          left: isColSticky ? `${colLeft}px` : undefined,
                          zIndex: isColSticky ? 10 : undefined,
                          backgroundColor: isColSticky ? 'white' : undefined,
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 3px Solid Freeze Column Divider */}
          {F > 0 && !isPaginationMode && (
            <div
              style={{
                position: 'absolute',
                left: `${dividerLeft - 1.5}px`,
                top: 0,
                bottom: 0,
                width: '3px',
                cursor: 'col-resize',
                zIndex: 30,
              }}
              className="bg-[#D8DADA] hover:bg-[#830051] active:bg-[#830051] transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const delta = moveEvent.clientX - startX;
                  handleDividerDrag(startX + delta);
                };
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              title="Drag to adjust frozen columns"
            />
          )}

          {/* Draggable vertical page divider in Pagination view */}
          {isPaginationMode && (
            <div
              style={{
                position: 'absolute',
                left: `${totalRenderedPageWidth - 1.5}px`,
                top: 0,
                bottom: 0,
                width: '3px',
                cursor: 'col-resize',
                zIndex: 30,
              }}
              className="border-l-2 border-dashed border-[#888E8E] hover:border-[#830051] active:border-[#830051]"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const delta = moveEvent.clientX - startX;
                  handlePageDividerDrag(startX + delta);
                };
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              title="Drag to change page columns size"
            />
          )}
        </div>
      </div>

      {/* Floating Sync to Code Panel at bottom */}
      {isModified && (
        <div className="absolute bottom-[56px] left-1/2 -translate-x-1/2 z-40 bg-white border border-[#D8DADA] rounded-[8px] px-[16px] py-[8px] shadow-xl flex items-center gap-[12px] animate-slide-in-up">
          <span className="t-small text-[#3C4242] font-medium">Unsynced listing changes</span>
          <button
            onClick={onSync}
            className="flex h-[28px] items-center gap-[6px] rounded-[6px] bg-[#830051] text-white px-[12px] hover:bg-[#6D0043] active:scale-[0.96] shadow-sm"
          >
            <SyncIcon color="white" />
            <span className="t-small font-semibold">Sync to Code</span>
          </button>
        </div>
      )}

      {/* Pagination Controls Bar */}
      {isPaginationMode && (
        <div className="h-[40px] shrink-0 border-t border-[#D8DADA] bg-[#F8F8F8] flex items-center justify-between px-[16px]">
          <span className="t-small text-[#888E8E]">
            Page displays {F} frozen + {S} active = {renderedCols.length} columns. (Total {listingColumns.length})
          </span>
          <div className="flex items-center gap-[8px]">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="h-[24px] w-[24px] rounded-[4px] hover:bg-black/5 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none active:scale-[0.9]"
            >
              <ChevronLeftIcon />
            </button>
            <span className="t-small font-medium text-[#3C4242]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="h-[24px] w-[24px] rounded-[4px] hover:bg-black/5 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none active:scale-[0.9]"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}

      {/* Right-click column context menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x, position: 'fixed', zIndex: 100 }}
          className="bg-white border border-[#D8DADA] rounded-[4px] shadow-lg py-[4px] w-[180px]"
        >
          <button
            onClick={() => {
              const isFrozen = contextMenu.colIndex < F;
              if (isFrozen) {
                setFrozenColumnCount(contextMenu.colIndex);
              } else {
                setFrozenColumnCount(contextMenu.colIndex + 1);
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-[12px] py-[6px] t-small text-[#3C4242] hover:bg-[#F8F7F7] flex items-center gap-[6px]"
          >
            <FreezeIcon color="#888E8E" />
            {contextMenu.colIndex < F ? "Unfreeze columns" : "Freeze up to this column"}
          </button>
        </div>
      )}
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
        title="Shell preview"
        noBorder
        actions={
          <TooltipText label="Metadata">
            <button
              onClick={onMetadataClick}
              className={`flex h-[24px] w-[24px] items-center justify-center rounded-[4px] active:scale-[0.96] ${
                metadataOpen ? "bg-[#F4E8EE]" : "hover:bg-black/5"
              }`}
              aria-label="Toggle metadata"
            >
              <SvgIcon className="h-[16px] w-[16px]">
                <path d="M6 3H15L19 7V21H6V3ZM14 5V8H17L14 5ZM8 5V19H17V10H12V5H8ZM9 12H16V13.5H9V12ZM9 15H16V16.5H9V15Z" fill={metadataOpen ? "#830051" : "#888E8E"} />
              </SvgIcon>
            </button>
          </TooltipText>
        }
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-[16px]">
          {/* Shell preview table */}
          <div className="mb-[12px]">
            <p className="t-small font-semibold text-[#3C4242] mb-[2px]">{shellData.tableNumber}. {shellData.tableTitle}</p>
            <p className="t-small text-[#888E8E]">{shellData.population}</p>
          </div>
          <div className="overflow-x-auto border-[0.6px] border-[#D8DADA] rounded-[4px]">
            <table className="w-full border-collapse">
              {/* Column group header */}
              <thead>
                <tr className="border-b-[0.5px] border-[#D8DADA] bg-[#F8F7F7]">
                  <th className="sticky left-0 z-10 bg-[#F8F7F7] text-left t-table font-semibold py-[6px] px-[8px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA] min-w-[180px]">
                    {selectedItemName.startsWith('Listing') ? 'Subject ID' : 'Parameter'}
                  </th>
                  {shellData.columnGroups.map((group, gi) => (
                    <th
                      key={gi}
                      colSpan={group.span}
                      className="text-center t-table font-semibold py-[6px] px-[8px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA]"
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {group.name}
                    </th>
                  ))}
                </tr>
                {/* Sub-column header */}
                <tr className="border-b-[0.5px] border-[#D8DADA] bg-[#F8F7F7]">
                  <th className="sticky left-0 z-10 bg-[#F8F7F7] text-left t-small font-medium py-[4px] px-[8px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA]">
                    
                  </th>
                  {shellData.columns.map((col, ci) => (
                    <th
                      key={ci}
                      className="text-center t-small font-medium py-[4px] px-[6px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA] last:border-r-0"
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
                    className={`border-b-[0.5px] border-[#D8DADA] last:border-0 ${row.isHeader ? 'bg-[#F8F7F7]' : 'bg-white'} hover:bg-[#F4E8EE] cursor-pointer`}
                    onClick={onBlockClick}
                  >
                    <td
                      className={`sticky left-0 z-10 ${row.isHeader ? 'bg-[#F8F7F7]' : 'bg-white'} text-left t-table py-[6px] px-[8px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA] ${row.isHeader ? 'font-semibold text-[#3C4242]' : 'text-[#3C4242]'}`}
                      style={{ paddingLeft: row.indent ? `${8 + row.indent * 16}px` : '8px' }}
                    >
                      {row.category}
                    </td>
                    {row.values.map((val, vi) => (
                      <td
                        key={vi}
                        className={`text-center t-table py-[6px] px-[6px] whitespace-nowrap border-r-[0.5px] border-[#D8DADA] last:border-r-0 ${row.isHeader ? 'font-semibold' : ''}`}
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
            <div className="h-[6px] w-[6px] rounded-full bg-[#830051]" />
            <p className="t-small text-[#888E8E]">Shell preview — data shown is illustrative structure. Click a row to view metadata.</p>
          </div>
        </div>
        {/* Metadata left-edge drag handle — uses WorkspaceDivider pattern */}
        {metadataOpen && (
          <WorkspaceDivider onDrag={(delta) => onMetadataResize(-delta)} />
        )}
        <div
          className="shrink-0 overflow-hidden py-[4px] pr-[4px]"
          style={{
            width: metadataOpen ? `${metadataWidth}px` : "0px",
            opacity: metadataOpen ? 1 : 0,
            transition: metadataOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          {metadataOpen && (
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-[#EBECEC] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <MetadataPanel onClose={onMetadataClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FieldStatus = "unconfirmed" | "confirmed" | "edited";

interface MetadataField {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
}

interface MetadataBlock {
  id: string;
  fields: MetadataField[];
}

function MetadataPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"basic" | "blocks">("basic");
  const [blocks, setBlocks] = useState<MetadataBlock[]>([
    {
      id: "block1",
      fields: [
        { id: "f1", label: "Input Dataset(s)", value: "ADSL", status: "unconfirmed" },
        { id: "f2", label: "Program Name", value: "t_dm", status: "unconfirmed" },
        { id: "f3", label: "Output Dataset", value: "ADEFF", status: "unconfirmed" },
        { id: "f4", label: "Population", value: "Safety", status: "unconfirmed" },
      ],
    },
  ]);

  const totalFields = blocks.reduce((sum, block) => sum + block.fields.length, 0);
  const confirmedCount = blocks.reduce(
    (sum, block) => sum + block.fields.filter((f) => f.status === "confirmed").length, 0
  );
  const hasAnyEdits = blocks.some((block) => block.fields.some((f) => f.status === "edited"));
  const confirmableFields = blocks.reduce(
    (sum, block) => sum + block.fields.filter((f) => f.status !== "edited").length, 0
  );
  const selectAllState: "empty" | "indeterminate" | "checked" =
    confirmedCount === 0 ? "empty" : confirmedCount === confirmableFields ? "checked" : "indeterminate";

  const handleConfirm = (blockId: string, fieldId: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, fields: block.fields.map((field) =>
              field.id === fieldId
                ? { ...field, status: field.status === "confirmed" ? "unconfirmed" as FieldStatus : "confirmed" as FieldStatus }
                : field
            )}
          : block
      )
    );
  };

  const handleSelectAll = () => {
    const shouldConfirmAll = selectAllState === "empty" || selectAllState === "indeterminate";
    setBlocks((prev) =>
      prev.map((block) => ({
        ...block,
        fields: block.fields.map((field) => {
          if (field.status === "edited") return field;
          return { ...field, status: shouldConfirmAll ? "confirmed" as FieldStatus : "unconfirmed" as FieldStatus };
        }),
      }))
    );
  };

  const handleFieldEdit = (blockId: string, fieldId: string, newValue: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, fields: block.fields.map((field) =>
              field.id === fieldId ? { ...field, value: newValue, status: "edited" as FieldStatus } : field
            )}
          : block
      )
    );
  };

  const handleUpdateCode = () => {
    setBlocks((prev) =>
      prev.map((block) => ({
        ...block,
        fields: block.fields.map((field) =>
          field.status === "edited" ? { ...field, status: "unconfirmed" as FieldStatus } : field
        ),
      }))
    );
  };

  const getFieldStyles = (status: FieldStatus) => {
    switch (status) {
      case "unconfirmed":
        return { containerBg: "bg-white", containerBorder: "border-transparent", inputBorder: "border-[#999]", checkboxColor: "#888E8E", showDropdown: true, isChecked: false };
      case "edited":
        return { containerBg: "bg-[#FCEECC]", containerBorder: "border-[#F0AB00]", inputBorder: "border-transparent", checkboxColor: "#F0AB00", showDropdown: false, isChecked: true };
      case "confirmed":
        return { containerBg: "bg-[#F3F7CC]", containerBorder: "border-[#C4D600]", inputBorder: "border-transparent", checkboxColor: "#1E7E34", showDropdown: false, isChecked: true };
    }
  };

  const selectAllCheckboxIcon = () => {
    if (selectAllState === "checked") return <><rect width="20" height="20" rx="1" fill="#830051" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
    if (selectAllState === "indeterminate") return <><rect width="20" height="20" rx="1" fill="#830051" /><rect x="5" y="9" width="10" height="2" fill="white" /></>;
    return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 20 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
  };

  const fieldCheckboxIcon = (status: FieldStatus) => {
    if (status === "unconfirmed") return <path d="M18.8887 0C19.5023 0 20 0.497684 20 1.11133V18.8887C20 19.5023 19.5023 20 18.8887 20H1.11133C0.497684 20 0 19.5023 0 18.8887V1.11133C0 0.497684 0.497684 0 1.11133 0H18.8887ZM1.2998 1.2998V18.7002H18.7002V1.2998H1.2998Z" fill="#888E8E" />;
    if (status === "edited") return <><rect width="20" height="20" rx="1" fill="#D8DADA" /><path d="M15.3135 7.41406L9.65625 13.0703L9.65723 13.0713L8.24219 14.4854L6.82812 13.0713V13.0703L4 10.2422L5.41406 8.82812L8.24219 11.6562L13.8994 6L15.3135 7.41406Z" fill="white" /></>;
    return <><rect width="20" height="20" rx="1" fill="#830051" /><path d="M15.6567 7.58563L9.99951 13.2419L10.0005 13.2429L8.58545 14.6569L7.17139 13.2429V13.2419L4.34326 10.4138L5.75732 8.99969L8.58545 11.8278L14.2427 6.17157L15.6567 7.58563Z" fill="white" /></>;
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="flex h-[40px] shrink-0 items-center justify-between border-b border-[#D8DADA] bg-white">
        <div className="flex h-full items-center">
          {(["basic", "blocks"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-full items-center justify-center border-b-2 px-[16px] active:scale-[0.96] ${
                activeTab === tab ? "border-[#830051]" : "border-transparent"
              }`}
            >
              <p className={`t-small font-medium ${activeTab === tab ? "text-[#830051]" : "text-[#3C4242]"}`}>
                {tab === "basic" ? "Basic info" : "Blocks"}
              </p>
            </button>
          ))}
        </div>
        <div className="flex items-center pr-[12px] gap-[4px]">
          <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label="Batch edit">
            <LocalIcon src={batchMicroIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-end bg-[#F8F7F7] px-[12px] py-[8px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={handleSelectAll} className="flex h-[16px] w-[16px] items-center justify-center hover:bg-black/5 active:scale-[0.96]" aria-label="Select all">
            <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{selectAllCheckboxIcon()}</SvgIcon>
          </button>
          <p className="t-small text-[#3C4242]">{confirmedCount}/{totalFields} confirmed</p>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto p-[4px]">
        {activeTab === "basic" && (
          <div className="flex flex-col gap-[4px]">
            {blocks.map((block) =>
              block.fields.map((field) => {
                const styles = getFieldStyles(field.status);
                return (
                  <div key={field.id} className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}>
                    <div className="flex flex-col gap-[4px] p-[8px]">
                      <div className="flex h-[20px] items-center justify-between">
                        <p className="t-small text-[#3C4242]">{field.label}</p>
                        <button onClick={() => handleConfirm(block.id, field.id)} className="flex h-[16px] w-[16px] items-center justify-center hover:bg-black/5 active:scale-[0.96]" aria-label={field.status === "confirmed" ? "Unconfirm" : "Confirm"}>
                          <SvgIcon className="h-[16px] w-[16px]" viewBox="0 0 20 20">{fieldCheckboxIcon(field.status)}</SvgIcon>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleFieldEdit(block.id, field.id, e.target.value)}
                          className={`w-full min-h-[32px] px-[8px] py-[4px] bg-white rounded-[2px] border ${styles.inputBorder} t-small text-[#3C4242] outline-none focus:outline-none`}
                        />
                        {styles.showDropdown && (
                          <div className="absolute right-[8px] top-[8px] pointer-events-none">
                            <SvgIcon className="h-[16px] w-[16px]">
                              <path d="M9.29 6.71C8.9 6.32 8.9 5.68 9.29 5.29C9.68 4.9 10.32 4.9 10.71 5.29L16.71 11.29C17.1 11.68 17.1 12.32 16.71 12.71L10.71 18.71C10.32 19.1 9.68 19.1 9.29 18.71C8.9 18.32 8.9 17.68 9.29 17.29L14.59 12L9.29 6.71Z" fill="#999" />
                            </SvgIcon>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {activeTab === "blocks" && (
          <div className="flex flex-col gap-[8px] p-[4px]">
            <p className="t-small text-[#656969]">Block information will appear here</p>
          </div>
        )}
      </div>

      {/* Update Code Button */}
      {hasAnyEdits && (
        <div className="border-t border-[#D8DADA] p-[12px]">
          <button
            onClick={handleUpdateCode}
            className="flex h-[32px] w-full items-center justify-center gap-[4px] rounded-[4px] bg-[#830051] px-[12px] t-small font-medium text-white hover:bg-[#6D0043] active:scale-[0.98]"
          >
            <SvgIcon className="h-[16px] w-[16px]">
              <path d="M13 3C8.58 3 5 6.58 5 11H2.5L6 14.5L9.5 11H7C7 7.69 9.69 5 13 5C16.31 5 19 7.69 19 11C19 14.31 16.31 17 13 17C11.34 17 9.84 16.33 8.75 15.24L7.34 16.65C8.79 18.1 10.79 19 13 19C17.42 19 21 15.42 21 11C21 6.58 17.42 3 13 3ZM12 7V12L16.2 14.5L17 13.2L13.5 11.1V7H12Z" fill="white" />
            </SvgIcon>
            Add Changes to Chat
          </button>
        </div>
      )}
    </div>
  );
}

function CodePanel({
  selectedItem,
  docType,
  freezeCols,
  pageCols,
}: {
  selectedItem: string;
  docType?: DocumentType;
  freezeCols?: number;
  pageCols?: number;
}) {
  const [activeCodeTab, setActiveCodeTab] = useState<'listing' | 'program'>('listing');
  const [codeLocked, setCodeLocked] = useState(false);

  const listingCodeContent = `%s_listing(
  inda = adsl
, cols = USUBJID SUBJID SITEID AGE SEX RACE TRT01A VISIT ASTDY AEDECOD
, freeze_cols = ${freezeCols ?? 2}
, page_cols = ${pageCols ?? 5}
, page_num = 1
);`;

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

  const codeContent = docType === 'listing'
    ? (activeCodeTab === 'listing' ? listingCodeContent : programCodeContent)
    : programCodeContent;

  const codeLines = codeContent.split('\n');

  const toolbarButtons = (
    <>
      <TooltipText label="Save">
        <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label="Save">
          <LocalIcon src={saveIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
        </button>
      </TooltipText>
      {[
        { label: "Copy", icon: copyIconUrl },
        { label: "History", icon: historyIconUrl },
      ].map(({ label, icon }) => (
        <TooltipText key={label} label={label}>
          <button className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]" aria-label={label}>
            <LocalIcon src={icon} className="h-[16px] w-[16px]" color="#888E8E" />
          </button>
        </TooltipText>
      ))}
      <TooltipText label={codeLocked ? "Unlock Code" : "Lock Code"}>
        <button
          onClick={() => setCodeLocked((v) => !v)}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
          aria-label={codeLocked ? "Unlock code" : "Lock code"}
        >
          {codeLocked
            ? <LockTreeIcon className="h-[16px] w-[16px]" color="#888E8E" />
            : <UnlockTreeIcon className="h-[16px] w-[16px]" color="#888E8E" />}
        </button>
      </TooltipText>
    </>
  );

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden bg-white">
      {docType === 'listing' ? (
        /* Per Figma: Tab switch with "Listing Code" / "Program Code" + toolbar */
        <div className="flex h-[40px] w-full shrink-0 items-center justify-between border-b-[0.6px] border-[#D8DADA] bg-white pl-[8px] pr-[16px]">
          <div className="flex h-full items-stretch gap-[4px]">
            <button
              onClick={() => setActiveCodeTab('listing')}
              className={`flex h-full items-center gap-[4px] px-[8px] py-[2px] relative ${
                activeCodeTab === 'listing' ? '' : ''
              }`}
            >
              {activeCodeTab === 'listing' && (
                <div aria-hidden className="absolute bottom-0 left-0 right-0 border-b-2 border-[#830051]" />
              )}
              <SvgIcon className="h-[16px] w-[16px]">
                <path d="M16 4H2v16h14V4zm-2 2v12H4V6h10z" fill={activeCodeTab === 'listing' ? '#830051' : '#888E8E'} />
                <path d="M7 8h6v2H7V8zm0 4h6v2H7v-2z" fill={activeCodeTab === 'listing' ? '#830051' : '#888E8E'} />
              </SvgIcon>
              <span className={`t-small font-medium ${activeCodeTab === 'listing' ? 'text-[#830051]' : 'text-[#888E8E]'}`}>Listing Code</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('program')}
              className={`flex h-full items-center gap-[4px] px-[8px] py-[2px] relative ${
                activeCodeTab === 'program' ? '' : ''
              }`}
            >
              {activeCodeTab === 'program' && (
                <div aria-hidden className="absolute bottom-0 left-0 right-0 border-b-2 border-[#830051]" />
              )}
              <span className={`t-small font-medium ${activeCodeTab === 'program' ? 'text-[#830051]' : 'text-[#888E8E]'}`}>Program Code</span>
            </button>
          </div>
          <div className="flex items-center gap-[4px]">
            {toolbarButtons}
          </div>
        </div>
      ) : (
        <PanelHeader
          title={selectedItem || "Code"}
          actions={toolbarButtons}
        />
      )}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-w-max font-mono text-[13px] leading-[20px]">
          <div className="select-none bg-[#F8F7F7] px-[8px] py-[16px] text-right text-[#999999] shrink-0">
            {codeLines.map((_, index) => <div key={index}>{index + 1}</div>)}
          </div>
          <pre className="px-[16px] py-[16px] text-[#3C4242]">
            <code>{codeContent}</code>
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
      className="group absolute bottom-[24px] right-[24px] z-50 flex h-[40px] items-center justify-center overflow-hidden rounded-full bg-[#830051] shadow-[0px_2px_3px_rgba(0,0,0,0.05),0px_4px_8px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-[0.96] disabled:pointer-events-none disabled:bg-[#D8DADA]"
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

function WorkspaceContent({ onNavigateHome }: { onNavigateHome: () => void }) {
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
  const [treeListOpen, setTreeListOpen] = useState(true);
  const [shellPreviewOpen, setShellPreviewOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>('both');
  const [treeListWidth, setTreeListWidth] = useState(240);
  const [shellPreviewWidth, setShellPreviewWidth] = useState(560);
  const [metadataWidth, setMetadataWidth] = useState(320);
  const [aiCopilotWidth, setAiCopilotWidth] = useState(360);

  // Ref to measure content area for adaptive panel sizing
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);

  // Refs for panel widths — used by compression effect to read latest values without re-running on width changes
  const metadataWidthRef = useRef(metadataWidth);
  metadataWidthRef.current = metadataWidth;
  const shellPreviewWidthRef = useRef(shellPreviewWidth);
  shellPreviewWidthRef.current = shellPreviewWidth;
  const aiCopilotWidthRef = useRef(aiCopilotWidth);
  aiCopilotWidthRef.current = aiCopilotWidth;
  const treeListWidthRef = useRef(treeListWidth);
  treeListWidthRef.current = treeListWidth;

  // Listing view specific states
  const [listingHeight, setListingHeight] = useState(380);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "table" | "listing" | "figure">("all");
  const [frozenColumnCount, setFrozenColumnCount] = useState(2);
  const [pageDividerIndex, setPageDividerIndex] = useState(5);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedFreezeCols, setSavedFreezeCols] = useState(2);
  const [savedPageCols, setSavedPageCols] = useState(5);
  const [aiInputValue, setAiInputValue] = useState("");
  const [aiInputFocusTrigger, setAiInputFocusTrigger] = useState(0);

  const constraints = {
    treeList: { min: 180, max: 320 },
    shellPreview: { min: 320, max: 800 },
    metadata: { min: 280, max: 520 },
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
  }, [shellPreviewWidth]);

  // Measure content area width via ResizeObserver
  useEffect(() => {
    if (!contentAreaRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContentAreaWidth(entries[0].contentRect.width);
    });
    observer.observe(contentAreaRef.current);
    return () => observer.disconnect();
  }, []);

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

  const isModified = frozenColumnCount !== savedFreezeCols || pageDividerIndex !== savedPageCols;

  const handleSyncToCode = () => {
    const diffText = `Please update the SAS macro call parameters for listing configuration:

\`\`\`diff
  %s_listing(
    inda = adsl
  , cols = USUBJID SUBJID SITEID AGE SEX RACE TRT01A VISIT ASTDY AEDECOD
- , freeze_cols = ${savedFreezeCols}
- , page_cols = ${savedPageCols}
+ , freeze_cols = ${frozenColumnCount}
+ , page_cols = ${pageDividerIndex}
  , page_num = 1
  );
\`\`\``;
    setAiInputValue(diffText);
    setAiCopilotOpen(true);
    setAiInputFocusTrigger(prev => prev + 1);
    setSavedFreezeCols(frozenColumnCount);
    setSavedPageCols(pageDividerIndex);
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

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

  const filteredPrograms = programs.map((program) => {
    const filteredTables = program.tables.filter((table) => {
      if (categoryFilter === "all") return true;
      if (categoryFilter === "table") return table.docType === "table" || !table.docType;
      if (categoryFilter === "listing") return table.docType === "listing";
      return false;
    });
    return { ...program, tables: filteredTables };
  });

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
      setAiCopilotOpen(false);
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
    <div className="flex h-full min-w-0 flex-1 bg-[#F8F7F7]">
      <div className="flex min-w-0 flex-1 overflow-hidden pl-[4px]">
        <div
          className="shrink-0 overflow-hidden"
          style={{
            width: treeListOpen ? `${treeListWidth}px` : "0px",
            opacity: treeListOpen ? 1 : 0,
            transition: treeListOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
        >
          <div className="flex h-full w-full flex-col bg-[#F8F7F7]">
            <div className="flex h-[48px] shrink-0 items-center gap-[8px] px-[10px]">
              <button
                onClick={onNavigateHome}
                className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                aria-label="Go to Home"
              >
                <AtlasLogoIcon />
              </button>
              <div className="min-w-0 flex-1">
                <p className="t-small truncate font-medium text-[#3C4242]">AZE2001-301</p>
                <p className="truncate text-[10px] leading-[15px] text-[#888E8E]">{currentEvent}</p>
              </div>
              <TooltipText label="Study information">
                <button
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Study information"
                >
                  <InfoIcon />
                </button>
              </TooltipText>
              <TooltipText label="Collapse tree list">
                <button
                  onClick={() => setTreeListOpen(false)}
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                  aria-label="Collapse tree list"
                >
                  <LocalIcon src={collapseIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
                </button>
              </TooltipText>
            </div>
            <SearchBar />
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex flex-col gap-[12px] py-[8px]">
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
          </div>
        </div>

        {/* TreeList ↔ Main panel divider */}
        {treeListOpen && (
          <WorkspaceDivider
            onDrag={(delta) => setTreeListWidth((width) => clamp(width + delta, constraints.treeList.min, constraints.treeList.max))}
          />
        )}

        <div className={`flex min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#EBECEC] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] my-[4px] mr-[4px] ${!treeListOpen ? "ml-[4px]" : ""}`}>
          <ViewToggleBar
            treeListOpen={treeListOpen}
            onToggleTreeList={() => setTreeListOpen(true)}
            onNavigateHome={onNavigateHome}
            currentEvent={currentEvent}
            panelView={panelView}
            onPanelViewChange={handlePanelViewChange}
            docType={docType}
          />
          <div ref={contentAreaRef} className="relative flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
            {docType === 'listing' ? (
              // Listing layout!
              <div className="flex min-w-0 flex-1 flex-row overflow-hidden">
                {/* Listing + Code vertical stack */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  {panelView !== 'code' && (
                    <div
                      style={{
                        height: panelView === 'shell' ? '100%' : `${listingHeight}px`,
                        minHeight: '150px',
                      }}
                      className="w-full shrink-0 overflow-hidden flex flex-col"
                    >
                      <ListingPreview
                        frozenColumnCount={frozenColumnCount}
                        setFrozenColumnCount={setFrozenColumnCount}
                        pageDividerIndex={pageDividerIndex}
                        setPageDividerIndex={setPageDividerIndex}
                        isPaginationMode={isPaginationMode}
                        setIsPaginationMode={setIsPaginationMode}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onSync={handleSyncToCode}
                        isModified={isModified}
                        listingName={getSelectedItemName()}
                        metadataOpen={metadataOpen}
                        onMetadataClick={() => setMetadataOpen((open) => !open)}
                      />
                    </div>
                  )}

                  {panelView === 'both' && (
                    <HorizontalWorkspaceDivider
                      onDrag={(delta) => setListingHeight((h) => clamp(h + delta, 150, window.innerHeight - 150))}
                    />
                  )}

                  {panelView !== 'shell' && (
                    <div className="min-w-0 flex-1 overflow-hidden flex flex-col">
                      <CodePanel
                        selectedItem={getSelectedItemName()}
                        docType="listing"
                        freezeCols={savedFreezeCols}
                        pageCols={savedPageCols}
                      />
                    </div>
                  )}
                </div>

                {/* AI Copilot Panel (on the right) */}
                {aiCopilotOpen && (
                  <WorkspaceDivider
                    onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, constraints.aiCopilot.max))}
                  />
                )}

                <div
                  className="shrink-0 overflow-hidden"
                  style={{
                    width: aiCopilotOpen ? `${aiCopilotWidth}px` : "0px",
                    opacity: aiCopilotOpen ? 1 : 0,
                    transition: aiCopilotOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
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
              // Original Table Layout — wrapped in inner div with minWidth for horizontal scroll
              <div className="flex h-full flex-1" style={{ minWidth: `${tableTotalMinWidth}px` }}>
                {/* Shell Preview with subordinate Metadata card */}
                {shellPreviewOpen && (
                  <div
                    className={`overflow-hidden ${panelView === 'shell' ? 'flex-1' : 'shrink-0'} ${codeOpen || aiCopilotOpen ? 'border-r border-[#EBECEC]' : ''}`}
                    style={{
                      width: panelView === 'shell' ? undefined : `${shellPreviewWidth}px`,
                    }}
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
                  <WorkspaceDivider onDrag={(delta) => setShellPreviewWidth((width) => clamp(width + delta, constraints.shellPreview.min, Math.min(constraints.shellPreview.max, dynamicShellMax)))} />
                )}

                {/* Shell ↔ AI divider (when Shell is open, Code is closed, AI is open) */}
                {/* Adjusts AI width since Shell is flex-1 in this view */}
                {shellPreviewOpen && !codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, Math.min(constraints.aiCopilot.max, dynamicAiMax)))} />
                )}

                {codeOpen && (
                  <div className={`min-w-[360px] flex-1 overflow-hidden ${aiCopilotOpen ? 'border-r border-[#EBECEC]' : ''}`}>
                    <CodePanel selectedItem={getSelectedItemName()} />
                  </div>
                )}

                {/* Code ↔ AI divider */}
                {codeOpen && aiCopilotOpen && (
                  <WorkspaceDivider onDrag={(delta) => setAiCopilotWidth((width) => clamp(width - delta, constraints.aiCopilot.min, Math.min(constraints.aiCopilot.max, dynamicAiMax)))} />
                )}

                <div
                  className="shrink-0 overflow-hidden"
                  style={{
                    width: aiCopilotOpen ? `${aiCopilotWidth}px` : "0px",
                    opacity: aiCopilotOpen ? 1 : 0,
                    transition: aiCopilotOpen ? "none" : "width 180ms cubic-bezier(0.25,0.1,0.25,1), opacity 180ms cubic-bezier(0.25,0.1,0.25,1)",
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

type EventStatus = 'ai-processing' | 'in-progress' | 'completed' | 'to-do';

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

const statusConfig: Record<EventStatus, { icon: string; label: string }> = {
  'ai-processing': { icon: aiProcessingIconUrl, label: 'AI Processing' },
  'in-progress': { icon: wipStatusIconUrl, label: 'In Progress' },
  'completed': { icon: completedStatusIconUrl, label: 'Completed' },
  'to-do': { icon: untouchedStatusIconUrl, label: 'To do' },
};

function HomePage({ onEventClick }: { onEventClick: () => void }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F7F7]">
      {/* Sidebar */}
      <div className="flex w-[240px] shrink-0 flex-col bg-[#F8F7F7]">
        {/* Sidebar header */}
        <div className="flex h-[48px] shrink-0 items-center justify-between px-[8px] pt-[4px]">
          <div className="flex items-center gap-[7.5px] px-[2.25px]">
            <AtlasLogoIcon className="h-[18px] w-[18px]" color="#830051" />
            <span className="text-[14px] font-bold tracking-[0.05em] text-[#830051]">ATLAS</span>
          </div>
          <button
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
            aria-label="Collapse sidebar"
          >
            <LocalIcon src={collapseIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
          </button>
        </div>
        {/* Nav items */}
        <div className="flex flex-1 flex-col gap-[2px] pt-[8px] pr-[4px]">
          {homeNavItems.map((item) => (
            <div
              key={item.id}
              className={`flex h-[32px] items-center gap-[4px] rounded-[4px] px-[12px] ${
                item.active ? 'bg-[#F4E8EE]' : 'hover:bg-black/5'
              }`}
            >
              <LocalIcon src={item.icon} className="h-[16px] w-[16px]" color={item.active ? '#830051' : '#888E8E'} />
              <span
                className={`t-small font-medium ${item.active ? 'text-[#830051]' : 'text-[#3C4242]'}`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
        {/* User account */}
        <div className="flex items-end gap-[8px] px-[12px] pb-[16px]">
          <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#9DB0AC]">
            <span className="text-[12px] font-medium text-white">U</span>
          </div>
          <span className="t-small text-[#3C4242]">User account</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#EBECEC] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] my-[4px] mr-[4px]">
        {/* Top section: Overview + metrics */}
        <div className="flex flex-col gap-[12px] px-[28px] py-[12px]">
          <h2 className="t-heading text-[#3C4242]">Overview</h2>
          <div className="flex items-center gap-[20px]">
            {homeMetrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col gap-[4px] rounded-[4px] border-[0.6px] border-[#D8DADA] px-[16px] py-[8px]"
              >
                <span className="text-[14px] font-medium leading-[20px] text-[#888E8E]">{m.label}</span>
                <span className="text-[36px] font-semibold leading-[1] text-[#3C4242]">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event list */}
        <div className="flex min-h-0 flex-1 flex-col gap-[12px] px-[28px] pt-[28px]">
          {/* Event list header */}
          <div className="flex items-center justify-between">
            <div className="flex h-[36px] w-[320px] items-center gap-[6px] rounded-[4px] border-[0.6px] border-[#D8DADA] bg-white px-[6px] py-[2px]">
              <LocalIcon src={searchLineIconUrl} className="h-[16px] w-[16px]" color="#888E8E" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="t-small min-w-0 flex-1 bg-transparent text-[#3C4242] outline-none placeholder:text-[#888E8E]"
              />
            </div>
            <div className="flex items-center gap-[16px]">
              <button className="flex items-center gap-[4px] rounded-[4px] px-[12px] py-[8px] hover:bg-black/5 active:scale-[0.96]">
                <LocalIcon src={filterIconUrl} className="h-[16px] w-[16px]" color="#3C4242" />
                <span className="text-[14px] leading-[20px] text-[#3C4242]">Filter</span>
              </button>
              <button className="flex items-center gap-[4px] rounded-[4px] bg-[#830051] px-[12px] py-[8px] hover:opacity-90 active:scale-[0.96]">
                <LocalIcon src={addLineIconUrl} className="h-[16px] w-[16px]" color="white" />
                <span className="text-[14px] leading-[20px] text-white">New Event</span>
              </button>
            </div>
          </div>

          {/* Event cards */}
          <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-auto">
            {homeEvents.map((event) => {
              const sc = statusConfig[event.status];
              return (
                <div
                  key={event.id}
                  onClick={onEventClick}
                  className="flex h-[92px] cursor-pointer items-center justify-between rounded-[4px] border border-[#EBECEC] bg-white px-[16px] py-[10px] transition-all hover:border-[#830051]/30 hover:shadow-[0_2px_8px_rgba(131,0,81,0.08)]"
                >
                  {/* Left section */}
                  <div className="flex flex-col gap-[8px]">
                    {/* Main contents */}
                    <div className="flex flex-col gap-[8px]">
                      <div className="flex items-center gap-[12px]">
                        <span className="t-heading text-[#3C4242]">{event.name}</span>
                        <span className="flex h-[16px] items-center justify-center rounded-[2px] border-[0.6px] border-[#888E8E] px-[6px] text-[10px] leading-[12px] text-[#888E8E]">
                          {event.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="t-small text-[#666666]">{event.project}</span>
                        <span className="t-small font-medium text-[#888E8E]">/</span>
                        <span className="t-small text-[#666666]">{event.study}</span>
                      </div>
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-[16px]">
                      <span className="t-small text-[#666666]">Created by: {event.creator}</span>
                      <span className="t-small text-[#666666]">Created: {event.createdDate}</span>
                    </div>
                  </div>
                  {/* Right section */}
                  <div className="flex items-center gap-[40px]">
                    <div className="flex flex-col items-end gap-[8px]">
                      <div className="flex items-center gap-[4px]">
                        <img src={sc.icon} alt="" className="h-[16px] w-[16px] block shrink-0" />
                        <span className="t-small text-[#3C4242]">{sc.label}</span>
                      </div>
                      {event.progress && (
                        <span className="text-[12px] leading-[20px]">
                          <span className="font-medium text-[#3C4242]">{event.progress.completed}/{event.progress.total}</span>{' '}
                          <span className="text-[#666666]">Tables Completed</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-[6px]">
                      {[
                        { icon: barChartIconUrl, label: 'View charts' },
                        { icon: toolCallIconUrl, label: 'AI edit' },
                        { icon: downloadIconUrl, label: 'Download' },
                        { icon: codeIconUrl, label: 'Code' },
                        { icon: moreIconUrl, label: 'More' },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96]"
                          aria-label={btn.label}
                        >
                          <LocalIcon src={btn.icon} className="h-[16px] w-[16px]" color="#888E8E" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  const [page, setPage] = useState<'home' | 'event'>('event');
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {page === 'home' ? (
        <HomePage onEventClick={() => setPage('event')} />
      ) : (
        <WorkspaceContent onNavigateHome={() => setPage('home')} />
      )}
    </div>
  );
}
