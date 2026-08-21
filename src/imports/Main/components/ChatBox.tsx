import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import aiSubmitIconUrl from "../../../icons/AI-submit.svg";
import fileInfoLineUrl from "../../../icons/file-info-line.svg";
import doubleQuotesLUrl from "../../../icons/double-quotes-l.svg";
import { Tooltip } from "../../../components/ui/Tooltip";

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
}: {
  attachment: AttachmentItem;
  onRemove: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isUploading = attachment.status === "uploading";

  return (
    <div
      className="relative shrink-0 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail image */}
      <img
        src={attachment.previewUrl}
        alt={attachment.name}
        title={attachment.name}
        className="w-[48px] h-[48px] object-cover rounded-[4px] border border-graphite-10 block"
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
  className?: string;
}

export default function ChatBox({
  onSubmit,
  onSubmitWithAttachments,
  pending = false,
  submitDisabled = false,
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
  const [metadataExpanded, setMetadataExpanded] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // --- Attachment States ---
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Derived attachment state
  const hasUploadingAttachments = attachments.some((a) => a.status === "uploading");
  const isActuallyDisabled = submitDisabled || hasUploadingAttachments;
  const canAddMore = attachments.length < 5;

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
            : metadataChangesCount > 0
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
          // ---- Metadata Changes Panel (collapsed/expanded) ----
          <div className="flex flex-col gap-[0px] items-start relative shrink-0 w-full">
            {/* Header row */}
            <div
              className="flex items-center justify-between px-[8px] py-[4px] relative shrink-0 w-full select-none cursor-pointer hover:bg-graphite-20/80 rounded-[6px] transition-colors"
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
                  className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center hover:bg-graphite-20 active:scale-[0.96] shrink-0 ml-[4px]"
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
                        className={`flex items-center gap-[6px] px-[8px] py-[5px] cursor-pointer select-none hover:bg-graphite-20/80 rounded-[6px] transition-colors ${headerBg}`}
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
                                className="flex flex-col gap-[2px] py-[3px] px-[6px] rounded-[4px] hover:bg-white/80 cursor-pointer select-none transition-colors"
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
        ) : null}

        {/* --- Inputbox Container (non-pending) --- */}
        {isNotPendingAndIsDefaultOrFocusedOrTypedOrMaxHeight && (
          <div
            className={`bg-white border-solid flex flex-col items-start justify-start px-[10px] py-[8px] relative shrink-0 w-full transition-all duration-200 ${
              isMaxHeightAndNotPending
                ? "border border-graphite-10 rounded-[6px]"
                : isFocusedAndNotPending
                ? "border border-brand-1 drop-shadow-[0px_0px_3px_rgba(131,0,81,0.2)] rounded-[8px]"
                : "border border-graphite-10 rounded-[8px]"
            }`}
          >
            {/* ---- Attachment Preview Strip (Top) ---- */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-[8px] pb-[8px] w-full">
                {attachments.map((att) => (
                  <AttachmentThumbnail
                    key={att.id}
                    attachment={att}
                    onRemove={() => removeAttachment(att.id)}
                  />
                ))}
              </div>
            )}

            {/* ---- ContentEditable Input (Upper Body) ---- */}
            <div className="w-full relative min-w-0 pb-[4px]">
              {/* Placeholder (CSS trick: show when empty and not focused) */}
              {!hasContent && (
                <span
                  className="absolute left-0 top-0 pointer-events-none select-none t-body text-text-secondary text-[14px] leading-[22px] whitespace-nowrap overflow-hidden"
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
                onPaste={handlePaste}
                className={`w-full t-body text-text-primary bg-transparent outline-none text-[14px] leading-[22px] break-words whitespace-pre-wrap ${
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
              {/* Left: Tool actions (Upload Image) */}
              <div className="flex items-center gap-[6px]">
                <Tooltip label={canAddMore ? "Upload Image" : "Maximum 5 images reached"}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canAddMore}
                    aria-label="Upload Image"
                    className={[
                      "relative shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] transition-colors duration-100",
                      "after:content-[''] after:absolute after:-inset-[6px]",
                      canAddMore
                        ? "text-text-secondary hover:text-text-primary hover:bg-black/5 cursor-pointer active:scale-[0.92]"
                        : "text-graphite-20 cursor-not-allowed opacity-40",
                    ].join(" ")}
                  >
                    <AddIcon className="w-[16px] h-[16px]" color="currentColor" />
                  </button>
                </Tooltip>
              </div>

              {/* Right: Submit CTA Button */}
              <button
                onClick={isActuallyDisabled ? undefined : handleSend}
                disabled={isActuallyDisabled}
                title={hasUploadingAttachments ? "Waiting for images to finish uploading…" : undefined}
                className={`${
                  isActuallyDisabled
                    ? "bg-graphite-20 cursor-not-allowed opacity-50"
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
