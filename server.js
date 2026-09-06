import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 240, standardHeaders: true, legacyHeaders: false }));

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT || 3000);
const VERSION = process.env.APP_VERSION || '2.0.0';
const SERVICE = 'qrv-platform';
const APP_ORIGIN = (process.env.QRV_PLATFORM_ORIGIN || 'https://qrv.network').replace(/\/$/, '');
const API_BASE_URL = (process.env.QRV_API_BASE_URL || 'https://api.qrv.network/api/v1').replace(/\/$/, '');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, '');
const API_WRITE_KEY = process.env.QRV_PLATFORM_API_KEY || process.env.QRV_API_KEY || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const ISSUER_ACCESS_CODE = process.env.ISSUER_ACCESS_CODE || '';
const SESSION_COOKIE = 'qrv_issuer_session';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 43_200_000);
const STARTED_AT = new Date().toISOString();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

const legacyHostRoutes = {
  'verify.qrv.network': '/verify',
  'issuer.qrv.network': '/issuer',
  'registry.qrv.network': '/registry',
  'explorer.qrv.network': '/explorer',
  'docs.qrv.network': '/docs',
  'developers.qrv.network': '/developers',
  'status.qrv.network': '/status',
  'store.qrv.network': '/store',
  'wallet.qrv.network': '/wallet',
  'admin.qrv.network': '/admin'
};

app.use((req, res, next) => {
  const host = String(req.hostname || '').toLowerCase();
  if (host === 'www.qrv.network') return res.redirect(308, `${APP_ORIGIN}${req.originalUrl}`);
  const prefix = legacyHostRoutes[host];
  if (!prefix) return next();
  const suffix = req.originalUrl === '/' ? '' : req.originalUrl;
  return res.redirect(308, `${APP_ORIGIN}${prefix}${suffix}`);
});

function parseCookies(req) {
  const cookies = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(rest.join('='));
  }
  return cookies;
}

const sign = (value) => SESSION_SECRET ? crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url') : '';
const safeEqual = (left, right) => {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
};

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'issuer', exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function validSession(req) {
  if (!SESSION_SECRET) return false;
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  if (!safeEqual(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.role === 'issuer' && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

function requireIssuer(req, res, next) {
  if (!validSession(req)) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Issuer authentication required' } });
  next();
}

function sameOriginWrite(req, res, next) {
  const origin = req.get('origin');
  if (!origin) return next();
  const allowed = new Set([APP_ORIGIN, 'http://127.0.0.1:5173', 'http://localhost:5173']);
  if (!allowed.has(origin)) return res.status(403).json({ ok: false, error: { code: 'ORIGIN_REJECTED', message: 'Cross-origin write rejected' } });
  next();
}

async function api(pathname, options = {}) {
  const headers = { accept: 'application/json', ...(options.headers || {}) };
  if (options.write) {
    if (!API_WRITE_KEY) throw new Error('QRV_PLATFORM_API_KEY is not configured');
    headers['x-api-key'] = API_WRITE_KEY;
  }
  if (options.body && !headers['content-type']) headers['content-type'] = 'application/json';
  const response = await fetch(`${API_BASE_URL}${pathname}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function apiRoot(pathname) {
  const response = await fetch(`${API_ORIGIN}${pathname}`, { headers: { accept: 'application/json' } });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

// Browser-facing platform adapter. The React app never receives server secrets.
app.get('/platform/verify/:qrvid', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/verify/${encodeURIComponent(qrvid)}`);
    const state = String(payload.state || payload.status || (response.status === 404 ? 'NOT_FOUND' : response.ok ? 'VERIFIED' : 'UNAVAILABLE')).toUpperCase();
    const record = payload.record || payload;
    res.status(response.status === 404 ? 404 : response.ok ? 200 : response.status).json({ ok: response.ok, qrvid, state, record });
  } catch {
    res.status(503).json({ ok: false, qrvid, state: 'UNAVAILABLE', error: { code: 'API_UNAVAILABLE', message: 'Canonical verification API unavailable' } });
  }
});

app.get('/platform/registry/:qrvid', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}`);
    if (!response.ok) return res.status(response.status).json(payload);
    res.json({ ok: true, record: payload.record || payload });
  } catch {
    res.status(503).json({ ok: false, error: { code: 'REGISTRY_UNAVAILABLE', message: 'Canonical registry unavailable' } });
  }
});

app.get('/platform/status', async (_req, res) => {
  let health = {}, readiness = {};
  try { health = (await apiRoot('/healthz')).payload; } catch {}
  try { readiness = (await apiRoot('/readyz')).payload; } catch {}
  res.json({ platform: true, api: Boolean(health.ok), registry: Boolean(readiness.ready || readiness.ok), apiHealth: health, apiReadiness: readiness });
});

app.get('/platform/issuer/session', (req, res) => {
  const configured = Boolean(SESSION_SECRET && ISSUER_ACCESS_CODE && API_WRITE_KEY);
  res.status(configured ? 200 : 503).json({ configured, authenticated: configured && validSession(req) });
});

app.post('/platform/issuer/login', sameOriginWrite, (req, res) => {
  if (!SESSION_SECRET || !ISSUER_ACCESS_CODE || !API_WRITE_KEY) return res.status(503).json({ ok: false, message: 'Issuer access not configured' });
  if (!safeEqual(req.body?.accessCode, ISSUER_ACCESS_CODE)) return res.status(401).json({ ok: false, message: 'Access denied' });
  const token = createSessionToken();
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${NODE_ENV === 'production' ? '; Secure' : ''}`);
  res.json({ ok: true });
});

