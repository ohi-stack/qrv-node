import express from "express";

const app = express();
app.use(express.json());

const SERVICE_NAME = process.env.SERVICE_NAME || "qrv-node";
const VERSION = "0.2.1";
const STARTED_AT = new Date().toISOString();
const API_BASE_URL = process.env.QRV_API_BASE_URL || "https://api.qrv.network/api/v1";

const URLS = {
  root: process.env.QRV_ROOT_URL || "https://qrv.network",
  verify: process.env.QRV_VERIFY_URL || "https://verify.qrv.network",
  issuer: process.env.QRV_ISSUER_URL || "https://issuer.qrv.network",
  registry: process.env.QRV_REGISTRY_URL || "https://registry.qrv.network",
  docs: process.env.QRV_DOCS_URL || "https://qrv.network/docs",
  developers: process.env.QRV_DEVELOPERS_URL || "https://qrv.network/developers",
  store: process.env.QRV_STORE_URL || "https://store.qrv.network",
};

const DEMO_QRVID = process.env.DEMO_QRVID || "QRV-DEMO-001";

const primaryNav = [
  { label: "QR-V Protocol", href: "/protocol" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Registry", href: "/registry" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Developers", href: "/developers" },
  { label: "About", href: "/about" },
];

const megaSections = [
  {
    title: "QR-V Protocol",
    href: "/protocol",
    columns: [
      ["What is QR-V", "Why QR Verification Matters", "QR-V vs Traditional QR"],
      ["QRVP-1 Protocol", "Registry Architecture", "Cryptographic Binding"],
      ["Verification Network", "Global Registry System", "Resolution Layer"],
      ["Anti-Tampering Design", "Identity Binding", "Threat Model"],
      ["QVS-1.0 Standard", "Timestamp Rules", "Registry Compliance"],
      ["Developer Specification", "Architecture Papers", "Whitepapers"],
    ],
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    columns: [
      ["Verification Flow", "Proof Lookup", "Registry Resolution"],
      ["Generate QR-V Code", "Anchor to Registry", "Verification Scan"],
      ["Scan a QR-V Code", "Verify Authenticity", "Check Certificate"],
      ["First QR-V Code", "API Walkthrough", "Quick Start"],
      ["Training Courses", "System Design", "Infrastructure Course"],
    ],
  },
  {
    title: "Registry",
    href: "/registry",
    columns: [
      ["Registry Portal", "Registry Overview", "Registry Nodes"],
      ["Registry Explorer", "Search by QR-V ID", "Search by Hash"],
      ["Verification Lookup", "Certificate Viewer", "Proof Viewer"],
      ["Verified QR Codes", "Issued Certificates", "Registry Anchors"],
      ["Public Verification", "Data Model", "Record Lifecycle"],
      ["System Status", "Registry Health", "API Status"],
    ],
  },
  {
    title: "Use Cases",
    href: "/use-cases",
    columns: [
      ["Secure QR Codes", "Anti-Fraud", "Tamper Detection"],
      ["Product Authentication", "Brand Protection", "Warranty Verification"],
      ["Academic Certificates", "Legal Documents", "Government Records"],
      ["Supply Chain", "Shipment Verification", "Logistics Tracking"],
      ["Digital Identity", "Membership Credentials", "Event Tickets"],
      ["Learning Center", "Protocol Engineering", "Verification Course"],
    ],
  },
  {
    title: "Developers",
    href: "/developers",
    columns: [
      ["Developer Overview", "Quick Start", "API Documentation"],
      ["Identifier Format", "Record Structure", "Verification Algorithms"],
      ["Verification API", "Registry API", "Testing Sandbox"],
      ["Web Integration", "Mobile Apps", "Identity Systems"],
      ["Code Examples", "Roadmap", "Architecture Diagrams"],
      ["Developer Portal", "Protocol Docs", "SDK Downloads"],
    ],
  },
  {
    title: "About",
    href: "/about",
    columns: [
      ["About QR-V", "Mission", "Vision"],
      ["Founder", "Development Timeline", "Innovation Background"],
      ["Creation Story", "Evolution of QR Codes", "Infrastructure Vision"],
      ["Press", "Media Kit", "Brand Assets"],
      ["Terms", "Privacy", "Security Disclosure"],
      ["Contact", "Partnerships", "Enterprise Inquiries"],
    ],
  },
];

