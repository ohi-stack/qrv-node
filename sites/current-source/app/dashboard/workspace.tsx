'use client';

import { type FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { chatGPTSignOutPath } from '../chatgpt-auth-client';

type RecordItem = { qrvid: string; title?: string; issuer?: string; status?: string; state?: string };
type RegistryRequest = { search: string };
const verificationPath = (qrvid: string) => '/verify/' + encodeURIComponent(qrvid);

export default function Dashboard({ name, email, isAdmin }: { name: string; email: string; isAdmin: boolean }) {
  const router = useRouter();
  const [qrvid, setQrvid] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [query, setQuery] = useState('');
  const [request, setRequest] = useState<RegistryRequest>({ search: '' });
  const [result, setResult] = useState<{ request: RegistryRequest; records: RecordItem[]; error: boolean }>();
  const current = result?.request === request ? result : undefined;

  useEffect(() => {
    const controller = new AbortController();
    async function loadRegistry() {
      try {
        const response = await fetch('/api/v1/registry?q=' + encodeURIComponent(request.search), {
          cache: 'no-store',
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
        });
        const data = await response.json();
        if (!response.ok || data.ok === false || !Array.isArray(data.records)) throw new Error('Registry unavailable');
        const records: RecordItem[] = data.records.flatMap((item: Partial<RecordItem> | null) => {
          if (!item || typeof item.qrvid !== 'string' || !/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/i.test(item.qrvid)) return [];
          return [{
            qrvid: item.qrvid,
            title: typeof item.title === 'string' ? item.title : undefined,
            issuer: typeof item.issuer === 'string' ? item.issuer : undefined,
            status: typeof item.status === 'string' ? item.status : undefined,
            state: typeof item.state === 'string' ? item.state : undefined,
          }];
        });
        if (!controller.signal.aborted) setResult({ request, records, error: false });
      } catch {
        if (!controller.signal.aborted) setResult({ request, records: [], error: true });
      }
    }
    void loadRegistry();
    return () => controller.abort();
  }, [request]);

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = qrvid.trim().toUpperCase();
    if (!/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/.test(normalized)) {
      setVerifyError('Enter a valid QR-V identifier, such as QRV-PROD-CERT-000001.');
      return;
    }
    router.push(verificationPath(normalized));
  }

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequest({ search: query.trim() });
  }

  function clearSearch() {
    setQuery('');
    setRequest({ search: '' });
  }

  return <div className="dash-layout dash-user">
    <aside className="dash-sidebar">
      <Link href="/" className="dash-brand">QR-V<span>Verification Network</span></Link>
      <nav aria-label="Dashboard navigation">
        <Link aria-current="page" href="/dashboard">User dashboard</Link>
        <a href="#registry-results">Search public records</a>
        <Link href="/issuer/dashboard">Issuer workspace</Link>
        <Link href="/status">Network status</Link>
        {isAdmin && <Link href="/admin">Admin dashboard</Link>}
      </nav>
      <div className="dash-account"><strong>{name}</strong><span>{email}</span><a target="_top" href={chatGPTSignOutPath()}>Sign out</a></div>
    </aside>
    <main className="dash-main">
      <header className="dash-top"><span>My workspace</span><Link href="/">Public website ↗</Link></header>
      <div className="dash-heading">
        <div><h1>User dashboard</h1><p>Verify a QR-V identifier or find a record in the public registry.</p></div>
      </div>
      <section className="dash-panel dash-verify" aria-labelledby="dashboard-verify-title">
        <h2 id="dashboard-verify-title">Verify a record</h2>
        <form className="dash-search" onSubmit={verify}>
          <label htmlFor="dashboard-qrvid" className="sr-only">QR-V identifier</label>
          <input id="dashboard-qrvid" value={qrvid} onChange={event => { setQrvid(event.target.value); setVerifyError(''); }} aria-invalid={!!verifyError} aria-describedby={verifyError ? 'dashboard-verify-error' : undefined} placeholder="Enter a QR-V identifier" autoComplete="off" required />
          <button className="dash-primary" disabled={!qrvid.trim()}>Verify record</button>
        </form>
        {verifyError && <p id="dashboard-verify-error" role="alert">{verifyError}</p>}
      </section>
      <section className="dash-panel" id="registry-results" aria-labelledby="dashboard-registry-title">
        <div className="dash-panel-title">
          <div><h2 id="dashboard-registry-title">Public registry</h2><p>Search publicly listed records by identifier, title, or issuer.</p></div>
          <button onClick={() => setRequest({ search: request.search })} disabled={!current}>Refresh</button>
        </div>
        <form className="dash-search" onSubmit={search}>
          <label htmlFor="dashboard-search" className="sr-only">Search public registry</label>
          <input type="search" id="dashboard-search" value={query} onChange={event => setQuery(event.target.value)} maxLength={80} placeholder="Search by QRVID, title, or issuer" />
          <button className="dash-primary">Search</button>
        </form>
        <div className="dash-result-summary">
          <span role="status">{!current ? 'Loading public records…' : current.error ? '' : request.search ? `${current.records.length} results for “${request.search}”` : `${current.records.length} public records returned`}</span>
          {request.search && <button type="button" onClick={clearSearch}>Clear search</button>}
        </div>
        {current?.error ? <div className="dash-empty" role="alert"><h3>Registry unavailable</h3><p>Try again to load public results.</p><button onClick={() => setRequest({ search: request.search })}>Try again</button></div>
        : current?.records.length ? <div className="dash-table" tabIndex={0} role="region" aria-label="Public registry results"><table><thead><tr><th scope="col">Record</th><th scope="col">Issuer</th><th scope="col">Registry status</th><th scope="col">Action</th></tr></thead><tbody>{current.records.map((item, index) => <tr key={item.qrvid + '-' + index}><td><strong>{item.title || item.qrvid}</strong><small>{item.qrvid}</small></td><td>{item.issuer || 'Not supplied'}</td><td><span className="dash-badge">{(item.status || item.state || 'Not supplied').replaceAll('_', ' ')}</span></td><td><Link href={verificationPath(item.qrvid)} aria-label={`Verify ${item.qrvid}`}>Verify ↗</Link></td></tr>)}</tbody></table></div>
        : current && <div className="dash-empty"><h3>No records found</h3><p>{request.search ? 'Try another identifier, title, or issuer.' : 'The registry returned no records.'}</p></div>}
      </section>
      <section className="dash-bottom" aria-label="Workspace resources">
        <article><h2>Issuer workspace</h2><p>Review the requirements for issuing and revoking records.</p><Link href="/issuer/dashboard">Open issuer workspace →</Link></article>
        <article><h2>Verification help</h2><p>Learn what each record status means.</p><Link href="/docs">Read documentation →</Link></article>
      </section>
    </main>
  </div>;
}