app.post('/platform/issuer/logout', sameOriginWrite, (req, res) => {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${NODE_ENV === 'production' ? '; Secure' : ''}`);
  res.json({ ok: true });
});

app.get('/platform/issuer/records', requireIssuer, async (_req, res) => {
  try {
    const { response, payload } = await api('/records?limit=50', { write: true });
    res.status(response.status).json(response.ok ? { ok: true, records: payload.records || [] } : payload);
  } catch {
    res.status(503).json({ ok: false, message: 'Issuer records unavailable' });
  }
});

app.post('/platform/issuer/records', sameOriginWrite, requireIssuer, async (req, res) => {
  const body = {
    recordType: req.body?.recordType,
    issuer: req.body?.issuer,
    owner: req.body?.owner || null,
    title: req.body?.title || null,
    expirationDate: req.body?.expirationDate || null
  };
  if (!body.recordType || !body.issuer) return res.status(422).json({ ok: false, message: 'recordType and issuer are required' });
  try {
    const { response, payload } = await api('/records', { method: 'POST', write: true, body });
    res.status(response.status).json(payload);
  } catch {
    res.status(503).json({ ok: false, message: 'Issuance unavailable' });
  }
});

app.get('/platform/issuer/records/:qrvid', requireIssuer, async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}`, { write: true });
    res.status(response.status).json(response.ok ? { ok: true, record: payload.record || payload } : payload);
  } catch {
    res.status(503).json({ ok: false, message: 'Record unavailable' });
  }
});

app.post('/platform/issuer/records/:qrvid/revoke', sameOriginWrite, requireIssuer, async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  try {
    const { response, payload } = await api(`/records/${encodeURIComponent(qrvid)}/revoke`, { method: 'POST', write: true, body: { reason: req.body?.reason || null } });
    res.status(response.status).json(payload);
  } catch {
    res.status(503).json({ ok: false, message: 'Revocation unavailable' });
  }
});

app.get('/qr/:qrvid.svg', async (req, res) => {
  const qrvid = String(req.params.qrvid || '').trim().toUpperCase();
  if (!/^QRV-[A-Z0-9][A-Z0-9-]{2,127}$/.test(qrvid)) return res.status(422).send('Invalid QRVID');
  try {
    const svg = await QRCode.toString(`${APP_ORIGIN}/verify/${encodeURIComponent(qrvid)}`, { type: 'svg', errorCorrectionLevel: 'M', margin: 4 });
    res.type('image/svg+xml').send(svg);
  } catch {
    res.status(500).send('QR generation failed');
  }
});