const pages = {
  "/protocol": {
    kicker: "QR-V Protocol",
    title: "QRVP-1 turns QR codes into verifiable registry pointers.",
    body: "QR-V identifiers resolve through the network to registry-backed records with issuer metadata, status, timestamps, hashes, and verification results.",
    cards: ["Identifier format", "Verification states", "Hash + signature model", "Resolver and registry flow"],
  },
  "/how-it-works": {
    kicker: "How It Works",
    title: "Scan, resolve, verify, and display the result.",
    body: "The QR-V flow is built for clarity: a QR-V code points to a verification URL, the resolver queries the registry, and the user receives a deterministic result.",
    cards: ["Issue QR-V record", "Generate verification URL", "Scan QR code", "Display VERIFIED / REVOKED / EXPIRED / NOT_FOUND"],
  },
  "/registry": {
    kicker: "Registry",
    title: "The registry is the canonical verification datastore.",
    body: "Registry records contain QR identifiers, issuers, statuses, cryptographic references, revocation state, and audit metadata.",
    cards: ["Record database", "Issuer registry", "Certificate records", "Audit logs"],
  },
  "/use-cases": {
    kicker: "Use Cases",
    title: "QR-V supports certificates, documents, products, identities, and assets.",
    body: "The first production product is verified certificates, because it demonstrates the complete lifecycle from issuance to public verification and revocation.",
    cards: ["Verified certificates", "Membership credentials", "Product authenticity", "Document verification"],
  },
  "/developers": {
    kicker: "Developers",
    title: "Build verification workflows on top of QR-V APIs.",
    body: "Developers can integrate issuance, verification, registry queries, revocation checks, and proof display into external systems.",
    cards: ["API reference", "SDKs", "Integration guides", "Testing sandbox"],
  },
  "/about": {
    kicker: "About QR-V",
    title: "QR-V is the verification layer for QR codes.",
    body: "QR-V connects scanable QR codes to registry-anchored records so users can confirm authenticity, issuer identity, status, and record integrity.",
    cards: ["Mission", "Network vision", "Protocol history", "Founder record"],
  },
  "/docs": {
    kicker: "Documentation",
    title: "Reference documentation for QR-V protocol, registry, and API usage.",
    body: "Documentation should be citation-ready, stable, and organized by protocol, standard, architecture, verification, registry, issuers, developers, and API reference.",
    cards: ["Overview", "Protocol", "Architecture", "API Reference"],
  },
  "/pricing": {
    kicker: "Pricing",
    title: "Issuer plans for verifiable records and certificates.",
    body: "QR-V pricing should sell verification infrastructure, not ordinary QR generation. The first commercial product is the certificate verification platform.",
    cards: ["Starter Issuer", "Growth Issuer", "Professional Issuer", "Enterprise / White Label"],
  },
  "/status": {
    kicker: "Status",
    title: "QR-V network service status.",
    body: "Use this page as the production status hub until a dedicated monitoring service is deployed.",
    cards: ["API health", "Registry status", "Verification runtime", "Issuer portal"],
  },
  "/network": {
    kicker: "Network Directory",
    title: "QR-V network services and operating roles.",
    body: "qrv.network is the command hub. Service subdomains remain separated for API, registry, issuer portal, public verification, and store functions.",
    cards: ["qrv.network", "api.qrv.network", "verify.qrv.network", "issuer.qrv.network"],
  },
  "/store": {
    kicker: "Store",
    title: "QR-V commercial products and issuer packages.",
    body: "Commerce can remain on WordPress while QR-V Node handles the command hub and verification handoffs.",
    cards: ["Issuer subscriptions", "Implementation packages", "Certificate bundles", "Enterprise services"],
  },
  "/issuer": {
    kicker: "Issuer Portal",
    title: "Issue and manage registry-backed verification records.",
    body: "Authorized issuers create records, generate QR codes, manage revocation, view analytics, and access API keys through the issuer portal.",
    cards: ["Issue Certificate", "Records Manager", "Revocation Center", "Verification Analytics"],
  },
  "/verify": {
    kicker: "Verify",
    title: "Verify a QR-V record by QRVID.",
    body: "Public verification should return a clear result: VERIFIED, REVOKED, EXPIRED, or NOT_FOUND.",
    cards: ["Public verification", "Certificate lookup", "Issuer confirmation", "Proof reference"],
  },
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function navHtml() {
  return `<header class="topbar">
    <a class="brand" href="/"><span class="brand-mark">QRV</span><span>QR-V™ Network</span></a>
    <nav class="nav" aria-label="Primary navigation">
      ${primaryNav.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
    </nav>
    <div class="actions"><a class="ghost" href="/status">Status</a><a class="cta" href="/issuer">Issuer Portal</a></div>
  </header>`;
}

function footerHtml() {
  const columns = [
    ["QR-V", ["What is QR-V", "Protocol Overview", "How QR-V Works", "Verification Portal"]],
    ["Technology", ["QRVP-1 Protocol", "Registry Architecture", "Verification Network", "Hash Verification"]],
    ["Resources", ["Documentation", "Developers", "Tutorials", "Whitepapers"]],
    ["Company", ["About", "Contact", "Press", "Legal"]],
  ];
  return `<footer class="footer">${columns.map(([title, links]) => `<div><h3>${title}</h3>${links.map((link) => `<p>${link}</p>`).join("")}</div>`).join("")}</footer>`;
}

function portalShell({ title, description = "QR-V network command hub for registry-backed verification infrastructure.", body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <style>
    :root{--bg:#020617;--panel:#071a2f;--panel2:#0b2440;--line:rgba(120,195,255,.22);--text:#eef6ff;--muted:#bcd0ea;--accent:#38bdf8;--gold:#f7d56f;--ok:#22c55e;--bad:#ef4444;}
    *{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(1100px 620px at 20% 0%,rgba(56,189,248,.18),transparent 55%),linear-gradient(180deg,#04101e 0%,var(--bg) 100%);color:var(--text);min-height:100vh;}
    a{color:inherit}.page{width:min(1180px,100%);margin:0 auto;padding:22px}.topbar{position:sticky;top:0;z-index:10;backdrop-filter:blur(16px);background:rgba(2,6,23,.76);border:1px solid rgba(120,195,255,.14);border-radius:22px;padding:14px 16px;margin:14px auto;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:900}.brand-mark{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:12px;background:linear-gradient(180deg,#38bdf8,#1d4ed8);box-shadow:0 12px 32px rgba(56,189,248,.25);font-size:13px}.nav{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.nav a{padding:10px 12px;text-decoration:none;color:var(--muted);font-size:14px;font-weight:800;border-radius:12px}.nav a:hover{background:rgba(120,195,255,.1);color:var(--text)}.actions{display:flex;gap:10px;align-items:center}.ghost,.cta{padding:11px 14px;border-radius:14px;text-decoration:none;font-size:14px;font-weight:900}.ghost{border:1px solid rgba(120,195,255,.2);color:var(--muted)}.cta{background:linear-gradient(180deg,#f7d56f,#d6a737);color:#07111f}.hero{padding:80px 0 34px}.badge{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(247,213,111,.32);background:rgba(247,213,111,.12);border-radius:999px;color:#ffeaa5;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.hero h1{margin:22px 0 16px;font-size:clamp(40px,7vw,82px);line-height:1.02;letter-spacing:-.05em}.hero p,.lead{color:var(--muted);font-size:19px;line-height:1.75;max-width:840px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.button{display:inline-flex;align-items:center;justify-content:center;padding:15px 20px;border-radius:16px;text-decoration:none;font-weight:900;background:linear-gradient(180deg,#38bdf8,#2563eb);box-shadow:0 16px 36px rgba(37,99,235,.25)}.button.secondary{background:rgba(120,195,255,.1);border:1px solid rgba(120,195,255,.24);box-shadow:none;color:#d8ecff}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:30px 0}.card{border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,rgba(7,26,47,.86),rgba(2,8,23,.96));box-shadow:0 20px 50px rgba(0,0,0,.28);padding:24px}.card h2,.card h3{margin:0 0 10px}.card p,.small{color:var(--muted);line-height:1.65}.mega{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:38px 0}.mega-card{border:1px solid rgba(120,195,255,.16);border-radius:24px;padding:22px;background:rgba(7,26,47,.62)}.mega-card h2{margin:0 0 16px}.mega-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mega-cols ul{margin:0;padding-left:18px;color:var(--muted);line-height:1.7;font-size:14px}.directory{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.service{border:1px solid rgba(120,195,255,.16);border-radius:18px;padding:18px;background:rgba(120,195,255,.07);text-decoration:none}.service strong{display:block;margin-bottom:7px}.service span{color:var(--muted);font-size:13px;line-height:1.5}.form{margin-top:22px;display:flex;gap:10px;flex-wrap:wrap}.input{flex:1 1 300px;border:1px solid rgba(120,195,255,.25);border-radius:14px;padding:15px;font-size:16px}.row{border-top:1px solid rgba(120,195,255,.12);padding:14px 0;display:grid;grid-template-columns:160px 1fr;gap:14px}.k{color:#93b4da;font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:800}.v{color:#f4f9ff;word-break:break-word;line-height:1.55}.status{display:inline-block;padding:10px 14px;border-radius:999px;font-size:13px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.verified{background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.35);color:#d7ffe3}.failed{background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.35);color:#ffd7d7}.footer{border-top:1px solid rgba(120,195,255,.14);margin-top:54px;padding:34px 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}.footer h3{font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#d8ecff}.footer p{margin:7px 0;color:var(--muted);font-size:14px}@media(max-width:900px){.topbar{align-items:flex-start;flex-direction:column}.grid,.mega,.directory,.footer{grid-template-columns:1fr}.mega-cols{grid-template-columns:1fr 1fr}.actions{width:100%}.ghost,.cta{flex:1;text-align:center}.hero{padding-top:42px}}@media(max-width:560px){.page{padding:12px}.nav{display:grid;grid-template-columns:1fr 1fr;width:100%}.mega-cols{grid-template-columns:1fr}.row{grid-template-columns:1fr}}
  </style>
</head>
<body><div class="page">${navHtml()}${body}${footerHtml()}</div></body>
</html>`;
}

function homepage() {
  return portalShell({
    title: "QR-V™ Global Verification Network",
    body: `<section class="hero"><div class="badge">QR-V™ Global Verification Network</div><h1>The verification layer for QR codes.</h1><p>QR-V turns ordinary QR codes into registry-anchored verification records for certificates, credentials, documents, products, memberships, assets, and proof workflows.</p><div class="hero-actions"><a class="button" href="/verify">Verify Record</a><a class="button secondary" href="/issuer">Issue Credential</a><a class="button secondary" href="/developers">Developer Docs</a><a class="button secondary" href="/status">Network Status</a></div></section>${serviceDirectory()}${megaNavigation()}`,
  });
}

function serviceDirectory() {
  const services = [
    ["Public Verification", URLS.verify, "verify.qrv.network"],
    ["Issuer Portal", `${URLS.issuer}/login`, "issuer.qrv.network"],
    ["API Layer", `${API_BASE_URL.replace(/\/api\/v1$/, "")}/healthz`, "api.qrv.network"],
    ["Registry", URLS.registry, "registry.qrv.network"],
    ["Store", URLS.store, "store.qrv.network"],
    ["Documentation", "/docs", "qrv.network/docs"],
    ["Developers", "/developers", "qrv.network/developers"],
    ["Status", "/status", "qrv.network/status"],
  ];
  return `<section><div class="badge">Network Directory</div><div class="directory">${services.map(([title, href, subtitle]) => `<a class="service" href="${href}"><strong>${title}</strong><span>${subtitle}</span></a>`).join("")}</div></section>`;
}

function megaNavigation() {
  return `<section class="mega" aria-label="QR-V expanded navigation">${megaSections.map((section) => `<article class="mega-card"><h2><a href="${section.href}">${section.title}</a></h2><div class="mega-cols">${section.columns.map((items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`).join("")}</div></article>`).join("")}</section>`;
}

function pageContent(path) {
  const page = pages[path] || pages["/about"];
  const actions = path === "/issuer" ? `<a class="button" href="${URLS.issuer}/login">Open Issuer Login</a>` : path === "/verify" ? `<a class="button" href="${URLS.verify}/${DEMO_QRVID}">Try Demo Verification</a>` : path === "/store" ? `<a class="button" href="${URLS.store}">Open Store</a>` : `<a class="button" href="/status">View Status</a>`;
  return portalShell({
    title: `${page.kicker} | QR-V™ Network`,
    body: `<section class="hero"><div class="badge">${page.kicker}</div><h1>${page.title}</h1><p>${page.body}</p><div class="hero-actions">${actions}<a class="button secondary" href="/network">Network Directory</a></div></section><section class="grid">${page.cards.map((card) => `<article class="card"><h3>${escapeHtml(card)}</h3><p>Production content block for ${escapeHtml(page.kicker)}.</p></article>`).join("")}</section>${path === "/status" ? statusSection() : megaNavigation()}`,
  });
}

function statusSection() {
  const apiRoot = API_BASE_URL.replace(/\/api\/v1$/, "");
  return `<section class="grid"><article class="card"><h3>API Health</h3><p><a href="${apiRoot}/healthz">${apiRoot}/healthz</a></p></article><article class="card"><h3>Registry</h3><p><a href="${URLS.registry}">${URLS.registry}</a></p></article><article class="card"><h3>Verification</h3><p><a href="${URLS.verify}/${DEMO_QRVID}">${URLS.verify}/${DEMO_QRVID}</a></p></article><article class="card"><h3>Issuer</h3><p><a href="${URLS.issuer}/login">${URLS.issuer}/login</a></p></article></section>`;
}

app.get("/", (req, res) => res.type("html").send(homepage()));

for (const path of Object.keys(pages)) {
  app.get(path, (req, res) => res.type("html").send(pageContent(path)));
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, status: "running", version: VERSION, startedAt: STARTED_AT, timestamp: new Date().toISOString() });
});
app.get("/healthz", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, status: "healthy", version: VERSION, timestamp: new Date().toISOString() });
});
app.get("/ready", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, ready: true, apiBaseUrl: API_BASE_URL, timestamp: new Date().toISOString() });
});
app.get("/readyz", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, ready: true, apiBaseUrl: API_BASE_URL, timestamp: new Date().toISOString() });
});
app.get("/version", (req, res) => {
  res.json({ service: SERVICE_NAME, version: VERSION, startedAt: STARTED_AT });
});

