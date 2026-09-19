import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, ShieldCheck, X } from 'lucide-react';
import App from './App.jsx';
import './tier-one.css';

const NAV_GROUPS = [
  {
    label: 'Products',
    href: '/products',
    items: [
      ['Certificate Verification', '/products/certificate-verification'],
      ['Document Verification', '/products/document-verification'],
      ['Membership Verification', '/products/membership-verification'],
      ['API Platform', '/products/api']
    ]
  },
  {
    label: 'Solutions',
    href: '/solutions',
    items: [
      ['Education', '/solutions/education'],
      ['Government', '/solutions/government'],
      ['Business', '/solutions/business'],
      ['Agents', '/solutions/agents']
    ]
  },
  {
    label: 'Developers',
    href: '/developers',
    items: [
      ['Get Started', '/developers/get-started'],
      ['Verification', '/developers/verification'],
      ['Authentication', '/developers/authentication'],
      ['SDKs', '/developers/sdks']
    ]
  },
  {
    label: 'Documentation',
    href: '/docs',
    items: [
      ['Overview', '/docs/overview'],
      ['QRVP-1 Protocol', '/docs/protocol/qr-vp-1'],
      ['QVS-1.0 Verification', '/docs/verification/qvs-1'],
      ['API Reference', '/docs/api-reference']
    ]
  },
  {
    label: 'Pricing',
    href: '/pricing',
    items: [
      ['Issuer', '/pricing/issuer'],
      ['API', '/pricing/api'],
      ['Enterprise', '/pricing/enterprise'],
      ['White-label', '/pricing/white-label']
    ]
  },
  {
    label: 'About',
    href: '/about',
    items: [
      ['What Is QR-V', '/about/what-is-qr-v'],
      ['How It Works', '/about/how-it-works'],
      ['Network Architecture', '/about/network-architecture'],
      ['Standards', '/about/standards']
    ]
  }
];

