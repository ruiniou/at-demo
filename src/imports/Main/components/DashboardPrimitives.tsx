import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Tooltip } from '../../../components/ui/Tooltip';
import type { DashboardStatus } from './dashboardData';
import arrowLeftIcon from '../../../icons/arrow-left-s-line.svg';
import teamIcon from '../../../icons/team-line.svg';
import errorIcon from '../../../icons/error-warning-line.svg';
import databaseIcon from '../../../icons/database-2-line.svg';
import informationIcon from '../../../icons/information-line.svg';
import lockedIcon from '../../../icons/Lock.svg';
import resetIcon from '../../../icons/reset-right-line.svg';
import dashboardIcon from '../../../icons/dashboard-3-line.svg';
import studyIcon from '../../../icons/stack-line.svg';
import eventIcon from '../../../icons/task-line.svg';
import usageIcon from '../../../icons/bar-chart-2-line.svg';
import './dashboard.css';

export function DashboardIcon({ src, className = 'size-4' }: { src: string; className?: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={{ mask, WebkitMask: mask }} />;
}

export const usagePageIcon = usageIcon;
export const metricIcons = { locked: lockedIcon, error: errorIcon, unassigned: teamIcon, token: databaseIcon, study: studyIcon, event: eventIcon };

export function DashboardFrame({ title, subtitle, updatedAt, onBack, onRefresh, actions, children, showBack = true, titleIcon = dashboardIcon }: {
  title: string;
  subtitle?: string;
  updatedAt: Date;
  onBack: () => void;
  onRefresh: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  showBack?: boolean;
  titleIcon?: string;
}) {
  const updated = updatedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return <main className="h-full w-full min-w-0 flex-1 overflow-y-auto bg-white font-body text-text-primary">
    <div className="dashboard-content flex flex-col gap-[16px] px-[16px] pb-[20px] pt-[20px] sm:px-[28px]">
      <header className="min-w-0">
        <div className="min-w-0">
          {showBack && <Button type="button" variant="ghost" size="sm" onClick={onBack} className="dashboard-back mb-2 text-brand-1">
            <DashboardIcon src={arrowLeftIcon} />Back
          </Button>}
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-az-secondary text-brand-1"><DashboardIcon src={titleIcon} className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <h1 className="flex min-h-8 items-center truncate text-[22px] font-bold leading-[28px] tracking-tight text-text-primary">{title}</h1>
              {subtitle && <p className="mt-1.5 t-small text-text-secondary">{subtitle}</p>}
              <div className={`${subtitle ? 'mt-1' : 'mt-2'} flex flex-wrap items-center justify-between gap-3`}>
                <div className="dashboard-updated flex items-center gap-2">
                  <p className="t-small text-text-secondary">Updated {updated}</p>
                  <Tooltip label="Refresh" placement="bottom">
                    <Button type="button" variant="icon" size="icon" onClick={onRefresh} aria-label="Refresh"><DashboardIcon src={resetIcon} /></Button>
                  </Tooltip>
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  </main>;
}

export function MetricCard({ label, value, detail, icon, status, onClick, lockedTooltip }: {
  label: string;
  value: string | number;
  detail?: string;
  icon?: string;
  status?: DashboardStatus;
  onClick?: () => void;
  lockedTooltip?: boolean;
}) {
  const body = <>
    <div className="flex min-h-8 items-start justify-between gap-3">
      <span className="flex items-center gap-2 t-small text-text-secondary">
        {status && <StatusDot status={status} />}{label}
        {lockedTooltip && <Tooltip label="Locked count reflects the current state. Unlocking a TFL reduces it."><span tabIndex={0} className="cursor-help text-brand-1" aria-label="About Locked"><DashboardIcon src={informationIcon} /></span></Tooltip>}
      </span>
      {icon && <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-panel text-text-secondary"><DashboardIcon src={icon} /></span>}
    </div>
    <strong className={`dashboard-metric-value mt-[8px] block t-title-1 tabular-nums ${label === 'Error' && Number(value) > 0 ? 'text-status-error' : 'text-text-primary'}`}>{value}</strong>
    {detail && <span className="mt-1 block t-small text-text-secondary">{detail}</span>}
  </>;
  const className = 'dashboard-metric-card min-w-0 rounded-md border border-graphite-10 bg-white p-[16px] text-left';
  return onClick ? <button type="button" onClick={onClick} className={`${className} w-full transition-colors hover:border-brand-1 focus-visible:outline-2 focus-visible:outline-brand-1`}>{body}</button>
    : <div className={className}>{body}</div>;
}

export function StatusDot({ status }: { status: DashboardStatus }) {
  const colors: Record<DashboardStatus, string> = {
    locked: 'bg-brand-1', 'in-progress': 'bg-status-warning', error: 'bg-status-error', stopped: 'bg-graphite-40',
  };
  return <span aria-hidden="true" className={`size-2 shrink-0 rounded-xl ${colors[status]}`} />;
}

export function ProgressBar({ locked, inProgress, error, stopped = 0, total, label }: {
  locked: number; inProgress: number; error: number; stopped?: number; total: number; label: string;
}) {
  const segments = [
    { value: locked, color: 'var(--color-brand-1)' },
    { value: inProgress, color: 'var(--color-status-warning)' },
    { value: error, color: 'var(--color-status-error)' },
    { value: stopped, color: 'var(--color-graphite-40)' },
  ];
  return <div role="img" aria-label={`${label}: ${locked} Locked, ${inProgress} In Progress, ${error} Error${stopped ? `, ${stopped} Stopped` : ''}`} className="flex h-2 min-w-24 overflow-hidden rounded-sm bg-graphite-10">
    {total > 0 && segments.filter((part) => part.value > 0).map((part, index) => <span key={index} style={{ width: `${part.value / total * 100}%`, backgroundColor: part.color }} />)}
  </div>;
}

export function DashboardTable({ title, tools, children, minWidth = 'min-w-2xl' }: { title: string; tools?: React.ReactNode; children: React.ReactNode; minWidth?: string }) {
  return <section className="min-w-0 overflow-hidden rounded-md border border-graphite-10 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-[12px] border-b border-graphite-10 bg-white px-[16px] py-[12px]"><h2 className="t-heading">{title}</h2>{tools}</div>
    <div className="overflow-x-auto"><table className={`dashboard-data-table w-full ${minWidth} border-collapse text-left t-caption`}>{children}</table></div>
  </section>;
}

export const thClass = 'h-[40px] whitespace-nowrap px-[16px] py-[10px] t-small font-normal text-text-secondary';
export const tdClass = 'h-[48px] px-[16px] py-[10px] t-caption text-text-primary';

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return <div role="alert" className="rounded-md border border-status-error-border bg-white p-[24px] text-center">
    <p className="t-body">Couldn't load dashboard data. Try again.</p>
    <Button type="button" variant="secondary" size="sm" onClick={onRetry} className="mt-3">Retry</Button>
  </div>;
}

export function DashboardNotice({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-status-warning-border bg-status-warning-bg p-3 t-small text-text-primary">{children}</div>;
}
