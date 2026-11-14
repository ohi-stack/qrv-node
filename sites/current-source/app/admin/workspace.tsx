'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { chatGPTSignOutPath } from '../chatgpt-auth-client';
import { inquiriesCsv, inquirySeries, inquirySummary, type Inquiry } from './analytics';

const sections = [
  ['overview', 'Overview', 'grid'], ['records', 'Records', 'records'],
  ['issue-record', 'Issue record', 'plus'], ['certificates', 'Certificates', 'certificate'],
  ['qr-codes', 'QR codes', 'qr'], ['revocations', 'Revocations', 'shield'],
  ['analytics', 'Analytics', 'chart'], ['api-keys', 'API keys', 'key'],
  ['team', 'Team', 'team'], ['billing', 'Billing', 'card'], ['settings', 'Settings', 'settings'],
] as const;
type Section = typeof sections[number][0];
type PublicRecord = { qrvid: string; title: string; issuer: string; status: string };
type Network = { state: 'Checking' | 'Available' | 'Partial' | 'Unavailable'; services: Array<{ name: string; status: string }>; checkedAt: string };
const paths: Record<string, string> = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  records: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  plus: 'M12 5v14M5 12h14', certificate: 'M6 3h12v12H6zM9 7h6M9 10h6M8 15v6l4-3 4 3v-6',
  qr: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6z',
  shield: 'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM9 9l6 6M15 9l-6 6',
  chart: 'M4 3v17h17M8 16v-5M13 16V7M18 16V4', key: 'M14 5a5 5 0 1 1-4 8L3 20v-4l7-7a5 5 0 0 1 4-4zM16 8h.01',
  team: 'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-3c0-4 12-4 12 0v3M16 4c5 0 5 8 0 8M18 15c4 0 4 3 4 6',
  card: 'M3 5h18v14H3zM3 10h18M6 15h4', settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
  arrow: 'M5 12h14M13 6l6 6-6 6', download: 'M12 3v12M7 10l5 5 5-5M4 17v4h16v-4', refresh: 'M20 11a8 8 0 1 0-2 7M20 4v7h-7',
};
function Icon({ name }: { name: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.grid} /></svg>; }
const dateLabel = (date: string) => { const value = new Date(date); return Number.isNaN(value.getTime()) ? 'Date unavailable' : value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); };
const readable = (status: string) => status.replaceAll('_', ' ').toLowerCase();

function Charts({ inquiries, days, setDays, loading, error }: { inquiries: Inquiry[]; days: number; setDays: (days: number) => void; loading: boolean; error: string }) {
  const series = inquirySeries(inquiries, days);
  const summary = inquirySummary(inquiries);
  const count = series.reduce((sum, day) => sum + day.count, 0);
  const maximum = Math.max(1, ...series.map(day => day.count));
  const statuses = [ ['New', summary.new, 'new'], ['In review', summary.review, 'review'], ['Closed', summary.closed, 'closed'], ['Other', summary.other, 'other'] ] as const;
  let angle = 0;
  const stops = statuses.map(([, value, tone]) => { const start = angle; angle += summary.total ? value / summary.total * 100 : 0; return `var(--admin-${tone}) ${start}% ${angle}%`; }).join(',');
  return <div className="admin-chart-grid">
    <article className="admin-panel admin-volume"><div className="admin-panel-head"><div><p className="admin-overline">INQUIRY ACTIVITY</p><h2>Arrivals over time</h2></div><div className="admin-range" aria-label="Chart date range">{[7, 30, 90].map(range => <button key={range} aria-pressed={days === range} onClick={() => setDays(range)}>{range}d</button>)}</div></div>
      <div className="admin-chart-value"><strong>{loading || error ? '—' : count}</strong><span>inquiries · last {days} days (UTC)</span></div>
      {loading || error ? <div className="admin-chart-message" role="status">{loading ? 'Loading inquiry activity…' : 'Activity unavailable. Refresh to retry.'}</div> : <><svg className="admin-bar-chart" viewBox="0 0 620 170" role="img" aria-label={`${count} inquiries over the last ${days} days, from the latest 200 loaded inquiries`}>
        <title>Daily issuer inquiries</title><desc>{series.map(day => `${day.date}: ${day.count}`).join('; ')}</desc>
        {[0, 1, 2, 3].map(index => <g key={index}><line x1="32" y1={16 + index * 44} x2="614" y2={16 + index * 44} stroke="#e5edf1" strokeDasharray="4 4" /><text x="24" y={20 + index * 44} textAnchor="end" fill="#718496" fontSize="10">{Math.round(maximum * (3 - index) / 3)}</text></g>)}
        {series.map((day, index) => { const width = 576 / days; const height = day.count / maximum * 132; return <rect key={day.date} x={35 + index * width} y={148 - height} width={Math.max(2, width - 3)} height={height} rx="2" fill={index === days - 1 ? '#132f48' : '#0b9c88'}><title>{day.date}: {day.count} inquiries</title></rect>; })}
      </svg><div className="admin-chart-axis"><span>{dateLabel(series[0].date)}</span><span>{dateLabel(series[Math.floor(days / 2)].date)}</span><span>{dateLabel(series[days - 1].date)}</span></div>{!count && <p className="admin-chart-note">No arrivals in this range among the loaded inquiries.</p>}</>}
      <p className="admin-chart-note">Latest 200 inquiries only. These are inquiry arrivals, not verification events.</p>
    </article>
    <article className="admin-panel"><div className="admin-panel-head"><div><p className="admin-overline">WORK QUEUE</p><h2>Inquiry status</h2></div><span className="admin-tag">Loaded sample</span></div>
      <div className="admin-donut-wrap"><div className="admin-donut" role="img" aria-label={loading || error ? 'Inquiry status data unavailable' : statuses.map(([label, value]) => `${label}: ${value}`).join(', ')} style={{ background: !loading && !error && summary.total ? `conic-gradient(${stops})` : '#e7eef2' }}><div><strong>{loading || error ? '—' : summary.total}</strong><span>inquiries</span></div></div></div>
      <ul className="admin-legend">{statuses.filter(([, value, tone]) => tone !== 'other' || value > 0).map(([label, value, tone]) => <li key={tone}><span><i style={{ background: `var(--admin-${tone})` }} />{label}</span><strong>{loading || error ? '—' : value}</strong></li>)}</ul>
    </article>
  </div>;
}