const PAGE_DATA = {
  '/about': {
    eyebrow: 'About QR-V',
    title: 'A verification network built around accountable records.',
    lead: 'QR-V connects a persistent identifier to an issuer-backed registry record, deterministic verification state, and an auditable lifecycle.',
    stage: 'integrated',
    cards: [
      ['What is QR-V?', 'Understand the role of QR-V as verification infrastructure rather than a QR-code generator.', '/about/what-is-qr-v'],
      ['How it works', 'Follow issue → store → QR → scan → verify → revoke across the network boundary.', '/about/how-it-works'],
      ['Network architecture', 'See the canonical qrv.network + api.qrv.network two-node production model.', '/about/network-architecture'],
      ['Standards', 'Review QRVP-1 protocol and QVS-1.0 verification semantics.', '/about/standards']
    ]
  },
  '/products': {
    eyebrow: 'Products',
    title: 'Verification products on one canonical trust layer.',
    lead: 'Certificates are the first commercial implementation. Additional record classes remain separated by capability and only become operational after implementation and acceptance.',
    stage: 'integrated',
    cards: [
      ['Certificate Verification', 'The launch workflow for issue, QR generation, public verification, expiration, and revocation.', '/products/certificate-verification'],
      ['Document Verification', 'Integrity and lifecycle verification for controlled documents and records.', '/products/document-verification'],
      ['Membership Verification', 'Public-safe membership standing and credential verification.', '/products/membership-verification'],
      ['API Platform', 'Machine-oriented verification and issuer integration through api.qrv.network.', '/products/api']
    ]
  },
  '/solutions': {
    eyebrow: 'Solutions',
    title: 'Verification workflows for institutions and software systems.',
    lead: 'Solution pages describe intended deployment patterns. A solution is not represented as operational until its underlying product workflow is implemented, tested, and repeatable.',
    stage: 'scaffolded',
    cards: [
      ['Education', 'Certificates, training records, awards, and institutional credentials.', '/solutions/education'],
      ['Government', 'Public-sector records and issuer-controlled verification workflows.', '/solutions/government'],
      ['Business', 'Commercial records, credentials, product and asset verification.', '/solutions/business'],
      ['Agents', 'Deterministic machine verification for approved software and agent workflows.', '/solutions/agents']
    ]
  },
  '/developers': {
    eyebrow: 'Developers',
    title: 'Integrate QR-V through a deterministic API contract.',
    lead: 'The human developer experience lives on qrv.network. Machine operations remain on the trusted api.qrv.network data plane.',
    stage: 'integrated',
    cards: [
      ['Get Started', 'Start with the canonical API origin, verification states, and environment boundaries.', '/developers/get-started'],
      ['Verification', 'Resolve a QRVID and handle VERIFIED, REVOKED, EXPIRED, NOT_FOUND, and UNAVAILABLE states.', '/developers/verification'],
      ['Authentication', 'Use scoped server-side credentials for protected operations; never expose privileged keys in browsers.', '/developers/authentication'],
      ['SDKs', 'SDK surfaces follow the normative OpenAPI contract as they become available.', '/developers/sdks']
    ]
  },
  '/docs': {
    eyebrow: 'Documentation',
    title: 'Protocol, verification, registry, issuer, and API documentation.',
    lead: 'Documentation keeps protocol requirements, standard requirements, production implementation details, and commercial messaging explicitly separated.',
    stage: 'integrated',
    cards: [
      ['System Overview', 'Understand the product scope and canonical production architecture.', '/docs/overview'],
      ['QRVP-1', 'Identifier, resolution, registry, lifecycle, hashing, signing, and revocation architecture.', '/docs/protocol/qr-vp-1'],
      ['QVS-1.0', 'Deterministic verification states, integrity checks, and fail-closed behavior.', '/docs/verification/qvs-1'],
      ['API Reference', 'Human-readable API documentation whose endpoint inventory is governed by OpenAPI.', '/docs/api-reference']
    ]
  },
  '/protocol': {
    eyebrow: 'Protocol',
    title: 'QRVP-1 and QVS-1.0 define the verification contract.',
    lead: 'Protocol and standard surfaces document identifiers, issuer authority, registry resolution, cryptographic integrity, lifecycle state, and verification outcomes.',
    stage: 'integrated',
    cards: [
      ['QRVP-1', 'The QR-V Internet Protocol architecture.', '/protocol/qr-vp-1'],
      ['QVS-1.0', 'The QR-V Global Verification Standard.', '/protocol/qvs-1'],
      ['Cryptography', 'SHA-256 integrity and Ed25519 signing architecture.', '/protocol/cryptography'],
      ['Lifecycle', 'Issue, verify, expire, revoke, and audit state transitions.', '/protocol/lifecycle']
    ]
  },
  '/security': {
    eyebrow: 'Security',
    title: 'Verification fails closed when trust cannot be established.',
    lead: 'QR-V separates browser presentation from privileged API, database, issuer authorization, and signing material.',
    stage: 'integrated',
    cards: [
      ['SHA-256', 'Stored canonical integrity hashes are part of the current verification model.', '/security/sha-256'],
      ['Ed25519', 'Ed25519 remains a production activation gate until issuer-scoped key lifecycle is fully operational.', '/security/ed25519'],
      ['Key Management', 'Signing keys require durable key IDs, rotation, retirement, compromise, and historical verification behavior.', '/security/key-management'],
      ['Responsible Disclosure', 'Security reports belong in a controlled disclosure process.', '/security/responsible-disclosure']
    ]
  },
  '/enterprise': {
    eyebrow: 'Enterprise',
    title: 'Institutional verification without a second trust authority.',
    lead: 'Enterprise integrations, bulk issuance, white-label presentation, and support remain anchored to the same QR-V registry and API authority.',
    stage: 'scaffolded',
    cards: [
      ['Enterprise API', 'Scoped integrations through the canonical API boundary.', '/enterprise/api'],
      ['Bulk Issuance', 'Controlled high-volume issuance with bounded, auditable operations.', '/enterprise/bulk-issuance'],
      ['White-label', 'Branded presentation without creating a competing verification authority.', '/enterprise/white-label'],
      ['Security', 'Enterprise authentication, authorization, audit, and key-management requirements.', '/enterprise/security']
    ]
  },
  '/pricing': {
    eyebrow: 'Pricing',
    title: 'Commercial plans follow the capability actually activated.',
    lead: 'Pricing is separated by issuer, API, enterprise, and white-label use. Billing and entitlements only become operational when the corresponding backend workflow is configured and enforced.',
    stage: 'integrated',
    cards: [
      ['Issuer Plans', 'Issuer Portal access, record limits, team controls, and lifecycle operations.', '/pricing/issuer'],
      ['API Plans', 'Server-to-server verification and protected issuer integration.', '/pricing/api'],
      ['Enterprise', 'Institutional integration, security, volume, and support requirements.', '/pricing/enterprise'],
      ['White-label', 'Branded deployment options that preserve the canonical trust model.', '/pricing/white-label']
    ]
  },
  '/resources': {
    eyebrow: 'Resources',
    title: 'Guides and examples built around verified workflows.',
    lead: 'Resource material expands after production workflows stabilize so examples do not get ahead of the implementation.',
    stage: 'scaffolded',
    cards: [
      ['Guides', 'Implementation and operational guides.', '/resources/guides'],
      ['Tutorials', 'Step-by-step integration material.', '/resources/tutorials'],
      ['Examples', 'Verified examples tied to real supported workflows.', '/resources/examples'],
      ['FAQ', 'Common verification, issuer, and developer questions.', '/resources/faq']
    ]
  },
  '/network': {
    eyebrow: 'Network',
    title: 'One public platform. One trusted API/data plane.',
    lead: 'qrv.network is the canonical human-facing origin. api.qrv.network is the canonical machine trust and data boundary. The registry remains singular and writable only through authorized backend operations.',
    stage: 'integrated',
    cards: [
      ['Architecture', 'The canonical two-node production topology.', '/network/architecture'],
      ['Nodes', 'Public platform and trusted API responsibilities.', '/network/nodes'],
      ['Status', 'Operational status and readiness surfaces.', '/network/status'],
      ['Version', 'Runtime and protocol version information.', '/network/version']
    ]
  },
  '/company': {
    eyebrow: 'Company',
    title: 'The commercial organization behind QR-V.',
    lead: 'Company pages cover origin, contact, partnerships, and news without mixing commercial claims into protocol or verification standards.',
    stage: 'scaffolded',
    cards: [
      ['About', 'Company and product origin.', '/company/about'],
      ['Contact', 'Commercial and partnership contact.', '/company/contact'],
      ['Partners', 'Integration and deployment relationships.', '/company/partners'],
      ['News', 'Product and network announcements.', '/company/news']
    ]
  },
  '/support': {
    eyebrow: 'Support',
    title: 'Support paths for verifiers, issuers, and developers.',
    lead: 'Support is segmented by workflow so verification questions, issuer operations, developer integration, and record reports reach the correct process.',
    stage: 'integrated',
    cards: [
      ['Verification Support', 'Help interpreting public verification states and failures.', '/support/verification'],
      ['Issuer Support', 'Issuer access and record lifecycle support.', '/support/issuer'],
      ['Developer Support', 'API and integration support.', '/support/developer'],
      ['Report a Record', 'Report a potentially incorrect or inappropriate public record for review.', '/support/report-record']
    ]
  },
  '/legal': {
    eyebrow: 'Legal',
    title: 'Terms, privacy, API, issuer, and disclosure policies.',
    lead: 'Legal surfaces govern platform use and commercial relationships. They do not replace issuer authority or create legal validity for an underlying record.',
    stage: 'integrated',
    cards: [
      ['Terms', 'Platform terms of use.', '/legal/terms'],
      ['Privacy', 'Privacy and public-record disclosure practices.', '/legal/privacy'],
      ['API Terms', 'Machine integration terms.', '/legal/api-terms'],
      ['Issuer Agreement', 'Issuer responsibilities and platform relationship.', '/legal/issuer-agreement']
    ]
  }
};

