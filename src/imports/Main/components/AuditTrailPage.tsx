import React, { useMemo, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { ConfigProvider, DatePicker } from 'antd';
import { Button } from '../../../components/ui/Button';
import { MemberSingleSelect } from '../../../components/ui/MemberSingleSelect';
import { AuditMultiSelect } from './AuditTrailFilters';
import { SearchBar } from '../../../components/ui/SearchBar';
import { SingleSelect } from '../../../components/ui/SingleSelect';
import { Tooltip } from '../../../components/ui/Tooltip';
import { DashboardIcon } from './DashboardPrimitives';
import historyIcon from '../../../icons/History Icon.svg';
import downloadIcon from '../../../icons/download-2-line.svg';
import leftIcon from '../../../icons/arrow-left-s-line.svg';
import rightIcon from '../../../icons/arrow-right-s-line.svg';
import './audit-trail.css';
import stackIcon from '../../../icons/stack-line.svg';
import studyIcon from '../../../icons/microscope-line.svg';
import eventIcon from '../../../icons/task-line.svg';
import tableIcon from '../../../icons/Table.svg';
import listingIcon from '../../../icons/Listing.svg';
import figureIcon from '../../../icons/Figure.svg';

type ObjectType = 'Project' | 'Study' | 'Event' | 'TFL';
type RecordRow = { id: number; time: string; operator: string; email?: string; type: ObjectType; kind?: 'Table' | 'Listing' | 'Figure'; object: string; project: string; study?: string; event?: string; action: string; changes: string[] };
type Filters = { range: [Dayjs, Dayjs]; operator: string; types: ObjectType[]; actions: string[] };
const ACTIONS: Record<ObjectType, string[]> = { Project: ['Create', 'Edit', 'Disable', 'Enable'], Study: ['Create', 'Edit', 'Disable', 'Enable'], Event: ['Create', 'Edit', 'Delete', 'Terminate'], TFL: ['Lock', 'Unlock'] };
const initialRange = (): [Dayjs, Dayjs] => [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')];
const emptyFilters = (): Filters => ({ range: initialRange(), operator: '', types: [], actions: [] });
// Illustrative records only. An audit service must supply authoritative, immutable history.
const sampleRows: RecordRow[] = [
  { id: 1, time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'), operator: 'Sarah Chen', email: 'sarah.chen@example.com', type: 'Event', object: 'Event 3', project: 'Project A', study: 'Study 01', action: 'Terminate', changes: ['Status: Running → Terminated'] },
  { id: 2, time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'), operator: 'System', type: 'TFL', kind: 'Table', object: 'Table 14.2.1', project: 'Project A', study: 'Study 01', event: 'Event 3', action: 'Lock', changes: ['Locked'] },
  { id: 3, time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'), operator: 'Emily Liu', email: 'emily.liu@example.com', type: 'Study', object: 'Study 02', project: 'Project A', study: 'Study 02', action: 'Disable', changes: ['Status: Active → Disabled'] },
  { id: 4, time: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'), operator: 'Alex Kim', email: 'alex.kim@example.com', type: 'Event', object: 'Event 5', project: 'Project B', study: 'Study 04', event: 'Event 5', action: 'Delete', changes: ['Event removed'] },
  { id: 5, time: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'), operator: 'Sarah Chen', email: 'sarah.chen@example.com', type: 'Project', object: 'Project B', project: 'Project B', action: 'Edit', changes: ['Name: Project Beta → Project B', 'Owner: Emily Liu → Alex Kim', 'Therapeutic area: Oncology → Hematology'] },
  { id: 6, time: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss'), operator: 'Emily Liu', email: 'emily.liu@example.com', type: 'TFL', kind: 'Listing', object: 'Listing 16.1.2', project: 'Project A', study: 'Study 01', event: 'Event 3', action: 'Unlock', changes: ['Unlocked'] },
  { id: 7, time: dayjs().subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss'), operator: 'System', type: 'TFL', kind: 'Figure', object: 'Figure 14.3.1', project: 'Project A', study: 'Study 01', event: 'Event 3', action: 'Lock', changes: ['Locked'] },
];
const iconFor = (row: RecordRow) => row.kind === 'Table' ? tableIcon : row.kind === 'Listing' ? listingIcon : row.kind === 'Figure' ? figureIcon : row.type === 'Project' ? stackIcon : row.type === 'Study' ? studyIcon : eventIcon;
const sameSet = <T,>(items: T[], item: T) => items.includes(item) ? items.filter(value => value !== item) : [...items, item];

export function AuditTrailPage({ headerLeading }: { headerLeading?: React.ReactNode }) {
  const [keyword, setKeyword] = useState('');
  const [panelOpen, setPanelOpen] = useState(true);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exportOpen, setExportOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState('');
  const update = (patch: Partial<Filters>) => setDraft(current => ({ ...current, ...patch }));
  const actionPool = [...new Set((draft.types.length ? draft.types : Object.keys(ACTIONS) as ObjectType[]).flatMap(type => ACTIONS[type]))];
  const filtered = useMemo(() => sampleRows.filter(row => {
    const query = keyword.trim().toLowerCase();
    return dayjs(row.time).isAfter(applied.range[0].subtract(1, 'second')) && dayjs(row.time).isBefore(applied.range[1].add(1, 'second'))
      && (!query || [row.operator, row.email, row.object, row.project, row.study, row.event].filter(Boolean).join(' ').toLowerCase().includes(query))
      && (!applied.operator || row.operator === applied.operator)
      && (!applied.types.length || applied.types.includes(row.type)) && (!applied.actions.length || applied.actions.includes(row.action));
  }).sort((a, b) => b.time.localeCompare(a.time)), [keyword, applied]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activeCount = (applied.operator ? 1 : 0) + applied.types.length + applied.actions.length + (applied.range[0].isSame(initialRange()[0], 'day') && applied.range[1].isSame(initialRange()[1], 'day') ? 0 : 1);
  const reset = () => { const next = emptyFilters(); setDraft(next); setApplied(next); setKeyword(''); setPage(1); };
  return <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-white px-[16px] pb-[20px] pt-[20px] font-body text-text-primary sm:px-[28px]">
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">{headerLeading}<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-az-secondary text-brand-1"><DashboardIcon src={historyIcon} /></span><h1 className="text-[22px] font-bold leading-[28px]">Audit Trail</h1></div>
      <div className="flex flex-wrap items-center gap-2"><SearchBar value={keyword} onChange={value => { setKeyword(value); setPage(1); }} placeholder="Search operator or object name" className="w-[260px]" /><Tooltip label="Export"><Button type="button" variant="icon" size="icon" onClick={() => setExportOpen(true)} aria-label="Export Audit Trail"><DashboardIcon src={downloadIcon} /></Button></Tooltip><Button type="button" variant="secondary" size="sm" onClick={() => setPanelOpen(open => !open)} aria-expanded={panelOpen}>Advanced Search {activeCount > 0 && <span className="rounded-sm bg-az-secondary px-1 text-brand-1">{activeCount}</span>}</Button></div>
    </header>
    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-graphite-10" aria-label="Audit records"><div className="min-h-0 flex-1 overflow-auto"><table className="w-full min-w-[820px] border-collapse text-left t-small"><thead className="sticky top-0 z-10 bg-bg-panel text-text-secondary"><tr>{['Time', 'Operator', 'Object', 'Action', 'Changes'].map(label => <th key={label} scope="col" className="border-b border-graphite-10 px-3 py-2 font-medium whitespace-nowrap">{label}</th>)}</tr></thead><tbody>{visible.map(row => { const path = row.type === 'Project' ? [] : row.type === 'Study' ? [row.project] : row.type === 'Event' ? [row.project, row.study] : [row.project, row.study, row.event]; const canExpand = row.changes.length > 1; const isExpanded = expanded.includes(row.id); return <tr key={row.id} className="border-b border-graphite-10 align-top"><td className="whitespace-nowrap px-3 py-3 tabular-nums">{row.time}</td><td className="px-3 py-3"><span className="block font-medium">{row.operator}</span>{row.email && <span className="block text-text-secondary">{row.email}</span>}</td><td className="px-3 py-3"><span className="flex items-start gap-2"><Tooltip label={row.kind ?? row.type}><span className="mt-0.5 inline-flex text-text-secondary"><DashboardIcon src={iconFor(row)} /></span></Tooltip><span><span className="block font-medium">{row.object}</span>{path.length > 0 && <span className="block text-text-secondary">{path.filter(Boolean).join(' › ')}</span>}</span></span></td><td className="px-3 py-3">{row.action}</td><td className="px-3 py-3"><div>{row.changes[0]} {canExpand && !isExpanded && <button type="button" className="t-small font-normal text-brand-1 hover:underline focus-visible:outline-brand-1" onClick={() => setExpanded(current => sameSet(current, row.id))} aria-expanded={false} aria-label={`Expand changes for ${row.object}`}>+{row.changes.length - 1} more</button>}</div>{canExpand && isExpanded && <><div className="mt-1 space-y-1">{row.changes.slice(1).map(change => <div key={change}>{change}</div>)}</div><button type="button" className="mt-2 block t-small font-normal text-brand-1 hover:underline focus-visible:outline-brand-1" onClick={() => setExpanded(current => sameSet(current, row.id))} aria-expanded={true} aria-label={`Collapse changes for ${row.object}`}>Show less</button></>}</td></tr>; })}</tbody></table>{filtered.length === 0 && <div className="p-12 text-center text-text-secondary">No matching records.<div className="mt-2"><Button type="button" variant="secondary" size="sm" onClick={reset}>Clear Filters</Button></div></div>}</div><footer className="flex flex-wrap items-center justify-end gap-2 border-t border-graphite-10 px-3 py-2 t-small text-text-secondary">
        <Button type="button" variant="icon" size="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><DashboardIcon src={leftIcon} /></Button>
        <span className="tabular-nums text-text-primary">{page} / {pageCount}</span>
        <Button type="button" variant="icon" size="icon" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage(page + 1)}><DashboardIcon src={rightIcon} /></Button>
        <div className="w-[108px]"><SingleSelect options={[10, 20, 50].map(size => ({ label: `${size} / page`, value: String(size) }))} value={String(pageSize)} onChange={size => { setPageSize(Number(size)); setPage(1); }} /></div>
        {pageCount > 1 && <form className="flex items-center gap-1" onSubmit={event => { event.preventDefault(); const target = Number(jumpValue); if (Number.isInteger(target) && target >= 1 && target <= pageCount) { setPage(target); setJumpValue(''); } }}><label htmlFor="audit-page-jump">Go to</label><input id="audit-page-jump" className="h-8 w-12 rounded-[4px] border border-form-border bg-white px-2 text-text-primary focus:border-brand-1 focus:outline-none" inputMode="numeric" value={jumpValue} onChange={event => setJumpValue(event.target.value)} /><Button type="submit" variant="secondary" size="sm">Go</Button></form>}
      </footer></section>
      {panelOpen && <aside className="flex max-h-full w-full shrink-0 flex-col gap-4 overflow-y-auto rounded-md border border-graphite-10 p-4 lg:w-[360px]" aria-label="Advanced Search"><div><span className="mb-1 block t-small-medium">Time Range</span><ConfigProvider theme={{ token: { colorPrimary: 'var(--color-brand-1)', colorPrimaryHover: 'var(--color-brand-1-hover)', colorText: 'var(--color-text-primary)', colorBorder: 'var(--color-form-border)', colorBgContainer: 'var(--color-background)', borderRadius: 4, fontFamily: 'Inter, sans-serif', fontSize: 12 } }}><DatePicker.RangePicker className="audit-range-picker" classNames={{ popup: { root: 'audit-range-popup shadow-elevation-overlay' } }} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" value={draft.range} allowClear={false} disabledDate={date => date.isAfter(dayjs(), 'day')} onChange={values => { if (values?.[0] && values?.[1]) update({ range: [values[0], values[1]] }); }} /></ConfigProvider></div>
        <MemberSingleSelect label="Operator" placeholder="All" showPlaceholderAvatar={false} includeAllOption searchPlaceholder="Search operators" options={[{ name: 'System', value: 'System' }, ...['Sarah Chen', 'Emily Liu', 'Alex Kim'].map(name => ({ name, value: name }))]} value={draft.operator || null} onChange={operator => update({ operator })} />
        <AuditMultiSelect<ObjectType> label="Object Type" options={Object.keys(ACTIONS) as ObjectType[]} value={draft.types} onChange={types => { const pool = new Set((types.length ? types : Object.keys(ACTIONS) as ObjectType[]).flatMap(type => ACTIONS[type])); update({ types, actions: draft.actions.filter(action => pool.has(action)) }); }} />
        <AuditMultiSelect label="Action" options={actionPool} value={draft.actions} onChange={actions => update({ actions })} />
        <div className="mt-auto flex justify-end gap-2"><Button type="button" variant="secondary" size="sm" onClick={reset}>Reset</Button><Button type="button" variant="primary" size="sm" onClick={() => { setApplied(draft); setPage(1); }}>Search</Button></div></aside>}
    </div>
    {exportOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setExportOpen(false); }}><div role="dialog" aria-modal="true" aria-label="Export Audit Trail" className="w-full max-w-[420px] rounded-md bg-white p-5 text-text-primary shadow-elevation-overlay"><h2 className="t-title-3">Export Audit Trail</h2><p className="my-3 t-small text-text-secondary">Live export requires a connected audit service. These illustrative records cannot be exported as an audit trail.</p><div className="flex justify-end"><Button type="button" variant="secondary" size="sm" onClick={() => setExportOpen(false)}>Close</Button></div></div></div>}
  </main>;
}