// Compatibility gateway. Authoritative API behavior remains on api.qrv.network.
app.all('/api/v1/*', async (req, res) => {
  const target = `${API_ORIGIN}${req.originalUrl}`;
  try {
    const method = req.method.toUpperCase();
    const headers = {
      accept: req.headers.accept || 'application/json',
      'content-type': req.headers['content-type'] || 'application/json',
      'x-request-id': String(req.headers['x-request-id'] || crypto.randomUUID())
    };
    const options = { method, headers, redirect: 'manual' };
    if (!['GET', 'HEAD'].includes(method) && req.body && Object.keys(req.body).length) options.body = JSON.stringify(req.body);
    const upstream = await fetch(target, options);
    const body = await upstream.arrayBuffer();
    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.setHeader('cache-control', upstream.headers.get('cache-control') || 'no-store');
    return res.send(Buffer.from(body));
  } catch {
    return res.status(503).json({ ok: false, state: 'UNAVAILABLE', error: { code: 'API_UNAVAILABLE', message: 'Canonical API unavailable' }, timestamp: new Date().toISOString() });
  }
});

app.get('/healthz', (_req, res) => res.json({ ok: true, status: 'ok', service: SERVICE, version: VERSION, ui: 'react-vite', architecture: 'two-node-consolidated', timestamp: new Date().toISOString() }));
app.get('/health', (_req, res) => res.json({ ok: true, status: 'ok', service: SERVICE, version: VERSION, ui: 'react-vite', timestamp: new Date().toISOString() }));
app.get('/readyz', async (_req, res) => {
  try {
    const { response, payload } = await apiRoot('/readyz');
    res.status(response.ok ? 200 : 503).json({ ok: response.ok, ready: response.ok, service: SERVICE, uiBuilt: existsSync(INDEX_FILE), api: payload });
  } catch (error) {
    res.status(503).json({ ok: false, ready: false, service: SERVICE, uiBuilt: existsSync(INDEX_FILE), error: error.message });
  }
});
app.get('/version', (_req, res) => res.json({ ok: true, service: SERVICE, version: VERSION, ui: 'react-vite', startedAt: STARTED_AT, platform: APP_ORIGIN, api: API_BASE_URL }));

app.get('/robots.txt', (_req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /issuer/dashboard\nDisallow: /issuer/records\nDisallow: /admin\nSitemap: https://qrv.network/sitemap.xml\n'));
app.get('/sitemap.xml', (_req, res) => {
  const pages = ['/', '/network', '/protocol', '/how-it-works', '/verify', '/registry', '/use-cases', '/developers', '/api-reference', '/docs', '/pricing', '/about', '/security', '/certificate-verification', '/enterprise', '/status'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${APP_ORIGIN}${page}</loc></url>`).join('')}</urlset>`);
});

if (existsSync(DIST_DIR)) app.use(express.static(DIST_DIR, { index: false, maxAge: NODE_ENV === 'production' ? '1h' : 0 }));

app.get('/:qrvid(QRV-[A-Za-z0-9-]+)', (req, res) => res.redirect(308, `/verify/${encodeURIComponent(req.params.qrvid.toUpperCase())}`));

app.get('*', (req, res) => {
  if (!existsSync(INDEX_FILE)) return res.status(503).json({ ok: false, error: { code: 'UI_NOT_BUILT', message: 'React/Vite production bundle is missing. Run npm run build before npm start.' } });
  res.sendFile(INDEX_FILE);
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ ok: false, error: { code: 'PLATFORM_ERROR', message: 'The request could not be completed.' } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${SERVICE} ${VERSION} (React/Vite) running on 0.0.0.0:${PORT}`);
});
