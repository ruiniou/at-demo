import React from "react";
import { Button } from "../../../components/ui/Button";
import stoppedStatusIconUrl from "../../../icons/Status label/Status=Stopped.svg";
import uploadIconUrl from "../../../icons/upload-2-line.svg";

interface StoppedEventCardProps {
  eventName: string;
  onReupload: () => void;
}

export default function StoppedEventCard({ eventName, onReupload }: StoppedEventCardProps) {
  return (
    <div className="flex min-w-0 flex-1 p-[8px] pl-[4px]">
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-[12px] border border-graphite-10 bg-white shadow-card-mulberry">
        <div className="flex max-w-[420px] flex-col items-center gap-[12px] px-[32px] text-center">
          <div className="flex size-[48px] items-center justify-center rounded-full bg-graphite-10">
            <img src={stoppedStatusIconUrl} alt="" className="size-[24px]" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <h2 className="t-heading text-text-primary">Generation stopped</h2>
            <p className="t-caption text-text-secondary">
              Generation for “{eventName}” has stopped. Upload the corrected input files to start a new run.
            </p>
          </div>
          <Button variant="primary" size="default" onClick={onReupload} className="gap-[6px]">
            <img src={uploadIconUrl} alt="" className="size-[14px] brightness-0 invert" aria-hidden="true" />
            Re-upload files
          </Button>
        </div>
      </div>
    </div>
  );
}
