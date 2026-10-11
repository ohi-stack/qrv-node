import http from 'http';

const PORT = Number(process.env.PORT || 3000);
const APP_BASE_URL = cleanUrl(process.env.APP_BASE_URL || process.env.VITE_APP_BASE_URL || 'https://qrv.network');
const API_BASE_URL = cleanUrl(process.env.API_BASE_URL || process.env.VITE_QRV_API_BASE_URL || 'https://api.qrv.network/api/v1');
const VERIFY_BASE_URL = cleanUrl(process.env.VERIFY_BASE_URL || process.env.VITE_QRV_VERIFY_BASE_URL || `${APP_BASE_URL}/verify`);
const ISSUER_BASE_URL = cleanUrl(process.env.ISSUER_BASE_URL || process.env.VITE_QRV_ISSUER_BASE_URL || `${APP_BASE_URL}/issuer`);
const REGISTRY_BASE_URL = cleanUrl(process.env.REGISTRY_BASE_URL || process.env.VITE_QRV_REGISTRY_BASE_URL || `${APP_BASE_URL}/registry`);
const DOCS_BASE_URL = cleanUrl(process.env.DOCS_BASE_URL || process.env.VITE_QRV_DOCS_BASE_URL || `${APP_BASE_URL}/docs`);
const DEVELOPERS_BASE_URL = cleanUrl(process.env.DEVELOPERS_BASE_URL || process.env.VITE_QRV_DEVELOPERS_BASE_URL || `${APP_BASE_URL}/developers`);
const STATUS_BASE_URL = cleanUrl(process.env.STATUS_BASE_URL || process.env.VITE_QRV_STATUS_BASE_URL || `${APP_BASE_URL}/status`);
const STORE_BASE_URL = cleanUrl(process.env.STORE_BASE_URL || process.env.VITE_QRV_STORE_BASE_URL || `${APP_BASE_URL}/store`);
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'research@quantumohi.com';
const VERSION = process.env.APP_VERSION || '1.4.1';
const STARTED_AT = new Date().toISOString();

function cleanUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const mainNav = [
  ['QR-V Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['About', '/about']
];

const utilityNav = [
  ['Verify', VERIFY_BASE_URL],
  ['Issuer Portal', ISSUER_BASE_URL],
  ['Pricing', `${APP_BASE_URL}/pricing`],
  ['Status', STATUS_BASE_URL]
];

const pageData = {
  '/protocol': {
    title: 'QR-V™ Protocol',
    summary: 'QRVP-1 defines the QR-V identifier, resolution, verification, registry, and response layers.',
    cards: [
      ['Identifier', 'QRV://registry/type/objectID and the canonical HTTPS gateway at qrv.network/verify/{QRVID}.'],
      ['Verification', 'Resolve a QRVID, query the canonical registry through the API, validate integrity and lifecycle state, then return a deterministic result.'],
      ['Security', 'SHA-256 integrity, issuer authorization, revocation, auditability, and Ed25519 signing when the production signing gate is active.']
    ]
  },
  '/how-it-works': {
    title: 'How QR-V™ Works',
    summary: 'QR-V turns a QR scan into a registry-backed verification decision.',
    cards: [
      ['1. Issue', 'An authorized issuer creates a record through qrv.network/issuer.'],
      ['2. Register', 'api.qrv.network persists the canonical record and integrity metadata.'],
      ['3. Verify', 'A scan opens qrv.network/verify/{QRVID}, which calls the API and displays VERIFIED, REVOKED, EXPIRED, or NOT_FOUND.']
    ]
  },
  '/verification': {
    title: 'QR-V™ Verification',
    summary: 'Public verification is a human-facing qrv.network route backed by the trusted API node.',
    cards: [
      ['Canonical URL', 'https://qrv.network/verify/{QRVID}'],
      ['API', 'https://api.qrv.network/api/v1/verify/{QRVID}'],
      ['States', 'VERIFIED, REVOKED, EXPIRED, NOT_FOUND, and fail-closed unavailable/integrity states.']
    ]
  },
  '/registry': {
    title: 'QR-V™ Registry',
    summary: 'The registry UI lives at qrv.network/registry; the writable canonical datastore remains private behind api.qrv.network.',
    cards: [
      ['Records', 'QR objects, certificates, issuer records, hashes, lifecycle status, and timestamps.'],
      ['Authority', 'Only the API node receives production database credentials and performs registry mutations.'],
      ['Auditability', 'Issuance, verification, revocation, and administrative operations are recorded for traceability.']
    ]
  },
  '/issuers': {
    title: 'QR-V™ Issuers',
    summary: 'The Issuer Portal is the commercial control surface for creating and managing verifiable records.',
    cards: [
      ['Issue Records', 'Create certificate and credential records through qrv.network/issuer.'],
      ['Generate QR', 'New QR codes encode qrv.network/verify/{QRVID}.'],
      ['Manage Lifecycle', 'Authorized issuers can revoke or expire records while preserving the canonical verification URL.']
    ]
  },
  '/use-cases': {
    title: 'QR-V™ Use Cases',
    summary: 'QR-V supports verification-critical workflows across physical and digital records.',
    cards: [
      ['Certificates', 'Diplomas, training certificates, professional credentials, awards, and compliance records.'],
      ['Identity & Membership', 'Membership credentials and identity-related records with issuer and lifecycle status.'],
      ['Products, Documents & Assets', 'Product authentication, document integrity, asset registration, property records, and financial record references.']
    ]
  },
  '/developers': {
    title: 'QR-V™ Developers',
    summary: 'Integrate with the canonical API while keeping browser-facing workflows on qrv.network.',
    cards: [
      ['API Base', 'https://api.qrv.network/api/v1'],
      ['Verify', 'GET /verify/{qrvid}'],
      ['Lifecycle', 'Protected create, record lookup, revocation, issuer, and audit operations are owned by the API node.']
    ]
  },
  '/docs': {
    title: 'QR-V™ Documentation',
    summary: 'Protocol, standards, architecture, verification, registry, issuer, API, security, and operational documentation.',
    cards: [
      ['Protocol', 'QRVP-1 protocol definitions and lifecycle behavior.'],
      ['Standard', 'QVS-1.0 verification rules and deterministic status behavior.'],
      ['Implementation', 'Two-node deployment, issuer workflows, API contracts, security, and operations.']
    ]
  },
  '/pricing': {
    title: 'QR-V™ Pricing',
    summary: 'Commercial plans center on issuer onboarding, verified certificates, API access, and enterprise implementation.',
    cards: [
      ['Starter', 'Issuer access and production record issuance for smaller organizations.'],
      ['Professional', 'Higher record volume, revocation controls, analytics, and API access.'],
      ['Enterprise', 'Custom onboarding, integrations, white-label verification, and high-volume operations.']
    ]
  },
  '/status': {
    title: 'QR-V™ Network Status',
    summary: 'Production Architecture v1.0 has only two active runtime boundaries.',
    cards: [
      ['qrv.network', 'Public platform: verification UI, issuer workspace, registry/explorer UI, docs, developers, pricing, store, and status.'],
      ['api.qrv.network', 'Trusted backend: API, persistence, verification logic, lifecycle mutations, audit, cryptography, and privileged integrations.'],
      ['Legacy hostnames', 'Historical QR-V subdomains are compatibility aliases only and must not become independent production applications.']
    ]
  },
  '/support': {
    title: 'QR-V™ Support',
    summary: 'Support for verification questions, issuer onboarding, integrations, and record issues.',
    cards: [
      ['Verification Help', `Contact ${SUPPORT_EMAIL} for verification-result questions.`],
      ['Issuer Onboarding', 'Request issuer setup, pilot access, pricing, or implementation support.'],
      ['Developer Support', 'Use the developer and API documentation for integration questions.']
    ]
  },
  '/legal': {
    title: 'QR-V™ Legal Notices',
    summary: 'QR-V reports registry-backed issuer, integrity, and lifecycle information; it does not itself create legal authority that the issuer does not possess.',
    cards: [
      ['Verification Scope', 'QR-V verifies the registry record and permitted metadata returned by the system.'],
      ['Issuer Responsibility', 'Issuers remain responsible for the truth, authorization, accuracy, and lawful use of submitted records.'],
      ['No Legal Opinion', 'A QR-V result is not legal advice, title insurance, a court filing, or governmental certification.']
    ]
  },
  '/about': {
    title: 'About QR-V™',
    summary: 'QR-V is registry-backed verification infrastructure designed to make QR-linked claims independently verifiable.',
    cards: [
      ['Protocol', 'QRVP-1 defines the verification protocol architecture.'],
      ['Standard', 'QVS-1.0 defines the operating verification standard.'],
      ['Network', 'qrv.network is the human platform; api.qrv.network is the trusted machine/data boundary.']
    ]
  }
};

function styles() {
  return `:root{--bg:#050914;--panel:#101936;--line:#2c3f74;--gold:#f2d06b;--cyan:#55c7ff;--text:#edf3ff;--muted:#b7c5e6;--green:#22c55e}*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:radial-gradient(circle at top,#173c78 0,#081124 48%,#03060e 100%);color:var(--text)}a{color:inherit}.wrap{max-width:1180px;margin:0 auto;padding:28px 20px}.notice{background:#07112a;border:1px solid var(--line);border-radius:14px;padding:10px 14px;color:var(--muted);font-size:13px;margin-bottom:18px}.nav{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}.brand{font-weight:950;letter-spacing:.08em}.mainnav,.utilnav{display:flex;flex-wrap:wrap;gap:12px;justify-content:flex-end}.mainnav a,.utilnav a{text-decoration:none;font-size:14px;font-weight:850}.utilnav{margin-top:10px}.utilnav a{border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:7px 10px}.hero{padding:70px 0 34px}.eyebrow{color:var(--gold);font-weight:900;text-transform:uppercase;letter-spacing:.16em;font-size:13px}h1{font-size:clamp(42px,7vw,78px);line-height:1;margin:12px 0;letter-spacing:-.05em}h2{font-size:clamp(28px,4vw,44px)}h3{margin:0 0 8px}p,li{font-size:18px;line-height:1.6;color:var(--muted)}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.btn{display:inline-block;border-radius:999px;padding:13px 19px;text-decoration:none;font-weight:900;background:var(--gold);color:#081124}.btn.alt{background:transparent;color:#fff;border:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0 42px}.card{background:rgba(16,25,54,.9);border:1px solid var(--line);border-radius:22px;padding:22px}.flow{font-family:ui-monospace,Menlo,monospace;background:#07112a;border:1px solid var(--line);border-radius:18px;padding:18px;color:#fff;line-height:1.8}.footer{border-top:1px solid var(--line);margin-top:44px;padding:28px 0;color:#9fb2d8;font-size:14px}@media(max-width:850px){.grid{grid-template-columns:1fr}.nav{flex-direction:column}.mainnav,.utilnav{justify-content:flex-start}}`;
}

function navHtml(items) {
  return items.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('');
}

function shell(title, description, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><style>${styles()}</style></head><body><div class="wrap"><div class="notice">Source preview only. Production runtime: qrv.network → ohi-stack/qrv-node; api.qrv.network → ohi-stack/qrv-api.</div><nav class="nav"><div class="brand"><a href="${APP_BASE_URL}" style="text-decoration:none">QR-V™</a></div><div><div class="mainnav">${navHtml(mainNav)}</div><div class="utilnav">${navHtml(utilityNav)}</div></div></nav>${body}<footer class="footer">© 2026 QR-V™ — Global QR Verification Network • QRVP-1 • QVS-1.0 • Source version ${escapeHtml(VERSION)}</footer></div></body></html>`;
}

function cards(items) {
  return items.map(([title, text]) => `<article class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('');
}

function homeHtml() {
  return shell(
    'QR-V™ Global Verification Network',
    'Registry-backed QR verification infrastructure.',
    `<main class="hero"><div class="eyebrow">QR-V™ • Global Verification Network</div><h1>Verify records through one trusted QR-V platform.</h1><p>Human-facing verification, issuer, registry, documentation, pricing, and status workflows live under <strong>qrv.network</strong>. Privileged persistence and machine operations live behind <strong>api.qrv.network</strong>.</p><div class="actions"><a class="btn" href="${VERIFY_BASE_URL}">Verify Record</a><a class="btn alt" href="${ISSUER_BASE_URL}">Issuer Portal</a><a class="btn alt" href="${DOCS_BASE_URL}">Documentation</a></div></main><section class="grid"><article class="card"><h3>Public Platform</h3><p>qrv.network owns every human-facing route.</p></article><article class="card"><h3>Trusted Backend</h3><p>api.qrv.network owns the API, registry authority, lifecycle mutation, cryptography, and audit operations.</p></article><article class="card"><h3>Canonical QR</h3><p>New codes resolve to qrv.network/verify/{QRVID}.</p></article></section><section class="card"><h2>Verification flow</h2><p class="flow">QR scan → qrv.network/verify/{QRVID} → api.qrv.network/api/v1/verify/{QRVID} → canonical registry → deterministic result</p></section>`
  );
}

function pageHtml(path) {
  const page = pageData[path] || pageData['/about'];
  return shell(
    page.title,
    page.summary,
    `<main class="hero"><div class="eyebrow">QR-V™ • Production Architecture v1.0</div><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.summary)}</p><div class="actions"><a class="btn" href="${VERIFY_BASE_URL}">Verify</a><a class="btn alt" href="${ISSUER_BASE_URL}">Issuer</a><a class="btn alt" href="${STATUS_BASE_URL}">Status</a></div></main><section class="grid">${cards(page.cards)}</section>`
  );
}

function sendJson(res, payload, statusCode = 200) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function healthPayload() {
  return {
    status: 'ok',
    service: 'qrv-marketing-source-preview',
    sourceOnly: true,
    version: VERSION,
    startedAt: STARTED_AT,
    production: {
      platform: 'https://qrv.network',
      api: 'https://api.qrv.network/api/v1'
    },
    endpoints: {
      verify: VERIFY_BASE_URL,
      issuer: ISSUER_BASE_URL,
      registry: REGISTRY_BASE_URL,
      docs: DOCS_BASE_URL,
      developers: DEVELOPERS_BASE_URL,
      status: STATUS_BASE_URL,
      store: STORE_BASE_URL,
      api: API_BASE_URL
    }
  };
}

const server = http.createServer((req, res) => {
  const path = new URL(req.url || '/', APP_BASE_URL).pathname.replace(/\/$/, '') || '/';

  if (path === '/health' || path === '/healthz' || path === '/health.json') {
    return sendJson(res, healthPayload());
  }

  if (path === '/ready' || path === '/readyz' || path === '/ready.json') {
    return sendJson(res, {
      ready: true,
      sourceOnly: true,
      service: 'qrv-marketing-source-preview',
      version: VERSION
    });
  }

  if (path === '/version') {
    return sendJson(res, {
      service: 'qrv-marketing-source-preview',
      version: VERSION,
      sourceOnly: true,
      productionPlatform: APP_BASE_URL,
      productionApi: API_BASE_URL
    });
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  if (path === '/') return res.end(homeHtml());
  if (pageData[path]) return res.end(pageHtml(path));
  return res.end(pageHtml('/about'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`QR-V marketing source preview running on ${PORT}`);
});
