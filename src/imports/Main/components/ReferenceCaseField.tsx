import React, { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import arrowIconUrl from '../../../icons/arrow-down-s-line.svg';
import { DropdownEmpty, DropdownSeparator } from '../../../components/ui/DropdownParts';
import { FormItem } from '../../../components/ui/FormItem';
import { OptionLabel } from '../../../components/ui/OptionLabel';
import { OptionList } from '../../../components/ui/OptionList';
import { Popover } from '../../../components/ui/Popover';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Tag } from '../../../components/ui/Tag';
import { Tooltip } from '../../../components/ui/Tooltip';

// Synthetic Demo fixtures only. The product's reference_case.payload bundles shell, code, and blueprint.
export interface ReferenceCase {
  id: string;
  studyId: string;
  studyTitle: string;
  eventId: string;
  eventTitle: string;
  tflId: string;
  tflTitle: string;
  kind: 'table' | 'listing';
}

export const CURRENT_STUDY_ID = 'AZE2001-301';
export const REFERENCE_CASES: ReferenceCase[] = [
  { id: 'case-t-1411', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '14.1.1', tflTitle: 'Disposition', kind: 'table' },
  { id: 'case-t-1414', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '14.1.4', tflTitle: 'Demographics (Full Analysis Set)', kind: 'table' },
  { id: 'case-t-1417', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '14.1.7', tflTitle: 'Disease Characteristics at Baseline', kind: 'table' },
  { id: 'case-t-1423', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '14.2.3', tflTitle: 'Treatment Exposure by Planned Treatment Group', kind: 'table' },
  { id: 'case-t-1432', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '14.3.2', tflTitle: 'Treatment-Emergent Adverse Events by System Organ Class and Preferred Term', kind: 'table' },
  { id: 'case-t-1437', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '14.3.7', tflTitle: 'Serious Adverse Events Leading to Treatment Discontinuation', kind: 'table' },
  { id: 'case-t-1439', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '14.3.9', tflTitle: 'Clinical Laboratory Values by Visit', kind: 'table' },
  { id: 'case-t-1444', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '14.4.4', tflTitle: 'Change from Baseline in Patient-Reported Outcomes', kind: 'table' },
  { id: 'case-t-1415', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'final-csr', eventTitle: 'Final CSR', tflId: '14.1.5', tflTitle: 'Baseline Characteristics', kind: 'table' },
  { id: 'case-t-1428', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'final-csr', eventTitle: 'Final CSR', tflId: '14.2.8', tflTitle: 'Progression-Free Survival', kind: 'table' },
  { id: 'case-t-1435', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'final-csr', eventTitle: 'Final CSR', tflId: '14.3.5', tflTitle: 'Adverse Events of Special Interest', kind: 'table' },
  { id: 'case-t-1441', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'followup', eventTitle: 'Long-Term Follow-Up Analysis', tflId: '14.4.1', tflTitle: 'Overall Survival by Randomized Treatment', kind: 'table' },
  { id: 'case-t-1426', studyId: 'AZE2001-303', studyTitle: 'Phase II NSCLC Dose-Ranging Study', eventId: 'dose-review', eventTitle: 'Dose Escalation Review', tflId: '14.2.6', tflTitle: 'Dose-Limiting Toxicities by Cohort', kind: 'table' },
  { id: 'case-t-1438', studyId: 'AZE2001-303', studyTitle: 'Phase II NSCLC Dose-Ranging Study', eventId: 'dose-review', eventTitle: 'Dose Escalation Review', tflId: '14.3.8', tflTitle: 'Laboratory Abnormalities by Worst Post-Baseline Grade', kind: 'table' },
  { id: 'case-t-1442', studyId: 'AZE2001-303', studyTitle: 'Phase II NSCLC Dose-Ranging Study', eventId: 'interim-efficacy', eventTitle: 'Interim Efficacy and Safety Analysis', tflId: '14.4.2', tflTitle: 'Best Overall Response per RECIST 1.1', kind: 'table' },
  { id: 'case-t-1451', studyId: 'AZE2001-304', studyTitle: 'Phase III NSCLC Biomarker-Selected Population and Exploratory Subgroup Study', eventId: 'biomarker', eventTitle: 'Exploratory Biomarker Analysis with Updated Data Cutoff', tflId: '14.5.1', tflTitle: 'Objective Response Rate by PD-L1 Expression Subgroup', kind: 'table' },
  { id: 'case-t-1452', studyId: 'AZE2001-304', studyTitle: 'Phase III NSCLC Biomarker-Selected Population and Exploratory Subgroup Study', eventId: 'biomarker', eventTitle: 'Exploratory Biomarker Analysis with Updated Data Cutoff', tflId: '14.5.2', tflTitle: 'Progression-Free Survival by Baseline Biomarker Status and Geographic Region', kind: 'table' },
  { id: 'case-l-1621', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '16.2.1', tflTitle: 'Subject Enrolment Listing', kind: 'listing' },
  { id: 'case-l-1624', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '16.2.4', tflTitle: 'Discontinuation Listing', kind: 'listing' },
  { id: 'case-l-1628', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '16.2.8', tflTitle: 'Serious Adverse Events Listing', kind: 'listing' },
  { id: 'case-l-1631', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '16.3.1', tflTitle: 'Concomitant Medications by Subject and Treatment Period', kind: 'listing' },
  { id: 'case-l-1632', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'safety-update', eventTitle: 'Safety Data Cutoff Review', tflId: '16.3.2', tflTitle: 'Adverse Events Leading to Dose Interruption', kind: 'listing' },
  { id: 'case-l-1633', studyId: CURRENT_STUDY_ID, studyTitle: 'Phase III NSCLC', eventId: 'csr-interim', eventTitle: 'Interim Analysis', tflId: '16.3.3', tflTitle: 'Protocol Deviations by Subject and Assessment Window', kind: 'listing' },
  { id: 'case-l-1622', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'final-csr', eventTitle: 'Final CSR', tflId: '16.2.2', tflTitle: 'Safety Listing', kind: 'listing' },
  { id: 'case-l-1627', studyId: 'AZE2001-302', studyTitle: 'Phase III NSCLC Extension', eventId: 'followup', eventTitle: 'Long-Term Follow-Up Analysis', tflId: '16.2.7', tflTitle: 'Deaths and Survival Follow-Up Listing', kind: 'listing' },
  { id: 'case-l-1634', studyId: 'AZE2001-303', studyTitle: 'Phase II NSCLC Dose-Ranging Study', eventId: 'dose-review', eventTitle: 'Dose Escalation Review', tflId: '16.3.4', tflTitle: 'Dose-Limiting Toxicity Assessment Listing', kind: 'listing' },
  { id: 'case-l-1638', studyId: 'AZE2001-304', studyTitle: 'Phase III NSCLC Biomarker-Selected Population and Exploratory Subgroup Study', eventId: 'biomarker', eventTitle: 'Exploratory Biomarker Analysis with Updated Data Cutoff', tflId: '16.3.8', tflTitle: 'Biomarker Samples and Assay Results by Subject', kind: 'listing' },
];

