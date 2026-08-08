import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import QRCode from 'qrcode';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT || 3000);
const VERSION = process.env.APP_VERSION || '1.0.0';
const SERVICE = 'qrv-platform';
const APP_ORIGIN = (process.env.QRV_PLATFORM_ORIGIN || 'https://qrv.network').replace(/\/$/, '');
const API_BASE_URL = (process.env.QRV_API_BASE_URL || 'https://api.qrv.network/api/v1').replace(/\/$/, '');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, '');
const API_WRITE_KEY = process.env.QRV_PLATFORM_API_KEY || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const ISSUER_ACCESS_CODE = process.env.ISSUER_ACCESS_CODE || '';
const SESSION_COOKIE = 'qrv_issuer_session';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 12 * 60 * 60 * 1000);
const STARTED_AT = new Date().toISOString();

const requestLimiter = rateLimit({ windowMs: 60_000, max: 240, standardHeaders: true, legacyHeaders: false });
app.use(requestLimiter);

const legacyHostRoutes = {
  'verify.qrv.network': '/verify',
  'issuer.qrv.network': '/issuer',
  'registry.qrv.network': '/registry',
  'explorer.qrv.network': '/explorer',
  'docs.qrv.network': '/docs',
  'developers.qrv.network': '/developers',
  'status.qrv.network': '/status',
  'store.qrv.network': '/store'
};

app.use((req, res, next) => {
  const host = String(req.hostname || '').toLowerCase();
  if (host === 'www.qrv.network') return res.redirect(308, `${APP_ORIGIN}${req.originalUrl}`);
  const prefix = legacyHostRoutes[host];
  if (!prefix) return next();
  const suffix = req.originalUrl === '/' ? '' : req.originalUrl;
  return res.redirect(308, `${APP_ORIGIN}${prefix}${suffix}`);
});

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseCookies(req) {
  const cookies = {};
  const raw = String(req.headers.cookie || '');
  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (!key) continue;
    cookies[key] = decodeURIComponent(rest.join('='));
  }
  return cookies;
}

