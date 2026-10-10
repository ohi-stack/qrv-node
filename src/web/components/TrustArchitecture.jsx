import { ArrowRight, Database, FileKey2, LockKeyhole, Network, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    name: 'Unified cryptographic security',
    icon: ShieldCheck,
    summary: 'One record-integrity and issuer-trust model across certificates, memberships, products and documents.',
    detail: 'Canonical serialization, SHA-256, Ed25519 signing and key-ID lifecycle are production controls. Signature activation is a release gate, not an assumed live capability.'
  },
  {
    name: 'Selective privacy',
    icon: LockKeyhole,
    summary: 'Verify the claim needed for a transaction without publishing the underlying private record.',
    detail: 'Public, restricted, private and authorized selective-disclosure policies determine field visibility. A QR code never contains private credentials or signing keys.'
  },
  {
    name: 'Open standards',
    icon: FileKey2,
    summary: 'QRVP-1 defines protocol structure; QVS-1.0 defines deterministic verification behavior.',
    detail: 'Published schemas, OpenAPI contracts, validation states, conformance tests and versioned implementation guidance enable independent integrations.'
  },
  {
    name: 'Seamless interoperability',
    icon: Network,
    summary: 'Integrate existing platforms instead of asking organizations to replace their systems.',
    detail: 'REST, OpenAPI, scoped service credentials, webhooks, CSV/Sheets imports, SDKs and approved connectors support gradual adoption.'
  }
];

const integrationGroups = [
  { title: 'Existing business systems', caption: 'LMS, CRM, ERP, HRIS, WordPress, WooCommerce and document workflows' },
  { title: 'Developer and agent systems', caption: 'JSON verification, OpenAPI 3.1, SDKs, request IDs, API credentials and webhooks' },
  { title: 'Google Workspace connectors', caption: 'Drive/Picker source selection, Sheets imports, issuer emails and consent-based OAuth' }
];

export default function TrustArchitecture() {
  return (
    <section className="section trust-architecture-section" aria-labelledby="qrv-trust-title">
      <div className="page-shell">
        <div className="section-heading">
          <p className="eyebrow cyan">The QR-V trust framework</p>
          <h2 id="qrv-trust-title">Cryptographic security. Selective privacy. Open standards. Integration.</h2>
          <p>QR-V is designed as registry-backed verification infrastructure, not simply a QR-code generator. Each verification must evaluate the authoritative issuer record and its current status while respecting disclosure policy.</p>
        </div>
        <div className="trust-pillar-grid">
          {pillars.map(({ name, icon: Icon, summary, detail }) => (
            <article className="trust-pillar" key={name}>
              <Icon aria-hidden="true" size={27} />
              <h3>{name}</h3>
              <p>{summary}</p>
              <small>{detail}</small>
            </article>
          ))}
        </div>
        <div className="trust-boundary" role="note">
          <Database aria-hidden="true" size={27} />
          <div>
            <h3>One authoritative trust boundary</h3>
            <p><strong>qrv.network</strong> presents verification, issuer and holder experiences. <strong>api.qrv.network</strong> owns protected issuer operations, cryptographic validation, revocation and audit events against canonical PostgreSQL records. A QR-V Wallet saves references, not independent verification truth.</p>
            <p className="trust-caveat">Record verification establishes the claims supported by the issuing authority and registry. It does not independently establish legal title, government recognition, licensing or ownership.</p>
          </div>
        </div>
        <div className="trust-integration">
          <div className="trust-integration-heading">
            <div>
              <p className="eyebrow">Built to connect</p>
              <h3>Bring verification to the software you already use.</h3>
              <p>These are integration patterns and roadmap requirements. Their presence here is not evidence that a specific connector is live.</p>
            </div>
            <a className="text-link" href="/developers">Developer integrations <ArrowRight aria-hidden="true" size={16} /></a>
          </div>
          <div className="trust-integration-grid">
            {integrationGroups.map(({ title, caption }) => <article key={title}><h4>{title}</h4><p>{caption}</p></article>)}
          </div>
        </div>
        <div className="trust-footer-links">
          <a href="/protocol">QRVP-1 protocol</a>
          <a href="/standards">QVS-1.0 standard</a>
          <a href="/security">Security model</a>
          <a href="/docs">Technical documentation</a>
        </div>
      </div>
    </section>
  );
}
