import React, { useState, useRef, useEffect } from "react";

// ==================== SVGs from Figma ====================

function ChevronRightIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1717 12L8.22192 7.05025L9.63614 5.63604L16.0001 12L9.63614 18.364L8.22192 16.95L13.1717 12Z" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.1717L16.95 8.22192L18.364 9.63614L12 16.0001L5.63604 9.63614L7.05025 8.22192L12 13.1717Z" fill={color} />
    </svg>
  );
}

function CodeIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12Z" fill={color} />
    </svg>
  );
}

function SendIcon({ className = "size-[12px]", color = "white" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.94607 9.31488C1.57948 9.12877 1.57341 8.60908 1.93701 8.41466L21.464 1.13966C21.808 1.00206 22.188 1.25827 22.155 1.62767L20.407 21.0547C20.377 21.3917 19.986 21.5717 19.704 21.3737L12.28 16.1437L8.91 19.5137C8.598 19.8257 8.077 19.6057 8.077 19.1647V15.0117L19.006 4.08166C19.104 3.98466 18.96 3.82166 18.847 3.89666L5.626 12.7107L1.94607 9.31488Z" fill={color} />
    </svg>
  );
}

// ==================== Sub-components ====================

interface TagProps {
  className?: string;
  text?: string;
}

function Tag({ className = "", text = "Table.1(290-321)" }: TagProps) {
  return (
    <div className={`bg-az-secondary content-stretch flex gap-[4px] h-[20px] items-center justify-center max-w-[240px] pl-[2px] pr-[6px] relative rounded-[4px] shrink-0 select-none ${className}`}>
      <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
        <CodeIcon className="size-[12px]" color="var(--color-brand-1)" />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] max-w-[152px] min-w-px not-italic overflow-hidden relative text-[13px] text-brand-1 text-ellipsis whitespace-nowrap">
        <p className="leading-[20px] overflow-hidden text-ellipsis font-medium">{text}</p>
      </div>
    </div>
  );
}

// ==================== Main ChatBox Component ====================

export type ChatBoxStatus = "Default" | "Focused" | "Typed" | "Max height";

export interface ChatBoxProps {
  onSubmit: (text: string) => void;
  pending?: boolean;
  className?: string;
}

