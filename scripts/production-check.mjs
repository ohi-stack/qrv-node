import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const server = await readFile(new URL('../server.js', import.meta.url), 'utf8');
const env = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

for (const route of [
  '/verify/:qrvid', '/registry/:qrvid', '/issuer/login', '/issuer/dashboard',
  '/issuer/records', '/issuer/records/new', '/issuer/records/:qrvid',
  '/healthz', '/readyz', '/version', '/status', '/sitemap.xml',
]) {
  assert.ok(server.includes(route), `required production route is missing: ${route}`);
}

for (const control of [
  'helmet(', 'contentSecurityPolicy', 'SameSite=Strict', 'HttpOnly', 'verifyCsrf',
  'loginRateLimiter', 'AbortController', 'Cache-Control', 'X-Request-ID',
  'verificationState:"UNAVAILABLE"',
]) {
  assert.ok(server.includes(control), `required production control is missing: ${control}`);
}

for (const key of [
  'QRV_PUBLIC_BASE_URL', 'QRV_API_BASE_URL', 'QRV_WRITE_API_KEY', 'QRV_ISSUER_ID',
  'ISSUER_PORTAL_USERNAME', 'ISSUER_PORTAL_PASSWORD_SCRYPT', 'ISSUER_SESSION_SECRET',
  'QRV_API_TIMEOUT_MS', 'PUBLIC_RATE_LIMIT_MAX', 'LOGIN_RATE_LIMIT_MAX',
]) {
  assert.match(env, new RegExp(`^${key}=`, 'm'), `.env.example is missing ${key}`);
}

assert.equal(packageJson.engines.node, '>=20');
assert.doesNotMatch(server, /verify\.qrv\.network\//, 'canonical links must not depend on the legacy verifier host');
assert.doesNotMatch(server, /registry\.qrv\.network\//, 'canonical links must not depend on the legacy registry host');

console.log(JSON.stringify({ ok: true, service: 'qrv-node', routes: 12, architecture: 'two-node' }));
