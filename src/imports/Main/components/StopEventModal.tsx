import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import closeIconUrl from "../../../icons/close-line.svg";
import stoppedStatusIconUrl from "../../../icons/Status label/Status=Stopped.svg";

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
            <div className="flex size-[32px] items-center justify-center rounded-[6px] bg-graphite-10">
              <img src={stoppedStatusIconUrl} alt="" className="size-[18px]" aria-hidden="true" />
            </div>
            <h2 id="stop-event-dialog-title" className="t-heading text-text-primary">Stop generation?</h2>
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
          <p className="t-caption text-text-primary">
            Generation for <span className="font-medium">“{event.name}”</span> will stop and cannot continue from where it left off. The Event will be kept so you can upload corrected files and start again.
          </p>
          <FormTextArea
            label="Reason for stopping"
            badge={<span className="t-small text-text-secondary">Optional</span>}
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
            Continue generation
          </Button>
          <Button variant="secondary" size="default" onClick={handleStop} disabled={isStopping} className="gap-[6px]">
            <img src={stoppedStatusIconUrl} alt="" className="size-[14px]" aria-hidden="true" />
            {isStopping ? "Stopping..." : "Stop generation"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
