import assert from 'node:assert/strict';
import test from 'node:test';

const analytics = await import('../app/admin/analytics.ts').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});
const rows = [
  { id: '1', organization: 'Alpha', status: 'NEW', created_at: '2026-10-11T01:00:00Z' },
  { id: '2', organization: 'Beta', status: 'IN_REVIEW', created_at: '2026-10-10T23:00:00Z' },
  { id: '3', organization: 'Gamma', status: 'CLOSED', created_at: '2026-10-05T00:00:00Z' },
  { id: '4', organization: 'Old', status: 'NEW', created_at: '2026-10-04T23:59:59Z' },
  { id: '5', organization: 'Future', status: 'NEW', created_at: '2026-10-12T00:00:00Z' },
  { id: '6', organization: 'Invalid', status: 'OTHER', created_at: 'invalid' },
];
test('inquiry charts use a UTC range and exclude invalid or future dates', () => {
  assert.equal(typeof analytics.inquirySeries, 'function', 'inquiry chart calculation is missing');
  const series = analytics.inquirySeries(rows, 7, new Date('2026-10-11T12:00:00Z'));
  assert.equal(series.length, 7);
  assert.deepEqual(series.map(day => day.count), [1, 0, 0, 0, 0, 1, 1]);
  assert.equal(analytics.inquirySeries([], 7, new Date('2026-10-11T12:00:00Z')).every(day => day.count === 0), true);
});
test('status totals disclose unfamiliar statuses instead of treating them as closed', () => {
  assert.equal(typeof analytics.inquirySummary, 'function', 'inquiry summary calculation is missing');
  assert.deepEqual(analytics.inquirySummary(rows), { total: 6, new: 3, review: 1, closed: 1, other: 1 });
  assert.equal(analytics.inquirySummary([{ status: 'UNKNOWN' }]).other, 1);
});
test('exported inquiry CSV preserves multiline fields and neutralizes spreadsheet formulas', () => {
  assert.equal(typeof analytics.inquiriesCsv, 'function', 'safe inquiry export is missing');
  const csv = analytics.inquiriesCsv([{ id: '1', organization: '=1+1', contact_name: 'Alice "A"', email: '+test@example.com', use_case: 'a\nb', status: 'NEW', created_at: '2026-10-11' }]);
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(csv.includes('"Alice ""A"""'));
  assert.ok(csv.includes('"\'+test@example.com"'));
  assert.ok(csv.includes('"a\nb"'));
  assert.ok(!csv.includes('message'));
});