const FAMILY_LABELS = {
  about: 'About QR-V',
  products: 'Products',
  solutions: 'Solutions',
  developers: 'Developers',
  docs: 'Documentation',
  protocol: 'Protocol',
  security: 'Security',
  enterprise: 'Enterprise',
  pricing: 'Pricing',
  resources: 'Resources',
  network: 'Network',
  company: 'Company',
  support: 'Support',
  legal: 'Legal'
};

function humanize(value) {
  return String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolvePage(pathname) {
  if (PAGE_DATA[pathname]) return PAGE_DATA[pathname];
  const parts = pathname.split('/').filter(Boolean);
  const family = parts[0];
  if (FAMILY_LABELS[family]) {
    const leaf = parts.at(-1);
    return {
      eyebrow: FAMILY_LABELS[family],
      title: humanize(leaf),
      lead: 'This route is defined by the authoritative QR-V production sitemap. Its page surface is scaffolded and must not be treated as an operational product capability until its workflow is implemented, documented, tested, and repeatable.',
      stage: 'scaffolded',
      cards: [
        ['Route status', 'Scaffolded. The canonical route exists in the information architecture, but production capability is not asserted by the page alone.', `/${family}`],
        ['Trust boundary', 'Operational data and verification authority remain behind api.qrv.network and the canonical registry.', '/network'],
        ['Implementation rule', 'Promotion follows scaffolded → integrated → tested → production.', '/docs']
      ]
    };
  }
  return null;
}

function CanonicalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="canonical-header">
        <a className="canonical-brand" href="/" aria-label="QR-V home">
          <img src="/qrv-logo.svg" alt="QR-V Global Verification Network" />
        </a>
        <nav className="canonical-nav" aria-label="Primary navigation">
          {NAV_GROUPS.map((group) => (
            <div className="canonical-nav-group" key={group.label}>
              <a className="canonical-nav-trigger" href={group.href}>
                {group.label}<ChevronDown size={13} aria-hidden="true" />
              </a>
              <div className="canonical-mega-menu">
                <div className="canonical-menu-heading">
                  <span>{group.label}</span>
                  <a href={group.href}>View all <ArrowRight size={14} /></a>
                </div>
                <div className="canonical-menu-links">
                  {group.items.map(([label, href]) => (
                    <a href={href} key={href}>{label}<ArrowRight size={14} /></a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="canonical-actions">
          <a className="canonical-action-link" href="/verify">Verify Record</a>
          <a className="canonical-action-link issuer" href="/issuer/login">Issuer Login</a>
          <a className="canonical-action-primary" href="/issuer/onboarding">Get Started</a>
          <button className="canonical-menu-button" type="button" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen((value) => !value)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div className={`canonical-mobile-menu${open ? ' open' : ''}`}>
        {NAV_GROUPS.map((group) => (
          <section key={group.label}>
            <a className="mobile-group-title" href={group.href}>{group.label}</a>
            {group.items.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          </section>
        ))}
        <div className="canonical-mobile-actions">
          <a href="/verify">Verify Record</a>
          <a href="/issuer/login">Issuer Login</a>
          <a className="primary" href="/issuer/onboarding">Get Started</a>
        </div>
      </div>
    </>
  );
}

function CanonicalFooter() {
  return (
    <footer className="canonical-footer">
      <div className="canonical-footer-grid">
        <div className="canonical-footer-brand">
          <img src="/qrv-logo.svg" alt="QR-V Global Verification Network" />
          <p>Registry-backed verification infrastructure governed by QRVP-1 and QVS-1.0.</p>
          <small>qrv.network · api.qrv.network</small>
        </div>
        <div><strong>Platform</strong><a href="/verify">Verify Record</a><a href="/registry">Registry</a><a href="/issuer">Issuer Portal</a><a href="/status">Status</a></div>
        <div><strong>Build</strong><a href="/developers">Developers</a><a href="/docs">Documentation</a><a href="/protocol">Protocol</a><a href="/security">Security</a></div>
        <div><strong>Company</strong><a href="/about">About</a><a href="/pricing">Pricing</a><a href="/support">Support</a><a href="/legal">Legal</a></div>
      </div>
      <div className="canonical-footer-bottom">© 2026 ONEGODIAN, LLC. QR-V™ Global Verification Network.</div>
    </footer>
  );
}

function PageMeta({ title, lead, pathname }) {
  useEffect(() => {
    document.title = `${title} | QR-V™ Global Verification Network`;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', lead);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://qrv.network${pathname}`);
  }, [title, lead, pathname]);

  return null;
}

function PublicRoutePage({ page, pathname }) {
  return (
    <main className="tier-one-page">
      <PageMeta title={page.title} lead={page.lead} pathname={pathname} />
      <section className="tier-one-hero">
        <div className="tier-one-shell">
          <span className={`tier-one-stage ${page.stage}`}>{page.stage === 'integrated' ? 'Integrated surface' : 'Scaffolded surface'}</span>
          <p className="tier-one-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="tier-one-lead">{page.lead}</p>
          <div className="tier-one-actions">
            <a className="tier-one-primary" href="/verify">Verify Record</a>
            <a className="tier-one-secondary" href="/issuer/onboarding">Get Started</a>
          </div>
        </div>
      </section>
      <section className="tier-one-content">
        <div className="tier-one-shell">
          <div className="tier-one-grid">
            {page.cards.map(([title, text, href]) => (
              <article className="tier-one-card" key={`${pathname}-${title}`}>
                <h2>{title}</h2>
                <p>{text}</p>
                <a href={href}>Open <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
          <aside className="tier-one-trust-note">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>Production claims follow evidence.</strong>
              <p>A defined page or route does not make a QR-V capability operational. Production requires implementation, integration, documentation, tests, and repeatable acceptance evidence.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage({ pathname }) {
  return (
    <main className="tier-one-page">
      <PageMeta title="Page not found" lead="The requested QR-V route is not defined." pathname={pathname} />
      <section className="tier-one-hero">
        <div className="tier-one-shell">
          <p className="tier-one-eyebrow">QR-V</p>
          <h1>Page not found.</h1>
          <p className="tier-one-lead">No public route is defined for {pathname}.</p>
          <a className="tier-one-primary" href="/">Return home</a>
        </div>
      </section>
    </main>
  );
}

export default function SiteRouter() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const page = resolvePage(pathname);

  return (
    <div className="canonical-site">
      <CanonicalHeader />
      {pathname === '/' ? (
        <div className="legacy-home"><App /></div>
      ) : page ? (
        <PublicRoutePage page={page} pathname={pathname} />
      ) : (
        <NotFoundPage pathname={pathname} />
      )}
      <CanonicalFooter />
    </div>
  );
}
