import { ArrowRight, BadgeCheck, Building2, Code2, Database, FileCheck2, Globe2, LockKeyhole, Network, ShieldCheck } from 'lucide-react';
import { QRV_CONFIG, verifyUrl } from './config.js';
import './styles.css';

const nav = [
  ['Protocol', '#protocol'],
  ['How It Works', '#how'],
  ['Use Cases', '#use-cases'],
  ['Pricing', '#pricing'],
  ['Developers', '#developers'],
  ['Security', '#security']
];

const services = [
  ['Verification Portal', QRV_CONFIG.verifyBaseUrl, 'Public QRVID lookup and verification results.'],
  ['Issuer Portal', QRV_CONFIG.issuerBaseUrl, 'Create records, issue certificates, generate QR codes, and revoke credentials.'],
  ['API Gateway', QRV_CONFIG.apiBaseUrl, 'JSON endpoints for issuance, verification, revocation, and integrations.'],
  ['Registry', QRV_CONFIG.registryBaseUrl, 'Canonical registry records, issuers, hashes, and audit logs.'],
  ['Docs', QRV_CONFIG.docsBaseUrl, 'Protocol, architecture, standards, and implementation references.'],
  ['Developers', QRV_CONFIG.developersBaseUrl, 'SDKs, API guides, integration examples, and sandbox materials.']
];

const useCases = [
  ['Certificates', 'Diplomas, training certificates, awards, compliance credentials, and continuing education records.'],
  ['Membership IDs', 'Private network credentials, association memberships, event credentials, and access passes.'],
  ['Product Authentication', 'Registry-backed authenticity checks for packaged goods, collectibles, labels, and serialized assets.'],
  ['Documents', 'Contracts, notices, filings, PDFs, statements, and controlled records that require public proof.'],
  ['Asset Records', 'Equipment, property-related records, inventory tags, warranties, and custody references.'],
  ['Developer Integrations', 'APIs and future SDK tooling for external systems that need deterministic verification results.']
];

