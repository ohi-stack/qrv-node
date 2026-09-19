import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Code2,
  Database,
  FileCheck2,
  Globe2,
  Menu,
  Network,
  ShieldCheck,
  X,
  Zap
} from 'lucide-react';
import { QRV_CONFIG } from './config.js';
import LiveActivityGraph from './components/LiveActivityGraph.jsx';
import './styles.css';



const qrCells = Array.from({ length: 169 }, (_, index) => {
  const x = index % 13;
  const y = Math.floor(index / 13);
  const finder = (originX, originY) => {
    const dx = x - originX;
    const dy = y - originY;
    return dx >= 0 && dx < 5 && dy >= 0 && dy < 5 && (dx === 0 || dx === 4 || dy === 0 || dy === 4 || (dx === 2 && dy === 2));
  };
  return finder(0, 0) || finder(8, 0) || finder(0, 8) || ((x * 7 + y * 11 + x * y) % 5 < 2 ? 1 : 0);
});

function QRMark() {
  return (
    <div className="qr-mark" aria-label="QR-V demo QR code">
      <div className="qr-grid" aria-hidden="true">
        {qrCells.map((filled, index) => <i className={filled ? 'filled' : ''} key={index} />)}
      </div>
      <span className="qr-sweep" aria-hidden="true" />
      <span className="qr-check">✓</span>
    </div>
  );
}

const navGroups = [
  {
    label: 'Platform',
    items: [
      ['Verify a Record', '/verify'],
      ['Public Registry', '/registry'],
      ['How It Works', '/how-it-works'],
      ['Network Status', '/status']
    ]
  },
  {
    label: 'Issuers',
    items: [
      ['Issuer Portal', '/issuer'],
      ['Plans & Pricing', '/pricing'],
      ['Verification Products', '/certificate-verification'],
      ['Request Issuer Access', '/issuer']
    ]
  },
  {
    label: 'Solutions',
    items: [
      ['Certificates & Credentials', '/certificate-verification'],
      ['Membership & Identity', '/use-cases'],
      ['Documents & Records', '/use-cases'],
      ['Products, Property & Assets', '/use-cases']
    ]
  },
  {
    label: 'Developers',
    items: [
      ['Developer Portal', '/developers'],
      ['Documentation', '/docs'],
      ['API Architecture', '/api-reference'],
      ['Security Model', '/security']
    ]
  },
  {
    label: 'Standards',
    items: [
      ['QRVP-1 Protocol', '/protocol'],
      ['QVS-1.0 Standard', '/standards'],
      ['Trust & Security', '/security'],
      ['Network Architecture', '/network']
    ]
  },
  {
    label: 'Company',
    items: [
      ['About QR-V', '/about'],
      ['Contact', '/about#contact'],
      ['Pricing', '/pricing'],
      ['Terms & Privacy', '/about']
    ]
  }
];

const trustChecks = [
  ['Scan', 'A user scans a QR-V mark or enters the QRVID.'],
  ['Resolve', 'The identifier routes to the authorized verification endpoint.'],
  ['Locate', 'The registry finds the canonical issuer-backed record.'],
  ['Validate', 'Stored SHA-256 integrity data is checked; Ed25519 remains the next cryptographic activation gate.'],
  ['Evaluate', 'Status, issuer authority, privacy, and expiration are resolved.'],
  ['Return', 'A clear VERIFIED, REVOKED, EXPIRED, NOT_FOUND, or service-failure result is returned.']
];

const productCards = [
  ['Certificates', 'Diplomas, training completion, professional credentials, awards, and compliance records.'],
  ['Membership IDs', 'Membership standing, organization-issued identification, and access status.'],
  ['Documents', 'Agreements, notices, policies, licenses, statements, and controlled records.'],
  ['Products', 'Authenticity, origin, warranty, serialization, and chain-of-custody references.'],
  ['Property & Assets', 'Registry references for accountable physical, equipment, and property-related records.'],
  ['Event Credentials', 'Tickets, event credentials, and time-bound participation records.']
];

