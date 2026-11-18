export type Inquiry = {
  id: string; organization: string; contact_name: string; email: string;
  use_case: string; message: string; status: string; created_at: string;
};

export function inquirySummary(rows: Array<{ status: string }>) {
  return {
    total: rows.length,
    new: rows.filter(row => row.status === 'NEW').length,
    review: rows.filter(row => row.status === 'IN_REVIEW').length,
    closed: rows.filter(row => row.status === 'CLOSED').length,
    other: rows.filter(row => !['NEW', 'IN_REVIEW', 'CLOSED'].includes(row.status)).length,
  };
}

export function inquirySeries(rows: Array<{ created_at: string }>, days: number, now = new Date()) {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const start = end - (days - 1) * 86400000;
  const series = Array.from({ length: days }, (_, index) => ({
    date: new Date(start + index * 86400000).toISOString().slice(0, 10), count: 0,
  }));
  for (const row of rows) {
    const date = new Date(row.created_at);
    const index = Math.floor((date.getTime() - start) / 86400000);
    if (Number.isFinite(index) && index >= 0 && index < days && date.getTime() <= now.getTime()) series[index].count++;
  }
  return series;
}

export function inquiriesCsv(rows: Array<Partial<Inquiry>>) {
  const fields = ['id', 'organization', 'contact_name', 'email', 'use_case', 'status', 'created_at'] as const;
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@-]|^[\t\r\n]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return [fields.map(cell).join(','), ...rows.map(row => fields.map(field => cell(row[field])).join(','))].join('\r\n');
}
