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
  eventId: string;
};
// One Copilot request. Single-TFL requests carry the TFL they were sent on; Event requests carry none.
// diffAccepted is null when the request has no source link to a Diff.
export type CopilotRequest = { eventId: string; initiator: string; tflId: string | null; type: 'single-tfl' | 'event'; diffAccepted: boolean | null };
export type RequestCounts = { singleTfl: number; event: number };
// diffRounds is null when none of the TFL's requests links to a Diff, so it reads as "no record" rather than 0.
export type TflActivity = { requests: number; diffRounds: number | null };

export interface DashboardDataSource {
  statusOf(tfl: DashboardTfl): DashboardStatus;
  requestLog(eventId: string, tfls: DashboardTfl[], members: string[]): CopilotRequest[];
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
  { date: '2026-10-08', studyId: 'CVD3001-201', eventId: 'e8', input: 22100, output: 9400, total: 31500 },
  { date: '2026-10-10', studyId: 'CVD3001-201', eventId: 'e9', input: 17700, output: 7600, total: 25300 },
  { date: '2026-10-06', studyId: 'AZE2001-301', eventId: 'e10', input: 8200, output: 3500, total: 11700 },
  { date: '2026-10-09', studyId: 'CVD3002-110', eventId: 'e11', input: 38400, output: 16600, total: 55000 },
  { date: '2026-10-11', studyId: 'AZE2001-401', eventId: 'e12', input: 13200, output: 5800, total: 19000 },
  { date: '2026-10-12', studyId: 'AZE2001-301', eventId: 'e13', input: 10600, output: 4400, total: 15000 },
  { date: '2026-07-14', studyId: 'AZE2001-302', eventId: 'e6', input: 31200, output: 13800, total: 45000 },
  { date: '2026-08-11', studyId: 'AZE2001-302', eventId: 'e7', input: 46500, output: 20100, total: 66600 },
  { date: '2026-08-19', studyId: 'CVD3001-201', eventId: 'e8', input: 27400, output: 11900, total: 39300 },
  { date: '2026-09-12', studyId: 'CVD3001-201', eventId: 'e9', input: 33800, output: 14700, total: 48500 },
  { date: '2026-09-18', studyId: 'CVD3002-110', eventId: 'e11', input: 21500, output: 9300, total: 30800 },
  { date: '2026-10-14', studyId: 'CVD3001-201', eventId: 'e8', input: 41200, output: 18200, total: 59400 },
  { date: '2026-10-16', studyId: 'CVD3002-110', eventId: 'e11', input: 16900, output: 7200, total: 24100 },
];

const seedOf = (value: string) => [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);

// Demo-only request log until request and Diff instrumentation is available. Both Dashboard views read from it,
// so per-member and per-TFL request counts add up to the same Event total.
// TODO (needs confirmation): "Diff accept round" = one round in which the user reviews and accepts a Diff.
const mockRequestLog = (eventId: string, tfls: DashboardTfl[], members: string[]): CopilotRequest[] => {
  if (!members.length) return [];
  const log: CopilotRequest[] = [];
  tfls.forEach((tfl) => {
    const seed = seedOf(tfl.id);
    for (let index = 0; index < seed % 4; index += 1) {
      const step = seed + index;
      const initiator = tfl.assignee && step % 3 !== 0 ? tfl.assignee : members[step % members.length];
      log.push({ eventId, initiator, tflId: tfl.id, type: 'single-tfl', diffAccepted: step % 5 === 0 ? null : step % 2 === 0 });
    }
  });
  members.forEach((member) => {
    for (let index = 0; index < seedOf(eventId + member) % 3; index += 1) log.push({ eventId, initiator: member, tflId: null, type: 'event', diffAccepted: null });
  });
  return log;
};

// Requests count toward the member who sent them, not the TFL's current assignee.
export const requestsSentBy = (log: CopilotRequest[], member: string): RequestCounts => ({
  singleTfl: log.filter((row) => row.initiator === member && row.type === 'single-tfl').length,
  event: log.filter((row) => row.initiator === member && row.type === 'event').length,
});

export const tflActivity = (log: CopilotRequest[], tflId: string): TflActivity => {
  const rows = log.filter((row) => row.tflId === tflId);
  const linked = rows.filter((row) => row.diffAccepted !== null);
  return { requests: rows.length, diffRounds: linked.length ? linked.filter((row) => row.diffAccepted).length : null };
};

export const mockDashboardDataSource: DashboardDataSource = {
  statusOf,
  requestLog: mockRequestLog,
  // TODO (Proposal §5, red): confirm which Copilot requests contribute to Token Usage.
  // TODO (Proposal §5, yellow): confirm reporting timezone and refresh contract before replacing these fixtures.
  usageRecords: () => mockRecords,
};

// TODO (needs confirmation): replace with the billed model price list and confirm currency.
// Cost is derived at read time, so it follows the current model prices rather than a stored amount.
export const MODEL_PRICING = { currency: 'USD', inputPerMillion: 3, outputPerMillion: 15 };
// TODO (needs confirmation): replace with the real model name once Usage reports which model was selected.
export const MODEL_NAME = 'model name 1.0';
export const COST_NOTE = 'Estimated at current model prices. Changes if prices change.';

export const estimateCost = (usage: { input: number; output: number }) =>
  usage.input / 1_000_000 * MODEL_PRICING.inputPerMillion + usage.output / 1_000_000 * MODEL_PRICING.outputPerMillion;

export const formatCost = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: MODEL_PRICING.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

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
