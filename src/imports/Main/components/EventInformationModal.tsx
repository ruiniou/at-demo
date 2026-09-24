import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/Button";
import { UploadCard, UploadStatus } from "../../../components/ui/UploadCard";
import { FormInputField as Input } from "../../../components/ui/FormInputField";
import { Dropdown, DropdownOption } from "../../../components/ui/Dropdown";
import { FormItem } from "../../../components/ui/FormItem";
import { OptionalSection } from "./CreateEventModal";
import { OwnerPicker } from "./ProjectStudyManagementView";
import closeIconUrl from "../../../icons/close-line.svg";
import informationIconUrl from "../../../icons/information-line.svg";

export type EventInputFiles = {
  adam: string;
  sdtm: string;
  sap: string;
  shell: string;
  tifo?: string;
  customShell?: string;
};

export type EventInformation = {
  id: string;
  name: string;
  project: string;
  study: string;
  owner: string;
  ta?: string;
  version: string;
  status: "ai-processing" | "in-progress" | "completed" | "to-do" | "stopped" | "error";
  inputFiles?: EventInputFiles;
};

type InputKey = keyof EventInputFiles;

const DEFAULT_INPUTS: EventInputFiles = {
  adam: "adam_spec_v2.2.xlsx",
  sdtm: "sdtm_spec_v2.2.xlsx",
  sap: "statistical_analysis_plan_v3.1.pdf",
  shell: "tfl_shells_v2.2.xlsx",
  tifo: "tifo_mapping_v1.4.xlsx",
  customShell: "custom_shell_config.json",
};

const FIELD_CONFIG: Array<{
  key: InputKey;
  label: string;
  required?: boolean;
  requirementText: string;
  canUseExisting?: boolean;
}> = [
  { key: "adam", label: "ADaM Spec", required: true, requirementText: "Excel only (.xlsx / .xls), max 20MB", canUseExisting: true },
  { key: "sdtm", label: "SDTM", required: true, requirementText: "Excel only (.xlsx / .xls), max 20MB", canUseExisting: true },
  { key: "sap", label: "SAP", required: true, requirementText: "PDF or Word (.pdf / .docx), max 20MB", canUseExisting: true },
  { key: "shell", label: "Shell file", required: true, requirementText: "Excel only (.xlsx / .xls), max 20MB" },
  { key: "tifo", label: "TiFo", requirementText: "Excel only (.xlsx / .xls), max 20MB" },
  { key: "customShell", label: "Custom Shell json", requirementText: "JSON only (.json), max 20MB" },
];

const existingOptions = [
  { eventName: "CSR Interim Analysis", fileName: "input_spec_csr_interim_v2.1.xlsx", isLastUsed: true },
  { eventName: "DSMB Q3 Review", fileName: "input_spec_dsmb_q3_v1.4.xlsx" },
];

