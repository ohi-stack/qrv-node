import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, Code2, Database, FileCheck2, Globe2, LockKeyhole, Network, ShieldCheck } from 'lucide-react';
import { QRV_CONFIG, verifyUrl } from './config.js';

const nav = [
  ['Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Verify', '/verify'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['Pricing', '/pricing'],
  ['About', '/about']
];

const genericPages = {
  '/protocol': ['Protocol', 'QRVP-1', 'Identifier, resolution, registry lookup, validation, lifecycle status, and verification responses.'],
  '/how-it-works': ['Workflow', 'Issue → Scan → Verify', 'Issuers create canonical records; users scan QR-V links; the trusted API returns deterministic lifecycle state.'],
  '/use-cases': ['Solutions', 'Verification for records that matter', 'Certificates, memberships, products, documents, assets, financial records, and property records.'],
  '/about': ['Company', 'About QR-V™', 'Registry-backed verification infrastructure and protocol technology operated as a ONEGODIAN, LLC product.'],
  '/standards': ['Standard', 'QVS-1.0', 'Operational verification rules for deterministic registry-backed QR-V records.'],
  '/security': ['Security', 'Secure by default', 'The browser platform is separated from the API, datastore, signing material, and privileged secrets.'],
  '/developers': ['Developers', 'Build on QR-V', `Canonical API: ${QRV_CONFIG.apiBaseUrl}`],
  '/pricing': ['Commercial', 'Issuer pricing', 'Production issuer plans support certificate, identity, document, product, and enterprise verification workflows.'],
  '/store': ['Store', 'QR-V products and services', 'Commercial onboarding and implementation packages live on the canonical platform.'],
  '/enterprise': ['Enterprise', 'Institutional verification infrastructure', 'Issuer onboarding, imports, API integration, audit reporting, and white-label deployments.'],
  '/certificate-verification': ['Certificates', 'QR-V™ Verified Certificates', 'The first commercial lifecycle: issue, anchor, generate QR, verify, expire, or revoke.'],
  '/docs': ['Documentation', 'QR-V documentation', 'Protocol, standard, architecture, verification, issuer, and API documentation.'],
  '/docs/overview': ['Docs', 'System Overview', 'qrv.network is the public platform; api.qrv.network is the trusted backend.'],
  '/docs/protocol': ['Docs', 'QRVP-1', 'Canonical verification URLs use qrv.network/verify/{QRVID}.'],
  '/docs/verification': ['Docs', 'Verification', 'Verification states are returned from the canonical registry and API, not asserted by the browser.'],
  '/docs/registry': ['Docs', 'Registry', 'Canonical registry persistence remains private behind api.qrv.network.'],
  '/docs/issuers': ['Docs', 'Issuers', 'Issue and manage QR-V records through qrv.network/issuer.'],
  '/docs/developers': ['Docs', 'Developers', 'External systems integrate with api.qrv.network.'],
  '/api-reference': ['API', 'QR-V API Reference', `Use ${QRV_CONFIG.apiBaseUrl} for new integrations.`],
  '/network': ['Network', 'QR-V Global Verification Network', 'One public platform node and one trusted API/data node form the canonical production network.'],
  '/billing': ['Billing', 'Billing & Entitlements', 'Commercial entitlement enforcement belongs behind the trusted backend.'],
  '/wallet': ['Wallet', 'QR-V Wallet', 'Reserved module for user-held verification references and credentials. No financial custody is implied.'],
  '/admin': ['Administration', 'QR-V Administration', 'Private operational administration remains access-controlled while privileged operations execute through the API.']
};

const useCases = [
  ['Certificates', 'Diplomas, training certificates, awards, compliance credentials, and continuing education records.'],
  ['Membership IDs', 'Private-network credentials, association memberships, event credentials, and access passes.'],
  ['Product Authentication', 'Registry-backed authenticity checks for packaged goods, collectibles, labels, and serialized assets.'],
  ['Documents', 'Contracts, notices, filings, PDFs, statements, and controlled records that require public proof.'],
  ['Asset Records', 'Equipment, property-related records, inventory tags, warranties, and custody references.'],
  ['Developer Integrations', 'APIs and SDK tooling for systems that need deterministic verification results.']
];

const steps = [
  ['Issue', 'An authorized issuer creates a QR-V record and receives a QRVID.'],
  ['Anchor', 'The QRVID is stored with canonical registry metadata, issuer details, status, timestamps, and proof references.'],
  ['Scan', 'A user scans a QR code or opens a verification URL.'],
  ['Verify', 'QR-V resolves the identifier through the trusted API and returns the record state.']
];

function Header() {
  return <header className="site-header">
    <a className="brand" href="/"><span className="brand-mark">QR-V</span><span>Global Verification Network</span></a>
    <nav>{nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
    <a className="header-cta" href="/issuer">Issuer Portal</a>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="footer-grid">
    <div><strong>QR-V™ Global Verification Network</strong><p className="small">Registry-backed verification infrastructure. QRVP-1 • QVS-1.0.</p></div>
    <div><strong>Platform</strong><a href="/verify">Verify</a><a href="/registry">Registry</a><a href="/issuer">Issuer</a><a href="/status">Status</a></div>
    <div><strong>Standards</strong><a href="/protocol">QRVP-1</a><a href="/standards">QVS-1.0</a><a href="/security">Security</a><a href="/docs">Documentation</a></div>
    <div><strong>Company</strong><a href="/about">About</a><a href="/pricing">Pricing</a><a href="/enterprise">Enterprise</a><a href="/developers">Developers</a></div>
  </div></footer>;
}

function Layout({ children }) { return <><Header />{children}<Footer /></>; }
function IconCard({ icon: Icon, title, children }) { return <article className="card"><Icon size={34} /><h3>{title}</h3><p>{children}</p></article>; }

function Home() {
  const services = [
    ['Verification Portal', '/verify', 'Public QRVID lookup and verification results.'],
    ['Issuer Portal', '/issuer', 'Create records, issue certificates, generate QR codes, and revoke credentials.'],
    ['API Gateway', '/developers', 'JSON endpoints for issuance, verification, revocation, and integrations.'],
    ['Registry', '/registry', 'Public-safe registry lookup backed by the canonical data authority.'],
    ['Docs', '/docs', 'Protocol, architecture, standards, and implementation references.'],
    ['Developers', '/developers', 'API guides, integration examples, and developer resources.']
  ];
  return <Layout><main>
    <section className="hero section"><div>
      <p className="eyebrow">QR-V™ • Global QR Verification Network</p>
      <h1>A verification layer for QR-based systems.</h1>
      <p className="lead">QR-V transforms ordinary QR codes into registry-anchored digital references that can be checked for authenticity, issuer identity, integrity, and lifecycle status.</p>
      <div className="cta-row"><a className="btn primary" href={verifyUrl()}>Verify Demo Record <ArrowRight size={18}/></a><a className="btn secondary" href="/issuer">Start Issuer Onboarding</a></div>
      <p className="flow">QR Scan → Identifier Resolution → Registry Lookup → Validation → Result</p>
    </div><div className="hero-panel"><p className="panel-label">Production demo QRVID</p><h2>{QRV_CONFIG.demoQrvid}</h2><p>Verification status is resolved live from the canonical API.</p><a href={verifyUrl()}>{verifyUrl()}</a></div></section>

    <section className="section grid-3">
      <IconCard icon={Network} title="Protocol-first architecture">QR-V is not a QR generator. It is verification infrastructure built around QRVID resolution, registry records, and deterministic states.</IconCard>
      <IconCard icon={Database} title="Registry-backed records">Each QRVID resolves to a canonical record containing issuer, type, status, timestamps, and proof references.</IconCard>
      <IconCard icon={ShieldCheck} title="Public trust surface">The browser displays what the trusted verification API establishes; it never creates verification truth locally.</IconCard>
    </section>

    <section className="section split dark"><div><p className="eyebrow">How QR-V Works</p><h2>From static QR code to verifiable record.</h2><p>Traditional QR codes usually redirect to a URL. QR-V adds a registry-based verification layer so the identifier can be checked against an authoritative record.</p></div><div className="steps">{steps.map(([title,text],i)=><div className="step" key={title}><span>{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

    <section className="section"><div className="section-heading"><p className="eyebrow">Use Cases</p><h2>Built for records where authenticity matters.</h2></div><div className="use-grid">{useCases.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="section split dark"><div><p className="eyebrow">First Commercial Product</p><h2>QR-V™ Verified Certificates.</h2><p>Certificate issuance demonstrates the complete lifecycle: issue → registry anchor → QR → public verification → revoke or expire.</p></div><div className="pricing-grid"><div><h3>Starter Issuer</h3><p className="price">$199/mo</p><p>Up to 1,000 active records.</p></div><div><h3>Growth Issuer</h3><p className="price">$499/mo</p><p>Up to 10,000 records plus API access.</p></div><div><h3>Enterprise</h3><p className="price">Custom</p><p>High-volume, white-label, and institutional workflows.</p></div></div></section>

    <section className="section"><div className="section-heading"><p className="eyebrow">Network Services</p><h2>One platform. One trusted API boundary.</h2></div><div className="services-grid">{services.map(([title,url,text])=><a className="service" href={url} key={title}><Globe2/><h3>{title}</h3><p>{text}</p><span>qrv.network{url}</span></a>)}</div></section>

    <section className="section grid-3"><IconCard icon={LockKeyhole} title="Issuer control">Issuer actions are authenticated, server-authorized, and auditable.</IconCard><IconCard icon={BadgeCheck} title="Status awareness">Records may be verified, revoked, expired, missing, invalid, or unavailable.</IconCard><IconCard icon={Code2} title="Integration-ready">API-first verification lets websites, apps, and workflows use QR-V as a trust layer.</IconCard></section>
    <section className="section final-cta"><Building2 size={48}/><h2>Start with one verified record.</h2><p>Issue a certificate, scan the code, verify the record, and prove the complete QR-V lifecycle.</p><div className="cta-row center"><a className="btn primary" href="/issuer">Open Issuer Portal</a><a className="btn secondary" href="/docs">Read Documentation</a></div></section>
  </main></Layout>;
}

function GenericPage({ data }) {
  const [eyebrow,title,lead] = data;
  return <Layout><main><section className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p></section><section className="content grid-3"><IconCard icon={Network} title="Protocol">QRVP-1 defines identifier, resolution, verification, registry, and response layers.</IconCard><IconCard icon={ShieldCheck} title="Standard">QVS-1.0 governs deterministic registry-backed verification behavior.</IconCard><IconCard icon={Code2} title="Implementation">qrv.network provides the browser platform while api.qrv.network is the trusted backend.</IconCard></section></main></Layout>;
}

async function jsonFetch(url, options) {
  const response = await fetch(url, { credentials: 'same-origin', headers: { 'content-type': 'application/json', ...(options?.headers || {}) }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(payload?.error?.message || payload?.message || `Request failed (${response.status})`), { status: response.status, payload });
  return payload;
}

function VerifyPage({ qrvid }) {
  const [value,setValue]=useState(qrvid || ''); const [result,setResult]=useState(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{ if(qrvid) verify(qrvid); },[qrvid]);
  async function verify(id){const q=String(id||'').trim().toUpperCase(); if(!q)return; setLoading(true);setError('');setResult(null);try{setResult(await jsonFetch(`/platform/verify/${encodeURIComponent(q)}`));}catch(e){setError(e.message);setResult(e.payload||null);}finally{setLoading(false);}}
  function submit(e){e.preventDefault();const q=value.trim().toUpperCase();if(q)location.href=`/verify/${encodeURIComponent(q)}`;}
  return <Layout><main><section className="page-hero"><p className="eyebrow">Public Verification</p><h1>Verify a QR-V record.</h1><p className="lead">Enter a QRVID. The browser asks the platform server, which resolves the authoritative result through api.qrv.network.</p></section><section className="content"><div className="form-panel"><form className="form-grid" onSubmit={submit}><label>QRVID<input value={value} onChange={e=>setValue(e.target.value)} placeholder="QRV-CERT-..." required/></label><button>Verify Record</button></form></div>{loading&&<p className="loading">Resolving registry record…</p>}{error&&<p className="error">{error}</p>}{result&&<div className="result"><span className={`status-pill ${String(result.state||'UNAVAILABLE')}`}>{result.state||'UNAVAILABLE'}</span><h2>{result.qrvid||qrvid}</h2><div className="record-grid"><div><strong>Issuer</strong><p>{result.record?.issuer||'—'}</p></div><div><strong>Type</strong><p>{result.record?.recordType||'—'}</p></div><div><strong>Owner / Subject</strong><p>{result.record?.owner||result.record?.recipient||'—'}</p></div></div>{result.record?.hash&&<p className="mono">{result.record.hash}</p>}</div>}</section></main></Layout>;
}

function RegistryPage({ qrvid }) {
  const [value,setValue]=useState(qrvid||''); const [record,setRecord]=useState(null); const [error,setError]=useState('');
  useEffect(()=>{if(qrvid) load(qrvid)},[qrvid]); async function load(id){try{setRecord(await jsonFetch(`/platform/registry/${encodeURIComponent(id)}`));setError('')}catch(e){setError(e.message);setRecord(null)}}
  function submit(e){e.preventDefault();const q=value.trim().toUpperCase();if(q)location.href=`/registry/${encodeURIComponent(q)}`;}
  return <Layout><main><section className="page-hero"><p className="eyebrow">Registry</p><h1>Public Registry Lookup</h1><p className="lead">Inspect the public-safe canonical record associated with a QRVID.</p></section><section className="content"><div className="form-panel"><form className="form-grid" onSubmit={submit}><label>QRVID<input value={value} onChange={e=>setValue(e.target.value)} placeholder="QRV-CERT-..." required/></label><button>Lookup Record</button></form></div>{error&&<p className="error">{error}</p>}{record&&<pre className="result mono">{JSON.stringify(record.record||record,null,2)}</pre>}</section></main></Layout>;
}

function StatusPage(){const [data,setData]=useState(null);useEffect(()=>{jsonFetch('/platform/status').then(setData).catch(e=>setData({platform:true,api:false,registry:false,error:e.message}))},[]);return <Layout><main><section className="page-hero"><p className="eyebrow">Network Status</p><h1>Production dependency status</h1><p className="lead">HTTP availability is not enough; QR-V distinguishes platform availability from API and registry readiness.</p></section><section className="content grid-3"><StatusCard title="qrv.network" ok={data?.platform}/><StatusCard title="api.qrv.network" ok={data?.api}/><StatusCard title="Canonical Registry" ok={data?.registry}/></section></main></Layout>}
function StatusCard({title,ok}){return <article className="card"><h3>{title}</h3><p className={ok?'success':'error'}>{ok?'Operational / reachable':'Not ready / unavailable'}</p></article>}

function IssuerPage({ subpath }) {
  const [session,setSession]=useState(null); const [records,setRecords]=useState([]); const [record,setRecord]=useState(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(true);
  const recordId = useMemo(()=>{const m=subpath.match(/^\/records\/([^/]+)$/);return m?decodeURIComponent(m[1]):null},[subpath]);
  useEffect(()=>{jsonFetch('/platform/issuer/session').then(async s=>{setSession(s);if(s.authenticated){if(recordId){setRecord(await jsonFetch(`/platform/issuer/records/${encodeURIComponent(recordId)}`))}else if(subpath==='/dashboard'||subpath===''||subpath==='/records'){const d=await jsonFetch('/platform/issuer/records');setRecords(d.records||[])}}}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[subpath,recordId]);
  async function login(e){e.preventDefault();const accessCode=new FormData(e.currentTarget).get('accessCode');try{await jsonFetch('/platform/issuer/login',{method:'POST',body:JSON.stringify({accessCode})});location.href='/issuer/dashboard'}catch(e){setError(e.message)}}
  async function logout(){await jsonFetch('/platform/issuer/logout',{method:'POST',body:'{}'});location.href='/issuer'}
  async function createRecord(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));try{const d=await jsonFetch('/platform/issuer/records',{method:'POST',body:JSON.stringify(f)});location.href=`/issuer/records/${encodeURIComponent(d.qrvid)}`}catch(e){setError(e.message)}}
  async function revoke(e){e.preventDefault();const reason=new FormData(e.currentTarget).get('reason');try{await jsonFetch(`/platform/issuer/records/${encodeURIComponent(recordId)}/revoke`,{method:'POST',body:JSON.stringify({reason})});location.reload()}catch(e){setError(e.message)}}
  if(loading)return <Layout><main className="content"><p>Loading issuer workspace…</p></main></Layout>;
  if(!session?.authenticated)return <Layout><main><section className="page-hero"><p className="eyebrow">Issuer Portal</p><h1>Authorized issuer access</h1><p className="lead">The pilot issuer workspace is fail-closed until its server-side secrets are configured.</p></section><section className="content"><div className="form-panel">{session?.configured?<form className="form-grid" onSubmit={login}><label>Access code<input type="password" name="accessCode" required/></label><button>Sign In</button></form>:<p className="error">Issuer access is not configured on this deployment.</p>}{error&&<p className="error">{error}</p>}</div></section></main></Layout>;
  if(subpath==='/records/new')return <Layout><main><section className="page-hero"><p className="eyebrow">Issuer Portal</p><h1>Issue QR-V Record</h1></section><section className="content"><div className="form-panel"><form className="form-grid" onSubmit={createRecord}><label>Record type<select name="recordType"><option value="certificate">Certificate</option><option value="membership">Membership</option><option value="product">Product</option><option value="document">Document</option><option value="asset">Asset</option><option value="property">Property</option></select></label><label>Issuer<input name="issuer" required/></label><label>Owner / Subject<input name="owner"/></label><label>Title<input name="title"/></label><label>Expiration date<input name="expirationDate" type="date"/></label><button>Issue QR-V Record</button></form>{error&&<p className="error">{error}</p>}</div></section></main></Layout>;
  if(recordId&&record)return <Layout><main><section className="page-hero"><p className="eyebrow">Issuer Record</p><h1>{recordId}</h1><p className="lead">{record.record?.title||record.record?.recordType}</p></section><section className="content record-grid"><article className="card"><h3>Status</h3><span className={`status-pill ${record.record?.state}`}>{record.record?.state||'UNKNOWN'}</span><p>Issuer: {record.record?.issuer||'—'}</p></article><article className="card"><h3>QR Code</h3><img className="qr-img" alt={`QR for ${recordId}`} src={`/qr/${encodeURIComponent(recordId)}.svg`}/><p><a href={`/verify/${encodeURIComponent(recordId)}`}>Open public verification</a></p></article><article className="card"><h3>Lifecycle</h3>{record.record?.state==='VERIFIED'?<form className="form-grid" onSubmit={revoke}><label>Revocation reason<input name="reason"/></label><button>Revoke Record</button></form>:<p>No revocation action available for this state.</p>}</article></section></main></Layout>;
  return <Layout><main><section className="page-hero"><p className="eyebrow">Issuer Portal</p><h1>Issuer Dashboard</h1><p className="lead">Create records, generate QR codes, verify public status, and manage lifecycle state.</p><div className="actions"><a className="btn primary" href="/issuer/records/new">Issue Record</a><button onClick={logout}>Sign Out</button></div></section><section className="content"><div className="record-list">{records.length?records.map(x=><a className="record-row" href={`/issuer/records/${encodeURIComponent(x.qrvid)}`} key={x.qrvid}><span className="mono">{x.qrvid}</span><span>{x.recordType}</span><span className={x.state}>{x.state}</span><span>Open →</span></a>):<div className="card"><p>No records returned.</p></div>}</div>{error&&<p className="error">{error}</p>}</section></main></Layout>;
}

function NotFound(){return <Layout><main><section className="page-hero"><p className="eyebrow">QR-V</p><h1>Page not found</h1><p className="lead">The requested route does not exist in the QR-V platform.</p><a className="btn primary" href="/">Return Home</a></section></main></Layout>}

export default function App(){
  const path=window.location.pathname.replace(/\/$/,'')||'/';
  if(path==='/')return <Home/>;
  if(path==='/verify')return <VerifyPage/>;
  if(path.startsWith('/verify/'))return <VerifyPage qrvid={decodeURIComponent(path.slice('/verify/'.length))}/>;
  if(path==='/registry')return <RegistryPage/>;
  if(path.startsWith('/registry/'))return <RegistryPage qrvid={decodeURIComponent(path.slice('/registry/'.length))}/>;
  if(path==='/status')return <StatusPage/>;
  if(path==='/issuer'||path.startsWith('/issuer/'))return <IssuerPage subpath={path.slice('/issuer'.length)}/>;
  if(genericPages[path])return <GenericPage data={genericPages[path]}/>;
  return <NotFound/>;
}
