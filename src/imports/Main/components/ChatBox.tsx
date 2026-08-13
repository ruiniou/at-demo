import React, { useState, useRef, useEffect, useCallback } from "react";
import aiSubmitIconUrl from "../../../icons/AI-submit.svg";
import fileInfoLineUrl from "../../../icons/file-info-line.svg";
import doubleQuotesLUrl from "../../../icons/double-quotes-l.svg";

// ==================== SVGs from Figma ====================

function CloseIcon({ className = "size-[14px]", color = "var(--color-text-secondary)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill={color} />
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

function ChevronDownIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13.1717L16.95 8.22192L18.364 9.63614L12 16.0001L5.63604 9.63614L7.05025 8.22192L12 13.1717Z" fill={color} />
    </svg>
  );
}

function ChevronRightIcon({ className = "size-[16px]", color = "var(--color-brand-1)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1717 12L8.22192 7.05025L9.63614 5.63604L16.0001 12L9.63614 18.364L8.22192 16.95L13.1717 12Z" fill={color} />
    </svg>
  );
}

// ==================== Sub-components ====================

/** Legacy inline tag (code reference) used in Typed blur preview */
function CodeTag({ className = "", text = "Table.1(290-321)" }: { className?: string; text?: string }) {
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

// ==================== Quote Tag helpers ====================

/** Token stored in the Quote tag span dataset */
const QUOTE_TAG_ATTR = "data-quote-tag";

/** Serialize a contenteditable div to a plain string, turning quote tags into @[fieldId:label] tokens */
function serializeEditable(el: HTMLDivElement): string {
  let result = "";
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || "";
    } else if (node instanceof HTMLElement) {
      const token = node.getAttribute(QUOTE_TAG_ATTR);
      if (token) {
        result += token;
      } else {
        result += node.textContent || "";
      }
    }
  });
  return result;
}