app.get("/verify/:qrvid", async (req, res) => {
  const { qrvid } = req.params;
  res.redirect(302, `${URLS.verify}/${encodeURIComponent(qrvid)}`);
});

app.get("/:qrvid", async (req, res) => {
  const { qrvid } = req.params;
  const apiUrl = `${API_BASE_URL}/verify/${encodeURIComponent(qrvid)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const status = data.status || data.verificationState || data.verificationStatus || (data.verified ? "VERIFIED" : "UNKNOWN");
    const verified = status === "VERIFIED" || data.verified === true;

    res.status(response.ok ? 200 : response.status).type("html").send(portalShell({
      title: "QR-V™ Verification Result",
      body: `<section class="hero"><div class="status ${verified ? "verified" : "failed"}">${escapeHtml(status)}</div><h1>${verified ? "Record verified." : "Record not verified."}</h1></section><section class="card"><div class="row"><div class="k">QRVID</div><div class="v">${escapeHtml(qrvid)}</div></div><div class="row"><div class="k">Issuer</div><div class="v">${escapeHtml(data.issuer || data.issuerName || "Not provided")}</div></div><div class="row"><div class="k">Record Type</div><div class="v">${escapeHtml(data.recordType || data.type || "Not provided")}</div></div><div class="row"><div class="k">Hash</div><div class="v">${escapeHtml(data.hash || data.recordHash || "Not provided")}</div></div><div class="row"><div class="k">API Result</div><div class="v"><a href="${escapeHtml(apiUrl)}">${escapeHtml(apiUrl)}</a></div></div></section>`
    }));
  } catch (error) {
    res.status(500).type("html").send(portalShell({
      title: "QR-V™ Verification Error",
      body: `<section class="hero"><div class="status failed">ERROR</div><h1>Verification unavailable.</h1><p>The verification portal could not resolve this record.</p></section><section class="card"><div class="row"><div class="k">QRVID</div><div class="v">${escapeHtml(qrvid)}</div></div><div class="row"><div class="k">Error</div><div class="v">${escapeHtml(error.message)}</div></div></section>`
    }));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`QR-V Node running on port ${PORT}`);
});
