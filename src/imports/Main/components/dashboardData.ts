export type DashboardStatus = 'locked' | 'in-progress' | 'error' | 'stopped';
export type DashboardTfl = {
  id: string;
  name: string;
  status: string;
  docType?: 'table' | 'listing' | 'figure';
  assignee?: string;
};

export type TokenUsage = { input: number; output: number; total: number };
export type TokenUsageRecord = TokenUsage & {
  date: string;
  studyId: string;
  eventId: string | null;
};
export type RequestCounts = { singleTfl: number | null; event: number | null };

export interface DashboardDataSource {
  statusOf(tfl: DashboardTfl): DashboardStatus;
  requestsFor(eventId: string, member: string): RequestCounts;
  usageRecords(): TokenUsageRecord[];
}

// TODO (Proposal §5, red): PM must confirm the mapping from existing TFL states to In Progress.
export const statusOf = (tfl: DashboardTfl): DashboardStatus => {
  if (tfl.status === 'locked') return 'locked';
  if (tfl.status === 'error') return 'error';
  if (tfl.status === 'stopped') return 'stopped';
  return 'in-progress';
};

const mockRecords: TokenUsageRecord[] = [
  { date: '2026-09-17', studyId: 'AZE2001-301', eventId: 'e1', input: 18200, output: 7900, total: 26100 },
  { date: '2026-09-21', studyId: 'AZE2001-301', eventId: 'e1', input: 24300, output: 10800, total: 35100 },
  { date: '2026-09-25', studyId: 'AZE2001-301', eventId: 'e2', input: 12600, output: 5200, total: 17800 },
  { date: '2026-09-29', studyId: 'AZE2001-301', eventId: 'e3', input: 9700, output: 4100, total: 13800 },
  { date: '2026-10-02', studyId: 'AZE2001-301', eventId: 'e4', input: 28500, output: 12300, total: 40800 },
  { date: '2026-10-05', studyId: 'AZE2001-301', eventId: 'e5', input: 14900, output: 6500, total: 21400 },
  { date: '2026-10-08', studyId: 'AZE2001-401', eventId: 'e8', input: 22100, output: 9400, total: 31500 },
  { date: '2026-10-10', studyId: 'AZE2001-401', eventId: 'e9', input: 17700, output: 7600, total: 25300 },
];

export const mockDashboardDataSource: DashboardDataSource = {
  statusOf,
  // TODO (Proposal §5, red): replace unavailable request instrumentation with confirmed per-member counts.
  requestsFor: (_eventId, _member) => ({ singleTfl: null, event: null }),
  // TODO (Proposal §5, red): confirm Event attribution and which Copilot requests contribute to Token Usage.
  // TODO (Proposal §5, yellow): confirm reporting timezone and refresh contract before replacing these fixtures.
  usageRecords: () => mockRecords,
};

export const sumUsage = (records: TokenUsageRecord[]): TokenUsage => records.reduce(
  (sum, row) => ({ input: sum.input + row.input, output: sum.output + row.output, total: sum.total + row.total }),
  { input: 0, output: 0, total: 0 },
);

export const countStatuses = (tfls: DashboardTfl[], source: DashboardDataSource) => ({
  locked: tfls.filter((tfl) => source.statusOf(tfl) === 'locked').length,
  inProgress: tfls.filter((tfl) => source.statusOf(tfl) === 'in-progress').length,
  error: tfls.filter((tfl) => source.statusOf(tfl) === 'error').length,
  stopped: tfls.filter((tfl) => source.statusOf(tfl) === 'stopped').length,
  total: tfls.length,
});
