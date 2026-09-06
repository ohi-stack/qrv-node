import React from 'react';
import { ArrowRight, BadgeCheck, Building2, Code2, Database, FileCheck2, Globe2, LockKeyhole, Network, ShieldCheck } from 'lucide-react';
import { QRV_CONFIG, verifyUrl } from './config.js';

const nav = [
  ['QR-V Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['About', '/about']
];

const services = [
  ['Verification', '/verify', 'Public QRVID lookup and deterministic verification results.'],
  ['Issuer Portal', '/issuer', 'Create records, issue certificates, generate QR codes, and revoke credentials.'],
  ['API Gateway', QRV_CONFIG.apiBaseUrl, 'JSON endpoints for issuance, verification, revocation, and integrations.'],
  ['Registry', '/registry', 'Public-safe registry inspection backed by the canonical API.'],
  ['Documentation', '/docs', 'Protocol, architecture, standards, security, and implementation references.'],
  ['Developers', '/developers', 'API guides, integration examples, SDK direction, and reference material.']
];

const useCases = [
  ['Certificates', 'Diplomas, training certificates, awards, compliance credentials, and continuing education records.'],
  ['Membership IDs', 'Association memberships, event credentials, access passes, and internal network credentials.'],
  ['Product Authentication', 'Registry-backed authenticity checks for packaged goods, collectibles, labels, and serialized assets.'],
  ['Documents', 'Contracts, notices, PDFs, filings, statements, and controlled records that require public proof.'],
  ['Asset Records', 'Equipment, property-related records, inventory tags, warranties, and custody references.'],
  ['Developer Integrations', 'APIs and SDK tooling for external systems that need deterministic verification results.']
];

const steps = [
  ['Issue', 'An authorized issuer creates a QR-V record and receives a QRVID.'],
  ['Anchor', 'The record is stored with canonical metadata, issuer details, lifecycle state, and proof references.'],
  ['Scan', 'A user scans the QR code or opens the canonical verification URL.'],
  ['Verify', 'QR-V resolves the identifier and returns VERIFIED, REVOKED, EXPIRED, or NOT_FOUND.']
];

const pageContent = {
  '/protocol': ['QR-V Protocol', 'QRVP-1 defines how QR-V identifiers resolve into verifiable registry-backed records.', ['Identifier layer', 'Resolution layer', 'Verification layer', 'Registry layer', 'Response layer']],
  '/how-it-works': ['How It Works', 'From issuance to public verification, the workflow remains deterministic and auditable.', ['Issue a record', 'Anchor canonical data', 'Generate a QR-V code', 'Scan or open the URL', 'Resolve and validate', 'Return lifecycle state']],
  '/use-cases': ['Use Cases', 'QR-V is designed for records where authenticity, issuer identity, integrity, and lifecycle status matter.', useCases.map(([title]) => title)],
  '/developers': ['Developers', 'Build against the canonical API while keeping qrv.network as the public verification and issuer experience.', ['API base: api.qrv.network/api/v1', 'Verification API', 'Registry API', 'Issuer integrations', 'Webhooks', 'OpenAPI reference']],
  '/about': ['About QR-V', 'QR-V is verification infrastructure for QR-based records, operated as a ONEGODIAN, LLC product and protocol implementation.', ['QRVP-1 protocol', 'QVS-1.0 standard', 'Global Verification Network', 'Registry-backed verification']],
  '/standards': ['QVS-1.0', 'The QR-V Global Verification Standard defines deterministic verification behavior, issuer controls, registry authority, and lifecycle handling.', ['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND']],
  '/security': ['Security', 'The public platform is separated from database authority, signing keys, privileged API operations, and sensitive issuer controls.', ['Authentication', 'Authorization', 'SHA-256 integrity', 'Ed25519 signatures', 'Revocation', 'Audit logging']],
  '/pricing': ['Issuer Pricing', 'Commercial plans are structured around issuer capacity, verification needs, integrations, and implementation support.', ['$199/mo Starter', '$499/mo Growth', '$1,500/mo Professional', 'Enterprise / Network Issuer']],
  '/enterprise': ['Enterprise', 'Deploy QR-V for institution-scale certificate, identity, product, document, asset, and registry verification.', ['Issuer onboarding', 'Bulk import', 'API integration', 'Audit exports', 'White-label deployment', 'Enterprise support']],
  '/certificate-verification': ['Verified Certificates', 'The first commercial QR-V product demonstrates the complete lifecycle: issue, anchor, scan, verify, revoke or expire.', ['Diplomas', 'Training certificates', 'Professional credentials', 'Membership certificates', 'Awards', 'Compliance certifications']],
  '/docs': ['Documentation', 'Reference the QR-V protocol, verification standard, architecture, issuer model, API, security, governance, and compliance materials.', ['Overview', 'Protocol', 'Standards', 'Architecture', 'Verification', 'Registry', 'Issuers', 'Developers', 'API Reference', 'Security']],
  '/network': ['Global Verification Network', 'The production network uses one customer-facing platform node and one trusted API/data node.', ['qrv.network — platform', 'api.qrv.network — API/data authority', 'PostgreSQL — canonical registry']],
  '/billing': ['Billing & Entitlements', 'Billing is a customer-facing platform capability while payment secrets and entitlement enforcement remain server-side.', ['Plan', 'Subscription status', 'Record limits', 'Verification limits', 'API access', 'White-label access']],
  '/wallet': ['QR-V Wallet', 'Reserved customer-facing module for user-held verification references and credentials. No financial custody is implied.', ['Credential references', 'Verification history', 'Saved records']],
  '/store': ['QR-V Store', 'Commercial onboarding, implementation packages, issuer subscriptions, API access, and enterprise services.', ['Issuer plans', 'Launch packages', 'API plans', 'Enterprise services']]
};

function Header() {
  return <header className="site-header">
    <a className="brand" href="/" aria-label="QR-V home"><span className="brand-mark">QR-V</span><span>Global Verification Network</span></a>
    <nav>{nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
    <a className="header-cta" href="/verify">Verify a Record</a>
  </header>;
}

function Footer() {
  return <footer>
    <p>© 2026 QR-V™ — Global QR Verification Network. Operated by ONEGODIAN, LLC.</p>
    <p><a href="/protocol">Protocol</a><a href="/security">Security</a><a href="/status">Status</a><a href="/issuer">Issuer Portal</a></p>
  </footer>;
}

function IconCard({ icon: Icon, title, children }) {
  return <article className="card"><Icon className="icon" /><h3>{title}</h3><p>{children}</p></article>;
}

function MarketingHome() {
  return <>
    <section className="hero section">
      <div className="hero-copy">
        <p className="eyebrow">QR-V™ • Global QR Verification Network</p>
        <h1>Make trusted verification as easy as scanning a QR code.</h1>
        <p className="lead">QR-V turns a QR code into the entry point for an authoritative verification record that can be checked for issuer identity, integrity, status, and revocation.</p>
        <div className="cta-row"><a className="btn primary" href="/verify">Verify a Record <ArrowRight size={18} /></a><a className="btn secondary" href="/issuer">Become an Issuer</a></div>
        <p className="flow">QR Scan → QRVID → Resolver → Registry → Validation → Result</p>
      </div>
      <div className="hero-panel">
        <p className="panel-label">Production verification path</p>
        <h2>{QRV_CONFIG.demoQrvid}</h2>
        <p>Canonical URL</p>
        <a className="mono" href={verifyUrl()}>{verifyUrl()}</a>
        <div className="cta-row"><span className="status-chip gold">Fail-closed verification</span></div>
      </div>
    </section>

    <section className="section grid-3">
      <IconCard icon={Network} title="Protocol-first architecture">QR-V is verification infrastructure built around QRVID resolution, registry records, and deterministic verification states.</IconCard>
      <IconCard icon={Database} title="Registry-backed records">Each QRVID resolves to a canonical record with issuer, record type, lifecycle state, timestamps, and proof references.</IconCard>
      <IconCard icon={ShieldCheck} title="Public trust surface">Verification returns a clear result without asserting trust when the authoritative API cannot establish it.</IconCard>
    </section>

    <section className="section split dark">
      <div><p className="eyebrow">How QR-V Works</p><h2>From static QR code to verifiable record.</h2><p>Traditional QR codes primarily point somewhere. QR-V adds a verification process behind the identifier so the underlying record can be checked against an authoritative registry.</p></div>
      <div className="steps">{steps.map(([title, text], index) => <div className="step" key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </section>

    <section className="section">
      <div className="section-heading"><p className="eyebrow">First Commercial Product</p><h2>QR-V Verified Certificates.</h2><p>Certificates give customers an immediate, understandable reason to use QR-V while exercising the complete issuance and verification lifecycle.</p></div>
      <div className="demo-box"><FileCheck2 /><div><h3>Issue → QR → Verify → Revoke</h3><p>For diplomas, training, professional credentials, memberships, awards, and compliance records.</p></div><a className="btn primary" href="/certificate-verification">Explore Certificates</a></div>
    </section>

    <section className="section">
      <div className="section-heading"><p className="eyebrow">Use Cases</p><h2>Built for claims that need independent verification.</h2></div>
      <div className="use-grid">{useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="section split dark">
      <div><p className="eyebrow">Issuer Portal</p><h2>The commercial control surface.</h2><p>Organizations issue records, generate QR codes, manage lifecycle state, revoke records, and monitor verification activity from the consolidated qrv.network issuer experience.</p><div className="cta-row"><a className="btn primary" href="/issuer">Open Issuer Portal</a><a className="btn secondary" href="/pricing">View Pricing</a></div></div>
      <div className="pricing-grid"><div><h3>Starter</h3><p>$199/mo</p><span>Up to 1,000 active records.</span></div><div><h3>Growth</h3><p>$499/mo</p><span>Up to 10,000 records with API and analytics.</span></div><div><h3>Enterprise</h3><p>Custom</p><span>White-label, integration, and higher-volume deployments.</span></div></div>
    </section>

    <section className="section">
      <div className="section-heading"><p className="eyebrow">Network Services</p><h2>One public platform. One trusted backend.</h2></div>
      <div className="services-grid">{services.map(([title, url, text]) => <a className="service" href={url} key={title}><Globe2 /><h3>{title}</h3><p>{text}</p><span>{url.replace(/^https?:\/\//, '')}</span></a>)}</div>
    </section>

    <section className="section grid-3">
      <IconCard icon={LockKeyhole} title="Issuer control">Protected issuance and revocation operations remain authenticated and API-authorized.</IconCard>
      <IconCard icon={BadgeCheck} title="Deterministic states">VERIFIED, REVOKED, EXPIRED, and NOT_FOUND are public lifecycle outcomes.</IconCard>
      <IconCard icon={Code2} title="Integration-ready">The canonical API supports external systems without exposing database or signing authority to browser clients.</IconCard>
    </section>

    <section className="section final-cta"><Building2 /><h2>Start with one verified record.</h2><p>Issue a certificate, scan the code, verify the record, and prove the complete QR-V lifecycle.</p><div className="cta-row center"><a className="btn primary" href="/issuer">Start Issuer Onboarding</a><a className="btn secondary" href="/docs">Read Documentation</a></div></section>
  </>;
}

function ContentPage({ title, lead, items }) {
  return <>
    <section className="section page-hero"><p className="eyebrow">QR-V™ Global Verification Network</p><h1>{title}</h1><p className="lead">{lead}</p><div className="cta-row"><a className="btn primary" href="/verify">Verify a Record</a><a className="btn secondary" href="/issuer">Issuer Portal</a></div></section>
    <section className="section dark"><div className="page-grid">{items.map((item) => <article className="feature-panel" key={item}><p className="kicker">QR-V</p><h3>{item}</h3><p>Part of the consolidated qrv.network customer experience and backed by the trusted api.qrv.network authority where applicable.</p></article>)}</div></section>
    <section className="section final-cta"><ShieldCheck /><h2>Verification stays authoritative.</h2><p>Customer-facing presentation lives on qrv.network. Sensitive registry, signing, authorization, and audit operations remain behind api.qrv.network.</p></section>
  </>;
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const content = pageContent[path];
  return <div id="top"><Header /><main>{path === '/' ? <MarketingHome /> : content ? <ContentPage title={content[0]} lead={content[1]} items={content[2]} /> : <ContentPage title="QR-V" lead="Continue through the QR-V platform using the navigation above." items={['Verification infrastructure', 'Issuer workflows', 'Registry-backed trust']} />}</main><Footer /></div>;
}

export default App;
