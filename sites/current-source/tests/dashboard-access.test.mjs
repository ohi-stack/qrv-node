import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
const env = { ASSETS: { fetch: async () => new Response('', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
async function request(path, headers = {}, method = 'GET') { return worker.fetch(new Request(`http://localhost${path}`, { method, headers }), env, ctx); }
test('anonymous dashboard visitors are redirected to sign-in', async () => {
 for (const path of ['/admin', '/dashboard']) {
  const response = await request(path);
  assert.ok([302,303,307].includes(response.status));
  assert.match(response.headers.get('location'), /signin-with-chatgpt/);
 }
});
test('admin data and mutations deny anonymous and non-admin callers', async () => {
 for (const method of ['GET','PATCH']) {
  assert.equal((await request('/api/dashboard/admin', {}, method)).status, 401);
  assert.equal((await request('/api/dashboard/admin', { 'oai-authenticated-user-email': 'ordinary@example.com' }, method)).status, 403);
 }
});
test('signed-in user gets user dashboard but no admin data', async () => {
 const headers = { 'oai-authenticated-user-email': 'ordinary@example.com' };
 const response = await request('/dashboard', headers);
 assert.equal(response.status, 200);
 assert.match(await response.text(), /User dashboard/);
 const admin = await request('/admin', headers);
 assert.match(await admin.text(), /Administrator access required/);
});
test('authorized administrator receives the complete navigation and inquiry charts', async () => {
 const previous = process.env.QRV_ADMIN_EMAILS;
 process.env.QRV_ADMIN_EMAILS = 'admin@example.com';
 try {
  const response = await request('/admin', { 'oai-authenticated-user-email': 'admin@example.com' });
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const label of ['Overview', 'Records', 'Issue record', 'Certificates', 'QR codes', 'Revocations', 'Analytics', 'API keys', 'Team', 'Billing', 'Settings', 'Arrivals over time', 'Inquiry status', 'Issuer inquiries']) assert.ok(html.includes(label), `${label} missing from admin workspace`);
  assert.match(html, /Latest 200 inquiries only/);
  assert.match(html, /Loading inquiries/);
 } finally {
  if (previous === undefined) delete process.env.QRV_ADMIN_EMAILS; else process.env.QRV_ADMIN_EMAILS = previous;
 }
});
test('authorized administrator mutations still reject a different origin', async () => {
 const previous = process.env.QRV_ADMIN_EMAILS;
 process.env.QRV_ADMIN_EMAILS = 'admin@example.com';
 try {
  const response = await request('/api/dashboard/admin', { 'oai-authenticated-user-email': 'admin@example.com', origin: 'https://other.example' }, 'PATCH');
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error, 'Invalid origin');
 } finally {
  if (previous === undefined) delete process.env.QRV_ADMIN_EMAILS; else process.env.QRV_ADMIN_EMAILS = previous;
 }
});
