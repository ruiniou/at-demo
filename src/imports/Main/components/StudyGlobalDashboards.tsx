import React, { useMemo, useRef, useState } from 'react';
import { Calendar, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { FilterChip } from '../../../components/ui/FilterChip';
import { Popover } from '../../../components/ui/Popover';
import { Tag } from '../../../components/ui/Tag';
import { ReadOnlyOwner } from '../../../components/ui/ReadOnlyOwner';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { DashboardError, DashboardFrame, DashboardIcon, DashboardTable, MetricCard, ProgressBar, metricIcons, usagePageIcon, tdClass, thClass } from './DashboardPrimitives';
import { countStatuses, mockDashboardDataSource, sumUsage } from './dashboardData';
import type { DashboardTfl, TokenUsageRecord } from './dashboardData';
import arrowRightIcon from '../../../icons/arrow-right-s-line.svg';

export type DashboardEvent = { id: string; name: string; study: string; owner: string; status: string; tfls: DashboardTfl[] };
export type DashboardStudy = { id: string; ta: string; owner: string; events: DashboardEvent[] };
const number = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function StudyDashboard({ study, onBack, showBack = true, loadState = 'ready', headerLeading }: { study: DashboardStudy; onBack: () => void; showBack?: boolean; loadState?: 'ready' | 'error'; headerLeading?: React.ReactNode }) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const tfls = study.events.flatMap((event) => event.tfls);
  const totals = countStatuses(tfls, mockDashboardDataSource);
  const records = mockDashboardDataSource.usageRecords().filter((row) => row.studyId === study.id);
  const usage = sumUsage(records);
  const unattributed = sumUsage(records.filter((row) => row.eventId === null));
  const percent = totals.total ? Math.round(totals.locked / totals.total * 100) : 0;
  return <DashboardFrame title={`Study ${study.id}`} updatedPlacement="title" headerLeading={headerLeading} updatedAt={updatedAt} onBack={onBack} onRefresh={() => setUpdatedAt(new Date())} showBack={showBack}>
    {loadState === 'error' ? <DashboardError onRetry={() => setUpdatedAt(new Date())} /> : !tfls.length ? <section className="rounded-md border border-graphite-10 bg-white p-[24px] text-center t-body">No TFLs in this Study yet.</section> : <>
      <section aria-label="Study Metrics" className="dashboard-metric-grid gap-3">
        <MetricCard label="Completion" value={`${totals.locked} / ${totals.total}`} detail={`${percent}% locked`} icon={metricIcons.locked} iconTone="brand" />
        <MetricCard label="In Progress" value={totals.inProgress} detail="Active TFLs" icon={metricIcons.inProgress} iconTone="warning" />
        <MetricCard label="Error" value={totals.error} detail="Needs attention" icon={metricIcons.error} iconTone="danger" />
        <MetricCard label="Token Usage" value={number(usage.total)} detail="Cumulative" icon={metricIcons.token} />
      </section>
      <DashboardTable title="Events" minWidth="min-w-4xl">
        <thead><tr>{['Event', 'Event Owner', 'Completion', 'Input', 'Output', 'Total'].map((label) => <th key={label} scope="col" className={`${thClass} ${['Input', 'Output', 'Total'].includes(label) ? 'text-right' : ''}`}>{label}</th>)}</tr></thead>
        <tbody>{study.events.length ? study.events.map((event) => {
          const counts = countStatuses(event.tfls, mockDashboardDataSource);
          const eventUsage = sumUsage(records.filter((row) => row.eventId === event.id));
          return <tr key={event.id}>
            <th scope="row" className={tdClass}><span className="inline-flex min-w-0 items-center gap-2"><span className="truncate">{event.name}</span>{counts.error > 0 && <span className="shrink-0 rounded-[calc(var(--radius-xs)*2)] bg-status-error-bg px-[6px] py-[2px] t-small text-status-error">{counts.error} Error</span>}</span></th><td className="px-[10px] py-[4px]"><ReadOnlyOwner name={event.owner} /></td>
            <td className={tdClass}><div className="flex min-w-40 items-center gap-3"><ProgressBar locked={counts.locked} inProgress={0} error={0} total={counts.total} label={`${event.name} completion`} /><span className="whitespace-nowrap tabular-nums">{counts.locked} / {counts.total}</span></div></td>
            <td className={`${tdClass} text-right tabular-nums`}>{number(eventUsage.input)}</td><td className={`${tdClass} text-right tabular-nums`}>{number(eventUsage.output)}</td><td className={`${tdClass} text-right tabular-nums`}>{number(eventUsage.total)}</td>
          </tr>;
        }) : null}
        {unattributed.total > 0 && <tr className="bg-bg-panel"><th scope="row" className={tdClass}>Unattributed</th><td className={tdClass} /><td className={tdClass} /><td className={`${tdClass} text-right`}>{number(unattributed.input)}</td><td className={`${tdClass} text-right`}>{number(unattributed.output)}</td><td className={`${tdClass} text-right`}>{number(unattributed.total)}</td></tr>}
        </tbody>
      </DashboardTable>
    </>}
  </DashboardFrame>;
}

