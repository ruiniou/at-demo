import React, { useMemo, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Tag } from '../../../components/ui/Tag';
import { DashboardError, DashboardFrame, DashboardNotice, DashboardTable, MetricCard, ProgressBar, metricIcons, tdClass, thClass } from './DashboardPrimitives';
import { countStatuses, mockDashboardDataSource } from './dashboardData';
import type { DashboardTfl } from './dashboardData';

export type DashboardFilter = { status?: 'locked' | 'in-progress' | 'error' | 'stopped'; assignee?: string };
type SortKey = 'name' | 'assigned' | 'completed' | 'singleTfl' | 'event';
type SortState = { key: SortKey; direction: 'asc' | 'desc' } | null;

export default function EventDashboardV2({ event, tfls, onBack, onOpenTfl, onOpenAssignment, loadState = 'ready' }: {
  event: { id: string; name: string; project: string; study: string; status: string; owner: string; teamMembers?: { name: string }[] };
  tfls: DashboardTfl[];
  onBack: () => void;
  onOpenTfl: (filter: DashboardFilter) => void;
  onOpenAssignment: () => void;
  loadState?: 'ready' | 'error';
}) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const totals = useMemo(() => countStatuses(tfls, mockDashboardDataSource), [tfls]);
  const unassigned = tfls.filter((tfl) => !tfl.assignee);
  const memberNames = [...new Set([event.owner, ...(event.teamMembers ?? []).map((member) => member.name), ...tfls.map((tfl) => tfl.assignee).filter((name): name is string => Boolean(name))])].sort((a, b) => a.localeCompare(b));
  const members = memberNames.map((name) => {
    const rows = tfls.filter((tfl) => tfl.assignee === name);
    const requests = mockDashboardDataSource.requestsFor(event.id, name);
    return { name, assigned: rows.length, completed: rows.filter((tfl) => mockDashboardDataSource.statusOf(tfl) === 'locked').length, singleTfl: requests.singleTfl, event: requests.event };
  });
  const filtered = members.filter((member) => member.name.toLowerCase().includes(search.trim().toLowerCase()));
  if (sort) filtered.sort((a, b) => {
    const result = sort.key === 'name' ? a.name.localeCompare(b.name) : (a[sort.key] ?? -1) - (b[sort.key] ?? -1);
    return result * (sort.direction === 'asc' ? 1 : -1);
  });
  const changeSort = (key: SortKey) => setSort((current) => !current || current.key !== key ? { key, direction: 'asc' } : current.direction === 'asc' ? { key, direction: 'desc' } : null);
  const percent = totals.total ? Math.round(totals.locked / totals.total * 100) : 0;
  const subtitle = `${totals.locked} of ${totals.total} TFLs locked · Event Owner: ${event.owner}${totals.stopped ? ` · ${totals.stopped} Stopped` : ''}`;
  const columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Member' }, { key: 'assigned', label: 'Assigned' }, { key: 'completed', label: 'Completed' },
    { key: 'singleTfl', label: 'Single-TFL Requests' }, { key: 'event', label: 'Event Requests' },
  ];
  const unassignedCompleted = unassigned.filter((tfl) => mockDashboardDataSource.statusOf(tfl) === 'locked').length;
  return <DashboardFrame title={event.name} subtitle={subtitle} updatedAt={updatedAt} onBack={onBack} onRefresh={() => setUpdatedAt(new Date())}>
    {loadState === 'error' ? <DashboardError onRetry={() => setUpdatedAt(new Date())} /> : <>
      {event.status === 'ai-processing' && <DashboardNotice>First-round generation is in progress. Numbers update as TFLs complete.</DashboardNotice>}
      {event.status === 'stopped' && <DashboardNotice>This Event was terminated. Counts show the state at termination.</DashboardNotice>}
      {!tfls.length ? <section className="rounded-md border border-graphite-10 bg-white p-[24px] text-center t-body">No TFLs in this Event yet.</section> : <>
        <section aria-label="Event Metrics" className="dashboard-metric-grid gap-3">
          <MetricCard label="Locked" value={totals.locked} detail={`of ${totals.total} TFLs · ${percent}%`} icon={metricIcons.locked} status="locked" lockedTooltip onClick={() => onOpenTfl({ status: 'locked' })} />
          <MetricCard label="In Progress" value={totals.inProgress} status="in-progress" onClick={() => onOpenTfl({ status: 'in-progress' })} />
          <MetricCard label="Error" value={totals.error} icon={metricIcons.error} status="error" onClick={() => onOpenTfl({ status: 'error' })} />
          <MetricCard label="Unassigned" value={unassigned.length} icon={metricIcons.unassigned} onClick={onOpenAssignment} />
        </section>
        <DashboardTable title="Team Progress" tools={<SearchBar variant="embedded" size="compact" value={search} onChange={setSearch} placeholder="Search Members" className="w-48" />} minWidth="min-w-3xl">
          <thead><tr>{columns.map(({ key, label }) => <th key={key} scope="col" aria-sort={sort?.key === key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none'} className={`${thClass} ${key === 'name' ? '' : 'text-right'}`}><button type="button" onClick={() => changeSort(key)} className="hover:text-text-primary focus-visible:outline-brand-1">{label}{sort?.key === key ? sort.direction === 'asc' ? ' ↑' : ' ↓' : ''}</button></th>)}</tr></thead>
          <tbody>
            {filtered.length ? filtered.map((member) => <tr key={member.name} className="hover:bg-bg-panel">
              <th scope="row" className={tdClass}><span className="flex min-w-0 items-center gap-[6px] text-[12px] font-normal"><Avatar name={member.name} level="modal" /><button type="button" onClick={() => onOpenTfl({ assignee: member.name })} className="min-w-0 truncate text-left hover:text-brand-1 hover:underline">{member.name}</button>{member.name === event.owner && <Tag className="shrink-0">Owner</Tag>}</span></th>
              <td className={`${tdClass} text-right tabular-nums`}>{member.assigned}</td>
              <td className={tdClass}><div className="flex items-center justify-end gap-3"><ProgressBar locked={member.completed} inProgress={0} error={0} total={member.assigned} label={`${member.name} completion`} /><span className="w-8 text-right tabular-nums">{member.completed}</span></div></td>
              <td className={`${tdClass} text-right tabular-nums`}>{member.singleTfl ?? '—'}</td><td className={`${tdClass} text-right tabular-nums`}>{member.event ?? '—'}</td>
            </tr>) : <tr><td colSpan={columns.length} className={`${tdClass} text-center text-text-secondary`}>No members found.</td></tr>}
            <tr className="bg-bg-panel"><th scope="row" className={tdClass}><span className="flex items-center gap-[6px] text-[12px] font-normal"><Avatar level="modal" /><button type="button" onClick={onOpenAssignment} className="hover:text-brand-1 hover:underline">Unassigned</button></span></th><td className={`${tdClass} text-right tabular-nums`}>{unassigned.length}</td><td className={tdClass}><div className="flex items-center justify-end gap-3"><ProgressBar locked={unassignedCompleted} inProgress={0} error={0} total={unassigned.length} label="Unassigned completion" /><span className="w-8 text-right tabular-nums">{unassignedCompleted}</span></div></td><td className={`${tdClass} text-right`}>—</td><td className={`${tdClass} text-right`}>—</td></tr>
          </tbody>
        </DashboardTable>
      </>}
    </>}
  </DashboardFrame>;
}