function ConfirmModal({
  open,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  danger,
  onPrimary,
  onSecondary,
}: {
  open: boolean;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  danger?: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/50" aria-label="Close confirmation" onClick={onSecondary} />
      <div role="dialog" aria-modal="true" aria-labelledby="input-confirm-title" className="relative z-[1] w-[420px] max-w-[calc(100vw-32px)] rounded-[8px] bg-white shadow-elevation-overlay">
        <div className="px-[20px] pb-[12px] pt-[18px]">
          <h3 id="input-confirm-title" className="t-heading text-text-primary">{title}</h3>
        </div>
        <div className="px-[20px] pb-[20px]">
          <p className="t-body-secondary text-text-secondary">{description}</p>
        </div>
        <div className="flex justify-end gap-[8px] border-t border-graphite-10 px-[20px] py-[14px]">
          <Button variant="ghost" onClick={onSecondary}>{secondaryLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onPrimary}>{primaryLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function EventInformationModal({
  isOpen,
  event,
  currentUserName,
  onClose,
  onUpdateInputs,
}: {
  isOpen: boolean;
  event: EventInformation | null;
  currentUserName: string;
  onClose: () => void;
  onUpdateInputs: (eventId: string, inputs: EventInputFiles) => void;
}) {
  const [files, setFiles] = useState<EventInputFiles>(DEFAULT_INPUTS);
  const [initialFiles, setInitialFiles] = useState<EventInputFiles>(DEFAULT_INPUTS);
  const [statuses, setStatuses] = useState<Record<InputKey, UploadStatus>>({
    adam: "uploaded", sdtm: "uploaded", sap: "uploaded", shell: "uploaded", tifo: "uploaded", customShell: "uploaded",
  });
  const [discardOpen, setDiscardOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !event) return;
    const next = { ...DEFAULT_INPUTS, ...event.inputFiles };
    setFiles(next);
    setInitialFiles(next);
    setStatuses({
      adam: next.adam ? "uploaded" : "pending",
      sdtm: next.sdtm ? "uploaded" : "pending",
      sap: next.sap ? "uploaded" : "pending",
      shell: next.shell ? "uploaded" : "pending",
      tifo: next.tifo ? "uploaded" : "pending",
      customShell: next.customShell ? "uploaded" : "pending",
    });
    setDiscardOpen(false);
    setUpdateOpen(false);
  }, [isOpen, event]);

  const hasChanges = useMemo(() => JSON.stringify(files) !== JSON.stringify(initialFiles), [files, initialFiles]);
  const isProcessing = event?.status === "ai-processing" || event?.status === "in-progress";
  const isCompleted = event?.status === "completed";
  const isOwner = Boolean(event && event.owner === currentUserName);
  const inputsDisabled = isProcessing || isCompleted || !isOwner;
  const requiredReady = Boolean(files.adam && files.sdtm && files.sap && files.shell);

  const requestClose = () => {
    if (hasChanges) setDiscardOpen(true);
    else onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== "Escape") return;
      if (discardOpen) setDiscardOpen(false);
      else if (updateOpen) setUpdateOpen(false);
      else requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, discardOpen, updateOpen, hasChanges]);

  if (!isOpen || !event) return null;

  const bannerCopy = isProcessing
    ? "Input files can’t be changed while this Event is processing."
    : isCompleted
      ? "Input files can’t be changed for a completed Event."
      : !isOwner
        ? "Only the Event Owner can change input files."
        : null;

  const readOnlyOptions = (value: string): DropdownOption[] => [{ label: value, value }];

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={requestClose} />
        <div role="dialog" aria-modal="true" aria-labelledby="event-information-title" className="relative flex h-[740px] max-h-[calc(100vh-40px)] w-[960px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[8px] bg-white shadow-elevation-overlay">
          <div className="flex shrink-0 items-center px-[20px] pb-[12px] pt-[16px]">
            <h2 id="event-information-title" className="min-w-0 flex-1 t-heading text-text-primary">Event Information</h2>
            <button type="button" onClick={requestClose} className="flex size-[24px] items-center justify-center rounded-[4px] hover:bg-graphite-10" aria-label="Close">
              <img src={closeIconUrl} alt="" className="size-[16px]" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 border-t border-graphite-10">
            <div className="flex min-h-0 w-[320px] shrink-0 flex-col gap-[16px] overflow-y-auto border-r border-graphite-10 p-[20px]">
              <Dropdown label="Therapeutic Area" required options={readOnlyOptions(event.ta || "—")} value={event.ta || "—"} disabled />
              <Dropdown label="Project Code" required options={readOnlyOptions(event.project)} value={event.project} disabled />
              <Dropdown label="Study Code" required options={readOnlyOptions(event.study)} value={event.study} disabled />
              <Input label="Event Name" required value={event.name} onChange={() => undefined} disabled />
              <FormItem label="Event Owner" labelClassName="t-small-medium" required disabled>
                <OwnerPicker value={event.owner} onSelect={() => undefined} compact disabled ariaLabel="Event Owner" />
              </FormItem>
              <Dropdown label="O_GEM Version" required options={readOnlyOptions(event.version)} value={event.version} disabled />
              <OptionalSection disabled />
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[18px_20px_20px_20px]">
              {bannerCopy && (
                <div className="flex items-center gap-[8px] rounded-[4px] bg-bg-panel px-[12px] py-[9px] text-text-secondary">
                  <img src={informationIconUrl} alt="" className="size-[16px] shrink-0 opacity-70" />
                  <p className="t-small">{bannerCopy}</p>
                </div>
              )}
              {FIELD_CONFIG.map((field) => (
                <UploadCard
                  key={`${event.id}-${field.key}`}
                  label={field.label}
                  required={field.required}
                  requirementText={field.requirementText}
                  showSegmentedControl={field.canUseExisting}
                  disabled={inputsDisabled}
                  status={statuses[field.key]}
                  fileName={files[field.key] || ""}
                  existingEvents={field.canUseExisting ? existingOptions : []}
                  onStatusChange={(nextStatus) => setStatuses((previous) => ({ ...previous, [field.key]: nextStatus }))}
                  onFileSelect={(fileName) => setFiles((previous) => ({ ...previous, [field.key]: fileName || undefined }))}
                />
              ))}
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-[8px] border-t border-graphite-10 px-[20px] py-[14px]">
            <Button variant="ghost" onClick={requestClose}>Cancel</Button>
            <Button variant="primary" disabled={inputsDisabled || !hasChanges || !requiredReady} onClick={() => setUpdateOpen(true)}>Update Inputs</Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={discardOpen}
        title="Discard Input Changes?"
        description="Your uploaded and selected files will be cleared."
        primaryLabel="Discard"
        secondaryLabel="Keep Editing"
        danger
        onSecondary={() => setDiscardOpen(false)}
        onPrimary={() => { setDiscardOpen(false); onClose(); }}
      />
      <ConfirmModal
        open={updateOpen}
        title="Update Input Files?"
        description="This will replace the original files."
        primaryLabel="Update Inputs"
        secondaryLabel="Cancel"
        onSecondary={() => setUpdateOpen(false)}
        onPrimary={() => { onUpdateInputs(event.id, files); setUpdateOpen(false); onClose(); }}
      />
    </>,
    document.body,
  );
}