function sign(value) {
  if (!SESSION_SECRET) return '';
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'issuer', exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function validSession(req) {
  if (!SESSION_SECRET) return false;
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  const a = Buffer.from(signature || '');
  const b = Buffer.from(expected || '');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.role === 'issuer' && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

function requireIssuer(req, res, next) {
  if (validSession(req)) return next();
  return res.redirect(303, '/issuer');
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

async function api(path, options = {}) {
  const headers = { accept: 'application/json', ...(options.headers || {}) };
  if (options.write) {
    if (!API_WRITE_KEY) throw new Error('QRV_PLATFORM_API_KEY is not configured');
    headers['x-api-key'] = API_WRITE_KEY;
  }
  if (options.body && !headers['content-type']) headers['content-type'] = 'application/json';
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function apiRoot(path, options = {}) {
  const headers = { accept: 'application/json', ...(options.headers || {}) };
  const response = await fetch(`${API_ORIGIN}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

const primaryNav = [
  ['Protocol', '/protocol'],
  ['How It Works', '/how-it-works'],
  ['Verify', '/verify'],
  ['Registry', '/registry'],
  ['Use Cases', '/use-cases'],
  ['Developers', '/developers'],
  ['Pricing', '/pricing'],
  ['About', '/about']
];

function styles() {
  return `:root{--bg:#030712;--panel:#081426;--panel2:#0d1f37;--line:rgba(96,165,250,.2);--text:#f5f9ff;--muted:#b7c7e2;--blue:#38bdf8;--gold:#f2d06b;--green:#22c55e;--red:#ef4444;--amber:#f59e0b}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(circle at 15% 0,#173d77 0,transparent 35%),linear-gradient(180deg,#06101e,#020617 65%);color:var(--text);min-height:100vh}a{color:inherit}.wrap{max-width:1180px;margin:auto;padding:22px}.topbar{position:sticky;top:10px;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:14px 16px;border:1px solid var(--line);border-radius:20px;background:rgba(3,7,18,.82);backdrop-filter:blur(14px)}.brand{text-decoration:none;font-weight:950;letter-spacing:.05em}.nav{display:flex;gap:4px;flex-wrap:wrap}.nav a{padding:9px 10px;text-decoration:none;color:var(--muted);font-size:14px;font-weight:800;border-radius:10px}.nav a:hover{background:rgba(56,189,248,.08);color:#fff}.hero{padding:74px 0 34px}.eyebrow{display:inline-block;color:var(--gold);font-size:12px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}.hero h1,.section h1{font-size:clamp(40px,7vw,78px);line-height:1.02;letter-spacing:-.05em;margin:14px 0}.section h1{font-size:clamp(34px,5vw,58px)}h2{margin:0 0 10px}.lead,p,li{color:var(--muted);font-size:18px;line-height:1.65}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn,button{display:inline-flex;justify-content:center;align-items:center;padding:13px 18px;border-radius:999px;border:0;background:var(--gold);color:#07111f;font-weight:900;text-decoration:none;cursor:pointer}.btn.alt{background:transparent;color:#fff;border:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:24px 0}.card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(8,20,38,.94),rgba(3,9,22,.95));border-radius:22px;padding:22px;box-shadow:0 18px 44px rgba(0,0,0,.24)}.status{display:inline-block;padding:7px 10px;border-radius:999px;font-weight:900;font-size:13px}.VERIFIED{color:#dcffe8;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.3)}.REVOKED{color:#ffe2e2;background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.3)}.EXPIRED{color:#fff0cf;background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.3)}.NOT_FOUND,.UNAVAILABLE{color:#ffe2e2;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.24)}form.stack{display:grid;gap:13px}label{font-weight:800;color:#dce9ff}input,select,textarea{width:100%;padding:13px 14px;border-radius:13px;border:1px solid #36507d;background:#071426;color:#fff;font-size:16px}textarea{min-height:110px}.table{width:100%;border-collapse:collapse}.table th,.table td{text-align:left;padding:12px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top}.table th{color:#dce9ff}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all}.notice{padding:14px;border:1px solid var(--line);border-radius:14px;background:rgba(56,189,248,.07);color:var(--muted)}.footer{margin-top:54px;padding:28px 0;border-top:1px solid var(--line);color:#91a9cc;font-size:14px}.footgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.footgrid a{display:block;color:#bfd0eb;text-decoration:none;margin:6px 0}.small{font-size:14px}.danger{background:#dc2626;color:#fff}.ok{color:#bbf7d0}.bad{color:#fecaca}@media(max-width:850px){.topbar{align-items:flex-start;flex-direction:column}.grid,.footgrid{grid-template-columns:1fr}.table{font-size:14px;display:block;overflow-x:auto}}`;
}

function shell(title, description, body) {
  const nav = primaryNav.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><style>${styles()}</style></head><body><div class="wrap"><header class="topbar"><a class="brand" href="/">QR-V™ NETWORK</a><nav class="nav">${nav}<a href="/issuer">Issuer</a><a href="/status">Status</a></nav></header>${body}<footer class="footer"><div class="footgrid"><div><strong>QR-V</strong><a href="/verify">Verify</a><a href="/registry">Registry</a><a href="/issuer">Issuer Portal</a></div><div><strong>Technology</strong><a href="/protocol">QRVP-1</a><a href="/standards">QVS-1.0</a><a href="/security">Security</a></div><div><strong>Resources</strong><a href="/docs">Docs</a><a href="/developers">Developers</a><a href="/api-reference">API Reference</a></div><div><strong>Commercial</strong><a href="/pricing">Pricing</a><a href="/store">Store</a><a href="/enterprise">Enterprise</a></div></div><p class="small">QR-V™ Global Verification Network • QRVP-1 • QVS-1.0 • Platform ${VERSION}</p></footer></div></body></html>`;
}

function page({ eyebrow, title, lead, cards = [], actions = [] }) {
  return shell(title, lead, `<main><section class="hero"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(lead)}</p><div class="actions">${actions.map(([label, href, alt]) => `<a class="btn${alt ? ' alt' : ''}" href="${href}">${escapeHtml(label)}</a>`).join('')}</div></section><section class="grid">${cards.map(([heading, text, href]) => `<article class="card"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p>${href ? `<a href="${href}">Open →</a>` : ''}</article>`).join('')}</section></main>`);
}

const contentPages = {
  '/protocol': ['QR-V Protocol', 'QRVP-1 verification infrastructure', 'QRVP-1 defines identifier encoding, resolution, registry lookup, validation, revocation, privacy modes, and verification responses.', [['Identifier Layer','QR-V identifiers are stable pointers to canonical records.'],['Resolution','HTTPS gateways resolve identifiers through the network.'],['Validation','Registry state, SHA-256 integrity references, issuer authorization, and revocation controls drive verification.']]],
  '/how-it-works': ['How It Works', 'Issue → scan → verify', 'An issuer creates a record, the platform generates a QRVID and verification URL, the API stores the canonical record, and a scan returns a deterministic verification state.', [['Issue','Create a registry-backed record.'],['Scan','QR codes use qrv.network/verify/{QRVID}.'],['Verify','The API returns VERIFIED, REVOKED, EXPIRED, or NOT_FOUND.']]],
  '/use-cases': ['Use Cases', 'Verification for high-trust records', 'QR-V supports certificates, memberships, products, documents, assets, property records, tickets, and other workflows where authenticity matters.', [['Certificates','Training credentials, diplomas, awards, licenses.','/certificate-verification'],['Membership','Association and membership credentials.'],['Products','Brand protection and authenticity records.']]],
  '/about': ['About QR-V', 'The verification layer for QR codes', 'QR-V transforms ordinary QR links into registry-backed verification references that expose issuer identity, status, integrity references, and lifecycle state.', [['Protocol','QRVP-1 defines the verification protocol.'],['Standard','QVS-1.0 defines operational verification rules.'],['Network','qrv.network is the canonical public platform namespace.']]],
  '/standards': ['Standards', 'QVS-1.0', 'QVS-1.0 defines the deterministic registry-backed verification model for QR-V records.', [['Authenticity','Confirm the canonical record exists.'],['Issuer','Confirm which issuer created the record.'],['Lifecycle','Expose verified, revoked, expired, and not-found states.']]],
  '/security': ['Security', 'Secure verification by default', 'The consolidated platform uses a public application node and a separate API/data node. Database credentials remain on the API node; issuer writes fail closed without configured authorization.', [['Transport','HTTPS is required in production.'],['Authorization','Issuer writes require platform authorization.'],['Audit','Create, verify, and revoke events are written to the registry audit log.']]],
  '/developers': ['Developers', 'Build on the QR-V API', 'Integrate verification and issuer workflows through api.qrv.network while sending human users to qrv.network routes.', [['Verify API','GET /api/v1/verify/:qrvid','/api-reference'],['Create Record','POST /api/v1/records','/api-reference'],['Revoke Record','POST /api/v1/records/:qrvid/revoke','/api-reference']]],
  '/pricing': ['Pricing', 'Verification infrastructure for issuers', 'Start with paid implementation and recurring issuer plans. Pricing should reflect fraud reduction, public verification, lifecycle controls, and auditability rather than QR image generation.', [['Founding Pilot','$1,500 implementation pilot for early issuers.'],['Professional','$5,000 setup + recurring issuer service.'],['Enterprise','White-label, API, bulk import, policy controls, and implementation support.']]],
  '/store': ['Store', 'QR-V products and services', 'The consolidated store lives on qrv.network. Launch packages can be connected to the final payment processor without introducing another public application node.', [['Founding Issuer Pilot','Early-access implementation and onboarding.'],['Certificate Launch','Certificate verification implementation package.'],['Enterprise','White-label and integration engagement.']]],
  '/enterprise': ['Enterprise', 'Deploy QR-V into institutional workflows', 'Enterprise packages combine issuer onboarding, record import, verification UX, API integration, audit reporting, and optional white-label deployment.', [['Education','Credential verification.'],['Associations','Membership verification.'],['Products','Product authenticity and brand protection.']]],
  '/certificate-verification': ['Certificates', 'Issue verifiable certificates', 'Verified Certificates are the first commercial QR-V product because they exercise the complete lifecycle from issuance to public verification and revocation.', [['Issue','Create certificate records from the Issuer Portal.','/issuer'],['Verify','Anyone can verify a QRVID.','/verify'],['Revoke','Issuer controls invalidate credentials when necessary.','/issuer']]],
  '/docs': ['Documentation', 'QR-V reference documentation', 'Protocol, standard, architecture, verification, registry, issuer, developer, security, and API documentation now live under one public namespace.', [['Overview','Core QR-V concepts.','/docs/overview'],['Protocol','QRVP-1 implementation model.','/docs/protocol'],['API','Machine-facing API contract.','/api-reference']]],
  '/docs/overview': ['Docs • Overview', 'System overview', 'QR-V uses a public platform node at qrv.network and a canonical API/data node at api.qrv.network.'],
  '/docs/protocol': ['Docs • Protocol', 'QRVP-1', 'QRVP-1 supports HTTPS gateway identifiers, so canonical verification URLs can resolve through qrv.network/verify/{QRVID}.'],
  '/docs/verification': ['Docs • Verification', 'Deterministic verification', 'Public verification states are VERIFIED, REVOKED, EXPIRED, and NOT_FOUND.'],
  '/docs/registry': ['Docs • Registry', 'Canonical data layer', 'The registry datastore is private infrastructure behind api.qrv.network and is not a separate public application.'],
  '/docs/issuers': ['Docs • Issuers', 'Issuer operations', 'Issuers create records, generate QR links, manage records, revoke credentials, and inspect activity through qrv.network/issuer.'],
  '/docs/developers': ['Docs • Developers', 'Integration model', 'External systems call api.qrv.network; human-facing workflows use qrv.network.'],
  '/docs/api-reference': ['Docs • API', 'API reference', 'The canonical API base is https://api.qrv.network/api/v1.']
};

app.get('/', (_req, res) => res.send(page({ eyebrow: 'QR-V™ Global Verification Network', title: 'Verify records before relying on them.', lead: 'QR-V™ turns QR codes into registry-backed verification references. The production network is consolidated into one public platform at qrv.network and one backend API at api.qrv.network.', actions: [['Verify a Record','/verify'],['Become an Issuer','/issuer',true]], cards: [['Verified Certificates','Issue credentials with public scan validation.','/certificate-verification'],['Issuer Portal','Create, inspect, and revoke QR-V records.','/issuer'],['Developer API','Integrate QR-V into external systems.','/developers']] })));

for (const [path, data] of Object.entries(contentPages)) {
  app.get(path, (_req, res) => {
    const [eyebrow, title, lead, cards = []] = data;
    res.send(page({ eyebrow, title, lead, cards }));
  });
}

app.get('/verify', (_req, res) => {
  res.send(shell('Verify a QR-V Record', 'Public QR-V verification', `<main class="section"><div class="eyebrow">Public Verification</div><h1>Verify a QR-V record</h1><p class="lead">Enter a QRVID. The platform queries the canonical API and returns the registry state.</p><section class="card"><form class="stack" onsubmit="event.preventDefault();const v=document.getElementById('qrvid').value.trim();if(v)location.href='/verify/'+encodeURIComponent(v)"><label for="qrvid">QRVID</label><input id="qrvid" required placeholder="QRV-CERT-..."><button type="submit">Verify</button></form></section></main>`));
});

app.get('/verify/:qrvid', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/verify/${encodeURIComponent(qrvid)}`);
    const state = String(payload.state || payload.status || (response.status === 404 ? 'NOT_FOUND' : 'UNAVAILABLE')).toUpperCase();
    const record = payload.record || payload;
    const fields = [
      ['QRVID', qrvid], ['Issuer', record.issuer], ['Record Type', record.recordType], ['Recipient / Owner', record.recipient || record.owner],
      ['Title', record.title], ['Issued', record.issueDate || record.createdAt], ['Expires', record.expirationDate], ['Hash', record.hash], ['Verified At', payload.verifiedAt || new Date().toISOString()]
    ].filter(([,value]) => value !== null && value !== undefined && value !== '');
    res.status(response.status === 404 ? 404 : 200).send(shell(`QR-V ${state} • ${qrvid}`, `QR-V verification result ${state}`, `<main class="section"><div class="eyebrow">Verification Result</div><h1>${state === 'VERIFIED' ? 'Verified QR-V™ Record' : 'QR-V™ Verification Result'}</h1><p><span class="status ${escapeHtml(state)}">${escapeHtml(state)}</span></p><section class="card"><table class="table">${fields.map(([k,v]) => `<tr><th>${escapeHtml(k)}</th><td class="${k === 'QRVID' || k === 'Hash' ? 'mono' : ''}">${escapeHtml(v)}</td></tr>`).join('')}</table></section><div class="actions"><a class="btn" href="/verify">Verify Another</a><a class="btn alt" href="/registry/${encodeURIComponent(qrvid)}">Registry View</a></div></main>`));
  } catch (error) {
    res.status(503).send(shell('Verification unavailable', 'Verification service unavailable', `<main class="section"><div class="eyebrow">Verification</div><h1>Verification temporarily unavailable</h1><p class="lead">The platform could not reach the canonical API. No verification result was asserted.</p><div class="notice">${escapeHtml(error.message)}</div></main>`));
  }
});

app.get('/registry', (_req, res) => {
  res.send(shell('QR-V Registry', 'Public registry lookup', `<main class="section"><div class="eyebrow">Registry</div><h1>Public registry lookup</h1><p class="lead">The canonical datastore remains behind api.qrv.network. This page is the human-readable registry interface.</p><section class="card"><form class="stack" onsubmit="event.preventDefault();const v=document.getElementById('registryQrvid').value.trim();if(v)location.href='/registry/'+encodeURIComponent(v)"><label for="registryQrvid">QRVID</label><input id="registryQrvid" required placeholder="QRV-CERT-..."><button type="submit">Open Record</button></form></section></main>`));
});
app.get('/explorer', (_req, res) => res.redirect(308, '/registry'));
app.get('/explorer/:qrvid', (req, res) => res.redirect(308, `/registry/${encodeURIComponent(req.params.qrvid)}`));
app.get('/registry/:qrvid', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}`);
    if (!response.ok) return res.status(response.status).send(page({ eyebrow: 'Registry', title: 'Record not found', lead: `No public registry record was found for ${qrvid}.`, actions: [['Search Registry','/registry']] }));
    const record = payload.record || {};
    res.send(shell(`Registry • ${qrvid}`, 'QR-V registry record', `<main class="section"><div class="eyebrow">Registry Record</div><h1>${escapeHtml(qrvid)}</h1><section class="card"><pre class="mono">${escapeHtml(JSON.stringify(record, null, 2))}</pre></section><div class="actions"><a class="btn" href="/verify/${encodeURIComponent(qrvid)}">Verify Record</a></div></main>`));
  } catch (error) {
    res.status(503).send(page({ eyebrow: 'Registry', title: 'Registry unavailable', lead: error.message }));
  }
});

app.get('/api-reference', (_req, res) => res.send(shell('QR-V API Reference', 'QR-V API reference', `<main class="section"><div class="eyebrow">API Reference</div><h1>Canonical API node</h1><p class="lead">Base URL: <span class="mono">https://api.qrv.network/api/v1</span></p><section class="card"><table class="table"><tr><th>Method</th><th>Path</th><th>Purpose</th></tr><tr><td>GET</td><td class="mono">/verify/:qrvid</td><td>Public verification</td></tr><tr><td>GET</td><td class="mono">/records/:qrvid</td><td>Public-safe registry record</td></tr><tr><td>POST</td><td class="mono">/records</td><td>Authorized issuance</td></tr><tr><td>POST</td><td class="mono">/records/:qrvid/revoke</td><td>Authorized revocation</td></tr><tr><td>GET</td><td class="mono">/audit/:qrvid</td><td>Authorized audit history</td></tr></table></section></main>`)));

app.get('/status', async (_req, res) => {
  let health = { ok: false }, ready = { ready: false };
  try { health = (await apiRoot('/healthz')).payload; } catch {}
  try { ready = (await apiRoot('/readyz')).payload; } catch {}
  const apiOperational = health.ok === true;
  const apiReady = ready.ready === true || ready.ok === true;
  res.send(shell('QR-V Network Status', 'QR-V platform and API status', `<main class="section"><div class="eyebrow">Network Status</div><h1>Two-node production status</h1><section class="grid"><article class="card"><h2>qrv.network</h2><p class="ok">OPERATIONAL</p><p>Public platform node</p></article><article class="card"><h2>api.qrv.network</h2><p class="${apiOperational ? 'ok' : 'bad'}">${apiOperational ? 'OPERATIONAL' : 'UNAVAILABLE'}</p><p>API process health</p></article><article class="card"><h2>Registry</h2><p class="${apiReady ? 'ok' : 'bad'}">${apiReady ? 'READY' : 'NOT READY'}</p><p>PostgreSQL readiness through API node</p></article></section></main>`));
});

app.get('/issuer', (req, res) => {
  if (validSession(req)) return res.redirect(303, '/issuer/dashboard');
  const configured = Boolean(SESSION_SECRET && ISSUER_ACCESS_CODE && API_WRITE_KEY);
  res.status(configured ? 200 : 503).send(shell('QR-V Issuer Portal', 'Issuer access', `<main class="section"><div class="eyebrow">Issuer Portal</div><h1>Issue and manage QR-V records</h1><p class="lead">The Issuer Portal now lives directly under qrv.network. Authentication and write credentials remain server-side.</p>${configured ? `<section class="card"><form class="stack" method="post" action="/issuer/login"><label for="accessCode">Issuer access code</label><input id="accessCode" type="password" name="accessCode" required autocomplete="current-password"><button type="submit">Sign In</button></form></section>` : `<div class="notice">Issuer access is disabled until SESSION_SECRET, ISSUER_ACCESS_CODE, and QRV_PLATFORM_API_KEY are configured.</div>`}</main>`));
});

app.post('/issuer/login', (req, res) => {
  if (!SESSION_SECRET || !ISSUER_ACCESS_CODE || !API_WRITE_KEY) return res.status(503).send('Issuer access not configured');
  if (!safeEqual(req.body?.accessCode, ISSUER_ACCESS_CODE)) return res.status(401).send(shell('Access denied', 'Issuer access denied', `<main class="section"><h1>Access denied</h1><p class="lead">The issuer access code was not accepted.</p><a class="btn" href="/issuer">Try Again</a></main>`));
  const token = createSessionToken();
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/issuer; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(SESSION_TTL_MS/1000)}${NODE_ENV === 'production' ? '; Secure' : ''}`);
  return res.redirect(303, '/issuer/dashboard');
});

app.post('/issuer/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/issuer; HttpOnly; SameSite=Strict; Max-Age=0${NODE_ENV === 'production' ? '; Secure' : ''}`);
  res.redirect(303, '/issuer');
});