type GroupedUsage = { label: string; range: string; input: number; output: number; total: number };
function groupedUsage(records: TokenUsageRecord[], month: dayjs.Dayjs): GroupedUsage[] {
  return Array.from({ length: 6 }, (_, index) => {
    const date = month.subtract(5 - index, 'month');
    return {
      label: date.format('MMM'),
      range: date.format('MMMM YYYY'),
      ...sumUsage(records.filter((record) => record.date.slice(0, 7) === date.format('YYYY-MM'))),
    };
  });
}

export function GlobalDashboard({ studies, onBack, onExport, loadState = 'ready', headerLeading }: { studies: DashboardStudy[]; onBack: () => void; onExport?: () => void; loadState?: 'ready' | 'error'; headerLeading?: React.ReactNode }) {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [month, setMonth] = useState(() => dayjs().startOf('month'));
  const start = month.format('YYYY-MM-DD');
  const end = month.isSame(dayjs(), 'month') ? dayjs().format('YYYY-MM-DD') : month.endOf('month').format('YYYY-MM-DD');
  const dateAnchorRef = useRef<HTMLButtonElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => dayjs());
  const [groupBy, setGroupBy] = useState<'study' | 'ta'>('study');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const all = mockDashboardDataSource.usageRecords();
  const rows = all.filter((row) => row.date >= start && row.date <= end);
  const totals = sumUsage(rows);
  const activeStudies = new Set(rows.map((row) => row.studyId));
  const activeEvents = new Set(rows.map((row) => row.eventId).filter((id): id is string => Boolean(id)));
  const chart = useMemo(() => groupedUsage(all.filter((row) => row.date <= end), month), [all, month, end]);
  const axisTicks = useMemo(() => {
    const count = Math.min(6, chart.length);
    if (count < 2) return chart.map((item) => item.label);
    return Array.from({ length: count }, (_, index) => chart[Math.round(index * (chart.length - 1) / (count - 1))].label);
  }, [chart]);
  const toggle = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const visibleStudies = studies.filter((study) => activeStudies.has(study.id) && study.id.toLowerCase().includes(search.trim().toLowerCase()));
  const taGroups = [...new Set(visibleStudies.map((study) => study.ta))].sort();
  const cell = (value: number) => <td className={`${tdClass} text-right tabular-nums`}>{number(value)}</td>;
  const onKey = (event: React.KeyboardEvent<HTMLTableRowElement>, key: string) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(key); } };
  return <DashboardFrame title="Usage" titleIcon={usagePageIcon} headerLeading={headerLeading} updatedPlacement="title" updatedAt={updatedAt} onBack={onBack} onRefresh={() => setUpdatedAt(new Date())} showBack={false} actions={<>
    <ConfigProvider theme={{ token: { colorPrimary: 'var(--color-brand-1)', colorPrimaryHover: 'var(--color-brand-1-hover)', colorText: 'var(--color-text-primary)', colorBorder: 'var(--color-border-default)' } }}>
      <FilterChip ref={dateAnchorRef} type="Dropdown" variant="select" showIcon={false} state={calendarOpen ? 'Active' : 'Default'} aria-label="Month" aria-expanded={calendarOpen} onClick={() => { setCalendarMonth(month); setCalendarOpen((open) => !open); }} label={month.format('MMMM YYYY')} />
      <Popover anchorRef={dateAnchorRef} align="end" width={304} label="Month" open={calendarOpen} onOpenChange={setCalendarOpen}><Calendar
        className="dashboard-calendar"
        fullscreen={false}
        mode="year"
        value={calendarMonth}
        disabledDate={(date) => date.isAfter(dayjs(), 'month')}
        onSelect={(date, info) => { if (info.source === 'month') { setMonth(date.startOf('month')); setCalendarOpen(false); } }}
        headerRender={({ value }) => <div className="dashboard-calendar-header flex items-center justify-between border-b border-graphite-10 p-2">
          <Button type="button" variant="icon" size="icon" aria-label="Previous Year" onClick={() => setCalendarMonth(value.subtract(1, 'year'))}><DashboardIcon src={arrowRightIcon} className="size-4 rotate-180" /></Button>
          <span className="t-small-medium">{value.format('YYYY')}</span>
          <Button type="button" variant="icon" size="icon" aria-label="Next Year" disabled={value.year() >= dayjs().year()} onClick={() => setCalendarMonth(value.add(1, 'year'))}><DashboardIcon src={arrowRightIcon} className="size-4" /></Button>
        </div>}
        fullCellRender={(date, info) => info.type === 'month' ? <div className={`dashboard-calendar-day flex items-center justify-center t-small ${date.isSame(month, 'month') ? 'bg-brand-1 text-white' : ''}`}>{date.format('MMM')}</div> : info.originNode}
      />
      </Popover>
    </ConfigProvider>

    {/* TODO (Proposal §3.1): wire the Admin export entry to an approved export contract. */}
    <Button type="button" variant="primary" size="sm" onClick={onExport} disabled={!onExport} className="h-8">Export</Button>
  </>}>
    {loadState === 'error' ? <DashboardError onRetry={() => setUpdatedAt(new Date())} /> : <>
      <>
        <section aria-label="Global Metrics" data-count="3" className="dashboard-metric-grid gap-3">
          <MetricCard label="Total Tokens" value={number(totals.total)} detail={`${start} – ${end}`} icon={metricIcons.token} />
          <MetricCard label="Studies" value={activeStudies.size} detail="With token usage" icon={metricIcons.study} />
          <MetricCard label="Events" value={activeEvents.size} detail="With token usage" icon={metricIcons.event} />
        </section>
        <section className="rounded-md border border-graphite-10 bg-white p-[16px]"><div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h2 className="t-heading">Monthly Token Usage</h2><span className="t-small text-text-secondary">{month.subtract(5, 'month').format('MMM YYYY')} – {month.format('MMM YYYY')}</span></div><div className="h-64 min-w-0" role="img" aria-label="Monthly Token Usage over six months">
          <>{chart.every((item) => item.total === 0) ? <div className="flex h-full items-center justify-center t-small text-text-secondary">No token usage recorded in these six months.</div> : <ResponsiveContainer width="100%" height="100%"><BarChart data={chart} accessibilityLayer><CartesianGrid vertical={false} stroke="var(--color-graphite-10)" /><XAxis dataKey="label" ticks={axisTicks} interval={0} tick={{ fill: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }} axisLine={false} tickLine={false} tickFormatter={number} /><ChartTooltip content={({ active, payload }) => active && payload?.length ? <div className="rounded-md border border-graphite-20 bg-white p-3 t-small shadow-elevation-overlay"><p className="mb-2 t-small-medium">{payload[0].payload.range}</p><p>Input: {number(payload[0].payload.input)}</p><p>Output: {number(payload[0].payload.output)}</p><p>Total: {number(payload[0].payload.total)}</p></div> : null} /><Bar dataKey="input" name="Input" stackId="tokens" fill="var(--color-dark-mulberry)" isAnimationActive={false} /><Bar dataKey="output" name="Output" stackId="tokens" fill="var(--color-brand-1-disabled)" isAnimationActive={false} /></BarChart></ResponsiveContainer>}</>
        </div><div className="mt-3 flex gap-4 t-small text-text-secondary"><span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-dark-mulberry" />Input</span><span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-brand-1-disabled" />Output</span></div></section>
        <DashboardTable title="Token Usage Details" tools={<div className="flex flex-wrap items-center gap-3"><SegmentedControl size="panel" value={groupBy} onChange={(value) => setGroupBy(value as 'study' | 'ta')} options={[{ label: 'By Study', value: 'study' }, { label: 'By TA', value: 'ta' }]} /><SearchBar variant="embedded" size="compact" value={search} onChange={setSearch} placeholder="Search Studies" className="w-48" /></div>} minWidth="min-w-4xl">
          <thead><tr>{(groupBy === 'study' ? ['Study / Event', 'Study Owner', 'Events', 'Input', 'Output', 'Total'] : ['TA / Study', 'Studies', 'Events', 'Input', 'Output', 'Total']).map((label) => <th key={label} scope="col" className={`${thClass} ${['Events', 'Studies', 'Input', 'Output', 'Total'].includes(label) ? 'text-right' : ''}`}>{label}</th>)}</tr></thead>
          <tbody>{!visibleStudies.length && <tr><td colSpan={6} className="p-6 text-center t-small text-text-secondary">{search.trim() ? 'No Results Found' : 'No token usage recorded this month.'}</td></tr>}{groupBy === 'study' ? visibleStudies.map((study) => {
            const selected = rows.filter((row) => row.studyId === study.id);
            const usage = sumUsage(selected);
            const eventIds = new Set(selected.map((row) => row.eventId).filter((id): id is string => Boolean(id)));
            const isOpen = expanded.has(study.id);
            return <React.Fragment key={study.id}><tr tabIndex={0} aria-expanded={isOpen} onClick={() => toggle(study.id)} onKeyDown={(event) => onKey(event, study.id)} className="cursor-pointer hover:bg-bg-panel focus-visible:outline-brand-1"><th scope="row" className={`${tdClass} font-medium`}><span className="inline-flex items-center gap-2"><DashboardIcon src={arrowRightIcon} className={`size-4 text-text-secondary transition-transform ${isOpen ? 'rotate-90' : ''}`} />{study.id}<Tag className="h-[20px] py-0 pointer-events-none">{study.ta}</Tag></span></th><td className="px-[10px] py-[4px]"><ReadOnlyOwner name={study.owner} /></td>{cell(eventIds.size)}{cell(usage.input)}{cell(usage.output)}{cell(usage.total)}</tr>
              {isOpen && study.events.filter((event) => eventIds.has(event.id)).map((event) => { const item = sumUsage(selected.filter((row) => row.eventId === event.id)); return <tr key={event.id} className="bg-bg-panel"><th scope="row" className={`${tdClass} pl-8`}>{event.name}</th><td className={tdClass} /><td className={tdClass} />{cell(item.input)}{cell(item.output)}{cell(item.total)}</tr>; })}</React.Fragment>;
          }) : taGroups.map((ta) => {
            const children = visibleStudies.filter((study) => study.ta === ta);
            const selected = rows.filter((row) => children.some((study) => study.id === row.studyId));
            const usage = sumUsage(selected);
            const isOpen = expanded.has(`ta:${ta}`);
            return <React.Fragment key={ta}><tr tabIndex={0} aria-expanded={isOpen} onClick={() => toggle(`ta:${ta}`)} onKeyDown={(event) => onKey(event, `ta:${ta}`)} className="cursor-pointer hover:bg-bg-panel focus-visible:outline-brand-1"><th scope="row" className={`${tdClass} font-medium`}><span className="inline-flex items-center gap-2"><DashboardIcon src={arrowRightIcon} className={`size-4 text-text-secondary transition-transform ${isOpen ? 'rotate-90' : ''}`} />{ta}</span></th>{cell(children.length)}{cell(new Set(selected.map((row) => row.eventId).filter(Boolean)).size)}{cell(usage.input)}{cell(usage.output)}{cell(usage.total)}</tr>
              {isOpen && children.map((study) => { const item = rows.filter((row) => row.studyId === study.id); const total = sumUsage(item); return <tr key={study.id} className="bg-bg-panel"><th scope="row" className={`${tdClass} pl-8`}>{study.id}</th><td className={tdClass} />{cell(new Set(item.map((row) => row.eventId).filter(Boolean)).size)}{cell(total.input)}{cell(total.output)}{cell(total.total)}</tr>; })}</React.Fragment>;
          })}</tbody>
        </DashboardTable>
      </>
    </>}
  </DashboardFrame>;
}
