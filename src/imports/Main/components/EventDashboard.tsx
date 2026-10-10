import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../../../components/ui/Button';

export type DashboardTfl = {
  id: string;
  name: string;
  status: string;
  docType?: 'table' | 'listing' | 'figure';
  assignee?: string;
};
export type DashboardFilter = {
  status?: 'locked' | 'in-progress' | 'error' | 'stopped';
  docType?: 'table' | 'listing' | 'figure';
  assignee?: string;
  unassigned?: boolean;
};

type Bucket = 'locked' | 'in-progress' | 'error' | 'stopped';
const bucket = (tfl: DashboardTfl): Bucket => {
  if (tfl.status === 'locked') return 'locked';
  if (tfl.status === 'error') return 'error';
  if (tfl.status === 'stopped') return 'stopped';
  return 'in-progress';
};
const bucketLabels: Record<Bucket, string> = {
  locked: 'Locked', 'in-progress': 'In progress', error: 'Error', stopped: 'Stopped',
};
const bucketColors: Record<Bucket, string> = {
  locked: 'var(--color-brand-1)',
  'in-progress': 'var(--color-graphite-40)',
  error: 'var(--color-status-error)',
  stopped: 'var(--color-status-warning)',
};
const buckets: Bucket[] = ['locked', 'in-progress', 'error', 'stopped'];
const outputTypes = [
  { key: 'table', label: 'Tables' },
  { key: 'listing', label: 'Listings' },
  { key: 'figure', label: 'Figures' },
] as const;

function Metric({ label, value, note, onClick, tone = 'default' }: {
  label: string; value: string | number; note?: string; onClick?: () => void; tone?: 'default' | 'alert';
}) {
  return <div className="min-w-0 rounded-lg border border-border-default bg-white px-4 py-4">
    <p className="t-small text-text-secondary">{label}</p>
    {onClick ? <button type="button" onClick={onClick} className={`mt-2 block text-2xl font-semibold tabular-nums hover:underline focus-visible:underline ${tone === 'alert' ? 'text-status-error' : 'text-brand-1'}`} aria-label={`${label}: ${value}. Open details`}>{value}</button>
      : <p className={`mt-2 text-2xl font-semibold tabular-nums ${tone === 'alert' ? 'text-status-error' : 'text-text-primary'}`}>{value}</p>}
    {note && <p className="mt-1 t-small text-text-secondary">{note}</p>}
  </div>;
}