app.get('/issuer/dashboard', requireIssuer, async (_req, res) => {
  let records = [];
  let error = '';
  try {
    const result = await api('/records?limit=25', { write: true });
    records = result.payload.records || [];
    if (!result.response.ok) error = result.payload?.error?.message || 'Unable to load records';
  } catch (err) { error = err.message; }
  res.send(shell('Issuer Dashboard', 'QR-V issuer dashboard', `<main class="section"><div class="eyebrow">Issuer Dashboard</div><h1>Record operations</h1><div class="actions"><a class="btn" href="/issuer/records/new">Issue Record</a><form method="post" action="/issuer/logout"><button class="btn alt" type="submit">Sign Out</button></form></div>${error ? `<div class="notice">${escapeHtml(error)}</div>` : ''}<section class="card"><table class="table"><tr><th>QRVID</th><th>Type</th><th>Owner</th><th>Status</th><th></th></tr>${records.map((record) => `<tr><td class="mono">${escapeHtml(record.qrvid)}</td><td>${escapeHtml(record.recordType)}</td><td>${escapeHtml(record.owner || record.recipient || '')}</td><td><span class="status ${escapeHtml(record.state)}">${escapeHtml(record.state)}</span></td><td><a href="/issuer/records/${encodeURIComponent(record.qrvid)}">Open</a></td></tr>`).join('') || '<tr><td colspan="5">No records returned.</td></tr>'}</table></section></main>`));
});

