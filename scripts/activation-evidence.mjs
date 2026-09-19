import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import QRCode from 'qrcode';

const confirmation = process.env.QRV_ACTIVATION_CONFIRM;
const platformBase = String(process.env.QRV_ACTIVATION_PLATFORM_URL || process.env.QRV_NODE_URL || 'https://qrv.network').replace(/\/$/, '');
const apiBase = String(process.env.QRV_ACTIVATION_API_URL || process.env.QRV_API_URL || 'https://api.qrv.network').replace(/\/$/, '');
const apiKey = String(process.env.QRV_ACTIVATION_API_KEY || process.env.QRV_WRITE_API_KEY || '');
const issuerId = String(process.env.QRV_ACTIVATION_ISSUER_ID || process.env.QRV_DEFAULT_ISSUER_ID || '');
const timeoutMs = Number(process.env.QRV_ACTIVATION_TIMEOUT_MS || 15000);
const runId = crypto.randomUUID();
const allowHttp = process.env.QRV_ACTIVATION_ALLOW_HTTP === 'true';
const schemaVersion = '2026-09-05-production-v6';

if (confirmation !== 'CREATE_AND_REVOKE_TEST_RECORD') {
  throw new Error('Set QRV_ACTIVATION_CONFIRM=CREATE_AND_REVOKE_TEST_RECORD to authorize the activation evidence record');
}
if (!apiKey || Buffer.byteLength(apiKey) < 32) throw new Error('QRV_ACTIVATION_API_KEY must contain at least 32 bytes');
if (!issuerId) throw new Error('QRV_ACTIVATION_ISSUER_ID is required');
for (const [name, value] of [['QRV_ACTIVATION_PLATFORM_URL', platformBase], ['QRV_ACTIVATION_API_URL', apiBase]]) {
  if (!allowHttp && !value.startsWith('https://')) throw new Error(`${name} must use HTTPS unless QRV_ACTIVATION_ALLOW_HTTP=true`);
}

const requestId = `${runId}:activation`;
const authHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
  'x-api-key': apiKey,
  'x-issuer-id': issuerId,
  'x-request-id': requestId,
};

