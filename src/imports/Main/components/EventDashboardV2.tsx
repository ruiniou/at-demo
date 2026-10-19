import React, { useMemo, useState } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Tag } from '../../../components/ui/Tag';
import { DashboardError, DashboardFrame, DashboardTable, MetricCard, ProgressBar, metricIcons, tdClass, thClass } from './DashboardPrimitives';
import { countStatuses, mockDashboardDataSource } from './dashboardData';
import type { DashboardTfl } from './dashboardData';

export type DashboardFilter = { status?: 'locked' | 'in-progress' | 'error' | 'stopped'; assignee?: string };
type SortKey = 'assigned' | 'completed';
type SortState = { key: SortKey; direction: 'asc' | 'desc' } | null;

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
    const result = a[sort.key] - b[sort.key];
    return result * (sort.direction === 'asc' ? 1 : -1);
  });
  const changeSort = (key: SortKey) => setSort((current) => !current || current.key !== key ? { key, direction: 'asc' } : current.direction === 'asc' ? { key, direction: 'desc' } : null);
  const percent = totals.total ? Math.round(totals.locked / totals.total * 100) : 0;
  const columns = ['Member', 'Assigned', 'Completed', 'Single-TFL Requests', 'Event Requests'] as const;
  const tflColumns = ['TFL', 'Assignee', 'Requests', 'Diff Accept Rounds'] as const;
  return <DashboardFrame title={event.name} updatedPlacement="title" headerLeading={headerLeading} updatedAt={updatedAt} onBack={onBack} onRefresh={() => setUpdatedAt(new Date())}>
    {loadState === 'error' ? <DashboardError onRetry={() => setUpdatedAt(new Date())} /> : <>
      {!tfls.length ? <section className="rounded-md border border-graphite-10 bg-white p-[24px] text-center t-body">No TFLs in this Event yet.</section> : <>
        <section aria-label="Event Metrics" className="dashboard-metric-grid gap-3">
          <MetricCard label="Completion" value={`${totals.locked} / ${totals.total}`} detail={`${percent}% locked`} icon={metricIcons.locked} iconTone="brand" onClick={() => onOpenTfl({ status: 'locked' })} />
          <MetricCard label="In Progress" value={totals.inProgress} detail="Active TFLs" icon={metricIcons.inProgress} iconTone="warning" onClick={() => onOpenTfl({ status: 'in-progress' })} />
          <MetricCard label="Error" value={totals.error} detail="Needs attention" icon={metricIcons.error} iconTone="danger" onClick={() => onOpenTfl({ status: 'error' })} />
          <MetricCard label="Unassigned" value={unassigned.length} detail="No owner yet" icon={metricIcons.unassigned} onClick={onOpenAssignment} />
        </section>
        <DashboardTable title="Team Progress" tools={<SearchBar variant="embedded" size="compact" value={search} onChange={setSearch} placeholder="Search Members" className="w-48" />} minWidth="min-w-3xl">
          <thead><tr>{columns.map((label) => {
            const key = label === 'Assigned' ? 'assigned' : label === 'Completed' ? 'completed' : null;
            return <th key={label} scope="col" aria-sort={key ? sort?.key === key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined} className={`${thClass} ${label === 'Member' ? '' : 'text-right'}`}>
              {key ? <button type="button" onClick={() => changeSort(key)} className="t-small inline-flex items-center justify-end gap-1 hover:text-text-primary focus-visible:outline-brand-1">{label}<span aria-hidden="true" className="inline-block w-3 text-center">{sort?.key === key ? sort.direction === 'asc' ? '↑' : '↓' : ''}</span></button> : label}
            </th>;
          })}</tr></thead>
          <tbody>
            {filtered.length ? filtered.map((member) => <tr key={member.name} className="hover:bg-bg-panel">
              <th scope="row" className={tdClass}><span className="flex min-w-0 items-center gap-[6px] text-[12px] font-normal"><Avatar name={member.name} level="modal" /><span className="min-w-0 truncate">{member.name}</span>{member.name === event.owner && <Tag className="shrink-0">Owner</Tag>}</span></th>
              <td className={`${tdClass} text-right tabular-nums`}>{member.assigned}</td>
              <td className={tdClass}><div className="flex items-center justify-end gap-3"><ProgressBar locked={member.completed} inProgress={0} error={0} total={member.assigned} label={`${member.name} completion`} /><span className="w-8 text-right tabular-nums">{member.completed}</span></div></td>
              <td className={`${tdClass} text-right tabular-nums`}>{member.singleTfl}</td><td className={`${tdClass} text-right tabular-nums`}>{member.event}</td>
            </tr>) : <tr><td colSpan={columns.length} className={`${tdClass} text-center text-text-secondary`}>No members found.</td></tr>}
          </tbody>
        </DashboardTable>
        <DashboardTable title="TFL Activity" minWidth="min-w-3xl">
          <thead><tr>{tflColumns.map((label) => <th key={label} scope="col" className={`${thClass} ${label === 'TFL' || label === 'Assignee' ? '' : 'text-right'}`}>{label}</th>)}</tr></thead>
          <tbody>{tfls.map((tfl) => {
            const activity = mockDashboardDataSource.activityFor(event.id, tfl);
            return <tr key={tfl.id} className="hover:bg-bg-panel">
              <th scope="row" className={tdClass}><span className="block min-w-0 truncate">{tfl.name}</span></th>
              <td className={tdClass}>{tfl.assignee ? <span className="flex min-w-0 items-center gap-[6px] text-[12px]"><Avatar name={tfl.assignee} level="modal" /><span className="min-w-0 truncate">{tfl.assignee}</span></span> : <span className="text-text-secondary">Unassigned</span>}</td>
              <td className={`${tdClass} text-right tabular-nums`}>{activity.requests}</td>
              <td className={`${tdClass} text-right tabular-nums`}>{activity.diffRounds}</td>
            </tr>;
          })}</tbody>
        </DashboardTable>
      </>}
    </>}
  </DashboardFrame>;
}