const tflName = (reference: ReferenceCase) => `${reference.tflId} ${reference.tflTitle}`;
const studyEventPath = (reference: ReferenceCase) => `${reference.studyTitle} / ${reference.eventTitle}`;
const REFERENCE_PROJECT_NAME = 'PRO001';
export const referencePath = (reference: ReferenceCase) => `${studyEventPath(reference)} / ${tflName(reference)}`;
export const referenceDiffValue = (reference: ReferenceCase | null) => reference ? referencePath(reference) : 'No Reference';

function TruncatedTooltip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const lines = Array.from(content.querySelectorAll<HTMLElement>('.truncate'));
    const measure = () => setTruncated(lines.some(line => line.scrollWidth > line.clientWidth + 1));
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    lines.forEach(line => observer.observe(line));
    measure();
    return () => observer.disconnect();
  }, [label]);

  return <Tooltip label={truncated ? label : undefined} className="w-full min-w-0" align="left">
    <span ref={contentRef} className="block w-full min-w-0">{children}</span>
  </Tooltip>;
}

function ReferenceNavigationRow({ children, trailing, label, onClick }: {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  label?: string;
  onClick: () => void;
}) {
  return <button type="button" aria-label={label} onMouseDown={event => event.preventDefault()} onClick={onClick}
    className="dropdown-item flex h-8 w-full items-center gap-2 rounded-[calc(var(--radius-xs)*2)] px-[6px] text-left t-small text-text-primary transition-colors hover:bg-bg-panel active:bg-graphite-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1">
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {trailing && <span className="shrink-0 text-text-secondary">{trailing}</span>}
  </button>;
}

interface ReferenceCaseFieldProps {
  value: ReferenceCase | null;
  disabled?: boolean;
  kind: 'table' | 'listing';
  currentTflId?: string;
  onChange: (reference: ReferenceCase) => void;
}