export default function ChatBox({ onSubmit, pending = false, className = "" }: ChatBoxProps) {
  // --- Core Functional States ---
  const [inputText, setInputText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pendingExpanded, setPendingExpanded] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Dynamic status resolution ---
  const resolvedStatus: ChatBoxStatus = isFocused
    ? "Focused"
    : inputText.trim().length > 0
    ? inputText.split("\n").length >= 4
      ? "Max height"
      : "Typed"
    : "Default";

  // Auto-grow textarea height dynamically in automatic mode
  useEffect(() => {
    if (resolvedStatus === "Max height" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.height = "";
    }
  }, [inputText, resolvedStatus]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText("");
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // State helpers
  const isExpandedAndPending = pending && pendingExpanded;
  const isFocusedAndNotPending = resolvedStatus === "Focused" && !pending;
  const isMaxHeightAndNotPending = resolvedStatus === "Max height" && !pending;
  const isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight = !pending && ["Default", "Focused", "Typed", "Max height"].includes(resolvedStatus);
  const isTypedAndNotPending = resolvedStatus === "Typed" && !pending;

  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      
      {/* CSS style block for browser-native transparent track scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Scrollable pending changes list scrollbar */
        .chat-pending-list::-webkit-scrollbar {
          width: 4px;
        }
        .chat-pending-list::-webkit-scrollbar-track {
          background: transparent;
          border: none;
        }
        .chat-pending-list::-webkit-scrollbar-thumb {
          background-color: #E6CCDC;
          border-radius: 8px;
        }
        .chat-pending-list::-webkit-scrollbar-thumb:hover {
          background-color: #CC99B9;
        }
        .chat-pending-list {
          scrollbar-width: thin;
          scrollbar-color: #E6CCDC transparent;
        }

        /* Max height text area scrollbar */
        .chat-maxheight-textarea::-webkit-scrollbar {
          width: 4px;
        }
        .chat-maxheight-textarea::-webkit-scrollbar-track {
          background: transparent;
          border: none;
        }
        .chat-maxheight-textarea::-webkit-scrollbar-thumb {
          background-color: rgba(216, 218, 218, 0.75);
          border-radius: 8px;
        }
        .chat-maxheight-textarea::-webkit-scrollbar-thumb:hover {
          background-color: #B2B4B4;
        }
        .chat-maxheight-textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(216, 218, 218, 0.75) transparent;
        }
      `}} />

      {/* ==================== FIGMA COMPONENT ==================== */}
      <div 
        className={`content-stretch flex flex-col items-center justify-end px-[2px] relative rounded-[10px] w-full transition-all duration-200 ${
          pending 
            ? "bg-az-secondary gap-[4px] pb-[2px] pt-[8px]" 
            : ""
        }`}
        style={{
          border: pending ? "0.6px solid rgba(131, 0, 81, 0.15)" : "none"
        }}
      >
        
        {/* --- Pending Wrap (Shown if pending = true) --- */}
        {pending && (
          <div 
            className={`content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full transition-all duration-300 ${
              pendingExpanded ? "h-[109px]" : "h-auto"
            }`}
          >
            {/* Header - Aligned precisely to the left */}
            <div 
              onClick={() => setPendingExpanded(!pendingExpanded)}
              className="content-stretch flex gap-[8px] items-center justify-start px-[8px] py-[4px] relative shrink-0 w-full cursor-pointer select-none"
            >
              <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                {pendingExpanded ? (
                  <ChevronDownIcon className="size-[14px]" color="var(--color-brand-1)" />
                ) : (
                  <ChevronRightIcon className="size-[14px]" color="var(--color-brand-1)" />
                )}
              </div>
              <div className="flex flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-brand-1 text-center whitespace-nowrap">
                <p className="leading-[24px] font-medium">3 Pending Changes</p>
              </div>
            </div>

            {/* Expanded List - Aligned precisely with the header icons and texts. No hover offsets. */}
            {pendingExpanded && (
              <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] pb-[6px] relative shrink-0 w-full overflow-y-auto chat-pending-list flex-1">
                {[
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11"
                ].map((item, idx) => (
                  <div key={idx} className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full py-[2px] select-none">
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      <CodeIcon className="size-[12px]" color="var(--color-brand-1)" />
                    </div>
                    <div className="flex flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-brand-1 text-center whitespace-nowrap">
                      <p className="leading-[20px] font-normal">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Inputbox Container --- */}
        {isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight && (
          <div 
            className={`bg-white border-solid content-stretch flex flex-col items-start justify-center px-[10px] relative shrink-0 w-full transition-all duration-200 ${
              isMaxHeightAndNotPending 
                ? "border border-graphite-10 py-[9px] rounded-[6px]" 
                : isFocusedAndNotPending 
                ? "border border-brand-1 drop-shadow-[0px_0px_3px_rgba(131,0,81,0.2)] py-[8px] rounded-[8px]" 
                : "border border-graphite-10 py-[8px] rounded-[8px]"
            }`}
          >
            <div className={`content-stretch flex relative shrink-0 w-full ${isMaxHeightAndNotPending ? "gap-[12px] items-end justify-center" : "gap-[16px] items-center"}`}>
              
              {/* Text Field & Tags */}
              <div className={`content-stretch flex flex-[1_0_0] items-center min-w-px relative ${isMaxHeightAndNotPending ? "w-full" : "gap-[8px]"}`}>
                
                {isMaxHeightAndNotPending ? (
                  <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-start justify-between min-w-px w-full relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      className="w-full t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none resize-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px] max-h-[140px] pr-[12px] overflow-y-auto chat-maxheight-textarea"
                      rows={4}
                    />
                  </div>
                ) : (
                  <div className="flex flex-1 items-center w-full">
                    
                    {/* Render static text + tag inline if blurred and typed (Figma Typed Mockup) */}
                    {isTypedAndNotPending && !isFocused ? (
                      <div 
                        onClick={() => {
                          setIsFocused(true);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="flex-1 flex items-center gap-[4px] cursor-text select-text h-[24px]"
                      >
                        <span className="text-text-primary font-['PingFang_SC',sans-serif] text-[14px] leading-[24px] whitespace-nowrap shrink-0">
                          {inputText}
                        </span>
                        <Tag />
                      </div>
                    ) : (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                          setInputText(e.target.value);
                        }}
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                        onBlur={() => {
                          // Allow click handlers to complete before blur clears focus
                          setTimeout(() => setIsFocused(false), 150);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSend();
                          }
                        }}
                        placeholder="Ask me anything..."
                        className="flex-1 t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px]"
                      />
                    )}
                    
                  </div>
                )}
                
              </div>

              {/* Send Button */}
              <button 
                onClick={handleSend}
                className="bg-brand-1 hover:opacity-90 transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95 animate-none"
              >
                <SendIcon className="size-[12px]" color="white" />
              </button>
            </div>
          </div>
        )}

        {/* --- Inputbox when Pending is active --- */}
        {pending && (
          <div className="bg-white border border-graphite-10 border-solid content-stretch flex flex-col items-start justify-center px-[10px] py-[8px] relative rounded-[8px] shrink-0 w-full">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] items-center justify-start min-w-px relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px]"
                />
              </div>
              
              <button 
                onClick={handleSend}
                className="bg-brand-1 hover:opacity-90 transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95"
              >
                <SendIcon className="size-[12px]" color="white" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
