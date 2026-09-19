"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "./Link.jsx";
import Image from "./Image.jsx";
import { formatNewsDate, newsPosts } from "./news-data";

const DEMO_ID = "QRV-PROD-CERT-000001";

type MegaNavGroup = {
  label: string;
  eyebrow: string;
  summary: string;
  links: Array<{ label: string; href: string; description: string }>;
  feature: { label: string; title: string; text: string; href: string; cta: string };
};

const megaNav: MegaNavGroup[] = [
  {
    label: "Products",
    eyebrow: "Verified record products",
    summary: "Start with certificates, then extend the same governed verification model to authorized record classes.",
    links: [
      { label: "Certificate Verification", href: "/certificate-verification", description: "Verify diplomas, licenses, training, awards, and compliance records." },
      { label: "Public Registry", href: "/registry", description: "Search public records when the canonical API exposes registry search." },
      { label: "Document Verification", href: "/use-cases#doc", description: "Apply public-safe verification to controlled documents and notices." },
      { label: "Product & Asset Records", href: "/use-cases#prod", description: "Track authenticity, origin, warranty, and accountable assets." },
    ],
    feature: {
      label: "Launch product",
      title: "Verified Certificate Pilot",
      text: "Exercise the complete issue, store, verify, revoke, and audit lifecycle with one authorized record class.",
      href: "/store",
      cta: "Explore products",
    },
  },
  {
    label: "Solutions",
    eyebrow: "Authorized record classes",
    summary: "Apply the QR‑V trust model to institutional, commercial, identity, property, and product records.",
    links: [
      { label: "Certificates & Credentials", href: "/use-cases#cert", description: "Diplomas, training, licenses, awards, and compliance." },
      { label: "Membership & Identity", href: "/use-cases#id", description: "Public-safe status for organization-issued credentials." },
      { label: "Documents & Records", href: "/use-cases#doc", description: "Agreements, notices, policies, and controlled records." },
      { label: "Property & Assets", href: "/use-cases#asset", description: "Authenticity, ownership, equipment, and property references." },
    ],
    feature: {
      label: "Deployment model",
      title: "One protocol. Multiple use cases.",
      text: "Design a governed verification workflow around your record authority and public disclosure rules.",
      href: "/use-cases",
      cta: "Explore solutions",
    },
  },
  {
    label: "Developers",
    eyebrow: "Integration resources",
    summary: "Build against a documented REST contract, deterministic verification states, and a strict API/data boundary.",
    links: [
      { label: "Developer Portal", href: "/developers", description: "Review endpoints, examples, and integration patterns." },
      { label: "API Architecture", href: "/network", description: "Understand qrv.network and api.qrv.network responsibilities." },
      { label: "Security Model", href: "/security", description: "Inspect identity, integrity, privacy, and audit controls." },
      { label: "Verification Workflow", href: "/how-it-works", description: "Follow issue, resolve, verify, revoke, and audit behavior." },
    ],
    feature: {
      label: "API quick start",
      title: "Verify with one deterministic request.",
      text: `GET https://api.qrv.network/api/v1/verify/${DEMO_ID}`,
      href: "/developers",
      cta: "Open developer portal",
    },
  },
  {
    label: "Documentation",
    eyebrow: "Protocol and operations",
    summary: "Keep route definitions, API contracts, verification requirements, and production readiness evidence clearly separated.",
    links: [
      { label: "Documentation Hub", href: "/docs", description: "Read implementation concepts, states, and launch guidance." },
      { label: "QRVP-1 Protocol", href: "/protocol", description: "Review identifiers, resolution, integrity, and lifecycle rules." },
      { label: "How It Works", href: "/how-it-works", description: "Follow the issue → store → verify → revoke sequence." },
      { label: "Production Status", href: "/status", description: "Review public service status and disclosed activation gates." },
    ],
    feature: {
      label: "Standards baseline",
      title: "QRVP-1 · QVS-1.0",
      text: "SHA-256 integrity is active; Ed25519 signing and validation remain disclosed as a production gate until verified live.",
      href: "/docs",
      cta: "Read the documentation",
    },
  },
  {
    label: "Pricing",
    eyebrow: "Commercial entry points",
    summary: "Start with a controlled pilot, then scale issuer operations, API access, and implementation support under written scope.",
    links: [
      { label: "Issuer Plans", href: "/pricing#issuer-plans", description: "Compare pilot, starter, professional, and enterprise paths." },
      { label: "Certificate Programs", href: "/pricing#certificate-plans", description: "Review certificate issuance and verification options." },
      { label: "Implementation Services", href: "/pricing#services", description: "Scope integration, design, and operational support." },
      { label: "Digital Products", href: "/pricing#digital-products", description: "Review available QR‑V development and implementation assets." },
    ],
    feature: {
      label: "Controlled start",
      title: "Begin with the right scope.",
      text: "Issuer authority, record class, public disclosure, and lifecycle acceptance are reviewed before production access.",
      href: "/contact",
      cta: "Plan an implementation",
    },
  },
  {
    label: "About",
    eyebrow: "Organization and origin",
    summary: "Learn the platform record, commercial ownership, implementation model, and contact path.",
    links: [
      { label: "About QR‑V", href: "/about", description: "Purpose, origin, ownership, and platform objective." },
      { label: "Contact", href: "/contact", description: "Discuss issuer, developer, or enterprise implementation." },
      { label: "Pricing", href: "/pricing", description: "Review subscription and implementation baselines." },
      { label: "News & Insights", href: "/news", description: "Read protocol, product, research, and network updates." },
      { label: "Terms & Privacy", href: "/terms", description: "Read the public launch terms and privacy baseline." },
    ],
    feature: {
      label: "Platform record",
      title: "Owned by ONEGODIAN, LLC.",
      text: "Founded and originated by Gregory L. Jones, also known as One Gregory Onegodian™.",
      href: "/about",
      cta: "Read the origin record",
    },
  },
];

