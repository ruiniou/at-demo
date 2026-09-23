import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import closeIconUrl from "../../../icons/close-line.svg";

export interface EventCardData {
  id: string;
  name: string;
  version: string;
  project: string;
  study: string;
  creator: string;
  createdDate: string;
  status: string;
  progress?: { completed: number; total: number };
  errorMessage?: string;
}

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (eventId: string, reason: string) => void;
  event: EventCardData | null;
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WarningIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
        fill="var(--color-status-error)"
      />
    </svg>
  );
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  onConfirmDelete,
  event,
}: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
      setReason("");
    }
  }, [isOpen, event]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !event) return null;

  const handleDelete = () => {
    const normalizedReason = reason.trim();
    if (isDeleting || !normalizedReason) return;
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete(event.id, normalizedReason);
      setIsDeleting(false);
      onClose();
    }, 500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => {
          if (!isDeleting) onClose();
        }}
        aria-label="Close modal overlay"
      />

      {/* Real-world Confirmation Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-event-dialog-title"
        className="relative flex w-[440px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-graphite-10"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-[20px] pt-[18px] pb-[14px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] bg-status-error-bg">
              <WarningIcon size={18} />
            </div>
            <h2
              id="delete-event-dialog-title"
              className="text-[16px] font-semibold text-text-primary leading-[22px]"
            >
              Delete Event
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="h-[14px] w-[14px] opacity-70" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-[14px] px-[20px] py-[12px]">
          <p className="text-[13px] leading-[20px] text-text-primary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">"{event.name}"</span>?
          </p>

          {/* Event Context Pill */}
          <div className="flex flex-col gap-[4px] rounded-[4px] bg-bg-panel border border-graphite-10 px-[12px] py-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-text-primary truncate">
                {event.name}
              </span>
              <span className="flex h-[18px] items-center rounded-[2px] border border-graphite-20 bg-white px-[5px] text-[10px] font-medium text-text-secondary shrink-0">
                v{event.version}
              </span>
            </div>
            <div className="flex items-center gap-[6px] text-[12px] text-text-secondary truncate">
              <span>{event.project}</span>
              <span>/</span>
              <span>{event.study}</span>
            </div>
          </div>

          {/* Clinical Risk Caution */}
          <p className="text-[12px] leading-[18px] text-text-secondary">
            {event.status === "ai-processing" || event.status === "to-do"
              ? "The current generation will be stopped automatically. This will permanently remove the Event, its associated TFL shells, and generated outputs. This action cannot be undone."
              : "This will permanently remove the Event, its associated TFL shells, and generated outputs. This action cannot be undone."}
          </p>

          <FormTextArea
            label="Reason for deletion"
            required
            value={reason}
            onChange={(changeEvent) => setReason(changeEvent.target.value)}
            disabled={isDeleting}
            placeholder="Enter a reason"
            rows={3}
            maxLength={500}
            style={{ resize: "none" }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-[10px] px-[20px] py-[14px] border-t border-graphite-10 bg-white">
          <Button
            variant="ghost"
            size="default"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          {/* Secondary Danger Confirm Button */}
          <Button
            variant="secondary-danger"
            size="default"
            onClick={handleDelete}
            disabled={isDeleting || !reason.trim()}
            className="gap-[6px]"
          >
            <TrashIcon size={14} />
            <span>{isDeleting ? "Deleting..." : "Delete Event"}</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
