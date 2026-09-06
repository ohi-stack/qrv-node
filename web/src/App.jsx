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

const nav = [
  ['QR-V Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['About', '/about']
];

const utilityNav = [
  ['Verify', '/verify'],
  ['Issuer Portal', '/issuer'],
  ['Pricing', '/pricing'],
  ['Status', '/status']
];

const services = [
  ['Verification', QRV_CONFIG.verifyBaseUrl, 'Public QRVID lookup and deterministic verification results.'],
  ['Issuer Portal', QRV_CONFIG.issuerBaseUrl, 'Create records, issue certificates, generate QR codes, and manage lifecycle state.'],
  ['API', QRV_CONFIG.apiBaseUrl, 'Canonical JSON endpoints for issuance, verification, revocation, and integrations.'],
  ['Registry', QRV_CONFIG.registryBaseUrl, 'Public-safe access to canonical registry records and issuer-backed status.'],
  ['Documentation', QRV_CONFIG.docsBaseUrl, 'Protocol, architecture, standards, verification, and implementation references.'],
  ['Developers', QRV_CONFIG.developersBaseUrl, 'API guidance, integration examples, and developer resources.']
];

const useCases = [
  ['Certificates', 'Diplomas, training certificates, awards, compliance credentials, and continuing education records.'],
  ['Membership IDs', 'Association memberships, private network credentials, event credentials, and access passes.'],
  ['Product Authentication', 'Registry-backed authenticity checks for serialized goods, collectibles, labels, and warranties.'],
  ['Documents', 'Contracts, notices, PDFs, statements, and controlled records that require verification of issuer and status.'],
  ['Asset Records', 'Equipment, property-related records, inventory tags, warranties, and custody references.'],
  ['Developer Integrations', 'APIs and SDK-facing workflows for systems that need deterministic verification results.']
];

const steps = [
  ['Issue', 'An authorized issuer creates a QR-V record and receives a QRVID.'],
  ['Anchor', 'The canonical record stores issuer, lifecycle state, timestamps, and cryptographic proof references.'],
  ['Scan', 'A user scans a QR code or opens qrv.network/verify/{QRVID}.'],
  ['Verify', 'QR-V resolves the identifier against the trusted API and returns a deterministic verification state.']
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
          {nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <a className="header-cta" href={verifyUrl()}>Verify Demo</a>
      </header>
      <nav className="utility-nav" aria-label="Utility navigation">
        {utilityNav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
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
            <p className="lead">QR-V turns a QR scan into a registry-backed verification workflow so users can check issuer identity, record integrity, lifecycle status, and the current canonical record before relying on it.</p>
            <div className="cta-row">
              <a className="btn primary" href={verifyUrl()}>Verify Demo Record <ArrowRight size={18} /></a>
              <a className="btn secondary" href={QRV_CONFIG.issuerBaseUrl}>Become an Issuer</a>
            </div>
            <p className="flow">QR Scan → Identifier Resolution → API → Registry Lookup → Validation → Result</p>
          </div>
          <div className="hero-panel">
            <p className="panel-label">Production acceptance QRVID</p>
            <h2>{QRV_CONFIG.demoQrvid}</h2>
            <p>Verification must be determined by the canonical API. The UI does not assert VERIFIED unless the backend does.</p>
            <a href={verifyUrl()}>{verifyUrl()}</a>
          </div>
        </section>

        <section className="section grid-3" id="protocol-summary">
          <IconCard icon={Network} title="Protocol-first architecture">QR-V is verification infrastructure built around QRVID resolution, issuer-backed registry records, and deterministic verification states.</IconCard>
          <IconCard icon={Database} title="Registry-backed records">Each QRVID resolves to an authoritative record containing permitted issuer, record, status, timestamp, and proof information.</IconCard>
          <IconCard icon={ShieldCheck} title="Fail-closed verification">When the trusted API cannot establish the result, the public platform reports unavailability instead of presenting a false verification state.</IconCard>
        </section>

        <section className="section split" id="how">
          <div>
            <p className="eyebrow">How QR-V Works</p>
            <h2>From a QR pointer to a verifiable record.</h2>
            <p>Traditional QR codes primarily carry data or direct users to a URL. QR-V adds a verification layer that resolves a QRVID against a canonical issuer-backed record.</p>
            <a className="text-link" href="/how-it-works">See the full workflow →</a>
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

        <section className="section" id="demo">
          <div className="section-heading">
            <p className="eyebrow">Live Verification Demo</p>
            <h2>Public proof before public claims.</h2>
            <p>The canonical production test is simple: this QRVID must resolve through api.qrv.network and return the current backend-determined state.</p>
          </div>
          <div className="demo-box">
            <FileCheck2 aria-hidden="true" />
            <div><h3>{QRV_CONFIG.demoQrvid}</h3><p>Use the production demo record to exercise the public verification workflow.</p></div>
            <a className="btn primary" href={verifyUrl()}>Open Verification</a>
          </div>
        </section>

        <section className="section" id="use-cases">
          <div className="section-heading"><p className="eyebrow">Use Cases</p><h2>Built for records where trust and status matter.</h2></div>
          <div className="use-grid">
            {useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="section split dark" id="commercial">
          <div>
            <p className="eyebrow">First Commercial Product</p>
            <h2>QR-V Verified Certificates.</h2>
            <p>Certificates exercise the full QR-V lifecycle: issuance, registry anchoring, QR generation, verification, expiration, and revocation.</p>
            <a className="text-link" href="/certificate-verification">Explore certificate verification →</a>
          </div>
          <div className="pricing-grid">
            <div><h3>Starter Issuer</h3><p>$199/mo</p><span>Issuer dashboard, public verification, and up to 1,000 active records.</span></div>
            <div><h3>Growth Issuer</h3><p>$499/mo</p><span>Revocation controls, analytics, API access, and up to 10,000 records.</span></div>
            <div><h3>Enterprise</h3><p>Custom</p><span>White-label deployments, custom workflows, high-volume verification, and implementation support.</span></div>
          </div>
        </section>

        <section className="section" id="developers">
          <div className="section-heading"><p className="eyebrow">Two-Node Platform</p><h2>One public platform. One trusted backend.</h2><p>Customer-facing workflows live at qrv.network. Authoritative API, registry, issuance, revocation, audit, and cryptographic operations live at api.qrv.network.</p></div>
          <div className="services-grid">
            {services.map(([title, url, text]) => (
              <a className="service" href={url} key={title}>
                <Globe2 aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
                <span>{url.replace(/^https?:\/\//, '')}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section grid-3" id="security">
          <IconCard icon={LockKeyhole} title="Issuer control">Issuer operations belong behind authenticated, authorized, rate-limited, and auditable server-side workflows.</IconCard>
          <IconCard icon={BadgeCheck} title="Lifecycle-aware results">Verification distinguishes active, revoked, expired, missing, invalid, suspended, and unavailable states without ambiguity.</IconCard>
          <IconCard icon={Code2} title="Integration-ready">The canonical API boundary supports external systems without exposing database or signing credentials to the browser.</IconCard>
        </section>

        <section className="section final-cta" id="contact">
          <Building2 aria-hidden="true" />
          <h2>Start with one verifiable record.</h2>
          <p>Issue a certificate, generate its QR-V code, scan it, verify the authoritative state, then prove revocation with the same QRVID.</p>
          <div className="cta-row center">
            <a className="btn primary" href={QRV_CONFIG.issuerBaseUrl}>Open Issuer Portal</a>
            <a className="btn secondary" href={QRV_CONFIG.docsBaseUrl}>Read Documentation</a>
          </div>
        </section>
      </main>
      <footer>
        <p>© 2026 QR-V™ — Global QR Verification Network. QR-V verification infrastructure operated by ONEGODIAN, LLC.</p>
        <p><a href="/protocol">Protocol</a><a href="/standards">Standards</a><a href="/security">Security</a><a href={QRV_CONFIG.statusBaseUrl}>Status</a></p>
      </footer>
    </div>
  );
}
