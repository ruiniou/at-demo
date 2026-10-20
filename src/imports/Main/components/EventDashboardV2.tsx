import React, { useMemo, useReducer, useRef, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { CheckboxIndicator } from '../../../components/ui/CheckboxIndicator';
import { Popover } from '../../../components/ui/Popover';
import { SearchBar } from '../../../components/ui/SearchBar';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { StatusTag } from '../../../components/ui/StatusTag';
import { Tag } from '../../../components/ui/Tag';
import { Tooltip } from '../../../components/ui/Tooltip';
import { DashboardError, DashboardFrame, DashboardIcon, DashboardTable, MetricCard, ProgressBar, metricIcons, tdClass, thClass } from './DashboardPrimitives';
import { countStatuses, mockDashboardDataSource, requestsSentBy, tflActivity } from './dashboardData';
import type { DashboardStatus, DashboardTfl } from './dashboardData';
import wipIcon from '../../../icons/Status label/Status=WIP.svg';
import errorIcon from '../../../icons/Status label/Status=Error.svg';
import stoppedIcon from '../../../icons/Status label/Status=Stopped.svg';
import filterIcon from '../../../icons/filter-line.svg';

type SortKey = 'assigned';
type SortState = { key: SortKey; direction: 'asc' | 'desc' } | null;
// Matches the Events list StatusTag; Locked uses the Treelist lock icon.
const STATUS_DISPLAY: Record<DashboardStatus, React.ComponentProps<typeof StatusTag>> = {
  locked: { label: 'Locked', icon: metricIcons.locked, monochromeIcon: true },
  'in-progress': { label: 'In Progress', icon: wipIcon },
  error: { label: 'Error', icon: errorIcon, color: '#CC2C3C' },
  stopped: { label: 'Stopped', icon: stoppedIcon, color: 'var(--color-text-secondary)' },
};

type CardFilter = DashboardStatus | 'unassigned';
// Fixed column widths keep the table from resizing as filters change the visible rows.
const MEMBER_COLUMNS = ['', '240px', '200px', '180px'];
const TFL_COLUMNS = ['', '150px', '200px', '180px', '170px'];

/** Column-header filter: a funnel button with the selected count, and a dropdown that can be cleared. */
function ColumnFilter({ label, count, onClear, children }: { label: string; count: number; onClear: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={anchorRef} type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={`Filter by ${label}`} onClick={() => setOpen((value) => !value)} className={`t-small inline-flex items-center gap-1 rounded-sm hover:text-text-primary focus-visible:outline-brand-1 ${count ? 'text-brand-1' : ''}`}>{label}<DashboardIcon src={filterIcon} className="size-3.5" />{count > 0 && <span className="tabular-nums">{count}</span>}</button>
    <Popover anchorRef={anchorRef} open={open} onOpenChange={setOpen} width={200} label={`Filter by ${label}`}>
      <div className="flex flex-col gap-[2px] p-[4px]">
        <div className="flex items-center justify-between px-[8px] pb-[4px]">
          <span className="t-small-medium text-text-secondary">{label}</span>
          {count > 0 && <button type="button" onClick={onClear} className="t-small rounded-sm text-brand-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand-1">Clear</button>}
        </div>
        {children}
      </div>
    </Popover>
  </>;
}

export default function EventDashboardV2({ event, tfls, onBack, loadState = 'ready', headerLeading }: {
  event: { id: string; name: string; project: string; study: string; status: string; owner: string; teamMembers?: { name: string }[] };
  tfls: DashboardTfl[];
  onBack: () => void;
  loadState?: 'ready' | 'error';
  headerLeading?: React.ReactNode;
}) {
  const [, retry] = useReducer((count: number) => count + 1, 0);
  const [view, setView] = useState<'member' | 'tfl'>('member');
  const [statusFilter, setStatusFilter] = useState<Set<DashboardStatus>>(() => new Set());
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  // Set only by clicking a card; changing a header filter by hand drops the highlight.
  const [activeCard, setActiveCard] = useState<CardFilter | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const totals = useMemo(() => countStatuses(tfls, mockDashboardDataSource), [tfls]);
  const unassigned = tfls.filter((tfl) => !tfl.assignee);
  const memberNames = [...new Set([event.owner, ...(event.teamMembers ?? []).map((member) => member.name), ...tfls.map((tfl) => tfl.assignee).filter((name): name is string => Boolean(name))])].sort((a, b) => a.localeCompare(b));
  // Both views read one request log, so their request totals match for the Event.
  const log = useMemo(() => mockDashboardDataSource.requestLog(event.id, tfls, memberNames), [event.id, tfls, memberNames.join('|')]);
  const members = memberNames.map((name) => {
    const rows = tfls.filter((tfl) => tfl.assignee === name);
    const requests = requestsSentBy(log, name);
    return { name, assigned: rows.length, completed: rows.filter((tfl) => mockDashboardDataSource.statusOf(tfl) === 'locked').length, singleTfl: requests.singleTfl, event: requests.event };
  });
  const query = search.trim().toLowerCase();
  const filtered = members.filter((member) => member.name.toLowerCase().includes(query));
  const showUnassignedRow = unassigned.length > 0 && 'unassigned'.includes(query);
  if (sort) filtered.sort((a, b) => {
    const result = a[sort.key] - b[sort.key];
    return result * (sort.direction === 'asc' ? 1 : -1);
  });
  const filteredTfls = tfls.filter((tfl) => tfl.name.toLowerCase().includes(query)
    && (!statusFilter.size || statusFilter.has(mockDashboardDataSource.statusOf(tfl)))
    && (!unassignedOnly || !tfl.assignee));
  const statusOptions: DashboardStatus[] = totals.stopped ? ['locked', 'in-progress', 'error', 'stopped'] : ['locked', 'in-progress', 'error'];
  const toggleStatus = (status: DashboardStatus) => { setActiveCard(null); setStatusFilter((current) => { const next = new Set(current); next.has(status) ? next.delete(status) : next.add(status); return next; }); };
  // A card applies its own filter to the table below; clicking the active card clears it.
  const isCardActive = (card: CardFilter) => view === 'tfl' && activeCard === card;
  const applyCard = (card: CardFilter) => {
    const clear = isCardActive(card);
    setView('tfl'); setSearch('');
    setStatusFilter(clear || card === 'unassigned' ? new Set() : new Set([card]));
    setUnassignedOnly(!clear && card === 'unassigned');
    setActiveCard(clear ? null : card);
  };
  const changeSort = (key: SortKey) => setSort((current) => !current || current.key !== key ? { key, direction: 'asc' } : current.direction === 'asc' ? { key, direction: 'desc' } : null);
  const changeView = (next: 'member' | 'tfl') => { setView(next); setSearch(''); };
  const percent = totals.total ? Math.round(totals.locked / totals.total * 100) : 0;
  const columns = ['Member', 'TFL Progress', 'Single-TFL Requests Sent', 'Event Requests Sent'] as const;
  const tflColumns = ['TFL', 'Status', 'Assignee', 'Single-TFL Requests', 'Diff Accept Rounds'] as const;
  return <DashboardFrame title={event.name} headerLeading={headerLeading} onBack={onBack}>
    {loadState === 'error' ? <DashboardError onRetry={retry} /> : <>
      {!tfls.length ? <section className="rounded-md border border-graphite-10 bg-white p-[24px] text-center t-body">No TFLs in this Event yet.</section> : <>
        <section aria-label="Event Metrics" className="dashboard-metric-grid gap-3">
          <MetricCard label="Completion" value={`${totals.locked} / ${totals.total}`} detail={`${percent}% locked`} icon={metricIcons.locked} iconTone="brand" selected={isCardActive('locked')} onClick={() => applyCard('locked')} />
          <MetricCard label="In Progress" value={totals.inProgress} detail="Active TFLs" icon={metricIcons.inProgress} iconTone="warning" selected={isCardActive('in-progress')} onClick={() => applyCard('in-progress')} />
          <MetricCard label="Error" value={totals.error} detail="Needs attention" icon={metricIcons.error} iconTone="danger" selected={isCardActive('error')} onClick={() => applyCard('error')} />
          <MetricCard label="Unassigned" value={unassigned.length} detail="No owner yet" icon={metricIcons.unassigned} selected={isCardActive('unassigned')} onClick={() => applyCard('unassigned')} />
        </section>
        <DashboardTable title="Progress Details" minWidth={view === 'member' ? 'min-w-[860px]' : 'min-w-[980px]'} columns={view === 'member' ? MEMBER_COLUMNS : TFL_COLUMNS} tools={<div className="flex flex-wrap items-center gap-3">
          <SegmentedControl size="panel" value={view} onChange={(value) => changeView(value as 'member' | 'tfl')} options={[{ label: 'By Member', value: 'member' }, { label: 'By TFL', value: 'tfl' }]} />
          <SearchBar variant="embedded" size="compact" value={search} onChange={setSearch} placeholder={view === 'member' ? 'Search Members' : 'Search TFLs'} className="w-48" />
        </div>}>
          {view === 'member' ? <>
            <thead><tr>{columns.map((label) => {
              const key = label === 'TFL Progress' ? 'assigned' : null;
              return <th key={label} scope="col" aria-sort={key ? sort?.key === key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined} className={`${thClass} ${label === 'Member' || label === 'TFL Progress' ? '' : 'text-right'}`}>
                {key ? <button type="button" onClick={() => changeSort(key)} aria-label={`Sort by assigned TFLs`} className="t-small inline-flex items-center gap-1 hover:text-text-primary focus-visible:outline-brand-1">{label}<span aria-hidden="true" className="inline-block w-3 text-center">{sort?.key === key ? sort.direction === 'asc' ? '↑' : '↓' : ''}</span></button> : label}
              </th>;
            })}</tr></thead>
            <tbody>
              {filtered.length ? filtered.map((member) => <tr key={member.name} className="hover:bg-bg-panel">
                <th scope="row" className={tdClass}><span className="flex min-w-0 items-center gap-[6px] text-[12px] font-normal"><Avatar name={member.name} level="modal" /><span className="min-w-0 truncate">{member.name}</span>{member.name === event.owner && <Tag className="shrink-0">Owner</Tag>}</span></th>
                <td className={tdClass}><div className="flex min-w-40 items-center gap-2"><ProgressBar locked={member.completed} inProgress={0} error={0} total={member.assigned} label={`${member.name} TFL progress`} /><span className="whitespace-nowrap tabular-nums">{member.completed} / {member.assigned}</span></div></td>
                <td className={`${tdClass} text-right tabular-nums`}>{member.singleTfl}</td><td className={`${tdClass} text-right tabular-nums`}>{member.event}</td>
              </tr>) : !showUnassignedRow && <tr><td colSpan={columns.length} className={`${tdClass} text-center text-text-secondary`}>No members found.</td></tr>}
              {/* Unassigned is a read-only ownership bucket, not a member: it shows only when TFLs are unassigned, stays last, and sends no requests. */}
              {showUnassignedRow && <tr className="bg-bg-panel">
                <th scope="row" className={tdClass}><span className="flex min-w-0 items-center gap-[6px] text-[12px] font-normal text-text-secondary"><Avatar level="modal" />Unassigned</span></th>
                <td className={`${tdClass} tabular-nums text-text-secondary`}>{unassigned.length} {unassigned.length === 1 ? 'TFL' : 'TFLs'} not assigned</td>
                <td className={`${tdClass} text-right text-text-secondary`}>—</td><td className={`${tdClass} text-right text-text-secondary`}>—</td>
              </tr>}
            </tbody>
          </> : <>
            <thead><tr>{tflColumns.map((label) => <th key={label} scope="col" className={`${thClass} ${['TFL', 'Status', 'Assignee'].includes(label) ? '' : 'text-right'}`}>
              {label === 'Status' ? <ColumnFilter label="Status" count={statusFilter.size} onClear={() => { setStatusFilter(new Set()); setActiveCard(null); }}>
                {statusOptions.map((status) => <button key={status} type="button" aria-pressed={statusFilter.has(status)} onClick={() => toggleStatus(status)} className="flex items-center gap-[8px] rounded-[4px] px-[8px] py-[6px] text-left text-text-primary transition-colors hover:bg-bg-panel">
                  <CheckboxIndicator checked={statusFilter.has(status)} size={14} />
                  <StatusTag {...STATUS_DISPLAY[status]} />
                </button>)}
              </ColumnFilter> : label === 'Assignee' ? <ColumnFilter label="Assignee" count={unassignedOnly ? 1 : 0} onClear={() => { setUnassignedOnly(false); setActiveCard(null); }}>
                <button type="button" aria-pressed={unassignedOnly} onClick={() => { setActiveCard(null); setUnassignedOnly((value) => !value); }} className="flex items-center gap-[8px] rounded-[4px] px-[8px] py-[6px] text-left text-text-primary transition-colors hover:bg-bg-panel">
                  <CheckboxIndicator checked={unassignedOnly} size={14} />
                  <span className="t-small">Unassigned</span>
                </button>
              </ColumnFilter> : label}
            </th>)}</tr></thead>
            <tbody>{filteredTfls.length ? filteredTfls.map((tfl) => {
              const activity = tflActivity(log, tfl.id);
              const status = STATUS_DISPLAY[mockDashboardDataSource.statusOf(tfl)];
              return <tr key={tfl.id} className="hover:bg-bg-panel">
                <th scope="row" className={`${tdClass} font-normal`}><span className="block min-w-0 truncate">{tfl.name}</span></th>
                <td className={tdClass}><StatusTag {...status} /></td>
                <td className={tdClass}>{tfl.assignee ? <span className="flex min-w-0 items-center gap-[6px] text-[12px]"><Avatar name={tfl.assignee} level="modal" /><span className="min-w-0 truncate">{tfl.assignee}</span></span> : <span className="text-text-secondary">Unassigned</span>}</td>
                <td className={`${tdClass} text-right tabular-nums`}>{activity.requests}</td>
                <td className={`${tdClass} text-right tabular-nums`}>{activity.diffRounds === null ? <Tooltip label="No request on this TFL links to a Diff."><span tabIndex={0} className="text-text-secondary">—</span></Tooltip> : activity.diffRounds}</td>
              </tr>;
            }) : <tr><td colSpan={tflColumns.length} className={`${tdClass} text-center text-text-secondary`}>No TFLs found.</td></tr>}</tbody>
          </>}
        </DashboardTable>
      </>}
    </>}
  </DashboardFrame>;
}
