import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import aiSubmitIconUrl from "../../../icons/AI-submit.svg";
import fileInfoLineUrl from "../../../icons/file-info-line.svg";
import doubleQuotesLUrl from "../../../icons/double-quotes-l.svg";
import aiProcessingIconUrl from "../../../icons/Status label/Status=AI Processing.svg";
import checkIconUrl from "../../../icons/check-line.svg";
import alertIconUrl from "../../../icons/alert-line.svg";
import { Tooltip } from "../../../components/ui/Tooltip";
import { ImagePreviewModal } from "../../../components/ui/ImagePreviewModal";
import type { EventProgressCardData } from "../Main";

// ==================== SVGs from Figma ====================

function CloseIcon({ className = "size-[14px]", color = "var(--color-text-secondary)" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill={color} />
    </svg>
  );
}

function AddIcon({ className = "size-[16px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill={color} />
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

function SpinnerIcon({ className = "size-[14px]" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className} shrink-0`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="var(--color-graphite-20, #D8DADA)" strokeWidth="2" fill="none" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="var(--color-brand-1, #0077FA)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function PauseCircleIcon({ className = "size-[14px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM9 9H11V15H9V9ZM13 9H15V15H13V9Z" fill={color} />
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

import tableIconUrl from "../../../icons/Table.svg";

function AtIcon({ className = "size-[14px]", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.4 22 16.6 21.15 18.33 19.73L16.92 18.32C15.56 19.38 13.86 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V13.5C20 14.33 19.33 15 18.5 15C17.67 15 17 14.33 17 13.5V12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C13.38 17 14.63 16.44 15.54 15.54C16.27 16.43 17.32 17 18.5 17C20.43 17 22 15.43 22 13.5V12C22 6.48 17.52 2 12 2ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill={color} />
    </svg>
  );
}

// ==================== Quote & Mention Tag helpers ====================

export interface MentionOption {
  id: string; // 'event' or tflId (e.g. 't1', 't4')
  label: string; // 'Event' or table name
  type: 'event' | 'tfl';
  isCurrent?: boolean;
}

/** Token stored in the Quote tag span dataset */
const QUOTE_TAG_ATTR = "data-quote-tag";
/** Token stored in the Mention tag span dataset */
const MENTION_TAG_ATTR = "data-mention-tag";

/** Serialize a contenteditable div to a plain string, turning quote & mention tags into tokens */
function serializeEditable(el: HTMLDivElement): string {
  let result = "";
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || "";
    } else if (node instanceof HTMLElement) {
      const quoteToken = node.getAttribute(QUOTE_TAG_ATTR);
      const mentionToken = node.getAttribute(MENTION_TAG_ATTR);
      if (quoteToken) {
        result += quoteToken;
      } else if (mentionToken) {
        result += mentionToken;
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

/** Create a Mention tag DOM element matching Quote tag visual styling */
function createMentionTagElement(
  option: MentionOption,
  onRemove: (span: HTMLElement) => void
): HTMLSpanElement {
  const tagSpan = document.createElement("span");
  tagSpan.setAttribute("contenteditable", "false");
  tagSpan.setAttribute(MENTION_TAG_ATTR, `@[mention:${option.id}:${option.type}:${option.label}]`);
  tagSpan.setAttribute("data-mention-id", option.id);
  tagSpan.setAttribute("data-mention-type", option.type);
  tagSpan.style.cssText =
    "display:inline-flex;align-items:center;gap:3px;background:var(--color-graphite-10);border-radius:4px;padding:1px 5px 1px 4px;margin:0 2px;font-size:12px;line-height:20px;color:var(--color-brand-1);vertical-align:middle;user-select:none;white-space:nowrap;cursor:default;";

  // Icon
  const iconSpan = document.createElement("span");
  iconSpan.style.cssText = "display:flex;align-items:center;justify-content:center;width:12px;height:12px;flex-shrink:0;color:var(--color-brand-1);";
  if (option.type === "event") {
    iconSpan.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.4 22 16.6 21.15 18.33 19.73L16.92 18.32C15.56 19.38 13.86 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V13.5C20 14.33 19.33 15 18.5 15C17.67 15 17 14.33 17 13.5V12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C13.38 17 14.63 16.44 15.54 15.54C16.27 16.43 17.32 17 18.5 17C20.43 17 22 15.43 22 13.5V12C22 6.48 17.52 2 12 2ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="currentColor"/></svg>`;
  } else {
    iconSpan.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.4477 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 9V14H10V9H5ZM12 9V14H19V9H12ZM19 7V5H5V7H19ZM5 16V19H10V16H5ZM12 19H19V16H12V19Z" fill="currentColor"/></svg>`;
  }

  // Label text
  const text = document.createElement("span");
  text.textContent = option.type === "event" ? "@Event" : `@${option.label}`;
  text.style.cssText = "font-family:Inter,sans-serif;font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;color:var(--color-brand-1);";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("contenteditable", "false");
  closeBtn.setAttribute("aria-label", "Remove mention");
  closeBtn.style.cssText =
    "display:flex;align-items:center;justify-content:center;width:12px;height:12px;padding:0;border:none;background:none;cursor:pointer;flex-shrink:0;opacity:0.5;";
  closeBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill="currentColor"/></svg>`;
  closeBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(tagSpan);
  });

  tagSpan.appendChild(iconSpan);
  tagSpan.appendChild(text);
  tagSpan.appendChild(closeBtn);
  return tagSpan;
}

/** Insert a mention tag at current cursor */
function insertMentionTagAtCursor(
  el: HTMLDivElement,
  option: MentionOption,
  onRemove: (span: HTMLElement) => void
) {
  el.focus();
  const tagSpan = createMentionTagElement(option, onRemove);

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      range.deleteContents();
      range.insertNode(tagSpan);
      const after = document.createTextNode("\u00A0");
      tagSpan.after(after);
      range.setStartAfter(after);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
  }

  el.appendChild(tagSpan);
  const after = document.createTextNode("\u00A0");
  el.appendChild(after);
}

/** Replace the typed '@query' with the selected Mention tag */
function replaceAtQueryWithMention(
  el: HTMLDivElement,
  option: MentionOption,
  queryLength: number,
  onRemove: (span: HTMLElement) => void
) {
  el.focus();
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE && el.contains(node)) {
      const text = node.textContent || "";
      const caretPos = range.startOffset;
      const atIndex = Math.max(0, caretPos - (queryLength + 1));
      if (atIndex < caretPos && text.slice(atIndex, atIndex + 1) === "@") {
        const beforeText = text.slice(0, atIndex);
        const afterText = text.slice(caretPos);
        node.textContent = beforeText;

        const tagSpan = createMentionTagElement(option, onRemove);
        const afterNode = document.createTextNode("\u00A0" + afterText);

        node.after(tagSpan);
        tagSpan.after(afterNode);

        const newRange = document.createRange();
        newRange.setStart(afterNode, 1);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        return;
      }
    }
  }

  insertMentionTagAtCursor(el, option, onRemove);
}

// ==================== Attachment Types ====================

export interface AttachmentItem {
  id: string;
  name: string;
  previewUrl: string;
  status: "uploading" | "uploaded";
  order: number;
  file?: File;
}

// ==================== AttachmentThumbnail Sub-component ====================

function AttachmentThumbnail({
  attachment,
  onRemove,
  onPreview,
}: {
  attachment: AttachmentItem;
  onRemove: () => void;
  onPreview?: (attachment: AttachmentItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isUploading = attachment.status === "uploading";

  return (
    <div
      className="relative shrink-0 select-none group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPreview?.(attachment)}
      title={`${attachment.name} (Click for full screen preview)`}
    >
      {/* Thumbnail image */}
      <img
        src={attachment.previewUrl}
        alt={attachment.name}
        className="w-[48px] h-[48px] object-cover rounded-[4px] border border-graphite-10 block transition-all duration-100 group-hover:opacity-90 group-active:scale-[0.98]"
        style={{
          opacity: isUploading ? 0.55 : 1,
          transition: "opacity 150ms ease",
        }}
      />

      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 rounded-[4px] bg-black/10 pointer-events-none" />
      )}

      {/* Single Corner Badge — Transitions between Order/Spinner and Close (x) on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title={isHovered ? `Remove ${attachment.name}` : undefined}
        aria-label={`Attachment ${attachment.order}: ${attachment.name}. Click to remove`}
        className={[
          "absolute -top-[5px] -left-[5px] w-[16px] h-[16px] rounded-full flex items-center justify-center",
          "transition-all duration-150 cursor-pointer",
          "after:content-[''] after:absolute after:-inset-[6px]",
          isHovered
            ? "bg-[#3C4242] hover:bg-black text-white active:scale-90"
            : isUploading
            ? "bg-graphite-20 text-white"
            : "bg-brand-1 text-white",
        ].join(" ")}
      >
        {isHovered ? (
          /* Close cross icon when hovered */
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z"
              fill="currentColor"
            />
          </svg>
        ) : isUploading ? (
          /* Spinner — motion.md: small object, 100-150ms */
          <svg
            className="animate-spin"
            width="8"
            height="8"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M10 6A4 4 0 1 1 6 2"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          /* Order number — visual-fundamentals.md: tabular-nums */
          <span
            className="text-white leading-none font-semibold"
            style={{
              fontSize: "9px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {attachment.order}
          </span>
        )}
      </button>
    </div>
  );
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

export interface MetaGroupChange {
  blockId: string;
  blockName: string;
  changeType: MetaChangeType;
  diffs: MetaDiffItem[];
}

export interface ChatBoxProps {
  onSubmit: (text: string) => void;
  /** If provided, called instead of onSubmit when attachments are present */
  onSubmitWithAttachments?: (text: string, attachments: AttachmentItem[]) => void;
  pending?: boolean;
  pendingChangesCount?: number;
  submitDisabled?: boolean;
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
  /** Ref callback to expose an imperative addFiles method to the parent */
  attachFilesRef?: React.MutableRefObject<((files: File[]) => void) | null>;
  eventProgressData?: EventProgressCardData | null;
  onCloseEventProgress?: () => void;
  onJumpToTfl?: (tflId: string) => void;
  mentionOptions?: MentionOption[];
  showMention?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  onSkipEventProgressItem?: (tflId: string) => void;
  placeholder?: string;
  className?: string;
  panelTone?: 'panel' | 'white';
  onContentStateChange?: (hasUnsentContent: boolean) => void;
}

export default function ChatBox({
  onSubmit,
  onSubmitWithAttachments,
  pending = false,
  pendingChangesCount = 3,
  submitDisabled = false,
  disabled = false,
  disabledTooltip,
  metadataChangesCount = 0,
  metaDiffItems,
  onCloseMetadataChanges,
  onJumpToMetadata,
  onAcceptPending,
  onRejectPending,
  quoteInsertRef,
  attachFilesRef,
  eventProgressData,
  onCloseEventProgress,
  onSkipEventProgressItem,
  onJumpToTfl,
  mentionOptions,
  showMention = true,
  placeholder,
  className = "",
  panelTone = 'white',
  onContentStateChange,
}: ChatBoxProps) {
  // --- Core Functional States ---
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pendingExpanded, setPendingExpanded] = useState<boolean>(false);
  const [metadataExpanded, setMetadataExpanded] = useState<boolean>(true);
  const [eventProgressExpanded, setEventProgressExpanded] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // --- Attachment States ---
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentItem | null>(null);

  // Keep a stable ref so handleSend can read current attachments without dep-array churn
  const attachmentsRef = useRef<AttachmentItem[]>([]);
  useEffect(() => { attachmentsRef.current = attachments; }, [attachments]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss toast notification after 4s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((a) => URL.revokeObjectURL(a.previewUrl));
    };
  }, []);

  const toggleGroup = (blockId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const groupedChanges = React.useMemo<MetaGroupChange[]>(() => {
    if (!metaDiffItems || metaDiffItems.length === 0) return [];

    const groupsMap = new Map<string, MetaGroupChange>();

    metaDiffItems.forEach(item => {
      let blockId = item.blockId;
      let blockName = item.blockName;
      let changeType: MetaChangeType = item.changeType || 'modified';

      if (item.fieldId.startsWith('add_')) {
        changeType = 'added';
        if (!blockId) blockId = item.fieldId;
        if (!blockName) blockName = item.newValue || item.label || 'New Component';
      } else if (item.fieldId.startsWith('delete_')) {
        changeType = 'removed';
        if (!blockId) blockId = item.fieldId;
        if (!blockName) blockName = item.label.replace(/^Component:\s*/, '') || 'Component';
      } else {
        if (!blockId) blockId = 'basic_info';
        if (!blockName) {
          if (item.label.includes(' > ')) {
            blockName = item.label.split(' > ')[0];
          } else {
            blockName = 'Basic Info';
          }
        }
      }

      let cleanLabel = item.label;
      if (cleanLabel.includes(' > ')) {
        cleanLabel = cleanLabel.split(' > ')[1];
      }

      const key = `${blockId}_${changeType}`;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          blockId: blockId || key,
          blockName: blockName || 'Component',
          changeType: changeType,
          diffs: []
        });
      }

      const group = groupsMap.get(key)!;
      if (changeType === 'modified') {
        group.diffs.push({
          ...item,
          label: cleanLabel
        });
      }
    });

    return Array.from(groupsMap.values());
  }, [metaDiffItems]);

  // Track previous block IDs to auto-expand newly appended component groups
  const prevBlockIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentBlockIds = new Set(groupedChanges.map(g => `${g.blockId}_${g.changeType}`));
    const newBlockIds = [...currentBlockIds].filter(id => !prevBlockIdsRef.current.has(id));

    if (newBlockIds.length > 0 && prevBlockIdsRef.current.size > 0) {
      setExpandedGroups(prev => {
        const next = { ...prev };
        newBlockIds.forEach(id => {
          next[id] = true;
        });
        return next;
      });
    }

    prevBlockIdsRef.current = currentBlockIds;
  }, [groupedChanges]);

  // Tracks whether the contenteditable has any real content (for placeholder + button state)
  const [hasContent, setHasContent] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);

  useEffect(() => {
    onContentStateChange?.(hasContent || attachments.length > 0);
  }, [attachments.length, hasContent, onContentStateChange]);

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
    const hasTags = el.querySelector(`[${QUOTE_TAG_ATTR}], [${MENTION_TAG_ATTR}]`) !== null;
    setHasContent(text.trim().length > 0 || hasTags);

    // Count newlines for multi-line detection
    const lines = el.innerHTML.split(/<br\s*\/?>/i).length + (text.match(/\n/g) || []).length;
    setIsMultiLine(lines >= 4);
  }, []);

  // ==================== Mention States & Handlers ====================
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0);

  const DEFAULT_MENTION_OPTIONS: MentionOption[] = [
    { id: "event", label: "Event (Entire Study)", type: "event" },
    { id: "t1", label: "14.1.1 Disposition", type: "tfl" },
    { id: "t2", label: "14.1.2 Important Protocol Deviations", type: "tfl" },
    { id: "t3", label: "14.1.3 Analysis Sets", type: "tfl" },
    { id: "t4", label: "14.1.4 Demographics (Full Analysis Set)", type: "tfl" },
    { id: "t5", label: "14.1.5 Baseline Characteristics", type: "tfl" },
    { id: "t6", label: "14.1.6 Prior Anti-cancer Therapy", type: "tfl" },
    { id: "t8", label: "14.1.8 Medical History by SOC", type: "tfl" },
  ];

  const activeMentionOptions = mentionOptions && mentionOptions.length > 0 ? mentionOptions : DEFAULT_MENTION_OPTIONS;
  const filteredMentionOptions = useMemo(() => {
    if (!mentionQuery) return activeMentionOptions;
    const q = mentionQuery.toLowerCase().trim();
    return activeMentionOptions.filter(
      (opt) => opt.label.toLowerCase().includes(q) || (opt.type === "event" && "event".includes(q))
    );
  }, [activeMentionOptions, mentionQuery]);

  const handleSelectMention = useCallback(
    (option: MentionOption) => {
      const el = editableRef.current;
      if (!el) return;
      replaceAtQueryWithMention(el, option, mentionQuery.length, handleRemoveTag);
      setShowMentionMenu(false);
      setMentionQuery("");
      syncHasContent();
    },
    [mentionQuery, handleRemoveTag, syncHasContent]
  );

  const checkMentionTrigger = useCallback(() => {
    if (!showMention) {
      setShowMentionMenu(false);
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setShowMentionMenu(false);
      return;
    }
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE || !editableRef.current?.contains(node)) {
      setShowMentionMenu(false);
      return;
    }

    const text = node.textContent || "";
    const offset = range.startOffset;
    const textBeforeCaret = text.slice(0, offset);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const query = textBeforeCaret.slice(lastAtIndex + 1);
      if (!/\s/.test(query) && query.length <= 25) {
        setMentionQuery(query);
        setMentionSelectedIndex(0);
        setShowMentionMenu(true);
        return;
      }
    }

    setShowMentionMenu(false);
  }, [showMention]);

  const handleToolbarMentionClick = useCallback(() => {
    if (!showMention) return;
    const el = editableRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (el.contains(range.commonAncestorContainer)) {
        const textNode = document.createTextNode("@");
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        el.appendChild(document.createTextNode("@"));
      }
    } else {
      el.appendChild(document.createTextNode("@"));
    }
    syncHasContent();
    setMentionQuery("");
    setMentionSelectedIndex(0);
    setShowMentionMenu(true);
  }, [syncHasContent]);

  // ==================== Attachment Helpers ====================

  const MAX_FILES = 5;

  /** Add an array of File objects (filtered to PNG/JPG/JPEG, max 5 total) */
  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) =>
      /^image\/(png|jpe?g)$/i.test(f.type)
    );
    if (imageFiles.length === 0) return;

    // If adding these files exceeds MAX_FILES limit:
    // Show Toast and completely void/reject this upload attempt ("这次上传行为不作数")
    if (attachmentsRef.current.length + imageFiles.length > MAX_FILES) {
      setToastMessage(`Only a maximum of ${MAX_FILES} files can be uploaded`);
      return;
    }

    setAttachments((prev) => {
      const newItems: AttachmentItem[] = imageFiles.map((file, i) => ({
        id: Math.random().toString(36).slice(2) + Date.now(),
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
        order: prev.length + i + 1,
        file,
      }));

      // Simulate upload: after 2 s flip status to 'uploaded'
      newItems.forEach((item) => {
        setTimeout(() => {
          setAttachments((prev2) =>
            prev2.map((a) =>
              a.id === item.id ? { ...a, status: "uploaded" as const } : a
            )
          );
        }, 2000);
      });

      return [...prev, ...newItems];
    });
  }, []);

  // ---- Expose addFiles to parent via attachFilesRef ----
  useEffect(() => {
    if (attachFilesRef) {
      attachFilesRef.current = (files: File[]) => {
        addFiles(files);
      };
    }
  }, [attachFilesRef, addFiles]);

  /** Remove an attachment by id and re-order remaining items sequentially */
  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      // Filter + re-assign order 1..N
      return prev
        .filter((a) => a.id !== id)
        .map((a, i) => ({ ...a, order: i + 1 }));
    });
  }, []);

  // ==================== Drag-and-drop handlers ====================

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    },
    [addFiles]
  );

  // ==================== Clipboard paste handler ====================

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) =>
        item.type.startsWith("image/")
      );
      if (imageItems.length === 0) return;
      // Prevent the browser from pasting image as inline element in contenteditable
      e.preventDefault();
      const files = imageItems
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[];
      addFiles(files);
    },
    [addFiles]
  );

  // ---- handleSend ----
  const handleSend = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;
    const serialized = serializeEditable(el).replace(/\u00A0/g, " ").trim();
    const currentAttachments = attachmentsRef.current;

    if (serialized || metadataChangesCount > 0 || currentAttachments.length > 0) {
      if (onSubmitWithAttachments && currentAttachments.length > 0) {
        onSubmitWithAttachments(serialized, [...currentAttachments]);
      } else {
        onSubmit(serialized);
      }

      // Revoke object URLs and clear attachments
      currentAttachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      setAttachments([]);

      // Clear the editable
      el.innerHTML = "";
      setHasContent(false);
      setIsMultiLine(false);
      setIsFocused(false);
    }
  }, [metadataChangesCount, onSubmit, onSubmitWithAttachments]);

  // ---- Keyboard handling inside contenteditable ----
  const handleEditableKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // If mention menu is open, handle keyboard navigation
    if (showMentionMenu && filteredMentionOptions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionSelectedIndex((prev) => (prev + 1) % filteredMentionOptions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionSelectedIndex((prev) => (prev - 1 + filteredMentionOptions.length) % filteredMentionOptions.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = filteredMentionOptions[mentionSelectedIndex];
        if (selected) {
          handleSelectMention(selected);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionMenu(false);
        return;
      }
    }

    // Ctrl/Cmd+Enter → send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // Backspace: if cursor is at position 0 of a text node and previous sibling is a quote/mention tag, remove the tag
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

      if (prev instanceof HTMLElement && (prev.hasAttribute(QUOTE_TAG_ATTR) || prev.hasAttribute(MENTION_TAG_ATTR))) {
        e.preventDefault();
        prev.remove();
        syncHasContent();
        checkMentionTrigger();
        return;
      }

      // Handle nbsp spacers left after tags
      if (
        startContainer.nodeType === Node.TEXT_NODE &&
        startOffset === 1 &&
        startContainer.textContent === "\u00A0"
      ) {
        const prevSib = (startContainer as Text).previousSibling;
        if (prevSib instanceof HTMLElement && (prevSib.hasAttribute(QUOTE_TAG_ATTR) || prevSib.hasAttribute(MENTION_TAG_ATTR))) {
          e.preventDefault();
          prevSib.remove();
          (startContainer as Text).remove();
          syncHasContent();
          checkMentionTrigger();
          return;
        }
      }
    }
  }, [showMentionMenu, filteredMentionOptions, mentionSelectedIndex, handleSelectMention, handleSend, syncHasContent, checkMentionTrigger]);

  // --- Dynamic status resolution ---
  const resolvedStatus: ChatBoxStatus = isFocused
    ? isMultiLine ? "Max height" : "Focused"
    : hasContent
    ? isMultiLine
      ? "Max height"
      : "Typed"
    : "Default";

  const placeholderText = disabled
    ? (disabledTooltip || "Historical session is read-only")
    : metadataChangesCount > 0 
    ? "Add instructions or submit directly..." 
    : (eventProgressData && !eventProgressData.isCompleted)
    ? "Waiting for updates to complete..."
    : (placeholder || "Ask Me Anything...");

  const isMaxHeightAndNotPending = resolvedStatus === "Max height" && !pending;
  const isFocusedAndNotPending = resolvedStatus === "Focused" && !pending;
  const isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight =
    !pending && ["Default", "Focused", "Typed", "Max height"].includes(resolvedStatus);

  // Derived attachment state
  const hasUploadingAttachments = attachments.some((a) => a.status === "uploading");
  const isActuallyDisabled = disabled || submitDisabled || hasUploadingAttachments;
  const canAddMore = !disabled && attachments.length < 5;

  return (
    <div
      className={`flex flex-col w-full relative ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toast Notification at the top of the entire page */}
      {toastMessage &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[99999] flex justify-center pointer-events-none transition-all duration-200">
            <div className="pointer-events-auto flex items-center justify-between gap-[16px] bg-[#FFF2F2] border border-[#F5C2C7] px-[16px] py-[8px] rounded-[6px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] min-w-[340px] max-w-[90vw]">
              <span className="text-[13px] text-[#A9252B] leading-[20px] font-normal whitespace-nowrap">
                {toastMessage}
              </span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-[#A9252B] hover:opacity-70 p-0.5 rounded transition-opacity cursor-pointer flex items-center justify-center shrink-0 ml-[8px]"
                aria-label="Dismiss notification"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Full screen Image Lightbox Preview Modal */}
      <ImagePreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        imageUrl={previewAttachment?.previewUrl || ""}
        title={previewAttachment ? `Attachment ${previewAttachment.order}: ${previewAttachment.name}` : undefined}
      />

      {/* Drag-over visual feedback ring */}
      {isDragOver && (
        <div
          className="absolute inset-0 rounded-[10px] border-2 border-brand-1 border-dashed pointer-events-none z-10 transition-opacity duration-150"
          aria-hidden="true"
        />
      )}

      {/* ==================== FIGMA COMPONENT ==================== */}
      <div
        className={`flex flex-col items-stretch justify-start px-[2px] relative rounded-[10px] w-full transition-all duration-200 ${
          pending
            ? "bg-az-secondary gap-[4px] pb-[2px] pt-[8px]"
            : (metadataChangesCount > 0 || eventProgressData)
            ? "bg-graphite-10 border border-border-default gap-[4px] pb-[2px] pt-[8px]"
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
                  <p className="leading-[24px] font-medium">{pendingChangesCount || 3} Pending Changes</p>
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
          // ---- Metadata Changes Panel (collapsed/expanded) ----
          <div className="flex flex-col gap-[0px] items-start relative shrink-0 w-full">
            {/* Header row */}
            <div
              className="flex items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full select-none cursor-pointer hover:bg-black/[0.06] active:bg-black/[0.09] rounded-[6px] transition-colors"
              onClick={() => setMetadataExpanded(v => !v)}
            >
              <div className="flex gap-[8px] items-center min-w-0 flex-1">
                {/* Chevron */}
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {metadataExpanded
                    ? <ChevronDownIcon className="size-[13px]" color="var(--color-text-secondary)" />
                    : <ChevronRightIcon className="size-[13px]" color="var(--color-text-secondary)" />
                  }
                </div>
                {/* File icon */}
                <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
                  <img src={fileInfoLineUrl} alt="" className="size-[16px]" style={{ filter: 'invert(37%) sepia(5%) saturate(543%) hue-rotate(137deg) brightness(98%) contrast(85%)' }} />
                </div>
                {/* Label */}
                <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-text-primary text-center whitespace-nowrap">
                  <p className="leading-[24px]">Metadata Changes</p>
                </div>
                {/* Count badge */}
                <div className="bg-white border border-graphite-20 flex items-center justify-center px-[4px] py-px relative rounded-[16px] shrink-0 min-w-[16px] h-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
                  className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center hover:bg-black/10 active:scale-[0.96] shrink-0 ml-[4px]"
                  title="Cancel metadata changes"
                  aria-label="Close metadata changes"
                >
                  <CloseIcon className="w-[14px] h-[14px]" color="var(--color-text-secondary)" />
                </button>
              )}
            </div>

            {/* Expandable diff list */}
            {metadataExpanded && groupedChanges.length > 0 && (
              <div className="flex flex-col gap-[2px] w-full px-[4px] pb-[4px] max-h-[200px] overflow-y-auto scrollbar-colored">
                {groupedChanges.map((group) => {
                  const groupKey = `${group.blockId}_${group.changeType}`;
                  const isExpanded = expandedGroups[groupKey] ?? false;

                  const headerBg =
                    group.changeType === 'added' ? 'bg-[rgba(0,120,60,0.07)]' :
                    group.changeType === 'removed' ? 'bg-[rgba(200,0,0,0.06)]' :
                    'bg-transparent';

                  const labelColor =
                    group.changeType === 'added' ? 'text-[#007830]' :
                    group.changeType === 'removed' ? 'text-[#C80000]' :
                    'text-text-primary';

                  const changeLabel =
                    group.changeType === 'added' ? '+ Added' :
                    group.changeType === 'removed' ? '− Removed' :
                    null;

                  return (
                    <div key={groupKey} className="flex flex-col w-full rounded-[6px] overflow-hidden">
                      {/* Group Header */}
                      <div
                        onClick={() => toggleGroup(groupKey)}
                        className={`flex items-center gap-[6px] px-[8px] py-[5px] cursor-pointer select-none hover:bg-black/[0.05] active:bg-black/[0.08] rounded-[6px] transition-colors ${headerBg}`}
                      >
                        <div className="w-[14px] h-[14px] flex items-center justify-center shrink-0">
                          {isExpanded
                            ? <ChevronDownIcon className="size-[12px]" color="var(--color-text-secondary)" />
                            : <ChevronRightIcon className="size-[12px]" color="var(--color-text-secondary)" />
                          }
                        </div>

                        <span className={`text-[13px] font-medium leading-[20px] flex-1 min-w-0 truncate ${labelColor}`}>
                          {group.blockName}
                        </span>

                        {changeLabel && (
                          <span className={`text-[11px] font-medium leading-[16px] shrink-0 ${labelColor} opacity-70`}>
                            {changeLabel}
                          </span>
                        )}

                        {group.changeType === 'modified' && group.diffs.length > 0 && (
                          <span className="text-[11px] font-medium leading-[16px] text-text-secondary shrink-0">
                            {group.diffs.length} field{group.diffs.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Group Diffs */}
                      {isExpanded && (
                        <div className="flex flex-col gap-[3px] w-full pl-[22px] pr-[6px] pb-[4px]">
                          {group.diffs.map((diff, dIdx) => {
                            const oldVal = diff.oldValue && diff.oldValue.trim() !== '' ? diff.oldValue : 'Empty';
                            const newVal = diff.newValue && diff.newValue.trim() !== '' ? diff.newValue : 'Empty';
                            return (
                              <div 
                                key={dIdx}
                                onClick={() => onJumpToMetadata?.(diff.fieldId)}
                                className="flex flex-col gap-[2px] py-[3px] px-[6px] rounded-[4px] hover:bg-white/80 active:bg-white cursor-pointer select-none transition-colors"
                              >
                                {/* Line 1: Field Name */}
                                <span className="text-[12px] font-medium text-text-secondary leading-[16px]">
                                  {diff.label}
                                </span>
                                {/* Line 2: Diff Values (Stacked, line-wrap allowed, no truncation) */}
                                <div className="text-[13px] leading-[18px] break-words whitespace-pre-wrap text-text-primary">
                                  <span className="text-text-secondary line-through mr-[4px]">{oldVal}</span>
                                  <span className="text-text-secondary mr-[4px]">→</span>
                                  <span className="font-medium text-brand-1">{newVal}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : eventProgressData ? (
          // ---- Event Progress Panel (Docked above input) ----
          <div className="flex flex-col gap-[0px] items-start relative shrink-0 w-full">
            {/* Header row */}
            <div
              className="flex items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full select-none cursor-pointer hover:bg-black/[0.06] active:bg-black/[0.09] rounded-[6px] transition-colors"
              onClick={() => setEventProgressExpanded((v) => !v)}
            >
              <div className="flex gap-[8px] items-center min-w-0 flex-1">
                {/* Chevron */}
                <div className="w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  {eventProgressExpanded ? (
                    <ChevronDownIcon className="size-[13px]" color="var(--color-text-secondary)" />
                  ) : (
                    <ChevronRightIcon className="size-[13px]" color="var(--color-text-secondary)" />
                  )}
                </div>
                {/* Status Icon */}
                {eventProgressData.isCompleted && (
                  <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
                    <img src={checkIconUrl} alt="" className="size-[14px]" />
                  </div>
                )}
                {/* Label */}
                <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-text-primary text-center whitespace-nowrap">
                  <p className="leading-[24px]">
                    {eventProgressData.isCompleted
                      ? "All Updates Applied"
                      : (eventProgressData.title || "Applying Updates")}
                  </p>
                </div>
              </div>

              {/* Status text */}
              <div className="flex items-center gap-[6px] shrink-0">
                <span className="text-[11px] text-text-secondary font-medium">
                  {eventProgressData.items.filter((i) => i.status === "done" || i.status === "skipped").length} of {eventProgressData.items.length} completed
                </span>
              </div>
            </div>

            {/* Expandable deliverable items list */}
            {eventProgressExpanded && eventProgressData.items.length > 0 && (
              <div className="flex flex-col gap-[2px] w-full px-[4px] pb-[4px] max-h-[180px] overflow-y-auto scrollbar-colored">
                {eventProgressData.items.map((item) => {
                  const isRunning = item.status === "running";
                  const isDone = item.status === "done";
                  const isQueued = item.status === "queued";
                  const isNeedsAction = item.status === "needs_action";
                  const isSkipped = item.status === "skipped";
                  const canSkip = isQueued || isNeedsAction;

                  return (
                    <div
                      key={item.tflId}
                      onClick={() => onJumpToTfl?.(item.tflId)}
                      className="flex items-center justify-between gap-[8px] px-[8px] py-[5px] rounded-[6px] hover:bg-white/80 active:bg-white cursor-pointer select-none transition-colors group"
                    >
                      <div className="flex items-center gap-[8px] min-w-0 flex-1">
                        <div className="w-[14px] h-[14px] shrink-0 flex items-center justify-center">
                          {isRunning && (
                            <SpinnerIcon className="w-[14px] h-[14px]" />
                          )}
                          {isDone && (
                            <img src={checkIconUrl} className="w-[12px] h-[12px]" alt="" />
                          )}
                          {isNeedsAction && (
                            <img src={alertIconUrl} className="w-[14px] h-[14px] shrink-0" alt="Action required" />
                          )}
                          {isSkipped && (
                            <div className="w-[10px] h-[1.5px] rounded bg-graphite-30" />
                          )}
                          {isQueued && (
                            <PauseCircleIcon className="w-[14px] h-[14px]" color="var(--color-text-secondary, #888E8E)" />
                          )}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-[13px] leading-[18px] truncate transition-colors ${
                              isRunning
                                ? "text-brand-1 font-medium"
                                : isDone
                                ? "text-text-primary font-medium"
                                : isNeedsAction
                                ? "text-text-primary font-medium"
                                : isSkipped
                                ? "text-text-secondary line-through opacity-70"
                                : "text-text-secondary"
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[11px] leading-[14px] text-text-secondary">
                            {isRunning
                              ? "Updating SAS code & metadata…"
                              : isDone
                              ? "Completed"
                              : isNeedsAction
                              ? "Action required"
                              : isSkipped
                              ? "Skipped by user"
                              : "Queued"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-[6px] shrink-0">
                        {canSkip && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSkipEventProgressItem?.(item.tflId);
                            }}
                            className="opacity-0 group-hover:opacity-100 px-[6px] py-[1px] rounded text-[11px] font-medium text-brand-1 hover:bg-brand-1/10 transition-all"
                          >
                            Skip
                          </button>
                        )}
                        <ChevronRightIcon className="size-[12px] opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {/* --- Inputbox Container (non-pending) --- */}
        {isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight && (
          <div
            className={`border-solid flex flex-col items-start justify-start p-[8px] relative shrink-0 w-full transition-all duration-200 border border-graphite-10 ${
              disabled
                ? "bg-graphite-5 cursor-not-allowed select-none"
                : isFocusedAndNotPending
                ? "bg-white border-brand-1 shadow-[0_0_0_1px_var(--color-brand-1)]"
                : panelTone === 'panel'
                ? "bg-bg-panel hover:border-graphite-30"
                : "bg-white hover:border-graphite-30"
            } ${isMaxHeightAndNotPending ? "rounded-[6px]" : "rounded-[8px]"}`}
          >
            {/* ---- Attachment Preview Strip (Top) ---- */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-[8px] pb-[8px] w-full">
                {attachments.map((att) => (
                  <AttachmentThumbnail
                    key={att.id}
                    attachment={att}
                    onRemove={() => removeAttachment(att.id)}
                    onPreview={(a) => setPreviewAttachment(a)}
                  />
                ))}
              </div>
            )}

            {/* ---- ContentEditable Input (Upper Body) ---- */}
            <div className="w-full relative min-w-0 pb-[4px]">
              {/* Mention Dropdown */}
              {showMention && showMentionMenu && filteredMentionOptions.length > 0 && (
                <div
                  className="absolute bottom-full left-0 mb-[8px] w-[310px] max-h-[260px] bg-white border border-border-default rounded-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.12)] overflow-hidden z-50 flex flex-col select-none"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="px-[10px] py-[6px] bg-graphite-5 border-b border-border-default flex items-center justify-between text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                    <span>Mention Scope or Table</span>
                    <span className="text-[10px] font-normal lowercase opacity-70">↑↓ to navigate, ↵ to select</span>
                  </div>
                  <div className="overflow-y-auto max-h-[210px] p-[4px] flex flex-col gap-[1px]">
                    {filteredMentionOptions.map((opt, idx) => {
                      const isSelected = idx === mentionSelectedIndex;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectMention(opt)}
                          onMouseEnter={() => setMentionSelectedIndex(idx)}
                          className={`flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors text-[13px] ${
                            isSelected ? "bg-az-secondary text-brand-1 font-medium hover:bg-az-secondary-hover" : "text-text-primary hover:bg-graphite-10"
                          }`}
                        >
                          {opt.type === "event" ? (
                            <span className="w-[20px] h-[20px] rounded-[4px] bg-brand-1/10 flex items-center justify-center shrink-0 text-brand-1">
                              <AtIcon className="w-[12px] h-[12px]" color="var(--color-brand-1)" />
                            </span>
                          ) : (
                            <span className="w-[20px] h-[20px] rounded-[4px] bg-graphite-10 flex items-center justify-center shrink-0 text-text-secondary">
                              <img src={tableIconUrl} className="w-[12px] h-[12px]" alt="" />
                            </span>
                          )}
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-[6px]">
                              <span className="truncate">{opt.label}</span>
                              {opt.isCurrent && (
                                <span className="text-[10px] px-[4px] py-[0px] rounded bg-graphite-10 text-text-secondary shrink-0 font-normal">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Placeholder (CSS trick: show when empty and not focused) */}
              {!hasContent && (
                <span
                  className={`absolute left-0 top-0 pointer-events-none select-none t-body text-[14px] leading-[22px] whitespace-nowrap overflow-hidden ${
                    disabled ? "text-text-secondary/60 italic cursor-not-allowed" : "text-text-secondary"
                  }`}
                  style={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
                  aria-hidden="true"
                >
                  {placeholderText}
                </span>
              )}
              <div
                ref={editableRef}
                contentEditable={!disabled}
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label={placeholderText}
                onFocus={disabled ? undefined : () => setIsFocused(true)}
                onBlur={() => setTimeout(() => {
                  setIsFocused(false);
                  setShowMentionMenu(false);
                }, 180)}
                onInput={() => {
                  if (disabled) return;
                  syncHasContent();
                  checkMentionTrigger();
                }}
                onKeyDown={disabled ? undefined : handleEditableKeyDown}
                onPaste={disabled ? undefined : handlePaste}
                className={`w-full t-body text-text-primary bg-transparent outline-none text-[14px] leading-[22px] break-words whitespace-pre-wrap ${
                  disabled ? "cursor-not-allowed pointer-events-none select-none" : ""
                } ${
                  isMaxHeightAndNotPending ? "max-h-[140px] overflow-y-auto pr-[4px]" : "min-h-[24px]"
                }`}
                style={{ wordBreak: 'break-word' }}
              />
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                addFiles(files);
                // Reset so selecting the same file again triggers onChange
                e.target.value = "";
              }}
            />

            {/* ---- Bottom Toolbar: Tools on the left, CTA on the right ---- */}
            <div className="flex items-center justify-between w-full pt-[4px]">
              {/* Left: Tool actions (Upload Image, Mention) */}
              <div className="flex items-center gap-[6px]">
                <Tooltip label={disabled ? (disabledTooltip || "Historical session is read-only") : canAddMore ? "Upload Image" : "Maximum 5 images reached"}>
                  <button
                    type="button"
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    disabled={disabled || !canAddMore}
                    aria-label="Upload Image"
                    className={[
                      "relative shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-100",
                      "after:content-[''] after:absolute after:-inset-[6px]",
                      disabled
                        ? "text-graphite-20 cursor-not-allowed opacity-40 pointer-events-none"
                        : canAddMore
                        ? "text-text-secondary hover:text-text-primary hover:bg-black/5 cursor-pointer active:scale-[0.92]"
                        : "text-graphite-20 cursor-not-allowed opacity-40",
                    ].join(" ")}
                  >
                    <AddIcon className="w-[16px] h-[16px]" color="currentColor" />
                  </button>
                </Tooltip>

                {/* Mention @ button */}
                {showMention && (
                  <Tooltip label={disabled ? (disabledTooltip || "Historical session is read-only") : "Mention scope or table (@)"}>
                    <button
                      type="button"
                      onClick={disabled ? undefined : handleToolbarMentionClick}
                      disabled={disabled}
                      aria-label="Mention scope or table"
                      className={`relative shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-100 ${
                        disabled
                          ? "text-graphite-20 cursor-not-allowed opacity-40 pointer-events-none"
                          : "text-text-secondary hover:text-text-primary hover:bg-black/5 cursor-pointer active:scale-[0.92]"
                      }`}
                    >
                      <AtIcon className="w-[14px] h-[14px]" />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Right: Submit CTA Button */}
              <button
                onClick={isActuallyDisabled ? undefined : handleSend}
                disabled={isActuallyDisabled}
                title={disabled ? (disabledTooltip || "Historical session is read-only") : hasUploadingAttachments ? "Waiting for images to finish uploading…" : undefined}
                className={`${
                  isActuallyDisabled
                    ? "bg-graphite-20 cursor-not-allowed opacity-50 pointer-events-none"
                    : "bg-brand-1 hover:bg-az-warning cursor-pointer active:scale-95"
                } relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center transition-colors select-none`}
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
          <div className={`border border-solid content-stretch flex flex-col items-start justify-center p-[8px] relative rounded-[8px] shrink-0 w-full ${
            disabled ? "bg-[#F7F8F8] border-graphite-10 cursor-not-allowed" : panelTone === 'panel' ? "bg-bg-panel border-graphite-10" : "bg-white border-graphite-10"
          }`}>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] items-center justify-start min-w-px relative">
                <input
                  ref={pendingInputRef}
                  type="text"
                  disabled={disabled}
                  placeholder={disabled ? "Historical session is read-only" : (placeholder || "Ask Me Anything...")}
                  className={`flex-1 t-input text-text-primary placeholder-text-secondary bg-transparent border-none outline-none font-['PingFang_SC',sans-serif] text-[14px] leading-[24px] ${
                    disabled ? "cursor-not-allowed text-text-secondary/60 italic" : ""
                  }`}
                  onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === "Enter") {
                      onSubmit(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>

              <button
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  const el = pendingInputRef.current;
                  if (el && el.value.trim()) { onSubmit(el.value.trim()); el.value = ""; }
                }}
                className={`relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center select-none ${
                  disabled
                    ? "bg-graphite-10 cursor-not-allowed opacity-50"
                    : "bg-brand-1 hover:opacity-90 transition-colors cursor-pointer active:scale-95"
                }`}
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