const steps = [
  ['Issue', 'An authorized issuer creates a QR-V record and receives a QRVID.'],
  ['Anchor', 'The QRVID is stored with canonical registry metadata, issuer details, status, and timestamps.'],
  ['Scan', 'A user scans a QR code or opens a verification URL.'],
  ['Verify', 'QR-V resolves the identifier against the registry and returns VERIFIED, REVOKED, EXPIRED, or NOT FOUND.']
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="QR-V home"><span className="brand-mark">QR-V</span><span>Global Verification Network</span></a>
      <nav>{nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <a className="header-cta" href={verifyUrl()}>Verify Demo</a>
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
            <p className="eyebrow">QR-V™ • Global QR Verification Network</p>
            <h1>A verification layer for QR-based systems.</h1>
            <p className="lead">QR-V transforms ordinary QR codes into registry-anchored digital references that can be independently checked for authenticity, issuer identity, integrity, and status.</p>
            <div className="cta-row">
              <a className="btn primary" href={verifyUrl()}>Verify Demo Record <ArrowRight size={18} /></a>
              <a className="btn secondary" href={QRV_CONFIG.issuerBaseUrl}>Start Issuer Onboarding</a>
            </div>
            <p className="flow">QR Scan → Identifier Resolution → Registry Lookup → Validation → Result</p>
          </div>
          <div className="hero-panel">
            <p className="panel-label">Live demo QRVID</p>
            <h2>{QRV_CONFIG.demoQrvid}</h2>
            <p>Status target: <strong>VERIFIED</strong></p>
            <a href={verifyUrl()}>{verifyUrl()}</a>
          </div>
        </section>

        <section className="section grid-3" id="protocol">
          <IconCard icon={Network} title="Protocol-first architecture">QR-V is not a QR generator. It is verification infrastructure built around QRVID resolution, registry records, and deterministic verification states.</IconCard>
          <IconCard icon={Database} title="Registry-backed records">Each QRVID resolves to a canonical registry entry containing issuer, record type, status, timestamps, and proof references.</IconCard>
          <IconCard icon={ShieldCheck} title="Public trust surface">The public verification portal gives users a clear result: VERIFIED, REVOKED, EXPIRED, NOT FOUND, INVALID FORMAT, or UNAVAILABLE.</IconCard>
        </section>

        <section className="section split" id="how">
          <div>
            <p className="eyebrow">How QR-V Works</p>
            <h2>From static QR code to verifiable record.</h2>
            <p>Traditional QR codes usually redirect to a URL. QR-V adds a registry-based verification layer so the scanned identifier can be checked against an authoritative record.</p>
          </div>
          <div className="steps">{steps.map(([title, text], index) => <div className="step" key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
        </section>

        <section className="section" id="demo">
          <div className="section-heading"><p className="eyebrow">Live Verification Demo</p><h2>Public proof before public claims.</h2><p>The production acceptance target is simple: the demo QRVID must resolve publicly to VERIFIED.</p></div>
          <div className="demo-box"><FileCheck2 /><div><h3>{QRV_CONFIG.demoQrvid}</h3><p>Use this record to test the public verification node.</p></div><a className="btn primary" href={verifyUrl()}>Open Verification</a></div>
        </section>

        <section className="section" id="use-cases">
          <div className="section-heading"><p className="eyebrow">Use Cases</p><h2>Built for records where authenticity matters.</h2></div>
          <div className="use-grid">{useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="section split dark" id="pricing">
          <div><p className="eyebrow">First Product</p><h2>QR-V Verified Certificates.</h2><p>The first commercial wedge is a certificate issuance and verification system for schools, training programs, associations, compliance providers, and organizations that issue credentials.</p></div>
          <div className="pricing-grid"><div><h3>Starter</h3><p>$199/mo</p><span>Issuer dashboard, public verify pages, and up to 1,000 active records.</span></div><div><h3>Growth</h3><p>$499/mo</p><span>Revocation controls, analytics, API access, and up to 10,000 records.</span></div><div><h3>Enterprise</h3><p>Custom</p><span>White-label portals, dedicated support, custom workflows, and high-volume verification.</span></div></div>
        </section>

        <section className="section" id="developers">
          <div className="section-heading"><p className="eyebrow">Network Services</p><h2>Clear service boundaries for production.</h2></div>
          <div className="services-grid">{services.map(([title, url, text]) => <a className="service" href={url} key={title}><Globe2 /><h3>{title}</h3><p>{text}</p><span>{url.replace(/^https?:\/\//, '')}</span></a>)}</div>
        </section>

        <section className="section grid-3" id="security">
          <IconCard icon={LockKeyhole} title="Issuer control">Issuer actions should be authenticated, role-controlled, and audit logged.</IconCard>
          <IconCard icon={BadgeCheck} title="Status awareness">Records can be valid, revoked, expired, missing, invalid, or temporarily unavailable.</IconCard>
          <IconCard icon={Code2} title="Integration-ready">API-first verification enables websites, apps, workflows, and future SDKs to use QR-V as a trust layer.</IconCard>
        </section>

        <section className="section final-cta" id="contact">
          <Building2 />
          <h2>Start with one verified record.</h2>
          <p>Issue a certificate, scan the code, verify the record, and prove the complete QR-V lifecycle.</p>
          <div className="cta-row center"><a className="btn primary" href={QRV_CONFIG.issuerBaseUrl}>Open Issuer Portal</a><a className="btn secondary" href={QRV_CONFIG.docsBaseUrl}>Read Documentation</a></div>
        </section>
      </main>
      <footer><p>© 2026 QR-V™ — Global QR Verification Network. Operated as private verification infrastructure by ONEGODIAN, LLC.</p><p><a href="#protocol">Protocol</a> <a href="#security">Security</a> <a href={QRV_CONFIG.statusBaseUrl}>Status</a></p></footer>
    </div>
  );
}

export default App;