app.get('/issuer/records/new', requireIssuer, (_req, res) => {
  res.send(shell('Issue QR-V Record', 'Create registry-backed record', `<main class="section"><div class="eyebrow">Issue Record</div><h1>Create a QR-V record</h1><section class="card"><form class="stack" method="post" action="/issuer/records"><label>Record type</label><select name="recordType"><option value="certificate">Certificate</option><option value="membership">Membership</option><option value="product">Product</option><option value="document">Document</option><option value="asset">Asset</option><option value="property">Property</option></select><label>Issuer</label><input name="issuer" required><label>Recipient / Owner</label><input name="owner"><label>Title</label><input name="title"><label>Issue date</label><input type="date" name="issueDate" value="${new Date().toISOString().slice(0,10)}"><label>Expiration date</label><input type="date" name="expirationDate"><button type="submit">Issue QR-V Record</button></form></section></main>`));
});

app.post('/issuer/records', requireIssuer, async (req, res) => {
  try {
    const body = {
      recordType: req.body.recordType,
      issuer: req.body.issuer,
      owner: req.body.owner || null,
      title: req.body.title || null,
      issueDate: req.body.issueDate || null,
      expirationDate: req.body.expirationDate || null
    };
    const { response, payload } = await api('/records', { method: 'POST', write: true, body });
    if (!response.ok) return res.status(response.status).send(shell('Issuance failed', 'QR-V issuance failed', `<main class="section"><h1>Issuance failed</h1><div class="notice">${escapeHtml(payload?.error?.message || 'The API rejected the record.')}</div><a class="btn" href="/issuer/records/new">Try Again</a></main>`));
    return res.redirect(303, `/issuer/records/${encodeURIComponent(payload.qrvid)}`);
  } catch (error) {
    return res.status(503).send(shell('Issuance unavailable', 'QR-V issuance unavailable', `<main class="section"><h1>Issuance unavailable</h1><div class="notice">${escapeHtml(error.message)}</div></main>`));
  }
});