const qrCells = [
  1,1,1,1,1,0,1,0,1,1,1,1,1, 1,0,0,0,1,0,0,1,1,0,0,0,1,
  1,0,1,0,1,1,1,0,1,0,1,0,1, 1,0,0,0,1,0,1,1,1,0,0,0,1,
  1,1,1,1,1,0,1,0,1,1,1,1,1, 0,0,0,0,0,1,0,1,0,0,0,0,0,
  1,1,0,1,1,0,1,1,1,0,1,1,0, 0,1,1,0,0,1,0,0,1,1,0,1,1,
  1,0,1,1,0,0,1,1,0,1,1,0,1, 0,1,0,0,1,1,0,1,1,0,1,1,0,
  1,1,1,1,1,0,1,0,1,1,0,1,1, 1,0,0,0,1,1,0,1,0,0,1,0,0,
  1,0,1,0,1,0,1,1,1,1,1,0,1, 1,0,0,0,1,0,0,1,0,1,0,1,0,
  1,1,1,1,1,0,1,0,1,1,1,0,1,
];

export function QRMark() {
  return (
    <div className="qr-mark" aria-label="QR-V demo QR code">
      <div className="qr-grid" aria-hidden="true">
        {qrCells.map((filled, index) => (
          <i className={filled ? "filled" : ""} key={index} />
        ))}
      </div>
      <span className="qr-sweep" aria-hidden="true" />
      <span className="qr-check">✓</span>
    </div>
  );
}

