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
export type RequestCounts = { singleTfl: number; event: number };

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
  { date: '2026-09-23', studyId: 'AZE2001-302', eventId: 'e6', input: 64800, output: 28000, total: 92800 },
  { date: '2026-09-27', studyId: 'AZE2001-302', eventId: 'e7', input: 52400, output: 24600, total: 77000 },
  { date: '2026-10-02', studyId: 'AZE2001-301', eventId: 'e4', input: 28500, output: 12300, total: 40800 },
  { date: '2026-10-05', studyId: 'AZE2001-301', eventId: 'e5', input: 14900, output: 6500, total: 21400 },
  { date: '2026-10-08', studyId: 'AZE2001-303', eventId: 'e8', input: 22100, output: 9400, total: 31500 },
  { date: '2026-10-10', studyId: 'AZE2001-303', eventId: 'e9', input: 17700, output: 7600, total: 25300 },
  { date: '2026-10-06', studyId: 'AZE2001-301', eventId: 'e10', input: 8200, output: 3500, total: 11700 },
  { date: '2026-10-09', studyId: 'AZE2001-401', eventId: 'e11', input: 38400, output: 16600, total: 55000 },
  { date: '2026-10-11', studyId: 'AZE2001-401', eventId: 'e12', input: 13200, output: 5800, total: 19000 },
  { date: '2026-10-12', studyId: 'AZE2001-301', eventId: 'e13', input: 10600, output: 4400, total: 15000 },
];

const mockRequestCounts: Record<string, Record<string, RequestCounts>> = {
  e1: { 'Emily Liu': { singleTfl: 2, event: 1 }, 'Sarah Chen': { singleTfl: 1, event: 0 } },
  e2: {
    'Alex Kim': { singleTfl: 1, event: 0 },
    'Emily Liu': { singleTfl: 0, event: 2 },
    'James Park': { singleTfl: 2, event: 1 },
    'Priya Sharma': { singleTfl: 1, event: 0 },
    'Sarah Chen': { singleTfl: 3, event: 1 },
  },
  e3: { 'Emily Liu': { singleTfl: 1, event: 2 } },
  e4: { 'Emily Liu': { singleTfl: 2, event: 1 } },
  e5: { 'Emily Liu': { singleTfl: 0, event: 2 }, 'James Park': { singleTfl: 2, event: 0 }, 'Alex Kim': { singleTfl: 1, event: 1 } },
  e6: { 'Sarah Chen': { singleTfl: 3, event: 1 } },
  e7: { 'Sarah Chen': { singleTfl: 1, event: 0 } },
  e8: { 'James Park': { singleTfl: 2, event: 1 } },
  e9: { 'James Park': { singleTfl: 1, event: 0 } },
  e10: { 'Emily Liu': { singleTfl: 1, event: 1 }, 'Alex Kim': { singleTfl: 2, event: 0 } },
  e11: { 'Emily Liu': { singleTfl: 2, event: 1 } },
  e12: { 'Emily Liu': { singleTfl: 1, event: 0 } },
  e13: { 'Emily Liu': { singleTfl: 2, event: 1 } },
};

export const mockDashboardDataSource: DashboardDataSource = {
  statusOf,
  // Demo-only counts until per-member request instrumentation is available.
  requestsFor: (eventId, member) => mockRequestCounts[eventId]?.[member] ?? { singleTfl: 0, event: 0 },
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
