import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Code2,
  Database,
  FileCheck2,
  Globe2,
  LockKeyhole,
  Network,
  ShieldCheck
} from 'lucide-react';
import { QRV_CONFIG, verifyUrl } from './config.js';
import './styles.css';

const navigation = [
  ['QR-V Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['About', '/about']
];

const utilityNavigation = [
  ['Verify', '/verify'],
  ['Issuer Portal', '/issuer'],
  ['Pricing', '/pricing'],
  ['Status', '/status']
];

const services = [
  ['Verification', '/verify', 'Verify QRVID records and view deterministic lifecycle states.'],
  ['Issuer Portal', '/issuer', 'Create records, issue certificates, generate QR codes, and revoke credentials.'],
  ['Registry', '/registry', 'Inspect public-safe canonical registry records and verification metadata.'],
  ['Developer Platform', '/developers', 'Integrate with the canonical QR-V API and implementation resources.'],
  ['Documentation', '/docs', 'Read protocol, architecture, verification, issuer, and API documentation.'],
  ['Network Status', '/status', 'Check platform and trusted API readiness without relying on page-load claims.']
];

const useCases = [
  ['Verified Certificates', 'Diplomas, training certificates, awards, compliance credentials, and continuing education records.'],
  ['Membership & Identity', 'Association memberships, private credentials, event access, and identity-linked verification records.'],
  ['Product Authentication', 'Registry-backed authenticity checks for serialized products, labels, collectibles, and warranties.'],
  ['Document Verification', 'Contracts, controlled records, PDFs, statements, and business documents requiring integrity evidence.'],
  ['Asset Records', 'Equipment, inventory, property-related records, custody references, and registered physical assets.'],
  ['Developer Integrations', 'REST API workflows for systems that need deterministic QR-V verification outcomes.']
];

const steps = [
  ['Issue', 'An authorized issuer creates a QR-V record through the protected issuer workflow.'],
  ['Anchor', 'The API stores canonical issuer, lifecycle, timestamp, integrity, and proof metadata in the registry.'],
  ['Scan', 'A user scans a QR-V code or opens qrv.network/verify/{QRVID}.'],
  ['Verify', 'The trusted API resolves the identifier and returns a deterministic verification state.']
];

function Header() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="QR-V home">
          <span className="brand-mark">QR-V</span>
          <span>Global Verification Network</span>
        </a>
        <nav aria-label="Primary navigation">
          {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <a className="header-cta" href="/verify">Verify a Record</a>
      </header>
      <nav className="utility-nav" aria-label="Utility navigation">
        {utilityNavigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
    </>
  );
}

function IconCard({ icon: Icon, title, children }) {
  return (
    <article className="card">
      <Icon className="icon" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <section className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">QR-V™ • Global QR Verification Network</p>
            <h1>A verification layer for QR-based systems.</h1>
            <p className="lead">
              QR-V transforms ordinary QR codes into registry-anchored digital references that can be checked for authenticity,
              issuer identity, integrity, and lifecycle status.
            </p>
            <div className="cta-row">
              <a className="btn primary" href="/verify">Verify a Record <ArrowRight size={18} /></a>
              <a className="btn secondary" href="/issuer">Start Issuer Onboarding</a>
            </div>
            <p className="flow">QR Scan → QRVID Resolution → Registry Lookup → Validation → Result</p>
          </div>
          <div className="hero-panel">
            <p className="panel-label">Production acceptance QRVID</p>
            <h2>{QRV_CONFIG.demoQrvid}</h2>
            <p>Verification state is asserted only when the trusted API can establish it.</p>
            <a href={verifyUrl()}>{verifyUrl()}</a>
          </div>
        </section>

        <section className="section grid-3" id="protocol">
          <IconCard icon={Network} title="Protocol-first architecture">
            QR-V is verification infrastructure built around QRVID resolution, canonical registry records, and deterministic outcomes.
          </IconCard>
          <IconCard icon={Database} title="Registry-backed authority">
            The QR image is a pointer; the registry record remains the authoritative source for issuer, state, timestamps, and proof metadata.
          </IconCard>
          <IconCard icon={ShieldCheck} title="Fail-closed verification">
            The platform distinguishes VERIFIED, REVOKED, EXPIRED, NOT_FOUND, INVALID_SIGNATURE, SUSPENDED_ISSUER, and UNAVAILABLE states.
          </IconCard>
        </section>

        <section className="section split" id="how">
          <div>
            <p className="eyebrow">How QR-V Works</p>
            <h2>From static QR code to verifiable record.</h2>
            <p>
              Traditional QR codes usually redirect to a location. QR-V adds an authoritative record, issuer controls, integrity checks,
              lifecycle state, revocation, and a deterministic verification response.
            </p>
          </div>
          <div className="steps">
            {steps.map(([title, text], index) => (
              <div className="step" key={title}>
                <span>{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="proof">
          <div className="section-heading">
            <p className="eyebrow">Public Verification</p>
            <h2>Proof before claims.</h2>
            <p>The public experience never treats a successful page load as proof that a record is verified.</p>
          </div>
          <div className="demo-box">
            <FileCheck2 aria-hidden="true" />
            <div>
              <h3>{QRV_CONFIG.demoQrvid}</h3>
              <p>Use the production acceptance record to validate the complete platform-to-API verification path.</p>
            </div>
            <a className="btn primary" href={verifyUrl()}>Open Verification</a>
          </div>
        </section>

        <section className="section" id="use-cases">
          <div className="section-heading">
            <p className="eyebrow">Use Cases</p>
            <h2>Built for records where authenticity matters.</h2>
          </div>
          <div className="use-grid">
            {useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="section split dark" id="commercial">
          <div>
            <p className="eyebrow">Primary Commercial Application</p>
            <h2>QR-V Issuer Portal.</h2>
            <p>
              Organizations issue records, generate QR-V codes, manage certificate lifecycle, revoke credentials, inspect activity,
              and integrate through the API.
            </p>
            <div className="cta-row"><a className="btn primary" href="/issuer">Open Issuer Portal</a></div>
          </div>
          <div className="pricing-grid">
            <div><h3>Starter Issuer</h3><p>$199/mo</p><span>Up to 1,000 active records and public verification.</span></div>
            <div><h3>Growth Issuer</h3><p>$499/mo</p><span>Up to 10,000 records, revocation, analytics, and API access.</span></div>
            <div><h3>Professional</h3><p>$1,500/mo</p><span>High-volume issuance, advanced controls, audit exports, and integrations.</span></div>
          </div>
        </section>

        <section className="section" id="developers">
          <div className="section-heading">
            <p className="eyebrow">One Platform • One Trusted API</p>
            <h2>Clear production boundaries.</h2>
            <p>Human-facing workflows live on qrv.network. Authoritative mutations and verification operations live on api.qrv.network.</p>
          </div>
          <div className="services-grid">
            {services.map(([title, href, text]) => (
              <a className="service" href={href} key={title}>
                <Globe2 aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
                <span>{new URL(href, QRV_CONFIG.appBaseUrl).pathname}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section grid-3" id="security">
          <IconCard icon={LockKeyhole} title="Issuer control">Issuer operations remain authenticated, authorized, rate-limited, and audit logged.</IconCard>
          <IconCard icon={BadgeCheck} title="Deterministic lifecycle">Public verification communicates exact record state instead of ambiguous trust language.</IconCard>
          <IconCard icon={Code2} title="Integration-ready">The canonical REST API supports verification, issuance, revocation, and enterprise integration workflows.</IconCard>
        </section>

        <section className="section final-cta" id="contact">
          <Building2 aria-hidden="true" />
          <h2>Start with one verifiable record.</h2>
          <p>Issue it, scan it, verify it, revoke it, and prove the complete QR-V lifecycle.</p>
          <div className="cta-row center">
            <a className="btn primary" href="/issuer">Become an Issuer</a>
            <a className="btn secondary" href="/docs">Read Documentation</a>
          </div>
        </section>
      </main>
      <footer>
        <p>© 2026 QR-V™ — Global Verification Network. ONEGODIAN, LLC.</p>
        <p><a href="/protocol">QRVP-1</a><a href="/standards">QVS-1.0</a><a href="/security">Security</a><a href="/status">Status</a></p>
      </footer>
    </div>
  );
}