async function request(base, path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${base}${path}`, { redirect: 'manual', ...options, signal: controller.signal });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text };
    }
    return { response, body, text };
  } finally {
    clearTimeout(timer);
  }
}

async function api(path, options = {}) {
  return request(apiBase, path, options);
}

async function platform(path, options = {}) {
  return request(platformBase, path, options);
}

async function getVerification(qrvid) {
  return platform(`/verify/${encodeURIComponent(qrvid)}`, { headers: { accept: 'text/html' } });
}

function stateInHtml(text, state) {
  const normalized = String(text || '').toUpperCase();
  return normalized.includes(`<H1>${state}</H1>`) && normalized.includes(`>${state}<`);
}

async function assertRealQr(qrvid) {
  const target = `${platformBase}/verify/${encodeURIComponent(qrvid)}`;
  const qr = await platform(`/qr/${encodeURIComponent(qrvid)}.svg`, { headers: { accept: 'image/svg+xml' } });
  assert.equal(qr.response.status, 200, 'QR endpoint must return HTTP 200');
  assert.match(qr.response.headers.get('content-type') || '', /image\/svg\+xml/);
  assert.equal(qr.response.headers.get('x-qr-v-qrvid'), qrvid);
  assert.equal(qr.response.headers.get('x-qr-v-target'), target);
  assert.match(qr.text, /^<svg\b/);
  assert.match(qr.text, /shape-rendering="crispEdges"/);

  // Independently reproduce the production encoder contract and compare the returned
  // image bytes. This proves the served SVG is a real QR encoding of the canonical URL.
  const expected = await QRCode.toString(target, { type: 'svg', errorCorrectionLevel: 'M', margin: 4 });
  assert.equal(qr.text.trim(), expected.trim(), 'served QR SVG must encode the canonical verification URL');
  return { status: qr.response.status, contentType: qr.response.headers.get('content-type'), target, bytes: Buffer.byteLength(qr.text) };
}

const evidence = {
  ok: false,
  runId,
  schemaVersion,
  platformBase,
  apiBase,
  checks: {},
};

const ready = await api('/readyz');
assert.equal(ready.response.status, 200, 'API readiness must be HTTP 200');
assert.equal(ready.body?.ready, true);
assert.equal(ready.body?.schemaVersion, schemaVersion);
assert.equal(ready.body?.signaturesRequired, true);
assert.match(ready.body?.signingKeyId || '', /^ed25519-[a-f0-9]{24}$/);
evidence.checks.apiReady = { status: ready.response.status, signingKeyId: ready.body.signingKeyId };

const unauthenticated = await api('/api/v1/registry/create', {
  method: 'POST',
  headers: { accept: 'application/json', 'content-type': 'application/json', 'x-request-id': `${runId}:unauthenticated` },
  body: JSON.stringify({ recordType: 'CERT', issuer: 'QR-V activation security test', title: `Unauthenticated ${runId}` }),
});
assert.equal(unauthenticated.response.status, 401, 'write endpoint must reject missing credentials');
evidence.checks.unauthenticatedWrite = { status: unauthenticated.response.status };

const created = await api('/api/v1/registry/create', {
  method: 'POST',
  headers: authHeaders,
  body: JSON.stringify({
    recordType: 'CERT',
    issuer: 'QR-V activation evidence',
    subject: 'Release evidence record',
    title: `Activation evidence ${runId}`,
    visibility: 'public',
    metadata: { activationEvidence: true, runId },
  }),
});
assert.equal(created.response.status, 201, 'registry create must persist the evidence record');
const qrvid = created.body?.qrvid;
assert.match(qrvid || '', /^QRV-/);
assert.equal(created.body?.signingKeyId, ready.body.signingKeyId);
evidence.qrvid = qrvid;
evidence.checks.postgresRecord = {
  status: created.response.status,
  qrvid,
  signingKeyId: created.body.signingKeyId,
  hash: created.body.hash,
};

const qr = await assertRealQr(qrvid);
evidence.checks.realQr = qr;

const verified = await api(`/api/v1/verify/${encodeURIComponent(qrvid)}`);
assert.equal(verified.response.status, 200);
assert.equal(verified.body?.verificationState, 'VERIFIED');
assert.equal(verified.body?.qrvid, qrvid);
assert.equal(verified.body?.integrity?.hashValid, true);
assert.equal(verified.body?.integrity?.signatureValid, true);
assert.equal(verified.body?.integrity?.signingKeyId, ready.body.signingKeyId);
const platformVerified = await getVerification(qrvid);
assert.equal(platformVerified.response.status, 200);
assert(stateInHtml(platformVerified.text, 'VERIFIED'), 'scanning/opening the QR target must render VERIFIED');
evidence.checks.verifiedScan = {
  apiStatus: verified.body.verificationState,
  platformHttpStatus: platformVerified.response.status,
  platformState: 'VERIFIED',
  sameQrvid: platformVerified.text.includes(qrvid),
};

const wrongIssuer = await api(`/api/v1/registry/${encodeURIComponent(qrvid)}/revoke`, {
  method: 'POST',
  headers: { ...authHeaders, 'x-issuer-id': `${issuerId}-wrong-scope` },
  body: JSON.stringify({ reason: 'Security scope test' }),
});
assert.equal(wrongIssuer.response.status, 403, 'issuer scope must prevent cross-issuer mutation');
evidence.checks.issuerScope = { status: wrongIssuer.response.status, error: wrongIssuer.body?.error?.code || null };

const revoked = await api(`/api/v1/registry/${encodeURIComponent(qrvid)}/revoke`, {
  method: 'POST',
  headers: authHeaders,
  body: JSON.stringify({ reason: `Activation evidence completed ${runId}` }),
});
assert.equal(revoked.response.status, 200);
assert.equal(revoked.body?.status, 'REVOKED');
assert.equal(revoked.body?.qrvid, qrvid);
const revokedVerify = await api(`/api/v1/verify/${encodeURIComponent(qrvid)}`);
assert.equal(revokedVerify.response.status, 200);
assert.equal(revokedVerify.body?.verificationState, 'REVOKED');
assert.equal(revokedVerify.body?.qrvid, qrvid);
const platformRevoked = await getVerification(qrvid);
assert.equal(platformRevoked.response.status, 200);
assert(stateInHtml(platformRevoked.text, 'REVOKED'), 'scanning the same QR after revoke must render REVOKED');
evidence.checks.revokedScan = {
  apiStatus: revokedVerify.body.verificationState,
  platformHttpStatus: platformRevoked.response.status,
  platformState: 'REVOKED',
  sameQrvid: platformRevoked.text.includes(qrvid),
};

const audit = await api(`/api/v1/registry/${encodeURIComponent(qrvid)}/audit`, { headers: authHeaders });
assert.equal(audit.response.status, 200);
const eventTypes = [...new Set((audit.body?.events || []).map((event) => event.event_type))];
for (const eventType of ['registry_create', 'registry_verify', 'registry_revoke']) {
  assert(eventTypes.includes(eventType), `audit must contain ${eventType}`);
}
evidence.checks.audit = { status: audit.response.status, eventTypes };
evidence.checks.recordIdentity = {
  createQrvid: qrvid,
  verifyQrvid: verified.body.qrvid,
  revokeQrvid: revoked.body.qrvid,
  postRevokeVerifyQrvid: revokedVerify.body.qrvid,
  consistent: [verified.body.qrvid, revoked.body.qrvid, revokedVerify.body.qrvid].every((value) => value === qrvid),
};
assert.equal(evidence.checks.recordIdentity.consistent, true);

evidence.ok = true;
console.log(JSON.stringify(evidence, null, 2));
