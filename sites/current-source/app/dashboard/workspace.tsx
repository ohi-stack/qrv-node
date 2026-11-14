'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { chatGPTSignOutPath } from '../chatgpt-auth-client';
type RecordItem = { qrvid: string; title?: string; issuer?: string; status?: string };
type Inquiry = { id: string; organization: string; contact_name: string; email: string; use_case: string; message: string; status: string; created_at: string };
export default function Dashboard({ name, email, admin, isAdmin }: { name: string; email: string; admin: boolean; isAdmin: boolean }) {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const load = useCallback(async (search = '') => {
    setLoading(true); setError('');
    try {
      const response = await fetch(admin ? '/api/dashboard/admin' : `/api/v1/registry?q=${encodeURIComponent(search)}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(admin ? data.error : 'The public registry is unavailable. Please try again.');
      if (admin) setInquiries(data.inquiries || []); else setRecords(data.records || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load the workspace.'); }
    finally { setLoading(false); }
  }, [admin]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  async function update(id: string, status: string) {
    setBusy(id); setNotice('');
    try {
      const response = await fetch('/api/dashboard/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (!response.ok) throw new Error('Unable to save this change. Please retry.');
      setInquiries(items => items.map(item => item.id === id ? { ...item, status } : item)); setNotice('Inquiry status saved.');
    } catch (err) { setNotice((err as Error).message); } finally { setBusy(''); }
  }
  function search(event: FormEvent) { event.preventDefault(); if (!admin) void load(query); }
  const visible = inquiries.filter(item => (filter === 'ALL' || item.status === filter) && `${item.organization} ${item.email} ${item.id}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="dash-layout">
    <aside className="dash-sidebar"><Link href="/" className="dash-brand">QR-V<span>Verification Network</span></Link><p className="dash-eyebrow">WORKSPACE</p><nav aria-label="Dashboard navigation"><Link aria-current={!admin ? 'page' : undefined} href="/dashboard">User dashboard</Link>{isAdmin && <Link aria-current={admin ? 'page' : undefined} href="/admin">Admin dashboard</Link>}<Link href="/verify">Verify a record</Link><Link href="/registry">Public registry</Link><Link href="/issuer">Issuer access</Link><Link href="/status">Network status</Link></nav><div className="dash-account"><strong>{name}</strong><span>{email}</span><a target="_top" href={chatGPTSignOutPath()}>Sign out</a></div></aside>
    <main className="dash-main"><header className="dash-top"><span>{admin ? 'Administration' : 'My workspace'}</span><Link href="/">Back to website ↗</Link></header><div className="dash-heading"><div><p className="dash-eyebrow">{admin ? 'NETWORK OPERATIONS' : 'RECORD EXPLORER'}</p><h1>{admin ? 'Admin dashboard' : 'User dashboard'}</h1><p>{admin ? 'Review issuer inquiries and track follow-up.' : 'Find public records and check their current verification status.'}</p></div><Link className="dash-primary" href={admin ? '/status' : '/verify'}>{admin ? 'Network status' : 'Verify a record'} ↗</Link></div>
    <section className="dash-metrics" aria-label="Workspace summary">{(admin ? [['Inquiries loaded', inquiries.length], ['New', inquiries.filter(i => i.status === 'NEW').length], ['In review', inquiries.filter(i => i.status === 'IN_REVIEW').length]] : [['Records returned', records.length], ['Verification', 'Live lookup'], ['Account', 'Signed in']]).map(([label, value]) => <article key={label}><span>{label}</span><strong>{loading || error ? '—' : value}</strong></article>)}</section>
    <section className="dash-panel"><div className="dash-panel-title"><div><h2>{admin ? 'Issuer inquiries' : 'Public records'}</h2><p>{admin ? 'Latest 200 inquiries. Open an inquiry to review its details.' : 'Public registry results are not a list of records you own.'}</p></div><button onClick={() => load(query)} disabled={loading}>Refresh</button></div>
    <form className="dash-search" onSubmit={search}><label htmlFor="dashboard-search" className="sr-only">{admin ? 'Filter inquiries' : 'Search registry'}</label><input id="dashboard-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={admin ? 'Search organization, email or reference' : 'Search QRVID, title or issuer'} />{admin ? <select aria-label="Inquiry status" value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">All statuses</option><option value="NEW">New</option><option value="IN_REVIEW">In review</option><option value="CLOSED">Closed</option></select> : <button className="dash-primary" disabled={loading}>Search</button>}</form>
    <p role="status">{notice}</p>{loading ? <div className="dash-empty" role="status">Loading your workspace…</div> : error ? <div className="dash-empty" role="alert"><h3>Unable to load data</h3><p>{error}</p><button onClick={() => load(query)}>Try again</button></div> : admin ? visible.length ? <div className="dash-inquiries">{visible.map(item => <details key={item.id}><summary><span><strong>{item.organization}</strong><small>{item.use_case} · {new Date(item.created_at).toLocaleDateString()}</small></span><span className="dash-badge">{item.status.replaceAll('_', ' ')}</span></summary><div className="dash-detail"><p><strong>{item.contact_name}</strong> · {item.email}</p><p className="dash-message">{item.message}</p><small>{item.id}</small><label>Status <select value={item.status} disabled={busy === item.id} onChange={e => update(item.id, e.target.value)}><option value="NEW">New</option><option value="IN_REVIEW">In review</option><option value="CLOSED">Closed</option></select></label></div></details>)}</div> : <div className="dash-empty"><h3>No matching inquiries</h3><p>New issuer inquiries will appear here.</p></div> : records.length ? <div className="dash-table"><table><thead><tr><th>Record</th><th>Issuer</th><th>Registry status</th><th>Action</th></tr></thead><tbody>{records.map(item => <tr key={item.qrvid}><td><strong>{item.title || item.qrvid}</strong><small>{item.qrvid}</small></td><td>{item.issuer || 'Not supplied'}</td><td><span className="dash-badge">{item.status || 'Not supplied'}</span></td><td><Link href={`/verify/${encodeURIComponent(item.qrvid)}`}>Verify ↗</Link></td></tr>)}</tbody></table></div> : <div className="dash-empty"><h3>No records found</h3><p>Try another identifier, title or issuer.</p></div>}</section>
    <section className="dash-bottom"><article><h2>{admin ? 'Issuer operations' : 'Need to issue records?'}</h2><p>Issuance and revocation require authorized issuer access.</p><Link href="/issuer">Open issuer access →</Link></article><article><h2>Help and documentation</h2><p>Understand verification states and the QR-V lifecycle.</p><Link href="/docs">Read documentation →</Link></article></section></main></div>;
}
