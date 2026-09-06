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
  ShieldCheck,
} from 'lucide-react';
import { QRV_CONFIG, verifyUrl } from './config.js';

const nav = [
  ['QR-V Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['About', '/about'],
];

const services = [
  ['Verification', '/verify', 'Public QRVID lookup and deterministic verification results.'],
  ['Issuer Portal', '/issuer', 'Create records, issue certificates, generate QR codes, and revoke credentials.'],
  ['Registry', '/registry', 'Inspect public-safe canonical record data.'],
  ['API', '/api-reference', 'Developer access to the trusted API boundary at api.qrv.network.'],
  ['Documentation', '/docs', 'Protocol, architecture, standards, issuer and implementation references.'],
  ['Network Status', '/status', 'Human-readable readiness and dependency status.'],
];

const useCases = [
  ['Verified Certificates', 'Diplomas, training certificates, awards, licenses and compliance credentials.'],
  ['Membership Verification', 'Association credentials, private-network membership and access records.'],
  ['Product Authentication', 'Registry-backed authenticity checks for serialized goods, labels and warranties.'],
  ['Document Verification', 'Contracts, notices, PDFs and controlled records that require verification references.'],
  ['Asset Records', 'Equipment, property-related records, inventory tags and custody references.'],
  ['Developer Integrations', 'APIs for external systems that need deterministic verification outcomes.'],
];

const steps = [
  ['Issue', 'An authorized issuer creates a canonical QR-V record and receives a QRVID.'],
  ['Anchor', 'The record is stored with issuer data, lifecycle state, integrity metadata and timestamps.'],
  ['Scan', 'A person scans the QR code or opens the verification URL.'],
  ['Verify', 'QR-V resolves the identifier through the API and returns a deterministic result.'],
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="QR-V home">
        <span className="brand-mark">QR-V</span>
        <span className="brand-copy">Global Verification Network</span>
      </a>
      <nav aria-label="Primary navigation">
        {nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <div className="utility-actions">
        <a className="utility-link" href="/issuer">Issuer Portal</a>
        <a className="header-cta" href="/verify">Verify</a>
      </div>
    </header>
  );
}

function IconCard({ icon: Icon, title, children }) {
  return <article className="card"><Icon className="icon" /><h3>{title}</h3><p>{children}</p></article>;
}

function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <section className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">QR-V™ • Global Verification Network</p>
            <h1>Verification infrastructure for records that matter.</h1>
            <p className="lead">QR-V turns a QR scan into a registry-backed verification workflow that can check issuer identity, record status, integrity metadata and lifecycle state before a user relies on the record.</p>
            <div className="cta-row">
              <a className="btn primary" href="/verify">Verify a Record <ArrowRight size={18} /></a>
              <a className="btn secondary" href="/issuer">Start Issuer Onboarding</a>
            </div>
            <p className="flow">QR Scan → QRVID → API Resolution → Registry Lookup → Validation → Result</p>
          </div>
          <div className="hero-panel">
            <p className="panel-label">Production verification path</p>
            <h2>{QRV_CONFIG.demoQrvid}</h2>
            <p>The demo identifier is a production acceptance target. The UI does not assert VERIFIED unless the canonical API returns a valid state.</p>
            <a href={verifyUrl()}>Open verification →</a>
          </div>
        </section>

        <section className="trust-strip" aria-label="QR-V architecture summary">
          <span>QRVP-1 Protocol</span><span>QVS-1.0 Standard</span><span>PostgreSQL Registry</span><span>SHA-256 Integrity</span><span>Ed25519 Signing</span>
        </section>

        <section className="section grid-3">
          <IconCard icon={Network} title="Protocol-first architecture">QR-V is not a generic QR generator. It is a verification layer built around identifiers, resolution, registry records and deterministic outcomes.</IconCard>
          <IconCard icon={Database} title="Registry-backed records">QRVIDs resolve to canonical records containing issuer, record type, lifecycle status, timestamps and proof references.</IconCard>
          <IconCard icon={ShieldCheck} title="Fail-closed verification">When the trusted backend cannot establish a result, the public platform reports unavailability instead of manufacturing a VERIFIED state.</IconCard>
        </section>

        <section className="section split" id="how">
          <div>
            <p className="eyebrow">How QR-V Works</p>
            <h2>From a visual code to a verifiable record.</h2>
            <p>Traditional QR codes usually point somewhere. QR-V adds a verification workflow behind that pointer so the identifier can be checked against the canonical registry before the result is displayed.</p>
            <a className="text-link" href="/how-it-works">See the full verification workflow →</a>
          </div>
          <div className="steps">{steps.map(([title, text], index) => <div className="step" key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
        </section>

        <section className="section" id="demo">
          <div className="section-heading"><p className="eyebrow">Public Verification</p><h2>Give customers a clear answer.</h2><p>Verification pages are designed to present deterministic states such as VERIFIED, REVOKED, EXPIRED, NOT_FOUND and UNAVAILABLE.</p></div>
          <div className="demo-box"><FileCheck2 /><div><h3>Verify any QRVID</h3><p>Use the public verifier or scan a QR-V code attached to a record.</p></div><a className="btn primary" href="/verify">Open Verification</a></div>
        </section>

        <section className="section" id="use-cases">
          <div className="section-heading"><p className="eyebrow">Use Cases</p><h2>Built for organizations that issue records.</h2></div>
          <div className="use-grid">{useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="section-action"><a className="text-link" href="/use-cases">Explore all use cases →</a></div>
        </section>

        <section className="section split dark" id="pricing">
          <div><p className="eyebrow">First Commercial Product</p><h2>QR-V Verified Certificates.</h2><p>Certificate issuance is the first production wedge because it demonstrates the complete lifecycle: issue, register, generate QR, scan, verify, revoke or expire.</p><a className="btn secondary" href="/certificate-verification">Explore Verified Certificates</a></div>
          <div className="pricing-grid"><div><h3>Starter Issuer</h3><p>$199/mo</p><span>Up to 1,000 active records and public verification.</span></div><div><h3>Growth Issuer</h3><p>$499/mo</p><span>Up to 10,000 records, revocation controls and API access.</span></div><div><h3>Enterprise</h3><p>Custom</p><span>High-volume verification, integration support and white-label options.</span></div></div>
        </section>

        <section className="section" id="developers">
          <div className="section-heading"><p className="eyebrow">Platform</p><h2>One customer-facing platform. One trusted API boundary.</h2><p>Browser workflows live at qrv.network. Privileged registry, issuance, revocation, audit and cryptographic operations remain behind api.qrv.network.</p></div>
          <div className="services-grid">{services.map(([title, url, text]) => <a className="service" href={url} key={title}><Globe2 /><h3>{title}</h3><p>{text}</p><span>{url}</span></a>)}</div>
        </section>

        <section className="section grid-3" id="security">
          <IconCard icon={LockKeyhole} title="Issuer control">Protected issuer actions remain authenticated and server-side. Browser code never receives database or signing secrets.</IconCard>
          <IconCard icon={BadgeCheck} title="Lifecycle-aware results">A QR-V record can be valid, revoked, expired, missing, invalid or temporarily unavailable.</IconCard>
          <IconCard icon={Code2} title="Developer-ready">The canonical API at api.qrv.network enables external applications to integrate QR-V verification workflows.</IconCard>
        </section>

        <section className="section final-cta">
          <Building2 />
          <h2>Start with one verifiable record.</h2>
          <p>Issue a certificate, generate its QR code, scan it and verify the complete QR-V lifecycle against the canonical registry.</p>
          <div className="cta-row center"><a className="btn primary" href="/issuer">Open Issuer Portal</a><a className="btn secondary" href="/docs">Read Documentation</a></div>
        </section>
      </main>
      <footer>
        <div><strong>QR-V™ Global Verification Network</strong><p>Registry-backed verification infrastructure operated by ONEGODIAN, LLC.</p></div>
        <div className="footer-links"><a href="/protocol">Protocol</a><a href="/security">Security</a><a href="/developers">Developers</a><a href="/status">Status</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </div>
  );
}

export default App;