function DesktopNav() {
  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      {navGroups.map((group) => (
        <div className="nav-group" key={group.label}>
          <button className="nav-trigger" type="button">
            {group.label}<ChevronDown size={14} aria-hidden="true" />
          </button>
          <div className="nav-menu">
            <p className="nav-kicker">{group.label}</p>
            {group.items.map(([label, href], index) => (
              <a href={href} key={label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="QR-V home">
          <img src="/qrv-logo.svg" alt="QR-V Global Verification Network" />
        </a>
        <DesktopNav />
        <div className="header-actions">
          <a className="header-link" href="/verify">Verify</a>
          <a className="header-issuer" href="/issuer">Become an Issuer</a>
          <button
            className="menu-button"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          {navGroups.map((group) => (
            <section key={group.label}>
              <p>{group.label}</p>
              {group.items.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
            </section>
          ))}
          <div className="mobile-menu-actions">
            <a className="button primary" href="/verify">Verify a Record</a>
            <a className="button secondary" href="/issuer">Become an Issuer</a>
          </div>
        </div>
      </div>
    </>
  );
}

function LiveRecordCard() {
  const [state, setState] = useState({ status: 'CHECKING', issuer: 'ONEGODIAN, LLC', integrity: 'Checking registry…' });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const response = await fetch(`/api/v1/verify/${encodeURIComponent(QRV_CONFIG.demoQrvid)}`, {
          headers: { accept: 'application/json' }
        });
        const payload = await response.json().catch(() => ({}));
        if (cancelled) return;
        const record = payload.record || payload;
        const status = String(payload.status || payload.state || (response.status === 404 ? 'NOT_FOUND' : 'UNAVAILABLE')).toUpperCase();
        setState({
          status,
          issuer: record.issuer || record.issuerName || 'ONEGODIAN, LLC',
          integrity: status === 'VERIFIED' ? 'Hash registered · Ed25519 pending' : status === 'CHECKING' ? 'Checking registry…' : 'Current registry state available on verification page'
        });
      } catch {
        if (!cancelled) setState({ status: 'UNAVAILABLE', issuer: 'ONEGODIAN, LLC', integrity: 'Verification API unavailable' });
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const verified = state.status === 'VERIFIED';
  const checking = state.status === 'CHECKING';

  return (
    <article className="live-record-card">
      <div className="live-record-heading">
        <span className={`live-dot${verified ? ' verified' : checking ? '' : ' warning'}`} />
        <span>LIVE PUBLIC RECORD</span>
      </div>
      <div className="record-primary">
        <QRMark />
        <div>
          <span className="record-label">QRVID</span>
          <strong>{QRV_CONFIG.demoQrvid}</strong>
        </div>
        <span className={`record-state state-${state.status.toLowerCase()}`}>
          {verified && <Check size={15} aria-hidden="true" />}{state.status}
        </span>
      </div>
      <dl className="record-grid">
        <div><dt>Issuer</dt><dd>{state.issuer}</dd></div>
        <div><dt>Integrity</dt><dd>{state.integrity}</dd></div>
        <div><dt>Standard</dt><dd>QVS-1.0</dd></div>
      </dl>
      <a className="record-link" href={`/verify/${encodeURIComponent(QRV_CONFIG.demoQrvid)}`}>
        Open registry result <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </article>
  );
}

function StatusPill({ children, active = false }) {
  return <span className={`status-pill${active ? ' active' : ''}`}>{children}</span>;
}

export default function App() {
  const [qrvid, setQrvid] = useState(QRV_CONFIG.demoQrvid);

  const submitVerify = (event) => {
    event.preventDefault();
    const value = qrvid.trim();
    if (value) window.location.href = `/verify/${encodeURIComponent(value)}`;
  };

  return (
    <div id="top">
      <Header />
      <main>
        <section className="hero grid-surface">
          <div className="hero-scan-beam" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true"><span /></div>
          <div className="hero-orbit hero-orbit-two" aria-hidden="true"><span /></div>
          <div className="hero-beam beam-one" aria-hidden="true" />
          <div className="hero-beam beam-two" aria-hidden="true" />
          <div className="hero-orb orb-one" aria-hidden="true" />
          <div className="hero-orb orb-two" aria-hidden="true" />
          <div className="page-shell hero-inner">
            <div className="hero-copy reveal">
              <p className="eyebrow cyan">GLOBAL VERIFICATION NETWORK</p>
              <h1>Turn every<br />scan into proof.</h1>
              <p className="hero-lead">Registry-backed verification for certificates, credentials, documents, products, and digital records.</p>
              <div className="hero-actions">
                <a className="button primary" href="/verify">Verify a Record</a>
                <a className="button secondary" href="/issuer">Become an Issuer</a>
              </div>
              <div className="launch-line" aria-label="Public launch standards">
                <span className="launch-status"><span className="pulse-dot" />PUBLIC LAUNCH</span>
                <span>QRVP-1</span>
                <span>QVS-1.0</span>
              </div>
              <div className="trust-chips">
                <StatusPill active>SHA-256 active</StatusPill>
                <StatusPill>Ed25519 pending</StatusPill>
                <StatusPill>Canonical JSON</StatusPill>
                <StatusPill>TLS 1.3</StatusPill>
              </div>
            </div>
            <LiveRecordCard />
          </div>
        </section>

        <section className="section topology-section">
          <div className="page-shell">
            <div className="section-heading compact">
              <p className="eyebrow">Production topology</p>
              <h2>Production services on one verified origin.</h2>
            </div>
            <div className="topology-grid">
              <article><span>01</span><div><h3>QR-V platform</h3><p>qrv.network</p><small>Public website and human workflows</small></div></article>
              <article><span>02</span><div><h3>Verification API</h3><p>api.qrv.network/api/v1</p><small>Trusted registry and machine operations</small></div></article>
              <article className="topology-proof"><BadgeCheck /><div><h3>Registry-backed</h3><p>Canonical source records</p></div></article>
              <article className="topology-proof"><ShieldCheck /><div><h3>Cryptographic roadmap</h3><p>SHA-256 active · Ed25519 required</p></div></article>
              <article className="topology-proof"><Globe2 /><div><h3>Globally verifiable</h3><p>One scan, clear status</p></div></article>
            </div>
          </div>
        </section>

        <section className="section grid-surface light-grid">
          <div className="page-shell">
            <div className="section-heading">
              <p className="eyebrow">What QR-V solves</p>
              <h2>A QR code can point anywhere. QR-V establishes what is true.</h2>
              <p>Each scan resolves to a canonical registry entry, validates the issuer, and checks the record’s current status and integrity.</p>
            </div>
            <div className="comparison-grid">
              <article>
                <span className="card-number">01</span>
                <h3>Ordinary QR codes</h3>
                <p>A visual pointer with no built-in assurance about the destination, issuer, status, or underlying data.</p>
                <ul><li>Destination can change</li><li>No canonical record</li><li>No revocation state</li></ul>
              </article>
              <div className="comparison-arrow"><ArrowRight aria-hidden="true" /></div>
              <article className="emphasis-card">
                <span className="card-number">02</span>
                <h3>QR-V verification</h3>
                <p>A structured reference backed by issuer identity, registry state, cryptographic integrity, and an auditable lifecycle.</p>
                <ul><li>Known issuing authority</li><li>Deterministic status</li><li>Hash and signature checks</li></ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section checks-section">
          <div className="page-shell">
            <div className="section-heading">
              <p className="eyebrow">How verification works</p>
              <h2>One scan. Six trust checks.</h2>
              <p>QRVP-1 connects the physical or digital QR mark to the resolver, API, registry, and integrity layer.</p>
            </div>
            <div className="checks-grid">
              {trustChecks.map(([title, text], index) => (
                <article key={title} className="check-card reveal-card">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section verify-section grid-surface">
          <div className="page-shell verify-layout">
            <div>
              <p className="eyebrow cyan">Live public verification</p>
              <h2>Verify the network’s canonical public record.</h2>
              <p>The verifier resolves persistent registry data and displays the current issuer, lifecycle, disclosure, and integrity state.</p>
            </div>
            <form className="verify-form" onSubmit={submitVerify}>
              <label htmlFor="verify-qrvid">Enter a QR-V identifier</label>
              <div className="verify-control">
                <input id="verify-qrvid" value={qrvid} onChange={(event) => setQrvid(event.target.value)} placeholder="QRV-PROD-CERT-000001" />
                <button type="submit">Verify now</button>
              </div>
              <small>Try the canonical public launch record.</small>
            </form>
          </div>
        </section>

        <section className="section products-section">
          <div className="page-shell">
            <div className="section-heading">
              <p className="eyebrow">Initial product layer</p>
              <h2>Verified certificates first. Every record class next.</h2>
            </div>
            <div className="product-grid">
              {productCards.map(([title, text], index) => (
                <article key={title}>
                  <span className="product-type">{index === 0 ? 'Launch product' : ['Identity', 'Records', 'Commerce', 'Assets', 'Events'][index - 1]}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="/use-cases">Explore use case <ArrowRight size={15} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section issuer-section grid-surface light-grid">
          <div className="page-shell issuer-layout">
            <div className="issuer-preview">
              <div className="preview-head"><span>Issuer console</span><small>Illustrative workspace</small></div>
              <div className="metrics-row">
                <div><span>Active records</span><strong>1,284</strong><small>+8.4%</small></div>
                <div><span>Verifications</span><strong>8,421</strong><small>30 days</small></div>
                <div><span>Revoked</span><strong>12</strong><small>0.9%</small></div>
              </div>
              <div className="mini-table">
                <div><strong>QRVID</strong><strong>Record</strong><strong>Status</strong></div>
                <div><span>…000001</span><span>Safety Certificate</span><span className="mini-state verified">Verified</span></div>
                <div><span>…000142</span><span>Member Credential</span><span className="mini-state verified">Verified</span></div>
                <div><span>…000889</span><span>Compliance Award</span><span className="mini-state expired">Expired</span></div>
              </div>
            </div>
            <div className="issuer-copy">
              <p className="eyebrow">Issuer operations</p>
              <h2>Issue, manage, and revoke from one accountable workflow.</h2>
              <p>Approved organizations receive a controlled workspace for certificates, QR codes, records, analytics, team access, API keys, and audit history.</p>
              <ul className="feature-list">
                <li><Check />Structured record issuance</li>
                <li><Check />Instant QRVID generation</li>
                <li><Check />Role-based team controls</li>
                <li><Check />Lifecycle and revocation management</li>
              </ul>
              <a className="text-link" href="/issuer">Explore issuer access <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="section pricing-section">
          <div className="page-shell">
            <div className="section-heading horizontal-heading">
              <div><p className="eyebrow">Start issuing</p><h2>Plans built for pilots, teams, and institutions.</h2></div>
              <a className="text-link" href="/pricing">View full pricing <ArrowRight size={16} /></a>
            </div>
            <div className="pricing-grid">
              <article><span>Pilot</span><strong>$0 <small>/ limited</small></strong><p>Validate your first workflow with a controlled issuer pilot.</p></article>
              <article className="selected"><span className="selected-label">Most selected</span><span>Starter</span><strong>$49 <small>/ month</small></strong><p>Issuer Portal access for up to 1,000 managed records.</p></article>
              <article><span>Professional</span><strong>$299 <small>/ month</small></strong><p>Team controls, API access, and up to 25,000 records.</p></article>
            </div>
          </div>
        </section>

        <section className="section developer-section grid-surface">
          <div className="page-shell developer-layout">
            <div>
              <p className="eyebrow cyan">Developer access</p>
              <h2>Verification infrastructure with a clear contract.</h2>
              <p>Integrate QR-V through deterministic REST responses, documented statuses, issuer APIs, and the QRVP-1 protocol model.</p>
              <a className="button secondary" href="/developers">Open developer portal</a>
            </div>
            <pre className="code-card"><code>{`GET https://qrv.network/api/v1/verify/${QRV_CONFIG.demoQrvid}\n\n{\n  "status": "VERIFIED",\n  "integrity": {\n    "hashValid": true,\n    "signatureState": "PENDING_ED25519"\n  }\n}`}</code></pre>
          </div>
        </section>

        <section className="section status-section">
          <div className="page-shell">
            <div className="status-banner">
              <div className="status-icon"><Zap aria-hidden="true" /></div>
              <div><p className="eyebrow">Network status</p><h2>Production readiness is measured, not assumed.</h2><p>Platform, API, and registry readiness are exposed through health and status routes.</p></div>
              <a className="text-link" href="/status">View status <ArrowUpRight size={16} /></a>
            </div>
            <LiveActivityGraph />
          </div>
        </section>

        <section className="section founder-section grid-surface light-grid">
          <div className="page-shell founder-layout">
            <div className="founder-mark">QR-V<sup>™</sup><small>Est. 2026</small></div>
            <div>
              <p className="eyebrow">Founder and origin</p>
              <h2>Built to make verification accountable.</h2>
              <p>QR-V™ was founded and originated by Gregory L. Jones, also known as One Gregory Onegodian™, and is commercially owned by ONEGODIAN, LLC. The platform is structured around traceable issuer authority, canonical records, and public-safe verification.</p>
              <a className="text-link" href="/about">Read the platform record <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="section final-section">
          <div className="page-shell final-card">
            <p className="eyebrow cyan">A better trust layer</p>
            <h2>Turn your next certificate into a verifiable record.</h2>
            <div className="hero-actions center">
              <a className="button primary" href="/issuer">Become an Issuer</a>
              <a className="button secondary" href="/verify">Verify a Record</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <img src="/qrv-logo.svg" alt="QR-V Global Verification Network" />
            <p>Registry-backed verification infrastructure for records that need to be trusted.</p>
            <small>QRVP-1 Protocol · QVS-1.0 Standard</small>
          </div>
          <div><strong>Platform</strong><a href="/verify">Verify</a><a href="/registry">Registry</a><a href="/issuer">Issuer access</a><a href="/status">Network status</a></div>
          <div><strong>Build</strong><a href="/protocol">Protocol</a><a href="/developers">Developers</a><a href="/docs">Documentation</a><a href="/security">Security</a></div>
          <div><strong>Organization</strong><a href="/about">About</a><a href="/pricing">Pricing</a><a href="/about#contact">Contact</a><a href="/about">Privacy & terms</a></div>
        </div>
        <div className="page-shell footer-bottom">© 2026 ONEGODIAN, LLC. All rights reserved. Founded and originated by Gregory L. Jones, also known as One Gregory Onegodian™.</div>
      </footer>
    </div>
  );
}