app.get('/issuer/records/:qrvid', requireIssuer, async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}`);
    if (!response.ok) return res.status(response.status).send(page({ eyebrow:'Issuer', title:'Record not found', lead:qrvid }));
    const record = payload.record || {};
    res.send(shell(`Issuer • ${qrvid}`, 'Issuer record detail', `<main class="section"><div class="eyebrow">Issuer Record</div><h1>${escapeHtml(qrvid)}</h1><section class="grid"><article class="card"><h2>${escapeHtml(record.title || record.recordType || 'QR-V Record')}</h2><p>Issuer: ${escapeHtml(record.issuer || '')}</p><p>Owner: ${escapeHtml(record.owner || record.recipient || '')}</p><p><span class="status ${escapeHtml(record.state)}">${escapeHtml(record.state)}</span></p><p class="mono">${escapeHtml(record.hash || '')}</p></article><article class="card"><h2>Verification QR</h2><img alt="QR-V verification QR code" src="/qr/${encodeURIComponent(qrvid)}.svg" style="max-width:260px;width:100%;background:#fff;padding:10px;border-radius:14px"><p class="mono">${APP_ORIGIN}/verify/${escapeHtml(qrvid)}</p></article><article class="card"><h2>Lifecycle</h2><a class="btn" href="/verify/${encodeURIComponent(qrvid)}">Open Verification</a>${record.state === 'VERIFIED' ? `<form class="stack" method="post" action="/issuer/records/${encodeURIComponent(qrvid)}/revoke"><label>Revocation reason</label><input name="reason" placeholder="Credential withdrawn"><button class="danger" type="submit">Revoke Record</button></form>` : ''}</article></section></main>`));
  } catch (error) {
    res.status(503).send(page({ eyebrow:'Issuer', title:'Record unavailable', lead:error.message }));
  }
});

app.post('/issuer/records/:qrvid/revoke', requireIssuer, async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}/revoke`, { method:'POST', write:true, body:{ reason:req.body.reason || null } });
    if (!response.ok) return res.status(response.status).send(shell('Revocation failed','QR-V revocation failed',`<main class="section"><h1>Revocation failed</h1><div class="notice">${escapeHtml(payload?.error?.message || 'Unable to revoke record')}</div></main>`));
    return res.redirect(303, `/issuer/records/${encodeURIComponent(qrvid)}`);
  } catch (error) {
    return res.status(503).send(page({ eyebrow:'Issuer', title:'Revocation unavailable', lead:error.message }));
  }
});

