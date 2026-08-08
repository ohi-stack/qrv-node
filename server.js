import express from "express";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

const SERVICE_NAME = process.env.SERVICE_NAME || "qrv-platform";
const VERSION = process.env.SERVICE_VERSION || "2.0.0";
const STARTED_AT = new Date().toISOString();
const ROOT_URL = process.env.QRV_PUBLIC_BASE_URL || "https://qrv.network";
const API_BASE_URL = process.env.QRV_API_BASE_URL || "https://api.qrv.network/api/v1";
const DEMO_QRVID = process.env.DEMO_QRVID || "QRV-PROD-CERT-000001";

const primaryNav = [
  ["Verify", "/verify"],
  ["Issuer", "/issuer"],
  ["Registry", "/registry"],
  ["Use Cases", "/use-cases"],
  ["Developers", "/developers"],
  ["Pricing", "/pricing"],
  ["Docs", "/docs"],
];

const pages = {
  "/protocol": ["QR-V Protocol", "QRVP-1 defines how QR-V identifiers resolve into registry-backed verification results.", ["Identifier format", "Resolution model", "Verification states", "SHA-256 + Ed25519"]],
  "/how-it-works": ["How QR-V Works", "Issue → registry → QR code → scan → API verification → deterministic result.", ["Issue record", "Generate QR", "Resolve QRVID", "Display result"]],
  "/registry": ["Registry", "Browse and inspect QR-V records through the consolidated qrv.network platform while api.qrv.network remains the only backend service.", ["Record lookup", "Issuer registry", "Certificate records", "Audit trail"]],
  "/use-cases": ["Use Cases", "QR-V supports certificates, memberships, products, documents, assets, property, financial records, and event credentials.", ["Verified Certificates", "Membership Verification", "Product Authentication", "Document Verification"]],
  "/developers": ["Developers", "Integrate directly with the versioned JSON API at api.qrv.network.", ["REST API", "Authentication", "Webhooks", "SDKs"]],
  "/docs": ["Documentation", "Protocol, standard, architecture, issuer, registry, security, and API documentation live under qrv.network/docs.", ["QRVP-1", "QVS-1.0", "API Reference", "Security"]],
  "/pricing": ["Pricing", "QR-V is sold as verification infrastructure, with certificate verification as the first commercial product.", ["Pilot", "Starter Issuer", "Professional", "Enterprise / White Label"]],
  "/network": ["Platform Architecture", "QR-V is consolidated to two production nodes: qrv.network for all user-facing experiences and api.qrv.network for all programmatic operations.", ["qrv.network", "api.qrv.network", "PostgreSQL registry", "QRVP-1 / QVS-1.0"]],
  "/security": ["Security", "QR-V uses issuer authorization, cryptographic integrity, revocation, audit logging, TLS, rate limiting, and secure defaults.", ["Issuer authorization", "Cryptographic verification", "Audit logs", "Revocation"]],
  "/about": ["About QR-V", "QR-V is the verification layer for QR codes: a registry-backed system for confirming authenticity, issuer identity, integrity, and lifecycle state.", ["Mission", "Protocol", "Network", "Commercial Platform"]],
  "/contact": ["Contact", "Talk with QR-V about certificate verification, issuer onboarding, API integrations, or enterprise deployments.", ["Issuer onboarding", "Enterprise sales", "Developer support", "Partnerships"]],
  "/terms": ["Terms of Use", "Production terms and platform conditions for QR-V services.", ["Platform terms", "Issuer terms", "Acceptable use", "Verification disclaimer"]],
  "/privacy": ["Privacy", "QR-V supports public, restricted, and private verification modes and should expose only data authorized for the selected record policy.", ["Public mode", "Restricted mode", "Private mode", "Data handling"]],
};