function VerificationCard() {
  const [state, setState] = useState({ status: "CHECKING", issuer: "ONEGODIAN, LLC", integrity: "Checking canonical API…" });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/verify/${encodeURIComponent(DEMO_ID)}`, { headers: { accept: "application/json" }, cache: "no-store" })
      .then(async response => ({ response, payload: await response.json().catch(() => ({})) }))
      .then(({ response, payload }) => {
        if (cancelled) return;
        const record = payload.record || payload;
        const status = String(payload.status || payload.state || (response.status === 404 ? "NOT_FOUND" : "UNAVAILABLE")).toUpperCase();
        setState({
          status,
          issuer: record.issuer || record.issuerName || "ONEGODIAN, LLC",
          integrity: status === "VERIFIED" ? "SHA-256 registered · Ed25519 pending" : "Canonical API state returned on verification page",
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "UNAVAILABLE", issuer: "ONEGODIAN, LLC", integrity: "Canonical API unavailable" });
      });
    return () => { cancelled = true; };
  }, []);

  const verified = state.status === "VERIFIED";
  const checking = state.status === "CHECKING";

  return (
    <article className="verify-card" id="live-demo">
      <div className="card-kicker">
        <span className={checking ? "live-dot" : verified ? "live-dot" : "live-dot warning-dot"} />
        Live public record
      </div>
      <div className="verify-primary">
        <QRMark />
        <div>
          <span className="field-label">QRVID</span>
          <strong className="qrvid">{DEMO_ID}</strong>
          <span className={verified ? "status-badge" : "status-badge status-badge-muted"}>{verified ? "✓ Verified" : state.status}</span>
        </div>
      </div>
      <dl className="record-lines">
        <div><dt>Issuer</dt><dd>ONEGODIAN, LLC</dd></div>
        <div><dt>Integrity</dt><dd><span>{state.integrity}</span></dd></div>
        <div><dt>Standard</dt><dd>QVS-1.0</dd></div>
      </dl>
      <Link className="card-link" href={`/verify/${DEMO_ID}`}>
        Open registry result <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function closeMenu() {
    setActiveMenu(null);
    setMobileOpen(false);
  }

  function toggleGroup(label: string) {
    setActiveMenu(current => current === label ? null : label);
  }

  return (
    <header className="site-header" ref={headerRef} onMouseLeave={() => !mobileOpen && setActiveMenu(null)}>
      <Link href="/" className="brand brand-logo" aria-label="QR-V Global Verification Network home">
        <Image
          src="/qrv-logo.svg"
          alt="QR-V Global Verification Network"
          width={1389}
          height={533}
          priority
          unoptimized
        />
      </Link>
      <button
        className="menu-button"
        onClick={() => {
          setMobileOpen(current => !current);
          setActiveMenu(null);
        }}
        aria-expanded={mobileOpen}
        aria-controls="main-nav"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        <span className={mobileOpen ? "open" : ""} />
        <span className={mobileOpen ? "open" : ""} />
        <span className={mobileOpen ? "open" : ""} />
        <b className="sr-only">Menu</b>
      </button>
      <nav id="main-nav" className={mobileOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        {megaNav.map(group => {
          const expanded = activeMenu === group.label;
          const panelId = `menu-${group.label.toLowerCase()}`;
          return (
            <div className={expanded ? "nav-entry active" : "nav-entry"} key={group.label} onMouseEnter={() => !mobileOpen && setActiveMenu(group.label)}>
              <button
                className="nav-trigger"
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => mobileOpen ? toggleGroup(group.label) : setActiveMenu(group.label)}
              >
                {group.label}<span aria-hidden="true">⌄</span>
              </button>
              <div className="mega-menu" id={panelId} aria-hidden={!expanded}>
                <div className="mega-menu-inner">
                  <div className="mega-intro">
                    <span>{group.eyebrow}</span>
                    <strong>{group.label}</strong>
                    <p>{group.summary}</p>
                  </div>
                  <div className="mega-link-grid">
                    {group.links.map((item, index) => (
                      <Link href={item.href} key={`${group.label}-${item.label}`} onClick={closeMenu}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{item.label}<i aria-hidden="true">↗</i></strong>
                        <small>{item.description}</small>
                      </Link>
                    ))}
                  </div>
                  <Link className="mega-feature" href={group.feature.href} onClick={closeMenu}>
                    <span>{group.feature.label}</span>
                    <strong>{group.feature.title}</strong>
                    <p>{group.feature.text}</p>
                    <b>{group.feature.cta} <i aria-hidden="true">→</i></b>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      <div className="header-actions">
        <Link className="header-link" href="/issuer">Issuer Login</Link>
        <Link className="button button-small header-cta" href="/verify">Verify Record</Link>
        <Link className="button button-small header-cta header-cta-secondary" href="/contact">Get Started</Link>
      </div>
      {activeMenu && <button className="menu-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
    </header>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip" aria-label="Platform trust features">
      <div><span className="trust-icon">✓</span><strong>Registry-backed</strong><small>Canonical source records</small></div>
      <div><span className="trust-icon">⌁</span><strong>Cryptographic roadmap</strong><small>SHA-256 active · Ed25519 required</small></div>
      <div><span className="trust-icon">◎</span><strong>Globally verifiable</strong><small>One scan, clear status</small></div>
    </div>
  );
}

function NetworkRail() {
  const nodes = [
    ["QR-V platform", "qrv.network", "Public website"],
    ["Verification API", "api.qrv.network/api/v1", "Canonical API/data authority"],
  ];

  return (
    <section className="network-rail" aria-label="Live QR-V network infrastructure">
      <div className="network-rail-heading">
        <span className="live-dot" />
        <strong>Production topology</strong>
        <small>Production services on one verified origin</small>
      </div>
      <div className="network-nodes two-node">
        {nodes.map(([label, endpoint, state], index) => (
          <div className="network-node" key={label}>
            <span className="node-index">0{index + 1}</span>
            <span><strong>{label}</strong><small>{endpoint}</small></span>
            <b>{state}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VerifySearch({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState(DEMO_ID);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = `/verify/${encodeURIComponent(value.trim())}`;
  }
  return (
    <form className={compact ? "verify-search compact" : "verify-search"} onSubmit={submit}>
      <label htmlFor={compact ? "qrvid-compact" : "qrvid"}>Enter a QR‑V identifier</label>
      <div>
        <input
          id={compact ? "qrvid-compact" : "qrvid"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          autoCapitalize="characters"
          placeholder="QRV-PROD-CERT-000001"
        />
        <button className="button" type="submit">Verify now</button>
      </div>
      <small>Try the canonical public launch record.</small>
    </form>
  );
}

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <>
      <button
        className={showBackToTop ? "back-to-top visible" : "back-to-top"}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        <span aria-hidden="true">↑</span>
      </button>
      <footer className="site-footer">
        <div className="footer-lead">
          <Link href="/" className="brand brand-light footer-brand" aria-label="QR-V Global Verification Network home">
            <Image
              src="/qrv-logo.svg"
              alt="QR-V Global Verification Network"
              width={1077}
              height={375}
              unoptimized
            />
          </Link>
          <p>Registry-backed verification infrastructure for records that need to be trusted.</p>
          <span>QRVP-1 Protocol · QVS-1.0 Standard</span>
        </div>
        <div>
          <strong>Platform</strong>
          <Link href="/verify">Verify</Link>
          <Link href="/registry">Registry</Link>
          <Link href="/issuer">Issuer access</Link>
          <Link href="/status">Network status</Link>
        </div>
        <div>
          <strong>Build</strong>
          <Link href="/protocol">Protocol</Link>
          <Link href="/developers">Developers</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/security">Security</Link>
        </div>
        <div>
          <strong>Organization</strong>
          <Link href="/about">About</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ONEGODIAN, LLC. All rights reserved.</span>
          <span>Founded and originated by Gregory L. Jones, also known as One Gregory Onegodian™.</span>
        </div>
      </footer>
    </>
  );
}

export default function QrvApp() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero">
          <div className="network-pattern" aria-hidden="true" />
          <div className="hero-scan-beam" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true"><span /></div>
          <div className="hero-orbit hero-orbit-two" aria-hidden="true"><span /></div>
          <div className="hero-copy">
          <p className="eyebrow">QR-V™ NETWORK · Global verification network</p>
            <h1>Turn every<br />scan into proof.</h1>
            <p className="hero-text">
              Registry-backed verification for certificates, credentials,
              documents, products, and digital records.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/verify">Verify a Record</Link>
              <Link className="button button-outline" href="/issuer">Become an Issuer</Link>
            </div>
            <div className="micro-proof"><span>● Public launch</span><span>QRVP-1</span><span>QVS-1.0</span></div>
            <div className="crypto-chips" aria-label="Cryptographic verification stack">
              <span>SHA-256 active</span><span>Ed25519 pending</span><span>Canonical JSON</span><span>TLS 1.3</span>
            </div>
          </div>
          <VerificationCard />
        </section>
        <NetworkRail />
        <TrustStrip />

        <section className="section problem-section">
          <div className="section-heading">
            <p className="eyebrow">What QR‑V solves</p>
            <h2>A QR code can point anywhere. QR‑V establishes what is true.</h2>
            <p>Each scan resolves to a canonical registry entry, validates the issuer and checks the record’s current status and integrity.</p>
          </div>
          <div className="comparison">
            <article className="compare-card muted-card">
              <span className="card-number">01</span>
              <h3>Ordinary QR codes</h3>
              <p>A visual pointer with no built-in assurance about the destination, issuer, status, or underlying data.</p>
              <ul><li>Destination can change</li><li>No canonical record</li><li>No revocation state</li></ul>
            </article>
            <div className="versus">→</div>
            <article className="compare-card qrv-card">
              <span className="card-number">02</span>
              <h3>QR‑V verification</h3>
              <p>A structured reference backed by issuer identity, registry state, cryptographic integrity and an auditable lifecycle.</p>
              <ul><li>Known issuing authority</li><li>Deterministic status</li><li>Hash and signature checks</li></ul>
            </article>
          </div>
        </section>

        <section className="section flow-section" id="how-it-works">
          <div className="section-heading split">
            <div><p className="eyebrow">How verification works</p><h2>One scan. Six trust checks.</h2></div>
            <p>QRVP-1 connects the physical or digital QR mark to the resolver, API, registry and integrity layer.</p>
          </div>
          <ol className="flow-grid">
            {[
              ["01", "Scan", "A user scans a QR‑V mark or enters the QRVID."],
              ["02", "Resolve", "The identifier routes to the authorized verification endpoint."],
              ["03", "Locate", "The registry finds the canonical issuer-backed record."],
              ["04", "Validate", "Stored SHA-256 hash checks confirm integrity; Ed25519 validation is the next production gate."],
              ["05", "Evaluate", "Status, issuer authority, privacy and expiration are resolved."],
              ["06", "Return", "A clear VERIFIED, REVOKED, EXPIRED or failure result appears."],
            ].map(([n, title, text]) => <li key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </section>

        <section className="section demo-section">
          <div>
            <p className="eyebrow light">Live public verification</p>
            <h2>Verify the network’s canonical public record.</h2>
            <p>The live verifier resolves persistent registry data and displays the current issuer, lifecycle, disclosure, and integrity state.</p>
          </div>
          <VerifySearch compact />
        </section>

        <section className="section use-section">
          <div className="section-heading">
            <p className="eyebrow">Initial product layer</p>
            <h2>Verified certificates first. Every record class next.</h2>
          </div>
          <div className="use-grid">
            {[
              ["Certificates", "Diplomas, training completion, professional credentials and awards.", "Launch product"],
              ["Membership IDs", "Membership standing, organization-issued identification and access status.", "Identity"],
              ["Documents", "Agreements, notices, policies, licenses and compliance records.", "Records"],
              ["Products", "Authenticity, origin, warranty and chain-of-custody verification.", "Commerce"],
              ["Property & assets", "Registry references for accountable asset and property records.", "Assets"],
              ["Event credentials", "Tickets, credentials and time-bound participation records.", "Events"],
            ].map(([title, text, label]) => (
              <article className="use-card" key={title}><span>{label}</span><h3>{title}</h3><p>{text}</p><Link href="/use-cases">Explore use case →</Link></article>
            ))}
          </div>
        </section>

        <section className="section issuer-section">
          <div className="portal-preview">
            <div className="portal-top"><span>Issuer console</span><b>Illustrative workspace</b><i>Preview</i></div>
            <div className="metric-grid"><div><small>Active records</small><strong>1,284</strong><span>+8.4%</span></div><div><small>Verifications</small><strong>8,421</strong><span>30 days</span></div><div><small>Revoked</small><strong>12</strong><span>0.9%</span></div></div>
            <div className="portal-table">
              <div><span>QRVID</span><span>Record</span><span>Status</span></div>
              <div><b>...000001</b><span>Safety Certificate</span><i>Verified</i></div>
              <div><b>...000142</b><span>Member Credential</span><i>Verified</i></div>
              <div><b>...000889</b><span>Compliance Award</span><i className="amber">Expired</i></div>
            </div>
          </div>
          <div className="issuer-copy">
            <p className="eyebrow">Issuer operations</p>
            <h2>Issue, manage and revoke from one accountable workflow.</h2>
            <p>Approved organizations receive a controlled workspace for certificates, QR codes, records, analytics, team access, API keys and audit history.</p>
            <ul><li>Structured record issuance</li><li>Instant QRVID generation</li><li>Role-based team controls</li><li>Lifecycle and revocation management</li></ul>
            <Link className="text-link" href="/issuer">Explore issuer access <span>→</span></Link>
          </div>
        </section>

        <section className="section pricing-preview">
          <div className="section-heading split">
            <div><p className="eyebrow">Start issuing</p><h2>Plans built for pilots, teams and institutions.</h2></div>
            <Link className="button button-outline" href="/pricing">View full pricing</Link>
          </div>
          <div className="price-grid">
            <article><span>Pilot</span><strong>$0<small> / limited</small></strong><p>Validate your first workflow with a controlled issuer pilot.</p></article>
            <article className="featured-price"><em>Most selected</em><span>Starter</span><strong>$49<small> / month</small></strong><p>Issuer Portal access for up to 1,000 managed records.</p></article>
            <article><span>Professional</span><strong>$299<small> / month</small></strong><p>Team controls, API access and up to 25,000 records.</p></article>
          </div>
        </section>

        <section className="section developer-band">
          <div><p className="eyebrow light">Developer access</p><h2>Verification infrastructure with a clear contract.</h2><p>Integrate QR‑V through deterministic REST responses, documented statuses, issuer APIs and the QRVP-1 protocol model.</p></div>
          <pre><code><span>GET</span>{` https://api.qrv.network/api/v1/verify/${DEMO_ID}\n\n{\n  "status": `}<b>&quot;VERIFIED&quot;</b>{`,\n  "integrity": {\n    "hashValid": true,\n    "signatureState": "PENDING_ED25519"\n  }\n}`}</code></pre>
          <Link className="button button-light" href="/developers">Open developer portal</Link>
        </section>

        <section className="section status-band">
          <div><span className="status-ring">✓</span><div><p className="eyebrow">Network status</p><h2>Public platform and API authority are separated.</h2></div></div>
          <div className="status-services"><span>Public platform <b>qrv.network</b></span><span>API/data authority <b>api.qrv.network</b></span><span>Lifecycle gate <b>Issue → Verify → Revoke</b></span></div>
          <Link href="/status">View status →</Link>
        </section>

        <section className="section home-news">
          <div className="section-heading split">
            <div><p className="eyebrow">QR-V newsroom</p><h2>Latest from the verification network.</h2></div>
            <Link className="button button-outline" href="/news">View all 40 articles</Link>
          </div>
          <div className="news-grid news-grid-home">
            {newsPosts.slice(0, 3).map(post => (
              <article className="news-card" key={post.slug}>
                <div className="news-card-top"><span>{post.category}</span><time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time></div>
                <h3><Link href={`/news/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <div className="news-card-foot"><span>{post.author}</span><Link href={`/news/${post.slug}`}>Read <span aria-hidden="true">↗</span></Link></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section origin-section">
          <div className="origin-mark">QR‑V<sup>™</sup><span>Est. 2026</span></div>
          <div><p className="eyebrow">Founder and origin</p><h2>Built to make verification accountable.</h2><p>QR‑V™ was founded and originated by Gregory L. Jones, also known as One Gregory Onegodian™, and is commercially owned by ONEGODIAN, LLC. The platform is structured around traceable issuer authority, canonical records and public-safe verification.</p><Link className="text-link" href="/about">Read the platform record →</Link></div>
        </section>

        <section className="final-cta">
          <p className="eyebrow light">A better trust layer</p>
          <h2>Turn your next certificate into a verifiable record.</h2>
          <div><Link className="button button-light" href="/issuer">Become an Issuer</Link><Link className="button button-ghost" href="/verify">Verify a Record</Link></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
