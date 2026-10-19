import React, { useMemo, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { FilterChip } from '../../../components/ui/FilterChip';
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

export type DashboardFilter = { status?: 'locked' | 'in-progress' | 'error' | 'stopped'; assignee?: string };
type SortKey = 'assigned';
type SortState = { key: SortKey; direction: 'asc' | 'desc' } | null;
const UNASSIGNED = '__unassigned';
// Matches the Events list StatusTag; Locked uses the Treelist lock icon.
const STATUS_DISPLAY: Record<DashboardStatus, React.ComponentProps<typeof StatusTag>> = {
  locked: { label: 'Locked', icon: metricIcons.locked, monochromeIcon: true },
  'in-progress': { label: 'In Progress', icon: wipIcon },
  error: { label: 'Error', icon: errorIcon, color: '#CC2C3C' },
  stopped: { label: 'Stopped', icon: stoppedIcon, color: 'var(--color-text-secondary)' },
};

export default function EventDashboardV2({ event, tfls, onBack, onOpenTfl, onOpenAssignment, loadState = 'ready', headerLeading }: {
  event: { id: string; name: string; project: string; study: string; status: string; owner: string; teamMembers?: { name: string }[] };
  tfls: DashboardTfl[];
  onBack: () => void;
  onOpenTfl: (filter: DashboardFilter) => void;
  onOpenAssignment: () => void;
  loadState?: 'ready' | 'error';
  headerLeading?: React.ReactNode;
}) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [view, setView] = useState<'member' | 'tfl'>('member');
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
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
  const filteredTfls = tfls.filter((tfl) => tfl.name.toLowerCase().includes(query) && (assigneeFilter === 'all' || (assigneeFilter === UNASSIGNED ? !tfl.assignee : tfl.assignee === assigneeFilter)));
  const changeSort = (key: SortKey) => setSort((current) => !current || current.key !== key ? { key, direction: 'asc' } : current.direction === 'asc' ? { key, direction: 'desc' } : null);
  const changeView = (next: 'member' | 'tfl') => { setView(next); setSearch(''); };
  // Assigned follows the current assignee, so it opens the TFLs that member owns now.
  const openMemberTfls = (name: string) => { setAssigneeFilter(name); changeView('tfl'); };
  // Locked / assigned sit next to the bar so the count reads as that bar's value.
  const progressCell = (completed: number, assigned: number, name: string) => <td className={tdClass}><div className="flex min-w-40 items-center gap-2">
    <ProgressBar locked={completed} inProgress={0} error={0} total={assigned} label={`${name} TFL progress`} />
    {assigned ? <Tooltip label="View TFLs"><button type="button" onClick={() => openMemberTfls(name)} aria-label={`View ${assigned} TFLs for ${name}`} className="whitespace-nowrap rounded-sm tabular-nums underline-offset-2 hover:text-brand-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand-1">{completed} / {assigned}</button></Tooltip> : <span className="tabular-nums text-text-secondary">0 / 0</span>}
  </div></td>;
  const percent = totals.total ? Math.round(totals.locked / totals.total * 100) : 0;
  const columns = ['Member', 'TFL Progress', 'Single-TFL Requests Sent', 'Event Requests Sent'] as const;
  const tflColumns = ['TFL', 'Status', 'Assignee', 'Requests (All Members)', 'Diff Accept Rounds'] as const;
  const assigneeOptions = [{ label: 'All Assignees', value: 'all' }, ...memberNames.map((name) => ({ label: name, value: name })), { label: 'Unassigned', value: UNASSIGNED }];
  return <DashboardFrame title={event.name} updatedPlacement="title" headerLeading={headerLeading} updatedAt={updatedAt} onBack={onBack} onRefresh={() => setUpdatedAt(new Date())}>
    {loadState === 'error' ? <DashboardError onRetry={() => setUpdatedAt(new Date())} /> : <>
      {!tfls.length ? <section className="rounded-md border border-graphite-10 bg-white p-[24px] text-center t-body">No TFLs in this Event yet.</section> : <>
        <section aria-label="Event Metrics" className="dashboard-metric-grid gap-3">
          <MetricCard label="Completion" value={`${totals.locked} / ${totals.total}`} detail={`${percent}% locked`} icon={metricIcons.locked} iconTone="brand" onClick={() => onOpenTfl({ status: 'locked' })} />
          <MetricCard label="In Progress" value={totals.inProgress} detail="Active TFLs" icon={metricIcons.inProgress} iconTone="warning" onClick={() => onOpenTfl({ status: 'in-progress' })} />
          <MetricCard label="Error" value={totals.error} detail="Needs attention" icon={metricIcons.error} iconTone="danger" onClick={() => onOpenTfl({ status: 'error' })} />
          <MetricCard label="Unassigned" value={unassigned.length} detail="No owner yet" icon={metricIcons.unassigned} onClick={onOpenAssignment} />
        </section>
        <DashboardTable title="Progress Details" minWidth="min-w-3xl" tools={<div className="flex flex-wrap items-center gap-3">
          <SegmentedControl size="panel" value={view} onChange={(value) => changeView(value as 'member' | 'tfl')} options={[{ label: 'By Member', value: 'member' }, { label: 'By TFL', value: 'tfl' }]} />
          {view === 'tfl' && <FilterChip type="Dropdown" variant="filter" icon={<DashboardIcon src={metricIcons.unassigned} />} aria-label="Assignee" label="All Assignees" value={assigneeFilter} onChange={setAssigneeFilter} options={assigneeOptions} />}
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
                {progressCell(member.completed, member.assigned, member.name)}
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
            <thead><tr>{tflColumns.map((label) => <th key={label} scope="col" className={`${thClass} ${['TFL', 'Status', 'Assignee'].includes(label) ? '' : 'text-right'}`}>{label}</th>)}</tr></thead>
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