const issuerPages = {
  "/issuer": ["Issuer Portal", "Create and manage registry-backed QR-V records from one consolidated platform.", ["Issue Certificate", "Records", "Revocations", "Analytics"]],
  "/issuer/login": ["Issuer Login", "Authenticate to access issuer-controlled QR-V workflows.", ["Secure login", "Issuer authorization", "Session controls", "Audit logging"]],
  "/issuer/dashboard": ["Issuer Dashboard", "Monitor issuance, active records, revocations, verifications, and plan usage.", ["Issued records", "Active records", "Revoked records", "Verification volume"]],
  "/issuer/records": ["Issuer Records", "Search, view, export, and manage records owned by the authenticated issuer.", ["Search", "View", "Export", "Lifecycle controls"]],
  "/issuer/certificates": ["Verified Certificates", "Issue verifiable diplomas, training certificates, professional credentials, awards, and compliance certificates.", ["Issue certificate", "Generate QR", "Download proof", "Verify publicly"]],
  "/issuer/revocations": ["Revocation Center", "Revoke invalid credentials and preserve the lifecycle event in the audit trail.", ["Revoke", "Reason", "Timestamp", "Public result"]],
  "/issuer/analytics": ["Verification Analytics", "Review verification activity and record usage without exposing restricted verifier data.", ["Verification volume", "Top records", "Trends", "Exports"]],
  "/issuer/api-keys": ["API Keys", "Create and rotate issuer-scoped API credentials for automated issuance and verification workflows.", ["Create key", "Rotate", "Revoke", "Audit usage"]],
  "/issuer/billing": ["Billing", "Manage subscription, entitlements, usage, invoices, and enterprise services.", ["Plan", "Usage", "Invoices", "Upgrade"]],
  "/issuer/settings": ["Issuer Settings", "Manage organization identity, public issuer profile, branding, team access, and security settings.", ["Organization", "Branding", "Team", "Security"]],
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shell(title, body, description = "QR-V™ registry-backed verification infrastructure") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | QR-V™</title><meta name="description" content="${escapeHtml(description)}"><style>
  :root{--bg:#020617;--panel:#071a2f;--line:rgba(125,196,255,.22);--text:#eef6ff;--muted:#b8cee8;--blue:#38bdf8;--gold:#f6d46a;--ok:#22c55e;--bad:#ef4444;--warn:#f59e0b}*{box-sizing:border-box}body{margin:0;background:radial-gradient(900px 540px at 10% 0%,rgba(56,189,248,.18),transparent 60%),#020617;color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}.wrap{width:min(1180px,100%);margin:auto;padding:18px}.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border:1px solid var(--line);border-radius:20px;background:rgba(2,6,23,.88);backdrop-filter:blur(14px)}.brand{text-decoration:none;font-weight:950;letter-spacing:-.02em}.nav{display:flex;gap:4px;flex-wrap:wrap}.nav a,.utility a{color:var(--muted);text-decoration:none;padding:10px 11px;border-radius:12px;font-size:14px;font-weight:800}.nav a:hover,.utility a:hover{background:rgba(56,189,248,.1);color:#fff}.utility{display:flex;gap:6px}.hero{padding:72px 0 28px}.eyebrow{display:inline-block;padding:8px 12px;border:1px solid rgba(246,212,106,.3);border-radius:999px;background:rgba(246,212,106,.09);color:#ffeaa6;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.hero h1{font-size:clamp(42px,7vw,78px);line-height:1.02;letter-spacing:-.05em;margin:20px 0 14px}.hero p{max-width:860px;color:var(--muted);font-size:19px;line-height:1.7}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.btn{display:inline-flex;padding:14px 18px;border-radius:15px;text-decoration:none;font-weight:900;background:linear-gradient(180deg,#38bdf8,#2563eb)}.btn.alt{background:rgba(56,189,248,.08);border:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:26px 0}.card{padding:22px;border-radius:20px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(7,26,47,.9),rgba(2,8,23,.94))}.card h3{margin:0 0 10px}.card p{color:var(--muted);line-height:1.6}.form{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.input{flex:1 1 320px;padding:15px;border-radius:14px;border:1px solid var(--line);font-size:16px}.status{display:inline-block;padding:9px 13px;border-radius:999px;font-size:12px;font-weight:950;letter-spacing:.08em}.ok{background:rgba(34,197,94,.13);border:1px solid rgba(34,197,94,.35);color:#d8ffe2}.bad{background:rgba(239,68,68,.13);border:1px solid rgba(239,68,68,.35);color:#ffd9d9}.warn{background:rgba(245,158,11,.13);border:1px solid rgba(245,158,11,.35);color:#ffebbd}.row{display:grid;grid-template-columns:180px 1fr;gap:16px;padding:13px 0;border-top:1px solid rgba(125,196,255,.12)}.key{color:#90acd0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.value{word-break:break-word}.footer{margin-top:50px;padding:28px 0;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;color:var(--muted);font-size:14px}.footer a{color:var(--muted);text-decoration:none}@media(max-width:900px){.top{align-items:flex-start;flex-direction:column}.nav,.utility{width:100%}.grid,.footer{grid-template-columns:1fr 1fr}}@media(max-width:580px){.wrap{padding:10px}.nav{display:grid;grid-template-columns:1fr 1fr}.grid,.footer{grid-template-columns:1fr}.row{grid-template-columns:1fr}.hero{padding-top:44px}}
  </style></head><body><div class="wrap"><header class="top"><a class="brand" href="/">QR-V™ Network</a><nav class="nav">${primaryNav.map(([label,href])=>`<a href="${href}">${label}</a>`).join("")}</nav><div class="utility"><a href="/status">Status</a><a href="/issuer/login">Login</a></div></header>${body}<footer class="footer"><div><strong>Platform</strong><p><a href="/verify">Verify</a></p><p><a href="/issuer">Issuer</a></p><p><a href="/registry">Registry</a></p></div><div><strong>Technology</strong><p><a href="/protocol">QRVP-1</a></p><p><a href="/security">Security</a></p><p><a href="/network">Architecture</a></p></div><div><strong>Resources</strong><p><a href="/docs">Docs</a></p><p><a href="/developers">Developers</a></p><p><a href="/status">Status</a></p></div><div><strong>Company</strong><p><a href="/about">About</a></p><p><a href="/contact">Contact</a></p><p><a href="/privacy">Privacy</a></p></div></footer></div></body></html>`;
}

function cards(items) {
  return `<section class="grid">${items.map((item)=>`<article class="card"><h3>${escapeHtml(item)}</h3><p>Part of the consolidated QR-V production platform at qrv.network.</p></article>`).join("")}</section>`;
}

function standardPage([title, description, items]) {
  return shell(title, `<section class="hero"><span class="eyebrow">QR-V™ Global Verification Network</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><div class="actions"><a class="btn" href="/verify">Verify a Record</a><a class="btn alt" href="/issuer">Become an Issuer</a></div></section>${cards(items)}`, description);
}

function homePage() {
  return shell("Global Verification Network", `<section class="hero"><span class="eyebrow">QRVP-1 • QVS-1.0 • Production Platform</span><h1>Verify records. Confirm authenticity. Trust the issuer.</h1><p>QR-V turns QR codes into registry-backed verification references. The public platform, issuer experience, registry explorer, documentation, pricing, status, and verification interface are consolidated at <strong>qrv.network</strong>. The only separate production service is the JSON API at <strong>api.qrv.network</strong>.</p><div class="actions"><a class="btn" href="/verify">Verify a Record</a><a class="btn alt" href="/issuer">Issuer Portal</a><a class="btn alt" href="/pricing">Pricing</a></div></section>${cards(["Verified Certificates","Membership Verification","Product Authentication","Document Verification"])}<section class="card"><h3>Two-node production architecture</h3><div class="row"><div class="key">Platform Node</div><div class="value">${ROOT_URL} — all browser-facing routes</div></div><div class="row"><div class="key">API Node</div><div class="value">${API_BASE_URL.replace(/\/api\/v1$/,"")} — all JSON/API operations</div></div><div class="row"><div class="key">Registry</div><div class="value">PostgreSQL accessed by api.qrv.network only</div></div></section>`);
}

function verifyForm() {
  return shell("Verify a Record", `<section class="hero"><span class="eyebrow">Public Verification</span><h1>Verify a QR-V record.</h1><p>Enter a QRVID to resolve its canonical registry state through api.qrv.network.</p><form class="form" action="/verify" method="get"><input class="input" name="qrvid" placeholder="QRV-PROD-CERT-000001" autocomplete="off"><button class="btn" type="submit">Verify</button></form><div class="actions"><a class="btn alt" href="/verify/${encodeURIComponent(DEMO_QRVID)}">Open Live Demo</a></div></section>`);
}

async function verificationResult(qrvid) {
  const normalized = String(qrvid || "").trim().toUpperCase();
  const apiUrl = `${API_BASE_URL}/verify/${encodeURIComponent(normalized)}`;
  try {
    const response = await fetch(apiUrl, { headers: { accept: "application/json", "user-agent": "QRV-Platform/2.0" } });
    const data = await response.json().catch(() => ({}));
    const status = String(data.status || data.verificationStatus || (data.verified ? "VERIFIED" : "NOT_FOUND")).toUpperCase();
    const css = status === "VERIFIED" ? "ok" : status === "EXPIRED" ? "warn" : "bad";
    return { httpStatus: response.status, html: shell("Verification Result", `<section class="hero"><span class="status ${css}">${escapeHtml(status)}</span><h1>${status === "VERIFIED" ? "Record verified." : "Verification result."}</h1><p>The result below was resolved through the canonical QR-V API.</p></section><section class="card"><div class="row"><div class="key">QRVID</div><div class="value">${escapeHtml(data.qrvid || normalized)}</div></div><div class="row"><div class="key">Issuer</div><div class="value">${escapeHtml(data.issuer || data.issuerName || "Not provided")}</div></div><div class="row"><div class="key">Record Type</div><div class="value">${escapeHtml(data.recordType || data.type || "Not provided")}</div></div><div class="row"><div class="key">Subject</div><div class="value">${escapeHtml(data.subject || data.owner || "Not provided")}</div></div><div class="row"><div class="key">Hash</div><div class="value">${escapeHtml(data.hash || data.recordHash || "Not provided")}</div></div><div class="row"><div class="key">Verified At</div><div class="value">${escapeHtml(data.timestamp || data.checkedAt || new Date().toISOString())}</div></div></section>`) };
  } catch (_error) {
    return { httpStatus: 503, html: shell("Verification Unavailable", `<section class="hero"><span class="status bad">UNAVAILABLE</span><h1>Verification is temporarily unavailable.</h1><p>The platform could not reach the QR-V API. No verification claim has been made.</p></section>`) };
  }
}

async function registrySearch(qrvid) {
  const normalized = String(qrvid || "").trim().toUpperCase();
  const apiUrl = `${API_BASE_URL}/registry/${encodeURIComponent(normalized)}`;
  try {
    const response = await fetch(apiUrl, { headers: { accept: "application/json", "user-agent": "QRV-Platform/2.0" } });
    const data = await response.json().catch(() => ({}));
    return { httpStatus: response.status, html: shell("Registry Record", `<section class="hero"><span class="eyebrow">Registry Explorer</span><h1>${escapeHtml(normalized)}</h1><p>Canonical record data returned by api.qrv.network.</p></section><section class="card"><pre style="white-space:pre-wrap;word-break:break-word;color:#dbeafe">${escapeHtml(JSON.stringify(data,null,2))}</pre></section>`) };
  } catch (_error) {
    return { httpStatus: 503, html: shell("Registry Unavailable", `<section class="hero"><span class="status bad">UNAVAILABLE</span><h1>Registry lookup unavailable.</h1></section>`) };
  }
}

app.get("/", (_req, res) => res.type("html").send(homePage()));

for (const [path, page] of Object.entries(pages)) {
  app.get(path, (_req, res) => res.type("html").send(standardPage(page)));
}
for (const [path, page] of Object.entries(issuerPages)) {
  app.get(path, (_req, res) => res.type("html").send(standardPage(page)));
}

app.get("/verify", async (req, res) => {
  const qrvid = String(req.query.qrvid || "").trim();
  if (!qrvid) return res.type("html").send(verifyForm());
  return res.redirect(302, `/verify/${encodeURIComponent(qrvid)}`);
});
app.get("/verify/:qrvid", async (req, res) => {
  const result = await verificationResult(req.params.qrvid);
  return res.status(result.httpStatus).type("html").send(result.html);
});
app.get("/registry/:qrvid", async (req, res) => {
  const result = await registrySearch(req.params.qrvid);
  return res.status(result.httpStatus).type("html").send(result.html);
});
app.get("/explorer", (_req, res) => res.redirect(302, "/registry"));
app.get("/store", (_req, res) => res.redirect(302, "/pricing"));

app.get("/status", async (_req, res) => {
  const apiRoot = API_BASE_URL.replace(/\/api\/v1$/, "");
  let apiState = "UNKNOWN";
  let css = "warn";
  try {
    const response = await fetch(`${apiRoot}/healthz`, { headers: { accept: "application/json", "user-agent": "QRV-Platform/2.0" } });
    apiState = response.ok ? "OPERATIONAL" : `HTTP ${response.status}`;
    css = response.ok ? "ok" : "bad";
  } catch (_error) {
    apiState = "UNAVAILABLE";
    css = "bad";
  }
  return res.type("html").send(shell("Network Status", `<section class="hero"><span class="eyebrow">Network Status</span><h1>QR-V production status.</h1><p>The consolidated architecture has one public platform node and one API node.</p></section><section class="grid"><article class="card"><h3>qrv.network</h3><span class="status ok">OPERATIONAL</span><p>Public platform and all browser routes.</p></article><article class="card"><h3>api.qrv.network</h3><span class="status ${css}">${escapeHtml(apiState)}</span><p>JSON API, registry access, issuance, verification, revocation, and audit operations.</p></article></section>`));
});

app.get("/health", (_req, res) => res.json({ ok: true, service: SERVICE_NAME, status: "running", version: VERSION, architecture: "two-node", publicBaseUrl: ROOT_URL, apiBaseUrl: API_BASE_URL, startedAt: STARTED_AT, timestamp: new Date().toISOString() }));
app.get("/healthz", (_req, res) => res.json({ ok: true, service: SERVICE_NAME, status: "healthy", version: VERSION }));
app.get("/ready", (_req, res) => res.json({ ok: true, service: SERVICE_NAME, ready: true, apiBaseUrl: API_BASE_URL }));
app.get("/readyz", (_req, res) => res.json({ ok: true, service: SERVICE_NAME, ready: true, apiBaseUrl: API_BASE_URL }));
app.get("/version", (_req, res) => res.json({ service: SERVICE_NAME, version: VERSION, architecture: "two-node", startedAt: STARTED_AT }));

app.use((_req, res) => res.status(404).type("html").send(shell("Not Found", `<section class="hero"><span class="status bad">404</span><h1>Page not found.</h1><p>Return to <a href="/">qrv.network</a>.</p></section>`)));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, "0.0.0.0", () => console.log(`QR-V consolidated platform running on 0.0.0.0:${PORT}`));