export default function AdminWorkspace({ name, email }: { name: string; email: string }) {
  const [section, setSection] = useState<Section>('overview');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [lastLoaded, setLastLoaded] = useState('');
  const [records, setRecords] = useState<PublicRecord[]>([]);
  const [recordQuery, setRecordQuery] = useState('');
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState('');
  const [network, setNetwork] = useState<Network>({ state: 'Checking', services: [], checkedAt: '' });
  const [networkLoading, setNetworkLoading] = useState(true);

  const loadInquiries = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/dashboard/admin', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Administrator session unavailable. Sign in with an authorized account.' : 'Inquiry storage is unavailable. Please retry.');
      if (!Array.isArray(data.inquiries)) throw new Error('Inquiry data could not be read. Please retry.');
      const items = data.inquiries.filter((item: Inquiry) => item && ['id', 'organization', 'contact_name', 'email', 'use_case', 'message', 'status', 'created_at'].every(key => typeof item[key as keyof Inquiry] === 'string'));
      if (items.length !== data.inquiries.length) throw new Error('Inquiry data is incomplete. Please retry.');
      setInquiries(items); setLastLoaded(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load inquiries.'); }
    finally { setLoading(false); }
  }, []);
  const loadRecords = useCallback(async (search = '') => {
    setRecordsLoading(true); setRecordsError('');
    try {
      const response = await fetch(`/api/v1/registry?q=${encodeURIComponent(search)}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.records)) throw new Error('The public registry is unavailable. Try again when the canonical service is responding.');
      setRecords(data.records.filter((item: PublicRecord) => item && typeof item.qrvid === 'string' && item.qrvid.length > 0).map((item: Record<string, unknown>) => ({ qrvid: String(item.qrvid), title: typeof item.title === 'string' ? item.title : '', issuer: typeof item.issuer === 'string' ? item.issuer : '', status: typeof item.status === 'string' ? item.status : typeof item.state === 'string' ? item.state : 'NOT_SUPPLIED' })));
    } catch (err) { setRecordsError(err instanceof Error ? err.message : 'Unable to load public records.'); }
    finally { setRecordsLoading(false); }
  }, []);
  const loadNetwork = useCallback(async () => {
    setNetworkLoading(true);
    try {
      const response = await fetch('/api/v1/status', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const payload = await response.json();
      const services = (Array.isArray(payload.services) ? payload.services : []).map((service: { name?: string; status?: string }) => ({ name: typeof service.name === 'string' ? service.name : 'Service', status: typeof service.status === 'string' ? service.status : 'UNKNOWN' }));
      const overall = String(payload.status || '').toUpperCase();
      const partial = /DEGRADED|PARTIAL|PENDING/.test(overall) || services.some((service: { status: string }) => !/^(OK|OPERATIONAL|HEALTHY|AVAILABLE)$/.test(service.status.toUpperCase()));
      setNetwork({ state: !response.ok || /UNAVAILABLE|DOWN|FAILED/.test(overall) ? 'Unavailable' : partial ? 'Partial' : payload.ok === true || /^(OK|OPERATIONAL|HEALTHY|AVAILABLE)$/.test(overall) ? 'Available' : 'Partial', services, checkedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) });
    } catch { setNetwork({ state: 'Unavailable', services: [], checkedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }); }
    finally { setNetworkLoading(false); }
  }, []);
  useEffect(() => {
    const sync = () => { const id = window.location.hash.slice(1); if (sections.some(([key]) => key === id)) setSection(id as Section); else setSection('overview'); };
    const timer = window.setTimeout(() => { sync(); void loadInquiries(); void loadRecords(); void loadNetwork(); }, 0);
    window.addEventListener('hashchange', sync);
    return () => { window.clearTimeout(timer); window.removeEventListener('hashchange', sync); };
  }, [loadInquiries, loadRecords, loadNetwork]);

  async function update(id: string, status: string) {
    setBusy(id); setNotice('');
    try {
      const response = await fetch('/api/dashboard/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }), signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Unable to save this change. Please retry.');
      setInquiries(items => items.map(item => item.id === id ? { ...item, status } : item)); setNotice('Inquiry status saved.');
    } catch (err) { setNotice(err instanceof Error ? err.message : 'Unable to save this change.'); }
    finally { setBusy(''); }
  }
  const visible = inquiries.filter(item => (filter === 'ALL' || item.status === filter) && `${item.organization} ${item.email} ${item.id}`.toLowerCase().includes(query.toLowerCase()));
  const summary = inquirySummary(inquiries);
  const title = sections.find(([id]) => id === section)?.[1] || 'Overview';
  function exportInquiries() {
    const url = URL.createObjectURL(new Blob(['\ufeff', inquiriesCsv(visible)], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `qrv-inquiries-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${visible.length} filtered inquiries. The CSV contains contact information; store it securely.`);
  }
  async function copyLocator(qrvid: string) {
    try { await navigator.clipboard.writeText(`https://qrv.network/verify/${encodeURIComponent(qrvid)}`); setNotice('Verification URL copied.'); }
    catch { setNotice('Copy is unavailable in this browser. Open the verification link to copy its URL.'); }
  }
  function refresh() { void loadInquiries(); void loadRecords(recordQuery); void loadNetwork(); }
  function searchRecords(event: FormEvent) { event.preventDefault(); void loadRecords(recordQuery); }

  const metrics = [['Inquiries loaded', summary.total, 'Latest 200 entries', 'records'], ['New inquiries', summary.new, 'Awaiting first review', 'plus'], ['In review', summary.review, 'Follow-up in progress', 'team'], ['Closed inquiries', summary.closed, 'Review completed', 'certificate']] as const;
  const workflow = {
    'issue-record': { icon: 'plus', title: 'Issue with an authorized account', description: 'Record creation requires approved issuer scope and server-side signing. Administrator access to this Site does not grant issuance authority.', href: '/issuer', action: 'Open issuer access', steps: ['Confirm issuer organization and permissions', 'Prepare record information and validity dates', 'Issue through the canonical service', 'Verify the resulting QRVID and audit entry'] },
    certificates: { icon: 'certificate', title: 'Certificate operations', description: 'Certificate templates, issuance, and downloads require an issuer connection. No certificate inventory is connected to this admin workspace.', href: '/issuer/dashboard', action: 'Open issuer workspace', steps: ['Review approved certificate templates', 'Bind a certificate to a canonical record', 'Confirm the identifier and validity window', 'Export only after issuance is confirmed'] },
    'api-keys': { icon: 'key', title: 'Integration credentials', description: 'API key administration is not connected to this workspace. Signing keys and mutation credentials must remain server-side.', href: '/developers', action: 'Read integration documentation', steps: ['Use scoped service credentials', 'Keep private keys off the browser', 'Record rotation and revocation events', 'Verify permissions before enabling mutations'] },
    team: { icon: 'team', title: 'Team and access', description: 'This workspace uses a server-configured administrator allowlist. Team invitations, role changes, and issuer membership management are not connected here.', href: '/contact', action: 'Request access support', steps: ['Confirm the organization and operating contact', 'Separate administrator and issuer responsibilities', 'Grant only the required permissions', 'Review access when responsibilities change'] },
    billing: { icon: 'card', title: 'Plans and billing', description: 'No subscription, invoice, payment method, or usage-billing service is connected to this dashboard. Pricing information is available on the public site.', href: '/pricing', action: 'Review plans', steps: ['Select the appropriate issuer plan', 'Confirm any limits with the provider', 'Activate billing through an approved payment flow', 'Review invoices in the connected billing service'] },
  } as const;

  return <div className="admin-app">
    <aside className="admin-sidebar"><Link href="/" className="admin-brand">QR‑V<span>GLOBAL VERIFICATION NETWORK</span></Link><div className="admin-workspace-label"><span className="admin-org-icon">Q</span><div><strong>Network workspace</strong><small>Administrator</small></div><span className="admin-lock">◇</span></div><p className="admin-nav-label">WORKSPACE</p>
      <nav aria-label="Admin dashboard navigation">{sections.map(([id, label, icon], index) => <a key={id} className={index === 7 ? 'admin-nav-divider' : undefined} href={`#${id}`} aria-current={section === id ? 'page' : undefined}><Icon name={icon} /><span>{label}</span>{id === 'overview' && <i />}</a>)}</nav>
      <div className="admin-sidebar-bottom"><Link href="/docs">Documentation <span>↗</span></Link><Link href="/dashboard">User dashboard <span>↗</span></Link><div className="admin-account"><span className="admin-avatar">{name.slice(0, 1).toUpperCase() || 'A'}</span><div><strong>{name}</strong><small>{email}</small></div></div><a className="admin-signout" href={chatGPTSignOutPath()} target="_top">Sign out</a></div>
    </aside>
    <main className="admin-main"><header className="admin-topbar"><div><span>Workspace</span><b>/</b><strong>{title}</strong></div><div><Link href="/status" className={`admin-network-pill admin-network-${network.state.toLowerCase()}`}><i />{networkLoading ? 'Checking network' : `Network ${network.state.toLowerCase()}`}</Link><Link href="/">Website ↗</Link><span className="admin-avatar admin-avatar-small" aria-label={`Signed in as ${name}`}>{name.slice(0, 1).toUpperCase() || 'A'}</span></div></header>
      <div className="admin-content"><div className="admin-heading"><div><p className="admin-overline">QR‑V ADMINISTRATION</p><h1>{title === 'Overview' ? 'Admin dashboard' : title}</h1><p>{section === 'overview' ? 'A clear view of your inquiry queue and network operations.' : section === 'analytics' ? 'Understand inquiry arrivals and the current review queue.' : 'Manage your verification network workspace.'}</p></div><div className="admin-actions"><button className="admin-button" onClick={refresh} disabled={loading || recordsLoading || networkLoading}><Icon name="refresh" />Refresh</button><a className="admin-button admin-button-primary" href="#issue-record"><Icon name="plus" />Issue record</a></div></div>
      {notice && <div className="admin-feedback" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div>}
      {(section === 'overview' || section === 'analytics') && <>
        <section className="admin-kpis" aria-label="Inquiry summary">{metrics.map(([label, value, caption, icon]) => <article key={label}><div><span>{label}</span><Icon name={icon} /></div><strong>{loading || error ? '—' : value}</strong><small>{caption}</small></article>)}</section>
        <Charts inquiries={inquiries} days={days} setDays={setDays} loading={loading} error={error} />
        {section === 'overview' && <section className="admin-utility-grid"><article className="admin-panel admin-network-card"><div className="admin-panel-head"><div><p className="admin-overline">SERVICE STATUS</p><h2>Network health</h2></div><span className={`admin-network-pill admin-network-${network.state.toLowerCase()}`}><i />{networkLoading ? 'Checking' : network.state}</span></div><p>Status from the canonical API. A responding frontend alone does not establish network availability.</p><ul>{network.services.length ? network.services.map((service, index) => <li key={`${service.name}-${index}`}><span>{service.name}</span><b>{readable(service.status)}</b></li>) : <li><span>Canonical status service</span><b>{networkLoading ? 'Checking' : network.state}</b></li>}</ul><div className="admin-panel-footer"><span>{network.checkedAt ? `Checked ${network.checkedAt}` : 'Check in progress'}</span><Link href="/status">Status details ↗</Link></div></article>
          <article className="admin-panel admin-quick-actions"><p className="admin-overline">NEXT ACTIONS</p><h2>Keep work moving</h2><a href="#records"><Icon name="records" /><div><strong>Explore public records</strong><small>Look up current registry entries</small></div><Icon name="arrow" /></a><Link href="/issuer"><Icon name="plus" /><div><strong>Open issuer access</strong><small>Authorize issuance and revocation</small></div><Icon name="arrow" /></Link><a href="#api-keys"><Icon name="key" /><div><strong>Review integrations</strong><small>Service access and credential boundaries</small></div><Icon name="arrow" /></a></article></section>}
        <section className="admin-panel admin-inquiry-panel"><div className="admin-panel-head"><div><p className="admin-overline">ISSUER ONBOARDING</p><h2>Issuer inquiries <span className="admin-count">{loading || error ? '—' : visible.length}</span></h2><p>Latest 200 inquiries · {lastLoaded ? `updated ${lastLoaded}` : 'loading'}</p></div><button className="admin-button" disabled={loading || !!error || !visible.length} onClick={exportInquiries}><Icon name="download" />Export CSV</button></div>
          <div className="admin-filters"><label><span className="sr-only">Search inquiries</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search organization, email, or reference…" /></label><select aria-label="Inquiry status" value={filter} onChange={event => setFilter(event.target.value)}><option value="ALL">All statuses</option><option value="NEW">New</option><option value="IN_REVIEW">In review</option><option value="CLOSED">Closed</option></select></div>
          {loading ? <div className="admin-empty" role="status">Loading inquiries…</div> : error ? <div className="admin-empty" role="alert"><h3>Inquiry data unavailable</h3><p>{error}</p><button className="admin-button" onClick={loadInquiries}>Try again</button></div> : !visible.length ? <div className="admin-empty"><Icon name="records" /><h3>No matching inquiries</h3><p>{inquiries.length ? 'Try another search or status filter.' : 'New issuer inquiries will appear here.'}</p></div> : <div className="admin-inquiries">{visible.map(item => <details key={item.id}><summary><span className="admin-inquiry-org"><span className="admin-org-avatar">{item.organization.slice(0, 1).toUpperCase()}</span><span><strong>{item.organization}</strong><small>{item.use_case}</small></span></span><span className={`admin-badge admin-badge-${item.status.toLowerCase()}`}>{readable(item.status)}</span><time dateTime={item.created_at}>{dateLabel(item.created_at)}</time><span className="admin-detail-toggle">⌄</span></summary><div className="admin-inquiry-detail"><div><strong>{item.contact_name}</strong><span>{item.email}</span><small>Reference: {item.id}</small></div><p>{item.message}</p><label>Review status<select value={item.status} disabled={!!busy} onChange={event => update(item.id, event.target.value)}><option value="NEW">New</option><option value="IN_REVIEW">In review</option><option value="CLOSED">Closed</option>{!['NEW','IN_REVIEW','CLOSED'].includes(item.status) && <option value={item.status}>{readable(item.status)}</option>}</select>{busy === item.id && <span>Saving…</span>}</label></div></details>)}</div>}
        </section>
      </>}
      {(['records', 'qr-codes', 'revocations'] as string[]).includes(section) && <>
        <div className="admin-info"><Icon name={section === 'revocations' ? 'shield' : 'records'} /><div><strong>{section === 'revocations' ? 'Public revocation visibility' : section === 'qr-codes' ? 'Canonical verification links' : 'Public registry view'}</strong><p>{section === 'revocations' ? 'Revoked results below come from the public registry response. This is not an issuer-owned inventory. Revocation changes require authorized issuer access.' : section === 'qr-codes' ? 'Copy a canonical verification URL for a returned record. QR image generation and downloads are not connected to this workspace.' : 'Results are public registry entries, not a list of records you own. Registry status is supplied by the canonical service.'}</p></div></div>
        <section className="admin-panel"><div className="admin-panel-head"><div><p className="admin-overline">CANONICAL REGISTRY</p><h2>{section === 'revocations' ? 'Revoked public results' : section === 'qr-codes' ? 'Record verification links' : 'Records'}</h2></div><Link className="admin-button" href="/issuer">Issuer access ↗</Link></div><form className="admin-filters" onSubmit={searchRecords}><label><span className="sr-only">Search public registry</span><input type="search" placeholder="Search QRVID, title, or issuer…" value={recordQuery} onChange={event => setRecordQuery(event.target.value)} /></label><button className="admin-button admin-button-primary" disabled={recordsLoading}>Search</button></form>
          {recordsLoading ? <div className="admin-empty" role="status">Loading public records…</div> : recordsError ? <div className="admin-empty" role="alert"><h3>Registry unavailable</h3><p>{recordsError}</p><button className="admin-button" onClick={() => loadRecords(recordQuery)}>Try again</button></div> : <><div className="admin-table"><table><caption className="sr-only">Public registry results</caption><thead><tr><th>Record</th><th>Issuer</th><th>Registry status</th><th>Action</th></tr></thead><tbody>{records.filter(item => section !== 'revocations' || item.status.toUpperCase() === 'REVOKED').map((item, index) => <tr key={`${item.qrvid}-${index}`}><td><strong>{item.title || item.qrvid}</strong><small>{item.qrvid}</small></td><td>{item.issuer || 'Not supplied'}</td><td><span className="admin-badge">{readable(item.status)}</span></td><td>{section === 'qr-codes' && <button className="admin-copy" onClick={() => copyLocator(item.qrvid)}>Copy URL</button>}<Link href={`/verify/${encodeURIComponent(item.qrvid)}`}>Verify ↗</Link></td></tr>)}</tbody></table></div>{!records.filter(item => section !== 'revocations' || item.status.toUpperCase() === 'REVOKED').length && <div className="admin-empty"><h3>No matching records returned</h3><p>{section === 'revocations' ? 'No revoked entries in this public response. This is not a network-wide revocation count.' : 'Try a different identifier, title, or issuer.'}</p></div>}</>}
        </section></>}
      {section in workflow && (() => { const tool = workflow[section as keyof typeof workflow]; return <><div className="admin-info"><Icon name="shield" /><div><strong>Service connection required</strong><p>This section provides workflow guidance and access links. No unconnected operation is presented as completed.</p></div></div><div className="admin-workflow-grid"><article className="admin-panel admin-tool-panel"><div className="admin-tool-icon"><Icon name={tool.icon} /></div><span className="admin-tag">Not connected</span><h2>{tool.title}</h2><p>{tool.description}</p><Link className="admin-button admin-button-primary" href={tool.href}>{tool.action}<Icon name="arrow" /></Link></article><article className="admin-panel"><p className="admin-overline">OPERATIONAL CHECKLIST</p><h2>Before activation</h2><ol className="admin-checklist">{tool.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol><Link className="admin-text-link" href="/docs">Read the documentation ↗</Link></article></div></>; })()}
      {section === 'settings' && <div className="admin-workflow-grid"><article className="admin-panel"><p className="admin-overline">SIGNED-IN ACCOUNT</p><h2>Workspace settings</h2><dl className="admin-settings"><div><dt>Name</dt><dd>{name}</dd></div><div><dt>Email</dt><dd>{email}</dd></div><div><dt>Workspace access</dt><dd>Administrator allowlist</dd></div><div><dt>Authentication</dt><dd>ChatGPT sign-in</dd></div></dl><p>Identity is supplied by your sign-in session. Administrator access does not grant issuer permissions.</p><Link className="admin-text-link" href="/contact">Request account support ↗</Link></article><article className="admin-panel"><p className="admin-overline">SERVICE CONFIGURATION</p><h2>Authority and data sources</h2><dl className="admin-settings"><div><dt>Public platform</dt><dd>qrv.network</dd></div><div><dt>API authority</dt><dd>api.qrv.network</dd></div><div><dt>Inquiry storage</dt><dd>{loading ? 'Checking' : error ? 'Unavailable' : 'Connected'}</dd></div><div><dt>Registry</dt><dd>{recordsLoading ? 'Checking' : recordsError ? 'Unavailable' : 'Public lookup connected'}</dd></div></dl><p>Service endpoints and administrator access are configured server-side. Credentials are not exposed or editable here.</p><Link className="admin-text-link" href="/developers">Integration documentation ↗</Link></article></div>}
      <footer className="admin-footer"><span>QR‑V Global Verification Network</span><span>Controlled access. Canonical records. <Link href="/docs">Documentation ↗</Link></span></footer>
      </div>
    </main>
  </div>;
}
