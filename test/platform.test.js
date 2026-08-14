import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { contactCardFromForm, normalizeQrvid, normalizeVerificationState, qrColor, safeEqual, safeHttpsUrl } = await import('../server.js');

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
