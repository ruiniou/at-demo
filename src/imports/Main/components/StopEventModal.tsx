import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import closeIconUrl from "../../../icons/close-line.svg";

function WarningIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-1-5h2v2h-2v-2Zm0-8h2v6h-2V7Z" fill="var(--color-status-error)" />
    </svg>
  );
}

interface StoppableEvent {
  id: string;
  name: string;
}

interface StopEventModalProps {
  isOpen: boolean;
  event: StoppableEvent | null;
  onClose: () => void;
  onConfirmStop: (eventId: string, reason: string) => void;
}

export default function StopEventModal({ isOpen, event, onClose, onConfirmStop }: StopEventModalProps) {
  const [reason, setReason] = useState("");
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setReason("");
    setIsStopping(false);
  }, [isOpen, event]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape" && !isStopping) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isStopping, onClose]);

  if (!isOpen || !event) return null;

  const handleStop = () => {
    if (isStopping) return;
    setIsStopping(true);
    window.setTimeout(() => {
      onConfirmStop(event.id, reason.trim());
      setIsStopping(false);
      onClose();
    }, 500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
        onClick={() => {
          if (!isStopping) onClose();
        }}
        aria-label="Close stop generation dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-event-dialog-title"
        className="relative flex w-[440px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-elevation-overlay"
      >
        <div className="flex items-center justify-between px-[20px] pb-[14px] pt-[18px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex size-[32px] items-center justify-center rounded-[6px] bg-status-error-bg">
              <WarningIcon />
            </div>
            <h2 id="stop-event-dialog-title" className="t-heading text-text-primary">Stop Generation?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isStopping}
            className="flex size-[24px] items-center justify-center rounded-[4px] hover:bg-graphite-10 active:bg-graphite-20 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
          >
            <img src={closeIconUrl} alt="" className="size-[14px] opacity-70" />
          </button>
        </div>

        <div className="flex flex-col gap-[14px] px-[20px] py-[12px]">
          <p className="t-caption text-text-secondary">
            This run cannot be resumed. After stopping, you can re-upload files or delete the Event.
          </p>
          <FormTextArea
            label={<>Reason for stopping <span className="font-normal text-text-secondary">(Optional)</span></>}
            value={reason}
            onChange={(changeEvent) => setReason(changeEvent.target.value)}
            disabled={isStopping}
            placeholder="Add a reason"
            rows={3}
            maxLength={500}
            style={{ resize: "none" }}
          />
        </div>

        <div className="flex items-center justify-end gap-[10px] border-t border-graphite-10 px-[20px] py-[14px]">
          <Button variant="ghost" size="default" onClick={onClose} disabled={isStopping}>
            Cancel
          </Button>
          <Button variant="danger" size="default" onClick={handleStop} disabled={isStopping} className="gap-[6px]">
            {isStopping ? "Stopping..." : "Stop Generation"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