export function ReferenceCaseField({ value, disabled, kind, currentTflId, onChange }: ReferenceCaseFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<'studies' | 'tfls'>('tfls');
  const [studyId, setStudyId] = useState(CURRENT_STUDY_ID);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const available = useMemo(() => REFERENCE_CASES.filter(reference =>
    reference.kind === kind && reference.tflId !== currentTflId
  ), [kind, currentTflId]);
  const studies = useMemo(() => Array.from(new Map(available.map(reference =>
    [reference.studyId, reference.studyTitle] as const
  )).entries()).sort(([left], [right]) =>
    left === CURRENT_STUDY_ID ? -1 : right === CURRENT_STUDY_ID ? 1 : 0
  ), [available]);
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => available.filter(reference =>
    `${reference.tflId} ${reference.tflTitle} ${reference.eventTitle} ${reference.studyTitle}`
      .toLowerCase().includes(normalizedQuery)
  ).sort((left, right) =>
    Number(right.studyId === CURRENT_STUDY_ID) - Number(left.studyId === CURRENT_STUDY_ID)
  ), [available, normalizedQuery]);
  const visibleTfls = available.filter(reference => reference.studyId === studyId);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) { setLevel('tfls'); setStudyId(CURRENT_STUDY_ID); }
    setQuery('');
  };
  const keepSearchFocus = () => document.getElementById(popoverId)?.querySelector('input')?.focus();
  const triggerClasses = disabled
    ? 'cursor-not-allowed border border-form-border bg-bg-panel'
    : isOpen
      ? 'border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]'
      : 'border border-form-border bg-white hover:border-graphite-50';

  const referenceOption = (reference: ReferenceCase, searching: boolean) => (
    <TruncatedTooltip key={reference.id} label={<><span className="block">{tflName(reference)}</span><span className="block">{searching ? studyEventPath(reference) : reference.eventTitle}</span></>}>
      <OptionLabel label={tflName(reference)}
        description={searching ? studyEventPath(reference) : reference.eventTitle}
        truncateDescription showLabelTitle={false} selected={reference.id === value?.id} className="t-small"
        onClick={() => {
          if (reference.id !== value?.id) onChange(reference);
          handleOpenChange(false);
        }} />
    </TruncatedTooltip>
  );

  return (
    <div id="reference-case-field" className="rounded-[calc(var(--radius-xs)*2)] border border-transparent bg-white p-2">
      <FormItem label="Reference" labelClassName="t-small" disabled={disabled}>
        <TruncatedTooltip label={value && <><span className="block">{tflName(value)}</span><span className="block">{studyEventPath(value)}</span></>}>
          <button ref={triggerRef} type="button" disabled={disabled}
            aria-haspopup="dialog" aria-expanded={isOpen && !disabled}
            aria-controls={isOpen && !disabled ? popoverId : undefined}
            onClick={() => handleOpenChange(!isOpen)}
            className={`flex min-h-12 w-full items-center gap-2 rounded-[calc(var(--radius-xs)*2)] px-3 py-1 text-left transition-[border-color,box-shadow,background-color] ${triggerClasses}`}>
            <span className="min-w-0 flex-1">
              <span className={`block truncate t-small ${disabled ? 'text-graphite-40' : value ? 'text-text-primary' : 'text-text-secondary'}`}>
                {value ? tflName(value) : 'No Reference'}
              </span>
              {value && <span className={`block truncate t-footnote ${disabled ? 'text-graphite-40' : 'text-text-secondary'}`}>
                {studyEventPath(value)}
              </span>}
            </span>
            <img src={arrowIconUrl} alt="" className="size-5 shrink-0" />
          </button>
        </TruncatedTooltip>
      </FormItem>
      <Popover open={isOpen && !disabled} onOpenChange={handleOpenChange} anchorRef={triggerRef}
        id={popoverId} label="Reference" className="flex flex-col gap-1">
        <div className="sticky top-0 z-10 bg-white">
          <SearchBar value={query} onChange={setQuery} placeholder="Search Reference" size="compact" variant="embedded" autoFocus />
        </div>
        {normalizedQuery ? (
          <OptionList empty={results.length === 0} emptyContent="No Results Found" className="max-h-64">
            {results.map(reference => referenceOption(reference, true))}
          </OptionList>
        ) : level === 'studies' ? (
          <nav aria-label="Studies" className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {studies.length === 0 && <DropdownEmpty>No Results Found</DropdownEmpty>}
            {studies.map(([id, title], index) => (
              <React.Fragment key={id}>
                {index === 1 && studies[0][0] === CURRENT_STUDY_ID && <DropdownSeparator />}
                <TruncatedTooltip label={`${REFERENCE_PROJECT_NAME} / ${title}`}>
                  <ReferenceNavigationRow onClick={() => { keepSearchFocus(); setStudyId(id); setLevel('tfls'); }}
                    trailing={<span aria-hidden="true">›</span>}>
                    <span className="inline-flex max-w-full items-center gap-2 font-normal">
                      <span className="min-w-0 truncate">{REFERENCE_PROJECT_NAME} / {title}</span>
                      {id === CURRENT_STUDY_ID && <Tag className="shrink-0">Current</Tag>}
                    </span>
                  </ReferenceNavigationRow>
                </TruncatedTooltip>
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <>
            <div className="sticky top-8 z-10 border-b border-border-default bg-white pb-1">
              <ReferenceNavigationRow onClick={() => { keepSearchFocus(); setLevel('studies'); }} label="Back to studies">
                <span className="inline-flex max-w-full items-center gap-2">
                  <span aria-hidden="true">‹</span>
                  <span className="truncate">{studies.find(([id]) => id === studyId)?.[1] ?? 'Studies'}</span>
                </span>
              </ReferenceNavigationRow>
            </div>
            <OptionList empty={visibleTfls.length === 0} emptyContent="No Results Found" className="max-h-64">
              {visibleTfls.map(reference => referenceOption(reference, false))}
            </OptionList>
          </>
        )}
      </Popover>
    </div>
  );
}
