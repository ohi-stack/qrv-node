import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { normalizeQrvid, normalizeVerificationState, safeEqual } = await import('../server.js');

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
