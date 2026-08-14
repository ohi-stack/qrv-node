import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { contactCardFromForm, normalizeQrvid, normalizeVerificationState, qrColor, renderHomePage, renderShell, safeEqual, safeHttpsUrl } = await import('../server.js');

test('verification state takes precedence over storage status', () => {
  assert.equal(normalizeVerificationState({ status: 'active', verificationState: 'VERIFIED' }), 'VERIFIED');
});

test('root compatibility accepts only canonical QRVIDs', () => {
  assert.equal(normalizeQrvid(' qrv-prod-cert-000001 '), 'QRV-PROD-CERT-000001');
  assert.doesNotMatch(normalizeQrvid('docs'), /^QRV-/);
});

test('constant-time comparison rejects mismatched lengths', () => {
  assert.equal(safeEqual('a', 'different'), false);
  assert.equal(safeEqual('identical', 'identical'), true);
});

test('contact-card form data stays in the versioned API contract', () => {
  const contact = contactCardFromForm({
    formattedName: 'Ada Lovelace', email: 'ada@example.com',
    publicFields: ['formattedName', 'emails'], website: 'https://qrv.network/',
  });
  assert.equal(contact.formattedName, 'Ada Lovelace');
  assert.equal(contact.emails[0].value, 'ada@example.com');
  assert.deepEqual(contact.publicFields, ['formattedName', 'emails']);
});

test('public-link and branded-color helpers fail closed', () => {
  assert.equal(safeHttpsUrl('javascript:alert(1)'), '');
  assert.equal(safeHttpsUrl('https://qrv.network/'), 'https://qrv.network/');
  assert.equal(qrColor('00aaff', '#000000'), '#00aaff');
  assert.equal(qrColor('not-a-color', '#000000'), '#000000');
});

test('production shell contains the hosted QR-V brand, navigation and accessibility controls', () => {
  const html = renderShell('Test', '<p>Body</p>');
  assert.match(html, /qrv-global-verification-logo\.png/);
  assert.match(html, /qrv-favicon\.png/);
  assert.match(html, /class="site-header"/);
  assert.match(html, /class="back-to-top"/);
  assert.match(html, /Platform/);
  assert.match(html, /Issuers/);
  assert.match(html, /Solutions/);
  assert.match(html, /Developers/);
  assert.match(html, /Standards/);
  assert.match(html, /Company/);
});

test('home page mirrors the production Sites surface and preserves the two-node topology', () => {
  const html = renderHomePage();
  assert.match(html, /Turn every<br>scan into proof/);
  assert.match(html, /Institutional trust/);
  assert.match(html, /Verified Contact Cards/);
  assert.match(html, /qrv\.network/);
  assert.match(html, /api\.qrv\.network/);
  assert.doesNotMatch(html, /verify\.qrv\.network/);
  assert.doesNotMatch(html, /registry\.qrv\.network/);
});