app.get('/qr/:qrvid.svg', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  if (!/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/.test(qrvid)) return res.status(422).send('Invalid QRVID');
  try {
    const svg = await QRCode.toString(`${APP_ORIGIN}/verify/${encodeURIComponent(qrvid)}`, { type:'svg', errorCorrectionLevel:'M', margin:4 });
    res.type('image/svg+xml').send(svg);
  } catch {
    res.status(500).send('QR generation failed');
  }
});

app.get('/healthz', (_req,res) => res.json({ ok:true, status:'ok', service:SERVICE, version:VERSION, architecture:'two-node-consolidated', timestamp:new Date().toISOString() }));
app.get('/health', (_req,res) => res.json({ ok:true, status:'ok', service:SERVICE, version:VERSION, timestamp:new Date().toISOString() }));
app.get('/readyz', async (_req,res) => {
  try {
    const { response, payload } = await apiRoot('/readyz');
    return res.status(response.ok ? 200 : 503).json({ ok:response.ok, ready:response.ok, service:SERVICE, api:payload });
  } catch (error) {
    return res.status(503).json({ ok:false, ready:false, service:SERVICE, error:error.message });
  }
});
app.get('/version', (_req,res) => res.json({ ok:true, service:SERVICE, version:VERSION, startedAt:STARTED_AT, platform:APP_ORIGIN, api:API_BASE_URL }));