export default function EventDashboard({ event, tfls, onBack, onOpenTfl, onOpenAssignment, canAssign }: {
  event: { name: string; project: string; study: string; status: string; owner: string; teamMembers?: { name: string }[] };
  tfls: DashboardTfl[];
  onBack: () => void;
  onOpenTfl: (filter: DashboardFilter) => void;
  onOpenAssignment: () => void;
  canAssign: boolean;
}) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const totals = useMemo(() => Object.fromEntries(buckets.map((key) => [key, tfls.filter((tfl) => bucket(tfl) === key).length])) as Record<Bucket, number>, [tfls]);
  const unassigned = tfls.filter((tfl) => !tfl.assignee);
  const visibleBuckets = totals.stopped ? buckets : buckets.slice(0, 3);
  const members = [...new Set([event.owner, ...(event.teamMembers ?? []).map((member) => member.name), ...tfls.map((tfl) => tfl.assignee).filter((name): name is string => Boolean(name))])].sort((a, b) => a.localeCompare(b));
  const completed = tfls.length ? Math.round(totals.locked / tfls.length * 100) : 0;
  const typeRows = outputTypes.map(({ key, label }) => {
    const rows = tfls.filter((tfl) => (tfl.docType || 'table') === key);
    return { key, name: label, total: rows.length, ...Object.fromEntries(buckets.map((state) => [state, rows.filter((row) => bucket(row) === state).length])) } as { key: typeof key; name: string; total: number } & Record<Bucket, number>;
  });
  const snapshot = updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  const tooltipStyle = { border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)' };

  return <main className="h-full min-w-0 overflow-y-auto bg-bg-panel font-body text-text-primary">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border-default pb-5">
        <div className="min-w-0">
          <button type="button" onClick={onBack} className="t-small mb-3 text-brand-1 hover:underline focus-visible:underline">← Back to Event</button>
          <p className="t-small text-text-secondary">{event.project} / {event.study} / {event.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold">Event Dashboard</h1><span className="rounded-sm bg-az-secondary px-2 py-0.5 t-small text-brand-1">Preview data</span></div>
          <p className="mt-1 t-small text-text-secondary">Current TFL status and team assignment</p>
        </div>
        <div className="flex items-center gap-3 pt-1"><span className="t-small text-text-secondary">As of {snapshot}</span><Button variant="secondary" size="sm" onClick={() => setUpdatedAt(new Date())}>Refresh</Button></div>
      </header>
      {event.status === 'ai-processing' && <div className="rounded-lg border border-status-warning-border bg-status-warning-bg p-3 t-small">Initial TFL generation is in progress. Counts may change.</div>}
      {event.status === 'stopped' && <div className="rounded-lg border border-status-warning-border bg-status-warning-bg p-3 t-small">This Event is stopped. The snapshot shows its current TFL states.</div>}
      {!tfls.length ? <section className="rounded-lg border border-border-default bg-white p-8 text-center"><h2 className="t-heading">No TFLs yet</h2><p className="mt-2 t-small text-text-secondary">Progress will appear when TFLs are available.</p></section> : <>
        <section aria-label="Overall progress" className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-border-default bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="t-heading">Completion</h2>
              <button type="button" onClick={() => onOpenTfl({})} className="t-small text-brand-1 hover:underline focus-visible:underline">Total TFLs {tfls.length}</button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-7 sm:justify-start">
              <div className="relative h-44 w-44 shrink-0" role="img" aria-label={`${completed}% complete: ${totals.locked} of ${tfls.length} TFLs locked`}>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Locked', value: totals.locked }, { name: 'Remaining', value: tfls.length - totals.locked }]} dataKey="value" innerRadius={62} outerRadius={77} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}><Cell fill={bucketColors.locked} /><Cell fill="var(--color-graphite-10)" /></Pie></PieChart></ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-4xl font-semibold tabular-nums">{completed}%</strong><span className="t-small text-text-secondary">complete</span></div>
              </div>
              <div className="min-w-0">
                <p className="t-small text-text-secondary">Locked</p>
                <button type="button" disabled={!totals.locked} onClick={() => onOpenTfl({ status: 'locked' })} className="mt-1 text-xl font-semibold tabular-nums text-brand-1 hover:underline disabled:cursor-default disabled:text-text-primary disabled:no-underline" aria-label={`Locked: ${totals.locked} of ${tfls.length}. View TFLs`}>{totals.locked} / {tfls.length}</button>
              </div>
            </div>
          </div>
          <div className={`grid gap-3 ${totals.stopped ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3 md:grid-cols-1'}`}>
            <Metric label="In progress" value={totals['in-progress']} onClick={totals['in-progress'] ? () => onOpenTfl({ status: 'in-progress' }) : undefined} />
            <Metric label="Error" value={totals.error} tone={totals.error ? 'alert' : 'default'} onClick={totals.error ? () => onOpenTfl({ status: 'error' }) : undefined} />
            <Metric label="Unassigned" value={unassigned.length} onClick={unassigned.length && canAssign ? onOpenAssignment : undefined} />
            {totals.stopped > 0 && <Metric label="Stopped" value={totals.stopped} onClick={() => onOpenTfl({ status: 'stopped' })} />}
          </div>
        </section>
        <section className="rounded-lg border border-border-default bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="t-heading">Progress by output type</h2><p className="t-small text-text-secondary">TFL count</p></div>
          <div className="mt-4 h-56 min-w-0" role="img" aria-label={typeRows.map((row) => `${row.name}: ${row.total} TFLs, ${row.locked} locked, ${row['in-progress']} in progress, ${row.error} error`).join('; ')}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeRows} layout="vertical" margin={{ top: 0, right: 26, bottom: 0, left: 12 }} barSize={24}>
                <CartesianGrid horizontal={false} stroke="var(--color-graphite-10)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={94} tickFormatter={(name: string) => { const row = typeRows.find((item) => item.name === name); return `${name} (${row?.total ?? 0})`; }} tick={{ fill: 'var(--color-text-primary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [value, bucketLabels[name as Bucket] ?? name]} />
                {visibleBuckets.map((status) => <Bar key={status} dataKey={status} stackId="status" fill={bucketColors[status]} isAnimationActive={false}>
                  <LabelList dataKey={status} position="center" fill={status === 'in-progress' || status === 'stopped' ? 'var(--color-text-primary)' : 'white'} fontSize={12} formatter={(value: number) => value > 0 ? value : ''} />
                </Bar>)}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{visibleBuckets.map((key) => <span key={key} className="flex items-center gap-2 t-small text-text-secondary"><span className="size-2.5 rounded-full" style={{ backgroundColor: bucketColors[key] }} />{bucketLabels[key]}</span>)}</div>
          <details className="mt-4 border-t border-border-default pt-3 t-small"><summary className="cursor-pointer text-brand-1 hover:underline">View exact counts</summary>
            <div className="mt-3 overflow-x-auto"><table className="w-full min-w-lg text-left"><thead className="text-text-secondary"><tr><th scope="col" className="pb-2 font-medium">Output</th><th scope="col" className="pb-2 text-right font-medium">Total</th>{visibleBuckets.map((key) => <th scope="col" key={key} className="pb-2 text-right font-medium">{bucketLabels[key]}</th>)}</tr></thead><tbody>{typeRows.map((row) => <tr key={row.key} className="border-t border-graphite-10"><th scope="row" className="py-2 font-medium">{row.name}</th><td className="py-2 text-right tabular-nums">{row.total}</td>{visibleBuckets.map((key) => <td key={key} className="py-2 text-right"><button type="button" disabled={!row[key]} onClick={() => onOpenTfl({ docType: row.key, status: key })} className="tabular-nums text-brand-1 hover:underline disabled:cursor-default disabled:text-text-secondary disabled:no-underline" aria-label={`${row.name} ${bucketLabels[key]}: ${row[key]}. View TFLs`}>{row[key]}</button></td>)}</tr>)}</tbody></table></div>
          </details>
        </section>
        <section className="rounded-lg border border-border-default bg-white p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="t-heading">Team progress</h2><p className="t-small text-text-secondary">Current assignee</p></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-lg text-left t-small"><thead className="text-text-secondary"><tr className="border-b border-border-default"><th scope="col" className="pb-2 font-medium">Team member</th><th scope="col" className="pb-2 text-right font-medium">Assigned</th>{visibleBuckets.map((key) => <th scope="col" key={key} className="pb-2 text-right font-medium">{bucketLabels[key]}</th>)}</tr></thead><tbody>{members.map((member) => { const rows = tfls.filter((tfl) => tfl.assignee === member); return <tr key={member} className="border-b border-graphite-10"><th scope="row" className="py-3 font-medium">{member}{member === event.owner && <span className="ml-2 rounded-sm bg-az-secondary px-1.5 py-0.5 text-brand-1">Owner</span>}</th><td className="py-3 text-right"><button type="button" disabled={!rows.length} onClick={() => onOpenTfl({ assignee: member })} className="font-semibold tabular-nums text-brand-1 hover:underline disabled:cursor-default disabled:text-text-secondary disabled:no-underline">{rows.length}</button></td>{visibleBuckets.map((key) => <td key={key} className="py-3 text-right tabular-nums">{rows.filter((row) => bucket(row) === key).length}</td>)}</tr>; })}<tr><th scope="row" className="py-3 font-medium">Unassigned</th><td className="py-3 text-right"><button type="button" disabled={!unassigned.length || !canAssign} onClick={onOpenAssignment} className="font-semibold tabular-nums text-brand-1 hover:underline disabled:cursor-default disabled:text-text-secondary disabled:no-underline">{unassigned.length}</button></td>{visibleBuckets.map((key) => <td key={key} className="py-3 text-right tabular-nums">{unassigned.filter((row) => bucket(row) === key).length}</td>)}</tr></tbody></table></div></section>
      </>}
    </div>
  </main>;
}