/** Insert a quote tag at the current cursor position inside a contenteditable element */
function insertQuoteTagAtCursor(
  el: HTMLDivElement,
  fieldId: string,
  label: string,
  onRemove: (span: HTMLElement) => void
) {
  el.focus();

  const tagSpan = document.createElement("span");
  tagSpan.setAttribute("contenteditable", "false");
  tagSpan.setAttribute(QUOTE_TAG_ATTR, `@[${fieldId}:${label}]`);
  tagSpan.style.cssText =
    "display:inline-flex;align-items:center;gap:3px;background:var(--color-graphite-10);border-radius:4px;padding:1px 5px 1px 4px;margin:0 2px;font-size:12px;line-height:20px;color:var(--color-text-primary);vertical-align:middle;user-select:none;white-space:nowrap;cursor:default;";

  // Quote icon
  const icon = document.createElement("img");
  icon.src = doubleQuotesLUrl;
  icon.style.cssText = "width:12px;height:12px;display:block;flex-shrink:0;opacity:0.55;";
  icon.setAttribute("aria-hidden", "true");

  // Label text
  const text = document.createElement("span");
  text.textContent = label;
  text.style.cssText = "font-family:Inter,sans-serif;font-weight:400;max-width:140px;overflow:hidden;text-overflow:ellipsis;";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("contenteditable", "false");
  closeBtn.setAttribute("aria-label", "Remove quote");
  closeBtn.style.cssText =
    "display:flex;align-items:center;justify-content:center;width:12px;height:12px;padding:0;border:none;background:none;cursor:pointer;flex-shrink:0;opacity:0.5;";
  closeBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill="currentColor"/></svg>`;
  closeBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(tagSpan);
  });

  tagSpan.appendChild(icon);
  tagSpan.appendChild(text);
  tagSpan.appendChild(closeBtn);

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    // Ensure we're inside the target element
    if (el.contains(range.commonAncestorContainer)) {
      range.deleteContents();
      range.insertNode(tagSpan);
      // Move cursor after the tag
      const after = document.createTextNode("\u00A0"); // nbsp spacer
      tagSpan.after(after);
      range.setStartAfter(after);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
  }

  // Fallback: append to end
  el.appendChild(tagSpan);
  const after = document.createTextNode("\u00A0");
  el.appendChild(after);
}

// ==================== Main ChatBox Component ====================

export type ChatBoxStatus = "Default" | "Focused" | "Typed" | "Max height";

export type MetaChangeType = 'modified' | 'added' | 'removed';

export interface MetaDiffItem {
  fieldId: string;
  label: string;
  oldValue: string;
  newValue: string;
  blockId?: string;
  blockName?: string;
  changeType?: MetaChangeType;
}

export interface ChatBoxProps {
  onSubmit: (text: string) => void;
  pending?: boolean;
  metadataChangesCount?: number;
  metaDiffItems?: MetaDiffItem[];
  onCloseMetadataChanges?: () => void;
  onJumpToMetadata?: (fieldId: string) => void;
  onAcceptPending?: () => void;
  onRejectPending?: () => void;
  /** Called by the Metadata panel when the user clicks a field's Quote icon */
  onQuoteFieldRequest?: (fieldId: string, label: string) => void;
  /** Ref callback to expose an imperative insertQuote method to the parent */
  quoteInsertRef?: React.MutableRefObject<((fieldId: string, label: string) => void) | null>;
  className?: string;
}

export default function ChatBox({
  onSubmit,
  pending = false,
  metadataChangesCount = 0,
  metaDiffItems,
  onCloseMetadataChanges,
  onJumpToMetadata,
  onAcceptPending,
  onRejectPending,
  quoteInsertRef,
  className = "",
}: ChatBoxProps) {
  // --- Core Functional States ---
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pendingExpanded, setPendingExpanded] = useState<boolean>(false);
  // Tracks whether the contenteditable has any real content (for placeholder + button state)
  const [hasContent, setHasContent] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);

  const editableRef = useRef<HTMLDivElement>(null);
  // We still keep a textarea ref for the pending/single-line fallback input
  const pendingInputRef = useRef<HTMLInputElement>(null);

  // ---- Quote tag removal handler ----
  const handleRemoveTag = useCallback((span: HTMLElement) => {
    const el = editableRef.current;
    if (!el) return;
    span.remove();
    syncHasContent();
  }, []);

  // ---- Expose insertQuote to parent via ref ----
  useEffect(() => {
    if (quoteInsertRef) {
      quoteInsertRef.current = (fieldId: string, label: string) => {
        const el = editableRef.current;
        if (!el) return;
        insertQuoteTagAtCursor(el, fieldId, label, handleRemoveTag);
        syncHasContent();
      };
    }
  }, [quoteInsertRef, handleRemoveTag]);

  // ---- Sync hasContent / isMultiLine from DOM ----
  const syncHasContent = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;
    const text = el.textContent || "";
    const hasTags = el.querySelector(`[${QUOTE_TAG_ATTR}]`) !== null;
    setHasContent(text.trim().length > 0 || hasTags);

    // Count newlines for multi-line detection
    const lines = el.innerHTML.split(/<br\s*\/?>/i).length + (text.match(/\n/g) || []).length;
    setIsMultiLine(lines >= 4);
  }, []);

  // ---- handleSend ----
  const handleSend = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;
    const serialized = serializeEditable(el).replace(/\u00A0/g, " ").trim();
    if (serialized || metadataChangesCount > 0) {
      onSubmit(serialized);
      // Clear the editable
      el.innerHTML = "";
      setHasContent(false);
      setIsMultiLine(false);
      setIsFocused(false);
    }
  }, [metadataChangesCount, onSubmit]);

  // ---- Keyboard handling inside contenteditable ----
  const handleEditableKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl/Cmd+Enter → send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // Backspace: if cursor is at position 0 of a text node and previous sibling is a quote tag, remove the tag
    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      // Check if the caret is right after a tag span
      const { startContainer, startOffset } = range;
      const prev =
        startOffset === 0 && startContainer.nodeType === Node.TEXT_NODE
          ? startContainer.previousSibling
          : startOffset === 0 && startContainer === editableRef.current
          ? null
          : null;

      if (prev instanceof HTMLElement && prev.hasAttribute(QUOTE_TAG_ATTR)) {
        e.preventDefault();
        prev.remove();
        syncHasContent();
        return;
      }

      // Handle nbsp spacers left after tags
      if (
        startContainer.nodeType === Node.TEXT_NODE &&
        startOffset === 1 &&
        startContainer.textContent === "\u00A0"
      ) {
        const prevSib = (startContainer as Text).previousSibling;
        if (prevSib instanceof HTMLElement && prevSib.hasAttribute(QUOTE_TAG_ATTR)) {
          e.preventDefault();
          prevSib.remove();
          (startContainer as Text).remove();
          syncHasContent();
          return;
        }
      }
    }
  }, [handleSend, syncHasContent]);

  // --- Dynamic status resolution ---
  const resolvedStatus: ChatBoxStatus = isFocused
    ? isMultiLine ? "Max height" : "Focused"
    : hasContent
    ? isMultiLine
      ? "Max height"
      : "Typed"
    : "Default";

  const placeholderText = metadataChangesCount > 0 ? "Add instructions or submit directly..." : "Ask Me Anything...";

  const isMaxHeightAndNotPending = resolvedStatus === "Max height" && !pending;
  const isFocusedAndNotPending = resolvedStatus === "Focused" && !pending;
  const isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight =
    !pending && ["Default", "Focused", "Typed", "Max height"].includes(resolvedStatus);

  return (
    <div className={`flex flex-col w-full relative ${className}`}>

      {/* ==================== FIGMA COMPONENT ==================== */}
      <div
        className={`flex flex-col items-stretch justify-start px-[2px] relative rounded-[10px] w-full transition-all duration-200 ${
          pending
            ? "bg-az-secondary gap-[4px] pb-[2px] pt-[8px]"
            : metadataChangesCount > 0
            ? "bg-bg-panel border border-graphite-10 gap-[4px] pb-[2px] pt-[8px]"
            : ""
        }`}
        style={{
          border: pending ? "0.6px solid rgba(131, 0, 81, 0.15)" : undefined
        }}
      >

        {/* --- Pending Wrap (Shown if pending = true) --- */}
        {pending ? (
          <div
            className={`flex flex-col gap-[6px] items-start relative shrink-0 w-full transition-all duration-300 ${
              pendingExpanded ? "h-[109px]" : "h-auto"
            }`}
          >
            {/* Header */}
            <div
              onClick={() => setPendingExpanded(!pendingExpanded)}
              className="flex gap-[8px] items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full cursor-pointer select-none"
            >
              <div className="flex gap-[8px] items-center">
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

              {/* Debug CTA Buttons */}
              <div className="flex items-center gap-[6px] pr-[4px]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onRejectPending?.()}
                  className="px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium text-text-secondary bg-white hover:bg-black/5 border border-graphite-10 transition-colors cursor-pointer select-none active:scale-95"
                >
                  Reject
                </button>
                <button
                  onClick={() => onAcceptPending?.()}
                  className="px-[8px] py-[2px] rounded-[4px] text-[12px] font-medium text-white bg-brand-1 hover:bg-[#6D0043] transition-colors cursor-pointer select-none active:scale-95"
                >
                  Accept
                </button>
              </div>
            </div>

            {/* Expanded List */}
            {pendingExpanded && (
              <div className="flex flex-col gap-[4px] items-start px-[8px] pb-[6px] relative w-full overflow-y-auto scrollbar-colored flex-1" style={{ maxHeight: '140px' }}>
                {[
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11",
                  "Lines 10-11"
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-[8px] items-center relative shrink-0 w-full py-[2px] select-none">
                    <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                      <svg className="size-[12px]" viewBox="0 0 24 24" fill="none"><path d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12Z" fill="var(--color-brand-1)" /></svg>
                    </div>
                    <div className="flex flex-col font-['PingFang_SC',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-brand-1 text-center whitespace-nowrap">
                      <p className="leading-[20px] font-normal">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        ) : metadataChangesCount > 0 ? (
          // ---- Simplified Metadata Changes Tag Header (no chevron, no diff list) ----
          <div className="flex items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full select-none">
            <div className="flex gap-[8px] items-center min-w-0 flex-1">
              {/* File icon */}
              <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
                <img src={fileInfoLineUrl} alt="" className="size-[16px]" style={{ filter: 'invert(37%) sepia(5%) saturate(543%) hue-rotate(137deg) brightness(98%) contrast(85%)' }} />
              </div>
              {/* Label */}
              <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-text-primary text-center whitespace-nowrap">
                <p className="leading-[24px]">Metadata Changes</p>
              </div>
              {/* Count badge */}
              <div className="bg-graphite-10 flex items-center justify-center px-[4px] py-px relative rounded-[16px] shrink-0 min-w-[16px] h-[16px]">
                <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-text-secondary whitespace-nowrap">
                  <p className="leading-[14px]">{metadataChangesCount}</p>
                </div>
              </div>
            </div>

            {/* Close × button */}
            {onCloseMetadataChanges && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseMetadataChanges();
                }}
                className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center hover:bg-black/5 active:scale-[0.96] shrink-0 ml-[4px]"
                title="Cancel metadata changes"
                aria-label="Close metadata changes"
              >
                <CloseIcon className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
              </button>
            )}
          </div>
        ) : null}

        {/* --- Inputbox Container (non-pending) --- */}
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

              {/* ---- contenteditable input ---- */}
              <div className={`content-stretch flex flex-[1_0_0] items-center min-w-px relative ${isMaxHeightAndNotPending ? "w-full" : "gap-[8px]"}`}>
                <div className="relative flex-1 min-w-0">
                  {/* Placeholder (CSS trick: show when empty and not focused) */}
                  {!hasContent && (
                    <span
                      className="absolute left-0 top-0 pointer-events-none select-none t-body text-text-secondary text-[14px] leading-[24px] whitespace-nowrap overflow-hidden"
                      style={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
                      aria-hidden="true"
                    >
                      {placeholderText}
                    </span>
                  )}
                  <div
                    ref={editableRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-label={placeholderText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    onInput={syncHasContent}
                    onKeyDown={handleEditableKeyDown}
                    className={`w-full t-body text-text-primary bg-transparent outline-none text-[14px] leading-[24px] break-words whitespace-pre-wrap ${
                      isMaxHeightAndNotPending ? "max-h-[140px] overflow-y-auto pr-[12px]" : ""
                    }`}
                    style={{ minHeight: '24px', wordBreak: 'break-word' }}
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                className="bg-brand-1 hover:bg-az-warning transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95 animate-none"
              >
                <img
                  src={aiSubmitIconUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-[11px] h-[12px] block shrink-0"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
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
                  ref={pendingInputRef}
                  type="text"
                  placeholder="Ask Me Anything..."
                  className="flex-1 t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>

              <button
                onClick={() => {
                  const el = pendingInputRef.current;
                  if (el) { onSubmit(el.value); el.value = ""; }
                }}
                className="bg-brand-1 hover:opacity-90 transition-colors relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center cursor-pointer select-none active:scale-95"
              >
                <img
                  src={aiSubmitIconUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-[11px] h-[12px] block shrink-0"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