app.get('/robots.txt', (_req,res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /issuer/dashboard\nDisallow: /issuer/records\nSitemap: https://qrv.network/sitemap.xml\n'));
app.get('/sitemap.xml', (_req,res) => {
  const paths = ['/', '/protocol','/how-it-works','/verify','/registry','/use-cases','/developers','/api-reference','/docs','/pricing','/about','/security','/certificate-verification','/enterprise','/status'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${APP_ORIGIN}${path}</loc></url>`).join('')}</urlset>`);
});

app.get('/:qrvid(QRV-[A-Za-z0-9-]+)', (req,res) => res.redirect(308, `/verify/${encodeURIComponent(req.params.qrvid.toUpperCase())}`));
app.use((req,res) => res.status(404).send(page({ eyebrow:'QR-V', title:'Page not found', lead:`No route exists for ${req.path}.`, actions:[['Home','/']] })));
app.use((error,_req,res,_next) => { console.error(error); res.status(500).send(page({ eyebrow:'QR-V', title:'Platform error', lead:'The request could not be completed.' })); });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${SERVICE} ${VERSION} running on 0.0.0.0:${PORT}`);
  if (NODE_ENV === 'production' && (!SESSION_SECRET || !ISSUER_ACCESS_CODE || !API_WRITE_KEY)) console.warn('Issuer Portal is fail-closed until SESSION_SECRET, ISSUER_ACCESS_CODE, and QRV_PLATFORM_API_KEY are configured.');
});
