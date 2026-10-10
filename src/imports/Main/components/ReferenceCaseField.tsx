import React, { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import arrowIconUrl from '../../../icons/arrow-down-s-line.svg';
import arrowLeftIconUrl from '../../../icons/arrow-left-s-line.svg';
import arrowRightIconUrl from '../../../icons/arrow-right-s-line.svg';
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
const studyEventPath = (reference: ReferenceCase) => `${reference.studyId} / ${reference.eventTitle}`;
export const referencePath = (reference: ReferenceCase) => `${reference.studyTitle} / ${reference.eventTitle} / ${tflName(reference)}`;
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

  return <Tooltip label={truncated ? label : undefined} className="w-full min-w-0" placement="bottomLeft" offset={[0, 2]} alignTextToAnchor>
    <span ref={contentRef} className="block w-full min-w-0">{children}</span>
  </Tooltip>;
}

function ReferenceNavigationRow({ children, description, trailing, label, renderText, onClick, alignWithTflOptions = false }: {
  children: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  label?: string;
  renderText?: (content: React.ReactNode) => React.ReactNode;
  onClick: () => void;
  alignWithTflOptions?: boolean;
}) {
  return <button type="button" aria-label={label} onMouseDown={event => event.preventDefault()} onClick={onClick}
    className={`dropdown-item flex w-full items-center gap-2 rounded-[calc(var(--radius-xs)*2)] ${alignWithTflOptions ? 'pl-7 pr-[6px]' : 'px-[6px]'} text-left t-small text-text-primary transition-colors hover:bg-bg-panel active:bg-graphite-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1 ${description ? 'min-h-12 py-1' : 'h-8'}`}>
    {renderText ? renderText(<span className="block w-full min-w-0">
      <span className="block truncate">{children}</span>
      {description && <span className="block truncate t-footnote text-text-secondary">{description}</span>}
    </span>) : <span className="min-w-0 flex-1">
      <span className="block truncate">{children}</span>
      {description && <span className="block truncate t-footnote text-text-secondary">{description}</span>}
    </span>}
    {trailing && <span className="mr-0.5 shrink-0 text-text-secondary">{trailing}</span>}
  </button>;
}

interface ReferenceCaseFieldProps {
  value: ReferenceCase | null;
  disabled?: boolean;
  confirmed: boolean;
  onConfirm: () => void;
  confirmIcon: React.ReactNode;
  kind: 'table' | 'listing';
  currentTflId?: string;
  onChange: (reference: ReferenceCase) => void;
}

