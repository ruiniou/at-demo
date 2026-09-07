import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import warningIconUrl from "../../../icons/error-warning-line.svg";
import closeIconUrl from "../../../icons/close-line.svg";
import deleteBinIconUrl from "../../../icons/delete-bin-line.svg";

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
  onConfirmDelete: (eventId: string) => void;
  event: EventCardData | null;
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  onConfirmDelete,
  event,
}: DeleteEventModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTokenInspector, setShowTokenInspector] = useState(true);

  // Reset state when opened with a new event
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setIsDeleting(false);
    }
  }, [isOpen, event]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (!isConfirmed || isDeleting) return;
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete(event.id);
      setIsDeleting(false);
      onClose();
    }, 600);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-event-modal-title"
        className="relative flex w-[580px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.18)] border border-graphite-10"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-[24px] pt-[20px] pb-[16px] border-b border-graphite-10">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-status-error-bg">
              <img src={warningIconUrl} alt="" className="h-[20px] w-[20px]" />
            </div>
            <div>
              <h2
                id="delete-event-modal-title"
                className="text-[16px] font-semibold text-text-primary leading-[22px]"
              >
                Delete Event
              </h2>
              <span className="text-[12px] text-text-secondary leading-[16px]">
                High-risk irreversible operation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] hover:bg-black/5 active:scale-[0.96] transition-colors"
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="h-[16px] w-[16px] opacity-70" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-[16px] px-[24px] py-[20px] max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Target Event Info Box */}
          <div className="flex flex-col gap-[6px] rounded-[6px] bg-bg-panel border border-graphite-10 p-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-text-primary">
                {event.name}
              </span>
              <span className="flex h-[18px] items-center rounded-[2px] border border-graphite-20 bg-white px-[6px] text-[11px] font-medium text-text-secondary">
                v{event.version}
              </span>
            </div>
            <div className="flex items-center gap-[8px] text-[12px] text-text-secondary">
              <span>{event.project}</span>
              <span>/</span>
              <span>{event.study}</span>
              <span className="text-graphite-20">•</span>
              <span>Created by: {event.creator}</span>
            </div>
          </div>

          {/* Warning Note */}
          <div className="rounded-[6px] bg-status-error-bg/60 border border-status-error-border p-[12px] text-[13px] leading-[18px] text-text-primary">
            <span className="font-semibold text-status-error">Caution: </span>
            This will permanently delete this event and all associated TFL shells, SAS program references, code diff history, and generated outputs. This action <span className="font-semibold underline">cannot be undone</span>.
          </div>

          {/* Verification Checkbox */}
          <div className="pt-[4px]">
            <label className="flex items-start gap-[10px] cursor-pointer select-none">
              <Checkbox
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(checked === true)}
                className="mt-[2px]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-text-primary leading-[20px]">
                  I understand this action is permanent and cannot be reversed
                </span>
                <span className="text-[12px] text-text-secondary leading-[16px]">
                  Check the box to enable the delete button below
                </span>
              </div>
            </label>
          </div>

          {/* Live Danger Button States Showcase */}
          <div className="mt-[6px] rounded-[6px] border border-dashed border-graphite-20 bg-gray-50/50 p-[14px]">
            <div className="flex items-center justify-between mb-[10px]">
              <div className="flex items-center gap-[6px]">
                <span className="text-[12px] font-semibold text-text-primary">
                  Button States Inspector
                </span>
                <span className="rounded bg-graphite-10 px-[6px] py-[1px] text-[10px] text-text-secondary">
                  Design System Token
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTokenInspector((prev) => !prev)}
                className="text-[11px] text-brand-1 hover:underline cursor-pointer"
              >
                {showTokenInspector ? "Collapse" : "Expand"}
              </button>
            </div>

            {showTokenInspector && (
              <div className="flex flex-col gap-[12px] text-[12px]">
                {/* Primary Danger Row */}
                <div>
                  <div className="text-[11px] font-medium text-text-secondary mb-[6px]">
                    1. Primary Danger Button (实底主高危)
                  </div>
                  <div className="grid grid-cols-3 gap-[8px]">
                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Default</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-status-error text-white text-[12px] font-medium pointer-events-none">
                        #CC2C3C
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">status-error 100%</span>
                    </div>

                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Hover (加深12%)</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-[#B3202F] text-white text-[12px] font-medium pointer-events-none shadow-sm">
                        #B3202F
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">12% shade</span>
                    </div>

                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Disabled (去色化)</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-graphite-10 text-graphite-40 text-[12px] font-medium cursor-not-allowed">
                        #ECECEC / #B2B4
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">Graphite.10 / 40</span>
                    </div>
                  </div>
                </div>

                {/* Secondary Danger Row */}
                <div>
                  <div className="text-[11px] font-medium text-text-secondary mb-[6px]">
                    2. Secondary Danger Button (浅底次高危 / Subtle)
                  </div>
                  <div className="grid grid-cols-3 gap-[8px]">
                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Default (20% Tint)</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-status-error-bg text-status-error text-[12px] font-medium pointer-events-none">
                        #FAD4D8
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">status-error-bg</span>
                    </div>

                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Hover (40% Tint)</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-status-error-border text-status-error text-[12px] font-medium pointer-events-none">
                        #F5A9B4
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">status-error-border</span>
                    </div>

                    <div className="flex flex-col gap-[4px] items-center rounded bg-white p-[8px] border border-graphite-10">
                      <span className="text-[10px] text-text-secondary font-mono">Disabled</span>
                      <button className="h-[32px] px-[12px] rounded-[4px] bg-white border border-graphite-10 text-graphite-40 text-[12px] font-medium cursor-not-allowed">
                        White / #B2B4
                      </button>
                      <span className="text-[9px] text-gray-500 font-mono">White / Graphite.40</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-graphite-10 bg-white">
          <div className="text-[12px] text-text-secondary">
            {isConfirmed ? (
              <span className="text-status-error font-medium">Ready to delete</span>
            ) : (
              <span>Check confirmation to proceed</span>
            )}
          </div>

          <div className="flex items-center gap-[12px]">
            {/* Cancel Button */}
            <Button
              variant="ghost"
              size="default"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            {/* Confirm Delete Button - Danger Variant */}
            <Button
              variant="danger"
              size="default"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="gap-[6px]"
            >
              <img
                src={deleteBinIconUrl}
                alt=""
                className={`h-[14px] w-[14px] ${
                  !isConfirmed || isDeleting ? "opacity-40" : "invert"
                }`}
              />
              <span>{isDeleting ? "Deleting..." : "Delete Event"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