export function ReferenceCaseField({ value, disabled, confirmed, onConfirm, confirmIcon, kind, currentTflId, onChange }: ReferenceCaseFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<'studies' | 'events' | 'tfls'>('studies');
  const [studyId, setStudyId] = useState(CURRENT_STUDY_ID);
  const [eventId, setEventId] = useState('');
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const available = useMemo(() => REFERENCE_CASES.filter(reference =>
    reference.kind === kind && !(reference.studyId === CURRENT_STUDY_ID && reference.tflId === currentTflId)
  ), [kind, currentTflId]);
  const studies = useMemo(() => Array.from(new Map(available.map(reference =>
    [reference.studyId, reference.studyTitle] as const
  )).entries()).sort(([left], [right]) =>
    left === CURRENT_STUDY_ID ? -1 : right === CURRENT_STUDY_ID ? 1 : 0
  ), [available]);
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery ? available.filter(reference =>
    `${reference.tflId} ${reference.tflTitle}`.toLowerCase().includes(normalizedQuery)
  ) : [];
  const events = useMemo(() => Array.from(new Map(available.filter(reference => reference.studyId === studyId).map(reference =>
    [reference.eventId, reference.eventTitle] as const
  )).entries()), [available, studyId]);
  const visibleTfls = available.filter(reference =>
    reference.studyId === studyId && reference.eventId === eventId
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) { setLevel('studies'); setStudyId(CURRENT_STUDY_ID); setEventId(''); }
    setQuery('');
  };
  const keepSearchFocus = () => document.getElementById(popoverId)?.querySelector('input')?.focus();
  const triggerClasses = disabled
    ? 'cursor-not-allowed border border-form-border bg-bg-panel'
    : isOpen
      ? 'border border-brand-1 bg-white shadow-[0px_0px_0px_2px_var(--color-az-secondary)]'
      : 'border border-form-border bg-white hover:border-graphite-50';

  const referenceOption = (reference: ReferenceCase, description?: string) => (
      <OptionLabel key={reference.id} label={tflName(reference)}
        description={description}
        truncateDescription showLabelTitle={false} selected={reference.id === value?.id}
        className="t-small"
        renderText={content => <TruncatedTooltip label={<><span className="block">{tflName(reference)}</span>{description && <span className="block">{description}</span>}</>}>{content}</TruncatedTooltip>}
        onClick={() => {
          if (reference.id !== value?.id) onChange(reference);
          handleOpenChange(false);
        }} />
  );

  return (
    <div id="reference-case-field" className="rounded-[calc(var(--radius-xs)*2)] border border-transparent bg-white p-2">
      <FormItem label="Reference" labelClassName="t-small" disabled={disabled} actionButton={
        <button type="button" onClick={onConfirm} disabled={disabled}
          className={`flex size-4 items-center justify-center ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-bg-panel active:scale-[0.96]'}`}
          aria-label={confirmed ? 'Unconfirm Reference' : 'Confirm Reference'} aria-pressed={confirmed}>
          {confirmIcon}
        </button>
      }>
        <button ref={triggerRef} type="button" disabled={disabled}
            aria-haspopup="dialog" aria-expanded={isOpen && !disabled}
            aria-controls={isOpen && !disabled ? popoverId : undefined}
            onClick={() => handleOpenChange(!isOpen)}
            className={`flex min-h-12 w-full items-center gap-2 rounded-[calc(var(--radius-xs)*2)] pl-3 pr-[10px] py-1 text-left transition-[border-color,box-shadow,background-color] ${triggerClasses}`}>
          <TruncatedTooltip label={value && <><span className="block">{value.studyId} {value.studyTitle}</span><span className="block">{value.eventTitle}</span><span className="block">{tflName(value)}</span></>}>
            <span className="min-w-0 flex-1">
              <span className={`block truncate t-small ${disabled ? 'text-graphite-40' : value ? 'text-text-primary' : 'text-text-secondary'}`}>
                {value ? tflName(value) : 'No Reference'}
              </span>
              {value && <span className={`block truncate t-footnote ${disabled ? 'text-graphite-40' : 'text-text-secondary'}`}>
                {studyEventPath(value)}
              </span>}
            </span>
          </TruncatedTooltip>
            <img src={arrowIconUrl} alt="" className="size-5 shrink-0" />
        </button>
      </FormItem>
      <Popover open={isOpen && !disabled} onOpenChange={handleOpenChange} anchorRef={triggerRef}
        id={popoverId} label="Reference" className="flex flex-col gap-1">
        <div className="sticky top-0 z-10 bg-white">
          <SearchBar value={query} onChange={setQuery} placeholder="Search TFL ID or title…" size="compact" variant="embedded" autoFocus />
        </div>
        {normalizedQuery ? (
          <OptionList empty={searchResults.length === 0} className="max-h-64">
            {searchResults.map(reference => referenceOption(reference, studyEventPath(reference)))}
          </OptionList>
        ) : level === 'studies' ? (
          <nav aria-label="Studies" className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {studies.length === 0 && <DropdownEmpty />}
            {studies.map(([id, title], index) => (
              <React.Fragment key={id}>
                {index === 1 && studies[0][0] === CURRENT_STUDY_ID && <DropdownSeparator />}
                  <ReferenceNavigationRow onClick={() => { setStudyId(id); setEventId(''); setLevel('events'); setQuery(''); keepSearchFocus(); }}
                    description={title}
                    renderText={content => <TruncatedTooltip label={<><span className="block">{id}</span><span className="block">{title}</span></>}>{content}</TruncatedTooltip>}
                    trailing={<span aria-hidden="true" className="block size-4 bg-current" style={{ mask: `url("${arrowRightIconUrl}") center / contain no-repeat` }} />}>
                    <span className="inline-flex max-w-full items-center gap-2 font-normal">
                      <span className="min-w-0 truncate">{id}</span>
                      {id === CURRENT_STUDY_ID && <Tag className="shrink-0">Current</Tag>}
                    </span>
                  </ReferenceNavigationRow>
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <>
            <div className="sticky top-8 z-10 border-b border-border-default bg-white">
              <div className="flex items-center gap-1 pb-[4px] pl-0 pr-[8px]">
                <button type="button" onMouseDown={event => event.preventDefault()}
                  onClick={() => { setLevel(level === 'tfls' ? 'events' : 'studies'); setQuery(''); keepSearchFocus(); }}
                  className="flex size-[24px] shrink-0 items-center justify-center rounded-[calc(var(--radius-xs)*2)] text-text-secondary hover:bg-bg-panel active:bg-graphite-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-1"
                  aria-label={level === 'tfls' ? 'Back to events' : 'Back to studies'}>
                  <span aria-hidden="true" className="size-[16px] bg-current" style={{ mask: `url("${arrowLeftIconUrl}") center / contain no-repeat` }} />
                </button>
                <span className="t-small-medium min-w-0 flex-1 truncate text-text-secondary">
                  {level === 'events' ? `${studyId} ${studies.find(([id]) => id === studyId)?.[1] ?? ''}` : events.find(([id]) => id === eventId)?.[1] ?? ''}
                </span>
              </div>
            </div>
            {level === 'events' ? (
              <div className="flex flex-col gap-0.5">
                {events.length === 0 && <DropdownEmpty />}
                {events.map(([id, title]) => (
                  <ReferenceNavigationRow key={id} alignWithTflOptions onClick={() => { setEventId(id); setLevel('tfls'); setQuery(''); keepSearchFocus(); }}
                    renderText={content => <TruncatedTooltip label={title}>{content}</TruncatedTooltip>}
                    trailing={<span className="flex shrink-0 items-center gap-1"><span className="t-footnote text-text-secondary">{available.filter(reference => reference.studyId === studyId && reference.eventId === id).length}</span><span aria-hidden="true" className="block size-4 bg-current" style={{ mask: `url("${arrowRightIconUrl}") center / contain no-repeat` }} /></span>}>
                    {title}
                  </ReferenceNavigationRow>
                ))}
              </div>
            ) : <OptionList empty={visibleTfls.length === 0} className="max-h-64">
              {visibleTfls.map(reference => referenceOption(reference))}
            </OptionList>}
          </>
        )}
      </Popover>
    </div>
  );
}
